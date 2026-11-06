/** Codex 管理页：左侧项目/会话，右侧会话详情 + 审批 + 输入区。 */

import * as React from 'react'
import { I18nContext, fallbackTranslate } from '../i18n'
import { openEventStream, type StreamState } from '../events'
import type { Api } from '../rpc'
import type {
  CodexThread,
  HubStatus,
  PendingApproval,
  Project,
  RateLimits,
  ThreadDetail,
  ThreadPage,
} from '../types'
import { useCodexTab } from '../hooks'
import { subscribePending, takePending } from '../store'
import { applyDetailEvent, messageOf, threadTitle, upsertThread } from '../utils'
import { FocusSidebar } from './FocusSidebar'
import { ProjectPickerDialog } from './ProjectPickerDialog'
import { DirectoryPickerDialog } from './DirectoryPickerDialog'
import { RightPanel, type RightTab } from './RightPanel'
import { ThreadView } from './ThreadView'
import type { Attachment, ModelOption, PermissionMode } from './Composer'
import { ThreadActions } from './ThreadActions'
import { VersionsDialog } from './VersionsDialog'

/** 长会话按回合分页：初始与每页都只取最近/更早的 2 个回合。 */
const TURN_PAGE = 2
/** 侧栏会话列表每页 10 条，搜索由宿主用 searchTerm 在服务端完成。 */
const THREAD_PAGE = 10
/** 记住最后一次打开的会话。 */
const LAST_THREAD_KEY = 'dsh-codex-last-thread'
const VIEWED_KEY = 'dsh-codex-viewed-at'

