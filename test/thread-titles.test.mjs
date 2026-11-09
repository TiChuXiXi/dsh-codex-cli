import test from 'node:test'
import assert from 'node:assert/strict'
import { setTimeout as delay } from 'node:timers/promises'
import { CodexHub } from '../lib/hub.js'
import { normalizeConfig } from '../lib/config.js'
import { ThreadTitles, parseTitle, titlePrompt } from '../lib/thread-titles.js'

async function until(predicate) {
  for (let count = 0; count < 200; count++) {
    if (predicate()) return
    await delay(5)
  }
  assert.fail('condition did not settle')
}

async function fixture(t, options = {}) {
  const calls = [], events = [], replies = [], warnings = []
  const source = { id: 'source', name: options.name ?? null, cwd: '/project', modelProvider: options.provider || 'openai' }
  let receive
  const notify = (method, params) => receive({ method, params })
  const finishHidden = (text = '{"title":"修复会话自动命名"}', status = 'completed') => {
    notify('item/agentMessage/delta', { threadId: 'hidden', itemId: 'answer', turnId: 'hidden-turn', delta: text })
    notify('item/completed', { threadId: 'hidden', turnId: 'hidden-turn', item: { id: 'answer', type: 'agentMessage', text } })
    notify('turn/completed', { threadId: 'hidden', turn: { id: 'hidden-turn', status } })
  }
  const respond = (message, result) => receive({ id: message.id, result })
  const transport = {
    onMessage(handler) { receive = handler; return () => {} },
    onClose() { return () => {} },
    close() {},
    send(message) {
      if (!message.method) { replies.push(message); return }
      if (message.id === undefined) return
      calls.push(message)
      queueMicrotask(() => {
        const { method, params } = message
        if (method === 'initialize') return respond(message, { userAgent: 'codex/0.167.0' })
        if (method === 'thread/read') return respond(message, { thread: { ...source } })
        if (method === 'config/read') {
          if (options.configFails) return receive({ id: message.id, error: { code: -32603, message: 'config unavailable' } })
          return respond(message, { config: { mcp_servers: { filesystem: {}, internal: {} } } })
        }
        if (method === 'thread/start') {
          notify('thread/started', { thread: { id: 'hidden', ephemeral: true } })
          return respond(message, { thread: { id: 'hidden', ephemeral: true }, sandbox: { type: 'readOnly' } })
        }
        if (method === 'turn/start') {
          if (params.threadId === 'hidden') {
            if (!options.hold) finishHidden(options.output, options.status)
            return respond(message, { turn: { id: 'hidden-turn', status: 'inProgress' } })
          }
          if (options.rejectUserTurn) return receive({ id: message.id, error: { code: -32600, message: 'permission denied' } })
          if (options.fast) notify('turn/completed', { threadId: 'source', turn: { id: 'user-turn', status: 'completed' } })
          return respond(message, { turn: { id: 'user-turn', status: 'inProgress' } })
        }
        if (method === 'thread/name/set') {
          const save = () => {
            source.name = params.name
            notify('thread/name/updated', { threadId: 'source', threadName: params.name })
            respond(message, {})
          }
          if (options.holdSave && params.name !== '手动名称') options.releaseSave = save
          else save()
          return
        }
        if (method === 'thread/unsubscribe') notify('thread/closed', { threadId: params.threadId })
        respond(message, {})
      })
    },
  }
  const hub = new CodexHub({
    config: normalizeConfig({ transport: 'stdio' }),
    logger: { warn: message => warnings.push(message) },
    bus: { publish: (type, payload, meta) => events.push({ type, payload, ...meta }), publishDelta: (...args) => events.push({ type: 'delta', args }) },
    openTransport: async () => ({ transport, kind: 'stdio', socketPath: null }),
  })
  t.after(() => hub.stop())
  hub.start()
  await until(() => hub.status().phase === 'ready')
  const start = () => hub.startTurn({ threadId: 'source', text: '请帮我修复新会话不会自动生成标题的问题', model: 'chosen-model' })
  const finish = (status = 'completed') => notify('turn/completed', { threadId: 'source', turn: { id: 'user-turn', status } })
  return { hub, calls, events, replies, warnings, source, notify, finishHidden, start, finish,
    serverRequest: (id, method, params) => receive({ id, method, params }),
  }
}

