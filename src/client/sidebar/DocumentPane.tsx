import * as React from 'react'
import {Icon} from '../components/Icon'
import {SelectMenu} from '../components/SelectMenu'
import type { Api } from '../rpc'
import { Markdown } from '../markdown'
import { highlightCodeLines } from './codeHighlight'
import { FilesPane } from './FilesPane'
interface Page {
  content: string
  offset: number
  nextOffset: number
  eof: boolean
}
const imageTypes: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  bmp: 'image/bmp',
  ico: 'image/x-icon',
}
/** Resolve local links before choosing the file preview or directory browser. */
export function DocumentPane({api, cwd, path, onOpen}: {
  api: Api
  cwd: string
  path: string
  onOpen: (path: string) => void
}) {
  const [target, setTarget] = React.useState<{cwd: string; path: string; type: string} | null>(null)
  const [error, setError] = React.useState('')
  const [revision, setRevision] = React.useState(0)
  const [copyNotice, setCopyNotice] = React.useState('')
  React.useEffect(() => {
    let cancelled = false
    setTarget(null)
    setError('')
    async function resolve() {
      try {
        const workspace = await api<{workspaceId: string; cwd: string}>('workspace/open', {cwd})
        const info = await api<{path: string; type: string}>('workspace/info', {workspaceId: workspace.workspaceId, path})
        if (info.type !== 'file' && info.type !== 'dir') throw new Error('此路径不是可预览的文件或目录')
        if (!cancelled) setTarget({...info, cwd: workspace.cwd})
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : String(cause))
      }
    }
    void resolve()
    return () => { cancelled = true }
  }, [api, cwd, path, revision])
  if (error) return <section className="codex-sidebar-document">
    <header><code title={path}>{path}</code>
      <button type="button" className="dsh-codex-button" onClick={async () => {
        try {
          await navigator.clipboard.writeText(path.startsWith('/') ? path : cwd.replace(/\/$/, '') + '/' + path)
          setCopyNotice('已复制路径')
        } catch {
          setCopyNotice('复制失败，请检查剪贴板权限')
        }
      }}>复制路径</button>
      <button type="button" className="dsh-codex-button" onClick={() => setRevision(r => r + 1)}>重试</button>
    </header>
    <div role="alert">无法打开此路径，可能已删除或不可访问。{error}</div>
    {copyNotice && <div role="status">{copyNotice}</div>}
  </section>
  if (!target) return <div className="dsh-codex-loading">正在打开路径…</div>
  if (target.type === 'dir') return <FilesPane api={api} cwd={target.cwd} directory={target.path} onOpen={onOpen}/>
  return <FileDocumentPane api={api} cwd={cwd} path={path}/>
}

