/** Plugin-owned workspace identities and bounded file reads. */
import { realpath, stat, readdir, open } from 'node:fs/promises'
import { createReadStream, watch, constants } from 'node:fs'
import { createHash, randomUUID } from 'node:crypto'
import { resolve, relative, isAbsolute, basename } from 'node:path'
import { HubError } from './hub.js'

const fail = (code, message) => new HubError('codex-cli/' + code, message)
export class WorkspaceService {
  #roots = new Map()
  #watches = new Map()
  #reads = new Set()
  constructor(bus) {
    this.bus = bus
  }
  async register(cwd) {
    if (typeof cwd !== 'string' || !isAbsolute(cwd) || cwd.includes('\0'))
      throw fail('bad-request', '工作目录必须是绝对路径')
    const root = await realpath(cwd)
    if (!(await stat(root)).isDirectory())
      throw fail('not-a-directory', '工作目录不是目录')
    const workspaceId = createHash('sha256')
      .update(root)
      .digest('hex')
      .slice(0, 24)
    this.#roots.set(workspaceId, root)
    return { workspaceId, cwd: root, name: basename(root) }
  }
  async target(workspaceId, path = '.') {
    const root = this.#roots.get(workspaceId)
    if (!root) throw fail('workspace-expired', '工作区已失效，请重新打开')
    if (typeof path !== 'string' || path.includes('\0'))
      throw fail('bad-request', '无效路径')
    const lexical = resolve(root, path)
    const inside = (p) => {
      const r = relative(root, p)
      return (
        !r.startsWith('..' + (process.platform === 'win32' ? '\\' : '/')) &&
        r !== '..' &&
        !isAbsolute(r)
      )
    }
    if (!inside(lexical)) throw fail('outside-workspace', '路径超出工作区')
    const canonical = await realpath(lexical)
    if (!inside(canonical))
      throw fail('outside-workspace', '链接目标超出工作区')
    return { root, path: canonical, relative: relative(root, canonical) || '.' }
  }
  async list(workspaceId, path = '.') {
    const target = await this.target(workspaceId, path)
    const entries = await readdir(target.path, { withFileTypes: true })
    const visible = entries
      .sort(
        (a, b) =>
          Number(b.isDirectory()) - Number(a.isDirectory()) ||
          a.name.localeCompare(b.name),
      )
      .slice(0, 1000)
    const result = await Promise.all(
      visible.map(async (entry) => {
        const child = resolve(target.path, entry.name)
        try {
          const safe = await this.target(workspaceId, child),
            info = await stat(safe.path)
          return {
            name: entry.name,
            path: relative(target.root, child),
            type: info.isDirectory() ? 'dir' : info.isFile() ? 'file' : 'other',
            hidden: entry.name.startsWith('.'),
            size: info.size,
            mtime: info.mtimeMs,
          }
        } catch {
          return {
            name: entry.name,
            path: relative(target.root, child),
            type: 'unavailable',
            hidden: entry.name.startsWith('.'),
            size: null,
            mtime: null,
          }
        }
      }),
    )
    result.sort(
      (a, b) =>
        Number(b.type === 'dir') - Number(a.type === 'dir') ||
        a.name.localeCompare(b.name),
    )
    return {
      workspaceId,
      path: target.relative,
      cwd: target.root,
      entries: result,
      truncated: entries.length > 1000,
    }
  }
  async bytes(workspaceId, path, offset = 0, length = 1024 * 1024) {
    if (
      !Number.isSafeInteger(offset) ||
      offset < 0 ||
      !Number.isSafeInteger(length) ||
      length < 1 ||
      length > 2 * 1024 * 1024
    )
      throw fail('bad-request', '无效字节区间')
    const target = await this.target(workspaceId, path)
    const handle = await open(
      target.path,
      constants.O_RDONLY |
        (constants.O_NOFOLLOW ?? 0) |
        (constants.O_NONBLOCK ?? 0),
    )
    try {
      const info = await handle.stat()
      if (!info.isFile()) throw fail('not-a-file', '不是普通文件')
      const buffer = Buffer.alloc(length)
      const { bytesRead } = await handle.read(buffer, 0, length, offset)
      return {
        path: target.relative,
        size: info.size,
        version: info.mtimeMs + ':' + info.size,
        offset,
        eof: offset + bytesRead >= info.size,
        dataBase64: buffer.subarray(0, bytesRead).toString('base64'),
      }
    } finally {
      await handle.close()
    }
  }
  async text(workspaceId, path, offset = 1, limit = 500) {
    if (
      !Number.isSafeInteger(offset) ||
      offset < 1 ||
      offset > 1000000 ||
      !Number.isSafeInteger(limit) ||
      limit < 1 ||
      limit > 5000
    )
      throw fail('bad-request', '无效行区间')
    const target = await this.target(workspaceId, path),
      info = await stat(target.path)
    if (!info.isFile()) throw fail('not-a-file', '不是普通文件')
    const stream = createReadStream(target.path, {
      highWaterMark: 65536,
      flags:
        constants.O_RDONLY |
        (constants.O_NOFOLLOW ?? 0) |
        (constants.O_NONBLOCK ?? 0),
    })
    this.#reads.add(stream)
    const decoder = new TextDecoder('utf-8', { fatal: true })
    let line = 1,
      current = '',
      bytes = 0,
      lineBytes = 0,
      scanned = 0,
      eof = true
    const lines = []
    const consume = (chunk) => {
      if (chunk.includes('\0'))
        throw fail('not-text', '二进制文件不支持文本预览')
      for (const piece of chunk.split(/(\n)/)) {
        if (piece === '\n') {
          if (line >= offset) {
            lines.push(current.replace(/\r$/, ''))
            current = ''
          }
          line++
          lineBytes = 0
          if (line >= offset + limit) {
            eof = false
            return false
          }
        } else {
          lineBytes += Buffer.byteLength(piece)
          if (lineBytes > 2 * 1024 * 1024)
            throw fail('file-too-large', '文本行过长')
          if (line >= offset) {
            bytes += Buffer.byteLength(piece)
            if (bytes > 2 * 1024 * 1024)
              throw fail('file-too-large', '当前文本页超过 2MiB')
            current += piece
          }
        }
      }
      return true
    }
    try {
      for await (const buffer of stream) {
        scanned += buffer.length
        if (scanned > 64 * 1024 * 1024)
          throw fail('file-too-large', '当前行位置超出单次 64MiB 扫描上限')
        if (!consume(decoder.decode(buffer, { stream: true }))) break
      }
      if (eof) {
        consume(decoder.decode())
        if (line >= offset && current) lines.push(current)
      }
      return {
        path: target.relative,
        size: info.size,
        version: info.mtimeMs + ':' + info.size,
        offset,
        lines: lines.length,
        content: lines.join('\n'),
        eof,
        nextOffset: offset + lines.length,
      }
    } catch (error) {
      if (error instanceof TypeError)
        throw fail('not-text', '文件不是有效的 UTF-8 文本')
      throw error
    } finally {
      this.#reads.delete(stream)
      stream.destroy()
    }
  }
  async observe(workspaceId, path = '.') {
    const target = await this.target(workspaceId, path)
    if (this.#watches.size >= 100)
      throw fail('watch-limit', '文件观察数量已达上限')
    const watchId = randomUUID()
    let timer
    const watcher = watch(target.path, () => {
      clearTimeout(timer)
      timer = setTimeout(
        () =>
          this.bus.publish('workspace/changed', {
            workspaceId,
            path: target.relative,
          }),
        120,
      )
    })
    watcher.on('error', () => this.release(watchId))
    const expiry = setTimeout(() => this.release(watchId), 120000)
    this.#watches.set(watchId, () => {
      clearTimeout(timer)
      clearTimeout(expiry)
      watcher.close()
    })
    return { watchId, expiresInMs: 120000 }
  }
  release(id) {
    this.#watches.get(id)?.()
    this.#watches.delete(id)
    return { closed: true }
  }
  dispose() {
    for (const id of [...this.#watches.keys()]) this.release(id)
    for (const stream of this.#reads) stream.destroy()
    this.#reads.clear()
    this.#roots.clear()
  }
  get watchCount() {
    return this.#watches.size
  }
}
