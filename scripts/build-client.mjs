/**
 * 构建浏览器半区：src/client/index.tsx -> client.js
 *
 * 产物必须是一个 `window.__ModuleLoader__.load({ id, factory })` 包裹的单文件：
 *   - `react` 保持 external，由平台模块表提供（双 React 会让 hooks 失效）；
 *   - 其余依赖（目前没有）打进包里；
 *   - factory 内部的 `module` / `exports` / `require` 由包裹层提供。
 */

import { build } from 'esbuild'
import { readFile, writeFile, rename } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const result = await build({
  entryPoints: [resolve(root, 'src/client/index.tsx')],
  bundle: true,
  outdir: resolve(root, '.client-build'),
  loader: { '.module.css': 'local-css' },
  plugins: [{
    name: 'scope-terminal-css',
    setup(build) {
      build.onLoad({ filter: /[/\\\\]@xterm[/\\\\]xterm[/\\\\]css[/\\\\]xterm\.css$/ }, async ({ path }) => ({
        contents: '.dsh-codex-root {\n' + await readFile(path, 'utf8') + '\n}',
        loader: 'css',
      }))
    },
  }],
  write: false,
  format: 'cjs',
  platform: 'browser',
  target: ['es2022'],
  jsx: 'automatic',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  charset: 'utf8',
  legalComments: 'none',
  logLevel: 'warning',
  define: {
    'process.env.NODE_ENV': '"production"',
    '__CODEX_CLIENT_BUILD_ID__': JSON.stringify(process.env.CODEX_CLIENT_BUILD_ID || new Date().toISOString()),
  },
})

if (result.outputFiles.length === 0) throw new Error('esbuild 没有产出文件')
const code = result.outputFiles.find(file => file.path.endsWith('.js')).text
const css = result.outputFiles.filter(file => file.path.endsWith('.css')).map(file => file.text).join('\n')
const indented = code
  .split('\n')
  .map((line) => (line === '' ? '' : `    ${line}`))
  .join('\n')

const wrapped = `/* dsh-codex-cli 浏览器半区（scripts/build-client.mjs 生成，勿手改） */
window.__ModuleLoader__.load({
  id: 'dsh-codex-cli',
  factory: (require) => {
    const __CODEX_BUNDLE_CSS__ = ${JSON.stringify(css)}
    var module = { exports: {} }
    var exports = module.exports
${indented}
    return module.exports
  },
})
`

// Publish the entry atomically only after the complete bundle and CSS are ready.
await writeFile(resolve(root, 'client.js.next'), wrapped)
await rename(resolve(root, 'client.js.next'), resolve(root, 'client.js'))
console.log(`client.js ${Buffer.byteLength(wrapped)} bytes`)
