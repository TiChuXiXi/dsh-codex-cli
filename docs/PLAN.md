# DSH Codex CLI 管理端插件 · 规划

状态：实施中 · 2026-11-05
读者：插件实现者（本人与后续 AI 会话）
范围：把本机 Codex CLI 的版本、项目会话与交互对话搬进 DSH Web GUI 的一个插件；不含 Codex 内核改造。

---

## 1. 目标与非目标

### 1.1 目标

1. 在 DSH Web GUI 内完成 Codex 的日常使用：选项目、开新线程、发消息、看流式输出、审批命令、打断、追问。
2. 管理既有会话：按项目（cwd）分组、搜索、重命名、归档、删除、fork、导出，能直接打开终端里跑过的历史线程。
3. 管理版本与运行状态：CLI / 守护进程版本、可用更新、升级与回滚、`codex doctor` 体检、登录与额度。
4. 不要求用户再开终端；终端里正在跑的会话也能在 UI 里实时看到。

### 1.2 非目标

- 不替换 DSH 自己的 agent / 会话系统，不把 Codex 线程伪装成 DSH 会话。
- 不嵌入 Codex TUI（不搬 xterm 里的全屏界面）。
- 不重做 Codex 的全部能力：主题、slash 命令、语音、实时语音、云任务、应用市场等暂不覆盖。
- 不修改 `~/.codex` 的私有数据库；一切读写走 app-server 协议或官方命令。

---

## 2. 环境事实（本机核实）

| 事实 | 值 | 核实方式 |
| --- | --- | --- |
| Codex CLI | `0.166.0`，npm 全局安装（aarch64 linux musl vendor 包） | `codex --version`、`codex doctor --json` 的 `installation.install context` |
| 守护进程 | 运行中，CLI 与 app-server 同为 `0.166.0` | `codex app-server daemon version` |
| 控制套接字 | `~/.codex/app-server-control/app-server-control.sock` → `/tmp/codex-daemon-0/<hash>` | 符号链接 |
| 既有会话 | 79 个线程 / 6 个项目；certbase 53、certbase-offline 18、data-collection 5，其余各 1 | 守护进程 `thread/list` 分页聚合 |
| 使用过的模型 | gpt-6.1-sol / gpt-6.1-terra / gpt-6-astra / gpt-6-luna / gpt-6-sol / gpt-5.6-sol | 同上 |
| 协议 | JSON-RPC 2.0；`codex app-server generate-ts` 产出 97 个类型文件，`generate-json-schema` 产出 4.6 MB schema | 本机生成 |
| 升级方式 | `codex update` → `npm install -g @openai/codex`；版本缓存 `~/.codex/version.json` | `codex doctor --json` 的 `updates.status` |
| 最新版本 | 0.166.0（npmjs 与 npmmirror 一致，均可访问） | 两个 registry 的 `/latest` |
| DSH | `0.2.1-rc.5`，web profile 运行在 `http://127.0.0.1:3080` | `dsh --version`、profile 配置 |

### 2.1 关键实验结论

1. **app-server 可独立驱动**：stdio 启动 `codex app-server`，`initialize` → `thread/list` → `thread/start` → `turn/start`，能收到完整的 `item/started`、`item/*/delta`、`item/completed`、`turn/completed` 流；一个 `Reply with exactly: PONG` 的回合端到端跑通。
2. **终端里正在跑的线程可以被镜像**：以 WebSocket over Unix socket 连守护进程后 `thread/resume` 一个正被 TUI 占用的线程，能实时收到 `item/started` / `item/completed` / `tokenUsage` 等通知。
3. **独立 app-server 抢不到活动线程**：对同一线程 `thread/resume` 返回 `-32600 thread ... already has an active writer`。这决定了默认连接方式（见 3.3）。
4. **审批是服务端发起的请求**：`item/commandExecution/requestApproval`、`item/fileChange/requestApproval`、`item/permissions/requestApproval`、`item/tool/requestUserInput`、`mcpServer/elicitation/request`，客户端必须回响应；被别处回答后会收到 `serverRequest/resolved`。
5. **历史读取是分页的**：`thread/read` 的 `includeTurns` 已被标记废弃，正确姿势是 `thread/read`（元数据）+ `thread/turns/list` + `thread/items/list`。
6. **会话元数据足够做管理端**：线程自带 `cwd`、`name`、`status`（active/idle/notLoaded）、`gitInfo`（branch/sha/originUrl）、`model`、`reasoningEffort`、`source`、`cliVersion`、`updatedAt`。
7. **DSH 侧三条通道都已存在**：宿主 `ctx.webServer.register`（含 SSE）、`ctx.connection.rpc`（浏览器 ↔ 宿主）、客户端 `window.__ModuleLoader__.load` + `require('react')`；第三方插件 `dsh-git-vcs` / `dsh-tab` / `dsh-file-extras` 在本机已验证可用。

