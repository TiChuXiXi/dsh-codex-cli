import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, stat, writeFile } from 'node:fs/promises'
import { homedir, tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { createDirectory, listDirectory } from '../lib/fs.js'

async function withTempDir(run) {
  const root = await mkdtemp(join(tmpdir(), 'dsh-codex-fs-'))
  try {
    await run(root)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

test('不传路径时列宿主家目录，并带父目录与面包屑', async () => {
  const listing = await listDirectory()
  assert.equal(listing.path, homedir())
  assert.equal(listing.home, homedir())
  assert.equal(listing.parent, dirname(homedir()))
  assert.equal(listing.crumbs.at(-1).path, homedir())
  assert.equal(listing.crumbs[0].path, '/')
  assert.ok(Array.isArray(listing.entries))
})

test('列目录：目录在前、带 hidden 与父目录', async () => {
  await withTempDir(async (root) => {
    await mkdir(join(root, 'zeta'))
    await mkdir(join(root, 'alpha'))
    await mkdir(join(root, '.secret'))
    await writeFile(join(root, 'note.txt'), 'hello')

    const listing = await listDirectory(root)
    assert.equal(listing.path, root)
    assert.equal(listing.parent, dirname(root))
    assert.equal(listing.truncated, false)
    assert.deepEqual(
      listing.entries.map((entry) => [entry.name, entry.type, entry.hidden]),
      [
        ['.secret', 'dir', true],
        ['alpha', 'dir', false],
        ['zeta', 'dir', false],
        ['note.txt', 'file', false],
      ],
    )
    assert.equal(listing.entries[0].path, join(root, '.secret'))
  })
})

test('列不存在的目录给出可识别的错误码', async () => {
  await assert.rejects(
    () => listDirectory('/tmp/dsh-codex-missing-' + Date.now()),
    (error) => error.code === 'codex-cli/directory-unreadable',
  )
})

test('新建子目录：成功后返回绝对路径，重名与非单层名称被拒绝', async () => {
  await withTempDir(async (root) => {
    const created = await createDirectory(root, '  proj  ')
    assert.equal(created.name, 'proj')
    assert.equal(created.path, join(root, 'proj'))
    assert.equal((await stat(created.path)).isDirectory(), true)

    await assert.rejects(
      () => createDirectory(root, 'proj'),
      (error) => error.code === 'codex-cli/directory-exists',
    )
    for (const name of ['', '   ', '.', '..', 'a/b', 'a\\b']) {
      await assert.rejects(
        () => createDirectory(root, name),
        (error) => error.code === 'codex-cli/bad-name',
      )
    }
    await assert.rejects(
      () => createDirectory(join(root, 'missing'), 'child'),
      (error) => error.code === 'codex-cli/not-a-directory',
    )
    await assert.rejects(
      () => createDirectory('relative/path', 'child'),
      (error) => error.code === 'codex-cli/bad-request',
    )
  })
})
