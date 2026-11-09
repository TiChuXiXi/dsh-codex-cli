import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {transform} from 'esbuild'
const {code}=await transform(await readFile(new URL('../src/client/sidebar/gitPush.ts',import.meta.url),'utf8'),{loader:'ts',format:'esm'})
const {branchPushState}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'))
const branch={name:'master',hash:'local-tip',upstream:'origin/main',ahead:0,behind:0}
const remote={name:'origin/main',hash:'local-tip'}
test('synchronized and behind tracked branches cannot push; local master targets tracked main',()=>{
 const synced=branchPushState(branch,'origin',[remote])
 assert.equal(synced.disabled,true)
 assert.equal(synced.target,'main')
 assert.match(synced.reason,/没有可推送提交/)
 const behind=branchPushState({...branch,behind:2},'origin',[{...remote,hash:'newer-tip'}])
 assert.equal(behind.disabled,true)
 assert.match(behind.reason,/落后/)
})
test('ahead branches can push to the tracked remote target',()=>{
 const ahead=branchPushState({...branch,ahead:2},'origin',[{...remote,hash:'older-tip'}])
 assert.equal(ahead.disabled,false)
 assert.equal(ahead.target,'main')
 assert.equal(ahead.publish,false)
})
test('first publish and a different selected remote do not use the old upstream ahead count',()=>{
 for(const local of [{...branch,name:'feature',upstream:''},branch]) {
  const fresh=branchPushState(local,'backup',[])
  assert.equal(fresh.disabled,false)
  assert.equal(fresh.publish,true)
  assert.equal(fresh.target,local.name)
 }
 const other=branchPushState(branch,'backup',[{name:'backup/master',hash:'different-tip'}])
 assert.equal(other.disabled,false)
 const gone=branchPushState(branch,'origin',[])
 assert.equal(gone.disabled,false)
 assert.equal(gone.target,'main')
 assert.equal(gone.publish,true)
})
test('equal target hashes disable push even without upstream, and missing destinations cannot push',()=>{
 assert.equal(branchPushState({...branch,upstream:''},'origin',[{name:'origin/master',hash:branch.hash}]).disabled,true)
 assert.equal(branchPushState(branch,'',[]).disabled,true)
 assert.equal(branchPushState(undefined,'origin',[]).disabled,true)
})
