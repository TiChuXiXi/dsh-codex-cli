import * as React from 'react'
import {Icon} from '../components/Icon'
import { DockLayout } from '../../../vendor/dsh-dockkit/components/DockSurface'
import { findTabPane } from '../../../vendor/dsh-dockkit/engine/tree'
import type {
  TabRecord,
  PaneId,
} from '../../../vendor/dsh-dockkit/contract/types'
import type { RightPanelProps } from '../page/RightPanel'
import { GitTab, TerminalTab } from '../page/RightPanel'
import { FilesPane } from './FilesPane'
import { DocumentPane } from './DocumentPane'
import {
  createSidebar,
  restoreLayout,
  serializeLayout,
  layoutKey,
  TITLES,
} from './state'
import './sidebar.css'

const labels = {
  emptyPane: '从 + 新建标签页',
  splitPane: '向右分栏',
  splitPaneDisabled: '最多显示两个分栏',
  splitPaneNarrow: '空间不足，请先拉宽面板',
  closeTab: '关闭标签页',
  addTab: '新建标签页',
  dockFloat: '停靠到右栏',
  closeFloat: '关闭浮动窗口',
  dropZone: {
    center: '移到这里',
    left: '左侧分栏',
    right: '右侧分栏',
    top: '上方分栏',
    bottom: '下方分栏',
  },
}
function read(cwd: string) {
  try {
    return restoreLayout(localStorage.getItem(layoutKey(cwd)))
  } catch {
    return undefined
  }
}

