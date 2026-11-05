/**
 * 跨面板导航：右侧栏 Codex tab 与主面板管理页是同一插件的两个槽位，
 * 用一个模块级小仓库传递「打开某个线程 / 以某个 cwd 新建」的请求。
 *
 * 主面板切走时会被卸载，所以请求要能跨挂载保留，直到管理页取走。
 */

export type PendingRequest =
  | { kind: 'thread', threadId: string }
  | { kind: 'new-thread', cwd: string }

let pending: PendingRequest | null = null
const listeners = new Set<() => void>()

function notify(): void {
  for (const listener of listeners) {
    try {
      listener()
    } catch {
      // 单个订阅者异常不影响其它订阅者
    }
  }
}

export function requestThread(threadId: string): void {
  pending = { kind: 'thread', threadId }
  notify()
}

export function requestNewThread(cwd: string): void {
  pending = { kind: 'new-thread', cwd }
  notify()
}

/** 取走待处理请求（取走即清空）。 */
export function takePending(): PendingRequest | null {
  const value = pending
  pending = null
  return value
}

/** 订阅新请求；返回取消函数。 */
export function subscribePending(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
