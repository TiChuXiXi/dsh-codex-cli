/** 输入区：空闲发新回合，运行中插话；带停止按钮。 */

import * as React from 'react'
import { useT } from '../i18n'

export interface ComposerProps {
  disabled: boolean
  activeTurnId: string | null
  onSend: (text: string) => Promise<void>
  onSteer: (text: string) => Promise<void>
  onStop: () => Promise<void>
}

export function Composer({ disabled, activeTurnId, onSend, onSteer, onStop }: ComposerProps) {
  const t = useT()
  const [text, setText] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

  const submit = async () => {
    const value = text.trim()
    if (value === '' || busy || disabled) return
    setBusy(true)
    try {
      if (activeTurnId !== null) await onSteer(value)
      else await onSend(value)
      setText('')
      textareaRef.current?.focus()
    } catch {
      // 失败时保留草稿；错误由页面顶部的错误条呈现。
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
    <div className="dsh-codex-composer">
      <textarea
        ref={textareaRef}
        className="dsh-codex-textarea"
        rows={3}
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
      <div className="dsh-codex-composer-actions">
        <span className="dsh-codex-hint">
          {activeTurnId === null ? t('composer.sendHint') : t('composer.steerHint')}
        </span>
        {activeTurnId !== null ? (
          <button type="button" className="dsh-codex-button" disabled={busy} onClick={() => void stop()}>
            {t('composer.stop')}
          </button>
        ) : null}
        <button
          type="button"
          className="dsh-codex-button primary"
          disabled={disabled || busy || text.trim() === ''}
          onClick={() => void submit()}
        >
          {activeTurnId === null ? t('composer.send') : t('composer.steer')}
        </button>
      </div>
    </div>
  )
}
