import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {transform} from 'esbuild'
const source=await readFile(new URL('../src/client/appearance.ts',import.meta.url),'utf8')
const {code}=await transform(source,{loader:'ts',format:'esm',target:'es2022'})
const {revealCircle,initialTheme,stored,save}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'))
test('theme reveal covers all corners at edges, keyboard centres and mobile sizes',()=>{
 for(const [width,height]of [[1440,1000],[1024,900],[375,812]]){
  for(const [x,y]of [[0,0],[width,height],[width/2,height/2],[width-34,27.5],[-20,height+40]]){
   const result=revealCircle(width,height,x,y)
   assert.ok(result.x>=0&&result.x<=width)
   assert.ok(result.y>=0&&result.y<=height)
   for(const [cx,cy]of [[0,0],[width,0],[0,height],[width,height]])assert.ok(result.radius>Math.hypot(cx-result.x,cy-result.y))
  }
 }
})
test('theme preference validates storage and remains usable with unavailable storage',()=>{
 const oldStorage=globalThis.localStorage,oldMedia=globalThis.matchMedia
 try{
  let saved=null
  globalThis.localStorage={getItem:()=>saved,setItem:(_key,value)=>{saved=value}}
  globalThis.matchMedia=()=>({matches:true})
  assert.equal(initialTheme(),'dark')
  save('theme','light');assert.equal(initialTheme(),'light')
  saved='invalid';assert.equal(initialTheme(),'dark')
  globalThis.localStorage={getItem(){throw Error('private storage')},setItem(){throw Error('private storage')}}
  assert.equal(stored('theme'),null);assert.doesNotThrow(()=>save('theme','dark'))
  assert.equal(initialTheme(),'dark')
 }finally{
  if(oldStorage===undefined)delete globalThis.localStorage;else globalThis.localStorage=oldStorage
  if(oldMedia===undefined)delete globalThis.matchMedia;else globalThis.matchMedia=oldMedia
 }
})
