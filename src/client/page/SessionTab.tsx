/** 右侧栏 Codex tab：按当前 DSH 会话的 cwd 列出该项目的 Codex 会话。 */

import * as React from 'react'
import { useT } from '../i18n'
import type { Api } from '../rpc'
import type { CodexThread, ThreadPage } from '../types'
import { basename, relativeTime, threadTitle } from '../utils'

export interface SessionTabProps {
  api: Api
  sessionId?: string
  useSessions?: (selector: (state: any) => any) => any
  onOpenThread: (threadId: string) => void
  onOpenPage: () => void
  onNewThread: (cwd: string) => void
}

export function SessionTab({ api, sessionId, useSessions, onOpenThread, onOpenPage, onNewThread }: SessionTabProps) {
  const t = useT()
  const cwd = typeof useSessions === 'function'
    ? useSessions((state: any) => {
        const id = sessionId ?? state?.current
        return id === undefined ? undefined : state?.byId?.[id]?.cwd
      })
    : undefined

  const [threads, setThreads] = React.useState<CodexThread[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const load = React.useCallback(async () => {
    if (typeof cwd !== 'string' || cwd === '') {
      setThreads([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const page = await api<ThreadPage>('threads/list', { cwd, limit: 50 })
      setThreads(page.data)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setLoading(false)
    }
  }, [api, cwd])

  React.useEffect(() => {
    void load()
  }, [load])

  if (typeof cwd !== 'string' || cwd === '') {
    return (
      <div className="dsh-codex-tab">
        <div className="dsh-codex-empty">{t('tab.hint')}</div>
      </div>
    )
  }

  return (
    <div className="dsh-codex-tab">
      <header className="dsh-codex-tab-head">
        <div className="dsh-codex-tab-title" title={cwd}>
          <strong>{basename(cwd)}</strong>
          <span>{t('tab.count', { count: threads.length })}</span>
        </div>
        <button type="button" className="dsh-codex-button" disabled={loading} onClick={() => void load()}>
          {t('tab.refresh')}
        </button>
      </header>

      <div className="dsh-codex-tab-actions">
        <button type="button" className="dsh-codex-button primary" onClick={() => onNewThread(cwd)}>
          {t('tab.newThread')}
        </button>
        <button type="button" className="dsh-codex-button" onClick={onOpenPage}>
          {t('tab.openPage')}
        </button>
      </div>

      {error !== null ? <div className="dsh-codex-error">{error}</div> : null}
      {loading && threads.length === 0 ? <div className="dsh-codex-loading">{t('tab.loading')}</div> : null}
      <div className="dsh-codex-tab-list">
        {threads.map((thread) => {
          const status = thread.status?.type ?? 'idle'
          const dotClass = status === 'active' ? 'ok pulse' : status === 'systemError' ? 'error' : ''
          return (
            <button
              type="button"
              key={thread.id}
              className="dsh-codex-thread"
              title={threadTitle(thread)}
              onClick={() => onOpenThread(thread.id)}
            >
              <span className={`dsh-codex-dot ${dotClass}`} />
              <span className="dsh-codex-thread-main">
                <span className="dsh-codex-thread-name">{threadTitle(thread)}</span>
                <span className="dsh-codex-thread-meta">
                  {[thread.model, relativeTime(thread.updatedAt, t)].filter(Boolean).join(' · ')}
                </span>
              </span>
            </button>
          )
        })}
        {!loading && threads.length === 0 && error === null ? (
          <div className="dsh-codex-loading">{t('tab.empty')}</div>
        ) : null}
      </div>
    </div>
  )
}
