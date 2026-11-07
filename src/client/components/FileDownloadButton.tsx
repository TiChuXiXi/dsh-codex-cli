import * as React from 'react'
import type {Api} from '../rpc'
import {Icon} from './Icon'

export async function downloadWorkspaceFile(api:Api,cwd:string,path:string) {
  const workspace=await api('workspace/open',{cwd})
  const info=await api('workspace/downloadInfo',{workspaceId:workspace.workspaceId,path})
  const link=document.createElement('a')
  link.href='/codex-cli/workspace/download?'+new URLSearchParams({workspaceId:workspace.workspaceId,path})
  link.download=info.name
  document.body.appendChild(link);link.click();link.remove()
}
export function FileDownloadButton({api,cwd,path,children,className=''}:{
 api:Api,cwd:string,path:string,children?:React.ReactNode,className?:string
}){
 const [busy,setBusy]=React.useState(false),[error,setError]=React.useState('')
 return <span className="dsh-codex-download"><button type="button" className={className||'dsh-codex-download-button'} title={'下载 '+path} aria-label={'下载 '+path.split('/').at(-1)} disabled={busy} onClick={async()=>{
   setBusy(true);setError('')
   try{await downloadWorkspaceFile(api,cwd,path)}catch(e){setError(e instanceof Error?e.message:String(e))}finally{setBusy(false)}
 }}>{children||<Icon name={busy?'loader':'download'} size={15}/>}</button>{error&&<span role="alert" className="dsh-codex-download-error">{error}</span>}</span>
}
