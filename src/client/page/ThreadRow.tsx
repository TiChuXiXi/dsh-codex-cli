/** 会话行：状态点、标题、模型/时间，带行内操作菜单。 */

import * as React from 'react'
import { useT } from '../i18n'
import type { Api } from '../rpc'
import type { CodexThread } from '../types'
import { relativeTime, threadTitle } from '../utils'
import { ThreadRowMenu } from './ThreadRowMenu'
import { OverflowLabel } from '../components/OverflowLabel'
import { Icon } from '../components/Icon'

export interface ThreadRowProps {
  api: Api
  thread: CodexThread
  selected: boolean
  unread: boolean
  showCwd: boolean
  onSelect: (id: string) => void
  onRenamed: (id: string, name: string) => void
  onChanged: () => void
  onDeleted: (id: string) => void
}

export function ThreadRow({
  api,
  thread,
  selected,
  unread,
  showCwd,
  onSelect,
  onRenamed,
  onChanged,
  onDeleted,
}: ThreadRowProps) {
  const t = useT()
  const running = thread.status?.type === 'active'
  const showCompletionDot = unread && !selected && !running
  const time = relativeTime(thread.updatedAt, t)
  return (
    <div
      role="button"
      tabIndex={0}
      aria-current={selected ? 'page' : undefined}
      className={`dsh-codex-thread ${selected ? 'active' : ''}`}
      title={`${threadTitle(thread)}\n${thread.cwd ?? ''}`}
      onClick={() => onSelect(thread.id)}
      onKeyDown={(event) => {
        if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          onSelect(thread.id)
        }
      }}
    >
      {showCompletionDot && <span className="dsh-codex-dot done" />}
      <span className="dsh-codex-thread-main">
        <OverflowLabel className="dsh-codex-thread-name" text={threadTitle(thread)} />
      </span>
      <span className={`dsh-codex-thread-trailing${running ? ' running' : ''}`}>
        {running ? <Icon name="loader" size={16} className="dsh-codex-running-spinner" /> : <span className="dsh-codex-thread-time">{time}</span>}
      <ThreadRowMenu
        api={api}
        thread={thread}
        onRenamed={(name) => onRenamed(thread.id, name)}
        onChanged={onChanged}
        onDeleted={() => onDeleted(thread.id)}
      />
      </span>
    </div>
  )
}
