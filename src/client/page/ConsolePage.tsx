/** Codex 管理页：左侧项目/会话，右侧会话详情 + 审批 + 输入区。 */

import * as React from 'react'
import { ToastHost } from '../components/Toast'
import type {SkillReference} from '../skills'
import {Icon,IconButton} from '../components/Icon'
import {useAppearance} from '../useAppearance'
import {useDialogFocus} from '../components/DialogFocus'
import { I18nContext, fallbackTranslate } from '../i18n'
import { openEventStream, type StreamState } from '../events'
import type { Api } from '../rpc'
import type {
  CodexEvent,
  CodexThread,
  HubStatus,
  PendingApproval,
  Project,
  RateLimits,
  ThreadDetail,
  FollowupSnapshot,
  ThreadPage,
} from '../types'
import { useCodexTab } from '../hooks'
import { subscribePending, takePending } from '../store'
import { applyDetailEvent, messageOf, threadTitle, upsertThread } from '../utils'
import { activeTurnIdOf } from '../running-time'
import { FocusSidebar } from './FocusSidebar'
import { ProjectPickerDialog } from './ProjectPickerDialog'
import { DirectoryPickerDialog } from './DirectoryPickerDialog'
import { SidebarWorkspace as RightPanel } from '../sidebar/SidebarWorkspace'
import type { RightTab } from './RightPanel'
import { notifyWorkspace } from '../sidebar/workspace-events'
declare const __CODEX_CLIENT_BUILD_ID__: string
import { ThreadView } from './ThreadView'
import type { Attachment, ModelOption, PermissionMode } from './Composer'
import { ThreadActions } from './ThreadActions'
import { VersionsDialog } from './VersionsDialog'

/** 长会话按回合分页：初始与每页都只取最近/更早的 2 个回合。 */
const TURN_PAGE = 2
/** 侧栏会话列表每页 5 条，搜索由宿主用 searchTerm 在服务端完成。 */
const THREAD_PAGE = 5
/** 记住最后一次打开的会话。 */
const LAST_THREAD_KEY = 'dsh-codex-last-thread'
const VIEWED_TURNS_KEY = 'dsh-codex-viewed-turns'

