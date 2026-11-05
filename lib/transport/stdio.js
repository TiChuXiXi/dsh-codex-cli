/**
 * stdio 传输：插件自己拉起一个私有 `codex app-server` 子进程。
 *
 * 用途：
 *   1. 守护进程不可用时的兜底（功能完整，但看不到终端里正在跑的会话）；
 *   2. 协议排查与隔离测试（不碰用户的守护进程）。
 *
 * 线格式：每行一条 JSON-RPC 消息（newline-delimited JSON）。
 */

import { spawn } from 'node:child_process'

export class StdioTransport {
  kind = 'stdio'
  /** @type {import('node:child_process').ChildProcess | null} */
  #child = null
  /** @type {Set<(message: object) => void>} */
  #messageHandlers = new Set()
  /** @type {Set<(info: { code?: number, signal?: string }) => void>} */
  #closeHandlers = new Set()
  #closed = false
  #stderrTail = ''

  constructor({ command, args, env, cwd, logger }) {
    this.command = command
    this.args = args
    this.env = env
    this.cwd = cwd
    this.logger = logger
  }

  open() {
    return new Promise((resolve, reject) => {
      let settled = false
      const child = spawn(this.command, this.args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: this.env,
        cwd: this.cwd,
      })
      this.#child = child

      child.once('spawn', () => {
        if (settled) return
        settled = true
        resolve()
      })
      child.once('error', (error) => {
        if (!settled) {
          settled = true
          reject(new Error(`无法启动 codex app-server：${error.message}`))
          return
        }
        this.logger?.warn?.(`[codex-cli] app-server 子进程错误：${error.message}`)
      })

      let buffer = ''
      child.stdout.setEncoding('utf8')
      child.stdout.on('data', (chunk) => {
        buffer += chunk
        let index
        while ((index = buffer.indexOf('\n')) >= 0) {
          const line = buffer.slice(0, index).trim()
          buffer = buffer.slice(index + 1)
          if (line === '') continue
          let message
          try {
            message = JSON.parse(line)
          } catch {
            this.logger?.warn?.(`[codex-cli] app-server 输出了非 JSON 行：${line.slice(0, 200)}`)
            continue
          }
          for (const handler of this.#messageHandlers) {
            try {
              handler(message)
            } catch (cause) {
              this.logger?.warn?.(`[codex-cli] 消息处理器异常：${describe(cause)}`)
            }
          }
        }
      })

      child.stderr.setEncoding('utf8')
      child.stderr.on('data', (chunk) => {
        this.#stderrTail = (this.#stderrTail + chunk).slice(-8192)
        // app-server 的 stderr 常带 INFO/DEBUG；只在首次出现时提示，避免刷屏。
        if (!this.#stderrNoticed && chunk.trim() !== '') {
          this.#stderrNoticed = true
          this.logger?.info?.(`[codex-cli] app-server stderr：${chunk.trim().slice(0, 300)}`)
        }
      })

      child.once('exit', (code, signal) => {
        if (this.#closed) return
        this.#closed = true
        if (this.#stderrTail !== '') {
          this.logger?.warn?.(`[codex-cli] app-server 退出（code=${code}, signal=${signal}）：${this.#stderrTail.slice(-1200)}`)
        }
        const info = { code: code ?? undefined, signal: signal ?? undefined }
        for (const handler of this.#closeHandlers) handler(info)
      })
    })
  }

  #stderrNoticed = false

  onMessage(handler) {
    this.#messageHandlers.add(handler)
    return () => this.#messageHandlers.delete(handler)
  }

  onClose(handler) {
    this.#closeHandlers.add(handler)
    return () => this.#closeHandlers.delete(handler)
  }

  send(message) {
    const child = this.#child
    if (child === null || child.stdin === null || child.stdin.destroyed) {
      throw new Error('app-server 子进程不可用')
    }
    child.stdin.write(`${JSON.stringify(message)}\n`)
  }

  close() {
    this.#closed = true
    const child = this.#child
    this.#child = null
    if (child === null) return
    try {
      child.stdin?.end()
    } catch {
      // 忽略
    }
    try {
      child.kill('SIGTERM')
    } catch {
      // 忽略
    }
    const timer = setTimeout(() => {
      try {
        if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL')
      } catch {
        // 忽略
      }
    }, 2000)
    timer.unref?.()
  }

  /** 子进程 stderr 的最近内容，供诊断页读取。 */
  get stderrTail() {
    return this.#stderrTail
  }
}

function describe(cause) {
  return cause instanceof Error ? cause.message : String(cause)
}
