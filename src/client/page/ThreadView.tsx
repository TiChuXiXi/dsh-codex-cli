/** 会话详情：标题、元信息、消息流、审批与输入区。 */

import * as React from 'react'
import type {SkillReference} from '../skills'
import {Icon} from '../components/Icon'
import { useT } from '../i18n'
import type { Api } from '../rpc'
import type { CodexItem, CodexTurn, PendingApproval, ThreadDetail } from '../types'
import { basename, formatClock, formatDuration, relativeTime, statusKey, threadTitle } from '../utils'
import { ApprovalStack } from './ApprovalCard'
import { Composer, type Attachment, type ModelOption, type PermissionMode } from './Composer'
import { ItemCard } from './ItemCard'
import { ToolGroup, groupActivity } from './ToolGroup'
import { runningStartedAt } from '../running-time'

type SettingEvent = {id: string; turnId: string | null; itemId: string | null; text: string}

export interface ThreadViewProps {
  provider: string
  api: Api
  detail: ThreadDetail | null
  loading: boolean
  selectedId: string | null
  activeTurnId: string | null
  models: ModelOption[]
  permissionFromSession?: PermissionMode | null
  planMode: boolean
  onEnterPlan: () => void
  onExitPlan: () => void
  hasOlder: boolean
  loadingOlder: boolean
  onLoadOlder: () => Promise<void> | void
  pending: PendingApproval[]
  onRespond: (requestId: string | number, response: any) => Promise<void>
  onSend: (text: string, options: {
    model?: string
    effort?: string
    attachments?: Attachment[], skills?:SkillReference[]
    permission?: PermissionMode
  }) => Promise<void>
  onSteer: (text: string, skills?:SkillReference[]) => Promise<void>
  onStop: () => Promise<void>
  onPickProject: () => void
  onNew: () => void
  onCompact: () => void
  onDiff: () => void
  onExport: () => void
  actions?: React.ReactNode
}

