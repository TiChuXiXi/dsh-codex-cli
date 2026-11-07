# Git 版本管理面板重构 · 交接与实施清单

日期：2026-11-07
状态：**已实施并通过构建、49 项测试、真实 DSH 浏览器及实际热加载验收。**

当前结果以 [实施验收记录](./GIT_VCS_ACCEPTANCE.md) 和源码为准。第 1–3、5–7 节保留恢复任务时的调查/建议背景，其中“尚未实现”描述为历史停点，不再代表当前状态。
前置阅读：[HANDOFF.md](./HANDOFF.md)。这里的 Git 管理不要与 Codex CLI 版本升级服务 lib/versions.js 混淆。

## 1. 用户目标与本次停点

用户要求完整优化当前过于简陋的 Git 面板，参考本人原来开发的插件：
https://github.com/TiChuXiXi/dsh-git-vcs

用户当前转而要求交接会话记忆，重点关注这个待办，因此本次仅写交接。后续恢复时继续原任务即可。用户已要求“完整”，不能只实现状态列表、添加六个空标签或照搬截图后声称完成。

调查阶段已完成：
- 查看原仓库 README、源码、宿主注入与 RPC 接口、主要前端组件。
- 下载公开仓库到 /tmp/dsh-git-vcs-reference（浅克隆）。
- 核对目标插件当前 GitTab、routes 和宿主装配点。
- **没有**把参考代码复制进当前插件，没有新增 GitService，也没有修改 GitTab。
- 最后回复已明确告知未实施，不能以“上轮已经接好”作为前提。

## 2. 参考源码与可信版本

- URL：https://github.com/TiChuXiXi/dsh-git-vcs
- 临时目录：/tmp/dsh-git-vcs-reference
- HEAD：cf40b80a7b5dda8e7a41a950c3fdfeddd14ba177
- 提交时间：2026-10-12 10:27:19 +0800
- 提交标题：docs: 归档 0.2.0 npm 发布与完整性验证
- package.json 版本：0.2.0，MIT。
- 网页缓存 README 有 0.1.1 旧信息，实际以克隆源码为准；/tmp 可能被清理，缺失时重新获取。
- 参考仓库的 AGENTS.md 已读，含 UTF-8、语义检索与上下文文档规则；若要直接在该参考仓库修改文件，先遵守其项目规则。当前只把它作为只读参考，不把那里的任务记忆体系当成当前仓库已存在的规则。
- 复用源码须记录上游版本、路径、许可与本地补丁，维护当前 THIRD_PARTY_NOTICES.md。

### 上游源码定位（行号为此次快照）

| 文件/位置 | 内容 |
| --- | --- |
| index.js 35–55 | allowWrite / allowPush / allowDangerous、超时/输出限制等默认配置 |
| index.js 186 起 | porcelain v2 状态解析 |
| index.js 259 起 | 提交日志解析；约 309 logArgs 共用分页构造 |
| index.js 320 / 355 / 373 起 | 分支、stash、remote 解析 |
| index.js 400 起 apply | Cordis 宿主装配，依赖 subprocess / connection / webServer |
| index.js 458 起 runGit | argv 执行、终止信号、输出采集、错误分类、日志脱敏 |
| index.js 608 起 | cwd 规范化、路径/参数校验、写操作门禁 |
| index.js 804 起 endpoints | 全套 Git 端点；repo/snapshot 约 839 |
| index.js 1363 附近 handler | 将操作收敛成 {ok,value} / {ok:false,error} |
| index.js 1380 后 | 原 /git-vcs HTTP RPC 信任栅栏与路由 |
| lib/client.js 1–780 | React.createElement 前端、样式 S、图标、辅助组件、提交图算法等 |
| lib/client.js 806 起 GitBody | 六页主界面、提交/分支/凭据/确认状态与异步操作 |
| lib/client.js 910 附近 rpc | 默认 cwd = appliedRef.current；rawCall 返回 RPC 结果信封 |
| lib/client.js 930 附近 refresh | repo/snapshot 一次全量刷新，all=true，历史分页 |
| lib/client.js 1133 起 | 从 DSH useSessions/sessionId 推导 cwd 的旧会话绑定 |
| lib/client.js 2800–2940 | 非仓库空态、路径输入、顶部操作、六页渲染 |
| lib/client.js 2952–2993 | 原模块注册：sidebarRightTabs + slots + connection |

上游前端是 window.__ModuleLoader__.load 闭包工厂，不是可直接 import 的 React 模块。不要直接把整个文件作为当前 GitTab 用。

## 3. 当前目标代码与缺口

| 当前文件 | 已有能力 / 接入点 |
| --- | --- |
| src/client/sidebar/SidebarWorkspace.tsx | 实际右栏入口，kind === git 时返回 GitTab(api,cwd) |
| src/client/page/RightPanel.tsx:167 起 | GitTab：git/status 快照、点文件 git/diff、diff 文本、diffStat 和简短 log |
| lib/routes.js:138 起 | git/status 与 git/diff 两个端点 |
| lib/fs.js:30、158 起 | Node Git 执行辅助、旧 status/diff |
| index.js | apply 中装配服务，createRoutes 参数；当前 inject 仅 connection/webServer |
| lib/workspace.js | 当前 cwd 工作区规范化、路径约束与观察通知，可评估复用 |
| src/client/rpc.ts | 当前 api 方法调用返回业务值，不等同上游 rawCall 信封 |
| src/client/sidebar/state.ts | 现有布局恢复与标签管理，用户已禁止分栏 |
| scripts/build-client.mjs | TSX/esbuild 打包，React/react-dom external |
| src/client/workbench-styles.ts | 后置主题覆盖，应用现有设计规范 |

