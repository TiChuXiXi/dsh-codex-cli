/** 左侧栏与插件页共用的图标：ChatGPT / OpenAI 标志。 */

import * as React from 'react'
import { CODEX_LOGO_PATH } from './codexLogo'

export function CodexIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={CODEX_LOGO_PATH} />
    </svg>
  )
}