export function ThreadView({
  api,
  provider,
  detail,
  loading,
  selectedId,
  activeTurnId,
  models,
  permissionFromSession,
  planMode,
  onEnterPlan,
  onExitPlan,
  hasOlder,
  loadingOlder,
  onLoadOlder,
  pending,
  onRespond,
  onSend,
  onSteer,
  onStop,
  onPickProject,
  onNew,
  onCompact,
  onDiff,
  onExport,
  actions,
}: ThreadViewProps) {
  const t = useT()
  const messagesRef = React.useRef<HTMLDivElement | null>(null)
  const messageContentRef = React.useRef<HTMLDivElement | null>(null)
  const threadId = detail?.thread.id ?? null
  const [model, setModel] = React.useState('')
  const [effort, setEffort] = React.useState('')
  const [permission, setPermission] = React.useState<PermissionMode>('ask')
  const settingEvents = React.useRef<Record<string, SettingEvent[]>>({})
  const [, refreshSettingEvents] = React.useReducer((value: number) => value + 1, 0)
  const eventsFor = (id: string): SettingEvent[] => {
    if (settingEvents.current[id]) return settingEvents.current[id]
    try {
      const stored = JSON.parse(localStorage.getItem('dsh-codex-setting-events:' + id) || '[]')
      if (Array.isArray(stored)) {
        return settingEvents.current[id] = stored.filter((e: any) => e && typeof e.id === 'string' && typeof e.text === 'string' && (e.turnId === null || typeof e.turnId === 'string') && (e.itemId === null || typeof e.itemId === 'string')).slice(-500)
      }
    } catch {}
    return settingEvents.current[id] = []
  }
  const recordSetting = (text: string) => {
    if (!threadId || !detail) return
    const turns = [...detail.turns].sort((a, b) => turnTime(a) - turnTime(b))
    const last = turns.at(-1)
    const event: SettingEvent = {id: crypto.randomUUID(), turnId: last?.id ?? null, itemId: last?.items?.at(-1)?.id ?? null, text}
    const next = [...eventsFor(threadId), event].slice(-500)
    settingEvents.current[threadId] = next
    try { localStorage.setItem('dsh-codex-setting-events:' + threadId, JSON.stringify(next)) } catch {}
    refreshSettingEvents()
  }
  const [, setTick] = React.useState(0)
  const runningSinceRef = React.useRef<{ key:string, time:number }>({key:'',time:Date.now()})
  const runningKey=threadId&&activeTurnId?`dsh-codex-running:${threadId}`:''
  const runningIdentity=runningKey&&activeTurnId?`${runningKey}:${activeTurnId}`:''
  if(runningSinceRef.current.key!==runningIdentity){
    let time=Date.now()
    if(runningKey&&activeTurnId)try{
      const saved=JSON.parse(sessionStorage.getItem(runningKey)||'null')
      if(saved?.turnId===activeTurnId&&typeof saved.time==='number'&&saved.time>0&&saved.time<=time)time=saved.time
    }catch{}
    runningSinceRef.current={key:runningIdentity,time}
  }

  // 切换会话时用该会话的模型/推理强度初始化；之后用户的选择保持到再次切换。
  React.useEffect(() => {
    if (activeTurnId === null) return undefined
    if(runningKey)try{sessionStorage.setItem(runningKey,JSON.stringify({turnId:activeTurnId,time:runningSinceRef.current.time}))}catch{}
    const timer = window.setInterval(() => setTick((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [activeTurnId, runningKey])

  // Restore before paint: a selection from the previous thread is not a pending edit.
  React.useLayoutEffect(() => {
    if (detail === null) return
    setModel(detail.thread.model ?? (provider === 'opencode-go' ? 'deepseek-v4.1-flash' : ''))
    setEffort(detail.thread.reasoningEffort ?? '')
    try {
      const saved = threadId === null ? null : window.localStorage.getItem(`dsh-codex-permission-${threadId}`)
      if (saved === 'read' || saved === 'full' || saved === 'approve' || saved === 'ask') {
        setPermission(saved)
        return
      }
    } catch {
      // Fall back to the server's last known settings.
    }
    setPermission(permissionFromSession ?? 'ask')
  }, [threadId, permissionFromSession])

  const changePermission = React.useCallback(
    (mode: PermissionMode) => {
      if (mode !== permission) recordSetting(`权限已切换为${t('permission.' + mode)}（下一轮生效）`)
      setPermission(mode)
      if (threadId === null) return
      try {
        window.localStorage.setItem(`dsh-codex-permission-${threadId}`, mode)
      } catch {
        // 忽略。
      }
    },
    [threadId, permission, detail, t],
  )

  // 是否贴着底部：决定新内容到来时要不要跟随；用户上滚后停止跟随。
  const atBottomRef = React.useRef(true)
  const [showJump, setShowJump] = React.useState(false)
  const pendingPrependRef = React.useRef<{ height: number, top: number } | null>(null)
  const BOTTOM_THRESHOLD = 32

  // 切换会话或首次加载完成：回到最底部并恢复跟随。
  React.useLayoutEffect(() => {
    const element = messagesRef.current
    if (element === null) return
    atBottomRef.current = true
    setShowJump(false)
    element.scrollTop = element.scrollHeight
  }, [threadId, loading])

  // 内容更新（含流式增量）：前插更早回合时保持视觉位置，否则只有贴着底部才跟随。
  React.useLayoutEffect(() => {
    const element = messagesRef.current
    if (element === null) return
    const pending = pendingPrependRef.current
    if (pending !== null) {
      pendingPrependRef.current = null
      element.scrollTop = pending.top + (element.scrollHeight - pending.height)
      return
    }
    if (!atBottomRef.current) return
    element.scrollTop = element.scrollHeight
  }, [detail])

  // Images, code previews and composer resizing can change layout without new message data.
  // Observe both the viewport and its content so late layout changes keep the bottom visible.
  React.useLayoutEffect(() => {
    const element = messagesRef.current
    const content = messageContentRef.current
    if (!element || !content) return
    const follow = () => {
      if (atBottomRef.current && pendingPrependRef.current === null) {
        element.scrollTop = element.scrollHeight
      }
    }
    const observer = new ResizeObserver(follow)
    observer.observe(element)
    observer.observe(content)
    content.addEventListener('load', follow, true)
    return () => {
      observer.disconnect()
      content.removeEventListener('load', follow, true)
    }
  }, [threadId, loading])

  // 加载失败时清掉待恢复的位置，避免下一次流式更新误判。
  React.useEffect(() => {
    if (!loadingOlder) pendingPrependRef.current = null
  }, [loadingOlder])

  const triggerOlder = React.useCallback(() => {
    const element = messagesRef.current
    if (element === null || !hasOlder || loadingOlder) return
    pendingPrependRef.current = { height: element.scrollHeight, top: element.scrollTop }
    void onLoadOlder()
  }, [hasOlder, loadingOlder, onLoadOlder])

  const onMessagesScroll = React.useCallback(() => {
    const element = messagesRef.current
    if (element === null) return
    const atBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight <= BOTTOM_THRESHOLD
    atBottomRef.current = atBottom
    setShowJump((previous) => (previous === !atBottom ? previous : !atBottom))
    if (element.scrollTop < 240) triggerOlder()
  }, [triggerOlder])

  const jumpToBottom = React.useCallback(() => {
    const element = messagesRef.current
    if (element === null) return
    atBottomRef.current = true
    setShowJump(false)
    element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' })
  }, [])

  if (selectedId === null) {
    return (
      <div className="dsh-codex-empty">
        <strong>{t('thread.select')}</strong>
        <small>{t('thread.selectHint')}</small>
      </div>
    )
  }
  if (loading && detail === null) {
    return <div className="dsh-codex-empty">{t('thread.loading')}</div>
  }
  if (detail === null) return null

  const thread = detail.thread
  const orderedTurns = [...detail.turns]
    .map((turn, index) => ({ turn, index }))
    .sort((a, b) => {
      const at = turnTime(a.turn)
      const bt = turnTime(b.turn)
      return at === bt ? a.index - b.index : at - bt
    })
    .map((entry) => entry.turn)
  const changes = eventsFor(thread.id)
  const insertChanges = (turn: CodexTurn): CodexItem[] => {
    const result: CodexItem[] = []
    const pending = changes.filter(event => event.turnId === turn.id)
    for (const item of turn.items ?? []) {
      result.push(item)
      for (const event of pending.filter(e => e.itemId === item.id)) result.push({id: event.id, type: 'localSettingChange', text: event.text})
    }
    const known = new Set((turn.items ?? []).map(item => item.id))
    for (const event of pending.filter(e => e.itemId === null || !known.has(e.itemId))) result.push({id: event.id, type: 'localSettingChange', text: event.text})
    return result
  }
  const items = orderedTurns.flatMap((turn) => turn.items ?? [])
  const hasItems = items.length > 0
  const activeTurn = detail.turns.find((turn) => turn.id === activeTurnId) ?? null
  const now = Date.now()
  const runningMs = Math.max(0, Math.floor((now - runningStartedAt(activeTurn, runningSinceRef.current.time, now)) / 1000) * 1000)

  return (
    <>
      <div className="dsh-codex-thread-header">
        <div className="dsh-codex-thread-header-top" hidden>
          <div className="dsh-codex-thread-title" title={thread.id}>
            {threadTitle(thread)}
          </div>
          {actions}
        </div>
        <div className="dsh-codex-chips">
          <span className="dsh-codex-chip" data-meta="status">
            {t('thread.status')}: {t(statusKey(thread.status))}
          </span>
          {thread.cwd ? (
            <span className="dsh-codex-chip" data-meta="cwd" title={thread.cwd}>
              {t('thread.cwd')}: <code>{basename(thread.cwd)}</code>
            </span>
          ) : null}
          {thread.model ? (
            <span className="dsh-codex-chip" data-meta="model">
              {t('thread.model')}: {thread.model}
            </span>
          ) : null}
          {thread.reasoningEffort ? (
            <span className="dsh-codex-chip" data-meta="effort">
              {t('thread.effort')}: {thread.reasoningEffort}
            </span>
          ) : null}
          {typeof thread.gitInfo?.branch === 'string' && thread.gitInfo.branch !== '' ? (
            <span className="dsh-codex-chip" data-meta="branch">
              {t('thread.git')}: {thread.gitInfo.branch}
            </span>
          ) : null}
          {thread.updatedAt ? (
            <span className="dsh-codex-chip" data-meta="updated">
              {t('thread.updated')}: {relativeTime(thread.updatedAt, t)}
            </span>
          ) : null}
          <span className="dsh-codex-chip">
            {hasOlder ? t('thread.messagesPlus', { count: items.length }) : t('thread.messages', { count: items.length })}
          </span>
        </div>
      </div>
      <div className="dsh-codex-messages-wrap">
        <div className="dsh-codex-messages" ref={messagesRef} onScroll={onMessagesScroll}>
          <div ref={messageContentRef} className="dsh-codex-message-content">
          {hasOlder && hasItems ? (
            <button
              type="button"
              className="dsh-codex-load-older"
              disabled={loadingOlder}
              onClick={triggerOlder}
            >
              {loadingOlder ? t('thread.loadingOlder') : t('thread.loadOlder')}
            </button>
          ) : null}
          {changes.filter(event => event.turnId === null).map(event => <ItemCard key={event.id} item={{id: event.id, type: 'localSettingChange', text: event.text}} api={api} />)}
          {!hasItems && changes.length === 0 && <div className="dsh-codex-empty">{t('thread.noMessages')}</div>}
          {orderedTurns.map((turn) => (
              <React.Fragment key={turn.id}>
                {groupActivity(insertChanges(turn).filter((item) => provider !== 'openai' || item.type !== 'reasoning')).map((entry) =>
                  entry.kind === 'group' ? (
                    <ToolGroup key={entry.key} items={entry.items} api={api} />
                  ) : (
                    <ItemCard key={entry.item.id} item={entry.item} api={api} cwd={detail.thread.cwd ?? ''} />
                  ),
                )}
                <TurnFooter turn={turn} />
              </React.Fragment>
            ))}
          </div>
        </div>
        {showJump ? (
          <button
            type="button"
            className="dsh-codex-jump"
            aria-label={t('thread.jumpToBottom')}
            title={t('thread.jumpToBottom')}
            onClick={jumpToBottom}
          >
            <ChevronDownGlyph />
          </button>
        ) : null}
      </div>
      <ApprovalStack approvals={pending} onRespond={onRespond} />
      {activeTurnId !== null ? (
        <div className="dsh-codex-running-bar">
          <Icon name="loader" size={16} className="dsh-codex-running-spinner" />
          <span>{t('thread.runningElapsed', { duration: formatDuration(runningMs, t) })}</span>
        </div>
      ) : null}

      {threadId === selectedId && activeTurnId !== null && permissionFromSession != null && permission !== permissionFromSession && (
        <div className="dsh-codex-permission-pending" role="status">权限更改将在下一轮生效；当前回合和待处理的审批仍使用原权限。</div>
      )}
      <Composer
        key={threadId ?? 'new'}
        threadId={threadId}
        api={api}
        cwd={detail.thread.cwd ?? ''}
        disabled={false}
        activeTurnId={activeTurnId}
        models={models}
        model={model}
        effort={effort}
        permission={permission}
        planMode={planMode}
        onModelChange={(value) => {
          const next = value || (provider === 'opencode-go' ? 'deepseek-v4.1-flash' : '')
          if (next !== model) recordSetting(`模型已切换为 ${models.find(entry => entry.id === next)?.displayName ?? (next || t('composer.defaultModel'))}（下一轮生效）`)
          setModel(next)
          setEffort(models.find(entry => entry.id === next)?.defaultReasoningEffort ?? '')
        }}
        onEffortChange={setEffort}
        onPermissionChange={changePermission}
        onEnterPlan={onEnterPlan}
        onExitPlan={onExitPlan}
        onPickProject={onPickProject}
        onNew={onNew}
        onCompact={onCompact}
        onDiff={onDiff}
        onExport={onExport}
        onSend={(text, options) => {
          atBottomRef.current = true
          setShowJump(false)
          const element = messagesRef.current
          if (element) element.scrollTop = element.scrollHeight
          return onSend(text, options)
        }}
        onSteer={onSteer}
        onStop={onStop}
      />
    </>
  )
}

/** 回合结束后的用时与完成时间，形如「用时 1 分 29 秒 · 09:15」。 */
function turnTime(turn: CodexTurn): number {
  if (typeof turn.startedAt === 'number') return turn.startedAt * 1000
  if (typeof turn.completedAt === 'number') return turn.completedAt * 1000
  const times = (turn.items ?? [])
    .flatMap((item) => [item.startedAtMs, item.completedAtMs])
    .filter((value): value is number => typeof value === 'number')
  return times.length > 0 ? Math.min(...times) : Number.MAX_SAFE_INTEGER
}

function TurnFooter({ turn }: { turn: CodexTurn }) {
  const t = useT()
  if (turn.status === 'inProgress') return null
  const startMs = typeof turn.startedAt === 'number' ? turn.startedAt * 1000 : null
  const lastItem = [...(turn.items ?? [])].reverse().find((item) => typeof item.completedAtMs === 'number')
  const endMs = typeof turn.completedAt === 'number' ? turn.completedAt * 1000 : (lastItem?.completedAtMs ?? null)
  const durationMs =
    typeof turn.durationMs === 'number'
      ? turn.durationMs
      : startMs !== null && endMs !== null
        ? endMs - startMs
        : null
  const duration = durationMs === null ? '' : formatDuration(durationMs, t)
  const clock = formatClock(endMs)
  if (duration === '' && clock === '') return null
  const label =
    duration === ''
      ? ''
      : turn.status === 'interrupted'
        ? t('turn.interrupted', { duration })
        : turn.status === 'failed'
          ? t('turn.failed', { duration })
          : t('turn.workedFor', { duration })
  const text = label === '' ? clock : clock === '' ? label : `${label} · ${clock}`
  return <div className="dsh-codex-turn-footer">{text}</div>
}

function ChevronDownGlyph(){return <Icon name="chevronDown" size={16}/>}
