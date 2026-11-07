/** Stable parent lanes for merge graphs and paginated history. */
export function graphRows(commits:{hash:string,parents:string[]}[]) {
  let lanes:string[]=[]
  return commits.map(c=>{
    let lane=lanes.indexOf(c.hash);const incoming=lane>=0;if(lane<0){lane=lanes.indexOf('');if(lane<0)lane=lanes.length;lanes[lane]=c.hash}
    const before=[...lanes],edges:{from:number,to:number}[]=[]
    lanes[lane]=''
    c.parents.forEach((parent,index)=>{let target=lanes.indexOf(parent);if(target<0){target=index===0?lane:lanes.indexOf('');if(target<0)target=lanes.length;lanes[target]=parent}edges.push({from:lane,to:target})})
    const through=before.flatMap((hash,i)=>hash&&i!==lane?[i]:[])
    while(lanes.at(-1)==='')lanes.pop()
    return {lane,before,after:[...lanes],edges,through,incoming}
  })
}
