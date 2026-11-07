/** Plugin-local preferences and geometry; never changes the host's theme. */
export type Theme = 'light' | 'dark'
export const THEME_KEY='dsh-codex-theme'
export const NAV_KEY='dsh-codex-nav-collapsed'
export function stored(key:string):string|null{
 try{return localStorage.getItem(key)}catch{return null}
}
export function save(key:string,value:string):void{
 try{localStorage.setItem(key,value)}catch{}
}
export function initialTheme():Theme{
 const saved=stored(THEME_KEY)
 return saved==='light'||saved==='dark'?saved:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'
}
export function revealCircle(width:number,height:number,x:number,y:number){
 const cx=Math.max(0,Math.min(width,x)),cy=Math.max(0,Math.min(height,y))
 return {x:cx,y:cy,radius:Math.ceil(Math.hypot(Math.max(cx,width-cx),Math.max(cy,height-cy)))+1}
}
