type PushBranch = {name:string,hash:string,upstream:string,ahead:number,behind:number}
type RemoteBranch = {name:string,hash:string}

/** Evaluate the selected destination, rather than treating an untracked branch's ↑0 as synchronized. */
export function branchPushState(branch:PushBranch|undefined,remote:string,remoteBranches:RemoteBranch[]) {
  if(!remote)return {disabled:true,target:'',publish:false,reason:'先在远程页添加远程仓库'}
  if(!branch)return {disabled:true,target:'',publish:false,reason:'请先切换或创建本地分支'}
  const tracked=branch.upstream.startsWith(remote+'/')
  const target=tracked?branch.upstream.slice(remote.length+1):branch.name
  const destination=remote+'/'+target
  const existing=remoteBranches.find(item=>item.name===destination)
  if(!existing)return {disabled:false,target,publish:true,reason:'发布本地分支 '+branch.name+' 到 '+destination}
  if(existing.hash===branch.hash||(tracked&&branch.ahead===0)) {
    return {disabled:true,target,publish:false,reason:tracked&&branch.behind>0?'本地分支落后于 '+destination+'，没有可推送提交':'已与 '+destination+' 同步，没有可推送提交'}
  }
  return {disabled:false,target,publish:false,reason:'推送 '+branch.name+' 到 '+destination}
}
