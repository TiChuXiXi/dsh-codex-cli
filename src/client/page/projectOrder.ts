/** Keep absent projects in the order so a temporary list/filter change does not erase their place. */
export function mergeProjectOrder(saved: string[], current: string[]): string[] {
  const seen = new Set<string>()
  return [...saved, ...current].filter(path => typeof path === 'string' && path !== '' && !seen.has(path) && !!seen.add(path))
}

export function moveProject(order: string[], source: string, target: string, position: 'before' | 'after'): string[] {
  if (source === target || !order.includes(source) || !order.includes(target)) return order
  const next = order.filter(path => path !== source)
  next.splice(next.indexOf(target) + (position === 'after' ? 1 : 0), 0, source)
  return next.every((path, index) => path === order[index]) ? order : next
}

export function sortProjects<T extends {cwd: string}>(projects: T[], order: string[]): T[] {
  const rank = new Map(order.map((path, index) => [path, index]))
  return [...projects].sort((a, b) => (rank.get(a.cwd) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.cwd) ?? Number.MAX_SAFE_INTEGER))
}