---

## 3. 架构

### 3.1 总体形态

```
┌──────────────────────── 浏览器（DSH Web GUI） ────────────────────────┐
│  Codex 管理页（main 面板）        Codex 会话页（右侧栏 tab）            │
│  ├ 项目/线程列表                  └ 按当前 DSH 会话 cwd 过滤            │
│  ├ 对话流（item 卡片 + 审批卡）                                        │
│  ├ 输入区（模型 / 推理强度 / 审批策略 / 沙箱）                          │
│  └ 版本与健康页                                                        │
│         │ POST /codex-cli/*（RPC 信封）      │ SSE /codex-cli/events    │
└─────────┼───────────────────────────────────┼─────────────────────────┘
          ▼                                   ▼
┌──────────────────── DSH 宿主进程（Cordis 插件） ───────────────────────┐
│ CodexHub（单例）                                                       │
│  ├ Transport：daemon(WS over unix) │ stdio(child)   ← 自动选择/回退    │
│  ├ RpcClient：JSON-RPC 2.0，请求表、服务端请求路由、重连                │
│  ├ ThreadRegistry：订阅引用计数、快照缓存、活动状态                    │
│  ├ EventBus：全局 seq、环形缓冲、增量合并、SSE 广播                    │
│  ├ ApprovalBroker：挂起审批、超时策略、跨端解决                        │
│  ├ VersionManager：版本探测 / 升级 / 回滚 / 守护进程                    │
│  └ DoctorService：`codex doctor --json` 解析                           │
└───────────────────────────────┬────────────────────────────────────────┘
                                │ JSON-RPC（同一套 schema）
                                ▼
                 codex app-server 守护进程（或私有 stdio 实例）
                                │
                                ▼
                    ~/.codex（rollouts、state DB、config.toml）
```

### 3.2 为什么走 app-server，而不是 PTY

| 方案 | 交互完整度 | 与终端会话共存 | 结构化数据 | 工作量 | 结论 |
| --- | --- | --- | --- | --- | --- |
| PTY 嵌 xterm 跑 `codex` | 高（原样 TUI） | 各自独立进程 | 无，全是终端字节 | 低 | 只能算“把终端搬进网页”，不做 |
| `codex exec --json` 一次性 | 低（无审批、无追问） | 不共享 | 部分 | 低 | 只适合批处理，不做 |
| **app-server JSON-RPC** | 高（流式、审批、打断、追问） | **可共享守护进程** | 全量结构化 | 中 | **采用** |

### 3.3 连接方式：守护进程优先，stdio 兜底

- **默认**：连本机守护进程的 Unix socket，用 WebSocket 帧跑同一套 JSON-RPC。理由：终端里活动的线程也能 resume、镜像；DSH 重启不影响正在跑的回合；进程唯一。
- **回退**：守护进程不可用且启动失败时，插件自己 `spawn codex app-server`（stdio），功能完整但看不到终端活动线程，且会撞 `already has an active writer`。
- **兜底开关**：插件配置 `transport: auto | daemon | stdio`；`stdio` 用于协议排查与隔离测试。
- 传输层是接口，两种实现同一套 `send/request/notify`；上层（Hub/Registry/EventBus）不感知差异。

