import test from 'node:test'
import assert from 'node:assert/strict'
import {INLINE} from '../src/client/markdownTokens.ts'
test('download links accept destination whitespace and bracketed paths without consuming surrounding text',()=>{
 const path='/root/project/certbase/certbase-desktop/dist/certbase-online_1.2.3+20261107T165307_lx-ct-pc-linux3_arm64.deb'
 for(const token of ['[下载安装包]( '+path+')','[下载]('+path+' )','[下载](  '+path+'  )','[下载](<'+path+'>)','[文档](</tmp/中文 文档.md>)','![图片]( /tmp/image.png )']){
   const matches=[...('前文 '+token+' 后文').matchAll(new RegExp(INLINE.source,INLINE.flags))]
   assert.equal(matches.length,1,token);assert.equal(matches[0][0],token)
 }
})
