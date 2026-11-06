/** 纯函数工具：标题、时间、状态、事件归并。 */

import type { CodexEvent, CodexItem, CodexThread, ThreadDetail } from './types'
import type { Translate } from './i18n'

export function basename(path: string | null | undefined): string {
  if (typeof path !== 'string' || path === '') return ''
  const trimmed = path.replace(/[/\\]+$/u, '')
  const index = Math.max(trimmed.lastIndexOf('/'), trimmed.lastIndexOf('\\'))
  return index === -1 ? trimmed : trimmed.slice(index + 1)
}

export function firstLine(text: string | null | undefined): string {
  if (typeof text !== 'string') return ''
  const line = text.split('\n').find((candidate) => candidate.trim() !== '') ?? ''
  return line.length > 120 ? `${line.slice(0, 120)}…` : line
}

export function threadTitle(thread: CodexThread | null | undefined): string {
  if (thread === null || thread === undefined) return ''
  if (typeof thread.name === 'string' && thread.name.trim() !== '') return thread.name
  const preview = firstLine(thread.preview)
  if (preview !== '') return preview
  return thread.id.slice(0, 8)
}

/** codex 的时间戳是秒。 */
export function relativeTime(seconds: number | null | undefined, t: Translate): string {
  if (typeof seconds !== 'number' || seconds <= 0) return ''
  const delta = Date.now() / 1000 - seconds
  if (delta < 60) return t('time.justNow')
  if (delta < 3600) return t('time.minutes', { count: Math.floor(delta / 60) })
  if (delta < 86400) return t('time.hours', { count: Math.floor(delta / 3600) })
  return t('time.days', { count: Math.floor(delta / 86400) })
}

