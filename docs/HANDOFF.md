# 会话交接 · 2026-11-07

## Skills 列表与对话指定

已接入原生 app-server skills/list。输入 `/skill` 或 `/skills` 后 Enter 打开可搜索技能列表，也可从加号菜单选“技能”；输入 `$` 在光标处补全。支持名称/说明筛选、来源路径、禁用状态、刷新/错误反馈、方向键/Enter/Tab/Escape，选中后插入 `$name` 并保留精确路径，草稿按会话恢复。提交和运行中插话分别将技能送为 turn/start、turn/steer 的 type=skill 输入；同名选择精确路径，失效/禁用引用明确报错，删除文本标记后不再携带技能。列表与发送按会话提供商路由，路径绑定当前项目。

核心：lib/skills.js、CodexHub.skills/skillInputs、ProviderHub.skills、skills/list 路由、src/client/skills.ts、SkillPicker.tsx、Composer 与 drafts。协议依据官方 https://developers.openai.com/codex/app-server/ 和本机 codex app-server generate-ts（临时输出 /tmp/codex-skills-protocol），没有读取后自行拼装技能文件系统清单。

构建及 57 项测试通过；测试含模拟 stdio app-server 对实际 turn/start/steer 参数断言，未运行技能或调用模型。主 DSH 实际 skills/list 返回本项目 38 项技能；真实浏览器 8 项检查通过（真实列表、搜索、$ 补全、Tab、草稿恢复、发送技能路径、Escape、别名），发送在浏览器中拦截。截图 /tmp/codex-skills-picker.png，脚本 /tmp/codex-skills-browser.mjs。本轮包含之前文件菜单/下载的未提交修改，均保留，未创建提交。


## 下载链接空白兼容修复

用户截图中的实际消息是 `[下载安装包]( /root/...deb)`，左括号后有空格，原行内 tokenizer 拒绝解析，导致原始 Markdown 直接显示。现已兼容链接目标前后空白以及尖括号包围的含空格路径。共享 tokenizer 在 markdownTokens.ts，回归测试 markdown-links.test.mjs。已用主 DSH 浏览器加载截图中的原消息，下载实际 certbase-online_1.2.3+20261107T165307_lx-ct-pc-linux3_arm64.deb，并核对 SHA-256 与消息一致；未安装/运行或修改该项目文件。截图 /tmp/codex-actual-deb-download-fixed.png。

## 文件下载与默认点击行为

文件右键菜单新增显式下载。对话里的普通文档、代码和图片维持预览；已识别的压缩包、安装包、数据库、二进制数据等格式默认点击下载。类型规则在 src/client/fileTypes.ts；Markdown 本地链接和消息文件附件共用。PDF/Office 文档不改为自动下载；现有预览能力的限制仍然适用。下载绑定该消息会话 cwd，复用 workspace/open 和路径边界检查，GET /codex-cli/workspace/download 在同一认证栅栏下流式发送原始文件，支持中文文件名；不支持目录打包。52 项测试通过，真实 3080 浏览器验证右键下载、二进制链接/附件下载、文档链接/附件预览及下载字节/中文名称。截图 /tmp/codex-file-downloads.png。本轮修改尚未提交。

## 工作区文件右键菜单

已接入文件、文件夹和空白区域菜单：打开文件、上传至目标文件夹、复制绝对/相对路径、@ 到当前会话、刷新、删除。删除前确认并移动到工作区 .dsh-trash；该目录已在本项目忽略。文件夹删除包含全部子项；根目录、.git 和回收目录受保护。上传单文件上限 25MiB，同名不覆盖；上传专用 RPC 支持 Base64 后的请求体大小。引用通过当前 cwd 的 Composer 附件队列发送为 mention，不自动发送对话。

新接口 workspace/upload、workspace/remove，后端在 lib/workspace.js；菜单 FileContextMenu.tsx，文件树 FilesPane.tsx。50 项测试通过；主 DSH 3080 的真实浏览器以 /tmp 夹具完成 8 项检查，含 3MiB 上传、文件回收删除、文件夹删除取消、路径复制、键盘菜单及引用焦点。截图 /tmp/codex-files-context-menu.png。当前修改尚未提交。


## 主服务加载修复补记

