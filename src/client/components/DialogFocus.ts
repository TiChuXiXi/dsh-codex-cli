import * as React from 'react'
/** Focus follows the top modal without changing the individual dialogs' actions. */
export function useDialogFocus(root:React.RefObject<HTMLElement|null>){
 React.useEffect(()=>{
  const host=root.current;if(!host)return
  let current:HTMLElement|null=null,previous:HTMLElement|null=null
  const visible=()=>[...host.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]')].filter(el=>!el.closest('[hidden]')&&el.getClientRects().length).at(-1)||null
  const sync=()=>{
   const next=visible();if(next===current)return
   if(next){
    if(!current)previous=document.activeElement as HTMLElement
    current=next
    next.tabIndex=-1
    const heading=next.querySelector<HTMLElement>('header')
    if(heading&&!next.getAttribute('aria-label')&&!next.getAttribute('aria-labelledby'))next.setAttribute('aria-label',heading.textContent||'')
    if(!next.contains(document.activeElement))(next.querySelector<HTMLElement>('input:not(:disabled),button:not(:disabled),[tabindex="0"]')||next).focus()
   }else{current=null;if(previous?.isConnected)previous.focus();previous=null}
  }
  const key=(event:KeyboardEvent)=>{
   if(event.key!=='Tab'||!current)return
   const controls=[...current.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),textarea:not(:disabled),select:not(:disabled),a[href],[tabindex="0"]')].filter(el=>el.getClientRects().length)
   if(!controls.length){event.preventDefault();current.focus();return}
   const first=controls[0],last=controls.at(-1)!
   if(event.shiftKey&&(document.activeElement===first||document.activeElement===current)){event.preventDefault();last.focus()}
   else if(!event.shiftKey&&(document.activeElement===last||document.activeElement===current)){event.preventDefault();first.focus()}
  }
  const observer=new MutationObserver(sync);observer.observe(host,{childList:true,subtree:true})
  host.addEventListener('keydown',key);sync()
  return ()=>{observer.disconnect();host.removeEventListener('keydown',key)}
 },[root])
}
