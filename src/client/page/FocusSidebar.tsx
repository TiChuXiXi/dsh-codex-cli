/** Codex 模式左侧栏：品牌/状态、统计、操作、搜索、项目树与返回 DSH。 */

import * as React from 'react'
import {Icon,IconButton} from '../components/Icon'
import {OverflowLabel} from '../components/OverflowLabel'
import {SelectMenu} from '../components/SelectMenu'
import { useT } from '../i18n'
import type { Api } from '../rpc'
import type { CodexThread, HubStatus, Project, RateLimits, RateLimitWindow } from '../types'
import type { StreamState } from '../events'
import { CodexIcon } from '../components/CodexIcon'
import { formatDateTime } from '../utils'
import { ThreadRow } from './ThreadRow'
import { mergeProjectOrder, moveProject, sortProjects } from './projectOrder'

const PROJECT_ORDER_KEY = 'dsh-codex-project-order-v1'
const PROJECT_DRAG_TYPE = 'application/x-dsh-codex-project'

export interface FocusSidebarProps {
  provider: string
  onProviderChange: (provider: string) => void
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
  unread: Set<string>
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
  onNewProject: () => void
  onVersions: () => void
  onRefresh: () => void
  onExit: () => void
  onThreadRenamed: (id: string, name: string) => void
  onThreadChanged: () => void
  onThreadDeleted: (id: string) => void
}

