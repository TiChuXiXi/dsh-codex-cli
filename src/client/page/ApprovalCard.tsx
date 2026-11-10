/** 审批与用户输入卡片：服务端请求在这里落地成人能看懂的按钮。 */

import * as React from 'react'
import { useT } from '../i18n'
import type { PendingApproval } from '../types'
import { QuestionForm } from './QuestionForm'

export interface ApprovalStackProps {
  approvals: PendingApproval[]
  onRespond: (requestId: string | number, response: any) => Promise<void>
}

export function ApprovalStack({ approvals, onRespond }: ApprovalStackProps) {
  if (approvals.length === 0) return null
  return (
    <div className="dsh-codex-approvals">
      {approvals.map((approval) => (
        <ApprovalCard key={JSON.stringify([approval.params?.threadId, approval.method, approval.requestId])} approval={approval} onRespond={onRespond} />
      ))}
    </div>
  )
}

function ApprovalCard({
  approval,
  onRespond,
}: {
  approval: PendingApproval
  onRespond: (requestId: string | number, response: any) => Promise<void>
}) {
  const t = useT()
  const [busy, setBusy] = React.useState(false)
  const params = approval.params ?? {}

  const respond = async (response: any) => {
    if (busy) return
    setBusy(true)
    try {
      await onRespond(approval.requestId, response)
    } catch {
      // ConsolePage reports the error; keep the request available for retry.
    } finally {
      setBusy(false)
    }
  }

  if (approval.method === 'item/tool/requestUserInput') {
    return <InputCard approval={approval} onRespond={response => onRespond(approval.requestId, response)} />
  }

  if (approval.method === 'item/commandExecution/requestApproval') {
    return (
      <Shell title={t('approval.command')} busy={busy}>
        <pre className="dsh-codex-command">{params.command ?? ''}</pre>
        {params.cwd ? <div className="dsh-codex-approval-meta">{t('approval.cwd')}: {params.cwd}</div> : null}
        {params.reason ? <div className="dsh-codex-approval-meta">{t('approval.reason')}: {params.reason}</div> : null}
        <Actions>
          <button type="button" className="dsh-codex-button primary" disabled={busy} onClick={() => void respond({ decision: 'accept' })}>
            {t('approval.allow')}
          </button>
          <button type="button" className="dsh-codex-button" disabled={busy} onClick={() => void respond({ decision: 'acceptForSession' })}>
            {t('approval.allowSession')}
          </button>
          <button type="button" className="dsh-codex-button" disabled={busy} onClick={() => void respond({ decision: 'decline' })}>
            {t('approval.deny')}
          </button>
        </Actions>
      </Shell>
    )
  }

  if (approval.method === 'item/fileChange/requestApproval') {
    return (
      <Shell title={t('approval.file')} busy={busy}>
        {params.grantRoot ? <div className="dsh-codex-approval-meta">{t('approval.grantRoot')}: {params.grantRoot}</div> : null}
        {params.reason ? <div className="dsh-codex-approval-meta">{t('approval.reason')}: {params.reason}</div> : null}
        <Actions>
          <button type="button" className="dsh-codex-button primary" disabled={busy} onClick={() => void respond({ decision: 'accept' })}>
            {t('approval.allow')}
          </button>
          <button type="button" className="dsh-codex-button" disabled={busy} onClick={() => void respond({ decision: 'acceptForSession' })}>
            {t('approval.allowSession')}
          </button>
          <button type="button" className="dsh-codex-button" disabled={busy} onClick={() => void respond({ decision: 'decline' })}>
            {t('approval.deny')}
          </button>
        </Actions>
      </Shell>
    )
  }

  if (approval.method === 'item/permissions/requestApproval') {
    return (
      <Shell title={t('approval.permissions')} busy={busy}>
        {params.cwd ? <div className="dsh-codex-approval-meta">{t('approval.cwd')}: {params.cwd}</div> : null}
        {params.reason ? <div className="dsh-codex-approval-meta">{t('approval.reason')}: {params.reason}</div> : null}
        <pre className="dsh-codex-pre">{JSON.stringify(params.permissions ?? {}, null, 2)}</pre>
        <Actions>
          <button
            type="button"
            className="dsh-codex-button primary"
            disabled={busy}
            onClick={() => void respond({ permissions: params.permissions ?? {}, scope: 'turn' })}
          >
            {t('approval.allowTurn')}
          </button>
          <button
            type="button"
            className="dsh-codex-button"
            disabled={busy}
            onClick={() => void respond({ permissions: params.permissions ?? {}, scope: 'session' })}
          >
            {t('approval.allowSession')}
          </button>
          <button type="button" className="dsh-codex-button" disabled={busy} onClick={() => void respond({ permissions: {}, scope: 'turn' })}>
            {t('approval.deny')}
          </button>
        </Actions>
      </Shell>
    )
  }

  return (
    <Shell title={t('approval.elicitation')} busy={busy}>
      <pre className="dsh-codex-pre">{JSON.stringify(params, null, 2)}</pre>
      <Actions>
        <button type="button" className="dsh-codex-button" disabled={busy} onClick={() => void respond({ action: 'decline', content: null, _meta: null })}>
          {t('approval.deny')}
        </button>
        <button type="button" className="dsh-codex-button" disabled={busy} onClick={() => void respond({ action: 'cancel', content: null, _meta: null })}>
          {t('approval.cancel')}
        </button>
      </Actions>
    </Shell>
  )
}

function InputCard({ approval, onRespond }: {
  approval: PendingApproval
  onRespond: (response: any) => Promise<void>
}) {
  const t = useT()
  const questions = Array.isArray(approval.params?.questions) ? approval.params.questions : []
  return <Shell title={t('approval.input')} busy={false}>
    <QuestionForm questions={questions} onSubmit={values => onRespond({
      answers: Object.fromEntries(Object.entries(values).map(([id, value]) => [id, { answers: [value] }])),
    })} />
  </Shell>
}

function Shell({ title, busy, children }: { title: string, busy: boolean, children: React.ReactNode }) {
  return (
    <section className={`dsh-codex-approval ${busy ? 'busy' : ''}`}>
      <header className="dsh-codex-approval-head">
        <span className="dsh-codex-dot warn pulse" />
        <strong>{title}</strong>
      </header>
      {children}
    </section>
  )
}

function Actions({ children }: { children: React.ReactNode }) {
  return <div className="dsh-codex-approval-actions">{children}</div>
}
