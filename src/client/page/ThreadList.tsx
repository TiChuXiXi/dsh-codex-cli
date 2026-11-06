/** 会话列表：搜索、收起/展开、行内操作菜单、状态点、模型与时间。 */

import * as React from 'react'
import { useT } from '../i18n'
import type { Api } from '../rpc'
import type { CodexThread } from '../types'
import { basename, relativeTime, threadTitle } from '../utils'
import { useStoredCollapsed } from '../hooks'
import { SectionHeader } from './SectionHeader'
import { ThreadRowMenu } from './ThreadRowMenu'

export interface ThreadListProps {
  api: Api
  threads: CodexThread[]
  selectedId: string | null
  loading: boolean
  hasMore: boolean
  search: string
  showCwd: boolean
  onSearch: (value: string) => void
  onSelect: (id: string) => void
  onLoadMore: () => void
  onThreadRenamed: (id: string, name: string) => void
  onThreadChanged: () => void
  onThreadDeleted: (id: string) => void
}

export function ThreadList({
  api,
  threads,
  selectedId,
  loading,
  hasMore,
  search,
  showCwd,
  onSearch,
  onSelect,
  onLoadMore,
  onThreadRenamed,
  onThreadChanged,
  onThreadDeleted,
}: ThreadListProps) {
  const t = useT()
  const [collapsed, toggleCollapsed] = useStoredCollapsed('dsh-codex-threads-collapsed')
  const filtering = search.trim() !== ''

  return (
    <div>
      <SectionHeader
        title={t('threads.title')}
        search={search}
        placeholder={t('threads.search')}
        collapsed={collapsed}
        onSearch={(value) => {
          onSearch(value)
          if (collapsed && value !== '') toggleCollapsed()
        }}
        onToggle={toggleCollapsed}
      />
      {collapsed ? null : (
        <>
          {threads.map((thread) => {
            const status = thread.status?.type ?? 'idle'
            const dotClass = status === 'active' ? 'ok pulse' : status === 'systemError' ? 'error' : ''
            const meta = [thread.model, relativeTime(thread.updatedAt, t)]
            if (showCwd && thread.cwd) meta.push(basename(thread.cwd))
            return (
              <div
                key={thread.id}
                role="button"
                tabIndex={0}
                className={`dsh-codex-thread ${selectedId === thread.id ? 'active' : ''}`}
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
                  onRenamed={(name) => onThreadRenamed(thread.id, name)}
                  onChanged={onThreadChanged}
                  onDeleted={() => onThreadDeleted(thread.id)}
                />
              </div>
            )
          })}
          {threads.length === 0 && !loading ? (
            <div className="dsh-codex-loading">{filtering ? t('threads.noMatch') : t('threads.empty')}</div>
          ) : null}
          {loading ? <div className="dsh-codex-loading">{t('threads.loading')}</div> : null}
          {hasMore ? (
            <button type="button" className="dsh-codex-load-more" disabled={loading} onClick={onLoadMore}>
              {loading ? t('threads.loading') : t('threads.loadMore')}
            </button>
          ) : null}
        </>
      )}
    </div>
  )
}
