/** Controlled acceptance on the real DSH shell. All Codex RPCs are mocked; no model is called. */
import assert from 'node:assert/strict'
import { readFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
const pwModule = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const pw = pwModule.default ?? pwModule
const base = process.env.DSH_BASE_URL || 'http://127.0.0.1:3080'
const output = process.env.UI_REVIEW_DIR || '/tmp/dsh-questions-review'
const browser = await pw.chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) })
const context = await browser.newContext({ storageState: process.env.DSH_BROWSER_STATE, viewport: { width: 1440, height: 1000 } })
const page = await context.newPage()
page.setDefaultTimeout(12000)
const errors = [], calls = [], reads = []
page.on('pageerror', error => errors.push(error.message))
const now = Math.floor(Date.now() / 1000)
const threads = ['questions-a', 'questions-b'].map(id => ({ id, name: id, cwd: '/tmp', model: 'gpt-6.1-sol', modelProvider: 'openai', status: { type: 'active' }, createdAt: now, updatedAt: now }))
const options = [{ label: '方案 A（推荐）', description: '保留兼容性，适合现有用户。' }, { label: '方案 B', description: '采用新的布局。' }]
let pending = [{ requestId: 7, method: 'item/tool/requestUserInput', params: { threadId: threads[0].id, turnId: 'turn-a', itemId: 'sync', questions: [
  { id: 'layout', header: '布局', question: '选择哪种布局？', options, isOther: false },
  { id: 'notes', header: '补充', question: '还有哪些要求？', options: null },
  { id: 'secret', header: '私密', question: '输入测试口令', options: null, isSecret: true },
] }, createdAt: Date.now() }]
const turns = new Map(threads.map(thread => [thread.id, [{ id: thread.id === 'questions-a' ? 'turn-a' : 'turn-b', status: 'inProgress', items: [{ id: 'user', type: 'userMessage', content: [{ type: 'text', text: '受控提问测试' }] }] }]]))
let failResponse = true
let seq = 0, bundleLoaded = false
await page.addInitScript(() => {
  const Original = window.EventSource
  window.__questionSources = []
  window.EventSource = class {
    constructor(url, options) {
      if (!String(url).includes('codex-cli/events')) return new Original(url, options)
      window.__questionSources.push(this)
      this.closed = false
      setTimeout(() => { if (!this.closed) this.onopen?.({}) }, 20)
    }
    close() { this.closed = true }
  }
  localStorage.setItem('dsh-codex-last-thread', 'questions-a')
  localStorage.setItem('dsh-codex-provider', 'openai')
  localStorage.setItem('dsh-codex-right-open', '0')
  localStorage.setItem('dsh-codex-nav-collapsed', '0')
  localStorage.setItem('dsh-codex-theme', 'light')
})
const bundle = await readFile(new URL('../client.js', import.meta.url), 'utf8')
await page.route('**/plugins/**', async route => {
  // Freeze asset HMR so parallel workspace builds cannot replace this controlled test bundle.
  if (new URL(route.request().url()).pathname.endsWith('/events')) return route.fulfill({ status: 200, contentType: 'text/event-stream', body: ': fixed test bundle\n\n' })
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
  if (request.method() !== 'POST') return route.fulfill({ status: 200, contentType: 'text/event-stream', body: ': controlled questions\n\n' })
  const message = request.postDataJSON(), payload = message.payload || {}
  reads.push(message.method)
  let value
  try {
    switch (message.method) {
      case 'projects/list': value = [{ cwd: '/tmp', name: 'question-test', threadCount: 2, latest: threads[0] }]; break
      case 'threads/list': value = { data: threads, nextCursor: null }; break
      case 'threads/get': value = { thread: threads.find(thread => thread.id === payload.threadId), turns: turns.get(payload.threadId), nextCursor: null }; break
      case 'threads/settings': value = { approvalPolicy: 'on-request', approvalsReviewer: 'user', sandbox: { type: 'workspaceWrite' }, collaborationMode: { mode: 'default' } }; break
      case 'followups/list': value = { instanceId: 'fixture', threadId: payload.threadId, revision: calls.length, paused: false, entries: [] }; break
      case 'status': value = { phase: 'ready' }; break
      case 'models/list': value = [{ id: 'gpt-6.1-sol', displayName: 'Test model' }]; break
      case 'approvals/pending': value = { pending }; break
      case 'account/rateLimits': value = null; break
      case 'approvals/respond':
        calls.push({ method: message.method, ...payload })
        await new Promise(resolve => setTimeout(resolve, 250))
        if (failResponse) { failResponse = false; throw Error('受控失败，请重试') }
        pending = pending.filter(entry => entry.requestId !== payload.requestId)
        value = { resolved: true }; break
      case 'turns/steer': case 'turns/submit':
        calls.push({ method: message.method, ...payload })
        turns.get(payload.threadId).at(-1).items.push({ id: 'reply-' + calls.length, type: 'userMessage', content: [{ type: 'text', text: payload.text }] })
        value = { instanceId: 'fixture', threadId: payload.threadId, revision: calls.length, paused: false, entries: [] }; break
      case 'turns/start': throw Error('Unexpected real turn start')
      default: value = {}
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ type: 'server-response', rpcId: message.rpcId, result: { ok: true, value } }) })
  } catch (error) {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ type: 'server-response', rpcId: message.rpcId, result: { ok: false, error: { code: 'fixture', message: error.message, details: {} } } }) })
  }
})
async function emit(type, payload, threadId = 'questions-a', turnId = 'turn-a') {
  await page.evaluate(event => {
    for (const source of window.__questionSources) if (!source.closed) source.onmessage?.({ data: JSON.stringify(event) })
  }, { seq: ++seq, type, payload, threadId, turnId, at: Date.now() })
}
async function open() {
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: '继续', exact: true }).click({ timeout: 700 }).catch(() => {})
  // Let the host finish restoring its workspace before opening the plugin slot.
  await page.waitForTimeout(1500)
  if (!await page.locator('.dsh-codex-root').isVisible()) await page.getByRole('button', { name: 'Codex CLI', exact: true }).first().click()
  await page.locator('.dsh-codex-composer-input').waitFor()
}
const card = page.locator('.dsh-codex-approvals')
const next = () => card.getByRole('button', { name: '下一题', exact: true }).click()
const submit = () => card.getByRole('button', { name: '提交', exact: true }).click()
async function askAsync(id, status = 'inProgress') {
  const turn = turns.get('questions-a')[0]
  turn.status = status
  const item = { id, type: 'agentMessage', text: '', questions: [{ title: '选择发布方式？', options: ['保留兼容性（推荐）', '直接迁移'] }, { title: '补充要求？', options: null }] }
  turn.items.push(item)
  await emit('turn/' + (status === 'inProgress' ? 'started' : 'completed'), { turn })
  await emit('item/upsert', { item, completed: true })
}
try {
  await open()
  await card.getByText('选择哪种布局？', { exact: true }).waitFor()
  assert.equal(await card.getByRole('button', { name: '下一题', exact: true }).isDisabled(), true)
  assert.equal(await card.getByRole('radio', { checked: true }).count(), 0)
  await card.getByText(options[0].description, { exact: true }).waitFor()
  await card.getByRole('radio', { name: /方案 A/ }).check()
  await next()
  await card.getByRole('textbox').fill('  保留草稿\n支持移动端  ')
  await card.getByRole('button', { name: '上一题', exact: true }).click()
  assert.equal(await card.getByRole('radio', { name: /方案 A/ }).isChecked(), true)
  await card.getByRole('radio', { name: '其他，自由填写', exact: true }).check()
  await card.getByRole('textbox').fill('自定义布局')
  await next()
  assert.equal(await card.getByRole('textbox').inputValue(), '  保留草稿\n支持移动端  ')
  await next()
  const secret = card.locator('input[type=password]')
  await secret.fill('  test-secret  ')
  await page.locator('.dsh-codex-composer-input').fill('保留这个草稿')
  await mkdir(output, { recursive: true })
  await page.screenshot({ path: resolve(output, 'questions-secret.png') })
  await submit()
  await card.getByRole('alert').waitFor()
  assert.match(await card.getByRole('alert').innerText(), /受控失败/)
  assert.equal(await secret.inputValue(), '  test-secret  ')
  assert.equal(calls.length, 1)
  await submit()
  await card.waitFor({ state: 'detached' })
  assert.deepEqual(calls[1].response, { answers: { layout: { answers: ['自定义布局'] }, notes: { answers: ['保留草稿\n支持移动端'] }, secret: { answers: ['  test-secret  '] } } })
  assert.equal(await page.locator('.dsh-codex-composer-input').inputValue(), '保留这个草稿')
  pending = [{ requestId: 8, method: 'item/tool/requestUserInput', params: { threadId: 'questions-a', turnId: 'turn-a', questions: [{ id: 'stale', question: '过期待处理请求', options }] } }]
  await emit('approval/requested', pending[0])
  await card.getByText('过期待处理请求').waitFor()
  await page.locator('.dsh-codex-thread').filter({ hasText: 'questions-b' }).click()
  await card.waitFor({ state: 'detached' })
  await page.locator('.dsh-codex-thread').filter({ hasText: 'questions-a' }).click()
  await card.getByText('过期待处理请求').waitFor()
  pending = []
  await emit('approval/resolved', { requestId: 8, reason: 'resolved-elsewhere' })
  await card.waitFor({ state: 'detached' })
  assert.equal(calls.length, 2)
  await askAsync('async-active')
  let form = page.locator('.dsh-codex-agent-questions').last()
  await form.getByRole('radio', { name: '保留兼容性（推荐）', exact: true }).waitFor()
  assert.equal(await form.getByRole('radio', { name: '保留兼容性（推荐）', exact: true }).isChecked(), true)
  await page.screenshot({ path: resolve(output, 'questions-desktop.png') })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({ path: resolve(output, 'questions-mobile-light.png') })
  assert.equal(await form.evaluate(element => element.scrollWidth > element.clientWidth), false)
  await page.getByRole('button', { name: '切换深色模式', exact: true }).click()
  await page.waitForTimeout(700)
  await page.screenshot({ path: resolve(output, 'questions-mobile-dark.png') })
  await form.getByRole('button', { name: '下一题', exact: true }).click()
  await form.getByRole('textbox').fill('异步回答')
  await form.getByRole('button', { name: '提交', exact: true }).click()
  await form.getByText('此提问已结束', { exact: true }).waitFor()
  assert.equal(calls.at(-1).method, 'turns/steer')
  assert.equal(calls.at(-1).turnId, 'turn-a')
  assert.equal(calls.at(-1).text, '选择发布方式？\n保留兼容性（推荐）\n\n补充要求？\n异步回答')
  await page.setViewportSize({ width: 1440, height: 1000 })
  await open()
  assert.equal(await page.locator('.dsh-codex-agent-questions form').count(), 0)
  await askAsync('async-idle', 'completed')
  form = page.locator('.dsh-codex-agent-questions').last()
  await form.getByRole('radio', { name: '其他，自由填写', exact: true }).check()
  await form.getByRole('textbox').fill('渐进发布')
  await form.getByRole('button', { name: '下一题', exact: true }).click()
  await form.getByRole('textbox').fill('空闲回合回答')
  await form.getByRole('button', { name: '提交', exact: true }).click()
  await form.getByText('此提问已结束', { exact: true }).waitFor()
  assert.equal(calls.at(-1).method, 'turns/submit')
  assert.equal(calls.at(-1).threadId, 'questions-a')
  assert.match(calls.at(-1).text, /渐进发布/)
  assert.equal(await page.locator('.dsh-codex-composer-input').inputValue(), '保留这个草稿')
  assert.deepEqual(errors, [])
  assert.equal(bundleLoaded, true)
  console.log(JSON.stringify({ passed: true, clientBuild: await page.locator('.dsh-codex-root').getAttribute('data-client-build'), checks: ['blocking payload', 'options and descriptions', 'no implicit blocking answer', 'multi-question navigation', 'freeform with isOther=false', 'secret whitespace preserved', 'failed submission retry', 'composer draft preserved', 'thread scoping', 'resolution event', 'async SSE message', 'async first option default', 'async immediate steer', 'async idle submit', 'history closes answered form', 'mobile and dark theme'], screenshots: output }))
} catch (error) {
  console.error(JSON.stringify({ url: page.url(), title: await page.title(), root: await page.locator('.dsh-codex-root').allTextContents(), bundleLoaded, reads, errors }))
  throw error
} finally {
  await page.unrouteAll({ behavior: 'ignoreErrors' })
  await context.close()
  await browser.close()
}
