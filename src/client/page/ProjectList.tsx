/** 项目列表：搜索、收起/展开，按 cwd 聚合，带会话数、运行中数量、git 分支与最近活动。 */

import * as React from 'react'
import { useT } from '../i18n'
import type { Project } from '../types'
import { relativeTime } from '../utils'
import { useStoredCollapsed } from '../hooks'
import { SectionHeader } from './SectionHeader'

const PROJECT_PAGE = 10

export interface ProjectListProps {
  projects: Project[]
  totalThreads: number
  selectedCwd: string | null
  onSelect: (cwd: string | null) => void
}

export function ProjectList({ projects, totalThreads, selectedCwd, onSelect }: ProjectListProps) {
  const t = useT()
  const [search, setSearch] = React.useState('')
  const [collapsed, toggleCollapsed] = useStoredCollapsed('dsh-codex-projects-collapsed')
  const [visibleCount, setVisibleCount] = React.useState(PROJECT_PAGE)
  const query = search.trim().toLowerCase()
  const visible =
    query === ''
      ? projects
      : projects.filter((project) => `${project.name} ${project.cwd}`.toLowerCase().includes(query))
  const showAll = query === '' || t('projects.all').toLowerCase().includes(query)
  const shown = visible.slice(0, visibleCount)

  React.useEffect(() => {
    setVisibleCount(PROJECT_PAGE)
  }, [search])

  return (
    <div>
      <SectionHeader
        title={t('projects.title')}
        search={search}
        placeholder={t('projects.search')}
        collapsed={collapsed}
        onSearch={(value) => {
          setSearch(value)
          if (collapsed && value !== '') toggleCollapsed()
        }}
        onToggle={toggleCollapsed}
      />
      {collapsed ? null : (
        <>
          {showAll ? (
            <button
              type="button"
              className={`dsh-codex-project ${selectedCwd === null ? 'active' : ''}`}
              onClick={() => onSelect(null)}
            >
              <span className="dsh-codex-dot" />
              <span className="dsh-codex-project-main">
                <span className="dsh-codex-project-name">{t('projects.all')}</span>
                <span className="dsh-codex-project-meta">{t('projects.count', { count: totalThreads })}</span>
              </span>
            </button>
          ) : null}
          {shown.map((project) => (
            <button
              type="button"
              key={project.cwd}
              className={`dsh-codex-project ${selectedCwd === project.cwd ? 'active' : ''}`}
              title={project.cwd}
              onClick={() => onSelect(project.cwd)}
            >
              <span className={`dsh-codex-dot ${project.activeCount > 0 ? 'ok pulse' : ''}`} />
              <span className="dsh-codex-project-main">
                <span className="dsh-codex-project-name">{project.name === '' ? project.cwd : project.name}</span>
                <span className="dsh-codex-project-meta">
                  {t('projects.count', { count: project.threadCount })}
                  {project.activeCount > 0 ? ` · ${t('projects.active', { count: project.activeCount })}` : ''}
                  {typeof project.git?.branch === 'string' && project.git.branch !== '' ? ` · ${project.git.branch}` : ''}
                </span>
              </span>
              <span className="dsh-codex-project-meta">{relativeTime(project.lastUpdatedAt, t)}</span>
            </button>
          ))}
          {visible.length === 0 && !showAll ? (
            <div className="dsh-codex-loading">{t('projects.noMatch')}</div>
          ) : null}
          {visible.length > visibleCount ? (
            <button
              type="button"
              className="dsh-codex-load-more"
              onClick={() => setVisibleCount((previous) => previous + PROJECT_PAGE)}
            >
              {t('projects.loadMore')}
            </button>
          ) : null}
          {projects.length === 0 ? <div className="dsh-codex-loading">{t('projects.empty')}</div> : null}
        </>
      )}
    </div>
  )
}
