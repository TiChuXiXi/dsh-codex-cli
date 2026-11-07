import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer, get } from 'node:http'
import { once } from 'node:events'
import { createRoutes } from '../lib/routes.js'
import { EventBus } from '../lib/events.js'
test('disposing plugin routes ends existing SSE responses so clients can reconnect', async () => {
  const bus = new EventBus({ capacity: 100 })
  const handler = createRoutes({
    hub: { status: () => ({ phase: 'ready' }) },
    bus,
    connection: { requestRejection: () => undefined },
    config: { maxBodyBytes: 1024 },
    logger: console,
  })
  const server = createServer(handler)
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  let response
  try {
    const received = new Promise((resolve, reject) => {
      const request = get(
        'http://127.0.0.1:' + server.address().port + '/codex-cli/events',
        (res) => {
          response = res
          res.once('data', () => resolve(res))
        },
      )
      request.once('error', reject)
    })
    const res = await received
    assert.equal(res.statusCode, 200)
    const ended = once(res, 'end')
    res.resume()
    handler.dispose()
    await ended
    assert.equal(res.complete, true)
    handler.dispose()
  } finally {
    response?.destroy()
    handler.dispose()
    bus.dispose()
    await new Promise((resolve) => server.close(resolve))
  }
})

test('Git RPC shares the trust fence, forwards cancellation and preserves typed failures',async t=>{
 let rejection=403,calls=0
 const handler=createRoutes({hub:{},bus:{},connection:{requestRejection:()=>rejection},config:{maxBodyBytes:4096},git:{
  async call(endpoint,payload,signal){
   calls++;assert.ok(signal instanceof AbortSignal);assert.equal(payload.cwd,'/tmp/fixture')
   if(endpoint==='fail')throw Object.assign(new Error('fixture failure'),{code:'git-vcs/conflict',details:{fixture:true}})
   return {endpoint}
  },
 }})
 const server=createServer(handler);server.listen(0,'127.0.0.1');await once(server,'listening')
 t.after(async()=>{handler.dispose();await new Promise(resolve=>server.close(resolve))})
 const url='http://127.0.0.1:'+server.address().port+'/codex-cli/git/'
 const request=endpoint=>fetch(url+endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({type:'client-request',rpcId:'test',method:'git/'+endpoint,payload:{cwd:'/tmp/fixture'}})})
 assert.equal((await request('repo/snapshot')).status,403);assert.equal(calls,0)
 rejection=undefined
 const response=await (await request('repo/snapshot')).json()
 assert.deepEqual(response.result,{ok:true,value:{endpoint:'repo/snapshot'}})
 const failure=await (await request('fail')).json()
 assert.deepEqual(failure.result,{ok:false,error:{code:'git-vcs/conflict',message:'fixture failure',details:{fixture:true}}})
})