function readStored(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

/** 项目名与宿主一致：取目录名。 */
function projectNameOf(cwd: string): string {
  const trimmed = cwd.replace(/\/+$/u, '')
  const index = trimmed.lastIndexOf('/')
  return index < 0 ? trimmed : trimmed.slice(index + 1)
}

/** 新线程还没进 thread/list 前，先把它乐观地挂到项目树上。 */
function upsertProject(projects: Project[], thread: CodexThread, cwd: string): Project[] {
  const updatedAt = thread.updatedAt ?? Math.floor(Date.now() / 1000)
  const latest = {
    id: thread.id,
    name: thread.name ?? null,
    preview: '',
    status: thread.status?.type ?? null,
  }
  if (projects.some((project) => project.cwd === cwd)) {
    return projects.map((project) =>
      project.cwd === cwd
        ? {
            ...project,
            threadCount: project.threadCount + 1,
            lastUpdatedAt: Math.max(project.lastUpdatedAt, updatedAt),
            latest,
          }
        : project,
    )
  }
  return [
    {
      cwd,
      name: projectNameOf(cwd),
      threadCount: 1,
      activeCount: 0,
      lastUpdatedAt: updatedAt,
      models: thread.model === null || thread.model === undefined || thread.model === '' ? [] : [thread.model],
      git: thread.gitInfo ?? null,
      latest,
    },
    ...projects,
  ]
}

export interface ConsolePageProps {
  api: Api
  onExit?: () => void
  t?: (key: string, vars?: Record<string, string | number>) => string
}

export function ConsolePage(props: ConsolePageProps) {
  const t = props.t ?? fallbackTranslate
  // 父级重渲染可能传入新的函数身份，固定住以免刷新 effect 反复触发。
  const api = React.useMemo(() => props.api, [])
  const onExit = props.onExit ?? (() => {})
  useCodexTab()
  const rootRef=React.useRef<HTMLDivElement>(null)
  const appearance=useAppearance(rootRef)
  const [navWidth, setNavWidth] = React.useState(() => {
    try { const value = Number(localStorage.getItem('dsh-codex-nav-width')); return value >= 260 && value <= 420 ? value : 280 } catch { return 280 }
  })
  const [navResizing, setNavResizing] = React.useState(false)
  const navDrag = React.useRef<{startX:number, width:number} | null>(null)
  const updateNavWidth = (value: number) => {
    const width = Math.round(Math.min(420, Math.max(260, value)))
    setNavWidth(width)
    try { localStorage.setItem('dsh-codex-nav-width', String(width)) } catch {}
  }
  useDialogFocus(rootRef)

  const [status, setStatus] = React.useState<HubStatus | null>(null)
  const [projects, setProjects] = React.useState<Project[]>([])
  const [threads, setThreads] = React.useState<CodexThread[]>([])
  const [nextCursor, setNextCursor] = React.useState<string | null>(null)
  const [selectedCwd, setSelectedCwd] = React.useState<string | null>(null)
  const [selectedId, setSelectedId] = React.useState<string | null>(() => readStored(LAST_THREAD_KEY))
  const [detail, setDetail] = React.useState<ThreadDetail | null>(null)
  const [detailLoading, setDetailLoading] = React.useState(false)
  const [detailReload, setDetailReload] = React.useState(0)
  const [olderCursor, setOlderCursor] = React.useState<any>(null)
  const [loadingOlder, setLoadingOlder] = React.useState(false)
  const loadingOlderRef = React.useRef(false)
  const [loadingThreads, setLoadingThreads] = React.useState(false)
  const [threadsOwner, setThreadsOwner] = React.useState<{ cwd: string | null, search: string } | null>(null)
  const [unread, setUnread] = React.useState<Set<string>>(() => new Set())
  const latestCompletedTurn = React.useRef<Record<string, string>>({})
  const completedEvents = React.useRef<Map<string, CodexEvent>>(new Map())
  const viewedTurns = React.useRef<Set<string> | null>(null)
  if (viewedTurns.current === null) {
    try {
      const saved = JSON.parse(window.localStorage.getItem(VIEWED_TURNS_KEY) ?? '[]')
      viewedTurns.current = new Set(Array.isArray(saved) ? saved.filter((id): id is string => typeof id === 'string') : [])
    } catch {
      viewedTurns.current = new Set()
    }
  }
  const [error, setError] = React.useState<string | null>(null)
  const [streamState, setStreamState] = React.useState<StreamState>('connecting')
  const [followups, setFollowups] = React.useState<Record<string, FollowupSnapshot>>({})
  const updateFollowups = React.useCallback((snapshot: FollowupSnapshot) => {
    setFollowups(previous => {
      const current = previous[snapshot.threadId]
      if (current?.instanceId === snapshot.instanceId && current.revision > snapshot.revision) return previous
      return { ...previous, [snapshot.threadId]: snapshot }
    })
  }, [])
  React.useEffect(() => {
    if (!selectedId || streamState !== 'open') return
    let cancelled = false
    void api<FollowupSnapshot>('followups/list', { threadId: selectedId })
      .then(snapshot => { if (!cancelled) updateFollowups(snapshot) })
      .catch(cause => { if (!cancelled) setError(messageOf(cause)) })
    return () => { cancelled = true }
  }, [api, selectedId, streamState, updateFollowups])
  const [search, setSearch] = React.useState('')
  const [pending, setPending] = React.useState<PendingApproval[]>([])
  const provider = 'openai'
  const providerRef = React.useRef(provider)
  providerRef.current = provider
  const [models, setModels] = React.useState<ModelOption[]>([])
  const [quota, setQuota] = React.useState<RateLimits | null>(null)
  const [sessionPermission, setSessionPermission] = React.useState<{ threadId: string, mode: PermissionMode | null } | null>(null)
  const [planMode, setPlanMode] = React.useState(false)
  const [quotaLoading, setQuotaLoading] = React.useState(true)
  const quotaRef = React.useRef<RateLimits | null>(null)
  quotaRef.current = quota
  const [pickerOpen, setPickerOpen] = React.useState(false)
  const [rightTab, setRightTab] = React.useState<RightTab>('files')
  const [rightRequest, setRightRequest] = React.useState(0)
  React.useEffect(() => {
    const openFile = () => setRightOpen(true)
    window.addEventListener('dsh-codex-open-file', openFile)
    return () => window.removeEventListener('dsh-codex-open-file', openFile)
  }, [])
  const [rightOpen, setRightOpen] = React.useState(() => {
    try {
      return window.localStorage.getItem('dsh-codex-right-open') === '1'
    } catch {
      return false
    }
  })
  const [dirPickerOpen, setDirPickerOpen] = React.useState(false)
  const [versionsOpen, setVersionsOpen] = React.useState(false)
  const restoredRef = React.useRef(selectedId !== null)
  const createThreadRef = React.useRef<(request: { cwd: string }) => Promise<void>>(async () => {})
  const searchTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const listGeneration = React.useRef(0)
  const queryRef = React.useRef<{ search: string, cwd: string | null }>({ search: '', cwd: null })
  queryRef.current = { search: search.trim(), cwd: selectedCwd }

  const selectedIdRef = React.useRef<string | null>(null)
  selectedIdRef.current = selectedId
  const threadsRef = React.useRef<CodexThread[]>([])
  threadsRef.current = threads

  const loadThreads = React.useCallback(
    async (cursor: string | null, override: { search?: string, cwd?: string | null, limit?: number, silent?: boolean, keep?: CodexThread } = {}) => {
      const searchValue = override.search !== undefined ? override.search : queryRef.current.search
      const cwd = override.cwd !== undefined ? override.cwd : queryRef.current.cwd
      const limit = Math.min(200, Math.max(1, override.limit ?? THREAD_PAGE))
      const silent = override.silent === true
      const generation = ++listGeneration.current
      if (!silent) setLoadingThreads(true)
      try {
        const page = await api<ThreadPage>('threads/list', {
          limit,
          provider: providerRef.current,
          ...(cursor ? { cursor } : {}),
          ...(searchValue !== '' ? { search: searchValue } : {}),
          ...(cwd !== null ? { cwd } : {}),
        })
        // 只应用最后一次请求的结果，避免“加载更多”与搜索并发时把旧结果拼进来。
        if (generation !== listGeneration.current) return
        setThreads((previous) => {
          if (!cursor) return override.keep === undefined ? page.data : upsertThread(page.data, override.keep)
          const known = new Set(previous.map((thread) => thread.id))
          return [...previous, ...page.data.filter((thread) => !known.has(thread.id))]
        })
        setNextCursor(page.nextCursor)
        setThreadsOwner({ cwd, search: searchValue })
      } catch (cause) {
        if (generation === listGeneration.current) setError(messageOf(cause))
      } finally {
        if (!silent && generation === listGeneration.current) setLoadingThreads(false)
      }
    },
    [api],
  )

  // 搜索输入防抖：清空或输入变化后 250ms 重新从服务端取第一页。
  const handleSearch = React.useCallback(
    (value: string) => {
      setSearch(value)
      if (searchTimer.current !== null) clearTimeout(searchTimer.current)
      searchTimer.current = setTimeout(() => {
        searchTimer.current = null
        const next = value.trim()
        void loadThreads(null, { search: next, cwd: next === '' ? queryRef.current.cwd : null })
      }, 250)
    },
    [loadThreads],
  )

  React.useEffect(() => () => {
    if (searchTimer.current !== null) clearTimeout(searchTimer.current)
  }, [])

  const loadQuota = React.useCallback(async () => {
    const owner = providerRef.current
    if (quotaRef.current === null) setQuotaLoading(true)
    try {
      const result = await api<RateLimits>('account/rateLimits', {provider: owner})
      if (providerRef.current === owner) setQuota(result)
    } catch {
      if (providerRef.current === owner) setQuota(null)
    } finally {
      if (providerRef.current === owner) setQuotaLoading(false)
    }
  }, [api])

  const refreshPending = React.useCallback(async () => {
    try {
      const result = await api<{ pending: PendingApproval[] }>('approvals/pending')
      setPending(result.pending ?? [])
    } catch {
      // 未连接时忽略；连接恢复后会再拉。
    }
  }, [api])

  const refresh = React.useCallback(async () => {
    setError(null)
    try {
      const [nextStatus, nextProjects] = await Promise.all([
        api<HubStatus>('status'),
        api<Project[]>('projects/list', {provider}),
      ])
      if (providerRef.current !== provider) return
      setStatus(nextStatus)
      setProjects(nextProjects)
    } catch (cause) {
      setError(messageOf(cause))
    }
    await loadThreads(null)
    await loadQuota()
  }, [api, loadThreads, loadQuota, provider])

  // 右侧栏 tab 的导航请求：打开某个线程，或带着 cwd 打开新会话对话框。
  React.useEffect(() => {
    const consume = () => {
      const request = takePending()
      if (request === null) return
      if (request.kind === 'thread') {
        setSelectedId(request.threadId)
      } else {
        void createThreadRef.current({ cwd: request.cwd })
      }
    }
    consume()
    return subscribePending(consume)
  }, [])

  const markViewed = React.useCallback((id: string) => {
    const turnId = latestCompletedTurn.current[id]
    if (turnId) {
      viewedTurns.current!.add(turnId)
      try {
        window.localStorage.setItem(VIEWED_TURNS_KEY, JSON.stringify([...viewedTurns.current!]))
      } catch {
        // 存储不可用时保留当前页面的状态。
      }
    }
    setUnread((previous) => {
      if (!previous.has(id)) return previous
      const next = new Set(previous)
      next.delete(id)
      return next
    })
  }, [])

  React.useEffect(() => {
    if (selectedId === null) return
    markViewed(selectedId)
    try {
      window.localStorage.setItem(LAST_THREAD_KEY, selectedId)
    } catch {
      // 隐私模式忽略。
    }
  }, [selectedId])

  React.useEffect(() => {
    void refresh()
    void refreshPending()
    let cancelled = false
    api<ModelOption[]>('models/list', {provider})
      .then((list) => { if (!cancelled) setModels(list) })
      .catch((cause) => { if (!cancelled) setError(messageOf(cause)) })
    const quotaTimer = setInterval(() => void loadQuota(), 60000)
    return () => { cancelled = true; clearInterval(quotaTimer) }
  }, [api, refresh, refreshPending, loadQuota, provider])

  React.useEffect(() => {
    const timer = setInterval(() => {
      void loadThreads(null, { limit: Math.max(THREAD_PAGE, threadsRef.current.length), silent: true })
    }, 20000)
    return () => clearInterval(timer)
  }, [loadThreads])

  React.useEffect(() => {
    const close = openEventStream({
      onState: setStreamState,
      onEvent: (event) => {
        switch (event.type) {
          case 'hello':
            notifyWorkspace({ workspaceId: '*', path: '.' })
            break
          case 'workspace/changed':
            notifyWorkspace(event.payload)
            break
          case 'connection':
            setStatus(event.payload as HubStatus)
            void refreshPending()
            break
          case 'thread/upsert': {
            const thread = event.payload?.thread as CodexThread | null
            if (thread !== null && thread !== undefined && (thread.modelProvider ?? 'openai') === providerRef.current) setThreads((previous) => upsertThread(previous, thread))
            break
          }
          case 'followups/changed':
            updateFollowups(event.payload)
            break
          case 'thread/status':
            setThreads((previous) =>
              previous.map((thread) =>
                thread.id === event.threadId ? { ...thread, status: event.payload?.status ?? thread.status } : thread,
              ),
            )
            break
          case 'thread/updated': {
            const name = event.payload?.name ?? null
            setThreads((previous) =>
              previous.map((thread) => (thread.id === event.threadId ? { ...thread, name: name ?? thread.name } : thread)),
            )
            setDetail((previous) =>
              previous !== null && previous.thread.id === event.threadId && name !== null
                ? { ...previous, thread: { ...previous.thread, name } }
                : previous,
            )
            // Codex 自动重命名后，列表按 updatedAt 重排，静默重拉一次避免会话“消失”。
            void loadThreads(null, {
              cwd: queryRef.current.cwd,
              search: queryRef.current.search,
              limit: Math.max(THREAD_PAGE, threadsRef.current.length),
              silent: true,
            })
            break
          }
          case 'thread/archived':
          case 'thread/deleted':
            setThreads((previous) => previous.filter((thread) => thread.id !== event.threadId))
            if (event.threadId === selectedIdRef.current) setSelectedId(null)
            break
          case 'approval/requested': {
            const request = event.payload as PendingApproval | null
            if (request === null || request === undefined) break
            setPending((previous) =>
              previous.some((entry) => String(entry.requestId) === String(request.requestId))
                ? previous
                : [...previous, request],
            )
            break
          }
          case 'approval/resolved': {
            const requestId = event.payload?.requestId
            setPending((previous) => previous.filter((entry) => String(entry.requestId) !== String(requestId)))
            break
          }
          case 'resync':
            if (selectedIdRef.current) void api<FollowupSnapshot>('followups/list', { threadId: selectedIdRef.current }).then(updateFollowups).catch(cause => setError(messageOf(cause)))
            void refresh()
            void refreshPending()
            void loadQuota()
            break
          case 'account/rateLimits':
            void loadQuota()
            break
          case 'turn/started':
          case 'turn/completed':
          case 'item/upsert':
          case 'item/delta':
          case 'item/patch':
            if (event.type === 'turn/completed' && event.turnId && event.payload?.turn) {
              completedEvents.current.set(event.turnId, event)
            }
            setDetail((previous) => {
              const next = applyDetailEvent(previous, event)
              if (next && event.type === 'turn/started' && event.threadId === next.thread.id) {
                return { ...next, thread: { ...next.thread, status: { type: 'active' } } }
              }
              return next
            })
            if (event.type === 'turn/completed' && event.threadId !== undefined) {
              if (event.turnId) latestCompletedTurn.current[event.threadId] = event.turnId
              if (event.threadId === selectedIdRef.current) {
                markViewed(event.threadId)
              } else if (event.turnId && viewedTurns.current!.has(event.turnId)) {
                setUnread((previous) => {
                  if (!previous.has(event.threadId!)) return previous
                  const next = new Set(previous)
                  next.delete(event.threadId!)
                  return next
                })
              } else {
                setUnread((previous) => {
                  if (previous.has(event.threadId!)) return previous
                  const next = new Set(previous)
                  next.add(event.threadId!)
                  return next
                })
              }
              if (!threadsRef.current.some((thread) => thread.id === event.threadId)) {
                void loadThreads(null)
              }
            }
            break
          default:
            break
        }
      },
    })
    return close
  }, [refresh, refreshPending, loadThreads, loadQuota, markViewed])

  React.useEffect(() => {
    if (selectedId === null) {
      setDetail(null)
      return undefined
    }
    let cancelled = false
    setError(null)
    setDetailLoading(true)
    setDetail(null)
    setOlderCursor(null)
    setLoadingOlder(false)
    loadingOlderRef.current = false
    api<ThreadDetail>('threads/get', { threadId: selectedId, limit: TURN_PAGE })
      .then((next) => {
        if (cancelled) return
        restoredRef.current = false
        let reconciled = next
        for (const event of completedEvents.current.values()) {
          reconciled = applyDetailEvent(reconciled, event) ?? reconciled
        }
        setDetail(reconciled)
        setOlderCursor(next.nextCursor ?? null)
      })
      .catch((cause) => {
        if (cancelled) return
        setError(messageOf(cause))
        if (restoredRef.current) {
          restoredRef.current = false
          try {
            window.localStorage.removeItem(LAST_THREAD_KEY)
          } catch {
            // 忽略。
          }
          setSelectedId(null)
        }
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [api, selectedId, detailReload])

  React.useEffect(() => {
    if (selectedId === null) return undefined
    let cancelled = false
    let opened = false
    setSessionPermission(null)
    setPlanMode(false)
    api('threads/open', { threadId: selectedId })
      .then(async () => {
        opened = true
        if (cancelled) {
          void api('threads/close', { threadId: selectedId }).catch(() => {})
          return
        }
        try {
          const settings = await api<{
            approvalPolicy: string | null
            approvalsReviewer: string | null
            sandbox: { type: string } | null
            collaborationMode: { mode?: string | null } | null
          } | null>('threads/settings', { threadId: selectedId })
          if (!cancelled) {
            setSessionPermission({ threadId: selectedId, mode: permissionFromSettings(settings) })
            setPlanMode(settings?.collaborationMode?.mode === 'plan')
          }
        } catch {
          // 读不到时保留本地值。
        }
      })
      .catch(() => {
        // 私有实例看不到终端活动线程时 resume 会失败；历史仍可查看。
      })
    return () => {
      cancelled = true
      if (opened) void api('threads/close', { threadId: selectedId }).catch(() => {})
    }
  }, [api, selectedId])

  // 新建/未落盘的线程不在 thread/list 里：详情一拿到就补进侧栏。
  const detailThreadId = detail?.thread.id ?? null
  React.useEffect(() => {
    if (detailThreadId === null || detail === null) return
    setThreads((previous) =>
      previous.some((thread) => thread.id === detailThreadId) ? previous : upsertThread(previous, detail.thread),
    )
  }, [detailThreadId])

  const activeTurnId = React.useMemo(() => activeTurnIdOf(detail), [detail])

  const loadOlder = React.useCallback(async () => {
    if (selectedId === null || olderCursor === null || loadingOlderRef.current) return
    loadingOlderRef.current = true
    setLoadingOlder(true)
    const requestedFor = selectedId
    try {
      const page = await api<ThreadDetail>('threads/get', {
        threadId: selectedId,
        cursor: olderCursor,
        limit: TURN_PAGE,
      })
      setDetail((previous) => {
        if (previous === null || previous.thread.id !== requestedFor) return previous
        const known = new Set(previous.turns.map((turn) => turn.id))
        const older = page.turns.filter((turn) => !known.has(turn.id))
        if (older.length === 0) return previous
        return { ...previous, turns: [...older, ...previous.turns] }
      })
      setOlderCursor(page.nextCursor ?? null)
    } catch (cause) {
      setError(messageOf(cause))
    } finally {
      loadingOlderRef.current = false
      setLoadingOlder(false)
    }
  }, [api, selectedId, olderCursor])

  const send = React.useCallback(
    async (text: string, options: { model?: string, effort?: string, attachments?: Attachment[], skills?:SkillReference[], permission?: PermissionMode } = {}) => {
      if (selectedId === null) return
      setError(null)
      const permission = options.permission ?? 'ask'
      const model = options.model || detail?.thread.model || ''
      const effort = (options.effort || detail?.thread.reasoningEffort) ?? null
      // 计划模式：turn/start 的 collaborationMode 与 TUI 的 /plan 同源；每回合显式带上，关闭标签后下一回合即回到 default。
      const collaborationMode = model === ''
        ? undefined
        : {
            mode: planMode ? 'plan' : 'default',
            settings: { model, reasoning_effort: effort, developer_instructions: null },
          }
      // workspaceWrite / readOnly 的 networkAccess 在协议里是 boolean；只有 externalSandbox 用 "restricted"/"enabled"。
      const workspaceWrite = (networkAccess: boolean) => ({
        type: 'workspaceWrite',
        writableRoots: [],
        networkAccess,
        excludeTmpdirEnvVar: false,
        excludeSlashTmp: false,
      })
      const permissionPayload =
        permission === 'full'
          ? { approvalPolicy: 'never', approvalsReviewer: 'user', sandboxPolicy: { type: 'dangerFullAccess' } }
          : permission === 'read'
            ? {
                approvalPolicy: 'on-request',
                approvalsReviewer: 'user',
                sandboxPolicy: { type: 'readOnly', networkAccess: false },
              }
            : permission === 'approve'
              ? {
                  approvalPolicy: 'on-request',
                  approvalsReviewer: 'auto_review',
                  sandboxPolicy: workspaceWrite(true),
                }
              : {
                  approvalPolicy: 'on-request',
                  approvalsReviewer: 'user',
                  sandboxPolicy: workspaceWrite(false),
                }
      try {
        const snapshot = await api<FollowupSnapshot>('turns/submit', {
          threadId: selectedId,
          text,
          model: options.model,
          effort: options.effort,
          attachments: options.attachments,
          skills:options.skills,
          ...(collaborationMode === undefined ? {} : { collaborationMode }),
          ...permissionPayload,
        })
        updateFollowups(snapshot)
        if (selectedIdRef.current === selectedId) setSessionPermission({ threadId: selectedId, mode: permission })
        // 首条消息落盘后线程才会出现在 thread/list：稍后补一次列表。
        window.setTimeout(() => {
          void loadThreads(null)
        }, 2500)
      } catch (cause) {
        setError(messageOf(cause))
        throw cause
      }
    },
    [api, selectedId, loadThreads, planMode, detail, updateFollowups],
  )

  const stop = React.useCallback(async () => {
    if (selectedId === null || activeTurnId === null) return
    setError(null)
    try {
      await api('turns/interrupt', { threadId: selectedId, turnId: activeTurnId })
    } catch (cause) {
      setError(messageOf(cause))
    }
  }, [api, selectedId, activeTurnId])

  const respond = React.useCallback(
    async (requestId: string | number, response: any) => {
      setError(null)
      try {
        await api('approvals/respond', { requestId, response })
        setPending((previous) => previous.filter((entry) => String(entry.requestId) !== String(requestId)))
      } catch (cause) {
        setError(messageOf(cause))
        throw cause
      }
    },
    [api],
  )

  const createThread = React.useCallback(
    async (request: { cwd: string }) => {
      const thread = await api<CodexThread>('threads/new', {...request, provider: providerRef.current})
      if (thread !== null && thread !== undefined) {
        const cwd = thread.cwd ?? request.cwd
        setThreads((previous) => upsertThread(previous, thread))
        setSelectedId(thread.id)
        setSelectedCwd(cwd)
        queryRef.current={cwd,search:''}
        setPickerOpen(false)
        setDirPickerOpen(false)
        // 新建项目后立刻把它挂进项目树，并展开到该项目。
        if (searchTimer.current !== null) {
          clearTimeout(searchTimer.current)
          searchTimer.current = null
        }
        setSearch('')
        setProjects((previous) => upsertProject(previous, thread, cwd))
        void loadThreads(null, { cwd, search: '', keep: thread })
      }
    },
    [api, loadThreads],
  )
  createThreadRef.current = createThread



  const currentCwd = detail?.thread.cwd ?? selectedCwd

  React.useEffect(() => {
    try {
      window.localStorage.setItem('dsh-codex-right-open', rightOpen ? '1' : '0')
    } catch {
      // 忽略。
    }
  }, [rightOpen])
  const handleNew = React.useCallback(() => {
    if (currentCwd !== null && currentCwd !== '') {
      void createThread({ cwd: currentCwd }).catch((cause) => setError(messageOf(cause)))
      return
    }
    setPickerOpen(true)
  }, [currentCwd, createThread])

  // 「新建项目」：直接打开目录浏览器，默认从宿主家目录（~）起步。
  const openNewProject = React.useCallback(() => {
    setPickerOpen(false)
    setDirPickerOpen(true)
  }, [])

  const exportThread = React.useCallback(async () => {
    if (selectedId === null) return
    try {
      const result = await api<{ filename: string, content: string }>('threads/export', { threadId: selectedId })
      const blob = new Blob([result.content], { type: 'text/markdown;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = result.filename
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 2000)
    } catch (cause) {
      setError(messageOf(cause))
    }
  }, [api, selectedId])

  const compactThread = React.useCallback(async () => {
    if (selectedId === null) return
    try {
      await api('threads/compact', { threadId: selectedId })
    } catch (cause) {
      setError(messageOf(cause))
    }
  }, [api, selectedId])

  const pickProject = React.useCallback(
    async (cwd: string) => {
      await createThread({ cwd })
    },
    [createThread],
  )

  const visibleThreads = React.useMemo(
    () => [...threads].sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0)),
    [threads],
  )

  const handleProjectToggle = React.useCallback(
    (cwd: string) => {
      if (selectedCwd === cwd) {
        setSelectedCwd(null)
        queryRef.current={cwd:null,search:''}
        return
      }
      setSelectedCwd(cwd)
      queryRef.current={cwd,search:''}
      setSearch('')
      if (searchTimer.current !== null) {
        clearTimeout(searchTimer.current)
        searchTimer.current = null
      }
      void loadThreads(null, { cwd, search: '' })
    },
    [selectedCwd, loadThreads],
  )

  // 打开某个会话后自动展开它所属的项目。
  const detailCwd = detail?.thread.cwd ?? null
  React.useEffect(() => {
    if (detailCwd === null || detailCwd === '' || search.trim() !== '') return
    if (selectedCwd === detailCwd) return
    setSelectedCwd(detailCwd)
    queryRef.current={cwd:detailCwd,search:''}
    void loadThreads(null, { cwd: detailCwd, search: '' })
  }, [detailCwd, search])

  const handleThreadRenamed = React.useCallback((id: string, name: string) => {
    setThreads((previous) => previous.map((thread) => (thread.id === id ? { ...thread, name } : thread)))
    setDetail((previous) =>
      previous !== null && previous.thread.id === id
        ? { ...previous, thread: { ...previous.thread, name } }
        : previous,
    )
  }, [])

  const handleThreadChanged = React.useCallback(() => {
    void loadThreads(null)
  }, [loadThreads])

  const handleThreadDeleted = React.useCallback((id: string) => {
    setThreads((previous) => previous.filter((thread) => thread.id !== id))
    if (selectedIdRef.current === id) {
      setSelectedId(null)
      setDetail(null)
    }
  }, [])

  const visiblePending = React.useMemo(
    () =>
      selectedId === null
        ? []
        : pending.filter((entry) => entry.params?.threadId === undefined || entry.params.threadId === selectedId),
    [pending, selectedId],
  )

  const totalThreads = projects.reduce((sum, project) => sum + project.threadCount, 0)

  const runningCount = projects.reduce((sum, project) => sum + project.activeCount, 0)

  return (
    <I18nContext.Provider value={t}>
      <div ref={rootRef} onDragOverCapture={event => {if (Array.from(event.dataTransfer.types).includes('Files')) event.preventDefault()}} onDropCapture={event => {if (Array.from(event.dataTransfer.types).includes('Files')) event.preventDefault()}} style={{'--codex-nav-width': navWidth + 'px'} as React.CSSProperties} className={'dsh-codex-root'+(navResizing?' is-nav-resizing':'')+(appearance.collapsed?' is-nav-collapsed':'')+(appearance.navOpen?' is-nav-open':'')+(rightOpen?' has-right':'')} data-codex-theme={appearance.theme} data-client-build={__CODEX_CLIENT_BUILD_ID__}>
        <ToastHost />
        <header className="dsh-codex-workbench-header">
          <IconButton icon="panelLeft" label="展开或折叠项目栏" aria-expanded={appearance.navOpen||!appearance.collapsed} aria-controls="dsh-codex-project-nav" onClick={appearance.toggleNav}/>
          <h1>{detail?threadTitle(detail.thread):'Codex 工作台'}</h1>
          <span className="dsh-codex-spacer"/>
          <IconButton icon={appearance.theme==='dark'?'sun':'moon'} label={appearance.theme==='dark'?'切换浅色模式':'切换深色模式'} aria-disabled={appearance.busy} onClick={appearance.toggleTheme}/>
          {detail&&<ThreadActions api={api} thread={detail.thread}
            onRenamed={name=>handleThreadRenamed(detail.thread.id,name)}
            onArchived={()=>{setSelectedId(null);void loadThreads(null)}}
            onForked={thread=>{if(thread?.id)setSelectedId(thread.id)}}
            onDeleted={()=>handleThreadDeleted(detail.thread.id)}/>}
          <IconButton icon="panelRight" label={rightOpen?t('right.hide'):t('right.show')} aria-expanded={rightOpen} className={rightOpen?'is-selected':''} onClick={()=>setRightOpen(value=>!value)}/>
        </header>
        {appearance.navOpen&&<button type="button" className="dsh-codex-nav-backdrop" aria-label="关闭项目导航" onClick={appearance.closeNav}/>}

        <div className="dsh-codex-nav-resize" role="separator" aria-label="调整项目栏宽度" aria-orientation="vertical" aria-valuemin={260} aria-valuemax={420} aria-valuenow={navWidth} tabIndex={appearance.collapsed ? -1 : 0}
          onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); updateNavWidth(navWidth + (event.key === 'ArrowRight' ? 10 : -10)) } }}
          onPointerDown={event => { if (event.button !== 0) return; event.preventDefault(); navDrag.current = {startX:event.clientX, width:navWidth}; setNavResizing(true); event.currentTarget.setPointerCapture(event.pointerId) }}
          onPointerMove={event => { if (navDrag.current) updateNavWidth(navDrag.current.width + event.clientX - navDrag.current.startX) }}
          onPointerUp={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); navDrag.current = null; setNavResizing(false) }}
          onPointerCancel={() => { navDrag.current = null; setNavResizing(false) }}
          onLostPointerCapture={() => { navDrag.current = null; setNavResizing(false) }}
        />
        <FocusSidebar
          provider={provider}
          api={api}
          status={status}
          streamState={streamState}
          projects={projects}
          totalThreads={totalThreads}
          runningCount={runningCount}
          quota={quota}
          quotaLoading={quotaLoading}
          threads={visibleThreads}
          threadsOwner={threadsOwner}
          unread={unread}
          selectedCwd={selectedCwd}
          selectedId={selectedId}
          loading={loadingThreads}
          hasMore={nextCursor !== null}
          search={search}
          onSearch={handleSearch}
          onSelectProject={handleProjectToggle}
          onSelectThread={id=>{setSelectedId(id);appearance.closeNav()}}
          onLoadMore={() => void loadThreads(nextCursor)}
          onNew={handleNew}
          onNewProject={openNewProject}
          onVersions={() => setVersionsOpen(true)}
          onRefresh={() => void refresh()}
          onExit={onExit}
          onThreadRenamed={handleThreadRenamed}
          onThreadChanged={handleThreadChanged}
          onThreadDeleted={handleThreadDeleted}
        />
        <main className="dsh-codex-main">
          {error !== null ? (
            <div className="dsh-codex-error">
              {error}
              <button
                type="button"
                className="dsh-codex-button"
                style={{ marginLeft: 8 }}
                onClick={() => {
                  setError(null)
                  setDetailReload((previous) => previous + 1)
                  void refresh()
                }}
              >
                {t('error.retry')}
              </button>
            </div>
          ) : null}
          <ThreadView
            provider={detail?.thread.modelProvider ?? provider}
            api={api}
            detail={detail?.thread.id === selectedId ? detail : null}
            loading={detailLoading || (selectedId !== null && detail?.thread.id !== selectedId)}
            selectedId={selectedId}
            activeTurnId={detail?.thread.id === selectedId ? activeTurnId : null}
            models={models}
            permissionFromSession={sessionPermission?.threadId === selectedId && detail?.thread.id === selectedId ? sessionPermission.mode : null}
            planMode={planMode}
            onEnterPlan={() => setPlanMode(true)}
            onExitPlan={() => setPlanMode(false)}
            hasOlder={olderCursor !== null}
            loadingOlder={loadingOlder}
            onLoadOlder={loadOlder}
            pending={visiblePending}
            onRespond={respond}
            followups={selectedId ? followups[selectedId] : undefined}
            onFollowups={updateFollowups}
            onSend={send}
            onStop={stop}
            onPickProject={() => setPickerOpen(true)}
            onNew={handleNew}
            onCompact={compactThread}
            onDiff={() => {
              setRightOpen(true)
              setRightTab('git')
              setRightRequest(value => value + 1)
            }}
            onExport={() => void exportThread()}

          />
        </main>

        <RightPanel
          api={api}
          cwd={detail?.thread.cwd ?? selectedCwd ?? ''}
          open={rightOpen}
          requestId={rightRequest}
          tab={rightTab}
          onTabChange={setRightTab}
          onClose={() => setRightOpen(false)}
        />

        <ProjectPickerDialog
          open={pickerOpen}
          projects={projects}
          onPick={pickProject}
          onNewProject={openNewProject}
          onClose={() => setPickerOpen(false)}
        />
        <DirectoryPickerDialog
          open={dirPickerOpen}
          api={api}
          onPick={pickProject}
          onClose={() => setDirPickerOpen(false)}
        />
        <footer className="dsh-codex-workbench-status"><span><i className={'dsh-codex-dot '+(streamState==='open'?'ok':'warn')}/>{t('status.events.'+streamState)}</span><span className="dsh-codex-status-branch"><Icon name="git" size={13}/>{detail?.thread.gitInfo?.branch as string||'工作区'}</span><span className="dsh-codex-spacer"/><span>{t('projects.count',{count:totalThreads})}</span><button type="button" onClick={()=>setVersionsOpen(true)}>版本与连接</button></footer>
        <VersionsDialog open={versionsOpen} api={api} onClose={() => setVersionsOpen(false)} />
      </div>
    </I18nContext.Provider>
  )
}

function permissionFromSettings(settings: { approvalPolicy: string | null, approvalsReviewer: string | null, sandbox: { type: string } | null } | null): PermissionMode | null {
  if (settings === null) return null
  if (settings.sandbox?.type === 'dangerFullAccess') return 'full'
  if (settings.sandbox?.type === 'readOnly') return 'read'
  if (settings.approvalsReviewer === 'auto_review') return 'approve'
  if (settings.approvalPolicy === 'never') return 'full'
  return 'ask'
}
