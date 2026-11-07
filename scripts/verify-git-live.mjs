/** Real DSH plugin + real Git RPC; only conversation metadata is controlled. All writes stay in /tmp. */
import assert from 'node:assert/strict'
import {mkdtemp,mkdir,writeFile,readFile} from 'node:fs/promises'
import {execFile} from 'node:child_process'
import {promisify} from 'node:util'
import {resolve} from 'node:path'
const execute=promisify(execFile)
const pwModule=await import(process.env.PLAYWRIGHT_MODULE||'playwright')
const pw=pwModule.default||pwModule
const base=process.env.DSH_BASE_URL||'http://127.0.0.1:3081'
const output=process.env.GIT_ARTIFACTS||'/tmp/codex-git-verification'
await mkdir(output,{recursive:true})
const cwd=await mkdtemp('/tmp/codex-git-ui-'),empty=await mkdtemp('/tmp/codex-git-empty-ui-')
const git=async(...args)=>(await execute('git',args,{cwd})).stdout
await git('init');await git('symbolic-ref','HEAD','refs/heads/main');await git('config','user.name','UI Test');await git('config','user.email','ui@example.invalid')
await writeFile(cwd+'/文件 空格.txt','base\n');await writeFile(cwd+'/other.txt','keep\n')
await git('add','.');await git('commit','-m','initial fixture')
for(let i=0;i<52;i++)await git('commit','--allow-empty','-m','history '+i)
await git('checkout','-b','feature')
await writeFile(cwd+'/feature-only.txt','feature branch')
await git('add','feature-only.txt');await git('commit','-m','parallel feature')
await git('checkout','main')
await writeFile(cwd+'/文件 空格.txt','changed\n');await writeFile(cwd+'/new.txt','new file\n')
const bare=await mkdtemp('/tmp/codex-git-ui-bare-');await execute('git',['init','--bare',bare])
const browser=await pw.chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})})
const context=await browser.newContext({storageState:process.env.DSH_BROWSER_STATE,viewport:{width:1440,height:1000}})
const page=await context.newPage();page.setDefaultTimeout(15000)
const errors=[];page.on('pageerror',e=>errors.push(e.message))
const now=Math.floor(Date.now()/1000)
const thread={id:'git-review',name:'Git 面板真实验收',cwd,model:'gpt-6.1-sol',status:{type:'idle'},source:'cli',createdAt:now,updatedAt:now}
const other={...thread,id:'git-empty',name:'非仓库项目',cwd:empty}
await page.route('**/codex-cli/**',async route=>{
 const req=route.request();if(req.method()!=='POST')return route.continue()
 const m=req.postDataJSON();let value
 switch(m.method){
 case 'projects/list':value=[thread,other].map(t=>({cwd:t.cwd,name:t.name,threadCount:1,lastUpdatedAt:now,latest:t}));break
 case 'threads/list':value={data:[m.payload.cwd===empty?other:thread],nextCursor:null};break
 case 'threads/get':value={thread:m.payload.threadId===other.id?other:thread,turns:[],nextCursor:null};break
 case 'threads/open':case 'threads/close':value={ok:true};break
 case 'threads/settings':value={approvalPolicy:'on-request',sandbox:{type:'workspaceWrite'},collaborationMode:{mode:'default'}};break
 default:return route.continue()
 }
 return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({type:'server-response',rpcId:m.rpcId,result:{ok:true,value}})})
})
await page.addInitScript(({cwd})=>{
 localStorage.setItem('dsh-codex-last-thread','git-review');localStorage.setItem('dsh-codex-right-open','1')
 localStorage.removeItem('dsh-codex-sidebar:'+cwd);localStorage.setItem('dsh-codex-theme','light')
},{cwd})
const api=async(method,payload={})=>{
 const r=await context.request.post(base+'/codex-cli/'+method,{data:{type:'client-request',rpcId:crypto.randomUUID(),method,payload:{cwd,...payload}}})
 assert.equal(r.status(),200);const body=await r.json();assert.equal(body.result.ok,true,body.result.error?.message);return body.result.value
}
const report={cwd,empty,checks:[],errors,shots:[],runtime:null}
const shot=async(name)=>{await page.screenshot({path:output+'/'+name+'.png',fullPage:true});report.shots.push(name)}
const pane=page.locator('.codex-git')
const tab=async(name)=>{await pane.getByRole('tab',{name,exact:true}).click()}
const confirm=async()=>{await page.getByRole('dialog').getByRole('button',{name:'确认',exact:true}).click();await page.getByRole('dialog').waitFor({state:'hidden'});await pane.waitFor({state:'visible'});await page.waitForFunction(()=>document.querySelector('.codex-git')?.getAttribute('aria-busy')==='false')}
try{
 report.runtime=await api('status')
 await page.goto(base+'/',{waitUntil:'domcontentloaded'})
 await page.getByRole('button',{name:'继续',exact:true}).click({timeout:1200}).catch(()=>{})
 if(!await page.locator('.dsh-codex-root').isVisible())await page.getByRole('button',{name:'Codex CLI',exact:true}).first().click()
 await page.locator('.dsh-codex-workbench-header').waitFor()
 const sidebar=page.locator('[data-codex-sidebar]:not([hidden])')
 await sidebar.getByRole('button',{name:'新建标签页',exact:true}).first().click()
 await sidebar.locator('.codex-sidebar-guide').last().getByRole('button',{name:'版本管理',exact:false}).click()
 await pane.getByRole('checkbox',{name:'勾选 文件 空格.txt',exact:true}).waitFor()
 assert.equal(await pane.locator('select').count(),0)
 assert.equal(await pane.locator('input[type=text]').count(),0)
 await shot('01-changes-light')
 await pane.locator('.git-file').filter({hasText:'文件 空格.txt'}).locator('button').first().click()
 await pane.locator('.git-diff-line.add').filter({hasText:'changed'}).waitFor()
 await pane.getByRole('button',{name:'下一个改动块'}).click()
 await shot('02-diff')
 await pane.getByRole('button',{name:'关闭差异'}).click()
 await pane.getByRole('checkbox',{name:'勾选 new.txt',exact:true}).check()
 await pane.getByRole('textbox',{name:'提交信息',exact:true}).fill('selected UI commit')
 await pane.getByRole('button',{name:'提交 1 项',exact:true}).click()
 assert.equal(await page.getByRole('dialog').evaluate(el=>el.contains(document.activeElement)),true)
 await confirm()
 assert.equal((await git('show','--pretty=','--name-only','HEAD')).trim(),'new.txt')
 assert.match(await git('status','--short'),/文件|\\/);report.checks.push('real selected-file commit and diff; other changes retained')
 await tab('历史')
 assert.equal(await pane.locator('.git-history-row').count(),50)
 await pane.getByRole('button',{name:'加载更多提交',exact:true}).click()
 await page.waitForFunction(()=>document.querySelectorAll('.git-history-row').length>50)
 const historyCount=await pane.locator('.git-history-row').count()
 await pane.getByRole('button',{name:'刷新 Git',exact:true}).click()
 await page.waitForFunction(()=>document.querySelector('.codex-git')?.getAttribute('aria-busy')==='false')
 assert.equal(await pane.locator('.git-history-row').count(),historyCount)
 report.checks.push('all-branch history pagination and refresh retain loaded range')
 await pane.locator('.git-history-row').first().click()
 await pane.locator('.git-detail-file').first().click();await pane.locator('.git-diff-line.add').waitFor()
 await shot('03-history-detail');report.checks.push('history graph, commit metadata, file diff')
 await tab('分支')
 await pane.getByRole('button',{name:'新建分支',exact:true}).click()
 await page.getByRole('dialog').getByLabel('分支名称',{exact:true}).fill('--invalid')
 await page.getByRole('dialog').getByRole('button',{name:'确认',exact:true}).click()
 await page.getByRole('dialog').getByRole('alert').waitFor()
 await page.waitForFunction(()=>document.querySelector('.codex-git')?.getAttribute('aria-busy')==='false')
 await shot('10-operation-error')
 await page.keyboard.press('Escape')
 await page.getByRole('dialog').waitFor({state:'hidden'})
 report.checks.push('real operation error shown with retryable dialog and Escape')
 await pane.getByRole('button',{name:'新建分支',exact:true}).click()
 await page.getByRole('dialog').getByLabel('分支名称',{exact:true}).fill('from-ui');await confirm()
 await pane.getByText('from-ui',{exact:true}).waitFor()
 await pane.getByRole('button',{name:'切换到 from-ui',exact:true}).click();await confirm()
 assert.equal((await git('branch','--show-current')).trim(),'from-ui')
 report.checks.push('branch create and checkout with confirmation')
 await tab('远程');await pane.getByRole('button',{name:'添加远程仓库',exact:true}).click()
 await page.getByRole('dialog').getByLabel('获取地址',{exact:true}).fill(bare);await confirm()
 await pane.getByRole('button',{name:'操作远程',exact:true}).click()
 await pane.getByRole('listbox').waitFor();await page.keyboard.press('Escape')
 await pane.getByRole('button',{name:'推送选定远程',exact:true}).click();await confirm()
 assert.equal((await execute('git',['--git-dir',bare,'rev-parse','refs/heads/from-ui'])).stdout.trim(),(await git('rev-parse','HEAD')).trim())
 report.checks.push('custom remote menu and push to local bare repository')
 await tab('贮藏');await pane.getByRole('button',{name:'创建贮藏',exact:true}).click()
 await page.getByRole('dialog').getByLabel('贮藏说明（可留空）').fill('UI stash');await confirm()
 await pane.getByRole('button',{name:'查看差异',exact:true}).click();await pane.locator('.git-diff').waitFor();await shot('04-stash')
 await pane.getByRole('button',{name:'关闭差异'}).click()
 await pane.getByRole('button',{name:'弹出',exact:true}).click();await confirm()
 assert.match(await readFile(cwd+'/文件 空格.txt','utf8'),/changed/)
 report.checks.push('stash create, preview, pop')
 await tab('命令');await pane.locator('.git-command').first().click();await shot('05-console')
 assert.ok(await pane.locator('.git-command').count()>0)
 await page.getByRole('button',{name:'切换深色模式',exact:true}).click();await shot('06-dark')
 await sidebar.getByRole('button',{name:'右栏全屏',exact:true}).click();await shot('07-fullscreen')
 await sidebar.getByRole('button',{name:'退出右栏全屏',exact:true}).click()
 await page.setViewportSize({width:390,height:844});await shot('08-narrow')
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
 report.checks.push('light/dark, fullscreen and 390px without document overflow')
 await page.setViewportSize({width:1440,height:1000})
 // Switching projects through the real sidebar; Git endpoints remain live.
 await page.locator('.dsh-codex-focus-sidebar').getByText('非仓库项目',{exact:true}).first().click()
 await page.locator('.dsh-codex-focus-sidebar .dsh-codex-thread').filter({hasText:'非仓库项目'}).click()
 if(!await pane.isVisible()){
   await sidebar.getByRole('button',{name:'新建标签页',exact:true}).first().click()
   await sidebar.locator('.codex-sidebar-guide').last().getByRole('button',{name:'版本管理',exact:false}).click()
 }
 await pane.getByRole('button',{name:'初始化仓库',exact:true}).waitFor();await shot('09-empty')
 await pane.getByRole('button',{name:'初始化仓库',exact:true}).click()
 await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'})
 await assert.rejects(readFile(empty+'/.git/HEAD'))
 await pane.getByRole('button',{name:'初始化仓库',exact:true}).click();await confirm()
 assert.match(await readFile(empty+'/.git/HEAD','utf8'),/refs\/heads\/main/)
 await pane.getByText('工作区干净，没有本地变更').waitFor()
 report.checks.push('project switch clears old repository; explicit init and empty-repo snapshot; Escape')
 const beforeBuild=await page.locator('.dsh-codex-root').getAttribute('data-client-build')
 const build='git-acceptance-'+Date.now()
 let navigations=0;page.on('framenavigated',frame=>{if(frame===page.mainFrame())navigations++})
 await execute(process.execPath,['scripts/build-client.mjs'],{cwd:resolve('.'),env:{...process.env,CODEX_CLIENT_BUILD_ID:build}})
 await page.waitForFunction(id=>document.querySelector('.dsh-codex-root')?.getAttribute('data-client-build')===id,build,{timeout:30000})
 assert.equal(navigations,0);assert.notEqual(beforeBuild,build)
 assert.equal(await page.locator('.dsh-codex-root').count(),1)
 report.hmr={beforeBuild,build,navigations,rootCount:1}
 report.checks.push('actual frontend HMR observed in same document')
 report.loadedGit=(await api('git/repo/snapshot',{cwd,all:true})).repo.branch
 assert.equal(report.loadedGit,'from-ui')
 assert.deepEqual(errors,[])
 report.passed=true
}catch(e){report.passed=false;report.failure=e.stack;process.exitCode=1;await shot('99-failure')}
finally{await writeFile(output+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,checks:report.checks,failure:report.failure,errors}));await browser.close()}