export function FocusSidebar({
  api,
  provider,
  onProviderChange,
  status,
  streamState,
  projects,
  totalThreads,
  runningCount,
  quota,
  quotaLoading,
  threads,
  threadsOwner,
  unread,
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
  onNewProject,
  onVersions,
  onRefresh,
  onExit,
  onThreadRenamed,
  onThreadChanged,
  onThreadDeleted,
}: FocusSidebarProps) {
  const t = useT()
  const [orders, setOrders] = React.useState<Record<string, string[]>>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PROJECT_ORDER_KEY) || '{}')
      if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {}
      return Object.fromEntries(Object.entries(saved).filter(([, value]) => Array.isArray(value)).map(([key, value]) => [key, mergeProjectOrder(value as string[], [])]))
    } catch { return {} }
  })
  const [drag, setDrag] = React.useState<{ source: string, target: string | null, position: 'before' | 'after' } | null>(null)
  const dragSource = React.useRef<string | null>(null)
  React.useEffect(() => {
    setOrders(previous => {
      const old = previous[provider] ?? []
      const next = mergeProjectOrder(old, projects.map(project => project.cwd))
      return next.length === old.length ? previous : { ...previous, [provider]: next }
    })
  }, [provider, projects])
  React.useEffect(() => {
    try { localStorage.setItem(PROJECT_ORDER_KEY, JSON.stringify(orders)) } catch {}
  }, [orders])
  React.useEffect(() => { dragSource.current = null; setDrag(null) }, [provider, searchingKey(search)])
  const sortedProjects = sortProjects(projects, orders[provider] ?? [])
  const reorder = (source: string, target: string, position: 'before' | 'after') => {
    setOrders(previous => {
      const old = mergeProjectOrder(previous[provider] ?? [], projects.map(project => project.cwd))
      const next = moveProject(old, source, target, position)
      return next === old && previous[provider]?.length === old.length ? previous : { ...previous, [provider]: next }
    })
  }
  const [now, setNow] = React.useState(() => Date.now())
  React.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(timer)
  }, [])
  const phase = status?.phase ?? 'connecting'
  const phaseClass = phase === 'ready' ? 'ok' : phase === 'error' ? 'error' : phase === 'connecting' ? 'warn' : ''
  const streamClass = streamState === 'open' ? 'ok' : streamState === 'closed' ? 'error' : 'warn'
  const quotaInfo = quota === null && quotaLoading ? { text: t('quota.loading') } : quotaSummary(quota, t, now)
  const envParts = [status?.kind ? t(`status.${status.kind}`) : '', status?.codexVersion ? t('status.version', { version: status.codexVersion }) : '']
    .filter((part) => part !== '')
    .join(' · ')
  const isUnread = (thread: CodexThread): boolean => {
    return thread.status?.type !== 'active' && unread.has(thread.id)
  }
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
    ? sortedProjects.filter((project) => `${project.name} ${project.cwd}`.toLowerCase().includes(query))
    : sortedProjects

  return (
    <aside id="dsh-codex-project-nav" className="dsh-codex-focus-sidebar" aria-label="项目与会话">
      <div className="dsh-codex-focus-brand">
        <span className="dsh-codex-focus-logo">
          <CodexIcon size={20} />
        </span>
        <span className="dsh-codex-focus-brand-text">
          <strong>Codex <small>CLI</small></strong>

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
          <Icon name="plus" size={17}/>{t('newThread.open')}
        </button>
        <button type="button" className="dsh-codex-button" title={t('versions.open')} onClick={onVersions}>
          {t('versions.open')}
        </button>
        <IconButton icon="refresh" label={t('status.refresh')} onClick={onRefresh}/>
      </div>

      <div className="dsh-codex-focus-search-row">
        <input
          className="dsh-codex-search focus"
          type="search"
          value={search}
          placeholder={t('focus.search')}
          onChange={(event) => onSearch(event.target.value)}
        />
        <button
          type="button"
          className="dsh-codex-icon-button focus-new-project"
          title={t('focus.newProject')}
          aria-label={t('focus.newProject')}
          onClick={onNewProject}
        >
          <FolderPlusGlyph />
        </button>
      </div>

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
                  <OverflowLabel className="dsh-codex-tree-project-name" text={project.name === '' ? project.cwd : project.name} />
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
                  unread={isUnread(thread)}
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
                <div key={project.cwd} className={'dsh-codex-project-group' + (drag?.source === project.cwd ? ' is-dragging' : '') + (drag?.target === project.cwd ? ' drop-' + drag.position : '')}>
                  <button
                    type="button"
                    className={`dsh-codex-tree-project ${expanded ? 'expanded' : ''}`}
                    aria-expanded={expanded}
                    aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown"
                    title="拖动调整项目顺序，也可按 Alt+上下方向键调整"
                    draggable
                    onDragStart={event => {
                      dragSource.current = project.cwd
                      event.dataTransfer.effectAllowed = 'move'
                      event.dataTransfer.setData(PROJECT_DRAG_TYPE, project.cwd)
                      setDrag({ source: project.cwd, target: null, position: 'before' })
                    }}
                    onDragEnd={() => { dragSource.current = null; setDrag(null) }}
                    onDragOver={event => {
                      const source = dragSource.current
                      if (!source || source === project.cwd || !Array.from(event.dataTransfer.types).includes(PROJECT_DRAG_TYPE)) return
                      event.preventDefault()
                      event.dataTransfer.dropEffect = 'move'
                      const bounds = event.currentTarget.getBoundingClientRect()
                      const position = event.clientY < bounds.top + bounds.height / 2 ? 'before' : 'after'
                      setDrag(current => current?.target === project.cwd && current.position === position ? current : { source, target: project.cwd, position })
                    }}
                    onDragLeave={event => {
                      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                        setDrag(current => current?.target === project.cwd ? { ...current, target: null } : current)
                      }
                    }}
                    onDrop={event => {
                      const source = dragSource.current
                      if (!source || !Array.from(event.dataTransfer.types).includes(PROJECT_DRAG_TYPE)) return
                      event.preventDefault()
                      const bounds = event.currentTarget.getBoundingClientRect()
                      reorder(source, project.cwd, event.clientY < bounds.top + bounds.height / 2 ? 'before' : 'after')
                      dragSource.current = null; setDrag(null)
                    }}
                    onKeyDown={event => {
                      if (!event.altKey || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')) return
                      event.preventDefault()
                      const index = sortedProjects.findIndex(item => item.cwd === project.cwd)
                      const target = sortedProjects[index + (event.key === 'ArrowUp' ? -1 : 1)]
                      if (target) reorder(project.cwd, target.cwd, event.key === 'ArrowUp' ? 'before' : 'after')
                    }}
                    onClick={() => onSelectProject(project.cwd)}
                  >
                    <FolderGlyph open={expanded} />
                    <OverflowLabel className="dsh-codex-tree-project-name" text={project.name === '' ? project.cwd : project.name} />
                    <span className="dsh-codex-tree-project-count">{project.threadCount}</span>
                  </button>
                  <AnimatedSessions expanded={expanded}>
                    <div className="dsh-codex-tree-sessions">
                      {treeThreads.map((thread) => (
                        <ThreadRow
                          key={thread.id}
                          api={api}
                          thread={thread}
                          selected={selectedId === thread.id}
                          unread={isUnread(thread)}
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
                  </AnimatedSessions>
                </div>
              )
            })}
            {matchingProjects.length === 0 ? (
              <div className="dsh-codex-loading">{t('projects.noMatch')}</div>
            ) : null}
          </>
        )}
      </div>

      <div className="dsh-codex-focus-footer">
        <div className="dsh-codex-provider-picker"><span>提供商</span>
          <SelectMenu label="提供商" value={provider} direction="up" onChange={onProviderChange} options={[{value:'openai',label:'ChatGPT'},{value:'opencode-go',label:'OpenCode Go'}]} />
        </div>
        <div className="dsh-codex-sidebar-health"><span className={'dsh-codex-dot '+phaseClass}/><span>{t(`status.${phase}`)}</span><IconButton icon="settings" label="版本与连接" onClick={onVersions}/></div>
        <QuotaPopover quota={quota} loading={quotaLoading} now={now} t={t} />
        <button type="button" className="dsh-codex-sidebar-exit" onClick={onExit}><Icon name="arrowLeft" size={16}/>返回 DeepSeek Harness</button>
      </div>
    </aside>
  )
}

