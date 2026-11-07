# Codex 工作台视觉改造：实施与验收

日期：2026-11-07。用户在方向评审后要求“开始实施”。本轮已经改造正式插件并产出 client.js；未修改 DSH 安装包或 DSH 源码。

## 已落地

- 使用中性近白/浅灰与蓝灰强调色，提供独立浅/深两组语义变量。变量限定在 .dsh-codex-root；不修改宿主主题属性。成功、错误等必要状态色保留，绿色不作为交互主色。
- 左侧保留窄活动栏；项目/会话导航可折叠并记忆；手机端改为抽屉。额度与连接详情移入低频位置，右上角保留主题、会话更多菜单和工作区入口。
- 主题按钮以点击位置为圆心展开新主题，460ms，浅转深和深转浅均支持。键盘从按钮中心展开；减少动态效果、不支持或拒绝 View Transition 时直接切换；切换期间互斥，存储不可用时仍可使用。
- 图标统一为 lucide-react：输入区、项目/目录、文件树、浏览器、文档刷新、标签关闭、新建、分栏、全屏、浮动及 Dock 放置提示。原有项目标志保留。Lucide 许可证加入 THIRD_PARTY_NOTICES.md。
- 对话阅读列、字号、行距、工具摘要、代码/Markdown、输入卡片、菜单、附件、审批、项目/目录及维护弹窗统一为同一套主题与间距。
- 会话重命名、归档、Fork、导出、删除收进更多菜单；保留原有 API 和确认流程；补充菜单键盘导航、弹窗焦点限制与返回。
- 右栏保持既有布局引擎与保存结构。手机仅展示当前活动分栏，通过分栏切换入口访问另一栏；回到桌面恢复双栏，不删除或重写布局。
- 修复首次进入会话后项目导航的查询范围竞争：切换工作目录时同步查询引用，避免列表结果归属错误而一直显示加载中。

关键文件：

- src/client/components/Icon.tsx：统一图标与图标按钮。
- src/client/appearance.ts、useAppearance.ts：主题、存储、圆形扩散与导航。
- src/client/workbench-styles.ts：插件内设计变量和统一组件样式。
- src/client/components/DialogFocus.ts：弹窗焦点管理。
- ConsolePage、FocusSidebar、ThreadActions、ThreadView、ItemCard、Composer 及 sidebar/：正式组件集成。
- vendor/dsh-dockkit/components：仅调整插件持有副本的图标与活动分栏呈现标记，来源及差异已补入 PROVENANCE.md。

## 实际验证

- npm test：27 项通过，新增圆形覆盖边角和存储受限测试。
- npm run build：成功；React 和 JSX runtime 保持平台 external，Lucide 按名称导入打包。
- npm pack --dry-run：包含 client.js、宿主 lib、配置和第三方许可证；设计草稿、截图、浏览器认证状态与临时工作区不进入发布包。
- scripts/verify-workbench-live.mjs：真实 DSH 中运行正式组件，生成 24 张界面截图，覆盖浅/深主题、扩散中间帧、导航、输入菜单、Markdown/源码、Git、命令运行器、浏览器、审批、版本、分栏及 375/1024/1280/1440px 布局。
- 主题切换检查了键盘、减少动态效果、缺失/拒绝的 API、宿主主题独立、刷新后的记忆；无页面脚本/控制台错误。
- 真实前端 HMR：2026-11-07T03:26:13.328Z 替换为 workbench-acceptance-1794021992787；页面导航 0 次；根节点 1 个、样式 1 份；草稿、深色主题、折叠状态保留。
- 既有 npm run test:sidebar:live 另行通过：真实空线程和临时工作区、文件树、Markdown 独立标签、真实文件观察、键盘宽度调整、全屏/分栏、浮动/停靠与 390px 窄屏。该回归未启用旧脚本的 10 次前端/3 次宿主探针，避免将历史测试次数当作本轮结果。

验收运行于同一已安装 DSH 0.2.1-rc.5 的隔离实例 http://127.0.0.1:3081；DSH_HOME=/tmp/dsh-codex-sidebar-acceptance。验收前后实例 PID 均为 3324870，runtime.activeInstances 为 1。主实例 3080 的 PID 3718543 未重启；本轮没有其浏览器登录态，因此不声称验收了主实例的认证页面。

界面截图的会话、额度与审批采用受控 RPC 样例；文件/预览/观察使用实际后端服务。没有调用 turns/start 或批准样例命令。另行右栏回归使用真实临时线程，并在结束后清理测试线程。

## 查看结果

- 正式插件截图入口（设计稿已移除）
- 原始工作台验收报告（设计稿已移除）
- 真实右栏回归报告：/tmp/dsh-sidebar-verification/report.json
- 设计阶段和原版对照（设计稿已移除）

## 复验命令

```bash
npm test
npm run build
DSH_BASE_URL=http://127.0.0.1:3081 \
DSH_BROWSER_STATE=/path/to/private/browser-state.json \
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs \
CHROMIUM_PATH=/path/to/chromium \
VERIFY_HMR=1 \
npm run test:workbench:live
```

同样的环境变量可用于 npm run test:sidebar:live；本轮不要求宿主源码探针，因为没有修改宿主业务代码。HMR 依赖既有 client-hmr；hmr.base/root 与 profile 配置方式见 RIGHTBAR_ACCEPTANCE.md。

本轮完成的是整体视觉和相应交互改造。既有右栏功能范围保持：当前终端仍为命令运行器，Git 沿用既有读操作；完整 PTY、Office/PDF、文件写入等独立功能继续按 RIGHTBAR_PLAN.md 推进，不将其计入本轮已实现能力。
