import * as React from 'react'
import { Icon } from './Icon'

type ToastKind = 'success' | 'error' | 'info'
type ToastItem = { id: number, message: string, kind: ToastKind, duration: number }
let nextId = 0

/** 显示短暂的操作反馈；可从任意客户端模块调用。 */
export function toast(message: string, kind: ToastKind = 'info', duration = 3500) {
  window.dispatchEvent(new CustomEvent('dsh-codex-toast', { detail: { id: ++nextId, message, kind, duration } }))
}

function ToastMessage({ item, dismiss }: { item: ToastItem, dismiss: (id: number) => void }) {
  React.useEffect(() => {
    const timer = setTimeout(() => dismiss(item.id), item.duration)
    return () => clearTimeout(timer)
  }, [item, dismiss])
  return <div className={'dsh-codex-toast is-' + item.kind} role={item.kind === 'error' ? 'alert' : 'status'}>
    <Icon className="dsh-codex-toast-symbol" name={item.kind === 'success' ? 'circleCheck' : item.kind === 'error' ? 'circleAlert' : 'info'} size={19}/>
    <span className="dsh-codex-toast-message">{item.message}</span>
    <button type="button" aria-label="关闭提示" onClick={() => dismiss(item.id)}><Icon name="close" size={14}/></button>
  </div>
}

export function ToastHost() {
  const [items, setItems] = React.useState<ToastItem[]>([])
  const dismiss = React.useCallback((id: number) => setItems(old => old.filter(item => item.id !== id)), [])
  React.useEffect(() => {
    const receive = (event: Event) => setItems(old => [...old.slice(-3), (event as CustomEvent<ToastItem>).detail])
    window.addEventListener('dsh-codex-toast', receive)
    return () => window.removeEventListener('dsh-codex-toast', receive)
  }, [])
  return <div className="dsh-codex-toast-host">{items.map(item => <ToastMessage key={item.id} item={item} dismiss={dismiss}/>)}</div>
}
