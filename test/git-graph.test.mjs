import test from 'node:test'
import assert from 'node:assert/strict'
import {graphRows} from '../src/client/sidebar/gitGraph.ts'
test('commit graph keeps every parent edge and parallel branch lane across merges',()=>{
 const commits=[{hash:'merge',parents:['main','side']},{hash:'side',parents:['base']},{hash:'main',parents:['base']},{hash:'base',parents:[]}]
 const rows=graphRows(commits)
 assert.equal(rows[0].incoming,false)
 assert.equal(rows[1].incoming,true)
 assert.equal(rows[0].edges.length,2)
 assert.notEqual(rows[1].lane,rows[2].lane)
 rows.forEach((row,i)=>commits[i].parents.forEach((parent,index)=>assert.equal(row.after[row.edges[index].to],parent)))
 assert.equal(rows.at(-1).after.length,0)
 assert.deepEqual(graphRows(commits.slice(0,2)),rows.slice(0,2))
 const separate=graphRows([{hash:'tip1',parents:['base']},{hash:'tip2',parents:['base']},{hash:'base',parents:[]}])
 assert.equal(separate[1].incoming,false)
 assert.equal(separate[2].incoming,true)
})
