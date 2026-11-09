/** Verify permission warnings in the real DSH UI with delayed, controlled RPC data.
 * No prompts or permission changes are sent to the live Codex service.
 */
import assert from 'node:assert/strict'
const pw = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const base = process.env.DSH_BASE_URL || 'http://127.0.0.1:3080'
const browser = await pw.chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
})
const context = await browser.newContext({ storageState: process.env.DSH_BROWSER_STATE, viewport: { width: 1440, height: 1000 } })
const page = await context.newPage()
page.setDefaultTimeout(15000)
const errors = []
page.on('pageerror', error => errors.push(error.message))
const now = Math.floor(Date.now() / 1000), cwd = '/tmp'
const threads = ['permission-a', 'permission-b', 'permission-c'].map((id, index) => ({
  id, name: id, cwd, model: 'gpt-6.1-sol', status: { type: 'active' },
  modelProvider: 'openai', createdAt: now - 100, updatedAt: now - index,
}))
const modes = { 'permission-a': 'full', 'permission-b': 'ask', 'permission-c': 'read' }
let settingsReads = 0
await page.route('**/codex-cli/**', async route => {
  const request = route.request()
  if (request.method() !== 'POST') {
    if (request.url().includes('/events')) return route.fulfill({ status: 200, contentType: 'text/event-stream', body: ': controlled permission test\n\n' })
    return route.continue()
  }
  const message = request.postDataJSON(), id = message.payload?.threadId
  let value
  switch (message.method) {
    case 'projects/list': value = [{ cwd, name: 'permission-test', threadCount: threads.length, latest: threads[0] }]; break
    case 'threads/list': value = { data: threads, nextCursor: null }; break
    case 'threads/get': value = {
      thread: threads.find(thread => thread.id === id),
      turns: [{ id: id + '-turn', status: 'inProgress', startedAt: now, items: [{ id: id + '-user', type: 'userMessage', content: [{ type: 'text', text: 'Controlled permission test' }] }] }],
      nextCursor: null,
    }; break
    case 'threads/open': case 'threads/close': value = { ok: true }; break
    case 'threads/settings': {
      await new Promise(resolve => setTimeout(resolve, 650))
      const mode = modes[id]
      value = { approvalPolicy: mode === 'full' ? 'never' : 'on-request', approvalsReviewer: 'user', sandbox: { type: mode === 'full' ? 'dangerFullAccess' : mode === 'read' ? 'readOnly' : 'workspaceWrite' }, collaborationMode: { mode: 'default' } }
      settingsReads++
      break
    }
    case 'models/list': value = [{ id: 'gpt-6.1-sol', displayName: 'Test model', supportedReasoningEfforts: [] }]; break
    case 'approvals/pending': value = { pending: [] }; break
    case 'account/rateLimits': value = null; break
    case 'turns/start': case 'turns/steer': case 'approvals/respond': throw Error('Live mutation blocked: ' + message.method)
    default: return route.continue()
  }
  await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ type: 'server-response', rpcId: message.rpcId, result: { ok: true, value } }) })
})
await page.addInitScript(() => {
  localStorage.setItem('dsh-codex-last-thread', 'permission-a')
  localStorage.setItem('dsh-codex-provider', 'openai')
  localStorage.setItem('dsh-codex-nav-collapsed', '0')
  localStorage.setItem('dsh-codex-permission-permission-a', 'full')
  localStorage.setItem('dsh-codex-permission-permission-b', 'ask')
  localStorage.removeItem('dsh-codex-permission-permission-c')
  window.permissionFrames = []
  const sample = () => {
    if (document.querySelector('.dsh-codex-permission-pending')?.getBoundingClientRect().height) window.permissionFrames.push(performance.now())
    requestAnimationFrame(sample)
  }
  requestAnimationFrame(sample)
})
const warning = page.locator('.dsh-codex-permission-pending')
const root = page.locator('.dsh-codex-root')
const waitSettings = async before => {
  for (let count = 0; count < 150 && settingsReads <= before; count++) await page.waitForTimeout(20)
  assert.ok(settingsReads > before, 'thread settings returned')
  await page.waitForTimeout(60)
}
const switchThread = async id => {
  const before = settingsReads
  await page.locator('.dsh-codex-thread').filter({ hasText: id }).click()
  await waitSettings(before)
}
try {
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: '继续', exact: true }).click({ timeout: 800 }).catch(() => {})
  await root.waitFor({ state: 'visible', timeout: 1500 }).catch(() => page.getByRole('button', { name: 'Codex CLI', exact: true }).first().click())
  await page.locator('.dsh-codex-permission-trigger').waitFor()
  await waitSettings(0)
  assert.equal(await warning.count(), 0)
  assert.deepEqual(await page.evaluate(() => window.permissionFrames), [], 'no initial warning while settings load')
  for (const id of ['permission-b', 'permission-a', 'permission-c', 'permission-b', 'permission-a']) {
    await page.evaluate(() => { window.permissionFrames = [] })
    await switchThread(id)
    assert.deepEqual(await page.evaluate(() => window.permissionFrames), [], 'no warning frame when switching to ' + id)
  }
  await page.locator('.dsh-codex-permission-trigger').click()
  await page.locator('.dsh-codex-permission-option').nth(3).click()
  await warning.waitFor()
  assert.match(await warning.innerText(), /下一轮/)
  await switchThread('permission-b')
  assert.equal(await warning.count(), 0)
  await switchThread('permission-a')
  await warning.waitFor()
  // Simulate the next turn having applied the pending permission.
  modes['permission-a'] = 'read'
  await switchThread('permission-b')
  await page.evaluate(() => { window.permissionFrames = [] })
  await switchThread('permission-a')
  assert.equal(await warning.count(), 0)
  assert.deepEqual(await page.evaluate(() => window.permissionFrames), [], 'no flash after the changed permission has been applied')
  assert.deepEqual(errors, [])
  console.log(JSON.stringify({ passed: true, settingsDelayMs: 650, switches: 9, falseWarningFrames: 0, realPendingChangeVisible: true, pendingChangeRestored: true }))
} finally {
  await browser.close()
}
