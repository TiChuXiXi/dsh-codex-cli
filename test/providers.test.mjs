import test from 'node:test'
import assert from 'node:assert/strict'
import {ProviderHub} from '../lib/provider-hub.js'
import {EventBus} from '../lib/events.js'
import {normalizeConfig} from '../lib/config.js'
import {providerOverrides,resumeProvider,GO_DEFAULT_MODEL} from '../lib/providers.js'

test('provider overrides select the Go catalog without changing the shared home',()=>{
 const x=providerOverrides('opencode-go','/shared')
 assert.equal(x.config.model_catalog_json,'/shared/model-catalogs/opencode-go.json')
 assert.equal(GO_DEFAULT_MODEL,'deepseek-v4.1-flash')
 assert.deepEqual(providerOverrides('openai','/shared'),{modelProvider:'openai'})
})
test('resume follows the saved provider and retains a nondefault Go model',async()=>{
 const rpc={request:async()=>({thread:{modelProvider:'opencode-go',model:'kimi-k3'}})}
 const x=await resumeProvider(rpc,'thread','/shared')
 assert.equal(x.modelProvider,'opencode-go');assert.equal(x.model,'kimi-k3')
})
test('provider routing keeps a Go turn on Go and forks on the destination process',async()=>{
 const hub=new ProviderHub({config:normalizeConfig({}),bus:new EventBus(),logger:{}})
 const calls=[]
 hub.primary={getThread:async()=>({thread:{modelProvider:'opencode-go'}}),forkThread:async p=>{calls.push(['fork-openai',p]);return {id:'new',modelProvider:'openai'}}}
 hub.go={status:()=>({phase:'ready'}),startTurn:async p=>{calls.push(['turn-go',p]);return {}}}
 await hub.startTurn({threadId:'old',text:'test'})
 await hub.forkThread({threadId:'old',provider:'openai'})
 assert.equal(calls[0][0],'turn-go');assert.equal(calls[1][0],'fork-openai')
 assert.equal(hub.threadProviders.get('new'),'openai')
 await assert.rejects(hub.forProvider('unknown'),/未知/)
})
test('archived sessions can be restored without first reading their inaccessible history',async()=>{
 const hub=new ProviderHub({config:normalizeConfig({}),bus:new EventBus(),logger:{}})
 hub.primary={unarchiveThread:async p=>({threadId:p.threadId,archived:false}),getThread:async()=>{throw Error('archived')}}
 assert.deepEqual(await hub.unarchiveThread({threadId:'archived'}),{threadId:'archived',archived:false})
})
test('approval ids from two processes never resolve the other process request',()=>{
 const hub=new ProviderHub({config:normalizeConfig({}),bus:new EventBus(),logger:{}})
 const calls=[]
 hub.primary={pendingApprovals:()=>[{requestId:7}],respondApproval:(id,r)=>calls.push(['openai',id,r])}
 hub.go={pendingApprovals:()=>[{requestId:7}],respondApproval:(id,r)=>calls.push(['go',id,r])}
 assert.deepEqual(hub.pendingApprovals().map(p=>p.requestId),[7,'go:7'])
 hub.respondApproval('go:7',{decision:'decline'})
 assert.deepEqual(calls,[['go','7',{decision:'decline'}]])
})
