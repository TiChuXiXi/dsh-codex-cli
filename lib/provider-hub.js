import { CodexHub } from './hub.js'
import { EventBus } from './events.js'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { resolveCodexHome } from './transport/index.js'

/** Route each durable thread to its provider process; both processes share CODEX_HOME. */
export class ProviderHub {
  constructor({config,logger,bus}) {
    this.config=config; this.logger=logger; this.bus=bus
    this.primary=new CodexHub({config,logger,bus})
    this.go=null; this.goBus=null; this.threadProviders=new Map(); this.stopped=false
  }
  start(){this.stopped=false;this.primary.start()}
  async stop(){this.stopped=true;await Promise.all([this.primary.stop(),this.go?.stop()]);this.goBus?.dispose();this.go=null}
  status(){
    const primary = this.primary.status()
    const go = this.go?.status()
    return { ...primary, pendingApprovals: this.pendingApprovals().length,
      subscriptions: [...(primary.subscriptions || []), ...(go?.subscriptions || [])],
      providers: { openai: primary.phase, 'opencode-go': go?.phase || 'idle' },
    }
  }
  async forProvider(provider='openai'){
    if(provider==='openai')return this.primary
    if(provider!=='opencode-go')throw new Error('未知提供商')
    if(this.stopped)throw new Error('插件已停止')
    if(!this.go){
      this.goBus=new EventBus({capacity:this.config.eventBufferSize})
      this.goBus.subscribe(e=>{
        if(e.type==='connection')return
        const payload={...e.payload}
        if(e.type.startsWith('approval/')&&payload.requestId!=null)payload.requestId='go:'+payload.requestId
        if(payload.thread?.id)this.threadProviders.set(payload.thread.id,'opencode-go')
        this.bus.publish(e.type,payload,{threadId:e.threadId,turnId:e.turnId,itemId:e.itemId,channel:e.channel,summaryIndex:e.summaryIndex,contentIndex:e.contentIndex})
      })
      this.go=new CodexHub({config:{...this.config,transport:'stdio',providerProfile:'opencode-go'},logger:this.logger,bus:this.goBus})
      this.go.start()
    }
    const deadline=Date.now()+30000
    while(this.go&&this.go.status().phase!=='ready'&&Date.now()<deadline&&!this.stopped)await new Promise(r=>setTimeout(r,100))
    if(!this.go||this.go.status().phase!=='ready')throw new Error('OpenCode Go 连接尚未就绪')
    return this.go
  }
  async forThread(id){
    let provider=this.threadProviders.get(id)
    if(!provider){
      const detail=await this.primary.getThread(id,{limit:1})
      provider=detail.thread?.modelProvider||'openai'
      this.threadProviders.set(id,provider)
    }
    return this.forProvider(provider)
  }
  async skills(params={}){return (await (params.threadId?this.forThread(params.threadId):this.forProvider(params.provider))).skills(params)}
  async models(provider){return (await this.forProvider(provider)).models(provider)}
  async listThreads(params={}){return (await this.forProvider(params.provider)).listThreads(params)}
  async projects(params={}){return (await this.forProvider(params.provider)).projects(params)}
  async newThread(params={}){
    const thread=await (await this.forProvider(params.provider)).newThread(params)
    if(thread?.id)this.threadProviders.set(thread.id,thread.modelProvider)
    return thread
  }
  async forkThread(params={}){
    await this.forThread(params.threadId)
    const provider=params.provider||this.threadProviders.get(params.threadId)
    const thread=await (await this.forProvider(provider)).forkThread({...params,provider})
    if(thread?.id)this.threadProviders.set(thread.id,thread.modelProvider)
    return thread
  }
  async getThread(id,params){return (await this.forThread(id)).getThread(id,params)}
  async openThread(id){return (await this.forThread(id)).openThread(id)}
  async closeThread(id){return (await this.forThread(id)).closeThread(id)}
  async getThreadSettings(id){return (await this.forThread(id)).getThreadSettings(id)}
  async compactThread(id){return (await this.forThread(id)).compactThread(id)}
  pendingApprovals(){return [...this.primary.pendingApprovals(),...(this.go?.pendingApprovals()||[]).map(p=>({...p,requestId:'go:'+p.requestId}))]}
  respondApproval(id,response){return String(id).startsWith('go:')?this.go?.respondApproval(String(id).slice(3),response):this.primary.respondApproval(id,response)}
  unarchiveThread(params){return this.primary.unarchiveThread(params)}
  deleteThread(params){return this.primary.deleteThread(params)}
  async rateLimits(provider = 'openai'){
    if(provider !== 'opencode-go') return this.primary.rateLimits()
    const key = (process.env.OPENCODE_API_KEY || await readFile(join(resolveCodexHome(this.config), 'credentials', 'opencode-go-api-key'), 'utf8')).trim()
    const response = await fetch('https://opencode.ai/zen/go/v1/usage', {headers:{Authorization:`Bearer ${key}`}, signal:AbortSignal.timeout(10000)})
    if(!response.ok) throw new Error(`OpenCode Go 额度获取失败 (HTTP ${response.status})`)
    const data = await response.json()
    const window = (value, minutes) => typeof value?.percent === 'number' && Number.isFinite(value.percent) ? {usedPercent:value.percent,windowDurationMins:minutes,resetsAt:Number.isFinite(Date.parse(value.resetsAt)) ? Date.parse(value.resetsAt)/1000 : null} : null
    return {planType:'opencode-go',primary:window(data.usage?.rolling,300),secondary:window(data.usage?.weekly,10080),monthly:window(data.usage?.monthly,43200),credits:null,resetCredits:0,ordinaryUsageAllowed:null}
  }
  configRead(){return this.primary.configRead()}
}
for(const name of ['startTurn','steerTurn','interruptTurn','setGoal','renameThread','archiveThread','exportThread']){
  ProviderHub.prototype[name]=async function(params){return (await this.forThread(params.threadId))[name](params)}
}