test('title prompt is byte bounded and parsing preserves Unicode', () => {
  const prompt = titlePrompt('😀修复标题'.repeat(500))
  assert.ok(Buffer.byteLength(prompt) <= 960)
  assert.ok(!prompt.includes('�'))
  assert.equal(parseTitle('{"title":"  “修复   标题”  "}'), '修复 标题')
  assert.equal([...parseTitle(JSON.stringify({ title: '😀'.repeat(50) }))].length, 36)
  for (const output of ['plain title', '{"title":""}', '{"title":123}', '{"title":"ok","extra":true}', 'x'.repeat(5000)]) {
    assert.equal(parseTitle(output), null)
  }
})

test('first successful turn generates and persists one hidden title, even before turn/start responds', async t => {
  const f = await fixture(t, { fast: true })
  await f.start()
  await until(() => f.source.name !== null)
  await until(() => f.calls.some(call => call.method === 'thread/unsubscribe'))
  assert.equal(f.source.name, '修复会话自动命名')
  const temporary = f.calls.find(call => call.method === 'thread/start').params
  assert.equal(temporary.ephemeral, true)
  assert.equal(temporary.model, 'chosen-model')
  assert.equal(temporary.modelProvider, 'openai')
  assert.equal(temporary.sandbox, 'read-only')
  assert.deepEqual(temporary.runtimeWorkspaceRoots, [])
  assert.deepEqual(temporary.config.mcp_servers, { filesystem: { enabled: false }, internal: { enabled: false } })
  assert.equal(temporary.config['features.shell_tool'], false)
  assert.equal(temporary.config['features.hooks'], false)
  assert.equal(temporary.config['features.apps'], false)
  assert.equal(temporary.config['features.plugins'], false)
  assert.ok(!f.events.some(event => event.threadId === 'hidden' || event.payload?.thread?.id === 'hidden' || event.type === 'delta'))
  assert.ok(f.events.some(event => event.type === 'thread/updated' && event.payload.name === f.source.name))
  await f.start()
  f.finish()
  await delay(20)
  assert.equal(f.calls.filter(call => call.method === 'thread/start').length, 1)
})

test('temporary generation preserves the original provider and catalog', async t => {
  const f = await fixture(t, { provider: 'opencode-go', fast: true })
  await f.start()
  await until(() => f.source.name !== null)
  const temporary = f.calls.find(call => call.method === 'thread/start').params
  assert.equal(temporary.modelProvider, 'opencode-go')
  assert.match(temporary.config.model_catalog_json, /opencode-go.json$/)
})

test('existing saved titles are left alone', async t => {
  const f = await fixture(t, { name: '已有标题', fast: true })
  await f.start()
  await delay(25)
  assert.equal(f.source.name, '已有标题')
  assert.ok(!f.calls.some(call => call.method === 'thread/start'))
})

test('manual rename cancels an active generation and rejects hidden approvals without showing UI', async t => {
  const f = await fixture(t, { hold: true, fast: true })
  await f.start()
  await until(() => f.calls.some(call => call.method === 'turn/start' && call.params.threadId === 'hidden'))
  f.serverRequest('hidden-approval', 'item/commandExecution/requestApproval', { threadId: 'hidden', command: 'touch /tmp/should-not-exist' })
  await until(() => f.replies.some(reply => reply.id === 'hidden-approval'))
  assert.equal(f.replies.find(reply => reply.id === 'hidden-approval').result.decision, 'decline')
  assert.deepEqual(f.hub.pendingApprovals(), [])
  assert.ok(!f.events.some(event => event.type === 'approval/requested'))
  await f.hub.renameThread({ threadId: 'source', name: '手动名称' })
  f.finishHidden()
  await until(() => f.calls.some(call => call.method === 'thread/unsubscribe'))
  assert.equal(f.source.name, '手动名称')
  assert.equal(f.calls.filter(call => call.method === 'thread/name/set').length, 1)
})

