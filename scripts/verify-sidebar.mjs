/** Real DSH acceptance. Supply a private Playwright state file; never log login URLs. */
import assert from 'node:assert/strict'
import { readFile, writeFile, mkdir, utimes } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const execute = promisify(execFile)
const pw = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const base = process.env.DSH_BASE_URL || 'http://127.0.0.1:3081'
const profile = process.env.DSH_PROFILE_DIR
const artifacts = resolve(
  process.env.SIDEBAR_ARTIFACTS || '/tmp/dsh-sidebar-verification',
)
const stateFile = process.env.DSH_BROWSER_STATE
if (!stateFile)
  throw new Error(
    'DSH_BROWSER_STATE must name a private authenticated Playwright storage state file',
  )
await mkdir(artifacts, { recursive: true })
const fixture = resolve(artifacts, 'workspace')
await mkdir(fixture, { recursive: true })
await writeFile(
  resolve(fixture, 'README.md'),
  '# Sidebar acceptance\n\nA controlled fixture.\n',
)
const browser = await pw.chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH }
    : {}),
})
const context = await browser.newContext({
  storageState: stateFile,
  viewport: { width: 1440, height: 900 },
})
const page = await context.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
let navigations = 0
page.on('framenavigated', (frame) => {
  if (frame === page.mainFrame()) navigations++
})
const api = async (method, payload = {}) => {
  const response = await context.request.post(base + '/codex-cli/' + method, {
    data: {
      type: 'client-request',
      rpcId: crypto.randomUUID(),
      method,
      payload,
    },
  })
  assert.equal(response.status(), 200, 'authenticated RPC')
  const body = await response.json()
  assert.equal(body.result?.ok, true, body.result?.error?.message || method)
  return body.result.value
}
async function until(check, description, timeout = 20000) {
  const end = Date.now() + timeout
  while (Date.now() < end) {
    if (await check()) return
    await new Promise((r) => setTimeout(r, 150))
  }
  throw new Error('Timed out: ' + description)
}
const report = { base, checks: [], runtime: null, errors }
let thread,
  originalHost,
  hostDirty = false
