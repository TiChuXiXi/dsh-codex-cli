import type {CodexTurn, ThreadDetail} from './types'

/** SSE replay can append older turns after the latest history page. */
export function activeTurnIdOf(detail:ThreadDetail|null,now=Date.now()):string|null {
 if(!detail || detail.thread.status?.type==='idle')return null
 const latest=detail.turns.reduce<CodexTurn|null>((latest,turn)=>
  !latest || runningStartedAt(turn,now,now)>=runningStartedAt(latest,now,now)?turn:latest,null)
 return latest?.status==='inProgress'?latest.id:null
}

/** Resolve a running turn's oldest reliable start without resetting on remount. */
export function runningStartedAt(turn:CodexTurn|null,observedAt:number,now:number):number {
 const valid=(value:unknown):value is number=>typeof value==='number'&&Number.isFinite(value)&&value>0&&value<=now
 if(valid(turn?.startedAt)){
  const time=turn.startedAt<1e12?turn.startedAt*1000:turn.startedAt
  if(valid(time))return time
 }
 const id=turn?.id
 if(typeof id==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)){
  const time=parseInt(id.replace(/-/g,'').slice(0,12),16)
  if(valid(time))return time
 }
 const times=(turn?.items??[]).map(item=>item.startedAtMs).filter(valid)
 if(times.length)return Math.min(...times)
 return valid(observedAt)?observedAt:now
}
