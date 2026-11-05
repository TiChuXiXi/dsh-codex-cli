/** 会话列表：搜索、状态点、模型与时间。 */

import * as React from 'react'
import { useT } from '../i18n'
import type { CodexThread } from '../types'
import { basename, relativeTime, threadTitle } from '../utils'

export interface ThreadListProps {
  threads: CodexThread[]
  selectedId: string | null
  loading: boolean
  hasMore: boolean
  search: string
  showCwd: boolean
  onSearch: (value: string) => void
  onSelect: (id: string) => void
  onLoadMore: () => void
}

export function ThreadList({
  threads,
  selectedId,
  loading,
  hasMore,
  search,
  showCwd,
  onSearch,
  onSelect,
  onLoadMore,
}: ThreadListProps) {
  const t = useT()
  return (
    <div>
      <input
        className="dsh-codex-search"
        type="search"
        value={search}
        placeholder={t('threads.search')}
        onChange={(event) => onSearch(event.target.value)}
      />
      {threads.map((thread) => {
        const status = thread.status?.type ?? 'idle'
        const dotClass = status === 'active' ? 'ok pulse' : status === 'systemError' ? 'error' : ''
        const meta = [thread.model, relativeTime(thread.updatedAt, t)]
        if (showCwd && thread.cwd) meta.push(basename(thread.cwd))
        return (
          <button
            type="button"
            key={thread.id}
            className={`dsh-codex-thread ${selectedId === thread.id ? 'active' : ''}`}
            title={`${threadTitle(thread)}\n${thread.cwd ?? ''}`}
            onClick={() => onSelect(thread.id)}
          >
            <span className={`dsh-codex-dot ${dotClass}`} />
            <span className="dsh-codex-thread-main">
              <span className="dsh-codex-thread-name">{threadTitle(thread)}</span>
              <span className="dsh-codex-thread-meta">{meta.filter(Boolean).join(' · ')}</span>
            </span>
          </button>
        )
      })}
      {threads.length === 0 && !loading ? <div className="dsh-codex-loading">{t('threads.empty')}</div> : null}
      {loading ? <div className="dsh-codex-loading">{t('threads.loading')}</div> : null}
      {hasMore ? (
        <button type="button" className="dsh-codex-button" disabled={loading} onClick={onLoadMore}>
          {t('threads.loadMore')}
        </button>
      ) : null}
    </div>
  )
}
