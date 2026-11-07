import * as React from 'react'
import {Icon} from './Icon'

export function SelectMenu({label, value, options, onChange, direction = 'down'}: {
  label: string, value: string, options: {value:string, label:string}[],
  onChange: (value:string) => void, direction?: 'up' | 'down'
}) {
  const id = React.useId()
  const [open, setOpen] = React.useState(false)
  const root = React.useRef<HTMLDivElement>(null)
  const trigger = React.useRef<HTMLButtonElement>(null)
  const list = React.useRef<HTMLDivElement>(null)
  const selected = options.findIndex(option => option.value === value)
  const [active, setActive] = React.useState(Math.max(0, selected))
  React.useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', outside)
    list.current?.focus()
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])
  const show = () => {setActive(Math.max(0, selected)); setOpen(true)}
  const choose = (index: number) => { const option = options[index]; if (option) onChange(option.value); setOpen(false); trigger.current?.focus() }
  return <div ref={root} className={'dsh-codex-select-control ' + (direction === 'up' ? 'opens-up' : '')}>
    <button ref={trigger} type="button" className="dsh-codex-select-trigger" aria-label={label} aria-haspopup="listbox" aria-expanded={open} onClick={() => open ? setOpen(false) : show()} onKeyDown={event => {
      if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {event.preventDefault(); show()}
    }}><span>{options[selected]?.label ?? value}</span><Icon name="chevronDown" size={15}/></button>
    {open && <div ref={list} tabIndex={-1} className="dsh-codex-select-menu" role="listbox" aria-label={label} aria-activedescendant={id + '-' + active} onKeyDown={event => {
      if (event.key === 'Escape') {event.preventDefault(); event.stopPropagation(); setOpen(false); trigger.current?.focus()}
      else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {event.preventDefault(); setActive(i => (i + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length)}
      else if (event.key === 'Home' || event.key === 'End') {event.preventDefault(); setActive(event.key === 'Home' ? 0 : options.length - 1)}
      else if (event.key === 'Enter' || event.key === ' ') {event.preventDefault(); choose(active)}
      else if (event.key === 'Tab') setOpen(false)
    }}>{options.map((option, index) => <div key={option.value} id={id + '-' + index} role="option" aria-selected={option.value === value} className={'dsh-codex-select-option' + (active === index ? ' is-active' : '')} onMouseEnter={() => setActive(index)} onClick={() => choose(index)}><span>{option.label}</span>{option.value === value && <Icon name="check" size={15}/>}</div>)}</div>}
  </div>
}
