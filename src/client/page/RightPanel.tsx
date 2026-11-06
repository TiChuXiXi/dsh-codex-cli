/** Codex 会话右侧面板：文件浏览、版本管理、终端。 */

import * as React from 'react'
import { useT } from '../i18n'
import type { Api } from '../rpc'

type Tab = 'files' | 'git' | 'terminal'

interface Entry {
  name: string
  path: string
  type: 'dir' | 'file'
  size: number | null
  mtime: number | null
}

interface Preview {
  path: string
  content: string
  truncated: boolean
}

interface GitData {
  branch: string
  changes: Array<{ status: string, path: string }>
  diffStat: string
  log: string
}

export interface RightPanelProps {
  api: Api
  cwd: string
  open: boolean
  onClose: () => void
}

export function RightPanel({ api, cwd, open, onClose }: RightPanelProps) {
  const t = useT()
  const [tab, setTab] = React.useState<Tab>('files')
  if (!open) return null
  return (
    <aside className="dsh-codex-right">
      <div className="dsh-codex-right-head">
        <div className="dsh-codex-right-tabs">
          {(['files', 'git', 'terminal'] as Tab[]).map((value) => (
            <button
              key={value}
              type="button"
              className={`dsh-codex-right-tab ${tab === value ? 'active' : ''}`}
              onClick={() => setTab(value)}
            >
              {t(`right.${value}`)}
            </button>
          ))}
        </div>
        <button type="button" className="dsh-codex-right-close" aria-label={t('right.close')} onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {cwd === '' ? (
        <div className="dsh-codex-loading">{t('right.noCwd')}</div>
      ) : tab === 'files' ? (
        <FilesTab api={api} cwd={cwd} />
      ) : tab === 'git' ? (
        <GitTab api={api} cwd={cwd} />
      ) : (
        <TerminalTab api={api} cwd={cwd} />
      )}
    </aside>
  )
}

function FilesTab({ api, cwd }: { api: Api, cwd: string }) {
  const t = useT()
  const [path, setPath] = React.useState(cwd)
  const [entries, setEntries] = React.useState<Entry[]>([])
  const [preview, setPreview] = React.useState<Preview | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const load = async (target: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await api<{ path: string, entries: Entry[] }>('fs/list', { path: target })
      setPath(result.path)
      setEntries(result.entries)
      setPreview(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    void load(cwd)
  }, [cwd])

  const openFile = async (entry: Entry) => {
    setLoading(true)
    setError(null)
    try {
      setPreview(await api<Preview>('fs/read', { path: entry.path }))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setLoading(false)
    }
  }

  const up = path.replace(/\/[^/]+\/?$/, '') || '/'

  return (
    <div className="dsh-codex-right-body">
      <div className="dsh-codex-right-bar">
        <button type="button" className="dsh-codex-icon-button" title={t('right.up')} onClick={() => void load(up)}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
            <path d="M8 12V4M4 8l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <code className="dsh-codex-right-path" title={path}>{path}</code>
        <button type="button" className="dsh-codex-icon-button" title={t('right.refresh')} onClick={() => void load(path)}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
            <path d="M13 8a5 5 0 1 1-1.5-3.5M13 3v3h-3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      {error !== null ? <div className="dsh-codex-right-error">{error}</div> : null}
      {preview !== null ? (
        <>
          <div className="dsh-codex-right-bar">
            <button type="button" className="dsh-codex-button" onClick={() => setPreview(null)}>
              {t('right.back')}
            </button>
            <code className="dsh-codex-right-path" title={preview.path}>{preview.path}</code>
          </div>
          {preview.truncated ? <div className="dsh-codex-hint">{t('right.truncated')}</div> : null}
          <pre className="dsh-codex-right-pre">{preview.content}</pre>
        </>
      ) : (
        <div className="dsh-codex-right-list">
          {entries.map((entry) => (
            <button
              type="button"
              key={entry.path}
              className="dsh-codex-right-row"
              title={entry.path}
              onClick={() => (entry.type === 'dir' ? void load(entry.path) : void openFile(entry))}
            >
              <span className={`dsh-codex-right-glyph ${entry.type}`}>
                {entry.type === 'dir' ? '▸' : '·'}
              </span>
              <span className="dsh-codex-right-name">{entry.name}</span>
              {entry.type === 'file' && entry.size !== null ? (
                <span className="dsh-codex-right-meta">{formatSize(entry.size)}</span>
              ) : null}
            </button>
          ))}
          {entries.length === 0 && !loading ? <div className="dsh-codex-loading">{t('right.emptyDir')}</div> : null}
          {loading ? <div className="dsh-codex-loading">{t('threads.loading')}</div> : null}
        </div>
      )}
    </div>
  )
}