---

## 4. DSH 插件骨架

### 4.1 包结构与安装

```
/root/project/dsh-codex-cli/
├── package.json          # dsh.bundle.patch + dsh.client.platform=web + exports ./client
├── cordis.patch.yml      # 插入插件行，行级 inject: [subprocess, connection, webServer]
├── index.js              # 宿主入口（Cordis 插件）
├── lib/                  # 宿主实现（ESM，无构建）
│   ├── hub.js  rpc.js  transport/{daemon,stdio,index}.js
│   ├── events.js  approvals.js  threads.js
│   ├── versions.js  doctor.js  http.js  config.js
├── src/client/           # 浏览器源码（TSX，esbuild 打包）
│   ├── index.tsx         # apply + 槽位注册
│   ├── page/  chat/  approval/  versions/  components/
│   └── rpc.ts  styles.ts  i18n.ts
├── client.js             # 构建产物：window.__ModuleLoader__.load 包裹的单文件
├── locale/{zh,en}.json
├── scripts/              # 构建、假 app-server、探针
├── test/                 # node --test
└── docs/PLAN.md
```

安装：

```bash
dsh plugin --profile web add /root/project/dsh-codex-cli
# 或手工：profile package.json 的 dependencies 加 link:，dsh.profile.bundles 追加 "dsh-codex-cli"
```

宿主侧改动由 `patchReload: live` 热重组；浏览器侧改动需刷新页面（当前没有 `pnpm run dev:web` 监听器）。

### 4.2 宿主半区

- `export const inject = ['subprocess', 'connection', 'webServer']`，并在 `cordis.patch.yml` 的行上重复声明（loader 按行激活，模块级 inject 管不到行）。
- 进程启动：优先 `ctx.subprocess`；WS 客户端用插件自己的 `ws` 依赖（DSH 不保证把 `ws` 暴露给插件）。
- 路由：`ctx.webServer.register({ kind: 'prefix', path: '/codex-cli', handler })`；每个请求先过 `ctx.connection.requestRejection(request)`（Host/Origin + 会话认证）。
- SSE：同一 prefix 下的 `/codex-cli/events`，`text/event-stream`，带 `id:` 与 `retry:`；webserver 对 SSE 不压缩。
- 生命周期：`ctx.effect()` 注册与释放；插件卸载时断开传输、清空缓冲、终止子进程。

### 4.3 浏览器半区

- 包声明 `dsh.client.platform: 'web'`，导出 `./client`；产物是 `window.__ModuleLoader__.load({ id, factory })` 包裹的单文件，`require('react')` 走平台模块表。
- 非基线依赖（markdown、diff 渲染等）在构建时打进 `client.js`；`react` / `react/jsx-runtime` 保持 external，避免双 React。
- 槽位注册：

| 槽位 | 用途 |
| --- | --- |
| `sidebar.panellist`（`id: 'codex-cli'` + icon/label） | 左侧栏入口图标 |
| `main`（`key: 'codex-cli'`） | 管理页正文（项目 / 线程 / 对话 / 版本） |
| `sidebar.right.pane.tab` + `sidebar.right.pane.tab.title` + `ctx.sidebarRightTabs.register` | 右侧栏「Codex」页，按 `props.sessionId` 取当前 DSH 会话 cwd |
| `settings.section`（可选） | 插件设置（transport、codex 路径、审批超时、语言） |

- 组件通过注册项的 `inject` 工厂拿到 `call(endpoint, payload)`，不直接碰 `ctx`。
- 文案走 `ctx.locale.register(NS, { zh, en })`。

### 4.4 通信契约

**RPC**（`ctx.connection.rpc.call('/codex-cli', endpoint, payload)`，返回 `{ ok, value | error }`）：