function readStored(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function readViewedAt(): Record<string, number> {
  try {
    const raw = window.localStorage.getItem(VIEWED_KEY)
    const parsed = raw === null ? null : JSON.parse(raw)
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    const result: Record<string, number> = {}
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === 'number') result[key] = value
    }
    return result
  } catch {
    return {}
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

  const [status, setStatus] = React.useState<HubStatus | null>(null)
  const [projects, setProjects] = React.useState<Project[]>([])
  const [threads, setThreads] = React.useState<CodexThread[]>([])
  const [nextCursor, setNextCursor] = React.useState<string | null>(null)
  const [selectedCwd, setSelectedCwd] = React.useState<string | null>(null)
  const [selectedId, setSelectedId] = React.useState<string | null>(() => readStored(LAST_THREAD_KEY))
  const [detail, setDetail] = React.useState<ThreadDetail | null>(null)
  const [detailLoading, setDetailLoading] = React.useState(false)
  const [olderCursor, setOlderCursor] = React.useState<any>(null)
  const [loadingOlder, setLoadingOlder] = React.useState(false)
  const loadingOlderRef = React.useRef(false)
  const [loadingThreads, setLoadingThreads] = React.useState(false)
  const [threadsOwner, setThreadsOwner] = React.useState<{ cwd: string | null, search: string } | null>(null)
  const [unread, setUnread] = React.useState<Set<string>>(() => new Set())
  const [viewedAt, setViewedAt] = React.useState<Record<string, number>>(readViewedAt)
  const [error, setError] = React.useState<string | null>(null)
  const [streamState, setStreamState] = React.useState<StreamState>('connecting')
  const [search, setSearch] = React.useState('')
  const [pending, setPending] = React.useState<PendingApproval[]>([])
  const [models, setModels] = React.useState<ModelOption[]>([])
  const [quota, setQuota] = React.useState<RateLimits | null>(null)
  const [sessionPermission, setSessionPermission] = React.useState<PermissionMode | null>(null)
  const [planMode, setPlanMode] = React.useState(false)
  const [quotaLoading, setQuotaLoading] = React.useState(true)
  const quotaRef = React.useRef<RateLimits | null>(null)
  quotaRef.current = quota
  const [pickerOpen, setPickerOpen] = React.useState(false)
  const [rightTab, setRightTab] = React.useState<RightTab>('files')
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
    if (quotaRef.current === null) setQuotaLoading(true)
    try {
      setQuota(await api<RateLimits>('account/rateLimits'))
    } catch {
      // 未登录或后端不支持时保持空值。
    } finally {
      setQuotaLoading(false)
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
        api<Project[]>('projects/list', {}),
      ])
      setStatus(nextStatus)
      setProjects(nextProjects)
    } catch (cause) {
      setError(messageOf(cause))
    }
    await loadThreads(null)
    await loadQuota()
  }, [api, loadThreads, loadQuota])

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
    setUnread((previous) => {
      if (!previous.has(id)) return previous
      const next = new Set(previous)
      next.delete(id)
      return next
    })
    setViewedAt((previous) => {
      const next = { ...previous, [id]: Math.floor(Date.now() / 1000) }
      try {
        window.localStorage.setItem(VIEWED_KEY, JSON.stringify(next))
      } catch {
        // 忽略。
      }
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
    api<Array<{ id: string, displayName: string }>>('models/list')
      .then((list) => setModels(list))
      .catch(() => {})
    const quotaTimer = setInterval(() => void loadQuota(), 60000)
    return () => clearInterval(quotaTimer)
  }, [api, refresh, refreshPending, loadQuota])

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
          case 'connection':
            setStatus(event.payload as HubStatus)
            void refreshPending()
            break
          case 'thread/upsert': {
            const thread = event.payload?.thread as CodexThread | null
            if (thread !== null && thread !== undefined) setThreads((previous) => upsertThread(previous, thread))
            break
          }
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
            setDetail((previous) => applyDetailEvent(previous, event))
            if (event.type === 'turn/completed' && event.threadId !== undefined) {
              if (event.threadId === selectedIdRef.current) {
                markViewed(event.threadId)
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
        setDetail(next)
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
  }, [api, selectedId])

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
            setSessionPermission(permissionFromSettings(settings))
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

  const activeTurnId = React.useMemo(() => {
    if (detail === null) return null
    for (let index = detail.turns.length - 1; index >= 0; index -= 1) {
      if (detail.turns[index].status === 'inProgress') return detail.turns[index].id
    }
    return null
  }, [detail])

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
    async (text: string, options: { model?: string, effort?: string, attachments?: Attachment[], permission?: PermissionMode } = {}) => {
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
        await api('turns/start', {
          threadId: selectedId,
          text,
          model: options.model,
          effort: options.effort,
          attachments: options.attachments,
          ...(collaborationMode === undefined ? {} : { collaborationMode }),
          ...permissionPayload,
        })
        // 首条消息落盘后线程才会出现在 thread/list：稍后补一次列表。
        window.setTimeout(() => {
          void loadThreads(null)
        }, 2500)
      } catch (cause) {
        setError(messageOf(cause))
        throw cause
      }
    },
    [api, selectedId, loadThreads, planMode, detail],
  )

  const steer = React.useCallback(
    async (text: string) => {
      if (selectedId === null || activeTurnId === null) return
      setError(null)
      try {
        await api('turns/steer', { threadId: selectedId, turnId: activeTurnId, text })
      } catch (cause) {
        setError(messageOf(cause))
        throw cause
      }
    },
    [api, selectedId, activeTurnId],
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
      const thread = await api<CodexThread>('threads/new', request)
      if (thread !== null && thread !== undefined) {
        const cwd = thread.cwd ?? request.cwd
        setThreads((previous) => upsertThread(previous, thread))
        setSelectedId(thread.id)
        setSelectedCwd(cwd)
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
        return
      }
      setSelectedCwd(cwd)
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
      <div className="dsh-codex-root">
        <FocusSidebar
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
          viewedAt={viewedAt}
          selectedCwd={selectedCwd}
          selectedId={selectedId}
          loading={loadingThreads}
          hasMore={nextCursor !== null}
          search={search}
          onSearch={handleSearch}
          onSelectProject={handleProjectToggle}
          onSelectThread={setSelectedId}
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
              <button type="button" className="dsh-codex-button" style={{ marginLeft: 8 }} onClick={() => void refresh()}>
                {t('error.retry')}
              </button>
            </div>
          ) : null}
          <ThreadView
            api={api}
            detail={detail}
            loading={detailLoading}
            selectedId={selectedId}
            activeTurnId={activeTurnId}
            models={models}
            permissionFromSession={sessionPermission}
            planMode={planMode}
            onEnterPlan={() => setPlanMode(true)}
            onExitPlan={() => setPlanMode(false)}
            hasOlder={olderCursor !== null}
            loadingOlder={loadingOlder}
            onLoadOlder={loadOlder}
            pending={visiblePending}
            onRespond={respond}
            onSend={send}
            onSteer={steer}
            onStop={stop}
            onPickProject={() => setPickerOpen(true)}
            onNew={handleNew}
            onCompact={compactThread}
            onDiff={() => {
              setRightOpen(true)
              setRightTab('git')
            }}
            onExport={() => void exportThread()}
            actions={
              detail !== null ? (
                <div className="dsh-codex-thread-actions">
                  <button
                    type="button"
                    className="dsh-codex-button"
                    onClick={() => setRightOpen((previous) => !previous)}
                  >
                    {rightOpen ? t('right.hide') : t('right.show')}
                  </button>
                  <ThreadActions
                  api={api}
                  thread={detail.thread}
                  onRenamed={(name) => handleThreadRenamed(detail.thread.id, name)}
                  onArchived={() => {
                    setSelectedId(null)
                    void loadThreads(null)
                  }}
                  onForked={(thread) => {
                    if (thread !== null && thread !== undefined) setSelectedId(thread.id)
                  }}
                  onDeleted={() => handleThreadDeleted(detail.thread.id)}
                />
                </div>
              ) : null
            }
          />
        </main>

        <RightPanel
          api={api}
          cwd={detail?.thread.cwd ?? selectedCwd ?? ''}
          open={rightOpen}
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