try {
  thread = (await api('threads/new', { cwd: fixture })).id
  await page.addInitScript((id) => {
    localStorage.setItem('dsh-codex-last-thread', id)
    localStorage.setItem('dsh-codex-right-open', '1')
  }, thread)
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' })
  await page
    .getByRole('button', { name: '继续', exact: true })
    .click({ timeout: 2500 })
    .catch(() => {})
  await page
    .getByRole('button', { name: 'Codex CLI', exact: true })
    .first()
    .click()
  const sidebar = page.locator('[data-codex-sidebar]:not([hidden])')
  await sidebar.waitFor()
  await sidebar.getByText('README.md', { exact: true }).waitFor()
  assert.equal(await page.locator('.dsh-codex-root').count(), 1)
  report.runtime = (await api('status')).runtime
  assert.equal(report.runtime.activeInstances, 1)
  report.checks.push('single host/client instance and actual file list')
  await page
    .getByRole('button', { name: '继续', exact: true })
    .click({ timeout: 1500 })
    .catch(() => {})
  await sidebar
    .getByRole('treeitem')
    .filter({ hasText: 'README.md' })
    .click({ timeout: 3000 })
  await sidebar
    .locator('.codex-sidebar-document .dsh-codex-markdown')
    .getByRole('heading', { name: 'Sidebar acceptance' })
    .waitFor()
  await sidebar
    .locator('[role="tab"]')
    .filter({ hasText: '工作区文件' })
    .click()
  await writeFile(resolve(fixture, 'watched.txt'), 'A real file watch event')
  await sidebar
    .getByRole('treeitem')
    .filter({ hasText: 'watched.txt' })
    .waitFor({ timeout: 5000 })
  report.checks.push(
    'file tree, separate Markdown tab and live filesystem observation',
  )
  const resize = sidebar.getByRole('separator', { name: '调整右栏宽度' })
  const beforeWidth = Number(await resize.getAttribute('aria-valuenow'))
  await resize.focus()
  await page.keyboard.press('ArrowLeft')
  assert.equal(
    Number(await resize.getAttribute('aria-valuenow')),
    beforeWidth + 24,
  )
  await sidebar.getByRole('button', { name: '右栏全屏', exact: true }).click()
  await sidebar
    .getByRole('button', { name: '向右分栏', exact: true })
    .first()
    .click()
  const guide = sidebar.locator('.codex-sidebar-guide').last()
  await guide.getByRole('button', { name: '浏览器' }).click()
  await sidebar.locator('.codex-sidebar-browser').waitFor()
  const browserTab = sidebar
    .locator('[role="tab"]')
    .filter({ hasText: '浏览器' })
    .last()
  await browserTab.click({ button: 'right' })
  await page.getByRole('menuitem', { name: '浮动窗口', exact: true }).click()
  await page.getByRole('button', { name: '停靠到右栏', exact: true }).waitFor()
  await page.getByRole('button', { name: '停靠到右栏', exact: true }).click()
  await sidebar.locator('.codex-sidebar-browser').waitFor()
  report.checks.push(
    'keyboard resize, fullscreen, split, tab creation, float and dock',
  )
  await page.keyboard.press('Escape')
  await page.screenshot({ path: resolve(artifacts, 'layout.png') })
  const draft = page.locator('.dsh-codex-root textarea').first()
  await draft.fill('Acceptance draft retained across hot updates')
  const navBefore = navigations
  const originalClientBuild = await page
    .locator('.dsh-codex-root')
    .getAttribute('data-client-build')
  if (process.env.VERIFY_HMR === '1') {
    try {
      for (let i = 0; i < 10; i++) {
        const marker = 'sidebar-acceptance-' + i
        console.log('Verifying client generation', i + 1)
        await execute(process.execPath, ['scripts/build-client.mjs'], {
          cwd: root,
          env: { ...process.env, CODEX_CLIENT_BUILD_ID: marker },
        })
        await until(
          async () =>
            (await page
              .locator('.dsh-codex-root')
              .getAttribute('data-client-build')
              .catch(() => null)) === marker,
          'client swap ' + i,
        )
        assert.equal(await page.locator('#dsh-codex-cli-style').count(), 1)
        assert.equal(await page.locator('.dsh-codex-root').count(), 1)
        assert.equal(navigations, navBefore)
        await until(
          async () =>
            (await draft.inputValue().catch(() => null)) ===
            'Acceptance draft retained across hot updates',
          'restore draft ' + i,
        )
      }
      report.checks.push(
        '10 client HMR swaps without document navigation or duplicate styles',
      )
    } finally {
      await execute(process.execPath, ['scripts/build-client.mjs'], {
        cwd: root,
        env: { ...process.env, CODEX_CLIENT_BUILD_ID: originalClientBuild },
      })
      await until(
        async () =>
          (await page
            .locator('.dsh-codex-root')
            .getAttribute('data-client-build')
            .catch(() => null)) === originalClientBuild,
        'restore client build',
      )
    }
    if (!profile || !resolve(profile).startsWith('/tmp/'))
      throw new Error(
        'Host HMR mutation probe requires an isolated /tmp profile',
      )
    const hostPath = resolve(root, 'lib/runtime.js')
    originalHost = await readFile(hostPath, 'utf8')
    let previous = report.runtime
    for (let i = 0; i < 3; i++) {
      console.log('Verifying host generation', i + 1)
      hostDirty = true
      await writeFile(
        hostPath,
        originalHost.replace('sidebar-1', 'sidebar-acceptance-' + i),
      )
      const now = new Date()
      await utimes(resolve(profile, 'cordis.patch.yml'), now, now)
      let next
      await until(async () => {
        try {
          next = (await api('status')).runtime
          return (
            next.hostInstanceId !== previous.hostInstanceId &&
            next.hostRevision === 'sidebar-acceptance-' + i
          )
        } catch {
          return false
        }
      }, 'host swap ' + i)
      assert.equal(next.hostPid, previous.hostPid)
      assert.equal(next.activeInstances, 1)
      previous = next
    }
    report.checks.push(
      '3 host code swaps, stable DSH PID, single active host instance',
    )
    await sidebar
      .locator('[role="tab"]')
      .filter({ hasText: '工作区文件' })
      .click()
    await until(async () => {
      try {
        const count = (await api('status')).runtime.workspaceWatchCount
        return count >= 1 && count <= 2
      } catch {
        return false
      }
    }, 'workspace watch reattached after host HMR')
    const changed = 'after-host-' + Date.now() + '.txt'
    await writeFile(resolve(fixture, changed), 'Event stream survived host HMR')
    await sidebar
      .getByRole('treeitem')
      .filter({ hasText: changed })
      .waitFor({ timeout: 5000 })
    report.checks.push(
      'SSE reconnect and workspace watcher recovery after host HMR',
    )
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await until(
    async () =>
      (await sidebar.evaluate((el) => el.getBoundingClientRect().width)) ===
      390,
    'mobile fullscreen',
  )
  report.checks.push('390px narrow viewport')
  assert.deepEqual(errors, [])
  await page.screenshot({ path: resolve(artifacts, 'mobile.png') })
  console.log(
    JSON.stringify({ checks: report.checks, errors, artifacts }, null, 2),
  )
} finally {
  if (hostDirty) {
    await writeFile(resolve(root, 'lib/runtime.js'), originalHost)
    const now = new Date()
    await utimes(resolve(profile, 'cordis.patch.yml'), now, now)
    await until(async () => {
      try {
        return (await api('status')).runtime.hostRevision === 'sidebar-1'
      } catch {
        return false
      }
    }, 'restore host')
  }
  if (thread) await api('threads/delete', { threadId: thread }).catch(() => {})
  await writeFile(
    resolve(artifacts, 'report.json'),
    JSON.stringify(report, null, 2),
  )
  await browser.close()
}
