import * as React from 'react'
import type { Api } from '../rpc'
import type { FollowupEntry, FollowupSnapshot } from '../types'
import { Icon, IconButton } from '../components/Icon'
import { useT } from '../i18n'

export function FollowupList({ snapshot, api, onChange, activeTurnId }: {
  snapshot: FollowupSnapshot
  api: Api
  onChange: (snapshot: FollowupSnapshot) => void
  activeTurnId: string | null
}) {
  const t = useT()
  const collapseKey = 'dsh-codex-followups-collapsed:' + snapshot.threadId
  const [collapsed, setCollapsed] = React.useState(() => {
    try { return localStorage.getItem(collapseKey) === '1' } catch { return false }
  })
  const toggleCollapsed = () => {
    setCollapsed(value => {
      try { localStorage.setItem(collapseKey, value ? '0' : '1') } catch {}
      return !value
    })
  }
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState('')
  const pending = React.useRef(false)
  const action = async (action: string, id?: string, text?: string) => {
    if (pending.current) return
    pending.current = true
    setBusy(true)
    setError('')
    try {
      onChange(await api<FollowupSnapshot>('followups/action', { threadId: snapshot.threadId, action, id, text }))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      pending.current = false
      setBusy(false)
    }
  }
  if (!snapshot.entries.length) return null
  return <section className="dsh-codex-followups" aria-label={t('queue.title')}>
    <header>
      <button type="button" className="dsh-codex-followup-toggle" aria-label={t(collapsed ? 'queue.expand' : 'queue.collapse')} aria-expanded={!collapsed} aria-controls={'followups-' + snapshot.threadId} onClick={toggleCollapsed}>
        <Icon name={collapsed ? 'chevronRight' : 'chevronDown'} size={14} />{t('queue.title')} · {snapshot.entries.length}
      </button>
      {snapshot.paused
        ? <button type="button" disabled={busy} onClick={() => void action('resume')}>{t('queue.resume')}</button>
        : <small>{t('queue.auto')}</small>}
    </header>
    <div className="dsh-codex-followup-list" id={'followups-' + snapshot.threadId} hidden={collapsed}>
      {snapshot.entries.map(entry => <FollowupRow key={entry.id} entry={entry} busy={busy} activeTurnId={activeTurnId} action={action} />)}
    </div>
    {error && <div className="dsh-codex-followup-error" role="alert">{error}</div>}
  </section>
}

function FollowupRow({ entry, busy, activeTurnId, action }: {
  entry: FollowupEntry
  busy: boolean
  activeTurnId: string | null
  action: (action: string, id: string, text?: string) => Promise<void>
}) {
  const t = useT()
  const [text, setText] = React.useState(entry.params.text)
  React.useEffect(() => { setText(entry.params.text) }, [entry.params.text, entry.status])
  const sending = entry.status === 'sending'
  return <div className="dsh-codex-followup-row" data-status={entry.status}>
    {entry.status === 'editing' ? <div className="dsh-codex-followup-edit">
      <textarea aria-label={t('queue.edit')} value={text} onChange={event => setText(event.target.value)} rows={3} autoFocus
        onKeyDown={event => {
          if (event.nativeEvent.isComposing) return
          if (event.key === 'Escape') { event.preventDefault(); void action('cancel', entry.id) }
          if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); if (text.trim() || entry.params.attachments.length) void action('save', entry.id, text) }
        }} />
      <div>
        <button type="button" disabled={busy} onClick={() => void action('cancel', entry.id)}>{t('queue.cancel')}</button>
        <button type="button" disabled={busy || (!text.trim() && !entry.params.attachments.length)} onClick={() => void action('save', entry.id, text)}>{t('queue.save')}</button>
      </div>
    </div> : <>
      <Icon name={sending ? 'loader' : 'message'} size={14} />
      <div className="dsh-codex-followup-text">
        <span title={entry.params.text}>{entry.params.text || t('queue.attachments')}</span>
        {entry.params.attachments.length > 0 && <small><Icon name="attachment" size={12} />{entry.params.attachments.map(item => item.name).join('、')}</small>}
        {sending && <small>{t('queue.sending')}</small>}
      </div>
      <div className="dsh-codex-followup-actions">
        <button type="button" disabled={busy || sending || !activeTurnId} title={t('queue.steerHint')} onClick={() => void action('steer', entry.id)}><Icon name="arrowRight" size={14} /><span>{t('queue.steer')}</span></button>
        <IconButton icon="pencil" label={t('queue.edit')} disabled={busy || sending} onClick={() => void action('edit', entry.id)} />
        <IconButton icon="trash" label={t('queue.delete')} disabled={busy || sending} onClick={() => void action('delete', entry.id)} />
      </div>
    </>}
    {entry.error && <div className="dsh-codex-followup-error" role="alert">{entry.error}</div>}
  </div>
}
