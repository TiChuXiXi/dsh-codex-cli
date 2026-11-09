/** 单条 ThreadItem 的渲染：消息常显，命令/工具/文件默认折叠。 */

import * as React from 'react'
import {downloadsOnClick} from '../fileTypes'
import {FileDownloadButton} from '../components/FileDownloadButton'
import {Icon} from '../components/Icon'
import {ImageViewer} from '../components/ImageViewer'
import {CodexIcon} from '../components/CodexIcon'
import { useT } from '../i18n'
import type { Api } from '../rpc'
import type { CodexItem } from '../types'
import { Markdown } from '../markdown'
import { formatClock, itemText } from '../utils'

export function ItemCard({ item, api, cwd = '' }: { item: CodexItem, api: Api, cwd?:string }) {
  const t = useT()
  switch (item.type) {
    case 'userMessage':
      return <Message cwd={cwd} kind="user" label={t('item.user')} text={itemText(item)} time={formatClock(item.startedAtMs)} api={api} attachments={(item.content ?? []).filter(part => typeof part.path === 'string' && (part.type === 'localImage' || part.type === 'local_image' || part.type === 'mention')).map(part => ({path:part.path as string, name:part.name, image:part.type !== 'mention'}))} />
    case 'agentMessage':
      return (
        <Message
          api={api}
          cwd={cwd}
          kind="assistant"
          label={t('item.assistant')}
          text={typeof item.text === 'string' ? item.text : ''}
          muted={item.phase === 'commentary'}
          time={formatClock(item.startedAtMs)}
        />
      )
    case 'reasoning':
      return <Reasoning item={item} />
    case 'commandExecution':
      return <CommandCard item={item} />
    case 'fileChange':
      return <FileCard item={item} />
    case 'mcpToolCall':
    case 'dynamicToolCall':
    case 'functionCallOutput':
      return <ToolCard item={item} />
    case 'plan':
      return <Block title={t('item.plan')} body={<div className="dsh-codex-text">{item.text ?? ''}</div>} />
    case 'webSearch':
      return <Disclosure title={t('item.search')} body={<Json value={item} />} />
    case 'imageView':
      return <ImageView item={item} api={api} />
    case 'localSettingChange':
      return <Divider label={typeof item.text === 'string' ? item.text : ''} />
    case 'contextCompaction':
      return <Divider label={t('item.compaction')} />
    case 'enteredReviewMode':
    case 'exitedReviewMode':
      return <Divider label={t('item.review')} />
    case 'sleep':
    case 'hookPrompt':
      return null
    default:
      return <Disclosure title={t('item.other', { type: item.type })} body={null} />
  }
}

function Message({
  api,
  cwd = '',
  kind,
  label,
  text,
  muted = false,
  attachments = [],
  time = '',
}: {
  api: Api
  cwd?: string
  kind: 'user' | 'assistant'
  label: string
  text: string
  muted?: boolean
  attachments?: {path:string, name?:string, image:boolean}[]
  time?: string
}) {
  if (text.trim() === '' && attachments.length === 0) return null
  return (
    <div className={`dsh-codex-message ${kind}`}>
      <div className="dsh-codex-message-head">
        {kind === 'user' && time !== '' ? <span className="dsh-codex-message-time">{time}</span> : null}
        <span className="dsh-codex-message-avatar">{kind==='assistant'?<CodexIcon size={17}/>:<Icon name="message" size={16}/>}</span><strong>{label}</strong>
        {kind === 'assistant' && time !== '' ? <span className="dsh-codex-message-time">{time}</span> : null}
      </div>
      <div className="dsh-codex-bubble" style={muted ? { opacity: 0.82 } : undefined}>
        {attachments.length > 0 && <div className="dsh-codex-message-images">{attachments.map((attachment, index) => attachment.image
          ? <ImageView key={attachment.path + index} item={{id:attachment.path, type:'imageView', path:attachment.path}} api={api} hideCaption />
          : downloadsOnClick(attachment.path) ? <FileDownloadButton key={attachment.path + index} api={api} cwd={cwd} path={attachment.path} className="dsh-codex-message-file"><Icon name="file" size={24}/><Icon name="download" size={14}/></FileDownloadButton> : <button type="button" className="dsh-codex-message-file" key={attachment.path+index} title={attachment.path} aria-label={'预览 '+(attachment.name||attachment.path.split('/').at(-1))} onClick={()=>window.dispatchEvent(new CustomEvent('dsh-codex-open-file',{detail:attachment.path}))}><Icon name="file" size={24}/></button>)}</div>}
        {text.trim() !== '' && <Markdown text={text} api={api} cwd={cwd} />}
      </div>
    </div>
  )
}

function Reasoning({ item }: { item: CodexItem }) {
  const t = useT()
  const summary = Array.isArray(item.summary) ? item.summary.filter((part) => part.trim() !== '') : []
  const body = summary.join('\n\n')
  if (body === '') return null
  return (
    <details className="dsh-codex-reasoning">
      <summary>{t('item.reasoning')}</summary>
      <div className="dsh-codex-reasoning-body">{body}</div>
    </details>
  )
}

