/**
 * CodexHub：插件的宿主侧核心。
 *
 * 职责：
 *   1. 维护与 codex app-server 的连接（守护进程优先、stdio 兜底、断线重连）；
 *   2. 把协议通知归一化成插件自己的事件（经 EventBus 走 SSE）；
 *   3. 线程列表 / 历史 / 项目聚合等只读查询；
 *   4. 审批与用户输入的挂起、超时与跨端解决（M2 接 UI，M0 先有服务端能力）。
 *
 * 刻意不 import 任何 @deepseek-ai/* 运行时值：宿主服务全部由 index.js 注入。
 */

import {resolveSkillInputs} from './skills.js'
import { ThreadTitles } from './thread-titles.js'
import { basename } from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'
import { JsonRpcClient, JsonRpcError, SKIP_RESPONSE } from './jsonrpc.js'
import { openCodexTransport, resolveCodexHome } from './transport/index.js'

const CLIENT_INFO = { name: 'dsh-codex-cli', title: 'DSH Codex Console', version: '0.1.0' }
const INITIALIZE_CAPABILITIES = { experimentalApi: true, requestAttestation: false }

/** 带稳定错误码的 Hub 错误，路由层按 code 转成 RPC 错误。 */
export class HubError extends Error {
  constructor(code, message, details = {}) {
    super(message)
    this.name = 'HubError'
    this.code = code
    this.details = details
  }
}

