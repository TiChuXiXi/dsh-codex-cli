/* dsh-codex-cli 浏览器半区（scripts/build-client.mjs 生成，勿手改） */
window.__ModuleLoader__.load({
  id: 'dsh-codex-cli',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    var __create = Object.create;
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
      mod
    ));
    var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

    // src/client/index.tsx
    var index_exports = {};
    __export(index_exports, {
      apply: () => apply,
      inject: () => inject
    });
    module.exports = __toCommonJS(index_exports);

    // src/client/components/CodexIcon.tsx
    var React = __toESM(require("react"), 1);

    // src/client/components/codexLogo.ts
    var CODEX_LOGO_PATH = "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z";
    function codexFavicon(color) {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${color}" d="${CODEX_LOGO_PATH}"/></svg>`;
      return `data:image/svg+xml,${encodeURIComponent(svg)}`;
    }

    // src/client/components/CodexIcon.tsx
    function CodexIcon({ size = 16 }) {
      return /* @__PURE__ */ React.createElement(
        "svg",
        {
          width: size,
          height: size,
          viewBox: "0 0 24 24",
          fill: "currentColor",
          "aria-hidden": "true"
        },
        /* @__PURE__ */ React.createElement("path", { d: CODEX_LOGO_PATH })
      );
    }

    // src/client/i18n.ts
    var React2 = __toESM(require("react"), 1);
    var NS = "codexCli";
    var zh = {
      "app.title": "Codex CLI",
      "app.subtitle": "管理端",
      "info.env": "环境",
      "info.sessions": "会话",
      "info.quota": "额度",
      "quota.remaining": "剩余 {percent}%",
      "quota.unlimited": "无限",
      "quota.unknown": "—",
      "quota.loading": "加载中…",
      "quota.window.weekly": "每周",
      "quota.window.daily": "每天",
      "quota.window.5h": "5 小时",
      "quota.window.1h": "1 小时",
      "quota.window.minutes": "{count} 分钟",
      "quota.resetCredits": "{count} 次重置",
      "quota.resetsAt": "重置于 {time}",
      "picker.title": "选择项目",
      "picker.existing": "现有项目",
      "picker.newHint": "项目按会话目录聚合。新建项目会先浏览目录，可在其中新建文件夹。",
      "picker.newProjectAction": "新建项目…",
      "browse.title": "新建项目",
      "browse.loading": "加载中…",
      "browse.empty": "没有子目录",
      "browse.hiddenOnly": "仅显示隐藏目录（{count} 个）",
      "browse.up": "上一级",
      "browse.enter": "进入",
      "browse.editPath": "编辑路径",
      "browse.newFolder": "新建文件夹",
      "browse.folderName": "文件夹名称",
      "browse.untitledFolder": "未命名文件夹",
      "browse.createIn": "在「{name}」中新建文件夹",
      "browse.create": "创建",
      "browse.creating": "创建中…",
      "browse.cancel": "取消",
      "browse.open": "创建并开会话",
      "browse.target": "项目目录",
      "browse.showHidden": "显示隐藏目录",
      "browse.home": "主目录",
      "browse.truncated": "目录过多，仅显示开头部分。",
      "right.files": "文件",
      "right.git": "版本",
      "right.terminal": "终端",
      "right.show": "右侧面板",
      "right.hide": "收起面板",
      "right.close": "关闭",
      "right.noCwd": "先选择一个会话",
      "right.up": "上一级",
      "right.emptyDir": "空目录",
      "right.back": "返回",
      "right.truncated": "文件过大，仅显示前 256 KB",
      "right.refresh": "刷新",
      "right.branch": "分支",
      "right.changes": "变更",
      "right.noChanges": "没有未提交的变更",
      "right.diff": "差异",
      "right.log": "最近提交",
      "right.run": "运行",
      "right.running": "运行中…",
      "right.command": "输入命令，回车运行",
      "right.exitCode": "退出码 {code}",
      "focus.search": "搜索项目或会话",
      "focus.newProject": "新建项目",
      "status.idle": "未连接",
      "status.connecting": "连接中",
      "status.ready": "已连接",
      "status.error": "连接失败",
      "status.stopped": "已停止",
      "status.daemon": "守护进程",
      "status.stdio": "独立实例",
      "status.version": "Codex {version}",
      "status.refresh": "刷新",
      "status.events.connecting": "连接中",
      "status.events.open": "实时",
      "status.events.reconnecting": "重连中",
      "status.events.closed": "离线",
      "projects.title": "项目",
      "projects.all": "全部会话",
      "projects.count": "{count} 个会话",
      "projects.active": "{count} 个运行中",
      "projects.empty": "还没有任何会话",
      "projects.search": "搜索项目",
      "projects.noMatch": "没有匹配的项目",
      "projects.loadMore": "加载更多",
      "threads.loading": "加载中…",
      "thread.running": "Codex 正在处理，用时 {seconds} 秒 …",
      "threads.empty": "这个项目还没有会话",
      "threads.loadMore": "加载更多",
      "threads.archived": "已归档",
      "threads.search": "搜索会话",
      "threads.title": "会话",
      "threads.noMatch": "没有匹配的会话",
      "common.expand": "展开",
      "common.collapse": "收起",
      "composer.add": "添加",
      "composer.commands": "快捷命令",
      "composer.removeAttachment": "移除附件",
      "composer.uploading": "上传中…",
      "composer.noCwd": "先打开一个会话再上传文件",
      "cmd.model": "切换模型",
      "cmd.modelDesc": "选择本次及后续回合使用的模型",
      "cmd.effort": "推理强度",
      "cmd.effortDesc": "调整推理强度",
      "cmd.permission": "会话权限",
      "cmd.permissionDesc": "需要审批 / 替我审批 / 完全访问 / 只读",
      "cmd.plan": "计划模式",
      "cmd.planDesc": "先规划、不改代码（同 /plan）",
      "cmd.attach": "文件和文件夹",
      "cmd.attachDesc": "上传文件并附加到消息",
      "cmd.project": "选择项目",
      "cmd.projectDesc": "切换当前项目",
      "cmd.compact": "压缩上下文",
      "cmd.compactDesc": "压缩当前会话的上下文",
      "cmd.diff": "查看差异",
      "cmd.diffDesc": "在右侧面板查看 Git 变更",
      "cmd.export": "导出会话",
      "cmd.exportDesc": "将会话导出为 Markdown",
      "cmd.init": "初始化 AGENTS.md",
      "cmd.initDesc": "插入生成 AGENTS.md 的指令",
      "cmd.review": "审阅改动",
      "cmd.reviewDesc": "插入审阅当前改动的指令",
      "cmd.initPrompt": "请阅读仓库结构并生成 AGENTS.md，说明构建、测试与代码约定。",
      "cmd.reviewPrompt": "请审阅当前未提交的改动，列出问题与风险。",
      "cmd.new": "新会话",
      "cmd.newDesc": "在当前项目新建会话",
      "permission.title": "会话权限",
      "permission.ask": "需要审批",
      "permission.askDesc": "读写工作区、执行命令，访问网络或修改工作区外文件时需审批",
      "permission.approve": "替我审批",
      "permission.approveDesc": "仅对检测到可能不安全的操作请求审批",
      "permission.read": "只读",
      "permission.readDesc": "只读工作区文件，修改或访问网络需审批",
      "permission.full": "完全访问",
      "permission.fullDesc": "可直接修改工作区外文件并访问网络，不经审批",
      "permission.fullTitle": "切换到完全访问？",
      "permission.fullBody": "完全访问会取消沙箱限制，Codex 可以不经审批读写文件、执行命令和访问网络。确认切换？",
      "permission.confirm": "确认切换",
      "permission.cancel": "取消",
      "composer.defaultModel": "默认模型",
      "composer.defaultEffort": "默认",
      "composer.model": "模型",
      "composer.effort": "推理强度",
      "composer.effort.xhigh": "极高",
      "composer.effort.max": "Max",
      "composer.effort.ultra": "Ultra",
      "composer.defaultTag": "（默认）",
      "composer.currentTag": "（当前）",
      "composer.moreReasoning": "更多推理…",
      "composer.moreReasoningHint": "Max 与 Ultra 会更快消耗额度",
      "composer.advancedReasoning": "高级推理",
      "composer.consumesFaster": "会更快消耗额度",
      "composer.effort.minimal": "极低",
      "composer.effort.low": "低",
      "composer.effort.medium": "中",
      "composer.effort.high": "高",
      "composer.running": "运行中",
      "composer.placeholder": "给 Codex 发消息…",
      "composer.planPlaceholder": "描述要规划的任务，Codex 会先给出计划…",
      "plan.tag": "计划",
      "plan.exit": "退出计划模式",
      "composer.steerPlaceholder": "插话到正在运行的回合…",
      "composer.send": "发送",
      "composer.steer": "插话",
      "composer.stop": "停止",
      "composer.sendHint": "Enter 发送，Shift+Enter 换行",
      "composer.steerHint": "回合运行中：发送会插话，不会新开回合",
      "approval.command": "命令审批",
      "approval.file": "文件变更审批",
      "approval.input": "需要你的选择",
      "approval.permissions": "权限申请",
      "approval.elicitation": "MCP 请求",
      "approval.allow": "允许",
      "approval.allowTurn": "允许本次",
      "approval.allowSession": "本会话允许",
      "approval.deny": "拒绝",
      "approval.cancel": "取消",
      "approval.submit": "提交",
      "approval.reason": "原因",
      "approval.cwd": "目录",
      "approval.grantRoot": "授权目录",
      "approval.other": "其他",
      "tab.title": "Codex",
      "tab.hint": "打开一个 DSH 会话后，这里显示该项目的 Codex 会话。",
      "tab.count": "{count} 个会话",
      "tab.refresh": "刷新",
      "tab.newThread": "新会话",
      "tab.openPage": "打开 Codex 页面",
      "tab.empty": "这个项目还没有 Codex 会话",
      "tab.loading": "加载中…",
      "actions.rename": "重命名",
      "actions.archive": "归档",
      "actions.fork": "Fork",
      "actions.export": "导出",
      "actions.menu": "会话操作",
      "actions.delete": "删除",
      "actions.renameTitle": "重命名会话",
      "actions.deleteTitle": "删除会话",
      "actions.deleteBody": "永久删除「{name}」？此操作不可恢复。",
      "actions.save": "保存",
      "actions.cancel": "取消",
      "actions.confirmDelete": "永久删除",
      "actions.failed": "操作失败",
      "actions.archived": "已归档",
      "actions.exported": "已导出",
      "versions.title": "版本与健康",
      "versions.open": "版本",
      "versions.cli": "CLI",
      "versions.daemon": "守护进程",
      "versions.latest": "最新版",
      "versions.channel": "安装方式",
      "versions.check": "检查更新",
      "versions.checking": "检查中…",
      "versions.update": "升级",
      "versions.upToDate": "已是最新",
      "versions.updateAvailable": "可升级到 {version}",
      "versions.rollback": "回滚",
      "versions.rollbackPlaceholder": "目标版本，例如 0.165.0",
      "versions.daemonActions": "守护进程",
      "versions.restart": "重启",
      "versions.daemonUpdate": "更新守护进程",
      "versions.stop": "停止",
      "versions.confirmRestart": "重启守护进程会中断正在运行的回合，确认继续？",
      "versions.confirmUpdate": "更新守护进程会中断正在运行的回合，确认继续？",
      "versions.confirmStop": "停止守护进程会中断正在运行的回合，确认继续？",
      "versions.confirm": "确认",
      "versions.cancel": "取消",
      "versions.force": "仍然继续",
      "versions.activeTurns": "有 {count} 个会话正在运行",
      "versions.job": "任务输出",
      "versions.running": "运行中…",
      "versions.done": "完成",
      "versions.failed": "失败（退出码 {code}）",
      "versions.doctor": "体检",
      "versions.doctorOk": "正常",
      "versions.doctorWarn": "有警告",
      "versions.doctorError": "有问题",
      "versions.close": "关闭",
      "versions.failedToLoad": "读取版本信息失败",
      "versions.updatedHint": "升级后请重新检查版本；守护进程可能仍是旧版本。",
      "newThread.title": "新会话",
      "newThread.cwd": "工作目录",
      "newThread.model": "模型",
      "newThread.effort": "推理强度",
      "newThread.approval": "审批策略",
      "newThread.sandbox": "沙箱",
      "newThread.create": "创建",
      "newThread.creating": "创建中…",
      "newThread.cancel": "取消",
      "newThread.default": "默认",
      "newThread.open": "新会话",
      "newThread.failed": "创建会话失败",
      "thread.jumpToBottom": "回到最新",
      "thread.loadOlder": "加载更早的消息",
      "thread.loadingOlder": "正在加载更早的消息…",
      "thread.select": "从左侧选择一个会话",
      "thread.selectHint": "也可以从项目列表里挑一个项目，再打开其中的会话。",
      "thread.messages": "{count} 条消息",
      "thread.messagesPlus": "{count}+ 条消息",
      "thread.noMessages": "这个会话还没有消息",
      "thread.loading": "读取会话…",
      "thread.cwd": "工作目录",
      "thread.model": "模型",
      "thread.effort": "推理强度",
      "thread.status": "状态",
      "thread.git": "Git",
      "thread.created": "创建于",
      "thread.updated": "更新于",
      "thread.subscribeFailed": "无法订阅实时事件（历史仍可查看）",
      "state.active": "运行中",
      "state.idle": "空闲",
      "state.notLoaded": "未加载",
      "state.systemError": "系统错误",
      "item.user": "你",
      "item.assistant": "Codex",
      "item.reasoning": "思考过程",
      "item.command": "命令",
      "item.files": "文件变更",
      "item.tool": "工具调用",
      "item.plan": "计划",
      "item.search": "网页搜索",
      "group.commands": "执行了 {count} 条命令",
      "group.reads": "读取了 {count} 个文件",
      "group.writes": "修改了 {count} 个文件",
      "group.tools": "调用了 {count} 个工具",
      "group.activity": "工具调用",
      "group.sepAnd": "并",
      "group.sepList": "、",
      "item.image": "图片",
      "item.imageLoading": "加载图片…",
      "item.imageFailed": "图片无法加载",
      "item.compaction": "上下文已压缩",
      "item.review": "代码审查",
      "item.other": "{type}",
      "item.exitCode": "退出码 {code}",
      "item.output": "输出",
      "item.files.changed": "{count} 个文件",
      "error.title": "出错了",
      "error.retry": "重试",
      "error.offline": "宿主未连接，稍后会自动重试。",
      "duration.seconds": "{count} 秒",
      "duration.minutes": "{count} 分",
      "duration.hours": "{count} 小时",
      "turn.workedFor": "用时 {duration}",
      "turn.interrupted": "已中断（{duration}）",
      "turn.failed": "失败（{duration}）",
      "time.justNow": "刚刚",
      "time.minutes": "{count} 分钟前",
      "time.hours": "{count} 小时前",
      "time.days": "{count} 天前"
    };
    var en = {
      "app.title": "Codex CLI",
      "app.subtitle": "Console",
      "info.env": "Runtime",
      "info.sessions": "Sessions",
      "info.quota": "Quota",
      "quota.remaining": "{percent}% left",
      "quota.unlimited": "Unlimited",
      "quota.unknown": "—",
      "quota.loading": "Loading…",
      "quota.window.weekly": "weekly",
      "quota.window.daily": "daily",
      "quota.window.5h": "5h",
      "quota.window.1h": "1h",
      "quota.window.minutes": "{count}m",
      "quota.resetCredits": "{count} resets",
      "quota.resetsAt": "Resets at {time}",
      "picker.title": "Choose a project",
      "picker.existing": "Existing projects",
      "picker.newHint": "Projects are grouped by session directory. New project starts by browsing directories, where you can create a folder.",
      "picker.newProjectAction": "New project…",
      "browse.title": "New project",
      "browse.loading": "Loading…",
      "browse.empty": "No subdirectories",
      "browse.hiddenOnly": "Hidden directories only ({count})",
      "browse.up": "Up",
      "browse.enter": "Enter",
      "browse.editPath": "Edit path",
      "browse.newFolder": "New folder",
      "browse.folderName": "Folder name",
      "browse.untitledFolder": "Untitled folder",
      "browse.createIn": 'New folder in "{name}"',
      "browse.create": "Create",
      "browse.creating": "Creating…",
      "browse.cancel": "Cancel",
      "browse.open": "Create and open",
      "browse.target": "Project directory",
      "browse.showHidden": "Show hidden directories",
      "browse.home": "Home",
      "browse.truncated": "Too many directories to list; only the beginning is shown.",
      "right.files": "Files",
      "right.git": "Git",
      "right.terminal": "Terminal",
      "right.show": "Right panel",
      "right.hide": "Hide panel",
      "right.close": "Close",
      "right.noCwd": "Select a session first",
      "right.up": "Up",
      "right.emptyDir": "Empty directory",
      "right.back": "Back",
      "right.truncated": "Large file, showing first 256 KB",
      "right.refresh": "Refresh",
      "right.branch": "Branch",
      "right.changes": "Changes",
      "right.noChanges": "No uncommitted changes",
      "right.diff": "Diff",
      "right.log": "Recent commits",
      "right.run": "Run",
      "right.running": "Running…",
      "right.command": "Type a command and press Enter",
      "right.exitCode": "Exit code {code}",
      "focus.search": "Search projects or sessions",
      "focus.newProject": "New project",
      "status.idle": "Not connected",
      "status.connecting": "Connecting",
      "status.ready": "Connected",
      "status.error": "Connection failed",
      "status.stopped": "Stopped",
      "status.daemon": "Daemon",
      "status.stdio": "Private instance",
      "status.version": "Codex {version}",
      "status.refresh": "Refresh",
      "status.events.connecting": "Connecting",
      "status.events.open": "Live",
      "status.events.reconnecting": "Reconnecting",
      "status.events.closed": "Offline",
      "projects.title": "Projects",
      "projects.all": "All sessions",
      "projects.count": "{count} sessions",
      "projects.active": "{count} running",
      "projects.empty": "No sessions yet",
      "projects.search": "Search projects",
      "projects.noMatch": "No matching projects",
      "projects.loadMore": "Load more",
      "threads.loading": "Loading…",
      "thread.running": "Codex is working · {seconds}s …",
      "threads.empty": "No sessions in this project",
      "threads.loadMore": "Load more",
      "threads.archived": "Archived",
      "threads.search": "Search sessions",
      "threads.title": "Sessions",
      "threads.noMatch": "No matching sessions",
      "common.expand": "Expand",
      "common.collapse": "Collapse",
      "composer.add": "Add",
      "composer.commands": "Commands",
      "composer.removeAttachment": "Remove attachment",
      "composer.uploading": "Uploading…",
      "composer.noCwd": "Open a session before uploading files",
      "cmd.model": "Switch model",
      "cmd.modelDesc": "Choose the model for this and later turns",
      "cmd.effort": "Reasoning effort",
      "cmd.effortDesc": "Adjust reasoning effort",
      "cmd.permission": "Session permission",
      "cmd.plan": "Plan mode",
      "cmd.planDesc": "Plan first without changing code (same as /plan)",
      "cmd.permissionDesc": "Read only / Auto / Full access",
      "cmd.attach": "Files and folders",
      "cmd.attachDesc": "Upload files to attach to the message",
      "cmd.project": "Choose project",
      "cmd.projectDesc": "Switch the current project",
      "cmd.compact": "Compact context",
      "cmd.compactDesc": "Compact the current session context",
      "cmd.diff": "View diff",
      "cmd.diffDesc": "Show Git changes in the right panel",
      "cmd.export": "Export session",
      "cmd.exportDesc": "Export the session as Markdown",
      "cmd.init": "Initialize AGENTS.md",
      "cmd.initDesc": "Insert a prompt to generate AGENTS.md",
      "cmd.review": "Review changes",
      "cmd.reviewDesc": "Insert a prompt to review current changes",
      "cmd.initPrompt": "Read the repository and generate AGENTS.md describing build, test, and code conventions.",
      "cmd.reviewPrompt": "Review the current uncommitted changes and list issues and risks.",
      "cmd.new": "New session",
      "cmd.newDesc": "Create a session in the current project",
      "permission.title": "Session permission",
      "permission.ask": "Ask for approval",
      "permission.askDesc": "Read and edit workspace files and run commands, approval for network access or edits outside the workspace",
      "permission.approve": "Approve for me",
      "permission.approveDesc": "Only ask for actions detected as potentially unsafe",
      "permission.read": "Read only",
      "permission.readDesc": "Read workspace files, approval for edits or network access",
      "permission.full": "Full access",
      "permission.fullDesc": "Edit files outside the workspace and access the internet without approval",
      "permission.fullTitle": "Switch to full access?",
      "permission.fullBody": "Full access removes the sandbox: Codex can read and write files, run commands, and access the network without approval. Continue?",
      "permission.confirm": "Switch",
      "permission.cancel": "Cancel",
      "composer.defaultModel": "Default model",
      "composer.defaultEffort": "Default",
      "composer.model": "Model",
      "composer.effort": "Reasoning effort",
      "composer.effort.xhigh": "Extra high",
      "composer.effort.max": "Max",
      "composer.effort.ultra": "Ultra",
      "composer.defaultTag": " (default)",
      "composer.currentTag": " (current)",
      "composer.moreReasoning": "More reasoning…",
      "composer.moreReasoningHint": "Max and Ultra consume usage limits faster",
      "composer.advancedReasoning": "Advanced reasoning",
      "composer.consumesFaster": "Consumes usage limits faster",
      "composer.effort.minimal": "Minimal",
      "composer.effort.low": "Low",
      "composer.effort.medium": "Medium",
      "composer.effort.high": "High",
      "composer.running": "Running",
      "composer.placeholder": "Message Codex…",
      "composer.planPlaceholder": "Describe what to plan; Codex will propose a plan first…",
      "plan.tag": "Plan",
      "plan.exit": "Exit plan mode",
      "composer.steerPlaceholder": "Steer the running turn…",
      "composer.send": "Send",
      "composer.steer": "Steer",
      "composer.stop": "Stop",
      "composer.sendHint": "Enter to send, Shift+Enter for a new line",
      "composer.steerHint": "Turn running: sending steers it instead of starting a new turn",
      "approval.command": "Command approval",
      "approval.file": "File change approval",
      "approval.input": "Input required",
      "approval.permissions": "Permission request",
      "approval.elicitation": "MCP request",
      "approval.allow": "Allow",
      "approval.allowTurn": "Allow for turn",
      "approval.allowSession": "Allow for session",
      "approval.deny": "Decline",
      "approval.cancel": "Cancel",
      "approval.submit": "Submit",
      "approval.reason": "Reason",
      "approval.cwd": "Directory",
      "approval.grantRoot": "Grant root",
      "approval.other": "Other",
      "tab.title": "Codex",
      "tab.hint": "Open a DSH session to see its project’s Codex sessions here.",
      "tab.count": "{count} sessions",
      "tab.refresh": "Refresh",
      "tab.newThread": "New session",
      "tab.openPage": "Open Codex page",
      "tab.empty": "No Codex sessions in this project",
      "tab.loading": "Loading…",
      "actions.rename": "Rename",
      "actions.archive": "Archive",
      "actions.fork": "Fork",
      "actions.export": "Export",
      "actions.menu": "Session actions",
      "actions.delete": "Delete",
      "actions.renameTitle": "Rename session",
      "actions.deleteTitle": "Delete session",
      "actions.deleteBody": 'Permanently delete "{name}"? This cannot be undone.',
      "actions.save": "Save",
      "actions.cancel": "Cancel",
      "actions.confirmDelete": "Delete permanently",
      "actions.failed": "Action failed",
      "actions.archived": "Archived",
      "actions.exported": "Exported",
      "versions.title": "Versions & health",
      "versions.open": "Versions",
      "versions.cli": "CLI",
      "versions.daemon": "Daemon",
      "versions.latest": "Latest",
      "versions.channel": "Install",
      "versions.check": "Check for updates",
      "versions.checking": "Checking…",
      "versions.update": "Update",
      "versions.upToDate": "Up to date",
      "versions.updateAvailable": "Update available: {version}",
      "versions.rollback": "Roll back",
      "versions.rollbackPlaceholder": "Target version, e.g. 0.165.0",
      "versions.daemonActions": "Daemon",
      "versions.restart": "Restart",
      "versions.daemonUpdate": "Update daemon",
      "versions.stop": "Stop",
      "versions.confirmRestart": "Restarting the daemon interrupts running turns. Continue?",
      "versions.confirmUpdate": "Updating the daemon interrupts running turns. Continue?",
      "versions.confirmStop": "Stopping the daemon interrupts running turns. Continue?",
      "versions.confirm": "Confirm",
      "versions.cancel": "Cancel",
      "versions.force": "Continue anyway",
      "versions.activeTurns": "{count} sessions are running",
      "versions.job": "Job output",
      "versions.running": "Running…",
      "versions.done": "Done",
      "versions.failed": "Failed (exit {code})",
      "versions.doctor": "Doctor",
      "versions.doctorOk": "Healthy",
      "versions.doctorWarn": "Warnings",
      "versions.doctorError": "Problems",
      "versions.close": "Close",
      "versions.failedToLoad": "Could not read version information",
      "versions.updatedHint": "Re-check versions after updating; the daemon may still run the old build.",
      "newThread.title": "New session",
      "newThread.cwd": "Working directory",
      "newThread.model": "Model",
      "newThread.effort": "Reasoning effort",
      "newThread.approval": "Approval policy",
      "newThread.sandbox": "Sandbox",
      "newThread.create": "Create",
      "newThread.creating": "Creating…",
      "newThread.cancel": "Cancel",
      "newThread.default": "Default",
      "newThread.open": "New session",
      "newThread.failed": "Could not create the session",
      "thread.jumpToBottom": "Jump to latest",
      "thread.loadOlder": "Load earlier messages",
      "thread.loadingOlder": "Loading earlier messages…",
      "thread.select": "Pick a session on the left",
      "thread.selectHint": "Or choose a project, then open one of its sessions.",
      "thread.messages": "{count} messages",
      "thread.messagesPlus": "{count}+ messages",
      "thread.noMessages": "No messages in this session yet",
      "thread.loading": "Loading session…",
      "thread.cwd": "Working directory",
      "thread.model": "Model",
      "thread.effort": "Reasoning effort",
      "thread.status": "Status",
      "thread.git": "Git",
      "thread.created": "Created",
      "thread.updated": "Updated",
      "thread.subscribeFailed": "Could not subscribe to live events (history is still available)",
      "state.active": "Running",
      "state.idle": "Idle",
      "state.notLoaded": "Not loaded",
      "state.systemError": "System error",
      "item.user": "You",
      "item.assistant": "Codex",
      "item.reasoning": "Reasoning",
      "item.command": "Command",
      "item.files": "File changes",
      "item.tool": "Tool call",
      "item.plan": "Plan",
      "item.search": "Web search",
      "group.commands": "Ran {count} commands",
      "group.reads": "Read {count} files",
      "group.writes": "Changed {count} files",
      "group.tools": "Called {count} tools",
      "group.activity": "Tool calls",
      "group.sepAnd": " and ",
      "group.sepList": ", ",
      "item.image": "Image",
      "item.imageLoading": "Loading image…",
      "item.imageFailed": "Image unavailable",
      "item.compaction": "Context compacted",
      "item.review": "Code review",
      "item.other": "{type}",
      "item.exitCode": "exit {code}",
      "item.output": "Output",
      "item.files.changed": "{count} files",
      "error.title": "Something went wrong",
      "error.retry": "Retry",
      "error.offline": "The host is not connected; retrying automatically.",
      "duration.seconds": "{count}s",
      "duration.minutes": "{count}m",
      "duration.hours": "{count}h",
      "turn.workedFor": "Worked for {duration}",
      "turn.interrupted": "Interrupted after {duration}",
      "turn.failed": "Failed after {duration}",
      "time.justNow": "just now",
      "time.minutes": "{count}m ago",
      "time.hours": "{count}h ago",
      "time.days": "{count}d ago"
    };
    var dictionaries = { zh, en };
    function fallbackTranslate(key, vars) {
      const template = zh[key] ?? en[key] ?? key;
      if (vars === void 0) return template;
      return template.replace(/\{(\w+)\}/gu, (match, name) => vars[name] === void 0 ? match : String(vars[name]));
    }
    var I18nContext = React2.createContext(fallbackTranslate);
    function useT() {
      return React2.useContext(I18nContext);
    }

    // src/client/page/ConsolePage.tsx
    var React18 = __toESM(require("react"), 1);

    // src/client/events.ts
    function openEventStream({ onEvent, onState }) {
      let closed = false;
      let source = null;
      const connect = () => {
        if (closed) return;
        const url = new URL("codex-cli/events", document.baseURI);
        source = new EventSource(url.toString());
        source.onopen = () => onState("open");
        source.onerror = () => onState("reconnecting");
        source.onmessage = (message) => {
          let event;
          try {
            event = JSON.parse(message.data);
          } catch {
            return;
          }
          onEvent(event);
        };
      };
      onState("connecting");
      connect();
      return () => {
        closed = true;
        source?.close();
        source = null;
        onState("reconnecting");
      };
    }

    // src/client/hooks.ts
    var React3 = __toESM(require("react"), 1);
    function useCodexTab(title = "Codex CLI") {
      React3.useEffect(() => {
        if (typeof document === "undefined") return void 0;
        const previousTitle = document.title;
        const links = Array.from(document.querySelectorAll('link[rel~="icon"]'));
        const saved = links.map((link) => ({ link, href: link.getAttribute("href"), type: link.type }));
        const created = [];
        document.title = title;
        const targets = saved.length > 0 ? saved.map((entry) => entry.link) : [];
        if (targets.length === 0) {
          const link = document.createElement("link");
          link.rel = "icon";
          link.type = "image/svg+xml";
          document.head.appendChild(link);
          created.push(link);
          targets.push(link);
        }
        for (const link of targets) {
          const dark = typeof link.media === "string" && link.media.includes("dark");
          link.type = "image/svg+xml";
          link.href = codexFavicon(dark ? "#ffffff" : "#0f1115");
        }
        return () => {
          document.title = previousTitle;
          for (const { link, href, type } of saved) {
            if (!link.isConnected) continue;
            if (href === null) link.removeAttribute("href");
            else link.setAttribute("href", href);
            link.type = type;
          }
          for (const link of created) link.remove();
        };
      }, [title]);
    }

    // src/client/store.ts
    var pending = null;
    var listeners = /* @__PURE__ */ new Set();
    function takePending() {
      const value = pending;
      pending = null;
      return value;
    }
    function subscribePending(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }

    // src/client/utils.ts
    function basename(path) {
      if (typeof path !== "string" || path === "") return "";
      const trimmed = path.replace(/[/\\]+$/u, "");
      const index = Math.max(trimmed.lastIndexOf("/"), trimmed.lastIndexOf("\\"));
      return index === -1 ? trimmed : trimmed.slice(index + 1);
    }
    function firstLine(text) {
      if (typeof text !== "string") return "";
      const line = text.split("\n").find((candidate) => candidate.trim() !== "") ?? "";
      return line.length > 120 ? `${line.slice(0, 120)}…` : line;
    }
    function threadTitle(thread) {
      if (thread === null || thread === void 0) return "";
      if (typeof thread.name === "string" && thread.name.trim() !== "") return thread.name;
      const preview = firstLine(thread.preview);
      if (preview !== "") return preview;
      return thread.id.slice(0, 8);
    }
    function relativeTime(seconds, t) {
      if (typeof seconds !== "number" || seconds <= 0) return "";
      const delta = Date.now() / 1e3 - seconds;
      if (delta < 60) return t("time.justNow");
      if (delta < 3600) return t("time.minutes", { count: Math.floor(delta / 60) });
      if (delta < 86400) return t("time.hours", { count: Math.floor(delta / 3600) });
      return t("time.days", { count: Math.floor(delta / 86400) });
    }
    function formatClock(ms) {
      if (typeof ms !== "number" || !Number.isFinite(ms) || ms <= 0) return "";
      return new Date(ms).toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" });
    }
    function formatDateTime(ms) {
      if (typeof ms !== "number" || !Number.isFinite(ms) || ms <= 0) return "";
      const date = new Date(ms);
      const now = /* @__PURE__ */ new Date();
      const sameDay = date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
      if (sameDay) return formatClock(ms);
      return date.toLocaleString(void 0, { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
    }
    function formatDuration(ms, t) {
      const total = Math.max(0, Math.round(ms / 1e3));
      const hours = Math.floor(total / 3600);
      const minutes = Math.floor(total % 3600 / 60);
      const seconds = total % 60;
      if (hours > 0) {
        return minutes > 0 ? `${t("duration.hours", { count: hours })} ${t("duration.minutes", { count: minutes })}` : t("duration.hours", { count: hours });
      }
      if (minutes > 0) {
        return seconds > 0 ? `${t("duration.minutes", { count: minutes })} ${t("duration.seconds", { count: seconds })}` : t("duration.minutes", { count: minutes });
      }
      return t("duration.seconds", { count: seconds });
    }
    function messageOf(cause) {
      return cause instanceof Error ? cause.message : String(cause);
    }
    function statusKey(status) {
      const type = status?.type ?? "idle";
      return `state.${type}`;
    }
    function upsertThread(list, thread) {
      const index = list.findIndex((candidate) => candidate.id === thread.id);
      if (index === -1) return [thread, ...list];
      const next = [...list];
      next[index] = { ...next[index], ...thread };
      return next;
    }
    function applyDetailEvent(detail, event) {
      if (detail === null) return null;
      if (event.threadId !== void 0 && event.threadId !== detail.thread.id) return detail;
      switch (event.type) {
        case "turn/started": {
          const turn = event.payload?.turn;
          if (turn === null || turn === void 0) return detail;
          if (detail.turns.some((candidate) => candidate.id === turn.id)) return detail;
          return { ...detail, turns: [...detail.turns, { ...turn, items: [] }] };
        }
        case "turn/completed": {
          const turn = event.payload?.turn;
          if (turn === null || turn === void 0) return detail;
          return {
            ...detail,
            turns: detail.turns.map(
              (candidate) => candidate.id === turn.id ? { ...candidate, ...turn, items: candidate.items ?? [] } : candidate
            )
          };
        }
        case "item/upsert": {
          const item = event.payload?.item;
          if (item === null || item === void 0) return detail;
          return upsertItem(detail, event.turnId ?? "", item);
        }
        case "item/delta": {
          const delta = event.payload?.delta;
          if (event.itemId === void 0 || typeof delta !== "string" || delta === "") return detail;
          return patchItem(detail, event.itemId, (item) => {
            switch (event.channel) {
              case "agentMessage":
                return { ...item, text: `${item.text ?? ""}${delta}` };
              case "commandOutput":
                return { ...item, aggregatedOutput: `${item.aggregatedOutput ?? ""}${delta}` };
              case "reasoningSummary": {
                const summary = [...item.summary ?? []];
                const index = typeof event.summaryIndex === "number" ? event.summaryIndex : 0;
                summary[index] = `${summary[index] ?? ""}${delta}`;
                return { ...item, summary };
              }
              case "reasoningText":
                return { ...item, content: [...item.content ?? [], { type: "text", text: delta }] };
              case "plan":
                return { ...item, text: `${item.text ?? ""}${delta}` };
              default:
                return item;
            }
          });
        }
        case "item/patch": {
          if (event.itemId === void 0) return detail;
          return patchItem(detail, event.itemId, (item) => ({ ...item, changes: event.payload?.changes ?? item.changes }));
        }
        default:
          return detail;
      }
    }
    function upsertItem(detail, turnId, item) {
      const turns = [...detail.turns];
      let turnIndex = turns.findIndex((candidate) => candidate.id === turnId);
      if (turnIndex === -1) {
        turns.push({ id: turnId === "" ? item.id : turnId, items: [], status: "inProgress" });
        turnIndex = turns.length - 1;
      }
      const turn = turns[turnIndex];
      const items = [...turn.items ?? []];
      const itemIndex = items.findIndex((candidate) => candidate.id === item.id);
      if (itemIndex === -1) items.push(item);
      else items[itemIndex] = { ...items[itemIndex], ...item };
      turns[turnIndex] = { ...turn, items };
      return { ...detail, turns };
    }
    function patchItem(detail, itemId, update) {
      let touched = false;
      const turns = detail.turns.map((turn) => {
        let turnTouched = false;
        const items = (turn.items ?? []).map((item) => {
          if (item.id !== itemId) return item;
          turnTouched = true;
          return update(item);
        });
        if (!turnTouched) return turn;
        touched = true;
        return { ...turn, items };
      });
      return touched ? { ...detail, turns } : detail;
    }
    function itemText(item) {
      if (Array.isArray(item.content)) {
        const parts = item.content.filter((entry) => entry.type === "text" && typeof entry.text === "string").map((entry) => entry.text);
        if (parts.length > 0) return parts.join("\n");
      }
      return typeof item.text === "string" ? item.text : "";
    }

    // src/client/page/FocusSidebar.tsx
    var React6 = __toESM(require("react"), 1);

    // src/client/page/ThreadRow.tsx
    var React5 = __toESM(require("react"), 1);

    // src/client/page/ThreadRowMenu.tsx
    var React4 = __toESM(require("react"), 1);
    var MENU_WIDTH = 110;
    function ThreadRowMenu({ api, thread, onRenamed, onChanged, onDeleted }) {
      const t = useT();
      const triggerRef = React4.useRef(null);
      const [open, setOpen] = React4.useState(false);
      const [position, setPosition] = React4.useState(null);
      const [dialog, setDialog] = React4.useState(null);
      const [name, setName] = React4.useState(thread.name ?? "");
      const [busy, setBusy] = React4.useState(false);
      const [error, setError] = React4.useState(null);
      React4.useEffect(() => {
        if (!open) return void 0;
        const onScroll = (event) => {
          const target = event.target;
          if (target instanceof Element && target.closest(".dsh-codex-sidebar") !== null) setOpen(false);
        };
        const onResize = () => setOpen(false);
        const onKey = (event) => {
          if (event.key === "Escape") setOpen(false);
        };
        window.addEventListener("scroll", onScroll, true);
        window.addEventListener("resize", onResize);
        window.addEventListener("keydown", onKey);
        return () => {
          window.removeEventListener("scroll", onScroll, true);
          window.removeEventListener("resize", onResize);
          window.removeEventListener("keydown", onKey);
        };
      }, [open]);
      const openMenu = () => {
        const element = triggerRef.current;
        if (element === null) return;
        const rect = element.getBoundingClientRect();
        setPosition({ top: rect.bottom + 4, left: Math.max(8, rect.right - MENU_WIDTH) });
        setOpen(true);
      };
      const run = async (action) => {
        if (busy) return;
        setBusy(true);
        setError(null);
        try {
          await action();
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : String(cause));
        } finally {
          setBusy(false);
        }
      };
      const openRename = () => {
        setName(thread.name ?? "");
        setError(null);
        setDialog("rename");
      };
      const saveRename = () => run(async () => {
        const trimmed = name.trim();
        if (trimmed === "") {
          setError(t("actions.failed"));
          return;
        }
        await api("threads/rename", { threadId: thread.id, name: trimmed });
        onRenamed(trimmed);
        setDialog(null);
      });
      const archive = () => run(async () => {
        await api("threads/archive", { threadId: thread.id });
        onChanged();
      });
      const fork = () => run(async () => {
        await api("threads/fork", { threadId: thread.id });
        onChanged();
      });
      const exportMarkdown = () => run(async () => {
        const result = await api("threads/export", { threadId: thread.id });
        const blob = new Blob([result.content], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = result.filename;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 2e3);
      });
      const remove = () => run(async () => {
        await api("threads/delete", { threadId: thread.id });
        onDeleted();
        setDialog(null);
      });
      return /* @__PURE__ */ React4.createElement("span", { className: "dsh-codex-row-menu" }, /* @__PURE__ */ React4.createElement(
        "button",
        {
          ref: triggerRef,
          type: "button",
          className: "dsh-codex-row-menu-trigger",
          "aria-label": t("actions.menu"),
          title: t("actions.menu"),
          onClick: (event) => {
            event.stopPropagation();
            if (open) setOpen(false);
            else openMenu();
          }
        },
        /* @__PURE__ */ React4.createElement("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "currentColor", "aria-hidden": "true" }, /* @__PURE__ */ React4.createElement("circle", { cx: "3.2", cy: "8", r: "1.3" }), /* @__PURE__ */ React4.createElement("circle", { cx: "8", cy: "8", r: "1.3" }), /* @__PURE__ */ React4.createElement("circle", { cx: "12.8", cy: "8", r: "1.3" }))
      ), open && position !== null ? /* @__PURE__ */ React4.createElement(React4.Fragment, null, /* @__PURE__ */ React4.createElement("div", { className: "dsh-codex-row-menu-backdrop", onPointerDown: () => setOpen(false) }), /* @__PURE__ */ React4.createElement(
        "div",
        {
          className: "dsh-codex-row-menu-pop",
          role: "menu",
          style: { top: position.top, left: position.left },
          onClick: (event) => event.stopPropagation()
        },
        /* @__PURE__ */ React4.createElement("button", { type: "button", role: "menuitem", onClick: () => {
          setOpen(false);
          openRename();
        } }, t("actions.rename")),
        /* @__PURE__ */ React4.createElement("button", { type: "button", role: "menuitem", onClick: () => {
          setOpen(false);
          void archive();
        } }, t("actions.archive")),
        /* @__PURE__ */ React4.createElement("button", { type: "button", role: "menuitem", onClick: () => {
          setOpen(false);
          void fork();
        } }, t("actions.fork")),
        /* @__PURE__ */ React4.createElement("button", { type: "button", role: "menuitem", onClick: () => {
          setOpen(false);
          void exportMarkdown();
        } }, t("actions.export")),
        /* @__PURE__ */ React4.createElement(
          "button",
          {
            type: "button",
            role: "menuitem",
            className: "danger",
            onClick: () => {
              setOpen(false);
              setError(null);
              setDialog("delete");
            }
          },
          t("actions.delete")
        )
      )) : null, dialog === "rename" ? /* @__PURE__ */ React4.createElement(
        "div",
        {
          className: "dsh-codex-dialog-backdrop",
          onClick: (event) => event.stopPropagation(),
          onMouseDown: (event) => {
            if (event.target === event.currentTarget && !busy) setDialog(null);
          }
        },
        /* @__PURE__ */ React4.createElement("div", { className: "dsh-codex-dialog", role: "dialog", "aria-modal": "true" }, /* @__PURE__ */ React4.createElement("header", { className: "dsh-codex-dialog-head" }, t("actions.renameTitle")), /* @__PURE__ */ React4.createElement(
          "input",
          {
            className: "dsh-codex-search",
            autoFocus: true,
            value: name,
            onChange: (event) => setName(event.target.value),
            onKeyDown: (event) => {
              if (event.key === "Enter") void saveRename();
            }
          }
        ), error !== null ? /* @__PURE__ */ React4.createElement("div", { className: "dsh-codex-dialog-error" }, error) : null, /* @__PURE__ */ React4.createElement("div", { className: "dsh-codex-dialog-actions" }, /* @__PURE__ */ React4.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => setDialog(null) }, t("actions.cancel")), /* @__PURE__ */ React4.createElement("button", { type: "button", className: "dsh-codex-button primary", disabled: busy, onClick: () => void saveRename() }, t("actions.save"))))
      ) : null, dialog === "delete" ? /* @__PURE__ */ React4.createElement(
        "div",
        {
          className: "dsh-codex-dialog-backdrop",
          onClick: (event) => event.stopPropagation(),
          onMouseDown: (event) => {
            if (event.target === event.currentTarget && !busy) setDialog(null);
          }
        },
        /* @__PURE__ */ React4.createElement("div", { className: "dsh-codex-dialog", role: "dialog", "aria-modal": "true" }, /* @__PURE__ */ React4.createElement("header", { className: "dsh-codex-dialog-head" }, t("actions.deleteTitle")), /* @__PURE__ */ React4.createElement("div", { className: "dsh-codex-approval-meta" }, t("actions.deleteBody", { name: threadTitle(thread) })), error !== null ? /* @__PURE__ */ React4.createElement("div", { className: "dsh-codex-dialog-error" }, error) : null, /* @__PURE__ */ React4.createElement("div", { className: "dsh-codex-dialog-actions" }, /* @__PURE__ */ React4.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => setDialog(null) }, t("actions.cancel")), /* @__PURE__ */ React4.createElement("button", { type: "button", className: "dsh-codex-button danger", disabled: busy, onClick: () => void remove() }, t("actions.confirmDelete"))))
      ) : null);
    }

    // src/client/page/ThreadRow.tsx
    function ThreadRow({
      api,
      thread,
      selected,
      unread,
      showCwd,
      onSelect,
      onRenamed,
      onChanged,
      onDeleted
    }) {
      const t = useT();
      const status = thread.status?.type ?? "idle";
      const dotClass = status === "active" ? "ok pulse" : status === "systemError" ? "error" : unread ? "done" : "";
      const meta = [thread.model, relativeTime(thread.updatedAt, t)];
      if (showCwd && thread.cwd) meta.push(basename(thread.cwd));
      return /* @__PURE__ */ React5.createElement(
        "div",
        {
          role: "button",
          tabIndex: 0,
          className: `dsh-codex-thread ${selected ? "active" : ""}`,
          title: `${threadTitle(thread)}
    ${thread.cwd ?? ""}`,
          onClick: () => onSelect(thread.id),
          onKeyDown: (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelect(thread.id);
            }
          }
        },
        /* @__PURE__ */ React5.createElement("span", { className: `dsh-codex-dot ${dotClass}` }),
        /* @__PURE__ */ React5.createElement("span", { className: "dsh-codex-thread-main" }, /* @__PURE__ */ React5.createElement("span", { className: "dsh-codex-thread-name" }, threadTitle(thread)), /* @__PURE__ */ React5.createElement("span", { className: "dsh-codex-thread-meta" }, meta.filter(Boolean).join(" · "))),
        /* @__PURE__ */ React5.createElement(
          ThreadRowMenu,
          {
            api,
            thread,
            onRenamed: (name) => onRenamed(thread.id, name),
            onChanged,
            onDeleted: () => onDeleted(thread.id)
          }
        )
      );
    }

    // src/client/page/FocusSidebar.tsx
    function FocusSidebar({
      api,
      status,
      streamState,
      projects,
      totalThreads,
      runningCount,
      quota,
      quotaLoading,
      threads,
      threadsOwner,
      unread,
      viewedAt,
      selectedCwd,
      selectedId,
      loading,
      hasMore,
      search,
      onSearch,
      onSelectProject,
      onSelectThread,
      onLoadMore,
      onNew,
      onNewProject,
      onVersions,
      onRefresh,
      onExit,
      onThreadRenamed,
      onThreadChanged,
      onThreadDeleted
    }) {
      const t = useT();
      const phase = status?.phase ?? "connecting";
      const phaseClass = phase === "ready" ? "ok" : phase === "error" ? "error" : phase === "connecting" ? "warn" : "";
      const streamClass = streamState === "open" ? "ok" : streamState === "closed" ? "error" : "warn";
      const quotaInfo = quota === null && quotaLoading ? { text: t("quota.loading") } : quotaSummary(quota, t);
      const envParts = [status?.kind ? t(`status.${status.kind}`) : "", status?.codexVersion ? t("status.version", { version: status.codexVersion }) : ""].filter((part) => part !== "").join(" · ");
      const isUnread = (thread) => {
        if (thread.status?.type === "active") return false;
        if (unread.has(thread.id)) return true;
        const seen = viewedAt[thread.id];
        return typeof seen === "number" && typeof thread.updatedAt === "number" && thread.updatedAt > seen;
      };
      const query = search.trim().toLowerCase();
      const searchText = search.trim();
      const searching = query !== "";
      const ownerMatchesTree = threadsOwner !== null && threadsOwner.search === "" && threadsOwner.cwd === selectedCwd;
      const ownerMatchesSearch = threadsOwner !== null && threadsOwner.search === searchText;
      const treeThreads = ownerMatchesTree ? threads : [];
      const searchThreads = ownerMatchesSearch ? threads : [];
      const treePending = loading || !ownerMatchesTree;
      const searchPending = loading || !ownerMatchesSearch;
      const matchingProjects = searching ? projects.filter((project) => `${project.name} ${project.cwd}`.toLowerCase().includes(query)) : projects;
      return /* @__PURE__ */ React6.createElement("aside", { className: "dsh-codex-focus-sidebar" }, /* @__PURE__ */ React6.createElement("div", { className: "dsh-codex-focus-brand" }, /* @__PURE__ */ React6.createElement("span", { className: "dsh-codex-focus-logo" }, /* @__PURE__ */ React6.createElement(CodexIcon, { size: 20 })), /* @__PURE__ */ React6.createElement("span", { className: "dsh-codex-focus-brand-text" }, /* @__PURE__ */ React6.createElement("strong", null, "Codex CLI"), /* @__PURE__ */ React6.createElement("small", null, t("app.subtitle")))), /* @__PURE__ */ React6.createElement("div", { className: "dsh-codex-focus-status" }, /* @__PURE__ */ React6.createElement("span", { className: "dsh-codex-status-pill" }, /* @__PURE__ */ React6.createElement("i", { className: `dsh-codex-dot ${phaseClass} ${phase === "connecting" ? "pulse" : ""}` }), t(`status.${phase}`)), /* @__PURE__ */ React6.createElement("span", { className: "dsh-codex-status-pill" }, /* @__PURE__ */ React6.createElement("i", { className: `dsh-codex-dot ${streamClass} ${streamState === "connecting" ? "pulse" : ""}` }), t(`status.events.${streamState}`))), /* @__PURE__ */ React6.createElement("dl", { className: "dsh-codex-focus-info" }, /* @__PURE__ */ React6.createElement("dt", null, t("info.env")), /* @__PURE__ */ React6.createElement("dd", null, envParts === "" ? "—" : envParts), /* @__PURE__ */ React6.createElement("dt", null, t("info.sessions")), /* @__PURE__ */ React6.createElement("dd", null, t("projects.count", { count: totalThreads }), runningCount > 0 ? ` · ${t("projects.active", { count: runningCount })}` : ""), /* @__PURE__ */ React6.createElement("dt", null, t("info.quota")), /* @__PURE__ */ React6.createElement("dd", { className: "dsh-codex-quota", title: quotaInfo.title }, quotaInfo.text)), /* @__PURE__ */ React6.createElement("div", { className: "dsh-codex-focus-actions" }, /* @__PURE__ */ React6.createElement("button", { type: "button", className: "dsh-codex-button primary", onClick: onNew }, t("newThread.open")), /* @__PURE__ */ React6.createElement("button", { type: "button", className: "dsh-codex-button", onClick: onVersions }, t("versions.open")), /* @__PURE__ */ React6.createElement("button", { type: "button", className: "dsh-codex-button", onClick: onRefresh }, t("status.refresh"))), /* @__PURE__ */ React6.createElement("div", { className: "dsh-codex-focus-search-row" }, /* @__PURE__ */ React6.createElement(
        "input",
        {
          className: "dsh-codex-search focus",
          type: "search",
          value: search,
          placeholder: t("focus.search"),
          onChange: (event) => onSearch(event.target.value)
        }
      ), /* @__PURE__ */ React6.createElement(
        "button",
        {
          type: "button",
          className: "dsh-codex-icon-button focus-new-project",
          title: t("focus.newProject"),
          "aria-label": t("focus.newProject"),
          onClick: onNewProject
        },
        /* @__PURE__ */ React6.createElement(FolderPlusGlyph, null)
      )), /* @__PURE__ */ React6.createElement("div", { className: "dsh-codex-focus-tree" }, searching ? /* @__PURE__ */ React6.createElement(React6.Fragment, null, /* @__PURE__ */ React6.createElement("div", { className: "dsh-codex-focus-section" }, t("projects.title")), matchingProjects.length === 0 ? /* @__PURE__ */ React6.createElement("div", { className: "dsh-codex-loading" }, t("projects.noMatch")) : matchingProjects.map((project) => /* @__PURE__ */ React6.createElement(
        "button",
        {
          type: "button",
          key: project.cwd,
          className: "dsh-codex-tree-project",
          onClick: () => onSelectProject(project.cwd)
        },
        /* @__PURE__ */ React6.createElement(FolderGlyph, null),
        /* @__PURE__ */ React6.createElement("span", { className: "dsh-codex-tree-project-name" }, project.name === "" ? project.cwd : project.name),
        /* @__PURE__ */ React6.createElement("span", { className: "dsh-codex-tree-project-count" }, project.threadCount)
      )), /* @__PURE__ */ React6.createElement("div", { className: "dsh-codex-focus-section" }, t("threads.title")), searchThreads.length === 0 && !searchPending ? /* @__PURE__ */ React6.createElement("div", { className: "dsh-codex-loading" }, t("threads.noMatch")) : searchThreads.map((thread) => /* @__PURE__ */ React6.createElement(
        ThreadRow,
        {
          key: thread.id,
          api,
          thread,
          selected: selectedId === thread.id,
          unread: isUnread(thread),
          showCwd: true,
          onSelect: onSelectThread,
          onRenamed: onThreadRenamed,
          onChanged: onThreadChanged,
          onDeleted: onThreadDeleted
        }
      )), searchPending ? /* @__PURE__ */ React6.createElement("div", { className: "dsh-codex-loading" }, t("threads.loading")) : null, ownerMatchesSearch && hasMore ? /* @__PURE__ */ React6.createElement("button", { type: "button", className: "dsh-codex-load-more", disabled: loading, onClick: onLoadMore }, t("threads.loadMore")) : null) : /* @__PURE__ */ React6.createElement(React6.Fragment, null, matchingProjects.map((project) => {
        const expanded = selectedCwd === project.cwd;
        return /* @__PURE__ */ React6.createElement(React6.Fragment, { key: project.cwd }, /* @__PURE__ */ React6.createElement(
          "button",
          {
            type: "button",
            className: `dsh-codex-tree-project ${expanded ? "expanded" : ""}`,
            "aria-expanded": expanded,
            onClick: () => onSelectProject(project.cwd)
          },
          /* @__PURE__ */ React6.createElement(FolderGlyph, { open: expanded }),
          /* @__PURE__ */ React6.createElement("span", { className: "dsh-codex-tree-project-name" }, project.name === "" ? project.cwd : project.name),
          /* @__PURE__ */ React6.createElement("span", { className: "dsh-codex-tree-project-count" }, project.threadCount)
        ), expanded ? /* @__PURE__ */ React6.createElement("div", { className: "dsh-codex-tree-sessions" }, treeThreads.map((thread) => /* @__PURE__ */ React6.createElement(
          ThreadRow,
          {
            key: thread.id,
            api,
            thread,
            selected: selectedId === thread.id,
            unread: isUnread(thread),
            showCwd: false,
            onSelect: onSelectThread,
            onRenamed: onThreadRenamed,
            onChanged: onThreadChanged,
            onDeleted: onThreadDeleted
          }
        )), treeThreads.length === 0 && !treePending ? /* @__PURE__ */ React6.createElement("div", { className: "dsh-codex-loading" }, t("threads.empty")) : null, treePending ? /* @__PURE__ */ React6.createElement("div", { className: "dsh-codex-loading" }, t("threads.loading")) : null, ownerMatchesTree && hasMore ? /* @__PURE__ */ React6.createElement("button", { type: "button", className: "dsh-codex-load-more", disabled: loading, onClick: onLoadMore }, t("threads.loadMore")) : null) : null);
      }), matchingProjects.length === 0 ? /* @__PURE__ */ React6.createElement("div", { className: "dsh-codex-loading" }, t("projects.noMatch")) : null)), /* @__PURE__ */ React6.createElement("div", { className: "dsh-codex-focus-footer" }, /* @__PURE__ */ React6.createElement("button", { type: "button", className: "dsh-codex-exit", onClick: onExit }, /* @__PURE__ */ React6.createElement("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.2", "aria-hidden": "true" }, /* @__PURE__ */ React6.createElement("path", { d: "M9.5 4 5.5 8l4 4", strokeLinecap: "round", strokeLinejoin: "round" })), "DeepSeek Harness")));
    }
    function FolderPlusGlyph() {
      return /* @__PURE__ */ React6.createElement("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ React6.createElement(
        "path",
        {
          d: "M1.9 4.3c0-.66.54-1.2 1.2-1.2h2.9l1.5 1.7h5.4c.66 0 1.2.54 1.2 1.2v6.3c0 .66-.54 1.2-1.2 1.2H3.1c-.66 0-1.2-.54-1.2-1.2V4.3Z",
          stroke: "currentColor",
          strokeWidth: "1",
          strokeLinejoin: "round"
        }
      ), /* @__PURE__ */ React6.createElement("path", { d: "M8 6.6v4.2M5.9 8.7h4.2", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" }));
    }
    function FolderGlyph({ open = false }) {
      return /* @__PURE__ */ React6.createElement("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ React6.createElement(
        "path",
        {
          d: "M1.9 4.3c0-.66.54-1.2 1.2-1.2h2.9l1.5 1.7h5.4c.66 0 1.2.54 1.2 1.2v6.3c0 .66-.54 1.2-1.2 1.2H3.1c-.66 0-1.2-.54-1.2-1.2V4.3Z",
          fill: "currentColor",
          opacity: open ? 0.22 : 0.14
        }
      ), /* @__PURE__ */ React6.createElement(
        "path",
        {
          d: "M1.9 4.3c0-.66.54-1.2 1.2-1.2h2.9l1.5 1.7h5.4c.66 0 1.2.54 1.2 1.2v6.3c0 .66-.54 1.2-1.2 1.2H3.1c-.66 0-1.2-.54-1.2-1.2V4.3Z",
          stroke: "currentColor",
          strokeWidth: "1",
          strokeLinejoin: "round"
        }
      ), open ? /* @__PURE__ */ React6.createElement("path", { d: "M2.2 7.1h11.6", stroke: "currentColor", strokeWidth: "1" }) : null);
    }
    function quotaSummary(quota, t) {
      if (quota === null) return { text: t("quota.unknown") };
      if (quota.credits?.unlimited === true) return { text: t("quota.unlimited") };
      const parts = [];
      const windows = [];
      if (quota.primary !== null) windows.push(quota.primary);
      if (quota.secondary !== null) windows.push(quota.secondary);
      for (const window2 of windows) {
        const percent = Math.max(0, Math.min(100, 100 - Math.round(window2.usedPercent)));
        const label = windowLabel(window2.windowDurationMins, t);
        parts.push(label === "" ? t("quota.remaining", { percent }) : `${label} ${t("quota.remaining", { percent })}`);
      }
      if (parts.length === 0 && quota.credits?.balance) parts.push(quota.credits.balance);
      if (quota.resetCredits > 0) parts.push(t("quota.resetCredits", { count: quota.resetCredits }));
      const resetsAt = quota.primary?.resetsAt;
      const title = typeof resetsAt === "number" ? t("quota.resetsAt", { time: formatDateTime(resetsAt * 1e3) }) : void 0;
      return { text: parts.length > 0 ? parts.join(" · ") : t("quota.unknown"), title };
    }
    function windowLabel(minutes, t) {
      if (typeof minutes !== "number" || minutes <= 0) return "";
      if (minutes >= 10080) return t("quota.window.weekly");
      if (minutes >= 1440) return t("quota.window.daily");
      if (minutes >= 300) return t("quota.window.5h");
      if (minutes >= 60) return t("quota.window.1h");
      return t("quota.window.minutes", { count: Math.round(minutes) });
    }

    // src/client/page/ProjectPickerDialog.tsx
    var React7 = __toESM(require("react"), 1);
    function ProjectPickerDialog({ open, projects, onPick, onNewProject, onClose }) {
      const t = useT();
      const [busy, setBusy] = React7.useState(false);
      const [error, setError] = React7.useState(null);
      React7.useEffect(() => {
        if (!open) return;
        setBusy(false);
        setError(null);
      }, [open]);
      if (!open) return null;
      const pick = async (cwd) => {
        if (busy) return;
        setBusy(true);
        setError(null);
        try {
          await onPick(cwd);
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : String(cause));
        } finally {
          setBusy(false);
        }
      };
      return /* @__PURE__ */ React7.createElement(
        "div",
        {
          className: "dsh-codex-dialog-backdrop",
          onMouseDown: (event) => {
            if (event.target === event.currentTarget && !busy) onClose();
          }
        },
        /* @__PURE__ */ React7.createElement("div", { className: "dsh-codex-dialog dsh-codex-picker", role: "dialog", "aria-modal": "true" }, /* @__PURE__ */ React7.createElement("header", { className: "dsh-codex-dialog-head" }, t("picker.title")), /* @__PURE__ */ React7.createElement("div", { className: "dsh-codex-picker-section" }, t("picker.existing")), /* @__PURE__ */ React7.createElement("div", { className: "dsh-codex-picker-list" }, projects.map((project) => /* @__PURE__ */ React7.createElement(
          "button",
          {
            type: "button",
            key: project.cwd,
            className: "dsh-codex-picker-item",
            disabled: busy,
            onClick: () => void pick(project.cwd)
          },
          /* @__PURE__ */ React7.createElement("span", { className: "dsh-codex-picker-name" }, project.name === "" ? project.cwd : project.name),
          /* @__PURE__ */ React7.createElement("span", { className: "dsh-codex-picker-path" }, project.cwd)
        )), projects.length === 0 ? /* @__PURE__ */ React7.createElement("div", { className: "dsh-codex-loading" }, t("projects.empty")) : null), /* @__PURE__ */ React7.createElement("div", { className: "dsh-codex-hint" }, t("picker.newHint")), error !== null ? /* @__PURE__ */ React7.createElement("div", { className: "dsh-codex-dialog-error" }, error) : null, /* @__PURE__ */ React7.createElement("div", { className: "dsh-codex-dialog-actions" }, /* @__PURE__ */ React7.createElement("button", { type: "button", className: "dsh-codex-button picker-new", disabled: busy, onClick: onNewProject }, /* @__PURE__ */ React7.createElement(PlusGlyph, null), t("picker.newProjectAction")), /* @__PURE__ */ React7.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: onClose }, t("actions.cancel"))))
      );
    }
    function PlusGlyph() {
      return /* @__PURE__ */ React7.createElement("svg", { width: "12", height: "12", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.4", "aria-hidden": "true" }, /* @__PURE__ */ React7.createElement("path", { d: "M8 3.5v9M3.5 8h9", strokeLinecap: "round" }));
    }

    // src/client/page/DirectoryPickerDialog.tsx
    var React8 = __toESM(require("react"), 1);
    function messageOf2(cause) {
      return cause instanceof Error ? cause.message : String(cause);
    }
    function dirsOf(listing, showHidden) {
      return (listing?.entries ?? []).filter(
        (entry) => entry.type === "dir" && (showHidden || entry.hidden !== true)
      );
    }
    function DirectoryPickerDialog({ open, api, onPick, onClose }) {
      const t = useT();
      const [listing, setListing] = React8.useState(null);
      const [child, setChild] = React8.useState(null);
      const [selected, setSelected] = React8.useState(null);
      const [loading, setLoading] = React8.useState(false);
      const [childLoading, setChildLoading] = React8.useState(false);
      const [error, setError] = React8.useState(null);
      const [childError, setChildError] = React8.useState(null);
      const [showHidden, setShowHidden] = React8.useState(false);
      const [pathDraft, setPathDraft] = React8.useState(null);
      const [createOpen, setCreateOpen] = React8.useState(false);
      const [createName, setCreateName] = React8.useState("");
      const [createError, setCreateError] = React8.useState(null);
      const [creating, setCreating] = React8.useState(false);
      const [busy, setBusy] = React8.useState(false);
      const requestRef = React8.useRef(0);
      const childRequestRef = React8.useRef(0);
      const firstColumnRef = React8.useRef(null);
      const childColumnRef = React8.useRef(null);
      const dialogRef = React8.useRef(null);
      const load = React8.useCallback(
        async (target) => {
          const request = ++requestRef.current;
          setLoading(true);
          setError(null);
          try {
            const result = await api("fs/list", target === void 0 ? {} : { path: target });
            if (request !== requestRef.current) return false;
            setListing(result);
            setSelected(null);
            setChild(null);
            setChildError(null);
            setPathDraft(null);
            setCreateOpen(false);
            setCreateError(null);
            return true;
          } catch (cause) {
            if (request !== requestRef.current) return false;
            setError(messageOf2(cause));
            return false;
          } finally {
            if (request === requestRef.current) setLoading(false);
          }
        },
        [api]
      );
      React8.useEffect(() => {
        if (!open) return;
        setListing(null);
        setChild(null);
        setSelected(null);
        setShowHidden(false);
        setPathDraft(null);
        setCreateOpen(false);
        setCreateName("");
        setCreateError(null);
        setBusy(false);
        void load();
      }, [open]);
      React8.useEffect(() => {
        if (open) dialogRef.current?.focus();
      }, [open]);
      React8.useEffect(() => {
        if (!open) return;
        const onKey = (event) => {
          if (event.key !== "Escape") return;
          if (pathDraft !== null) {
            setPathDraft(null);
            return;
          }
          if (createOpen) {
            if (!creating) setCreateOpen(false);
            return;
          }
          if (!busy) onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
      }, [open, pathDraft, createOpen, creating, busy, onClose]);
      React8.useEffect(() => {
        if (firstColumnRef.current !== null) firstColumnRef.current.scrollTop = 0;
      }, [listing?.path]);
      React8.useEffect(() => {
        if (childColumnRef.current !== null) childColumnRef.current.scrollTop = 0;
      }, [child?.path]);
      const select = React8.useCallback(
        async (entry) => {
          setSelected(entry);
          setCreateOpen(false);
          setCreateError(null);
          const request = ++childRequestRef.current;
          setChild(null);
          setChildError(null);
          setChildLoading(true);
          try {
            const result = await api("fs/list", { path: entry.path });
            if (request !== childRequestRef.current) return;
            setChild(result);
          } catch (cause) {
            if (request !== childRequestRef.current) return;
            setChildError(messageOf2(cause));
          } finally {
            if (request === childRequestRef.current) setChildLoading(false);
          }
        },
        [api]
      );
      if (!open) return null;
      const enter = (path) => {
        if (busy) return;
        void load(path);
      };
      const onRowClick = (entry) => {
        if (busy) return;
        if (selected?.path === entry.path) {
          enter(entry.path);
          return;
        }
        void select(entry);
      };
      const targetPath = selected?.path ?? listing?.path ?? null;
      const currentName = listing === null ? "" : listing.path === listing.home ? t("browse.home") : listing.crumbs.at(-1)?.name ?? listing.path;
      const targetName = selected?.name ?? currentName;
      const hiddenDirs = (listing?.entries ?? []).filter((entry) => entry.type === "dir" && entry.hidden === true).length;
      const visibleDirs = dirsOf(listing, showHidden);
      const childDirs = dirsOf(child, showHidden);
      const childHiddenDirs = (child?.entries ?? []).filter((entry) => entry.type === "dir" && entry.hidden === true).length;
      const startCreate = () => {
        if (targetPath === null || loading || busy) return;
        setCreateOpen(true);
        setCreateName("");
        setCreateError(null);
      };
      const confirmCreate = async () => {
        if (targetPath === null || creating || busy) return;
        const name = createName.trim();
        if (name === "") return;
        setCreating(true);
        setCreateError(null);
        try {
          const created = await api("fs/mkdir", { path: targetPath, name });
          setCreateOpen(false);
          setCreateName("");
          const ok = await load(targetPath);
          if (ok) {
            await select({ name: created.name, path: created.path, type: "dir", hidden: created.name.startsWith(".") });
          }
        } catch (cause) {
          setCreateError(messageOf2(cause));
        } finally {
          setCreating(false);
        }
      };
      const confirmPick = async () => {
        if (targetPath === null || busy) return;
        setBusy(true);
        setError(null);
        try {
          await onPick(targetPath);
        } catch (cause) {
          setError(messageOf2(cause));
        } finally {
          setBusy(false);
        }
      };
      const close = () => {
        if (busy) return;
        onClose();
      };
      return /* @__PURE__ */ React8.createElement(
        "div",
        {
          className: "dsh-codex-dialog-backdrop",
          onMouseDown: (event) => {
            if (event.target === event.currentTarget) close();
          }
        },
        /* @__PURE__ */ React8.createElement(
          "div",
          {
            className: "dsh-codex-dialog dsh-codex-browse",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": t("browse.title"),
            tabIndex: -1,
            ref: dialogRef
          },
          /* @__PURE__ */ React8.createElement("header", { className: "dsh-codex-browse-head" }, /* @__PURE__ */ React8.createElement("div", { className: "dsh-codex-browse-title" }, t("browse.title")), pathDraft === null ? /* @__PURE__ */ React8.createElement(React8.Fragment, null, /* @__PURE__ */ React8.createElement("div", { className: "dsh-codex-browse-crumbs", role: "navigation" }, (listing?.crumbs ?? []).map((crumb, index, all) => /* @__PURE__ */ React8.createElement(React8.Fragment, { key: crumb.path }, index > 0 ? /* @__PURE__ */ React8.createElement("span", { className: "dsh-codex-browse-chevron" }, "›") : null, /* @__PURE__ */ React8.createElement(
            "button",
            {
              type: "button",
              className: `dsh-codex-browse-crumb ${index === all.length - 1 ? "current" : ""}`,
              disabled: loading || busy || index === all.length - 1,
              onClick: () => enter(crumb.path)
            },
            index === 0 && crumb.name === "/" ? "/" : crumb.name
          )))), /* @__PURE__ */ React8.createElement(
            "button",
            {
              type: "button",
              className: "dsh-codex-icon-button",
              title: t("browse.editPath"),
              "aria-label": t("browse.editPath"),
              disabled: listing === null || loading || busy,
              onClick: () => setPathDraft(listing === null ? "" : `${listing.path}/`)
            },
            /* @__PURE__ */ React8.createElement(PencilGlyph, null)
          ), /* @__PURE__ */ React8.createElement(
            "button",
            {
              type: "button",
              className: "dsh-codex-icon-button",
              title: t("browse.up"),
              "aria-label": t("browse.up"),
              disabled: listing?.parent === null || listing === null || loading || busy,
              onClick: () => {
                if (listing?.parent !== null && listing !== null) enter(listing.parent);
              }
            },
            /* @__PURE__ */ React8.createElement(UpGlyph, null)
          )) : /* @__PURE__ */ React8.createElement(
            "input",
            {
              className: "dsh-codex-search compact dsh-codex-browse-path",
              value: pathDraft,
              autoFocus: true,
              "aria-label": t("browse.editPath"),
              onChange: (event) => setPathDraft(event.target.value),
              onKeyDown: (event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  const next = pathDraft.trim();
                  if (next !== "") void load(next);
                }
              }
            }
          )),
          /* @__PURE__ */ React8.createElement("div", { className: "dsh-codex-browse-body" }, /* @__PURE__ */ React8.createElement("div", { className: "dsh-codex-browse-col", ref: firstColumnRef }, visibleDirs.map((entry) => /* @__PURE__ */ React8.createElement(
            "div",
            {
              key: entry.path,
              className: `dsh-codex-browse-row-wrap ${selected?.path === entry.path ? "selected" : ""}`,
              ref: (node) => {
                if (node !== null && selected?.path === entry.path) node.scrollIntoView({ block: "nearest" });
              }
            },
            /* @__PURE__ */ React8.createElement(
              "button",
              {
                type: "button",
                className: "dsh-codex-browse-row",
                title: entry.path,
                disabled: busy,
                onClick: () => onRowClick(entry),
                onDoubleClick: () => enter(entry.path)
              },
              /* @__PURE__ */ React8.createElement(FolderGlyph2, null),
              /* @__PURE__ */ React8.createElement("span", { className: "dsh-codex-browse-row-name" }, entry.name)
            ),
            /* @__PURE__ */ React8.createElement(
              "button",
              {
                type: "button",
                className: "dsh-codex-browse-enter",
                title: t("browse.enter"),
                "aria-label": `${t("browse.enter")} ${entry.name}`,
                disabled: busy,
                onClick: () => enter(entry.path)
              },
              /* @__PURE__ */ React8.createElement(ChevronGlyph, null)
            )
          )), loading ? /* @__PURE__ */ React8.createElement("div", { className: "dsh-codex-browse-empty" }, t("browse.loading")) : null, !loading && visibleDirs.length === 0 ? /* @__PURE__ */ React8.createElement("div", { className: "dsh-codex-browse-empty" }, hiddenDirs > 0 && !showHidden ? t("browse.hiddenOnly", { count: hiddenDirs }) : t("browse.empty")) : null), selected !== null ? /* @__PURE__ */ React8.createElement("div", { className: "dsh-codex-browse-col", ref: childColumnRef }, /* @__PURE__ */ React8.createElement("div", { className: "dsh-codex-browse-col-head", title: selected.path }, selected.name), childDirs.map((entry) => /* @__PURE__ */ React8.createElement(
            "button",
            {
              type: "button",
              key: entry.path,
              className: "dsh-codex-browse-row",
              title: entry.path,
              disabled: busy,
              onClick: () => enter(entry.path)
            },
            /* @__PURE__ */ React8.createElement(FolderGlyph2, null),
            /* @__PURE__ */ React8.createElement("span", { className: "dsh-codex-browse-row-name" }, entry.name)
          )), childLoading ? /* @__PURE__ */ React8.createElement("div", { className: "dsh-codex-browse-empty" }, t("browse.loading")) : null, childError !== null ? /* @__PURE__ */ React8.createElement("div", { className: "dsh-codex-dialog-error" }, childError) : null, !childLoading && childError === null && childDirs.length === 0 ? /* @__PURE__ */ React8.createElement("div", { className: "dsh-codex-browse-empty" }, childHiddenDirs > 0 && !showHidden ? t("browse.hiddenOnly", { count: childHiddenDirs }) : t("browse.empty")) : null) : null),
          listing?.truncated === true || child?.truncated === true ? /* @__PURE__ */ React8.createElement("div", { className: "dsh-codex-browse-note" }, t("browse.truncated")) : null,
          createOpen ? /* @__PURE__ */ React8.createElement("div", { className: "dsh-codex-browse-create" }, /* @__PURE__ */ React8.createElement("div", { className: "dsh-codex-browse-create-label" }, t("browse.createIn", { name: targetName })), /* @__PURE__ */ React8.createElement("div", { className: "dsh-codex-browse-create-row" }, /* @__PURE__ */ React8.createElement(
            "input",
            {
              className: "dsh-codex-search compact",
              value: createName,
              autoFocus: true,
              "aria-label": t("browse.folderName"),
              placeholder: t("browse.untitledFolder"),
              disabled: creating,
              onChange: (event) => setCreateName(event.target.value),
              onKeyDown: (event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void confirmCreate();
                }
              }
            }
          ), /* @__PURE__ */ React8.createElement(
            "button",
            {
              type: "button",
              className: "dsh-codex-button primary",
              disabled: creating || createName.trim() === "",
              onClick: () => void confirmCreate()
            },
            creating ? t("browse.creating") : t("browse.create")
          ), /* @__PURE__ */ React8.createElement(
            "button",
            {
              type: "button",
              className: "dsh-codex-button",
              disabled: creating,
              onClick: () => setCreateOpen(false)
            },
            t("browse.cancel")
          )), createError !== null ? /* @__PURE__ */ React8.createElement("div", { className: "dsh-codex-dialog-error" }, createError) : null) : null,
          /* @__PURE__ */ React8.createElement("footer", { className: "dsh-codex-browse-foot" }, /* @__PURE__ */ React8.createElement("div", { className: "dsh-codex-browse-target", title: targetPath ?? "" }, /* @__PURE__ */ React8.createElement("span", null, t("browse.target")), /* @__PURE__ */ React8.createElement("code", null, targetPath ?? "—")), /* @__PURE__ */ React8.createElement("div", { className: "dsh-codex-browse-actions" }, /* @__PURE__ */ React8.createElement(
            "button",
            {
              type: "button",
              className: "dsh-codex-button",
              disabled: targetPath === null || loading || busy || creating,
              onClick: startCreate
            },
            /* @__PURE__ */ React8.createElement(PlusGlyph2, null),
            t("browse.newFolder")
          ), /* @__PURE__ */ React8.createElement(
            "button",
            {
              type: "button",
              className: `dsh-codex-browse-toggle ${showHidden ? "active" : ""}`,
              "aria-pressed": showHidden,
              disabled: busy,
              onClick: () => setShowHidden((previous) => !previous)
            },
            t("browse.showHidden")
          ), /* @__PURE__ */ React8.createElement("span", { className: "dsh-codex-browse-spacer" }), /* @__PURE__ */ React8.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: close }, t("browse.cancel")), /* @__PURE__ */ React8.createElement(
            "button",
            {
              type: "button",
              className: "dsh-codex-button primary",
              disabled: targetPath === null || loading || busy || creating,
              onClick: () => void confirmPick()
            },
            busy ? t("browse.creating") : t("browse.open")
          ))),
          error !== null ? /* @__PURE__ */ React8.createElement("div", { className: "dsh-codex-browse-error" }, error) : null
        )
      );
    }
    function FolderGlyph2() {
      return /* @__PURE__ */ React8.createElement("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", className: "dsh-codex-browse-glyph" }, /* @__PURE__ */ React8.createElement(
        "path",
        {
          d: "M1.9 4.3c0-.66.54-1.2 1.2-1.2h2.9l1.5 1.7h5.4c.66 0 1.2.54 1.2 1.2v6.3c0 .66-.54 1.2-1.2 1.2H3.1c-.66 0-1.2-.54-1.2-1.2V4.3Z",
          fill: "currentColor",
          opacity: "0.14"
        }
      ), /* @__PURE__ */ React8.createElement(
        "path",
        {
          d: "M1.9 4.3c0-.66.54-1.2 1.2-1.2h2.9l1.5 1.7h5.4c.66 0 1.2.54 1.2 1.2v6.3c0 .66-.54 1.2-1.2 1.2H3.1c-.66 0-1.2-.54-1.2-1.2V4.3Z",
          stroke: "currentColor",
          strokeWidth: "1",
          strokeLinejoin: "round"
        }
      ));
    }
    function PlusGlyph2() {
      return /* @__PURE__ */ React8.createElement("svg", { width: "12", height: "12", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.4", "aria-hidden": "true" }, /* @__PURE__ */ React8.createElement("path", { d: "M8 3.5v9M3.5 8h9", strokeLinecap: "round" }));
    }
    function ChevronGlyph() {
      return /* @__PURE__ */ React8.createElement("svg", { width: "12", height: "12", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.4", "aria-hidden": "true" }, /* @__PURE__ */ React8.createElement("path", { d: "m6 4 4 4-4 4", strokeLinecap: "round", strokeLinejoin: "round" }));
    }
    function PencilGlyph() {
      return /* @__PURE__ */ React8.createElement("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.2", "aria-hidden": "true" }, /* @__PURE__ */ React8.createElement("path", { d: "M2.8 13.2 3.4 10l7-7 2.6 2.6-7 7-3.2.6Z", strokeLinejoin: "round" }), /* @__PURE__ */ React8.createElement("path", { d: "m9.6 3.8 2.6 2.6", strokeLinecap: "round" }));
    }
    function UpGlyph() {
      return /* @__PURE__ */ React8.createElement("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.3", "aria-hidden": "true" }, /* @__PURE__ */ React8.createElement("path", { d: "M8 12V4M4 8l4-4 4 4", strokeLinecap: "round", strokeLinejoin: "round" }));
    }

    // src/client/page/RightPanel.tsx
    var React9 = __toESM(require("react"), 1);
    function RightPanel({ api, cwd, open, tab, onTabChange, onClose }) {
      const t = useT();
      if (!open) return null;
      return /* @__PURE__ */ React9.createElement("aside", { className: "dsh-codex-right" }, /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-right-head" }, /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-right-tabs" }, ["files", "git", "terminal"].map((value) => /* @__PURE__ */ React9.createElement(
        "button",
        {
          key: value,
          type: "button",
          className: `dsh-codex-right-tab ${tab === value ? "active" : ""}`,
          onClick: () => onTabChange(value)
        },
        t(`right.${value}`)
      ))), /* @__PURE__ */ React9.createElement("button", { type: "button", className: "dsh-codex-right-close", "aria-label": t("right.close"), onClick: onClose }, /* @__PURE__ */ React9.createElement("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.3", "aria-hidden": "true" }, /* @__PURE__ */ React9.createElement("path", { d: "M4 4l8 8M12 4l-8 8", strokeLinecap: "round" })))), cwd === "" ? /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-loading" }, t("right.noCwd")) : tab === "files" ? /* @__PURE__ */ React9.createElement(FilesTab, { api, cwd }) : tab === "git" ? /* @__PURE__ */ React9.createElement(GitTab, { api, cwd }) : /* @__PURE__ */ React9.createElement(TerminalTab, { api, cwd }));
    }
    function FilesTab({ api, cwd }) {
      const t = useT();
      const [path, setPath] = React9.useState(cwd);
      const [entries, setEntries] = React9.useState([]);
      const [preview, setPreview] = React9.useState(null);
      const [loading, setLoading] = React9.useState(false);
      const [error, setError] = React9.useState(null);
      const load = async (target) => {
        setLoading(true);
        setError(null);
        try {
          const result = await api("fs/list", { path: target });
          setPath(result.path);
          setEntries(result.entries);
          setPreview(null);
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : String(cause));
        } finally {
          setLoading(false);
        }
      };
      React9.useEffect(() => {
        void load(cwd);
      }, [cwd]);
      const openFile = async (entry) => {
        setLoading(true);
        setError(null);
        try {
          setPreview(await api("fs/read", { path: entry.path }));
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : String(cause));
        } finally {
          setLoading(false);
        }
      };
      const up = path.replace(/\/[^/]+\/?$/, "") || "/";
      return /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-right-body" }, /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-right-bar" }, /* @__PURE__ */ React9.createElement("button", { type: "button", className: "dsh-codex-icon-button", title: t("right.up"), onClick: () => void load(up) }, /* @__PURE__ */ React9.createElement("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.3", "aria-hidden": "true" }, /* @__PURE__ */ React9.createElement("path", { d: "M8 12V4M4 8l4-4 4 4", strokeLinecap: "round", strokeLinejoin: "round" }))), /* @__PURE__ */ React9.createElement("code", { className: "dsh-codex-right-path", title: path }, path), /* @__PURE__ */ React9.createElement("button", { type: "button", className: "dsh-codex-icon-button", title: t("right.refresh"), onClick: () => void load(path) }, /* @__PURE__ */ React9.createElement("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.3", "aria-hidden": "true" }, /* @__PURE__ */ React9.createElement("path", { d: "M13 8a5 5 0 1 1-1.5-3.5M13 3v3h-3", strokeLinecap: "round", strokeLinejoin: "round" })))), error !== null ? /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-right-error" }, error) : null, preview !== null ? /* @__PURE__ */ React9.createElement(React9.Fragment, null, /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-right-bar" }, /* @__PURE__ */ React9.createElement("button", { type: "button", className: "dsh-codex-button", onClick: () => setPreview(null) }, t("right.back")), /* @__PURE__ */ React9.createElement("code", { className: "dsh-codex-right-path", title: preview.path }, preview.path)), preview.truncated ? /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-hint" }, t("right.truncated")) : null, /* @__PURE__ */ React9.createElement("pre", { className: "dsh-codex-right-pre" }, preview.content)) : /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-right-list" }, entries.map((entry) => /* @__PURE__ */ React9.createElement(
        "button",
        {
          type: "button",
          key: entry.path,
          className: "dsh-codex-right-row",
          title: entry.path,
          onClick: () => entry.type === "dir" ? void load(entry.path) : void openFile(entry)
        },
        /* @__PURE__ */ React9.createElement("span", { className: `dsh-codex-right-glyph ${entry.type}` }, entry.type === "dir" ? "▸" : "·"),
        /* @__PURE__ */ React9.createElement("span", { className: "dsh-codex-right-name" }, entry.name),
        entry.type === "file" && entry.size !== null ? /* @__PURE__ */ React9.createElement("span", { className: "dsh-codex-right-meta" }, formatSize(entry.size)) : null
      )), entries.length === 0 && !loading ? /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-loading" }, t("right.emptyDir")) : null, loading ? /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-loading" }, t("threads.loading")) : null));
    }
    function GitTab({ api, cwd }) {
      const t = useT();
      const [data, setData] = React9.useState(null);
      const [diff, setDiff] = React9.useState(null);
      const [loading, setLoading] = React9.useState(false);
      const [error, setError] = React9.useState(null);
      const load = async () => {
        setLoading(true);
        setError(null);
        try {
          setData(await api("git/status", { cwd }));
          setDiff(null);
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : String(cause));
        } finally {
          setLoading(false);
        }
      };
      React9.useEffect(() => {
        void load();
      }, [cwd]);
      const openDiff = async (path) => {
        try {
          const result = await api("git/diff", { cwd, path });
          setDiff({ path, text: result.diff === "" ? t("right.noChanges") : result.diff });
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : String(cause));
        }
      };
      return /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-right-body" }, /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-right-bar" }, /* @__PURE__ */ React9.createElement("span", { className: "dsh-codex-right-meta" }, data !== null ? `${t("right.branch")} ${data.branch}` : ""), /* @__PURE__ */ React9.createElement("span", { style: { flex: 1 } }), /* @__PURE__ */ React9.createElement("button", { type: "button", className: "dsh-codex-button", onClick: () => void load() }, t("right.refresh"))), error !== null ? /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-right-error" }, error) : null, diff !== null ? /* @__PURE__ */ React9.createElement(React9.Fragment, null, /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-right-bar" }, /* @__PURE__ */ React9.createElement("button", { type: "button", className: "dsh-codex-button", onClick: () => setDiff(null) }, t("right.back")), /* @__PURE__ */ React9.createElement("code", { className: "dsh-codex-right-path" }, diff.path)), /* @__PURE__ */ React9.createElement("pre", { className: "dsh-codex-right-pre" }, diff.text)) : /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-right-list" }, /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-right-section" }, t("right.changes")), data !== null && data.changes.length === 0 ? /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-loading" }, t("right.noChanges")) : null, data?.changes.map((change) => /* @__PURE__ */ React9.createElement(
        "button",
        {
          type: "button",
          key: `${change.status}:${change.path}`,
          className: "dsh-codex-right-row",
          onClick: () => void openDiff(change.path)
        },
        /* @__PURE__ */ React9.createElement("span", { className: "dsh-codex-right-glyph" }, change.status),
        /* @__PURE__ */ React9.createElement("span", { className: "dsh-codex-right-name" }, change.path)
      )), data !== null && data.diffStat !== "" ? /* @__PURE__ */ React9.createElement(React9.Fragment, null, /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-right-section" }, t("right.diff")), /* @__PURE__ */ React9.createElement("pre", { className: "dsh-codex-right-pre small" }, data.diffStat)) : null, data !== null && data.log !== "" ? /* @__PURE__ */ React9.createElement(React9.Fragment, null, /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-right-section" }, t("right.log")), /* @__PURE__ */ React9.createElement("pre", { className: "dsh-codex-right-pre small" }, data.log)) : null, loading ? /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-loading" }, t("threads.loading")) : null));
    }
    function TerminalTab({ api, cwd }) {
      const t = useT();
      const [command, setCommand] = React9.useState("");
      const [output, setOutput] = React9.useState("");
      const [code, setCode] = React9.useState(null);
      const [running, setRunning] = React9.useState(false);
      const run = async () => {
        if (command.trim() === "" || running) return;
        setRunning(true);
        setOutput("");
        setCode(null);
        try {
          const result = await api("exec/run", { cwd, command });
          setOutput(result.output);
          setCode(result.code);
        } catch (cause) {
          setOutput(cause instanceof Error ? cause.message : String(cause));
          setCode(-1);
        } finally {
          setRunning(false);
        }
      };
      return /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-right-body" }, /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-right-bar" }, /* @__PURE__ */ React9.createElement("code", { className: "dsh-codex-right-path", title: cwd }, cwd)), /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-right-terminal-input" }, /* @__PURE__ */ React9.createElement(
        "input",
        {
          className: "dsh-codex-search",
          value: command,
          placeholder: t("right.command"),
          onChange: (event) => setCommand(event.target.value),
          onKeyDown: (event) => {
            if (event.key === "Enter") void run();
          }
        }
      ), /* @__PURE__ */ React9.createElement("button", { type: "button", className: "dsh-codex-button primary", disabled: running, onClick: () => void run() }, running ? t("right.running") : t("right.run"))), /* @__PURE__ */ React9.createElement("pre", { className: "dsh-codex-right-pre terminal" }, output === "" ? running ? t("right.running") : "" : output), code !== null ? /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-right-meta" }, t("right.exitCode", { code })) : null);
    }
    function formatSize(size) {
      if (size < 1024) return `${size} B`;
      if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
      return `${(size / 1024 / 1024).toFixed(1)} MB`;
    }

    // src/client/page/ThreadView.tsx
    var React15 = __toESM(require("react"), 1);

    // src/client/page/ApprovalCard.tsx
    var React10 = __toESM(require("react"), 1);
    function ApprovalStack({ approvals, onRespond }) {
      if (approvals.length === 0) return null;
      return /* @__PURE__ */ React10.createElement("div", { className: "dsh-codex-approvals" }, approvals.map((approval) => /* @__PURE__ */ React10.createElement(ApprovalCard, { key: String(approval.requestId), approval, onRespond })));
    }
    function ApprovalCard({
      approval,
      onRespond
    }) {
      const t = useT();
      const [busy, setBusy] = React10.useState(false);
      const params = approval.params ?? {};
      const respond = async (response) => {
        if (busy) return;
        setBusy(true);
        try {
          await onRespond(approval.requestId, response);
        } finally {
          setBusy(false);
        }
      };
      if (approval.method === "item/tool/requestUserInput") {
        return /* @__PURE__ */ React10.createElement(InputCard, { approval, busy, onRespond: respond });
      }
      if (approval.method === "item/commandExecution/requestApproval") {
        return /* @__PURE__ */ React10.createElement(Shell, { title: t("approval.command"), busy }, /* @__PURE__ */ React10.createElement("pre", { className: "dsh-codex-command" }, params.command ?? ""), params.cwd ? /* @__PURE__ */ React10.createElement("div", { className: "dsh-codex-approval-meta" }, t("approval.cwd"), ": ", params.cwd) : null, params.reason ? /* @__PURE__ */ React10.createElement("div", { className: "dsh-codex-approval-meta" }, t("approval.reason"), ": ", params.reason) : null, /* @__PURE__ */ React10.createElement(Actions, null, /* @__PURE__ */ React10.createElement("button", { type: "button", className: "dsh-codex-button primary", disabled: busy, onClick: () => void respond({ decision: "accept" }) }, t("approval.allow")), /* @__PURE__ */ React10.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => void respond({ decision: "acceptForSession" }) }, t("approval.allowSession")), /* @__PURE__ */ React10.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => void respond({ decision: "decline" }) }, t("approval.deny"))));
      }
      if (approval.method === "item/fileChange/requestApproval") {
        return /* @__PURE__ */ React10.createElement(Shell, { title: t("approval.file"), busy }, params.grantRoot ? /* @__PURE__ */ React10.createElement("div", { className: "dsh-codex-approval-meta" }, t("approval.grantRoot"), ": ", params.grantRoot) : null, params.reason ? /* @__PURE__ */ React10.createElement("div", { className: "dsh-codex-approval-meta" }, t("approval.reason"), ": ", params.reason) : null, /* @__PURE__ */ React10.createElement(Actions, null, /* @__PURE__ */ React10.createElement("button", { type: "button", className: "dsh-codex-button primary", disabled: busy, onClick: () => void respond({ decision: "accept" }) }, t("approval.allow")), /* @__PURE__ */ React10.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => void respond({ decision: "acceptForSession" }) }, t("approval.allowSession")), /* @__PURE__ */ React10.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => void respond({ decision: "decline" }) }, t("approval.deny"))));
      }
      if (approval.method === "item/permissions/requestApproval") {
        return /* @__PURE__ */ React10.createElement(Shell, { title: t("approval.permissions"), busy }, params.cwd ? /* @__PURE__ */ React10.createElement("div", { className: "dsh-codex-approval-meta" }, t("approval.cwd"), ": ", params.cwd) : null, params.reason ? /* @__PURE__ */ React10.createElement("div", { className: "dsh-codex-approval-meta" }, t("approval.reason"), ": ", params.reason) : null, /* @__PURE__ */ React10.createElement("pre", { className: "dsh-codex-pre" }, JSON.stringify(params.permissions ?? {}, null, 2)), /* @__PURE__ */ React10.createElement(Actions, null, /* @__PURE__ */ React10.createElement(
          "button",
          {
            type: "button",
            className: "dsh-codex-button primary",
            disabled: busy,
            onClick: () => void respond({ permissions: params.permissions ?? {}, scope: "turn" })
          },
          t("approval.allowTurn")
        ), /* @__PURE__ */ React10.createElement(
          "button",
          {
            type: "button",
            className: "dsh-codex-button",
            disabled: busy,
            onClick: () => void respond({ permissions: params.permissions ?? {}, scope: "session" })
          },
          t("approval.allowSession")
        ), /* @__PURE__ */ React10.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => void respond({ permissions: {}, scope: "turn" }) }, t("approval.deny"))));
      }
      return /* @__PURE__ */ React10.createElement(Shell, { title: t("approval.elicitation"), busy }, /* @__PURE__ */ React10.createElement("pre", { className: "dsh-codex-pre" }, JSON.stringify(params, null, 2)), /* @__PURE__ */ React10.createElement(Actions, null, /* @__PURE__ */ React10.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => void respond({ action: "decline", content: null, _meta: null }) }, t("approval.deny")), /* @__PURE__ */ React10.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => void respond({ action: "cancel", content: null, _meta: null }) }, t("approval.cancel"))));
    }
    function InputCard({
      approval,
      busy,
      onRespond
    }) {
      const t = useT();
      const questions = Array.isArray(approval.params?.questions) ? approval.params.questions : [];
      const [values, setValues] = React10.useState({});
      const submit = () => {
        const answers = {};
        for (const [key, value] of Object.entries(values)) {
          if (value.trim() !== "") answers[key] = { answers: [value.trim()] };
        }
        void onRespond({ answers });
      };
      return /* @__PURE__ */ React10.createElement(Shell, { title: t("approval.input"), busy }, questions.map((question) => /* @__PURE__ */ React10.createElement("div", { key: question.id, className: "dsh-codex-question" }, /* @__PURE__ */ React10.createElement("div", { className: "dsh-codex-question-title" }, question.header || question.question), question.header && question.question !== question.header ? /* @__PURE__ */ React10.createElement("div", { className: "dsh-codex-question-body" }, question.question) : null, /* @__PURE__ */ React10.createElement("div", { className: "dsh-codex-options" }, (Array.isArray(question.options) ? question.options : []).map((option) => /* @__PURE__ */ React10.createElement(
        "button",
        {
          type: "button",
          key: option.label,
          className: `dsh-codex-option ${values[question.id] === option.label ? "selected" : ""}`,
          title: option.description ?? void 0,
          onClick: () => setValues((previous) => ({ ...previous, [question.id]: option.label }))
        },
        option.label
      ))), question.isOther || (question.options ?? []).length === 0 ? /* @__PURE__ */ React10.createElement(
        "input",
        {
          className: "dsh-codex-search",
          type: question.isSecret ? "password" : "text",
          value: values[question.id] ?? "",
          placeholder: t("approval.other"),
          onChange: (event) => setValues((previous) => ({ ...previous, [question.id]: event.target.value }))
        }
      ) : null)), /* @__PURE__ */ React10.createElement(Actions, null, /* @__PURE__ */ React10.createElement("button", { type: "button", className: "dsh-codex-button primary", disabled: busy, onClick: submit }, t("approval.submit"))));
    }
    function Shell({ title, busy, children }) {
      return /* @__PURE__ */ React10.createElement("section", { className: `dsh-codex-approval ${busy ? "busy" : ""}` }, /* @__PURE__ */ React10.createElement("header", { className: "dsh-codex-approval-head" }, /* @__PURE__ */ React10.createElement("span", { className: "dsh-codex-dot warn pulse" }), /* @__PURE__ */ React10.createElement("strong", null, title)), children);
    }
    function Actions({ children }) {
      return /* @__PURE__ */ React10.createElement("div", { className: "dsh-codex-approval-actions" }, children);
    }

    // src/client/page/Composer.tsx
    var React11 = __toESM(require("react"), 1);
    var COMMANDS = [
      { id: "model", label: "cmd.model", desc: "cmd.modelDesc" },
      { id: "effort", label: "cmd.effort", desc: "cmd.effortDesc" },
      { id: "permission", label: "cmd.permission", desc: "cmd.permissionDesc" },
      { id: "plan", label: "cmd.plan", desc: "cmd.planDesc" },
      { id: "attach", label: "cmd.attach", desc: "cmd.attachDesc" },
      { id: "project", label: "cmd.project", desc: "cmd.projectDesc" },
      { id: "compact", label: "cmd.compact", desc: "cmd.compactDesc" },
      { id: "diff", label: "cmd.diff", desc: "cmd.diffDesc" },
      { id: "export", label: "cmd.export", desc: "cmd.exportDesc" },
      { id: "init", label: "cmd.init", desc: "cmd.initDesc" },
      { id: "review", label: "cmd.review", desc: "cmd.reviewDesc" },
      { id: "new", label: "cmd.new", desc: "cmd.newDesc" }
    ];
    var FALLBACK_EFFORTS = [
      { reasoningEffort: "low", description: "Fast responses with lighter reasoning" },
      { reasoningEffort: "medium", description: "Balances speed and reasoning depth for everyday tasks" },
      { reasoningEffort: "high", description: "Greater reasoning depth for complex problems" },
      { reasoningEffort: "xhigh", description: "Extra high reasoning depth for complex problems" },
      { reasoningEffort: "max", description: "Maximum reasoning depth for the hardest problems" },
      { reasoningEffort: "ultra", description: "Maximum reasoning with automatic task delegation" }
    ];
    function Composer({
      api,
      cwd,
      disabled,
      activeTurnId,
      models,
      model,
      effort,
      permission,
      planMode,
      onModelChange,
      onEffortChange,
      onPermissionChange,
      onEnterPlan,
      onExitPlan,
      onSend,
      onSteer,
      onStop,
      onPickProject,
      onNew,
      onCompact,
      onDiff,
      onExport
    }) {
      const t = useT();
      const [text, setText] = React11.useState("");
      const [busy, setBusy] = React11.useState(false);
      const [menu, setMenu] = React11.useState(null);
      const [plusOpen, setPlusOpen] = React11.useState(false);
      const [permissionOpen, setPermissionOpen] = React11.useState(false);
      const [confirmFull, setConfirmFull] = React11.useState(false);
      const [attachments, setAttachments] = React11.useState([]);
      const [uploading, setUploading] = React11.useState(false);
      const [uploadError, setUploadError] = React11.useState(null);
      const [slashIndex, setSlashIndex] = React11.useState(0);
      const [slashDismissed, setSlashDismissed] = React11.useState(false);
      const slashRef = React11.useRef(null);
      const textareaRef = React11.useRef(null);
      const fileInputRef = React11.useRef(null);
      React11.useEffect(() => {
        const element = textareaRef.current;
        if (element === null) return;
        element.style.height = "auto";
        element.style.height = `${Math.min(element.scrollHeight, 200)}px`;
      }, [text]);
      React11.useEffect(() => {
        if (!plusOpen && !permissionOpen && !confirmFull && menu === null) return void 0;
        const onKey = (event) => {
          if (event.key !== "Escape") return;
          setPlusOpen(false);
          setPermissionOpen(false);
          setConfirmFull(false);
          setMenu(null);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
      }, [plusOpen, permissionOpen, confirmFull, menu]);
      const currentModel = models.find((entry) => entry.id === model);
      const modelLabel = currentModel?.displayName ?? (model === "" ? t("composer.defaultModel") : model);
      const efforts = currentModel?.supportedReasoningEfforts?.length ? currentModel.supportedReasoningEfforts : FALLBACK_EFFORTS;
      const defaultEffort = currentModel?.defaultReasoningEffort ?? null;
      const topEfforts = efforts.slice(0, 4);
      const moreEfforts = efforts.slice(4);
      const effortLabel = effort === "" ? t("composer.defaultEffort") : labelForEffort(t, effort);
      const slashMatch = text.match(/^\/(\w*)$/);
      const slashQuery = slashMatch?.[1]?.toLowerCase() ?? null;
      const slashCommands = slashQuery === null ? [] : COMMANDS.filter((command) => {
        const label = t(command.label).toLowerCase();
        return command.id.includes(slashQuery) || label.includes(slashQuery);
      });
      const slashOpen = slashQuery !== null && slashCommands.length > 0 && !slashDismissed;
      React11.useEffect(() => {
        if (!slashOpen) return void 0;
        const onPointer = (event) => {
          const target = event.target;
          if (!(target instanceof Node)) return;
          if (slashRef.current?.contains(target)) return;
          if (textareaRef.current?.contains(target)) return;
          setSlashDismissed(true);
        };
        document.addEventListener("pointerdown", onPointer, true);
        return () => document.removeEventListener("pointerdown", onPointer, true);
      }, [slashOpen]);
      React11.useEffect(() => {
        if (!slashOpen) return;
        const element = slashRef.current?.querySelector(`[data-slash-index="${slashIndex}"]`);
        if (element instanceof HTMLElement) element.scrollIntoView({ block: "nearest" });
      }, [slashIndex, slashOpen]);
      const closeAll = () => {
        setPlusOpen(false);
        setPermissionOpen(false);
        setMenu(null);
      };
      const runCommand = (id) => {
        closeAll();
        setText("");
        if (id === "model") setMenu("model");
        else if (id === "effort") setMenu("effort");
        else if (id === "permission") setPermissionOpen(true);
        else if (id === "plan") onEnterPlan();
        else if (id === "attach") fileInputRef.current?.click();
        else if (id === "project") onPickProject();
        else if (id === "compact") onCompact();
        else if (id === "diff") onDiff();
        else if (id === "export") onExport();
        else if (id === "init") {
          setText(t("cmd.initPrompt"));
          textareaRef.current?.focus();
        } else if (id === "review") {
          setText(t("cmd.reviewPrompt"));
          textareaRef.current?.focus();
        } else if (id === "new") onNew();
      };
      const choosePermission = (mode) => {
        setPermissionOpen(false);
        if (mode === "full") {
          setConfirmFull(true);
          return;
        }
        onPermissionChange(mode);
      };
      const uploadFiles = async (files) => {
        if (files === null || files.length === 0) return;
        if (cwd === "") {
          setUploadError(t("composer.noCwd"));
          return;
        }
        setUploading(true);
        setUploadError(null);
        try {
          for (const file of Array.from(files)) {
            const dataBase64 = await readAsBase64(file);
            const saved = await api("upload/save", {
              cwd,
              name: file.name,
              dataBase64
            });
            setAttachments((previous) => [
              ...previous,
              {
                name: saved.name,
                path: saved.path,
                kind: file.type.startsWith("image/") ? "image" : "file"
              }
            ]);
          }
        } catch (cause) {
          setUploadError(cause instanceof Error ? cause.message : String(cause));
        } finally {
          setUploading(false);
          if (fileInputRef.current !== null) fileInputRef.current.value = "";
        }
      };
      const submit = async () => {
        const value = text.trim();
        if (value === "" && attachments.length === 0 || busy || disabled) return;
        setBusy(true);
        try {
          if (activeTurnId !== null) {
            await onSteer(value);
          } else {
            await onSend(value, {
              model: model === "" ? void 0 : model,
              effort: effort === "" ? void 0 : effort,
              attachments,
              permission
            });
          }
          setText("");
          setAttachments([]);
          textareaRef.current?.focus();
        } catch {
        } finally {
          setBusy(false);
        }
      };
      const stop = async () => {
        if (busy) return;
        setBusy(true);
        try {
          await onStop();
        } finally {
          setBusy(false);
        }
      };
      return /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-composer-wrap" }, slashOpen ? /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-slash", role: "listbox", ref: slashRef }, slashCommands.map((command, index) => /* @__PURE__ */ React11.createElement(
        "button",
        {
          type: "button",
          key: command.id,
          role: "option",
          "aria-selected": index === slashIndex,
          "data-slash-index": index,
          className: `dsh-codex-slash-item ${index === slashIndex ? "active" : ""}`,
          onMouseEnter: () => setSlashIndex(index),
          onClick: () => runCommand(command.id)
        },
        /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-slash-name" }, "/", command.id),
        /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-slash-label" }, t(command.label)),
        /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-slash-desc" }, t(command.desc))
      ))) : null, plusOpen ? /* @__PURE__ */ React11.createElement(React11.Fragment, null, /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-menu-backdrop", onPointerDown: closeAll }), /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-plus-panel", role: "menu" }, /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-menu-title" }, t("composer.add")), /* @__PURE__ */ React11.createElement(PlusItem, { icon: /* @__PURE__ */ React11.createElement(PaperclipGlyph, null), label: t("cmd.attach"), hint: t("cmd.attachDesc"), onClick: () => runCommand("attach") }), /* @__PURE__ */ React11.createElement(PlusItem, { icon: /* @__PURE__ */ React11.createElement(FolderGlyph3, null), label: t("cmd.project"), hint: t("cmd.projectDesc"), onClick: () => runCommand("project") }), /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-menu-title" }, t("composer.commands")), COMMANDS.filter((command) => command.id !== "attach" && command.id !== "project").map((command) => /* @__PURE__ */ React11.createElement(
        PlusItem,
        {
          key: command.id,
          icon: /* @__PURE__ */ React11.createElement(CommandGlyph, { id: command.id }),
          label: t(command.label),
          hint: t(command.desc),
          onClick: () => runCommand(command.id)
        }
      )))) : null, /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-composer-card" }, /* @__PURE__ */ React11.createElement("input", { ref: fileInputRef, type: "file", multiple: true, hidden: true, onChange: (event) => void uploadFiles(event.target.files) }), attachments.length > 0 || uploading || uploadError !== null ? /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-attachments" }, attachments.map((attachment) => /* @__PURE__ */ React11.createElement("span", { key: attachment.path, className: "dsh-codex-attachment", title: attachment.path }, /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-attachment-name" }, attachment.name), /* @__PURE__ */ React11.createElement(
        "button",
        {
          type: "button",
          "aria-label": t("composer.removeAttachment"),
          onClick: () => setAttachments((previous) => previous.filter((item) => item.path !== attachment.path))
        },
        "×"
      ))), uploading ? /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-attachment uploading" }, t("composer.uploading")) : null, uploadError !== null ? /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-attachment error" }, uploadError) : null) : null, /* @__PURE__ */ React11.createElement(
        "textarea",
        {
          ref: textareaRef,
          className: "dsh-codex-composer-input",
          rows: 1,
          value: text,
          disabled,
          placeholder: activeTurnId !== null ? t("composer.steerPlaceholder") : planMode ? t("composer.planPlaceholder") : t("composer.placeholder"),
          onChange: (event) => {
            setText(event.target.value);
            setSlashIndex(0);
            setSlashDismissed(false);
          },
          onKeyDown: (event) => {
            if (slashOpen) {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setSlashIndex((index) => (index + 1) % slashCommands.length);
                return;
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                setSlashIndex((index) => (index - 1 + slashCommands.length) % slashCommands.length);
                return;
              }
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                const command = slashCommands[slashIndex];
                if (command !== void 0) runCommand(command.id);
                return;
              }
              if (event.key === "Escape") {
                event.preventDefault();
                setSlashDismissed(true);
                return;
              }
            }
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              void submit();
            }
          }
        }
      ), /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-composer-row" }, /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-composer-tools" }, /* @__PURE__ */ React11.createElement(
        "button",
        {
          type: "button",
          className: "dsh-codex-plus",
          "aria-label": t("composer.add"),
          "aria-expanded": plusOpen,
          onClick: () => {
            setPlusOpen((previous) => !previous);
            setPermissionOpen(false);
            setMenu(null);
          }
        },
        /* @__PURE__ */ React11.createElement("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.4", "aria-hidden": "true" }, /* @__PURE__ */ React11.createElement("path", { d: "M8 2.5v11M2.5 8h11", strokeLinecap: "round" }))
      ), /* @__PURE__ */ React11.createElement(
        "button",
        {
          type: "button",
          className: "dsh-codex-permission-trigger",
          "aria-expanded": permissionOpen,
          onClick: () => {
            setPermissionOpen((previous) => !previous);
            setPlusOpen(false);
            setMenu(null);
          }
        },
        /* @__PURE__ */ React11.createElement(ShieldGlyph, null),
        /* @__PURE__ */ React11.createElement("span", null, t(`permission.${permission}`))
      ), activeTurnId !== null ? /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-running" }, /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-dot ok pulse" }), t("composer.running")) : null, planMode ? /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-plan-tag" }, t("plan.tag"), /* @__PURE__ */ React11.createElement("button", { type: "button", "aria-label": t("plan.exit"), title: t("plan.exit"), onClick: onExitPlan }, /* @__PURE__ */ React11.createElement(CloseGlyph, null))) : null), /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-composer-spacer" }), /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-composer-trailing" }, /* @__PURE__ */ React11.createElement(
        "button",
        {
          type: "button",
          className: "dsh-codex-model-trigger",
          "aria-haspopup": "menu",
          "aria-expanded": menu !== null,
          title: `${modelLabel} · ${effortLabel}`,
          onClick: () => {
            setMenu(menu === null ? "root" : null);
            setPlusOpen(false);
            setPermissionOpen(false);
          }
        },
        /* @__PURE__ */ React11.createElement(ModelGlyph, null),
        /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-model-label" }, modelLabel),
        /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-model-effort" }, "· ", effortLabel),
        /* @__PURE__ */ React11.createElement(ChevronGlyph2, null)
      ), activeTurnId !== null ? /* @__PURE__ */ React11.createElement(
        "button",
        {
          type: "button",
          className: "dsh-codex-stop",
          disabled: busy,
          "aria-label": t("composer.stop"),
          title: t("composer.stop"),
          onClick: () => void stop()
        },
        /* @__PURE__ */ React11.createElement(StopGlyph, null)
      ) : null, /* @__PURE__ */ React11.createElement(
        "button",
        {
          type: "button",
          className: "dsh-codex-send",
          disabled: disabled || busy || text.trim() === "" && attachments.length === 0,
          "aria-label": activeTurnId === null ? t("composer.send") : t("composer.steer"),
          title: activeTurnId === null ? t("composer.send") : t("composer.steer"),
          onClick: () => void submit()
        },
        /* @__PURE__ */ React11.createElement(SendGlyph, null)
      ))), permissionOpen ? /* @__PURE__ */ React11.createElement(React11.Fragment, null, /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-menu-backdrop", onPointerDown: closeAll }), /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-permission-menu", role: "menu" }, /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-menu-title" }, t("permission.title")), ["ask", "approve", "full", "read"].map((mode) => /* @__PURE__ */ React11.createElement(
        "button",
        {
          type: "button",
          key: mode,
          className: `dsh-codex-permission-option ${permission === mode ? "selected" : ""}`,
          onClick: () => choosePermission(mode)
        },
        /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-menu-check" }, permission === mode ? /* @__PURE__ */ React11.createElement(CheckGlyph, null) : null),
        /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-permission-meta" }, /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-menu-name" }, t(`permission.${mode}`)), /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-menu-desc" }, t(`permission.${mode}Desc`)))
      )))) : null, menu !== null ? /* @__PURE__ */ React11.createElement(React11.Fragment, null, /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-menu-backdrop", onPointerDown: closeAll }), /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-menu", role: "menu" }, menu === "root" ? /* @__PURE__ */ React11.createElement(React11.Fragment, null, /* @__PURE__ */ React11.createElement("button", { type: "button", className: "dsh-codex-menu-cell", onClick: () => setMenu("model") }, /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-menu-cell-label" }, t("composer.model")), /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-menu-cell-value" }, modelLabel), /* @__PURE__ */ React11.createElement(ChevronRightGlyph, null)), /* @__PURE__ */ React11.createElement("button", { type: "button", className: "dsh-codex-menu-cell", onClick: () => setMenu("effort") }, /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-menu-cell-label" }, t("composer.effort")), /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-menu-cell-value" }, effortLabel), /* @__PURE__ */ React11.createElement(ChevronRightGlyph, null))) : null, menu === "model" ? /* @__PURE__ */ React11.createElement(React11.Fragment, null, /* @__PURE__ */ React11.createElement(MenuBack, { label: t("composer.model"), onClick: () => setMenu("root") }), /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-menu-list" }, models.map((entry) => /* @__PURE__ */ React11.createElement(
        "button",
        {
          type: "button",
          key: entry.id,
          role: "menuitemradio",
          "aria-checked": entry.id === model,
          className: `dsh-codex-menu-item ${entry.id === model ? "selected" : ""}`,
          onClick: () => {
            onModelChange(entry.id);
            setMenu(null);
          }
        },
        /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-menu-check" }, entry.id === model ? /* @__PURE__ */ React11.createElement(CheckGlyph, null) : null),
        /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-menu-meta" }, /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-menu-name" }, entry.displayName), entry.description ? /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-menu-desc" }, entry.description) : null)
      )), /* @__PURE__ */ React11.createElement(
        "button",
        {
          type: "button",
          role: "menuitemradio",
          "aria-checked": model === "",
          className: `dsh-codex-menu-item ${model === "" ? "selected" : ""}`,
          onClick: () => {
            onModelChange("");
            setMenu(null);
          }
        },
        /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-menu-check" }, model === "" ? /* @__PURE__ */ React11.createElement(CheckGlyph, null) : null),
        /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-menu-meta" }, /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-menu-name" }, t("composer.defaultModel")))
      ))) : null, menu === "effort" ? /* @__PURE__ */ React11.createElement(React11.Fragment, null, /* @__PURE__ */ React11.createElement(MenuBack, { label: t("composer.effort"), onClick: () => setMenu("root") }), topEfforts.map((option) => /* @__PURE__ */ React11.createElement(
        EffortRow,
        {
          key: option.reasoningEffort,
          option,
          selected: option.reasoningEffort === effort,
          isDefault: option.reasoningEffort === defaultEffort,
          onSelect: () => {
            onEffortChange(option.reasoningEffort);
            setMenu(null);
          }
        }
      )), moreEfforts.length > 0 ? /* @__PURE__ */ React11.createElement("button", { type: "button", className: "dsh-codex-menu-item", onClick: () => setMenu("more") }, /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-menu-check" }), /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-menu-meta" }, /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-menu-name" }, t("composer.moreReasoning")), /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-menu-desc" }, t("composer.moreReasoningHint"))), /* @__PURE__ */ React11.createElement(ChevronRightGlyph, null)) : null) : null, menu === "more" ? /* @__PURE__ */ React11.createElement(React11.Fragment, null, /* @__PURE__ */ React11.createElement(MenuBack, { label: t("composer.moreReasoning"), onClick: () => setMenu("effort") }), /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-menu-title" }, t("composer.advancedReasoning")), /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-menu-warning" }, "⚠ ", t("composer.consumesFaster")), moreEfforts.map((option) => /* @__PURE__ */ React11.createElement(
        EffortRow,
        {
          key: option.reasoningEffort,
          option,
          selected: option.reasoningEffort === effort,
          isDefault: option.reasoningEffort === defaultEffort,
          onSelect: () => {
            onEffortChange(option.reasoningEffort);
            setMenu(null);
          }
        }
      ))) : null)) : null, confirmFull ? /* @__PURE__ */ React11.createElement(
        "div",
        {
          className: "dsh-codex-dialog-backdrop",
          onMouseDown: (event) => {
            if (event.target === event.currentTarget) setConfirmFull(false);
          }
        },
        /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-dialog", role: "dialog", "aria-modal": "true" }, /* @__PURE__ */ React11.createElement("header", { className: "dsh-codex-dialog-head" }, t("permission.fullTitle")), /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-approval-meta" }, t("permission.fullBody")), /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-dialog-actions" }, /* @__PURE__ */ React11.createElement("button", { type: "button", className: "dsh-codex-button", onClick: () => setConfirmFull(false) }, t("permission.cancel")), /* @__PURE__ */ React11.createElement(
          "button",
          {
            type: "button",
            className: "dsh-codex-button danger",
            onClick: () => {
              onPermissionChange("full");
              setConfirmFull(false);
            }
          },
          t("permission.confirm")
        )))
      ) : null));
    }
    function PlusItem({ icon, label, hint, onClick }) {
      return /* @__PURE__ */ React11.createElement("button", { type: "button", role: "menuitem", className: "dsh-codex-plus-item", onClick }, /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-plus-icon" }, icon), /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-plus-label" }, label), /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-plus-hint" }, hint));
    }
    function EffortRow({
      option,
      selected,
      isDefault,
      onSelect
    }) {
      const t = useT();
      return /* @__PURE__ */ React11.createElement(
        "button",
        {
          type: "button",
          role: "menuitemradio",
          "aria-checked": selected,
          className: `dsh-codex-menu-item ${selected ? "selected" : ""}`,
          onClick: onSelect
        },
        /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-menu-check" }, selected ? /* @__PURE__ */ React11.createElement(CheckGlyph, null) : null),
        /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-menu-meta" }, /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-menu-name" }, labelForEffort(t, option.reasoningEffort), isDefault ? /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-menu-tag" }, t("composer.defaultTag")) : null, selected ? /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-menu-tag current" }, t("composer.currentTag")) : null), option.description ? /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-menu-desc" }, option.description) : null)
      );
    }
    function MenuBack({ label, onClick }) {
      return /* @__PURE__ */ React11.createElement("button", { type: "button", className: "dsh-codex-menu-back", onClick }, /* @__PURE__ */ React11.createElement(ChevronLeftGlyph, null), /* @__PURE__ */ React11.createElement("span", null, label));
    }
    function labelForEffort(t, value) {
      const key = `composer.effort.${value}`;
      const text = t(key);
      return text === key ? value : text;
    }
    function readAsBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = String(reader.result ?? "");
          const comma = result.indexOf(",");
          resolve(comma >= 0 ? result.slice(comma + 1) : result);
        };
        reader.onerror = () => reject(reader.error ?? new Error("读取文件失败"));
        reader.readAsDataURL(file);
      });
    }
    function CommandGlyph({ id }) {
      if (id === "permission") return /* @__PURE__ */ React11.createElement(ShieldGlyph, null);
      if (id === "plan") return /* @__PURE__ */ React11.createElement(PlanGlyph, null);
      if (id === "model" || id === "effort") return /* @__PURE__ */ React11.createElement(ModelGlyph, null);
      if (id === "compact") return /* @__PURE__ */ React11.createElement("span", { "aria-hidden": "true" }, "⇣");
      if (id === "new") return /* @__PURE__ */ React11.createElement("span", { "aria-hidden": "true" }, "＋");
      return /* @__PURE__ */ React11.createElement("span", { "aria-hidden": "true" }, "⌘");
    }
    function PlanGlyph() {
      return /* @__PURE__ */ React11.createElement("svg", { width: "13", height: "13", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.2", "aria-hidden": "true" }, /* @__PURE__ */ React11.createElement("path", { d: "M5.5 4.5h8M5.5 8h8M5.5 11.5h5", strokeLinecap: "round" }), /* @__PURE__ */ React11.createElement("path", { d: "m2 4.2.9.9L4.4 3.5M2 7.7l.9.9L4.4 7M2 11.2l.9.9 1.5-1.6", strokeLinecap: "round", strokeLinejoin: "round" }));
    }
    function CloseGlyph() {
      return /* @__PURE__ */ React11.createElement("svg", { width: "10", height: "10", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": "true" }, /* @__PURE__ */ React11.createElement("path", { d: "M4 4l8 8M12 4l-8 8", strokeLinecap: "round" }));
    }
    function ShieldGlyph() {
      return /* @__PURE__ */ React11.createElement("svg", { width: "13", height: "13", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.2", "aria-hidden": "true" }, /* @__PURE__ */ React11.createElement("path", { d: "M8 1.8 13 3.6v3.6c0 3.1-2.1 5.3-5 6.9-2.9-1.6-5-3.8-5-6.9V3.6L8 1.8Z", strokeLinejoin: "round" }));
    }
    function PaperclipGlyph() {
      return /* @__PURE__ */ React11.createElement("svg", { width: "13", height: "13", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.2", "aria-hidden": "true" }, /* @__PURE__ */ React11.createElement("path", { d: "M10.8 5.2 6.4 9.6a1.6 1.6 0 0 0 2.3 2.3l4.7-4.7a3 3 0 0 0-4.2-4.2L4.1 8.1a4.2 4.2 0 0 0 5.9 5.9l3.4-3.4", strokeLinecap: "round" }));
    }
    function FolderGlyph3() {
      return /* @__PURE__ */ React11.createElement("svg", { width: "13", height: "13", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.2", "aria-hidden": "true" }, /* @__PURE__ */ React11.createElement("path", { d: "M1.9 4.3c0-.66.54-1.2 1.2-1.2h2.9l1.5 1.7h5.4c.66 0 1.2.54 1.2 1.2v6.3c0 .66-.54 1.2-1.2 1.2H3.1c-.66 0-1.2-.54-1.2-1.2V4.3Z", strokeLinejoin: "round" }));
    }
    function ModelGlyph() {
      return /* @__PURE__ */ React11.createElement("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.1", "aria-hidden": "true" }, /* @__PURE__ */ React11.createElement("path", { d: "M8 1.6 9.6 5.1 13.4 6.6 9.6 8.1 8 11.6 6.4 8.1 2.6 6.6 6.4 5.1 8 1.6Z", strokeLinejoin: "round" }), /* @__PURE__ */ React11.createElement("path", { d: "M12.6 10.4l.7 1.5 1.5.7-1.5.7-.7 1.5-.7-1.5-1.5-.7 1.5-.7.7-1.5Z", strokeLinejoin: "round" }));
    }
    function ChevronGlyph2() {
      return /* @__PURE__ */ React11.createElement("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.1", "aria-hidden": "true" }, /* @__PURE__ */ React11.createElement("path", { d: "M4 6l3.3 3.3a1 1 0 0 0 1.4 0L12 6", strokeLinecap: "round" }));
    }
    function ChevronRightGlyph() {
      return /* @__PURE__ */ React11.createElement("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.1", "aria-hidden": "true" }, /* @__PURE__ */ React11.createElement("path", { d: "M6 4l3.3 3.3a1 1 0 0 1 0 1.4L6 12", strokeLinecap: "round" }));
    }
    function ChevronLeftGlyph() {
      return /* @__PURE__ */ React11.createElement("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.1", "aria-hidden": "true" }, /* @__PURE__ */ React11.createElement("path", { d: "M10 4 6.7 7.3a1 1 0 0 0 0 1.4L10 12", strokeLinecap: "round" }));
    }
    function SendGlyph() {
      return /* @__PURE__ */ React11.createElement("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.6", "aria-hidden": "true" }, /* @__PURE__ */ React11.createElement("path", { d: "M8 13V3M3.6 7.4 8 3l4.4 4.4", strokeLinecap: "round", strokeLinejoin: "round" }));
    }
    function StopGlyph() {
      return /* @__PURE__ */ React11.createElement("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "currentColor", "aria-hidden": "true" }, /* @__PURE__ */ React11.createElement("rect", { x: "2.5", y: "2.5", width: "7", height: "7", rx: "1.2" }));
    }
    function CheckGlyph() {
      return /* @__PURE__ */ React11.createElement("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.4", "aria-hidden": "true" }, /* @__PURE__ */ React11.createElement("path", { d: "M3.5 8.5 6.5 11.5 12.5 4.5", strokeLinecap: "round", strokeLinejoin: "round" }));
    }

    // src/client/page/ItemCard.tsx
    var React13 = __toESM(require("react"), 1);

    // src/client/markdown.tsx
    var React12 = __toESM(require("react"), 1);
    function Markdown({ text }) {
      const blocks = React12.useMemo(() => parseBlocks(text), [text]);
      return /* @__PURE__ */ React12.createElement("div", { className: "dsh-codex-markdown" }, blocks.map((block, index) => renderBlock(block, index)));
    }
    function renderBlock(block, key) {
      switch (block.kind) {
        case "code":
          return /* @__PURE__ */ React12.createElement(CodeBlock, { key, lang: block.lang, text: block.text });
        case "heading": {
          const Tag = `h${Math.min(block.level, 4)}`;
          return React12.createElement(Tag, { key }, renderInline(block.text, `h${key}`));
        }
        case "paragraph":
          return /* @__PURE__ */ React12.createElement("p", { key }, renderLines(block.lines, `p${key}`));
        case "list": {
          const Tag = block.ordered ? "ol" : "ul";
          return React12.createElement(
            Tag,
            { key },
            block.items.map((item, index) => /* @__PURE__ */ React12.createElement("li", { key: `${key}-${index}` }, renderInline(item, `li${key}-${index}`)))
          );
        }
        case "quote":
          return /* @__PURE__ */ React12.createElement("blockquote", { key }, renderLines(block.lines, `q${key}`));
        case "table":
          return /* @__PURE__ */ React12.createElement("table", { key }, /* @__PURE__ */ React12.createElement("thead", null, /* @__PURE__ */ React12.createElement("tr", null, block.header.map((cell, index) => /* @__PURE__ */ React12.createElement("th", { key: `${key}-h-${index}` }, renderInline(cell, `th${key}-${index}`))))), /* @__PURE__ */ React12.createElement("tbody", null, block.rows.map((row, rowIndex) => /* @__PURE__ */ React12.createElement("tr", { key: `${key}-r-${rowIndex}` }, row.map((cell, cellIndex) => /* @__PURE__ */ React12.createElement("td", { key: `${key}-c-${rowIndex}-${cellIndex}` }, renderInline(cell, `td${key}-${rowIndex}-${cellIndex}`)))))));
        case "hr":
          return /* @__PURE__ */ React12.createElement("hr", { key });
        default:
          return null;
      }
    }
    function renderLines(lines, keyPrefix) {
      const nodes = [];
      lines.forEach((line, index) => {
        if (index > 0) nodes.push(/* @__PURE__ */ React12.createElement("br", { key: `${keyPrefix}-br-${index}` }));
        nodes.push(...renderInline(line, `${keyPrefix}-${index}`));
      });
      return nodes;
    }
    var INLINE = /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(\*[^*\n]+\*)|(\[[^\]\n]+\]\([^)\s]+\))/gu;
    function renderInline(text, keyPrefix) {
      const nodes = [];
      let last = 0;
      let match;
      INLINE.lastIndex = 0;
      let index = 0;
      while ((match = INLINE.exec(text)) !== null) {
        if (match.index > last) nodes.push(text.slice(last, match.index));
        const token = match[0];
        const key = `${keyPrefix}-${index}`;
        if (token.startsWith("`")) {
          nodes.push(/* @__PURE__ */ React12.createElement("code", { key }, token.slice(1, -1)));
        } else if (token.startsWith("**")) {
          nodes.push(/* @__PURE__ */ React12.createElement("strong", { key }, token.slice(2, -2)));
        } else if (token.startsWith("*")) {
          nodes.push(/* @__PURE__ */ React12.createElement("em", { key }, token.slice(1, -1)));
        } else {
          const linkMatch = /^\[([^\]]+)\]\(([^)\s]+)\)$/u.exec(token);
          if (linkMatch === null) {
            nodes.push(token);
          } else {
            const [, label, href] = linkMatch;
            if (/^https?:\/\//iu.test(href) || href.startsWith("/")) {
              nodes.push(
                /* @__PURE__ */ React12.createElement("a", { key, href, target: "_blank", rel: "noreferrer noopener" }, label)
              );
            } else {
              nodes.push(label);
            }
          }
        }
        last = match.index + token.length;
        index += 1;
      }
      if (last < text.length) nodes.push(text.slice(last));
      return nodes;
    }
    function parseBlocks(text) {
      const lines = text.replace(/\r\n/gu, "\n").split("\n");
      const blocks = [];
      let index = 0;
      while (index < lines.length) {
        const line = lines[index];
        if (line.trim() === "") {
          index += 1;
          continue;
        }
        const fence = /^\s*```([\w+-]*)\s*$/u.exec(line);
        if (fence !== null) {
          const lang = fence[1] ?? "";
          const body = [];
          index += 1;
          while (index < lines.length && !/^\s*```\s*$/u.test(lines[index])) {
            body.push(lines[index]);
            index += 1;
          }
          index += 1;
          blocks.push({ kind: "code", lang, text: body.join("\n") });
          continue;
        }
        if (/^\s*([-*_])\s*\1\s*\1[\s\S]*$/u.test(line) && line.trim().length >= 3) {
          blocks.push({ kind: "hr" });
          index += 1;
          continue;
        }
        const heading = /^(#{1,6})\s+(.*)$/u.exec(line);
        if (heading !== null) {
          blocks.push({ kind: "heading", level: heading[1].length, text: heading[2].trim() });
          index += 1;
          continue;
        }
        if (line.includes("|") && index + 1 < lines.length && /^\s*\|?[\s:|-]+\|?\s*$/u.test(lines[index + 1]) && lines[index + 1].includes("-")) {
          const header = splitRow(line);
          index += 2;
          const rows = [];
          while (index < lines.length && lines[index].includes("|") && lines[index].trim() !== "") {
            rows.push(splitRow(lines[index]));
            index += 1;
          }
          blocks.push({ kind: "table", header, rows });
          continue;
        }
        if (/^\s*>\s?/u.test(line)) {
          const quote = [];
          while (index < lines.length && /^\s*>\s?/u.test(lines[index])) {
            quote.push(lines[index].replace(/^\s*>\s?/u, ""));
            index += 1;
          }
          blocks.push({ kind: "quote", lines: quote });
          continue;
        }
        const listItem = /^\s*([-*+]|\d+\.)\s+(.*)$/u.exec(line);
        if (listItem !== null) {
          const ordered = /\d+\./u.test(listItem[1]);
          const items = [];
          while (index < lines.length) {
            const item = /^\s*([-*+]|\d+\.)\s+(.*)$/u.exec(lines[index]);
            if (item === null) break;
            if (/\d+\./u.test(item[1]) !== ordered) break;
            items.push(item[2]);
            index += 1;
          }
          blocks.push({ kind: "list", ordered, items });
          continue;
        }
        const paragraph = [];
        while (index < lines.length && lines[index].trim() !== "") {
          const next = lines[index];
          if (/^\s*```/u.test(next) || /^(#{1,6})\s+/u.test(next) || /^\s*>\s?/u.test(next) || /^\s*([-*+]|\d+\.)\s+/u.test(next)) {
            break;
          }
          paragraph.push(next);
          index += 1;
        }
        if (paragraph.length > 0) blocks.push({ kind: "paragraph", lines: paragraph });
        else index += 1;
      }
      return blocks;
    }
    function splitRow(line) {
      let text = line.trim();
      if (text.startsWith("|")) text = text.slice(1);
      if (text.endsWith("|")) text = text.slice(0, -1);
      return text.split("|").map((cell) => cell.trim());
    }
    var TOKEN = /(\/\/[^\n]*|#[^\n]*|--[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(\d+(?:\.\d+)?)\b|\b(const|let|var|function|return|if|else|for|while|class|new|import|export|from|async|await|try|catch|throw|switch|case|break|continue|def|elif|lambda|pass|raise|with|as|in|is|not|and|or|None|True|False|null|true|false|undefined|interface|type|enum|struct|impl|pub|use|fn|match|mut|package|go|defer|chan|select)\b/g;
    function CodeBlock({ lang, text }) {
      const [copied, setCopied] = React12.useState(false);
      const copy = () => {
        void navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        });
      };
      return /* @__PURE__ */ React12.createElement("div", { className: "dsh-codex-code" }, /* @__PURE__ */ React12.createElement("div", { className: "dsh-codex-code-head" }, /* @__PURE__ */ React12.createElement("span", { className: "dsh-codex-code-lang" }, lang === "" ? "text" : lang), /* @__PURE__ */ React12.createElement("button", { type: "button", className: "dsh-codex-code-copy", onClick: copy }, copied ? "已复制" : "复制")), /* @__PURE__ */ React12.createElement("pre", { className: "dsh-codex-pre" }, /* @__PURE__ */ React12.createElement("code", null, lang === "diff" ? /* @__PURE__ */ React12.createElement(DiffLines, { text }) : /* @__PURE__ */ React12.createElement(Highlighted, { text }))));
    }
    function DiffLines({ text }) {
      return /* @__PURE__ */ React12.createElement(React12.Fragment, null, text.split("\n").map((line, index) => {
        const cls = line.startsWith("+") ? "add" : line.startsWith("-") ? "del" : line.startsWith("@@") ? "hunk" : "";
        return /* @__PURE__ */ React12.createElement("div", { key: index, className: `dsh-codex-diff-line ${cls}` }, line === "" ? " " : line);
      }));
    }
    function Highlighted({ text }) {
      return /* @__PURE__ */ React12.createElement(React12.Fragment, null, text.split("\n").map((line, index) => /* @__PURE__ */ React12.createElement("div", { key: index, className: "dsh-codex-code-line" }, highlightLine(line))));
    }
    function highlightLine(line) {
      const nodes = [];
      let last = 0;
      let match;
      const regex = new RegExp(TOKEN.source, "g");
      while ((match = regex.exec(line)) !== null) {
        if (match.index > last) nodes.push(line.slice(last, match.index));
        const cls = match[1] !== void 0 ? "comment" : match[2] !== void 0 ? "string" : match[3] !== void 0 ? "number" : "keyword";
        nodes.push(/* @__PURE__ */ React12.createElement("span", { key: `${match.index}-${cls}`, className: `dsh-codex-tok ${cls}` }, match[0]));
        last = match.index + match[0].length;
      }
      if (last < line.length) nodes.push(line.slice(last));
      return nodes;
    }

    // src/client/page/ItemCard.tsx
    function ItemCard({ item, api }) {
      const t = useT();
      switch (item.type) {
        case "userMessage":
          return /* @__PURE__ */ React13.createElement(Message, { kind: "user", label: t("item.user"), text: itemText(item), time: formatClock(item.startedAtMs) });
        case "agentMessage":
          return /* @__PURE__ */ React13.createElement(
            Message,
            {
              kind: "assistant",
              label: t("item.assistant"),
              text: typeof item.text === "string" ? item.text : "",
              muted: item.phase === "commentary",
              time: formatClock(item.startedAtMs)
            }
          );
        case "reasoning":
          return /* @__PURE__ */ React13.createElement(Reasoning, { item });
        case "commandExecution":
          return /* @__PURE__ */ React13.createElement(CommandCard, { item });
        case "fileChange":
          return /* @__PURE__ */ React13.createElement(FileCard, { item });
        case "mcpToolCall":
        case "dynamicToolCall":
        case "functionCallOutput":
          return /* @__PURE__ */ React13.createElement(ToolCard, { item });
        case "plan":
          return /* @__PURE__ */ React13.createElement(Block, { title: t("item.plan"), body: /* @__PURE__ */ React13.createElement("div", { className: "dsh-codex-text" }, item.text ?? "") });
        case "webSearch":
          return /* @__PURE__ */ React13.createElement(Disclosure, { title: t("item.search"), body: /* @__PURE__ */ React13.createElement(Json, { value: item }) });
        case "imageView":
          return /* @__PURE__ */ React13.createElement(ImageView, { item, api });
        case "contextCompaction":
          return /* @__PURE__ */ React13.createElement(Divider, { label: t("item.compaction") });
        case "enteredReviewMode":
        case "exitedReviewMode":
          return /* @__PURE__ */ React13.createElement(Divider, { label: t("item.review") });
        case "sleep":
        case "hookPrompt":
          return null;
        default:
          return /* @__PURE__ */ React13.createElement(Disclosure, { title: t("item.other", { type: item.type }), body: null });
      }
    }
    function Message({
      kind,
      label,
      text,
      muted = false,
      time = ""
    }) {
      if (text.trim() === "") return null;
      return /* @__PURE__ */ React13.createElement("div", { className: `dsh-codex-message ${kind}` }, /* @__PURE__ */ React13.createElement("div", { className: "dsh-codex-message-head" }, kind === "user" && time !== "" ? /* @__PURE__ */ React13.createElement("span", { className: "dsh-codex-message-time" }, time) : null, /* @__PURE__ */ React13.createElement("span", null, label), kind === "assistant" && time !== "" ? /* @__PURE__ */ React13.createElement("span", { className: "dsh-codex-message-time" }, time) : null), /* @__PURE__ */ React13.createElement("div", { className: "dsh-codex-bubble", style: muted ? { opacity: 0.82 } : void 0 }, /* @__PURE__ */ React13.createElement(Markdown, { text })));
    }
    function Reasoning({ item }) {
      const t = useT();
      const summary = Array.isArray(item.summary) ? item.summary.filter((part) => part.trim() !== "") : [];
      const body = summary.length > 0 ? summary.join("\n\n") : "";
      if (body === "") return null;
      return /* @__PURE__ */ React13.createElement("details", { className: "dsh-codex-reasoning" }, /* @__PURE__ */ React13.createElement("summary", null, t("item.reasoning")), /* @__PURE__ */ React13.createElement("div", { className: "dsh-codex-reasoning-body" }, body));
    }
    function CommandCard({ item }) {
      const t = useT();
      const output = typeof item.aggregatedOutput === "string" ? item.aggregatedOutput : "";
      const status = typeof item.status === "string" ? item.status : "";
      const command = item.command ?? "";
      return /* @__PURE__ */ React13.createElement(
        Disclosure,
        {
          title: t("item.command"),
          meta: /* @__PURE__ */ React13.createElement(React13.Fragment, null, /* @__PURE__ */ React13.createElement("span", { className: "dsh-codex-block-title" }, shorten(command, 120)), status !== "" ? /* @__PURE__ */ React13.createElement("span", null, status) : null, typeof item.exitCode === "number" ? /* @__PURE__ */ React13.createElement("span", null, t("item.exitCode", { code: item.exitCode })) : null),
          body: /* @__PURE__ */ React13.createElement(React13.Fragment, null, /* @__PURE__ */ React13.createElement("div", { className: "dsh-codex-command" }, command), output !== "" ? /* @__PURE__ */ React13.createElement("pre", { className: "dsh-codex-pre" }, output) : null)
        }
      );
    }
    function FileCard({ item }) {
      const t = useT();
      const changes = Array.isArray(item.changes) ? item.changes : [];
      return /* @__PURE__ */ React13.createElement(
        Disclosure,
        {
          title: t("item.files"),
          meta: /* @__PURE__ */ React13.createElement("span", null, t("item.files.changed", { count: changes.length })),
          body: /* @__PURE__ */ React13.createElement("div", { className: "dsh-codex-files" }, changes.map((change, index) => /* @__PURE__ */ React13.createElement("details", { key: `${change.path}-${index}` }, /* @__PURE__ */ React13.createElement("summary", { className: "dsh-codex-file-path" }, change.path), /* @__PURE__ */ React13.createElement("pre", { className: "dsh-codex-pre" }, change.diff))))
        }
      );
    }
    function ToolCard({ item }) {
      const t = useT();
      const title = item.type === "mcpToolCall" ? `${item.server ?? "mcp"} / ${item.tool ?? ""}` : item.type === "dynamicToolCall" ? `tool / ${item.tool ?? ""}` : item.type;
      return /* @__PURE__ */ React13.createElement(
        Disclosure,
        {
          title: t("item.tool"),
          meta: /* @__PURE__ */ React13.createElement(React13.Fragment, null, /* @__PURE__ */ React13.createElement("span", { className: "dsh-codex-block-title" }, title), typeof item.status === "string" ? /* @__PURE__ */ React13.createElement("span", null, item.status) : null),
          body: /* @__PURE__ */ React13.createElement(Json, { value: { arguments: item.arguments, result: item.result, error: item.error } })
        }
      );
    }
    function Json({ value }) {
      let text;
      try {
        text = JSON.stringify(value, null, 2) ?? "";
      } catch {
        text = String(value);
      }
      if (text.trim() === "" || text === "{}") return null;
      if (text.length > 4e3) text = `${text.slice(0, 4e3)}
    …`;
      return /* @__PURE__ */ React13.createElement("pre", { className: "dsh-codex-pre" }, text);
    }
    function Disclosure({ title, meta, body }) {
      return /* @__PURE__ */ React13.createElement("details", { className: "dsh-codex-block" }, /* @__PURE__ */ React13.createElement("summary", { className: "dsh-codex-block-head" }, /* @__PURE__ */ React13.createElement("span", { className: "dsh-codex-caret" }), /* @__PURE__ */ React13.createElement("span", null, title), meta), body !== null ? /* @__PURE__ */ React13.createElement("div", { className: "dsh-codex-block-body" }, body) : null);
    }
    function Block({ title, meta, body }) {
      return /* @__PURE__ */ React13.createElement("section", { className: "dsh-codex-block" }, /* @__PURE__ */ React13.createElement("header", { className: "dsh-codex-block-head" }, /* @__PURE__ */ React13.createElement("span", null, title), meta), body !== null ? /* @__PURE__ */ React13.createElement("div", { className: "dsh-codex-block-body" }, body) : null);
    }
    function Divider({ label }) {
      return /* @__PURE__ */ React13.createElement("div", { className: "dsh-codex-divider" }, label);
    }
    var imageCache = /* @__PURE__ */ new Map();
    function ImageView({ item, api }) {
      const t = useT();
      const path = typeof item.path === "string" ? item.path : "";
      const holderRef = React13.useRef(null);
      const [visible, setVisible] = React13.useState(false);
      const [src, setSrc] = React13.useState(path === "" ? null : imageCache.get(path) ?? null);
      const [failed, setFailed] = React13.useState(false);
      React13.useEffect(() => {
        if (path === "") return void 0;
        const cached = imageCache.get(path);
        if (cached !== void 0) {
          setSrc(cached);
          return void 0;
        }
        const element = holderRef.current;
        if (element === null || typeof IntersectionObserver === "undefined") {
          setVisible(true);
          return void 0;
        }
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              setVisible(true);
              observer.disconnect();
            }
          },
          { rootMargin: "300px" }
        );
        observer.observe(element);
        return () => observer.disconnect();
      }, [path]);
      React13.useEffect(() => {
        if (!visible || path === "" || src !== null) return void 0;
        let alive = true;
        setFailed(false);
        api("images/read", { path }).then((result) => {
          imageCache.set(path, result.dataUrl);
          if (alive) setSrc(result.dataUrl);
        }).catch(() => {
          if (alive) setFailed(true);
        });
        return () => {
          alive = false;
        };
      }, [api, path, visible, src]);
      if (path === "") return null;
      return /* @__PURE__ */ React13.createElement("figure", { className: "dsh-codex-image", ref: holderRef }, src !== null ? /* @__PURE__ */ React13.createElement("img", { src, alt: basenameOf(path), loading: "lazy" }) : /* @__PURE__ */ React13.createElement("div", { className: "dsh-codex-image-placeholder" }, failed ? t("item.imageFailed") : t("item.imageLoading")), /* @__PURE__ */ React13.createElement("figcaption", null, basenameOf(path)));
    }
    function basenameOf(value) {
      const text = typeof value === "string" ? value : "";
      const index = Math.max(text.lastIndexOf("/"), text.lastIndexOf("\\"));
      return index === -1 ? text : text.slice(index + 1);
    }
    function shorten(text, max) {
      const single = text.replace(/\s+/gu, " ").trim();
      return single.length > max ? `${single.slice(0, max)}…` : single;
    }

    // src/client/page/ToolGroup.tsx
    var React14 = __toESM(require("react"), 1);
    var ACTIVITY_TYPES = /* @__PURE__ */ new Set(["commandExecution", "fileChange", "mcpToolCall", "dynamicToolCall", "webSearch"]);
    function isActivity(item) {
      return ACTIVITY_TYPES.has(item.type);
    }
    function isInvisible(item) {
      if (item.type === "reasoning") {
        const summary = Array.isArray(item.summary) ? item.summary : [];
        return summary.every((part) => typeof part !== "string" || part.trim() === "");
      }
      if (item.type === "agentMessage") {
        return typeof item.text !== "string" || item.text.trim() === "";
      }
      return false;
    }
    function groupActivity(items) {
      const result = [];
      let current = [];
      const flush = () => {
        if (current.length >= 2) {
          result.push({ kind: "group", key: current[0].id, items: current });
        } else {
          for (const item of current) result.push({ kind: "item", item });
        }
        current = [];
      };
      for (const item of items) {
        if (isInvisible(item)) continue;
        if (isActivity(item)) {
          current.push(item);
        } else {
          flush();
          result.push({ kind: "item", item });
        }
      }
      flush();
      return result;
    }
    function ToolGroup({ items, api }) {
      const t = useT();
      const [open, setOpen] = React14.useState(false);
      const summary = summarize(items, t);
      return /* @__PURE__ */ React14.createElement("div", { className: "dsh-codex-tool-group" }, /* @__PURE__ */ React14.createElement(
        "button",
        {
          type: "button",
          className: "dsh-codex-tool-group-head",
          "aria-expanded": open,
          onClick: () => setOpen(!open)
        },
        /* @__PURE__ */ React14.createElement("span", { className: `dsh-codex-tool-group-chevron ${open ? "open" : ""}` }, /* @__PURE__ */ React14.createElement("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.2", "aria-hidden": "true" }, /* @__PURE__ */ React14.createElement("path", { d: "M4 6l3.3 3.3a1 1 0 0 0 1.4 0L12 6", strokeLinecap: "round" }))),
        /* @__PURE__ */ React14.createElement("span", { className: "dsh-codex-tool-group-title" }, summary)
      ), open ? /* @__PURE__ */ React14.createElement("div", { className: "dsh-codex-tool-group-body" }, items.map((item) => /* @__PURE__ */ React14.createElement(ItemCard, { key: item.id, item, api }))) : null);
    }
    function summarize(items, t) {
      let commands = 0;
      let reads = 0;
      let writes = 0;
      let tools = 0;
      for (const item of items) {
        if (item.type === "commandExecution") {
          commands += 1;
        } else if (item.type === "fileChange") {
          writes += 1;
        } else if (item.type === "webSearch" || item.type === "dynamicToolCall") {
          tools += 1;
        } else if (item.type === "mcpToolCall") {
          const name = `${item.server ?? ""} ${item.tool ?? ""}`.toLowerCase();
          if (/read|list|glob|search|get_|find/.test(name)) reads += 1;
          else if (/write|edit|create|delete|move|rename|apply|patch/.test(name)) writes += 1;
          else tools += 1;
        }
      }
      const parts = [];
      if (commands > 0) parts.push(t("group.commands", { count: commands }));
      if (reads > 0) parts.push(t("group.reads", { count: reads }));
      if (writes > 0) parts.push(t("group.writes", { count: writes }));
      if (tools > 0) parts.push(t("group.tools", { count: tools }));
      if (parts.length === 0) return t("group.activity");
      return parts.join(parts.length > 2 ? t("group.sepList") : t("group.sepAnd"));
    }

    // src/client/page/ThreadView.tsx
    function ThreadView({
      api,
      detail,
      loading,
      selectedId,
      activeTurnId,
      models,
      permissionFromSession,
      planMode,
      onEnterPlan,
      onExitPlan,
      hasOlder,
      loadingOlder,
      onLoadOlder,
      pending: pending2,
      onRespond,
      onSend,
      onSteer,
      onStop,
      onPickProject,
      onNew,
      onCompact,
      onDiff,
      onExport,
      actions
    }) {
      const t = useT();
      const messagesRef = React15.useRef(null);
      const threadId = detail?.thread.id ?? null;
      const [model, setModel] = React15.useState("");
      const [effort, setEffort] = React15.useState("");
      const [permission, setPermission] = React15.useState("ask");
      const [, setTick] = React15.useState(0);
      const runningSinceRef = React15.useRef(Date.now());
      React15.useEffect(() => {
        if (activeTurnId === null) return void 0;
        runningSinceRef.current = Date.now();
        const timer = window.setInterval(() => setTick((value) => value + 1), 1e3);
        return () => window.clearInterval(timer);
      }, [activeTurnId]);
      React15.useEffect(() => {
        if (detail === null) return;
        setModel(detail.thread.model ?? "");
        setEffort(detail.thread.reasoningEffort ?? "");
        if (permissionFromSession !== void 0 && permissionFromSession !== null) {
          setPermission(permissionFromSession);
          return;
        }
        try {
          const saved = threadId === null ? null : window.localStorage.getItem(`dsh-codex-permission-${threadId}`);
          setPermission(saved === "read" || saved === "full" || saved === "approve" ? saved : "ask");
        } catch {
          setPermission("ask");
        }
      }, [threadId, permissionFromSession]);
      const changePermission = React15.useCallback(
        (mode) => {
          setPermission(mode);
          if (threadId === null) return;
          try {
            window.localStorage.setItem(`dsh-codex-permission-${threadId}`, mode);
          } catch {
          }
        },
        [threadId]
      );
      const atBottomRef = React15.useRef(true);
      const [showJump, setShowJump] = React15.useState(false);
      const pendingPrependRef = React15.useRef(null);
      const BOTTOM_THRESHOLD = 32;
      React15.useLayoutEffect(() => {
        const element = messagesRef.current;
        if (element === null) return;
        atBottomRef.current = true;
        setShowJump(false);
        element.scrollTop = element.scrollHeight;
      }, [threadId, loading]);
      React15.useLayoutEffect(() => {
        const element = messagesRef.current;
        if (element === null) return;
        const pending3 = pendingPrependRef.current;
        if (pending3 !== null) {
          pendingPrependRef.current = null;
          element.scrollTop = pending3.top + (element.scrollHeight - pending3.height);
          return;
        }
        if (!atBottomRef.current) return;
        element.scrollTop = element.scrollHeight;
      }, [detail]);
      React15.useEffect(() => {
        if (!loadingOlder) pendingPrependRef.current = null;
      }, [loadingOlder]);
      const triggerOlder = React15.useCallback(() => {
        const element = messagesRef.current;
        if (element === null || !hasOlder || loadingOlder) return;
        pendingPrependRef.current = { height: element.scrollHeight, top: element.scrollTop };
        void onLoadOlder();
      }, [hasOlder, loadingOlder, onLoadOlder]);
      const onMessagesScroll = React15.useCallback(() => {
        const element = messagesRef.current;
        if (element === null) return;
        const atBottom = element.scrollHeight - element.scrollTop - element.clientHeight <= BOTTOM_THRESHOLD;
        atBottomRef.current = atBottom;
        setShowJump((previous) => previous === !atBottom ? previous : !atBottom);
        if (element.scrollTop < 240) triggerOlder();
      }, [triggerOlder]);
      const jumpToBottom = React15.useCallback(() => {
        const element = messagesRef.current;
        if (element === null) return;
        atBottomRef.current = true;
        setShowJump(false);
        element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
      }, []);
      if (selectedId === null) {
        return /* @__PURE__ */ React15.createElement("div", { className: "dsh-codex-empty" }, /* @__PURE__ */ React15.createElement("strong", null, t("thread.select")), /* @__PURE__ */ React15.createElement("small", null, t("thread.selectHint")));
      }
      if (loading && detail === null) {
        return /* @__PURE__ */ React15.createElement("div", { className: "dsh-codex-empty" }, t("thread.loading"));
      }
      if (detail === null) return null;
      const thread = detail.thread;
      const orderedTurns = [...detail.turns].map((turn, index) => ({ turn, index })).sort((a, b) => {
        const at = turnTime(a.turn);
        const bt = turnTime(b.turn);
        return at === bt ? a.index - b.index : at - bt;
      }).map((entry) => entry.turn);
      const items = orderedTurns.flatMap((turn) => turn.items ?? []);
      const hasItems = items.length > 0;
      const activeTurn = detail.turns.find((turn) => turn.id === activeTurnId) ?? null;
      const runningSeconds = activeTurn?.startedAt ? Math.max(0, Math.floor(Date.now() / 1e3 - activeTurn.startedAt)) : Math.max(0, Math.floor((Date.now() - runningSinceRef.current) / 1e3));
      return /* @__PURE__ */ React15.createElement(React15.Fragment, null, /* @__PURE__ */ React15.createElement("div", { className: "dsh-codex-thread-header" }, /* @__PURE__ */ React15.createElement("div", { className: "dsh-codex-thread-header-top" }, /* @__PURE__ */ React15.createElement("div", { className: "dsh-codex-thread-title", title: thread.id }, threadTitle(thread)), actions), /* @__PURE__ */ React15.createElement("div", { className: "dsh-codex-chips" }, /* @__PURE__ */ React15.createElement("span", { className: "dsh-codex-chip" }, t("thread.status"), ": ", t(statusKey(thread.status))), thread.cwd ? /* @__PURE__ */ React15.createElement("span", { className: "dsh-codex-chip", title: thread.cwd }, t("thread.cwd"), ": ", /* @__PURE__ */ React15.createElement("code", null, basename(thread.cwd))) : null, thread.model ? /* @__PURE__ */ React15.createElement("span", { className: "dsh-codex-chip" }, t("thread.model"), ": ", thread.model) : null, thread.reasoningEffort ? /* @__PURE__ */ React15.createElement("span", { className: "dsh-codex-chip" }, t("thread.effort"), ": ", thread.reasoningEffort) : null, typeof thread.gitInfo?.branch === "string" && thread.gitInfo.branch !== "" ? /* @__PURE__ */ React15.createElement("span", { className: "dsh-codex-chip" }, t("thread.git"), ": ", thread.gitInfo.branch) : null, thread.updatedAt ? /* @__PURE__ */ React15.createElement("span", { className: "dsh-codex-chip" }, t("thread.updated"), ": ", relativeTime(thread.updatedAt, t)) : null, /* @__PURE__ */ React15.createElement("span", { className: "dsh-codex-chip" }, hasOlder ? t("thread.messagesPlus", { count: items.length }) : t("thread.messages", { count: items.length })))), /* @__PURE__ */ React15.createElement("div", { className: "dsh-codex-messages-wrap" }, /* @__PURE__ */ React15.createElement("div", { className: "dsh-codex-messages", ref: messagesRef, onScroll: onMessagesScroll }, hasOlder && hasItems ? /* @__PURE__ */ React15.createElement(
        "button",
        {
          type: "button",
          className: "dsh-codex-load-older",
          disabled: loadingOlder,
          onClick: triggerOlder
        },
        loadingOlder ? t("thread.loadingOlder") : t("thread.loadOlder")
      ) : null, !hasItems ? /* @__PURE__ */ React15.createElement("div", { className: "dsh-codex-empty" }, t("thread.noMessages")) : orderedTurns.map((turn) => /* @__PURE__ */ React15.createElement(React15.Fragment, { key: turn.id }, groupActivity(turn.items ?? []).map(
        (entry) => entry.kind === "group" ? /* @__PURE__ */ React15.createElement(ToolGroup, { key: entry.key, items: entry.items, api }) : /* @__PURE__ */ React15.createElement(ItemCard, { key: entry.item.id, item: entry.item, api })
      ), /* @__PURE__ */ React15.createElement(TurnFooter, { turn })))), showJump ? /* @__PURE__ */ React15.createElement(
        "button",
        {
          type: "button",
          className: "dsh-codex-jump",
          "aria-label": t("thread.jumpToBottom"),
          title: t("thread.jumpToBottom"),
          onClick: jumpToBottom
        },
        /* @__PURE__ */ React15.createElement(ChevronDownGlyph, null)
      ) : null), /* @__PURE__ */ React15.createElement(ApprovalStack, { approvals: pending2, onRespond }), activeTurnId !== null ? /* @__PURE__ */ React15.createElement("div", { className: "dsh-codex-running-bar" }, /* @__PURE__ */ React15.createElement("span", { className: "dsh-codex-running-spinner", "aria-hidden": "true" }), /* @__PURE__ */ React15.createElement("span", null, t("thread.running", { seconds: runningSeconds }))) : null, /* @__PURE__ */ React15.createElement(
        Composer,
        {
          api,
          cwd: detail.thread.cwd ?? "",
          disabled: false,
          activeTurnId,
          models,
          model,
          effort,
          permission,
          planMode,
          onModelChange: setModel,
          onEffortChange: setEffort,
          onPermissionChange: changePermission,
          onEnterPlan,
          onExitPlan,
          onPickProject,
          onNew,
          onCompact,
          onDiff,
          onExport,
          onSend,
          onSteer,
          onStop
        }
      ));
    }
    function turnTime(turn) {
      if (typeof turn.startedAt === "number") return turn.startedAt * 1e3;
      if (typeof turn.completedAt === "number") return turn.completedAt * 1e3;
      const times = (turn.items ?? []).flatMap((item) => [item.startedAtMs, item.completedAtMs]).filter((value) => typeof value === "number");
      return times.length > 0 ? Math.min(...times) : Number.MAX_SAFE_INTEGER;
    }
    function TurnFooter({ turn }) {
      const t = useT();
      if (turn.status === "inProgress") return null;
      const startMs = typeof turn.startedAt === "number" ? turn.startedAt * 1e3 : null;
      const lastItem = [...turn.items ?? []].reverse().find((item) => typeof item.completedAtMs === "number");
      const endMs = typeof turn.completedAt === "number" ? turn.completedAt * 1e3 : lastItem?.completedAtMs ?? null;
      const durationMs = typeof turn.durationMs === "number" ? turn.durationMs : startMs !== null && endMs !== null ? endMs - startMs : null;
      const duration = durationMs === null ? "" : formatDuration(durationMs, t);
      const clock = formatClock(endMs);
      if (duration === "" && clock === "") return null;
      const label = duration === "" ? "" : turn.status === "interrupted" ? t("turn.interrupted", { duration }) : turn.status === "failed" ? t("turn.failed", { duration }) : t("turn.workedFor", { duration });
      const text = label === "" ? clock : clock === "" ? label : `${label} · ${clock}`;
      return /* @__PURE__ */ React15.createElement("div", { className: "dsh-codex-turn-footer" }, text);
    }
    function ChevronDownGlyph() {
      return /* @__PURE__ */ React15.createElement("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.4", "aria-hidden": "true" }, /* @__PURE__ */ React15.createElement("path", { d: "M4 6.2l3.3 3.3a1 1 0 0 0 1.4 0L12 6.2", strokeLinecap: "round" }));
    }

    // src/client/page/ThreadActions.tsx
    var React16 = __toESM(require("react"), 1);
    function ThreadActions({ api, thread, onRenamed, onArchived, onForked, onDeleted }) {
      const t = useT();
      const [dialog, setDialog] = React16.useState(null);
      const [name, setName] = React16.useState(thread.name ?? "");
      const [busy, setBusy] = React16.useState(false);
      const [error, setError] = React16.useState(null);
      const run = async (action) => {
        if (busy) return;
        setBusy(true);
        setError(null);
        try {
          await action();
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : String(cause));
        } finally {
          setBusy(false);
        }
      };
      const openRename = () => {
        setName(thread.name ?? "");
        setError(null);
        setDialog("rename");
      };
      const saveRename = () => run(async () => {
        const trimmed = name.trim();
        if (trimmed === "") {
          setError(t("actions.failed"));
          return;
        }
        await api("threads/rename", { threadId: thread.id, name: trimmed });
        onRenamed(trimmed);
        setDialog(null);
      });
      const archive = () => run(async () => {
        await api("threads/archive", { threadId: thread.id });
        onArchived();
      });
      const fork = () => run(async () => {
        const next = await api("threads/fork", { threadId: thread.id });
        if (next !== null && next !== void 0) onForked(next);
      });
      const exportMarkdown = () => run(async () => {
        const result = await api("threads/export", { threadId: thread.id });
        const blob = new Blob([result.content], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = result.filename;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 2e3);
      });
      const remove = () => run(async () => {
        await api("threads/delete", { threadId: thread.id });
        onDeleted();
        setDialog(null);
      });
      return /* @__PURE__ */ React16.createElement("div", { className: "dsh-codex-thread-actions" }, /* @__PURE__ */ React16.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: openRename }, t("actions.rename")), /* @__PURE__ */ React16.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => void archive() }, t("actions.archive")), /* @__PURE__ */ React16.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => void fork() }, t("actions.fork")), /* @__PURE__ */ React16.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => void exportMarkdown() }, t("actions.export")), /* @__PURE__ */ React16.createElement(
        "button",
        {
          type: "button",
          className: "dsh-codex-button danger",
          disabled: busy,
          onClick: () => {
            setError(null);
            setDialog("delete");
          }
        },
        t("actions.delete")
      ), error !== null && dialog === null ? /* @__PURE__ */ React16.createElement("span", { className: "dsh-codex-action-error" }, error) : null, dialog === "rename" ? /* @__PURE__ */ React16.createElement("div", { className: "dsh-codex-dialog-backdrop", onMouseDown: (event) => {
        if (event.target === event.currentTarget && !busy) setDialog(null);
      } }, /* @__PURE__ */ React16.createElement("div", { className: "dsh-codex-dialog", role: "dialog", "aria-modal": "true" }, /* @__PURE__ */ React16.createElement("header", { className: "dsh-codex-dialog-head" }, t("actions.renameTitle")), /* @__PURE__ */ React16.createElement(
        "input",
        {
          className: "dsh-codex-search",
          autoFocus: true,
          value: name,
          onChange: (event) => setName(event.target.value),
          onKeyDown: (event) => {
            if (event.key === "Enter") void saveRename();
          }
        }
      ), error !== null ? /* @__PURE__ */ React16.createElement("div", { className: "dsh-codex-dialog-error" }, error) : null, /* @__PURE__ */ React16.createElement("div", { className: "dsh-codex-dialog-actions" }, /* @__PURE__ */ React16.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => setDialog(null) }, t("actions.cancel")), /* @__PURE__ */ React16.createElement("button", { type: "button", className: "dsh-codex-button primary", disabled: busy, onClick: () => void saveRename() }, t("actions.save"))))) : null, dialog === "delete" ? /* @__PURE__ */ React16.createElement("div", { className: "dsh-codex-dialog-backdrop", onMouseDown: (event) => {
        if (event.target === event.currentTarget && !busy) setDialog(null);
      } }, /* @__PURE__ */ React16.createElement("div", { className: "dsh-codex-dialog", role: "dialog", "aria-modal": "true" }, /* @__PURE__ */ React16.createElement("header", { className: "dsh-codex-dialog-head" }, t("actions.deleteTitle")), /* @__PURE__ */ React16.createElement("div", { className: "dsh-codex-approval-meta" }, t("actions.deleteBody", { name: threadTitle(thread) })), error !== null ? /* @__PURE__ */ React16.createElement("div", { className: "dsh-codex-dialog-error" }, error) : null, /* @__PURE__ */ React16.createElement("div", { className: "dsh-codex-dialog-actions" }, /* @__PURE__ */ React16.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => setDialog(null) }, t("actions.cancel")), /* @__PURE__ */ React16.createElement("button", { type: "button", className: "dsh-codex-button danger", disabled: busy, onClick: () => void remove() }, t("actions.confirmDelete"))))) : null);
    }

    // src/client/page/VersionsDialog.tsx
    var React17 = __toESM(require("react"), 1);
    function VersionsDialog({ open, onClose, api }) {
      const t = useT();
      const [check, setCheck] = React17.useState(null);
      const [loading, setLoading] = React17.useState(false);
      const [error, setError] = React17.useState(null);
      const [activeTurns, setActiveTurns] = React17.useState([]);
      const [job, setJob] = React17.useState(null);
      const [rollbackVersion, setRollbackVersion] = React17.useState("");
      const [pendingDaemon, setPendingDaemon] = React17.useState(null);
      const [lastAction, setLastAction] = React17.useState(null);
      const pollRef = React17.useRef(null);
      const logRef = React17.useRef(null);
      const load = React17.useCallback(
        async (refresh = false) => {
          setLoading(true);
          setError(null);
          try {
            const value = await api("versions/check", { refresh });
            setCheck(value);
          } catch (cause) {
            setError(messageOf3(cause));
          } finally {
            setLoading(false);
          }
        },
        [api]
      );
      React17.useEffect(() => {
        if (open) void load(false);
      }, [open, load]);
      React17.useEffect(
        () => () => {
          if (pollRef.current !== null) window.clearInterval(pollRef.current);
        },
        []
      );
      const pollJob = React17.useCallback(
        (jobId) => {
          if (pollRef.current !== null) window.clearInterval(pollRef.current);
          pollRef.current = window.setInterval(async () => {
            try {
              const state = await api("versions/job", { jobId });
              setJob(state);
              if (state.status !== "running") {
                if (pollRef.current !== null) window.clearInterval(pollRef.current);
                pollRef.current = null;
                void load(true);
              }
            } catch {
              if (pollRef.current !== null) window.clearInterval(pollRef.current);
              pollRef.current = null;
            }
          }, 1e3);
        },
        [api, load]
      );
      const startJob = React17.useCallback(
        async (endpoint, payload) => {
          setError(null);
          setActiveTurns([]);
          setLastAction({ endpoint, payload });
          try {
            const result = await api(endpoint, payload);
            setJob({ jobId: result.jobId, kind: "", status: "running", command: "", exitCode: null, lines: [] });
            pollJob(result.jobId);
          } catch (cause) {
            const failure = cause;
            if (failure.code === "codex-cli/active-turns") {
              setActiveTurns(failure.details?.threads ?? []);
            }
            setError(messageOf3(cause));
          }
        },
        [api, pollJob]
      );
      React17.useEffect(() => {
        const element = logRef.current;
        if (element !== null) element.scrollTop = element.scrollHeight;
      }, [job?.lines.length]);
      if (!open) return null;
      const doctor = check?.doctor ?? null;
      const problems = doctor?.checks.filter((entry) => entry.status !== "ok") ?? [];
      const daemonVersion = check?.daemon?.appServerVersion ?? check?.daemon?.cliVersion ?? null;
      return /* @__PURE__ */ React17.createElement(
        "div",
        {
          className: "dsh-codex-dialog-backdrop",
          onMouseDown: (event) => {
            if (event.target === event.currentTarget) onClose();
          }
        },
        /* @__PURE__ */ React17.createElement("div", { className: "dsh-codex-dialog dsh-codex-versions", role: "dialog", "aria-modal": "true" }, /* @__PURE__ */ React17.createElement("header", { className: "dsh-codex-dialog-head" }, t("versions.title")), loading && check === null ? /* @__PURE__ */ React17.createElement("div", { className: "dsh-codex-loading" }, t("versions.checking")) : null, error !== null ? /* @__PURE__ */ React17.createElement("div", { className: "dsh-codex-dialog-error" }, error, activeTurns.length > 0 ? /* @__PURE__ */ React17.createElement("div", { className: "dsh-codex-approval-meta" }, t("versions.activeTurns", { count: activeTurns.length }), /* @__PURE__ */ React17.createElement(
          "button",
          {
            type: "button",
            className: "dsh-codex-button",
            style: { marginLeft: 8 },
            onClick: () => {
              if (lastAction !== null) {
                void startJob(lastAction.endpoint, { ...lastAction.payload, force: true });
              }
            }
          },
          t("versions.force")
        )) : null) : null, check !== null ? /* @__PURE__ */ React17.createElement(React17.Fragment, null, /* @__PURE__ */ React17.createElement("div", { className: "dsh-codex-version-grid" }, /* @__PURE__ */ React17.createElement("span", null, t("versions.cli")), /* @__PURE__ */ React17.createElement("strong", null, check.cli.version ?? "—"), /* @__PURE__ */ React17.createElement("span", null, t("versions.daemon")), /* @__PURE__ */ React17.createElement("strong", null, daemonVersion ?? "—"), /* @__PURE__ */ React17.createElement("span", null, t("versions.latest")), /* @__PURE__ */ React17.createElement("strong", null, check.latest?.version ?? "—"), /* @__PURE__ */ React17.createElement("span", null, t("versions.channel")), /* @__PURE__ */ React17.createElement("strong", { title: check.install?.context ?? void 0 }, installLabel(check.install?.context))), /* @__PURE__ */ React17.createElement("div", { className: "dsh-codex-version-actions" }, /* @__PURE__ */ React17.createElement("button", { type: "button", className: "dsh-codex-button", disabled: loading, onClick: () => void load(true) }, loading ? t("versions.checking") : t("versions.check")), check.updateAvailable ? /* @__PURE__ */ React17.createElement(
          "button",
          {
            type: "button",
            className: "dsh-codex-button primary",
            disabled: job?.status === "running",
            onClick: () => void startJob("versions/update", {})
          },
          t("versions.update"),
          " → ",
          check.latest?.version
        ) : /* @__PURE__ */ React17.createElement("span", { className: "dsh-codex-hint" }, t("versions.upToDate"))), /* @__PURE__ */ React17.createElement("div", { className: "dsh-codex-version-actions" }, /* @__PURE__ */ React17.createElement(
          "input",
          {
            className: "dsh-codex-search",
            style: { flex: 1, margin: 0 },
            value: rollbackVersion,
            placeholder: t("versions.rollbackPlaceholder"),
            onChange: (event) => setRollbackVersion(event.target.value)
          }
        ), /* @__PURE__ */ React17.createElement(
          "button",
          {
            type: "button",
            className: "dsh-codex-button",
            disabled: rollbackVersion.trim() === "" || job?.status === "running",
            onClick: () => void startJob("versions/rollback", { version: rollbackVersion.trim() })
          },
          t("versions.rollback")
        )), /* @__PURE__ */ React17.createElement("div", { className: "dsh-codex-version-daemon" }, /* @__PURE__ */ React17.createElement("span", { className: "dsh-codex-section-title", style: { padding: 0 } }, t("versions.daemonActions")), /* @__PURE__ */ React17.createElement(
          "button",
          {
            type: "button",
            className: "dsh-codex-button",
            disabled: job?.status === "running",
            onClick: () => setPendingDaemon("restart")
          },
          t("versions.restart")
        ), /* @__PURE__ */ React17.createElement(
          "button",
          {
            type: "button",
            className: "dsh-codex-button",
            disabled: job?.status === "running",
            onClick: () => setPendingDaemon("update")
          },
          t("versions.daemonUpdate")
        ), /* @__PURE__ */ React17.createElement(
          "button",
          {
            type: "button",
            className: "dsh-codex-button",
            disabled: job?.status === "running",
            onClick: () => setPendingDaemon("stop")
          },
          t("versions.stop")
        )), pendingDaemon !== null ? /* @__PURE__ */ React17.createElement("div", { className: "dsh-codex-approval" }, /* @__PURE__ */ React17.createElement("div", { className: "dsh-codex-approval-meta" }, pendingDaemon === "restart" ? t("versions.confirmRestart") : pendingDaemon === "update" ? t("versions.confirmUpdate") : t("versions.confirmStop")), /* @__PURE__ */ React17.createElement("div", { className: "dsh-codex-approval-actions" }, /* @__PURE__ */ React17.createElement("button", { type: "button", className: "dsh-codex-button", onClick: () => setPendingDaemon(null) }, t("versions.cancel")), /* @__PURE__ */ React17.createElement(
          "button",
          {
            type: "button",
            className: "dsh-codex-button primary",
            onClick: () => {
              const action = pendingDaemon;
              setPendingDaemon(null);
              void startJob("daemon/action", { action });
            }
          },
          t("versions.confirm")
        ))) : null, /* @__PURE__ */ React17.createElement("div", { className: "dsh-codex-version-doctor" }, /* @__PURE__ */ React17.createElement("div", { className: "dsh-codex-section-title", style: { padding: 0 } }, t("versions.doctor"), doctor !== null ? /* @__PURE__ */ React17.createElement("span", { className: "dsh-codex-approval-meta", style: { marginLeft: 8 } }, doctor.overallStatus === "ok" ? t("versions.doctorOk") : doctor.overallStatus === "warning" ? t("versions.doctorWarn") : t("versions.doctorError")) : null), problems.slice(0, 8).map((entry) => /* @__PURE__ */ React17.createElement("div", { key: entry.id, className: "dsh-codex-doctor-row" }, /* @__PURE__ */ React17.createElement("span", { className: `dsh-codex-dot ${entry.status === "error" ? "error" : "warn"}` }), /* @__PURE__ */ React17.createElement("span", { className: "dsh-codex-doctor-id" }, entry.id), /* @__PURE__ */ React17.createElement("span", { className: "dsh-codex-doctor-summary" }, entry.summary))), doctor !== null && problems.length === 0 ? /* @__PURE__ */ React17.createElement("div", { className: "dsh-codex-hint" }, doctor.checks.length, " checks ok") : null), job !== null ? /* @__PURE__ */ React17.createElement("div", { className: "dsh-codex-job" }, /* @__PURE__ */ React17.createElement("div", { className: "dsh-codex-section-title", style: { padding: 0 } }, t("versions.job"), /* @__PURE__ */ React17.createElement("span", { className: "dsh-codex-approval-meta", style: { marginLeft: 8 } }, job.status === "running" ? t("versions.running") : job.status === "done" ? t("versions.done") : t("versions.failed", { code: job.exitCode ?? "?" }))), /* @__PURE__ */ React17.createElement("pre", { className: "dsh-codex-pre dsh-codex-job-log", ref: logRef }, job.lines.join("\n"))) : null) : null, /* @__PURE__ */ React17.createElement("div", { className: "dsh-codex-dialog-actions" }, /* @__PURE__ */ React17.createElement("button", { type: "button", className: "dsh-codex-button", onClick: onClose }, t("versions.close"))))
      );
    }
    function installLabel(context) {
      if (typeof context !== "string" || context === "") return "—";
      return context.split(" ")[0];
    }
    function messageOf3(cause) {
      return cause instanceof Error ? cause.message : String(cause);
    }

    // src/client/page/ConsolePage.tsx
    var TURN_PAGE = 2;
    var THREAD_PAGE = 10;
    var LAST_THREAD_KEY = "dsh-codex-last-thread";
    var VIEWED_KEY = "dsh-codex-viewed-at";
    function readStored(key) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    }
    function readViewedAt() {
      try {
        const raw = window.localStorage.getItem(VIEWED_KEY);
        const parsed = raw === null ? null : JSON.parse(raw);
        if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return {};
        const result = {};
        for (const [key, value] of Object.entries(parsed)) {
          if (typeof value === "number") result[key] = value;
        }
        return result;
      } catch {
        return {};
      }
    }
    function projectNameOf(cwd) {
      const trimmed = cwd.replace(/\/+$/u, "");
      const index = trimmed.lastIndexOf("/");
      return index < 0 ? trimmed : trimmed.slice(index + 1);
    }
    function upsertProject(projects, thread, cwd) {
      const updatedAt = thread.updatedAt ?? Math.floor(Date.now() / 1e3);
      const latest = {
        id: thread.id,
        name: thread.name ?? null,
        preview: "",
        status: thread.status?.type ?? null
      };
      if (projects.some((project) => project.cwd === cwd)) {
        return projects.map(
          (project) => project.cwd === cwd ? {
            ...project,
            threadCount: project.threadCount + 1,
            lastUpdatedAt: Math.max(project.lastUpdatedAt, updatedAt),
            latest
          } : project
        );
      }
      return [
        {
          cwd,
          name: projectNameOf(cwd),
          threadCount: 1,
          activeCount: 0,
          lastUpdatedAt: updatedAt,
          models: thread.model === null || thread.model === void 0 || thread.model === "" ? [] : [thread.model],
          git: thread.gitInfo ?? null,
          latest
        },
        ...projects
      ];
    }
    function ConsolePage(props) {
      const t = props.t ?? fallbackTranslate;
      const api = React18.useMemo(() => props.api, []);
      const onExit = props.onExit ?? (() => {
      });
      useCodexTab();
      const [status, setStatus] = React18.useState(null);
      const [projects, setProjects] = React18.useState([]);
      const [threads, setThreads] = React18.useState([]);
      const [nextCursor, setNextCursor] = React18.useState(null);
      const [selectedCwd, setSelectedCwd] = React18.useState(null);
      const [selectedId, setSelectedId] = React18.useState(() => readStored(LAST_THREAD_KEY));
      const [detail, setDetail] = React18.useState(null);
      const [detailLoading, setDetailLoading] = React18.useState(false);
      const [olderCursor, setOlderCursor] = React18.useState(null);
      const [loadingOlder, setLoadingOlder] = React18.useState(false);
      const loadingOlderRef = React18.useRef(false);
      const [loadingThreads, setLoadingThreads] = React18.useState(false);
      const [threadsOwner, setThreadsOwner] = React18.useState(null);
      const [unread, setUnread] = React18.useState(() => /* @__PURE__ */ new Set());
      const [viewedAt, setViewedAt] = React18.useState(readViewedAt);
      const [error, setError] = React18.useState(null);
      const [streamState, setStreamState] = React18.useState("connecting");
      const [search, setSearch] = React18.useState("");
      const [pending2, setPending] = React18.useState([]);
      const [models, setModels] = React18.useState([]);
      const [quota, setQuota] = React18.useState(null);
      const [sessionPermission, setSessionPermission] = React18.useState(null);
      const [planMode, setPlanMode] = React18.useState(false);
      const [quotaLoading, setQuotaLoading] = React18.useState(true);
      const quotaRef = React18.useRef(null);
      quotaRef.current = quota;
      const [pickerOpen, setPickerOpen] = React18.useState(false);
      const [rightTab, setRightTab] = React18.useState("files");
      const [rightOpen, setRightOpen] = React18.useState(() => {
        try {
          return window.localStorage.getItem("dsh-codex-right-open") === "1";
        } catch {
          return false;
        }
      });
      const [dirPickerOpen, setDirPickerOpen] = React18.useState(false);
      const [versionsOpen, setVersionsOpen] = React18.useState(false);
      const restoredRef = React18.useRef(selectedId !== null);
      const createThreadRef = React18.useRef(async () => {
      });
      const searchTimer = React18.useRef(null);
      const listGeneration = React18.useRef(0);
      const queryRef = React18.useRef({ search: "", cwd: null });
      queryRef.current = { search: search.trim(), cwd: selectedCwd };
      const selectedIdRef = React18.useRef(null);
      selectedIdRef.current = selectedId;
      const threadsRef = React18.useRef([]);
      threadsRef.current = threads;
      const loadThreads = React18.useCallback(
        async (cursor, override = {}) => {
          const searchValue = override.search !== void 0 ? override.search : queryRef.current.search;
          const cwd = override.cwd !== void 0 ? override.cwd : queryRef.current.cwd;
          const limit = Math.min(200, Math.max(1, override.limit ?? THREAD_PAGE));
          const silent = override.silent === true;
          const generation = ++listGeneration.current;
          if (!silent) setLoadingThreads(true);
          try {
            const page = await api("threads/list", {
              limit,
              ...cursor ? { cursor } : {},
              ...searchValue !== "" ? { search: searchValue } : {},
              ...cwd !== null ? { cwd } : {}
            });
            if (generation !== listGeneration.current) return;
            setThreads((previous) => {
              if (!cursor) return override.keep === void 0 ? page.data : upsertThread(page.data, override.keep);
              const known = new Set(previous.map((thread) => thread.id));
              return [...previous, ...page.data.filter((thread) => !known.has(thread.id))];
            });
            setNextCursor(page.nextCursor);
            setThreadsOwner({ cwd, search: searchValue });
          } catch (cause) {
            if (generation === listGeneration.current) setError(messageOf(cause));
          } finally {
            if (!silent && generation === listGeneration.current) setLoadingThreads(false);
          }
        },
        [api]
      );
      const handleSearch = React18.useCallback(
        (value) => {
          setSearch(value);
          if (searchTimer.current !== null) clearTimeout(searchTimer.current);
          searchTimer.current = setTimeout(() => {
            searchTimer.current = null;
            const next = value.trim();
            void loadThreads(null, { search: next, cwd: next === "" ? queryRef.current.cwd : null });
          }, 250);
        },
        [loadThreads]
      );
      React18.useEffect(() => () => {
        if (searchTimer.current !== null) clearTimeout(searchTimer.current);
      }, []);
      const loadQuota = React18.useCallback(async () => {
        if (quotaRef.current === null) setQuotaLoading(true);
        try {
          setQuota(await api("account/rateLimits"));
        } catch {
        } finally {
          setQuotaLoading(false);
        }
      }, [api]);
      const refreshPending = React18.useCallback(async () => {
        try {
          const result = await api("approvals/pending");
          setPending(result.pending ?? []);
        } catch {
        }
      }, [api]);
      const refresh = React18.useCallback(async () => {
        setError(null);
        try {
          const [nextStatus, nextProjects] = await Promise.all([
            api("status"),
            api("projects/list", {})
          ]);
          setStatus(nextStatus);
          setProjects(nextProjects);
        } catch (cause) {
          setError(messageOf(cause));
        }
        await loadThreads(null);
        await loadQuota();
      }, [api, loadThreads, loadQuota]);
      React18.useEffect(() => {
        const consume = () => {
          const request = takePending();
          if (request === null) return;
          if (request.kind === "thread") {
            setSelectedId(request.threadId);
          } else {
            void createThreadRef.current({ cwd: request.cwd });
          }
        };
        consume();
        return subscribePending(consume);
      }, []);
      const markViewed = React18.useCallback((id) => {
        setUnread((previous) => {
          if (!previous.has(id)) return previous;
          const next = new Set(previous);
          next.delete(id);
          return next;
        });
        setViewedAt((previous) => {
          const next = { ...previous, [id]: Math.floor(Date.now() / 1e3) };
          try {
            window.localStorage.setItem(VIEWED_KEY, JSON.stringify(next));
          } catch {
          }
          return next;
        });
      }, []);
      React18.useEffect(() => {
        if (selectedId === null) return;
        markViewed(selectedId);
        try {
          window.localStorage.setItem(LAST_THREAD_KEY, selectedId);
        } catch {
        }
      }, [selectedId]);
      React18.useEffect(() => {
        void refresh();
        void refreshPending();
        api("models/list").then((list) => setModels(list)).catch(() => {
        });
        const quotaTimer = setInterval(() => void loadQuota(), 6e4);
        return () => clearInterval(quotaTimer);
      }, [api, refresh, refreshPending, loadQuota]);
      React18.useEffect(() => {
        const timer = setInterval(() => {
          void loadThreads(null, { limit: Math.max(THREAD_PAGE, threadsRef.current.length), silent: true });
        }, 2e4);
        return () => clearInterval(timer);
      }, [loadThreads]);
      React18.useEffect(() => {
        const close = openEventStream({
          onState: setStreamState,
          onEvent: (event) => {
            switch (event.type) {
              case "connection":
                setStatus(event.payload);
                void refreshPending();
                break;
              case "thread/upsert": {
                const thread = event.payload?.thread;
                if (thread !== null && thread !== void 0) setThreads((previous) => upsertThread(previous, thread));
                break;
              }
              case "thread/status":
                setThreads(
                  (previous) => previous.map(
                    (thread) => thread.id === event.threadId ? { ...thread, status: event.payload?.status ?? thread.status } : thread
                  )
                );
                break;
              case "thread/updated": {
                const name = event.payload?.name ?? null;
                setThreads(
                  (previous) => previous.map((thread) => thread.id === event.threadId ? { ...thread, name: name ?? thread.name } : thread)
                );
                setDetail(
                  (previous) => previous !== null && previous.thread.id === event.threadId && name !== null ? { ...previous, thread: { ...previous.thread, name } } : previous
                );
                void loadThreads(null, {
                  cwd: queryRef.current.cwd,
                  search: queryRef.current.search,
                  limit: Math.max(THREAD_PAGE, threadsRef.current.length),
                  silent: true
                });
                break;
              }
              case "thread/archived":
              case "thread/deleted":
                setThreads((previous) => previous.filter((thread) => thread.id !== event.threadId));
                if (event.threadId === selectedIdRef.current) setSelectedId(null);
                break;
              case "approval/requested": {
                const request = event.payload;
                if (request === null || request === void 0) break;
                setPending(
                  (previous) => previous.some((entry) => String(entry.requestId) === String(request.requestId)) ? previous : [...previous, request]
                );
                break;
              }
              case "approval/resolved": {
                const requestId = event.payload?.requestId;
                setPending((previous) => previous.filter((entry) => String(entry.requestId) !== String(requestId)));
                break;
              }
              case "resync":
                void refresh();
                void refreshPending();
                void loadQuota();
                break;
              case "account/rateLimits":
                void loadQuota();
                break;
              case "turn/started":
              case "turn/completed":
              case "item/upsert":
              case "item/delta":
              case "item/patch":
                setDetail((previous) => applyDetailEvent(previous, event));
                if (event.type === "turn/completed" && event.threadId !== void 0) {
                  if (event.threadId === selectedIdRef.current) {
                    markViewed(event.threadId);
                  } else {
                    setUnread((previous) => {
                      if (previous.has(event.threadId)) return previous;
                      const next = new Set(previous);
                      next.add(event.threadId);
                      return next;
                    });
                  }
                  if (!threadsRef.current.some((thread) => thread.id === event.threadId)) {
                    void loadThreads(null);
                  }
                }
                break;
              default:
                break;
            }
          }
        });
        return close;
      }, [refresh, refreshPending, loadThreads, loadQuota, markViewed]);
      React18.useEffect(() => {
        if (selectedId === null) {
          setDetail(null);
          return void 0;
        }
        let cancelled = false;
        setError(null);
        setDetailLoading(true);
        setDetail(null);
        setOlderCursor(null);
        setLoadingOlder(false);
        loadingOlderRef.current = false;
        api("threads/get", { threadId: selectedId, limit: TURN_PAGE }).then((next) => {
          if (cancelled) return;
          restoredRef.current = false;
          setDetail(next);
          setOlderCursor(next.nextCursor ?? null);
        }).catch((cause) => {
          if (cancelled) return;
          setError(messageOf(cause));
          if (restoredRef.current) {
            restoredRef.current = false;
            try {
              window.localStorage.removeItem(LAST_THREAD_KEY);
            } catch {
            }
            setSelectedId(null);
          }
        }).finally(() => {
          if (!cancelled) setDetailLoading(false);
        });
        return () => {
          cancelled = true;
        };
      }, [api, selectedId]);
      React18.useEffect(() => {
        if (selectedId === null) return void 0;
        let cancelled = false;
        let opened = false;
        setSessionPermission(null);
        setPlanMode(false);
        api("threads/open", { threadId: selectedId }).then(async () => {
          opened = true;
          if (cancelled) {
            void api("threads/close", { threadId: selectedId }).catch(() => {
            });
            return;
          }
          try {
            const settings = await api("threads/settings", { threadId: selectedId });
            if (!cancelled) {
              setSessionPermission(permissionFromSettings(settings));
              setPlanMode(settings?.collaborationMode?.mode === "plan");
            }
          } catch {
          }
        }).catch(() => {
        });
        return () => {
          cancelled = true;
          if (opened) void api("threads/close", { threadId: selectedId }).catch(() => {
          });
        };
      }, [api, selectedId]);
      const detailThreadId = detail?.thread.id ?? null;
      React18.useEffect(() => {
        if (detailThreadId === null || detail === null) return;
        setThreads(
          (previous) => previous.some((thread) => thread.id === detailThreadId) ? previous : upsertThread(previous, detail.thread)
        );
      }, [detailThreadId]);
      const activeTurnId = React18.useMemo(() => {
        if (detail === null) return null;
        for (let index = detail.turns.length - 1; index >= 0; index -= 1) {
          if (detail.turns[index].status === "inProgress") return detail.turns[index].id;
        }
        return null;
      }, [detail]);
      const loadOlder = React18.useCallback(async () => {
        if (selectedId === null || olderCursor === null || loadingOlderRef.current) return;
        loadingOlderRef.current = true;
        setLoadingOlder(true);
        const requestedFor = selectedId;
        try {
          const page = await api("threads/get", {
            threadId: selectedId,
            cursor: olderCursor,
            limit: TURN_PAGE
          });
          setDetail((previous) => {
            if (previous === null || previous.thread.id !== requestedFor) return previous;
            const known = new Set(previous.turns.map((turn) => turn.id));
            const older = page.turns.filter((turn) => !known.has(turn.id));
            if (older.length === 0) return previous;
            return { ...previous, turns: [...older, ...previous.turns] };
          });
          setOlderCursor(page.nextCursor ?? null);
        } catch (cause) {
          setError(messageOf(cause));
        } finally {
          loadingOlderRef.current = false;
          setLoadingOlder(false);
        }
      }, [api, selectedId, olderCursor]);
      const send = React18.useCallback(
        async (text, options = {}) => {
          if (selectedId === null) return;
          setError(null);
          const permission = options.permission ?? "ask";
          const model = options.model || detail?.thread.model || "";
          const effort = (options.effort || detail?.thread.reasoningEffort) ?? null;
          const collaborationMode = model === "" ? void 0 : {
            mode: planMode ? "plan" : "default",
            settings: { model, reasoning_effort: effort, developer_instructions: null }
          };
          const workspaceWrite = (networkAccess) => ({
            type: "workspaceWrite",
            writableRoots: [],
            networkAccess,
            excludeTmpdirEnvVar: false,
            excludeSlashTmp: false
          });
          const permissionPayload = permission === "full" ? { approvalPolicy: "never", approvalsReviewer: "user", sandboxPolicy: { type: "dangerFullAccess" } } : permission === "read" ? {
            approvalPolicy: "on-request",
            approvalsReviewer: "user",
            sandboxPolicy: { type: "readOnly", networkAccess: false }
          } : permission === "approve" ? {
            approvalPolicy: "on-request",
            approvalsReviewer: "auto_review",
            sandboxPolicy: workspaceWrite(true)
          } : {
            approvalPolicy: "on-request",
            approvalsReviewer: "user",
            sandboxPolicy: workspaceWrite(false)
          };
          try {
            await api("turns/start", {
              threadId: selectedId,
              text,
              model: options.model,
              effort: options.effort,
              attachments: options.attachments,
              ...collaborationMode === void 0 ? {} : { collaborationMode },
              ...permissionPayload
            });
            window.setTimeout(() => {
              void loadThreads(null);
            }, 2500);
          } catch (cause) {
            setError(messageOf(cause));
            throw cause;
          }
        },
        [api, selectedId, loadThreads, planMode, detail]
      );
      const steer = React18.useCallback(
        async (text) => {
          if (selectedId === null || activeTurnId === null) return;
          setError(null);
          try {
            await api("turns/steer", { threadId: selectedId, turnId: activeTurnId, text });
          } catch (cause) {
            setError(messageOf(cause));
            throw cause;
          }
        },
        [api, selectedId, activeTurnId]
      );
      const stop = React18.useCallback(async () => {
        if (selectedId === null || activeTurnId === null) return;
        setError(null);
        try {
          await api("turns/interrupt", { threadId: selectedId, turnId: activeTurnId });
        } catch (cause) {
          setError(messageOf(cause));
        }
      }, [api, selectedId, activeTurnId]);
      const respond = React18.useCallback(
        async (requestId, response) => {
          setError(null);
          try {
            await api("approvals/respond", { requestId, response });
            setPending((previous) => previous.filter((entry) => String(entry.requestId) !== String(requestId)));
          } catch (cause) {
            setError(messageOf(cause));
            throw cause;
          }
        },
        [api]
      );
      const createThread = React18.useCallback(
        async (request) => {
          const thread = await api("threads/new", request);
          if (thread !== null && thread !== void 0) {
            const cwd = thread.cwd ?? request.cwd;
            setThreads((previous) => upsertThread(previous, thread));
            setSelectedId(thread.id);
            setSelectedCwd(cwd);
            setPickerOpen(false);
            setDirPickerOpen(false);
            if (searchTimer.current !== null) {
              clearTimeout(searchTimer.current);
              searchTimer.current = null;
            }
            setSearch("");
            setProjects((previous) => upsertProject(previous, thread, cwd));
            void loadThreads(null, { cwd, search: "", keep: thread });
          }
        },
        [api, loadThreads]
      );
      createThreadRef.current = createThread;
      const currentCwd = detail?.thread.cwd ?? selectedCwd;
      React18.useEffect(() => {
        try {
          window.localStorage.setItem("dsh-codex-right-open", rightOpen ? "1" : "0");
        } catch {
        }
      }, [rightOpen]);
      const handleNew = React18.useCallback(() => {
        if (currentCwd !== null && currentCwd !== "") {
          void createThread({ cwd: currentCwd }).catch((cause) => setError(messageOf(cause)));
          return;
        }
        setPickerOpen(true);
      }, [currentCwd, createThread]);
      const openNewProject = React18.useCallback(() => {
        setPickerOpen(false);
        setDirPickerOpen(true);
      }, []);
      const exportThread = React18.useCallback(async () => {
        if (selectedId === null) return;
        try {
          const result = await api("threads/export", { threadId: selectedId });
          const blob = new Blob([result.content], { type: "text/markdown;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = result.filename;
          link.click();
          setTimeout(() => URL.revokeObjectURL(url), 2e3);
        } catch (cause) {
          setError(messageOf(cause));
        }
      }, [api, selectedId]);
      const compactThread = React18.useCallback(async () => {
        if (selectedId === null) return;
        try {
          await api("threads/compact", { threadId: selectedId });
        } catch (cause) {
          setError(messageOf(cause));
        }
      }, [api, selectedId]);
      const pickProject = React18.useCallback(
        async (cwd) => {
          await createThread({ cwd });
        },
        [createThread]
      );
      const visibleThreads = React18.useMemo(
        () => [...threads].sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0)),
        [threads]
      );
      const handleProjectToggle = React18.useCallback(
        (cwd) => {
          if (selectedCwd === cwd) {
            setSelectedCwd(null);
            return;
          }
          setSelectedCwd(cwd);
          setSearch("");
          if (searchTimer.current !== null) {
            clearTimeout(searchTimer.current);
            searchTimer.current = null;
          }
          void loadThreads(null, { cwd, search: "" });
        },
        [selectedCwd, loadThreads]
      );
      const detailCwd = detail?.thread.cwd ?? null;
      React18.useEffect(() => {
        if (detailCwd === null || detailCwd === "" || search.trim() !== "") return;
        if (selectedCwd === detailCwd) return;
        setSelectedCwd(detailCwd);
        void loadThreads(null, { cwd: detailCwd, search: "" });
      }, [detailCwd, search]);
      const handleThreadRenamed = React18.useCallback((id, name) => {
        setThreads((previous) => previous.map((thread) => thread.id === id ? { ...thread, name } : thread));
        setDetail(
          (previous) => previous !== null && previous.thread.id === id ? { ...previous, thread: { ...previous.thread, name } } : previous
        );
      }, []);
      const handleThreadChanged = React18.useCallback(() => {
        void loadThreads(null);
      }, [loadThreads]);
      const handleThreadDeleted = React18.useCallback((id) => {
        setThreads((previous) => previous.filter((thread) => thread.id !== id));
        if (selectedIdRef.current === id) {
          setSelectedId(null);
          setDetail(null);
        }
      }, []);
      const visiblePending = React18.useMemo(
        () => selectedId === null ? [] : pending2.filter((entry) => entry.params?.threadId === void 0 || entry.params.threadId === selectedId),
        [pending2, selectedId]
      );
      const totalThreads = projects.reduce((sum, project) => sum + project.threadCount, 0);
      const runningCount = projects.reduce((sum, project) => sum + project.activeCount, 0);
      return /* @__PURE__ */ React18.createElement(I18nContext.Provider, { value: t }, /* @__PURE__ */ React18.createElement("div", { className: "dsh-codex-root" }, /* @__PURE__ */ React18.createElement(
        FocusSidebar,
        {
          api,
          status,
          streamState,
          projects,
          totalThreads,
          runningCount,
          quota,
          quotaLoading,
          threads: visibleThreads,
          threadsOwner,
          unread,
          viewedAt,
          selectedCwd,
          selectedId,
          loading: loadingThreads,
          hasMore: nextCursor !== null,
          search,
          onSearch: handleSearch,
          onSelectProject: handleProjectToggle,
          onSelectThread: setSelectedId,
          onLoadMore: () => void loadThreads(nextCursor),
          onNew: handleNew,
          onNewProject: openNewProject,
          onVersions: () => setVersionsOpen(true),
          onRefresh: () => void refresh(),
          onExit,
          onThreadRenamed: handleThreadRenamed,
          onThreadChanged: handleThreadChanged,
          onThreadDeleted: handleThreadDeleted
        }
      ), /* @__PURE__ */ React18.createElement("main", { className: "dsh-codex-main" }, error !== null ? /* @__PURE__ */ React18.createElement("div", { className: "dsh-codex-error" }, error, /* @__PURE__ */ React18.createElement("button", { type: "button", className: "dsh-codex-button", style: { marginLeft: 8 }, onClick: () => void refresh() }, t("error.retry"))) : null, /* @__PURE__ */ React18.createElement(
        ThreadView,
        {
          api,
          detail,
          loading: detailLoading,
          selectedId,
          activeTurnId,
          models,
          permissionFromSession: sessionPermission,
          planMode,
          onEnterPlan: () => setPlanMode(true),
          onExitPlan: () => setPlanMode(false),
          hasOlder: olderCursor !== null,
          loadingOlder,
          onLoadOlder: loadOlder,
          pending: visiblePending,
          onRespond: respond,
          onSend: send,
          onSteer: steer,
          onStop: stop,
          onPickProject: () => setPickerOpen(true),
          onNew: handleNew,
          onCompact: compactThread,
          onDiff: () => {
            setRightOpen(true);
            setRightTab("git");
          },
          onExport: () => void exportThread(),
          actions: detail !== null ? /* @__PURE__ */ React18.createElement("div", { className: "dsh-codex-thread-actions" }, /* @__PURE__ */ React18.createElement(
            "button",
            {
              type: "button",
              className: "dsh-codex-button",
              onClick: () => setRightOpen((previous) => !previous)
            },
            rightOpen ? t("right.hide") : t("right.show")
          ), /* @__PURE__ */ React18.createElement(
            ThreadActions,
            {
              api,
              thread: detail.thread,
              onRenamed: (name) => handleThreadRenamed(detail.thread.id, name),
              onArchived: () => {
                setSelectedId(null);
                void loadThreads(null);
              },
              onForked: (thread) => {
                if (thread !== null && thread !== void 0) setSelectedId(thread.id);
              },
              onDeleted: () => handleThreadDeleted(detail.thread.id)
            }
          )) : null
        }
      )), /* @__PURE__ */ React18.createElement(
        RightPanel,
        {
          api,
          cwd: detail?.thread.cwd ?? selectedCwd ?? "",
          open: rightOpen,
          tab: rightTab,
          onTabChange: setRightTab,
          onClose: () => setRightOpen(false)
        }
      ), /* @__PURE__ */ React18.createElement(
        ProjectPickerDialog,
        {
          open: pickerOpen,
          projects,
          onPick: pickProject,
          onNewProject: openNewProject,
          onClose: () => setPickerOpen(false)
        }
      ), /* @__PURE__ */ React18.createElement(
        DirectoryPickerDialog,
        {
          open: dirPickerOpen,
          api,
          onPick: pickProject,
          onClose: () => setDirPickerOpen(false)
        }
      ), /* @__PURE__ */ React18.createElement(VersionsDialog, { open: versionsOpen, api, onClose: () => setVersionsOpen(false) })));
    }
    function permissionFromSettings(settings) {
      if (settings === null) return null;
      if (settings.sandbox?.type === "dangerFullAccess") return "full";
      if (settings.sandbox?.type === "readOnly") return "read";
      if (settings.approvalsReviewer === "auto_review") return "approve";
      if (settings.approvalPolicy === "never") return "full";
      return "ask";
    }

    // src/client/rpc.ts
    var CHANNEL = "/codex-cli";
    function createApi(call) {
      return async (endpoint, payload = {}) => {
        const envelope = await call(CHANNEL, endpoint, payload);
        if (envelope === null || envelope === void 0 || typeof envelope !== "object") {
          throw new Error("宿主返回了空响应");
        }
        if (envelope.ok === false) {
          const error = envelope.error ?? { code: "codex-cli/unknown", message: "请求失败" };
          const failure = new Error(error.message);
          failure.code = error.code;
          failure.details = error.details;
          throw failure;
        }
        return envelope.value;
      };
    }

    // src/client/styles.ts
    var STYLE_ID = "dsh-codex-cli-style";
    var CSS = `
    .dsh-codex-root,
    .dsh-codex-root *,
    .dsh-codex-root *::before,
    .dsh-codex-root *::after { box-sizing: border-box; }

    .dsh-codex-root {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      flex-direction: row;
      min-height: 0;
      overflow: hidden;
      background: var(--dsw-alias-bg-base, #ffffff);
      color: var(--dsw-alias-label-primary, #1a1a1a);
      font-family: var(--dsh-font-family-text, system-ui, -apple-system, "Segoe UI", sans-serif);
      font-size: var(--dsh-content-font-size, 14px);
      line-height: 1.55;
    }

    .dsh-codex-header {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: none;
      min-height: 48px;
      padding: 8px 14px;
      border-bottom: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.08));
    }

    .dsh-codex-title { display: flex; align-items: baseline; gap: 8px; min-width: 0; }
    .dsh-codex-title strong { font-size: 15px; font-weight: 600; letter-spacing: 0.01em; }
    .dsh-codex-title span { font-size: 12px; color: var(--dsw-alias-label-secondary, #6b6b6b); }
    .dsh-codex-spacer { flex: 1; }

    .dsh-codex-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      height: 22px;
      padding: 0 8px;
      border: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.1));
      border-radius: 999px;
      font-size: 11px;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
      white-space: nowrap;
    }

    .dsh-codex-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--dsw-alias-label-secondary, #9a9a9a);
      flex: none;
    }
    .dsh-codex-dot.ok { background: var(--dsw-alias-state-business-primary, #2f8f5b); }
    .dsh-codex-dot.done { background: #2f9e63; }
    .dsh-codex-dot.warn { background: #d29b2a; }
    .dsh-codex-dot.error { background: #cf4b4b; }
    .dsh-codex-dot.pulse { animation: dsh-codex-pulse 1.6s ease-in-out infinite; }

    @keyframes dsh-codex-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.35; }
    }

    .dsh-codex-button {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 26px;
      padding: 0 10px;
      border: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.12));
      border-radius: 7px;
      background: transparent;
      color: var(--dsw-alias-label-primary, #1a1a1a);
      font: inherit;
      font-size: 12px;
      cursor: pointer;
    }
    .dsh-codex-button:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); }
    .dsh-codex-button:disabled { opacity: 0.5; cursor: default; }

    .dsh-codex-body { display: flex; flex: 1; min-height: 0; }

    .dsh-codex-sidebar {
      display: flex;
      flex-direction: column;
      flex: none;
      width: 296px;
      min-height: 0;
      border-right: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.08));
    }

    .dsh-codex-sidebar-scroll { flex: 1; min-height: 0; overflow: auto; padding: 8px; }
    .dsh-codex-section-title {
      padding: 6px 8px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
    }
    .dsh-codex-section-head {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 2px 4px 6px;
    }
    .dsh-codex-section-head .dsh-codex-section-title { flex: none; padding: 0; }
    .dsh-codex-collapse {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      flex: none;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
      cursor: pointer;
    }
    .dsh-codex-collapse:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); }
    .dsh-codex-collapse svg { transition: transform 0.15s ease; }
    .dsh-codex-collapse.collapsed svg { transform: rotate(-90deg); }

    .dsh-codex-project,
    .dsh-codex-thread {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 7px 9px;
      border: none;
      border-radius: 7px;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    .dsh-codex-project:hover,
    .dsh-codex-thread:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); }
    .dsh-codex-project.active,
    .dsh-codex-thread.active {
      background: var(--dsw-alias-interactive-bg-active, rgba(0, 0, 0, 0.08));
    }

    .dsh-codex-project-main { display: flex; flex-direction: column; gap: 1px; min-width: 0; flex: 1; }
    .dsh-codex-project-name { font-size: 13px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dsh-codex-project-meta { font-size: 11px; color: var(--dsw-alias-label-secondary, #6b6b6b); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    .dsh-codex-row-menu { position: relative; display: inline-flex; flex: none; margin-left: 4px; }
    .dsh-codex-row-menu-trigger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      padding: 0;
      border: none;
      border-radius: 5px;
      background: transparent;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
      cursor: pointer;
      opacity: 0;
    }
    .dsh-codex-thread:hover .dsh-codex-row-menu-trigger,
    .dsh-codex-thread.active .dsh-codex-row-menu-trigger { opacity: 1; }
    .dsh-codex-row-menu-trigger:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.06)); }
    .dsh-codex-row-menu-backdrop { position: fixed; inset: 0; z-index: 45; }
    .dsh-codex-row-menu-pop {
      position: fixed;
      z-index: 46;
      width: 110px;
      padding: 4px;
      border-radius: 10px;
      background: var(--dsw-alias-bg-base, #ffffff);
      box-shadow:
        0 0 0 0.5px var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.12)),
        0 6px 20px rgba(0, 0, 0, 0.14);
    }
    .dsh-codex-row-menu-pop button {
      display: block;
      width: 100%;
      padding: 6px 8px;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: inherit;
      font: inherit;
      font-size: 12px;
      text-align: left;
      cursor: pointer;
    }
    .dsh-codex-row-menu-pop button:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); }
    .dsh-codex-row-menu-pop button.danger { color: #c0392b; }
    .dsh-codex-load-more {
      display: block;
      width: 100%;
      margin: 2px 0 6px;
      padding: 6px 8px;
      border: none;
      background: transparent;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
      font: inherit;
      font-size: 12px;
      text-align: center;
      cursor: pointer;
    }
    .dsh-codex-load-more:hover { color: var(--dsw-alias-label-primary, #1a1a1a); }
    .dsh-codex-load-more:disabled { opacity: 0.6; cursor: default; }
    .dsh-codex-thread-main { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
    .dsh-codex-thread-name { font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dsh-codex-thread-meta { font-size: 11px; color: var(--dsw-alias-label-secondary, #6b6b6b); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    .dsh-codex-search {
      width: 100%;
      height: 30px;
      margin: 2px 0 6px;
      padding: 0 9px;
      border: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.12));
      border-radius: 7px;
      background: transparent;
      color: inherit;
      font: inherit;
      font-size: 12px;
      outline: none;
    }
    .dsh-codex-search:focus { border-color: var(--dsw-alias-state-business-primary, #2f8f5b); }
    .dsh-codex-search.compact {
      flex: 1 1 auto;
      width: auto;
      min-width: 0;
      height: 26px;
      margin: 0;
      padding: 0 8px;
    }

    .dsh-codex-main { display: flex; flex-direction: column; flex: 1; min-width: 0; min-height: 0; }

    .dsh-codex-thread-header {
      flex: none;
      padding: 12px 18px;
      border-bottom: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.08));
    }
    .dsh-codex-thread-title { font-size: 15px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dsh-codex-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
    .dsh-codex-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      max-width: 100%;
      height: 21px;
      padding: 0 7px;
      border-radius: 5px;
      background: var(--dsw-alias-bg-layer-1, rgba(0, 0, 0, 0.04));
      color: var(--dsw-alias-label-secondary, #6b6b6b);
      font-size: 11px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .dsh-codex-chip code { font-family: var(--dsh-font-family-code, ui-monospace, monospace); font-size: 11px; }

    .dsh-codex-messages {
      display: flex;
      flex-direction: column;
      gap: 14px;
      flex: 1;
      min-height: 0;
      overflow: auto;
      padding: 16px 20px 28px;
    }

    .dsh-codex-messages > * { flex: none; }
    .dsh-codex-message { display: flex; flex-direction: column; gap: 5px; max-width: 100%; }
    .dsh-codex-message.user { align-items: flex-end; }
    .dsh-codex-message-head {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 11px;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
    }
    .dsh-codex-bubble {
      max-width: min(760px, 100%);
      padding: 0;
      border-radius: 0;
      background: transparent;
      overflow-wrap: anywhere;
    }
    .dsh-codex-message.user .dsh-codex-bubble {
      max-width: min(720px, 82%);
      padding: 10px 14px;
      border-radius: 16px 16px 6px 16px;
      background: rgba(65, 118, 230, 0.08);
      box-shadow:
        inset 0 0 0 1px rgba(65, 118, 230, 0.14),
        0 1px 2px rgba(15, 17, 21, 0.04);
    }
    .dsh-codex-text { white-space: pre-wrap; overflow-wrap: anywhere; }
    .dsh-codex-text code {
      padding: 1px 4px;
      border-radius: 4px;
      background: var(--dsw-alias-bg-layer-1, rgba(0, 0, 0, 0.06));
      font-family: var(--dsh-font-family-code, ui-monospace, monospace);
      font-size: 0.92em;
    }

    .dsh-codex-block {
      flex: none;
      border: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.08));
      border-radius: 9px;
      background: var(--dsw-alias-bg-layer-1, rgba(0, 0, 0, 0.02));
      overflow: hidden;
    }
    .dsh-codex-block-head {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 10px;
      border-bottom: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.07));
      font-size: 12px;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
    }
    .dsh-codex-block-head > * { flex: none; }
    .dsh-codex-block-head > .dsh-codex-block-title { flex: 1 1 auto; min-width: 0; }
    .dsh-codex-block > summary { list-style: none; cursor: pointer; user-select: none; }
    .dsh-codex-block > summary::-webkit-details-marker { display: none; }
    .dsh-codex-block:not([open]) > summary { border-bottom-color: transparent; }
    .dsh-codex-caret {
      width: 0;
      height: 0;
      flex: none;
      border-left: 4px solid currentColor;
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      transition: transform 120ms ease;
      opacity: 0.7;
    }
    .dsh-codex-block[open] > summary .dsh-codex-caret { transform: rotate(90deg); }
    .dsh-codex-block-title {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--dsw-alias-label-primary, #1a1a1a);
    }
    .dsh-codex-block-body { padding: 9px 10px; }
    .dsh-codex-code { margin: 10px 0; border: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.1)); border-radius: 10px; overflow: hidden; background: rgba(0, 0, 0, 0.025); }
    .dsh-codex-code-head { display: flex; align-items: center; gap: 8px; padding: 5px 10px; border-bottom: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.07)); font-size: 11px; color: var(--dsw-alias-label-secondary, #6b6b6b); }
    .dsh-codex-code-lang { font-family: var(--dsh-font-family-code, ui-monospace, monospace); }
    .dsh-codex-code-copy { margin-left: auto; padding: 2px 6px; border: none; border-radius: 5px; background: transparent; color: inherit; font: inherit; font-size: 11px; cursor: pointer; }
    .dsh-codex-code-copy:hover { background: rgba(0, 0, 0, 0.06); }
    .dsh-codex-code .dsh-codex-pre { margin: 0; border: none; border-radius: 0; background: transparent; }
    .dsh-codex-code-line { min-height: 1.5em; }
    .dsh-codex-tok.comment { color: #8a8f95; font-style: italic; }
    .dsh-codex-tok.string { color: #b26a00; }
    .dsh-codex-tok.number { color: #8250df; }
    .dsh-codex-tok.keyword { color: #0550ae; }
    .dsh-codex-diff-line { min-height: 1.5em; padding: 0 4px; }
    .dsh-codex-diff-line.add { background: rgba(46, 160, 67, 0.12); }
    .dsh-codex-diff-line.del { background: rgba(207, 75, 75, 0.12); }
    .dsh-codex-diff-line.hunk { color: #0550ae; background: rgba(5, 80, 174, 0.06); }
    .dsh-codex-markdown h1, .dsh-codex-markdown h2, .dsh-codex-markdown h3 { margin: 14px 0 6px; line-height: 1.35; }
    .dsh-codex-markdown h1 { font-size: 20px; }
    .dsh-codex-markdown h2 { font-size: 17px; }
    .dsh-codex-markdown h3 { font-size: 15px; }
    .dsh-codex-markdown ul, .dsh-codex-markdown ol { margin: 6px 0; padding-left: 22px; }
    .dsh-codex-markdown li { margin: 2px 0; }
    .dsh-codex-markdown blockquote { margin: 8px 0; padding: 2px 0 2px 10px; border-left: 3px solid rgba(0, 0, 0, 0.15); color: var(--dsw-alias-label-secondary, #4a4f55); }
    .dsh-codex-markdown table { margin: 8px 0; border-collapse: collapse; font-size: 12px; }
    .dsh-codex-markdown th, .dsh-codex-markdown td { padding: 4px 10px; border: 1px solid rgba(0, 0, 0, 0.1); text-align: left; }
    .dsh-codex-markdown th { background: rgba(0, 0, 0, 0.03); }
    .dsh-codex-markdown code:not(pre code) { padding: 1px 5px; border-radius: 5px; background: rgba(0, 0, 0, 0.06); font-family: var(--dsh-font-family-code, ui-monospace, monospace); font-size: 0.92em; }
    .dsh-codex-markdown a { color: #0969da; }
    .dsh-codex-markdown hr { margin: 12px 0; border: none; border-top: 1px solid rgba(0, 0, 0, 0.1); }
    .dsh-codex-pre {
      margin: 0;
      max-height: 340px;
      overflow: auto;
      font-family: var(--dsh-font-family-code, ui-monospace, monospace);
      font-size: 12px;
      line-height: 1.5;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
    .dsh-codex-summary {
      cursor: pointer;
      font-size: 12px;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
      user-select: none;
    }

    .dsh-codex-command {
      font-family: var(--dsh-font-family-code, ui-monospace, monospace);
      font-size: 12px;
      overflow-wrap: anywhere;
    }

    .dsh-codex-reasoning { flex: none; border-left: 2px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.12)); padding-left: 10px; }
    .dsh-codex-reasoning summary {
      cursor: pointer;
      font-size: 12px;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
      user-select: none;
    }
    .dsh-codex-reasoning-body { margin-top: 6px; font-size: 13px; color: var(--dsw-alias-label-secondary, #6b6b6b); white-space: pre-wrap; }

    .dsh-codex-files { display: flex; flex-direction: column; gap: 8px; }
    .dsh-codex-file-path { font-family: var(--dsh-font-family-code, ui-monospace, monospace); font-size: 12px; }

    .dsh-codex-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      flex: 1;
      padding: 40px;
      text-align: center;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
    }
    .dsh-codex-empty strong { color: var(--dsw-alias-label-primary, #1a1a1a); font-weight: 600; }
    .dsh-codex-empty small { font-size: 12px; }

    .dsh-codex-error {
      margin: 12px 18px;
      padding: 10px 12px;
      border: 1px solid rgba(207, 75, 75, 0.4);
      border-radius: 9px;
      background: rgba(207, 75, 75, 0.08);
      color: #a83232;
      font-size: 12px;
      overflow-wrap: anywhere;
    }

    .dsh-codex-loading { padding: 12px 8px; font-size: 12px; color: var(--dsw-alias-label-secondary, #6b6b6b); }

    .dsh-codex-divider {
      flex: none;
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--dsw-alias-label-secondary, #8a8a8a);
      font-size: 11px;
    }
    .dsh-codex-divider::before,
    .dsh-codex-divider::after {
      content: "";
      flex: 1;
      height: 1px;
      background: var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.08));
    }

    .dsh-codex-running-bar { display: flex; align-items: center; gap: 6px; padding: 6px 18px 0; font-size: 12px; color: #4176e6; }
    .dsh-codex-running-spinner { width: 12px; height: 12px; flex: none; border: 1.6px solid rgba(65, 118, 230, 0.25); border-top-color: #4176e6; border-radius: 50%; animation: dsh-codex-spin 0.8s linear infinite; }
    @keyframes dsh-codex-spin { to { transform: rotate(360deg); } }
    .dsh-codex-composer-wrap {
      position: relative;
      display: flex;
      justify-content: center;
      flex: none;
      padding: 8px 18px 16px;
    }
    .dsh-codex-composer-card {
      position: relative;
      display: flex;
      flex-direction: column;
      width: min(774px, 100%);
      padding: 8px 0 0;
      border-radius: 28px;
      background: var(--dsw-alias-bg-base, #ffffff);
      box-shadow:
        0 0 0 0.5px var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.1)),
        0 4px 16px rgba(0, 0, 0, 0.03),
        0 0 24px rgba(0, 0, 0, 0.03);
    }
    .dsh-codex-composer-input {
      width: 100%;
      min-height: 52px;
      max-height: 200px;
      padding: 4px 16px 0;
      border: none;
      background: transparent;
      color: inherit;
      font: inherit;
      font-size: 14px;
      line-height: 1.55;
      resize: none;
      outline: none;
      overflow-y: auto;
    }
    .dsh-codex-composer-input::placeholder { color: var(--dsw-alias-label-secondary, #adb2b8); }
    .dsh-codex-composer-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 2px 8px 6px;
    }
    .dsh-codex-composer-tools { display: flex; align-items: center; gap: 8px; min-height: 28px; }
    .dsh-codex-composer-spacer { flex: 1; }
    .dsh-codex-composer-trailing { display: flex; align-items: center; gap: 8px; }
    .dsh-codex-running {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 28px;
      padding: 0 8px;
      font-size: 12px;
      color: var(--dsw-alias-label-secondary, #61666b);
    }
    .dsh-codex-plan-tag {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      flex: none;
      height: 22px;
      padding: 0 2px 0 8px;
      border: 1px solid rgba(47, 143, 91, 0.35);
      border-radius: 999px;
      background: rgba(47, 143, 91, 0.12);
      color: var(--dsw-alias-state-business-primary, #2f8f5b);
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
    }
    .dsh-codex-plan-tag button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: inherit;
      cursor: pointer;
    }
    .dsh-codex-plan-tag button:hover { background: rgba(47, 143, 91, 0.18); }
    .dsh-codex-model-trigger {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      max-width: 280px;
      height: 28px;
      padding: 0 4px 0 8px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: var(--dsw-alias-label-secondary, #61666b);
      font: inherit;
      font-size: 13px;
      cursor: pointer;
    }
    .dsh-codex-model-trigger:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); }
    .dsh-codex-model-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dsh-codex-model-effort { color: var(--dsw-alias-label-secondary, #8a8f95); white-space: nowrap; }
    .dsh-codex-stop,
    .dsh-codex-send {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      flex: none;
      border: none;
      border-radius: 999px;
      cursor: pointer;
    }
    .dsh-codex-stop {
      border: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.14));
      background: transparent;
      color: var(--dsw-alias-label-secondary, #61666b);
    }
    .dsh-codex-stop:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); }
    .dsh-codex-send { background: #4176e6; color: #ffffff; }
    .dsh-codex-send:hover { background: #3a6bd4; }
    .dsh-codex-send:disabled {
      background: rgba(65, 118, 230, 0.35);
      color: #ffffff;
      cursor: default;
    }
    .dsh-codex-menu-backdrop { position: fixed; inset: 0; z-index: 28; }
    .dsh-codex-menu {
      position: absolute;
      right: 8px;
      bottom: 46px;
      z-index: 29;
      width: min(340px, calc(100vw - 48px));
      max-height: 380px;
      overflow: auto;
      padding: 4px;
      border-radius: 16px;
      background: var(--dsw-alias-bg-base, #ffffff);
      box-shadow:
        0 0 0 0.5px var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.1)),
        0 3px 8px rgba(0, 0, 0, 0.06),
        0 0 20px rgba(0, 0, 0, 0.06);
    }
    .dsh-codex-menu-list { max-height: 252px; overflow: auto; }
    .dsh-codex-menu-title {
      padding: 6px 8px 2px;
      font-size: 11px;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
    }
    .dsh-codex-menu-item {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      width: 100%;
      padding: 7px 8px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    .dsh-codex-menu-item:hover,
    .dsh-codex-menu-item.selected { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); }
    .dsh-codex-menu-check {
      display: inline-flex;
      width: 16px;
      padding-top: 2px;
      color: var(--dsw-alias-state-business-primary, #4176e6);
    }
    .dsh-codex-menu-meta { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
    .dsh-codex-menu-name { font-size: 13px; }
    .dsh-codex-menu-desc {
      font-size: 11px;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .dsh-codex-menu-seg { display: flex; gap: 4px; padding: 4px 8px 8px; }
    .dsh-codex-menu-seg button {
      flex: 1;
      height: 28px;
      border: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.14));
      border-radius: 7px;
      background: transparent;
      color: inherit;
      font: inherit;
      font-size: 12px;
      cursor: pointer;
    }
    .dsh-codex-menu-seg button.active {
      border-color: #4176e6;
      background: rgba(65, 118, 230, 0.1);
      color: #4176e6;
    }
    .dsh-codex-hint { margin-right: auto; font-size: 11px; color: var(--dsw-alias-label-secondary, #6b6b6b); }
    .dsh-codex-button.primary {
      border-color: transparent;
      background: var(--dsw-alias-state-business-primary, #2f8f5b);
      color: #ffffff;
    }
    .dsh-codex-button.primary:hover { background: var(--dsw-alias-state-business-primary, #2f8f5b); filter: brightness(1.06); }

    .dsh-codex-approvals {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: none;
      max-height: 42vh;
      overflow: auto;
      padding: 0 18px 10px;
    }
    .dsh-codex-approval {
      display: flex;
      flex-direction: column;
      gap: 7px;
      padding: 10px 12px;
      border: 1px solid rgba(210, 155, 42, 0.45);
      border-radius: 9px;
      background: rgba(210, 155, 42, 0.07);
    }
    .dsh-codex-approval.busy { opacity: 0.7; }
    .dsh-codex-approval-head { display: flex; align-items: center; gap: 7px; font-size: 12px; }
    .dsh-codex-approval-meta { font-size: 12px; color: var(--dsw-alias-label-secondary, #6b6b6b); overflow-wrap: anywhere; }
    .dsh-codex-approval-actions { display: flex; justify-content: flex-end; gap: 8px; }
    .dsh-codex-question { display: flex; flex-direction: column; gap: 6px; }
    .dsh-codex-question-title { font-size: 13px; font-weight: 600; }
    .dsh-codex-question-body { font-size: 12px; color: var(--dsw-alias-label-secondary, #6b6b6b); }
    .dsh-codex-options { display: flex; flex-wrap: wrap; gap: 6px; }
    .dsh-codex-option {
      padding: 5px 10px;
      border: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.14));
      border-radius: 7px;
      background: transparent;
      color: inherit;
      font: inherit;
      font-size: 12px;
      cursor: pointer;
    }
    .dsh-codex-option.selected {
      border-color: var(--dsw-alias-state-business-primary, #2f8f5b);
      background: rgba(47, 143, 91, 0.12);
    }

    .dsh-codex-dialog-backdrop {
      position: fixed;
      inset: 0;
      z-index: 120;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.38);
    }
    .dsh-codex-dialog {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: min(440px, calc(100vw - 32px));
      max-height: calc(100vh - 64px);
      overflow: auto;
      padding: 16px;
      border-radius: 12px;
      background: var(--dsw-alias-bg-base, #ffffff);
      box-shadow: 0 18px 60px rgba(0, 0, 0, 0.28);
    }
    .dsh-codex-dialog-head { font-size: 15px; font-weight: 600; }
    .dsh-codex-field { display: flex; flex-direction: column; gap: 5px; flex: 1; font-size: 12px; color: var(--dsw-alias-label-secondary, #6b6b6b); }
    .dsh-codex-field-row { display: flex; gap: 10px; }
    .dsh-codex-select {
      height: 30px;
      padding: 0 8px;
      border: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.14));
      border-radius: 7px;
      background: transparent;
      color: var(--dsw-alias-label-primary, #1a1a1a);
      font: inherit;
      font-size: 12px;
    }
    .dsh-codex-dialog-error { color: #a83232; font-size: 12px; }
    .dsh-codex-dialog-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px; }

    .dsh-codex-versions { width: min(620px, calc(100vw - 32px)); }
    .dsh-codex-version-grid {
      display: grid;
      grid-template-columns: 88px 1fr;
      gap: 6px 10px;
      font-size: 12px;
    }
    .dsh-codex-version-grid span { color: var(--dsw-alias-label-secondary, #6b6b6b); }
    .dsh-codex-version-actions { display: flex; align-items: center; gap: 8px; }
    .dsh-codex-version-daemon { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .dsh-codex-version-doctor { display: flex; flex-direction: column; gap: 4px; }
    .dsh-codex-doctor-row { display: flex; align-items: center; gap: 7px; font-size: 12px; }
    .dsh-codex-doctor-id {
      min-width: 150px;
      font-family: var(--dsh-font-family-code, ui-monospace, monospace);
      font-size: 11px;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
    }
    .dsh-codex-doctor-summary { color: var(--dsw-alias-label-primary, #1a1a1a); }
    .dsh-codex-job { display: flex; flex-direction: column; gap: 6px; }
    .dsh-codex-job-log { max-height: 180px; }

    .dsh-codex-thread-header-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    .dsh-codex-thread-actions { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; flex: none; }
    .dsh-codex-button.danger { color: #b23b3b; border-color: rgba(178, 59, 59, 0.35); }
    .dsh-codex-button.danger:hover { background: rgba(178, 59, 59, 0.08); }
    .dsh-codex-action-error { font-size: 11px; color: #a83232; }

    .dsh-codex-markdown { overflow-wrap: anywhere; }
    .dsh-codex-markdown > :first-child { margin-top: 0; }
    .dsh-codex-markdown > :last-child { margin-bottom: 0; }
    .dsh-codex-markdown p { margin: 0 0 8px; }
    .dsh-codex-markdown h1,
    .dsh-codex-markdown h2,
    .dsh-codex-markdown h3,
    .dsh-codex-markdown h4 { margin: 14px 0 6px; font-weight: 600; line-height: 1.35; }
    .dsh-codex-markdown h1 { font-size: 17px; }
    .dsh-codex-markdown h2 { font-size: 15px; }
    .dsh-codex-markdown h3 { font-size: 14px; }
    .dsh-codex-markdown h4 { font-size: 13px; }
    .dsh-codex-markdown ul,
    .dsh-codex-markdown ol { margin: 6px 0 8px; padding-left: 22px; }
    .dsh-codex-markdown li { margin: 2px 0; }
    .dsh-codex-markdown blockquote {
      margin: 8px 0;
      padding: 2px 0 2px 10px;
      border-left: 3px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.14));
      color: var(--dsw-alias-label-secondary, #6b6b6b);
    }
    .dsh-codex-markdown code {
      padding: 1px 4px;
      border-radius: 4px;
      background: var(--dsw-alias-bg-layer-1, rgba(0, 0, 0, 0.06));
      font-family: var(--dsh-font-family-code, ui-monospace, monospace);
      font-size: 0.92em;
    }
    .dsh-codex-markdown pre {
      margin: 8px 0;
      padding: 9px 10px;
      border: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.08));
      border-radius: 8px;
      background: var(--dsw-alias-bg-layer-1, rgba(0, 0, 0, 0.03));
      overflow: auto;
      max-height: 360px;
    }
    .dsh-codex-markdown pre code {
      padding: 0;
      background: transparent;
      font-size: 12px;
      line-height: 1.5;
      white-space: pre;
    }
    .dsh-codex-markdown table {
      margin: 8px 0;
      border-collapse: collapse;
      font-size: 12px;
    }
    .dsh-codex-markdown th,
    .dsh-codex-markdown td {
      padding: 4px 8px;
      border: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.12));
      text-align: left;
      vertical-align: top;
    }
    .dsh-codex-markdown th { background: var(--dsw-alias-bg-layer-1, rgba(0, 0, 0, 0.04)); font-weight: 600; }
    .dsh-codex-markdown a { color: var(--dsw-alias-state-business-primary, #2f8f5b); text-decoration: underline; }
    .dsh-codex-markdown hr {
      margin: 10px 0;
      border: none;
      border-top: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.1));
    }

    .dsh-codex-tab { display: flex; flex-direction: column; gap: 8px; height: 100%; min-height: 0; padding: 10px; }
    .dsh-codex-tab-head { display: flex; align-items: center; gap: 8px; }
    .dsh-codex-tab-title { display: flex; flex-direction: column; gap: 1px; min-width: 0; flex: 1; }
    .dsh-codex-tab-title strong { font-size: 13px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dsh-codex-tab-title span { font-size: 11px; color: var(--dsw-alias-label-secondary, #6b6b6b); }
    .dsh-codex-tab-actions { display: flex; gap: 6px; }
    .dsh-codex-tab-list { flex: 1; min-height: 0; overflow: auto; display: flex; flex-direction: column; gap: 2px; }

    .dsh-codex-image { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; margin: 4px 0; }
    .dsh-codex-image img {
      max-width: min(760px, 100%);
      max-height: 440px;
      border: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.1));
      border-radius: 8px;
      background: var(--dsw-alias-bg-layer-1, rgba(0, 0, 0, 0.03));
      object-fit: contain;
    }
    .dsh-codex-image figcaption {
      font-family: var(--dsh-font-family-code, ui-monospace, monospace);
      font-size: 11px;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
    }
    .dsh-codex-image-placeholder {
      padding: 10px 12px;
      border: 1px dashed var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.16));
      border-radius: 8px;
      font-size: 12px;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
    }
    .dsh-codex-menu-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      height: 36px;
      padding: 0 8px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: inherit;
      font: inherit;
      font-size: 13px;
      cursor: pointer;
    }
    .dsh-codex-menu-cell:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); }
    .dsh-codex-menu-cell-label { color: var(--dsw-alias-label-secondary, #6b6b6b); }
    .dsh-codex-menu-cell-value {
      margin-left: auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--dsw-alias-label-primary, #1a1a1a);
    }
    .dsh-codex-menu-back {
      display: flex;
      align-items: center;
      gap: 4px;
      width: 100%;
      padding: 6px 8px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
      font: inherit;
      font-size: 12px;
      cursor: pointer;
    }
    .dsh-codex-menu-back:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); }
    .dsh-codex-menu-tag { margin-left: 6px; font-size: 11px; color: var(--dsw-alias-label-secondary, #6b6b6b); }
    .dsh-codex-menu-tag.current { color: #4176e6; }
    .dsh-codex-menu-warning { padding: 0 8px 6px; font-size: 11px; color: #b7791f; }
    .dsh-codex-message-time {
      font-size: 11px;
      color: var(--dsw-alias-label-secondary, #8a8f95);
    }
    .dsh-codex-turn-footer {
      flex: none;
      margin: 2px 0 10px;
      font-family: var(--dsh-font-family-code, ui-monospace, monospace);
      font-size: 11px;
      color: var(--dsw-alias-label-secondary, #8a8f95);
    }
    .dsh-codex-messages-wrap { position: relative; display: flex; flex-direction: column; flex: 1; min-height: 0; }
    .dsh-codex-jump {
      position: absolute;
      right: 18px;
      bottom: 14px;
      z-index: 5;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.1));
      border-radius: 999px;
      background: var(--dsw-alias-bg-base, #ffffff);
      color: var(--dsw-alias-label-secondary, #61666b);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
      cursor: pointer;
    }
    .dsh-codex-jump:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); }
    .dsh-codex-load-older {
      flex: none;
      align-self: center;
      padding: 4px 12px;
      border: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.12));
      border-radius: 999px;
      background: transparent;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
      font: inherit;
      font-size: 12px;
      cursor: pointer;
    }
    .dsh-codex-load-older:disabled { opacity: 0.6; cursor: default; }
    .dsh-codex-tool-group { display: flex; flex-direction: column; gap: 6px; }
    .dsh-codex-tool-group-head {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 2px;
      border: none;
      background: transparent;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
      font: inherit;
      font-size: 12px;
      text-align: left;
      cursor: pointer;
    }
    .dsh-codex-tool-group-head:hover .dsh-codex-tool-group-title { color: var(--dsw-alias-label-primary, #1a1a1a); }
    .dsh-codex-tool-group-chevron { display: inline-flex; transition: transform 0.15s ease; }
    .dsh-codex-tool-group-chevron.open { transform: rotate(180deg); }
    .dsh-codex-tool-group-body {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding-left: 10px;
      border-left: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.08));
    }
    .dsh-codex-focus-sidebar {
      display: flex;
      flex-direction: column;
      flex: none;
      width: 288px;
      min-height: 0;
      border-right: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.08));
      background: var(--dsw-alias-bg-base, #ffffff);
    }
    .dsh-codex-focus-brand { display: flex; align-items: center; gap: 9px; padding: 14px 14px 6px; }
    .dsh-codex-focus-logo { display: inline-flex; color: inherit; }
    .dsh-codex-focus-brand-text { display: flex; flex-direction: column; line-height: 1.2; min-width: 0; }
    .dsh-codex-focus-brand-text strong { font-size: 15px; font-weight: 600; }
    .dsh-codex-focus-brand-text small { font-size: 11px; color: var(--dsw-alias-label-secondary, #6b6b6b); }
    .dsh-codex-focus-status { display: flex; gap: 6px; padding: 2px 14px 6px; }
    .dsh-codex-status-pill .dsh-codex-dot.ok { background: #2f9e63; }
    .dsh-codex-status-pill .dsh-codex-dot.warn { background: #d29b2a; }
    .dsh-codex-status-pill .dsh-codex-dot.error { background: #cf4b4b; }
    .dsh-codex-status-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      height: 20px;
      padding: 0 8px;
      border-radius: 999px;
      background: var(--dsw-alias-bg-layer-1, rgba(0, 0, 0, 0.04));
      font-size: 11px;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
    }
    .dsh-codex-focus-info {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 3px 10px;
      margin: 0;
      padding: 2px 14px 10px;
      font-size: 11px;
    }
    .dsh-codex-focus-info dt { color: var(--dsw-alias-label-secondary, #6b6b6b); }
    .dsh-codex-focus-info dd {
      margin: 0;
      color: var(--dsw-alias-label-primary, #1a1a1a);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .dsh-codex-quota { font-variant-numeric: tabular-nums; }
    .dsh-codex-focus-actions { display: flex; gap: 6px; padding: 0 14px 8px; }
    .dsh-codex-focus-actions .dsh-codex-button { flex: 1; justify-content: center; padding: 4px 8px; font-size: 12px; }
    .dsh-codex-focus-search-row { display: flex; align-items: center; gap: 6px; margin: 0 14px 8px; }
    .dsh-codex-search.focus { flex: 1; min-width: 0; width: auto; height: 30px; margin: 0; }
    .dsh-codex-icon-button.focus-new-project {
      flex: none;
      width: 30px;
      height: 30px;
      border: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.12));
      border-radius: 7px;
    }
    .dsh-codex-icon-button.focus-new-project:hover { color: var(--dsw-alias-label-primary, #1a1a1a); }
    .dsh-codex-focus-tree { flex: 1; min-height: 0; overflow: auto; padding: 2px 8px 8px; }
    .dsh-codex-focus-section {
      padding: 6px 8px 2px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
    }
    .dsh-codex-tree-project {
      display: flex;
      align-items: center;
      gap: 6px;
      width: 100%;
      height: 34px;
      padding: 0 8px;
      border: none;
      border-radius: 12px;
      background: transparent;
      color: inherit;
      font: inherit;
      font-size: 14px;
      text-align: left;
      cursor: pointer;
    }
    .dsh-codex-tree-project:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); }
    .dsh-codex-tree-project.expanded { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); }
    .dsh-codex-tree-project-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dsh-codex-tree-project-count { font-size: 11px; color: var(--dsw-alias-label-secondary, #6b6b6b); }
    .dsh-codex-tree-sessions { display: flex; flex-direction: column; gap: 2px; padding: 2px 0 6px 16px; }
    .dsh-codex-tree-sessions .dsh-codex-thread { min-height: 32px; padding: 4px 8px; border-radius: 12px; }
    .dsh-codex-focus-sidebar .dsh-codex-thread-name { font-size: 14px; }
    .dsh-codex-focus-footer { flex: none; padding: 8px; border-top: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.08)); }
    .dsh-codex-exit {
      display: flex;
      align-items: center;
      gap: 6px;
      width: 100%;
      padding: 7px 10px;
      border: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.12));
      border-radius: 8px;
      background: transparent;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
      font: inherit;
      font-size: 12px;
      cursor: pointer;
    }
    .dsh-codex-exit:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); color: var(--dsw-alias-label-primary, #1a1a1a); }
    .dsh-codex-picker { width: min(560px, 92vw); max-height: 84vh; overflow: auto; }
    .dsh-codex-picker-section {
      margin: 10px 0 4px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
    }
    .dsh-codex-picker-list { display: flex; flex-direction: column; gap: 2px; max-height: 220px; overflow: auto; }
    .dsh-codex-picker-item {
      display: flex;
      flex-direction: column;
      gap: 1px;
      width: 100%;
      padding: 7px 9px;
      border: 1px solid transparent;
      border-radius: 8px;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    .dsh-codex-picker-item:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); }
    .dsh-codex-picker-item:disabled { opacity: 0.6; cursor: default; }
    .dsh-codex-picker-name { font-size: 13px; }
    .dsh-codex-picker-path {
      font-family: var(--dsh-font-family-code, ui-monospace, monospace);
      font-size: 11px;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .dsh-codex-picker .dsh-codex-dialog-actions { justify-content: space-between; }

    /* 新建项目：Miller 分栏目录浏览器 */
    .dsh-codex-browse {
      width: min(760px, calc(100vw - 32px));
      height: min(560px, calc(100vh - 64px));
      max-height: calc(100vh - 64px);
      gap: 0;
      padding: 0;
      overflow: hidden;
    }
    .dsh-codex-browse:focus { outline: none; }
    .dsh-codex-browse-head {
      display: flex;
      align-items: center;
      gap: 6px;
      flex: none;
      padding: 12px 14px 10px;
    }
    .dsh-codex-browse-title { flex: none; margin-right: 4px; font-size: 15px; font-weight: 600; }
    .dsh-codex-browse-crumbs {
      display: flex;
      align-items: center;
      gap: 1px;
      flex: 1;
      min-width: 0;
      overflow-x: auto;
      white-space: nowrap;
      scrollbar-width: none;
    }
    .dsh-codex-browse-crumbs::-webkit-scrollbar { display: none; }
    .dsh-codex-browse-crumb {
      flex: none;
      max-width: 170px;
      padding: 2px 5px;
      border: none;
      border-radius: 5px;
      background: transparent;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
      font: inherit;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }
    .dsh-codex-browse-crumb:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); color: var(--dsw-alias-label-primary, #1a1a1a); }
    .dsh-codex-browse-crumb.current { color: var(--dsw-alias-label-primary, #1a1a1a); font-weight: 600; cursor: default; }
    .dsh-codex-browse-chevron { flex: none; font-size: 11px; color: var(--dsw-alias-label-secondary, #6b6b6b); opacity: 0.6; }
    .dsh-codex-browse-path { flex: 1; }
    .dsh-codex-browse-body { display: flex; flex: 1; min-height: 0; border-top: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.08)); }
    .dsh-codex-browse-col {
      display: flex;
      flex-direction: column;
      gap: 1px;
      flex: 1;
      min-width: 0;
      overflow: auto;
      padding: 6px;
    }
    .dsh-codex-browse-col + .dsh-codex-browse-col { border-left: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.08)); }
    .dsh-codex-browse-col-head {
      flex: none;
      padding: 2px 8px 6px;
      font-size: 11px;
      font-weight: 600;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .dsh-codex-browse-row-wrap {
      display: flex;
      align-items: center;
      flex: none;
      border-radius: 7px;
    }
    .dsh-codex-browse-row-wrap:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); }
    .dsh-codex-browse-row-wrap.selected { background: rgba(47, 143, 91, 0.12); }
    .dsh-codex-browse-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      min-width: 0;
      width: 100%;
      padding: 6px 8px;
      border: none;
      border-radius: 7px;
      background: transparent;
      color: inherit;
      font: inherit;
      font-size: 13px;
      text-align: left;
      cursor: pointer;
    }
    .dsh-codex-browse-row:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); }
    .dsh-codex-browse-row-wrap .dsh-codex-browse-row:hover { background: transparent; }
    .dsh-codex-browse-col > .dsh-codex-browse-row { flex: none; width: 100%; }
    .dsh-codex-browse-row:disabled { opacity: 0.6; cursor: default; }
    .dsh-codex-browse-enter {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: none;
      width: 24px;
      height: 24px;
      margin-right: 4px;
      border: none;
      border-radius: 5px;
      background: transparent;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
      opacity: 0.45;
      cursor: pointer;
    }
    .dsh-codex-browse-row-wrap:hover .dsh-codex-browse-enter,
    .dsh-codex-browse-row-wrap.selected .dsh-codex-browse-enter,
    .dsh-codex-browse-enter:focus-visible { opacity: 1; }
    .dsh-codex-browse-enter:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); color: var(--dsw-alias-label-primary, #1a1a1a); }
    .dsh-codex-browse-glyph { flex: none; color: var(--dsw-alias-label-secondary, #6b6b6b); }
    .dsh-codex-browse-row-wrap.selected .dsh-codex-browse-glyph { color: var(--dsw-alias-state-business-primary, #2f8f5b); }
    .dsh-codex-browse-row-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dsh-codex-browse-empty { flex: none; padding: 10px 8px; font-size: 12px; color: var(--dsw-alias-label-secondary, #6b6b6b); }
    .dsh-codex-browse-note { flex: none; padding: 4px 14px; font-size: 11px; color: var(--dsw-alias-label-secondary, #6b6b6b); }
    .dsh-codex-browse-create {
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: none;
      padding: 8px 14px;
      border-top: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.08));
      background: var(--dsw-alias-bg-layer-1, rgba(0, 0, 0, 0.03));
    }
    .dsh-codex-browse-create-label { font-size: 12px; color: var(--dsw-alias-label-secondary, #6b6b6b); }
    .dsh-codex-browse-create-row { display: flex; align-items: center; gap: 8px; }
    .dsh-codex-browse-foot {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: none;
      padding: 9px 14px;
      border-top: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.08));
    }
    .dsh-codex-browse-target {
      display: flex;
      align-items: baseline;
      gap: 6px;
      min-width: 0;
      font-size: 11px;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
    }
    .dsh-codex-browse-target span { flex: none; white-space: nowrap; }
    .dsh-codex-browse-target code {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-family: var(--dsh-font-family-code, ui-monospace, monospace);
    }
    .dsh-codex-browse-actions { display: flex; align-items: center; gap: 8px; }
    .dsh-codex-browse-spacer { flex: 1; }
    .dsh-codex-browse-toggle {
      flex: none;
      padding: 4px 6px;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
      font: inherit;
      font-size: 12px;
      cursor: pointer;
    }
    .dsh-codex-browse-toggle:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); color: var(--dsw-alias-label-primary, #1a1a1a); }
    .dsh-codex-browse-toggle.active { color: var(--dsw-alias-state-business-primary, #2f8f5b); }
    .dsh-codex-browse-error { flex: none; padding: 6px 14px 10px; color: #a83232; font-size: 12px; }
    .dsh-codex-right {
      display: flex;
      flex-direction: column;
      flex: none;
      width: 380px;
      min-height: 0;
      border-left: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.08));
      background: var(--dsw-alias-bg-base, #ffffff);
    }
    .dsh-codex-right-head { display: flex; align-items: center; gap: 6px; padding: 8px 10px; border-bottom: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.08)); }
    .dsh-codex-right-tabs { display: flex; gap: 4px; flex: 1; }
    .dsh-codex-right-tab {
      padding: 4px 10px;
      border: none;
      border-radius: 7px;
      background: transparent;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
      font: inherit;
      font-size: 12px;
      cursor: pointer;
    }
    .dsh-codex-right-tab:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); }
    .dsh-codex-right-tab.active { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.08)); color: var(--dsw-alias-label-primary, #1a1a1a); }
    .dsh-codex-right-close { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border: none; border-radius: 6px; background: transparent; color: var(--dsw-alias-label-secondary, #6b6b6b); cursor: pointer; }
    .dsh-codex-right-close:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); }
    .dsh-codex-right-body { display: flex; flex-direction: column; flex: 1; min-height: 0; }
    .dsh-codex-right-bar { display: flex; align-items: center; gap: 6px; padding: 8px 10px; flex: none; }
    .dsh-codex-right-path { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: var(--dsh-font-family-code, ui-monospace, monospace); font-size: 11px; color: var(--dsw-alias-label-secondary, #6b6b6b); }
    .dsh-codex-right-list { flex: 1; min-height: 0; overflow: auto; padding: 0 6px 8px; }
    .dsh-codex-right-row { display: flex; align-items: center; gap: 8px; width: 100%; padding: 5px 6px; border: none; border-radius: 6px; background: transparent; color: inherit; font: inherit; font-size: 12px; text-align: left; cursor: pointer; }
    .dsh-codex-right-row:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); }
    .dsh-codex-right-glyph { width: 14px; flex: none; text-align: center; color: var(--dsw-alias-label-secondary, #8a8f95); font-family: var(--dsh-font-family-code, ui-monospace, monospace); }
    .dsh-codex-right-glyph.dir { color: #4176e6; }
    .dsh-codex-right-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dsh-codex-right-meta { font-size: 11px; color: var(--dsw-alias-label-secondary, #6b6b6b); }
    .dsh-codex-right-section { padding: 8px 8px 4px; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--dsw-alias-label-secondary, #6b6b6b); }
    .dsh-codex-right-pre { flex: 1; min-height: 0; margin: 0; padding: 8px 10px 12px; overflow: auto; font-family: var(--dsh-font-family-code, ui-monospace, monospace); font-size: 11px; line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
    .dsh-codex-right-pre.small { flex: none; max-height: 220px; }
    .dsh-codex-right-pre.terminal { background: rgba(0, 0, 0, 0.03); }
    .dsh-codex-right-error { padding: 6px 10px; color: #cf4b4b; font-size: 12px; }
    .dsh-codex-right-terminal-input { display: flex; gap: 6px; padding: 0 10px 8px; }
    .dsh-codex-right-terminal-input .dsh-codex-search { width: auto; flex: 1; height: 30px; margin: 0; }
    .dsh-codex-icon-button { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border: none; border-radius: 6px; background: transparent; color: var(--dsw-alias-label-secondary, #6b6b6b); cursor: pointer; }
    .dsh-codex-icon-button:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); }
    .dsh-codex-attachments { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 12px 0; }
    .dsh-codex-attachment {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      max-width: 220px;
      padding: 2px 4px 2px 8px;
      border: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.12));
      border-radius: 999px;
      background: var(--dsw-alias-bg-layer-1, rgba(0, 0, 0, 0.03));
      font-size: 11px;
      color: var(--dsw-alias-label-secondary, #4a4f55);
    }
    .dsh-codex-attachment-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dsh-codex-attachment button { width: 16px; height: 16px; padding: 0; border: none; border-radius: 50%; background: transparent; color: inherit; cursor: pointer; line-height: 1; }
    .dsh-codex-attachment button:hover { background: rgba(0, 0, 0, 0.08); }
    .dsh-codex-attachment.uploading { opacity: 0.7; }
    .dsh-codex-attachment.error { border-color: #cf4b4b; color: #cf4b4b; }
    .dsh-codex-plus {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      flex: none;
      border: none;
      border-radius: 999px;
      background: var(--dsw-alias-bg-layer-1, rgba(0, 0, 0, 0.04));
      color: var(--dsw-alias-label-secondary, #6b6b6b);
      cursor: pointer;
    }
    .dsh-codex-plus:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.07)); }
    .dsh-codex-permission-trigger {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      height: 28px;
      padding: 0 8px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: var(--dsw-alias-label-secondary, #6b6b6b);
      font: inherit;
      font-size: 12px;
      cursor: pointer;
    }
    .dsh-codex-permission-trigger:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); }
    .dsh-codex-plus-panel {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: calc(100% + 6px);
      z-index: 29;
      width: min(774px, calc(100% - 36px));
      padding: 4px;
      border-radius: 16px;
      background: var(--dsw-alias-bg-base, #ffffff);
      box-shadow:
        0 0 0 0.5px var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.1)),
        0 3px 8px rgba(0, 0, 0, 0.06),
        0 0 20px rgba(0, 0, 0, 0.06);
    }
    .dsh-codex-plus-item {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      height: 34px;
      padding: 0 8px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    .dsh-codex-plus-item:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); }
    .dsh-codex-plus-icon { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; flex: none; color: var(--dsw-alias-label-secondary, #6b6b6b); }
    .dsh-codex-plus-label { font-size: 13px; flex: none; }
    .dsh-codex-plus-hint { margin-left: auto; font-size: 11px; color: var(--dsw-alias-label-secondary, #8a8f95); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dsh-codex-permission-menu {
      position: absolute;
      left: 8px;
      bottom: 46px;
      z-index: 29;
      width: min(300px, calc(100vw - 48px));
      padding: 4px;
      border-radius: 16px;
      background: var(--dsw-alias-bg-base, #ffffff);
      box-shadow:
        0 0 0 0.5px var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.1)),
        0 3px 8px rgba(0, 0, 0, 0.06),
        0 0 20px rgba(0, 0, 0, 0.06);
    }
    .dsh-codex-permission-option {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      width: 100%;
      padding: 7px 8px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    .dsh-codex-permission-option:hover,
    .dsh-codex-permission-option.selected { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); }
    .dsh-codex-permission-meta { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
    .dsh-codex-slash {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: calc(100% + 6px);
      z-index: 30;
      width: min(774px, calc(100% - 36px));
      max-height: 320px;
      overflow-y: auto;
      padding: 4px 6px 4px 4px;
      scrollbar-width: thin;
      scrollbar-color: rgba(0, 0, 0, 0.22) transparent;
      border-radius: 14px;
      background: var(--dsw-alias-bg-base, #ffffff);
      box-shadow:
        0 0 0 0.5px var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.1)),
        0 3px 8px rgba(0, 0, 0, 0.06),
        0 0 20px rgba(0, 0, 0, 0.06);
    }
    .dsh-codex-slash-item {
      display: flex;
      align-items: baseline;
      gap: 8px;
      width: 100%;
      padding: 6px 8px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    .dsh-codex-slash-item:hover,
    .dsh-codex-slash-item.active { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.05)); }
    .dsh-codex-slash-name { width: 74px; flex: none; font-family: var(--dsh-font-family-code, ui-monospace, monospace); font-size: 11px; color: var(--dsw-alias-label-secondary, #6b6b6b); }
    .dsh-codex-slash-label { font-size: 12px; }
    .dsh-codex-slash::-webkit-scrollbar { width: 6px; }
    .dsh-codex-slash::-webkit-scrollbar-track { background: transparent; }
    .dsh-codex-slash::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.22); border-radius: 999px; }
    .dsh-codex-slash-desc { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; color: var(--dsw-alias-label-secondary, #6b6b6b); }
    `;
    function installStyles() {
      if (typeof document === "undefined") return;
      if (document.getElementById(STYLE_ID) !== null) return;
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = CSS;
      document.head.appendChild(style);
    }

    // src/client/index.tsx
    var inject = ["slots", "connection", "locale", "layout"];
    var PANEL_ID = "codex-cli";
    function apply(ctx) {
      installStyles();
      ctx.effect(() => ctx.locale.register(NS, dictionaries), "codex-cli: dictionaries");
      const api = createApi(
        (channel, endpoint, payload) => ctx.connection.rpc.call(channel, endpoint, payload)
      );
      const selectPanel = () => {
        try {
          ctx.layout.selectPanel(PANEL_ID);
        } catch {
        }
      };
      ctx.slots.inject(
        "sidebar.panellist",
        () => ctx.slots.register(
          {
            name: "sidebar.panellist",
            id: PANEL_ID,
            order: 30,
            locale: NS,
            label: () => "Codex CLI"
          },
          CodexIcon
        )
      );
      ctx.slots.inject(
        "main",
        () => ctx.slots.register(
          {
            name: "main",
            key: PANEL_ID,
            locale: NS,
            inject: () => ({
              api,
              onExit: () => {
                try {
                  ctx.layout.selectPanel(null);
                } catch {
                }
              }
            })
          },
          ConsolePage
        )
      );
    }

    return module.exports
  },
})
