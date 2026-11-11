/** Real PTY + production UI acceptance. Conversation fixtures never call a model.
 * DSH_BASE_URL and DSH_BROWSER_STATE must identify the intended authenticated host.
 */
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

if (!process.env.DSH_BASE_URL || !process.env.DSH_BROWSER_STATE)
  throw new Error('Set DSH_BASE_URL and private DSH_BROWSER_STATE explicitly')
const imported = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const pw = imported.default || imported
const base = process.env.DSH_BASE_URL
const cwd = process.env.TERMINAL_WORKSPACE || process.cwd()
const output = resolve(process.env.TERMINAL_ARTIFACTS || '/tmp/dsh-terminal-verification')
await mkdir(output, { recursive: true })
const browser = await pw.chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
})
const context = await browser.newContext({
  storageState: process.env.DSH_BROWSER_STATE,
  viewport: { width: 1440, height: 1000 },
})
const page = await context.newPage()
page.setDefaultTimeout(10000)
const errors = []
const sessions = new Set()
page.on('response', async response => {
  if (!response.url().endsWith('/codex-cli/terminal/open')) return
  const body = await response.json().catch(() => null)
  if (body?.result?.ok && body.result.value?.sessionId) sessions.add(body.result.value.sessionId)
})
page.on('pageerror', error => errors.push(error.message))
const api = async (method, payload = {}) => {
  const response = await context.request.post(base + '/codex-cli/' + method, {
    data: { type: 'client-request', rpcId: crypto.randomUUID(), method, payload },
  })
  assert.equal(response.status(), 200)
  const { result } = await response.json()
  assert.equal(result.ok, true, result.error?.message)
  return result.value
}
const now = Math.floor(Date.now() / 1000)
const thread = { id: 'terminal-live-fixture', name: 'Terminal acceptance', cwd, model: 'gpt-6.1-sol', status: { type: 'idle' }, createdAt: now, updatedAt: now }
let loseNextRead = false
await page.route('**/codex-cli/**', async route => {
  if (route.request().method() !== 'POST') return route.continue()
  const request = route.request().postDataJSON()
  if (request.method === 'terminal/read' && loseNextRead) {
    loseNextRead = false
    await route.fetch()
    return route.abort('failed')
  }
  let value
  switch (request.method) {
    case 'projects/list': value = [{ cwd, name: 'terminal-fixture', threadCount: 1, latest: thread }]; break
    case 'threads/list': value = { data: [thread], nextCursor: null }; break
    case 'threads/get': value = { thread, turns: [], nextCursor: null }; break
    case 'threads/open': case 'threads/close': value = { ok: true }; break
    case 'threads/settings': value = { approvalPolicy: 'on-request', sandbox: { type: 'workspaceWrite' }, collaborationMode: { mode: 'default' } }; break
    default: return route.continue()
  }
  return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ type: 'server-response', rpcId: request.rpcId, result: { ok: true, value } }) })
})
await page.addInitScript(({ cwd, id }) => {
  localStorage.setItem('dsh-codex-last-thread', id)
  localStorage.setItem('dsh-codex-right-open', '1')
  localStorage.setItem('dsh-codex-theme', 'light')
  localStorage.removeItem('dsh-codex-sidebar:' + cwd)
}, { cwd, id: thread.id })
const report = { base, checks: [], errors }
const sidebar = page.locator('[data-codex-sidebar]:not([hidden])')
const active = () => sidebar.locator('.codex-terminal:visible')
async function command(text) {
  const input = active().locator('textarea.xterm-helper-textarea')
  await input.focus()
  await page.keyboard.insertText(text)
  await page.keyboard.press('Enter')
}
async function contains(pattern) {
  await page.waitForFunction(source => {
    const terminal = [...document.querySelectorAll('.codex-terminal')].find(el => el.getBoundingClientRect().width)
    return terminal && new RegExp(source).test(terminal.innerText)
  }, pattern.source, { timeout: 10000 })
}
async function newTerminal() {
  await sidebar.getByRole('button', { name: '新建标签页', exact: true }).first().click()
  await sidebar.locator('.codex-sidebar-guide').last().getByRole('button', { name: '终端', exact: false }).click()
  await active().getByRole('status').filter({ hasText: '已连接' }).waitFor()
}
try {
  const before = (await api('status')).runtime
  report.runtime = before
  assert.equal(before.activeInstances, 1)
  const initialCount = before.terminalSessionCount
  assert.ok(Number.isInteger(initialCount))
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: '继续', exact: true }).click({ timeout: 1000 }).catch(() => {})
  if (!await page.locator('.dsh-codex-root').isVisible())
    await page.getByRole('button', { name: 'Codex CLI', exact: true }).first().click()
  await newTerminal()
  await command("PS1='PTY> '; clear; cd /tmp")
  await command("printf 'CWD=%s\\n' \"$PWD\"; export TERMINAL_ACCEPTANCE=one")
  await contains(/CWD=\/tmp/)
  await command("printf 'VAR=%s\\n' \"$TERMINAL_ACCEPTANCE\"; test -t 0 && echo HAS_TTY")
  await contains(/VAR=one[\s\S]*HAS_TTY/)
  report.checks.push('persistent cwd/environment and real TTY')
  console.log('Verified persistent shell')
  await command("read -rs -p 'Password: ' secret; printf '\\nLEN=%s\\n' \"${#secret}\"")
  await contains(/Password:\s*$/)
  await page.keyboard.insertText('hidden-password')
  await page.keyboard.press('Enter')
  await contains(/LEN=15/)
  assert.ok(!(await active().innerText()).includes('hidden-password'))
  report.checks.push('interactive password input without echo')

  await command('sleep 60')
  await page.waitForTimeout(150)
  await page.keyboard.press('Control+c')
  await command('echo INTERRUPT_OK')
  await contains(/INTERRUPT_OK\s+PTY>/)
  report.checks.push('keyboard Ctrl+C interrupts foreground process')
  await command('top')
  await contains(/load average|Tasks:/)
  await page.screenshot({ path: resolve(output, 'top.png') })
  await page.keyboard.press('q')
  await contains(/PTY>\s*$/)
  await command('echo TOP_EXIT_OK')
  await contains(/TOP_EXIT_OK\s+PTY>/)
  report.checks.push('top screen rendering and keyboard exit')

  await sidebar.getByRole('button', { name: '右栏全屏', exact: true }).click()
  await command('stty size')
  await page.waitForTimeout(200)
  const sizeBefore = await active().locator('.xterm-rows').evaluate(el => ({ rows: el.children.length, cols: Math.round(el.clientWidth / 7.83) }))
  const resized = page.waitForResponse(response => response.url().endsWith('/terminal/resize') && response.status() === 200)
  await page.setViewportSize({ width: 1000, height: 800 })
  const response = await resized
  const { rows, cols } = response.request().postDataJSON().payload
  await command("printf 'PTY_SIZE=%s\\n' \"$(stty size)\"")
  await contains(new RegExp('PTY_SIZE=' + rows + ' ' + cols))
  const sizeAfter = await active().locator('.xterm-rows').evaluate(el => ({ rows: el.children.length, cols: Math.round(el.clientWidth / 7.83) }))
  assert.notDeepEqual(sizeAfter, sizeBefore)
  await page.screenshot({ path: resolve(output, 'resized.png') })
  report.checks.push('terminal resizes with pane and viewport')

  await newTerminal()
  await command("PS1='SECOND> '; clear; printf 'SECOND=%s:%s\\n' \"$PWD\" \"${TERMINAL_ACCEPTANCE-unset}\"")
  await contains(/SECOND=[\s\S]*:unset/)
  await sidebar.getByRole('tab').filter({ hasText: '终端' }).first().click()
  await command("printf 'RETAINED=%s:%s\\n' \"$PWD\" \"$TERMINAL_ACCEPTANCE\"")
  await contains(/RETAINED=\/tmp:one/)
  await sidebar.getByRole('button', { name: '退出右栏全屏', exact: true }).click()
  await page.getByRole('button', { name: '切换深色模式', exact: true }).click()
  await page.waitForTimeout(300)
  await command('echo THEME_RETAINED')
  await contains(/THEME_RETAINED\s+PTY>/)
  report.checks.push('independent shells, tab retention and theme retention')
  loseNextRead = true
  await command('echo BEFORE_NETWORK_RECOVERY')
  await active().getByRole('status').filter({ hasText: '重新连接中' }).waitFor()
  await active().getByRole('status').filter({ hasText: '已连接' }).waitFor()
  await command("printf 'RECOVERED=%s:%s\\n' \"$PWD\" \"$TERMINAL_ACCEPTANCE\"")
  await contains(/RECOVERED=\/tmp:one/)
  report.checks.push('lost output response recovers in the same shell')
  await page.setViewportSize({ width: 375, height: 812 })
  await command("printf 'MOBILE_INPUT_OK\\n'")
  await contains(/MOBILE_INPUT_OK/)
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
  await page.screenshot({ path: resolve(output, 'mobile.png') })
  await page.setViewportSize({ width: 1000, height: 800 })
  report.checks.push('375px terminal input and viewport bounds')
  await command('exit 7')
  await active().getByRole('status').filter({ hasText: '退出码 7' }).waitFor()
  await active().getByRole('button', { name: '新建 Shell', exact: true }).click()
  await active().getByRole('status').filter({ hasText: '已连接' }).waitFor()
  await command('echo RESTART_OK')
  await contains(/RESTART_OK/)
  report.checks.push('shell exit code and explicit restart')
  for (let index = 0; index < 2; index++) {
    const tab = sidebar.getByRole('tab').filter({ hasText: '终端' }).last()
    await tab.click()
    await tab.hover()
    await tab.getByRole('button', { name: '关闭标签页', exact: true }).click()
  }
  for (let tries = 0; tries < 30; tries++) {
    if ((await api('status')).runtime.terminalSessionCount === initialCount) break
    await page.waitForTimeout(100)
  }
  assert.equal((await api('status')).runtime.terminalSessionCount, initialCount)
  report.checks.push('closing tabs releases all test PTYs')
  assert.deepEqual(errors, [])
  report.clientBuild = await page.locator('.dsh-codex-root').getAttribute('data-client-build')
  report.passed = true
} catch (error) {
  report.passed = false
  report.failure = error.stack
  process.exitCode = 1
  await page.screenshot({ path: resolve(output, 'failure.png') }).catch(() => {})
} finally {
  // Unmount retained tabs so failed runs also release their shells.
  await page.getByRole('button', { name: '返回 DeepSeek Harness', exact: true }).click({ timeout: 1000 }).catch(() => {})
  for (const sessionId of sessions) await api('terminal/close', { sessionId }).catch(() => {})
  await context.close()
  await browser.close()
  await writeFile(resolve(output, 'report.json'), JSON.stringify(report, null, 2))
  console.log(JSON.stringify(report, null, 2))
}
