# 插件内右栏：实施与验收记录

日期：2026-11-07。当前交付：P0、P1，以及 P2/P3 的基础文件服务；整体完整移植尚未完成。

## 本次落地

- vendor/dsh-dockkit：从固定上游源码版本移植布局引擎、标签、拖动、分栏和浮动组件；Session 无关，本插件独立使用。来源及补丁见 PROVENANCE.md，发布包携带 THIRD_PARTY_NOTICES.md。
- SidebarWorkspace：工作目录隔离，带校验的布局恢复，宽度键盘/拖动调整、全屏与窄屏、浮动/停靠、关闭其他标签页。按工作目录保存布局；热更新恢复原选中面板和布局。
- FilesPane / DocumentPane：懒加载嵌套目录、隐藏项、大小/时间元数据、真实目录观察与轮询兜底、独立文件标签、UTF-8 文本分页、Markdown/源码切换、图片缩放。图片接口已接入，当前真实 UI 回归重点覆盖 Markdown。
- WorkspaceService：宿主工作区身份、路径及符号链接边界检查、限额按行和字节读取、租约式 watcher、dispose 清理。文本页上限 2MiB，深位置扫描上限 64MiB，图片预览上限 8MiB。
- 宿主 status.runtime：实际代码 revision、磁盘构建指纹、实例 id、PID、活跃实例数、文件观察数量，供验收使用。
- 前端 HMR 的样式归属清理；按会话保存当前浏览器标签页中的草稿与附件引用。DSH 注销全局面板后自动恢复选中状态。
- 宿主 HMR 主动结束旧 SSE 连接，浏览器重连后重新登记工作区和目录观察。
- 主 profile 原有两条 codex-cli 已确认并去重。当前保留 bundle 自带行；仅对本插件 index.js/lib 启用源码监视。没有修改 DSH 安装包或源码。

## 环境

- DSH：0.2.1-rc.5。
- 运行中的主服务：127.0.0.1:3080，主服务 PID 在本次操作前后均为 3718543。
- 隔离验收：127.0.0.1:3081，DSH_HOME=/tmp/dsh-codex-sidebar-acceptance；使用相同已安装 DSH 和本仓库 link: 插件。
- 上游布局源码：fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159（0.2.2-rc.1 快照），通过插件自己的适配层在当前 DSH 上运行。
- 主页面旧登录 Cookie 无效，因此真实浏览器验收在 3081 的正常认证页面完成。不能把它描述为已验收 3080 的登录页面。
- 隔离 profile 初始配置曾重启以建立宿主 source watcher 基线；热更新测试记录的 PID 比较仅涵盖测试本身，测试期间未重启 DSH。

## 实际使用的热加载配置

主 profile 的用户 patch（保留其他配置）：

```yaml
- id: hmr
  config:
    base: /root/project/dsh-codex-cli
    root: [index.js, lib]
```

保留原有 patchReload: live 和 web 组合提供的 client-hmr。源码 watcher 限定在本插件宿主代码；不监视整个 DSH，也不向全局 node_modules 写代码。

前端：npm run build。构建完整 JS/CSS 后原子替换 client.js；client-hmr 更新模块 revision，通过 /plugins/events 换掉当前插件。React 状态会重建，所以面板选择、布局和会话草稿由本插件恢复。

宿主：源码监视载入 index.js/lib 的变化；npm run dev:reload:host 可额外触发 profile 重组。只 touch 配置不是成功证据；验证 runtime.hostRevision、hostInstanceId、activeInstances，以及实际端点的新行为。root: [] 的仅配置重组路径在早期依赖文件探针中未形成可靠闭环，本次采用已实测的定向源码 watcher。

原主 profile 备份（含原配置，应私下保存）：
/tmp/dsh-codex-sidebar-acceptance/cordis.patch.before-single-instance.yml。
不提交凭据、profile 备份或浏览器登录状态。

## 自动化命令

```bash
npm test
npm run build
npm run dev:reload:host
```

真实浏览器验收：

```bash
DSH_BASE_URL=http://127.0.0.1:3081 \
DSH_PROFILE_DIR=/tmp/dsh-codex-sidebar-acceptance/profiles/web \
DSH_BROWSER_STATE=/path/to/private/browser-state.json \
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs \
CHROMIUM_PATH=/path/to/chromium \
VERIFY_HMR=1 \
npm run test:sidebar:live
```

省略 VERIFY_HMR 时只测试真实页面和布局，不改构建标记。启用后做 10 次前端构建替换，以及 3 次宿主 revision 修改/恢复；宿主探针只接受 /tmp 下的隔离 profile。脚本使用临时工作目录和无模型回合的测试线程，并尝试清理该线程。第三方 Playwright 路径和 Chromium 路径可由环境传入，本项目不硬编码开发机工具路径。

## 验收证据

- 单元/宿主集成：25 项通过，包括路径越界、外部符号链接、UTF-8/二进制区分、分页、原字节读取、超长行、观察租约清理、布局坏数据/循环校验、恢复后 id 唯一，以及真实 HTTP SSE 释放。
- 真实 DSH 页面：单实例、真实文件树、独立 Markdown 标签、实际文件观察、宽度键盘调整、全屏、分栏、浮动/停靠、390px 窄屏通过。
- 前端：10 次代码替换，页面导航次数不增加，根节点和样式各一份，会话草稿保留。
- 宿主：3 次实际代码 revision 替换，PID 不变，活跃实例数为 1；SSE 重连后文件观察恢复。
- 构建及 npm pack --dry-run 已检查：宿主新模块和第三方许可在发布列表内。

最新完整通过的脚本退出状态与截图/JSON 见 /tmp/dsh-sidebar-verification/。每次运行覆盖 report.json，最终状态以该报告与进程退出码共同判断；不能以报告中部分 checks 已出现替代脚本整体成功。

## 明确未完成

- 文件多选/键盘全树导航、上传/下载、引用到当前 Codex composer、创建/重命名/回收站删除等写操作；
- 与 DSH 同等的代码高亮、相对图片/链接、跳转行、滚动/缩放细节；
- PDF、HTML 本地依赖、Excel 和 Office 转换；
- 真 PTY/xterm 与完整进程生命周期（当前终端仍为旧命令执行页）；
- 完整 Git 六页及写操作（当前为旧状态/diff/log 页）；
- 浏览器当前仅有基础地址栏/前进后退/刷新/外部打开，完整受控恢复和导航状态机待移植；
- 全功能视觉对照、拖动排序/拆分边缘的完整浏览器矩阵、图片夹具 UI 和包装后独立安装回归。

后续按 RIGHTBAR_PLAN.md 的功能清单继续推进，以上条目不计为已完成。
