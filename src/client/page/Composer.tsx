/**
 * 输入区：对齐 DSH 默认 composer 的形态 —— 圆角卡片、无边框输入区、底部工具行、
 * 圆形发送键；模型与推理强度走两级菜单（与 Codex TUI 的 4 档 + More reasoning 一致）。
 */

import * as React from 'react'
import { useT } from '../i18n'

export interface EffortOption {
  reasoningEffort: string
  description?: string | null
}

export interface ModelOption {
  id: string
  displayName: string
  description?: string | null
  defaultReasoningEffort?: string | null
  supportedReasoningEfforts?: EffortOption[]
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

type Menu = null | 'root' | 'model' | 'effort' | 'more'

/** 模型没有返回 supportedReasoningEfforts 时的兜底，描述与 Codex 一致。 */
const FALLBACK_EFFORTS: EffortOption[] = [
  { reasoningEffort: 'low', description: 'Fast responses with lighter reasoning' },
  { reasoningEffort: 'medium', description: 'Balances speed and reasoning depth for everyday tasks' },
  { reasoningEffort: 'high', description: 'Greater reasoning depth for complex problems' },
  { reasoningEffort: 'xhigh', description: 'Extra high reasoning depth for complex problems' },
  { reasoningEffort: 'max', description: 'Maximum reasoning depth for the hardest problems' },
  { reasoningEffort: 'ultra', description: 'Maximum reasoning with automatic task delegation' },
]

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
  const [menu, setMenu] = React.useState<Menu>(null)
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
  const efforts = currentModel?.supportedReasoningEfforts?.length
    ? currentModel.supportedReasoningEfforts
    : FALLBACK_EFFORTS
  const defaultEffort = currentModel?.defaultReasoningEffort ?? null
  const topEfforts = efforts.slice(0, 4)
  const moreEfforts = efforts.slice(4)
  const effortLabel = effort === '' ? t('composer.defaultEffort') : labelForEffort(t, effort)

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

  const closeMenu = () => setMenu(null)

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
              onClick={() => setMenu(menu === null ? 'root' : null)}
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

        {menu !== null ? (
          <>
            <div className="dsh-codex-menu-backdrop" onPointerDown={closeMenu} />
            <div className="dsh-codex-menu" role="menu">
              {menu === 'root' ? (
                <>
                  <button type="button" className="dsh-codex-menu-cell" onClick={() => setMenu('model')}>
                    <span className="dsh-codex-menu-cell-label">{t('composer.model')}</span>
                    <span className="dsh-codex-menu-cell-value">{modelLabel}</span>
                    <ChevronRightGlyph />
                  </button>
                  <button type="button" className="dsh-codex-menu-cell" onClick={() => setMenu('effort')}>
                    <span className="dsh-codex-menu-cell-label">{t('composer.effort')}</span>
                    <span className="dsh-codex-menu-cell-value">{effortLabel}</span>
                    <ChevronRightGlyph />
                  </button>
                </>
              ) : null}

              {menu === 'model' ? (
                <>
                  <MenuBack label={t('composer.model')} onClick={() => setMenu('root')} />
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
                          closeMenu()
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
                        closeMenu()
                      }}
                    >
                      <span className="dsh-codex-menu-check">{model === '' ? <CheckGlyph /> : null}</span>
                      <span className="dsh-codex-menu-meta">
                        <span className="dsh-codex-menu-name">{t('composer.defaultModel')}</span>
                      </span>
                    </button>
                  </div>
                </>
              ) : null}

              {menu === 'effort' ? (
                <>
                  <MenuBack label={t('composer.effort')} onClick={() => setMenu('root')} />
                  {topEfforts.map((option) => (
                    <EffortRow
                      key={option.reasoningEffort}
                      option={option}
                      selected={option.reasoningEffort === effort}
                      isDefault={option.reasoningEffort === defaultEffort}
                      onSelect={() => {
                        onEffortChange(option.reasoningEffort)
                        closeMenu()
                      }}
                    />
                  ))}
                  {moreEfforts.length > 0 ? (
                    <button type="button" className="dsh-codex-menu-item" onClick={() => setMenu('more')}>
                      <span className="dsh-codex-menu-check" />
                      <span className="dsh-codex-menu-meta">
                        <span className="dsh-codex-menu-name">{t('composer.moreReasoning')}</span>
                        <span className="dsh-codex-menu-desc">{t('composer.moreReasoningHint')}</span>
                      </span>
                      <ChevronRightGlyph />
                    </button>
                  ) : null}
                </>
              ) : null}

              {menu === 'more' ? (
                <>
                  <MenuBack label={t('composer.moreReasoning')} onClick={() => setMenu('effort')} />
                  <div className="dsh-codex-menu-title">{t('composer.advancedReasoning')}</div>
                  <div className="dsh-codex-menu-warning">⚠ {t('composer.consumesFaster')}</div>
                  {moreEfforts.map((option) => (
                    <EffortRow
                      key={option.reasoningEffort}
                      option={option}
                      selected={option.reasoningEffort === effort}
                      isDefault={option.reasoningEffort === defaultEffort}
                      onSelect={() => {
                        onEffortChange(option.reasoningEffort)
                        closeMenu()
                      }}
                    />
                  ))}
                </>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

function EffortRow({
  option,
  selected,
  isDefault,
  onSelect,
}: {
  option: EffortOption
  selected: boolean
  isDefault: boolean
  onSelect: () => void
}) {
  const t = useT()
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={selected}
      className={`dsh-codex-menu-item ${selected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <span className="dsh-codex-menu-check">{selected ? <CheckGlyph /> : null}</span>
      <span className="dsh-codex-menu-meta">
        <span className="dsh-codex-menu-name">
          {labelForEffort(t, option.reasoningEffort)}
          {isDefault ? <span className="dsh-codex-menu-tag">{t('composer.defaultTag')}</span> : null}
          {selected ? <span className="dsh-codex-menu-tag current">{t('composer.currentTag')}</span> : null}
        </span>
        {option.description ? <span className="dsh-codex-menu-desc">{option.description}</span> : null}
      </span>
    </button>
  )
}

function MenuBack({ label, onClick }: { label: string, onClick: () => void }) {
  return (
    <button type="button" className="dsh-codex-menu-back" onClick={onClick}>
      <ChevronLeftGlyph />
      <span>{label}</span>
    </button>
  )
}

function labelForEffort(t: (key: string) => string, value: string): string {
  const key = `composer.effort.${value}`
  const text = t(key)
  return text === key ? value : text
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

function ChevronRightGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
      <path d="M6 4l3.3 3.3a1 1 0 0 1 0 1.4L6 12" strokeLinecap="round" />
    </svg>
  )
}

function ChevronLeftGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
      <path d="M10 4 6.7 7.3a1 1 0 0 0 0 1.4L10 12" strokeLinecap="round" />
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
