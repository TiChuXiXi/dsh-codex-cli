/**
 * 构建浏览器半区：src/client/index.tsx -> client.js
 *
 * 产物必须是一个 `window.__ModuleLoader__.load({ id, factory })` 包裹的单文件：
 *   - `react` 保持 external，由平台模块表提供（双 React 会让 hooks 失效）；
 *   - 其余依赖（目前没有）打进包里；
 *   - factory 内部的 `module` / `exports` / `require` 由包裹层提供。
 */

import { build } from 'esbuild'
import { writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const result = await build({
  entryPoints: [resolve(root, 'src/client/index.tsx')],
  bundle: true,
  write: false,
  format: 'cjs',
  platform: 'browser',
  target: ['es2022'],
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  external: ['react'],
  charset: 'utf8',
  legalComments: 'none',
  logLevel: 'warning',
  define: {
    'process.env.NODE_ENV': '"production"',
  },
})

if (result.outputFiles.length === 0) throw new Error('esbuild 没有产出文件')
const code = result.outputFiles[0].text
const indented = code
  .split('\n')
  .map((line) => (line === '' ? '' : `    ${line}`))
  .join('\n')

const wrapped = `/* dsh-codex-cli 浏览器半区（scripts/build-client.mjs 生成，勿手改） */
window.__ModuleLoader__.load({
  id: 'dsh-codex-cli',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
${indented}
    return module.exports
  },
})
`

await writeFile(resolve(root, 'client.js'), wrapped)
console.log(`client.js ${Buffer.byteLength(wrapped)} bytes`)
