import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ProviderHub } from '../lib/provider-hub.js'

test('Go quota maps all usage windows and authenticates without exposing the key', async () => {
  const oldFetch = globalThis.fetch
  const oldKey = process.env.OPENCODE_API_KEY
  process.env.OPENCODE_API_KEY = 'test-key'
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://opencode.ai/zen/go/v1/usage')
    assert.equal(options.headers.Authorization, 'Bearer test-key')
    return {ok:true, json:async()=>({usage:{rolling:{percent:5,resetsAt:'2026-11-07T08:56:45Z'},weekly:{percent:66},monthly:{percent:76}}})}
  }
  try {
    const hub = new ProviderHub({config:{},logger:{},bus:{}})
    const quota = await hub.rateLimits('opencode-go')
    assert.equal(quota.primary.usedPercent, 5)
    assert.equal(quota.secondary.usedPercent, 66)
    assert.equal(quota.monthly.usedPercent, 76)
    assert.equal(JSON.stringify(quota).includes('test-key'), false)
  } finally {
    globalThis.fetch = oldFetch
    if (oldKey === undefined) delete process.env.OPENCODE_API_KEY
    else process.env.OPENCODE_API_KEY = oldKey
  }
})
