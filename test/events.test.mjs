import test from 'node:test'
import assert from 'node:assert/strict'
import { EventBus } from '../lib/events.js'

test('seq 自增，since 返回之后的事件', () => {
  const bus = new EventBus({ capacity: 10 })
  bus.publish('a', { n: 1 })
  bus.publish('b', { n: 2 })
  assert.equal(bus.seq, 2)
  assert.deepEqual(bus.since(0).map((event) => event.type), ['a', 'b'])
  assert.deepEqual(bus.since(1).map((event) => event.type), ['b'])
  assert.deepEqual(bus.since(2), [])
})

test('缺口超出缓冲返回 null', () => {
  const bus = new EventBus({ capacity: 2 })
  for (let index = 0; index < 5; index += 1) bus.publish('x', { index })
  assert.equal(bus.since(0), null)
  assert.equal(bus.since(100), null)
  assert.deepEqual(bus.since(4).map((event) => event.payload.index), [4])
})

test('增量按 key 合并后只发一条', async () => {
  const bus = new EventBus({ capacity: 10 })
  const seen = []
  bus.subscribe((event) => seen.push(event))
  bus.publishDelta('t:1:agentMessage', 'PO', { threadId: 't', itemId: '1', channel: 'agentMessage' })
  bus.publishDelta('t:1:agentMessage', 'NG', { threadId: 't', itemId: '1', channel: 'agentMessage' })
  await new Promise((resolve) => setTimeout(resolve, 90))
  const deltas = seen.filter((event) => event.type === 'item/delta')
  assert.equal(deltas.length, 1)
  assert.equal(deltas[0].payload.delta, 'PONG')
  assert.equal(deltas[0].channel, 'agentMessage')
})

test('不同 key 的增量各自合并', async () => {
  const bus = new EventBus({ capacity: 10 })
  const seen = []
  bus.subscribe((event) => seen.push(event))
  bus.publishDelta('a', '1', { itemId: 'a' })
  bus.publishDelta('b', '2', { itemId: 'b' })
  await new Promise((resolve) => setTimeout(resolve, 90))
  assert.equal(seen.filter((event) => event.type === 'item/delta').length, 2)
})

test('订阅者异常不影响其它订阅者', () => {
  const bus = new EventBus({ capacity: 10 })
  const seen = []
  bus.subscribe(() => {
    throw new Error('boom')
  })
  bus.subscribe((event) => seen.push(event.type))
  bus.publish('ok', null)
  assert.deepEqual(seen, ['ok'])
})

test('dispose 清空缓冲与订阅者', () => {
  const bus = new EventBus({ capacity: 10 })
  const seen = []
  bus.subscribe((event) => seen.push(event))
  bus.publish('a', null)
  bus.dispose()
  bus.publish('b', null)
  assert.equal(seen.length, 1)
})
