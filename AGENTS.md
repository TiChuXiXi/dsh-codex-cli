# 仓库开发说明

本文件适用于整个仓库。项目是 DeepSeek Harness（DSH）的 Codex CLI 管理插件，宿主通过 Codex app-server 通信，浏览器通过 RPC 和 SSE 展示会话及工作区。

## 文件操作与变更范围

- 文件读取、写入、编辑、列目录和文件名搜索优先使用 filesystem MCP；工具不可用、失败、超时或目标不受支持时再使用终端，并简要说明原因。
- 代码符号和调用关系优先使用可用的代码语义检索；文字搜索使用 `rg`。
- 开始修改前检查 `git status --short --branch`，保留用户已有改动，避免无关格式化和覆盖重写。
- 提交、推送等操作按用户明确要求执行。推送前检查跟踪关系，显式指定正确的远程目标；本地分支名可能与远程分支名不同。
- `docs/` 的计划和交接包含历史状态，以当前代码、脚本与用户最新要求为准，不把旧待办视为仍未实现的功能。

## 仓库结构

| 路径 | 职责 |
| --- | --- |
| `index.js` | 宿主插件入口：配置、服务装配、路由注册与生命周期 |
| `lib/config.js` | 默认配置及归一化 |
| `lib/hub.js`、`lib/provider-hub.js` | Codex 协议封装、会话操作与提供商路由 |
| `lib/jsonrpc.js`、`lib/transport/` | JSON-RPC、守护进程及 stdio 传输 |
| `lib/routes.js`、`lib/events.js` | HTTP RPC、认证栅栏、SSE 事件流 |
| `lib/workspace.js`、`lib/fs.js`、`lib/git.js` | 工作区文件、命令与 Git 服务 |
| `lib/skills.js`、`lib/thread-titles.js` | 技能输入解析与后台会话标题生成 |
| `src/client/index.tsx` | 浏览器插件入口及 DSH 槽位接入 |
| `src/client/page/` | 会话页面、消息、输入区及审批 |
| `src/client/components/` | 共用界面组件 |
| `src/client/sidebar/` | 文件、文档、Git 等工作区面板 |
| `src/client/styles.ts`、`workbench-styles.ts` | 基础样式及工作台覆盖样式，后者位于 `src/client/` |
| `src/client/i18n.ts`、`types.ts`、`rpc.ts` | 翻译、客户端类型及 RPC 封装，均位于 `src/client/` |
| `client.js` | 已跟踪的浏览器构建产物，不能手工修改 |
| `test/*.test.mjs` | 本地 Node 测试（Git 忽略，不随克隆分发），含临时 Git 仓库和模拟协议服务 |
| `scripts/` | 构建、宿主重组与实际环境验收脚本 |
| `vendor/dsh-dockkit/` | 第三方组件快照；来源见其中的 `PROVENANCE.md` |
| `docs/`、`shots/` | 设计/验收记录及已脱敏截图 |
| `research/`、`.dsh-uploads/` | 被 Git 忽略的研究资料和上传文件，不作为发布源码 |

## 环境与构建

- 使用 npm，保留 `package-lock.json`；依赖变化时同步更新锁文件。
- README 的已验证环境为 Linux、Node.js 24.19.0、Codex CLI 0.167.0、DSH 0.2.1-rc.5。这是验证记录，不代表所有组件的最低版本要求。
- 根 `package.json` 使用 `"type": "module"`；宿主直接运行 JavaScript ESM，没有单独的宿主编译步骤。
- 前端使用 React、TypeScript/TSX、esbuild；React 由 DSH 提供。

在仓库根目录执行：

```bash
npm ci
npm run build
npm test
```

- `npm ci` 用于按锁文件安装；修改依赖时使用相应的 npm 安装命令。
- `npm run build` 将 `src/client/index.tsx` 打包为根目录 `client.js`。修改前端源码、样式或前端依赖后重新构建，并将产物纳入同次变更。
- 保留 `window.__ModuleLoader__.load({ id, factory })` 包装；`react`、`react-dom`、`react/jsx-runtime` 必须保持 external，避免加载第二份 React。
- 构建脚本通过临时文件和重命名发布完整产物；不要用手写补丁替代生成流程。
- 仓库目前没有独立的 lint 或 TypeScript 类型检查命令；esbuild 构建通过不等于完成类型检查。

## 测试与验收

`test/` 仅在本地保留，已从 Git 跟踪中移除；新克隆不包含测试文件。仅在本地已有该目录和测试文件时运行 `npm test`，它执行 `node --test test/*.test.mjs`。缺少测试文件时明确报告未执行，不把缺失当作测试通过。只运行受影响模块时，例如：

