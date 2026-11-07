# Codex 插件内完整右栏移植实施与验收计划

> 2026-11-07 后续用户指令已覆盖本计划的部分内容：**右栏分栏功能已取消**，旧分栏布局恢复为单栏。最新约束见 [HANDOFF.md](./HANDOFF.md)；当前首要待办为 [Git 面板完整重构](./GIT_VCS_REFACTOR.md)，目前仅调查未实施。

日期：2026-11-07
状态：已开始实施；布局框架、文件服务与基础预览已接入，真实页面及热更新证据见 [RIGHTBAR_ACCEPTANCE.md](./RIGHTBAR_ACCEPTANCE.md)。完整功能清单仍有待办。
决定：功能集中在 dsh-codex-cli，优先不修改 DSH 本体。替代 PLAN.md 中暂停的“改造 DSH 原生右栏 cwd 参数化”路线。

## 1. 目标与实现边界

把 DSH Web 右栏的布局、交互和功能移植到当前 Codex 面板内部。保留上游可独立复用的实现，替换 Session、slot、resource、Remote、Agent 等绑定为插件自己的适配接口。插件自己的宿主代码、依赖、构建产物和测试在本仓库维护；安装必要库和宿主工具属于插件部署要求。

“完整”以功能对照表验收，不能把简化文本预览、一次性 exec 或只有外形的页签计作完成。目标包括停靠/分栏/浮动、文件树、文档预览、交互终端、浏览器标签、Git 六页及文件日常操作。沿用 DSH Web 的平台边界：iframe 无法绕过网站禁止嵌入规则；Electron webview/native save 等需要 Desktop 载体的能力不冒充 Web 已实现，若需要另列载体工程。

不依赖已安装 dsh-git-vcs、dsh-file-extras 的存在才能工作；移植所需代码并接自己的服务。保留 DSH、第三方插件及库的版权与许可，记录每份上游来源、版本、补丁与对应测试。

## 2. 已核实环境和仍待验证事项

| 事项 | 核实结果 |
| --- | --- |
| 当前工作仓库 | /root/project/dsh-codex-cli |
| 已安装 DSH | 0.2.1-rc.5 |
| 已有源码快照 | /tmp/dsh-src，fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159；包版本 0.2.2-rc.1，不能默认与运行版一致 |
| profile | /root/.dsh/profiles/web |
| 本地插件依赖 | package.json 使用 link:/root/project/dsh-codex-cli；node_modules 链接已确认指向本仓库 |
| 配置重载 | dsh.profile.patchReload 为 live；已安装 dsh-hmr 文档/代码包含链接包文件变化比较与 profile 重组 |
| 浏览器热替换 | 已安装 dsh-client-hmr 文档：监听构建入口、默认 500ms 轮询、/plugins/events；替换插件会重置其 React 状态 |
| 初始重复注册（已修复） | 原有效配置有两条 codex-cli；已备份并移除用户层第二条 insert，保留 bundle 行 |
| Git 插件 | 已安装 dsh-git-vcs 0.2.0，含 README、宿主 index.js 和 lib/client.js |
| 文件增强 | 已安装 dsh-file-extras 0.3.0 |
| 浏览器工具 | Playwright 与 ARM64 Chromium 可启动 |
| 当前访问 | 127.0.0.1:3080 正在监听；无认证与两个旧临时 Cookie 都为 401 |
| 真实页面基线 | 同版本 3081 隔离 DSH 正常登录页面已通过布局、文件与热更新验收；3080 登录页面尚未实测 |
| 当前改动范围 | 插件代码、测试、文档；主 profile 去重并定向监视本插件源码；主 DSH 进程未重启，DSH 本体未修改 |

源码定位：
- DSH RightbarRoot 和 ui-sidebar-right/index.ts：SessionProvider、session scope store、controller/tabDomain 全链路依赖 Session。
- ui-sidebar-files：FilesBody/FileNavigator/face、资源地址和目录观察依赖 Session。
- api/workspace-files：wire 身份是 SessionId，经 lookup 才获得 workspaceRoot。
- ui-sidebar-documentpreview/rpc.ts：hostFileOf 只接受 session 地址，含读取、字节读取、Office 转换及其缓存身份。
- ui-sidebar-terminal 和 api/terminal-controller：客户端归属 Session，宿主 spawn 依赖 Agent 执行环境。
- ui-sidebar-right/README：dockkit 的分栏/拖动/浮动实现独立于宿主，优先提取复用。
- 已安装 dsh-client-hmr、dsh-client-modules、dsh-hmr 的 README 和 lib 实现已核对；最终仍需现场探针。

