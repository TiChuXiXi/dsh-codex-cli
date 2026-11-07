/** 选择项目：切换现有项目，或转去目录浏览器新建项目。 */

import * as React from 'react'
import {Icon} from '../components/Icon'
import { useT } from '../i18n'
import type { Project } from '../types'

export interface ProjectPickerDialogProps {
  open: boolean
  projects: Project[]
  onPick: (cwd: string) => Promise<void>
  onNewProject: () => void
  onClose: () => void
}

export function ProjectPickerDialog({ open, projects, onPick, onNewProject, onClose }: ProjectPickerDialogProps) {
  const t = useT()
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open) return
    setBusy(false)
    setError(null)
  }, [open])

  if (!open) return null

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

        <div className="dsh-codex-hint">{t('picker.newHint')}</div>

        {error !== null ? <div className="dsh-codex-dialog-error">{error}</div> : null}
        <div className="dsh-codex-dialog-actions">
          <button type="button" className="dsh-codex-button picker-new" disabled={busy} onClick={onNewProject}>
            <PlusGlyph />
            {t('picker.newProjectAction')}
          </button>
          <button type="button" className="dsh-codex-button" disabled={busy} onClick={onClose}>
            {t('actions.cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}

function PlusGlyph(){return <Icon name="plus" size={16}/>}
