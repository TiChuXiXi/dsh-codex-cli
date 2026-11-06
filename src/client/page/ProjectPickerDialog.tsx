/** 选择项目：从现有项目进入，或输入新目录并确认信任后新建会话。 */

import * as React from 'react'
import { useT } from '../i18n'
import type { Api } from '../rpc'
import type { Project } from '../types'

export interface ProjectPickerDialogProps {
  open: boolean
  api: Api
  projects: Project[]
  trusted: string[]
  onPick: (cwd: string) => Promise<void>
  onClose: () => void
}

export function ProjectPickerDialog({ open, api, projects, trusted, onPick, onClose }: ProjectPickerDialogProps) {
  const t = useT()
  const [path, setPath] = React.useState('')
  const [trust, setTrust] = React.useState(false)
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open) return
    setPath('')
    setTrust(false)
    setBusy(false)
    setError(null)
  }, [open])

  if (!open) return null

  const trimmed = path.trim()
  const alreadyTrusted = trimmed !== '' && trusted.includes(trimmed)

  const pick = async (cwd: string) => {
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      await onPick(cwd)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setBusy(false)
    }
  }

  const create = async () => {
    if (trimmed === '') {
      setError(t('picker.path'))
      return
    }
    if (!alreadyTrusted && !trust) {
      setError(t('picker.needTrust'))
      return
    }
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      const info = await api<{ path: string, exists: boolean, isDirectory: boolean }>('fs/check', { path: trimmed })
      if (!info.exists) {
        setError(t('picker.notFound', { path: trimmed }))
        return
      }
      if (!info.isDirectory) {
        setError(t('picker.notDir', { path: trimmed }))
        return
      }
      await onPick(info.path)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="dsh-codex-dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose()
      }}
    >
      <div className="dsh-codex-dialog dsh-codex-picker" role="dialog" aria-modal="true">
        <header className="dsh-codex-dialog-head">{t('picker.title')}</header>

        <div className="dsh-codex-picker-section">{t('picker.existing')}</div>
        <div className="dsh-codex-picker-list">
          {projects.map((project) => (
            <button
              type="button"
              key={project.cwd}
              className="dsh-codex-picker-item"
              disabled={busy}
              onClick={() => void pick(project.cwd)}
            >
              <span className="dsh-codex-picker-name">{project.name === '' ? project.cwd : project.name}</span>
              <span className="dsh-codex-picker-path">{project.cwd}</span>
            </button>
          ))}
          {projects.length === 0 ? <div className="dsh-codex-loading">{t('projects.empty')}</div> : null}
        </div>

        <div className="dsh-codex-picker-section">{t('picker.newProject')}</div>
        <label className="dsh-codex-field">
          <span>{t('picker.path')}</span>
          <input
            className="dsh-codex-search"
            value={path}
            placeholder={t('picker.placeholder')}
            onChange={(event) => setPath(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') void create()
            }}
          />
        </label>
        <label className="dsh-codex-checkbox">
          <input
            type="checkbox"
            checked={alreadyTrusted || trust}
            disabled={alreadyTrusted || busy}
            onChange={(event) => setTrust(event.target.checked)}
          />
          <span>{alreadyTrusted ? t('picker.trusted') : t('picker.trust')}</span>
        </label>
        <div className="dsh-codex-hint">{t('picker.hint')}</div>

        {error !== null ? <div className="dsh-codex-dialog-error">{error}</div> : null}
        <div className="dsh-codex-dialog-actions">
          <button type="button" className="dsh-codex-button" disabled={busy} onClick={onClose}>
            {t('actions.cancel')}
          </button>
          <button type="button" className="dsh-codex-button primary" disabled={busy} onClick={() => void create()}>
            {busy ? t('picker.creating') : t('picker.create')}
          </button>
        </div>
      </div>
    </div>
  )
}
