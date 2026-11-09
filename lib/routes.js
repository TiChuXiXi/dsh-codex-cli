/**
 * HTTP 路由：RPC 通道 + SSE 事件流。
 *
 * 线格式与 `ctx.connection.rpc` 完全一致（照搬 dsh-git-vcs 的验证过的做法）：
 *   请求  { type: "client-request", rpcId, method, payload }
 *   响应  { type: "server-response", rpcId, result: { ok: true, value } | { ok: false, error } }
 *
 * 信任栅栏复用 connection.requestRejection()：Host/Origin 校验 + 浏览器会话认证。
 */

import { pipeline } from 'node:stream/promises'
import { HubError } from './hub.js'
import { readImage } from './images.js'
import { checkDirectory, createDirectory, gitDiff, gitStatus, listDirectory, readTextFile, runCommand, saveUpload } from './fs.js'
import { JsonRpcError } from './jsonrpc.js'

const CHANNEL = '/codex-cli'
const EVENTS_PATH = `${CHANNEL}/events`
const KEEPALIVE_MS = 15000

export function createRoutes({ hub, bus, connection, config, logger, versions, runtime, workspace, git }) {
  const streams = new Set()
  const endpoints = {
    'workspace/downloadInfo': payload => workspace.downloadInfo(payload?.workspaceId, payload?.path),
    'workspace/upload': payload => workspace.upload(payload?.workspaceId, payload?.directory, payload?.name, payload?.dataBase64),
    'workspace/remove': payload => workspace.remove(payload?.workspaceId, payload?.path),
    'workspace/open': payload => workspace.register(payload?.cwd),
    'workspace/info': payload => workspace.info(payload?.workspaceId, payload?.path),
    'workspace/list': payload => workspace.list(payload?.workspaceId, payload?.path),
    'workspace/text': payload => workspace.text(payload?.workspaceId, payload?.path, payload?.offset, payload?.limit),
    'workspace/bytes': payload => workspace.bytes(payload?.workspaceId, payload?.path, payload?.offset, payload?.length),
    'workspace/watch': payload => workspace.observe(payload?.workspaceId, payload?.path),
    'workspace/unwatch': payload => workspace.release(payload?.watchId),
    status() {
      return {
        ...hub.status(),
        runtime: { ...runtime?.(), workspaceWatchCount: workspace?.watchCount ?? 0 },
        pending: hub.pendingApprovals(),
      }
    },
    'projects/list'(payload) {
      return hub.projects({ refresh: payload?.refresh === true, provider: payload?.provider })
    },
    'threads/list'(payload) {
      return hub.listThreads(payload ?? {})
    },
    'threads/get'(payload) {
      return hub.getThread(payload?.threadId, payload ?? {})
    },
    'threads/open'(payload) {
      return hub.openThread(payload?.threadId)
    },
    'threads/settings'(payload) {
      return hub.getThreadSettings(payload?.threadId)
    },
    'threads/close'(payload) {
      return hub.closeThread(payload?.threadId)
    },
    'threads/new'(payload) {
      return hub.newThread(payload ?? {})
    },
    'threads/rename'(payload) {
      return hub.renameThread(payload ?? {})
    },
    'threads/archive'(payload) {
      return hub.archiveThread(payload ?? {})
    },
    'threads/unarchive'(payload) {
      return hub.unarchiveThread(payload ?? {})
    },
    'threads/delete'(payload) {
      return hub.deleteThread(payload ?? {})
    },
    'threads/fork'(payload) {
      return hub.forkThread(payload ?? {})
    },
    'threads/export'(payload) {
      return hub.exportThread(payload ?? {})
    },
    'turns/start'(payload) {
      return hub.startTurn(payload ?? {})
    },
    'threads/goal'(payload) {
      return hub.setGoal(payload ?? {})
    },
    'threads/compact'(payload) {
      return hub.compactThread(payload?.threadId)
    },
    'turns/steer'(payload) {
      return hub.steerTurn(payload ?? {})
    },
    'turns/interrupt'(payload) {
      return hub.interruptTurn(payload ?? {})
    },
    'skills/list': payload => hub.skills(payload ?? {}),
    'models/list'(payload) {
      return hub.models(payload?.provider)
    },
    'account/rateLimits'(payload) {
      return hub.rateLimits(payload?.provider)
    },
    'config/read'() {
      return hub.configRead()
    },
    'approvals/pending'() {
      return { pending: hub.pendingApprovals() }
    },
    'versions/check'(payload) {
      return versions.check({ refresh: payload?.refresh === true })
    },
    'versions/update'(payload) {
      return versions.update({ force: payload?.force === true })
    },
    'versions/rollback'(payload) {
      return versions.rollback({ version: payload?.version, force: payload?.force === true })
    },
    'versions/job'(payload) {
      return versions.job(payload?.jobId)
    },
    'daemon/action'(payload) {
      return versions.daemonAction({ action: payload?.action, force: payload?.force === true })
    },
    'doctor/run'() {
      return versions.doctor()
    },
    'images/read'(payload) {
      return readImage(payload?.path)
    },
    'fs/check'(payload) {
      return checkDirectory(payload?.path)
    },
    'upload/save'(payload) {
      return saveUpload(payload?.cwd, payload?.name, payload?.dataBase64)
    },
    'fs/list'(payload) {
      return listDirectory(payload?.path)
    },
    'fs/mkdir'(payload) {
      return createDirectory(payload?.path, payload?.name)
    },
    'fs/read'(payload) {
      return readTextFile(payload?.path)
    },
    'git/status'(payload) {
      return gitStatus(payload?.cwd)
    },
    'git/diff'(payload) {
      return gitDiff(payload?.cwd, payload?.path)
    },
    'exec/run'(payload) {
      return runCommand(payload?.cwd, payload?.command)
    },
    'approvals/respond'(payload) {
      if (payload === null || typeof payload !== 'object') {
        throw new HubError('codex-cli/bad-request', '缺少审批响应体')
      }
      return hub.respondApproval(payload.requestId, payload.response ?? payload.decision)
    },
  }

  async function handleRpc(endpoint, payload, signal) {
    if (endpoint.startsWith('git/') && git) {
      try { return {ok:true, value:await git.call(endpoint.slice(4), payload ?? {}, signal)} }
      catch(cause) { return {ok:false,error:{code:cause.code || 'git-vcs/internal',message:cause.message,details:cause.details || {}}} }
    }
    if (!Object.hasOwn(endpoints, endpoint)) {
      return {
        ok: false,
        error: { code: 'codex-cli/unknown-endpoint', message: `未知端点：${String(endpoint)}`, details: {} },
      }
    }
    try {
      const value = await endpoints[endpoint](payload ?? {}, signal)
      return { ok: true, value: value ?? null }
    } catch (cause) {
      if (cause instanceof HubError) {
        return { ok: false, error: { code: cause.code, message: cause.message, details: cause.details } }
      }
      if (cause instanceof JsonRpcError) {
        return {
          ok: false,
          error: {
            code: 'codex-cli/rpc',
            message: cause.message,
            details: { rpcCode: cause.code, data: cause.data ?? null },
          },
        }
      }
      const message = cause instanceof Error ? cause.message : String(cause)
      logger?.warn?.(`[codex-cli] 端点 ${endpoint} 失败：${message}`)
      return { ok: false, error: { code: 'codex-cli/internal', message, details: {} } }
    }
  }

  const handler = async function handler(request, response) {
    const rejection = connection.requestRejection(request)
    if (rejection !== undefined) {
      response.writeHead(rejection)
      response.end(rejection === 401 ? 'unauthorized' : 'forbidden')
      return
    }

    const pathname = (request.url ?? '').split('?')[0]

    if(pathname === CHANNEL+'/workspace/download' && request.method === 'GET'){
      let file
      try {
        const url = new URL(request.url,'http://localhost')
        file = await workspace.download(url.searchParams.get('workspaceId'),url.searchParams.get('path'))
        response.writeHead(200,{
          'content-type':'application/octet-stream',
          'content-length':file.size,
          'content-disposition':"attachment; filename*=UTF-8''"+encodeURIComponent(file.name).replace(/['()*]/g,c=>'%'+c.charCodeAt(0).toString(16)),
          'cache-control':'no-store',
          'x-content-type-options':'nosniff',
        })
        await pipeline(file.stream,response)
      }catch(cause){
        file?.stream.destroy()
        if(!response.headersSent)respondJson(response,400,{error:{code:cause.code||'codex-cli/download-failed',message:cause.message}})
        else response.destroy()
      }
      return
    }
    if (pathname === EVENTS_PATH) {
      handleEvents(request, response)
      return
    }

    if (request.method !== 'POST') {
      response.writeHead(405, { allow: 'POST' })
      response.end('method not allowed')
      return
    }
    if (request.headers['content-type']?.split(';')[0].trim().toLowerCase() !== 'application/json') {
      response.writeHead(415)
      response.end('content type must be application/json')
      return
    }

    let message
    try {
      message = await readJsonBody(request, pathname === CHANNEL + '/workspace/upload' ? Math.max(config.maxBodyBytes, 36 * 1024 * 1024) : config.maxBodyBytes)
    } catch (cause) {
      respondJson(response, 400, {
        type: 'server-response',
        rpcId: 'invalid-request',
        result: {
          ok: false,
          error: {
            code: 'codex-cli/bad-request',
            message: cause instanceof Error ? cause.message : String(cause),
            details: {},
          },
        },
      })
      return
    }

    const rpcId = message !== null && typeof message.rpcId === 'string' ? message.rpcId : 'invalid-request'
    const method = message !== null && typeof message.method === 'string' ? message.method : ''
    const payload = message?.payload ?? {}
    const endpoint = pathname.slice(CHANNEL.length + 1)
    if (
      message?.type !== 'client-request' ||
      rpcId === 'invalid-request' ||
      method !== endpoint ||
      method === '' ||
      typeof payload !== 'object' ||
      Array.isArray(payload)
    ) {
      respondJson(response, 400, {
        type: 'server-response',
        rpcId,
        result: {
          ok: false,
          error: { code: 'codex-cli/bad-request', message: 'RPC 请求格式或端点不匹配', details: {} },
        },
      })
      return
    }

    const controller = new AbortController()
    const cancel = () => {
      if (!response.writableEnded) controller.abort()
    }
    response.once?.('close', cancel)
    let result
    try {
      result = await handleRpc(method, payload, controller.signal)
    } finally {
      response.off?.('close', cancel)
    }
    respondJson(response, 200, { type: 'server-response', rpcId, result })
  }

  function handleEvents(request, response) {
    if (request.method !== 'GET') {
      response.writeHead(405, { allow: 'GET' })
      response.end('method not allowed')
      return
    }
    const url = new URL(request.url ?? EVENTS_PATH, 'http://localhost')
    const lastEventId = request.headers['last-event-id']
    const sinceRaw =
      typeof lastEventId === 'string' && lastEventId !== '' ? lastEventId : url.searchParams.get('since')
    const since = sinceRaw === null ? 0 : Number(sinceRaw)

    response.writeHead(200, {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
      connection: 'keep-alive',
      'x-accel-buffering': 'no',
    })
    response.write('retry: 3000\n\n')
    writeEvent(response, { seq: bus.seq, ts: Date.now(), type: 'hello', payload: { status: hub.status() } })

    const replay = bus.since(Number.isFinite(since) ? since : 0)
    if (replay === null) {
      writeEvent(response, {
        seq: bus.seq,
        ts: Date.now(),
        type: 'resync',
        payload: { reason: 'gap' },
      })
    } else {
      for (const event of replay) writeEvent(response, event)
    }

    const unsubscribe = bus.subscribe((event) => {
      writeEvent(response, event)
    })
    const keepalive = setInterval(() => {
      if (response.writableEnded) return
      response.write(': ping\n\n')
    }, KEEPALIVE_MS)
    keepalive.unref?.()

    const close = () => { cleanup(); response.end() }
    const cleanup = () => {
      clearInterval(keepalive)
      unsubscribe()
      streams.delete(close)
      request.off('close', cleanup)
      response.off('close', cleanup)
    }
    streams.add(close)
    request.once('close', cleanup)
    response.once('close', cleanup)
  }
  handler.dispose = () => { for (const close of [...streams]) close() }
  return handler
}

function writeEvent(response, event) {
  if (response.writableEnded || response.destroyed) return
  response.write(`id: ${event.seq}\nevent: message\ndata: ${JSON.stringify(event)}\n\n`)
}

async function readJsonBody(request, limit) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > limit) throw new Error('请求体过大')
    chunks.push(chunk)
  }
  if (size === 0) return null
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

function respondJson(response, status, value) {
  const body = JSON.stringify(value)
  response.writeHead(status, {
    'content-type': 'application/json',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
  })
  response.end(body)
}
