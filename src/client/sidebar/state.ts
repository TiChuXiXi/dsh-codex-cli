import { DockController } from '../../../vendor/dsh-dockkit/engine/controller.ts'
import type {
  LayoutState,
  TabId,
  TabRecord,
} from '../../../vendor/dsh-dockkit/contract/types.ts'

export const STORAGE_VERSION = 1
export const KINDS = new Set([
  'guide',
  'files',
  'git',
  'terminal',
  'browser',
  'document',
])
export const TITLES: Record<string, string> = {
  guide: '新建标签页',
  files: '工作区文件',
  git: '版本管理',
  terminal: '终端',
  browser: '浏览器',
}
export const layoutKey = (cwd: string) => 'dsh-codex-sidebar:' + cwd

/** Reject corrupt graphs before they reach the recursive renderer. */
export function restoreLayout(
  raw: string | null,
): { state: LayoutState; width: number; seed: number } | undefined {
  try {
    if (!raw || raw.length > 250000) return
    const saved = JSON.parse(raw)
    if (saved.version !== STORAGE_VERSION) return
    const s = saved.state
    if (
      !s ||
      !s.nodes ||
      !s.tabs ||
      !Array.isArray(s.floats) ||
      typeof s.expanded !== 'boolean' ||
      !['push', 'fullscreen'].includes(s.mode)
    )
      return
    const nodes = Object.values(s.nodes) as any[],
      tabs = Object.values(s.tabs) as any[]
    if (
      !nodes.length ||
      nodes.length > 100 ||
      tabs.length > 200 ||
      s.floats.length > 100
    )
      return
    const visited = new Set<string>(),
      owned = new Set<string>()
    const walk = (id: string, floating: boolean): boolean => {
      const n = Object.hasOwn(s.nodes, id) ? s.nodes[id] : null
      if (!n || visited.has(id) || n.id !== id) return false
      visited.add(id)
      if (n.kind === 'split')
        return (
          !floating &&
          ['row', 'column'].includes(n.axis) &&
          Array.isArray(n.children) &&
          n.children.length >= 2 &&
          Array.isArray(n.sizes) &&
          n.sizes.length === n.children.length &&
          n.sizes.every((x: any) => Number.isFinite(x) && x > 0) &&
          Math.abs(n.sizes.reduce((a: number, b: number) => a + b, 0) - 1) <
            0.001 &&
          n.children.every(
            (child: any) => typeof child === 'string' && walk(child, false),
          )
        )
      if (
        n.kind !== 'pane' ||
        n.host !== (floating ? 'float' : 'dock') ||
        !Array.isArray(n.tabs)
      )
        return false
      if (
        floating &&
        (!n.rect ||
          !['x', 'y', 'width', 'height'].every((k) =>
            Number.isFinite(n.rect[k]),
          ) ||
          n.rect.width <= 0 ||
          n.rect.height <= 0 ||
          n.tabs.length !== 1)
      )
        return false
      if (
        n.tabs.length ? !n.tabs.includes(n.activeTabId) : n.activeTabId != null
      )
        return false
      return n.tabs.every((tab: any) => {
        if (
          typeof tab !== 'string' ||
          owned.has(tab) ||
          !Object.hasOwn(s.tabs, tab)
        )
          return false
        const t = s.tabs[tab]
        if (
          t.id !== tab ||
          !KINDS.has(t.kind) ||
          typeof t.contentId !== 'string' ||
          t.contentId.length > 8192 ||
          typeof t.title !== 'string' ||
          t.title.length > 512
        )
          return false
        owned.add(tab)
        return true
      })
    }
    if (
      !walk(s.rootId, false) ||
      !s.floats.every((id: any) => typeof id === 'string' && walk(id, true)) ||
      visited.size !== nodes.length ||
      owned.size !== tabs.length ||
      s.nodes[s.activePaneId]?.kind !== 'pane'
    )
      return
    const ids = [...Object.keys(s.nodes), ...Object.keys(s.tabs)]
    const seed = Math.max(
      0,
      ...ids.map((id) => Number(id.match(/(\d+)$/)?.[1] || 0)),
    )
    if (!Number.isSafeInteger(seed) || seed > 10000000) return
    // Older layouts may contain splits. Keep their tabs together in one dock.
    if (s.nodes[s.rootId].kind === 'split') {
      const dockPanes: any[] = []
      const collect = (id: string) => {
        const node = s.nodes[id]
        if (node.kind === 'pane') dockPanes.push(node)
        else node.children.forEach(collect)
      }
      collect(s.rootId)
      const active = dockPanes.find(p => p.id === s.activePaneId) ?? dockPanes[0]
      const mergedTabs = dockPanes.flatMap(p => p.tabs)
      const pane = {...active, tabs: mergedTabs, activeTabId: active.activeTabId ?? mergedTabs[0] ?? null}
      const nodes: Record<string, unknown> = {[pane.id]: pane}
      for (const id of s.floats) nodes[id] = s.nodes[id]
      s.nodes = nodes
      s.rootId = pane.id
      if (!s.floats.includes(s.activePaneId)) s.activePaneId = pane.id
    }
    return {
      state: s,
      width: Math.min(1100, Math.max(320, Number(saved.width) || 480)),
      seed,
    }
  } catch {
    return
  }
}

const guide = (id: TabId): TabRecord => ({
  id,
  kind: 'guide',
  contentId: id,
  title: TITLES.guide,
})
export function createSidebar(saved?: ReturnType<typeof restoreLayout>) {
  return new DockController({
    makeInitialTab: guide,
    makePaneTab: guide,
    initialState: saved?.state,
    idSeed: saved?.seed,
  })
}
export function serializeLayout(state: LayoutState, width: number) {
  return JSON.stringify({ version: STORAGE_VERSION, state, width })
}