export class CodexHub {
  /** @type {object | null} */
  #transport = null
  /** @type {JsonRpcClient | null} */
  #rpc = null
  /** @type {{ promise: Promise<void>, resolve: Function } | null} */
  #closed = null
  #stopped = true
  #loop = null
  #offMessage = null
  #offClose = null
  #titles = null
  /** @type {Map<string, number>} threadId -> 订阅引用计数 */
  #subscriptions = new Map()
  /** 本连接通过 thread/start 创建、已加载的线程：resume 会因没有 rollout 而失败，跳过。 */
  #owned = new Set()
  /** @type {{ at: number, value: object[] } | null} */
  #projectsCache = null
  /** @type {Map<string, object>} */
  #pendingApprovals = new Map()
  /** @type {Map<string, object>} */
  #threadSettings = new Map()
  /** @type {{ at: number, value: object } | null} */
  #rateLimitsCache = null
  /** @type {object} */
  #state = {
    phase: 'idle',
    kind: null,
    socketPath: null,
    codexVersion: null,
    error: null,
    connectedAt: null,
    reconnects: 0,
  }

  constructor({ config, logger, bus, openTransport = openCodexTransport }) {
    this.config = config
    this.logger = logger
    this.bus = bus
    this.openTransport = openTransport
  }

  /** 启动连接循环（不阻塞调用方；失败在后台重试）。 */
  start() {
    if (this.#loop !== null) return
    this.#stopped = false
    this.#loop = this.#run().catch((cause) => {
      this.logger?.error?.(`[codex-cli] 连接循环异常退出：${describe(cause)}`)
      this.#setState({ phase: 'error', error: describe(cause) })
    })
  }

  /** 停止连接循环并释放传输。 */
  async stop() {
    this.#stopped = true
    this.#closed?.resolve()
    this.#teardown()
    this.#setState({ phase: 'stopped' })
    await this.#loop?.catch(() => {})
    this.#loop = null
  }

  /** 当前状态快照（含配置与订阅计数），供 status 端点与 SSE 使用。 */
  status() {
    return {
      ...this.#state,
      config: {
        transport: this.config.transport,
        codexHome: resolveCodexHome(this.config),
        approvalTimeoutMs: this.config.approvalTimeoutMs,
      },
      subscriptions: [...this.#subscriptions.keys()],
      pendingApprovals: this.#pendingApprovals.size,
      seq: this.bus.seq,
    }
  }

  // ── 连接循环 ────────────────────────────────────────────────────────────

  async #run() {
    let attempt = 0
    while (!this.#stopped) {
      try {
        await this.#connect()
        attempt = 0
        await this.#closed?.promise
      } catch (cause) {
        this.#setState({ phase: 'error', error: describe(cause) })
        this.logger?.warn?.(`[codex-cli] 连接失败：${describe(cause)}`)
      }
      this.#teardown()
      if (this.#stopped) break
      attempt += 1
      const delay = Math.min(
        this.config.reconnectBaseMs * 2 ** Math.min(attempt - 1, 5),
        this.config.reconnectMaxMs,
      )
      this.#setState({ phase: 'connecting', error: this.#state.error, reconnects: this.#state.reconnects + 1 })
      await sleep(delay)
    }
    this.#setState({ phase: 'stopped' })
  }

  async #connect() {
    this.#setState({ phase: 'connecting', error: null })
    const opened = await this.openTransport({ config: this.config, logger: this.logger })
    const rpc = new JsonRpcClient({
      send: (message) => opened.transport.send(message),
      logger: this.logger,
    })
    this.#offMessage = opened.transport.onMessage((message) => rpc.handleMessage(message))
    this.#offClose = opened.transport.onClose((info) => {
      this.logger?.warn?.(`[codex-cli] 连接断开 code=${info.code ?? '-'} reason=${info.reason ?? '-'}`)
      this.#closed?.resolve()
    })
    this.#titles = new ThreadTitles({
      rpc, codexHome: resolveCodexHome(this.config), logger: this.logger,
      onTitle: (threadId, name) => {
        this.#invalidateProjects()
        this.bus.publish('thread/updated', { name }, { threadId })
      },
    })
    rpc.onNotification((method, params) => this.#onNotification(method, params))
    rpc.onServerRequest((request) => this.#onServerRequest(request))

    const closed = Promise.withResolvers()
    this.#closed = { promise: closed.promise, resolve: closed.resolve }

    const initialized = await rpc.request(
      'initialize',
      { clientInfo: CLIENT_INFO, capabilities: INITIALIZE_CAPABILITIES },
      { timeoutMs: 20000 },
    )
    rpc.notify('initialized')

    this.#transport = opened.transport
    this.#rpc = rpc
    this.#setState({
      phase: 'ready',
      kind: opened.kind,
      socketPath: opened.socketPath,
      codexVersion: parseCodexVersion(initialized?.userAgent),
      error: null,
      connectedAt: Date.now(),
    })
    this.logger?.info?.(
      `[codex-cli] 已连接 ${opened.kind}${opened.note === undefined ? '' : `（${opened.note}）`}：codex ${this.#state.codexVersion ?? '?'}`,
    )

    // 重连后恢复订阅
    for (const threadId of this.#subscriptions.keys()) {
      try {
        await resumeThread(rpc, threadId, resolveCodexHome(this.config))
      } catch (cause) {
        this.logger?.warn?.(`[codex-cli] 恢复订阅失败 ${threadId}：${describe(cause)}`)
      }
    }
  }

  #teardown() {
    this.#titles?.dispose()
    this.#titles = null
    this.#offMessage?.()
    this.#offClose?.()
    this.#offMessage = null
    this.#offClose = null
    this.#rpc?.close('连接已断开')
    this.#transport?.close()
    this.#rpc = null
    this.#transport = null
    this.#closed = null
    this.#owned.clear()
    this.#clearApprovals('disconnected')
  }

  #setState(patch) {
    this.#state = { ...this.#state, ...patch }
    this.bus.publish('connection', this.status())
  }

  #invalidateProjects() {
    this.#projectsCache = null
  }

  #requireRpc() {
    if (this.#rpc === null) {
      throw new HubError('codex-cli/not-connected', 'Codex app-server 未连接', {
        phase: this.#state.phase,
        error: this.#state.error,
      })
    }
    return this.#rpc
  }

  // ── 只读查询 ────────────────────────────────────────────────────────────

  /** 线程列表（分页）。 */
  async listThreads(params = {}) {
    const rpc = this.#requireRpc()
    const request = {
      limit: clampInt(params.limit ?? this.config.threadPageSize, 1, 200),
      sortKey: params.sortKey ?? 'updated_at',
      sortDirection: params.sortDirection ?? 'desc',
    }
    if (typeof params.cursor === 'string' && params.cursor !== '') request.cursor = params.cursor
    if (typeof params.search === 'string' && params.search.trim() !== '') request.searchTerm = params.search.trim()
    if (typeof params.cwd === 'string' && params.cwd !== '') request.cwd = params.cwd
    if (params.archived === true) request.archived = true
    request.modelProviders = ['openai']
    const result = await rpc.request('thread/list', request, { timeoutMs: 30000 })
    return {
      data: (result?.data ?? []).map(compactThread),
      nextCursor: result?.nextCursor ?? null,
    }
  }

  /** 线程元数据 + 最近一页回合（时间正序）。 */
  async getThread(threadId, params = {}) {
    if (typeof threadId !== 'string' || threadId === '') {
      throw new HubError('codex-cli/bad-request', 'threadId 不能为空')
    }
    const rpc = this.#requireRpc()
    const hasCursor = params.cursor !== undefined && params.cursor !== null
    // 翻页取更早的回合时不必再读一次线程元数据。
    const read = hasCursor
      ? null
      : await readThreadWithReload(rpc, 'thread/read', { threadId, includeTurns: false }, 20000)
    const request = {
      threadId,
      limit: clampInt(params.limit ?? 20, 1, 100),
      sortDirection: 'desc',
      itemsView: 'full',
    }
    if (hasCursor) request.cursor = params.cursor
    let turns
    try {
      turns = await readThreadWithReload(rpc, 'thread/turns/list', request, 30000)
    } catch (cause) {
      // 临时线程没有 rollout，不支持分页历史；退回一次全量 read（该接口对临时线程仍可用）。
      if (cause instanceof JsonRpcError && /ephemeral|not materialized|list_turns is not supported|no rollout/i.test(cause.message)) {
        try {
          const full = await rpc.request('thread/read', { threadId, includeTurns: true }, { timeoutMs: 30000 })
          return {
            thread: compactThread(full?.thread ?? read?.thread ?? { id: threadId }),
            turns: (full?.thread?.turns ?? []).map((turn) => ({
              ...turn,
              items: Array.isArray(turn?.items) ? turn.items.map(compactItem) : [],
            })),
            nextCursor: null,
          }
        } catch {
          // 临时/未落盘线程两种历史接口都不支持：返回元数据，历史交给实时事件。
          return {
            thread: compactThread(read?.thread ?? { id: threadId }),
            turns: [],
            nextCursor: null,
          }
        }
      }
      throw cause
    }
    const data = Array.isArray(turns?.data) ? [...turns.data] : []
    data.reverse()
    return {
      thread: read === null ? null : compactThread(read.thread ?? { id: threadId }),
      turns: data.map((turn) => ({
        ...turn,
        items: Array.isArray(turn?.items) ? turn.items.map(compactItem) : [],
      })),
      nextCursor: turns?.nextCursor ?? null,
    }
  }

  /** 项目聚合：按 cwd 分组，带最近活动、模型、git 信息。 */
  async projects({ refresh = false } = {}) {
    const provider = 'openai'
    const now = Date.now()
    if (
      !refresh && this.#projectsCache?.provider === provider &&
      this.#projectsCache !== null &&
      now - this.#projectsCache.at < this.config.projectCacheTtlMs
    ) {
      return this.#projectsCache.value
    }
    const rpc = this.#requireRpc()
    const all = []
    let cursor = null
    for (let page = 0; page < this.config.projectScanPages; page += 1) {
      const request = { limit: 100, sortKey: 'updated_at', sortDirection: 'desc', modelProviders: [provider] }
      if (cursor !== null) request.cursor = cursor
      const result = await rpc.request('thread/list', request, { timeoutMs: 30000 })
      all.push(...(result?.data ?? []))
      cursor = result?.nextCursor ?? null
      if (cursor === null) break
    }
    const value = aggregateProjects(all)
    this.#projectsCache = { at: now, value, provider }
    return value
  }

  /** 可选模型列表。 */
  /** 账户额度：主/次窗口使用率、剩余重置次数。 */
  async rateLimits() {
    if (this.#rateLimitsCache !== null && Date.now() - this.#rateLimitsCache.at < 30000) {
      return this.#rateLimitsCache.value
    }
    const rpc = this.#requireRpc()
    const result = await rpc.request('account/rateLimits/read', {}, { timeoutMs: 15000 })
    const snapshot = result?.rateLimits ?? null
    const value = {
      planType: snapshot?.planType ?? null,
      primary: compactWindow(snapshot?.primary),
      secondary: compactWindow(snapshot?.secondary),
      credits: snapshot?.credits
        ? {
            hasCredits: snapshot.credits.hasCredits === true,
            unlimited: snapshot.credits.unlimited === true,
            balance: snapshot.credits.balance ?? null,
          }
        : null,
      resetCredits: Number(result?.rateLimitResetCredits?.availableCount ?? 0),
      ordinaryUsageAllowed: result?.ordinaryUsageAllowed ?? null,
    }
    this.#rateLimitsCache = { at: Date.now(), value }
    return value
  }

  async skills(params = {}) {
    const cwd = requireString(params.cwd,'cwd')
    const rpc = this.#requireRpc()
    const result = await rpc.request('skills/list',{cwds:[cwd],forceReload:params.forceReload===true},{timeoutMs:20000})
    const rows = result?.data ?? []
    const row = rows.find(row=>row.cwd===cwd)
    if(!row) throw new HubError('codex-cli/skills-unavailable','未取得当前工作区的技能列表')
    return {cwd,skills:row.skills??[],errors:row.errors??[]}
  }
  async skillInputs(params) {
    const text = typeof params.text==='string'?params.text:''
    if(!text.includes('$')&&!(params.skills?.length))return []
    const cwd = params.cwd || (await this.getThread(params.threadId,{limit:1})).thread?.cwd
    const {skills} = await this.skills({cwd})
    return resolveSkillInputs(text,params.skills??[],skills)
  }
  async models() {
    const rpc = this.#requireRpc()
    const result = await rpc.request('model/list', {}, { timeoutMs: 20000 })
    return (result?.data ?? []).map((model) => ({
      id: model.id ?? model.model,
      displayName: model.displayName ?? model.model ?? model.id,
      description: model.description ?? null,
      defaultReasoningEffort: model.defaultReasoningEffort ?? null,
      supportedReasoningEfforts: Array.isArray(model.supportedReasoningEfforts)
        ? model.supportedReasoningEfforts.map((entry) => ({
            reasoningEffort: entry.reasoningEffort,
            description: entry.description ?? null,
          }))
        : [],
    }))
  }

  /** 配置快照（只读）。 */
  async configRead() {
    const rpc = this.#requireRpc()
    const result = await rpc.request('config/read', { includeLayers: false }, { timeoutMs: 20000 })
    return result?.config ?? null
  }

  // ── 对话 ────────────────────────────────────────────────────────────────

  /** 新线程：thread/start，返回紧凑 DTO 并纳入订阅。 */
  async newThread(params = {}) {
    const rpc = this.#requireRpc()
    const request = { modelProvider: 'openai' }
    if (typeof params.cwd === 'string' && params.cwd !== '') request.cwd = params.cwd
    if (typeof params.model === 'string' && params.model !== '') request.model = params.model
    if (typeof params.effort === 'string' && params.effort !== '') request.effort = params.effort
    if (params.approvalPolicy !== undefined && params.approvalPolicy !== null) request.approvalPolicy = params.approvalPolicy
    if (typeof params.sandbox === 'string' && params.sandbox !== '') request.sandbox = params.sandbox
    if (params.ephemeral === true) request.ephemeral = true
    const result = await rpc.request('thread/start', request, { timeoutMs: 30000 })
    const thread = compactThread({ ...result?.thread, model: result?.model ?? result?.thread?.model, reasoningEffort: result?.reasoningEffort ?? result?.thread?.reasoningEffort })
    if (thread?.id) {
      this.#owned.add(thread.id)
      this.#invalidateProjects()
    }
    return thread
  }

  /** 发一条用户消息，开一个新回合。 */
  async startTurn(params = {}) {
    const threadId = requireString(params.threadId, 'threadId')
    const text = typeof params.text === 'string' ? params.text : ''
    const attachments = Array.isArray(params.attachments) ? params.attachments : []
    if (text.trim() === '' && attachments.length === 0) {
      throw new HubError('codex-cli/bad-request', '消息或附件不能为空')
    }
    const rpc = this.#requireRpc()
    const input = []
    if (text !== '') input.push({ type: 'text', text, text_elements: [] })
    for (const attachment of attachments) {
      if (typeof attachment?.path !== 'string' || attachment.path === '') continue
      if (attachment.kind === 'image') {
        input.push({ type: 'localImage', path: attachment.path })
      } else {
        input.push({
          type: 'mention',
          name: typeof attachment.name === 'string' && attachment.name !== '' ? attachment.name : basename(attachment.path),
          path: attachment.path,
        })
      }
    }
    input.push(...await this.skillInputs(params))
    const request = { threadId, input }
    if (typeof params.model === 'string' && params.model !== '') request.model = params.model
    if (typeof params.effort === 'string' && params.effort !== '') request.effort = params.effort
    if (params.approvalPolicy !== undefined && params.approvalPolicy !== null) request.approvalPolicy = params.approvalPolicy
    if (params.approvalsReviewer === 'user' || params.approvalsReviewer === 'auto_review') {
      request.approvalsReviewer = params.approvalsReviewer
    }
    if (params.sandboxPolicy !== undefined && params.sandboxPolicy !== null && typeof params.sandboxPolicy === 'object') {
      request.sandboxPolicy = params.sandboxPolicy
    }
    if (typeof params.cwd === 'string' && params.cwd !== '') request.cwd = params.cwd
    if (params.collaborationMode !== undefined && params.collaborationMode !== null) {
      const mode = params.collaborationMode.mode
      const settings = params.collaborationMode.settings
      if (mode !== 'plan' && mode !== 'default') {
        throw new HubError('codex-cli/bad-request', 'collaborationMode.mode 必须是 plan 或 default')
      }
      if (typeof settings?.model !== 'string' || settings.model === '') {
        throw new HubError('codex-cli/bad-request', 'collaborationMode.settings.model 不能为空')
      }
      request.collaborationMode = {
        mode,
        settings: {
          model: settings.model,
          reasoning_effort: typeof settings.reasoning_effort === 'string' ? settings.reasoning_effort : null,
          developer_instructions: null,
        },
      }
    }
    const titles = this.#titles
    titles?.track(threadId, { text, model: request.collaborationMode?.settings.model || request.model, cwd: request.cwd })
    let result
    try {
      result = await startTurnWithResume(rpc, request, resolveCodexHome(this.config))
    } catch (cause) {
      titles?.forget(threadId)
      throw cause
    }
    this.#owned.delete(threadId)
    // Keep the last successfully applied turn settings for clients reopening the thread.
    if (request.collaborationMode !== undefined || request.approvalPolicy !== undefined || request.sandboxPolicy !== undefined) {
      const current = this.#threadSettings.get(threadId) ?? {
        approvalPolicy: null,
        approvalsReviewer: null,
        sandbox: null,
        collaborationMode: null,
      }
      this.#threadSettings.set(threadId, {
        ...current,
        ...(request.collaborationMode !== undefined ? { collaborationMode: request.collaborationMode } : {}),
        ...(request.approvalPolicy !== undefined ? { approvalPolicy: request.approvalPolicy } : {}),
        ...(request.approvalsReviewer !== undefined ? { approvalsReviewer: request.approvalsReviewer } : {}),
        ...(request.sandboxPolicy !== undefined ? { sandbox: request.sandboxPolicy } : {}),
      })
    }
    return { turn: compactTurn(result?.turn) }
  }

  /** 运行中插话：必须带 expectedTurnId。 */
  async steerTurn(params = {}) {
    const threadId = requireString(params.threadId, 'threadId')
    const turnId = requireString(params.turnId, 'turnId')
    const text = typeof params.text === 'string' ? params.text : ''
    const attachments = Array.isArray(params.attachments) ? params.attachments : []
    if (!text.trim() && !attachments.length) throw new HubError('codex-cli/bad-request', '消息或附件不能为空')
    const input = text ? [{ type: 'text', text, text_elements: [] }] : []
    for (const attachment of attachments) {
      if (typeof attachment?.path !== 'string' || !attachment.path) continue
      input.push(attachment.kind === 'image'
        ? { type: 'localImage', path: attachment.path }
        : { type: 'mention', name: attachment.name || basename(attachment.path), path: attachment.path })
    }
    input.push(...await this.skillInputs(params))
    const rpc = this.#requireRpc()
    const result = await rpc.request(
      'turn/steer',
      { threadId, expectedTurnId: turnId, input },
      { timeoutMs: 30000 },
    )
    return { turn: compactTurn(result?.turn) }
  }

  /** 设置会话目标。 */
  async setGoal(params = {}) {
    const threadId = requireString(params.threadId, 'threadId')
    const objective = requireString(params.objective, 'objective').trim()
    if (objective === '') throw new HubError('codex-cli/bad-request', '目标不能为空')
    const rpc = this.#requireRpc()
    await rpc.request('thread/goal/set', { threadId, objective, status: 'active' }, { timeoutMs: 15000 })
    return { threadId, objective }
  }

  /** 压缩当前会话上下文。 */
  async compactThread(threadId) {
    const id = requireString(threadId, 'threadId')
    const rpc = this.#requireRpc()
    await rpc.request('thread/compact/start', { threadId: id }, { timeoutMs: 30000 })
    return { threadId: id, compacting: true }
  }

  /** 打断当前回合。 */
  async interruptTurn(params = {}) {
    const threadId = requireString(params.threadId, 'threadId')
    const turnId = requireString(params.turnId, 'turnId')
    const rpc = this.#requireRpc()
    await rpc.request('turn/interrupt', { threadId, turnId }, { timeoutMs: 15000 })
    return { threadId, turnId, interrupted: true }
  }

  // ── 会话管理 ────────────────────────────────────────────────────────────

  /** 重命名线程。 */
  async renameThread(params = {}) {
    const threadId = requireString(params.threadId, 'threadId')
    const name = requireString(params.name, 'name').trim()
    if (name === '') throw new HubError('codex-cli/bad-request', '名称不能为空')
    const rpc = this.#requireRpc()
    await this.#titles?.cancel(threadId)
    await rpc.request('thread/name/set', { threadId, name }, { timeoutMs: 15000 })
    this.#invalidateProjects()
    this.bus.publish('thread/updated', { name }, { threadId })
    return { threadId, name }
  }

  async archiveThread(params = {}) {
    const threadId = requireString(params.threadId, 'threadId')
    const rpc = this.#requireRpc()
    await this.#titles?.cancel(threadId)
    await rpc.request('thread/archive', { threadId }, { timeoutMs: 20000 })
    this.#invalidateProjects()
    return { threadId, archived: true }
  }

  async unarchiveThread(params = {}) {
    const threadId = requireString(params.threadId, 'threadId')
    const rpc = this.#requireRpc()
    await rpc.request('thread/unarchive', { threadId }, { timeoutMs: 20000 })
    this.#invalidateProjects()
    return { threadId, archived: false }
  }

  /** 永久删除线程（不可恢复）。 */
  async deleteThread(params = {}) {
    const threadId = requireString(params.threadId, 'threadId')
    const rpc = this.#requireRpc()
    await this.#titles?.cancel(threadId)
    await rpc.request('thread/delete', { threadId }, { timeoutMs: 30000 })
    this.#invalidateProjects()
    return { threadId, deleted: true }
  }

  /** 从某个线程 fork 出新线程。 */
  async forkThread(params = {}) {
    const threadId = requireString(params.threadId, 'threadId')
    const rpc = this.#requireRpc()
    const overrides = params.model ? { model: params.model } : {}
    const result = await rpc.request('thread/fork', { threadId, ...overrides, excludeTurns: true, deferGoalContinuation: true }, { timeoutMs: 60000 })
    const thread = compactThread({ ...result?.thread, model: result?.model ?? result?.thread?.model })
    if (thread?.id) this.#owned.add(thread.id)
    this.#invalidateProjects()
    return thread
  }

  /** 导出线程为 markdown（分页拉全量回合）。 */
  async exportThread(params = {}) {
    const threadId = requireString(params.threadId, 'threadId')
    const rpc = this.#requireRpc()
    const read = await rpc.request('thread/read', { threadId, includeTurns: false }, { timeoutMs: 20000 })
    const thread = compactThread(read?.thread ?? { id: threadId })
    const turns = []
    let cursor = null
    for (let page = 0; page < 20; page += 1) {
      const request = { threadId, limit: 100, sortDirection: 'desc', itemsView: 'full' }
      if (cursor !== null) request.cursor = cursor
      const result = await rpc.request('thread/turns/list', request, { timeoutMs: 60000 })
      turns.push(...(result?.data ?? []))
      cursor = result?.nextCursor ?? null
      if (cursor === null) break
    }
    turns.reverse()
    const content = renderMarkdown(thread, turns)
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/gu, '-')
    return {
      filename: `${(thread.name ?? thread.id).replace(/[^\p{L}\p{N}._-]+/gu, '-').slice(0, 60)}-${stamp}.md`,
      content,
      turns: turns.length,
    }
  }

  // ── 订阅 ────────────────────────────────────────────────────────────────

  /** 打开线程：resume 并订阅事件；引用计数支持多个浏览器页签。 */
  async openThread(threadId) {
    if (typeof threadId !== 'string' || threadId === '') {
      throw new HubError('codex-cli/bad-request', 'threadId 不能为空')
    }
    const rpc = this.#requireRpc()
    const count = this.#subscriptions.get(threadId) ?? 0
    if (count === 0 && !this.#owned.has(threadId)) {
      const result = await resumeThread(rpc, threadId, resolveCodexHome(this.config))
      this.#threadSettings.set(threadId, {
        approvalPolicy: result?.approvalPolicy ?? null,
        approvalsReviewer: result?.approvalsReviewer ?? null,
        sandbox: result?.sandbox ?? null,
        collaborationMode: result?.collaborationMode ?? null,
      })
    }
    this.#subscriptions.set(threadId, count + 1)
    return { threadId, subscribers: count + 1 }
  }

  /** 最近一次 resume 读到的会话权限设置。 */
  getThreadSettings(threadId) {
    return this.#threadSettings.get(threadId) ?? null
  }

  /** 关闭线程订阅。 */
  async closeThread(threadId) {
    const count = this.#subscriptions.get(threadId) ?? 0
    if (count === 0) return { threadId, subscribers: 0 }
    if (count === 1) {
      this.#subscriptions.delete(threadId)
      // A newly created thread may not have a rollout until its first turn.
      // Keep it loaded so switching away and back does not make it unrecoverable.
      if (this.#owned.has(threadId)) return { threadId, subscribers: 0 }
      try {
        await this.#rpc?.request('thread/unsubscribe', { threadId }, { timeoutMs: 10000 })
      } catch {
        // 断开时 unsubscribe 失败无所谓
      }
    } else {
      this.#subscriptions.set(threadId, count - 1)
    }
    return { threadId, subscribers: Math.max(count - 1, 0) }
  }

  // ── 审批与用户输入 ──────────────────────────────────────────────────────

  #onServerRequest(request) {
    if (this.#titles?.isHidden(request.params?.threadId)) return defaultApprovalResponse(request.method)
    const key = String(request.id)
    const pending = {
      id: request.id,
      method: request.method,
      params: request.params ?? {},
      createdAt: Date.now(),
      resolve: null,
      timer: null,
    }
    const promise = new Promise((resolve) => {
      pending.resolve = resolve
    })
    this.#pendingApprovals.set(key, pending)
    this.bus.publish(
      'approval/requested',
      {
        requestId: request.id,
        method: request.method,
        params: pending.params,
        createdAt: pending.createdAt,
      },
      {
        threadId: pending.params.threadId,
        turnId: pending.params.turnId,
        itemId: pending.params.itemId,
      },
    )
    if (this.config.approvalTimeoutMs > 0) {
      pending.timer = setTimeout(() => {
        this.logger?.warn?.(`[codex-cli] 审批超时自动拒绝：${request.method}`)
        this.#settleApproval(key, defaultApprovalResponse(request.method), 'timeout')
      }, this.config.approvalTimeoutMs)
      pending.timer.unref?.()
    }
    return promise
  }

  /** 回应一个挂起的服务端请求；response 是方法对应的原始响应体。 */
  respondApproval(requestId, response) {
    const ok = this.#settleApproval(String(requestId), response, 'answered')
    if (!ok) throw new HubError('codex-cli/unknown-approval', '审批请求不存在或已解决')
    return { requestId, resolved: true }
  }

  /** 当前挂起的审批（页面重新打开时补发）。 */
  pendingApprovals() {
    return [...this.#pendingApprovals.values()].map((pending) => ({
      requestId: pending.id,
      method: pending.method,
      params: pending.params,
      createdAt: pending.createdAt,
    }))
  }

  #settleApproval(key, response, reason) {
    const pending = this.#pendingApprovals.get(key)
    if (pending === undefined) return false
    this.#pendingApprovals.delete(key)
    if (pending.timer !== null) clearTimeout(pending.timer)
    pending.resolve(response)
    this.bus.publish(
      'approval/resolved',
      { requestId: pending.id, reason },
      {
        threadId: pending.params.threadId,
        turnId: pending.params.turnId,
        itemId: pending.params.itemId,
      },
    )
    return true
  }

  #clearApprovals(reason) {
    for (const [key, pending] of this.#pendingApprovals) {
      if (pending.timer !== null) clearTimeout(pending.timer)
      pending.resolve(SKIP_RESPONSE)
      this.#pendingApprovals.delete(key)
      this.bus.publish('approval/resolved', { requestId: pending.id, reason })
    }
  }

  // ── 通知归一化 ──────────────────────────────────────────────────────────

  #onNotification(method, params) {
    const payload = params !== null && typeof params === 'object' ? params : {}
    if (this.#titles?.notification(method, payload)) return
    switch (method) {
      case 'thread/started':
        this.#invalidateProjects()
        this.bus.publish('thread/upsert', { thread: compactThread(payload.thread) })
        return
      case 'thread/status/changed':
        this.bus.publish('thread/status', { status: payload.status ?? null }, { threadId: payload.threadId })
        return
      case 'thread/name/updated':
        this.#invalidateProjects()
        this.bus.publish('thread/updated', { name: payload.threadName ?? null }, { threadId: payload.threadId })
        return
      case 'thread/archived':
      case 'thread/unarchived':
      case 'thread/deleted':
      case 'thread/closed':
        this.#invalidateProjects()
        this.bus.publish(method, {}, { threadId: payload.threadId })
        return
      case 'turn/started':
      case 'turn/completed':
        this.bus.publish(
          method,
          { turn: compactTurn(payload.turn) },
          { threadId: payload.threadId, turnId: payload.turn?.id },
        )
        return
      case 'item/started':
      case 'item/completed': {
        const completed = method === 'item/completed'
        this.bus.publish(
          'item/upsert',
          { item: payload.item ? compactItem({
            ...payload.item,
            streaming: !completed,
            ...(typeof payload.startedAtMs === 'number' ? { startedAtMs: payload.startedAtMs } : {}),
            ...(typeof payload.completedAtMs === 'number' ? { completedAtMs: payload.completedAtMs } : {}),
          }) : null, completed },
          { threadId: payload.threadId, turnId: payload.turnId, itemId: payload.item?.id },
        )
        return
      }
      case 'item/agentMessage/delta':
        this.bus.publishDelta(`${payload.threadId}:${payload.itemId}:agentMessage`, payload.delta ?? '', {
          threadId: payload.threadId,
          turnId: payload.turnId,
          itemId: payload.itemId,
          channel: 'agentMessage',
        })
        return
      case 'item/reasoning/summaryTextDelta':
        this.bus.publishDelta(`${payload.threadId}:${payload.itemId}:reasoningSummary:${payload.summaryIndex ?? 0}`, payload.delta ?? '', {
          threadId: payload.threadId,
          turnId: payload.turnId,
          itemId: payload.itemId,
          channel: 'reasoningSummary',
          summaryIndex: payload.summaryIndex ?? 0,
        })
        return
      case 'item/reasoning/textDelta':
        this.bus.publishDelta(`${payload.threadId}:${payload.itemId}:reasoningText:${payload.contentIndex ?? 0}`, payload.delta ?? '', {
          threadId: payload.threadId,
          turnId: payload.turnId,
          itemId: payload.itemId,
          channel: 'reasoningText',
          contentIndex: payload.contentIndex ?? 0,
        })
        return
      case 'item/commandExecution/outputDelta':
        this.bus.publishDelta(`${payload.threadId}:${payload.itemId}:commandOutput`, payload.delta ?? '', {
          threadId: payload.threadId,
          turnId: payload.turnId,
          itemId: payload.itemId,
          channel: 'commandOutput',
        })
        return
      case 'item/fileChange/outputDelta':
        this.bus.publishDelta(`${payload.threadId}:${payload.itemId}:fileOutput`, payload.delta ?? '', {
          threadId: payload.threadId,
          turnId: payload.turnId,
          itemId: payload.itemId,
          channel: 'fileOutput',
        })
        return
      case 'item/plan/delta':
        this.bus.publishDelta(`${payload.threadId}:${payload.itemId}:plan`, payload.delta ?? '', {
          threadId: payload.threadId,
          turnId: payload.turnId,
          itemId: payload.itemId,
          channel: 'plan',
        })
        return
      case 'item/fileChange/patchUpdated':
        this.bus.publish(
          'item/patch',
          { changes: payload.changes ?? [] },
          { threadId: payload.threadId, turnId: payload.turnId, itemId: payload.itemId },
        )
        return
      case 'thread/tokenUsage/updated':
        this.bus.publish(
          'thread/usage',
          { tokenUsage: payload.tokenUsage ?? null },
          { threadId: payload.threadId, turnId: payload.turnId },
        )
        return
      case 'account/rateLimits/updated':
        this.bus.publish('account/rateLimits', { rateLimits: payload.rateLimits ?? null })
        return
      case 'account/updated':
        this.bus.publish('account', {
          authMode: payload.authMode ?? null,
          planType: payload.planType ?? null,
        })
        return
      case 'mcpServer/startupStatus/updated':
        this.bus.publish('mcp/status', payload, { threadId: payload.threadId })
        return
      case 'serverRequest/resolved':
        this.#settleApproval(String(payload.requestId), SKIP_RESPONSE, 'resolved-elsewhere')
        return
      case 'error':
        this.bus.publish(
          'log',
          { level: 'error', error: payload.error ?? null, willRetry: payload.willRetry === true },
          { threadId: payload.threadId, turnId: payload.turnId },
        )
        return
      case 'configWarning':
        this.bus.publish('log', {
          level: 'warn',
          message: payload.summary ?? '配置警告',
          details: payload.details ?? null,
          path: payload.path ?? null,
        })
        return
      case 'deprecationNotice':
      case 'remoteControl/status/changed':
        return
      default:
        this.logger?.debug?.(`[codex-cli] 未处理的通知：${method}`)
    }
  }
}

