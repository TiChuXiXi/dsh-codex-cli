/** 目录检查：新建项目前确认路径存在且是目录。 */

import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { execFile, spawn } from 'node:child_process'
import { promisify } from 'node:util'
import { join } from 'node:path'
import { HubError } from './hub.js'

const execFileAsync = promisify(execFile)

export async function checkDirectory(path) {
  if (typeof path !== 'string' || path.trim() === '') {
    throw new HubError('codex-cli/bad-request', 'path 不能为空')
  }
  const target = path.trim()
  try {
    const info = await stat(target)
    return { path: target, exists: true, isDirectory: info.isDirectory() }
  } catch {
    return { path: target, exists: false, isDirectory: false }
  }
}

const MAX_TEXT = 256 * 1024
const MAX_OUTPUT = 200 * 1024

async function git(cwd, args) {
  const { stdout } = await execFileAsync('git', ['-C', cwd, ...args], {
    maxBuffer: 4 * 1024 * 1024,
    timeout: 15000,
  })
  return stdout
}

/** 列目录：目录优先、按名称排序。 */
export async function listDirectory(path) {
  const target = requirePath(path)
  const entries = await readdir(target, { withFileTypes: true })
  const result = []
  for (const entry of entries) {
    const full = join(target, entry.name)
    let info = null
    try {
      info = await stat(full)
    } catch {
      // 断链等忽略。
    }
    result.push({
      name: entry.name,
      path: full,
      type: entry.isDirectory() ? 'dir' : 'file',
      size: info?.size ?? null,
      mtime: info?.mtimeMs ?? null,
    })
  }
  result.sort((a, b) =>
    a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'dir' ? -1 : 1,
  )
  return { path: target, entries: result }
}

/** 读文本文件预览，二进制与超大文件拒绝/截断。 */
export async function readTextFile(path) {
  const target = requirePath(path)
  const info = await stat(target)
  if (!info.isFile()) throw new HubError('codex-cli/not-a-file', '路径不是文件', { path: target })
  const buffer = await readFile(target)
  const slice = buffer.subarray(0, MAX_TEXT)
  if (slice.includes(0)) {
    throw new HubError('codex-cli/binary', '二进制文件不支持预览', { path: target })
  }
  return {
    path: target,
    size: info.size,
    truncated: buffer.length > MAX_TEXT,
    content: slice.toString('utf8'),
  }
}

/** git 状态：分支、变更列表、diff stat、最近提交。 */
export async function gitStatus(cwd) {
  const target = requirePath(cwd)
  const branch = (await git(target, ['rev-parse', '--abbrev-ref', 'HEAD'])).trim()
  const porcelain = await git(target, ['status', '--porcelain=v1'])
  const changes = porcelain
    .split('\n')
    .filter((line) => line !== '')
    .map((line) => ({ status: line.slice(0, 2).trim(), path: line.slice(3) }))
  const diffStat = await git(target, ['diff', '--stat']).catch(() => '')
  const log = await git(target, ['log', '--oneline', '-n', '15']).catch(() => '')
  return { cwd: target, branch, changes, diffStat, log }
}

/** git diff：可限定单个路径。 */
export async function gitDiff(cwd, path) {
  const target = requirePath(cwd)
  const args = typeof path === 'string' && path !== '' ? ['diff', '--', path] : ['diff']
  return { cwd: target, diff: await git(target, args) }
}

/** 在工作目录运行命令，30 秒超时、输出截断。 */
export function runCommand(cwd, command) {
  if (typeof command !== 'string' || command.trim() === '') {
    throw new HubError('codex-cli/bad-request', 'command 不能为空')
  }
  const target = requirePath(cwd)
  return new Promise((resolve) => {
    const child = spawn('/bin/bash', ['-lc', command], { cwd: target, env: process.env })
    let output = ''
    let truncated = false
    const timer = setTimeout(() => child.kill('SIGKILL'), 30000)
    const onData = (chunk) => {
      output += chunk.toString()
      if (output.length > MAX_OUTPUT) {
        output = output.slice(0, MAX_OUTPUT)
        truncated = true
        child.kill('SIGKILL')
      }
    }
    child.stdout.on('data', onData)
    child.stderr.on('data', onData)
    child.on('close', (code) => {
      clearTimeout(timer)
      resolve({ code, output, truncated })
    })
    child.on('error', (cause) => {
      clearTimeout(timer)
      resolve({ code: -1, output: String(cause), truncated })
    })
  })
}

function requirePath(path) {
  if (typeof path !== 'string' || path.trim() === '') {
    throw new HubError('codex-cli/bad-request', 'path 不能为空')
  }
  return path.trim()
}


/** 保存上传文件到工作区的 .dsh-uploads/codex-cli 下。 */
export async function saveUpload(cwd, name, dataBase64) {
  const target = requirePath(cwd)
  const safe = String(name ?? 'file')
    .replace(/[^\w.\- ]+/g, '_')
    .slice(0, 120) || 'file'
  const buffer = Buffer.from(String(dataBase64 ?? ''), 'base64')
  if (buffer.length === 0) throw new HubError('codex-cli/bad-request', '文件为空')
  if (buffer.length > 25 * 1024 * 1024) {
    throw new HubError('codex-cli/file-too-large', '文件超过 25MB')
  }
  const dir = join(target, '.dsh-uploads', 'codex-cli')
  await mkdir(dir, { recursive: true })
  const file = join(dir, `${Date.now()}-${safe}`)
  await writeFile(file, buffer)
  return { path: file, name: safe, size: buffer.length }
}
