/** 连续的工具调用折叠成一组：摘要 + 展开/收起。 */

import * as React from 'react'
import {Icon} from '../components/Icon'
import { useT } from '../i18n'
import type { Api } from '../rpc'
import type { CodexItem } from '../types'
import { ItemCard } from './ItemCard'
import { activityCounts } from '../activity-status'

const ACTIVITY_TYPES = new Set(['commandExecution', 'fileChange', 'mcpToolCall', 'dynamicToolCall', 'webSearch'])

export function isActivity(item: CodexItem): boolean {
  return ACTIVITY_TYPES.has(item.type)
}

/** 渲染为空的条目不应打断分组（空推理、空消息）。 */
function isInvisible(item: CodexItem): boolean {
  if (item.type === 'reasoning') {
    const summary = Array.isArray(item.summary) ? item.summary : []
    return summary.every((part) => typeof part !== 'string' || part.trim() === '')
  }
  if (item.type === 'agentMessage') {
    return !item.questions?.length && (typeof item.text !== 'string' || item.text.trim() === '')
  }
  return false
}

export type ActivityEntry =
  | { kind: 'group', key: string, items: CodexItem[] }
  | { kind: 'item', item: CodexItem }

/** 把连续的工具/命令/文件变更聚成组；单条仍按普通条目渲染。 */
export function groupActivity(items: CodexItem[]): ActivityEntry[] {
  const result: ActivityEntry[] = []
  let current: CodexItem[] = []
  const flush = () => {
    if (current.length >= 2) {
      result.push({ kind: 'group', key: current[0].id, items: current })
    } else {
      for (const item of current) result.push({ kind: 'item', item })
    }
    current = []
  }
  for (const item of items) {
    if (isInvisible(item)) continue
    if (isActivity(item)) {
      current.push(item)
    } else {
      flush()
      result.push({ kind: 'item', item })
    }
  }
  flush()
  return result
}

export function ToolGroup({ items, api }: { items: CodexItem[], api: Api }) {
  const t = useT()
  const [open, setOpen] = React.useState(false)
  const summary = summarize(items, t)
  const counts = activityCounts(items)
  const statuses = (['failed', 'completed', 'running', 'interrupted'] as const).filter(status => counts[status] > 0 || (status === 'completed' && counts.failed > 0))
  return (
    <div className="dsh-codex-tool-group">
      <button
        type="button"
        className="dsh-codex-tool-group-head"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className={`dsh-codex-tool-group-chevron ${open ? 'open' : ''}`}>
          <Icon name="chevronDown" size={16}/>
        </span>
        <span className="dsh-codex-tool-group-title">{summary}</span>
        {statuses.length > 0 && <span className="dsh-codex-tool-counts">
          {statuses.map(status => <span key={status} className={'dsh-codex-tool-status ' + status}>
            <Icon name={status === 'failed' ? 'circleAlert' : status === 'running' ? 'activity' : status === 'interrupted' ? 'ban' : 'check'} size={14}/>
            {t('group.count.' + status, { count: counts[status] })}
          </span>)}
        </span>}
      </button>
      {open ? (
        <div className="dsh-codex-tool-group-body">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} api={api} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function summarize(items: CodexItem[], t: (key: string, vars?: Record<string, string | number>) => string): string {
  let commands = 0
  let writes = 0
  let tools = 0
  let anonymousReads = 0
  const readPaths = new Set<string>()
  for (const item of items) {
    if (item.type === 'commandExecution') {
      commands += 1
    } else if (item.type === 'fileChange') {
      writes += 1
    } else if (item.type === 'webSearch' || item.type === 'dynamicToolCall') {
      tools += 1
    } else if (item.type === 'mcpToolCall') {
      const tool = String(item.tool ?? '').toLowerCase()
      const name = `${item.server ?? ''} ${tool}`.toLowerCase()
      // 只有真正读文件的工具才计入「读取」；list_* / search_* / get_* / index_* 都是工具调用。
      if (/^read|_read/.test(tool)) {
        const paths = filePathsOf(item)
        if (paths !== null && paths.length > 0) {
          for (const path of paths) readPaths.add(path)
        } else {
          anonymousReads += 1
        }
      } else if (/write|edit|create|delete|move|rename|apply|patch/.test(name)) {
        writes += 1
      } else {
        tools += 1
      }
    }
  }
  const reads = readPaths.size + anonymousReads
  const parts: string[] = []
  if (commands > 0) parts.push(t('group.commands', { count: commands }))
  if (reads > 0) parts.push(t('group.reads', { count: reads }))
  if (writes > 0) parts.push(t('group.writes', { count: writes }))
  if (tools > 0) parts.push(t('group.tools', { count: tools }))
  if (parts.length === 0) return t('group.activity')
  return parts.join(parts.length > 2 ? t('group.sepList') : t('group.sepAnd'))
}

/** 从工具参数里取实际读到的文件路径；取不到时返回 null，按一次匿名读取计数。 */
function filePathsOf(item: CodexItem): string[] | null {
  let args: unknown = item.arguments
  if (typeof args === 'string') {
    try {
      args = JSON.parse(args)
    } catch {
      return null
    }
  }
  if (args === null || typeof args !== 'object') return null
  const record = args as Record<string, unknown>
  if (Array.isArray(record.paths)) {
    return record.paths.filter((path): path is string => typeof path === 'string' && path !== '')
  }
  for (const key of ['path', 'file'] as const) {
    const value = record[key]
    if (typeof value === 'string' && value !== '') return [value]
  }
  return null
}
