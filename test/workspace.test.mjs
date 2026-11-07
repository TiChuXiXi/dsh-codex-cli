import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, symlink, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { WorkspaceService } from '../lib/workspace.js'

async function fixture(run) {
  const base = await mkdtemp(join(tmpdir(), 'codex-workspace-test-'))
  const root = join(base, 'root')
  await mkdir(root)
  const events = []
  const service = new WorkspaceService({
    publish: (type, payload) => events.push({ type, payload }),
  })
  try {
    await run({
      base,
      root,
      service,
      events,
      workspaceId: (await service.register(root)).workspaceId,
    })
  } finally {
    service.dispose()
    await rm(base, { recursive: true, force: true })
  }
}
test('workspace canonical identity, directory metadata and path containment', () =>
  fixture(async ({ base, root, service, workspaceId }) => {
    await writeFile(join(root, '中文 file.txt'), 'one\ntwo\nthree')
    await mkdir(join(root, 'dir'))
    await symlink(base, join(root, 'outside'))
    assert.equal(
      (await service.register(join(root, 'dir', '..'))).workspaceId,
      workspaceId,
    )
    const listed = await service.list(workspaceId)
    assert.equal(listed.entries[0].type, 'dir')
    assert.equal(
      listed.entries.find((e) => e.name === 'outside').type,
      'unavailable',
    )
    for (const path of ['..', 'outside'])
      await assert.rejects(
        service.text(workspaceId, path),
        (e) => e.code === 'codex-cli/outside-workspace',
      )
    await assert.rejects(
      service.list('missing'),
      (e) => e.code === 'codex-cli/workspace-expired',
    )
  }))
test('paged text preserves Unicode and binary windows preserve exact original bytes', () =>
  fixture(async ({ root, service, workspaceId }) => {
    await writeFile(join(root, 'text.txt'), '一\r\n二\n三')
    const page = await service.text(workspaceId, 'text.txt', 2, 1)
    assert.equal(page.content, '二')
    assert.equal(page.nextOffset, 3)
    assert.equal(
      (await service.text(workspaceId, 'text.txt', 3, 20)).content,
      '三',
    )
    const bytes = Buffer.from([0, 1, 2, 128, 255])
    await writeFile(join(root, 'binary'), bytes)
    assert.deepEqual(
      Buffer.from(
        (await service.bytes(workspaceId, 'binary', 1, 3)).dataBase64,
        'base64',
      ),
      bytes.subarray(1, 4),
    )
    await assert.rejects(
      service.text(workspaceId, 'binary'),
      (e) => e.code === 'codex-cli/not-text',
    )
    await writeFile(join(root, 'invalid'), Buffer.from([255, 254, 1]))
    await assert.rejects(
      service.text(workspaceId, 'invalid'),
      (e) => e.code === 'codex-cli/not-text',
    )
    await assert.rejects(
      service.bytes(workspaceId, 'binary', 0, 3 * 1024 * 1024),
      (e) => e.code === 'codex-cli/bad-request',
    )
  }))
test('large line is refused and watcher cleanup closes every lease', () =>
  fixture(async ({ root, service, workspaceId, events }) => {
    await writeFile(join(root, 'large'), 'x'.repeat(2 * 1024 * 1024 + 1))
    await assert.rejects(
      service.text(workspaceId, 'large'),
      (e) => e.code === 'codex-cli/file-too-large',
    )
    const { watchId } = await service.observe(workspaceId)
    assert.equal(service.watchCount, 1)
    await writeFile(join(root, 'new'), 'new')
    await new Promise((r) => setTimeout(r, 250))
    assert.ok(
      events.some(
        (e) =>
          e.type === 'workspace/changed' &&
          e.payload.workspaceId === workspaceId,
      ),
    )
    service.release(watchId)
    assert.equal(service.watchCount, 0)
    service.dispose()
    assert.equal(service.watchCount, 0)
  }))

test('workspace upload does not overwrite, and deletion preserves files in trash', () =>
 fixture(async ({root,service,workspaceId,events})=>{
  const {readFile,access}=await import('node:fs/promises')
  await mkdir(join(root,'folder'))
  const large=Buffer.alloc(3*1024*1024,65)
  await service.upload(workspaceId,'folder','large.bin',large.toString('base64'))
  assert.equal((await readFile(join(root,'folder/large.bin'))).length,large.length)
  const data=Buffer.from('中文 upload').toString('base64')
  await service.upload(workspaceId,'folder','file.txt',data)
  assert.equal(await readFile(join(root,'folder/file.txt'),'utf8'),'中文 upload')
  await assert.rejects(service.upload(workspaceId,'folder','file.txt',data),e=>e.code==='codex-cli/file-exists')
  for(const name of ['../escape','/absolute','..','.git'])
   await assert.rejects(service.upload(workspaceId,'.',name,data))
  await assert.rejects(service.remove(workspaceId,'.'),e=>e.code==='codex-cli/protected-path')
  await mkdir(join(root,'.git'))
  await assert.rejects(service.remove(workspaceId,'.git'),e=>e.code==='codex-cli/protected-path')
  await symlink(join(root,'folder'),join(root,'linked'))
  await assert.rejects(service.remove(workspaceId,'linked'),e=>e.code==='codex-cli/unsafe-path')
  const removed=await service.remove(workspaceId,'folder')
  await assert.rejects(access(join(root,'folder')))
  assert.equal(await readFile(join(root,removed.trashPath,'file.txt'),'utf8'),'中文 upload')
  assert.ok(events.some(e=>e.type==='workspace/changed'&&e.payload.path==='.'))
 }))