## 3. 总体架构与状态模型

浏览器：ConsolePage → SidebarWorkspaceProvider → DockSurface → tab registry
标签：Guide / Files / Document / Terminal / Browser / Git
宿主：createRoutes → WorkspaceService / FileService / GitService / PtyService / PreviewService
传输：沿用 /codex-cli RPC 与 SSE；二进制下载、上传与 PTY 流按需要注册同前缀下的专用通道。

建议目录：

- src/client/sidebar/core/：目标身份、标签注册、布局 store、持久化迁移、命令、生命周期
- src/client/sidebar/dock/：移植的停靠视图和交互
- src/client/sidebar/tabs/{guide,files,document,terminal,browser,git}/
- src/client/sidebar/adapters/：RPC、文件资源、主题、快捷键、composer 引用
- lib/workspace/：目标解析、路径/权限、文件读取与观察、Git、PTY、文档转换
- vendor/dsh-sidebar/：确实需要保留的上游底层源码及 provenance/许可；避免无边界地复制整个 DSH
- scripts/：构建、热更新触发与探针、夹具、浏览器验收
- test/sidebar/、test/e2e/、test/fixtures/：纯逻辑、宿主集成、真实页面用例
- docs/RIGHTBAR_ACCEPTANCE.md：能力对照表与逐次验收证据（实施时创建）

### 3.1 工作区与会话的分工

工作区身份以宿主规范化后的 cwd 为基础，使用稳定 workspaceId；浏览器请求业务数据携带 workspaceId，宿主解析根目录。threadId 用于把引用交给当前 composer，不冒充 DSH SessionId。

默认同 cwd 的 Codex 会话共享工作区右栏布局和标签；不同 cwd 独立保存。切线程即更新引用目标，切工作区即更新右栏。进入还没有当前线程但有已选项目时允许浏览该项目；均没有时显示空态。

文件资源统一结构为 workspaceId + path + version。去重键是工作区内规范化文件身份，定位行等是导航参数。切换工作区取消旧请求，generation 校验阻止旧响应覆盖新界面。

持久化只保存布局、标签描述、文件位置/缩放、浏览器受控 URL、终端描述和草稿等可恢复状态。布局加 schemaVersion 和迁移。认证信息、文件正文、终端秘密输出不写 localStorage。浮动窗口恢复时夹在当前视口内。

### 3.2 依赖与代码移植方法

先确定本机运行版的界面与接口基线，再从指定源码版本逐模块移植。dockkit/纯布局算法、资源无关视图和成熟预览算法优先保留；slot props 及 Session hook 改为普通 React context/props 和插件服务。

React 使用 DSH 提供的同一实例，禁止打入第二份。移植过程中所有运行时 import 都列清单：平台确实提供的能力才能 external，其余打包或复制；不能把 workspace:* 当作可安装生产依赖。

PDF、表格、语法高亮、xterm、Office 等重模块按需加载。当前构建是单文件 CJS 工厂，实施时先验证 DSH 支持的 require.async 兄弟 chunk 协议，再确定 tsdown 或 esbuild 的兼容包装。不能直接产出不被现有加载器理解的 ESM chunk。Worker、CSS、字体和 PDF support data 均需明确发布路径。全部 chunk 完成后最后发布/更新时间戳到 client.js，让 HMR 不会读到半套产物。包 files 同时纳入 chunk 和静态资源。

### 3.3 宿主与访问边界

每个新增 /codex-cli 通道都沿用 connection.requestRejection 的认证与 Host/Origin 检查。workspaceId 在宿主登记并验证，路径相对根解析；目录操作和写入校验规范化路径、符号链接及操作时边界。外部绝对路径只在明确的只读预览能力中按宿主策略处理。

人工在右栏发起的文件操作/终端操作与模型回合审批是不同入口，界面和服务定义清楚；不得暗中把 UI 命令送入模型或假定模型 sandbox 自动约束本机 PTY。

读取区分按行分页、字节区间和限额完整读取。下载保持原始字节；上传流式/有上限，避免把大文件放进现有 2MiB JSON RPC。错误使用稳定 code，取消穿透到子进程和读取任务。

## 4. 功能移植清单

