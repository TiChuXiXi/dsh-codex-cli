/**
 * 版本与健康：探测、升级、回滚、守护进程管理、doctor 体检。
 *
 * 原则：
 *   - 升级走官方 `codex update`（内部即 npm install -g），不自己拼安装命令；
 *   - 回滚才直接用 npm 装指定版本；
 *   - 长命令一律作为后台 job 跑，输出经 SSE 实时回显；
 *   - 升级/重启守护进程前先看有没有活动回合，默认要求显式确认。
 */

import { spawn } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { resolveCodexCommand, resolveCodexHome } from './transport/index.js'
import { HubError } from './hub.js'

const REGISTRIES = [
  'https://registry.npmmirror.com/@openai/codex/latest',
  'https://registry.npmjs.org/@openai/codex/latest',
]
const JOB_LINE_LIMIT = 4000
const DAEMON_ACTIONS = new Set(['start', 'stop', 'restart', 'update'])
const VERSION_PATTERN = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u

export class VersionService {
  /** @type {Map<string, object>} */
  #jobs = new Map()
  #checkCache = null

  constructor({ config, logger, bus, hub }) {
    this.config = config
    this.logger = logger
    this.bus = bus
    this.hub = hub
  }

  /** 一次性拿到 CLI / 守护进程 / 最新版 / doctor 摘要。 */
  async check({ refresh = false } = {}) {
    const now = Date.now()
    if (!refresh && this.#checkCache !== null && now - this.#checkCache.at < 30000) {
      return this.#checkCache.value
    }
    const command = resolveCodexCommand(this.config)
    const codexHome = resolveCodexHome(this.config)

    const [cliResult, daemonResult, latestResult, doctorResult] = await Promise.allSettled([
      this.#capture(command, ['--version'], 10000),
      this.#capture(command, ['app-server', 'daemon', 'version'], 10000),
      this.#latestVersion(codexHome),
      this.#capture(command, ['doctor', '--json'], 45000),
    ])

    const cli = parseCliVersion(settledValue(cliResult))
    const daemon = parseJson(settledValue(daemonResult))
    const latest = settledValue(latestResult) ?? null
    const doctor = parseDoctor(settledValue(doctorResult))

    const updateAvailable =
      latest?.version !== undefined &&
      cli.version !== null &&
      compareVersions(latest.version, cli.version) > 0

    const value = {
      cli,
      daemon,
      latest,
      updateAvailable,
      install: doctor?.install ?? null,
      doctor: doctor?.summary ?? null,
      checkedAt: now,
      command,
      codexHome,
    }
    this.#checkCache = { at: now, value }
    return value
  }

  /** 升级：官方命令，作为 job 跑。 */
  async update({ force = false } = {}) {
    await this.#assertNoActiveTurns(force, '升级 Codex')
    const command = resolveCodexCommand(this.config)
    return this.#startJob('update', command, ['update'])
  }

  /** 回滚：npm 安装指定版本。 */
  async rollback({ version, force = false } = {}) {
    if (typeof version !== 'string' || !VERSION_PATTERN.test(version)) {
      throw new HubError('codex-cli/bad-request', '版本号格式不正确', { version })
    }
    await this.#assertNoActiveTurns(force, '回滚 Codex')
    return this.#startJob('rollback', 'npm', ['install', '-g', `@openai/codex@${version}`])
  }

  /** 守护进程动作：start / stop / restart / update。 */
  async daemonAction({ action, force = false } = {}) {
    if (!DAEMON_ACTIONS.has(action)) {
      throw new HubError('codex-cli/bad-request', `未知的守护进程动作：${String(action)}`)
    }
    if (action === 'stop' || action === 'restart' || action === 'update') {
      await this.#assertNoActiveTurns(force, `守护进程 ${action}`)
    }
    const command = resolveCodexCommand(this.config)
    return this.#startJob(`daemon-${action}`, command, ['app-server', 'daemon', action])
  }

