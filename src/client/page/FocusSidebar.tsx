/** Codex 模式左侧栏：品牌/状态、统计、操作、搜索、项目树与返回 DSH。 */

import * as React from 'react'
import { useT } from '../i18n'
import type { Api } from '../rpc'
import type { CodexThread, HubStatus, Project, RateLimits, RateLimitWindow } from '../types'
import type { StreamState } from '../events'
import { CodexIcon } from '../components/CodexIcon'
import { formatDateTime } from '../utils'
import { ThreadRow } from './ThreadRow'

export interface FocusSidebarProps {
  api: Api
  status: HubStatus | null
  streamState: StreamState
  projects: Project[]
  totalThreads: number
  runningCount: number
  quota: RateLimits | null
  quotaLoading: boolean
  threads: CodexThread[]
  threadsOwner: { cwd: string | null, search: string } | null
  selectedCwd: string | null
  selectedId: string | null
  loading: boolean
  hasMore: boolean
  search: string
  onSearch: (value: string) => void
  onSelectProject: (cwd: string) => void
  onSelectThread: (id: string) => void
  onLoadMore: () => void
  onNew: () => void
  onVersions: () => void
  onRefresh: () => void
  onExit: () => void
  onThreadRenamed: (id: string, name: string) => void
  onThreadChanged: () => void
  onThreadDeleted: (id: string) => void
}

