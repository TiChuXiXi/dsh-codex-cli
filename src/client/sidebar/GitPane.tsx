import * as React from 'react'
import type {Api} from '../rpc'
import {Icon, IconButton, type IconName} from '../components/Icon'
import {SelectMenu} from '../components/SelectMenu'
import {useDialogFocus} from '../components/DialogFocus'
import {GIT_CSS} from './gitStyles'
import {graphRows} from './gitGraph'

type Change = {path:string, origPath:string|null,index:string,worktree:string,staged:boolean,unstaged:boolean,untracked:boolean,conflicted:boolean}
type Commit = {hash:string,shortHash:string,parents:string[],subject:string,body:string,author:string,email:string,date:string}
type Branch = {ref:string,name:string,hash:string,shortHash:string,upstream:string,ahead:number,behind:number}
type Snapshot = {repo:{root:string,branch:string,oid:string,upstream:string,ahead:number,behind:number,detached:boolean},config:{allowWrite:boolean,allowPush:boolean,allowDangerous:boolean},status:{entries:Change[]},commits:Commit[],branches:{local:Branch[],remote:Branch[]},remotes:{name:string,fetch:string,push:string}[],stashes:{ref:string,hash:string,date:string,subject:string}[],console:Record<string,any>[]}
type Form = {title:string,endpoint:string,payload:Record<string,any>,fields?:{key:string,label:string,type?:string,value?:string}[],warning?:string}
type Preview = {title:string,patch:string,truncated?:boolean}
const tabs:{id:string,label:string,icon:IconName}[]=[{id:'changes',label:'变更',icon:'fileCode'},{id:'history',label:'历史',icon:'history'},{id:'branches',label:'分支',icon:'git'},{id:'remotes',label:'远程',icon:'globe'},{id:'stash',label:'贮藏',icon:'archive'},{id:'console',label:'命令',icon:'terminal'}]
const operationLabels:Record<string,string>={'commit':'提交完成','stage':'文件已暂存','unstage':'已取消暂存','discard':'工作区改动已丢弃','checkout':'已切换分支','branch/create':'分支已创建','branch/delete':'分支已删除','merge':'合并完成','remote/add':'远程仓库已添加','remote/remove':'远程仓库已移除','push':'推送完成','pull':'拉取完成','fetch':'获取完成','stash':'贮藏操作完成','revert':'已创建反向提交','cherry-pick':'拣选完成','reset':'重置完成','console/clear':'命令记录已清空','credential/approve':'认证信息已处理，请重试远程操作'}
const messageOf=(e:any)=>[e.code,e.message||String(e)].filter(Boolean).join(' · ')

