/**
 * 插件配置：默认值 + 归一化。
 *
 * 刻意不导出 Schemastery Config —— 本插件零 @deepseek-ai/* 运行时依赖，
 * 配置校验自己做，缺省值即文档。
 */

export const DEFAULTS = {
  /** auto = 守护进程优先、失败回退 stdio；daemon = 只连守护进程；stdio = 私有实例。 */
  transport: 'auto',
  /** codex 可执行文件绝对路径；空 = 从 PATH 解析。 */
  codexPath: '',
  /** CODEX_HOME；空 = 环境变量或 ~/.codex。 */
  codexHome: '',
  /** 审批无人响应时的自动拒绝时间（毫秒）；0 = 永不自动拒绝。 */
  approvalTimeoutMs: 600000,
  /** SSE 环形缓冲保留的事件条数。 */
  eventBufferSize: 5000,
  /** 单次 RPC 请求体上限（字节）。 */
  maxBodyBytes: 2 * 1024 * 1024,
  /** 守护进程未运行时，尝试 `daemon start` 并等待套接字的超时（毫秒）。 */
  daemonStartTimeoutMs: 15000,
  /** 断线重连退避基数与上限（毫秒）。 */
  reconnectBaseMs: 500,
  reconnectMaxMs: 15000,
  /** `thread/list` 分页页大小与项目聚合最多扫描的页数。 */
  threadPageSize: 50,
  projectScanPages: 10,
  /** 项目聚合缓存时间（毫秒）。 */
  projectCacheTtlMs: 15000,
}

function clampInt(value, min, max, fallback) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback
  const int = Math.trunc(value)
  if (int < min) return min
  if (int > max) return max
  return int
}

/** 合并配置：只接受已知键与正确类型，数字做范围钳制。 */
export function normalizeConfig(raw) {
  const input = raw !== null && typeof raw === 'object' ? raw : {}
  const config = { ...DEFAULTS }
  for (const key of Object.keys(DEFAULTS)) {
    const value = input[key]
    if (value === undefined || value === null) continue
    if (typeof value !== typeof DEFAULTS[key]) continue
    config[key] = value
  }
  if (!['auto', 'daemon', 'stdio'].includes(config.transport)) config.transport = DEFAULTS.transport
  config.approvalTimeoutMs = clampInt(config.approvalTimeoutMs, 0, 24 * 60 * 60 * 1000, DEFAULTS.approvalTimeoutMs)
  config.eventBufferSize = clampInt(config.eventBufferSize, 100, 100000, DEFAULTS.eventBufferSize)
  config.maxBodyBytes = clampInt(config.maxBodyBytes, 4096, 64 * 1024 * 1024, DEFAULTS.maxBodyBytes)
  config.daemonStartTimeoutMs = clampInt(config.daemonStartTimeoutMs, 1000, 120000, DEFAULTS.daemonStartTimeoutMs)
  config.reconnectBaseMs = clampInt(config.reconnectBaseMs, 100, 60000, DEFAULTS.reconnectBaseMs)
  config.reconnectMaxMs = clampInt(config.reconnectMaxMs, 500, 300000, DEFAULTS.reconnectMaxMs)
  config.threadPageSize = clampInt(config.threadPageSize, 1, 200, DEFAULTS.threadPageSize)
  config.projectScanPages = clampInt(config.projectScanPages, 1, 50, DEFAULTS.projectScanPages)
  config.projectCacheTtlMs = clampInt(config.projectCacheTtlMs, 0, 300000, DEFAULTS.projectCacheTtlMs)
  return config
}
