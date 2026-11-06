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
  ThreadDetail,
  ThreadPage,
} from '../types'
import { subscribePending, takePending } from '../store'
import { applyDetailEvent, threadTitle, upsertThread } from '../utils'
import { NewThreadDialog, type NewThreadRequest } from './NewThreadDialog'
import { ProjectList } from './ProjectList'
import { StatusHeader } from './StatusHeader'
import { ThreadList } from './ThreadList'
import { ThreadView } from './ThreadView'
import { ThreadActions } from './ThreadActions'
import { VersionsDialog } from './VersionsDialog'

export interface ConsolePageProps {
  api: Api
  t?: (key: string, vars?: Record<string, string | number>) => string
}

export function ConsolePage(props: ConsolePageProps) {
  const t = props.t ?? fallbackTranslate
  const api = props.api

  const [status, setStatus] = React.useState<HubStatus | null>(null)
  const [projects, setProjects] = React.useState<Project[]>([])
  const [threads, setThreads] = React.useState<CodexThread[]>([])
  const [nextCursor, setNextCursor] = React.useState<string | null>(null)
  const [selectedCwd, setSelectedCwd] = React.useState<string | null>(null)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [detail, setDetail] = React.useState<ThreadDetail | null>(null)
  const [detailLoading, setDetailLoading] = React.useState(false)
  const [loadingThreads, setLoadingThreads] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [streamState, setStreamState] = React.useState<StreamState>('connecting')
  const [search, setSearch] = React.useState('')
  const [pending, setPending] = React.useState<PendingApproval[]>([])
  const [models, setModels] = React.useState<Array<{ id: string, displayName: string, description?: string | null }>>([])
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [versionsOpen, setVersionsOpen] = React.useState(false)
  const [newThreadCwd, setNewThreadCwd] = React.useState('')

  const selectedIdRef = React.useRef<string | null>(null)
  selectedIdRef.current = selectedId
  const threadsRef = React.useRef<CodexThread[]>([])
  threadsRef.current = threads

  const loadThreads = React.useCallback(
    async (cursor: string | null) => {
      setLoadingThreads(true)
      try {
        const page = await api<ThreadPage>('threads/list', { limit: 100, ...(cursor ? { cursor } : {}) })
        setThreads((previous) => {
          if (!cursor) return page.data
          const known = new Set(previous.map((thread) => thread.id))
          return [...previous, ...page.data.filter((thread) => !known.has(thread.id))]
        })
        setNextCursor(page.nextCursor)
      } catch (cause) {
        setError(messageOf(cause))
      } finally {
        setLoadingThreads(false)
      }
    },
    [api],
  )

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
  }, [api, loadThreads])

  // 右侧栏 tab 的导航请求：打开某个线程，或带着 cwd 打开新会话对话框。
  React.useEffect(() => {
    const consume = () => {
      const request = takePending()
      if (request === null) return
      if (request.kind === 'thread') {
        setSelectedId(request.threadId)
      } else {
        setNewThreadCwd(request.cwd)
        setDialogOpen(true)
      }
    }
    consume()
    return subscribePending(consume)
  }, [])

  React.useEffect(() => {
    void refresh()
    void refreshPending()
    api<Array<{ id: string, displayName: string }>>('models/list')
      .then((list) => setModels(list))
      .catch(() => {})
  }, [api, refresh, refreshPending])

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
          case 'thread/updated':
            setThreads((previous) =>
              previous.map((thread) =>
                thread.id === event.threadId ? { ...thread, name: event.payload?.name ?? thread.name } : thread,
              ),
            )
            break
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
            break
          case 'turn/started':
          case 'turn/completed':
          case 'item/upsert':
          case 'item/delta':
          case 'item/patch':
            setDetail((previous) => applyDetailEvent(previous, event))
            if (
              event.type === 'turn/completed' &&
              event.threadId !== undefined &&
              !threadsRef.current.some((thread) => thread.id === event.threadId)
            ) {
              void loadThreads(null)
            }
            break
          default:
            break
        }
      },
    })
    return close
  }, [refresh, refreshPending, loadThreads])

  React.useEffect(() => {
    if (selectedId === null) {
      setDetail(null)
      return undefined
    }
    let cancelled = false
    setError(null)
    setDetailLoading(true)
    setDetail(null)
    api<ThreadDetail>('threads/get', { threadId: selectedId, limit: 20 })
      .then((next) => {
        if (!cancelled) setDetail(next)
      })
      .catch((cause) => {
        if (!cancelled) setError(messageOf(cause))
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
    api('threads/open', { threadId: selectedId })
      .then(() => {
        opened = true
        if (cancelled) void api('threads/close', { threadId: selectedId }).catch(() => {})
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

  const send = React.useCallback(
    async (text: string, options: { model?: string, effort?: string } = {}) => {
      if (selectedId === null) return
      setError(null)
      try {
        await api('turns/start', { threadId: selectedId, text, model: options.model, effort: options.effort })
        // 首条消息落盘后线程才会出现在 thread/list：稍后补一次列表。
        window.setTimeout(() => {
          void loadThreads(null)
        }, 2500)
      } catch (cause) {
        setError(messageOf(cause))
        throw cause
      }
    },
    [api, selectedId, loadThreads],
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
    async (request: NewThreadRequest) => {
      const thread = await api<CodexThread>('threads/new', request)
      if (thread !== null && thread !== undefined) {
        setThreads((previous) => upsertThread(previous, thread))
        setSelectedId(thread.id)
        setDialogOpen(false)
      }
    },
    [api],
  )

  const visibleThreads = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    return threads
      .filter((thread) => selectedCwd === null || thread.cwd === selectedCwd)
      .filter((thread) => {
        if (query === '') return true
        const haystack = `${threadTitle(thread)} ${thread.cwd ?? ''}`.toLowerCase()
        return haystack.includes(query)
      })
      .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
  }, [threads, selectedCwd, search])

  const visiblePending = React.useMemo(
    () =>
      selectedId === null
        ? []
        : pending.filter((entry) => entry.params?.threadId === undefined || entry.params.threadId === selectedId),
    [pending, selectedId],
  )

  const defaultCwd = detail?.thread.cwd ?? selectedCwd ?? projects[0]?.cwd ?? ''
  const totalThreads = projects.reduce((sum, project) => sum + project.threadCount, 0)

  return (
    <I18nContext.Provider value={t}>
      <div className="dsh-codex-root">
        <StatusHeader
          status={status}
          streamState={streamState}
          onRefresh={() => void refresh()}
          onNew={() => setDialogOpen(true)}
          onVersions={() => setVersionsOpen(true)}
        />
        {error !== null ? (
          <div className="dsh-codex-error">
            {error}
            <button type="button" className="dsh-codex-button" style={{ marginLeft: 8 }} onClick={() => void refresh()}>
              {t('error.retry')}
            </button>
          </div>
        ) : null}
        <div className="dsh-codex-body">
          <aside className="dsh-codex-sidebar">
            <div className="dsh-codex-sidebar-scroll">
              <ProjectList
                projects={projects}
                totalThreads={totalThreads}
                selectedCwd={selectedCwd}
                onSelect={(cwd) => {
                  setSelectedCwd(cwd)
                  setSearch('')
                }}
              />
              <div className="dsh-codex-section-title">{t('threads.title')}</div>
              <ThreadList
                threads={visibleThreads}
                selectedId={selectedId}
                loading={loadingThreads}
                hasMore={nextCursor !== null && selectedCwd === null && search.trim() === ''}
                search={search}
                showCwd={selectedCwd === null}
                onSearch={setSearch}
                onSelect={setSelectedId}
                onLoadMore={() => void loadThreads(nextCursor)}
              />
            </div>
          </aside>
          <main className="dsh-codex-main">
            <ThreadView
              api={api}
              detail={detail}
              loading={detailLoading}
              selectedId={selectedId}
              activeTurnId={activeTurnId}
              models={models}
              pending={visiblePending}
              onRespond={respond}
              onSend={send}
              onSteer={steer}
              onStop={stop}
              actions={
                detail === null ? undefined : (
                  <ThreadActions
                    api={api}
                    thread={detail.thread}
                    onRenamed={(name) => {
                      setThreads((previous) =>
                        previous.map((thread) => (thread.id === detail.thread.id ? { ...thread, name } : thread)),
                      )
                      setDetail((previous) =>
                        previous === null ? previous : { ...previous, thread: { ...previous.thread, name } },
                      )
                    }}
                    onArchived={() => {
                      setThreads((previous) => previous.filter((thread) => thread.id !== detail.thread.id))
                      setSelectedId(null)
                    }}
                    onForked={(thread) => {
                      setThreads((previous) => upsertThread(previous, thread))
                      setSelectedId(thread.id)
                    }}
                    onDeleted={() => {
                      setThreads((previous) => previous.filter((thread) => thread.id !== detail.thread.id))
                      setSelectedId(null)
                    }}
                  />
                )
              }
            />
          </main>
        </div>
        <VersionsDialog open={versionsOpen} onClose={() => setVersionsOpen(false)} api={api} />
        <NewThreadDialog
          open={dialogOpen}
          defaultCwd={newThreadCwd === '' ? defaultCwd : newThreadCwd}
          projects={projects}
          models={models}
          onClose={() => {
            setDialogOpen(false)
            setNewThreadCwd('')
          }}
          onCreate={createThread}
        />
      </div>
    </I18nContext.Provider>
  )
}

function messageOf(cause: unknown): string {
  if (cause instanceof Error) return cause.message
  return String(cause)
}
