/**
 * 输入区：DSH 风格卡片 + 加号面板、附件上传、会话权限、模型/推理强度与斜杠命令。
 */

import * as React from 'react'
import { useT } from '../i18n'
import type { Api } from '../rpc'

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

export interface Attachment {
  name: string
  path: string
  kind: 'file' | 'image'
}

export type PermissionMode = 'ask' | 'approve' | 'full' | 'read'

export interface ComposerProps {
  api: Api
  cwd: string
  disabled: boolean
  activeTurnId: string | null
  models: ModelOption[]
  model: string
  effort: string
  permission: PermissionMode
  planMode: boolean
  onModelChange: (model: string) => void
  onEffortChange: (effort: string) => void
  onPermissionChange: (mode: PermissionMode) => void
  onEnterPlan: () => void
  onExitPlan: () => void
  onSend: (text: string, options: {
    model?: string
    effort?: string
    attachments?: Attachment[]
    permission?: PermissionMode
  }) => Promise<void>
  onSteer: (text: string) => Promise<void>
  onStop: () => Promise<void>
  onPickProject: () => void
  onNew: () => void
  onCompact: () => void
  onDiff: () => void
  onExport: () => void
}

type Menu = null | 'root' | 'model' | 'effort' | 'more'
type CommandId = 'model' | 'effort' | 'permission' | 'plan' | 'attach' | 'project' | 'compact' | 'diff' | 'export' | 'init' | 'review' | 'new'

const COMMANDS: Array<{ id: CommandId, label: string, desc: string }> = [
  { id: 'model', label: 'cmd.model', desc: 'cmd.modelDesc' },
  { id: 'effort', label: 'cmd.effort', desc: 'cmd.effortDesc' },
  { id: 'permission', label: 'cmd.permission', desc: 'cmd.permissionDesc' },
  { id: 'plan', label: 'cmd.plan', desc: 'cmd.planDesc' },
  { id: 'attach', label: 'cmd.attach', desc: 'cmd.attachDesc' },
  { id: 'project', label: 'cmd.project', desc: 'cmd.projectDesc' },
  { id: 'compact', label: 'cmd.compact', desc: 'cmd.compactDesc' },
  { id: 'diff', label: 'cmd.diff', desc: 'cmd.diffDesc' },
  { id: 'export', label: 'cmd.export', desc: 'cmd.exportDesc' },
  { id: 'init', label: 'cmd.init', desc: 'cmd.initDesc' },
  { id: 'review', label: 'cmd.review', desc: 'cmd.reviewDesc' },
  { id: 'new', label: 'cmd.new', desc: 'cmd.newDesc' },
]

const FALLBACK_EFFORTS: EffortOption[] = [
  { reasoningEffort: 'low', description: 'Fast responses with lighter reasoning' },
  { reasoningEffort: 'medium', description: 'Balances speed and reasoning depth for everyday tasks' },
  { reasoningEffort: 'high', description: 'Greater reasoning depth for complex problems' },
  { reasoningEffort: 'xhigh', description: 'Extra high reasoning depth for complex problems' },
  { reasoningEffort: 'max', description: 'Maximum reasoning depth for the hardest problems' },
  { reasoningEffort: 'ultra', description: 'Maximum reasoning with automatic task delegation' },
]