function searchingKey(search: string): boolean { return search.trim() !== '' }

function AnimatedSessions({expanded, children}: {expanded: boolean, children: React.ReactNode}) {
  const retained = React.useRef(children)
  if (expanded) retained.current = children
  return <div className={'dsh-codex-sessions-transition' + (expanded ? ' is-expanded' : '')} aria-hidden={!expanded} inert={!expanded}><div>{retained.current}</div></div>
}

function FolderPlusGlyph(){return <Icon name="folderPlus" size={17}/>}

function FolderGlyph({open=false}:{open?:boolean}){return <Icon name={open?'folderOpen':'folder'} size={17}/>}

function QuotaRing({remaining}: {remaining?: number}) {
  return <svg className="quota-ring" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="none" className="quota-ring-track" strokeWidth="2"/>
    {remaining !== undefined && remaining > 0 && <circle cx="12" cy="12" r="10" fill="none" className="quota-ring-value" strokeWidth="2" strokeLinecap="round" pathLength="100" strokeDasharray={`${remaining} 100`} transform="rotate(-90 12 12)"/>}
    <path className="quota-ring-icon" d="M13.3 6.8 9 12.5h3l-1.3 4.7 4.3-5.7h-3z"/>
  </svg>
}

function QuotaPopover({quota, loading, now, t}: {quota: RateLimits | null; loading: boolean; now: number; t: (key: string, vars?: Record<string, string | number>) => string}) {
  const [open, setOpen] = React.useState(false)
  const root = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (!open) return
    const pointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        root.current?.querySelector<HTMLButtonElement>('.quota-trigger')?.focus()
      }
    }
    document.addEventListener('pointerdown', pointer)
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('pointerdown', pointer)
      document.removeEventListener('keydown', key)
    }
  }, [open])
  const windows = [quota?.primary, quota?.secondary, quota?.monthly].filter((value): value is RateLimitWindow => value != null)
  const unlimited = quota?.credits?.unlimited === true
  return <div className="dsh-codex-sidebar-quota" ref={root}>
    <button type="button" className="quota-trigger" aria-expanded={open} aria-controls="quota-details" onClick={() => setOpen(value => !value)}>
      {windows.length > 0 && !unlimited ? windows.map((item, index) => {
        const remaining = Math.max(0, Math.min(100, 100 - Math.round(item.usedPercent)))
        return <span className="quota-chip" key={index}>
          <QuotaRing remaining={remaining}/>
          <span>{windowLabel(item.windowDurationMins, t)} · {t('quota.remaining', {percent: remaining})}</span>
        </span>
      }) : <span className="quota-chip"><QuotaRing/>{loading && !quota ? t('quota.loading') : quotaSummary(quota, t, now).text}</span>}
    </button>
    {open && <div id="quota-details" className="quota-popover" role="dialog" aria-label={t('quota.details')}>
      <div className="quota-popover-header"><strong>{t('quota.details')}</strong><button type="button" aria-label={t('quota.close')} onClick={() => setOpen(false)}>×</button></div>
      {windows.length > 0 && !unlimited ? windows.map((item, index) => {
        const remaining = Math.max(0, Math.min(100, 100 - Math.round(item.usedPercent)))
        const details = quotaSummary({...quota!, primary: item, secondary: null, monthly: null, resetCredits: 0}, t, now)
        return <div className="quota-detail" key={index}>
          <div className="quota-detail-heading"><strong>{windowLabel(item.windowDurationMins, t) || t('info.quota')}</strong><span>{t('quota.remaining', {percent: remaining})}</span></div>
          <div className="quota-progress" role="progressbar" aria-label={windowLabel(item.windowDurationMins, t) || t('info.quota')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={remaining}><span style={{width: remaining + '%'}}/></div>
          <div className="quota-reset-box">
            <Icon name="history" size={15}/>
            <div>
              <div className="quota-detail-reset">{details.text.split(' · ').slice(1).join(' · ') || t('quota.resetUnknown')}</div>
              {item.resetsAt != null && item.resetsAt > 0 && Number.isFinite(item.resetsAt) && <div className="quota-detail-date">{t('quota.resetsAt', {time: formatDateTime(item.resetsAt * 1000)})}</div>}
            </div>
          </div>
        </div>
      }) : <div className="quota-detail-reset">{loading && !quota ? t('quota.loading') : quotaSummary(quota, t, now).text}</div>}
      {quota && (quota.resetCredits > 0 || quota.credits?.balance) && <div className="quota-detail-extra">
        {quota.resetCredits > 0 && <span>{t('quota.resetCredits', {count: quota.resetCredits})}</span>}
        {quota.credits?.balance && <span>{t('quota.balance', {balance: quota.credits.balance})}</span>}
      </div>}
    </div>}
  </div>
}

