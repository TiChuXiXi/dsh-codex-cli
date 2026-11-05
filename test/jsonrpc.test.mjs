import test from 'node:test'
import assert from 'node:assert/strict'
import { JsonRpcClient, JsonRpcError, SKIP_RESPONSE } from '../lib/jsonrpc.js'

const logger = { warn() {}, info() {}, error() {} }

test('request 发出 id/method/params，响应按 id 配对', async () => {
  const sent = []
  const client = new JsonRpcClient({ send: (message) => sent.push(message), logger })
  const promise = client.request('thread/list', { limit: 1 })
  assert.deepEqual(sent[0], { id: 1, method: 'thread/list', params: { limit: 1 } })
  client.handleMessage({ id: 1, result: { data: [] } })
  assert.deepEqual(await promise, { data: [] })
})

test('错误响应转成 JsonRpcError 并保留 code', async () => {
  const client = new JsonRpcClient({ send() {}, logger })
  const promise = client.request('thread/resume', { threadId: 'x' })
  client.handleMessage({ id: 1, error: { code: -32600, message: 'already has an active writer' } })
  await assert.rejects(promise, (error) => {
    assert.ok(error instanceof JsonRpcError)
    assert.equal(error.code, -32600)
    assert.match(error.message, /active writer/u)
    return true
  })
})

test('服务端请求被路由并回响应', async () => {
  const sent = []
  const client = new JsonRpcClient({ send: (message) => sent.push(message), logger })
  client.onServerRequest(async ({ id, method }) => ({ id, method, decision: 'accept' }))
  client.handleMessage({ id: 7, method: 'item/commandExecution/requestApproval', params: {} })
  await new Promise((resolve) => setTimeout(resolve, 0))
  assert.deepEqual(sent.at(-1), {
    id: 7,
    result: { id: 7, method: 'item/commandExecution/requestApproval', decision: 'accept' },
  })
})

test('SKIP_RESPONSE 不回响应', async () => {
  const sent = []
  const client = new JsonRpcClient({ send: (message) => sent.push(message), logger })
  client.onServerRequest(async () => SKIP_RESPONSE)
  client.handleMessage({ id: 9, method: 'item/tool/requestUserInput', params: {} })
  await new Promise((resolve) => setTimeout(resolve, 0))
  assert.equal(sent.length, 0)
})

test('超时拒绝挂起请求', async () => {
  const client = new JsonRpcClient({ send() {}, logger })
  await assert.rejects(client.request('thread/read', {}, { timeoutMs: 10 }), /超时/u)
})

test('close 让所有挂起请求立即失败', async () => {
  const client = new JsonRpcClient({ send() {}, logger })
  const first = client.request('a', {})
  const second = client.request('b', {})
  client.close('连接已断开')
  await assert.rejects(first, /连接已断开/u)
  await assert.rejects(second, /连接已断开/u)
  await assert.rejects(client.request('c', {}), /已关闭/u)
})

test('通知处理器收到 method 与 params', () => {
  const client = new JsonRpcClient({ send() {}, logger })
  const seen = []
  client.onNotification((method, params) => seen.push([method, params]))
  client.handleMessage({ method: 'thread/status/changed', params: { threadId: 't' } })
  assert.deepEqual(seen, [['thread/status/changed', { threadId: 't' }]])
})
