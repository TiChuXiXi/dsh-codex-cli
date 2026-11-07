/** Plugin-owned adapter for the small primitive surface consumed by vendored dockkit. */
import * as React from 'react'
import {Icon} from '../components/Icon'
export { focusWithoutRing } from './focus'
export { observeComposition } from './composition'
export const modalSelector = '[role="dialog"],[role="menu"],[aria-modal="true"]'

export const MenuSurface = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function MenuSurface(props, ref) {
  return <div {...props} ref={ref} data-codex-sidebar-menu />
})

/** Native tooltip preserves geometry and browser keyboard accessibility. */
export function Tooltip({
  children,
  label,
  shortcutKeys,
  disabled,
}: {
  children: React.ReactElement
  label: string
  shortcutKeys?: readonly string[]
  disabled?: boolean
  [key: string]: any
}) {
  return React.cloneElement(children, {
    title: disabled
      ? undefined
      : [label, shortcutKeys?.join('+')].filter(Boolean).join(' · '),
  })
}

export const IconCloseOutlineRegular=(props:any)=><Icon name="close" size={16} {...props}/>
export const IconCloseFillRegular=IconCloseOutlineRegular
export const IconPlusOutlineRegular=(props:any)=><Icon name="plus" size={16} {...props}/>
export const IconPanelLeftOutlineRegular=(props:any)=><Icon name="panelLeft" size={16} {...props}/>
