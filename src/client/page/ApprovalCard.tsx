/** 审批与用户输入卡片：服务端请求在这里落地成人能看懂的按钮。 */

import * as React from 'react'
import { useT } from '../i18n'
import type { PendingApproval } from '../types'

export interface ApprovalStackProps {
  approvals: PendingApproval[]
  onRespond: (requestId: string | number, response: any) => Promise<void>
}

export function ApprovalStack({ approvals, onRespond }: ApprovalStackProps) {
  if (approvals.length === 0) return null
  return (
    <div className="dsh-codex-approvals">
      {approvals.map((approval) => (
        <ApprovalCard key={String(approval.requestId)} approval={approval} onRespond={onRespond} />
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
    } finally {
      setBusy(false)
    }
  }

  if (approval.method === 'item/tool/requestUserInput') {
    return <InputCard approval={approval} busy={busy} onRespond={respond} />
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

function InputCard({
  approval,
  busy,
  onRespond,
}: {
  approval: PendingApproval
  busy: boolean
  onRespond: (response: any) => Promise<void>
}) {
  const t = useT()
  const questions = Array.isArray(approval.params?.questions) ? approval.params.questions : []
  const [values, setValues] = React.useState<Record<string, string>>({})

  const submit = () => {
    const answers: Record<string, { answers: string[] }> = {}
    for (const [key, value] of Object.entries(values)) {
      if (value.trim() !== '') answers[key] = { answers: [value.trim()] }
    }
    void onRespond({ answers })
  }

  return (
    <Shell title={t('approval.input')} busy={busy}>
      {questions.map((question: any) => (
        <div key={question.id} className="dsh-codex-question">
          <div className="dsh-codex-question-title">{question.header || question.question}</div>
          {question.header && question.question !== question.header ? (
            <div className="dsh-codex-question-body">{question.question}</div>
          ) : null}
          <div className="dsh-codex-options">
            {(Array.isArray(question.options) ? question.options : []).map((option: any) => (
              <button
                type="button"
                key={option.label}
                className={`dsh-codex-option ${values[question.id] === option.label ? 'selected' : ''}`}
                title={option.description ?? undefined}
                onClick={() => setValues((previous) => ({ ...previous, [question.id]: option.label }))}
              >
                {option.label}
              </button>
            ))}
          </div>
          {question.isOther || (question.options ?? []).length === 0 ? (
            <input
              className="dsh-codex-search"
              type={question.isSecret ? 'password' : 'text'}
              value={values[question.id] ?? ''}
              placeholder={t('approval.other')}
              onChange={(event) => setValues((previous) => ({ ...previous, [question.id]: event.target.value }))}
            />
          ) : null}
        </div>
      ))}
      <Actions>
        <button type="button" className="dsh-codex-button primary" disabled={busy} onClick={submit}>
          {t('approval.submit')}
        </button>
      </Actions>
    </Shell>
  )
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
