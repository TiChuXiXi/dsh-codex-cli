/** 会话操作：重命名、归档、Fork、导出、删除。 */

import * as React from 'react'
import { useT } from '../i18n'
import type { Api } from '../rpc'
import type { CodexThread } from '../types'
import { threadTitle } from '../utils'

export interface ThreadActionsProps {
  api: Api
  thread: CodexThread
  onRenamed: (name: string) => void
  onArchived: () => void
  onForked: (thread: CodexThread) => void
  onDeleted: () => void
}

export function ThreadActions({ api, thread, onRenamed, onArchived, onForked, onDeleted }: ThreadActionsProps) {
  const t = useT()
  const [dialog, setDialog] = React.useState<'rename' | 'delete' | null>(null)
  const [name, setName] = React.useState(thread.name ?? '')
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

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
      onArchived()
    })

  const fork = () =>
    run(async () => {
      const next = await api<CodexThread>('threads/fork', { threadId: thread.id })
      if (next !== null && next !== undefined) onForked(next)
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
    <div className="dsh-codex-thread-actions">
      <button type="button" className="dsh-codex-button" disabled={busy} onClick={openRename}>
        {t('actions.rename')}
      </button>
      <button type="button" className="dsh-codex-button" disabled={busy} onClick={() => void archive()}>
        {t('actions.archive')}
      </button>
      <button type="button" className="dsh-codex-button" disabled={busy} onClick={() => void fork()}>
        {t('actions.fork')}
      </button>
      <button type="button" className="dsh-codex-button" disabled={busy} onClick={() => void exportMarkdown()}>
        {t('actions.export')}
      </button>
      <button
        type="button"
        className="dsh-codex-button danger"
        disabled={busy}
        onClick={() => {
          setError(null)
          setDialog('delete')
        }}
      >
        {t('actions.delete')}
      </button>
      {error !== null && dialog === null ? <span className="dsh-codex-action-error">{error}</span> : null}

      {dialog === 'rename' ? (
        <div className="dsh-codex-dialog-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !busy) setDialog(null)
        }}>
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
        <div className="dsh-codex-dialog-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !busy) setDialog(null)
        }}>
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
    </div>
  )
}
