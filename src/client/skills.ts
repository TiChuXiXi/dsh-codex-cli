export type SkillReference={name:string,path:string}
export type Skill=SkillReference&{description:string,shortDescription?:string,scope:string,enabled:boolean,interface?:{displayName?:string,shortDescription?:string}}
export function skillQuery(text:string,caret:number){
 const before=text.slice(0,caret)
 const match=/(?:^|\s)\$([^\s$]*)$/.exec(before)
 if(!match)return null
 const start=caret-match[1].length-1
 let end=caret
 while(end<text.length&&!/[\s$]/.test(text[end]))end++
 return {start,end,query:match[1]}
}
export function hasSkill(text:string,name:string){
 return text.split(/\s+/).some(t=>t==='$'+name||t.startsWith('$'+name)&&/^[,，。;；!?！？]$/.test(t.slice(name.length+1)))
}
export function filterSkills(skills:Skill[],query:string){
 const q=query.trim().toLocaleLowerCase()
 return skills.filter(s=>[s.name,s.description,s.shortDescription,s.interface?.displayName,s.interface?.shortDescription].some(v=>v?.toLocaleLowerCase().includes(q)))
}