| endpoint | 作用 |
| --- | --- |
| `status` | 连接状态、CLI/daemon 版本、认证、额度 |
| `threads/list` | `{ cursor, cwd, search, archived, sortKey }` → 线程页 |
| `threads/get` | `{ threadId, before?, limit? }` → 元数据 + 一页 turns/items |
| `threads/open` / `threads/close` | resume + 订阅 / 释放订阅 |
| `threads/new` | `{ cwd, model, effort, approvalPolicy, sandbox }` |
| `threads/rename` `archive` `unarchive` `delete` `fork` | 会话管理 |
| `threads/export` | 导出 markdown / JSONL 文本 |
| `turns/start` `turns/steer` `turns/interrupt` | 对话 |
| `approvals/respond` | `{ requestId, decision }` |
| `input/respond` | `{ requestId, answers }` |
| `models/list` `config/read` | 选择器数据 |
| `versions/check` `versions/update` `versions/rollback` `daemon/update` `daemon/restart` | 版本管理（`update` 走 SSE 推送日志） |
| `doctor/run` | 体检 |
| `projects/list` | 由线程聚合出的项目视图 |

**SSE 事件信封**：

```json
{ "seq": 1287, "ts": 1793871432346, "type": "item/delta", "threadId": "...", "turnId": "...", "itemId": "...", "payload": { "delta": "PONG" } }
```

事件类型：`hello`、`thread/upsert`、`thread/status`、`turn/started`、`turn/completed`、`item/upsert`、`item/delta`、`approval/requested`、`approval/resolved`、`input/requested`、`log`、`version/progress`、`connection`。

**一致性**：

- 宿主给每个事件分配全局自增 `seq`，保留最近 N 条（默认 5000）环形缓冲。
- 浏览器断线重连带 `Last-Event-ID` / `since`；缺口超出缓冲时，客户端对该线程重新拉 `threads/get` 全量快照。
- 增量合并：文本 delta 按 50 ms 合并批量发送，避免高频小包。

---

## 5. 功能设计

### 5.1 交互对话

**新线程**：选项目（cwd，带最近项目列表）、模型、推理强度、审批策略（`untrusted` / `on-request` / `granular` / `never`）、沙箱（`read-only` / `workspace-write` / `danger-full-access`）。默认值取 `config/read`。

**回合**：

- 空闲 → `turn/start`，`input: [{ type: 'text', text, text_elements: [] }]`；图片走 `localImage`（粘贴上传到临时目录）或 `image`。
- 运行中 → 输入区切成「插话（steer）」：`turn/steer` 必须带 `expectedTurnId`；失败说明回合已结束，回退为 `turn/start`。
- 停止 → `turn/interrupt`。
- 队列消息、计划模式、review 模式作为后续增强，不在 M1。

**渲染**：见第 6 节映射表；agent 消息按 `phase` 区分 `commentary`（过程说明）与 `final_answer`（最终答复），前者默认折叠。

**状态条**：线程状态（active / idle / systemError / notLoaded）、token 用量（`thread/tokenUsage/updated`）、额度（`account/rateLimits/updated`）、MCP 服务器启动状态（`mcpServer/startupStatus/updated`）。

### 5.2 审批与用户输入

- 服务端请求到达 → `ApprovalBroker` 挂起，推 `approval/requested`，页面弹出审批卡：命令原文、cwd、解析出的动作（`commandActions`）、风险说明（`reason`）、可选「本次允许 / 本会话允许 / 拒绝 / 取消」。
- 响应映射：`accept` / `acceptForSession` / `decline` / `cancel`；带 `proposedExecpolicyAmendment` 时额外给「以后都允许这类命令」。
- `item/tool/requestUserInput`：渲染问题卡（单选/多选/自由输入），答案按 `ToolRequestUserInputResponse` 回填。
- 跨端解决：收到 `serverRequest/resolved` 就清卡（比如用户在终端里批准了）。
- 无客户端在线：保持挂起；超过 `approvalTimeoutMs`（默认 10 分钟）自动 `decline` 并记录日志，避免守护进程永远等。
- 安全底线：任何情况下不自动批准；审批卡必须显示原样命令与 cwd，不做截断隐藏。

### 5.3 项目会话管理

