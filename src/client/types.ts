/** 宿主 DTO 与 codex 协议的浏览器侧最小类型。 */

export interface CodexThread {
  modelProvider?: string
  id: string
  sessionId: string | null
  name: string | null
  preview: string
  cwd: string | null
  model: string | null
  reasoningEffort: string | null
  status: { type: string, activeFlags?: string[] } | null
  source: unknown
  createdAt: number | null
  updatedAt: number | null
  cliVersion: string | null
  path: string | null
  gitInfo: { branch?: string | null, sha?: string | null, originUrl?: string | null } | null
  parentThreadId?: string | null
  forkedFromId?: string | null
  agentNickname?: string | null
  agentRole?: string | null
  ephemeral?: boolean
}

export interface CodexItem {
  id: string
  type: string
  startedAtMs?: number | null
  completedAtMs?: number | null
  text?: string
  summary?: string[]
  content?: Array<{ type: string, text?: string, path?: string, url?: string, name?: string }>
  command?: string
  cwd?: string
  status?: string
  exitCode?: number | null
  durationMs?: number | null
  aggregatedOutput?: string | null
  changes?: Array<{ path: string, kind: unknown, diff: string }>
  server?: string
  tool?: string
  arguments?: unknown
  result?: unknown
  error?: unknown
  phase?: string | null
  [key: string]: unknown
}

export interface CodexTurn {
  id: string
  status?: string
  items?: CodexItem[]
  startedAt?: number | null
  completedAt?: number | null
  error?: unknown
}

export interface FollowupEntry {
  id: string
  status: 'queued' | 'editing' | 'sending' | 'failed'
  params: {
    text: string
    attachments: Array<{ name: string, path: string, kind: 'file' | 'image' }>
  }
  error: string | null
}

export interface FollowupSnapshot {
  instanceId: string
  threadId: string
  revision: number
  paused: boolean
  entries: FollowupEntry[]
}

export interface ThreadDetail {
  thread: CodexThread
  turns: CodexTurn[]
  nextCursor: string | null
}

export interface Project {
  cwd: string
  name: string
  threadCount: number
  activeCount: number
  lastUpdatedAt: number
  models: string[]
  git: { branch?: string | null, sha?: string | null, originUrl?: string | null } | null
  latest: { id: string, name: string | null, preview: string, status: string | null } | null
}

export interface HubStatus {
  phase: 'idle' | 'connecting' | 'ready' | 'error' | 'stopped'
  kind: 'daemon' | 'stdio' | null
  socketPath: string | null
  codexVersion: string | null
  error: string | null
  connectedAt: number | null
  reconnects: number
  config: { transport: string, codexHome: string, approvalTimeoutMs: number }
  subscriptions?: string[]
  pendingApprovals?: number
  seq?: number
  pending?: unknown[]
}

export interface CodexEvent {
  seq: number
  ts: number
  type: string
  payload: any
  threadId?: string
  turnId?: string
  itemId?: string
  channel?: string
  summaryIndex?: number
  contentIndex?: number
}

export interface PendingApproval {
  requestId: string | number
  method: string
  params: any
  createdAt: number
}

export interface ThreadPage {
  data: CodexThread[]
  nextCursor: string | null
}

export interface RateLimitWindow {
  usedPercent: number
  windowDurationMins: number | null
  resetsAt: number | null
}

export interface RateLimits {
  planType: string | null
  primary: RateLimitWindow | null
  secondary: RateLimitWindow | null
  monthly?: RateLimitWindow | null
  credits: { hasCredits: boolean, unlimited: boolean, balance: string | null } | null
  resetCredits: number
  ordinaryUsageAllowed: boolean | null
}
