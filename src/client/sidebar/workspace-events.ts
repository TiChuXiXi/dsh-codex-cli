type Change = { workspaceId: string; path: string }
const listeners = new Set<(change: Change) => void>()
export function notifyWorkspace(change: Change) {
  for (const listener of listeners) listener(change)
}
export function subscribeWorkspace(listener: (change: Change) => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
