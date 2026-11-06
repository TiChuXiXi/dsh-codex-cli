/** 目录检查、浏览与新建：项目选择器与右侧文件面板共用。 */

import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { execFile, spawn } from 'node:child_process'
import { homedir } from 'node:os'
import { promisify } from 'node:util'
import { dirname, join, parse, resolve, sep } from 'node:path'
import { HubError } from './hub.js'

const execFileAsync = promisify(execFile)
/** 单层目录最多返回的行数（隐藏项计入），与 DSH 目录选择器一致。 */
const MAX_LIST_ENTRIES = 1000

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

/**
 * 列一层目录：目录在前、按名称排序。
 * 不传 path 时列宿主账户的家目录；返回绝对路径、父目录、家目录、面包屑、隐藏标记与截断标记。
 */
export async function listDirectory(path) {
  const target = path === undefined || path === null || String(path).trim() === ''
    ? homedir()
    : resolve(String(path).trim())
  const info = await stat(target).catch(() => null)
  if (info === null) {
    throw new HubError('codex-cli/directory-unreadable', `目录不存在：${target}`, { path: target })
  }
  if (!info.isDirectory()) {
    throw new HubError('codex-cli/not-a-directory', `不是目录：${target}`, { path: target })
  }
  const entries = await readdir(target, { withFileTypes: true })
  const result = []
  for (const entry of entries) {
    const full = join(target, entry.name)
    let child = null
    try {
      child = await stat(full)
    } catch {
      // 断链等忽略。
    }
    // 指向目录的符号链接按目录处理，断链跳过。
    const isDirectory = entry.isDirectory() || (entry.isSymbolicLink() && child?.isDirectory() === true)
    if (entry.isSymbolicLink() && child === null) continue
    result.push({
      name: entry.name,
      path: full,
      type: isDirectory ? 'dir' : 'file',
      hidden: entry.name.startsWith('.'),
      size: child?.size ?? null,
      mtime: child?.mtimeMs ?? null,
    })
  }
  result.sort((a, b) =>
    a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'dir' ? -1 : 1,
  )
  const truncated = result.length > MAX_LIST_ENTRIES
  return {
    path: target,
    parent: parentOf(target),
    home: homedir(),
    crumbs: crumbsOf(target),
    entries: truncated ? result.slice(0, MAX_LIST_ENTRIES) : result,
    truncated,
  }
}

/** 在既有父目录下新建一个子目录；不递归、不覆盖。 */
export async function createDirectory(path, name) {
  const parent = requirePath(path)
  if (!parse(parent).root) {
    throw new HubError('codex-cli/bad-request', '目录路径必须是绝对路径', { path: parent })
  }
  const segment = typeof name === 'string' ? name.trim() : ''
  if (segment === '' || segment === '.' || segment === '..' || /[/\\\0]/u.test(segment)) {
    throw new HubError('codex-cli/bad-name', '文件夹名称只能是单层名称，不能包含路径分隔符')
  }
  const info = await stat(parent).catch(() => null)
  if (info === null || !info.isDirectory()) {
    throw new HubError('codex-cli/not-a-directory', `不是目录：${parent}`, { path: parent })
  }
  const created = join(parent, segment)
  try {
    await mkdir(created)
  } catch (cause) {
    if (cause?.code === 'EEXIST') {
      throw new HubError('codex-cli/directory-exists', `目录已存在：${segment}`, { path: created })
    }
    throw new HubError(
      'codex-cli/directory-create-failed',
      cause instanceof Error ? cause.message : String(cause),
      { path: created },
    )
  }
  return { path: created, name: segment }
}

/** 父目录：根目录返回 null。 */
function parentOf(target) {
  if (target === parse(target).root) return null
  return dirname(target)
}

/** 面包屑：从根到目标的祖先链，每项都可作为跳转目标。 */
function crumbsOf(target) {
  const root = parse(target).root
  const crumbs = [{ name: root, path: root }]
  const rest = target.slice(root.length)
  let accumulated = root
  for (const part of rest.split(sep)) {
    if (part === '') continue
    accumulated = join(accumulated, part)
    crumbs.push({ name: part, path: accumulated })
  }
  return crumbs
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