function FileDocumentPane({
  api,
  cwd,
  path,
}: {
  api: Api
  cwd: string
  path: string
}) {
  const [offset, setOffset] = React.useState(1)
  const [revision, setRevision] = React.useState(0)
  const [page, setPage] = React.useState<Page | null>(null)
  const [image, setImage] = React.useState<string | null>(null)
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [mode, setMode] = React.useState<'code' | 'text' | 'preview'>(() => /\.(?:md|markdown)$/i.test(path) ? 'preview' : 'code')
  const [copied, setCopied] = React.useState(false)
  const [wrap, setWrap] = React.useState(false)
  const [zoom, setZoom] = React.useState(100)
  const ext = path.split('.').at(-1)?.toLowerCase() || ''
  const codeLines = React.useMemo(() => mode === 'code' && page ? highlightCodeLines(page.content, ext) : null, [page, mode, ext])
  React.useEffect(() => {
    let cancelled = false,
      url: string | undefined
    setLoading(true)
    setError('')
    setPage(null)
    setImage(null)
    async function load() {
      try {
        const { workspaceId } = await api<{ workspaceId: string }>(
          'workspace/open',
          { cwd },
        )
        if (imageTypes[ext]) {
          const parts: Uint8Array[] = []
          let position = 0,
            eof = false
          while (!eof) {
            const result = await api<{
              dataBase64: string
              eof: boolean
              size: number
            }>('workspace/bytes', {
              workspaceId,
              path,
              offset: position,
              length: 1024 * 1024,
            })
            if (cancelled) return
            if (result.size > 8 * 1024 * 1024)
              throw new Error('图片超过 8MiB 预览上限')
            const bytes = Uint8Array.from(atob(result.dataBase64), (c) =>
              c.charCodeAt(0),
            )
            parts.push(bytes)
            position += bytes.length
            eof = result.eof
            if (!bytes.length && !eof) throw new Error('文件读取未取得进展')
          }
          url = URL.createObjectURL(new Blob(parts, { type: imageTypes[ext] }))
          if (!cancelled) setImage(url)
        } else {
          const result = await api<Page>('workspace/text', {
            workspaceId,
            path,
            offset,
            limit: 500,
          })
          if (!cancelled) setPage(result)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [api, cwd, path, offset, revision, ext])
  return (
    <section className="codex-sidebar-document">
      <header>
        <code title={path}>{path}</code>
        {!imageTypes[ext] && <>
          <SelectMenu label="显示模式" value={mode} onChange={value => setMode(value as 'code' | 'text' | 'preview')} options={[{value:'code',label:'代码'},{value:'text',label:'纯文本'}, ...((ext === 'md' || ext === 'markdown') ? [{value:'preview',label:'预览'}] : [])]} />
          <button type="button" className="document-icon-button" aria-label="自动换行" title="自动换行" aria-pressed={wrap} onClick={() => setWrap(v => !v)}><Icon name="wrap" size={17}/></button>
        </>}
        {image && (
          <SelectMenu label="图片缩放" value={String(zoom)} onChange={value => setZoom(Number(value))} options={[50,100,150,200].map(z => ({value:String(z),label:z+'%'}))} />
        )}
        <button
          type="button"
          className="document-icon-button"
          aria-label="重新加载文件"
          title="重新加载文件"
          onClick={() => setRevision((r) => r + 1)}
        >
          <Icon name="refresh" size={17}/>
        </button>
      </header>
      {error && <div role="alert">{error}</div>}
      {loading && <div className="dsh-codex-loading">正在读取文件…</div>}
      <div className="codex-sidebar-document-body">
        {page && <div className="document-code-toolbar"><span>{mode === 'code' ? ext || 'text' : mode === 'text' ? '纯文本' : 'Markdown'}</span>
          <button type="button" className="document-icon-button" aria-label="复制本页" title={copied ? '已复制' : '复制本页'} onClick={() => {
            navigator.clipboard.writeText(page.content).then(() => {setCopied(true); setTimeout(() => setCopied(false), 1500)}).catch(() => setError('复制失败，请检查剪贴板权限'))
          }}><Icon name={copied ? 'check' : 'copy'} size={16}/></button>
        </div>}
        {image && (
          <img
            src={image}
            alt={path}
            style={{ width: zoom + '%', maxWidth: 'none' }}
          />
        )}
        {page &&
          ((ext === 'md' || ext === 'markdown') && mode === 'preview' ? (
            <Markdown text={page.content} />
          ) : (
            <pre className={wrap ? 'document-code is-wrapped' : 'document-code'}>
              {page.content.split('\n').map((line, i) => (
                <div className="document-code-line" key={i}>
                  <span className="codex-sidebar-line-number">
                    {offset + i}
                  </span>
                  <span className="document-code-text">{codeLines?.[i] ?? (line || ' ')}</span>
                </div>
              ))}
            </pre>
          ))}
      </div>
      {page && (
        <footer>
          <button
            type="button"
            aria-label="上一页" title="上一页" className="document-icon-button"
            disabled={offset <= 1}
            onClick={() => setOffset(Math.max(1, offset - 500))}
          >
            <Icon name="chevronLeft" size={16}/>
          </button>
          <span>
            第 {offset}–{Math.max(offset, page.nextOffset - 1)} 行
          </span>
          <button
            type="button"
            aria-label="下一页" title="下一页" className="document-icon-button"
            disabled={page.eof || page.nextOffset <= offset}
            onClick={() => setOffset(page.nextOffset)}
          >
            <Icon name="chevronRight" size={16}/>
          </button>
        </footer>
      )}
    </section>
  )
}