// ── 工具函数 ──────────────────────────────────────────────────────────────

/** 线程 DTO：只保留 UI 需要的字段，避免把整个 rollouts 元数据透传。 */
function compactThread(thread) {
  if (thread === null || typeof thread !== 'object') return null
  return {
    id: thread.id ?? null,
    modelProvider: thread.modelProvider ?? 'openai',
    sessionId: thread.sessionId ?? null,
    name: thread.name ?? null,
    preview: thread.preview ?? '',
    cwd: thread.cwd ?? null,
    model: thread.model ?? null,
    reasoningEffort: thread.reasoningEffort ?? null,
    status: thread.status ?? null,
    source: thread.source ?? null,
    createdAt: thread.createdAt ?? null,
    updatedAt: thread.updatedAt ?? null,
    recencyAt: thread.recencyAt ?? null,
    cliVersion: thread.cliVersion ?? null,
    path: thread.path ?? null,
    gitInfo: thread.gitInfo ?? null,
    parentThreadId: thread.parentThreadId ?? null,
    forkedFromId: thread.forkedFromId ?? null,
    agentNickname: thread.agentNickname ?? null,
    agentRole: thread.agentRole ?? null,
    ephemeral: thread.ephemeral === true,
  }
}

/** 回合 DTO（事件里不带 items，避免每条事件重复整段历史）。 */
function compactTurn(turn) {
  if (turn === null || typeof turn !== 'object') return null
  return {
    id: turn.id ?? null,
    rootTurnId: turn.rootTurnId ?? null,
    status: turn.status ?? null,
    error: turn.error ?? null,
    startedAt: turn.startedAt ?? null,
    completedAt: turn.completedAt ?? null,
    durationMs: turn.durationMs ?? null,
    itemsView: turn.itemsView ?? null,
  }
}

