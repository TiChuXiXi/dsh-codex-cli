/**
 * dsh-codex-cli 浏览器半区入口。
 *
 * 只依赖平台模块表里的 `react`；其余依赖在构建时打进 client.js。
 * 槽位：
 *   sidebar.panellist —— 左侧栏入口
 *   main              —— 管理页正文（key = codex-cli）
 */

import * as React from 'react'
import { CodexIcon } from './components/CodexIcon'
import { dictionaries, NS } from './i18n'
import { ConsolePage } from './page/ConsolePage'
import { createApi } from './rpc'
import { installStyles } from './styles'

export const inject = ['slots', 'connection', 'locale']

export function apply(ctx: any): void {
  installStyles()
  ctx.effect(() => ctx.locale.register(NS, dictionaries), 'codex-cli: dictionaries')

  ctx.slots.inject('sidebar.panellist', () =>
    ctx.slots.register(
      {
        name: 'sidebar.panellist',
        id: 'codex-cli',
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
        key: 'codex-cli',
        locale: NS,
        inject: () => ({
          api: createApi((channel: string, endpoint: string, payload: any) =>
            ctx.connection.rpc.call(channel, endpoint, payload),
          ),
        }),
      },
      ConsolePage,
    ),
  )
}
