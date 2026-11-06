/** 会话行操作菜单：重命名、归档、Fork、导出、删除。 */

import * as React from 'react'
import { useT } from '../i18n'
import type { Api } from '../rpc'
import type { CodexThread } from '../types'
import { threadTitle } from '../utils'

/** 菜单宽度，与样式保持一致。 */
const MENU_WIDTH = 110

export interface ThreadRowMenuProps {
  api: Api
  thread: CodexThread
  onRenamed: (name: string) => void
  onChanged: () => void
  onDeleted: () => void
}

export function ThreadRowMenu({ api, thread, onRenamed, onChanged, onDeleted }: ThreadRowMenuProps) {
  const t = useT()
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)
  const [open, setOpen] = React.useState(false)
  const [position, setPosition] = React.useState<{ top: number, left: number } | null>(null)
  const [dialog, setDialog] = React.useState<'rename' | 'delete' | null>(null)
  const [name, setName] = React.useState(thread.name ?? '')
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open) return undefined
    // 只跟随侧栏滚动关闭；对话区流式输出时的自动滚动不应把菜单顶掉。
    const onScroll = (event: Event) => {
      const target = event.target
      if (target instanceof Element && target.closest('.dsh-codex-sidebar') !== null) setOpen(false)
    }
    const onResize = () => setOpen(false)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onResize)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const openMenu = () => {
    const element = triggerRef.current
    if (element === null) return
    const rect = element.getBoundingClientRect()
    setPosition({ top: rect.bottom + 4, left: Math.max(8, rect.right - MENU_WIDTH) })
    setOpen(true)
  }

  const run = async (action: () => Promise<void>) => {
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      await action()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setBusy(false)
    }
  }

  const openRename = () => {
    setName(thread.name ?? '')
    setError(null)
    setDialog('rename')
  }

  const saveRename = () =>
    run(async () => {
      const trimmed = name.trim()
      if (trimmed === '') {
        setError(t('actions.failed'))
        return
      }
      await api('threads/rename', { threadId: thread.id, name: trimmed })
      onRenamed(trimmed)
      setDialog(null)
    })

  const archive = () =>
    run(async () => {
      await api('threads/archive', { threadId: thread.id })
      onChanged()
    })

  const fork = () =>
    run(async () => {
      await api('threads/fork', { threadId: thread.id })
      onChanged()
    })

  const exportMarkdown = () =>
    run(async () => {
      const result = await api<{ filename: string, content: string }>('threads/export', { threadId: thread.id })
      const blob = new Blob([result.content], { type: 'text/markdown;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = result.filename
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 2000)
    })

  const remove = () =>
    run(async () => {
      await api('threads/delete', { threadId: thread.id })
      onDeleted()
      setDialog(null)
    })

  return (
    <span className="dsh-codex-row-menu">
      <button
        ref={triggerRef}
        type="button"
        className="dsh-codex-row-menu-trigger"
        aria-label={t('actions.menu')}
        title={t('actions.menu')}
        onClick={(event) => {
          event.stopPropagation()
          if (open) setOpen(false)
          else openMenu()
        }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <circle cx="3.2" cy="8" r="1.3" />
          <circle cx="8" cy="8" r="1.3" />
          <circle cx="12.8" cy="8" r="1.3" />
        </svg>
      </button>

      {open && position !== null ? (
        <>
          <div className="dsh-codex-row-menu-backdrop" onPointerDown={() => setOpen(false)} />
          <div
            className="dsh-codex-row-menu-pop"
            role="menu"
            style={{ top: position.top, left: position.left }}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" role="menuitem" onClick={() => { setOpen(false); openRename() }}>
              {t('actions.rename')}
            </button>
            <button type="button" role="menuitem" onClick={() => { setOpen(false); void archive() }}>
              {t('actions.archive')}
            </button>
            <button type="button" role="menuitem" onClick={() => { setOpen(false); void fork() }}>
              {t('actions.fork')}
            </button>
            <button type="button" role="menuitem" onClick={() => { setOpen(false); void exportMarkdown() }}>
              {t('actions.export')}
            </button>
            <button
              type="button"
              role="menuitem"
              className="danger"
              onClick={() => { setOpen(false); setError(null); setDialog('delete') }}
            >
              {t('actions.delete')}
            </button>
          </div>
        </>
      ) : null}

      {dialog === 'rename' ? (
        <div
          className="dsh-codex-dialog-backdrop"
          onClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !busy) setDialog(null)
          }}
        >
          <div className="dsh-codex-dialog" role="dialog" aria-modal="true">
            <header className="dsh-codex-dialog-head">{t('actions.renameTitle')}</header>
            <input
              className="dsh-codex-search"
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') void saveRename()
              }}
            />
            {error !== null ? <div className="dsh-codex-dialog-error">{error}</div> : null}
            <div className="dsh-codex-dialog-actions">
              <button type="button" className="dsh-codex-button" disabled={busy} onClick={() => setDialog(null)}>
                {t('actions.cancel')}
              </button>
              <button type="button" className="dsh-codex-button primary" disabled={busy} onClick={() => void saveRename()}>
                {t('actions.save')}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {dialog === 'delete' ? (
        <div
          className="dsh-codex-dialog-backdrop"
          onClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !busy) setDialog(null)
          }}
        >
          <div className="dsh-codex-dialog" role="dialog" aria-modal="true">
            <header className="dsh-codex-dialog-head">{t('actions.deleteTitle')}</header>
            <div className="dsh-codex-approval-meta">
              {t('actions.deleteBody', { name: threadTitle(thread) })}
            </div>
            {error !== null ? <div className="dsh-codex-dialog-error">{error}</div> : null}
            <div className="dsh-codex-dialog-actions">
              <button type="button" className="dsh-codex-button" disabled={busy} onClick={() => setDialog(null)}>
                {t('actions.cancel')}
              </button>
              <button type="button" className="dsh-codex-button danger" disabled={busy} onClick={() => void remove()}>
                {t('actions.confirmDelete')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </span>
  )
}
