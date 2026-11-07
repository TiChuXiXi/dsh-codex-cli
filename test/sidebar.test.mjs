import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createSidebar,
  restoreLayout,
  serializeLayout,
} from '../src/client/sidebar/state.ts'

test('restored split/float layout retains content and mints unique IDs', () => {
  const c = createSidebar()
  c.openContent({ kind: 'files', contentId: 'files', title: '文件' })
  c.splitPane()
  const terminal = c.openContent({
    kind: 'terminal',
    contentId: 'terminal-1',
    title: '终端',
  })
  c.floatTab(terminal, { x: 200, y: 100, width: 450, height: 400 })
  const raw = serializeLayout(c.getSnapshot().state, 540)
  const saved = restoreLayout(raw)
  assert.ok(saved)
  const restored = createSidebar(saved)
  assert.equal(restored.getSnapshot().state.nodes[restored.getSnapshot().state.rootId].kind, 'pane')
  assert.deepEqual(Object.keys(restored.getSnapshot().state.tabs).sort(), Object.keys(c.getSnapshot().state.tabs).sort())
  const before = new Set(Object.keys(saved.state.tabs))
  const browser = restored.openContent({
    kind: 'browser',
    contentId: 'browser-1',
    title: '浏览器',
  })
  assert.equal(before.has(browser), false)
  assert.equal(
    Object.keys(restored.getSnapshot().state.tabs).length,
    before.size + 1,
  )
  assert.ok(restoreLayout(serializeLayout(restored.getSnapshot().state, 540)))
})
test('closing the last tab in a split allows the empty pane to collapse', () => {
  const controller = createSidebar()
  controller.splitPane()
  let state = controller.getSnapshot().state
  const pane = state.nodes[state.activePaneId]
  controller.closeTab(pane.tabs[0])
  controller.mergeEmptyPane(pane.id)
  state = controller.getSnapshot().state
  assert.equal(state.nodes[state.rootId].kind, 'pane')
  assert.ok(state.nodes[state.rootId].tabs.length > 0)
})

test('corrupt persisted layout rejects cycles and missing or multiply owned tabs', () => {
  const base = JSON.parse(
    serializeLayout(createSidebar().getSnapshot().state, 480),
  )
  const root = base.state.rootId
  const variants = [
    {
      ...base,
      state: {
        ...base.state,
        nodes: {
          [root]: {
            kind: 'split',
            id: root,
            axis: 'row',
            children: [root, root],
            sizes: [0.5, 0.5],
          },
        },
      },
    },
    { ...base, state: { ...base.state, tabs: {} } },
    { ...base, state: { ...base.state, activePaneId: 'missing' } },
    { ...base, version: 999 },
  ]
  for (const item of variants)
    assert.equal(restoreLayout(JSON.stringify(item)), undefined)
  const duplicate = structuredClone(base)
  duplicate.state.nodes[root].tabs.push(duplicate.state.nodes[root].tabs[0])
  assert.equal(restoreLayout(JSON.stringify(duplicate)), undefined)
})
test('restoration bounds persisted width and ignores invalid JSON', () => {
  assert.equal(restoreLayout('{'), undefined)
  const raw = serializeLayout(createSidebar().getSnapshot().state, 999999)
  assert.equal(restoreLayout(raw).width, 1100)
})
test('content deduplication, close background tab and independent workspaces', () => {
  const a = createSidebar(),
    b = createSidebar()
  const files = a.openContent({
    kind: 'files',
    contentId: 'files',
    title: '文件',
  })
  assert.equal(
    a.openContent({ kind: 'files', contentId: 'files', title: '文件' }),
    files,
  )
  const git = a.openContent({ kind: 'git', contentId: 'git', title: 'Git' })
  a.closeTab(files)
  assert.equal(
    a.getSnapshot().state.nodes[a.activeDockPaneId()].activeTabId,
    git,
  )
  assert.equal(
    Object.values(b.getSnapshot().state.tabs).some((t) => t.kind === 'git'),
    false,
  )
})