用户截图发现 3080 主服务仍返回 git/repo/snapshot 未知端点，先前隔离验收不能替代主服务加载验证。现已通过 profile 热重组与 runtime 源码替换修复，主 PID 3718543 未变、单实例，revision=git-vcs-1。已在真实主服务浏览器对当前项目只读确认六页和 265 项变更正常显示。runtime 构建指纹新增 lib/git.js。详见 GIT_VCS_ACCEPTANCE.md 末节。

## 最新更新：Git 面板已落地

已完成插件内 Git 服务和六页界面，构建、49 项测试、真实 DSH 页面和同文档前端热加载通过。详见 [GIT_VCS_ACCEPTANCE.md](./GIT_VCS_ACCEPTANCE.md)。当前 GitTab 为新 GitPane 的兼容导出，业务在 lib/git.js；工作区与用户既有改动保留，本次未提交或推送用户仓库。

以下原交接正文保留为背景，其中 Git“仅调查”和本轮“未浏览器验收”的状态已由上述最新记录替代。布局取消分栏、绑定会话 cwd 等用户约束继续有效。

## 下一会话先读

1. 本文件。
2. [版本管理重构交接与实施清单](./GIT_VCS_REFACTOR.md)——当前首要待办。
3. 按需读取 [RIGHTBAR_PLAN.md](./RIGHTBAR_PLAN.md) / [RIGHTBAR_ACCEPTANCE.md](./RIGHTBAR_ACCEPTANCE.md) 的历史架构和部署证据；其中分栏等旧要求已被用户后续指令取消，以本文件和当前源码为准。

用户本次要求保存会话记忆，重点交接待完成的版本管理重构。重构任务已获授权，但本次交接不把调查当实现。后续继续时直接实施和验证，无需再询问是否开始。

## 首要未完成任务：版本管理重构

用户原话：

> 开始完整的优化掉版本管理面板，现在的版本管理面板过于简陋了，你去参考我原来在deepseek harness中实现的dsh-git-vcs插件来写，地址在 https://github.com/TiChuXiXi/dsh-git-vcs

**真实状态：仅调查，尚未修改 Git 面板、尚未新增完整 Git 服务。** 不要说已经迁移、集成或验收。当前仍是 RightPanel.tsx 中的简陋 GitTab，只调用 git/status 与 git/diff。

原插件已下载至 /tmp/dsh-git-vcs-reference，package.json 为 0.2.0，提交 cf40b80a7b5dda8e7a41a950c3fdfeddd14ba177。浏览器搜索缓存 README 曾显示 0.1.1，不能用它替代本次实际克隆源码。源代码映射、依赖边界、功能清单、建议实施顺序见 GIT_VCS_REFACTOR.md。

## 工作区与操作约束

- 仓库：/root/project/dsh-codex-cli。当前 HEAD：e54045a（线程 not found 时 resume 重试）。
- 工作区有大量累计修改和未跟踪文件，均应视为用户工作成果。**不要 reset、clean、覆盖重建或把全部文件随手提交。** 本轮没有提交或推送。
- 进行文件读取、写入、列目录等优先 filesystem MCP；不支持/失败才使用 shell，并简要说明降级原因。代码搜索使用相应语义检索规则；没有索引或仅查文字时再 rg。
- 当前允许写入工作仓库与 /tmp。修改 profile 等外部目录须遵守权限边界，不能因为 MCP 允许访问就自行写入。
- 后续实现继续在当前插件内完成，不要求 DSH 本体改造，不假设另一个插件已安装就能工作。
- 构建入口 scripts/build-client.mjs，npm run build 生成 client.js；不要直接改产物。React / react-dom 由宿主模块表提供，不能打包第二份 React。
- 主要工具：npm、Node ESM、esbuild、React TSX、Lucide。highlight.js 已加入；yet-another-react-lightbox 曾安装后应用户要求移除。

## 用户已明确的界面约束

### 布局与侧栏