export function SidebarWorkspace(props: RightPanelProps) {
  return <Workspace key={props.cwd} {...props} />
}
function Workspace({
  api,
  cwd,
  open,
  tab,
  requestId,
  onClose,
}: RightPanelProps) {
  const saved = React.useMemo(() => read(cwd), [cwd])
  const controller = React.useMemo(() => createSidebar(saved), [saved])
  const { state } = React.useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
  )
  const [width, setWidth] = React.useState(saved?.width ?? 480)
  const [narrow, setNarrow] = React.useState(() => window.innerWidth < 768)
  const [dragging, setDragging] = React.useState(false)
  const sidebarRef = React.useRef<HTMLElement | null>(null)
  React.useEffect(() => {
    const sidebar = sidebarRef.current
    if (!sidebar) return
    const wheel = (event: WheelEvent) => {
      const target = event.target instanceof Element ? event.target.closest('[data-dockkit-strip]') : null
      const tabs = target?.querySelector<HTMLElement>('[data-dockkit-strip-tabs]')
      if (!tabs || tabs.scrollWidth <= tabs.clientWidth) return
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
      if (!delta) return
      event.preventDefault()
      tabs.scrollLeft += delta
    }
    sidebar.addEventListener('wheel', wheel, {passive:false})
    return () => sidebar.removeEventListener('wheel', wheel)
  }, [])
  React.useEffect(() => {
    const change = () => setNarrow(window.innerWidth < 768)
    window.addEventListener('resize', change)
    return () => window.removeEventListener('resize', change)
  }, [])
  React.useEffect(() => {
    if (!cwd) return
    try {
      localStorage.setItem(layoutKey(cwd), serializeLayout(state, width))
    } catch {}
  }, [cwd, state, width])
  const openKind = React.useCallback(
    (kind: string, paneId?: PaneId) => {
      const multiple = kind === 'terminal' || kind === 'browser'
      controller.openContent({
        kind,
        contentId: multiple ? crypto.randomUUID() : kind,
        title: TITLES[kind],
        paneId,
      })
    },
    [controller],
  )
  React.useEffect(() => {
    const openFile = (event: Event) => {
      const path = (event as CustomEvent<unknown>).detail
      if (typeof path !== 'string' || !path.startsWith('/')) return
      controller.openContent({ kind: 'document', contentId: path, title: path.split('/').at(-1) || path })
    }
    window.addEventListener('dsh-codex-open-file', openFile)
    return () => window.removeEventListener('dsh-codex-open-file', openFile)
  }, [controller])
  const initialized = React.useRef(false)
  const lastRequest = React.useRef(requestId)
  const previousOpen = React.useRef(open)
  React.useEffect(() => {
    const requested = lastRequest.current !== requestId
    const reopening = open && !previousOpen.current
    previousOpen.current = open
    lastRequest.current = requestId
    controller.setExpanded(open)
    const current = controller.getSnapshot().state
    const empty = !Object.values(current.nodes).some(node => node.kind === 'pane' && node.host === 'dock' && node.tabs.length > 0)
    if (open && cwd && ((!initialized.current && !saved) || requested || (reopening && empty)))
      openKind(tab)
    if (open) initialized.current = true
  }, [open, tab, cwd, requestId, saved, openKind, controller])
  React.useEffect(() => {
    if (!open) return
    let current = controller.getSnapshot().state
    const emptyPanes = Object.values(current.nodes).filter(node => node.kind === 'pane' && node.host === 'dock' && node.tabs.length === 0 && node.id !== current.rootId)
    for (const pane of emptyPanes) controller.mergeEmptyPane(pane.id)
    current = controller.getSnapshot().state
    const hasDockedTabs = Object.values(current.nodes).some(node => node.kind === 'pane' && node.host === 'dock' && node.tabs.length > 0)
    if (!hasDockedTabs) onClose()
  }, [open, state, controller, onClose])
  React.useEffect(() => {
    if (!open) return
    const key = (event: KeyboardEvent) => {
      if (
        event.key === 'Escape' &&
        !event.defaultPrevented &&
        !event.isComposing &&
        !document.querySelector('[role="dialog"],[role="menu"]')
      ) {
        if (controller.getSnapshot().state.mode === 'fullscreen') {
          controller.setMode('push')
          event.preventDefault()
        }
      }
    }
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
  }, [open, controller])
  const renderTab = React.useCallback(
    (record: TabRecord) => {
      if (record.kind === 'guide')
        return (
          <div className="codex-sidebar-guide">
            <h3><Icon name="panelRight"/>工作区工具</h3>
            {['files', 'git', 'terminal', 'browser'].map((kind) => (
              <button
                key={kind}
                type="button"
                disabled={!cwd}
                onClick={() => {
                  const pane = findTabPane(controller.getSnapshot().state, record.id)
                  openKind(kind, pane?.id)
                  controller.closeTab(record.id)
                }}
              >
                <Icon name={kind==='files'?'folder':kind==='git'?'git':kind==='terminal'?'terminal':'globe'} size={20}/><strong>{TITLES[kind]}</strong>
                <span>
                  {
                    (
                      {
                        files: '浏览工作区文件',
                        git: '查看分支与变更',
                        terminal: '运行命令',
                        browser: '浏览网页与本地服务',
                      } as any
                    )[kind]
                  }
                </span>
              </button>
            ))}
          </div>
        )
      if (record.kind === 'browser') return <BrowserTab />
      if (!cwd) return <div className="dsh-codex-loading">请先选择项目</div>
      if (record.kind === 'files')
        return (
          <FilesPane
            api={api}
            cwd={cwd}
            onOpen={(path) =>
              controller.openContent({
                kind: 'document',
                contentId: path,
                title: path.split('/').at(-1) || path,
                paneId: findTabPane(controller.getSnapshot().state, record.id)
                  .id,
              })
            }
          />
        )
      if (record.kind === 'document')
        return <DocumentPane key={record.contentId} api={api} cwd={cwd} path={record.contentId} onOpen={(path) =>
          controller.openContent({
            kind: 'document',
            contentId: path,
            title: path.split('/').at(-1) || path,
            paneId: findTabPane(controller.getSnapshot().state, record.id).id,
          })
        } />
      if (record.kind === 'git') return <GitTab api={api} cwd={cwd} />
      return <TerminalTab api={api} cwd={cwd} />
    },
    [api, cwd, controller, openKind],
  )
  // Keep the retained tree mounted when collapsed; no duplicate body/PTY on reopening.
  const fullscreen = state.mode === 'fullscreen' || narrow
  const chrome = (
    <>
      <button
        type="button"
        className="codex-sidebar-control"
        aria-label={fullscreen ? '退出右栏全屏' : '右栏全屏'}
        onClick={() =>
          narrow
            ? onClose()
            : controller.setMode(fullscreen ? 'push' : 'fullscreen')
        }
      >
        <Icon name={fullscreen?'minimize':'maximize'}/>
      </button>
      <button
        type="button"
        className="codex-sidebar-control"
        aria-label="收起右侧面板"
        onClick={onClose}
      >
        <Icon name="chevronRight"/>
      </button>
    </>
  )
  return (
    <aside
      ref={sidebarRef}
      className={'codex-sidebar' + (fullscreen ? ' is-fullscreen' : '')+(narrow?' is-narrow':'')}
      data-codex-sidebar
      data-workspace={cwd}
      hidden={!open}
      style={
        fullscreen
          ? undefined
          : { width: Math.min(width, window.innerWidth - 80) }
      }
      aria-label="工作区工具"
    >
      {!fullscreen && (
        <div
          className={'codex-sidebar-resize' + (dragging ? ' active' : '')}
          role="separator"
          aria-label="调整右栏宽度"
          aria-orientation="vertical"
          tabIndex={0}
          aria-valuenow={width}
          aria-valuemin={320}
          aria-valuemax={1100}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault()
              setWidth((w) =>
                Math.max(
                  320,
                  Math.min(1100, w + (event.key === 'ArrowLeft' ? 24 : -24)),
                ),
              )
            }
          }}
          onPointerDown={(event) => {
            if (event.button !== 0) return
            event.preventDefault()
            event.currentTarget.setPointerCapture(event.pointerId)
            setDragging(true)
          }}
          onPointerMove={(event) => {
            if (dragging)
              setWidth(
                Math.max(
                  320,
                  Math.min(1100, window.innerWidth - event.clientX),
                ),
              )
          }}
          onPointerUp={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId))
              event.currentTarget.releasePointerCapture(event.pointerId)
            setDragging(false)
          }}
          onLostPointerCapture={() => setDragging(false)}
        />
      )}
      {narrow&&state.nodes[state.rootId]?.kind==='split'&&<div className="codex-sidebar-mobile-panes" role="tablist" aria-label="切换工作区分栏">{(state.nodes[state.rootId] as any).children.map((id:string,index:number)=><button type="button" key={id} role="tab" aria-selected={state.activePaneId===id} onClick={()=>controller.focusPane(id)}>分栏 {index+1}</button>)}<button type="button" aria-label="收起右侧面板" onClick={onClose}>关闭</button></div>}
      <DockLayout
        state={state}
        active={open}
        canSplit={false}
        hideSplitWhenBlocked
        dropZones="horizontal"
        minPaneFraction={0.2}
        intents={controller}
        labels={labels}
        chrome={chrome}
        renderTab={renderTab}
        keepMounted={() => true}
        renderTabMenuItems={(record, dismiss) => (
          <>
            <button
              role="menuitem"
              type="button"
              onClick={() => {
                controller.floatTab(record.id)
                dismiss()
              }}
            >
              浮动窗口
            </button>
            <button
              role="menuitem"
              type="button"
              onClick={() => {
                const owner = findTabPane(state, record.id)
                if (owner)
                  for (const id of [...owner.tabs])
                    if (id !== record.id) controller.closeTab(id)
                dismiss()
              }}
            >
              关闭其他标签页
            </button>
          </>
        )}
      />
    </aside>
  )
}