现状没有完整提交、分支/远程/stash 管理和提交历史图，不能只扩展现有两条读端点就算迁移完成。

## 4. 要迁移的行为清单

以下目标已落实；实现与验证范围详见 GIT_VCS_ACCEPTANCE.md：

- [x] 本地变更分组：冲突、已暂存、已修改、未跟踪；保留中文/空格/特殊字符路径，正确处理 rename。
- [x] 文件勾选、分组选择、工作区/暂存区差异，按勾选文件提交、提交信息和 amend。
- [x] 差异预览、改动块定位、读取失败/二进制/大文件与截断状态，和当前代码字体/主题一致。
- [x] 历史：所有分支的多泳道提交图；分页续拉、刷新保持已加载范围；提交详情、文件列表和指定文件差异。
- [x] 本地/远程分支：当前分支、upstream、ahead/behind；创建、切换等操作；破坏性操作有明确确认。
- [x] 远程仓库列表与管理、fetch、pull、push；认证失败、凭据处理与日志脱敏需沿用可靠实现。
- [x] stash 列表、创建、apply/pop/drop 等，上游能力逐项核对确认流程。
- [x] 命令流水：真实执行结果、耗时、截断与失败状态，不能泄露凭据。
- [x] 非 Git 目录使用明确空态，可从界面显式 git init；不在读取面板时自动初始化。
- [x] 首次/刷新/写操作后使用聚合快照，减少串行往返；操作忙碌与错误反馈完整。
- [x] 切换会话/项目时绑定新 cwd，隔离旧请求结果，避免跨项目串数据。
- [x] 不编辑根路径、不引入分栏、不依赖独立插件运行，适配窄右栏、全屏及深浅主题。

## 5. 适配方向（建议，尚未定稿）

已确定的原则：
1. 继续走当前插件自己的宿主服务与 /codex-cli 通道，复用 connection.requestRejection 信任栅栏。
2. 提取可测试的 Git 业务服务/解析器，再接面板，避免把所有内容追加进 lib/fs.js。
3. 尽量复用原插件验证过的参数校验、状态/历史解析、提交图和业务交互；替换旧 DSH Session、slots 和独立通道绑定。
4. 当前 cwd 由 ConsolePage → SidebarWorkspace → GitTab 提供，不添加原插件可编辑“仓库路径”输入。
5. 新 UI 遵循本会话规范：现有 Lucide、紧凑图标按钮、SelectMenu（禁止原生 select）、代码字体和深浅主题。
6. 不恢复旧设计中的分栏。右栏单栏、多标签、全高和 46/44px 对齐仍要保持。

仍需实现者判断并验证：
- 是接 DSH subprocess 服务还是延续当前 Node child_process；前者需要正确声明注入并核验宿主版本，后者必须实现取消、超时、输出上限和生命周期。
- 原 runGit 的 spawn/collected.readFrom/handle.done 语义不能直接用 Node spawn 假扮而不测。
- 上游 handler 返回信封，当前 api 返回业务值，需要统一适配错误模型，不能双重封装或吞掉 Git 错误。
- 上游默认 allowDangerous / allowPush 开启不意味着可以在本次实施中直接对用户真实仓库执行危险操作；UI 实现与集成测试可以做，测试写操作使用临时仓库/本地 bare remote。
- 参考 UI 大量内联样式与文字按钮，必须适配当前主题和图标规范；完整照搬不等于符合用户要求。
- 原结构里 Console/Branches/Remotes 等并非“Codex CLI 升级版本管理”，勿改错 lib/versions.js。

## 6. 建议执行与验收顺序

1. 读取当前源码与这两份交接，保留累计改动。确认 /tmp 参考源码与提交。
2. 列端点/类型/功能对照表，提取 GitService 与参数校验，接入现有路由。
3. 在 /tmp 创建独立 Git 测试仓库：文件含中文/空格/以 - 开头、暂存/未暂存/未跟踪、rename、merge 冲突、空仓库、无仓库。
4. 验证 snapshot/diff/log/show，提交/暂存/还原、分支、stash 等只操作夹具；网络行为使用本地 bare remote，不触碰用户真实远端。
5. 迁移六页功能与提交图，适配当前 api/cwd/主题/图标；补切项目异步隔离和取消。
6. 自动化覆盖：解析器、非法参数/路径、超时/截断、关键真实 Git 工作流、路由信任栅栏；按重要行为写测试，不只断言按钮存在。
7. npm run build + npm test；若沙箱 listen EPERM 按已有权限流程重跑，别删路由测试。
8. 浏览器验收：当前宽度、左右拖动、窄栏/全屏、切项目、键盘、弹层、文件差异、历史加载、空态和错误态；用户 Git 操作不得替代临时仓库测试。
9. 再验证 DSH 热替换与宿主代码实际生效：build 成功不能证明宿主已换代码。先读既有部署手册与运行状态，遵守外部目录写权限。
10. 更新实施/验收文档和第三方许可，最终只报告已实现并验证的范围，列出真实剩余项。

## 7. 验证与授权提醒

- 原完整右栏计划要求插件独立工作；不要只转发到运行中 /git-vcs 或 iframe 另一个插件。
- 已有运行中面板的后续截图反馈，但本次 Git 调查没有做真实页面验收。
- 直接运行现有 UI 验收脚本曾报缺少 playwright，旧文档记录其他位置有环境；先找可用依赖/浏览器，不能反复只构建然后称完成。
- Git 重构原授权仍有效，不需要再提“要我继续吗”。但当前用户要求的是交接，已暂停在调查边界并写入记忆。
- 用户源码和测试仓库须分开；不要通过 git reset / clean 或提交当前大量未提交改动来“准备测试”。
