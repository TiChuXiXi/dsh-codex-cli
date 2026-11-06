/** 小工具：可持久化的折叠状态。 */

import * as React from 'react'
import { codexFavicon } from './components/codexLogo'

export function useStoredCollapsed(key: string): [boolean, () => void] {
  const [collapsed, setCollapsed] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    try {
      return window.localStorage.getItem(key) === '1'
    } catch {
      return false
    }
  })
  const toggle = React.useCallback(() => {
    setCollapsed((previous) => {
      const next = !previous
      try {
        window.localStorage.setItem(key, next ? '1' : '0')
      } catch {
        // 隐私模式下忽略写入失败。
      }
      return next
    })
  }, [key])
  return [collapsed, toggle]
}

/** Codex 模式下接管浏览器标签页标题与图标；退出时恢复。 */
export function useCodexTab(title = 'Codex CLI'): void {
  React.useEffect(() => {
    if (typeof document === 'undefined') return undefined
    const previousTitle = document.title
    const links = Array.from(document.querySelectorAll('link[rel~="icon"]')) as HTMLLinkElement[]
    const saved = links.map((link) => ({ link, href: link.getAttribute('href'), type: link.type }))
    const created: HTMLLinkElement[] = []
    document.title = title
    const targets: HTMLLinkElement[] = saved.length > 0 ? saved.map((entry) => entry.link) : []
    if (targets.length === 0) {
      const link = document.createElement('link')
      link.rel = 'icon'
      link.type = 'image/svg+xml'
      document.head.appendChild(link)
      created.push(link)
      targets.push(link)
    }
    for (const link of targets) {
      const dark = typeof link.media === 'string' && link.media.includes('dark')
      link.type = 'image/svg+xml'
      link.href = codexFavicon(dark ? '#ffffff' : '#0f1115')
    }
    return () => {
      document.title = previousTitle
      for (const { link, href, type } of saved) {
        if (!link.isConnected) continue
        if (href === null) link.removeAttribute('href')
        else link.setAttribute('href', href)
        link.type = type
      }
      for (const link of created) link.remove()
    }
  }, [title])
}
