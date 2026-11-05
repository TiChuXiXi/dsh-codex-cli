/** 项目列表：按 cwd 聚合，带会话数、运行中数量、git 分支与最近活动。 */

import * as React from 'react'
import { useT } from '../i18n'
import type { Project } from '../types'
import { relativeTime } from '../utils'

export interface ProjectListProps {
  projects: Project[]
  totalThreads: number
  selectedCwd: string | null
  onSelect: (cwd: string | null) => void
}

export function ProjectList({ projects, totalThreads, selectedCwd, onSelect }: ProjectListProps) {
  const t = useT()
  return (
    <div>
      <div className="dsh-codex-section-title">{t('projects.title')}</div>
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
      {projects.map((project) => (
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
      {projects.length === 0 ? <div className="dsh-codex-loading">{t('projects.empty')}</div> : null}
    </div>
  )
}
