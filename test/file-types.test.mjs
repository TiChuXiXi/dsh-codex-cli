import test from 'node:test'
import assert from 'node:assert/strict'
import {downloadsOnClick} from '../src/client/fileTypes.ts'
test('archives and binary artifacts download while documents and images retain previews',()=>{
 for(const path of ['bundle.zip','中文 安装包.DEB','data.tar.gz','module.wasm','data.parquet'])assert.equal(downloadsOnClick(path),true,path)
 for(const path of ['README.md','notes.txt','app.tsx','photo.png','report.pdf','report.docx','report.xlsx','no-extension'])assert.equal(downloadsOnClick(path),false,path)
})