export function GitPane({api,cwd}:{api:Api,cwd:string}) {
  // Keyed scope unmounts all old project state, dialogs, callbacks and requests.
  return <GitScope key={cwd} api={api} cwd={cwd}/>
}
function GitScope({api,cwd}:{api:Api,cwd:string}) {
  const root=React.useRef<HTMLDivElement>(null)
  useDialogFocus(root)
  const alive=React.useRef(true), generation=React.useRef(0), previewGeneration=React.useRef(0), lock=React.useRef(false)
  const [data,setData]=React.useState<Snapshot|null>(null),[tab,setTab]=React.useState('changes')
  const [busy,setBusy]=React.useState(false),[loading,setLoading]=React.useState(true),[error,setError]=React.useState(''),[notice,setNotice]=React.useState(''),[noRepo,setNoRepo]=React.useState(false)
  const [selected,setSelected]=React.useState<Set<string>>(new Set()),[message,setMessage]=React.useState(''),[amend,setAmend]=React.useState(false)
  const [preview,setPreview]=React.useState<Preview|null>(null),[previewBusy,setPreviewBusy]=React.useState(false)
  const [detail,setDetail]=React.useState<{commit:Commit,files:{path:string,status:string,origPath?:string}[]}|null>(null)
  const [form,setForm]=React.useState<Form|null>(null),[values,setValues]=React.useState<Record<string,string>>({})
  const [resetMode,setResetMode]=React.useState('soft')
  const [remote,setRemote]=React.useState(''),[canMore,setCanMore]=React.useState(true)
  React.useEffect(()=>{
    if(!form)return
    const key=(event:KeyboardEvent)=>{
      if(event.key==='Escape'&&!lock.current){event.preventDefault();event.stopPropagation();setForm(null);setValues({})}
    }
    document.addEventListener('keydown',key,true)
    const dialog=root.current?.querySelector<HTMLElement>('.git-modal')
    if(!busy&&dialog&&!dialog.contains(document.activeElement)){
      (dialog.querySelector<HTMLElement>('input,button:not(:disabled)')||dialog).focus()
    }
    return()=>document.removeEventListener('keydown',key,true)
  },[form,busy])
  const loaded=React.useRef(50)
  const call=(method:string,payload:Record<string,any>={})=>api('git/'+method,{...payload,cwd})
  const refresh=async()=>{
    const id=++generation.current;setLoading(true)
    try {
      const result=await call('repo/snapshot',{all:true,limit:loaded.current})
      if(!alive.current||id!==generation.current)return
      setData(result);setNoRepo(false);setCanMore(result.commits.length>=loaded.current)
      setSelected(old=>new Set([...old].filter(path=>result.status.entries.some((e:Change)=>e.path===path))))
      setRemote(old=>result.remotes.some((r:any)=>r.name===old)?old:result.remotes[0]?.name||'')
    } catch(e:any) {if(alive.current&&id===generation.current){setError(e.code==='git-vcs/not-a-repo'?'':messageOf(e));setNoRepo(e.code==='git-vcs/not-a-repo');if(e.code==='git-vcs/not-a-repo')setData(null)}}
    finally {if(alive.current&&id===generation.current)setLoading(false)}
  }
  React.useEffect(()=>{alive.current=true;void refresh();return()=>{alive.current=false;generation.current++;previewGeneration.current++}},[])
  const run=async(endpoint:string,payload:Record<string,any>={})=>{
    if(lock.current)return false
    lock.current=true;setBusy(true);setError('');setNotice('')
    try {
      const result=await call(endpoint,payload)
      if(!alive.current)return false
      setNotice(result.message||operationLabels[endpoint]||'操作完成')
      setPreview(null);setDetail(null);await refresh();return true
    } catch(e:any){
      if(alive.current){setError(messageOf(e));await refresh()
        if(e.code==='git-vcs/auth-required')openForm({title:'远程认证',endpoint:'credential/approve',payload:{},warning:'凭据将交给 Git 凭据助手保存。SSH 远程请配置 SSH 密钥。认证后请重新执行远程操作。',fields:[{key:'url',label:'HTTPS 仓库地址',value:data?.remotes.find(r=>r.name===remote)?.fetch||''},{key:'username',label:'用户名'},{key:'secret',label:'密码或 Token',type:'password'}]})
      }
      return false
    } finally {lock.current=false;if(alive.current)setBusy(false)}
  }
  const openForm=(next:Form)=>{setValues(Object.fromEntries((next.fields||[]).map(f=>[f.key,f.value||''])));setForm(next)}
  const confirm=(title:string,endpoint:string,payload:Record<string,any>,warning:string)=>openForm({title,endpoint,payload,warning})
  const inspect=async(endpoint:string,payload:Record<string,any>,title:string)=>{
    const id=++previewGeneration.current;setPreviewBusy(true);setError('');setPreview({title,patch:''})
    try{const result=await call(endpoint,payload);if(alive.current&&id===previewGeneration.current)setPreview({title,...result})}
    catch(e){if(alive.current&&id===previewGeneration.current){setError(messageOf(e));setPreview(null)}}
    finally{if(alive.current&&id===previewGeneration.current)setPreviewBusy(false)}
  }
  const inspectCommit=async(commit:Commit)=>{
    const id=++previewGeneration.current;setPreview(null);setPreviewBusy(true);setError('')
    try{const result=await call('show',{rev:commit.hash,noPatch:true});if(alive.current&&id===previewGeneration.current)setDetail(result)}
    catch(e){if(alive.current&&id===previewGeneration.current)setError(messageOf(e))}
    finally{if(alive.current&&id===previewGeneration.current)setPreviewBusy(false)}
  }
  const toggle=(paths:string[])=>setSelected(old=>{const next=new Set(old),remove=paths.every(p=>next.has(p));paths.forEach(p=>remove?next.delete(p):next.add(p));return next})
  const paths=[...selected]
  const changePaths=(items:Change[])=>[...new Set(items.flatMap(e=>e.origPath?[e.origPath,e.path]:[e.path]))]
  const chosen=data?.status.entries.filter(e=>selected.has(e.path))||[]
  const mayWrite=data?.config.allowWrite!==false, mayDanger=data?.config.allowDangerous!==false
  const action=(icon:IconName,label:string,onClick:()=>void,disabled=false)=><IconButton icon={icon} label={label} disabled={busy||disabled} onClick={onClick}/>
  const remoteAction=(endpoint:string)=>{
    const payload=endpoint==='push'?{remote,branch:data?.repo.branch,setUpstream:true}:{remote}
    if(endpoint==='push'||endpoint==='pull')confirm(endpoint==='push'?'推送当前分支':'拉取远程更新',endpoint,payload,endpoint==='push'?'将当前分支推送至 '+remote+'，并设置跟踪分支。':'合并当前跟踪分支的远程更新；冲突会保留在工作区供处理。')
    else void run(endpoint,payload)
  }
  return <div ref={root} className="codex-git" aria-label="Git 版本管理" aria-busy={busy||loading}>
    <style>{GIT_CSS}</style>
    <div className="git-toolbar">
      <Icon name="git" size={16}/><code title={cwd}>{data?.repo.branch||'Git'}{data?.repo.detached?' · 分离 HEAD':''}</code>
      {data?.repo.upstream&&<span title={data.repo.upstream}>↑{data.repo.ahead} ↓{data.repo.behind}</span>}
      <span className="git-spacer"/>
      {data&&action('download','获取远程更新',()=>remoteAction('fetch'),!mayWrite)}
      {data&&action('arrowDown','拉取',()=>remoteAction('pull'),!mayWrite)}
      {data&&action('arrowUp','推送',()=>remoteAction('push'),!mayWrite||!data.config.allowPush||!remote)}
      {action('refresh','刷新 Git',()=>{setError('');void refresh()},loading)}
    </div>
    {data&&<div className="git-tabs" role="tablist" aria-label="版本管理视图">{tabs.map(t=><button type="button" key={t.id} role="tab" aria-selected={tab===t.id} onClick={()=>{setTab(t.id);setPreview(null);setDetail(null);setPreviewBusy(false);previewGeneration.current++}}><Icon name={t.icon} size={15}/>{t.label}{t.id==='changes'&&<small>{data.status.entries.length}</small>}</button>)}</div>}
    {error&&<div className="git-error" role="alert"><span>{error}</span>{action('close','关闭错误',()=>setError(''))}</div>}
    {notice&&<div className="git-notice" role="status">{notice}</div>}
    {noRepo?<div className="git-empty"><Icon name="git" size={32}/><h3>此项目尚未使用 Git</h3><code>{cwd}</code><p>初始化仓库以跟踪本地变更和提交历史。</p><button className="dsh-codex-button" disabled={busy} onClick={()=>openForm({title:'初始化 Git 仓库',endpoint:'repo/init',payload:{},fields:[{key:'branch',label:'初始分支',value:'main'}]})}>初始化仓库</button></div>:!data?<div className="git-empty">{loading?'正在读取仓库…':'无法读取仓库，请检查错误后刷新。'}</div>:<>
      <div className="git-content" role="tabpanel" aria-label={tabs.find(t=>t.id===tab)?.label}>
      {tab==='changes'&&<>
        <div className="git-section-head"><strong>本地变更</strong><span>{paths.length} 项已勾选</span><span className="git-spacer"/>{action('plus','暂存勾选文件',()=>void run('stage',{paths:changePaths(chosen)}),!paths.length||!mayWrite)}{action('ban','取消勾选文件暂存',()=>void run('unstage',{paths:changePaths(chosen)}),!paths.length||!mayWrite)}{action('trash','丢弃勾选文件工作区改动',()=>confirm('丢弃工作区改动','discard',{paths},'将恢复勾选文件的工作区改动，并永久删除勾选的未跟踪文件。已暂存内容会保留。\n'+paths.join('\n')),!paths.length||!mayDanger||!mayWrite)}</div>
        {data.status.entries.length===0&&<div className="git-empty"><Icon name="check" size={28}/><p>工作区干净，没有本地变更</p></div>}
        {([{label:'冲突',test:(e:Change)=>e.conflicted,staged:false},{label:'已暂存',test:(e:Change)=>e.staged&&!e.conflicted,staged:true},{label:'已修改',test:(e:Change)=>e.unstaged&&!e.conflicted,staged:false},{label:'未跟踪',test:(e:Change)=>e.untracked,staged:false}]).map(group=>{
          const entries=data.status.entries.filter(group.test);if(!entries.length)return null
          return <section key={group.label}><div className="git-group"><label><input type="checkbox" aria-label={'勾选'+group.label} checked={entries.every(e=>selected.has(e.path))} onChange={()=>toggle(entries.map(e=>e.path))}/>{group.label} <small>{entries.length}</small></label></div>{entries.map(e=><div className="git-file" key={e.path}><input type="checkbox" aria-label={'勾选 '+e.path} checked={selected.has(e.path)} onChange={()=>toggle([e.path])}/><button title={e.origPath?e.origPath+' → '+e.path:e.path} onClick={()=>void inspect('diff',{path:e.path,staged:group.staged,untracked:e.untracked},(group.staged?'暂存区 · ':'工作区 · ')+e.path)}><b className={e.conflicted?'git-conflict':''}>{e.conflicted?'U':e.untracked?'?':group.staged?e.index:e.worktree}</b><code>{e.origPath&&<span>{e.origPath} → </span>}{e.path}</code></button>{action(group.staged?'ban':'plus',group.staged?'取消暂存 '+e.path:'暂存 '+e.path,()=>void run(group.staged?'unstage':'stage',{paths:changePaths([e])}),!mayWrite)}</div>)}</section>
        })}
        <div className="git-commit"><textarea aria-label="提交信息" placeholder="提交信息" rows={3} value={message} onChange={e=>setMessage(e.target.value)}/><div className="git-inline"><label><input type="checkbox" checked={amend} onChange={e=>setAmend(e.target.checked)}/>修订上次提交</label><span className="git-spacer"/><button className="dsh-codex-button" disabled={busy||!mayWrite||!message.trim()||(!amend&&!data.status.entries.some(e=>e.staged&&!e.conflicted))||data.status.entries.some(e=>e.conflicted)} onClick={()=>confirm(amend?'修订暂存区提交':'提交全部暂存','commit',{message,amend},'将提交全部已暂存内容，工作区中未暂存的改动会保留。'+(amend?'这会重写上次提交。':''))}>提交暂存区</button><button className="dsh-codex-button primary" disabled={busy||!mayWrite||!paths.length||!message.trim()} onClick={()=>confirm(amend?'修订上次提交':'提交勾选文件','commit',{paths:changePaths(chosen),message,amend},(amend?'将重写上次提交。':'将暂存并提交勾选文件的全部当前内容，其他已暂存文件不纳入本次提交。')+'\n'+paths.join('\n'))}><Icon name="check" size={15}/>提交 {paths.length} 项</button></div></div>
      </>}
      {tab==='history'&&<><div className="git-section-head"><strong>所有分支历史</strong><small>{data.commits.length} 条</small></div><CommitGraph commits={data.commits} branches={[...data.branches.local,...data.branches.remote]} head={data.repo.oid} onSelect={c=>void inspectCommit(c)}/>{!data.commits.length&&<div className="git-empty">仓库还没有提交</div>}{canMore&&data.commits.length<2000&&<button className="dsh-codex-button git-more" disabled={loading||busy} onClick={()=>{loaded.current=Math.min(2000,loaded.current+50);void refresh()}}>加载更多提交</button>}</>}
      {tab==='branches'&&<><div className="git-section-head"><strong>分支</strong><span className="git-spacer"/>{action('plus','新建分支',()=>openForm({title:'新建分支',endpoint:'branch/create',payload:{},fields:[{key:'name',label:'分支名称'},{key:'startPoint',label:'起点（可留空）'}]}),!mayWrite)}</div>{(['local','remote'] as const).map(kind=><section key={kind}><h4>{kind==='local'?'本地分支':'远程分支'}</h4>{data.branches[kind].length===0&&<p className="git-muted">暂无分支</p>}{data.branches[kind].map(b=><div className="git-card" key={b.ref}><div><strong><Icon name="git" size={14}/> {b.name}{data.repo.branch===b.name?' · 当前':''}</strong><small>{b.shortHash} {b.upstream&&'→ '+b.upstream} ↑{b.ahead} ↓{b.behind}</small></div><div className="git-inline">{action('arrowRight','切换到 '+b.name,()=>confirm('切换分支','checkout',{ref:b.name},'切换到 '+b.name+'；未提交改动由 Git 检查，冲突时停止。'),!mayWrite||data.repo.branch===b.name)}{action('fork','合并 '+b.name,()=>confirm('合并分支','merge',{ref:b.ref},'将 '+b.name+' 合并到 '+data.repo.branch+'。'),!mayWrite||data.repo.branch===b.name)}{kind==='local'&&action('trash','删除 '+b.name,()=>confirm('删除分支','branch/delete',{name:b.name},'删除本地分支 '+b.name+'。未合并的分支会被 Git 拒绝。'),!mayWrite||!mayDanger||data.repo.branch===b.name)}</div></div>)}</section>)}</>}
      {tab==='remotes'&&<><div className="git-section-head"><strong>远程仓库</strong><span className="git-spacer"/>{action('plus','添加远程仓库',()=>openForm({title:'添加远程仓库',endpoint:'remote/add',payload:{},fields:[{key:'name',label:'远程名称',value:'origin'},{key:'url',label:'获取地址'},{key:'push',label:'推送地址（可留空）'}]}),!mayWrite)}</div>{data.remotes.length>0&&<div className="git-inline git-pad"><SelectMenu label="操作远程" value={remote} options={data.remotes.map(r=>({value:r.name,label:r.name}))} onChange={setRemote}/>{action('download','获取选定远程',()=>remoteAction('fetch'),!mayWrite)}{action('arrowUp','推送选定远程',()=>remoteAction('push'),!mayWrite||!data.config.allowPush)}</div>}{data.remotes.length===0&&<div className="git-empty">尚未配置远程仓库，添加后可获取和推送。</div>}{data.remotes.map(r=><div className="git-card" key={r.name}><div><strong>{r.name}</strong><code>fetch · {r.fetch}</code><code>push · {r.push}</code></div>{action('trash','移除远程 '+r.name,()=>confirm('移除远程','remote/remove',{name:r.name},'移除 '+r.name+' 的本地配置和跟踪引用；远程服务器上的仓库仍然保留。'),!mayWrite)}</div>)}</>}
      {tab==='stash'&&<><div className="git-section-head"><strong>贮藏</strong><span className="git-spacer"/>{action('plus','创建贮藏',()=>openForm({title:'贮藏当前改动',endpoint:'stash',payload:{action:'push',includeUntracked:true},warning:'保存已跟踪和未跟踪文件的当前改动，并恢复干净工作区。',fields:[{key:'message',label:'贮藏说明（可留空）'}]}),!mayWrite)}</div>{data.stashes.length===0&&<div className="git-empty">没有贮藏记录</div>}{data.stashes.map(s=><div className="git-card" key={s.ref}><div><button className="dsh-codex-button" onClick={()=>void inspect('stash/show',{ref:s.hash},s.ref)}>查看差异</button><strong>{s.ref}</strong><p>{s.subject}</p><small>{s.date}</small><div className="git-inline"><button className="dsh-codex-button" disabled={busy||!mayWrite} onClick={()=>confirm('应用贮藏','stash',{action:'apply',ref:s.ref,expectedHash:s.hash},'应用 '+s.ref+'，保留贮藏记录。')}>应用</button><button className="dsh-codex-button" disabled={busy||!mayWrite} onClick={()=>confirm('弹出贮藏','stash',{action:'pop',ref:s.ref,expectedHash:s.hash},'应用 '+s.ref+'，成功后删除该贮藏记录。')}>弹出</button>{action('trash','删除 '+s.ref,()=>confirm('删除贮藏','stash',{action:'drop',ref:s.ref,expectedHash:s.hash},'永久删除 '+s.ref+'：'+s.subject),!mayWrite||!mayDanger)}</div></div></div>)}</>}
      {tab==='console'&&<><div className="git-section-head"><strong>命令记录</strong><span className="git-spacer"/>{action('trash','清空本仓库命令记录',()=>void run('console/clear'))}</div>{data.console.slice().reverse().map((entry,i)=><details className="git-command" key={entry.at+':'+i}><summary><span className={entry.exitCode===0?'git-success':'git-conflict'}>{entry.exitCode===0?'✓':'!'} {entry.exitCode??'终止'}</span> <code>{entry.argv.join(' ')}</code><small>{entry.durationMs}ms · {new Date(entry.at).toLocaleTimeString()}</small></summary>{entry.truncated&&<p>输出已截断</p>}{entry.timeout&&<p>执行超时</p>}<pre>{entry.stdout||entry.stderr?'':'无输出'}{entry.stdout}{entry.stderr}</pre></details>)}</>}
      </div>
      {detail&&<div className="git-detail"><div className="git-section-head"><strong>提交详情 · {detail.commit.shortHash}</strong><span className="git-spacer"/>{action('close','关闭提交详情',()=>setDetail(null))}</div><div className="git-pad"><strong>{detail.commit.subject}</strong><p>{detail.commit.author} &lt;{detail.commit.email}&gt;<br/>{detail.commit.date}</p><code>{detail.commit.hash}</code>{detail.commit.body&&<pre>{detail.commit.body}</pre>}<div className="git-inline"><button className="dsh-codex-button" disabled={busy||!mayDanger||!mayWrite} onClick={()=>confirm('还原此提交','revert',{rev:detail.commit.hash},'创建反向提交以撤销 '+detail.commit.shortHash+'。')}>还原提交</button><button className="dsh-codex-button" disabled={busy||!mayDanger||!mayWrite} onClick={()=>confirm('拣选此提交','cherry-pick',{rev:detail.commit.hash},'将此提交应用到当前分支。')}>拣选</button><SelectMenu label="重置方式" value={resetMode} options={[{value:'soft',label:'Soft · 保留暂存'},{value:'mixed',label:'Mixed · 保留工作区'},{value:'hard',label:'Hard · 丢弃改动'}]} onChange={setResetMode}/><button className="dsh-codex-button danger" disabled={busy||!mayDanger||!mayWrite} onClick={()=>confirm('重置到此提交','reset',{rev:detail.commit.hash,mode:resetMode},'将当前分支移动到 '+detail.commit.shortHash+'。'+(resetMode==='hard'?'Hard 重置会永久丢弃已跟踪文件的暂存和工作区改动。':resetMode==='mixed'?'取消暂存，保留工作文件。':'保留暂存和工作文件。'))}>重置</button></div></div>{detail.files.map(f=><button className="git-detail-file" key={f.path} onClick={()=>void inspect('show/file',{rev:detail.commit.hash,path:f.path},detail.commit.shortHash+' · '+f.path)}><b>{f.status}</b><code>{f.origPath&&f.origPath+' → '}{f.path}</code></button>)}</div>}
      {preview&&<DiffPreview preview={preview} loading={previewBusy} close={()=>{previewGeneration.current++;setPreview(null);setPreviewBusy(false)}}/>}
      {!preview&&previewBusy&&<div role="status" className="git-muted git-pad">读取提交…</div>}
    </>}
    {form&&<div className="git-modal-backdrop" onKeyDown={e=>{if(e.key==='Escape'&&!busy){e.stopPropagation();setForm(null)}}}><form className="git-modal" role="dialog" aria-modal="true" aria-label={form.title} onSubmit={async e=>{e.preventDefault();const ok=await run(form.endpoint,{...form.payload,...values});if(ok&&alive.current){setForm(null);setValues({});if(form.endpoint==='commit'){setMessage('');setSelected(new Set());setAmend(false)}}}}><header>{form.title}</header>{form.warning&&<p className="git-warning">{form.warning}</p>}{form.fields?.map(f=><label key={f.key}>{f.label}<input className="dsh-codex-search" type={f.type||'text'} autoComplete={f.type==='password'?'new-password':'off'} value={values[f.key]||''} onChange={e=>setValues(v=>({...v,[f.key]:e.target.value}))}/></label>)}{error&&<p className="git-error" role="alert">{error}</p>}<footer><button type="button" className="dsh-codex-button" disabled={busy} onClick={()=>setForm(null)}>取消</button><button className="dsh-codex-button primary" disabled={busy}>{busy?'执行中…':'确认'}</button></footer></form></div>}
  </div>
}