  /** 重新跑一次 doctor（不走缓存）。 */
  async doctor() {
    const command = resolveCodexCommand(this.config)
    const output = await this.#capture(command, ['doctor', '--json'], 60000)
    const parsed = parseDoctor(output)
    if (parsed === null) throw new HubError('codex-cli/doctor-failed', 'codex doctor 没有返回可解析的 JSON')
    return parsed
  }

  /** 读一个 job 的状态与输出。 */
  job(jobId) {
    const job = this.#jobs.get(String(jobId))
    if (job === undefined) throw new HubError('codex-cli/unknown-job', '任务不存在')
    return {
      jobId: job.id,
      kind: job.kind,
      status: job.status,
      command: job.command,
      exitCode: job.exitCode ?? null,
      startedAt: job.startedAt,
      finishedAt: job.finishedAt ?? null,
      lines: [...job.lines],
    }
  }

  // ── 内部 ────────────────────────────────────────────────────────────────

  async #assertNoActiveTurns(force, label) {
    if (force === true) return
    let active = []
    try {
      const page = await this.hub.listThreads({ limit: 100 })
      active = page.data.filter((thread) => thread.status?.type === 'active')
    } catch {
      // 未连接时不阻断版本操作
      return
    }
    if (active.length > 0) {
      throw new HubError('codex-cli/active-turns', `${label}前有 ${active.length} 个会话正在运行`, {
        threads: active.map((thread) => ({ id: thread.id, name: thread.name, cwd: thread.cwd })),
      })
    }
  }

  #startJob(kind, command, args) {
    const id = randomUUID()
    const job = {
      id,
      kind,
      command: [command, ...args].join(' '),
      status: 'running',
      startedAt: Date.now(),
      finishedAt: null,
      exitCode: null,
      lines: [],
    }
    this.#jobs.set(id, job)
    this.logger?.info?.(`[codex-cli] 启动版本任务 ${kind}：${job.command}`)

    let child
    try {
      child = spawn(command, args, { env: process.env, stdio: ['ignore', 'pipe', 'pipe'] })
    } catch (cause) {
      job.status = 'error'
      job.lines.push(`无法启动：${cause instanceof Error ? cause.message : String(cause)}`)
      job.finishedAt = Date.now()
      this.bus.publish('version/done', { jobId: id, kind, status: 'error', exitCode: null })
      return { jobId: id, command: job.command }
    }

    child.stdout?.setEncoding('utf8')
    child.stderr?.setEncoding('utf8')
    child.stdout?.on('data', (chunk) => this.#append(job, chunk))
    child.stderr?.on('data', (chunk) => this.#append(job, chunk))
    child.once('error', (cause) => {
      this.#append(job, `进程错误：${cause.message}`)
    })
    child.once('exit', (code, signal) => {
      job.status = code === 0 ? 'done' : 'error'
      job.exitCode = code
      job.finishedAt = Date.now()
      if (signal) this.#append(job, `进程被信号 ${signal} 终止`)
      this.bus.publish('version/done', {
        jobId: id,
        kind,
        status: job.status,
        exitCode: code,
      })
      this.logger?.info?.(`[codex-cli] 版本任务 ${kind} 结束：code=${code}`)
      // 只保留最近 20 个任务
      if (this.#jobs.size > 20) {
        const oldest = [...this.#jobs.keys()][0]
        this.#jobs.delete(oldest)
      }
    })

    return { jobId: id, command: job.command }
  }

  #append(job, chunk) {
    const text = String(chunk)
    for (const line of text.split(/\r?\n/u)) {
      if (line === '') continue
      job.lines.push(line)
      if (job.lines.length > JOB_LINE_LIMIT) job.lines.splice(0, job.lines.length - JOB_LINE_LIMIT)
      this.bus.publish('version/progress', { jobId: job.id, kind: job.kind, line })
    }
  }

  #capture(command, args, timeoutMs) {
    return new Promise((resolve) => {
      let stdout = ''
      let stderr = ''
      let settled = false
      const finish = (code) => {
        if (settled) return
        settled = true
        resolve({ code, stdout, stderr })
      }
      let child
      try {
        child = spawn(command, args, { env: process.env, stdio: ['ignore', 'pipe', 'pipe'] })
      } catch (cause) {
        resolve({ code: -1, stdout: '', stderr: cause instanceof Error ? cause.message : String(cause) })
        return
      }
      child.stdout?.setEncoding('utf8')
      child.stderr?.setEncoding('utf8')
      child.stdout?.on('data', (chunk) => {
        stdout = (stdout + chunk).slice(-2 * 1024 * 1024)
      })
      child.stderr?.on('data', (chunk) => {
        stderr = (stderr + chunk).slice(-2 * 1024 * 1024)
      })
      child.once('error', (cause) => {
        stderr += cause.message
        finish(-1)
      })
      child.once('exit', (code) => finish(code ?? -1))
      const timer = setTimeout(() => {
        try {
          child.kill('SIGTERM')
        } catch {
          // 忽略
        }
        finish(-2)
      }, timeoutMs)
      timer.unref?.()
    })
  }

  async #latestVersion(codexHome) {
    for (const url of REGISTRIES) {
      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(5000),
          headers: { accept: 'application/json' },
        })
        if (!response.ok) continue
        const json = await response.json()
        if (typeof json?.version === 'string' && VERSION_PATTERN.test(json.version)) {
          return { version: json.version, source: new URL(url).host }
        }
      } catch {
        // 换下一个 registry
      }
    }
    try {
      const cached = JSON.parse(await readFile(join(codexHome, 'version.json'), 'utf8'))
      if (typeof cached?.latest_version === 'string' && VERSION_PATTERN.test(cached.latest_version)) {
        return { version: cached.latest_version, source: 'version.json' }
      }
    } catch {
      // 没有缓存
    }
    return null
  }
}

