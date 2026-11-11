import type { CodexItem } from './types'

export type ActivityStatus = 'running' | 'failed' | 'interrupted' | 'completed' | null

function itemStatus(item: CodexItem): ActivityStatus {
  const result = item.result as { isError?: boolean } | null | undefined
  if (item.error || result?.isError || (typeof item.exitCode === 'number' && item.exitCode !== 0)
    || ['failed', 'error', 'declined'].includes(item.status ?? '')) return 'failed'
  if (['inProgress', 'running', 'pending'].includes(item.status ?? '')) return 'running'
  if (['interrupted', 'cancelled', 'canceled'].includes(item.status ?? '')) return 'interrupted'
  return item.status === 'completed' ? 'completed' : null
}

/** Count executions, not paths; missing status must never count as success. */
export function activityCounts(items: CodexItem[]) {
  const counts = { failed: 0, completed: 0, running: 0, interrupted: 0, unknown: 0 }
  for (const item of items) counts[itemStatus(item) ?? 'unknown']++
  return counts
}

export function activityStatus(items: CodexItem[]): ActivityStatus {
  const counts = activityCounts(items)
  if (counts.failed) return 'failed'
  if (counts.running) return 'running'
  if (counts.interrupted) return 'interrupted'
  return counts.completed > 0 && counts.unknown === 0 ? 'completed' : null
}
