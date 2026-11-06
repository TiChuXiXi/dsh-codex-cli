/** 新建项目：仿 DSH「选择工作区目录」的 Miller 分栏浏览，可在任意层级新建文件夹后选中。 */

import * as React from 'react'
import { useT } from '../i18n'
import type { Api } from '../rpc'

export interface DirEntry {
  name: string
  path: string
  type: 'dir' | 'file'
  hidden?: boolean
}

export interface DirectoryListing {
  path: string
  parent: string | null
  home: string
  crumbs: Array<{ name: string, path: string }>
  entries: DirEntry[]
  truncated?: boolean
}

export interface DirectoryPickerDialogProps {
  open: boolean
  api: Api
  /** 确认某个目录：父级用它建项目会话，抛错则留在对话框里显示。 */
  onPick: (cwd: string) => Promise<void>
  onClose: () => void
}

function messageOf(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause)
}

function dirsOf(listing: DirectoryListing | null, showHidden: boolean): DirEntry[] {
  return (listing?.entries ?? []).filter(
    (entry) => entry.type === 'dir' && (showHidden || entry.hidden !== true),
  )
}

export function DirectoryPickerDialog({ open, api, onPick, onClose }: DirectoryPickerDialogProps) {
  const t = useT()
  const [listing, setListing] = React.useState<DirectoryListing | null>(null)
  const [child, setChild] = React.useState<DirectoryListing | null>(null)
  const [selected, setSelected] = React.useState<DirEntry | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [childLoading, setChildLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [childError, setChildError] = React.useState<string | null>(null)
  const [showHidden, setShowHidden] = React.useState(false)
  const [pathDraft, setPathDraft] = React.useState<string | null>(null)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [createName, setCreateName] = React.useState('')
  const [createError, setCreateError] = React.useState<string | null>(null)
  const [creating, setCreating] = React.useState(false)
  const [busy, setBusy] = React.useState(false)
  const requestRef = React.useRef(0)
  const childRequestRef = React.useRef(0)
  const firstColumnRef = React.useRef<HTMLDivElement | null>(null)
  const childColumnRef = React.useRef<HTMLDivElement | null>(null)
  const dialogRef = React.useRef<HTMLDivElement | null>(null)

  const load = React.useCallback(
    async (target?: string): Promise<boolean> => {
      const request = ++requestRef.current
      setLoading(true)
      setError(null)
      try {
        const result = await api<DirectoryListing>('fs/list', target === undefined ? {} : { path: target })
        if (request !== requestRef.current) return false
        setListing(result)
        setSelected(null)
        setChild(null)
        setChildError(null)
        setPathDraft(null)
        setCreateOpen(false)
        setCreateError(null)
        return true
      } catch (cause) {
        if (request !== requestRef.current) return false
        setError(messageOf(cause))
        return false
      } finally {
        if (request === requestRef.current) setLoading(false)
      }
    },
    [api],
  )

  // 打开时重置，并从宿主家目录（~）开始浏览。
  React.useEffect(() => {
    if (!open) return
    setListing(null)
    setChild(null)
    setSelected(null)
    setShowHidden(false)
    setPathDraft(null)
    setCreateOpen(false)
    setCreateName('')
    setCreateError(null)
    setBusy(false)
    void load()
  }, [open])

  // 打开后把焦点收进对话框，Escape 才能直接生效。
  React.useEffect(() => {
    if (open) dialogRef.current?.focus()
  }, [open])

  // Escape 走 window 级监听：路径编辑、创建表单、对话框按层级依次关闭。
  React.useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (pathDraft !== null) {
        setPathDraft(null)
        return
      }
      if (createOpen) {
        if (!creating) setCreateOpen(false)
        return
      }
      if (!busy) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, pathDraft, createOpen, creating, busy, onClose])

  // 换层或换选中项时把对应列滚回顶部，避免停在上一层的滚动位置。
  React.useEffect(() => {
    if (firstColumnRef.current !== null) firstColumnRef.current.scrollTop = 0
  }, [listing?.path])
  React.useEffect(() => {
    if (childColumnRef.current !== null) childColumnRef.current.scrollTop = 0
  }, [child?.path])

  const select = React.useCallback(
    async (entry: DirEntry) => {
      setSelected(entry)
      setCreateOpen(false)
      setCreateError(null)
      const request = ++childRequestRef.current
      setChild(null)
      setChildError(null)
      setChildLoading(true)
      try {
        const result = await api<DirectoryListing>('fs/list', { path: entry.path })
        if (request !== childRequestRef.current) return
        setChild(result)
      } catch (cause) {
        if (request !== childRequestRef.current) return
        setChildError(messageOf(cause))
      } finally {
        if (request === childRequestRef.current) setChildLoading(false)
      }
    },
    [api],
  )

  if (!open) return null

  const enter = (path: string) => {
    if (busy) return
    void load(path)
  }

  const onRowClick = (entry: DirEntry) => {
    if (busy) return
    if (selected?.path === entry.path) {
      enter(entry.path)
      return
    }
    void select(entry)
  }

  const targetPath = selected?.path ?? listing?.path ?? null
  const currentName = listing === null
    ? ''
    : listing.path === listing.home
      ? t('browse.home')
      : listing.crumbs.at(-1)?.name ?? listing.path
  const targetName = selected?.name ?? currentName
  const hiddenDirs = (listing?.entries ?? []).filter((entry) => entry.type === 'dir' && entry.hidden === true).length
  const visibleDirs = dirsOf(listing, showHidden)
  const childDirs = dirsOf(child, showHidden)
  const childHiddenDirs = (child?.entries ?? []).filter((entry) => entry.type === 'dir' && entry.hidden === true).length

  const startCreate = () => {
    if (targetPath === null || loading || busy) return
    setCreateOpen(true)
    setCreateName('')
    setCreateError(null)
  }

  const confirmCreate = async () => {
    if (targetPath === null || creating || busy) return
    const name = createName.trim()
    if (name === '') return
    setCreating(true)
    setCreateError(null)
    try {
      const created = await api<{ path: string, name: string }>('fs/mkdir', { path: targetPath, name })
      setCreateOpen(false)
      setCreateName('')
      const ok = await load(targetPath)
      if (ok) {
        await select({ name: created.name, path: created.path, type: 'dir', hidden: created.name.startsWith('.') })
      }
    } catch (cause) {
      setCreateError(messageOf(cause))
    } finally {
      setCreating(false)
    }
  }

  const confirmPick = async () => {
    if (targetPath === null || busy) return
    setBusy(true)
    setError(null)
    try {
      await onPick(targetPath)
    } catch (cause) {
      setError(messageOf(cause))
    } finally {
      setBusy(false)
    }
  }

  const close = () => {
    if (busy) return
    onClose()
  }

  return (
    <div
      className="dsh-codex-dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <div
        className="dsh-codex-dialog dsh-codex-browse"
        role="dialog"
        aria-modal="true"
        aria-label={t('browse.title')}
        tabIndex={-1}
        ref={dialogRef}
      >
        <header className="dsh-codex-browse-head">
          <div className="dsh-codex-browse-title">{t('browse.title')}</div>
          {pathDraft === null ? (
            <>
              <div className="dsh-codex-browse-crumbs" role="navigation">
                {(listing?.crumbs ?? []).map((crumb, index, all) => (
                  <React.Fragment key={crumb.path}>
                    {index > 0 ? <span className="dsh-codex-browse-chevron">›</span> : null}
                    <button
                      type="button"
                      className={`dsh-codex-browse-crumb ${index === all.length - 1 ? 'current' : ''}`}
                      disabled={loading || busy || index === all.length - 1}
                      onClick={() => enter(crumb.path)}
                    >
                      {index === 0 && crumb.name === '/' ? '/' : crumb.name}
                    </button>
                  </React.Fragment>
                ))}
              </div>
              <button
                type="button"
                className="dsh-codex-icon-button"
                title={t('browse.editPath')}
                aria-label={t('browse.editPath')}
                disabled={listing === null || loading || busy}
                onClick={() => setPathDraft(listing === null ? '' : `${listing.path}/`)}
              >
                <PencilGlyph />
              </button>
              <button
                type="button"
                className="dsh-codex-icon-button"
                title={t('browse.up')}
                aria-label={t('browse.up')}
                disabled={listing?.parent === null || listing === null || loading || busy}
                onClick={() => {
                  if (listing?.parent !== null && listing !== null) enter(listing.parent)
                }}
              >
                <UpGlyph />
              </button>
            </>
          ) : (
            <input
              className="dsh-codex-search compact dsh-codex-browse-path"
              value={pathDraft}
              autoFocus
              aria-label={t('browse.editPath')}
              onChange={(event) => setPathDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  const next = pathDraft.trim()
                  if (next !== '') void load(next)
                }
              }}
            />
          )}
        </header>

        <div className="dsh-codex-browse-body">
          <div className="dsh-codex-browse-col" ref={firstColumnRef}>
            {visibleDirs.map((entry) => (
              <div
                key={entry.path}
                className={`dsh-codex-browse-row-wrap ${selected?.path === entry.path ? 'selected' : ''}`}
                ref={(node) => {
                  if (node !== null && selected?.path === entry.path) node.scrollIntoView({ block: 'nearest' })
                }}
              >
                <button
                  type="button"
                  className="dsh-codex-browse-row"
                  title={entry.path}
                  disabled={busy}
                  onClick={() => onRowClick(entry)}
                  onDoubleClick={() => enter(entry.path)}
                >
                  <FolderGlyph />
                  <span className="dsh-codex-browse-row-name">{entry.name}</span>
                </button>
                <button
                  type="button"
                  className="dsh-codex-browse-enter"
                  title={t('browse.enter')}
                  aria-label={`${t('browse.enter')} ${entry.name}`}
                  disabled={busy}
                  onClick={() => enter(entry.path)}
                >
                  <ChevronGlyph />
                </button>
              </div>
            ))}
            {loading ? <div className="dsh-codex-browse-empty">{t('browse.loading')}</div> : null}
            {!loading && visibleDirs.length === 0 ? (
              <div className="dsh-codex-browse-empty">
                {hiddenDirs > 0 && !showHidden
                  ? t('browse.hiddenOnly', { count: hiddenDirs })
                  : t('browse.empty')}
              </div>
            ) : null}
          </div>
          {selected !== null ? (
            <div className="dsh-codex-browse-col" ref={childColumnRef}>
              <div className="dsh-codex-browse-col-head" title={selected.path}>{selected.name}</div>
              {childDirs.map((entry) => (
                <button
                  type="button"
                  key={entry.path}
                  className="dsh-codex-browse-row"
                  title={entry.path}
                  disabled={busy}
                  onClick={() => enter(entry.path)}
                >
                  <FolderGlyph />
                  <span className="dsh-codex-browse-row-name">{entry.name}</span>
                </button>
              ))}
              {childLoading ? <div className="dsh-codex-browse-empty">{t('browse.loading')}</div> : null}
              {childError !== null ? <div className="dsh-codex-dialog-error">{childError}</div> : null}
              {!childLoading && childError === null && childDirs.length === 0 ? (
                <div className="dsh-codex-browse-empty">
                  {childHiddenDirs > 0 && !showHidden
                    ? t('browse.hiddenOnly', { count: childHiddenDirs })
                    : t('browse.empty')}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {listing?.truncated === true || child?.truncated === true ? (
          <div className="dsh-codex-browse-note">{t('browse.truncated')}</div>
        ) : null}

        {createOpen ? (
          <div className="dsh-codex-browse-create">
            <div className="dsh-codex-browse-create-label">{t('browse.createIn', { name: targetName })}</div>
            <div className="dsh-codex-browse-create-row">
              <input
                className="dsh-codex-search compact"
                value={createName}
                autoFocus
                aria-label={t('browse.folderName')}
                placeholder={t('browse.untitledFolder')}
                disabled={creating}
                onChange={(event) => setCreateName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    void confirmCreate()
                  }
                }}
              />
              <button
                type="button"
                className="dsh-codex-button primary"
                disabled={creating || createName.trim() === ''}
                onClick={() => void confirmCreate()}
              >
                {creating ? t('browse.creating') : t('browse.create')}
              </button>
              <button
                type="button"
                className="dsh-codex-button"
                disabled={creating}
                onClick={() => setCreateOpen(false)}
              >
                {t('browse.cancel')}
              </button>
            </div>
            {createError !== null ? <div className="dsh-codex-dialog-error">{createError}</div> : null}
          </div>
        ) : null}

        <footer className="dsh-codex-browse-foot">
          <div className="dsh-codex-browse-target" title={targetPath ?? ''}>
            <span>{t('browse.target')}</span>
            <code>{targetPath ?? '—'}</code>
          </div>
          <div className="dsh-codex-browse-actions">
            <button
              type="button"
              className="dsh-codex-button"
              disabled={targetPath === null || loading || busy || creating}
              onClick={startCreate}
            >
              <PlusGlyph />
              {t('browse.newFolder')}
            </button>
            <button
              type="button"
              className={`dsh-codex-browse-toggle ${showHidden ? 'active' : ''}`}
              aria-pressed={showHidden}
              disabled={busy}
              onClick={() => setShowHidden((previous) => !previous)}
            >
              {t('browse.showHidden')}
            </button>
            <span className="dsh-codex-browse-spacer" />
            <button type="button" className="dsh-codex-button" disabled={busy} onClick={close}>
              {t('browse.cancel')}
            </button>
            <button
              type="button"
              className="dsh-codex-button primary"
              disabled={targetPath === null || loading || busy || creating}
              onClick={() => void confirmPick()}
            >
              {busy ? t('browse.creating') : t('browse.open')}
            </button>
          </div>
        </footer>

        {error !== null ? <div className="dsh-codex-browse-error">{error}</div> : null}
      </div>
    </div>
  )
}

function FolderGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="dsh-codex-browse-glyph">
      <path
        d="M1.9 4.3c0-.66.54-1.2 1.2-1.2h2.9l1.5 1.7h5.4c.66 0 1.2.54 1.2 1.2v6.3c0 .66-.54 1.2-1.2 1.2H3.1c-.66 0-1.2-.54-1.2-1.2V4.3Z"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        d="M1.9 4.3c0-.66.54-1.2 1.2-1.2h2.9l1.5 1.7h5.4c.66 0 1.2.54 1.2 1.2v6.3c0 .66-.54 1.2-1.2 1.2H3.1c-.66 0-1.2-.54-1.2-1.2V4.3Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PlusGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M8 3.5v9M3.5 8h9" strokeLinecap="round" />
    </svg>
  )
}

function ChevronGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="m6 4 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PencilGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M2.8 13.2 3.4 10l7-7 2.6 2.6-7 7-3.2.6Z" strokeLinejoin="round" />
      <path d="m9.6 3.8 2.6 2.6" strokeLinecap="round" />
    </svg>
  )
}

function UpGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path d="M8 12V4M4 8l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
