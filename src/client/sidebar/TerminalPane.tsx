import * as React from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'
import './terminal.css'
import type { Api } from '../rpc'
import { useT } from '../i18n'

interface TerminalOutput {
  data: string
  cursor: number
  truncated: boolean
  exited: boolean
  exitCode: number | null
  signal: number | null
}

export function TerminalPane({ api, cwd }: { api: Api, cwd: string }) {
  const t = useT()
  const translate = React.useRef(t)
  translate.current = t
  const container = React.useRef<HTMLDivElement>(null)
  const terminal = React.useRef<Terminal | null>(null)
  const send = React.useRef<(data: string) => void>(() => {})
  const [generation, setGeneration] = React.useState(0)
  const [status, setStatus] = React.useState('connecting')
  const [error, setError] = React.useState('')
  const [exitCode, setExitCode] = React.useState<number | null>(null)

  React.useEffect(() => {
    const host = container.current!
    const term = new Terminal({
      cursorBlink: true, fontSize: 13, lineHeight: 1.2,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
      scrollback: 5000, allowProposedApi: false, disableStdin: true,
    })
    const fit = new FitAddon()
    term.loadAddon(fit)
    term.open(host)
    terminal.current = term
    let disposed = false, sessionId = '', cursor = 0, inputFailed = false
    let pending = '', inputTimer: ReturnType<typeof setTimeout> | undefined
    let retryTimer: ReturnType<typeof setTimeout> | undefined
    let retryWake: (() => void) | undefined
    let writes = Promise.resolve()
    let resizes = Promise.resolve()
    let lastSize = ''
    setStatus('connecting')
    setError('')
    setExitCode(null)

    const message = (cause: unknown) => cause instanceof Error ? cause.message : String(cause)
    const inputError = (cause: unknown) => {
      if (disposed) return
      inputFailed = true
      term.options.disableStdin = true
      setStatus('error')
      setError(message(cause))
    }
    const flush = () => {
      inputTimer = undefined
      const data = pending
      pending = ''
      // Keep keystrokes and paste chunks ordered; failed input is never replayed.
      writes = writes.then(async () => {
        for (let offset = 0; offset < data.length; offset += 16384) {
          if (disposed || inputFailed || !sessionId) return
          await api('terminal/write', { sessionId, data: data.slice(offset, offset + 16384) })
        }
      }).catch(inputError)
    }
    send.current = data => {
      if (disposed || inputFailed || !sessionId || term.options.disableStdin) return
      pending += data
      if (!inputTimer) inputTimer = setTimeout(flush, 16)
    }
    const input = term.onData(data => send.current(data))
    const measure = () => {
      if (disposed || host.clientWidth === 0 || host.clientHeight === 0) return
      fit.fit()
      const size = term.cols + ':' + term.rows
      if (!sessionId || size === lastSize) return
      lastSize = size
      const cols = Math.min(500, term.cols), rows = Math.min(300, term.rows)
      resizes = resizes.then(async () => {
        if (!disposed) await api('terminal/resize', { sessionId, cols, rows })
      }).catch(cause => { if (!disposed) setError(message(cause)) })
    }
    const observer = new ResizeObserver(measure)
    observer.observe(host)
    const root = host.closest('.dsh-codex-root')!
    const theme = () => {
      const style = getComputedStyle(root)
      const color = (name: string) => style.getPropertyValue('--codex-' + name).trim()
      term.options.theme = { background: color('bg'), foreground: color('text'), cursor: color('accent'), selectionBackground: color('selected') }
      host.style.background = color('bg')
    }
    theme()
    const themeObserver = new MutationObserver(theme)
    themeObserver.observe(root, { attributes: true, attributeFilter: ['data-codex-theme'] })
    measure()
    // Prevent workspace/host shortcuts from consuming terminal keys.
    const stopKey = (event: KeyboardEvent) => event.stopPropagation()
    host.addEventListener('keydown', stopKey)
    const connect = async () => {
      try {
        const opened = await api<{ sessionId: string }>('terminal/open', {
          cwd, cols: Math.min(500, term.cols), rows: Math.min(300, term.rows),
        })
        sessionId = opened.sessionId
        if (disposed) { await api('terminal/close', { sessionId }); return }
        term.options.disableStdin = false
        setStatus('ready')
        measure()
        term.focus()
        while (!disposed) {
          try {
            const result = await api<TerminalOutput>('terminal/read', { sessionId, cursor })
            if (disposed) return
            if (result.truncated) {
              term.reset()
              term.writeln(translate.current('terminal.truncated'))
            }
            if (result.data) await new Promise<void>(resolve => term.write(result.data, resolve))
            if (disposed) return
            cursor = result.cursor
            if (result.exited) {
              term.options.disableStdin = true
              setExitCode(result.exitCode)
              setStatus('exited')
              return
            }
            if (!inputFailed) { setStatus('ready'); setError('') }
          } catch (cause) {
            if (disposed) return
            if ((cause as { code?: string }).code === 'codex-cli/terminal-expired') throw cause
            if (!inputFailed) setStatus('reconnecting')
            setError(message(cause))
            await new Promise<void>(resolve => {
              retryWake = resolve
              retryTimer = setTimeout(resolve, 1000)
            })
          }
        }
      } catch (cause) { inputError(cause) }
    }
    const pageHide = () => {
      if (!sessionId) return
      void fetch('/codex-cli/terminal/close', {
        method: 'POST', credentials: 'same-origin', keepalive: true,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          type: 'client-request', rpcId: crypto.randomUUID(),
          method: 'terminal/close', payload: { sessionId },
        }),
      }).catch(() => {})
    }
    window.addEventListener('pagehide', pageHide)
    void connect()
    return () => {
      window.removeEventListener('pagehide', pageHide)
      disposed = true
      clearTimeout(inputTimer)
      clearTimeout(retryTimer)
      retryWake?.()
      send.current = () => {}
      observer.disconnect()
      themeObserver.disconnect()
      host.removeEventListener('keydown', stopKey)
      input.dispose()
      terminal.current = null
      term.dispose()
      if (sessionId) void api('terminal/close', { sessionId }).catch(() => {})
    }
  }, [api, cwd, generation])

  return (
    <div className="codex-terminal">
      <div className="dsh-codex-right-bar codex-terminal-toolbar">
        <code className="dsh-codex-right-path" title={cwd}>{cwd}</code>
        <span role="status" data-state={status}>{status === 'exited' ? t('right.exitCode', { code: exitCode ?? '—' }) : t('terminal.' + status)}</span>
        <button type="button" className="dsh-codex-button" disabled={status !== 'ready'} onClick={() => { send.current('\x03'); terminal.current?.focus() }}>Ctrl+C</button>
        <button type="button" className="dsh-codex-button" onClick={() => setGeneration(value => value + 1)}>{t('terminal.restart')}</button>
      </div>
      {error && <div className="dsh-codex-right-error" role="alert">{error}</div>}
      <div ref={container} className="codex-terminal-screen" aria-label={t('right.terminal')} />
    </div>
  )
}