function quotaSummary(quota: RateLimits | null, t: (key: string, vars?: Record<string, string | number>) => string, now: number): { text: string, title?: string } {
  if (quota === null) return { text: t('quota.unknown') }
  if (quota.credits?.unlimited === true) return { text: t('quota.unlimited') }
  const parts: string[] = []
  const windows: RateLimitWindow[] = []
  if (quota.primary !== null) windows.push(quota.primary)
  if (quota.secondary !== null) windows.push(quota.secondary)
  if (quota.monthly != null) windows.push(quota.monthly)
  const titles: string[] = []
  for (const window of windows) {
    const percent = Math.max(0, Math.min(100, 100 - Math.round(window.usedPercent)))
    const label = windowLabel(window.windowDurationMins, t)
    let part = label === '' ? t('quota.remaining', { percent }) : `${label} ${t('quota.remaining', { percent })}`
    if (typeof window.resetsAt === 'number' && Number.isFinite(window.resetsAt) && window.resetsAt > 0) {
      const minutes = Math.ceil((window.resetsAt * 1000 - now) / 60000)
      if (minutes > 0) {
        const days = Math.floor(minutes / 1440), hours = Math.floor((minutes % 1440) / 60), mins = minutes % 60
        const duration = [days ? t('quota.duration.days', { count: days }) : '', hours ? t('quota.duration.hours', { count: hours }) : '', !days && !hours && mins ? t('quota.duration.minutes', { count: mins }) : ''].filter(Boolean).join('')
        part += ' · ' + t('quota.resetsIn', { time: duration.trim() })
      } else part += ' · ' + t('quota.resetDue')
      titles.push((label ? label + ' ' : '') + t('quota.resetsAt', { time: formatDateTime(window.resetsAt * 1000) }))
    }
    parts.push(part)
  }
  if (parts.length === 0 && quota.credits?.balance) parts.push(quota.credits.balance)
  if (quota.resetCredits > 0) parts.push(t('quota.resetCredits', { count: quota.resetCredits }))
  const title = titles.length ? titles.join(' · ') : undefined
  return { text: parts.length > 0 ? parts.join(' · ') : t('quota.unknown'), title }
}

function windowLabel(minutes: number | null, t: (key: string, vars?: Record<string, string | number>) => string): string {
  if (typeof minutes !== 'number' || minutes <= 0) return ''
  if (minutes >= 43200) return '月'
  if (minutes >= 10080) return t('quota.window.weekly')
  if (minutes >= 1440) return t('quota.window.daily')
  if (minutes >= 300) return t('quota.window.5h')
  if (minutes >= 60) return t('quota.window.1h')
  return t('quota.window.minutes', { count: Math.round(minutes) })
}
