/** Screenshot current production components with explicitly controlled review data.
 * Does not send prompts, approve requests, update Codex, or modify application source.
 */
import assert from 'node:assert/strict'
import {execFile} from 'node:child_process'
import {promisify} from 'node:util'
import {mkdir,readFile,writeFile} from 'node:fs/promises'
import {resolve} from 'node:path'
const pw=await import(process.env.PLAYWRIGHT_MODULE||'playwright')
const output=resolve(process.env.UI_REVIEW_DIR||'/tmp/dsh-codex-ui-review')
const base=process.env.DSH_BASE_URL||'http://127.0.0.1:3081'
const cwd=process.env.UI_REVIEW_WORKSPACE||'/tmp/codex-ui-review-workspace'
await mkdir(output,{recursive:true})
if(!process.env.UI_REVIEW_WORKSPACE){
 await mkdir(cwd+'/src',{recursive:true})
 for(const [name,content]of [['README.md','# Codex 工作台\n\n受控验收文档。'],['src/SidebarWorkspace.tsx','export const workspace = true\n']]){
  await writeFile(cwd+'/'+name,content,{flag:'wx'}).catch(error=>{if(error.code!=='EEXIST')throw error})
 }
}
const now=Math.floor(Date.now()/1000)
const thread={id:'ui-review-thread',sessionId:null,name:'统一 Codex 工作台的界面与交互',preview:'梳理视觉层级、文件面板与输入区',cwd,model:'gpt-6.1-sol',reasoningEffort:'high',status:{type:'idle'},source:'cli',createdAt:now-3600,updatedAt:now-20,cliVersion:'0.167.0',path:null,gitInfo:{branch:'main'}}
const items=[
 {id:'u1',type:'userMessage',startedAtMs:(now-120)*1000,content:[{type:'text',text:'请梳理当前 Codex 面板的视觉问题，给出统一的设计方案。重点关注对话、输入区和右侧工作区。'}]},
 {id:'a0',type:'agentMessage',phase:'commentary',startedAtMs:(now-115)*1000,text:'我会先检查页面结构和组件状态，再整理一套适合长时间使用的工作台规范。'},
 {id:'c1',type:'commandExecution',command:'git status --short',cwd,status:'completed',exitCode:0,aggregatedOutput:' M src/client/sidebar/SidebarWorkspace.tsx\n M src/client/styles.ts',durationMs:42},
 {id:'m1',type:'mcpToolCall',server:'filesystem',tool:'read_multiple_files',status:'completed',arguments:{paths:['src/client/styles.ts','src/client/sidebar/SidebarWorkspace.tsx']},result:{summary:'已读取两个文件'}},
 {id:'f1',type:'fileChange',status:'completed',changes:[{path:'src/client/styles.ts',kind:{type:'update'},diff:'- font-size: 11px;\n+ font-size: 14px;'}]},
 {id:'a1',type:'agentMessage',startedAtMs:(now-95)*1000,text:'## 当前需要统一的地方\n\n界面应围绕 **对话、任务状态、工作区工具** 建立清晰层级。\n\n- 压缩顶部元数据，给正文更多阅读空间。\n- 将按钮、菜单和弹窗统一为同一套组件。\n- 使用统一的 SVG 图标库替换字符图标。\n\n| 区域 | 优先处理 |\n| --- | --- |\n| 输入区 | 模型、权限和附件的层级 |\n| 右侧面板 | 标签、图标和内容边距 |\n\n建议先确定整体风格，再分阶段替换组件。'}
]
const detail={thread,turns:[{id:'review-turn',status:'completed',startedAt:now-120,completedAt:now-90,items}],nextCursor:null}
let approval=false
let sent=null,forked=false,created=null
const goThread={...thread,id:'go-ui-review',modelProvider:'opencode-go',model:'deepseek-v4.1-flash',name:'Go 模型验收'}
const browser=await pw.chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})})
const context=await browser.newContext({storageState:process.env.DSH_BROWSER_STATE,viewport:{width:1440,height:1000},colorScheme:'light'})
const page=await context.newPage()
page.setDefaultTimeout(12000)
const errors=[]
page.on('pageerror',e=>errors.push(e.message))
page.on('console',message=>{if(message.type()==='error')errors.push(message.text().slice(0,1400))})
await page.route('**/codex-cli/**',async route=>{
 const req=route.request()
 if(req.method()!=='POST')return route.continue()
 const message=req.postDataJSON(),method=message.method
 let value,handled=true
 switch(method){
 case 'models/list':value=message.payload.provider==='opencode-go'?[{id:'deepseek-v4.1-flash',displayName:'DeepSeek V4.1 Flash'},{id:'kimi-k3',displayName:'Kimi K3'}]:[{id:'gpt-6.1-sol',displayName:'GPT-6.1 Sol'}];break
 case 'threads/new':created=message.payload;value=goThread;break
 case 'threads/fork':forked=true;value=goThread;break
 case 'turns/start':sent=message.payload;value={turn:{id:'test-turn',status:'completed'}};break
 case 'projects/list':value=[{cwd,name:'codex-workspace',threadCount:4,activeCount:1,lastUpdatedAt:now,models:['gpt-6.1-sol'],git:{branch:'main'},latest:{id:thread.id,name:thread.name,preview:thread.preview,status:'idle'}},{cwd:cwd+'/docs',name:'design-docs',threadCount:2,activeCount:0,lastUpdatedAt:now-300,models:['gpt-6.1-sol'],git:null,latest:null}];break
 case 'threads/list':if(message.payload.provider==='opencode-go'){value={data:[goThread],nextCursor:null};break}value={data:[thread,{...thread,id:'review-other',name:'完善文件预览与目录交互',updatedAt:now-1800},{...thread,id:'review-running',name:'检查插件热加载生命周期',status:{type:'active'},updatedAt:now-90}],nextCursor:null};break
 case 'threads/get':if(message.payload.threadId===goThread.id){value={...detail,thread:goThread};break}value=message.payload?.threadId===thread.id?detail:{...detail,thread:{...thread,id:message.payload?.threadId}};break
 case 'threads/open':case 'threads/close':value={ok:true};break
 case 'threads/settings':value={approvalPolicy:'on-request',approvalsReviewer:'user',sandbox:{type:'workspaceWrite'},collaborationMode:{mode:'default'}};break
 case 'account/rateLimits':value={planType:'review-fixture',primary:{usedPercent:24,windowDurationMins:300,resetsAt:now+3600},secondary:{usedPercent:38,windowDurationMins:10080,resetsAt:now+86400},credits:null,resetCredits:2,ordinaryUsageAllowed:true};break
 case 'approvals/pending':value={pending:approval?[{requestId:'review-only-approval',method:'item/commandExecution/requestApproval',params:{threadId:thread.id,command:'npm run build',cwd,reason:'检查当前插件构建是否通过'},createdAt:Date.now()}]:[]};break
 case 'approvals/respond':throw new Error('Review capture must never approve requests')
 case 'turns/steer':case 'versions/update':case 'versions/rollback':case 'daemon/action':throw new Error('Mutation blocked in screenshot review: '+method)
 default:handled=false
 }
 if(!handled)return route.continue()
 return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({type:'server-response',rpcId:message.rpcId,result:{ok:true,value}})})
})
await page.addInitScript(({id})=>{
 localStorage.setItem('dsh-codex-last-thread',id)
 localStorage.setItem('dsh-codex-provider','openai')
 if(!sessionStorage.getItem('codex-workbench-review')){
  localStorage.removeItem('dsh-codex-right-open')
  localStorage.removeItem('dsh-codex-theme')
  localStorage.removeItem('dsh-codex-nav-collapsed')
  localStorage.removeItem('dsh-codex-sidebar:/tmp/codex-ui-review-workspace')
  sessionStorage.setItem('codex-workbench-review','1')
 }
 const original=Element.prototype.animate
 window.codexReveals=[]
 Element.prototype.animate=function(frames,options){
  const animation=original.call(this,frames,options)
  if(options?.pseudoElement==='::view-transition-new(codex-panel)'){window.codexReveals.push({frames,options});window.codexReveal=animation}
  return animation
 }
},{id:thread.id})