```bash
node --test test/git.test.mjs test/git-push.test.mjs
node --test test/thread-titles.test.mjs
```

- 沿用 `node:test` 与 `node:assert/strict`。测试文件使用 `.test.mjs` 命名。
- Git、文件写入和子进程测试使用临时夹具；通过模拟 app-server 验证请求、通知、异常和取消，不依赖真实模型。
- TypeScript 纯函数测试已有直接导入及 esbuild 转换两种模式，按相邻测试和运行环境选择。
- 行为修改补充相应回归验证，优先覆盖边界、竞态及失败路径；纯文档或简单样式调整不必添加复述实现的测试。
- 提交前运行 `git diff --check`。执行与改动相关的测试；前端改动还需构建，重要交互需浏览器验证。

实际环境验收与普通自动测试分开：

| 命令 | 用途 |
| --- | --- |
| `npm run test:sidebar:live` | 实际 DSH 工作区侧栏验收 |
| `npm run test:workbench:live` | 工作台布局、交互及可选热加载验收 |
| `node scripts/verify-git-live.mjs` | 实际 Git RPC 与临时仓库验收 |
| `node scripts/verify-permissions-live.mjs` | 使用延迟模拟设置响应验证权限提示 |

这些脚本需要正在运行的 DSH、Playwright 和浏览器。使用 `DSH_BASE_URL` 明确目标地址；不同脚本的默认端口不同。按脚本需要设置 `DSH_BROWSER_STATE`、`PLAYWRIGHT_MODULE`、`CHROMIUM_PATH`。浏览器登录状态应放在仓库外，不能提交。运行其他 `verify-*` 或 `smoke-*` 脚本前先阅读其行为，部分会调用真实模型或创建测试会话。

## 代码约定

- 遵循附近代码风格：通常使用单引号、无分号；较早模块和紧凑 TSX 的排版并不完全一致，不为统一样式重排无关代码。
- 宿主 ESM 相对导入带 `.js` 后缀；前端类型用 `import type`。组件名使用 PascalCase，函数和局部变量使用 camelCase。
- `index.js` 保持装配职责；协议、传输、Git 和文件逻辑放在对应 `lib/` 模块。宿主业务模块通过参数接收配置、日志与事件总线，避免引入不必要的 DSH 运行时依赖。
- 配置默认值与校验集中维护；新增接口同步更新路由、客户端调用/类型及相关测试，保持现有 RPC 响应与 SSE 事件格式。
- 异步操作处理会话/项目切换、过期响应与取消；定时器、监听、订阅、文件观察器、SSE 和子进程须在关闭或卸载时清理。
- 工作区操作保留真实路径和项目边界校验。Git 使用参数数组执行命令，保留写操作开关、输出上限、超时与取消机制。
- 提交详情中的分支信息表示包含该提交的分支；推送目标优先沿用所选远程的跟踪关系。已同步/仅落后与尚未发布的分支要区分。
- 后台自动标题使用隔离的临时会话，避免将其消息或审批显示到用户会话；已有名称和手动重命名优先。
- 共用 UI 放在 `components/`；图标复用 `Icon`、`IconButton`。文案优先沿用 `i18n.ts` 的中英文词典。
- 样式限制在 `.dsh-codex-root` 或所属面板作用域，使用 `--codex-*` 等现有变量，避免影响 DSH 宿主。注意 `workbench-styles.ts` 对基础样式的覆盖顺序。
- 消息列表由 `.dsh-codex-message-content` 管理条目间距；消息末尾 Markdown 外边距应清零，避免与容器 gap 叠加。样式验收应测量可见内容间距，兼顾工具组展开、移动端与深浅主题。
- 修改第三方快照或引入第三方代码时，保留来源与许可证，并同步 `THIRD_PARTY_NOTICES.md`。

## 热加载验证

`npm run dev:reload:host` 只触发 DSH profile 重组；通过 `DSH_PROFILE_DIR` 指定目标 profile。配置事件成功不能证明宿主已替换代码。

- 宿主更新后检查 `status.runtime.hostInstanceId`、`hostBuildId` 与 `activeInstances`，并调用实际受影响接口确认行为。
- 前端检查根节点的 `data-client-build` 及实际页面；需要验证热替换时，确认草稿、主题和当前会话等状态恢复正常。
- 明确报告已执行的验证，区分构建成功、模拟测试通过与实际主服务验收结果。