/** 本地时钟：HH:MM（跟随界面语言，中文为 24 小时制）。 */
export function formatClock(ms: number | null | undefined): string {
  if (typeof ms !== 'number' || !Number.isFinite(ms) || ms <= 0) return ''
  return new Date(ms).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

/** 今天显示 HH:MM，跨天显示 M月D日 HH:MM。 */
export function formatDateTime(ms: number | null | undefined): string {
  if (typeof ms !== 'number' || !Number.isFinite(ms) || ms <= 0) return ''
  const date = new Date(ms)
  const now = new Date()
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  if (sameDay) return formatClock(ms)
  return date.toLocaleString(undefined, { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

/** 时长：1 小时 2 分 / 1 分 29 秒 / 45 秒。 */
export function formatDuration(ms: number, t: Translate): string {
  const total = Math.max(0, Math.round(ms / 1000))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  if (hours > 0) {
    return minutes > 0
      ? `${t('duration.hours', { count: hours })} ${t('duration.minutes', { count: minutes })}`
      : t('duration.hours', { count: hours })
  }
  if (minutes > 0) {
    return seconds > 0
      ? `${t('duration.minutes', { count: minutes })} ${t('duration.seconds', { count: seconds })}`
      : t('duration.minutes', { count: minutes })
  }
  return t('duration.seconds', { count: seconds })
}

export function messageOf(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause)
}

export function statusKey(status: CodexThread['status']): string {
  const type = status?.type ?? 'idle'
  return `state.${type}`
}

export function isActive(status: CodexThread['status']): boolean {
  return status?.type === 'active'
}

/** 线程列表里的一条：把 upsert 合并进现有数组。 */
export function upsertThread(list: CodexThread[], thread: CodexThread): CodexThread[] {
  const index = list.findIndex((candidate) => candidate.id === thread.id)
  if (index === -1) return [thread, ...list]
  const next = [...list]
  next[index] = { ...next[index], ...thread }
  return next
}

/**
 * 把一条 SSE 事件合并进当前打开的会话详情。
 * 只处理 M0/M1 需要的四类：回合、条目、文本增量、补丁更新。
 */
export function applyDetailEvent(detail: ThreadDetail | null, event: CodexEvent): ThreadDetail | null {
  if (detail === null) return null
  if (event.threadId !== undefined && event.threadId !== detail.thread.id) return detail

  switch (event.type) {
    case 'turn/started': {
      const turn = event.payload?.turn
      if (turn === null || turn === undefined) return detail
      if (detail.turns.some((candidate) => candidate.id === turn.id)) return detail
      return { ...detail, turns: [...detail.turns, { ...turn, items: [] }] }
    }
    case 'turn/completed': {
      const turn = event.payload?.turn
      if (turn === null || turn === undefined) return detail
      return {
        ...detail,
        turns: detail.turns.map((candidate) =>
          candidate.id === turn.id ? { ...candidate, ...turn, items: candidate.items ?? [] } : candidate,
        ),
      }
    }
    case 'item/upsert': {
      const item = event.payload?.item
      if (item === null || item === undefined) return detail
      return upsertItem(detail, event.turnId ?? '', item)
    }
    case 'item/delta': {
      const delta = event.payload?.delta
      if (event.itemId === undefined || typeof delta !== 'string' || delta === '') return detail
      return patchItem(detail, event.itemId, (item) => {
        switch (event.channel) {
          case 'agentMessage':
            return { ...item, text: `${item.text ?? ''}${delta}` }
          case 'commandOutput':
            return { ...item, aggregatedOutput: `${item.aggregatedOutput ?? ''}${delta}` }
          case 'reasoningSummary': {
            const summary = [...(item.summary ?? [])]
            const index = typeof event.summaryIndex === 'number' ? event.summaryIndex : 0
            summary[index] = `${summary[index] ?? ''}${delta}`
            return { ...item, summary }
          }
          case 'reasoningText':
            return { ...item, content: [...(item.content ?? []), { type: 'text', text: delta }] }
          case 'plan':
            return { ...item, text: `${item.text ?? ''}${delta}` }
          default:
            return item
        }
      })
    }
    case 'item/patch': {
      if (event.itemId === undefined) return detail
      return patchItem(detail, event.itemId, (item) => ({ ...item, changes: event.payload?.changes ?? item.changes }))
    }
    default:
      return detail
  }
}

function upsertItem(detail: ThreadDetail, turnId: string, item: CodexItem): ThreadDetail {
  const turns = [...detail.turns]
  let turnIndex = turns.findIndex((candidate) => candidate.id === turnId)
  if (turnIndex === -1) {
    turns.push({ id: turnId === '' ? item.id : turnId, items: [], status: 'inProgress' })
    turnIndex = turns.length - 1
  }
  const turn = turns[turnIndex]
  const items = [...(turn.items ?? [])]
  const itemIndex = items.findIndex((candidate) => candidate.id === item.id)
  if (itemIndex === -1) items.push(item)
  else items[itemIndex] = { ...items[itemIndex], ...item }
  turns[turnIndex] = { ...turn, items }
  return { ...detail, turns }
}

function patchItem(detail: ThreadDetail, itemId: string, update: (item: CodexItem) => CodexItem): ThreadDetail {
  let touched = false
  const turns = detail.turns.map((turn) => {
    let turnTouched = false
    const items = (turn.items ?? []).map((item) => {
      if (item.id !== itemId) return item
      turnTouched = true
      return update(item)
    })
    if (!turnTouched) return turn
    touched = true
    return { ...turn, items }
  })
  return touched ? { ...detail, turns } : detail
}

/** 条目里可读的正文（用户消息可能有多段文本）。 */
export function itemText(item: { content?: Array<{ type: string, text?: string }>, text?: string }): string {
  if (Array.isArray(item.content)) {
    const parts = item.content
      .filter((entry) => entry.type === 'text' && typeof entry.text === 'string')
      .map((entry) => entry.text as string)
    if (parts.length > 0) return parts.join('\n')
  }
  return typeof item.text === 'string' ? item.text : ''
}
