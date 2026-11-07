import type {CodexTurn} from './types'

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
