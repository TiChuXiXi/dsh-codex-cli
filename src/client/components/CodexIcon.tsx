/** 左侧栏与插件页共用的图标：终端提示符。 */

import * as React from 'react'

export function CodexIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.75" y="4.75" width="18.5" height="14.5" rx="2.25" />
      <path d="m7 9.5 2.75 2.25L7 14" />
      <path d="M12.5 14.5H17" />
    </svg>
  )
}
