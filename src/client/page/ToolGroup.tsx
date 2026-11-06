/** 连续的工具调用折叠成一组：摘要 + 展开/收起。 */

import * as React from 'react'
import { useT } from '../i18n'
import type { Api } from '../rpc'
import type { CodexItem } from '../types'
import { ItemCard } from './ItemCard'

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
    return typeof item.text !== 'string' || item.text.trim() === ''
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
  return (
    <div className="dsh-codex-tool-group">
      <button
        type="button"
        className="dsh-codex-tool-group-head"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className={`dsh-codex-tool-group-chevron ${open ? 'open' : ''}`}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
            <path d="M4 6l3.3 3.3a1 1 0 0 0 1.4 0L12 6" strokeLinecap="round" />
          </svg>
        </span>
        <span className="dsh-codex-tool-group-title">{summary}</span>
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
  let reads = 0
  let writes = 0
  let tools = 0
  for (const item of items) {
    if (item.type === 'commandExecution') {
      commands += 1
    } else if (item.type === 'fileChange') {
      writes += 1
    } else if (item.type === 'webSearch' || item.type === 'dynamicToolCall') {
      tools += 1
    } else if (item.type === 'mcpToolCall') {
      const name = `${item.server ?? ''} ${item.tool ?? ''}`.toLowerCase()
      if (/read|list|glob|search|get_|find/.test(name)) reads += 1
      else if (/write|edit|create|delete|move|rename|apply|patch/.test(name)) writes += 1
      else tools += 1
    }
  }
  const parts: string[] = []
  if (commands > 0) parts.push(t('group.commands', { count: commands }))
  if (reads > 0) parts.push(t('group.reads', { count: reads }))
  if (writes > 0) parts.push(t('group.writes', { count: writes }))
  if (tools > 0) parts.push(t('group.tools', { count: tools }))
  if (parts.length === 0) return t('group.activity')
  return parts.join(parts.length > 2 ? t('group.sepList') : t('group.sepAnd'))
}