- **项目视图**：按 `cwd` 聚合线程，显示项目名（目录名）、线程数、最近活动、git 分支与 sha、是否 trusted（读 `config.toml [projects]`）。
- **线程列表**：按 `updatedAt` 倒序，显示名称（`name` 或 `preview` 首行）、模型、状态、来源（`codex-tui` / `vscode` / `exec`）、时间。
- **搜索**：`thread/list` 的 `searchTerm`（服务端）+ 本地名称/预览过滤。
- **动作**：打开（resume）、新建（带该 cwd）、重命名（`thread/name/set`）、归档/取消归档、删除（二次确认，永久）、fork（`thread/fork`）、导出（markdown / JSONL）、在 DSH 中打开 cwd。
- **分页**：`cursor` 游标；列表页 50 条，滚动加载。
- **已归档**：独立筛选；`archived: true` 才返回归档线程。
- **实时性**：`thread/started`、`thread/archived`、`thread/deleted`、`thread/name/updated` 等通知驱动列表增量更新。

### 5.4 版本管理

**读**：

- 当前 CLI：`codex --version`（解析 `codex-cli x.y.z`）。
- 守护进程：`codex app-server daemon version`（JSON：`cliVersion` / `appServerVersion` / `managedCodexPath` / `socketPath`）。
- 安装渠道：`codex doctor --json` 的 `installation`（本机为 npm 全局）。
- 最新版：npm registry `@openai/codex/latest`（先 npmmirror 再 npmjs，2 s 超时），失败回退 `~/.codex/version.json` 的 `latest_version`。
- 版本清单：registry 的 `versions` 键（回滚候选），按 semver 排序。

**升级**：

1. 预检：无活动回合（或用户确认强制）、安装渠道为 npm、磁盘与网络可用。
2. 执行 `codex update`（官方路径，内部即 `npm install -g @openai/codex`），stdout/stderr 经 SSE `version/progress` 实时回显。
3. 复核：重新读 `codex --version` 与 daemon 版本；不一致提示重启守护进程。
4. 失败：保留日志，给出 npm 直接安装命令与回滚入口。

**回滚**：`npm install -g @openai/codex@<version>`，同样预检与复核。

**守护进程**：`codex app-server daemon update`（可能中断正在跑的回合，必须二次确认并列出活动线程）、`daemon restart`、`daemon start/stop`。

**安全**：

- 升级前备份 `~/.codex/config.toml` 与 `version.json`（时间戳后缀），失败可还原。
- 不自动升级；只提示徽标。
- 升级与回滚都要求显式点击 + 确认框。

### 5.5 健康与诊断

- `codex doctor --json` → 分组表格（status / summary / remediation），失败项高亮。
- 认证：`account/read`、`account/login/start`（浏览器登录流）、`account/rateLimits/read`、`account/usage/read`（日用量柱状图）。
- MCP：`mcpServerStatus/list` + 启动状态通知，显示失败原因。
- 配置摘要：模型、审批策略、沙箱、MCP 服务器、项目信任级别。

---

## 6. 数据映射（ThreadItem → UI）

| Codex item | UI 组件 | 说明 |
| --- | --- | --- |
| `userMessage` | 用户气泡 | 文本 + 图片 + mention/skill 芯片 |
| `agentMessage` | Markdown 气泡 | `phase: commentary` 折叠，`final_answer` 常显；`item/agentMessage/delta` 流式追加 |
| `reasoning` | 折叠「思考」块 | `summaryTextDelta` / `textDelta` 分开呈现 |
| `commandExecution` | 终端卡片 | 命令、cwd、状态、退出码、`outputDelta` 流式；长输出折叠 + 复制 |
| `fileChange` | diff 卡片 | `patchUpdated` 增量刷新；按文件折叠 |
| `mcpToolCall` | 工具卡片 | server/tool/参数/结果/错误；`progress` 进度 |
| `webSearch` | 搜索卡片 | 查询 + 结果摘要 |
| `plan` | 计划清单 | `plan/delta` 流式 |
| `imageGeneration` / `imageView` | 图片卡片 | |
| `functionCallOutput` / `dynamicToolCall` | 通用工具卡片 | |
| `collabAgentToolCall` / `subAgentActivity` | 子代理卡片 | 后续阶段 |
| `contextCompaction` | 分隔条 | 「上下文已压缩」 |
| `enteredReviewMode` / `exitedReviewMode` | 分隔条 | |
| `sleep` / `hookPrompt` | 低调行 | 默认折叠 |