function DiffPreview({preview,loading,close}:{preview:Preview,loading:boolean,close:()=>void}) {
  const lines=preview.patch.split('\n'),hunks=lines.flatMap((line,i)=>line.startsWith('@@')?[i]:[])
  const [hunk,setHunk]=React.useState(0),refs=React.useRef<(HTMLDivElement|null)[]>([])
  React.useEffect(()=>setHunk(0),[preview])
  let oldLine=0,newLine=0
  const jump=(offset:number)=>{const i=(hunk+offset+hunks.length)%hunks.length;setHunk(i);refs.current[hunks[i]]?.scrollIntoView({block:'center',behavior:'smooth'})}
  return <section className="git-diff"><div className="git-section-head"><code title={preview.title}>{preview.title}</code><span className="git-spacer"/><IconButton icon="arrowUp" label="上一个改动块" disabled={!hunks.length} onClick={()=>jump(-1)}/><small>{hunks.length?hunk+1:0}/{hunks.length}</small><IconButton icon="arrowDown" label="下一个改动块" disabled={!hunks.length} onClick={()=>jump(1)}/><IconButton icon="close" label="关闭差异" onClick={close}/></div>{preview.truncated&&<p className="git-warning">差异过大，输出已截断。</p>}<div className="git-diff-scroll">{loading?<p className="git-pad">读取差异…</p>:!preview.patch?<p className="git-pad">没有文本差异</p>:/Binary files|GIT binary patch/.test(preview.patch)?<p className="git-pad">二进制文件发生变化，无法显示文本差异。</p>:lines.map((line,i)=>{
    const match=/^@@ -(\d+)(?:,\d+)? \+(\d+)/.exec(line);let old='',next='',kind=''
    if(match){oldLine=+match[1];newLine=+match[2];kind='hunk'}
    else if(line.startsWith('+')&&!line.startsWith('+++')){next=String(newLine++);kind='add'}
    else if(line.startsWith('-')&&!line.startsWith('---')){old=String(oldLine++);kind='del'}
    else if(line.startsWith(' ')){old=String(oldLine++);next=String(newLine++)}
    return <div className={'git-diff-line '+kind} key={i} ref={el=>{refs.current[i]=el}}><span>{old}</span><span>{next}</span><code>{line||' '}</code></div>
  })}</div></section>
}

