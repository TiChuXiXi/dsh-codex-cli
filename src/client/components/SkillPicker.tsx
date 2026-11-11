import * as React from 'react'
import {Icon} from './Icon'
import type {Skill} from '../skills'
export function SkillPicker({skills,query,onQuery,loading,error,errors,index,onIndex,onChoose,onClose,onRefresh}:{
 skills:Skill[],query:string,onQuery?:(q:string)=>void,loading:boolean,error:string,errors:{path?:string,message:string}[],index:number,onIndex:(i:number)=>void,onChoose:(s:Skill)=>void,onClose:()=>void,onRefresh:()=>void
}){
 const root=React.useRef<HTMLDivElement>(null)
 const [detail,setDetail]=React.useState<Skill|null>(null)
 React.useEffect(()=>{
   const close=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node)&&!(e.target as Element)?.closest?.('.dsh-codex-composer-input'))onClose()}
   document.addEventListener('pointerdown',close)
   return()=>document.removeEventListener('pointerdown',close)
 },[])
 React.useEffect(()=>{root.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({block:'nearest'})},[index])
 return <div className="dsh-codex-skill-picker" ref={root} onKeyDown={e=>{
   if(e.key==='Escape'){e.preventDefault();e.stopPropagation();if(detail)setDetail(null);else onClose()}
   else if(detail)return
   else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(skills.length)onIndex((index+(e.key==='ArrowDown'?1:-1)+skills.length)%skills.length)}
   else if(e.key==='Enter'||e.key==='Tab'){if((e.target as HTMLElement).tagName==='BUTTON'&&(e.target as HTMLElement).getAttribute('role')!=='option')return;e.preventDefault();if(skills[index]?.enabled)onChoose(skills[index])}
 }}>
   {detail ? <>
    <header><strong>技能详情</strong><span/><button type="button" aria-label="返回技能列表" title="返回技能列表" onClick={()=>setDetail(null)}><Icon name="arrowLeft" size={15}/></button><button type="button" aria-label="关闭技能列表" title="关闭技能列表" onClick={onClose}><Icon name="close" size={15}/></button></header>
    <section className="dsh-codex-skill-detail">
     <strong>{detail.interface?.displayName||detail.name}</strong>
     <div className="dsh-codex-skill-detail-path">{detail.path}</div>
     <div className="dsh-codex-skill-detail-description">{detail.description||detail.interface?.shortDescription||detail.shortDescription}</div>
    </section>
   </> : <>
   <header><strong>Skills · 技能</strong><span>{skills.length} 项</span><button type="button" title="刷新技能列表" aria-label="刷新技能列表" onClick={onRefresh}><Icon name="refresh" size={15}/></button><button type="button" title="关闭技能列表" aria-label="关闭技能列表" onClick={onClose}><Icon name="close" size={15}/></button></header>
   {onQuery&&<input autoFocus className="dsh-codex-search" aria-label="搜索技能" placeholder="搜索名称或说明" value={query} onChange={e=>onQuery(e.target.value)}/>}
   {loading&&<p role="status">正在读取技能…</p>}
   {error&&<div role="alert">{error}<button type="button" onClick={onRefresh}>重试</button></div>}
   {errors.map((e,i)=><p className="dsh-codex-skill-warning" key={i}>{e.path}: {e.message}</p>)}
   <div role="listbox" id="codex-skill-options" aria-label="技能列表">{skills.map((s,i)=><div className="dsh-codex-skill-row" key={s.path}>
    <button type="button" role="option" id={'codex-skill-option-'+i} aria-selected={index===i} aria-disabled={!s.enabled} onMouseMove={e=>{if(e.movementX!==0||e.movementY!==0)onIndex(i)}} onMouseDown={e=>e.preventDefault()} onClick={()=>s.enabled&&onChoose(s)}>
     <strong>{s.interface?.displayName||s.name}</strong>{!s.enabled&&<small>已禁用</small>}
     <span className="dsh-codex-skill-description">{s.interface?.shortDescription||s.shortDescription||s.description}</span>
    </button>
    <button type="button" className="dsh-codex-skill-info" aria-label={`查看技能详情 ${s.interface?.displayName||s.name}`} title="查看技能详情" onClick={()=>setDetail(s)}><Icon name="circleAlert" size={16}/></button>
   </div>)}</div>
   {!loading&&!error&&!skills.length&&<p>没有匹配的技能</p>}
   <footer>↑↓ 选择 · Enter / Tab 使用 · Esc 关闭</footer>
   </>}
 </div>
}
