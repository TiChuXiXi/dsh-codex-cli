/** 顶栏：连接状态、传输方式、版本、事件流状态、刷新。 */

import * as React from 'react'
import { useT } from '../i18n'
import type { HubStatus } from '../types'
import type { StreamState } from '../events'

export interface StatusHeaderProps {
  status: HubStatus | null
  streamState: StreamState
  onRefresh: () => void
  onNew?: () => void
}

export function StatusHeader({ status, streamState, onRefresh, onNew }: StatusHeaderProps) {
  const t = useT()
  const phase = status?.phase ?? 'connecting'
  const phaseClass = phase === 'ready' ? 'ok' : phase === 'error' ? 'error' : 'warn'
  return (
    <header className="dsh-codex-header">
      <div className="dsh-codex-title">
        <strong>{t('app.title')}</strong>
        <span>{t('app.subtitle')}</span>
      </div>
      <div className="dsh-codex-spacer" />
      <span className="dsh-codex-badge" title={status?.error ?? undefined}>
        <i className={`dsh-codex-dot ${phaseClass} ${phase === 'connecting' ? 'pulse' : ''}`} />
        {t(`status.${phase}`)}
      </span>
      {status?.kind ? <span className="dsh-codex-badge">{t(`status.${status.kind}`)}</span> : null}
      {status?.codexVersion ? (
        <span className="dsh-codex-badge">{t('status.version', { version: status.codexVersion })}</span>
      ) : null}
      <span className="dsh-codex-badge">
        <i className={`dsh-codex-dot ${streamState === 'open' ? 'ok' : 'warn'} ${streamState === 'connecting' ? 'pulse' : ''}`} />
        {t(`status.events.${streamState}`)}
      </span>
      {onNew !== undefined ? (
        <button type="button" className="dsh-codex-button primary" onClick={onNew}>
          {t('newThread.open')}
        </button>
      ) : null}
      <button type="button" className="dsh-codex-button" onClick={onRefresh}>
        {t('status.refresh')}
      </button>
    </header>
  )
}
