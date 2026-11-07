import * as React from 'react'

export function OverflowLabel({text, className}: {text:string, className:string}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  React.useEffect(() => {
    const label = ref.current
    const row = label?.closest('.dsh-codex-thread, .dsh-codex-tree-project')
    if (!label || !row) return
    let frame = 0
    let timer = 0
    const updateEdges = () => {
      const end = Math.max(0, label.scrollWidth - label.clientWidth)
      label.dataset.scrollEdge = label.scrollLeft > 1 ? (label.scrollLeft < end - 1 ? 'both' : 'start') : (end > 1 ? 'end' : '')
    }
    const enter = () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      updateEdges()
      if (label.scrollWidth <= label.clientWidth || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      label.dataset.scrolling = 'true'
      timer = window.setTimeout(() => {
        const start = performance.now()
        const startLeft = label.scrollLeft
        const tick = (now: number) => {
          const end = Math.max(0, label.scrollWidth - label.clientWidth)
          label.scrollLeft = Math.min(end, startLeft + (now - start) * 0.02)
          updateEdges()
          if (label.scrollLeft < end - 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      }, 350)
    }
    const leave = () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      label.scrollLeft = 0
      delete label.dataset.scrolling
      delete label.dataset.scrollEdge
    }
    row.addEventListener('mouseenter', enter)
    row.addEventListener('mouseleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      row.removeEventListener('mouseenter', enter)
      row.removeEventListener('mouseleave', leave)
    }
  }, [text])
  return <span ref={ref} className={className}>{text}</span>
}