function GitTab({ api, cwd }: { api: Api, cwd: string }) {
  const t = useT()
  const [data, setData] = React.useState<GitData | null>(null)
  const [diff, setDiff] = React.useState<{ path: string, text: string } | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await api<GitData>('git/status', { cwd }))
      setDiff(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    void load()
  }, [cwd])

  const openDiff = async (path: string) => {
    try {
      const result = await api<{ diff: string }>('git/diff', { cwd, path })
      setDiff({ path, text: result.diff === '' ? t('right.noChanges') : result.diff })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    }
  }

  return (
    <div className="dsh-codex-right-body">
      <div className="dsh-codex-right-bar">
        <span className="dsh-codex-right-meta">
          {data !== null ? `${t('right.branch')} ${data.branch}` : ''}
        </span>
        <span style={{ flex: 1 }} />
        <button type="button" className="dsh-codex-button" onClick={() => void load()}>
          {t('right.refresh')}
        </button>
      </div>
      {error !== null ? <div className="dsh-codex-right-error">{error}</div> : null}
      {diff !== null ? (
        <>
          <div className="dsh-codex-right-bar">
            <button type="button" className="dsh-codex-button" onClick={() => setDiff(null)}>
              {t('right.back')}
            </button>
            <code className="dsh-codex-right-path">{diff.path}</code>
          </div>
          <pre className="dsh-codex-right-pre">{diff.text}</pre>
        </>
      ) : (
        <div className="dsh-codex-right-list">
          <div className="dsh-codex-right-section">{t('right.changes')}</div>
          {data !== null && data.changes.length === 0 ? (
            <div className="dsh-codex-loading">{t('right.noChanges')}</div>
          ) : null}
          {data?.changes.map((change) => (
            <button
              type="button"
              key={`${change.status}:${change.path}`}
              className="dsh-codex-right-row"
              onClick={() => void openDiff(change.path)}
            >
              <span className="dsh-codex-right-glyph">{change.status}</span>
              <span className="dsh-codex-right-name">{change.path}</span>
            </button>
          ))}
          {data !== null && data.diffStat !== '' ? (
            <>
              <div className="dsh-codex-right-section">{t('right.diff')}</div>
              <pre className="dsh-codex-right-pre small">{data.diffStat}</pre>
            </>
          ) : null}
          {data !== null && data.log !== '' ? (
            <>
              <div className="dsh-codex-right-section">{t('right.log')}</div>
              <pre className="dsh-codex-right-pre small">{data.log}</pre>
            </>
          ) : null}
          {loading ? <div className="dsh-codex-loading">{t('threads.loading')}</div> : null}
        </div>
      )}
    </div>
  )
}

function TerminalTab({ api, cwd }: { api: Api, cwd: string }) {
  const t = useT()
  const [command, setCommand] = React.useState('')
  const [output, setOutput] = React.useState('')
  const [code, setCode] = React.useState<number | null>(null)
  const [running, setRunning] = React.useState(false)

  const run = async () => {
    if (command.trim() === '' || running) return
    setRunning(true)
    setOutput('')
    setCode(null)
    try {
      const result = await api<{ code: number, output: string, truncated: boolean }>('exec/run', { cwd, command })
      setOutput(result.output)
      setCode(result.code)
    } catch (cause) {
      setOutput(cause instanceof Error ? cause.message : String(cause))
      setCode(-1)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="dsh-codex-right-body">
      <div className="dsh-codex-right-bar">
        <code className="dsh-codex-right-path" title={cwd}>{cwd}</code>
      </div>
      <div className="dsh-codex-right-terminal-input">
        <input
          className="dsh-codex-search"
          value={command}
          placeholder={t('right.command')}
          onChange={(event) => setCommand(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') void run()
          }}
        />
        <button type="button" className="dsh-codex-button primary" disabled={running} onClick={() => void run()}>
          {running ? t('right.running') : t('right.run')}
        </button>
      </div>
      <pre className="dsh-codex-right-pre terminal">
        {output === '' ? (running ? t('right.running') : '') : output}
      </pre>
      {code !== null ? <div className="dsh-codex-right-meta">{t('right.exitCode', { code })}</div> : null}
    </div>
  )
}

function formatSize(size: number): string {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
  return `${(size / 1024 / 1024).toFixed(1)} MB`
}