- 左侧窄图标 rail 已删除，并入项目侧栏；文件/Git/终端/浏览器重复快捷入口已移除。设置、返回 DSH 在侧栏底部，顶部可收起项目栏。
- 左侧宽度可拖拽，260–420px，默认 280，localStorage dsh-codex-nav-width；拖动时暂停收起动画。小屏保留抽屉。
- 左侧收起展开及项目列表折叠需动画，尊重 prefers-reduced-motion。
- 项目/会话行背景宽度一致；会话内容保留缩进；当前展开项目也必须有 hover。
- 会话行只一行，不显示模型，时间在行尾；hover/键盘聚焦时用三点菜单替换时间。
- 长项目/会话名称默认尾部省略；hover 行后延迟约 350ms，20px/s 滚到末尾停止，移开复位。溢出边缘使用渐隐（OverflowLabel.tsx）。
- 项目会话树滚动条紧靠侧栏右侧，仅 hover 或 focus-within 时显示。
- 右侧面板通栏，从顶部到底部；会话顶栏与右栏标签栏 46px，第二栏信息/文件工具栏 44px。桌面顶栏按钮缩小，小屏保留触控尺寸。
- **用户明确要求直接去掉分栏功能。** UI canSplit=false + hideSplitWhenBlocked；旧持久化分栏恢复时合并标签至单栏。不要按旧 RIGHTBAR_PLAN 恢复分栏。
- 空右栏应自动关闭，不能显示无标签空面板；关闭最后标签需收起。历史空分栏清理代码仍在。
- 新建标签页选择工具后，替换/关闭该 guide，不保留多余“新建标签页”。
- 左右拖动边缘仅变化鼠标指针，不要蓝色 hover/active 背景。
- 右栏只保留**一条**外侧左分割线，内部 dockkit 的重复 border-left 已覆盖移除；用户纠正过“全去掉”方案。
- 右侧顶部标签栏隐藏可见滚动条，支持鼠标滚轮横向滚动；保留溢出渐隐。
- 路径绑定当前会话项目，不提供独立修改工作区路径的入口。guide 不显示项目路径；**文件列表工具栏**后来明确要求显示当前文件夹路径而不是重复“工作区文件”标题。

### 文件预览与菜单

- 禁止使用浏览器原生 select 弹层。SelectMenu.tsx 已覆盖提供商、文件显示模式、图片缩放；用户验收过菜单弹层。
- SelectMenu 外壳不能用旧 dsh-codex-select 类（旧类本身有 border/padding，造成双层外框）。现用 dsh-codex-select-control。
- 操作尽量图标化，带 title/aria-label；代码/纯文本选择菜单，Markdown 额外预览；换行、刷新、复制、翻页为图标。
- DocumentPane 代码模式原为通用正则 highlightLine；现在 codeHighlight.tsx 使用 highlight.js/lib/common，扩展名映射语言，整页高亮后转换为 React 行节点。未知语言回退纯文本；Markdown 对话代码块原高亮未整体迁移。
- 色彩由 .document-code 下 hljs 类的主题 CSS 决定，浅色/深色分别设置，不是编辑器或 LSP。
- 代码、右侧文件名/路径/标签标题共用 --dsh-font-family-code：SFMono-Regular, Consolas, Source Code Pro, Liberation Mono, Noto Sans Mono CJK SC, DejaVu Sans Mono, monospace。本机 fc-list 确认后几种可用；实际浏览器设备字体仍需确认。
- 开启换行时必须折断长 URL / 哈希，不能只折部分：document-code.is-wrapped + flex 行、44px 固定行号 gutter、min-width:0、overflow-wrap:anywhere。关闭换行保留横向滚动。
- 工作区文件默认包含隐藏文件/目录，移除“隐藏项”开关。
- guide 工具选项需要 hover 背景与边框反馈。

### 图片、附件和消息