export function Composer({
  api,
  cwd,
  disabled,
  activeTurnId,
  models,
  model,
  effort,
  permission,
  planMode,
  onModelChange,
  onEffortChange,
  onPermissionChange,
  onEnterPlan,
  onExitPlan,
  onSend,
  onSteer,
  onStop,
  onPickProject,
  onNew,
  onCompact,
  onDiff,
  onExport,
}: ComposerProps) {
  const t = useT()
  const [text, setText] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [menu, setMenu] = React.useState<Menu>(null)
  const [plusOpen, setPlusOpen] = React.useState(false)
  const [permissionOpen, setPermissionOpen] = React.useState(false)
  const [confirmFull, setConfirmFull] = React.useState(false)
  const [attachments, setAttachments] = React.useState<Attachment[]>([])
  const [uploading, setUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)
  const [slashIndex, setSlashIndex] = React.useState(0)
  const [slashDismissed, setSlashDismissed] = React.useState(false)
  const slashRef = React.useRef<HTMLDivElement | null>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    const element = textareaRef.current
    if (element === null) return
    element.style.height = 'auto'
    element.style.height = `${Math.min(element.scrollHeight, 200)}px`
  }, [text])

  React.useEffect(() => {
    if (!plusOpen && !permissionOpen && !confirmFull && menu === null) return undefined
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setPlusOpen(false)
      setPermissionOpen(false)
      setConfirmFull(false)
      setMenu(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [plusOpen, permissionOpen, confirmFull, menu])

  const currentModel = models.find((entry) => entry.id === model)
  const modelLabel = currentModel?.displayName ?? (model === '' ? t('composer.defaultModel') : model)
  const efforts = currentModel?.supportedReasoningEfforts?.length
    ? currentModel.supportedReasoningEfforts
    : FALLBACK_EFFORTS
  const defaultEffort = currentModel?.defaultReasoningEffort ?? null
  const topEfforts = efforts.slice(0, 4)
  const moreEfforts = efforts.slice(4)
  const effortLabel = effort === '' ? t('composer.defaultEffort') : labelForEffort(t, effort)

  const slashMatch = text.match(/^\/(\w*)$/)
  const slashQuery = slashMatch?.[1]?.toLowerCase() ?? null
  const slashCommands = slashQuery === null
    ? []
    : COMMANDS.filter((command) => {
        const label = t(command.label).toLowerCase()
        return command.id.includes(slashQuery) || label.includes(slashQuery)
      })
  const slashOpen = slashQuery !== null && slashCommands.length > 0 && !slashDismissed

  React.useEffect(() => {
    if (!slashOpen) return undefined
    const onPointer = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (slashRef.current?.contains(target)) return
      if (textareaRef.current?.contains(target)) return
      setSlashDismissed(true)
    }
    document.addEventListener('pointerdown', onPointer, true)
    return () => document.removeEventListener('pointerdown', onPointer, true)
  }, [slashOpen])

  // 键盘切换时把选中项滚入可视区域
  React.useEffect(() => {
    if (!slashOpen) return
    const element = slashRef.current?.querySelector(`[data-slash-index="${slashIndex}"]`)
    if (element instanceof HTMLElement) element.scrollIntoView({ block: 'nearest' })
  }, [slashIndex, slashOpen])


  const closeAll = () => {
    setPlusOpen(false)
    setPermissionOpen(false)
    setMenu(null)
  }

  const runCommand = (id: CommandId) => {
    closeAll()
    setText('')
    if (id === 'model') setMenu('model')
    else if (id === 'effort') setMenu('effort')
    else if (id === 'permission') setPermissionOpen(true)
    else if (id === 'plan') onEnterPlan()
    else if (id === 'attach') fileInputRef.current?.click()
    else if (id === 'project') onPickProject()
    else if (id === 'compact') onCompact()
    else if (id === 'diff') onDiff()
    else if (id === 'export') onExport()
    else if (id === 'init') {
      setText(t('cmd.initPrompt'))
      textareaRef.current?.focus()
    } else if (id === 'review') {
      setText(t('cmd.reviewPrompt'))
      textareaRef.current?.focus()
    } else if (id === 'new') onNew()
  }

  const choosePermission = (mode: PermissionMode) => {
    setPermissionOpen(false)
    if (mode === 'full') {
      setConfirmFull(true)
      return
    }
    onPermissionChange(mode)
  }

  const uploadFiles = async (files: FileList | null) => {
    if (files === null || files.length === 0) return
    if (cwd === '') {
      setUploadError(t('composer.noCwd'))
      return
    }
    setUploading(true)
    setUploadError(null)
    try {
      for (const file of Array.from(files)) {
        const dataBase64 = await readAsBase64(file)
        const saved = await api<{ path: string, name: string }>('upload/save', {
          cwd,
          name: file.name,
          dataBase64,
        })
        setAttachments((previous) => [
          ...previous,
          {
            name: saved.name,
            path: saved.path,
            kind: file.type.startsWith('image/') ? 'image' : 'file',
          },
        ])
      }
    } catch (cause) {
      setUploadError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setUploading(false)
      if (fileInputRef.current !== null) fileInputRef.current.value = ''
    }
  }

  const submit = async () => {
    const value = text.trim()
    if ((value === '' && attachments.length === 0) || busy || disabled) return
    setBusy(true)
    try {
      if (activeTurnId !== null) {
        await onSteer(value)
      } else {
        await onSend(value, {
          model: model === '' ? undefined : model,
          effort: effort === '' ? undefined : effort,
          attachments,
          permission,
        })
      }
      setText('')
      setAttachments([])
      textareaRef.current?.focus()
    } catch {
      // 失败保留草稿。
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
      {slashOpen ? (
        <div className="dsh-codex-slash" role="listbox" ref={slashRef}>
          {slashCommands.map((command, index) => (
            <button
              type="button"
              key={command.id}
              role="option"
              aria-selected={index === slashIndex}
              data-slash-index={index}
              className={`dsh-codex-slash-item ${index === slashIndex ? 'active' : ''}`}
              onMouseEnter={() => setSlashIndex(index)}
              onClick={() => runCommand(command.id)}
            >
              <span className="dsh-codex-slash-name">/{command.id}</span>
              <span className="dsh-codex-slash-label">{t(command.label)}</span>
              <span className="dsh-codex-slash-desc">{t(command.desc)}</span>
            </button>
          ))}
        </div>
      ) : null}
      {plusOpen ? (
        <>
          <div className="dsh-codex-menu-backdrop" onPointerDown={closeAll} />
          <div className="dsh-codex-plus-panel" role="menu">
            <div className="dsh-codex-menu-title">{t('composer.add')}</div>
            <PlusItem icon={<PaperclipGlyph />} label={t('cmd.attach')} hint={t('cmd.attachDesc')} onClick={() => runCommand('attach')} />
            <PlusItem icon={<FolderGlyph />} label={t('cmd.project')} hint={t('cmd.projectDesc')} onClick={() => runCommand('project')} />
            <div className="dsh-codex-menu-title">{t('composer.commands')}</div>
            {COMMANDS.filter((command) => command.id !== 'attach' && command.id !== 'project').map((command) => (
              <PlusItem
                key={command.id}
                icon={<CommandGlyph id={command.id} />}
                label={t(command.label)}
                hint={t(command.desc)}
                onClick={() => runCommand(command.id)}
              />
            ))}
          </div>
        </>
      ) : null}
      <div className="dsh-codex-composer-card">
        <input ref={fileInputRef} type="file" multiple hidden onChange={(event) => void uploadFiles(event.target.files)} />

        {attachments.length > 0 || uploading || uploadError !== null ? (
          <div className="dsh-codex-attachments">
            {attachments.map((attachment) => (
              <span key={attachment.path} className="dsh-codex-attachment" title={attachment.path}>
                <span className="dsh-codex-attachment-name">{attachment.name}</span>
                <button
                  type="button"
                  aria-label={t('composer.removeAttachment')}
                  onClick={() => setAttachments((previous) => previous.filter((item) => item.path !== attachment.path))}
                >
                  ×
                </button>
              </span>
            ))}
            {uploading ? <span className="dsh-codex-attachment uploading">{t('composer.uploading')}</span> : null}
            {uploadError !== null ? <span className="dsh-codex-attachment error">{uploadError}</span> : null}
          </div>
        ) : null}

        <textarea
          ref={textareaRef}
          className="dsh-codex-composer-input"
          rows={1}
          value={text}
          disabled={disabled}
          placeholder={
            activeTurnId !== null
              ? t('composer.steerPlaceholder')
              : planMode
                ? t('composer.planPlaceholder')
                : t('composer.placeholder')
          }
          onChange={(event) => {
            setText(event.target.value)
            setSlashIndex(0)
            setSlashDismissed(false)
          }}
          onKeyDown={(event) => {
            if (slashOpen) {
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                setSlashIndex((index) => (index + 1) % slashCommands.length)
                return
              }
              if (event.key === 'ArrowUp') {
                event.preventDefault()
                setSlashIndex((index) => (index - 1 + slashCommands.length) % slashCommands.length)
                return
              }
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                const command = slashCommands[slashIndex]
                if (command !== undefined) runCommand(command.id)
                return
              }
              if (event.key === 'Escape') {
                event.preventDefault()
                setSlashDismissed(true)
                return
              }
            }
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault()
              void submit()
            }
          }}
        />

        <div className="dsh-codex-composer-row">
          <div className="dsh-codex-composer-tools">
            <button
              type="button"
              className="dsh-codex-plus"
              aria-label={t('composer.add')}
              aria-expanded={plusOpen}
              onClick={() => {
                setPlusOpen((previous) => !previous)
                setPermissionOpen(false)
                setMenu(null)
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                <path d="M8 2.5v11M2.5 8h11" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              className="dsh-codex-permission-trigger"
              aria-expanded={permissionOpen}
              onClick={() => {
                setPermissionOpen((previous) => !previous)
                setPlusOpen(false)
                setMenu(null)
              }}
            >
              <ShieldGlyph />
              <span>{t(`permission.${permission}`)}</span>
            </button>
            {activeTurnId !== null ? (
              <span className="dsh-codex-running">
                <span className="dsh-codex-dot ok pulse" />
                {t('composer.running')}
              </span>
            ) : null}
            {planMode ? (
              <span className="dsh-codex-plan-tag">
                {t('plan.tag')}
                <button type="button" aria-label={t('plan.exit')} title={t('plan.exit')} onClick={onExitPlan}>
                  <CloseGlyph />
                </button>
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
              onClick={() => {
                setMenu(menu === null ? 'root' : null)
                setPlusOpen(false)
                setPermissionOpen(false)
              }}
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
              disabled={disabled || busy || (text.trim() === '' && attachments.length === 0)}
              aria-label={activeTurnId === null ? t('composer.send') : t('composer.steer')}
              title={activeTurnId === null ? t('composer.send') : t('composer.steer')}
              onClick={() => void submit()}
            >
              <SendGlyph />
            </button>
          </div>
        </div>

        {permissionOpen ? (
          <>
            <div className="dsh-codex-menu-backdrop" onPointerDown={closeAll} />
            <div className="dsh-codex-permission-menu" role="menu">
              <div className="dsh-codex-menu-title">{t('permission.title')}</div>
              {(['ask', 'approve', 'full', 'read'] as PermissionMode[]).map((mode) => (
                <button
                  type="button"
                  key={mode}
                  className={`dsh-codex-permission-option ${permission === mode ? 'selected' : ''}`}
                  onClick={() => choosePermission(mode)}
                >
                  <span className="dsh-codex-menu-check">{permission === mode ? <CheckGlyph /> : null}</span>
                  <span className="dsh-codex-permission-meta">
                    <span className="dsh-codex-menu-name">{t(`permission.${mode}`)}</span>
                    <span className="dsh-codex-menu-desc">{t(`permission.${mode}Desc`)}</span>
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : null}

        {menu !== null ? (
          <>
            <div className="dsh-codex-menu-backdrop" onPointerDown={closeAll} />
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
                        setMenu(null)
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
                        setMenu(null)
                      }}
                    />
                  ))}
                </>
              ) : null}
            </div>
          </>
        ) : null}

        {confirmFull ? (
          <div
            className="dsh-codex-dialog-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setConfirmFull(false)
            }}
          >
            <div className="dsh-codex-dialog" role="dialog" aria-modal="true">
              <header className="dsh-codex-dialog-head">{t('permission.fullTitle')}</header>
              <div className="dsh-codex-approval-meta">{t('permission.fullBody')}</div>
              <div className="dsh-codex-dialog-actions">
                <button type="button" className="dsh-codex-button" onClick={() => setConfirmFull(false)}>
                  {t('permission.cancel')}
                </button>
                <button
                  type="button"
                  className="dsh-codex-button danger"
                  onClick={() => {
                    onPermissionChange('full')
                    setConfirmFull(false)
                  }}
                >
                  {t('permission.confirm')}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function PlusItem({ icon, label, hint, onClick }: { icon: React.ReactNode, label: string, hint: string, onClick: () => void }) {
  return (
    <button type="button" role="menuitem" className="dsh-codex-plus-item" onClick={onClick}>
      <span className="dsh-codex-plus-icon">{icon}</span>
      <span className="dsh-codex-plus-label">{label}</span>
      <span className="dsh-codex-plus-hint">{hint}</span>
    </button>
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

function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result ?? '')
      const comma = result.indexOf(',')
      resolve(comma >= 0 ? result.slice(comma + 1) : result)
    }
    reader.onerror = () => reject(reader.error ?? new Error('读取文件失败'))
    reader.readAsDataURL(file)
  })
}