/** 按 cwd 聚合项目。 */
/** 线程偶发未加载时，先 resume 再重试一次读取；真正的删除仍会抛错。 */
async function readThreadWithReload(rpc, method, params, timeoutMs) {
  try {
    return await rpc.request(method, params, { timeoutMs })
  } catch (cause) {
    if (!(cause instanceof JsonRpcError) || !/thread not found/i.test(cause.message)) throw cause
    try {
      await rpc.request('thread/resume', { threadId: params.threadId }, { timeoutMs: 30000 })
    } catch {
      // 活动线程可能拒绝 resume，继续重试读取。
    }
    await sleep(200)
    return await rpc.request(method, params, { timeoutMs })
  }
}

/** Only retry a rejected start when the server explicitly says the thread is absent. */
export async function startTurnWithResume(rpc, request, codexHome) {
  try {
    return await rpc.request('turn/start', request, { timeoutMs: 60000 })
  } catch (cause) {
    if (!(cause instanceof JsonRpcError) || !/thread not found/i.test(cause.message)) throw cause
    await resumeThread(rpc, request.threadId, codexHome)
    return await rpc.request('turn/start', request, { timeoutMs: 60000 })
  }
}

/** resume 的偶发 not found 重试一次。 */
async function resumeThread(rpc, threadId, codexHome) {
  const params = {threadId}
  try {
    return await rpc.request('thread/resume', params, { timeoutMs: 30000 })
  } catch (cause) {
    if (!(cause instanceof JsonRpcError) || !/thread not found/i.test(cause.message)) throw cause
    await sleep(300)
    return await rpc.request('thread/resume', params, { timeoutMs: 30000 })
  }
}

