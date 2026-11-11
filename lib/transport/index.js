/**
 * 传输选择：守护进程优先，stdio 兜底。
 *
 * 选择顺序（transport = auto）：
 *   1. 控制套接字存在 → 连它；
 *   2. 不存在或连接失败 → `codex app-server daemon start`，等套接字出现后再连；
 *   3. 仍失败 → 自己 spawn `codex app-server`（stdio）。
 *
 * transport = daemon 时不做第 3 步；transport = stdio 时直接走第 3 步。
 */

import { spawn } from 'node:child_process'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'
import { DaemonTransport, daemonSocketPath } from './daemon.js'
import { StdioTransport } from './stdio.js'

/** CODEX_HOME：配置 > 环境变量 > ~/.codex。 */
export function resolveCodexHome(config) {
  if (typeof config.codexHome === 'string' && config.codexHome.trim() !== '') return config.codexHome.trim()
  const fromEnv = process.env.CODEX_HOME
  if (typeof fromEnv === 'string' && fromEnv.trim() !== '') return fromEnv.trim()
  return join(homedir(), '.codex')
}

/** codex 可执行文件：配置 > PATH 里的 codex。 */
export function resolveCodexCommand(config) {
  if (typeof config.codexPath === 'string' && config.codexPath.trim() !== '') return config.codexPath.trim()
  return 'codex'
}

/**
 * 尝试启动守护进程并等待控制套接字出现。
 * @returns {Promise<{ ok: boolean, output: string }>}
 */
export async function startDaemon({ command, codexHome, timeoutMs, logger }) {
  const child = spawn(command, ['app-server', 'daemon', 'start'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: process.env,
  })
  let output = ''
  child.stdout?.setEncoding('utf8')
  child.stderr?.setEncoding('utf8')
  child.stdout?.on('data', (chunk) => {
    output = (output + chunk).slice(-8192)
  })
  child.stderr?.on('data', (chunk) => {
    output = (output + chunk).slice(-8192)
  })

  const exitCode = await new Promise((resolve) => {
    let settled = false
    const finish = (code) => {
      if (settled) return
      settled = true
      resolve(code)
    }
    child.once('exit', (code) => finish(code ?? -1))
    child.once('error', (error) => {
      output += `\n${error.message}`
      finish(-1)
    })
    const timer = setTimeout(() => {
      try {
        child.kill('SIGTERM')
      } catch {
        // 忽略
      }
      finish(-2)
    }, Math.min(timeoutMs, 20000))
    timer.unref?.()
  })

  if (exitCode !== 0 && exitCode !== -2) {
    logger?.warn?.(`[codex-cli] daemon start 退出码 ${exitCode}：${output.trim().slice(-800)}`)
  }

  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    const socketPath = daemonSocketPath(codexHome)
    if (socketPath !== null) return { ok: true, output: output.trim() }
    await sleep(250)
  }
  logger?.warn?.(`[codex-cli] 等待守护进程套接字超时（${timeoutMs}ms）：${output.trim().slice(-800)}`)
  return { ok: false, output: output.trim() }
}

/**
 * 打开一条传输。
 * @returns {Promise<{ kind: 'daemon' | 'stdio', socketPath: string | null, transport: object, note?: string }>}
 */
export async function openCodexTransport({ config, logger }) {
  const codexHome = resolveCodexHome(config)
  const command = resolveCodexCommand(config)

  if (config.transport !== 'stdio') {
    const socketPath = daemonSocketPath(codexHome)
    if (socketPath !== null) {
      try {
        const transport = new DaemonTransport({ socketPath, logger })
        await transport.open()
        return { kind: 'daemon', socketPath, transport }
      } catch (cause) {
        logger?.warn?.(`[codex-cli] 守护进程连接失败：${describe(cause)}`)
      }
    }

    const started = await startDaemon({
      command,
      codexHome,
      timeoutMs: config.daemonStartTimeoutMs,
      logger,
    })
    if (started.ok) {
      const retried = daemonSocketPath(codexHome)
      if (retried !== null) {
        try {
          const transport = new DaemonTransport({ socketPath: retried, logger })
          await transport.open()
          return { kind: 'daemon', socketPath: retried, transport, note: 'daemon-started' }
        } catch (cause) {
          logger?.warn?.(`[codex-cli] 启动守护进程后仍无法连接：${describe(cause)}`)
        }
      }
    }

    if (config.transport === 'daemon') {
      throw new Error('Codex 守护进程不可用（transport=daemon）')
    }
  }

  const transport = new StdioTransport({
    command,
    args: ['app-server'],
    env: { ...process.env, CODEX_HOME: codexHome },
    logger,
  })
  await transport.open()
  return { kind: 'stdio', socketPath: null, transport, note: 'fallback-stdio' }
}

function describe(cause) {
  return cause instanceof Error ? cause.message : String(cause)
}
