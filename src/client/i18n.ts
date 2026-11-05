/**
 * 文案：中文为键集合来源，英文对齐。
 *
 * 注册方式：ctx.locale.register(NS, { zh, en })，槽位注册项带 locale: NS 时组件会拿到 t。
 * 组件内部通过 I18nContext 取 t，避免层层传参。
 */

import * as React from 'react'

export const NS = 'codexCli'

export const zh = {
  'app.title': 'Codex',
  'app.subtitle': 'Codex CLI 管理端',

  'status.idle': '未连接',
  'status.connecting': '连接中',
  'status.ready': '已连接',
  'status.error': '连接失败',
  'status.stopped': '已停止',
  'status.daemon': '守护进程',
  'status.stdio': '独立实例',
  'status.version': 'Codex {version}',
  'status.refresh': '刷新',
  'status.events.connecting': '连接中',
  'status.events.open': '实时',
  'status.events.reconnecting': '重连中',
  'status.events.closed': '离线',

  'projects.title': '项目',
  'projects.all': '全部会话',
  'projects.count': '{count} 个会话',
  'projects.active': '{count} 个运行中',
  'projects.empty': '还没有任何会话',

  'threads.loading': '加载中…',
  'threads.empty': '这个项目还没有会话',
  'threads.loadMore': '加载更多',
  'threads.archived': '已归档',
  'threads.search': '搜索会话',
  'threads.title': '会话',

  'composer.placeholder': '给 Codex 发消息…',
  'composer.steerPlaceholder': '插话到正在运行的回合…',
  'composer.send': '发送',
  'composer.steer': '插话',
  'composer.stop': '停止',
  'composer.sendHint': 'Enter 发送，Shift+Enter 换行',
  'composer.steerHint': '回合运行中：发送会插话，不会新开回合',

  'approval.command': '命令审批',
  'approval.file': '文件变更审批',
  'approval.input': '需要你的选择',
  'approval.permissions': '权限申请',
  'approval.elicitation': 'MCP 请求',
  'approval.allow': '允许',
  'approval.allowSession': '本会话允许',
  'approval.deny': '拒绝',
  'approval.cancel': '取消',
  'approval.submit': '提交',
  'approval.reason': '原因',
  'approval.cwd': '目录',
  'approval.grantRoot': '授权目录',
  'approval.other': '其他',

  'newThread.title': '新会话',
  'newThread.cwd': '工作目录',
  'newThread.model': '模型',
  'newThread.effort': '推理强度',
  'newThread.approval': '审批策略',
  'newThread.sandbox': '沙箱',
  'newThread.create': '创建',
  'newThread.creating': '创建中…',
  'newThread.cancel': '取消',
  'newThread.default': '默认',
  'newThread.open': '新会话',
  'newThread.failed': '创建会话失败',

  'thread.select': '从左侧选择一个会话',
  'thread.selectHint': '也可以从项目列表里挑一个项目，再打开其中的会话。',
  'thread.messages': '{count} 条消息',
  'thread.noMessages': '这个会话还没有消息',
  'thread.loading': '读取会话…',
  'thread.cwd': '工作目录',
  'thread.model': '模型',
  'thread.effort': '推理强度',
  'thread.status': '状态',
  'thread.git': 'Git',
  'thread.created': '创建于',
  'thread.updated': '更新于',
  'thread.subscribeFailed': '无法订阅实时事件（历史仍可查看）',

  'state.active': '运行中',
  'state.idle': '空闲',
  'state.notLoaded': '未加载',
  'state.systemError': '系统错误',

  'item.user': '你',
  'item.assistant': 'Codex',
  'item.reasoning': '思考过程',
  'item.command': '命令',
  'item.files': '文件变更',
  'item.tool': '工具调用',
  'item.plan': '计划',
  'item.search': '网页搜索',
  'item.image': '图片',
  'item.compaction': '上下文已压缩',
  'item.review': '代码审查',
  'item.other': '{type}',

  'item.exitCode': '退出码 {code}',
  'item.output': '输出',
  'item.files.changed': '{count} 个文件',

  'error.title': '出错了',
  'error.retry': '重试',
  'error.offline': '宿主未连接，稍后会自动重试。',

  'time.justNow': '刚刚',
  'time.minutes': '{count} 分钟前',
  'time.hours': '{count} 小时前',
  'time.days': '{count} 天前',
}