function aggregateProjects(threads) {
  const groups = new Map()
  for (const thread of threads) {
    const cwd = typeof thread.cwd === 'string' ? thread.cwd : ''
    if (cwd === '') continue
    let group = groups.get(cwd)
    if (group === undefined) {
      group = {
        cwd,
        name: basename(cwd),
        threadCount: 0,
        activeCount: 0,
        lastUpdatedAt: 0,
        models: new Set(),
        git: null,
        latest: null,
      }
      groups.set(cwd, group)
    }
    group.threadCount += 1
    if (thread.status?.type === 'active') group.activeCount += 1
    const updatedAt = typeof thread.updatedAt === 'number' ? thread.updatedAt : 0
    if (updatedAt >= group.lastUpdatedAt) {
      group.lastUpdatedAt = updatedAt
      group.latest = {
        id: thread.id ?? null,
        name: thread.name ?? null,
        preview: firstLine(thread.preview ?? ''),
        status: thread.status?.type ?? null,
      }
    }
    if (typeof thread.model === 'string' && thread.model !== '') group.models.add(thread.model)
    if (group.git === null && thread.gitInfo !== null && thread.gitInfo !== undefined) group.git = thread.gitInfo
  }
  return [...groups.values()]
    .map((group) => ({ ...group, models: [...group.models] }))
    .sort((a, b) => b.lastUpdatedAt - a.lastUpdatedAt)
}

