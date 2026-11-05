/** 版本与健康对话框：版本探测、升级/回滚、守护进程动作、doctor 体检。 */

import * as React from 'react'
import { useT } from '../i18n'
import type { Api } from '../rpc'

interface VersionCheck {
  cli: { version: string | null, raw: string }
  daemon: { status?: string, cliVersion?: string, appServerVersion?: string, socketPath?: string, managedCodexPath?: string } | null
  latest: { version: string, source: string } | null
  updateAvailable: boolean
  install: { context: string | null, executable: string | null, updateAction: string | null, cachedLatest: string | null } | null
  doctor: {
    overallStatus: string
    codexVersion: string | null
    checks: Array<{ id: string, category: string, status: string, summary: string, remediation: string | null }>
    updates: Record<string, string> | null
  } | null
  checkedAt: number
}

interface JobState {
  jobId: string
  kind: string
  status: 'running' | 'done' | 'error'
  command: string
  exitCode: number | null
  lines: string[]
}

export interface VersionsDialogProps {
  open: boolean
  onClose: () => void
  api: Api
}

export function VersionsDialog({ open, onClose, api }: VersionsDialogProps) {
  const t = useT()
  const [check, setCheck] = React.useState<VersionCheck | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [activeTurns, setActiveTurns] = React.useState<Array<{ id: string, name: string | null, cwd: string }>>([])
  const [job, setJob] = React.useState<JobState | null>(null)
  const [rollbackVersion, setRollbackVersion] = React.useState('')
  const [pendingDaemon, setPendingDaemon] = React.useState<string | null>(null)
  const [lastAction, setLastAction] = React.useState<{ endpoint: string, payload: Record<string, unknown> } | null>(null)
  const pollRef = React.useRef<number | null>(null)
  const logRef = React.useRef<HTMLPreElement | null>(null)

  const load = React.useCallback(
    async (refresh = false) => {
      setLoading(true)
      setError(null)
      try {
        const value = await api<VersionCheck>('versions/check', { refresh })
        setCheck(value)
      } catch (cause) {
        setError(messageOf(cause))
      } finally {
        setLoading(false)
      }
    },
    [api],
  )

  React.useEffect(() => {
    if (open) void load(false)
  }, [open, load])

  React.useEffect(
    () => () => {
      if (pollRef.current !== null) window.clearInterval(pollRef.current)
    },
    [],
  )

  const pollJob = React.useCallback(
    (jobId: string) => {
      if (pollRef.current !== null) window.clearInterval(pollRef.current)
      pollRef.current = window.setInterval(async () => {
        try {
          const state = await api<JobState>('versions/job', { jobId })
          setJob(state)
          if (state.status !== 'running') {
            if (pollRef.current !== null) window.clearInterval(pollRef.current)
            pollRef.current = null
            void load(true)
          }
        } catch {
          // 任务可能已被清理；停止轮询。
          if (pollRef.current !== null) window.clearInterval(pollRef.current)
          pollRef.current = null
        }
      }, 1000)
    },
    [api, load],
  )

  const startJob = React.useCallback(
    async (endpoint: string, payload: Record<string, unknown>) => {
      setError(null)
      setActiveTurns([])
      setLastAction({ endpoint, payload })
      try {
        const result = await api<{ jobId: string }>(endpoint, payload)
        setJob({ jobId: result.jobId, kind: '', status: 'running', command: '', exitCode: null, lines: [] })
        pollJob(result.jobId)
      } catch (cause) {
        const failure = cause as Error & { code?: string, details?: any }
        if (failure.code === 'codex-cli/active-turns') {
          setActiveTurns(failure.details?.threads ?? [])
        }
        setError(messageOf(cause))
      }
    },
    [api, pollJob],
  )

  React.useEffect(() => {
    const element = logRef.current
    if (element !== null) element.scrollTop = element.scrollHeight
  }, [job?.lines.length])

  if (!open) return null

  const doctor = check?.doctor ?? null
  const problems = doctor?.checks.filter((entry) => entry.status !== 'ok') ?? []
  const daemonVersion = check?.daemon?.appServerVersion ?? check?.daemon?.cliVersion ?? null

  return (
    <div
      className="dsh-codex-dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="dsh-codex-dialog dsh-codex-versions" role="dialog" aria-modal="true">
        <header className="dsh-codex-dialog-head">{t('versions.title')}</header>

        {loading && check === null ? <div className="dsh-codex-loading">{t('versions.checking')}</div> : null}
        {error !== null ? (
          <div className="dsh-codex-dialog-error">
            {error}
            {activeTurns.length > 0 ? (
              <div className="dsh-codex-approval-meta">
                {t('versions.activeTurns', { count: activeTurns.length })}
                <button
                  type="button"
                  className="dsh-codex-button"
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    if (lastAction !== null) {
                      void startJob(lastAction.endpoint, { ...lastAction.payload, force: true })
                    }
                  }}
                >
                  {t('versions.force')}
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        {check !== null ? (
          <>
            <div className="dsh-codex-version-grid">
              <span>{t('versions.cli')}</span>
              <strong>{check.cli.version ?? '—'}</strong>
              <span>{t('versions.daemon')}</span>
              <strong>{daemonVersion ?? '—'}</strong>
              <span>{t('versions.latest')}</span>
              <strong>{check.latest?.version ?? '—'}</strong>
              <span>{t('versions.channel')}</span>
              <strong title={check.install?.context ?? undefined}>{installLabel(check.install?.context)}</strong>
            </div>

            <div className="dsh-codex-version-actions">
              <button type="button" className="dsh-codex-button" disabled={loading} onClick={() => void load(true)}>
                {loading ? t('versions.checking') : t('versions.check')}
              </button>
              {check.updateAvailable ? (
                <button
                  type="button"
                  className="dsh-codex-button primary"
                  disabled={job?.status === 'running'}
                  onClick={() => void startJob('versions/update', {})}
                >
                  {t('versions.update')} → {check.latest?.version}
                </button>
              ) : (
                <span className="dsh-codex-hint">{t('versions.upToDate')}</span>
              )}
            </div>

            <div className="dsh-codex-version-actions">
              <input
                className="dsh-codex-search"
                style={{ flex: 1, margin: 0 }}
                value={rollbackVersion}
                placeholder={t('versions.rollbackPlaceholder')}
                onChange={(event) => setRollbackVersion(event.target.value)}
              />
              <button
                type="button"
                className="dsh-codex-button"
                disabled={rollbackVersion.trim() === '' || job?.status === 'running'}
                onClick={() => void startJob('versions/rollback', { version: rollbackVersion.trim() })}
              >
                {t('versions.rollback')}
              </button>
            </div>

            <div className="dsh-codex-version-daemon">
              <span className="dsh-codex-section-title" style={{ padding: 0 }}>{t('versions.daemonActions')}</span>
              <button
                type="button"
                className="dsh-codex-button"
                disabled={job?.status === 'running'}
                onClick={() => setPendingDaemon('restart')}
              >
                {t('versions.restart')}
              </button>
              <button
                type="button"
                className="dsh-codex-button"
                disabled={job?.status === 'running'}
                onClick={() => setPendingDaemon('update')}
              >
                {t('versions.daemonUpdate')}
              </button>
              <button
                type="button"
                className="dsh-codex-button"
                disabled={job?.status === 'running'}
                onClick={() => setPendingDaemon('stop')}
              >
                {t('versions.stop')}
              </button>
            </div>

            {pendingDaemon !== null ? (
              <div className="dsh-codex-approval">
                <div className="dsh-codex-approval-meta">
                  {pendingDaemon === 'restart'
                    ? t('versions.confirmRestart')
                    : pendingDaemon === 'update'
                      ? t('versions.confirmUpdate')
                      : t('versions.confirmStop')}
                </div>
                <div className="dsh-codex-approval-actions">
                  <button type="button" className="dsh-codex-button" onClick={() => setPendingDaemon(null)}>
                    {t('versions.cancel')}
                  </button>
                  <button
                    type="button"
                    className="dsh-codex-button primary"
                    onClick={() => {
                      const action = pendingDaemon
                      setPendingDaemon(null)
                      void startJob('daemon/action', { action })
                    }}
                  >
                    {t('versions.confirm')}
                  </button>
                </div>
              </div>
            ) : null}

            <div className="dsh-codex-version-doctor">
              <div className="dsh-codex-section-title" style={{ padding: 0 }}>
                {t('versions.doctor')}
                {doctor !== null ? (
                  <span className="dsh-codex-approval-meta" style={{ marginLeft: 8 }}>
                    {doctor.overallStatus === 'ok'
                      ? t('versions.doctorOk')
                      : doctor.overallStatus === 'warning'
                        ? t('versions.doctorWarn')
                        : t('versions.doctorError')}
                  </span>
                ) : null}
              </div>
              {problems.slice(0, 8).map((entry) => (
                <div key={entry.id} className="dsh-codex-doctor-row">
                  <span className={`dsh-codex-dot ${entry.status === 'error' ? 'error' : 'warn'}`} />
                  <span className="dsh-codex-doctor-id">{entry.id}</span>
                  <span className="dsh-codex-doctor-summary">{entry.summary}</span>
                </div>
              ))}
              {doctor !== null && problems.length === 0 ? (
                <div className="dsh-codex-hint">{doctor.checks.length} checks ok</div>
              ) : null}
            </div>

            {job !== null ? (
              <div className="dsh-codex-job">
                <div className="dsh-codex-section-title" style={{ padding: 0 }}>
                  {t('versions.job')}
                  <span className="dsh-codex-approval-meta" style={{ marginLeft: 8 }}>
                    {job.status === 'running'
                      ? t('versions.running')
                      : job.status === 'done'
                        ? t('versions.done')
                        : t('versions.failed', { code: job.exitCode ?? '?' })}
                  </span>
                </div>
                <pre className="dsh-codex-pre dsh-codex-job-log" ref={logRef}>
                  {job.lines.join('\n')}
                </pre>
              </div>
            ) : null}
          </>
        ) : null}

        <div className="dsh-codex-dialog-actions">
          <button type="button" className="dsh-codex-button" onClick={onClose}>
            {t('versions.close')}
          </button>
        </div>
      </div>
    </div>
  )
}

function installLabel(context: string | null | undefined): string {
  if (typeof context !== 'string' || context === '') return '—'
  return context.split(' ')[0]
}

function messageOf(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause)
}
