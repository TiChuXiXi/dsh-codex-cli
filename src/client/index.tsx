/**
 * dsh-codex-cli 浏览器半区入口。
 *
 * 只依赖平台模块表里的 `react`；其余依赖在构建时打进 client.js。
 * 槽位：
 *   sidebar.panellist            —— 左侧栏入口
 *   main                         —— 管理页正文（key = codex-cli）
 *   sidebar.right.pane.tab(.title) —— 右侧栏 Codex 页（按当前 DSH 会话 cwd）
 */

import * as React from 'react'
import { CodexIcon } from './components/CodexIcon'
import { dictionaries, NS } from './i18n'
import { ConsolePage } from './page/ConsolePage'
import { SessionTab } from './page/SessionTab'
import { createApi } from './rpc'
import { requestNewThread, requestThread } from './store'
import { installStyles } from './styles'

export const inject = ['slots', 'connection', 'locale', 'sidebarRightTabs', 'layout']

const PANEL_ID = 'codex-cli'
const TAB_ID = 'codex-cli'

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
        label: () => 'Codex',
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
        inject: () => ({ api }),
      },
      ConsolePage,
    ),
  )

  // 右侧栏：按当前会话 cwd 列出该项目的 Codex 会话
  ctx.effect(
    () =>
      ctx.sidebarRightTabs.register({
        id: TAB_ID,
        kind: TAB_ID,
        title: () => 'Codex',
        guide: [
          {
            id: TAB_ID,
            order: 30,
            title: () => 'Codex',
            description: () => '当前项目的 Codex 会话',
            icon: CodexIcon,
          },
        ],
      }),
    'codex-cli: right tab type',
  )

  const face = () => ({
    api,
    onOpenThread: (threadId: string) => {
      requestThread(threadId)
      selectPanel()
    },
    onOpenPage: () => selectPanel(),
    onNewThread: (cwd: string) => {
      requestNewThread(cwd)
      selectPanel()
    },
  })

  ctx.slots.inject('sidebar.right.pane.tab', () =>
    ctx.slots.register(
      {
        name: 'sidebar.right.pane.tab',
        key: TAB_ID,
        locale: NS,
        inject: face,
      },
      SessionTab,
    ),
  )

  ctx.slots.inject('sidebar.right.pane.tab.title', () =>
    ctx.slots.register(
      {
        name: 'sidebar.right.pane.tab.title',
        key: TAB_ID,
        locale: NS,
      },
      SessionTabTitle,
    ),
  )
}

function SessionTabTitle() {
  return <span>Codex</span>
}