function renderMarkdown(thread, turns) {
  const lines = []
  lines.push(`# ${thread.name ?? thread.id}`, '')
  lines.push(`- id: \`${thread.id}\``)
  if (thread.cwd) lines.push(`- cwd: \`${thread.cwd}\``)
  if (thread.model) lines.push(`- model: \`${thread.model}\``)
  if (thread.reasoningEffort) lines.push(`- reasoning: \`${thread.reasoningEffort}\``)
  if (thread.gitInfo?.branch) lines.push(`- branch: \`${thread.gitInfo.branch}\``)
  lines.push(`- turns: ${turns.length}`, '')
  let index = 0
  for (const turn of turns) {
    index += 1
    lines.push(`## Turn ${index} · ${turn.status ?? 'unknown'}`, '')
    for (const item of turn.items ?? []) {
      lines.push(...renderItem(item))
    }
  }
  return lines.join('\n')
}

function renderItem(item) {
  const lines = []
  switch (item.type) {
    case 'userMessage': {
      const text = (item.content ?? [])
        .filter((entry) => entry.type === 'text' && typeof entry.text === 'string')
        .map((entry) => entry.text)
        .join('\n')
      lines.push('**User**', '', text, '')
      break
    }
    case 'agentMessage':
      lines.push('**Codex**', '', item.text ?? '', '')
      break
    case 'reasoning': {
      const summary = (item.summary ?? []).filter((part) => String(part).trim() !== '')
      if (summary.length > 0) lines.push('<details><summary>Reasoning</summary>', '', summary.join('\n\n'), '', '</details>', '')
      break
    }
    case 'commandExecution': {
      lines.push(`**Command** \`${item.command ?? ''}\` — ${item.status ?? ''}${typeof item.exitCode === 'number' ? ` (exit ${item.exitCode})` : ''}`, '')
      if (item.aggregatedOutput) lines.push('```text', item.aggregatedOutput, '```', '')
      break
    }
    case 'fileChange': {
      for (const change of item.changes ?? []) {
        lines.push(`**File** \`${change.path}\``, '', '```diff', change.diff ?? '', '```', '')
      }
      break
    }
    case 'mcpToolCall':
      lines.push(`**Tool** ${item.server ?? 'mcp'} / ${item.tool ?? ''} — ${item.status ?? ''}`, '')
      break
    default:
      break
  }
  return lines
}