// Multi-lane topology: stable parent lanes, including merge and off-page edges.
function CommitGraph({commits,branches,head,onSelect}:{commits:Commit[],branches:Branch[],head:string,onSelect:(c:Commit)=>void}) {
  const rows=graphRows(commits),width=Math.max(24,...rows.map(r=>Math.max(r.before.length,r.after.length)*16+8))
  const colors=['#728fcb','#65a58a','#b18bc6','#bc9168','#72a6b5','#bd7d8a']
  return <div className="git-history">{commits.map((c,i)=>{const r=rows[i],x=(n:number)=>n*16+12;return <button className="git-history-row" key={c.hash} onClick={()=>onSelect(c)}><svg width={width} height="48" aria-hidden="true" style={{minWidth:width}}>{r.through.map(n=><path key={'v'+n} d={'M'+x(n)+' 0 V48'} stroke={colors[n%colors.length]} fill="none"/>)}{r.before[r.lane]===c.hash&&<path d={'M'+x(r.lane)+' 0 V24'} stroke={colors[r.lane%colors.length]}/ >}{r.edges.map((edge,j)=><path key={j} d={'M'+x(edge.from)+' 24 C'+x(edge.from)+' 38 '+x(edge.to)+' 38 '+x(edge.to)+' 48'} stroke={colors[edge.to%colors.length]} fill="none"/>)}<circle cx={x(r.lane)} cy="24" r="4" stroke={colors[r.lane%colors.length]} fill={c.hash===head?colors[r.lane%colors.length]:'var(--codex-bg)'}/></svg><span className="git-history-text"><strong>{branches.filter(b=>b.hash===c.hash).map(b=><em key={b.ref}>{b.name}</em>)}{c.subject}</strong><small><code>{c.shortHash}</code> · {c.author} · {c.date.slice(0,10)}</small></span></button>})}</div>
}
