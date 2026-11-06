/** 小工具：可持久化的折叠状态。 */

import * as React from 'react'

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
