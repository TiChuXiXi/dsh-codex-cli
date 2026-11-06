/** 目录检查：新建项目前确认路径存在且是目录。 */

import { stat } from 'node:fs/promises'
import { HubError } from './hub.js'

export async function checkDirectory(path) {
  if (typeof path !== 'string' || path.trim() === '') {
    throw new HubError('codex-cli/bad-request', 'path 不能为空')
  }
  const target = path.trim()
  try {
    const info = await stat(target)
    return { path: target, exists: true, isDirectory: info.isDirectory() }
  } catch {
    return { path: target, exists: false, isDirectory: false }
  }
}
