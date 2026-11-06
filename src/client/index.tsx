/**
 * dsh-codex-cli 浏览器半区入口。
 *
 * 只依赖平台模块表里的 `react`；其余依赖在构建时打进 client.js。
 * 槽位：
 *   sidebar.panellist            —— 左侧栏入口
 *   main                         —— 管理页正文（key = codex-cli）
 */

import * as React from 'react'
import { CodexIcon } from './components/CodexIcon'
import { dictionaries, NS } from './i18n'
import { ConsolePage } from './page/ConsolePage'
import { createApi } from './rpc'
import { installStyles } from './styles'

export const inject = ['slots', 'connection', 'locale', 'layout']

const PANEL_ID = 'codex-cli'

export function apply(ctx: any): void {
  installStyles()
  ctx.effect(() => ctx.locale.register(NS, dictionaries), 'codex-cli: dictionaries')

  const api = createApi((channel: string, endpoint: string, payload: any) =>
    ctx.connection.rpc.call(channel, endpoint, payload),
  )

  const selectPanel = () => {
    try {
      ctx.layout.selectPanel(PANEL_ID)
    } catch {
      // 管理页还没注册时 selectPanel 会抛；下一次点击再试即可。
    }
  }

  // 左侧栏入口 + 管理页
  ctx.slots.inject('sidebar.panellist', () =>
    ctx.slots.register(
      {
        name: 'sidebar.panellist',
        id: PANEL_ID,
        order: 30,
        locale: NS,
        label: () => 'Codex CLI',
      },
      CodexIcon,
    ),
  )

  ctx.slots.inject('main', () =>
    ctx.slots.register(
      {
        name: 'main',
        key: PANEL_ID,
        locale: NS,
        inject: () => ({
          api,
          onExit: () => {
            try {
              ctx.layout.selectPanel(null)
            } catch {
              // 退出失败时留在 Codex 模式。
            }
          },
        }),
      },
      ConsolePage,
    ),
  )
}