**状态与通知**：`thread/status/changed`、`turn/started`、`turn/completed`、`thread/tokenUsage/updated`、`serverRequest/resolved`、`mcpServer/startupStatus/updated`、`error`、`configWarning`。

---

## 7. 关键取舍与风险

| 风险 | 影响 | 缓解 |
| --- | --- | --- |
| app-server 标注 experimental，协议会变 | 升级 Codex 后字段/方法失效 | 按 Codex 版本生成类型并入库；启动时探测 `initialize` 结果与方法表；不兼容时页面顶部横幅并禁用写操作 |
| 守护进程 WS over unix socket 无公开文档 | 传输层可能改协议 | 传输层隔离；集成测试探测；失败自动回退 stdio |
| 独立实例抢活动线程（`active writer`） | 终端与 UI 同时打开同一线程失败 | 默认守护进程模式；stdio 模式下把该错误翻译成「该线程正在终端中使用」 |
| 升级中断正在跑的回合 | 丢工作 | 升级前检测活动线程并要求确认；守护进程更新单独确认 |
| 审批卡无人响应 | 守护进程一直等 | 超时自动拒绝 + 日志；重新打开页面时补发未决审批 |
| 浏览器断线丢事件 | UI 状态漂移 | seq + 环形缓冲 + 缺口全量重拉 |
| DSH 槽位/DOM 契约变化 | 页面挂不上 | 只用文档化槽位；不依赖 DOM 结构；锁定 DSH 版本区间 |
| 全局 npm 安装权限 / PATH | 升级失败或找不到 codex | 可配置 `codexPath`；升级失败给出原始输出与手工命令 |
| 多标签页并发操作 | 重复提交 | 宿主侧按线程串行化写操作，客户端按钮 pending 态 |

---

## 8. 里程碑

### M0 · 骨架与只读列表（约 1 天）

- 包骨架、`cordis.patch.yml`、宿主/浏览器空壳、locale、构建脚本。
- stdio 传输 + `initialize` + `thread/list` 分页 + 项目聚合。
- 页面：左侧项目/线程列表、空对话区、状态条（版本/连接）。
- 验收：DSH 左侧出现 Codex 图标；打开后能看到 79 个线程按 6 个项目分组；断线重连可恢复。

### M1 · 对话可读可写（约 2 天）

- 守护进程传输 + 自动回退；`threads/open`（resume）+ 快照分页。
- 历史渲染（消息/命令/推理/diff 核心四类）+ 新回合流式 + 打断 + steer。
- 验收：在 UI 里对 certbase 新建线程并完成一轮问答；打开终端里正在跑的线程能看到实时输出。

### M2 · 审批闭环（约 1 天）

- 审批卡、用户输入卡、跨端解决、超时拒绝、断线补发。
- 验收：让 Codex 执行一条需要审批的命令，在 UI 中批准后命令继续；在终端批准后 UI 卡片自动消失。

### M3 · 版本与健康（约 1 天）

- 版本探测、更新/回滚、守护进程管理、doctor 表格、额度与用量。
- 验收：制造一个「有新版本」的场景（mock registry）走完升级与回滚；真实 `codex update` 在无更新时给出「已是最新」。

### M4 · 会话管理（约 1 天）

- 重命名/归档/删除/fork/导出、搜索、归档筛选、git 信息展示。
- 验收：归档一个线程后从默认列表消失、归档筛选可见；删除二次确认生效。

### M5 · 右侧栏与打磨（约 1–2 天）

- 右侧栏 Codex tab（按 DSH 会话 cwd 过滤）、空态/错误态/骨架屏、键盘快捷键、E2E 与 README。
- 验收：在 DSH 的 certbase 会话里打开右侧 Codex tab，直接看到该项目线程并继续对话。