export const en = {
  'app.title': 'Codex',
  'app.subtitle': 'Codex CLI console',

  'status.idle': 'Not connected',
  'status.connecting': 'Connecting',
  'status.ready': 'Connected',
  'status.error': 'Connection failed',
  'status.stopped': 'Stopped',
  'status.daemon': 'Daemon',
  'status.stdio': 'Private instance',
  'status.version': 'Codex {version}',
  'status.refresh': 'Refresh',
  'status.events.connecting': 'Connecting',
  'status.events.open': 'Live',
  'status.events.reconnecting': 'Reconnecting',
  'status.events.closed': 'Offline',

  'projects.title': 'Projects',
  'projects.all': 'All sessions',
  'projects.count': '{count} sessions',
  'projects.active': '{count} running',
  'projects.empty': 'No sessions yet',

  'threads.loading': 'Loading…',
  'threads.empty': 'No sessions in this project',
  'threads.loadMore': 'Load more',
  'threads.archived': 'Archived',
  'threads.search': 'Search sessions',
  'threads.title': 'Sessions',

  'composer.placeholder': 'Message Codex…',
  'composer.steerPlaceholder': 'Steer the running turn…',
  'composer.send': 'Send',
  'composer.steer': 'Steer',
  'composer.stop': 'Stop',
  'composer.sendHint': 'Enter to send, Shift+Enter for a new line',
  'composer.steerHint': 'Turn running: sending steers it instead of starting a new turn',

  'approval.command': 'Command approval',
  'approval.file': 'File change approval',
  'approval.input': 'Input required',
  'approval.permissions': 'Permission request',
  'approval.elicitation': 'MCP request',
  'approval.allow': 'Allow',
  'approval.allowSession': 'Allow for session',
  'approval.deny': 'Decline',
  'approval.cancel': 'Cancel',
  'approval.submit': 'Submit',
  'approval.reason': 'Reason',
  'approval.cwd': 'Directory',
  'approval.grantRoot': 'Grant root',
  'approval.other': 'Other',

  'newThread.title': 'New session',
  'newThread.cwd': 'Working directory',
  'newThread.model': 'Model',
  'newThread.effort': 'Reasoning effort',
  'newThread.approval': 'Approval policy',
  'newThread.sandbox': 'Sandbox',
  'newThread.create': 'Create',
  'newThread.creating': 'Creating…',
  'newThread.cancel': 'Cancel',
  'newThread.default': 'Default',
  'newThread.open': 'New session',
  'newThread.failed': 'Could not create the session',

  'thread.select': 'Pick a session on the left',
  'thread.selectHint': 'Or choose a project, then open one of its sessions.',
  'thread.messages': '{count} messages',
  'thread.noMessages': 'No messages in this session yet',
  'thread.loading': 'Loading session…',
  'thread.cwd': 'Working directory',
  'thread.model': 'Model',
  'thread.effort': 'Reasoning effort',
  'thread.status': 'Status',
  'thread.git': 'Git',
  'thread.created': 'Created',
  'thread.updated': 'Updated',
  'thread.subscribeFailed': 'Could not subscribe to live events (history is still available)',

  'state.active': 'Running',
  'state.idle': 'Idle',
  'state.notLoaded': 'Not loaded',
  'state.systemError': 'System error',

  'item.user': 'You',
  'item.assistant': 'Codex',
  'item.reasoning': 'Reasoning',
  'item.command': 'Command',
  'item.files': 'File changes',
  'item.tool': 'Tool call',
  'item.plan': 'Plan',
  'item.search': 'Web search',
  'item.image': 'Image',
  'item.compaction': 'Context compacted',
  'item.review': 'Code review',
  'item.other': '{type}',

  'item.exitCode': 'exit {code}',
  'item.output': 'Output',
  'item.files.changed': '{count} files',

  'error.title': 'Something went wrong',
  'error.retry': 'Retry',
  'error.offline': 'The host is not connected; retrying automatically.',

  'time.justNow': 'just now',
  'time.minutes': '{count}m ago',
  'time.hours': '{count}h ago',
  'time.days': '{count}d ago',
}

export const dictionaries = { zh, en }

export type Translate = (key: string, vars?: Record<string, string | number>) => string

/** 兜底翻译：没有 t 时按 key 查中文，再查英文，最后原样返回。 */
export function fallbackTranslate(key: string, vars?: Record<string, string | number>): string {
  const template = zh[key] ?? en[key] ?? key
  if (vars === undefined) return template
  return template.replace(/\{(\w+)\}/gu, (match, name) => (vars[name] === undefined ? match : String(vars[name])))
}

export const I18nContext = React.createContext<Translate>(fallbackTranslate)

export function useT(): Translate {
  return React.useContext(I18nContext)
}
