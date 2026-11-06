/** 会话详情：标题、元信息、消息流、审批与输入区。 */

import * as React from 'react'
import { useT } from '../i18n'
import type { Api } from '../rpc'
import type { CodexTurn, PendingApproval, ThreadDetail } from '../types'
import { basename, formatClock, formatDuration, relativeTime, statusKey, threadTitle } from '../utils'
import { ApprovalStack } from './ApprovalCard'
import { Composer, type Attachment, type ModelOption, type PermissionMode } from './Composer'
import { ItemCard } from './ItemCard'
import { ToolGroup, groupActivity } from './ToolGroup'

export interface ThreadViewProps {
  api: Api
  detail: ThreadDetail | null
  loading: boolean
  selectedId: string | null
  activeTurnId: string | null
  models: ModelOption[]
  hasOlder: boolean
  loadingOlder: boolean
  onLoadOlder: () => Promise<void> | void
  pending: PendingApproval[]
  onRespond: (requestId: string | number, response: any) => Promise<void>
  onSend: (text: string, options: {
    model?: string
    effort?: string
    attachments?: Attachment[]
    permission?: PermissionMode
  }) => Promise<void>
  onSteer: (text: string) => Promise<void>
  onStop: () => Promise<void>
  onPickProject: () => void
  onNew: () => void
  onCompact: () => void
  actions?: React.ReactNode
}

export function ThreadView({
  api,
  detail,
  loading,
  selectedId,
  activeTurnId,
  models,
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
  actions,
}: ThreadViewProps) {
  const t = useT()
  const messagesRef = React.useRef<HTMLDivElement | null>(null)
  const threadId = detail?.thread.id ?? null
  const [model, setModel] = React.useState('')
  const [effort, setEffort] = React.useState('')
  const [permission, setPermission] = React.useState<PermissionMode>('auto')

  // 切换会话时用该会话的模型/推理强度初始化；之后用户的选择保持到再次切换。
  React.useEffect(() => {
    if (detail === null) return
    setModel(detail.thread.model ?? '')
    setEffort(detail.thread.reasoningEffort ?? '')
    try {
      const saved = threadId === null ? null : window.localStorage.getItem(`dsh-codex-permission-${threadId}`)
      setPermission(saved === 'read' || saved === 'full' ? saved : 'auto')
    } catch {
      setPermission('auto')
    }
  }, [threadId])

  const changePermission = React.useCallback(
    (mode: PermissionMode) => {
      setPermission(mode)
      if (threadId === null) return
      try {
        window.localStorage.setItem(`dsh-codex-permission-${threadId}`, mode)
      } catch {
        // 忽略。
      }
    },
    [threadId],
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
  const items = detail.turns.flatMap((turn) => turn.items ?? [])
  const hasItems = items.length > 0

  return (
    <>
      <div className="dsh-codex-thread-header">
        <div className="dsh-codex-thread-header-top">
          <div className="dsh-codex-thread-title" title={thread.id}>
            {threadTitle(thread)}
          </div>
          {actions}
        </div>
        <div className="dsh-codex-chips">
          <span className="dsh-codex-chip">
            {t('thread.status')}: {t(statusKey(thread.status))}
          </span>
          {thread.cwd ? (
            <span className="dsh-codex-chip" title={thread.cwd}>
              {t('thread.cwd')}: <code>{basename(thread.cwd)}</code>
            </span>
          ) : null}
          {thread.model ? (
            <span className="dsh-codex-chip">
              {t('thread.model')}: {thread.model}
            </span>
          ) : null}
          {thread.reasoningEffort ? (
            <span className="dsh-codex-chip">
              {t('thread.effort')}: {thread.reasoningEffort}
            </span>
          ) : null}
          {typeof thread.gitInfo?.branch === 'string' && thread.gitInfo.branch !== '' ? (
            <span className="dsh-codex-chip">
              {t('thread.git')}: {thread.gitInfo.branch}
            </span>
          ) : null}
          {thread.updatedAt ? (
            <span className="dsh-codex-chip">
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
          {!hasItems ? (
            <div className="dsh-codex-empty">{t('thread.noMessages')}</div>
          ) : (
            detail.turns.map((turn) => (
              <React.Fragment key={turn.id}>
                {groupActivity(turn.items ?? []).map((entry) =>
                  entry.kind === 'group' ? (
                    <ToolGroup key={entry.key} items={entry.items} api={api} />
                  ) : (
                    <ItemCard key={entry.item.id} item={entry.item} api={api} />
                  ),
                )}
                <TurnFooter turn={turn} />
              </React.Fragment>
            ))
          )}
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
      <Composer
        api={api}
        cwd={detail.thread.cwd ?? ''}
        disabled={false}
        activeTurnId={activeTurnId}
        models={models}
        model={model}
        effort={effort}
        permission={permission}
        onModelChange={setModel}
        onEffortChange={setEffort}
        onPermissionChange={changePermission}
        onPickProject={onPickProject}
        onNew={onNew}
        onCompact={onCompact}
        onSend={onSend}
        onSteer={onSteer}
        onStop={onStop}
      />
    </>
  )
}

/** 回合结束后的用时与完成时间，形如「用时 1 分 29 秒 · 09:15」。 */
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

function ChevronDownGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M4 6.2l3.3 3.3a1 1 0 0 0 1.4 0L12 6.2" strokeLinecap="round" />
    </svg>
  )
}
