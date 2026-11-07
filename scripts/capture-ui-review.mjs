/** Screenshot current production components with explicitly controlled review data.
 * Does not send prompts, approve requests, update Codex, or modify application source.
 */
import {mkdir,readFile,writeFile} from 'node:fs/promises'
import {resolve} from 'node:path'
const pw=await import(process.env.PLAYWRIGHT_MODULE||'playwright')
const output=resolve(process.env.UI_REVIEW_DIR||'/tmp/dsh-codex-ui-current')
const base=process.env.DSH_BASE_URL||'http://127.0.0.1:3081'
const cwd=process.env.UI_REVIEW_WORKSPACE||'/tmp/codex-ui-review-workspace'
await mkdir(output,{recursive:true})
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
page.setDefaultTimeout(6000)
const errors=[]
page.on('pageerror',e=>errors.push(e.message))
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
 localStorage.removeItem('dsh-codex-right-open')
 localStorage.setItem('dsh-codex-last-thread',id)
 sessionStorage.removeItem('dsh-codex-panel-active')
}, {id:thread.id})
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
try{
 await page.goto(base+'/',{waitUntil:'domcontentloaded'})
 await page.getByRole('button',{name:'继续',exact:true}).click({timeout:2200}).catch(()=>{})
 await page.getByRole('button',{name:'Codex CLI',exact:true}).first().click()
 await root.waitFor()
 await root.getByText(thread.name,{exact:true}).first().waitFor()
 await page.getByRole('button',{name:'继续',exact:true}).click({timeout:1200}).catch(()=>{})
 await page.waitForTimeout(1000)
 await shot('01-conversation','对话与整体布局')
 const project=root.locator('.dsh-codex-tree-project').first()
 if(await project.getAttribute('aria-expanded')==='true') await project.click()
 await project.click()
 await root.locator('.dsh-codex-thread').first().waitFor()
 await shot('02-project-tree','项目展开与会话列表')
 await root.locator('.dsh-codex-row-menu-trigger').first().click()
 await shot('02b-thread-menu','会话行操作菜单')
 await page.getByRole('menuitem',{name:'重命名',exact:true}).click()
 await shot('02c-rename','会话重命名弹窗')
 await page.getByRole('dialog').getByRole('button',{name:'取消',exact:true}).click()
 const group=root.locator('.dsh-codex-tool-group-head').first()
 if(await group.count()){await group.click();await shot('03-tools-expanded','工具调用展开');await group.click()}
 await plus();await shot('04-add-menu','输入区添加和快捷命令')
 await closeMenus()
 await root.locator('.dsh-codex-model-trigger').click();await shot('05-model-root','模型选择入口')
 const modelMenu=root.locator('.dsh-codex-menu')
 await modelMenu.getByRole('button').first().click(); await shot('05b-model-list','可用模型列表'); await closeMenus(); await root.locator('.dsh-codex-model-trigger').click(); await modelMenu.getByRole('button').nth(1).click(); await shot('05c-reasoning','推理强度选择')
 await closeMenus()
 await root.locator('.dsh-codex-permission-trigger').click();await shot('06-permissions','会话权限菜单');await closeMenus()
 const input=root.locator('textarea').first()
 await input.fill('/');await shot('07-slash-commands','斜杠命令候选');await input.fill('')
 await plus()
 await page.getByText('计划模式',{exact:true}).click()
 await input.fill('先整理界面问题，再给出三个方向的设计初稿。')
 await shot('08-plan-draft','计划模式与草稿')
 await input.fill('')
 await page.getByRole('button',{name:'退出计划模式',exact:true}).click({timeout:600}).catch(()=>{})
 await plus();await page.getByText('选择项目',{exact:true}).click()
 await shot('09-project-picker','选择项目弹窗')
 await root.getByRole('button',{name:'取消',exact:true}).click()
 await plus(); await page.getByText('选择项目',{exact:true}).click(); await page.getByRole('dialog').getByRole('button',{name:'新建项目',exact:false}).click()
 await page.locator('.dsh-codex-browse').waitFor()
 await page.locator('.dsh-codex-browse-head').getByRole('button',{name:'编辑路径',exact:true}).click()
 await page.locator('.dsh-codex-browse-path').fill(cwd)
 await page.locator('.dsh-codex-browse-path').press('Enter')
 await page.locator('.dsh-codex-browse-row').filter({hasText:'src'}).waitFor()
 await shot('10-directory-browser','新建项目目录浏览器')
 await page.locator('.dsh-codex-browse-actions').getByRole('button',{name:'取消',exact:true}).click()
 await root.getByRole('button',{name:'版本',exact:true}).first().click()
 await page.locator('.dsh-codex-versions').waitFor()
 await shot('11a-versions-loading','版本检查加载中')
 await page.locator('.dsh-codex-versions .dsh-codex-loading').waitFor({state:'hidden',timeout:25000}).catch(()=>{})
 await shot('11-versions','版本与健康弹窗')
 await page.locator('.dsh-codex-versions').getByRole('button',{name:'关闭',exact:true}).click()
 await root.getByRole('button',{name:'右侧面板',exact:true}).click()
 await sidebar.getByRole('treeitem').filter({hasText:'README.md'}).waitFor()
 await shot('12-workspace-files','对话和右栏文件树')
 await sidebar.getByRole('treeitem').filter({hasText:'src'}).click()
 await shot('13-nested-files','嵌套目录与小图标')
 await sidebar.getByRole('treeitem').filter({hasText:'README.md'}).click()
 await sidebar.locator('.codex-sidebar-document').waitFor()
 await shot('14-markdown-preview','Markdown 文档预览')
 await sidebar.getByRole('button',{name:'源码',exact:true}).click();await shot('15-source-preview','源码与行号')
 await choose('版本管理');await page.waitForTimeout(800);await shot('16-git','Git 面板')
 await choose('终端');await shot('17-terminal','命令执行面板')
 await choose('浏览器');await shot('18-browser','浏览器空态和工具栏')
 await sidebar.getByRole('button',{name:'新建标签页',exact:true}).first().click();await shot('19-guide','右栏新标签引导')
 await sidebar.getByRole('button',{name:'右栏全屏',exact:true}).click()
 await sidebar.getByRole('button',{name:'向右分栏',exact:true}).first().click()
 await shot('20-split-fullscreen','右栏全屏与分栏')
 await sidebar.getByRole('button',{name:'退出右栏全屏',exact:true}).click()
 await page.setViewportSize({width:1024,height:900});await shot('21-compact','1024px 空间分配')
 await page.setViewportSize({width:390,height:844});await shot('22-mobile-right','移动端右栏')
 await sidebar.getByRole('button',{name:'收起右侧面板',exact:true}).click()
 await shot('23-mobile-chat','移动端对话')
 await page.setViewportSize({width:1440,height:1000})
 await page.emulateMedia({colorScheme:'dark'});await page.waitForTimeout(500)
 await shot('24-dark','系统暗色偏好下的当前界面')
 approval=true
 await page.reload({waitUntil:'domcontentloaded'})
 await page.getByRole('button',{name:'Codex CLI',exact:true}).first().click()
 await root.waitFor()
 await page.locator('.dsh-codex-approval').waitFor({timeout:5000})
 await shot('25-approval','审批卡片','当前审批组件的受控样例，未发送模型请求、未执行或批准命令')
} catch(error){
 process.exitCode=1
 console.log('Capture stopped:',error.message.split('\n')[0])
 await shot('99-capture-state','截取流程最后状态')
 shots.push({failure:error.message.split('\n')[0]})
}finally{
 await writeFile(resolve(output,'manifest.json'),JSON.stringify({capturedAt:new Date().toISOString(),source:'current built plugin in same-version DSH; controlled RPC conversation fixtures',shots,errors},null,2))
 await browser.close()
}
