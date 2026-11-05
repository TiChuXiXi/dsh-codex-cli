/**
 * 守护进程传输：WebSocket over Unix domain socket。
 *
 * Codex 的 app-server 守护进程监听 Unix socket，TUI / `codex agents` / VS Code 扩展都用
 * 同一条通道；官方没有把这个传输写进文档，但 `--listen unix://` 与 `--remote unix://`
 * 的存在说明它是稳定接口。套接字权限是 0600，OS 权限即认证。
 *
 * 注意：`codex app-server proxy` 只是把 stdio 字节原样转给这条 socket，并不做 WebSocket
 * 握手，所以不能直接用；这里用 `ws` + 自定义 createConnection 完成握手。
 */

import net from 'node:net'
import { realpathSync } from 'node:fs'
import { join } from 'node:path'
import WebSocket from 'ws'

/** 解析守护进程控制套接字；不存在返回 null。 */
export function daemonSocketPath(codexHome) {
  const link = join(codexHome, 'app-server-control', 'app-server-control.sock')
  try {
    return realpathSync(link)
  } catch {
    return null
  }
}

export class DaemonTransport {
  kind = 'daemon'
  /** @type {WebSocket | null} */
  #ws = null
  /** @type {Set<(message: object) => void>} */
  #messageHandlers = new Set()
  /** @type {Set<(info: { code?: number, reason?: string }) => void>} */
  #closeHandlers = new Set()
  #closed = false

  constructor({ socketPath, logger }) {
    this.socketPath = socketPath
    this.logger = logger
  }

  /** 建立 WebSocket 握手。 */
  open() {
    return new Promise((resolve, reject) => {
      let settled = false
      const ws = new WebSocket('ws://localhost/', {
        createConnection: () => net.connect(this.socketPath),
        perMessageDeflate: false,
        handshakeTimeout: 5000,
        maxPayload: 64 * 1024 * 1024,
      })
      ws.once('open', () => {
        if (settled) return
        settled = true
        this.#ws = ws
        resolve()
      })
      ws.once('error', (error) => {
        if (!settled) {
          settled = true
          reject(error)
          return
        }
        this.logger?.warn?.(`[codex-cli] 守护进程连接错误：${error.message}`)
      })
      ws.once('unexpected-response', (_request, response) => {
        if (settled) return
        settled = true
        reject(new Error(`守护进程 WebSocket 握手被拒绝：HTTP ${response.statusCode}`))
      })
      ws.on('message', (data) => {
        const text = typeof data === 'string' ? data : data.toString('utf8')
        let message
        try {
          message = JSON.parse(text)
        } catch {
          this.logger?.warn?.('[codex-cli] 守护进程返回了非 JSON 消息')
          return
        }
        for (const handler of this.#messageHandlers) {
          try {
            handler(message)
          } catch (cause) {
            this.logger?.warn?.(`[codex-cli] 消息处理器异常：${describe(cause)}`)
          }
        }
      })
      ws.on('close', (code, reason) => {
        if (this.#closed) return
        this.#closed = true
        const info = { code, reason: reason?.toString?.() ?? '' }
        for (const handler of this.#closeHandlers) handler(info)
      })
    })
  }

  /** 注册消息处理器；返回取消函数。 */
  onMessage(handler) {
    this.#messageHandlers.add(handler)
    return () => this.#messageHandlers.delete(handler)
  }

  /** 注册关闭处理器；返回取消函数。 */
  onClose(handler) {
    this.#closeHandlers.add(handler)
    return () => this.#closeHandlers.delete(handler)
  }

  send(message) {
    if (this.#ws === null || this.#ws.readyState !== WebSocket.OPEN) {
      throw new Error('守护进程连接不可用')
    }
    this.#ws.send(JSON.stringify(message))
  }

  close() {
    this.#closed = true
    try {
      this.#ws?.close()
    } catch {
      // 忽略关闭期错误
    }
    this.#ws = null
  }
}

function describe(cause) {
  return cause instanceof Error ? cause.message : String(cause)
}