| 模块 | 实现范围 | 核心验收 |
| --- | --- | --- |
| 布局/引导 | 多标签、关闭/关闭其他/右侧标签、拖动排序、分栏、浮动/停靠、宽度调整、全屏、窄屏、主题、快捷键 | 对照 DSH 的交互和几何；切换标签不意外重建需保留的内容 |
| 文件树 | 懒列目录、展开/折叠、隐藏项、刷新、观察更新、元数据、多选、键盘、右键 | 中文/空格/特殊字符、大目录、失效路径、快速切 cwd、不串列表 |
| 文件操作 | 上传、下载、复制路径、引用、创建/重命名等按基线清单、回收站删除/明确永久删除 | 上传/下载字节校验；引用只插入当前 Codex composer；取消删除无变化 |
| 文本/代码/Markdown | 分页、代码高亮、行号、复制、换行、跳转行、滚动保存、Markdown 链接/图片/frontmatter | 长文件按需读取；切源码/预览、相对图片、无效 UTF-8 的错误 |
| 图片/PDF | 图片缩放/平移、PDF 懒页/文本选择/缩放与必要资源 | 动图保持、PDF 中文复制、关闭释放 Blob/Worker/任务 |
| HTML | 受隔离预览和按基线支持的本地 JS/CSS 依赖 | 相对资源、失败页、不能访问父页面或插件认证 |
| 表格 | xlsx/xls/csv/tsv、工作表、公式栏、复制、缩放；保留上游已知格式限制 | 独立工具生成夹具；中文/引号/换行、合并单元格、冻结、公式缓存、异常/超限文件 |
| Office | doc/docx/ppt/pptx 转 PDF、取消/缓存/字体缺失信息 | 宿主 LibreOffice 等可用性探测；缺失/超时有明确错误，不用静默文本替代 |
| 终端 | xterm + 真 PTY、输入/输出流、resize、Ctrl-C、Unicode、复制粘贴、多终端 | 交互程序、持续输出、后台保持、重连、退出码和进程清理 |
| 浏览器 | HTTP(S)、前进/后退/刷新、地址栏、外部打开、受控恢复和沙箱选择 | 本地测试网站 + 禁止嵌入案例；Web 平台限制明确显示 |
| Git | Local Changes / Log / Console / Branches / Remotes / Stash 六页 | 按 dsh-git-vcs 0.2.0 全端点对照，不能只做 status/diff/log |
| Git 写操作 | stage/unstage、勾选提交/amend、checkout/create/delete、merge、stash、fetch/pull/push、discard/revert/reset/cherry-pick、remote 与凭据交互 | 只在临时仓库与本地 bare remote 验证；冲突、空仓库、未跟踪、二进制、特殊文件名及取消路径 |

浏览器和文件操作的精确菜单、快捷键、动画及默认值在 P0 截图/行为对照时冻结；新增需求单列，避免验收时随口缩小“完整”的范围。

## 5. 终端与热更新的生命周期

前端 HMR 会销毁 React 状态，因此 PTY 必须由宿主 TerminalManager 持有。标签卸载只解除 attach，不把“组件重挂载”当用户关闭。用户关闭标签调用显式 close；PTY exit 后保留输出直到关闭。重连带 terminalId、输出序号与有界回放，避免重复字节。

宿主 HMR 会 dispose 插件内服务。先实现可靠的进程终止与 UI 显示“终端已结束，可重开”，验收零孤儿进程；如果需要宿主热更新期间也保活，另实现由本插件管理的独立 PTY broker（Unix socket、独立版本、认证及超时清理），在该能力实际通过前不能承诺后台终端保活。

服务订阅、watcher、SSE、路由、定时器、Worker、AbortController、Blob URL、浮动 portal 和 CSS 均有明确 owner/dispose。现有 index.js 的异步 hub.stop fire-and-forget 需要审计是否可能与重新 start 重叠。installStyles 和 favicon/title 也必须验证多次替换后的移除与恢复。

## 6. DSH 插件热加载操作手册

本节依据本机已安装 0.2.1-rc.5 的 dsh-hmr、dsh-client-hmr、dsh-client-modules 文档和实现；完整现场闭环尚待登录后执行。

### 6.1 一次性加载基线