export function browserUrl(value: string): string {
  const url = new URL(value.includes('://') ? value : 'https://' + value)
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.origin === window.location.origin
  )
    throw new Error('请输入其他站点的 HTTP(S) 地址')
  return url.href
}
function BrowserTab() {
  const [input, setInput] = React.useState('')
  const [history, setHistory] = React.useState<string[]>([])
  const [index, setIndex] = React.useState(-1)
  const [revision, setRevision] = React.useState(0)
  const [error, setError] = React.useState('')
  const current = history[index]
  const navigate = (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const next = browserUrl(input)
      setHistory((h) => [...h.slice(0, index + 1), next])
      setIndex(index + 1)
      setInput(next)
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }
  return (
    <div className="codex-sidebar-browser">
      <form onSubmit={navigate}>
        <button
          type="button"
          aria-label="后退"
          disabled={index <= 0}
          onClick={() => {
            setIndex(index - 1)
            setInput(history[index - 1])
          }}
        >
          <Icon name="arrowLeft" size={17}/>
        </button>
        <button
          type="button"
          aria-label="前进"
          disabled={index >= history.length - 1}
          onClick={() => {
            setIndex(index + 1)
            setInput(history[index + 1])
          }}
        >
          <Icon name="arrowRight" size={17}/>
        </button>
        <button
          type="button"
          aria-label="刷新网页"
          disabled={!current}
          onClick={() => setRevision((r) => r + 1)}
        >
          <Icon name="refresh" size={17}/>
        </button>
        <input
          aria-label="网址"
          placeholder="输入网址"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">前往</button>
        {current && (
          <a
            href={current}
            target="_blank"
            rel="noopener noreferrer"
            title="在外部浏览器打开"
          >
            <Icon name="external" size={17}/>
          </a>
        )}
      </form>
      {error && <div role="alert">{error}</div>}
      {current ? (
        <iframe
          key={revision}
          src={current}
          title="工作区浏览器"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
        />
      ) : (
        <div className="dsh-codex-loading">
          输入网页地址，预览本地服务或网站。
        </div>
      )}
    </div>
  )
}