- 上传附件为 72px 同尺寸卡片：图片缩略图，其他文件对应类别图标与扩展名；移除叉号在右上角，hover/focus 显示，触屏常显。
- 图片解码失败也必须回退图标，不能只处理读取失败（用户特别举例 txt 改后缀 png）。
- 图片可点击大图。用户否定第三方 lightbox 后要求自写简单查看器，现 ImageViewer.tsx 为浅灰遮罩、滚轮缩放、点击遮罩/叉号/Esc 关闭。
- 拖文件到对话区域自动上传至输入框；复用 upload/save 和附件队列；禁止触发浏览器默认预览/下载。
- 已发送用户图片/文件位于提问文本**上方**，消息内附件不显示文件名。ItemCard 支持 localImage/local_image；上传普通文件按 mention 的 .dsh-uploads/codex-cli 路径显示文件图标。
- 图片读取沿用 images/read，当前常见扩展名和 8MB 上限仍存在；上传上限为 25MB，两者不同，不能声称任意文件都能预览。
- **ChatGPT/openai 会话不显示 reasoning 条目**；OpenCode Go 保留现有展示。原先把简短 reasoning summary 标题都显示为思考过程引起用户反馈，最终按提供商隐藏，不要再默认恢复。
- 提供商选择在左栏底部。Go 额度从使用量接口独立加载，含 rolling/weekly/monthly，切换提供商时清空旧额度；不得在交接文件写密钥或额度账号数据。

## 关键源码地图

- ConsolePage.tsx：工作台网格、提供商、右栏开闭、左栏宽度和拖放默认行为阻止。
- FocusSidebar.tsx / ThreadRow.tsx / ThreadRowMenu.tsx：项目与会话列表。
- components/OverflowLabel.tsx / SelectMenu.tsx / Icon.tsx / ImageViewer.tsx。
- sidebar/SidebarWorkspace.tsx：右栏实际入口；虽然导入 RightPanelProps，实际渲染不是旧 RightPanel。
- sidebar/state.ts：dockkit controller、布局恢复与旧分栏迁移。
- vendor/dsh-dockkit/：已有移植；controller 新增 mergeEmptyPane。
- sidebar/FilesPane.tsx、DocumentPane.tsx、codeHighlight.tsx。
- page/RightPanel.tsx：**GitTab 和 TerminalTab 仍实际使用**；旧 FilesTab/RightPanel 壳不是当前主入口，避免改错文件。
- page/Composer.tsx：上传、粘贴、拖放、附件预览。
- page/ItemCard.tsx / ThreadView.tsx：消息、附件、reasoning 过滤。
- workbench-styles.ts 为大量后置覆盖；styles.ts 基础样式 + 构建内嵌 CSS + WORKBENCH_CSS 按此顺序注入。样式问题常是特异性/顺序。
- index.js / lib/routes.js：宿主装配与 /codex-cli RPC/SSE。
- lib/workspace.js：工作区路径、文件分页/字节读取/观察。
- lib/fs.js：旧 Git status/diff 和 exec 辅助；lib/provider-hub.js 为提供商分流。
- lib/versions.js 的“版本”是 Codex CLI 版本升级，**不是**待改的 Git 版本管理。

## 验证状态（不要混淆）

- 本轮大量 UI 修改每次执行 npm run build 均通过；最后一次构建为右侧文件名字体调整/路径修改后的产物，随后 Git 重构调查无业务修改。
- 较早完整 npm test 通过 40 项；随后又有大量 UI 变化，**不是当前全部变化的完整验收**。侧栏测试在去分栏及旧布局迁移时单独运行通过。
- 沙箱内 routes 测试曾 listen EPERM；在获准的环境 npm test 可通过，不是已证实的路由逻辑缺陷。
- 直接 node --test test/sidebar.test.mjs 在沙箱内输出可能仅文件级 1 pass；若要逐子测试诊断，用该文件现有测试运行方式核对。
- 当前工作区直接运行 scripts/verify-providers-ui.mjs 曾缺少 playwright；旧验收文档说其他环境有 Playwright，需找到真实可用位置，不能据此默认当前脚本可跑。
- 本轮**没有**执行新的 DSH profile 热加载或主进程重启，也未完成运行中面板的浏览器整体验收。用户提供截图逐项反馈不等于所有改动已验证。
- 新增依赖 highlight.js 的许可/归属记录需在后续发布前核对 THIRD_PARTY_NOTICES.md。
- 旧文档有过时功能描述，后续按需整理，不能让它们覆盖用户最后指令。

## 恢复会话的建议开场

直接说明“接续 Git 版本管理重构，已有源码调查，尚未实现”，先读 GIT_VCS_REFACTOR.md 定位功能与适配边界，然后动手实现、在临时仓库测 Git 操作、构建并完成浏览器验收。不要重复询问是否继续，不要只给研究总结就结束。
