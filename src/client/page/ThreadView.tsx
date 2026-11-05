/** 会话详情：标题、元信息、消息流、审批与输入区。 */

import * as React from 'react'
import { useT } from '../i18n'
import type { PendingApproval, ThreadDetail } from '../types'
import { basename, relativeTime, statusKey, threadTitle } from '../utils'
import { ApprovalStack } from './ApprovalCard'
import { Composer } from './Composer'
import { ItemCard } from './ItemCard'

export interface ThreadViewProps {
  detail: ThreadDetail | null
  loading: boolean
  selectedId: string | null
  activeTurnId: string | null
  pending: PendingApproval[]
  onRespond: (requestId: string | number, response: any) => Promise<void>
  onSend: (text: string) => Promise<void>
  onSteer: (text: string) => Promise<void>
  onStop: () => Promise<void>
  actions?: React.ReactNode
}

export function ThreadView({
  detail,
  loading,
  selectedId,
  activeTurnId,
  pending,
  onRespond,
  onSend,
  onSteer,
  onStop,
  actions,
}: ThreadViewProps) {
  const t = useT()
  const messagesRef = React.useRef<HTMLDivElement | null>(null)
  const threadId = detail?.thread.id ?? null

  // 打开会话或首次加载完成时滚到底部；后续新增条目暂不强制跳转（M1 再做“贴近底部才跟随”）。
  React.useEffect(() => {
    const element = messagesRef.current
    if (element === null) return
    element.scrollTop = element.scrollHeight
  }, [threadId, loading])

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
          <span className="dsh-codex-chip">{t('thread.messages', { count: items.length })}</span>
        </div>
      </div>
      <div className="dsh-codex-messages" ref={messagesRef}>
        {items.length === 0 ? (
          <div className="dsh-codex-empty">{t('thread.noMessages')}</div>
        ) : (
          items.map((item) => <ItemCard key={item.id} item={item} />)
        )}
      </div>
      <ApprovalStack approvals={pending} onRespond={onRespond} />
      <Composer
        disabled={false}
        activeTurnId={activeTurnId}
        onSend={onSend}
        onSteer={onSteer}
        onStop={onStop}
      />
    </>
  )
}
