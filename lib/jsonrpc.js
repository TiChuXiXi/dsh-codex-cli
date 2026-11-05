/**
 * JSON-RPC 2.0 客户端：与传输层解耦。
 *
 * Codex app-server 的线格式：
 *   请求      { id, method, params }
 *   响应      { id, result } | { id, error }
 *   通知      { method, params }                  （无 id）
 *   服务端请求 { id, method, params }              （有 id 且有 method，需要客户端回响应）
 *
 * 服务端请求与响应都带 id，所以判定顺序是「先看 method，再看 id」。
 */

/**
 * 服务端请求处理器返回这个哨兵时不回响应。
 * 用于「该请求已被别的客户端回答」（serverRequest/resolved）——晚到的响应可能造成竞态。
 */
export const SKIP_RESPONSE = Symbol('jsonrpc.skip-response')

/** 一次 RPC 失败：保留 code/data，上层按 code 分支。 */
export class JsonRpcError extends Error {
  constructor(code, message, data) {
    super(message)
    this.name = 'JsonRpcError'
    this.code = code
    this.data = data
  }
}

export class JsonRpcClient {
  /** @type {Map<string | number, { resolve: Function, reject: Function, timer: any, method: string }>} */
  #pending = new Map()
  /** @type {Set<(method: string, params: any) => void>} */
  #notificationHandlers = new Set()
  /** @type {((request: { id: string | number, method: string, params: any }) => any) | null} */
  #serverRequestHandler = null
  #nextId = 1
  #closed = false

  /**
   * @param {object} options
   * @param {(message: object) => void} options.send 把一条 JSON-RPC 消息交给传输层
   * @param {{ warn: Function, info?: Function, error?: Function }} options.logger
   */
  constructor({ send, logger }) {
    this.send = send
    this.logger = logger
  }

  /** 注册通知处理器；返回取消函数。 */
  onNotification(handler) {
    this.#notificationHandlers.add(handler)
    return () => this.#notificationHandlers.delete(handler)
  }

  /** 注册服务端请求处理器：返回的 Promise 结果作为响应 result。 */
  onServerRequest(handler) {
    this.#serverRequestHandler = handler
    return () => {
      if (this.#serverRequestHandler === handler) this.#serverRequestHandler = null
    }
  }

  /**
   * 发一条请求并等响应。
   * @param {string} method
   * @param {any} [params]
   * @param {{ timeoutMs?: number, signal?: AbortSignal }} [options]
   */
  request(method, params, options = {}) {
    if (this.#closed) return Promise.reject(new JsonRpcError(-32000, 'JSON-RPC 连接已关闭'))
    const id = this.#nextId++
    const timeoutMs = options.timeoutMs ?? 30000
    return new Promise((resolve, reject) => {
      const settle = (fn, value) => {
        const entry = this.#pending.get(id)
        if (entry === undefined) return
        this.#pending.delete(id)
        if (entry.timer !== null) clearTimeout(entry.timer)
        if (entry.onAbort !== undefined && options.signal !== undefined) {
          options.signal.removeEventListener('abort', entry.onAbort)
        }
        fn(value)
      }
      const entry = {
        method,
        resolve: (value) => settle(resolve, value),
        reject: (error) => settle(reject, error),
        timer: null,
        onAbort: undefined,
      }
      if (timeoutMs > 0) {
        entry.timer = setTimeout(() => {
          entry.reject(new JsonRpcError(-32001, `JSON-RPC 请求超时：${method}`))
        }, timeoutMs)
        entry.timer.unref?.()
      }
      if (options.signal !== undefined) {
        entry.onAbort = () => entry.reject(new JsonRpcError(-32002, `JSON-RPC 请求已取消：${method}`))
        if (options.signal.aborted) {
          entry.onAbort()
          return
        }
        options.signal.addEventListener('abort', entry.onAbort, { once: true })
      }
      this.#pending.set(id, entry)
      try {
        this.send(params === undefined ? { id, method } : { id, method, params })
      } catch (cause) {
        entry.reject(cause instanceof Error ? cause : new Error(String(cause)))
      }
    })
  }

  /** 发一条通知（无响应）。 */
  notify(method, params) {
    if (this.#closed) return
    this.send(params === undefined ? { method } : { method, params })
  }

  /** 回一个服务端请求的成功响应。 */
  respond(id, result) {
    if (this.#closed) return
    this.send({ id, result: result === undefined ? null : result })
  }

  /** 回一个服务端请求的错误响应。 */
  respondError(id, code, message, data) {
    if (this.#closed) return
    this.send({ id, error: data === undefined ? { code, message } : { code, message, data } })
  }

  /** 传输层收到一条消息时调用。 */
  handleMessage(message) {
    if (message === null || typeof message !== 'object') return
    if (typeof message.method === 'string') {
      if (message.id !== undefined && message.id !== null) {
        this.#handleServerRequest(message)
        return
      }
      for (const handler of this.#notificationHandlers) {
        try {
          handler(message.method, message.params)
        } catch (cause) {
          this.logger?.warn?.(`[codex-cli] 通知处理器异常：${describe(cause)}`)
        }
      }
      return
    }
    if (message.id !== undefined) {
      const entry = this.#pending.get(message.id)
      if (entry === undefined) return
      if (message.error !== undefined && message.error !== null) {
        const error = message.error
        entry.reject(new JsonRpcError(error.code ?? -32603, error.message ?? 'RPC 错误', error.data))
      } else {
        entry.resolve(message.result)
      }
    }
  }

  #handleServerRequest(message) {
    const handler = this.#serverRequestHandler
    if (handler === null) {
      this.respondError(message.id, -32601, `未注册的服务端请求：${message.method}`)
      return
    }
    Promise.resolve()
      .then(() => handler({ id: message.id, method: message.method, params: message.params }))
      .then((result) => {
        if (result === SKIP_RESPONSE) return
        this.respond(message.id, result)
      })
      .catch((cause) => {
        this.logger?.warn?.(`[codex-cli] 服务端请求处理失败 ${message.method}：${describe(cause)}`)
        this.respondError(message.id, cause?.code ?? -32603, describe(cause))
      })
  }

  /** 关闭：所有挂起请求立即失败。 */
  close(reason = '连接已关闭') {
    if (this.#closed) return
    this.#closed = true
    for (const entry of this.#pending.values()) {
      if (entry.timer !== null) clearTimeout(entry.timer)
      entry.reject(new JsonRpcError(-32000, reason))
    }
    this.#pending.clear()
    this.#notificationHandlers.clear()
    this.#serverRequestHandler = null
  }

  get closed() {
    return this.#closed
  }
}

function describe(cause) {
  if (cause instanceof Error) return cause.message
  return String(cause)
}
