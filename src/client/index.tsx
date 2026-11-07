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
  const activeKey = 'dsh-codex-panel-active'
  let restorePanel = false
  try { restorePanel = window.sessionStorage.getItem(activeKey) === '1' } catch {}
  ctx.effect(installStyles, 'codex-cli: styles')
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

  // DSH unregisters a global panel during code replacement. Remember the selected
  // panel before those slots are disposed and restore it after registration.
  ctx.effect(() => {
    let restoring = restorePanel
    let timer: ReturnType<typeof setTimeout> | undefined
    let tries = 0
    const sync = () => {
      if (restoring) return
      try { window.sessionStorage.setItem(activeKey, ctx.layout.panelInfo.getSnapshot().activePanelId === PANEL_ID ? '1' : '0') } catch {}
    }
    const unsubscribe = ctx.layout.panelInfo.subscribe(sync)
    const restore = () => {
      try { ctx.layout.selectPanel(PANEL_ID) } catch {}
      if (ctx.layout.panelInfo.getSnapshot().activePanelId === PANEL_ID || ++tries >= 60) {
        restoring = false
        sync()
      } else timer = setTimeout(restore, 50)
    }
    if (restorePanel) timer = setTimeout(restore, 0)
    else sync()
    return () => { clearTimeout(timer); unsubscribe() }
  }, 'codex-cli: preserve active panel during HMR')
}
