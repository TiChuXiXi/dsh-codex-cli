import {HubError} from './hub.js'
export function skillMentioned(text,name){
  return text.split(/\s+/).some(token=>token==='$'+name || token.startsWith('$'+name)&&/^[,，。;；!?！？]$/.test(token.slice(name.length+1)))
}
export function resolveSkillInputs(text,selected,catalog){
  if(!Array.isArray(selected))throw new HubError('codex-cli/bad-request','skills 必须是数组')
  const result=[],seen=new Set()
  for(const item of selected){
    if(typeof item?.name!=='string'||typeof item?.path!=='string')throw new HubError('codex-cli/bad-request','无效技能引用')
    if(!skillMentioned(text,item.name))continue
    const skill=catalog.find(s=>s.path===item.path&&s.name===item.name&&s.enabled)
    if(!skill)throw new HubError('codex-cli/skill-unavailable','技能已禁用或不再可用：'+item.name)
    if(!seen.has(skill.path)){result.push({type:'skill',name:skill.name,path:skill.path});seen.add(skill.path)}
  }
  for(const skill of catalog){
    if(!skill.enabled||!skillMentioned(text,skill.name)||result.some(s=>s.name===skill.name))continue
    if(catalog.filter(s=>s.enabled&&s.name===skill.name).length>1)throw new HubError('codex-cli/skill-ambiguous','存在同名技能，请从列表选择来源：'+skill.name)
    if(!seen.has(skill.path)){result.push({type:'skill',name:skill.name,path:skill.path});seen.add(skill.path)}
  }
  return result
}
