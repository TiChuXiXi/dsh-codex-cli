import * as React from 'react'
import { createPortal } from 'react-dom'

export function ImageViewer({src, alt, className, onError}: {src: string, alt: string, className?: string, onError?: () => void}) {
  const [open, setOpen] = React.useState(false)
  const [scale, setScale] = React.useState(1)
  const overlay = React.useRef<HTMLDivElement | null>(null)
  const trigger = React.useRef<HTMLButtonElement | null>(null)
  React.useEffect(() => {
    if (!open) return
    const element = overlay.current
    const wheel = (event: WheelEvent) => {
      event.preventDefault()
      setScale(value => Math.max(0.25, Math.min(8, value * Math.exp(-event.deltaY * 0.0015))))
    }
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    element?.addEventListener('wheel', wheel, {passive: false})
    document.addEventListener('keydown', key)
    element?.focus()
    return () => {
      element?.removeEventListener('wheel', wheel)
      document.removeEventListener('keydown', key)
      trigger.current?.focus()
    }
  }, [open])
  const show = () => { setScale(1); setOpen(true) }
  return <>
    <button ref={trigger} type="button" className="dsh-codex-image-viewer-trigger" aria-label={'查看大图：' + alt} onClick={show}>
      <img src={src} alt={alt} className={className} onError={onError}/>
    </button>
    {open ? createPortal(
      <div ref={overlay} className="dsh-codex-image-overlay" role="dialog" aria-modal="true" aria-label={alt || '图片预览'} tabIndex={-1} onClick={() => setOpen(false)}>
        <button type="button" className="dsh-codex-image-overlay-close" aria-label="关闭" onClick={() => setOpen(false)}>×</button>
        <img src={src} alt={alt} style={{transform: `scale(${scale})`}} onClick={event => event.stopPropagation()} draggable={false}/>
      </div>, document.body) : null}
  </>
}