function firstLine(text) {
  const line = String(text).split('\n').find((candidate) => candidate.trim() !== '') ?? ''
  return line.length > 160 ? `${line.slice(0, 160)}…` : line
}

/** 从 initialize 的 userAgent 里取 codex 版本：`<client>/<version> (...)`。 */
export function compactWindow(window) {
  if (window === null || window === undefined) return null
  return {
    usedPercent: Number(window.usedPercent ?? 0),
    windowDurationMins: window.windowDurationMins ?? null,
    resetsAt: window.resetsAt ?? null,
  }
}

function parseCodexVersion(userAgent) {
  if (typeof userAgent !== 'string') return null
  const match = /^[^/\s]+\/(\d+\.\d+\.\d+(?:[-+][^\s)]*)?)/.exec(userAgent)
  return match === null ? null : match[1]
}

/** 超时兜底响应：默认拒绝，避免守护进程一直等。 */
function defaultApprovalResponse(method) {
  switch (method) {
    case 'item/commandExecution/requestApproval':
    case 'item/fileChange/requestApproval':
      return { decision: 'decline' }
    case 'item/tool/requestUserInput':
      return { answers: {} }
    case 'item/permissions/requestApproval':
      return { permissions: {}, scope: 'turn' }
    case 'mcpServer/elicitation/request':
      return { action: 'decline', content: null, _meta: null }
    default:
      return SKIP_RESPONSE
  }
}