test('manual rename is ordered after an automatic save already in flight', async t => {
  const options = { fast: true, holdSave: true }
  const f = await fixture(t, options)
  await f.start()
  await until(() => options.releaseSave)
  const renamed = f.hub.renameThread({ threadId: 'source', name: '手动名称' })
  await delay(10)
  assert.equal(f.calls.filter(call => call.method === 'thread/name/set').length, 1)
  options.releaseSave()
  await renamed
  assert.equal(f.source.name, '手动名称')
})

test('a title set by another client while generating is not overwritten', async t => {
  const f = await fixture(t, { fast: true, hold: true })
  await f.start()
  await until(() => f.calls.some(call => call.method === 'turn/start' && call.params.threadId === 'hidden'))
  f.source.name = '其他客户端标题'
  f.finishHidden()
  await until(() => f.calls.some(call => call.method === 'thread/unsubscribe'))
  assert.equal(f.source.name, '其他客户端标题')
  assert.ok(!f.calls.some(call => call.method === 'thread/name/set'))
})

test('failed and interrupted user turns do not start title inference', async t => {
  const f = await fixture(t)
  await f.start()
  f.finish('failed')
  f.finish('interrupted')
  await delay(20)
  assert.ok(!f.calls.some(call => call.method === 'thread/start'))
  f.finish()
  await until(() => f.source.name !== null)
})

test('a rejected user turn does not leave a title candidate', async t => {
  const f = await fixture(t, { rejectUserTurn: true })
  await assert.rejects(f.start(), /permission denied/)
  f.finish()
  await delay(20)
  assert.ok(!f.calls.some(call => call.method === 'thread/start'))
})

test('invalid output, inference failure and config errors leave preview intact and clean up', async t => {
  for (const options of [{ output: 'not JSON' }, { status: 'failed' }, { configFails: true }]) {
    await t.test(JSON.stringify(options), async t => {
      const f = await fixture(t, { ...options, fast: true })
      await f.start()
      await until(() => f.warnings.length > 0)
      assert.equal(f.source.name, null)
      assert.ok(!f.calls.some(call => call.method === 'thread/name/set'))
      if (!options.configFails) await until(() => f.calls.some(call => call.method === 'thread/unsubscribe'))
    })
  }
})

test('disconnect and deletion cancel pending title generation', async t => {
  for (const action of ['stop', 'delete']) {
    await t.test(action, async t => {
      const f = await fixture(t, { fast: true, hold: true })
      await f.start()
      await until(() => f.calls.some(call => call.method === 'turn/start' && call.params.threadId === 'hidden'))
      if (action === 'stop') await f.hub.stop()
      else await f.hub.deleteThread({ threadId: 'source' })
      f.finishHidden()
      await delay(20)
      assert.ok(!f.calls.some(call => call.method === 'thread/name/set'))
    })
  }
})

test('a stalled generation times out, interrupts and detaches its temporary thread', async () => {
  const calls = []
  let titles
  const rpc = { async request(method) {
    calls.push(method)
    if (method === 'thread/read') return { thread: { id: 'source', cwd: '/project' } }
    if (method === 'config/read') return { config: {} }
    if (method === 'thread/start') return { thread: { id: 'hidden' }, sandbox: { type: 'readOnly' } }
    if (method === 'turn/start') return { turn: { id: 'hidden-turn' } }
    return {}
  } }
  titles = new ThreadTitles({ rpc, codexHome: '/tmp', timeoutMs: 25, onTitle: () => assert.fail('must not rename') })
  titles.track('source', { text: '修复标题' })
  titles.notification('turn/completed', { threadId: 'source', turn: { status: 'completed' } })
  await until(() => calls.includes('thread/unsubscribe'))
  assert.ok(calls.includes('turn/interrupt'))
  titles.dispose()
})
