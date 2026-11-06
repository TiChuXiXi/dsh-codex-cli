/** 样式：只用 DSH 暴露的 CSS 变量，跟随主题与字号。 */

const STYLE_ID = 'dsh-codex-cli-style'

export const CSS = `
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
.dsh-codex-search.focus { width: auto; height: 30px; margin: 0 14px 8px; }
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
.dsh-codex-checkbox { display: flex; align-items: center; gap: 8px; margin: 8px 0 4px; font-size: 12px; cursor: pointer; }
.dsh-codex-checkbox input { accent-color: #4176e6; }
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
`

/** 注入一次样式；重复调用无副作用。 */
export function installStyles(): void {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID) !== null) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = CSS
  document.head.appendChild(style)
}
