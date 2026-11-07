/** Observable plugin generation; no user data or credentials. */
import { randomUUID, createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
export const HOST_REVISION = 'git-vcs-1'
const key = Symbol.for('dsh-codex-cli.instances')
export function createRuntime(ctx) {
  const instances = (globalThis[key] ??= new Set())
  const instanceId = randomUUID()
  const buildId = createHash('sha256')
    .update(HOST_REVISION)
    .update(readFileSync(new URL('../index.js', import.meta.url)))
    .update(readFileSync(new URL('./routes.js', import.meta.url)))
    .update(readFileSync(new URL('./git.js', import.meta.url)))
    .digest('hex')
    .slice(0, 16)
  const startedAt = new Date().toISOString()
  ctx.effect(() => {
    instances.add(instanceId)
    return () => instances.delete(instanceId)
  }, 'codex-cli: instance diagnostics')
  return () => ({
    hostRevision: HOST_REVISION,
    hostBuildId: buildId,
    hostInstanceId: instanceId,
    startedAt,
    hostPid: process.pid,
    activeInstances: instances.size,
  })
}
