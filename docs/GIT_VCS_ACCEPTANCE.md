# Git 版本管理面板实施与验收

日期：2026-11-07。Git 面板已在当前插件内实现，使用自己的 /codex-cli/git/* RPC，不依赖独立 dsh-git-vcs 插件。

## 实施对照

| 清单 | 实现 |
| --- | --- |
| 变更分组与路径 | porcelain v2 -z；冲突、暂存、修改、未跟踪；逐文件/分组勾选；中文、空格、Tab、换行、前导 -、pathspec 字面量和 rename |
| 提交 | 勾选文件的当前完整内容提交；其他已暂存内容保持；另有提交全部暂存区、amend；提交前展示范围并确认 |
| 差异 | 工作区/暂存区/未跟踪/历史文件/贮藏；统一差异、双侧行号、增删着色、改动块跳转、二进制说明、截断提示、读取失败反馈 |
| 历史 | 所有分支、多泳道图、分支标签；50 条起步、最多 2000；加载更多及刷新保持范围；提交详情和文件差异 |
| 分支 | 本地/远程、当前分支、upstream、ahead/behind；创建、切换、合并、安全删除；Git 原生错误保留 |
| 远程 | 获取/推送地址、添加/移除、自定义远程菜单、fetch/pull/push；push 设置 upstream；认证表单及助手/会话凭据兜底 |
| 贮藏 | 创建（含未跟踪）、列表、差异、apply/pop/drop；确认与 expectedHash 防止旧编号指向其他贮藏 |
| 提交操作 | revert、cherry-pick、soft/mixed/hard reset，明确确认作用及数据丢失范围 |
| 命令记录 | 本仓库真实 argv、时间、耗时、退出码、输出、超时及截断；敏感命令隐藏输出，URL 凭据/查询 token 脱敏 |
| 空态 | 普通目录不会自动 init；显式初始化表单；空仓库可读 |
| 生命周期 | 聚合快照；按仓库串行写操作；Node argv 执行、限额捕获、超时/取消、进程组终止、dispose；HTTP 断开传递取消 |
| 工作区 | 绑定会话 cwd，按 cwd 重建组件并拒绝旧请求结果；无根路径编辑；未恢复分栏 |
| 外观 | 当前 Lucide、主题变量、代码字体、自定义 SelectMenu；样式限定在 .codex-git；窄屏及全屏 |

勾选提交会暂存并提交所选文件的**全部当前内容**；需要只提交已暂存版本时使用“提交暂存区”。冲突解决后可暂存文件，再提交暂存区完成合并。不会声称具有逐 hunk 暂存或可视化冲突编辑器。

## 源码入口

- lib/git.js：从固定上游 index.js 移植解析、校验和端点，Node 执行器与项目生命周期适配。
- index.js / lib/routes.js：服务装配、原信任栅栏下的 RPC 分发、稳定错误码。
- src/client/sidebar/GitPane.tsx / gitGraph.ts / gitStyles.ts：六页业务、提交图及样式。
- page/RightPanel.tsx 保留 GitTab 导出名，转到 GitPane；SidebarWorkspace 现有实际入口继续工作。
- test/git.test.mjs / git-graph.test.mjs / routes.test.mjs，scripts/verify-git-live.mjs。
- THIRD_PARTY_NOTICES.md 保留上游版本、提交、修改说明与完整 MIT 许可，同时补记 highlight.js 许可。

## 已执行验证

- npm run build 通过，git diff --check 无空白错误，npm pack --dry-run 确认 lib/git.js 和 THIRD_PARTY_NOTICES.md 包含在发布清单。
- npm test：49 tests，49 pass，0 fail。沙箱禁止 listen 的路由测试按权限流程在沙箱外运行。
- 真实 Git 测试全部使用新建 /tmp 仓库；fetch/pull/push 使用本地 bare remote。没有 reset/clean/提交用户真实工作区或推送用户远端。
- 浏览器在 DSH 0.2.1-rc.5 隔离实例 127.0.0.1:3081 上运行。页面加载真正的当前插件，只有会话元数据被受控夹具替代，Git RPC 不拦截。
- 最终浏览器报告 passed=true，10 组检查，无 pageerror。包括 50 条历史续拉、刷新保持已加载范围、真实非法分支错误、失败后焦点恢复及 Escape、显式 init 成功；不是只检查按钮存在。
- 浏览器真实执行并核对仓库结果：勾选提交、工作区差异、历史详情文件差异、分支创建/切换、添加本地远端并推送、贮藏创建/预览/pop、项目切换、非仓库空态及显式初始化。
- 浅色/深色、右栏全屏、390px 无文档横向溢出、自定义远程下拉、确认弹窗焦点及 Escape 通过。
- 实际前端热加载：构建标记在同一浏览器文档中变化，navigation=0，插件根节点=1；之后通过新 Git snapshot 端点读取临时仓库结果，验证宿主业务实际可用。不能把它描述为重启了用户的主 DSH。
- 证据目录：/tmp/codex-git-verification/，最终 report.json 与截图；测试脚本每次会创建全新夹具并覆盖报告。

## 运行约束与边界

- 隔离实例使用既有 /tmp/dsh-codex-sidebar-acceptance profile，加 /tmp/codex-git-acceptance.patch.yml 仅指定 127.0.0.1:3081。未修改主 profile。
- 真实 HTTPS/SSH 用户远端认证未作网络写入验收；凭据 stdin、助手存取和日志隐藏已用临时仓库自己的凭据文件验证。生产远端行为仍取决于用户的 Git/SSH/凭据助手配置。
- 历史最多 2000 条；差异按配置字节上限截断；结构化列表截断返回明确错误，避免把不完整路径当作可操作文件。
- 验收依赖外部可用 Playwright/Chromium，通过环境变量注入，不新增运行时依赖。认证状态文件保持在 /tmp，不提交。
- 本次未创建 Git 提交；保留全部既有未提交和未跟踪工作。

## 主服务加载修复（用户截图反馈后）

先前验收只覆盖隔离实例，用户主服务 3080 实际仍是旧宿主：git/repo/snapshot 返回 codex-cli/unknown-endpoint。配置重组本身没有证明代码替换成功。

本次触发主 profile 热重组后，更新 lib/runtime.js 的 HOST_REVISION 为 git-vcs-1，并把 lib/git.js 纳入构建指纹，真实触发源码替换。主服务 PID 3718543 保持不变，activeInstances=1，运行时 revision=git-vcs-1，hostBuildId=46c8a8b8752ac8f3。

已对主服务的当前项目 /root/project/dsh-codex-cli 做只读验证：
- 真实 snapshot 成功，分支 master、265 项变更；
- 真实 3080 浏览器加载六页 Git 面板，265 个变更行，无错误提示或页面异常；
- 仅会话展示元数据受控，Git 请求不拦截；未执行当前项目的任何 Git 写操作；
- 截图 /tmp/codex-main-git-current-project.png，验收脚本 /tmp/codex-main-git-browser.mjs；
- 短期登录状态仅存 /tmp，未输出凭据或写入仓库。未重启主服务，未改主 profile 配置内容。
