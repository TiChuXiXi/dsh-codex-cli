/**
 * 宿主冒烟测试：不经过 DSH，直接连本机 codex 守护进程，验证
 * 传输、initialize、项目聚合、线程列表与历史读取。
 *
 * 运行：node scripts/smoke-host.mjs [auto|daemon|stdio]
 */

import { EventBus } from '../lib/events.js'
import { CodexHub } from '../lib/hub.js'
import { normalizeConfig } from '../lib/config.js'

const transport = process.argv[2] ?? 'auto'
const logger = {
  info: (message) => console.log('[info]', message),
  warn: (message) => console.warn('[warn]', message),
  error: (message) => console.error('[error]', message),
  debug: () => {},
}

const bus = new EventBus({ capacity: 200 })
const hub = new CodexHub({ config: normalizeConfig({ transport }), logger, bus })
hub.start()

const deadline = Date.now() + 20000
while (Date.now() < deadline && hub.status().phase !== 'ready') {
  await new Promise((resolve) => setTimeout(resolve, 250))
}

const status = hub.status()
console.log('STATUS', JSON.stringify({
  phase: status.phase,
  kind: status.kind,
  codexVersion: status.codexVersion,
  socketPath: status.socketPath,
  error: status.error,
}))
if (status.phase !== 'ready') {
  await hub.stop()
  process.exit(1)
}

const projects = await hub.projects({ refresh: true })
console.log(`PROJECTS ${projects.length}`)
for (const project of projects.slice(0, 10)) {
  console.log(`  ${String(project.threadCount).padStart(3)}  ${project.name.padEnd(24)} ${project.git?.branch ?? '-'}  active=${project.activeCount}`)
}

const page = await hub.listThreads({ limit: 5 })
console.log(`THREADS page=${page.data.length} next=${page.nextCursor === null ? '-' : 'yes'}`)
for (const thread of page.data) {
  console.log(`  ${thread.id.slice(0, 8)}  ${(thread.name ?? '(no name)').slice(0, 40)}  ${thread.cwd}  ${thread.status?.type}`)
}

const first = page.data[0]
if (first !== undefined) {
  const detail = await hub.getThread(first.id, { limit: 3 })
  const items = detail.turns.reduce((sum, turn) => sum + (turn.items?.length ?? 0), 0)
  console.log(`DETAIL turns=${detail.turns.length} items=${items}`)
  const types = new Set(detail.turns.flatMap((turn) => (turn.items ?? []).map((item) => item.type)))
  console.log('ITEM TYPES', [...types].join(', '))
}

const models = await hub.models()
console.log('MODELS', models.slice(0, 5).map((model) => model.displayName).join(', '))

await hub.stop()
console.log('DONE')
