import * as React from 'react'
import {useDialogFocus} from '../components/DialogFocus'
import {FileContextMenu} from './FileContextMenu'
import {Icon} from '../components/Icon'
import {toast} from '../components/Toast'
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
  directory = '.',
}: {
  api: Api
  cwd: string
  onOpen: (path: string) => void
  directory?: string
}) {
  const root=React.useRef<HTMLElement>(null)
  useDialogFocus(root)
  const input=React.useRef<HTMLInputElement>(null),destination=React.useRef('.')
  const [context,setContext]=React.useState<{x:number,y:number,entry:Entry|null,directory:string}|null>(null)
  const [deleting,setDeleting]=React.useState<Entry|null>(null),[busy,setBusy]=React.useState(false)
  React.useEffect(()=>{
    if(!deleting)return
    const close=(event:KeyboardEvent)=>{if(event.key==='Escape'&&!busy){event.preventDefault();event.stopPropagation();setDeleting(null)}}
    document.addEventListener('keydown',close,true)
    const dialog=root.current?.querySelector<HTMLElement>('[role="dialog"]')
    if(!busy&&dialog&&!dialog.contains(document.activeElement))dialog.querySelector<HTMLElement>('button:not(:disabled)')?.focus()
    return()=>document.removeEventListener('keydown',close,true)
  },[deleting,busy])
  const contextAt=(event:React.MouseEvent,entry:Entry|null,directory:string)=>{
    event.preventDefault();event.stopPropagation()
    if(!busy)setContext({x:event.clientX,y:event.clientY,entry,directory})
  }
  const [workspace, setWorkspace] = React.useState<Workspace | null>(null)
  const [revision, setRevision] = React.useState(0)
  const [registrationRevision, setRegistrationRevision] = React.useState(0)
  const workspaceCwd = React.useRef(cwd)
  const [error, setError] = React.useState('')
  React.useEffect(
    () =>
      subscribeWorkspace((change) => {
        if (change.workspaceId === '*') { setRegistrationRevision(r => r + 1); setRevision(r => r + 1) }
      }),
    [],
  )
  React.useEffect(() => {
    let cancelled = false
    if (workspaceCwd.current !== cwd) { workspaceCwd.current = cwd; setWorkspace(null) }
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
  }, [api, cwd, registrationRevision])
  const directoryPath = directory === '.' ? cwd : cwd.replace(/\/$/, '') + '/' + directory
  const upload=async(files:File[])=>{
    if(!workspace||!files.length)return
    setBusy(true);setError('')
    let count=0
    const failures:string[]=[]
    for(const file of files){
      try{
        if(file.size>25*1024*1024)throw Error('单文件不能超过 25MiB')
        const data=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]||'');reader.onerror=()=>reject(Error('读取失败'));reader.readAsDataURL(file)})
        await api('workspace/upload',{workspaceId:workspace.workspaceId,directory:destination.current,name:file.name,dataBase64:data});count++
      }catch(e){failures.push(file.name+'：'+(e instanceof Error?e.message:String(e)))}
    }
    setBusy(false);setRevision(r=>r+1);if(count)toast('已上传 '+count+' 个文件','success')
    if(failures.length)setError(failures.join('\n'))
  }
  const remove=async()=>{
    if(!workspace||!deleting||busy)return
    setBusy(true);setError('')
    try{
      await api('workspace/remove',{workspaceId:workspace.workspaceId,path:deleting.path})
      toast('已删除：'+deleting.path,'success');setDeleting(null);setRevision(r=>r+1)
    }catch(e){setError(e instanceof Error?e.message:String(e))}
    finally{setBusy(false)}
  }
  return (
    <section ref={root} onContextMenu={e=>contextAt(e,null,directory)} aria-busy={busy} className="codex-sidebar-files">
      <div className="codex-sidebar-file-toolbar">
        <code className="codex-sidebar-file-toolbar-title" title={directoryPath}>{directoryPath}</code>
        <button
          type="button"
          title="刷新工作区"
          onClick={() => setRevision((r) => r + 1)}
        >
          <Icon name="refresh" size={17}/>
        </button>
      </div>
      <input ref={input} type="file" multiple hidden onChange={e=>{const files=Array.from(e.target.files||[]);e.target.value='';void upload(files)}}/>
      {error && <div role="alert" className="dsh-codex-right-error">{error}</div>}
      {context&&<FileContextMenu context={context} onClose={()=>setContext(null)} onAction={async action=>{
        const {entry,directory}=context;setContext(null);setError('')
        const path=entry?.path||directory
        const absolute=workspace?.cwd.replace(/\/$/,'')+'/'+(path==='.'?'':path)
        try{
          if(action==='upload'){destination.current=directory;input.current?.click()}
          else if(action==='delete'&&entry)setDeleting(entry)
          else if(action==='open'&&entry)onOpen(entry.path)
          else if(action==='download'&&entry&&workspace){
            await api('workspace/downloadInfo',{workspaceId:workspace.workspaceId,path:entry.path})
            const query=new URLSearchParams({workspaceId:workspace.workspaceId,path:entry.path})
            const link=document.createElement('a')
            link.href='/codex-cli/workspace/download?'+query
            link.download=entry.name
            document.body.appendChild(link);link.click();link.remove()
            toast('已开始下载：'+entry.name,'success')
          }
          else if(action==='copy'){await navigator.clipboard.writeText(absolute);toast('已复制绝对路径','success')}
          else if(action==='relative'){await navigator.clipboard.writeText(path);toast('已复制相对路径','success')}
          else if(action==='reference'){
            const detail={cwd,path:absolute,name:entry?.name||cwd.split('/').at(-1),accepted:false}
            window.dispatchEvent(new CustomEvent('dsh-codex-reference',{detail}))
            if(!detail.accepted)throw Error('请先打开可用的对话会话')
          }
          else if(action==='refresh')setRevision(r=>r+1)
        }catch(e){setError(e instanceof Error?e.message:String(e))}
      }}/>}
      {deleting&&<div className="codex-file-modal-backdrop" onContextMenu={e=>e.stopPropagation()} onKeyDown={e=>{if(e.key==='Escape'&&!busy){e.stopPropagation();setDeleting(null)}}}>
        <div className="codex-file-modal" role="dialog" aria-modal="true" aria-label="删除确认">
          <h3>删除{deleting.type==='dir'?'文件夹':'文件'}？</h3><code>{deleting.path}</code>
          <p>{deleting.type==='dir'?'文件夹及其中的全部内容':'文件'}将被永久删除，无法恢复。</p>
          {error&&<div role="alert">{error}</div>}
          <footer><button className="dsh-codex-button" disabled={busy} onClick={()=>setDeleting(null)}>取消</button><button className="dsh-codex-button danger" disabled={busy} onClick={()=>void remove()}>{busy?'删除中…':'确认删除'}</button></footer>
        </div>
      </div>}
      {workspace ? (
        <Directory
          key={workspace.workspaceId}
          api={api}
          workspace={workspace}
          path={directory}
          onOpen={onOpen}
          level={0}
          refresh={revision}
          onContext={contextAt}
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
  refresh,
  onContext,
}: {
  api: Api
  workspace: Workspace
  path: string
  onOpen: (path: string) => void
  level: number
  refresh: number
  onContext: (event:React.MouseEvent,entry:Entry|null,directory:string)=>void
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
  }, [api, workspace.workspaceId, path, revision, refresh])
  return (
    <div
      role={level === 0 ? 'tree' : 'group'}
      aria-label={level === 0 ? '工作区文件' : undefined}
      onContextMenu={event=>onContext(event,null,path)}
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
              onKeyDown={event=>{if(event.key==='ContextMenu'||(event.shiftKey&&event.key==='F10')){event.preventDefault();const box=event.currentTarget.getBoundingClientRect();onContext({preventDefault(){},stopPropagation(){},clientX:box.left+20,clientY:box.bottom} as React.MouseEvent,entry,entry.type==='dir'?entry.path:path)}}}
              onContextMenu={event=>onContext(event,entry,entry.type==='dir'?entry.path:path)}
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
                refresh={refresh}
                onContext={onContext}
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