function CommandCard({ item }: { item: CodexItem }) {
  const t = useT()
  const output = typeof item.aggregatedOutput === 'string' ? item.aggregatedOutput : ''
  const status = typeof item.status === 'string' ? item.status : ''
  const command = item.command ?? ''
  return (
    <Disclosure
      title={t('item.command')}
      meta={
        <>
          <span className="dsh-codex-block-title">{shorten(command, 120)}</span>
          {status !== '' ? <span>{status}</span> : null}
          {typeof item.exitCode === 'number' ? <span>{t('item.exitCode', { code: item.exitCode })}</span> : null}
        </>
      }
      body={
        <>
          <div className="dsh-codex-command">{command}</div>
          {output !== '' ? <pre className="dsh-codex-pre">{output}</pre> : null}
        </>
      }
    />
  )
}

function FileCard({ item }: { item: CodexItem }) {
  const t = useT()
  const changes = Array.isArray(item.changes) ? item.changes : []
  return (
    <Disclosure
      title={t('item.files')}
      meta={<span>{t('item.files.changed', { count: changes.length })}</span>}
      body={
        <div className="dsh-codex-files">
          {changes.map((change, index) => (
            <details key={`${change.path}-${index}`}>
              <summary className="dsh-codex-file-path">{change.path}</summary>
              <pre className="dsh-codex-pre">{change.diff}</pre>
            </details>
          ))}
        </div>
      }
    />
  )
}

function ToolCard({ item }: { item: CodexItem }) {
  const t = useT()
  const title =
    item.type === 'mcpToolCall'
      ? `${item.server ?? 'mcp'} / ${item.tool ?? ''}`
      : item.type === 'dynamicToolCall'
        ? `tool / ${item.tool ?? ''}`
        : item.type
  return (
    <Disclosure
      title={t('item.tool')}
      meta={
        <>
          <span className="dsh-codex-block-title">{title}</span>
          {typeof item.status === 'string' ? <span>{item.status}</span> : null}
        </>
      }
      body={<Json value={{ arguments: item.arguments, result: item.result, error: item.error }} />}
    />
  )
}

function Json({ value }: { value: unknown }) {
  let text: string
  try {
    text = JSON.stringify(value, null, 2) ?? ''
  } catch {
    text = String(value)
  }
  if (text.trim() === '' || text === '{}') return null
  if (text.length > 4000) text = `${text.slice(0, 4000)}\n…`
  return <pre className="dsh-codex-pre">{text}</pre>
}

/** 可展开块：summary 常显一行，正文默认收起。 */
function Disclosure({ title, meta, body }: { title: string, meta?: React.ReactNode, body: React.ReactNode }) {
  return (
    <details className="dsh-codex-block">
      <summary className="dsh-codex-block-head">
        <span className="dsh-codex-caret" />
        <span>{title}</span>
        {meta}
      </summary>
      {body !== null ? <div className="dsh-codex-block-body">{body}</div> : null}
    </details>
  )
}

/** 常显块：用于计划等短内容。 */
function Block({ title, meta, body }: { title: string, meta?: React.ReactNode, body: React.ReactNode }) {
  return (
    <section className="dsh-codex-block">
      <header className="dsh-codex-block-head">
        <span>{title}</span>
        {meta}
      </header>
      {body !== null ? <div className="dsh-codex-block-body">{body}</div> : null}
    </section>
  )
}

function Divider({ label }: { label: string }) {
  return <div className="dsh-codex-divider">{label}</div>
}

/** 图片预览：进入视口附近才向宿主读文件，转成 data URL 后显示；同路径只读一次。 */
const imageCache = new Map<string, string>()

function ImageView({ item, api, hideCaption = false }: { item: CodexItem, api: Api, hideCaption?: boolean }) {
  const t = useT()
  const path = typeof item.path === 'string' ? item.path : ''
  const holderRef = React.useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = React.useState(false)
  const [src, setSrc] = React.useState<string | null>(path === '' ? null : imageCache.get(path) ?? null)
  const [failed, setFailed] = React.useState(false)

  React.useEffect(() => {
    if (path === '') return undefined
    const cached = imageCache.get(path)
    if (cached !== undefined) {
      setSrc(cached)
      return undefined
    }
    const element = holderRef.current
    if (element === null || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return undefined
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [path])

  React.useEffect(() => {
    if (!visible || path === '' || src !== null) return undefined
    let alive = true
    setFailed(false)
    api<{ dataUrl: string }>('images/read', { path })
      .then((result) => {
        imageCache.set(path, result.dataUrl)
        if (alive) setSrc(result.dataUrl)
      })
      .catch(() => {
        if (alive) setFailed(true)
      })
    return () => {
      alive = false
    }
  }, [api, path, visible, src])

  if (path === '') return null
  return (
    <figure className="dsh-codex-image" ref={holderRef}>
      {src !== null ? (
        <ImageViewer src={src} alt={basenameOf(path)} />
      ) : (
        <div className="dsh-codex-image-placeholder">
          {failed ? t('item.imageFailed') : t('item.imageLoading')}
        </div>
      )}
      {!hideCaption && <figcaption>{basenameOf(path)}</figcaption>}
    </figure>
  )
}

function basenameOf(value: unknown): string {
  const text = typeof value === 'string' ? value : ''
  const index = Math.max(text.lastIndexOf('/'), text.lastIndexOf('\\'))
  return index === -1 ? text : text.slice(index + 1)
}

function shorten(text: string, max: number): string {
  const single = text.replace(/\s+/gu, ' ').trim()
  return single.length > max ? `${single.slice(0, max)}…` : single
}
