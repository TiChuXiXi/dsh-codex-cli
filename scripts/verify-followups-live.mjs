/** Controlled browser acceptance. All Codex RPCs and events use a mock hub; no model is called. */
import assert from 'node:assert/strict'
import { readFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { FollowupQueue } from '../lib/followups.js'
import { EventBus } from '../lib/events.js'

const pwModule = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const pw = pwModule.default ?? pwModule
const base = process.env.DSH_BASE_URL || 'http://127.0.0.1:3080'
const output = process.env.UI_REVIEW_DIR || '/tmp/dsh-followups-review'
const bus = new EventBus()
const calls = []
const now = Math.floor(Date.now() / 1000)
const threads = ['queue-a', 'queue-b'].map(id => ({ id, name: id, cwd: '/tmp', model: 'gpt-6.1-sol', modelProvider: 'openai', status: { type: id === 'queue-a' ? 'active' : 'idle' }, createdAt: now, updatedAt: now }))
const turns = new Map([['queue-a', [{ id: 'initial', status: 'inProgress', items: [] }]], ['queue-b', []]])
const active = id => turns.get(id)?.at(-1)?.status === 'inProgress' ? turns.get(id).at(-1) : null
const thread = id => ({ ...threads.find(thread => thread.id === id), status: { type: active(id) ? 'active' : 'idle' } })
const hub = {
  async openThread() {},
  async closeThread() {},
  async getThread(id) { return { thread: thread(id), turns: turns.get(id), nextCursor: null } },
  async startTurn(params) {
    calls.push({ type: 'start', ...params })
    const turn = { id: 'started-' + calls.length, status: 'inProgress', items: [] }
    turns.get(params.threadId).push(turn)
    bus.publish('turn/started', { turn }, { threadId: params.threadId, turnId: turn.id })
    return { turn }
  },
  async steerTurn(params) { calls.push({ type: 'steer', ...params }) },
}
const queue = new FollowupQueue({ hub, bus })
const browser = await pw.chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) })
const context = await browser.newContext({ storageState: process.env.DSH_BROWSER_STATE, viewport: { width: 1440, height: 1000 } })
const page = await context.newPage()
page.setDefaultTimeout(12000)
const errors = []
page.on('pageerror', error => errors.push(error.message))
let delivery = Promise.resolve()
bus.subscribe(event => {
  delivery = delivery.then(() => page.evaluate(event => {
    for (const source of window.__queueSources || []) if (!source.closed) source.onmessage?.({ data: JSON.stringify(event) })
  }, event)).catch(error => { if (!page.isClosed()) errors.push(error.message) })
})
await page.addInitScript(() => {
  const Original = window.EventSource
  window.__queueSources = []
  window.EventSource = class {
    constructor(url, options) {
      if (!String(url).includes('codex-cli/events')) return new Original(url, options)
      this.closed = false
      window.__queueSources.push(this)
      setTimeout(() => { if (!this.closed) this.onopen?.({}) }, 20)
    }
    close() { this.closed = true }
  }
  localStorage.setItem('dsh-codex-last-thread', 'queue-a')
  localStorage.setItem('dsh-codex-provider', 'openai')
  localStorage.setItem('dsh-codex-right-open', '0')
  localStorage.setItem('dsh-codex-theme', 'light')
})
// Serve the current generated bundle even when the host still has an older asset cached.
const bundle = await readFile(new URL('../client.js', import.meta.url), 'utf8')
let bundleLoaded = false
await page.route('**/plugins/**', async route => {
  if (new URL(route.request().url()).pathname.endsWith('/events')) return route.continue()
  const response = await route.fetch()
  const text = await response.text()
  if (text.includes("id: 'dsh-codex-cli'")) {
    bundleLoaded = true
    return route.fulfill({ response, body: bundle })
  }
  return route.fulfill({ response })
})
await page.route('**/codex-cli/**', async route => {
  const request = route.request()
  if (request.method() !== 'POST') return route.fulfill({ status: 200, contentType: 'text/event-stream', body: ': controlled queue test\n\n' })
  const message = request.postDataJSON(), payload = message.payload || {}
  let value
  try {
    switch (message.method) {
      case 'projects/list': value = [{ cwd: '/tmp', name: 'queue-test', threadCount: 2, latest: threads[0] }]; break
      case 'threads/list': value = { data: threads.map(item => thread(item.id)), nextCursor: null }; break
      case 'threads/get': value = await hub.getThread(payload.threadId); break
      case 'threads/settings': value = { approvalPolicy: 'on-request', approvalsReviewer: 'user', sandbox: { type: 'workspaceWrite' }, collaborationMode: { mode: 'default' } }; break
      case 'models/list': value = [{ id: 'gpt-6.1-sol', displayName: 'Test model' }]; break
      case 'approvals/pending': value = { pending: [] }; break
      case 'account/rateLimits': value = null; break
      case 'turns/submit': value = await queue.enqueue(payload); break
      case 'followups/list': value = queue.list(payload.threadId); break
      case 'followups/action': value = await queue.action(payload); break
      case 'upload/save': value = { path: '/tmp/queue-fixture.png', name: payload.name }; break
      case 'turns/start': case 'turns/steer': throw Error('Unexpected direct send')
      default: value = {}
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ type: 'server-response', rpcId: message.rpcId, result: { ok: true, value } }) })
  } catch (error) {
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ type: 'server-response', rpcId: message.rpcId, result: { ok: false, error: { code: error.code || 'fixture-error', message: error.message } } }) })
  }
})
const rows = page.locator('.dsh-codex-followup-row')
const area = page.locator('.dsh-codex-composer-input')
async function open() {
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: '继续', exact: true }).click({ timeout: 1000 }).catch(() => {})
  await page.locator('.dsh-codex-root').waitFor({ state: 'visible', timeout: 3000 }).catch(async () => {
    await page.getByRole('button', { name: 'Codex CLI', exact: true }).first().click()
  })
  await area.waitFor()
}
async function waitRows(count) { await page.waitForFunction(count => document.querySelectorAll('.dsh-codex-followup-row').length === count, count) }
async function send(text) {
  await area.fill(text)
  await area.press('Enter')
  await page.waitForFunction(() => document.querySelector('.dsh-codex-composer-input')?.value === '')
}
async function complete(id = 'queue-a') {
  const turn = active(id)
  turn.status = 'completed'
  bus.publish('turn/completed', { turn }, { threadId: id, turnId: turn.id })
  await delivery
}
try {
  await open()
  await send('第一条：检查代码')
  await send('第二条：补充测试')
  await send('第三条：整理结果')
  await waitRows(3)
  assert.equal(calls.length, 0)
  await area.fill('尚未发送的草稿')
  await rows.first().getByRole('button', { name: '编辑待发送消息', exact: true }).click()
  await rows.first().getByRole('textbox').fill('第一条：检查边界条件')
  await rows.first().getByRole('button', { name: '保存并入队', exact: true }).click()
  await page.waitForFunction(() => document.querySelector('.dsh-codex-followup-text')?.textContent.includes('检查边界条件'))
  assert.equal(await area.inputValue(), '尚未发送的草稿')
  await rows.nth(1).getByRole('button', { name: '删除待发送消息', exact: true }).click()
  await waitRows(2)
  await rows.nth(1).getByRole('button', { name: '引导', exact: true }).click()
  await waitRows(1)
  assert.equal(calls[0].type, 'steer')
  assert.equal(calls[0].turnId, 'initial')
  assert.equal(calls[0].text, '第三条：整理结果')
  await send('最后一条：总结')
  await waitRows(2)
  await page.locator('.dsh-codex-thread').filter({ hasText: 'queue-b' }).click()
  await waitRows(0)
  await page.locator('.dsh-codex-thread').filter({ hasText: 'queue-a' }).click()
  await waitRows(2)
  await open()
  await waitRows(2)
  const assertAboveComposer = async () => {
    const queueBox = await page.locator('.dsh-codex-followups').boundingBox()
    const composerBox = await page.locator('.dsh-codex-composer-card').boundingBox()
    assert.ok(queueBox.y + queueBox.height <= composerBox.y + 2, 'queue is above the composer')
    assert.ok(queueBox.x >= composerBox.x - 1 && queueBox.x + queueBox.width <= composerBox.x + composerBox.width + 1, 'queue aligns with composer width')
  }
  await assertAboveComposer()
  await mkdir(output, { recursive: true })
  await page.screenshot({ path: resolve(output, 'queue-desktop.png') })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(300)
  await assertAboveComposer()
  await page.screenshot({ path: resolve(output, 'queue-mobile.png') })
  const overflow = await page.locator('.dsh-codex-followups').evaluate(element => element.scrollWidth > element.clientWidth)
  assert.equal(overflow, false)
  await page.getByRole('button', { name: '切换深色模式', exact: true }).click()
  await page.waitForTimeout(400)
  assert.equal(await page.locator('.dsh-codex-root').getAttribute('data-codex-theme'), 'dark')
  await page.screenshot({ path: resolve(output, 'queue-mobile-theme.png') })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await complete()
  await waitRows(1)
  assert.equal(calls.filter(call => call.type === 'start').length, 1)
  assert.equal(calls.at(-1).text, '第一条：检查边界条件')
  await complete()
  await waitRows(0)
  assert.equal(calls.filter(call => call.type === 'start').length, 2)
  assert.equal(calls.at(-1).text, '最后一条：总结')
  for (let index = 0; index < 12; index++) await send('后续任务 ' + (index + 1))
  await waitRows(12)
  const queueSection = page.locator('.dsh-codex-followups')
  const expandedHeight = (await queueSection.boundingBox()).height
  assert.ok((await page.locator('.dsh-codex-followup-list').boundingBox()).height <= 240)
  await page.getByRole('button', { name: '收起待发送队列', exact: true }).click()
  assert.equal(await rows.first().isVisible(), false)
  assert.ok((await queueSection.boundingBox()).height < expandedHeight / 2)
  assert.ok((await queueSection.textContent()).includes('12'))
  await page.screenshot({ path: resolve(output, 'queue-collapsed.png') })
  await open()
  assert.equal(await page.getByRole('button', { name: '展开待发送队列', exact: true }).getAttribute('aria-expanded'), 'false')
  assert.equal(await rows.first().isVisible(), false)
  const starts = calls.filter(call => call.type === 'start').length
  await complete()
  await page.waitForFunction(() => document.querySelectorAll('.dsh-codex-followup-row').length === 11)
  assert.equal(calls.filter(call => call.type === 'start').length, starts + 1)
  assert.equal(await rows.first().isVisible(), false)
  await page.getByRole('button', { name: '展开待发送队列', exact: true }).click()
  assert.equal(await rows.first().isVisible(), true)
  assert.deepEqual(errors, [])
  assert.equal(bundleLoaded, true)
  console.log(JSON.stringify({ passed: true, checks: ['queue by default', 'edit keeps draft', 'delete', 'steer', 'thread switch', 'refresh', 'FIFO per completed turn', 'above composer on desktop and mobile', 'mobile overflow', 'dark theme', 'collapse many messages', 'collapse survives refresh', 'dispatch while collapsed'], screenshots: output }))
} finally {
  queue.dispose()
  bus.dispose()
  await page.unrouteAll({ behavior: 'ignoreErrors' })
  await context.close()
  await browser.close()
}