---

## 9. 测试与验收

- **协议夹具**：录制真实通知序列为 JSONL，构造脚本化的假 app-server（stdio），覆盖 turn 生命周期、审批、断线。
- **宿主单测**：`node --test`，覆盖 RPC 路由校验、seq/环形缓冲、审批超时、版本解析、错误翻译。
- **浏览器测试**：Playwright 打开 `http://127.0.0.1:3080`，验证页面挂载、列表、发送、审批、断线重连。
- **手工验收清单**：见各里程碑；额外覆盖「Codex 未安装」「守护进程未启动」「协议不兼容」三种降级。

---

## 10. 已定决策

1. **传输默认值**：守护进程优先，stdio 兜底（`transport: auto`）。已验证两种传输都能读同一批会话。
2. **首版渲染范围**：消息/推理/命令/文件变更/工具调用五类先做，markdown 与图片渲染后置。
3. **升级权限**：允许 UI 触发守护进程重启，但必须显式确认并列出活动线程（M3 实现）。
4. **右侧栏 tab**：放 M5，依赖 DSH 会话 cwd。
5. **DSH 工具**：暂不做，保持纯管理端。

## 11. 实施进度

| 阶段 | 状态 | 证据 |
| --- | --- | --- |
| M0 骨架与只读列表 | 完成 | 79 会话 / 6 项目在 GUI 中分组显示；守护进程与 stdio 两种传输冒烟通过 |
| M1 对话可读可写 | 完成（核心） | 新建会话 → 发消息 → 流式回复；审批卡允许后命令执行、文件落盘 |
| M2 审批闭环打磨 | 完成 | 命令/文件/权限审批可允许；用户提问卡；跨端解决；markdown 渲染；本地图片预览（懒加载 + 缓存） |
| M3 版本与健康 | 完成 | 版本探测 1.7s；doctor 21 项；升级/回滚/守护进程动作走后台 job + 轮询输出 |
| M4 会话管理 | 完成 | 重命名、归档/取消归档、删除、fork、markdown 导出均通过 API 与 UI 验证 |
| M5 右侧栏与打磨 | 完成 | 右侧栏 Codex tab 按 DSH 会话 cwd 列出 50 个会话；点击线程切到主面板并选中 |

### 实施中发现并处理的问题

- **`dsh plugin add` 会自动把包加进 `dsh.profile.bundles`**，与包自带的 patch 行重复。本机改为「只在用户 patch 层插入一行」，并从 bundles 移除。
- **新建但未落盘的线程**：`thread/turns/list` 报 `not materialized yet`，`thread/read includeTurns` 也不可用。处理：返回元数据 + 空回合，历史交给实时事件；首条消息后列表补刷。
- **临时线程（ephemeral）** 没有 rollout，`thread/resume` 报 `no rollout found`。处理：本连接 `thread/start` 创建的线程跳过 resume。
- **flex 布局塌陷**：对话容器是 column flex，`.dsh-codex-block` 的 `overflow: hidden` 让 `min-height:auto` 变 0，整块被压成 2px。处理：`flex: none`。
- **单次详情过大**：3 个回合 249 条 item 有 2.6 MB。处理：输出/diff/JSON 截断后降到约 0.7 MB；后续再做条目分页。

## 12. 迭代记录

### 2026-11-06 · 输入区对齐 DSH composer

- 参照 DSH 默认 composer 的实测尺寸重做输入区：卡片 774×102、圆角 28px、无边框输入区、底部工具行、34px 圆形发送键。
- 模型与推理强度合并进一个菜单：模型列表带描述与勾选，推理强度用分段控件；选择通过 `turns/start` 的 `model` / `effort` 下发。
- 验证：菜单 9 个模型 + 4 档强度；选中 GPT-6-Astra 后触发器显示「GPT-6-Astra · 高」；API 侧 `gpt-6-luna` + `low` 覆盖后线程元数据同步为 `gpt-6-luna` / `low`。