const root=page.locator('.dsh-codex-root')
try{
 await page.goto(base+'/',{waitUntil:'domcontentloaded'})
 await page.getByRole('button',{name:'继续',exact:true}).click({timeout:800}).catch(()=>{})
 if(!await root.isVisible())await page.getByRole('button',{name:'Codex CLI',exact:true}).first().click()
 await root.locator('.dsh-codex-header-transfer button').first().waitFor()
 await root.getByRole('button',{name:'携带历史转交至 OpenCode Go',exact:true}).click()
 await root.getByRole('button',{name:'创建历史分支',exact:true}).click()
 await root.locator('.dsh-codex-workbench-header h1').filter({hasText:'Go 模型验收'}).waitFor()
 assert(forked)
 assert.equal(await root.getByRole('combobox',{name:'提供商',exact:true}).inputValue(),'opencode-go')
 await root.locator('.dsh-codex-model-trigger').click()
 await root.getByRole('button',{name:'模型',exact:false}).filter({has:page.locator('.dsh-codex-menu-cell-label')}).click()
 await root.getByRole('menuitemradio',{name:'Kimi K3',exact:true}).click()
 await root.locator('textarea').fill('controlled UI test')
 await root.getByRole('button',{name:'发送',exact:true}).click()
 await page.waitForTimeout(300)
 assert.equal(sent.model,'kimi-k3')
 await page.screenshot({path:'/tmp/codex-provider-go-light.png'})
 await root.getByRole('combobox',{name:'提供商',exact:true}).selectOption('openai')
 await page.waitForTimeout(400)
 assert.equal(await root.locator('.dsh-codex-thread').filter({hasText:'Go 模型验收'}).count(),0)
 await root.getByRole('combobox',{name:'提供商',exact:true}).selectOption('opencode-go')
 await root.locator('.dsh-codex-thread').filter({hasText:'Go 模型验收'}).click()
 await root.locator('.dsh-codex-model-trigger').filter({hasText:'DeepSeek'}).waitFor()
 await page.getByRole('button',{name:'切换深色模式',exact:true}).click()
 await page.waitForTimeout(700)
 await page.screenshot({path:'/tmp/codex-provider-go-dark.png'})
 await page.setViewportSize({width:375,height:900})
 await page.waitForTimeout(300)
 assert(await root.evaluate(el=>el.scrollWidth<=el.clientWidth+1))
 await page.setViewportSize({width:1440,height:1000})
 await root.getByRole('button',{name:'新会话',exact:true}).click()
 await page.waitForTimeout(200)
 const picker=root.locator('.dsh-codex-picker-item')
 if(await picker.count())await picker.first().click()
 await page.waitForTimeout(300)
 assert.equal(created.provider,'opencode-go')
 assert.deepEqual(errors,[])
 console.log(JSON.stringify({providerSwitch:true,modelSelection:true,crossProviderFork:true,dark:true,mobile:true,errors}))
}finally{await browser.close()}