1. 使用当前 3080 服务，记录 DSH PID、版本、浏览器导航次数、有效 Host Loader 行、浏览器模块图中 dsh-codex-cli 的 entry/rev。
2. 确认 link: 指向仓库。已有依赖无需重复 dsh plugin add。
3. 检查有效配置里的 codex-cli 激活次数；解决 bundles 自带 patch 与用户 insert 重复问题。应只有一个 Host 行和一个浏览器入口。调整 profile 是部署配置，不是修改 DSH 本体。操作前备份，具体改法依据实际合成结果。
4. 确认 hmr 和 client-hmr 服务 active；root: [] 默认只关源码目录 watch，不代表配置重组不能比较链接包文件。
5. 用当前启动 URL 的 token 换取正常浏览器 Cookie；凭据通过本机文件/环境注入测试，不提交 Git，不打印 token，不入 trace/screenshot/录像。

### 6.2 前端构建热替换

1. 执行 npm run build（后续可提供 npm run dev:client 监听源码并完整发布产物）。
2. dsh-client-hmr 检测构建入口元数据变化，更新模块 rev，通过 /plugins/events 发 graph/rebuilt。
3. 已打开页面由 Client Modules 替换该插件及依赖它的项，等待旧 effects 清理，再挂载新工厂；无需 page.reload。
4. 在测试中检查新 clientBuildId / DOM 标记、rev、页面导航次数不变、入口与根节点各一个、pageerror 为零。
5. 不是靠刷新后看起来变了来证明 HMR；刷新只作为额外的冷启动验证。

当前构建必须保持 window.__ModuleLoader__.load 包装和正确 id。chunk-only 变化也必须更新 client.js。失败后使用“设置 → 插件 → 插件列表”的重试，或修复后重新完整构建；激活失败不假定旧版本一定自动恢复。

### 6.3 宿主代码热替换

1. 对 index.js/lib 完成修改并通过本地检查。
2. 触发 profile 用户 patch 的文件变化，可使用 touch /root/.dsh/profiles/web/cordis.patch.yml；其作用是触发配置重组。
3. dsh-hmr 在重组时比较已加载链接包文件，清缓存、卸载旧插件、加载新文件；仅 touch 没有代码变化不保证插件实例重建。
4. 用 status 扩展的 hostBuildId、hostInstanceId 和 startedAt 验证代码与实例均已变化，同时 DSH PID 保持不变；检查旧路由、订阅和进程已清理。
5. 等待实际事件和探针满足条件（例如最多 15s），不只固定 sleep 后宣布成功。默认配置 watch 的写稳定窗口约 2s。
6. 若需要直接监视宿主源码，可按已安装 HMR 配置把 root 限定为本插件目录；避免监视整个 DSH 或全局 node_modules。具体根路径基准先用有效配置确认。

建议新增 npm run dev:reload:host：只触发指定 profile 重组并运行探针；profile 路径显式配置，绝不批量改用户 YAML。依赖变更和 package.json/exports 变更单独验证，不能保证所有依赖/Host 基础模块改动都可热替换；出现 restart-required 必须如实报告原因。

### 6.4 必须完成的热更新探针

- 前端临时 build 标记 A → B → A，旧页面不刷新，三个版本均可观察，最后恢复正式构建。
- 宿主无副作用 status 标记 A → B → A，触发重组；DSH PID 不变，新实例生效。
- 连续 10 次正常热替换：Host/Client 均只保留一份路由/入口；监听器和任务无累积增长。
- 单独改 lazy chunk：打开尚未加载过的 PDF/表格/终端，确认能取得匹配版本资源。
- 隔离验收 profile 注入一次构建或激活失败，再修复，验证诊断与重试；不破坏正在使用的主 profile。
- 前端热替换中，草稿/工作区恢复符合定义，PTY 不被误关；宿主替换按本节的服务策略明确结束或恢复。

## 7. 分阶段交付与通过条件

