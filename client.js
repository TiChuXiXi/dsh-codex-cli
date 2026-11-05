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
    function CodexIcon({ size = 16 }) {
      return /* @__PURE__ */ React.createElement(
        "svg",
        {
          width: size,
          height: size,
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.5",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          "aria-hidden": "true"
        },
        /* @__PURE__ */ React.createElement("rect", { x: "2.75", y: "4.75", width: "18.5", height: "14.5", rx: "2.25" }),
        /* @__PURE__ */ React.createElement("path", { d: "m7 9.5 2.75 2.25L7 14" }),
        /* @__PURE__ */ React.createElement("path", { d: "M12.5 14.5H17" })
      );
    }

    // src/client/i18n.ts
    var React2 = __toESM(require("react"), 1);
    var NS = "codexCli";
    var zh = {
      "app.title": "Codex",
      "app.subtitle": "Codex CLI 管理端",
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
      "threads.loading": "加载中…",
      "threads.empty": "这个项目还没有会话",
      "threads.loadMore": "加载更多",
      "threads.archived": "已归档",
      "threads.search": "搜索会话",
      "threads.title": "会话",
      "composer.placeholder": "给 Codex 发消息…",
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
      "approval.allowSession": "本会话允许",
      "approval.deny": "拒绝",
      "approval.cancel": "取消",
      "approval.submit": "提交",
      "approval.reason": "原因",
      "approval.cwd": "目录",
      "approval.grantRoot": "授权目录",
      "approval.other": "其他",
      "actions.rename": "重命名",
      "actions.archive": "归档",
      "actions.fork": "Fork",
      "actions.export": "导出",
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
      "thread.select": "从左侧选择一个会话",
      "thread.selectHint": "也可以从项目列表里挑一个项目，再打开其中的会话。",
      "thread.messages": "{count} 条消息",
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
      "item.image": "图片",
      "item.compaction": "上下文已压缩",
      "item.review": "代码审查",
      "item.other": "{type}",
      "item.exitCode": "退出码 {code}",
      "item.output": "输出",
      "item.files.changed": "{count} 个文件",
      "error.title": "出错了",
      "error.retry": "重试",
      "error.offline": "宿主未连接，稍后会自动重试。",
      "time.justNow": "刚刚",
      "time.minutes": "{count} 分钟前",
      "time.hours": "{count} 小时前",
      "time.days": "{count} 天前"
    };
    var en = {
      "app.title": "Codex",
      "app.subtitle": "Codex CLI console",
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
      "threads.loading": "Loading…",
      "threads.empty": "No sessions in this project",
      "threads.loadMore": "Load more",
      "threads.archived": "Archived",
      "threads.search": "Search sessions",
      "threads.title": "Sessions",
      "composer.placeholder": "Message Codex…",
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
      "approval.allowSession": "Allow for session",
      "approval.deny": "Decline",
      "approval.cancel": "Cancel",
      "approval.submit": "Submit",
      "approval.reason": "Reason",
      "approval.cwd": "Directory",
      "approval.grantRoot": "Grant root",
      "approval.other": "Other",
      "actions.rename": "Rename",
      "actions.archive": "Archive",
      "actions.fork": "Fork",
      "actions.export": "Export",
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
      "thread.select": "Pick a session on the left",
      "thread.selectHint": "Or choose a project, then open one of its sessions.",
      "thread.messages": "{count} messages",
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
      "item.image": "Image",
      "item.compaction": "Context compacted",
      "item.review": "Code review",
      "item.other": "{type}",
      "item.exitCode": "exit {code}",
      "item.output": "Output",
      "item.files.changed": "{count} files",
      "error.title": "Something went wrong",
      "error.retry": "Retry",
      "error.offline": "The host is not connected; retrying automatically.",
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
    var React13 = __toESM(require("react"), 1);

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

    // src/client/page/NewThreadDialog.tsx
    var React3 = __toESM(require("react"), 1);
    var EFFORTS = ["", "minimal", "low", "medium", "high"];
    var APPROVALS = ["on-request", "never", "untrusted"];
    var SANDBOXES = ["workspace-write", "read-only", "danger-full-access"];
    function NewThreadDialog({ open, defaultCwd, projects, models, onClose, onCreate }) {
      const t = useT();
      const [cwd, setCwd] = React3.useState(defaultCwd);
      const [model, setModel] = React3.useState("");
      const [effort, setEffort] = React3.useState("");
      const [approvalPolicy, setApprovalPolicy] = React3.useState("on-request");
      const [sandbox, setSandbox] = React3.useState("workspace-write");
      const [busy, setBusy] = React3.useState(false);
      const [error, setError] = React3.useState(null);
      React3.useEffect(() => {
        if (!open) return;
        setCwd(defaultCwd);
        setError(null);
      }, [open, defaultCwd]);
      if (!open) return null;
      const submit = async () => {
        if (busy) return;
        if (cwd.trim() === "") {
          setError(t("newThread.cwd"));
          return;
        }
        setBusy(true);
        setError(null);
        try {
          await onCreate({
            cwd: cwd.trim(),
            model: model === "" ? void 0 : model,
            effort: effort === "" ? void 0 : effort,
            approvalPolicy,
            sandbox
          });
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : String(cause));
        } finally {
          setBusy(false);
        }
      };
      return /* @__PURE__ */ React3.createElement("div", { className: "dsh-codex-dialog-backdrop", onMouseDown: (event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      } }, /* @__PURE__ */ React3.createElement("div", { className: "dsh-codex-dialog", role: "dialog", "aria-modal": "true" }, /* @__PURE__ */ React3.createElement("header", { className: "dsh-codex-dialog-head" }, t("newThread.title")), /* @__PURE__ */ React3.createElement("label", { className: "dsh-codex-field" }, /* @__PURE__ */ React3.createElement("span", null, t("newThread.cwd")), /* @__PURE__ */ React3.createElement(
        "input",
        {
          className: "dsh-codex-search",
          list: "dsh-codex-projects",
          value: cwd,
          onChange: (event) => setCwd(event.target.value),
          placeholder: "/root/project/..."
        }
      ), /* @__PURE__ */ React3.createElement("datalist", { id: "dsh-codex-projects" }, projects.map((project) => /* @__PURE__ */ React3.createElement("option", { key: project.cwd, value: project.cwd })))), /* @__PURE__ */ React3.createElement("label", { className: "dsh-codex-field" }, /* @__PURE__ */ React3.createElement("span", null, t("newThread.model")), /* @__PURE__ */ React3.createElement("select", { className: "dsh-codex-select", value: model, onChange: (event) => setModel(event.target.value) }, /* @__PURE__ */ React3.createElement("option", { value: "" }, t("newThread.default")), models.map((entry) => /* @__PURE__ */ React3.createElement("option", { key: entry.id, value: entry.id }, entry.displayName)))), /* @__PURE__ */ React3.createElement("div", { className: "dsh-codex-field-row" }, /* @__PURE__ */ React3.createElement("label", { className: "dsh-codex-field" }, /* @__PURE__ */ React3.createElement("span", null, t("newThread.effort")), /* @__PURE__ */ React3.createElement("select", { className: "dsh-codex-select", value: effort, onChange: (event) => setEffort(event.target.value) }, EFFORTS.map((value) => /* @__PURE__ */ React3.createElement("option", { key: value, value }, value === "" ? t("newThread.default") : value)))), /* @__PURE__ */ React3.createElement("label", { className: "dsh-codex-field" }, /* @__PURE__ */ React3.createElement("span", null, t("newThread.approval")), /* @__PURE__ */ React3.createElement("select", { className: "dsh-codex-select", value: approvalPolicy, onChange: (event) => setApprovalPolicy(event.target.value) }, APPROVALS.map((value) => /* @__PURE__ */ React3.createElement("option", { key: value, value }, value))))), /* @__PURE__ */ React3.createElement("label", { className: "dsh-codex-field" }, /* @__PURE__ */ React3.createElement("span", null, t("newThread.sandbox")), /* @__PURE__ */ React3.createElement("select", { className: "dsh-codex-select", value: sandbox, onChange: (event) => setSandbox(event.target.value) }, SANDBOXES.map((value) => /* @__PURE__ */ React3.createElement("option", { key: value, value }, value)))), error !== null ? /* @__PURE__ */ React3.createElement("div", { className: "dsh-codex-dialog-error" }, error) : null, /* @__PURE__ */ React3.createElement("div", { className: "dsh-codex-dialog-actions" }, /* @__PURE__ */ React3.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: onClose }, t("newThread.cancel")), /* @__PURE__ */ React3.createElement("button", { type: "button", className: "dsh-codex-button primary", disabled: busy, onClick: () => void submit() }, busy ? t("newThread.creating") : t("newThread.create")))));
    }

    // src/client/page/ProjectList.tsx
    var React4 = __toESM(require("react"), 1);
    function ProjectList({ projects, totalThreads, selectedCwd, onSelect }) {
      const t = useT();
      return /* @__PURE__ */ React4.createElement("div", null, /* @__PURE__ */ React4.createElement("div", { className: "dsh-codex-section-title" }, t("projects.title")), /* @__PURE__ */ React4.createElement(
        "button",
        {
          type: "button",
          className: `dsh-codex-project ${selectedCwd === null ? "active" : ""}`,
          onClick: () => onSelect(null)
        },
        /* @__PURE__ */ React4.createElement("span", { className: "dsh-codex-dot" }),
        /* @__PURE__ */ React4.createElement("span", { className: "dsh-codex-project-main" }, /* @__PURE__ */ React4.createElement("span", { className: "dsh-codex-project-name" }, t("projects.all")), /* @__PURE__ */ React4.createElement("span", { className: "dsh-codex-project-meta" }, t("projects.count", { count: totalThreads })))
      ), projects.map((project) => /* @__PURE__ */ React4.createElement(
        "button",
        {
          type: "button",
          key: project.cwd,
          className: `dsh-codex-project ${selectedCwd === project.cwd ? "active" : ""}`,
          title: project.cwd,
          onClick: () => onSelect(project.cwd)
        },
        /* @__PURE__ */ React4.createElement("span", { className: `dsh-codex-dot ${project.activeCount > 0 ? "ok pulse" : ""}` }),
        /* @__PURE__ */ React4.createElement("span", { className: "dsh-codex-project-main" }, /* @__PURE__ */ React4.createElement("span", { className: "dsh-codex-project-name" }, project.name === "" ? project.cwd : project.name), /* @__PURE__ */ React4.createElement("span", { className: "dsh-codex-project-meta" }, t("projects.count", { count: project.threadCount }), project.activeCount > 0 ? ` · ${t("projects.active", { count: project.activeCount })}` : "", typeof project.git?.branch === "string" && project.git.branch !== "" ? ` · ${project.git.branch}` : "")),
        /* @__PURE__ */ React4.createElement("span", { className: "dsh-codex-project-meta" }, relativeTime(project.lastUpdatedAt, t))
      )), projects.length === 0 ? /* @__PURE__ */ React4.createElement("div", { className: "dsh-codex-loading" }, t("projects.empty")) : null);
    }

    // src/client/page/StatusHeader.tsx
    var React5 = __toESM(require("react"), 1);
    function StatusHeader({ status, streamState, onRefresh, onNew, onVersions }) {
      const t = useT();
      const phase = status?.phase ?? "connecting";
      const phaseClass = phase === "ready" ? "ok" : phase === "error" ? "error" : "warn";
      return /* @__PURE__ */ React5.createElement("header", { className: "dsh-codex-header" }, /* @__PURE__ */ React5.createElement("div", { className: "dsh-codex-title" }, /* @__PURE__ */ React5.createElement("strong", null, t("app.title")), /* @__PURE__ */ React5.createElement("span", null, t("app.subtitle"))), /* @__PURE__ */ React5.createElement("div", { className: "dsh-codex-spacer" }), /* @__PURE__ */ React5.createElement("span", { className: "dsh-codex-badge", title: status?.error ?? void 0 }, /* @__PURE__ */ React5.createElement("i", { className: `dsh-codex-dot ${phaseClass} ${phase === "connecting" ? "pulse" : ""}` }), t(`status.${phase}`)), status?.kind ? /* @__PURE__ */ React5.createElement("span", { className: "dsh-codex-badge" }, t(`status.${status.kind}`)) : null, status?.codexVersion ? /* @__PURE__ */ React5.createElement("span", { className: "dsh-codex-badge" }, t("status.version", { version: status.codexVersion })) : null, /* @__PURE__ */ React5.createElement("span", { className: "dsh-codex-badge" }, /* @__PURE__ */ React5.createElement("i", { className: `dsh-codex-dot ${streamState === "open" ? "ok" : "warn"} ${streamState === "connecting" ? "pulse" : ""}` }), t(`status.events.${streamState}`)), onNew !== void 0 ? /* @__PURE__ */ React5.createElement("button", { type: "button", className: "dsh-codex-button primary", onClick: onNew }, t("newThread.open")) : null, onVersions !== void 0 ? /* @__PURE__ */ React5.createElement("button", { type: "button", className: "dsh-codex-button", onClick: onVersions }, t("versions.open")) : null, /* @__PURE__ */ React5.createElement("button", { type: "button", className: "dsh-codex-button", onClick: onRefresh }, t("status.refresh")));
    }

    // src/client/page/ThreadList.tsx
    var React6 = __toESM(require("react"), 1);
    function ThreadList({
      threads,
      selectedId,
      loading,
      hasMore,
      search,
      showCwd,
      onSearch,
      onSelect,
      onLoadMore
    }) {
      const t = useT();
      return /* @__PURE__ */ React6.createElement("div", null, /* @__PURE__ */ React6.createElement(
        "input",
        {
          className: "dsh-codex-search",
          type: "search",
          value: search,
          placeholder: t("threads.search"),
          onChange: (event) => onSearch(event.target.value)
        }
      ), threads.map((thread) => {
        const status = thread.status?.type ?? "idle";
        const dotClass = status === "active" ? "ok pulse" : status === "systemError" ? "error" : "";
        const meta = [thread.model, relativeTime(thread.updatedAt, t)];
        if (showCwd && thread.cwd) meta.push(basename(thread.cwd));
        return /* @__PURE__ */ React6.createElement(
          "button",
          {
            type: "button",
            key: thread.id,
            className: `dsh-codex-thread ${selectedId === thread.id ? "active" : ""}`,
            title: `${threadTitle(thread)}
    ${thread.cwd ?? ""}`,
            onClick: () => onSelect(thread.id)
          },
          /* @__PURE__ */ React6.createElement("span", { className: `dsh-codex-dot ${dotClass}` }),
          /* @__PURE__ */ React6.createElement("span", { className: "dsh-codex-thread-main" }, /* @__PURE__ */ React6.createElement("span", { className: "dsh-codex-thread-name" }, threadTitle(thread)), /* @__PURE__ */ React6.createElement("span", { className: "dsh-codex-thread-meta" }, meta.filter(Boolean).join(" · ")))
        );
      }), threads.length === 0 && !loading ? /* @__PURE__ */ React6.createElement("div", { className: "dsh-codex-loading" }, t("threads.empty")) : null, loading ? /* @__PURE__ */ React6.createElement("div", { className: "dsh-codex-loading" }, t("threads.loading")) : null, hasMore ? /* @__PURE__ */ React6.createElement("button", { type: "button", className: "dsh-codex-button", disabled: loading, onClick: onLoadMore }, t("threads.loadMore")) : null);
    }

    // src/client/page/ThreadView.tsx
    var React10 = __toESM(require("react"), 1);

    // src/client/page/ApprovalCard.tsx
    var React7 = __toESM(require("react"), 1);
    function ApprovalStack({ approvals, onRespond }) {
      if (approvals.length === 0) return null;
      return /* @__PURE__ */ React7.createElement("div", { className: "dsh-codex-approvals" }, approvals.map((approval) => /* @__PURE__ */ React7.createElement(ApprovalCard, { key: String(approval.requestId), approval, onRespond })));
    }
    function ApprovalCard({
      approval,
      onRespond
    }) {
      const t = useT();
      const [busy, setBusy] = React7.useState(false);
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
        return /* @__PURE__ */ React7.createElement(InputCard, { approval, busy, onRespond: respond });
      }
      if (approval.method === "item/commandExecution/requestApproval") {
        return /* @__PURE__ */ React7.createElement(Shell, { title: t("approval.command"), busy }, /* @__PURE__ */ React7.createElement("pre", { className: "dsh-codex-command" }, params.command ?? ""), params.cwd ? /* @__PURE__ */ React7.createElement("div", { className: "dsh-codex-approval-meta" }, t("approval.cwd"), ": ", params.cwd) : null, params.reason ? /* @__PURE__ */ React7.createElement("div", { className: "dsh-codex-approval-meta" }, t("approval.reason"), ": ", params.reason) : null, /* @__PURE__ */ React7.createElement(Actions, null, /* @__PURE__ */ React7.createElement("button", { type: "button", className: "dsh-codex-button primary", disabled: busy, onClick: () => void respond({ decision: "accept" }) }, t("approval.allow")), /* @__PURE__ */ React7.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => void respond({ decision: "acceptForSession" }) }, t("approval.allowSession")), /* @__PURE__ */ React7.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => void respond({ decision: "decline" }) }, t("approval.deny"))));
      }
      if (approval.method === "item/fileChange/requestApproval") {
        return /* @__PURE__ */ React7.createElement(Shell, { title: t("approval.file"), busy }, params.grantRoot ? /* @__PURE__ */ React7.createElement("div", { className: "dsh-codex-approval-meta" }, t("approval.grantRoot"), ": ", params.grantRoot) : null, params.reason ? /* @__PURE__ */ React7.createElement("div", { className: "dsh-codex-approval-meta" }, t("approval.reason"), ": ", params.reason) : null, /* @__PURE__ */ React7.createElement(Actions, null, /* @__PURE__ */ React7.createElement("button", { type: "button", className: "dsh-codex-button primary", disabled: busy, onClick: () => void respond({ decision: "accept" }) }, t("approval.allow")), /* @__PURE__ */ React7.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => void respond({ decision: "acceptForSession" }) }, t("approval.allowSession")), /* @__PURE__ */ React7.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => void respond({ decision: "decline" }) }, t("approval.deny"))));
      }
      if (approval.method === "item/permissions/requestApproval") {
        return /* @__PURE__ */ React7.createElement(Shell, { title: t("approval.permissions"), busy }, params.cwd ? /* @__PURE__ */ React7.createElement("div", { className: "dsh-codex-approval-meta" }, t("approval.cwd"), ": ", params.cwd) : null, params.reason ? /* @__PURE__ */ React7.createElement("div", { className: "dsh-codex-approval-meta" }, t("approval.reason"), ": ", params.reason) : null, /* @__PURE__ */ React7.createElement("pre", { className: "dsh-codex-pre" }, JSON.stringify(params.permissions ?? {}, null, 2)), /* @__PURE__ */ React7.createElement(Actions, null, /* @__PURE__ */ React7.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => void respond({ permissions: {}, scope: "turn" }) }, t("approval.deny"))));
      }
      return /* @__PURE__ */ React7.createElement(Shell, { title: t("approval.elicitation"), busy }, /* @__PURE__ */ React7.createElement("pre", { className: "dsh-codex-pre" }, JSON.stringify(params, null, 2)), /* @__PURE__ */ React7.createElement(Actions, null, /* @__PURE__ */ React7.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => void respond({ action: "decline", content: null, _meta: null }) }, t("approval.deny")), /* @__PURE__ */ React7.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => void respond({ action: "cancel", content: null, _meta: null }) }, t("approval.cancel"))));
    }
    function InputCard({
      approval,
      busy,
      onRespond
    }) {
      const t = useT();
      const questions = Array.isArray(approval.params?.questions) ? approval.params.questions : [];
      const [values, setValues] = React7.useState({});
      const submit = () => {
        const answers = {};
        for (const [key, value] of Object.entries(values)) {
          if (value.trim() !== "") answers[key] = { answers: [value.trim()] };
        }
        void onRespond({ answers });
      };
      return /* @__PURE__ */ React7.createElement(Shell, { title: t("approval.input"), busy }, questions.map((question) => /* @__PURE__ */ React7.createElement("div", { key: question.id, className: "dsh-codex-question" }, /* @__PURE__ */ React7.createElement("div", { className: "dsh-codex-question-title" }, question.header || question.question), question.header && question.question !== question.header ? /* @__PURE__ */ React7.createElement("div", { className: "dsh-codex-question-body" }, question.question) : null, /* @__PURE__ */ React7.createElement("div", { className: "dsh-codex-options" }, (Array.isArray(question.options) ? question.options : []).map((option) => /* @__PURE__ */ React7.createElement(
        "button",
        {
          type: "button",
          key: option.label,
          className: `dsh-codex-option ${values[question.id] === option.label ? "selected" : ""}`,
          title: option.description ?? void 0,
          onClick: () => setValues((previous) => ({ ...previous, [question.id]: option.label }))
        },
        option.label
      ))), question.isOther || (question.options ?? []).length === 0 ? /* @__PURE__ */ React7.createElement(
        "input",
        {
          className: "dsh-codex-search",
          type: question.isSecret ? "password" : "text",
          value: values[question.id] ?? "",
          placeholder: t("approval.other"),
          onChange: (event) => setValues((previous) => ({ ...previous, [question.id]: event.target.value }))
        }
      ) : null)), /* @__PURE__ */ React7.createElement(Actions, null, /* @__PURE__ */ React7.createElement("button", { type: "button", className: "dsh-codex-button primary", disabled: busy, onClick: submit }, t("approval.submit"))));
    }
    function Shell({ title, busy, children }) {
      return /* @__PURE__ */ React7.createElement("section", { className: `dsh-codex-approval ${busy ? "busy" : ""}` }, /* @__PURE__ */ React7.createElement("header", { className: "dsh-codex-approval-head" }, /* @__PURE__ */ React7.createElement("span", { className: "dsh-codex-dot warn pulse" }), /* @__PURE__ */ React7.createElement("strong", null, title)), children);
    }
    function Actions({ children }) {
      return /* @__PURE__ */ React7.createElement("div", { className: "dsh-codex-approval-actions" }, children);
    }

    // src/client/page/Composer.tsx
    var React8 = __toESM(require("react"), 1);
    function Composer({ disabled, activeTurnId, onSend, onSteer, onStop }) {
      const t = useT();
      const [text, setText] = React8.useState("");
      const [busy, setBusy] = React8.useState(false);
      const textareaRef = React8.useRef(null);
      const submit = async () => {
        const value = text.trim();
        if (value === "" || busy || disabled) return;
        setBusy(true);
        try {
          if (activeTurnId !== null) await onSteer(value);
          else await onSend(value);
          setText("");
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
      return /* @__PURE__ */ React8.createElement("div", { className: "dsh-codex-composer" }, /* @__PURE__ */ React8.createElement(
        "textarea",
        {
          ref: textareaRef,
          className: "dsh-codex-textarea",
          rows: 3,
          value: text,
          disabled,
          placeholder: activeTurnId === null ? t("composer.placeholder") : t("composer.steerPlaceholder"),
          onChange: (event) => setText(event.target.value),
          onKeyDown: (event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              void submit();
            }
          }
        }
      ), /* @__PURE__ */ React8.createElement("div", { className: "dsh-codex-composer-actions" }, /* @__PURE__ */ React8.createElement("span", { className: "dsh-codex-hint" }, activeTurnId === null ? t("composer.sendHint") : t("composer.steerHint")), activeTurnId !== null ? /* @__PURE__ */ React8.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => void stop() }, t("composer.stop")) : null, /* @__PURE__ */ React8.createElement(
        "button",
        {
          type: "button",
          className: "dsh-codex-button primary",
          disabled: disabled || busy || text.trim() === "",
          onClick: () => void submit()
        },
        activeTurnId === null ? t("composer.send") : t("composer.steer")
      )));
    }

    // src/client/page/ItemCard.tsx
    var React9 = __toESM(require("react"), 1);
    function ItemCard({ item }) {
      const t = useT();
      switch (item.type) {
        case "userMessage":
          return /* @__PURE__ */ React9.createElement(Message, { kind: "user", label: t("item.user"), text: itemText(item) });
        case "agentMessage":
          return /* @__PURE__ */ React9.createElement(
            Message,
            {
              kind: "assistant",
              label: t("item.assistant"),
              text: typeof item.text === "string" ? item.text : "",
              muted: item.phase === "commentary"
            }
          );
        case "reasoning":
          return /* @__PURE__ */ React9.createElement(Reasoning, { item });
        case "commandExecution":
          return /* @__PURE__ */ React9.createElement(CommandCard, { item });
        case "fileChange":
          return /* @__PURE__ */ React9.createElement(FileCard, { item });
        case "mcpToolCall":
        case "dynamicToolCall":
        case "functionCallOutput":
          return /* @__PURE__ */ React9.createElement(ToolCard, { item });
        case "plan":
          return /* @__PURE__ */ React9.createElement(Block, { title: t("item.plan"), body: /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-text" }, item.text ?? "") });
        case "webSearch":
          return /* @__PURE__ */ React9.createElement(Disclosure, { title: t("item.search"), body: /* @__PURE__ */ React9.createElement(Json, { value: item }) });
        case "imageView":
          return /* @__PURE__ */ React9.createElement(Divider, { label: `${t("item.image")} · ${basenameOf(item.path)}` });
        case "contextCompaction":
          return /* @__PURE__ */ React9.createElement(Divider, { label: t("item.compaction") });
        case "enteredReviewMode":
        case "exitedReviewMode":
          return /* @__PURE__ */ React9.createElement(Divider, { label: t("item.review") });
        case "sleep":
        case "hookPrompt":
          return null;
        default:
          return /* @__PURE__ */ React9.createElement(Disclosure, { title: t("item.other", { type: item.type }), body: null });
      }
    }
    function Message({ kind, label, text, muted = false }) {
      if (text.trim() === "") return null;
      return /* @__PURE__ */ React9.createElement("div", { className: `dsh-codex-message ${kind}` }, /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-message-head" }, /* @__PURE__ */ React9.createElement("span", null, label)), /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-bubble", style: muted ? { opacity: 0.82 } : void 0 }, /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-text" }, text)));
    }
    function Reasoning({ item }) {
      const t = useT();
      const summary = Array.isArray(item.summary) ? item.summary.filter((part) => part.trim() !== "") : [];
      const body = summary.length > 0 ? summary.join("\n\n") : "";
      if (body === "") return null;
      return /* @__PURE__ */ React9.createElement("details", { className: "dsh-codex-reasoning" }, /* @__PURE__ */ React9.createElement("summary", null, t("item.reasoning")), /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-reasoning-body" }, body));
    }
    function CommandCard({ item }) {
      const t = useT();
      const output = typeof item.aggregatedOutput === "string" ? item.aggregatedOutput : "";
      const status = typeof item.status === "string" ? item.status : "";
      const command = item.command ?? "";
      return /* @__PURE__ */ React9.createElement(
        Disclosure,
        {
          title: t("item.command"),
          meta: /* @__PURE__ */ React9.createElement(React9.Fragment, null, /* @__PURE__ */ React9.createElement("span", { className: "dsh-codex-block-title" }, shorten(command, 120)), status !== "" ? /* @__PURE__ */ React9.createElement("span", null, status) : null, typeof item.exitCode === "number" ? /* @__PURE__ */ React9.createElement("span", null, t("item.exitCode", { code: item.exitCode })) : null),
          body: /* @__PURE__ */ React9.createElement(React9.Fragment, null, /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-command" }, command), output !== "" ? /* @__PURE__ */ React9.createElement("pre", { className: "dsh-codex-pre" }, output) : null)
        }
      );
    }
    function FileCard({ item }) {
      const t = useT();
      const changes = Array.isArray(item.changes) ? item.changes : [];
      return /* @__PURE__ */ React9.createElement(
        Disclosure,
        {
          title: t("item.files"),
          meta: /* @__PURE__ */ React9.createElement("span", null, t("item.files.changed", { count: changes.length })),
          body: /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-files" }, changes.map((change, index) => /* @__PURE__ */ React9.createElement("details", { key: `${change.path}-${index}` }, /* @__PURE__ */ React9.createElement("summary", { className: "dsh-codex-file-path" }, change.path), /* @__PURE__ */ React9.createElement("pre", { className: "dsh-codex-pre" }, change.diff))))
        }
      );
    }
    function ToolCard({ item }) {
      const t = useT();
      const title = item.type === "mcpToolCall" ? `${item.server ?? "mcp"} / ${item.tool ?? ""}` : item.type === "dynamicToolCall" ? `tool / ${item.tool ?? ""}` : item.type;
      return /* @__PURE__ */ React9.createElement(
        Disclosure,
        {
          title: t("item.tool"),
          meta: /* @__PURE__ */ React9.createElement(React9.Fragment, null, /* @__PURE__ */ React9.createElement("span", { className: "dsh-codex-block-title" }, title), typeof item.status === "string" ? /* @__PURE__ */ React9.createElement("span", null, item.status) : null),
          body: /* @__PURE__ */ React9.createElement(Json, { value: { arguments: item.arguments, result: item.result, error: item.error } })
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
      return /* @__PURE__ */ React9.createElement("pre", { className: "dsh-codex-pre" }, text);
    }
    function Disclosure({ title, meta, body }) {
      return /* @__PURE__ */ React9.createElement("details", { className: "dsh-codex-block" }, /* @__PURE__ */ React9.createElement("summary", { className: "dsh-codex-block-head" }, /* @__PURE__ */ React9.createElement("span", { className: "dsh-codex-caret" }), /* @__PURE__ */ React9.createElement("span", null, title), meta), body !== null ? /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-block-body" }, body) : null);
    }
    function Block({ title, meta, body }) {
      return /* @__PURE__ */ React9.createElement("section", { className: "dsh-codex-block" }, /* @__PURE__ */ React9.createElement("header", { className: "dsh-codex-block-head" }, /* @__PURE__ */ React9.createElement("span", null, title), meta), body !== null ? /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-block-body" }, body) : null);
    }
    function Divider({ label }) {
      return /* @__PURE__ */ React9.createElement("div", { className: "dsh-codex-divider" }, label);
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

    // src/client/page/ThreadView.tsx
    function ThreadView({
      detail,
      loading,
      selectedId,
      activeTurnId,
      pending,
      onRespond,
      onSend,
      onSteer,
      onStop,
      actions
    }) {
      const t = useT();
      const messagesRef = React10.useRef(null);
      const threadId = detail?.thread.id ?? null;
      React10.useEffect(() => {
        const element = messagesRef.current;
        if (element === null) return;
        element.scrollTop = element.scrollHeight;
      }, [threadId, loading]);
      if (selectedId === null) {
        return /* @__PURE__ */ React10.createElement("div", { className: "dsh-codex-empty" }, /* @__PURE__ */ React10.createElement("strong", null, t("thread.select")), /* @__PURE__ */ React10.createElement("small", null, t("thread.selectHint")));
      }
      if (loading && detail === null) {
        return /* @__PURE__ */ React10.createElement("div", { className: "dsh-codex-empty" }, t("thread.loading"));
      }
      if (detail === null) return null;
      const thread = detail.thread;
      const items = detail.turns.flatMap((turn) => turn.items ?? []);
      return /* @__PURE__ */ React10.createElement(React10.Fragment, null, /* @__PURE__ */ React10.createElement("div", { className: "dsh-codex-thread-header" }, /* @__PURE__ */ React10.createElement("div", { className: "dsh-codex-thread-header-top" }, /* @__PURE__ */ React10.createElement("div", { className: "dsh-codex-thread-title", title: thread.id }, threadTitle(thread)), actions), /* @__PURE__ */ React10.createElement("div", { className: "dsh-codex-chips" }, /* @__PURE__ */ React10.createElement("span", { className: "dsh-codex-chip" }, t("thread.status"), ": ", t(statusKey(thread.status))), thread.cwd ? /* @__PURE__ */ React10.createElement("span", { className: "dsh-codex-chip", title: thread.cwd }, t("thread.cwd"), ": ", /* @__PURE__ */ React10.createElement("code", null, basename(thread.cwd))) : null, thread.model ? /* @__PURE__ */ React10.createElement("span", { className: "dsh-codex-chip" }, t("thread.model"), ": ", thread.model) : null, thread.reasoningEffort ? /* @__PURE__ */ React10.createElement("span", { className: "dsh-codex-chip" }, t("thread.effort"), ": ", thread.reasoningEffort) : null, typeof thread.gitInfo?.branch === "string" && thread.gitInfo.branch !== "" ? /* @__PURE__ */ React10.createElement("span", { className: "dsh-codex-chip" }, t("thread.git"), ": ", thread.gitInfo.branch) : null, thread.updatedAt ? /* @__PURE__ */ React10.createElement("span", { className: "dsh-codex-chip" }, t("thread.updated"), ": ", relativeTime(thread.updatedAt, t)) : null, /* @__PURE__ */ React10.createElement("span", { className: "dsh-codex-chip" }, t("thread.messages", { count: items.length })))), /* @__PURE__ */ React10.createElement("div", { className: "dsh-codex-messages", ref: messagesRef }, items.length === 0 ? /* @__PURE__ */ React10.createElement("div", { className: "dsh-codex-empty" }, t("thread.noMessages")) : items.map((item) => /* @__PURE__ */ React10.createElement(ItemCard, { key: item.id, item }))), /* @__PURE__ */ React10.createElement(ApprovalStack, { approvals: pending, onRespond }), /* @__PURE__ */ React10.createElement(
        Composer,
        {
          disabled: false,
          activeTurnId,
          onSend,
          onSteer,
          onStop
        }
      ));
    }

    // src/client/page/ThreadActions.tsx
    var React11 = __toESM(require("react"), 1);
    function ThreadActions({ api, thread, onRenamed, onArchived, onForked, onDeleted }) {
      const t = useT();
      const [dialog, setDialog] = React11.useState(null);
      const [name, setName] = React11.useState(thread.name ?? "");
      const [busy, setBusy] = React11.useState(false);
      const [error, setError] = React11.useState(null);
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
      return /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-thread-actions" }, /* @__PURE__ */ React11.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: openRename }, t("actions.rename")), /* @__PURE__ */ React11.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => void archive() }, t("actions.archive")), /* @__PURE__ */ React11.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => void fork() }, t("actions.fork")), /* @__PURE__ */ React11.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => void exportMarkdown() }, t("actions.export")), /* @__PURE__ */ React11.createElement(
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
      ), error !== null && dialog === null ? /* @__PURE__ */ React11.createElement("span", { className: "dsh-codex-action-error" }, error) : null, dialog === "rename" ? /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-dialog-backdrop", onMouseDown: (event) => {
        if (event.target === event.currentTarget && !busy) setDialog(null);
      } }, /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-dialog", role: "dialog", "aria-modal": "true" }, /* @__PURE__ */ React11.createElement("header", { className: "dsh-codex-dialog-head" }, t("actions.renameTitle")), /* @__PURE__ */ React11.createElement(
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
      ), error !== null ? /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-dialog-error" }, error) : null, /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-dialog-actions" }, /* @__PURE__ */ React11.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => setDialog(null) }, t("actions.cancel")), /* @__PURE__ */ React11.createElement("button", { type: "button", className: "dsh-codex-button primary", disabled: busy, onClick: () => void saveRename() }, t("actions.save"))))) : null, dialog === "delete" ? /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-dialog-backdrop", onMouseDown: (event) => {
        if (event.target === event.currentTarget && !busy) setDialog(null);
      } }, /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-dialog", role: "dialog", "aria-modal": "true" }, /* @__PURE__ */ React11.createElement("header", { className: "dsh-codex-dialog-head" }, t("actions.deleteTitle")), /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-approval-meta" }, t("actions.deleteBody", { name: threadTitle(thread) })), error !== null ? /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-dialog-error" }, error) : null, /* @__PURE__ */ React11.createElement("div", { className: "dsh-codex-dialog-actions" }, /* @__PURE__ */ React11.createElement("button", { type: "button", className: "dsh-codex-button", disabled: busy, onClick: () => setDialog(null) }, t("actions.cancel")), /* @__PURE__ */ React11.createElement("button", { type: "button", className: "dsh-codex-button danger", disabled: busy, onClick: () => void remove() }, t("actions.confirmDelete"))))) : null);
    }

    // src/client/page/VersionsDialog.tsx
    var React12 = __toESM(require("react"), 1);
    function VersionsDialog({ open, onClose, api }) {
      const t = useT();
      const [check, setCheck] = React12.useState(null);
      const [loading, setLoading] = React12.useState(false);
      const [error, setError] = React12.useState(null);
      const [activeTurns, setActiveTurns] = React12.useState([]);
      const [job, setJob] = React12.useState(null);
      const [rollbackVersion, setRollbackVersion] = React12.useState("");
      const [pendingDaemon, setPendingDaemon] = React12.useState(null);
      const [lastAction, setLastAction] = React12.useState(null);
      const pollRef = React12.useRef(null);
      const logRef = React12.useRef(null);
      const load = React12.useCallback(
        async (refresh = false) => {
          setLoading(true);
          setError(null);
          try {
            const value = await api("versions/check", { refresh });
            setCheck(value);
          } catch (cause) {
            setError(messageOf(cause));
          } finally {
            setLoading(false);
          }
        },
        [api]
      );
      React12.useEffect(() => {
        if (open) void load(false);
      }, [open, load]);
      React12.useEffect(
        () => () => {
          if (pollRef.current !== null) window.clearInterval(pollRef.current);
        },
        []
      );
      const pollJob = React12.useCallback(
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
      const startJob = React12.useCallback(
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
            setError(messageOf(cause));
          }
        },
        [api, pollJob]
      );
      React12.useEffect(() => {
        const element = logRef.current;
        if (element !== null) element.scrollTop = element.scrollHeight;
      }, [job?.lines.length]);
      if (!open) return null;
      const doctor = check?.doctor ?? null;
      const problems = doctor?.checks.filter((entry) => entry.status !== "ok") ?? [];
      const daemonVersion = check?.daemon?.appServerVersion ?? check?.daemon?.cliVersion ?? null;
      return /* @__PURE__ */ React12.createElement(
        "div",
        {
          className: "dsh-codex-dialog-backdrop",
          onMouseDown: (event) => {
            if (event.target === event.currentTarget) onClose();
          }
        },
        /* @__PURE__ */ React12.createElement("div", { className: "dsh-codex-dialog dsh-codex-versions", role: "dialog", "aria-modal": "true" }, /* @__PURE__ */ React12.createElement("header", { className: "dsh-codex-dialog-head" }, t("versions.title")), loading && check === null ? /* @__PURE__ */ React12.createElement("div", { className: "dsh-codex-loading" }, t("versions.checking")) : null, error !== null ? /* @__PURE__ */ React12.createElement("div", { className: "dsh-codex-dialog-error" }, error, activeTurns.length > 0 ? /* @__PURE__ */ React12.createElement("div", { className: "dsh-codex-approval-meta" }, t("versions.activeTurns", { count: activeTurns.length }), /* @__PURE__ */ React12.createElement(
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
        )) : null) : null, check !== null ? /* @__PURE__ */ React12.createElement(React12.Fragment, null, /* @__PURE__ */ React12.createElement("div", { className: "dsh-codex-version-grid" }, /* @__PURE__ */ React12.createElement("span", null, t("versions.cli")), /* @__PURE__ */ React12.createElement("strong", null, check.cli.version ?? "—"), /* @__PURE__ */ React12.createElement("span", null, t("versions.daemon")), /* @__PURE__ */ React12.createElement("strong", null, daemonVersion ?? "—"), /* @__PURE__ */ React12.createElement("span", null, t("versions.latest")), /* @__PURE__ */ React12.createElement("strong", null, check.latest?.version ?? "—"), /* @__PURE__ */ React12.createElement("span", null, t("versions.channel")), /* @__PURE__ */ React12.createElement("strong", { title: check.install?.context ?? void 0 }, installLabel(check.install?.context))), /* @__PURE__ */ React12.createElement("div", { className: "dsh-codex-version-actions" }, /* @__PURE__ */ React12.createElement("button", { type: "button", className: "dsh-codex-button", disabled: loading, onClick: () => void load(true) }, loading ? t("versions.checking") : t("versions.check")), check.updateAvailable ? /* @__PURE__ */ React12.createElement(
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
        ) : /* @__PURE__ */ React12.createElement("span", { className: "dsh-codex-hint" }, t("versions.upToDate"))), /* @__PURE__ */ React12.createElement("div", { className: "dsh-codex-version-actions" }, /* @__PURE__ */ React12.createElement(
          "input",
          {
            className: "dsh-codex-search",
            style: { flex: 1, margin: 0 },
            value: rollbackVersion,
            placeholder: t("versions.rollbackPlaceholder"),
            onChange: (event) => setRollbackVersion(event.target.value)
          }
        ), /* @__PURE__ */ React12.createElement(
          "button",
          {
            type: "button",
            className: "dsh-codex-button",
            disabled: rollbackVersion.trim() === "" || job?.status === "running",
            onClick: () => void startJob("versions/rollback", { version: rollbackVersion.trim() })
          },
          t("versions.rollback")
        )), /* @__PURE__ */ React12.createElement("div", { className: "dsh-codex-version-daemon" }, /* @__PURE__ */ React12.createElement("span", { className: "dsh-codex-section-title", style: { padding: 0 } }, t("versions.daemonActions")), /* @__PURE__ */ React12.createElement(
          "button",
          {
            type: "button",
            className: "dsh-codex-button",
            disabled: job?.status === "running",
            onClick: () => setPendingDaemon("restart")
          },
          t("versions.restart")
        ), /* @__PURE__ */ React12.createElement(
          "button",
          {
            type: "button",
            className: "dsh-codex-button",
            disabled: job?.status === "running",
            onClick: () => setPendingDaemon("update")
          },
          t("versions.daemonUpdate")
        ), /* @__PURE__ */ React12.createElement(
          "button",
          {
            type: "button",
            className: "dsh-codex-button",
            disabled: job?.status === "running",
            onClick: () => setPendingDaemon("stop")
          },
          t("versions.stop")
        )), pendingDaemon !== null ? /* @__PURE__ */ React12.createElement("div", { className: "dsh-codex-approval" }, /* @__PURE__ */ React12.createElement("div", { className: "dsh-codex-approval-meta" }, pendingDaemon === "restart" ? t("versions.confirmRestart") : pendingDaemon === "update" ? t("versions.confirmUpdate") : t("versions.confirmStop")), /* @__PURE__ */ React12.createElement("div", { className: "dsh-codex-approval-actions" }, /* @__PURE__ */ React12.createElement("button", { type: "button", className: "dsh-codex-button", onClick: () => setPendingDaemon(null) }, t("versions.cancel")), /* @__PURE__ */ React12.createElement(
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
        ))) : null, /* @__PURE__ */ React12.createElement("div", { className: "dsh-codex-version-doctor" }, /* @__PURE__ */ React12.createElement("div", { className: "dsh-codex-section-title", style: { padding: 0 } }, t("versions.doctor"), doctor !== null ? /* @__PURE__ */ React12.createElement("span", { className: "dsh-codex-approval-meta", style: { marginLeft: 8 } }, doctor.overallStatus === "ok" ? t("versions.doctorOk") : doctor.overallStatus === "warning" ? t("versions.doctorWarn") : t("versions.doctorError")) : null), problems.slice(0, 8).map((entry) => /* @__PURE__ */ React12.createElement("div", { key: entry.id, className: "dsh-codex-doctor-row" }, /* @__PURE__ */ React12.createElement("span", { className: `dsh-codex-dot ${entry.status === "error" ? "error" : "warn"}` }), /* @__PURE__ */ React12.createElement("span", { className: "dsh-codex-doctor-id" }, entry.id), /* @__PURE__ */ React12.createElement("span", { className: "dsh-codex-doctor-summary" }, entry.summary))), doctor !== null && problems.length === 0 ? /* @__PURE__ */ React12.createElement("div", { className: "dsh-codex-hint" }, doctor.checks.length, " checks ok") : null), job !== null ? /* @__PURE__ */ React12.createElement("div", { className: "dsh-codex-job" }, /* @__PURE__ */ React12.createElement("div", { className: "dsh-codex-section-title", style: { padding: 0 } }, t("versions.job"), /* @__PURE__ */ React12.createElement("span", { className: "dsh-codex-approval-meta", style: { marginLeft: 8 } }, job.status === "running" ? t("versions.running") : job.status === "done" ? t("versions.done") : t("versions.failed", { code: job.exitCode ?? "?" }))), /* @__PURE__ */ React12.createElement("pre", { className: "dsh-codex-pre dsh-codex-job-log", ref: logRef }, job.lines.join("\n"))) : null) : null, /* @__PURE__ */ React12.createElement("div", { className: "dsh-codex-dialog-actions" }, /* @__PURE__ */ React12.createElement("button", { type: "button", className: "dsh-codex-button", onClick: onClose }, t("versions.close"))))
      );
    }
    function installLabel(context) {
      if (typeof context !== "string" || context === "") return "—";
      return context.split(" ")[0];
    }
    function messageOf(cause) {
      return cause instanceof Error ? cause.message : String(cause);
    }

    // src/client/page/ConsolePage.tsx
    function ConsolePage(props) {
      const t = props.t ?? fallbackTranslate;
      const api = props.api;
      const [status, setStatus] = React13.useState(null);
      const [projects, setProjects] = React13.useState([]);
      const [threads, setThreads] = React13.useState([]);
      const [nextCursor, setNextCursor] = React13.useState(null);
      const [selectedCwd, setSelectedCwd] = React13.useState(null);
      const [selectedId, setSelectedId] = React13.useState(null);
      const [detail, setDetail] = React13.useState(null);
      const [detailLoading, setDetailLoading] = React13.useState(false);
      const [loadingThreads, setLoadingThreads] = React13.useState(false);
      const [error, setError] = React13.useState(null);
      const [streamState, setStreamState] = React13.useState("connecting");
      const [search, setSearch] = React13.useState("");
      const [pending, setPending] = React13.useState([]);
      const [models, setModels] = React13.useState([]);
      const [dialogOpen, setDialogOpen] = React13.useState(false);
      const [versionsOpen, setVersionsOpen] = React13.useState(false);
      const selectedIdRef = React13.useRef(null);
      selectedIdRef.current = selectedId;
      const threadsRef = React13.useRef([]);
      threadsRef.current = threads;
      const loadThreads = React13.useCallback(
        async (cursor) => {
          setLoadingThreads(true);
          try {
            const page = await api("threads/list", { limit: 100, ...cursor ? { cursor } : {} });
            setThreads((previous) => {
              if (!cursor) return page.data;
              const known = new Set(previous.map((thread) => thread.id));
              return [...previous, ...page.data.filter((thread) => !known.has(thread.id))];
            });
            setNextCursor(page.nextCursor);
          } catch (cause) {
            setError(messageOf2(cause));
          } finally {
            setLoadingThreads(false);
          }
        },
        [api]
      );
      const refreshPending = React13.useCallback(async () => {
        try {
          const result = await api("approvals/pending");
          setPending(result.pending ?? []);
        } catch {
        }
      }, [api]);
      const refresh = React13.useCallback(async () => {
        setError(null);
        try {
          const [nextStatus, nextProjects] = await Promise.all([
            api("status"),
            api("projects/list", {})
          ]);
          setStatus(nextStatus);
          setProjects(nextProjects);
        } catch (cause) {
          setError(messageOf2(cause));
        }
        await loadThreads(null);
      }, [api, loadThreads]);
      React13.useEffect(() => {
        void refresh();
        void refreshPending();
        api("models/list").then((list) => setModels(list)).catch(() => {
        });
      }, [api, refresh, refreshPending]);
      React13.useEffect(() => {
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
              case "thread/updated":
                setThreads(
                  (previous) => previous.map(
                    (thread) => thread.id === event.threadId ? { ...thread, name: event.payload?.name ?? thread.name } : thread
                  )
                );
                break;
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
                break;
              case "turn/started":
              case "turn/completed":
              case "item/upsert":
              case "item/delta":
              case "item/patch":
                setDetail((previous) => applyDetailEvent(previous, event));
                if (event.type === "turn/completed" && event.threadId !== void 0 && !threadsRef.current.some((thread) => thread.id === event.threadId)) {
                  void loadThreads(null);
                }
                break;
              default:
                break;
            }
          }
        });
        return close;
      }, [refresh, refreshPending, loadThreads]);
      React13.useEffect(() => {
        if (selectedId === null) {
          setDetail(null);
          return void 0;
        }
        let cancelled = false;
        setError(null);
        setDetailLoading(true);
        setDetail(null);
        api("threads/get", { threadId: selectedId, limit: 20 }).then((next) => {
          if (!cancelled) setDetail(next);
        }).catch((cause) => {
          if (!cancelled) setError(messageOf2(cause));
        }).finally(() => {
          if (!cancelled) setDetailLoading(false);
        });
        return () => {
          cancelled = true;
        };
      }, [api, selectedId]);
      React13.useEffect(() => {
        if (selectedId === null) return void 0;
        let cancelled = false;
        let opened = false;
        api("threads/open", { threadId: selectedId }).then(() => {
          opened = true;
          if (cancelled) void api("threads/close", { threadId: selectedId }).catch(() => {
          });
        }).catch(() => {
        });
        return () => {
          cancelled = true;
          if (opened) void api("threads/close", { threadId: selectedId }).catch(() => {
          });
        };
      }, [api, selectedId]);
      const detailThreadId = detail?.thread.id ?? null;
      React13.useEffect(() => {
        if (detailThreadId === null || detail === null) return;
        setThreads(
          (previous) => previous.some((thread) => thread.id === detailThreadId) ? previous : upsertThread(previous, detail.thread)
        );
      }, [detailThreadId]);
      const activeTurnId = React13.useMemo(() => {
        if (detail === null) return null;
        for (let index = detail.turns.length - 1; index >= 0; index -= 1) {
          if (detail.turns[index].status === "inProgress") return detail.turns[index].id;
        }
        return null;
      }, [detail]);
      const send = React13.useCallback(
        async (text) => {
          if (selectedId === null) return;
          setError(null);
          try {
            await api("turns/start", { threadId: selectedId, text });
            window.setTimeout(() => {
              void loadThreads(null);
            }, 2500);
          } catch (cause) {
            setError(messageOf2(cause));
            throw cause;
          }
        },
        [api, selectedId, loadThreads]
      );
      const steer = React13.useCallback(
        async (text) => {
          if (selectedId === null || activeTurnId === null) return;
          setError(null);
          try {
            await api("turns/steer", { threadId: selectedId, turnId: activeTurnId, text });
          } catch (cause) {
            setError(messageOf2(cause));
            throw cause;
          }
        },
        [api, selectedId, activeTurnId]
      );
      const stop = React13.useCallback(async () => {
        if (selectedId === null || activeTurnId === null) return;
        setError(null);
        try {
          await api("turns/interrupt", { threadId: selectedId, turnId: activeTurnId });
        } catch (cause) {
          setError(messageOf2(cause));
        }
      }, [api, selectedId, activeTurnId]);
      const respond = React13.useCallback(
        async (requestId, response) => {
          setError(null);
          try {
            await api("approvals/respond", { requestId, response });
            setPending((previous) => previous.filter((entry) => String(entry.requestId) !== String(requestId)));
          } catch (cause) {
            setError(messageOf2(cause));
            throw cause;
          }
        },
        [api]
      );
      const createThread = React13.useCallback(
        async (request) => {
          const thread = await api("threads/new", request);
          if (thread !== null && thread !== void 0) {
            setThreads((previous) => upsertThread(previous, thread));
            setSelectedId(thread.id);
            setDialogOpen(false);
          }
        },
        [api]
      );
      const visibleThreads = React13.useMemo(() => {
        const query = search.trim().toLowerCase();
        return threads.filter((thread) => selectedCwd === null || thread.cwd === selectedCwd).filter((thread) => {
          if (query === "") return true;
          const haystack = `${threadTitle(thread)} ${thread.cwd ?? ""}`.toLowerCase();
          return haystack.includes(query);
        }).sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
      }, [threads, selectedCwd, search]);
      const visiblePending = React13.useMemo(
        () => selectedId === null ? [] : pending.filter((entry) => entry.params?.threadId === void 0 || entry.params.threadId === selectedId),
        [pending, selectedId]
      );
      const defaultCwd = detail?.thread.cwd ?? selectedCwd ?? projects[0]?.cwd ?? "";
      const totalThreads = projects.reduce((sum, project) => sum + project.threadCount, 0);
      return /* @__PURE__ */ React13.createElement(I18nContext.Provider, { value: t }, /* @__PURE__ */ React13.createElement("div", { className: "dsh-codex-root" }, /* @__PURE__ */ React13.createElement(
        StatusHeader,
        {
          status,
          streamState,
          onRefresh: () => void refresh(),
          onNew: () => setDialogOpen(true),
          onVersions: () => setVersionsOpen(true)
        }
      ), error !== null ? /* @__PURE__ */ React13.createElement("div", { className: "dsh-codex-error" }, error, /* @__PURE__ */ React13.createElement("button", { type: "button", className: "dsh-codex-button", style: { marginLeft: 8 }, onClick: () => void refresh() }, t("error.retry"))) : null, /* @__PURE__ */ React13.createElement("div", { className: "dsh-codex-body" }, /* @__PURE__ */ React13.createElement("aside", { className: "dsh-codex-sidebar" }, /* @__PURE__ */ React13.createElement("div", { className: "dsh-codex-sidebar-scroll" }, /* @__PURE__ */ React13.createElement(
        ProjectList,
        {
          projects,
          totalThreads,
          selectedCwd,
          onSelect: (cwd) => {
            setSelectedCwd(cwd);
            setSearch("");
          }
        }
      ), /* @__PURE__ */ React13.createElement("div", { className: "dsh-codex-section-title" }, t("threads.title")), /* @__PURE__ */ React13.createElement(
        ThreadList,
        {
          threads: visibleThreads,
          selectedId,
          loading: loadingThreads,
          hasMore: nextCursor !== null && selectedCwd === null && search.trim() === "",
          search,
          showCwd: selectedCwd === null,
          onSearch: setSearch,
          onSelect: setSelectedId,
          onLoadMore: () => void loadThreads(nextCursor)
        }
      ))), /* @__PURE__ */ React13.createElement("main", { className: "dsh-codex-main" }, /* @__PURE__ */ React13.createElement(
        ThreadView,
        {
          detail,
          loading: detailLoading,
          selectedId,
          activeTurnId,
          pending: visiblePending,
          onRespond: respond,
          onSend: send,
          onSteer: steer,
          onStop: stop,
          actions: detail === null ? void 0 : /* @__PURE__ */ React13.createElement(
            ThreadActions,
            {
              api,
              thread: detail.thread,
              onRenamed: (name) => {
                setThreads(
                  (previous) => previous.map((thread) => thread.id === detail.thread.id ? { ...thread, name } : thread)
                );
                setDetail(
                  (previous) => previous === null ? previous : { ...previous, thread: { ...previous.thread, name } }
                );
              },
              onArchived: () => {
                setThreads((previous) => previous.filter((thread) => thread.id !== detail.thread.id));
                setSelectedId(null);
              },
              onForked: (thread) => {
                setThreads((previous) => upsertThread(previous, thread));
                setSelectedId(thread.id);
              },
              onDeleted: () => {
                setThreads((previous) => previous.filter((thread) => thread.id !== detail.thread.id));
                setSelectedId(null);
              }
            }
          )
        }
      ))), /* @__PURE__ */ React13.createElement(VersionsDialog, { open: versionsOpen, onClose: () => setVersionsOpen(false), api }), /* @__PURE__ */ React13.createElement(
        NewThreadDialog,
        {
          open: dialogOpen,
          defaultCwd,
          projects,
          models,
          onClose: () => setDialogOpen(false),
          onCreate: createThread
        }
      )));
    }
    function messageOf2(cause) {
      if (cause instanceof Error) return cause.message;
      return String(cause);
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
      display: flex;
      flex-direction: column;
      height: 100%;
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
      background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.06));
      box-shadow: inset 2px 0 0 var(--dsw-alias-state-business-primary, #2f8f5b);
    }

    .dsh-codex-project-main { display: flex; flex-direction: column; gap: 1px; min-width: 0; flex: 1; }
    .dsh-codex-project-name { font-size: 13px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dsh-codex-project-meta { font-size: 11px; color: var(--dsw-alias-label-secondary, #6b6b6b); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

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
      max-width: min(760px, 92%);
      padding: 9px 12px;
      border-radius: 10px;
      background: var(--dsw-alias-bg-layer-1, rgba(0, 0, 0, 0.035));
      overflow-wrap: anywhere;
    }
    .dsh-codex-message.user .dsh-codex-bubble {
      background: var(--dsw-alias-button-elevated-fill, rgba(47, 143, 91, 0.12));
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

    .dsh-codex-composer {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: none;
      padding: 10px 18px 14px;
      border-top: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.08));
    }
    .dsh-codex-textarea {
      width: 100%;
      min-height: 64px;
      max-height: 220px;
      resize: vertical;
      padding: 9px 11px;
      border: 1px solid var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.14));
      border-radius: 9px;
      background: transparent;
      color: inherit;
      font: inherit;
      line-height: 1.5;
      outline: none;
    }
    .dsh-codex-textarea:focus { border-color: var(--dsw-alias-state-business-primary, #2f8f5b); }
    .dsh-codex-composer-actions { display: flex; align-items: center; gap: 8px; }
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
    var inject = ["slots", "connection", "locale"];
    function apply(ctx) {
      installStyles();
      ctx.effect(() => ctx.locale.register(NS, dictionaries), "codex-cli: dictionaries");
      ctx.slots.inject(
        "sidebar.panellist",
        () => ctx.slots.register(
          {
            name: "sidebar.panellist",
            id: "codex-cli",
            order: 30,
            locale: NS,
            label: () => "Codex"
          },
          CodexIcon
        )
      );
      ctx.slots.inject(
        "main",
        () => ctx.slots.register(
          {
            name: "main",
            key: "codex-cli",
            locale: NS,
            inject: () => ({
              api: createApi(
                (channel, endpoint, payload) => ctx.connection.rpc.call(channel, endpoint, payload)
              )
            })
          },
          ConsolePage
        )
      );
    }

    return module.exports
  },
})