export function FocusSidebar({
  api,
  status,
  streamState,
  projects,
  totalThreads,
  runningCount,
  quota,
  quotaLoading,
  threads,
  threadsOwner,
  selectedCwd,
  selectedId,
  loading,
  hasMore,
  search,
  onSearch,
  onSelectProject,
  onSelectThread,
  onLoadMore,
  onNew,
  onVersions,
  onRefresh,
  onExit,
  onThreadRenamed,
  onThreadChanged,
  onThreadDeleted,
}: FocusSidebarProps) {
  const t = useT()
  const phase = status?.phase ?? 'connecting'
  const phaseClass = phase === 'ready' ? 'ok' : phase === 'error' ? 'error' : phase === 'connecting' ? 'warn' : ''
  const streamClass = streamState === 'open' ? 'ok' : streamState === 'closed' ? 'error' : 'warn'
  const quotaInfo = quota === null && quotaLoading ? { text: t('quota.loading') } : quotaSummary(quota, t)
  const envParts = [status?.kind ? t(`status.${status.kind}`) : '', status?.codexVersion ? t('status.version', { version: status.codexVersion }) : '']
    .filter((part) => part !== '')
    .join(' · ')
  const query = search.trim().toLowerCase()
  const searchText = search.trim()
  const searching = query !== ''
  const ownerMatchesTree = threadsOwner !== null && threadsOwner.search === '' && threadsOwner.cwd === selectedCwd
  const ownerMatchesSearch = threadsOwner !== null && threadsOwner.search === searchText
  const treeThreads = ownerMatchesTree ? threads : []
  const searchThreads = ownerMatchesSearch ? threads : []
  const treePending = loading || !ownerMatchesTree
  const searchPending = loading || !ownerMatchesSearch
  const matchingProjects = searching
    ? projects.filter((project) => `${project.name} ${project.cwd}`.toLowerCase().includes(query))
    : projects

  return (
    <aside className="dsh-codex-focus-sidebar">
      <div className="dsh-codex-focus-brand">
        <span className="dsh-codex-focus-logo">
          <CodexIcon size={20} />
        </span>
        <span className="dsh-codex-focus-brand-text">
          <strong>Codex CLI</strong>
          <small>{t('app.subtitle')}</small>
        </span>
      </div>

      <div className="dsh-codex-focus-status">
        <span className="dsh-codex-status-pill">
          <i className={`dsh-codex-dot ${phaseClass} ${phase === 'connecting' ? 'pulse' : ''}`} />
          {t(`status.${phase}`)}
        </span>
        <span className="dsh-codex-status-pill">
          <i className={`dsh-codex-dot ${streamClass} ${streamState === 'connecting' ? 'pulse' : ''}`} />
          {t(`status.events.${streamState}`)}
        </span>
      </div>

      <dl className="dsh-codex-focus-info">
        <dt>{t('info.env')}</dt>
        <dd>{envParts === '' ? '—' : envParts}</dd>
        <dt>{t('info.sessions')}</dt>
        <dd>
          {t('projects.count', { count: totalThreads })}
          {runningCount > 0 ? ` · ${t('projects.active', { count: runningCount })}` : ''}
        </dd>
        <dt>{t('info.quota')}</dt>
        <dd className="dsh-codex-quota" title={quotaInfo.title}>
          {quotaInfo.text}
        </dd>
      </dl>

      <div className="dsh-codex-focus-actions">
        <button type="button" className="dsh-codex-button primary" onClick={onNew}>
          {t('newThread.open')}
        </button>
        <button type="button" className="dsh-codex-button" onClick={onVersions}>
          {t('versions.open')}
        </button>
        <button type="button" className="dsh-codex-button" onClick={onRefresh}>
          {t('status.refresh')}
        </button>
      </div>

      <input
        className="dsh-codex-search focus"
        type="search"
        value={search}
        placeholder={t('focus.search')}
        onChange={(event) => onSearch(event.target.value)}
      />

      <div className="dsh-codex-focus-tree">
        {searching ? (
          <>
            <div className="dsh-codex-focus-section">{t('projects.title')}</div>
            {matchingProjects.length === 0 ? (
              <div className="dsh-codex-loading">{t('projects.noMatch')}</div>
            ) : (
              matchingProjects.map((project) => (
                <button
                  type="button"
                  key={project.cwd}
                  className="dsh-codex-tree-project"
                  onClick={() => onSelectProject(project.cwd)}
                >
                  <FolderGlyph />
                  <span className="dsh-codex-tree-project-name">
                    {project.name === '' ? project.cwd : project.name}
                  </span>
                  <span className="dsh-codex-tree-project-count">{project.threadCount}</span>
                </button>
              ))
            )}
            <div className="dsh-codex-focus-section">{t('threads.title')}</div>
            {searchThreads.length === 0 && !searchPending ? (
              <div className="dsh-codex-loading">{t('threads.noMatch')}</div>
            ) : (
              searchThreads.map((thread) => (
                <ThreadRow
                  key={thread.id}
                  api={api}
                  thread={thread}
                  selected={selectedId === thread.id}
                  showCwd
                  onSelect={onSelectThread}
                  onRenamed={onThreadRenamed}
                  onChanged={onThreadChanged}
                  onDeleted={onThreadDeleted}
                />
              ))
            )}
            {searchPending ? <div className="dsh-codex-loading">{t('threads.loading')}</div> : null}
            {ownerMatchesSearch && hasMore ? (
              <button type="button" className="dsh-codex-load-more" disabled={loading} onClick={onLoadMore}>
                {t('threads.loadMore')}
              </button>
            ) : null}
          </>
        ) : (
          <>
            {matchingProjects.map((project) => {
              const expanded = selectedCwd === project.cwd
              return (
                <React.Fragment key={project.cwd}>
                  <button
                    type="button"
                    className={`dsh-codex-tree-project ${expanded ? 'expanded' : ''}`}
                    aria-expanded={expanded}
                    onClick={() => onSelectProject(project.cwd)}
                  >
                    <FolderGlyph open={expanded} />
                    <span className="dsh-codex-tree-project-name">
                      {project.name === '' ? project.cwd : project.name}
                    </span>
                    <span className="dsh-codex-tree-project-count">{project.threadCount}</span>
                  </button>
                  {expanded ? (
                    <div className="dsh-codex-tree-sessions">
                      {treeThreads.map((thread) => (
                        <ThreadRow
                          key={thread.id}
                          api={api}
                          thread={thread}
                          selected={selectedId === thread.id}
                          showCwd={false}
                          onSelect={onSelectThread}
                          onRenamed={onThreadRenamed}
                          onChanged={onThreadChanged}
                          onDeleted={onThreadDeleted}
                        />
                      ))}
                      {treeThreads.length === 0 && !treePending ? (
                        <div className="dsh-codex-loading">{t('threads.empty')}</div>
                      ) : null}
                      {treePending ? <div className="dsh-codex-loading">{t('threads.loading')}</div> : null}
                      {ownerMatchesTree && hasMore ? (
                        <button type="button" className="dsh-codex-load-more" disabled={loading} onClick={onLoadMore}>
                          {t('threads.loadMore')}
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </React.Fragment>
              )
            })}
            {matchingProjects.length === 0 ? (
              <div className="dsh-codex-loading">{t('projects.noMatch')}</div>
            ) : null}
          </>
        )}
      </div>

      <div className="dsh-codex-focus-footer">
        <button type="button" className="dsh-codex-exit" onClick={onExit}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
            <path d="M9.5 4 5.5 8l4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          DeepSeek Harness
        </button>
      </div>
    </aside>
  )
}

function FolderGlyph({ open = false }: { open?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M1.9 4.3c0-.66.54-1.2 1.2-1.2h2.9l1.5 1.7h5.4c.66 0 1.2.54 1.2 1.2v6.3c0 .66-.54 1.2-1.2 1.2H3.1c-.66 0-1.2-.54-1.2-1.2V4.3Z"
        fill="currentColor"
        opacity={open ? 0.22 : 0.14}
      />
      <path
        d="M1.9 4.3c0-.66.54-1.2 1.2-1.2h2.9l1.5 1.7h5.4c.66 0 1.2.54 1.2 1.2v6.3c0 .66-.54 1.2-1.2 1.2H3.1c-.66 0-1.2-.54-1.2-1.2V4.3Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {open ? <path d="M2.2 7.1h11.6" stroke="currentColor" strokeWidth="1" /> : null}
    </svg>
  )
}

function quotaSummary(quota: RateLimits | null, t: (key: string, vars?: Record<string, string | number>) => string): { text: string, title?: string } {
  if (quota === null) return { text: t('quota.unknown') }
  if (quota.credits?.unlimited === true) return { text: t('quota.unlimited') }
  const parts: string[] = []
  const windows: RateLimitWindow[] = []
  if (quota.primary !== null) windows.push(quota.primary)
  if (quota.secondary !== null) windows.push(quota.secondary)
  for (const window of windows) {
    const percent = Math.max(0, Math.min(100, 100 - Math.round(window.usedPercent)))
    const label = windowLabel(window.windowDurationMins, t)
    parts.push(label === '' ? t('quota.remaining', { percent }) : `${label} ${t('quota.remaining', { percent })}`)
  }
  if (parts.length === 0 && quota.credits?.balance) parts.push(quota.credits.balance)
  if (quota.resetCredits > 0) parts.push(t('quota.resetCredits', { count: quota.resetCredits }))
  const resetsAt = quota.primary?.resetsAt
  const title = typeof resetsAt === 'number' ? t('quota.resetsAt', { time: formatDateTime(resetsAt * 1000) }) : undefined
  return { text: parts.length > 0 ? parts.join(' · ') : t('quota.unknown'), title }
}

function windowLabel(minutes: number | null, t: (key: string, vars?: Record<string, string | number>) => string): string {
  if (typeof minutes !== 'number' || minutes <= 0) return ''
  if (minutes >= 10080) return t('quota.window.weekly')
  if (minutes >= 1440) return t('quota.window.daily')
  if (minutes >= 300) return t('quota.window.5h')
  if (minutes >= 60) return t('quota.window.1h')
  return t('quota.window.minutes', { count: Math.round(minutes) })
}
