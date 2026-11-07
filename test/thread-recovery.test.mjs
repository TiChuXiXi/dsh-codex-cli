import test from 'node:test'
import assert from 'node:assert/strict'
import {startTurnWithResume} from '../lib/hub.js'
import {JsonRpcError} from '../lib/jsonrpc.js'
const missing=()=>new JsonRpcError(-32600,'thread not found: test-thread')
test('explicit missing thread resumes once before retrying the rejected turn',async()=>{
 const calls=[]
 const rpc={request:async(method,params)=>{calls.push({method,params});if(calls.length===1)throw missing();return method==='turn/start'?{turn:{id:'ok'}}:{}}}
 const request={threadId:'test-thread',input:[{type:'text',text:'hello'}]}
 assert.equal((await startTurnWithResume(rpc,request)).turn.id,'ok')
 assert.deepEqual(calls.map(x=>x.method),['turn/start','thread/resume','turn/start'])
 assert.equal(calls[2].params,request)
})
test('timeouts, transport failures and other server errors never retry a potentially accepted turn',async()=>{
 for(const error of [new Error('timeout'),new JsonRpcError(-32603,'connection lost'),new JsonRpcError(-32600,'permission denied')]){
  let count=0
  await assert.rejects(startTurnWithResume({request:async()=>{count++;throw error}},{threadId:'test-thread'}),cause=>cause===error)
  assert.equal(count,1)
 }
})
test('failed resume does not start the turn a second time',async()=>{
 const calls=[],error=new JsonRpcError(-32600,'resume denied')
 const rpc={request:async(method)=>{calls.push(method);throw method==='turn/start'?missing():error}}
 await assert.rejects(startTurnWithResume(rpc,{threadId:'test-thread'}),cause=>cause===error)
 assert.deepEqual(calls,['turn/start','thread/resume'])
})
