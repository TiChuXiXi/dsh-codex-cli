/**
 * 输入区：对齐 DSH 默认 composer 的形态 —— 圆角卡片、无边框输入区、底部工具行、
 * 圆形发送键；模型与推理强度收进同一个菜单。
 */

import * as React from 'react'
import { useT } from '../i18n'

export interface ModelOption {
  id: string
  displayName: string
  description?: string | null
}

export interface ComposerProps {
  disabled: boolean
  activeTurnId: string | null
  models: ModelOption[]
  model: string
  effort: string
  onModelChange: (model: string) => void
  onEffortChange: (effort: string) => void
  onSend: (text: string, options: { model?: string, effort?: string }) => Promise<void>
  onSteer: (text: string) => Promise<void>
  onStop: () => Promise<void>
}

const EFFORTS = ['minimal', 'low', 'medium', 'high'] as const

export function Composer({
  disabled,
  activeTurnId,
  models,
  model,
  effort,
  onModelChange,
  onEffortChange,
  onSend,
  onSteer,
  onStop,
}: ComposerProps) {
  const t = useT()
  const [text, setText] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [menu, setMenu] = React.useState<'model' | null>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

  // 输入框随内容增高，最多 200px。
  React.useEffect(() => {
    const element = textareaRef.current
    if (element === null) return
    element.style.height = 'auto'
    element.style.height = `${Math.min(element.scrollHeight, 200)}px`
  }, [text])

  const currentModel = models.find((entry) => entry.id === model)
  const modelLabel = currentModel?.displayName ?? (model === '' ? t('composer.defaultModel') : model)
  const effortLabel = effort === '' ? t('composer.defaultEffort') : t(`composer.effort.${effort}`)

  const submit = async () => {
    const value = text.trim()
    if (value === '' || busy || disabled) return
    setBusy(true)
    try {
      if (activeTurnId !== null) {
        await onSteer(value)
      } else {
        await onSend(value, {
          model: model === '' ? undefined : model,
          effort: effort === '' ? undefined : effort,
        })
      }
      setText('')
      textareaRef.current?.focus()
    } catch {
      // 失败时保留草稿；错误由页面顶部错误条呈现。
    } finally {
      setBusy(false)
    }
  }

  const stop = async () => {
    if (busy) return
    setBusy(true)
    try {
      await onStop()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="dsh-codex-composer-wrap">
      <div className="dsh-codex-composer-card">
        <textarea
          ref={textareaRef}
          className="dsh-codex-composer-input"
          rows={1}
          value={text}
          disabled={disabled}
          placeholder={activeTurnId === null ? t('composer.placeholder') : t('composer.steerPlaceholder')}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault()
              void submit()
            }
          }}
        />
        <div className="dsh-codex-composer-row">
          <div className="dsh-codex-composer-tools">
            {activeTurnId !== null ? (
              <span className="dsh-codex-running">
                <span className="dsh-codex-dot ok pulse" />
                {t('composer.running')}
              </span>
            ) : null}
          </div>
          <div className="dsh-codex-composer-spacer" />
          <div className="dsh-codex-composer-trailing">
            <button
              type="button"
              className="dsh-codex-model-trigger"
              aria-haspopup="menu"
              aria-expanded={menu !== null}
              title={`${modelLabel} · ${effortLabel}`}
              onClick={() => setMenu(menu === null ? 'model' : null)}
            >
              <ModelGlyph />
              <span className="dsh-codex-model-label">{modelLabel}</span>
              <span className="dsh-codex-model-effort">· {effortLabel}</span>
              <ChevronGlyph />
            </button>
            {activeTurnId !== null ? (
              <button
                type="button"
                className="dsh-codex-stop"
                disabled={busy}
                aria-label={t('composer.stop')}
                title={t('composer.stop')}
                onClick={() => void stop()}
              >
                <StopGlyph />
              </button>
            ) : null}
            <button
              type="button"
              className="dsh-codex-send"
              disabled={disabled || busy || text.trim() === ''}
              aria-label={activeTurnId === null ? t('composer.send') : t('composer.steer')}
              title={activeTurnId === null ? t('composer.send') : t('composer.steer')}
              onClick={() => void submit()}
            >
              <SendGlyph />
            </button>
          </div>
        </div>

        {menu === 'model' ? (
          <>
            <div className="dsh-codex-menu-backdrop" onPointerDown={() => setMenu(null)} />
            <div className="dsh-codex-menu" role="menu">
              <div className="dsh-codex-menu-title">{t('composer.model')}</div>
              <div className="dsh-codex-menu-list">
              {models.map((entry) => (
                <button
                  type="button"
                  key={entry.id}
                  role="menuitemradio"
                  aria-checked={entry.id === model}
                  className={`dsh-codex-menu-item ${entry.id === model ? 'selected' : ''}`}
                  onClick={() => {
                    onModelChange(entry.id)
                    setMenu(null)
                  }}
                >
                  <span className="dsh-codex-menu-check">{entry.id === model ? <CheckGlyph /> : null}</span>
                  <span className="dsh-codex-menu-meta">
                    <span className="dsh-codex-menu-name">{entry.displayName}</span>
                    {entry.description ? <span className="dsh-codex-menu-desc">{entry.description}</span> : null}
                  </span>
                </button>
              ))}
              <button
                type="button"
                role="menuitemradio"
                aria-checked={model === ''}
                className={`dsh-codex-menu-item ${model === '' ? 'selected' : ''}`}
                onClick={() => {
                  onModelChange('')
                  setMenu(null)
                }}
              >
                <span className="dsh-codex-menu-check">{model === '' ? <CheckGlyph /> : null}</span>
                <span className="dsh-codex-menu-meta">
                  <span className="dsh-codex-menu-name">{t('composer.defaultModel')}</span>
                </span>
              </button>
              </div>
              <div className="dsh-codex-menu-title">{t('composer.effort')}</div>
              <div className="dsh-codex-menu-seg">
                {EFFORTS.map((value) => (
                  <button
                    type="button"
                    key={value}
                    className={effort === value ? 'active' : ''}
                    onClick={() => onEffortChange(value)}
                  >
                    {t(`composer.effort.${value}`)}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

function ModelGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
      <path d="M8 1.6 9.6 5.1 13.4 6.6 9.6 8.1 8 11.6 6.4 8.1 2.6 6.6 6.4 5.1 8 1.6Z" strokeLinejoin="round" />
      <path d="M12.6 10.4l.7 1.5 1.5.7-1.5.7-.7 1.5-.7-1.5-1.5-.7 1.5-.7.7-1.5Z" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
      <path d="M4 6l3.3 3.3a1 1 0 0 0 1.4 0L12 6" strokeLinecap="round" />
    </svg>
  )
}

function SendGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M8 13V3M3.6 7.4 8 3l4.4 4.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StopGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
      <rect x="2.5" y="2.5" width="7" height="7" rx="1.2" />
    </svg>
  )
}

function CheckGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
