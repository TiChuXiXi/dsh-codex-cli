/** 会话行：状态点、标题、模型/时间，带行内操作菜单。 */

import * as React from 'react'
import { useT } from '../i18n'
import type { Api } from '../rpc'
import type { CodexThread } from '../types'
import { basename, relativeTime, threadTitle } from '../utils'
import { ThreadRowMenu } from './ThreadRowMenu'

export interface ThreadRowProps {
  api: Api
  thread: CodexThread
  selected: boolean
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
  showCwd,
  onSelect,
  onRenamed,
  onChanged,
  onDeleted,
}: ThreadRowProps) {
  const t = useT()
  const status = thread.status?.type ?? 'idle'
  const dotClass = status === 'active' ? 'ok pulse' : status === 'systemError' ? 'error' : ''
  const meta = [thread.model, relativeTime(thread.updatedAt, t)]
  if (showCwd && thread.cwd) meta.push(basename(thread.cwd))
  return (
    <div
      role="button"
      tabIndex={0}
      className={`dsh-codex-thread ${selected ? 'active' : ''}`}
      title={`${threadTitle(thread)}\n${thread.cwd ?? ''}`}
      onClick={() => onSelect(thread.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(thread.id)
        }
      }}
    >
      <span className={`dsh-codex-dot ${dotClass}`} />
      <span className="dsh-codex-thread-main">
        <span className="dsh-codex-thread-name">{threadTitle(thread)}</span>
        <span className="dsh-codex-thread-meta">{meta.filter(Boolean).join(' · ')}</span>
      </span>
      <ThreadRowMenu
        api={api}
        thread={thread}
        onRenamed={(name) => onRenamed(thread.id, name)}
        onChanged={onChanged}
        onDeleted={() => onDeleted(thread.id)}
      />
    </div>
  )
}
