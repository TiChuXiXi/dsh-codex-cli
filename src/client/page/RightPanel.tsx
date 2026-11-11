/** Codex 会话右侧面板：文件浏览、版本管理、终端。 */

import * as React from 'react'
import {Icon} from '../components/Icon'
import { TerminalPane as TerminalTab } from '../sidebar/TerminalPane'
import {GitPane as GitTab} from '../sidebar/GitPane'
import { useT } from '../i18n'
import type { Api } from '../rpc'

export type RightTab = 'files' | 'git' | 'terminal'

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
  requestId?: number
  tab: RightTab
  onTabChange: (tab: RightTab) => void
  onClose: () => void
}

export function RightPanel({ api, cwd, open, tab, onTabChange, onClose }: RightPanelProps) {
  const t = useT()
  if (!open) return null
  return (
    <aside className="dsh-codex-right">
      <div className="dsh-codex-right-head">
        <div className="dsh-codex-right-tabs">
          {(['files', 'git', 'terminal'] as RightTab[]).map((value) => (
            <button
              key={value}
              type="button"
              className={`dsh-codex-right-tab ${tab === value ? 'active' : ''}`}
              onClick={() => onTabChange(value)}
            >
              {t(`right.${value}`)}
            </button>
          ))}
        </div>
        <button type="button" className="dsh-codex-right-close" aria-label={t('right.close')} onClick={onClose}>
          <Icon name="close" size={17}/>
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

export function FilesTab({ api, cwd }: { api: Api, cwd: string }) {
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
          <Icon name="arrowLeft" size={17}/>
        </button>
        <code className="dsh-codex-right-path" title={path}>{path}</code>
        <button type="button" className="dsh-codex-icon-button" title={t('right.refresh')} onClick={() => void load(path)}>
          <Icon name="refresh" size={17}/>
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
                <Icon name={entry.type==='dir'?'folder':'file'} size={16}/>
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

export {GitPane as GitTab} from '../sidebar/GitPane'

export { TerminalPane as TerminalTab } from '../sidebar/TerminalPane'

function formatSize(size: number): string {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
  return `${(size / 1024 / 1024).toFixed(1)} MB`
}