function CommandGlyph({ id }: { id: CommandId }) {
  if (id === 'permission') return <ShieldGlyph />
  if (id === 'plan') return <PlanGlyph />
  if (id === 'model' || id === 'effort') return <ModelGlyph />
  if (id === 'compact') return <span aria-hidden="true">⇣</span>
  if (id === 'new') return <span aria-hidden="true">＋</span>
  return <span aria-hidden="true">⌘</span>
}

function PlanGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M5.5 4.5h8M5.5 8h8M5.5 11.5h5" strokeLinecap="round" />
      <path d="m2 4.2.9.9L4.4 3.5M2 7.7l.9.9L4.4 7M2 11.2l.9.9 1.5-1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CloseGlyph() {
  return (
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
    </svg>
  )
}

function ShieldGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M8 1.8 13 3.6v3.6c0 3.1-2.1 5.3-5 6.9-2.9-1.6-5-3.8-5-6.9V3.6L8 1.8Z" strokeLinejoin="round" />
    </svg>
  )
}

function PaperclipGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M10.8 5.2 6.4 9.6a1.6 1.6 0 0 0 2.3 2.3l4.7-4.7a3 3 0 0 0-4.2-4.2L4.1 8.1a4.2 4.2 0 0 0 5.9 5.9l3.4-3.4" strokeLinecap="round" />
    </svg>
  )
}

function FolderGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M1.9 4.3c0-.66.54-1.2 1.2-1.2h2.9l1.5 1.7h5.4c.66 0 1.2.54 1.2 1.2v6.3c0 .66-.54 1.2-1.2 1.2H3.1c-.66 0-1.2-.54-1.2-1.2V4.3Z" strokeLinejoin="round" />
    </svg>
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
