/** 本地图片读取：给对话里的 imageView 条目做预览。 */

import { readFile, stat } from 'node:fs/promises'
import { extname } from 'node:path'
import { HubError } from './hub.js'

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
}

const MAX_BYTES = 8 * 1024 * 1024

/** 读一张本地图片并转成 data URL；只接受常见图片扩展名与 8MB 以内的文件。 */
export async function readImage(path) {
  if (typeof path !== 'string' || path === '') {
    throw new HubError('codex-cli/bad-request', 'path 不能为空')
  }
  const mime = MIME[extname(path).toLowerCase()]
  if (mime === undefined) {
    throw new HubError('codex-cli/unsupported-image', '只支持 png/jpg/jpeg/webp/gif', { path })
  }
  let info
  try {
    info = await stat(path)
  } catch (cause) {
    throw new HubError('codex-cli/image-missing', `读取图片失败：${cause instanceof Error ? cause.message : String(cause)}`, { path })
  }
  if (!info.isFile()) throw new HubError('codex-cli/not-a-file', '路径不是文件', { path })
  if (info.size > MAX_BYTES) {
    throw new HubError('codex-cli/image-too-large', '图片超过 8MB', { path, size: info.size })
  }
  const data = await readFile(path)
  return {
    path,
    mime,
    size: info.size,
    dataUrl: `data:${mime};base64,${data.toString('base64')}`,
  }
}