| 阶段 | 交付 | 通过条件 |
| --- | --- | --- |
| P0 加载与基线 | 当前页面、有效配置、功能清单、上游来源、build 标记和 HMR 探针 | 冷打开与前/后端热更新闭环，确认单实例；登录问题解决 |
| P1 框架 | dock、tab registry、工作区隔离、持久化、打包/chunk | 拖动/分栏/浮动/全屏/窄屏/恢复，切 cwd 无污染，HMR 无残留 |
| P2 文件服务与树 | 目录/读/字节/观察/上传下载、树和引用 | 真实宿主集成通过，真实文件变化反映，引用进入正确 Codex composer |
| P3 基础预览 | 文本/代码/Markdown/图片/PDF/HTML | 对照夹具及 UI，长文件/取消/相对资源/下载原字节 |
| P4 表格和 Office | lazy viewer、Worker、转换与缓存 | 独立生成文档、缺工具/缺字体/超时/超限和清理均覆盖 |
| P5 终端与浏览器 | PTY 流、多终端、浏览器导航与恢复 | 真交互、resize、重连/关闭、切工作区/HMR，iframe 限制行为清楚 |
| P6 Git 与文件增强 | 六页 Git、完整操作、多选/回收站等 | 临时仓库和本地 remote 全流程，异常与取消后磁盘状态一致 |
| P7 回归与替换 | 删除旧 RightPanel，更新 README/许可/打包/验收记录 | 全能力表通过，npm pack 内容完整，当前 DSH 热更新及新页面冷加载均通过 |

每阶段均跑对应测试、构建、热加载和真实页面验收，不积累到最后一次才接 DSH。旧 RightPanel 的删除时机是新右栏覆盖相应能力并完成回归后；过渡期开关用插件 config/local setting 管理。

## 8. 验证设计与证据

### 8.1 测试层次

- 纯逻辑：布局操作和持久化迁移、导航去重、路径/权限、generation 竞态、终端序号、Git 参数与错误转换。
- 宿主集成：真实临时目录、符号链接、真实文件观察/字节读写、子进程取消；不只 mock fs/RPC。
- 文档：使用独立写入工具生成 PDF/Office/表格夹具，验证渲染内容、表格值与下载字节；超限和损坏输入给明确结果。
- Git：临时工作仓库 + 第二 clone + 本地 bare remote，覆盖提交/分支/合并冲突/stash/拉推/回滚；所有破坏性操作只针对夹具。
- 终端：真实 PTY 运行 pwd、Unicode、交互式读输入、持续输出、Ctrl-C、resize、退出；关闭和 Host dispose 后核对 PID。
- 真浏览器：Playwright 从正常 DSH 页面点击 Codex 入口，在真实插件内操作；不以单独组件 demo 代替。
- 浏览器功能使用本地可控 HTTP 页面测试导航和嵌入拒绝；外部网站不作为稳定自动化依赖。

### 8.2 验收矩阵

宽度至少 1440、1024、390；明暗主题；两个不同 cwd 和同 cwd 两个 thread；空项目、非 Git 目录、大目录、长文件；打开/关闭/切换/刷新/HMR/断线重连。

核心回归还包括原有发消息、流式输出、审批、计划模式、附件、恢复会话、退出 DSH 与标题/favicon，右栏不得抢 Enter 或 terminal 中的快捷键。

异步取消测试安排旧请求慢于新请求，断言不会显示旧目录/旧文件。资源测试记录 Worker/PTY/watch/SSE/订阅基线及循环后的数量，内存只看稳定趋势，不用单次 heap 数值作为泄漏结论。

### 8.3 证据与发布门槛

每次验收保存 Git commit/dirty diff、DSH 版本、上游版本、Host/Client buildId、实际步骤、断言结果、截图、控制台错误、失败网络请求、残留进程检查。敏感凭据脱敏，截图避免真实项目内容。产物建议写 .artifacts/sidebar/<run-id>/ 并忽略 Git，报告只放必要摘要与脱敏图。

状态严格区分“实现”“本地测试通过”“DSH 热加载通过”“真实页面验收通过”。缺依赖或认证导致跳过时记录未通过，不使用空截图或全 mock 测试替代。

## 9. 当前下一步

1. P0/P1 的首批实现和 3081 同版本真实页面/HMR 验收已完成；具体证据及限制见 RIGHTBAR_ACCEPTANCE.md。
2. 补完 P2 的文件操作、引用和键盘/多选体验，以及 P3 的代码高亮、相对资源、跳转和滚动保持。
3. 继续 P4/P5/P6 的文档引擎、PTY、完整浏览器状态机和 Git 六页，逐项复用同一加载/验收流程。
4. 补充 3080 主页面的正常登录验收和明暗主题、复杂拖动、多工作区完整矩阵。
5. 根据后续真实集成结果评估剩余工作，不沿用旧的 1–2 周或 6–8 周估算作承诺。

本计划不要求 fork 或编译整个 DSH。若发现某个功能确实只能通过新增 DSH 核心接口实现，先列出限制和插件内替代方案，独立评估该能力，不把核心修改隐藏在依赖安装中。