/** 历史与实时条目都会经过这里：超长字段截断，避免一次拉回几 MB。 */
const ITEM_LIMITS = {
  commandOutput: 32000,
  diff: 16000,
  json: 16000,
  text: 400000,
}

function compactItem(item) {
  if (item === null || typeof item !== 'object') return null
  const patch = {}
  if (item.type === 'reasoning' && Array.isArray(item.content)) {
    patch.content = item.content.map((part) =>
      typeof part === 'string' ? { type: 'text', text: part } : part,
    )
  }
  if (typeof item.aggregatedOutput === 'string' && item.aggregatedOutput.length > ITEM_LIMITS.commandOutput) {
    patch.aggregatedOutput = `${item.aggregatedOutput.slice(0, ITEM_LIMITS.commandOutput)}\n…（输出已截断，共 ${item.aggregatedOutput.length} 字符）`
  }
  if (Array.isArray(item.changes)) {
    let changed = false
    const changes = item.changes.map((change) => {
      if (
        change !== null &&
        typeof change === 'object' &&
        typeof change.diff === 'string' &&
        change.diff.length > ITEM_LIMITS.diff
      ) {
        changed = true
        return { ...change, diff: `${change.diff.slice(0, ITEM_LIMITS.diff)}\n…（diff 已截断）` }
      }
      return change
    })
    if (changed) patch.changes = changes
  }
  if (item.result !== undefined && item.result !== null && jsonLength(item.result) > ITEM_LIMITS.json) {
    patch.result = { truncated: true, preview: jsonPreview(item.result) }
  }
  if (item.arguments !== undefined && item.arguments !== null && jsonLength(item.arguments) > ITEM_LIMITS.json) {
    patch.arguments = { truncated: true, preview: jsonPreview(item.arguments) }
  }
  if (typeof item.text === 'string' && item.text.length > ITEM_LIMITS.text) {
    patch.text = `${item.text.slice(0, ITEM_LIMITS.text)}\n…（文本已截断）`
  }
  return Object.keys(patch).length === 0 ? item : { ...item, ...patch }
}

function jsonLength(value) {
  try {
    return JSON.stringify(value)?.length ?? 0
  } catch {
    return 0
  }
}

function jsonPreview(value) {
  try {
    const text = JSON.stringify(value) ?? ''
    return text.length > 2000 ? `${text.slice(0, 2000)}…` : text
  } catch {
    return ''
  }
}

function requireString(value, name) {
  if (typeof value !== 'string' || value === '') {
    throw new HubError('codex-cli/bad-request', `${name} 不能为空`)
  }
  return value
}

function clampInt(value, min, max) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return min
  return Math.min(Math.max(Math.trunc(value), min), max)
}

function describe(cause) {
  if (cause instanceof JsonRpcError) return `${cause.message}（code=${cause.code}）`
  return cause instanceof Error ? cause.message : String(cause)
}
