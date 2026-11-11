/** Authenticated RPC owns PTYs; output stays out of the shared event/history bus. */
import { randomUUID } from 'node:crypto'
import { realpath, stat } from 'node:fs/promises'
import { isAbsolute } from 'node:path'
import { HubError } from './hub.js'

const fail = (code, message) => new HubError('codex-cli/terminal-' + code, message)
const BUFFER_LIMIT = 1024 * 1024
const LEASE_MS = 5 * 60 * 1000

function dimensions(cols, rows) {
  if (!Number.isInteger(cols) || cols < 2 || cols > 500 ||
      !Number.isInteger(rows) || rows < 1 || rows > 300)
    throw fail('bad-request', '无效终端尺寸')
}

export class TerminalService {
  #sessions = new Map()
  #disposed = false
  constructor() {
    this.sweep = setInterval(() => {
      const now = Date.now()
      for (const [id, session] of this.#sessions)
        if (now - session.touched > LEASE_MS) this.close(id)
    }, 30000)
    this.sweep.unref?.()
  }
  async open({ cwd, cols = 80, rows = 24 } = {}) {
    if (typeof cwd !== 'string' || !isAbsolute(cwd) || cwd.includes('\0'))
      throw fail('bad-request', '工作目录必须是绝对路径')
    dimensions(cols, rows)
    const root = await realpath(cwd)
    if (!(await stat(root)).isDirectory()) throw fail('bad-request', '工作目录不是目录')
    // Load native bindings on demand so a missing platform binary does not break the plugin.
    const { default: pty } = await import('@lydell/node-pty')
    if (this.#disposed) throw fail('closed', '终端服务已关闭')
    if (this.#sessions.size >= 16) throw fail('limit', '最多同时打开 16 个终端')
    const child = pty.spawn('/bin/bash', ['-l'], {
      name: 'xterm-256color', cols, rows, cwd: root,
      env: { ...process.env, TERM: 'xterm-256color', COLORTERM: 'truecolor' },
    })
    const id = randomUUID()
    const session = {
      child, buffer: '', offset: 0, touched: Date.now(), exited: false,
      exitCode: null, signal: null, acknowledged: 0, paused: false, waiters: new Set(), subscriptions: [],
    }
    this.#sessions.set(id, session)
    session.subscriptions.push(child.onData(data => {
      session.buffer += data
      if (session.buffer.length > BUFFER_LIMIT) {
        const drop = session.buffer.length - BUFFER_LIMIT
        session.buffer = session.buffer.slice(drop)
        session.offset += drop
      }
      if (!session.paused && session.offset + session.buffer.length - session.acknowledged >= 256 * 1024) {
        session.paused = true
        child.pause()
      }
      for (const wake of [...session.waiters]) wake()
    }))
    session.subscriptions.push(child.onExit(({ exitCode, signal }) => {
      session.exited = true
      session.exitCode = exitCode
      session.signal = signal
      for (const wake of [...session.waiters]) wake()
    }))
    return { sessionId: id, cwd: root, cols, rows }
  }
  #get(id) {
    const session = this.#sessions.get(id)
    if (!session) throw fail('expired', '终端已关闭或过期，请重新连接')
    session.touched = Date.now()
    return session
  }
  async read({ sessionId, cursor = 0 } = {}, signal) {
    const session = this.#get(sessionId)
    if (!Number.isSafeInteger(cursor) || cursor < 0 || cursor > session.offset + session.buffer.length)
      throw fail('bad-request', '无效终端输出位置')
    if (signal?.aborted) throw fail('cancelled', '读取已取消')
    session.acknowledged = cursor
    if (session.paused && !session.exited && session.offset + session.buffer.length - cursor < 256 * 1024) {
      session.paused = false
      session.child.resume()
    }
    if (cursor === session.offset + session.buffer.length && !session.exited) {
      await new Promise(resolve => {
        const wake = () => {
          clearTimeout(timer)
          session.waiters.delete(wake)
          signal?.removeEventListener('abort', wake)
          resolve()
        }
        const timer = setTimeout(wake, 5000)
        session.waiters.add(wake)
        signal?.addEventListener('abort', wake, { once: true })
      })
    }
    if (signal?.aborted) throw fail('cancelled', '读取已取消')
    return {
      data: session.buffer.slice(Math.max(0, cursor - session.offset)),
      cursor: session.offset + session.buffer.length,
      truncated: cursor < session.offset,
      exited: session.exited, exitCode: session.exitCode, signal: session.signal,
    }
  }
  write({ sessionId, data } = {}) {
    const session = this.#get(sessionId)
    if (session.exited) throw fail('closed', '终端进程已退出')
    if (typeof data !== 'string' || data.length > 64 * 1024)
      throw fail('bad-request', '无效终端输入或输入过长')
    session.child.write(data)
    return { written: true }
  }
  resize({ sessionId, cols, rows } = {}) {
    dimensions(cols, rows)
    const session = this.#get(sessionId)
    if (!session.exited) session.child.resize(cols, rows)
    return { resized: !session.exited }
  }
  close(sessionId) {
    const session = this.#sessions.get(sessionId)
    if (!session) return { closed: true }
    this.#sessions.delete(sessionId)
    session.exited = true
    try { session.child.kill() } catch {}
    for (const wake of [...session.waiters]) wake()
    for (const subscription of session.subscriptions) subscription.dispose()
    return { closed: true }
  }
  dispose() {
    this.#disposed = true
    clearInterval(this.sweep)
    for (const id of [...this.#sessions.keys()]) this.close(id)
  }
  get count() { return this.#sessions.size }
}
