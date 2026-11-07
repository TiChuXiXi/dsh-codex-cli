import test from 'node:test'
import assert from 'node:assert/strict'
import {resolveSkillInputs} from '../lib/skills.js'
import {skillQuery,filterSkills} from '../src/client/skills.ts'
import {readDraft,saveDraft} from '../src/client/drafts.ts'
import {CodexHub} from '../lib/hub.js'
import {normalizeConfig} from '../lib/config.js'
import {EventBus} from '../lib/events.js'
import {mkdtemp,writeFile,readFile,chmod,rm} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
const skill={name:'alpha',path:'/skills/alpha/SKILL.md',description:'Test workflow',scope:'user',enabled:true}

test('skill input resolves exact selected paths, detects duplicates and rejects disabled or forged references',()=>{
 assert.deepEqual(resolveSkillInputs('Use $alpha',[],[skill]),[{type:'skill',name:'alpha',path:skill.path}])
 assert.deepEqual(resolveSkillInputs('Use $alpha',[skill,skill],[skill]),[{type:'skill',name:'alpha',path:skill.path}])
 assert.deepEqual(resolveSkillInputs('no marker',[skill],[skill]),[])
 assert.deepEqual(resolveSkillInputs('$alphabet',[],[skill]),[])
 assert.throws(()=>resolveSkillInputs('$alpha',[{...skill,path:'/etc/passwd'}],[skill]),/不再可用/)
 assert.throws(()=>resolveSkillInputs('$alpha',[skill],[{...skill,enabled:false}]),/禁用/)
 const duplicate={...skill,path:'/project/alpha/SKILL.md'}
 assert.throws(()=>resolveSkillInputs('$alpha',[],[skill,duplicate]),/同名/)
 assert.equal(resolveSkillInputs('$alpha',[duplicate],[skill,duplicate])[0].path,duplicate.path)
})
test('dollar completion tracks caret and preserves surrounding text; search includes descriptions',()=>{
 assert.deepEqual(skillQuery('before $al after',10),{start:7,end:10,query:'al'})
 assert.equal(skillQuery('mail@example.com',16),null)
 assert.equal(skillQuery('\\$alpha',7),null)
 assert.deepEqual(filterSkills([skill],'workflow'),[skill])
})
test('drafts preserve skill identity and remain compatible with old drafts',()=>{
 const data=new Map(),previous=globalThis.sessionStorage
 globalThis.sessionStorage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)}
 try{
  saveDraft('t','$alpha',[],[{name:skill.name,path:skill.path}])
  assert.equal(readDraft('t').skills[0].path,skill.path)
  data.set('dsh-codex-draft:old',JSON.stringify({text:'old',attachments:[]}))
  assert.deepEqual(readDraft('old').skills,[])
 }finally{globalThis.sessionStorage=previous}
})
test('Hub calls real stdio protocol skills/list and includes skill items in turn/start and turn/steer',async t=>{
 const root=await mkdtemp(join(tmpdir(),'codex-skills-rpc-')),file=join(root,'codex.mjs'),record=join(root,'calls.jsonl')
 const metadata={...skill,path:join(root,'alpha','SKILL.md')}
 await writeFile(file,'#!'+process.execPath+'\n'+
  'import {createInterface} from "node:readline";import {appendFileSync} from "node:fs";'+
  'const catalog='+JSON.stringify(metadata)+';'+
  'createInterface({input:process.stdin}).on("line",line=>{const m=JSON.parse(line);if(m.id===undefined)return;appendFileSync('+JSON.stringify(record)+',JSON.stringify(m)+"\\n");let result={};if(m.method==="initialize")result={userAgent:"codex/0.167.0"};if(m.method==="skills/list")result={data:[{cwd:m.params.cwds[0],skills:[catalog],errors:[]}]};if(m.method==="turn/start")result={turn:{id:"turn",status:"inProgress",items:[]}};if(m.method==="turn/steer")result={turnId:"turn"};process.stdout.write(JSON.stringify({id:m.id,result})+"\\n")})')
 await chmod(file,0o755)
 const bus=new EventBus(),hub=new CodexHub({config:normalizeConfig({transport:'stdio',codexPath:file,codexHome:root}),logger:{},bus})
 t.after(async()=>{await hub.stop();bus.dispose();await rm(root,{recursive:true,force:true})})
 hub.start()
 const deadline=Date.now()+5000
 while(hub.status().phase!=='ready'&&Date.now()<deadline)await new Promise(r=>setTimeout(r,10))
 assert.equal(hub.status().phase,'ready',hub.status().error)
 assert.equal((await hub.skills({cwd:root,forceReload:true})).skills[0].name,'alpha')
 await hub.startTurn({threadId:'test',cwd:root,text:'$alpha do work',skills:[metadata]})
 await hub.steerTurn({threadId:'test',turnId:'turn',cwd:root,text:'$alpha revise',skills:[metadata]})
 const calls=(await readFile(record,'utf8')).trim().split('\n').map(JSON.parse)
 assert.ok(calls.some(m=>m.method==='skills/list'&&m.params.forceReload===true))
 for(const method of ['turn/start','turn/steer']){
   const input=calls.find(m=>m.method===method).params.input
   assert.deepEqual(input.find(i=>i.type==='skill'),{type:'skill',name:'alpha',path:metadata.path})
 }
})
