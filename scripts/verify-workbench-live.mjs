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
 case 'projects/list':value=[{cwd,name:'codex-workspace',threadCount:4,activeCount:1,lastUpdatedAt:now,models:['gpt-6.1-sol'],git:{branch:'main'},latest:{id:thread.id,name:thread.name,preview:thread.preview,status:'idle'}},{cwd:cwd+'/docs',name:'design-docs',threadCount:2,activeCount:0,lastUpdatedAt:now-300,models:['gpt-6.1-sol'],git:null,latest:null}];break
 case 'threads/list':value={data:[thread,{...thread,id:'review-other',name:'完善文件预览与目录交互',updatedAt:now-1800},{...thread,id:'review-running',name:'检查插件热加载生命周期',status:{type:'active'},updatedAt:now-90}],nextCursor:null};break
 case 'threads/get':value=message.payload?.threadId===thread.id?detail:{...detail,thread:{...thread,id:message.payload?.threadId}};break
 case 'threads/open':case 'threads/close':value={ok:true};break
 case 'threads/settings':value={approvalPolicy:'on-request',approvalsReviewer:'user',sandbox:{type:'workspaceWrite'},collaborationMode:{mode:'default'}};break
 case 'account/rateLimits':value={planType:'review-fixture',primary:{usedPercent:24,windowDurationMins:300,resetsAt:now+3600},secondary:{usedPercent:38,windowDurationMins:10080,resetsAt:now+86400},credits:null,resetCredits:2,ordinaryUsageAllowed:true};break
 case 'approvals/pending':value={pending:approval?[{requestId:'review-only-approval',method:'item/commandExecution/requestApproval',params:{threadId:thread.id,command:'npm run build',cwd,reason:'检查当前插件构建是否通过'},createdAt:Date.now()}]:[]};break
 case 'approvals/respond':throw new Error('Review capture must never approve requests')
 case 'turns/start':case 'turns/steer':case 'versions/update':case 'versions/rollback':case 'daemon/action':throw new Error('Mutation blocked in screenshot review: '+method)
 default:handled=false
 }
 if(!handled)return route.continue()
 return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({type:'server-response',rpcId:message.rpcId,result:{ok:true,value}})})
})
await page.addInitScript(({id})=>{
 localStorage.setItem('dsh-codex-last-thread',id)
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
const shots=[]
async function shot(name,title,note='当前组件，受控会话内容；文件与目录使用真实验收工作区'){
 await page.waitForTimeout(250)
 const file=name+'.png'
 await page.screenshot({path:resolve(output,file),fullPage:true})
 shots.push({file,title,note,viewport:page.viewportSize()})
 console.log('Captured',name)
}
const root=page.locator('.dsh-codex-root')
const sidebar=page.locator('[data-codex-sidebar]:not([hidden])')
async function closeMenus(){await page.keyboard.press('Escape');await page.locator('.dsh-codex-menu-backdrop').click({position:{x:10,y:10},timeout:300}).catch(()=>{})}
async function plus(){await root.locator('.dsh-codex-plus').click()}
async function choose(kind){
 await sidebar.getByRole('button',{name:'新建标签页',exact:true}).first().click()
 await sidebar.locator('.codex-sidebar-guide').last().getByRole('button',{name:kind,exact:false}).click()
}

const execute=promisify(execFile)
async function openPanel(){
 await page.getByRole('button',{name:'继续',exact:true}).click({timeout:800}).catch(()=>{})
 if(!await root.isVisible())await page.getByRole('button',{name:'Codex CLI',exact:true}).first().click()
 await root.waitFor()
 await page.getByRole('button',{name:'继续',exact:true}).click({timeout:800}).catch(()=>{})
 await root.locator('.dsh-codex-workbench-header').waitFor()
}
async function idle(){await page.waitForFunction(()=>!document.documentElement.hasAttribute('data-codex-transition'))}
const report={source:'real plugin in DSH; controlled conversation RPC and real file services',checks:[],errors,shots}
try{
 await page.goto(base+'/',{waitUntil:'domcontentloaded'})
 await openPanel()
 await root.locator('.dsh-codex-workbench-header h1').filter({hasText:thread.name}).waitFor()
 assert.equal(await root.getAttribute('data-codex-theme'),'light')
 await root.locator('.dsh-codex-thread').first().waitFor()
 report.checks.push('initial project session list resolves without a second click')
 await shot('01-light','正式插件浅色工作台')
 await root.locator('.dsh-codex-rail').getByRole('button',{name:'工作区文件',exact:true}).click()
 await sidebar.getByRole('treeitem').filter({hasText:'README.md'}).waitFor()
 await shot('02-files','正式插件与右栏文件树')
 await page.getByRole('button',{name:'切换深色模式',exact:true}).click()
 await page.waitForFunction(()=>window.codexReveals.length>0&&window.codexReveal?.playState==='running')
 await page.evaluate(()=>{window.codexReveal.pause();window.codexReveal.currentTime=180})
 await shot('03-theme-reveal','正式插件圆形扩散中间帧')
 await page.evaluate(()=>window.codexReveal.play())
 await idle()
 assert.equal(await root.getAttribute('data-codex-theme'),'dark')
 await shot('04-dark','正式插件深色工作台')
 await root.locator('.dsh-codex-workbench-header').getByRole('button',{name:'展开或折叠项目栏',exact:true}).click()
 assert.equal(await root.locator('.dsh-codex-focus-sidebar').isVisible(),false)
 await shot('05-collapsed','项目栏折叠')
 await page.reload({waitUntil:'domcontentloaded'});await openPanel()
 assert.equal(await root.getAttribute('data-codex-theme'),'dark')
 assert.equal(await root.locator('.dsh-codex-focus-sidebar').isVisible(),false)
 report.checks.push('theme reveal, persistence and collapsed navigation')
 await root.locator('.dsh-codex-workbench-header').getByRole('button',{name:'展开或折叠项目栏',exact:true}).click()
 await root.locator('.dsh-codex-workbench-header .dsh-codex-thread-actions > button').click()
 await page.getByRole('menuitem',{name:'重命名',exact:true}).click()
 const dialog=page.getByRole('dialog');await dialog.waitFor()
 assert.equal(await dialog.evaluate(el=>el.contains(document.activeElement)),true)
 await shot('06-rename','统一弹窗与会话操作')
 await page.keyboard.press('Escape')
 assert.equal(await dialog.count(),0)
 await root.locator('.dsh-codex-plus').click()
 await shot('07-commands','输入区命令菜单')
 await page.keyboard.press('Escape')
 await root.locator('.dsh-codex-model-trigger').click()
 await shot('08-model','模型菜单')
 await page.keyboard.press('Escape')
 await root.locator('.dsh-codex-permission-trigger').click()
 await shot('09-permission','权限菜单')
 await page.keyboard.press('Escape')
 report.checks.push('thread menu, dialog focus, Escape, composer menus')
 await root.locator('.dsh-codex-rail').getByRole('button',{name:'工作区文件',exact:true}).click()
 await sidebar.getByRole('treeitem').filter({hasText:'README.md'}).click()
 await sidebar.locator('.codex-sidebar-document').waitFor()
 await shot('10-document','Markdown 文档标签')
 await sidebar.getByRole('button',{name:'源码',exact:true}).click()
 await shot('11-source','文档源码')
 for(const [kind,n] of [['版本管理','12-git'],['终端','13-terminal'],['浏览器','14-browser']]){
  await choose(kind);await shot(n,kind)
 }
 await sidebar.getByRole('button',{name:'新建标签页',exact:true}).first().click()
 await sidebar.getByRole('button',{name:'右栏全屏',exact:true}).click()
 await sidebar.getByRole('button',{name:'向右分栏',exact:true}).first().click()
 await shot('15-split','全屏双分栏')
 await sidebar.getByRole('button',{name:'退出右栏全屏',exact:true}).click()
 const layout=await page.evaluate(cwd=>localStorage.getItem('dsh-codex-sidebar:'+cwd),cwd)
 await page.setViewportSize({width:375,height:812})
 await sidebar.locator('.codex-sidebar-mobile-panes').waitFor()
 for(const name of ['分栏 1','分栏 2']){
  await sidebar.getByRole('tab',{name,exact:true}).click()
  const hosts=await sidebar.locator('[data-dockkit-host="dock"]:visible').count()
  assert.equal(hosts,1)
 }
 await shot('16-mobile-tools','手机单活动分栏，保留桌面布局')
 await sidebar.getByRole('button',{name:'收起右侧面板',exact:true}).click()
 await shot('17-mobile-chat','手机对话')
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
 const mainRect=await root.locator('.dsh-codex-main').boundingBox()
 assert.ok(mainRect.width>=370)
 await root.locator('.dsh-codex-workbench-header').getByRole('button',{name:'展开或折叠项目栏',exact:true}).click()
 await root.locator('.dsh-codex-focus-sidebar').waitFor({state:'visible'})
 await shot('18-mobile-nav','手机项目抽屉')
 await root.getByRole('button',{name:'关闭项目导航',exact:true}).click({position:{x:365,y:120}})
 await page.getByRole('button',{name:'切换浅色模式',exact:true}).focus()
 await page.keyboard.press('Enter');await idle()
 assert.equal(await root.getAttribute('data-codex-theme'),'light')
 report.checks.push('375px readable chat, mobile nav, keyboard theme, single active saved split')
 await page.setViewportSize({width:1440,height:1000})
 await root.locator('.dsh-codex-rail').getByRole('button',{name:'工作区文件',exact:true}).click()
 assert.equal(await sidebar.locator('[data-dockkit-host="dock"]:visible').count(),2)
 await shot('19-desktop-restored','返回桌面恢复双分栏')
 approval=true;await page.reload({waitUntil:'domcontentloaded'});await openPanel()
 await page.locator('.dsh-codex-approval').waitFor()
 await shot('20-approval','正式插件审批卡片（受控样例，未执行命令）')
 await root.locator('.dsh-codex-rail').getByRole('button',{name:'版本与连接',exact:true}).click()
 await page.locator('.dsh-codex-versions').waitFor()
 await page.locator('.dsh-codex-versions .dsh-codex-loading').waitFor({state:'hidden',timeout:25000}).catch(()=>{})
 await shot('21-versions','版本与健康')
 await page.locator('.dsh-codex-versions').getByRole('button',{name:'关闭',exact:true}).click()
 // Build replacement is observed in the same browser document.
 if(process.env.VERIFY_HMR==='1'){
  const input=root.locator('textarea').first();await input.fill('工作台热加载验收草稿')
  if(await root.getAttribute('data-codex-theme')!=='dark'){await page.getByRole('button',{name:'切换深色模式',exact:true}).click();await idle()}
  if(!await root.evaluate(el=>el.classList.contains('is-nav-collapsed')))await root.locator('.dsh-codex-workbench-header').getByRole('button',{name:'展开或折叠项目栏',exact:true}).click()
  const beforeUrl=page.url(),beforeBuild=await root.getAttribute('data-client-build')
  let navigations=0;page.on('framenavigated',frame=>{if(frame===page.mainFrame())navigations++})
  const newBuild='workbench-acceptance-'+Date.now()
  await execute(process.execPath,['scripts/build-client.mjs'],{cwd:resolve('.'),env:{...process.env,CODEX_CLIENT_BUILD_ID:newBuild}})
  await page.waitForFunction(expected=>document.querySelector('.dsh-codex-root')?.dataset.clientBuild===expected,newBuild,{timeout:30000})
  await root.locator('textarea').waitFor()
  assert.notEqual(beforeBuild,newBuild);assert.equal(page.url(),beforeUrl);assert.equal(navigations,0)
  assert.equal(await root.locator('textarea').inputValue(),'工作台热加载验收草稿')
  assert.equal(await root.getAttribute('data-codex-theme'),'dark')
  assert.equal(await root.locator('.dsh-codex-focus-sidebar').isVisible(),false)
  assert.equal(await page.locator('.dsh-codex-root').count(),1)
  assert.equal(await page.locator('#dsh-codex-cli-style').count(),1)
  report.hmr={beforeBuild,newBuild,navigations,rootCount:1,styleCount:1,draft:true,theme:true,collapsed:true}
  await shot('22-hmr','真实 DSH 热加载后的工作台')
 }
 assert.deepEqual(errors,[])
 // The host's own theme and styles must remain independent.
 if(await root.getAttribute('data-codex-theme')!=='dark'){await page.getByRole('button',{name:'切换深色模式',exact:true}).click();await idle()}
 const hostBefore=await page.evaluate(()=>({theme:document.documentElement.getAttribute('data-theme'),color:getComputedStyle(document.body).color}))
 await page.emulateMedia({reducedMotion:'reduce'})
 let beforeReveals=await page.evaluate(()=>window.codexReveals.length)
 await page.getByRole('button',{name:'切换浅色模式',exact:true}).click()
 await page.waitForFunction(()=>document.querySelector('.dsh-codex-root')?.dataset.codexTheme==='light')
 assert.equal(await page.evaluate(()=>window.codexReveals.length),beforeReveals)
 await page.emulateMedia({reducedMotion:'no-preference'})
 await page.evaluate(()=>{window.originalCodexTransition=document.startViewTransition;document.startViewTransition=undefined})
 await page.getByRole('button',{name:'切换深色模式',exact:true}).click()
 await page.waitForFunction(()=>document.querySelector('.dsh-codex-root')?.dataset.codexTheme==='dark')
 assert.equal(await page.evaluate(()=>window.codexReveals.length),beforeReveals)
 await page.evaluate(()=>{document.startViewTransition=()=>{throw Error('Controlled transition rejection')}})
 await page.getByRole('button',{name:'切换浅色模式',exact:true}).click();await idle()
 assert.equal(await root.getAttribute('data-codex-theme'),'light')
 await page.evaluate(()=>{document.startViewTransition=window.originalCodexTransition})
 const hostAfter=await page.evaluate(()=>({theme:document.documentElement.getAttribute('data-theme'),color:getComputedStyle(document.body).color}))
 assert.deepEqual(hostAfter,hostBefore)
 // Tablet widths keep every region inside the viewport.
 for(const width of [1280,1024]){
  await page.setViewportSize({width,height:900})
  await shot('23-width-'+width,width+'px 正式工作台')
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
  const bounds=await root.locator('.dsh-codex-main').boundingBox()
  assert.ok(bounds.width>=320)
 }
 report.checks.push('host theme unchanged, reduced motion, missing/rejected transition fallback, tablet bounds')
 report.checks.push('single icon family and dark/light tool panels')
 if(report.hmr)report.checks.push('actual front-end HMR without document navigation')
 report.passed=true
}catch(error){
 report.passed=false;report.failure=error.stack;process.exitCode=1
 console.log('FAILED:',error.message)
 await shot('99-failure','验收失败时的实际页面')
}finally{
 await writeFile(resolve(output,'report.json'),JSON.stringify(report,null,2))
 console.log(JSON.stringify({passed:report.passed,checks:report.checks,errors,failure:report.failure?.split('\n')[0],hmr:report.hmr},null,2))
 await browser.close()
}
