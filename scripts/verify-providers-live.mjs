/** Sends two short, read-only test turns, forks controlled test history, then archives its test sessions. */
import assert from 'node:assert/strict'
import {ProviderHub as CodexHub} from '../lib/provider-hub.js'
import {EventBus} from '../lib/events.js'
import {normalizeConfig} from '../lib/config.js'
const bus=new EventBus({capacity:500}),hub=new CodexHub({config:normalizeConfig({transport:'stdio'}),bus,logger:{warn:()=>{},info:()=>{},debug:()=>{}}})
const events=[];bus.subscribe(e=>events.push(e))
hub.start()
async function until(fn,ms=60000){const deadline=Date.now()+ms;while(Date.now()<deadline){const x=fn();if(x)return x;await new Promise(r=>setTimeout(r,150))}throw Error('timeout')}
const ids=[]
try{
 await until(()=>hub.status().phase==='ready')
 const models=await hub.models('opencode-go');assert(models.some(m=>m.id==='deepseek-v4.1-flash'))
 const go=await hub.newThread({cwd:'/tmp',provider:'opencode-go',approvalPolicy:'never',sandbox:'read-only'});ids.push(go.id)
 assert.equal(go.modelProvider,'opencode-go');assert.equal(go.model,'deepseek-v4.1-flash')
 await hub.openThread(go.id)
 console.log('starting default Go turn')
 await hub.startTurn({threadId:go.id,text:'This is an integration test. Do not use any tools. Reply only PROVIDER_OK.',model:'deepseek-v4.1-flash',approvalPolicy:'never',sandboxPolicy:{type:'readOnly',networkAccess:false}})
 const done=await until(()=>events.find(e=>e.type==='turn/completed'&&e.threadId===go.id),180000)
 console.log('default Go turn completed')
 assert.equal(done.payload.turn.status,'completed',JSON.stringify(done.payload.turn.error))
 await hub.closeThread(go.id);await hub.openThread(go.id)
 const detail=await hub.getThread(go.id);assert.equal(detail.thread.modelProvider,'opencode-go')
 const fork=await hub.forkThread({threadId:go.id,provider:'openai'});ids.push(fork.id)
 assert.equal(fork.modelProvider,'openai')
 const back=await hub.forkThread({threadId:fork.id,provider:'opencode-go'});ids.push(back.id)
 assert.equal(back.modelProvider,'opencode-go');assert.equal(back.model,'deepseek-v4.1-flash')
 console.log('starting inherited-history Go turn')
 await hub.startTurn({threadId:back.id,text:'Do not use tools. Reply with the exact same single token you replied with previously.',approvalPolicy:'never',sandboxPolicy:{type:'readOnly',networkAccess:false}})
 const backDone=await until(()=>events.find(e=>e.type==='turn/completed'&&e.threadId===back.id),180000)
 assert.equal(backDone.payload.turn.status,'completed')
 const backDetail=await hub.getThread(back.id)
 assert(backDetail.turns.flatMap(t=>t.items||[]).filter(i=>i.type==='agentMessage').at(-1)?.text?.includes('PROVIDER_OK'))
 const list=await hub.listThreads({provider:'opencode-go',limit:200});assert(list.data.every(t=>t.modelProvider==='opencode-go'))
 console.log(JSON.stringify({models:models.length,defaultModel:go.model,inference:done.payload.turn.status,resume:true,crossProviderFork:true,inheritedHistoryInference:true,historyFilter:true,goThread:go.id,openaiThread:fork.id,backThread:back.id}))
}catch(e){console.error(e.message);process.exitCode=1}finally{for(const id of ids)try{await hub.archiveThread({threadId:id})}catch{}await hub.stop();bus.dispose()}
