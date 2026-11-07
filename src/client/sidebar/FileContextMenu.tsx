import * as React from 'react'
import {Icon,type IconName} from '../components/Icon'

export function FileContextMenu({context,onClose,onAction}:{
 context:{x:number,y:number,entry:{type:string,path:string,name:string}|null,directory:string},
 onClose:()=>void,onAction:(action:string)=>void
}){
 const root=React.useRef<HTMLDivElement>(null)
 const previous=React.useRef(document.activeElement as HTMLElement)
 const [position,setPosition]=React.useState({left:context.x,top:context.y})
 React.useLayoutEffect(()=>{
   const menu=root.current;if(!menu)return
   const box=menu.getBoundingClientRect()
   setPosition({left:Math.max(8,Math.min(context.x,innerWidth-box.width-8)),top:Math.max(8,Math.min(context.y,innerHeight-box.height-8))})
   menu.querySelector<HTMLElement>('button')?.focus()
 },[context])
 React.useEffect(()=>{
   const menu=root.current
   const outside=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))onClose()}
   const close=()=>onClose()
   document.addEventListener('pointerdown',outside);window.addEventListener('resize',close);window.addEventListener('scroll',close,true)
   return()=>{document.removeEventListener('pointerdown',outside);window.removeEventListener('resize',close);window.removeEventListener('scroll',close,true);if(previous.current?.isConnected&&(menu?.contains(document.activeElement)||document.activeElement===document.body))previous.current.focus({preventScroll:true})}
 },[])
 const {entry}=context
 const items:{id:string,label:string,icon:IconName}[]=[
   ...(entry?.type==='file'?[{id:'open',label:'打开文件',icon:'file' as IconName},{id:'download',label:'下载文件',icon:'download' as IconName}]:[]),
   {id:'upload',label:entry?.type==='dir'?'上传文件到此文件夹':'上传文件到当前目录',icon:'arrowUp'},
   {id:'copy',label:'复制绝对路径',icon:'copy'},{id:'relative',label:'复制相对路径',icon:'copy'},
   {id:'reference',label:'@ 到当前对话',icon:'attachment'},
   {id:'refresh',label:'刷新',icon:'refresh'},
   ...(entry&&!entry.path.split(/[\\/]/).some(p=>p==='.git'||p==='.dsh-trash')?[{id:'delete',label:entry.type==='dir'?'删除文件夹':'删除文件',icon:'trash' as IconName}]:[])
 ]
 return <div ref={root} className="codex-file-context-menu" role="menu" aria-label={entry?entry.type==='dir'?'文件夹操作':'文件操作':'空白区域操作'} style={{position:'fixed',...position}} onContextMenu={e=>{e.preventDefault();e.stopPropagation()}} onKeyDown={e=>{
   const buttons=[...root.current!.querySelectorAll<HTMLButtonElement>('button')]
   const i=buttons.indexOf(document.activeElement as HTMLButtonElement)
   if(e.key==='Escape'||e.key==='Tab'){e.preventDefault();e.stopPropagation();onClose()}
   if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();buttons[e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length]?.focus()}
 }}>{items.map(item=><button type="button" role="menuitem" key={item.id} className={item.id==='delete'?'danger':''} onClick={()=>onAction(item.id)}><Icon name={item.icon} size={15}/>{item.label}</button>)}</div>
}
