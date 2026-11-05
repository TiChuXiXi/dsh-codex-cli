/** 新会话对话框：选目录、模型、推理强度、审批策略与沙箱。 */

import * as React from 'react'
import { useT } from '../i18n'
import type { Project } from '../types'

export interface NewThreadRequest {
  cwd: string
  model?: string
  effort?: string
  approvalPolicy?: string
  sandbox?: string
}

export interface NewThreadDialogProps {
  open: boolean
  defaultCwd: string
  projects: Project[]
  models: Array<{ id: string, displayName: string }>
  onClose: () => void
  onCreate: (request: NewThreadRequest) => Promise<void>
}

const EFFORTS = ['', 'minimal', 'low', 'medium', 'high']
const APPROVALS = ['on-request', 'never', 'untrusted']
const SANDBOXES = ['workspace-write', 'read-only', 'danger-full-access']

export function NewThreadDialog({ open, defaultCwd, projects, models, onClose, onCreate }: NewThreadDialogProps) {
  const t = useT()
  const [cwd, setCwd] = React.useState(defaultCwd)
  const [model, setModel] = React.useState('')
  const [effort, setEffort] = React.useState('')
  const [approvalPolicy, setApprovalPolicy] = React.useState('on-request')
  const [sandbox, setSandbox] = React.useState('workspace-write')
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open) return
    setCwd(defaultCwd)
    setError(null)
  }, [open, defaultCwd])

  if (!open) return null

  const submit = async () => {
    if (busy) return
    if (cwd.trim() === '') {
      setError(t('newThread.cwd'))
      return
    }
    setBusy(true)
    setError(null)
    try {
      await onCreate({
        cwd: cwd.trim(),
        model: model === '' ? undefined : model,
        effort: effort === '' ? undefined : effort,
        approvalPolicy,
        sandbox,
      })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="dsh-codex-dialog-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !busy) onClose()
    }}>
      <div className="dsh-codex-dialog" role="dialog" aria-modal="true">
        <header className="dsh-codex-dialog-head">{t('newThread.title')}</header>
        <label className="dsh-codex-field">
          <span>{t('newThread.cwd')}</span>
          <input
            className="dsh-codex-search"
            list="dsh-codex-projects"
            value={cwd}
            onChange={(event) => setCwd(event.target.value)}
            placeholder="/root/project/..."
          />
          <datalist id="dsh-codex-projects">
            {projects.map((project) => (
              <option key={project.cwd} value={project.cwd} />
            ))}
          </datalist>
        </label>
        <label className="dsh-codex-field">
          <span>{t('newThread.model')}</span>
          <select className="dsh-codex-select" value={model} onChange={(event) => setModel(event.target.value)}>
            <option value="">{t('newThread.default')}</option>
            {models.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.displayName}
              </option>
            ))}
          </select>
        </label>
        <div className="dsh-codex-field-row">
          <label className="dsh-codex-field">
            <span>{t('newThread.effort')}</span>
            <select className="dsh-codex-select" value={effort} onChange={(event) => setEffort(event.target.value)}>
              {EFFORTS.map((value) => (
                <option key={value} value={value}>
                  {value === '' ? t('newThread.default') : value}
                </option>
              ))}
            </select>
          </label>
          <label className="dsh-codex-field">
            <span>{t('newThread.approval')}</span>
            <select className="dsh-codex-select" value={approvalPolicy} onChange={(event) => setApprovalPolicy(event.target.value)}>
              {APPROVALS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="dsh-codex-field">
          <span>{t('newThread.sandbox')}</span>
          <select className="dsh-codex-select" value={sandbox} onChange={(event) => setSandbox(event.target.value)}>
            {SANDBOXES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        {error !== null ? <div className="dsh-codex-dialog-error">{error}</div> : null}
        <div className="dsh-codex-dialog-actions">
          <button type="button" className="dsh-codex-button" disabled={busy} onClick={onClose}>
            {t('newThread.cancel')}
          </button>
          <button type="button" className="dsh-codex-button primary" disabled={busy} onClick={() => void submit()}>
            {busy ? t('newThread.creating') : t('newThread.create')}
          </button>
        </div>
      </div>
    </div>
  )
}
