/** Shared question interaction for server requests and asynchronous agent messages. */
import * as React from 'react'
import { useT } from '../i18n'

export interface InputQuestion {
  id: string
  header?: string
  question: string
  isSecret?: boolean
  options?: Array<{ label: string, description?: string }> | null
}

export function QuestionForm({ questions, defaultFirst = false, onSubmit }: {
  questions: InputQuestion[]
  defaultFirst?: boolean
  onSubmit: (answers: Record<string, string>) => Promise<void>
}) {
  const t = useT()
  const group = React.useId()
  const [index, setIndex] = React.useState(0)
  const [values, setValues] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(questions.map(question => [question.id, defaultFirst && !question.isSecret ? question.options?.[0]?.label ?? '' : ''])))
  const [other, setOther] = React.useState<Record<string, boolean>>({})
  const [busy, setBusy] = React.useState(false)
  const sending = React.useRef(false)
  const [error, setError] = React.useState('')
  const question = questions[index]
  if (!question) return null
  const options = question.isSecret ? [] : question.options ?? []
  const freeform = options.length === 0 || other[question.id] === true
  const current = values[question.id] ?? ''
  const complete = questions.every(entry => (values[entry.id] ?? '').trim() !== '')
  const setValue = (value: string) => setValues(previous => ({ ...previous, [question.id]: value }))
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (sending.current || !complete) return
    sending.current = true
    setBusy(true)
    setError('')
    try {
      await onSubmit(Object.fromEntries(questions.map(entry => [entry.id, entry.isSecret ? values[entry.id] : values[entry.id].trim()])))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      sending.current = false
      setBusy(false)
    }
  }
  return (
    <form className="dsh-codex-question-form" onSubmit={event => void submit(event)} aria-busy={busy}>
      {questions.length > 1 && <nav className="dsh-codex-question-tabs" aria-label={t('question.navigation')}>
        {questions.map((entry, position) => <button key={entry.id} type="button" disabled={busy}
          aria-current={position === index ? 'step' : undefined}
          className={position === index ? 'selected' : ''}
          onClick={() => setIndex(position)}>
          {position + 1}. {entry.header || t('question.number', { number: position + 1 })}
          {(values[entry.id] ?? '').trim() !== '' ? ' ✓' : ''}
        </button>)}
      </nav>}
      <fieldset disabled={busy} className="dsh-codex-question">
        <legend className="dsh-codex-question-title">{question.question}</legend>
        <div className="dsh-codex-question-choices">
          {options.map((option, position) => <label key={position} className={'dsh-codex-question-choice' + (!freeform && current === option.label ? ' selected' : '')}>
            <input type="radio" name={group + question.id} checked={!freeform && current === option.label}
              onChange={() => { setOther(previous => ({ ...previous, [question.id]: false })); setValue(option.label) }} />
            <span><strong>{option.label}</strong>{option.description && <small>{option.description}</small>}</span>
          </label>)}
          {options.length > 0 && <label className={'dsh-codex-question-choice' + (freeform ? ' selected' : '')}>
            <input type="radio" name={group + question.id} checked={freeform}
              onChange={() => { setOther(previous => ({ ...previous, [question.id]: true })); setValue('') }} />
            <span>{t('question.custom')}</span>
          </label>}
        </div>
        {freeform && <label className="dsh-codex-question-freeform">
          <span>{question.isSecret ? t('question.secret') : t('question.answer')}</span>
          {question.isSecret
            ? <input className="dsh-codex-search" type="password" autoComplete="off" value={current} onChange={event => setValue(event.target.value)} />
            : <textarea className="dsh-codex-search" rows={2} value={current} placeholder={t('question.placeholder')} onChange={event => setValue(event.target.value)} />}
        </label>}
      </fieldset>
      {error && <div className="dsh-codex-question-error" role="alert">{error}</div>}
      <div className="dsh-codex-question-footer">
        <span>{t('question.progress', { current: index + 1, total: questions.length })}</span>
        <div className="dsh-codex-approval-actions">
          {index > 0 && <button className="dsh-codex-button" type="button" disabled={busy} onClick={() => setIndex(index - 1)}>{t('question.previous')}</button>}
          {index < questions.length - 1
            ? <button className="dsh-codex-button primary" type="button" disabled={busy || current.trim() === ''} onClick={() => setIndex(index + 1)}>{t('question.next')}</button>
            : <button className="dsh-codex-button primary" type="submit" disabled={busy || !complete}>{busy ? t('question.sending') : t('approval.submit')}</button>}
        </div>
      </div>
    </form>
  )
}
