import * as React from 'react'
import {Icon} from '../components/Icon'
import type { Api } from '../rpc'
import { subscribeWorkspace } from './workspace-events'
type Workspace = { workspaceId: string; cwd: string }
type Entry = {
  name: string
  path: string
  type: 'dir' | 'file' | 'other' | 'unavailable'
  size: number | null
  mtime: number | null
}
export function FilesPane({
  api,
  cwd,
  onOpen,
}: {
  api: Api
  cwd: string
  onOpen: (path: string) => void
}) {
  const [workspace, setWorkspace] = React.useState<Workspace | null>(null)
  const [revision, setRevision] = React.useState(0)
  const [error, setError] = React.useState('')
  React.useEffect(
    () =>
      subscribeWorkspace((change) => {
        if (change.workspaceId === '*') setRevision((r) => r + 1)
      }),
    [],
  )
  React.useEffect(() => {
    let cancelled = false
    setWorkspace(null)
    api<Workspace>('workspace/open', { cwd })
      .then((w) => {
        if (!cancelled) {
          setWorkspace(w)
          setError('')
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
    return () => {
      cancelled = true
    }
  }, [api, cwd, revision])
  return (
    <section className="codex-sidebar-files">
      <div className="codex-sidebar-file-toolbar">
        <code className="codex-sidebar-file-toolbar-title" title={cwd}>{cwd}</code>
        <button
          type="button"
          title="刷新工作区"
          onClick={() => setRevision((r) => r + 1)}
        >
          <Icon name="refresh" size={17}/>
        </button>
      </div>
      {error && <div role="alert">{error}</div>}
      {workspace ? (
        <Directory
          key={workspace.workspaceId + ':' + revision}
          api={api}
          workspace={workspace}
          path="."
          onOpen={onOpen}
          level={0}
        />
      ) : (
        <div className="dsh-codex-loading">正在打开工作区…</div>
      )}
    </section>
  )
}
function Directory({
  api,
  workspace,
  path,
  onOpen,
  level,
}: {
  api: Api
  workspace: Workspace
  path: string
  onOpen: (path: string) => void
  level: number
}) {
  const [data, setData] = React.useState<{
    entries: Entry[]
    truncated: boolean
  } | null>(null)
  const [expanded, setExpanded] = React.useState<Set<string>>(() => new Set())
  const [error, setError] = React.useState('')
  const [revision, setRevision] = React.useState(0)
  React.useEffect(
    () =>
      subscribeWorkspace((change) => {
        if (
          change.workspaceId === workspace.workspaceId &&
          change.path === path
        )
          setRevision((r) => r + 1)
      }),
    [workspace.workspaceId, path],
  )
  React.useEffect(() => {
    let disposed = false,
      watchId: string | undefined
    let renew: ReturnType<typeof setTimeout> | undefined
    async function hold() {
      try {
        const next = await api<{ watchId: string }>('workspace/watch', {
          workspaceId: workspace.workspaceId,
          path,
        })
        if (disposed) {
          void api('workspace/unwatch', { watchId: next.watchId }).catch(
            () => {},
          )
          return
        }
        const previous = watchId
        watchId = next.watchId
        if (previous)
          void api('workspace/unwatch', { watchId: previous }).catch(() => {})
        renew = setTimeout(hold, 90000)
      } catch {}
    }
    void hold()
    // Refresh also covers reconnects and filesystems without usable watch events.
    const poll = setInterval(() => setRevision((r) => r + 1), 10000)
    return () => {
      disposed = true
      clearTimeout(renew)
      clearInterval(poll)
      if (watchId) void api('workspace/unwatch', { watchId }).catch(() => {})
    }
  }, [api, workspace.workspaceId, path])
  React.useEffect(() => {
    let cancelled = false
    api<{ entries: Entry[]; truncated: boolean }>('workspace/list', {
      workspaceId: workspace.workspaceId,
      path,
    })
      .then((next) => {
        if (!cancelled) {
          setData(next)
          setError('')
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
    return () => {
      cancelled = true
    }
  }, [api, workspace.workspaceId, path, revision])
  return (
    <div
      role={level === 0 ? 'tree' : 'group'}
      aria-label={level === 0 ? '工作区文件' : undefined}
    >
      {error && (
        <div role="alert">
          {error}{' '}
          <button type="button" onClick={() => setRevision((r) => r + 1)}>
            重试
          </button>
        </div>
      )}
      {!data && !error && <div className="dsh-codex-loading">加载中…</div>}
      {data?.entries
        .map((entry) => (
          <React.Fragment key={entry.path}>
            <button
              type="button"
              role="treeitem"
              aria-expanded={
                entry.type === 'dir' ? expanded.has(entry.path) : undefined
              }
              disabled={entry.type === 'unavailable' || entry.type === 'other'}
              className="codex-sidebar-file-row"
              style={{ paddingLeft: 12 + level * 16 }}
              title={entry.path}
              onClick={() => {
                if (entry.type === 'dir')
                  setExpanded((old) => {
                    const next = new Set(old)
                    if (!next.delete(entry.path)) next.add(entry.path)
                    return next
                  })
                else onOpen(entry.path)
              }}
            >
              <span>
                {entry.type==='dir'?<><Icon name={expanded.has(entry.path)?'chevronDown':'chevronRight'} size={14}/><Icon name={expanded.has(entry.path)?'folderOpen':'folder'} size={17}/></>:<Icon name={entry.type==='unavailable'?'ban':/\.(?:tsx?|jsx?|json|css|html)$/.test(entry.name)?'fileCode':'file'} size={17}/>}

              </span>
              <span>{entry.name}</span>
              <small>
                {entry.type === 'file' && entry.size !== null
                  ? formatSize(entry.size)
                  : ''}
              </small>
            </button>
            {entry.type === 'dir' && expanded.has(entry.path) && (
              <Directory
                api={api}
                workspace={workspace}
                path={entry.path}
                onOpen={onOpen}
                level={level + 1}
              />
            )}
          </React.Fragment>
        ))}
      {data?.truncated && (
        <p className="dsh-codex-hint">当前目录仅显示前 1000 项</p>
      )}
      {data?.entries.length === 0 && <p className="dsh-codex-hint">空文件夹</p>}
    </div>
  )
}
function formatSize(value: number) {
  return value < 1024
    ? value + ' B'
    : value < 1048576
      ? (value / 1024).toFixed(1) + ' KB'
      : (value / 1048576).toFixed(1) + ' MB'
}
