import { randomUUID } from 'node:crypto'
import { HubError } from './hub.js'

/** Host-owned FIFO. A retained subscription keeps it running without an open browser. */
export class FollowupQueue {
  #states = new Map()
  #locks = new Map()
  #off
  #disposed = false
  #instanceId = randomUUID()

  constructor({ hub, bus }) {
    this.hub = hub
    this.bus = bus
    this.#off = bus.subscribe(event => this.#event(event))
  }

  #state(threadId) {
    if (typeof threadId !== 'string' || !threadId) throw new HubError('codex-cli/bad-request', 'threadId 不能为空')
    let state = this.#states.get(threadId)
    if (!state) {
      state = { threadId, revision: 0, entries: [], paused: false, active: null, activity: 0, retained: false, completed: new Set() }
      this.#states.set(threadId, state)
    }
    return state
  }

  list(threadId) {
    const state = this.#state(threadId)
    return structuredClone({ instanceId: this.#instanceId, threadId, revision: state.revision, paused: state.paused, entries: state.entries })
  }

  #publish(state) {
    state.revision++
    this.bus.publish('followups/changed', this.list(state.threadId), { threadId: state.threadId })
  }

  #locked(threadId, action) {
    const previous = this.#locks.get(threadId) ?? Promise.resolve()
    const next = previous.catch(() => {}).then(() => {
      if (this.#disposed) throw new HubError('codex-cli/stopped', '队列已停止')
      return action()
    })
    this.#locks.set(threadId, next)
    void next.finally(() => {
      if (this.#locks.get(threadId) === next) this.#locks.delete(threadId)
    }).catch(() => {})
    return next
  }

  async #sync(state) {
    if (!state.retained) {
      await this.hub.openThread(state.threadId)
      if (this.#disposed) {
        await this.hub.closeThread(state.threadId)
        throw new HubError('codex-cli/stopped', '队列已停止')
      }
      state.retained = true
    }
    const activity = state.activity
    const detail = await this.hub.getThread(state.threadId, { limit: 1 })
    if (this.#disposed) throw new HubError('codex-cli/stopped', '队列已停止')
    state.provider = detail.thread?.modelProvider ?? 'openai'
    if (state.activity !== activity) return
    const latest = detail.turns.at(-1)
    state.active = detail.thread?.status?.type === 'active'
      ? (latest?.status === 'inProgress' ? latest.id : 'unknown')
      : latest?.status === 'inProgress' && detail.thread?.status?.type !== 'idle' ? latest.id : null
  }

  async #release(state) {
    if (state.entries.length || !state.retained) return
    state.retained = false
    await this.hub.closeThread(state.threadId)
  }

  enqueue(params = {}) {
    return this.#locked(params.threadId, async () => {
      const state = this.#state(params.threadId)
      const text = typeof params.text === 'string' ? params.text : ''
      const attachments = Array.isArray(params.attachments) ? params.attachments : []
      if (!text.trim() && !attachments.length) throw new HubError('codex-cli/bad-request', '消息或附件不能为空')
      try {
        await this.#sync(state)
        if (!state.entries.length) state.paused = false
        state.entries.push({
          id: randomUUID(), status: 'queued',
          params: structuredClone({ ...params, text, attachments }),
          error: null,
        })
        this.#publish(state)
        this.#kick(state)
        return this.list(state.threadId)
      } finally {
        await this.#release(state)
      }
    })
  }

  updatePermissions(params = {}) {
    return this.#locked(params.threadId, () => {
      const state = this.#state(params.threadId)
      if (!['never', 'on-request'].includes(params.approvalPolicy) ||
          !['user', 'auto_review'].includes(params.approvalsReviewer) ||
          !['readOnly', 'workspaceWrite', 'dangerFullAccess'].includes(params.sandboxPolicy?.type)) {
        throw new HubError('codex-cli/bad-request', '无效的会话权限')
      }
      const permissions = structuredClone({
        approvalPolicy: params.approvalPolicy,
        approvalsReviewer: params.approvalsReviewer,
        sandboxPolicy: params.sandboxPolicy,
      })
      for (const entry of state.entries) {
        if (entry.status !== 'sending') Object.assign(entry.params, structuredClone(permissions))
      }
      this.#publish(state)
      return this.list(state.threadId)
    })
  }

  action(params = {}) {
    return this.#locked(params.threadId, async () => {
      const state = this.#state(params.threadId)
      if (params.action === 'resume') {
        await this.#sync(state)
        state.paused = false
        for (const entry of state.entries) { entry.error = null; if (entry.status === 'failed') entry.status = 'queued' }
      } else {
        const entry = state.entries.find(item => item.id === params.id)
        if (!entry) throw new HubError('codex-cli/followup-missing', '这条消息已发送或删除')
        switch (params.action) {
          case 'delete':
            state.entries = state.entries.filter(item => item !== entry)
            break
          case 'edit':
            entry.status = 'editing'
            break
          case 'cancel':
            entry.status = 'queued'
            break
          case 'save':
            if (typeof params.text !== 'string' || (!params.text.trim() && !entry.params.attachments.length)) {
              throw new HubError('codex-cli/bad-request', '消息或附件不能为空')
            }
            entry.params.text = params.text
            entry.status = 'queued'
            entry.error = null
            break
          case 'steer':
            await this.#sync(state)
            if (!state.active || state.active === 'unknown') throw new HubError('codex-cli/no-active-turn', '当前回合已结束，可继续队列或等待自动发送')
            try {
              await this.hub.steerTurn({ ...entry.params, turnId: state.active })
              state.entries = state.entries.filter(item => item !== entry)
            } catch (cause) {
              entry.error = cause instanceof Error ? cause.message : String(cause)
              this.#publish(state)
              throw cause
            }
            break
          default: throw new HubError('codex-cli/bad-request', '未知队列操作')
        }
      }
      this.#publish(state)
      await this.#release(state)
      this.#kick(state)
      return this.list(state.threadId)
    })
  }

  pause(threadId) {
    const state = this.#state(threadId)
    state.paused = true
    this.#publish(state)
  }

  #kick(state) {
    if (this.#disposed || !state.entries.length || state.active || state.paused) return
    void this.#locked(state.threadId, async () => {
      const entry = state.entries[0]
      if (!entry || entry.status !== 'queued' || state.active || state.paused) return
      entry.status = 'sending'
      this.#publish(state)
      const activity = state.activity
      try {
        const result = await this.hub.startTurn(entry.params)
        if (this.#disposed) return
        if (!result?.turn?.id) throw new Error('未收到回合确认，请检查会话后继续队列')
        // A fast turn can complete before turn/start returns.
        if (state.activity === activity && !state.completed.has(result.turn.id)) {
          state.active = result.turn.status === 'inProgress' ? result.turn.id : null
        }
        state.entries = state.entries.filter(item => item !== entry)
        if (result.turn.status && !['inProgress', 'completed'].includes(result.turn.status)) state.paused = true
      } catch (cause) {
        if (this.#disposed) return
        entry.status = 'failed'
        entry.error = cause instanceof Error ? cause.message : String(cause)
        state.paused = true
      }
      this.#publish(state)
      await this.#release(state)
      this.#kick(state)
    }).catch(() => {})
  }

  #event(event) {
    if ((event.type === 'connection' || event.type === 'provider/connection') && event.payload?.phase !== 'ready') {
      for (const state of this.#states.values()) {
        if (state.entries.length && (state.provider ?? 'openai') === (event.payload?.provider ?? 'openai')) this.pause(state.threadId)
      }
      return
    }
    const state = this.#states.get(event.threadId)
    if (!state) return
    if (['thread/archived', 'thread/deleted', 'thread/closed'].includes(event.type)) {
      this.pause(state.threadId)
      return
    }
    if (event.type === 'turn/started') {
      state.activity++
      state.active = event.turnId
    } else if (event.type === 'turn/completed') {
      if (state.completed.has(event.turnId)) return
      state.completed.add(event.turnId)
      if (state.completed.size > 100) state.completed.delete(state.completed.values().next().value)
      state.activity++
      if (state.active && state.active !== 'unknown' && state.active !== event.turnId) return
      state.active = null
      if (event.payload?.turn?.status !== 'completed') this.pause(state.threadId)
      this.#kick(state)
    }
  }

  dispose() {
    this.#disposed = true
    this.#off()
    for (const state of this.#states.values()) {
      state.entries = []
      void this.#release(state).catch(() => {})
    }
    this.#states.clear()
  }
}
