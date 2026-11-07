import * as React from 'react'
import {initialTheme,NAV_KEY,THEME_KEY,revealCircle,save,stored,type Theme} from './appearance'

export function useAppearance(root:React.RefObject<HTMLDivElement|null>){
 const [theme,setTheme]=React.useState<Theme>(initialTheme)
 const [collapsed,setCollapsed]=React.useState(()=>stored(NAV_KEY)==='1')
 const [navOpen,setNavOpen]=React.useState(false)
 const [busy,setBusy]=React.useState(false)
 const inFlight=React.useRef(false),alive=React.useRef(true)
 const current=React.useRef(theme)
 const committed=React.useRef<(()=>void)|null>(null)
 const transitionRef=React.useRef<any>(null)
 const token=React.useRef('codex-'+Math.random().toString(36).slice(2))
 React.useLayoutEffect(()=>{
  current.current=theme
  committed.current?.()
  committed.current=null
 },[theme])
 React.useEffect(()=>{alive.current=true;return ()=>{
  alive.current=false
  transitionRef.current?.skipTransition()
  committed.current?.()
  if(document.documentElement.dataset.codexTransition===token.current)delete document.documentElement.dataset.codexTransition
 }},[])
 React.useEffect(()=>{
  const media=matchMedia('(min-width: 768px)')
  const close=()=>setNavOpen(false)
  media.addEventListener('change',close)
  return ()=>media.removeEventListener('change',close)
 },[])
 React.useEffect(()=>{
  if(!navOpen)return
  const key=(event:KeyboardEvent)=>{
   if(event.key==='Escape'&&!event.defaultPrevented&&!root.current?.querySelector('[role="dialog"],[role="menu"]'))setNavOpen(false)
  }
  window.addEventListener('keydown',key)
  return ()=>window.removeEventListener('keydown',key)
 },[navOpen,root])
 const commit=(next:Theme)=>new Promise<void>(resolve=>{
  if(!alive.current||current.current===next){resolve();return}
  committed.current=resolve
  setTheme(next)
 })
 const toggleTheme=async(event:React.MouseEvent<HTMLButtonElement>)=>{
  if(inFlight.current)return
  const next=current.current==='dark'?'light':'dark'
  const apply=async()=>{await commit(next);save(THEME_KEY,next)}
  const host=root.current,doc=document as any
  if(!host)return
  if(typeof doc.startViewTransition!=='function'||matchMedia('(prefers-reduced-motion: reduce)').matches||document.hidden){await apply();return}
  const rect=event.currentTarget.getBoundingClientRect()
  const point=revealCircle(innerWidth,innerHeight,event.detail>0?event.clientX:rect.left+rect.width/2,event.detail>0?event.clientY:rect.top+rect.height/2)
  inFlight.current=true;setBusy(true)
  document.documentElement.dataset.codexTransition=token.current
  host.dataset.themeRevealing='true'
  let transition:any,animation:Animation|undefined
  try{
   transition=doc.startViewTransition(apply)
   transitionRef.current=transition
   await transition.ready
   animation=document.documentElement.animate(
    {clipPath:[`circle(0px at ${point.x}px ${point.y}px)`,`circle(${point.radius}px at ${point.x}px ${point.y}px)`]},
    {duration:460,easing:'cubic-bezier(.4,0,.2,1)',pseudoElement:'::view-transition-new(codex-panel)'} as any)
   await animation.finished
  }catch{
   transition?.skipTransition()
   await apply()
  }finally{
   if(transition)await transition.finished.catch(()=>{})
   animation?.cancel()
   if(document.documentElement.dataset.codexTransition===token.current)delete document.documentElement.dataset.codexTransition
   delete host.dataset.themeRevealing
   transitionRef.current=null;inFlight.current=false
   if(alive.current)setBusy(false)
  }
 }
 const toggleNav=()=>{
  if(innerWidth<768)setNavOpen(open=>!open)
  else setCollapsed(value=>{save(NAV_KEY,value?'0':'1');return !value})
 }
 return {theme,collapsed,navOpen,busy,toggleTheme,toggleNav,closeNav:()=>setNavOpen(false)}
}
