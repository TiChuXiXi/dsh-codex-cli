/**
 * dsh-codex-cli 宿主半区（Cordis 插件）。
 *
 * 只做装配：配置归一化、事件总线、Hub 生命周期、HTTP 路由注册。
 * 所有 codex 协议细节在 lib/hub.js 与 lib/transport/*。
 */

import { FollowupQueue } from './lib/followups.js'
import { EventBus } from './lib/events.js'
import { CodexHub } from './lib/hub.js'
import { createRoutes } from './lib/routes.js'
import { normalizeConfig } from './lib/config.js'
import { VersionService } from './lib/versions.js'
import { createRuntime } from './lib/runtime.js'
import { WorkspaceService } from './lib/workspace.js'
import { TerminalService } from './lib/terminal.js'
import { createGitService } from './lib/git.js'

export const name = 'codex-cli'

/**
 * 硬依赖：
 *   connection —— 浏览器 RPC 与 requestRejection() 信任栅栏
 *   webServer  —— 挂 /codex-cli 的 prefix 路由（RPC + SSE）
 *
 * 行级 inject 也要在 cordis.patch.yml 里写一遍：loader 按行激活。
 */
export const inject = ['connection', 'webServer']

export function apply(ctx, rawConfig) {
  const runtime = createRuntime(ctx)
  const config = normalizeConfig(rawConfig)
  const logger = ctx.logger ?? console
  const bus = new EventBus({ capacity: config.eventBufferSize })
  const hub = new CodexHub({ config, logger, bus })
  const followups = new FollowupQueue({ hub, bus })
  const workspace = new WorkspaceService(bus)
  const terminal = new TerminalService()
  ctx.effect(() => () => terminal.dispose(), 'codex-cli: terminal services')
  const git = createGitService(rawConfig?.git)
  ctx.effect(() => () => git.dispose(), 'codex-cli: Git services')
  ctx.effect(() => () => workspace.dispose(), 'codex-cli: workspace services')
  const versions = new VersionService({ config, logger, bus, hub })

  const connection = ctx.get('connection')
  const webServer = ctx.get('webServer')
  if (connection === undefined || webServer === undefined) {
    logger.warn('[codex-cli] connection / webServer 缺席：RPC 通道未注册')
    return
  }

  ctx.effect(
    () => {
      hub.start()
      return () => {
        followups.dispose()
        void hub.stop()
        bus.dispose()
      }
    },
    'codex-cli: hub',
  )

  ctx.effect(
    () => {
      const handler = createRoutes({ hub, bus, connection, config, logger, versions, runtime, workspace, git, followups, terminal })
      const unregister = webServer.register({ kind: 'prefix', path: '/codex-cli', handler })
      return () => { handler.dispose(); unregister() }
    },
    'codex-cli: routes',
  )

  logger.info('[codex-cli] 已注册 /codex-cli（RPC + SSE）')
}
