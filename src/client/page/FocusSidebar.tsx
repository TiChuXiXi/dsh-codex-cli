/** Codex 模式左侧栏：品牌/状态、统计、操作、搜索、项目树与返回 DSH。 */

import * as React from 'react'
import { useT } from '../i18n'
import type { Api } from '../rpc'
import type { CodexThread, HubStatus, Project } from '../types'
import type { StreamState } from '../events'
import { CodexIcon } from '../components/CodexIcon'
import { ThreadRow } from './ThreadRow'

export interface FocusSidebarProps {
  api: Api
  status: HubStatus | null
  streamState: StreamState
  projects: Project[]
  totalThreads: number
  runningCount: number
  threads: CodexThread[]
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
  threads,
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
  const phaseClass = phase === 'ready' ? 'ok' : phase === 'error' ? 'error' : 'warn'
  const query = search.trim().toLowerCase()
  const searching = query !== ''
  const matchingProjects = searching
    ? projects.filter((project) => `${project.name} ${project.cwd}`.toLowerCase().includes(query))
    : projects

  const rows = (showCwd: boolean) =>
    threads.map((thread) => (
      <ThreadRow
        key={thread.id}
        api={api}
        thread={thread}
        selected={selectedId === thread.id}
        showCwd={showCwd}
        onSelect={onSelectThread}
        onRenamed={onThreadRenamed}
        onChanged={onThreadChanged}
        onDeleted={onThreadDeleted}
      />
    ))

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
        <span className="dsh-codex-focus-status-item">
          <i className={`dsh-codex-dot ${phaseClass} ${phase === 'connecting' ? 'pulse' : ''}`} />
          {t(`status.${phase}`)}
        </span>
        {status?.kind ? <span>{t(`status.${status.kind}`)}</span> : null}
        {status?.codexVersion ? (
          <span>{t('status.version', { version: status.codexVersion })}</span>
        ) : null}
        <span className="dsh-codex-focus-status-item">
          <i className={`dsh-codex-dot ${streamState === 'open' ? 'ok' : 'warn'} ${streamState === 'connecting' ? 'pulse' : ''}`} />
          {t(`status.events.${streamState}`)}
        </span>
      </div>

      <div className="dsh-codex-focus-stats">
        {t('projects.count', { count: totalThreads })}
        {runningCount > 0 ? ` · ${t('projects.active', { count: runningCount })}` : ''}
      </div>

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
            {threads.length === 0 && !loading ? (
              <div className="dsh-codex-loading">{t('threads.noMatch')}</div>
            ) : (
              rows(true)
            )}
            {loading ? <div className="dsh-codex-loading">{t('threads.loading')}</div> : null}
            {hasMore ? (
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
                      {rows(false)}
                      {threads.length === 0 && !loading ? (
                        <div className="dsh-codex-loading">{t('threads.empty')}</div>
                      ) : null}
                      {loading ? <div className="dsh-codex-loading">{t('threads.loading')}</div> : null}
                      {hasMore ? (
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