function settledValue(result) {
  return result.status === 'fulfilled' ? result.value : null
}

function parseCliVersion(output) {
  const text = `${output?.stdout ?? ''}\n${output?.stderr ?? ''}`
  const match = /codex-cli\s+(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)/u.exec(text)
  return {
    version: match === null ? null : match[1],
    raw: text.trim().slice(0, 200),
  }
}

function parseJson(output) {
  if (output === null || output.stdout === undefined) return null
  const text = output.stdout.trim()
  if (text === '') return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function parseDoctor(output) {
  if (output === null) return null
  const text = output.stdout.trim()
  if (text === '') return null
  let report
  try {
    report = JSON.parse(text)
  } catch {
    return null
  }
  const checks = []
  for (const check of Object.values(report.checks ?? {})) {
    checks.push({
      id: check.id,
      category: check.category,
      status: check.status,
      summary: check.summary,
      remediation: check.remediation ?? null,
    })
  }
  const install = report.checks?.installation?.details ?? null
  const updates = report.checks?.['updates.status']?.details ?? null
  return {
    summary: {
      overallStatus: report.overallStatus ?? 'unknown',
      codexVersion: report.codexVersion ?? null,
      checks,
      updates,
      generatedAt: report.generatedAt ?? null,
    },
    install: install === null
      ? null
      : {
          context: install['install context'] ?? null,
          executable: install['current executable'] ?? null,
          updateAction: updates?.['update action'] ?? null,
          cachedLatest: updates?.['cached latest version'] ?? null,
        },
  }
}

/** 简单的 semver 比较：只处理数字段与预发布后缀。 */
export function compareVersions(left, right) {
  const parse = (value) => {
    const [core, pre] = String(value).split('-', 2)
    return { parts: core.split('.').map((part) => Number.parseInt(part, 10) || 0), pre: pre ?? null }
  }
  const a = parse(left)
  const b = parse(right)
  for (let index = 0; index < Math.max(a.parts.length, b.parts.length); index += 1) {
    const diff = (a.parts[index] ?? 0) - (b.parts[index] ?? 0)
    if (diff !== 0) return diff > 0 ? 1 : -1
  }
  if (a.pre === b.pre) return 0
  if (a.pre === null) return 1
  if (b.pre === null) return -1
  return a.pre > b.pre ? 1 : -1
}
