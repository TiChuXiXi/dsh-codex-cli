/** Plugin-scoped workbench design tokens and components. */
export const WORKBENCH_CSS = `
/* Approved merged direction: quiet neutrals, a single blue-grey accent. */
.dsh-codex-root{
 --codex-bg:#fcfcfa;--codex-panel:#f4f4f1;--codex-soft:#eceeef;--codex-border:#dfe1e0;
 --codex-text:#2c323a;--codex-muted:#606b77;--codex-accent:#55637a;--codex-selected:#e8ecf1;
 --codex-success:#34725a;--codex-danger:#ad3e3e;--codex-warning-bg:#fff8e9;--codex-warning:#805d19;
 --dsw-alias-bg-base:var(--codex-bg);--dsw-alias-bg-layer-1:var(--codex-panel);--dsw-alias-bg-layer-2:var(--codex-soft);
 --dsw-alias-label-primary:var(--codex-text);--dsw-alias-label-secondary:var(--codex-muted);
 --dsw-alias-label-tertiary:var(--codex-muted);--dsw-alias-label-caption:var(--codex-muted);
 --dsw-alias-border-l2:var(--codex-border);--dsw-alias-border-l3:var(--codex-border);--dsw-alias-border-l4:var(--codex-border);
 --dsw-alias-interactive-bg-hover:var(--codex-soft);--dsw-alias-interactive-bg-active:var(--codex-selected);
 --dsw-alias-state-business-primary:var(--codex-accent);--dsw-alias-brand-primary-new-colorprimary-new-color:var(--codex-accent);
 --dsw-alias-markdown-tag:var(--codex-panel);--dsw-alias-scrollbar-bg-l2:var(--codex-border);--dsw-alias-scrollbar-hover-l2:var(--codex-muted);
 --dsh-content-font-size:15px;--dsh-content-font-size-secondary:13px;
 --dsh-font-family-text:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans CJK SC","Microsoft YaHei",sans-serif;
 --dsh-font-family-code:"SFMono-Regular",Consolas,"Source Code Pro","Liberation Mono","Noto Sans Mono CJK SC","DejaVu Sans Mono",monospace;
 --dsw-radius-sm:5px;--dsw-radius-md:7px;--dsw-radius-lg:10px;--dsw-radius-panel:10px;
 --dsw-elevation-prominent:0 12px 40px #19253626;
 display:grid;grid-template-columns:0 var(--codex-nav-width,280px) minmax(0,1fr) auto;grid-template-rows:46px minmax(0,1fr) 28px;
 font-size:15px;line-height:1.75;color-scheme:light;view-transition-name:codex-panel;transition:grid-template-columns 220ms ease;
}
.dsh-codex-root[data-codex-theme="dark"]{
 --codex-bg:#222428;--codex-panel:#1c1e22;--codex-soft:#30333a;--codex-border:#3b3f46;
 --codex-text:#e4e6ea;--codex-muted:#a3aab5;--codex-accent:#b0bdd0;--codex-selected:#333c4a;
 --codex-success:#94bca4;--codex-danger:#e7a3a3;--codex-warning-bg:#302a20;--codex-warning:#e5c281;
 --dsw-elevation-prominent:0 12px 40px #0006;color-scheme:dark;
}
.dsh-codex-root [hidden]{display:none!important}
.dsh-codex-root :where(button,input,textarea,select){font-family:inherit}
.dsh-codex-root :where(button,a,input,textarea,select,[tabindex]):focus-visible{outline:2px solid var(--codex-accent);outline-offset:3px}
.dsh-codex-root :where(button,a){-webkit-tap-highlight-color:transparent}
.dsh-codex-root :where(button:disabled){opacity:.45;cursor:default}
.dsh-codex-root :where(svg){vertical-align:middle;flex-shrink:0}
.dsh-codex-root :where(input,textarea,select){color:var(--codex-text);background:var(--codex-bg)}
.dsh-codex-root :where(input,textarea)::placeholder{color:var(--codex-muted);opacity:1}
.dsh-codex-root :where(*){scrollbar-width:thin;scrollbar-color:var(--codex-border) transparent}
.dsh-codex-root .dsh-codex-icon-button{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;flex:none;border:0;border-radius:7px;background:transparent;color:var(--codex-muted);padding:0}
.dsh-codex-root .dsh-codex-icon-button:hover{background:var(--codex-soft);color:var(--codex-text)}
.dsh-codex-root .dsh-codex-icon-button.is-selected{background:var(--codex-selected);color:var(--codex-accent)}
.dsh-codex-root .dsh-codex-button{min-height:36px;gap:8px;padding:6px 12px;font-size:13px;border:1px solid var(--codex-border);border-radius:7px;background:var(--codex-bg);color:var(--codex-text);box-shadow:none}
.dsh-codex-root .dsh-codex-button:hover{background:var(--codex-soft)}
.dsh-codex-root .dsh-codex-button.primary{background:var(--codex-accent);border-color:var(--codex-accent);color:var(--codex-bg)}
.dsh-codex-root .dsh-codex-button.danger,.dsh-codex-root .danger{color:var(--codex-danger)}
.dsh-codex-root .dsh-codex-rail{grid-column:1;grid-row:1/3;display:flex;flex-direction:column;align-items:center;gap:10px;padding:12px 0;background:var(--codex-panel);border-right:1px solid var(--codex-border)}
.dsh-codex-root .dsh-codex-rail-brand{height:40px;width:44px;display:grid;place-items:center;border:0;background:transparent;color:var(--codex-text);margin-bottom:8px;cursor:pointer}
.dsh-codex-root .dsh-codex-workbench-header{grid-column:3;grid-row:1;display:flex;align-items:center;gap:6px;padding:0 12px;border-bottom:1px solid var(--codex-border);min-width:0}
.dsh-codex-root .dsh-codex-workbench-header .dsh-codex-icon-button{width:34px;height:34px}
.dsh-codex-workbench-header h1{font-size:14px;font-weight:600;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:0}
.dsh-codex-root .dsh-codex-main{grid-column:3;grid-row:2;min-width:0;width:auto;overflow:hidden}
.dsh-codex-root .dsh-codex-main.is-file-dragging{outline:2px dashed var(--codex-accent);outline-offset:-6px;background:var(--codex-selected)}
.dsh-codex-root .dsh-codex-workbench-status{grid-column:1/5;grid-row:3;display:flex;align-items:center;gap:16px;padding:0 14px;border-top:1px solid var(--codex-border);background:var(--codex-panel);font-size:12px;color:var(--codex-muted);min-width:0}
.dsh-codex-workbench-status>span{display:flex;align-items:center;gap:7px;white-space:nowrap}
.dsh-codex-workbench-status button{font:inherit;color:inherit;border:0;background:none;cursor:pointer}
.dsh-codex-root .dsh-codex-focus-sidebar{grid-column:2;grid-row:1/3;width:auto;min-width:0;padding:0 12px;background:var(--codex-panel);border-right:1px solid var(--codex-border);gap:0;overflow:hidden;opacity:1;visibility:visible;transition:opacity 160ms ease,visibility 0s linear 0s}
.dsh-codex-root .dsh-codex-focus-brand{height:64px;flex:none;padding:0 8px;gap:0}
.dsh-codex-root .dsh-codex-focus-logo{display:flex;margin-right:10px}
.dsh-codex-root .dsh-codex-sidebar-exit{display:flex;align-items:center;gap:8px;width:100%;padding:8px;border:0;border-radius:6px;background:transparent;color:var(--codex-muted);cursor:pointer;text-align:left}
.dsh-codex-root .dsh-codex-sidebar-exit:hover{background:var(--codex-soft)}
.dsh-codex-root .dsh-codex-focus-brand-text strong{font-size:16px;font-weight:650}
.dsh-codex-root .dsh-codex-focus-brand-text strong small{font-size:12px;color:var(--codex-muted);margin-left:6px}
.dsh-codex-root .dsh-codex-focus-status,.dsh-codex-root .dsh-codex-focus-info{display:none}
.dsh-codex-root .dsh-codex-focus-actions{display:flex;gap:4px;padding:2px 0 12px}
.dsh-codex-focus-actions>.dsh-codex-button:first-child{flex:1;justify-content:flex-start}
.dsh-codex-root .dsh-codex-focus-actions .primary{background:var(--codex-bg);border-color:var(--codex-border);color:var(--codex-text)}
.dsh-codex-focus-actions>.dsh-codex-button:nth-child(2){display:none}
.dsh-codex-root .dsh-codex-search{height:38px;min-width:0;font-size:13px;padding:8px 10px;border-radius:7px;border:1px solid var(--codex-border);background:var(--codex-bg);color:var(--codex-text);box-shadow:none}
.dsh-codex-root .dsh-codex-focus-search-row{gap:4px;padding:0 0 12px}
.dsh-codex-root .dsh-codex-focus-search-row .focus{height:40px;margin:0;width:100%;min-width:0}
.dsh-codex-root .dsh-codex-focus-tree{margin-right:-12px;padding:4px 12px 12px 0;scrollbar-width:thin;scrollbar-color:transparent transparent}
.dsh-codex-root .dsh-codex-focus-tree:hover,.dsh-codex-root .dsh-codex-focus-tree:focus-within{scrollbar-color:var(--codex-border) transparent}
.dsh-codex-root .dsh-codex-focus-tree::-webkit-scrollbar{width:6px}
.dsh-codex-root .dsh-codex-focus-tree::-webkit-scrollbar-thumb{border-radius:999px;background:transparent}
.dsh-codex-root .dsh-codex-focus-tree:hover::-webkit-scrollbar-thumb,.dsh-codex-root .dsh-codex-focus-tree:focus-within::-webkit-scrollbar-thumb{background:var(--codex-border)}
.dsh-codex-root .dsh-codex-tree-project{height:42px;padding:7px 8px;gap:8px;border-radius:7px;font-size:13px}
.dsh-codex-root .dsh-codex-project-group{position:relative}
.dsh-codex-root .dsh-codex-project-group.is-dragging{opacity:.5}
.dsh-codex-root .dsh-codex-project-group.drop-before:before,.dsh-codex-root .dsh-codex-project-group.drop-after:after{content:'';position:absolute;left:4px;right:4px;height:2px;background:var(--codex-accent);z-index:5;pointer-events:none}
.dsh-codex-root .dsh-codex-project-group.drop-before:before{top:-1px}
.dsh-codex-root .dsh-codex-project-group.drop-after:after{bottom:-1px}
.dsh-codex-root .dsh-codex-project-group.drop-before>.dsh-codex-tree-project:before,.dsh-codex-root .dsh-codex-project-group.drop-after>.dsh-codex-tree-project:before{content:'';position:absolute;left:2px;width:6px;height:6px;border:1.5px solid var(--codex-accent);border-radius:50%;background:var(--codex-bg);z-index:6;pointer-events:none}
.dsh-codex-root .dsh-codex-project-group.drop-before>.dsh-codex-tree-project:before{top:-4px}
.dsh-codex-root .dsh-codex-project-group.drop-after>.dsh-codex-tree-project:before{bottom:-4px}
.dsh-codex-root .dsh-codex-tree-project.expanded{background:transparent}
.dsh-codex-root .dsh-codex-tree-project.expanded:hover{background:var(--codex-soft)}
.dsh-codex-root .dsh-codex-tree-sessions{padding-left:0}
.dsh-codex-root .dsh-codex-tree-sessions .dsh-codex-thread{padding-left:18px}
.dsh-codex-root [data-scrolling=true]{text-overflow:clip}
.dsh-codex-root [data-scrolling=true][data-scroll-edge=end]{mask-image:linear-gradient(to right,#000 calc(100% - 14px),transparent)}
.dsh-codex-root [data-scrolling=true][data-scroll-edge=start]{mask-image:linear-gradient(to right,transparent,#000 14px)}
.dsh-codex-root [data-scrolling=true][data-scroll-edge=both]{mask-image:linear-gradient(to right,transparent,#000 14px,#000 calc(100% - 14px),transparent)}
.dsh-codex-root .dsh-codex-sessions-transition{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows 220ms ease,opacity 180ms ease}
.dsh-codex-root .dsh-codex-sessions-transition.is-expanded{grid-template-rows:1fr;opacity:1}
.dsh-codex-root .dsh-codex-sessions-transition>div{min-height:0;overflow:hidden}
.dsh-codex-root .dsh-codex-thread{padding:6px 8px;min-height:38px;border-radius:7px}
.dsh-codex-root .dsh-codex-thread.active{background:var(--codex-selected);color:var(--codex-accent)}
.dsh-codex-root .dsh-codex-thread-name{font-size:13px}
.dsh-codex-root .dsh-codex-thread-trailing{position:relative;display:flex;align-items:center;justify-content:flex-end;flex:none;min-width:28px;margin-left:6px}
.dsh-codex-root .dsh-codex-thread-time{font-size:11px;white-space:nowrap;color:var(--codex-muted)}
.dsh-codex-root .dsh-codex-thread-trailing .dsh-codex-row-menu{position:absolute;right:0;margin:0;opacity:0;pointer-events:none}
.dsh-codex-root .dsh-codex-thread-trailing .dsh-codex-row-menu-trigger{opacity:1}
.dsh-codex-root .dsh-codex-thread-trailing.running{width:28px}
.dsh-codex-root .dsh-codex-thread:hover .dsh-codex-thread-trailing.running,.dsh-codex-root .dsh-codex-thread:focus-visible .dsh-codex-thread-trailing.running,.dsh-codex-root .dsh-codex-thread:has(.dsh-codex-row-menu-trigger:focus-visible) .dsh-codex-thread-trailing.running{width:50px;justify-content:flex-start}
.dsh-codex-root .dsh-codex-thread:hover .dsh-codex-thread-time,.dsh-codex-root .dsh-codex-thread:focus-visible .dsh-codex-thread-time,.dsh-codex-root .dsh-codex-thread:has(.dsh-codex-row-menu-trigger:focus-visible) .dsh-codex-thread-time{visibility:hidden}
.dsh-codex-root .dsh-codex-thread:hover .dsh-codex-row-menu,.dsh-codex-root .dsh-codex-thread:focus-visible .dsh-codex-row-menu,.dsh-codex-root .dsh-codex-thread:has(.dsh-codex-row-menu-trigger:focus-visible) .dsh-codex-row-menu{opacity:1;pointer-events:auto}
.dsh-codex-root .dsh-codex-row-menu-trigger{height:30px;width:28px;color:var(--codex-muted)}
.dsh-codex-root .dsh-codex-focus-footer{padding:12px 4px;border-top:1px solid var(--codex-border);margin-top:auto}
.dsh-codex-sidebar-health{display:flex;align-items:center;gap:8px;font-size:12px}
.dsh-codex-sidebar-health .dsh-codex-icon-button{margin-left:auto}
.dsh-codex-sidebar-quota{position:relative;padding:5px 0;font-size:12px;color:var(--codex-muted)}
.quota-trigger{display:flex;flex-wrap:wrap;gap:4px 12px;width:100%;padding:5px 4px;border:0;border-radius:8px;background:transparent;color:inherit;text-align:left;cursor:pointer}
.quota-trigger:hover,.quota-trigger[aria-expanded=true]{background:var(--codex-hover,rgba(128,128,128,.1))}
.quota-trigger:focus-visible,.quota-popover-header button:focus-visible{outline:2px solid #668ed2;outline-offset:2px}
.quota-chip{display:inline-flex;align-items:center;gap:7px;white-space:nowrap;min-height:25px}
.quota-ring{display:block;flex:0 0 24px;width:24px;height:24px;overflow:visible}
.dsh-codex-root .model-name-list{max-height:none;overflow:visible}
.dsh-codex-root .model-name-list .dsh-codex-menu-item{padding-top:7px;padding-bottom:7px}
.dsh-effort-inline{padding:8px 12px 14px}
.dsh-codex-menu-cell:has(.dsh-effort-current){position:relative}
.dsh-effort-current{position:absolute;left:50%;transform:translateX(-50%);font-size:12px;font-weight:600;color:var(--codex-text);pointer-events:none}
.dsh-effort-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;color:var(--codex-muted)}
.dsh-effort-heading strong{font-size:13px;font-weight:600;color:var(--codex-text)}
.dsh-effort-heading button{display:grid;place-items:center;border:0;background:transparent;color:inherit;padding:4px;border-radius:5px;cursor:pointer}
.dsh-effort-track{position:relative;height:26px;border-radius:20px;background:rgba(128,128,128,.17);margin:0 2px;overflow:hidden}
.dsh-effort-fill{position:absolute;inset:0 auto 0 0;width:calc(var(--effort-progress) + var(--effort-offset));border-radius:20px 0 0 20px;background:linear-gradient(90deg, hsl(211 78% 43%), var(--effort-color));pointer-events:none}
.dsh-effort-dots{position:absolute;z-index:1;inset:0 13px;display:flex;align-items:center;justify-content:space-between;pointer-events:none}
.dsh-effort-dots i{width:4px;height:4px;flex:none;border-radius:50%;background:rgba(95,101,110,.5)}
.dsh-effort-dots i.is-active{background:rgba(255,255,255,.75)}
.dsh-effort-thumb{position:absolute;z-index:2;top:0;left:calc(var(--effort-progress) + var(--effort-offset));transform:translateX(-50%);width:26px;height:26px;box-sizing:border-box;border:1px solid rgba(0,0,0,.1);border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.12);pointer-events:none}
.dsh-codex-root .dsh-effort-track input{position:absolute;z-index:3;inset:0;display:block;width:100%;height:26px;min-height:0;margin:0;padding:0;border:0;border-radius:20px;box-sizing:border-box;box-shadow:none;appearance:none;-webkit-appearance:none;background:transparent;cursor:pointer;color:transparent}
.dsh-effort-track input::-webkit-slider-runnable-track{height:26px;background:transparent}
.dsh-effort-track input::-webkit-slider-thumb{appearance:none;-webkit-appearance:none;width:26px;height:26px;border:0;background:transparent;box-shadow:none;opacity:0}
.dsh-effort-track input::-moz-range-track{height:26px;background:transparent}
.dsh-effort-track input::-moz-range-thumb{width:26px;height:26px;border:0;background:transparent;box-shadow:none;opacity:0}
.dsh-effort-track input:focus-visible{outline:2px solid #758c9a;outline-offset:3px;border-radius:20px}
.dsh-effort-slider{padding:12px 14px 16px;display:flex;flex-direction:column;align-items:center;gap:8px}
.dsh-effort-slider>strong{color:#3983ef;font-size:14px}
.dsh-effort-slider>span{font-size:12px;color:var(--codex-muted)}
.dsh-effort-slider input{width:100%;height:26px;accent-color:#3983ef;cursor:pointer}
.dsh-effort-ticks{display:flex;width:100%;justify-content:space-between;font-size:10px;color:var(--codex-muted);gap:4px}
.quota-ring-track{stroke:rgba(128,145,155,.24)}
.quota-ring-value{stroke:var(--quota-color,#758c9a)}
.quota-ring-icon{fill:var(--quota-color,#758c9a)}
.quota-normal{--quota-color:#328665}
.quota-low{--quota-color:#b87713}
.quota-critical{--quota-color:#d04b4b}
.quota-chip.quota-normal,.quota-chip.quota-low,.quota-chip.quota-critical{color:var(--quota-color)}
.quota-detail .quota-detail-heading span{color:var(--quota-color,var(--codex-muted))}
.quota-popover{position:absolute;z-index:60;left:0;bottom:calc(100% + 8px);width:100%;max-height:min(60vh,420px);overflow:auto;box-sizing:border-box;padding:16px;border:1px solid var(--codex-border);border-radius:14px;background:var(--codex-bg);color:var(--codex-text);box-shadow:0 12px 36px rgba(0,0,0,.18)}
.quota-popover-header,.quota-detail-heading{display:flex;align-items:center;justify-content:space-between;gap:12px}
.quota-popover-header{font-size:14px;margin-bottom:12px}
.quota-popover-header button{border:0;background:transparent;color:var(--codex-muted);font-size:20px;line-height:1;cursor:pointer}
.quota-detail{padding:14px 0 12px;border-top:1px solid var(--codex-border)}
.quota-detail-heading{font-size:12px}
.quota-detail-heading strong{font-weight:600}
.quota-detail-heading span,.quota-detail-date,.quota-detail-extra{color:var(--codex-muted)}
.quota-progress{height:5px;margin:10px 0 12px;border-radius:4px;background:rgba(128,128,128,.2);overflow:hidden}
.quota-progress span{display:block;height:100%;border-radius:4px;background:var(--quota-color,#758c9a)}
.quota-reset-box{display:flex;align-items:flex-start;gap:9px;padding:10px;border-radius:8px;background:var(--codex-panel);font-size:12px;line-height:1.5}
.quota-reset-box svg{flex:none;margin-top:1px;color:var(--codex-muted)}
.quota-detail-reset{font-weight:600;color:var(--codex-text)}
.quota-detail-date{font-size:11px;margin-top:2px}
.quota-detail-extra{display:flex;flex-wrap:wrap;gap:6px 12px;padding:10px 0 0;border-top:1px solid var(--codex-border);font-size:11px;line-height:1.5}
.dsh-codex-root .dsh-codex-nav-resize{grid-column:2;grid-row:1/3;justify-self:end;width:8px;height:100%;z-index:10;cursor:col-resize;touch-action:none}
.dsh-codex-root.is-nav-resizing{transition:none;user-select:none;cursor:col-resize}
.dsh-codex-root.is-nav-collapsed .dsh-codex-nav-resize{display:none}
.dsh-codex-root.is-nav-collapsed{grid-template-columns:0 0 minmax(0,1fr) auto}
.dsh-codex-root.is-nav-collapsed .dsh-codex-focus-sidebar{opacity:0;visibility:hidden;pointer-events:none;transition:opacity 160ms ease,visibility 0s linear 220ms}
.dsh-codex-root .dsh-codex-thread-header{padding:0 26px;height:44px;min-height:44px;display:flex;align-items:center;border-bottom:1px solid var(--codex-border);background:var(--codex-bg);overflow:hidden}
.dsh-codex-root .dsh-codex-chips{gap:12px;flex-wrap:nowrap;min-width:0;overflow-x:auto;white-space:nowrap;margin-top:0;scrollbar-width:none}
.dsh-codex-root .dsh-codex-chip{font-size:12px;padding:0;border:0;background:transparent;color:var(--codex-muted)}
.dsh-codex-root .dsh-codex-chip[data-meta="effort"],.dsh-codex-root .dsh-codex-chip[data-meta="updated"]{display:none}
.dsh-codex-root .dsh-codex-messages{padding:28px 32px 18px}
.dsh-codex-root .dsh-codex-messages>div,.dsh-codex-root .dsh-codex-messages>article{max-width:800px;margin-left:auto;margin-right:auto}
.dsh-codex-root .dsh-codex-message{margin-bottom:22px;font-size:15px}
.dsh-codex-root .dsh-codex-message-meta{font-size:12px;gap:8px;margin-bottom:9px;color:var(--codex-muted)}
.dsh-codex-root .dsh-codex-message-text,.dsh-codex-root .dsh-codex-markdown{font-size:15px;line-height:1.85}
.dsh-codex-root .dsh-codex-markdown h1{font-size:24px}.dsh-codex-root .dsh-codex-markdown h2{font-size:20px}.dsh-codex-root .dsh-codex-markdown h3{font-size:17px}
.dsh-codex-root .dsh-codex-markdown :where(h1,h2,h3){margin:20px 0 12px;line-height:1.5;letter-spacing:-.2px}
.dsh-codex-root .dsh-codex-markdown :where(p,ul,ol){margin:10px 0 14px}
.dsh-codex-root .dsh-codex-markdown li{padding:3px 0}
.dsh-codex-root .dsh-codex-markdown a{color:var(--codex-accent);text-decoration:underline;text-underline-offset:3px}
.dsh-codex-root .dsh-codex-markdown pre,.dsh-codex-root .dsh-codex-raw pre{background:var(--codex-panel);border:1px solid var(--codex-border);border-radius:8px;padding:14px;font-size:13px;line-height:1.75}
.dsh-codex-root .dsh-codex-markdown code{font-size:.9em}
.dsh-codex-root .dsh-codex-message.user .dsh-codex-message-text,.dsh-codex-root .dsh-codex-message-user{background:var(--codex-panel);border:1px solid var(--codex-border);border-radius:10px}
.dsh-codex-root .dsh-codex-toast-host{position:fixed;z-index:2000;top:20px;right:20px;display:flex;flex-direction:column;gap:8px;width:min(360px,calc(100vw - 32px));pointer-events:none}
.dsh-codex-root .dsh-codex-toast{pointer-events:auto;display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border:1px solid var(--codex-border);border-radius:10px;background:var(--codex-panel);color:var(--codex-text);box-shadow:0 8px 24px #0003;font-size:13px;line-height:1.5}
.dsh-codex-root .dsh-codex-toast-symbol{flex:none;width:19px;height:19px;color:var(--codex-accent)}
.dsh-codex-root .dsh-codex-toast.is-success .dsh-codex-toast-symbol{color:var(--codex-success)}
.dsh-codex-root .dsh-codex-toast.is-error .dsh-codex-toast-symbol{color:var(--codex-danger)}
.dsh-codex-root .dsh-codex-toast-message{flex:1;min-width:0;overflow-wrap:anywhere;white-space:pre-wrap}
.dsh-codex-root .dsh-codex-toast button{display:flex;flex:none;align-items:center;justify-content:center;padding:2px;border:0;border-radius:4px;background:transparent;color:var(--codex-muted);cursor:pointer}
.dsh-codex-root .dsh-codex-toast button:hover{background:var(--codex-soft);color:var(--codex-text)}
.dsh-codex-root .dsh-codex-running-bar{width:min(800px,calc(100% - 64px));margin:0 auto;padding:4px 0;gap:8px;font-size:13px;line-height:1.6;color:var(--codex-muted)}
.dsh-codex-root .dsh-codex-running-spinner{display:block;width:16px;height:16px;flex:0 0 16px;border:0;border-radius:0;color:var(--codex-muted);animation:dsh-codex-spin 1s linear infinite}
@media (prefers-reduced-motion:reduce){.dsh-codex-root .dsh-codex-running-spinner{animation:none}}
.dsh-codex-root .dsh-codex-tool-group{margin:16px auto 22px}
.dsh-codex-root .dsh-codex-tool-group-head{width:100%;min-height:42px;padding:8px 12px;border:1px solid var(--codex-border);border-radius:8px;background:var(--codex-bg);color:var(--codex-muted);font-size:13px}
.dsh-codex-root .dsh-codex-tool-group-body{margin:12px 0 0 16px;border-left:1px solid var(--codex-border);padding-left:14px}
.dsh-codex-root .dsh-codex-tool-head,.dsh-codex-root .dsh-codex-turn-footer{font-size:12px;color:var(--codex-muted)}
.dsh-codex-root .dsh-codex-composer-wrap{flex-direction:column;align-items:center;padding:10px 26px 16px;background:var(--codex-bg)}
.dsh-codex-root .dsh-codex-composer-card{max-width:800px;width:100%;border:1px solid var(--codex-border);border-radius:11px;background:var(--codex-bg);box-shadow:none;padding:10px}
.dsh-codex-root .dsh-codex-composer-card:focus-within{border-color:var(--codex-accent);box-shadow:0 0 0 2px var(--codex-selected)}
.dsh-codex-root .dsh-codex-composer-input{font-size:15px;line-height:1.75;min-height:60px;padding:5px 6px;outline:0!important}
.dsh-codex-root .dsh-codex-composer-bottom{padding:2px 0 0;gap:5px}
.dsh-codex-root .dsh-codex-permission-pending{box-sizing:border-box;width:min(800px,calc(100% - 52px));margin:0 auto 6px;padding:8px 12px;border-radius:7px;background:var(--codex-warning-bg);color:var(--codex-warning);font-size:12px;line-height:1.5}
.dsh-codex-root .dsh-codex-composer-row{gap:5px;flex-wrap:wrap;container:codex-composer-toolbar / inline-size}
.dsh-codex-root .dsh-codex-composer-tools{flex:none;gap:6px}
.dsh-codex-root .dsh-codex-composer-tools>button,.dsh-codex-root .dsh-codex-send,.dsh-codex-root .dsh-codex-stop{flex-shrink:0}
.dsh-codex-root .dsh-codex-permission-trigger{flex:none;white-space:nowrap}
.dsh-codex-root .dsh-codex-composer-spacer{min-width:0;flex:1 1 0}
.dsh-codex-root .dsh-codex-composer-trailing{min-width:0;flex:1 1 160px;gap:6px;justify-content:flex-end}
.dsh-codex-root .dsh-codex-model-trigger{min-width:0;flex:0 1 auto}
.dsh-codex-root .dsh-codex-model-trigger>svg{flex:none}
.dsh-codex-root .dsh-codex-model-label{min-width:0}
.dsh-codex-root .dsh-codex-attach{width:36px;height:36px}
.dsh-codex-root .dsh-codex-plus{width:36px;height:36px;background:transparent;color:var(--codex-muted)}
.dsh-codex-root .dsh-codex-permission-trigger,.dsh-codex-root .dsh-codex-model-trigger{min-height:36px;border-radius:7px;font-size:12px;color:var(--codex-muted)}
.dsh-codex-root .dsh-codex-stop,.dsh-codex-root .dsh-codex-send{box-sizing:border-box;width:40px;height:40px;padding:0;border-radius:8px}
.dsh-codex-root .dsh-codex-stop{border:1px solid var(--codex-border);background:transparent;color:var(--codex-muted)}
.dsh-codex-root .dsh-codex-send{background:var(--codex-text);color:var(--codex-bg)}
.dsh-codex-root .dsh-codex-send:disabled{opacity:.35}
.dsh-codex-root .dsh-codex-attachment{font-size:12px;border-radius:6px;background:var(--codex-panel);padding:4px 6px 4px 9px}
.dsh-codex-root .dsh-codex-attachment .dsh-codex-attachment-remove{display:grid;place-items:center;min-width:26px;min-height:26px}
.dsh-codex-root .dsh-codex-attachment-card{position:relative;box-sizing:border-box;width:72px;height:72px;padding:3px;flex:none;overflow:visible;justify-content:center}
.dsh-codex-root .dsh-codex-message-images{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px}
.dsh-codex-root .dsh-codex-message-images:last-child{margin-bottom:0}
.dsh-codex-root .dsh-codex-message-file{display:flex;align-items:center;gap:8px;max-width:220px;padding:8px 10px;border:1px solid var(--codex-border);border-radius:7px;background:var(--codex-bg);font-size:12px}
.dsh-codex-root .dsh-codex-message-file span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-codex-root .dsh-codex-message-images .dsh-codex-image{margin:0;max-width:180px}
.dsh-codex-root .dsh-codex-message-images .dsh-codex-image img{max-width:180px;max-height:140px}
.dsh-codex-root .dsh-codex-message-images figcaption{max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-codex-root .dsh-codex-image-viewer-trigger{display:inline-block;padding:0;border:0;background:transparent;cursor:zoom-in;line-height:0;max-width:100%}
.dsh-codex-root .dsh-codex-markdown .dsh-codex-image-viewer-trigger img{display:block;max-width:min(100%,480px);max-height:320px;width:auto;height:auto;object-fit:contain;border-radius:6px}
.dsh-codex-root .dsh-codex-image img{max-width:min(100%,480px);max-height:320px;width:auto;height:auto}
.dsh-codex-root .dsh-codex-attachment-card .dsh-codex-image-viewer-trigger{width:64px;height:64px;min-width:0;min-height:0;border-radius:4px}
.dsh-codex-root .dsh-codex-attachment-preview{display:block;width:64px;height:64px;object-fit:cover;border-radius:4px}
.dsh-codex-root .dsh-codex-attachment-placeholder{width:64px;height:64px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:var(--codex-muted)}
.dsh-codex-root .dsh-codex-attachment-placeholder span{font-size:10px;max-width:60px;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-codex-root .dsh-codex-attachment-card .dsh-codex-attachment-remove{position:absolute;top:-7px;right:-7px;width:22px;height:22px;min-width:22px;min-height:22px;background:var(--codex-bg);border:1px solid var(--codex-border);border-radius:50%;opacity:0;pointer-events:none;z-index:1}
.dsh-codex-root .dsh-codex-attachment-card:hover .dsh-codex-attachment-remove,.dsh-codex-root .dsh-codex-attachment-card:focus-within .dsh-codex-attachment-remove{opacity:1;pointer-events:auto}
@media (hover:none){.dsh-codex-root .dsh-codex-attachment-card .dsh-codex-attachment-remove{opacity:1;pointer-events:auto}}
.dsh-codex-root .dsh-codex-plan-tag{background:var(--codex-selected);color:var(--codex-accent);font-size:12px}
.dsh-codex-root .dsh-codex-plus-panel,.dsh-codex-root .dsh-codex-menu,.dsh-codex-root .dsh-codex-permission-menu,.dsh-codex-root .dsh-codex-slash,.dsh-codex-root .dsh-codex-row-menu-pop,.dsh-codex-root .dsh-codex-action-menu{border:1px solid var(--codex-border);border-radius:9px;box-shadow:var(--dsw-elevation-prominent);background:var(--codex-bg);color:var(--codex-text);padding:6px}
.dsh-codex-root .dsh-codex-plus-panel{width:min(560px,calc(100% - 32px));max-height:min(540px,65vh);overflow:auto}
.dsh-codex-root .dsh-codex-plus-item{min-height:40px;height:auto;padding:8px;gap:10px}
.dsh-codex-root .dsh-codex-plus-label{font-size:13px}
.dsh-codex-root .dsh-codex-plus-hint{font-size:12px;max-width:50%}
.dsh-codex-root .dsh-codex-menu-title,.dsh-codex-root .dsh-codex-menu-desc,.dsh-codex-root .dsh-codex-slash-desc{font-size:12px;color:var(--codex-muted)}
.dsh-codex-root .dsh-codex-menu-item,.dsh-codex-root .dsh-codex-permission-option,.dsh-codex-root .dsh-codex-slash-item{min-height:40px;padding:9px 10px;border-radius:6px;font-size:13px}
.dsh-codex-root .dsh-codex-slash{max-width:calc(100% - 32px)}
.dsh-codex-root .dsh-codex-thread-actions{position:relative;gap:4px}
.dsh-codex-action-backdrop{position:fixed;inset:0;z-index:1250;background:transparent}
.dsh-codex-root .dsh-codex-action-menu{position:absolute;top:calc(100% + 6px);right:0;z-index:1251;width:220px}
.dsh-codex-action-menu button{display:flex;align-items:center;gap:10px;width:100%;min-height:40px;padding:8px 10px;border:0;border-radius:6px;background:transparent;color:inherit;text-align:left;font-size:13px;cursor:pointer}
.dsh-codex-action-menu button:hover{background:var(--codex-soft)}
.dsh-codex-menu-divider{height:1px;background:var(--codex-border);margin:5px}
.dsh-codex-root .dsh-codex-dialog-backdrop{padding:20px;background:#10182366;z-index:1700}
.dsh-codex-root .dsh-codex-dialog{width:min(560px,calc(100vw - 40px));max-height:calc(100dvh - 40px);overflow:auto;padding:0;border:1px solid var(--codex-border);border-radius:12px;box-shadow:var(--dsw-elevation-prominent);font-size:14px}
.dsh-codex-root .dsh-codex-dialog-head{font-size:16px;font-weight:600;padding:18px 20px;border-bottom:1px solid var(--codex-border);margin:0 0 16px}
.dsh-codex-root .dsh-codex-dialog>.dsh-codex-search{width:calc(100% - 40px);margin:0 20px 14px}
.dsh-codex-root .dsh-codex-dialog-actions{padding:14px 20px;margin-top:16px;border-top:1px solid var(--codex-border);gap:8px}
.dsh-codex-root .dsh-codex-dialog :where(.dsh-codex-hint,.dsh-codex-approval-meta,.dsh-codex-dialog-error){padding-left:20px;padding-right:20px;font-size:13px}
.dsh-codex-root .dsh-codex-picker-item{min-height:62px;padding:12px 20px;border-radius:0}
.dsh-codex-root .dsh-codex-picker-name{font-size:14px}.dsh-codex-root .dsh-codex-picker-path{font-size:12px;color:var(--codex-muted)}
.dsh-codex-root .dsh-codex-picker-section{padding:0 20px 8px;font-size:12px}
.dsh-codex-root .dsh-codex-versions{width:min(660px,calc(100vw - 40px))}
.dsh-codex-root .dsh-codex-version-grid,.dsh-codex-root .dsh-codex-version-actions,.dsh-codex-root .dsh-codex-version-daemon,.dsh-codex-root .dsh-codex-version-doctor{margin:12px 20px;font-size:13px}
.dsh-codex-root .dsh-codex-version-grid{padding:12px;background:var(--codex-panel);border:1px solid var(--codex-border);border-radius:8px;gap:9px 16px}
.dsh-codex-root .dsh-codex-doctor-row{padding:8px 0;border-top:1px solid var(--codex-border);font-size:12px;line-height:1.8}
.dsh-codex-root .dsh-codex-browse{width:min(800px,calc(100vw - 40px));padding:0}
.dsh-codex-root .dsh-codex-browse-head{padding:16px 20px;border-bottom:1px solid var(--codex-border)}
.dsh-codex-root .dsh-codex-browse-body{min-height:240px;padding:8px}
.dsh-codex-root .dsh-codex-browse-row{min-height:42px;font-size:13px}
.dsh-codex-root .dsh-codex-browse-title{font-size:16px;font-weight:600}
.dsh-codex-root .dsh-codex-browse-crumbs,.dsh-codex-root .dsh-codex-browse-target{font-size:12px}
.dsh-codex-root .dsh-codex-browse-foot{padding:14px 20px}
.dsh-codex-root .dsh-codex-browse-actions{flex-wrap:wrap}
.dsh-codex-root .dsh-codex-approvals{width:min(800px,calc(100% - 64px));margin:8px auto;gap:10px;padding:0;max-height:min(42vh,460px);overflow-y:auto}
.dsh-codex-root .dsh-codex-approval{width:100%;min-width:0;border:1px solid var(--codex-border);background:var(--codex-warning-bg);border-radius:9px;padding:16px;margin:0;gap:10px;font-size:13px}
.dsh-codex-root .dsh-codex-approval :where(pre,.dsh-codex-approval-meta,.dsh-codex-question-title,.dsh-codex-question-body,.dsh-codex-option){min-width:0;max-width:100%;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word}
.dsh-codex-root .dsh-codex-approval pre{margin:0;overflow-x:hidden;line-height:1.7;border:1px solid var(--codex-border)}
.dsh-codex-root .dsh-codex-question{gap:8px}
.dsh-codex-root .dsh-codex-question-form{display:flex;flex-direction:column;gap:12px;min-width:0}
.dsh-codex-root fieldset.dsh-codex-question{border:0;padding:0;margin:0;min-width:0}
.dsh-codex-root .dsh-codex-question legend{padding:0;margin-bottom:12px;font-size:14px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}
.dsh-codex-root .dsh-codex-question-tabs{display:flex;gap:6px;flex-wrap:wrap}
.dsh-codex-root .dsh-codex-question-tabs button{border:1px solid var(--codex-border);background:transparent;color:var(--codex-muted);padding:4px 8px;border-radius:6px;font:inherit;font-size:12px;cursor:pointer;overflow-wrap:anywhere}
.dsh-codex-root .dsh-codex-question-tabs button.selected{background:var(--codex-selected);color:var(--codex-text)}
.dsh-codex-root .dsh-codex-question-choices{display:flex;flex-direction:column;gap:6px}
.dsh-codex-root .dsh-codex-question-choice{display:flex;align-items:flex-start;gap:10px;border:1px solid var(--codex-border);border-radius:7px;padding:10px 12px;cursor:pointer;min-width:0;line-height:1.5}
.dsh-codex-root .dsh-codex-question-choice.selected{background:var(--codex-selected);border-color:var(--codex-accent)}
.dsh-codex-root .dsh-codex-question-choice input{flex:none;margin:4px 0 0;accent-color:var(--codex-accent)}
.dsh-codex-root .dsh-codex-question-choice span{min-width:0;white-space:pre-wrap;overflow-wrap:anywhere}
.dsh-codex-root .dsh-codex-question-choice strong{font-weight:500}
.dsh-codex-root .dsh-codex-question-choice small{display:block;color:var(--codex-muted);margin-top:3px;font-size:12px}
.dsh-codex-root .dsh-codex-question-freeform{display:flex;flex-direction:column;gap:6px;margin-top:8px;font-size:12px;color:var(--codex-muted)}
.dsh-codex-root .dsh-codex-question-freeform :is(input,textarea){width:100%;min-width:0;box-sizing:border-box;font:inherit;color:var(--codex-text)}
.dsh-codex-root .dsh-codex-question-freeform textarea{resize:vertical;min-height:66px}
.dsh-codex-root .dsh-codex-question-footer{display:flex;align-items:center;justify-content:space-between;gap:8px}
.dsh-codex-root .dsh-codex-question-footer>span{font-size:12px;color:var(--codex-muted)}
.dsh-codex-root .dsh-codex-question-error{color:var(--codex-danger);font-size:12px;overflow-wrap:anywhere}
.dsh-codex-root .dsh-codex-agent-questions{border:1px solid var(--codex-border);background:var(--codex-panel);border-radius:9px;padding:16px;min-width:0}
.dsh-codex-root .dsh-codex-question-status{font-size:13px;overflow-wrap:anywhere}
.dsh-codex-root .dsh-codex-question-status small{display:block;color:var(--codex-muted);margin-top:6px}
.dsh-codex-root .dsh-codex-question-body{font-size:13px;line-height:1.7}
.dsh-codex-root .dsh-codex-option{min-height:36px;font-size:13px;text-align:left}
.dsh-codex-root .dsh-codex-option.selected{background:var(--codex-selected);border-color:var(--codex-accent);color:var(--codex-text)}
.dsh-codex-root .dsh-codex-permission-menu{width:min(410px,calc(100vw - 32px));max-height:min(65vh,560px);overflow-y:auto}
.dsh-codex-root .dsh-codex-permission-option .dsh-codex-menu-desc{white-space:normal;overflow:visible;overflow-wrap:anywhere;line-height:1.6}
.dsh-codex-root .dsh-codex-permission-meta{gap:3px}
.dsh-codex-root .dsh-codex-approval-head{font-size:14px;font-weight:600;color:var(--codex-warning)}
.dsh-codex-root .dsh-codex-approval-meta{font-size:13px;line-height:1.8}
.dsh-codex-root .dsh-codex-approval-actions{gap:8px;padding-top:12px;flex-wrap:wrap}
.dsh-codex-root .dsh-codex-approval pre{font-size:13px;padding:12px;border-radius:6px;background:var(--codex-bg)}
.dsh-codex-root .dsh-codex-empty,.dsh-codex-root .dsh-codex-loading{font-size:14px;color:var(--codex-muted);line-height:1.85}
.dsh-codex-root .dsh-codex-empty{max-width:680px;margin:auto}
.dsh-codex-root .dsh-codex-dot.ok{background:var(--codex-success)}
.dsh-codex-root .dsh-codex-thread .dsh-codex-dot.done{background:#16c95b}
.dsh-codex-root .dsh-codex-error,.dsh-codex-root .dsh-codex-dialog-error,.dsh-codex-root .dsh-codex-right-error,.dsh-codex-root [role="alert"]{color:var(--codex-danger);font-size:13px;overflow-wrap:anywhere}
.dsh-codex-root .codex-sidebar{grid-column:4;grid-row:1/4;background:var(--codex-panel)}
.dsh-codex-root.has-right .dsh-codex-workbench-status{grid-column:1/4}
.dsh-codex-root .codex-sidebar.is-fullscreen{z-index:1200;background:var(--codex-bg)}
.dsh-codex-root .codex-sidebar [data-dockkit-host='dock'][data-dockkit-column='0'] > [data-dockkit-content]{border-left:0}
.dsh-codex-root .codex-sidebar-control{width:34px;height:38px;padding:0;color:var(--codex-muted);display:inline-grid}
.dsh-codex-root .codex-sidebar [data-dockkit-strip]{min-height:46px;height:46px;padding:3px 8px;border-bottom:1px solid var(--codex-border);background:var(--codex-bg)}
.dsh-codex-root .codex-sidebar [data-dockkit-strip-tabs]{scrollbar-width:none}
.dsh-codex-root .codex-sidebar [data-dockkit-strip-tabs]::-webkit-scrollbar{display:none;width:0;height:0}
.dsh-codex-root .codex-sidebar [data-dockkit-tab]{font-size:13px;min-height:32px;min-width:120px;max-width:220px;flex:0 0 auto;padding-right:32px;color:var(--codex-muted)}
.dsh-codex-root .codex-sidebar [data-dockkit-tab] [data-dockkit-tab-title]{mask-image:none;overflow:hidden;text-overflow:ellipsis;display:block;white-space:nowrap}
.dsh-codex-root .codex-sidebar [data-dockkit-tab][aria-selected="true"]{color:var(--codex-accent);background:var(--codex-selected)}
.dsh-codex-root .codex-sidebar-file-toolbar{padding:4px 12px;height:44px;min-height:44px;gap:8px}
.dsh-codex-root .codex-sidebar-file-toolbar-title{flex:1;min-width:0;font-size:12px;color:var(--codex-muted)}
.dsh-codex-root .codex-sidebar-file-toolbar code,.dsh-codex-root .codex-sidebar-file-row>span:nth-child(2),.dsh-codex-root .codex-sidebar-document header code,.dsh-codex-root .codex-sidebar [data-dockkit-tab-title]{font-family:var(--dsh-font-family-code);font-variant-ligatures:none;-webkit-font-smoothing:antialiased}
.dsh-codex-root .codex-sidebar-file-toolbar code{font-size:12px}
.dsh-codex-root .codex-sidebar-file-toolbar :where(button,label){font-size:12px}
.dsh-codex-root .codex-sidebar-file-toolbar button{display:grid;place-items:center;width:32px;height:32px;border:0;border-radius:6px;background:transparent;color:var(--codex-muted);cursor:pointer}
.dsh-codex-root .codex-sidebar-file-row{height:38px;font-size:13px;gap:8px;border-radius:5px}
.dsh-codex-root .codex-sidebar-file-row>span:first-child{display:flex;align-items:center;gap:5px;flex:none;color:var(--codex-muted)}
.dsh-codex-root .codex-sidebar-file-row small{font-size:12px;opacity:1;color:var(--codex-muted)}
.dsh-codex-root .codex-sidebar-document header{height:44px;min-height:44px;flex:none;gap:4px;padding:4px 10px;flex-wrap:nowrap;font-size:12px;background:var(--codex-bg)}
.dsh-codex-root .codex-sidebar-document header code{flex:1 1 0;min-width:0;font-size:12px;color:var(--codex-muted)}
.dsh-codex-root .codex-sidebar-document header select{flex:none;max-width:88px;border:0;background:transparent;color:var(--codex-muted)}
.dsh-codex-root .codex-sidebar-document .document-icon-button{display:inline-grid;place-items:center;width:30px;height:30px;min-height:30px;padding:0;border:0;background:transparent;color:var(--codex-muted);flex:none}
.dsh-codex-root .codex-sidebar-document .document-icon-button:hover,.dsh-codex-root .codex-sidebar-document .document-icon-button[aria-pressed=true]{background:var(--codex-soft);color:var(--codex-text)}
.dsh-codex-root .document-code-toolbar{display:flex;align-items:center;justify-content:space-between;padding:4px 10px;color:var(--codex-muted);font-size:12px;position:sticky;top:0;background:var(--codex-bg);z-index:1}
.dsh-codex-root .codex-sidebar-document button{min-height:30px;padding:5px 8px;font-size:12px}
.dsh-codex-root .codex-sidebar-document-body{background:var(--codex-bg)}
.dsh-codex-root .codex-sidebar-document-body pre{font-size:13px;line-height:1.85;padding:4px 12px 18px}
.dsh-codex-root .document-code{min-width:100%;width:max-content;white-space:pre;font-family:var(--dsh-font-family-code);font-size:13px;font-weight:400;font-variant-ligatures:none;letter-spacing:0;color:var(--codex-text);-webkit-font-smoothing:antialiased}
.dsh-codex-root .document-code .hljs-keyword,.dsh-codex-root .document-code .hljs-meta{color:#cf3060}
.dsh-codex-root .document-code .hljs-string,.dsh-codex-root .document-code .hljs-regexp{color:#16803e}
.dsh-codex-root .document-code .hljs-number,.dsh-codex-root .document-code .hljs-literal{color:#7c4db1}
.dsh-codex-root .document-code .hljs-comment{color:#78828c;font-style:italic}
.dsh-codex-root .document-code .hljs-title,.dsh-codex-root .document-code .hljs-built_in,.dsh-codex-root .document-code .hljs-type{color:#3065a2}
.dsh-codex-root[data-codex-theme="dark"] .document-code .hljs-keyword,.dsh-codex-root[data-codex-theme="dark"] .document-code .hljs-meta{color:#ed91ab}
.dsh-codex-root[data-codex-theme="dark"] .document-code .hljs-string,.dsh-codex-root[data-codex-theme="dark"] .document-code .hljs-regexp{color:#8bcf9a}
.dsh-codex-root[data-codex-theme="dark"] .document-code .hljs-number,.dsh-codex-root[data-codex-theme="dark"] .document-code .hljs-literal{color:#c7a5ed}
.dsh-codex-root[data-codex-theme="dark"] .document-code .hljs-comment{color:#9ba5ad}
.dsh-codex-root[data-codex-theme="dark"] .document-code .hljs-title,.dsh-codex-root[data-codex-theme="dark"] .document-code .hljs-built_in,.dsh-codex-root[data-codex-theme="dark"] .document-code .hljs-type{color:#9bbcdf}
.dsh-codex-root .document-code-line{display:flex;align-items:flex-start}
.dsh-codex-root .document-code-line .codex-sidebar-line-number{flex:0 0 44px}
.dsh-codex-root .document-code-text{min-width:0}
.dsh-codex-root .document-code.is-wrapped{width:100%;min-width:0;white-space:pre-wrap}
.dsh-codex-root .document-code.is-wrapped .document-code-text{flex:1;overflow-wrap:anywhere;word-break:break-word}
.dsh-codex-root .codex-sidebar-document-body .dsh-codex-markdown{padding:20px}
.dsh-codex-root .codex-sidebar-line-number{opacity:1;color:var(--codex-muted)}
.dsh-codex-root .codex-sidebar-document footer{font-size:12px;color:var(--codex-muted);border-top:1px solid var(--codex-border)}
.dsh-codex-root .codex-sidebar-guide{padding:24px}
.dsh-codex-root .codex-sidebar-guide h3{display:flex;align-items:center;gap:10px;font-size:17px;font-weight:600}
.dsh-codex-root .codex-sidebar-guide p{font-size:12px;color:var(--codex-muted);opacity:1}
.dsh-codex-root .codex-sidebar-guide>button{display:grid;grid-template-columns:24px minmax(0,1fr);gap:2px 12px;border:1px solid var(--codex-border);border-radius:8px;margin:10px 0;padding:12px;background:var(--codex-bg)}
.dsh-codex-root .codex-sidebar-guide>button:not(:disabled):hover{background:var(--codex-soft);border-color:var(--codex-accent)}
.dsh-codex-root .codex-sidebar-guide>button>svg{grid-column:1;grid-row:1/3;margin-top:4px;color:var(--codex-muted)}
.dsh-codex-root .codex-sidebar-guide>button>strong{grid-column:2;font-size:14px;font-weight:600}
.dsh-codex-root .codex-sidebar-guide>button>span{grid-column:2;font-size:12px;opacity:1;color:var(--codex-muted)}
.dsh-codex-root .codex-sidebar-browser form{padding:8px;gap:6px;flex-wrap:wrap;background:var(--codex-bg)}
.dsh-codex-root .codex-sidebar-browser button,.dsh-codex-root .codex-sidebar-browser form a{display:inline-flex;align-items:center;justify-content:center;min-width:36px;min-height:36px;padding:0 8px;color:var(--codex-muted)}
.dsh-codex-root .codex-sidebar-browser input{order:1;flex-basis:100%;height:36px;padding:6px 10px;font-size:13px}
.dsh-codex-root .dsh-codex-right-bar{padding:10px 12px;min-height:46px;border-bottom:1px solid var(--codex-border);gap:8px}
.dsh-codex-root .dsh-codex-right-path,.dsh-codex-root .dsh-codex-right-meta{font-size:12px;color:var(--codex-muted)}
.dsh-codex-root .dsh-codex-right-section{font-size:12px;letter-spacing:0;text-transform:none;padding:16px 10px 8px}
.dsh-codex-root .dsh-codex-right-row{font-size:13px;min-height:40px;padding:8px}
.dsh-codex-root .dsh-codex-right-pre{font-size:13px;line-height:1.85;padding:16px 12px}
.dsh-codex-root .dsh-codex-right-pre.terminal{background:var(--codex-panel);font-size:14px;line-height:1.85}
.dsh-codex-root .dsh-codex-right-terminal-input{padding:12px;gap:8px}
.dsh-codex-root .dsh-codex-right-terminal-input .dsh-codex-search{height:38px}
.dsh-codex-root .codex-sidebar-mobile-panes{display:none}
.dsh-codex-root .dsh-codex-nav-backdrop{display:none}
html[data-codex-transition]::view-transition-group(codex-panel){animation:none}
html[data-codex-transition]::view-transition-old(root),html[data-codex-transition]::view-transition-new(root),
html[data-codex-transition]::view-transition-old(codex-panel),html[data-codex-transition]::view-transition-new(codex-panel){animation:none;mix-blend-mode:normal}
html[data-codex-transition]::view-transition-old(codex-panel){z-index:1}
html[data-codex-transition]::view-transition-new(codex-panel){z-index:2}
html[data-codex-transition]::view-transition{pointer-events:none}
.dsh-codex-root[data-theme-revealing] *{transition:none!important}
@media (prefers-reduced-motion:reduce){.dsh-codex-root,.dsh-codex-root .dsh-codex-focus-sidebar,.dsh-codex-root .dsh-codex-sessions-transition{transition:none!important}}
@media(min-width:768px) and (max-width:1150px){
 .dsh-codex-root{grid-template-columns:0 var(--codex-nav-width,280px) minmax(0,1fr) auto}
 .dsh-codex-root.is-nav-collapsed{grid-template-columns:0 0 minmax(0,1fr) auto}
 .dsh-codex-root .dsh-codex-messages{padding:22px}
 .dsh-codex-root .dsh-codex-running-bar,.dsh-codex-root .dsh-codex-approvals{width:min(800px,calc(100% - 44px))}
 .dsh-codex-root .codex-sidebar:not(.is-fullscreen){max-width:36vw}
 .dsh-codex-root .dsh-codex-permission-trigger{max-width:100px;overflow:hidden;white-space:nowrap}
}
@media(max-width:767px){
 .dsh-codex-root,.dsh-codex-root.is-nav-collapsed{grid-template-columns:minmax(0,1fr);grid-template-rows:56px minmax(0,1fr) 28px;height:100dvh;min-height:0}
 .dsh-codex-root .dsh-codex-rail,.dsh-codex-root .dsh-codex-nav-resize{display:none}
 .dsh-codex-root .dsh-codex-workbench-header{grid-column:1;grid-row:1;padding:0 6px;gap:0}
 .dsh-codex-root .dsh-codex-workbench-header h1{font-size:13px}
 .dsh-codex-root .dsh-codex-icon-button,.dsh-codex-root .dsh-codex-workbench-header .dsh-codex-icon-button{width:44px;height:44px}
 .dsh-codex-root .dsh-codex-main{grid-column:1;grid-row:2}
 .dsh-codex-root .dsh-codex-focus-sidebar,.dsh-codex-root.is-nav-collapsed .dsh-codex-focus-sidebar{display:flex;position:absolute;left:0;top:56px;bottom:28px;width:min(300px,85vw);z-index:1301;grid-column:1;grid-row:1/4;box-shadow:var(--dsw-elevation-prominent);transform:translateX(-100%);opacity:0;visibility:hidden;pointer-events:none;transition:transform 220ms ease,opacity 180ms ease,visibility 0s linear 220ms}
 .dsh-codex-root.is-nav-open .dsh-codex-focus-sidebar{display:flex;transform:translateX(0);opacity:1;visibility:visible;pointer-events:auto;transition:transform 220ms ease,opacity 180ms ease,visibility 0s}
 .dsh-codex-root.is-nav-open .dsh-codex-nav-backdrop{display:block;position:fixed;inset:56px 0 28px;background:#11182755;z-index:1300;border:0}
 .dsh-codex-root .dsh-codex-workbench-status{grid-column:1;grid-row:3;gap:10px;padding:0 12px}
 .dsh-codex-root .dsh-codex-status-branch{display:none}
 .dsh-codex-root .dsh-codex-thread-header{padding:8px 18px}
 .dsh-codex-root .dsh-codex-chip{font-size:12px}
 .dsh-codex-root .dsh-codex-chips{gap:10px}
 .dsh-codex-root .dsh-codex-chip[data-meta="model"],.dsh-codex-root .dsh-codex-chip[data-meta="branch"]{display:none}
 .dsh-codex-root .dsh-codex-messages{padding:22px 18px 12px}
 .dsh-codex-root .dsh-codex-running-bar,.dsh-codex-root .dsh-codex-approvals{width:min(800px,calc(100% - 36px))}
 .dsh-codex-root .dsh-codex-message-text,.dsh-codex-root .dsh-codex-markdown{font-size:16px;line-height:1.8}
 .dsh-codex-root .dsh-codex-composer-wrap{padding:8px 12px 12px}
 .dsh-codex-root .dsh-codex-permission-pending{width:min(800px,calc(100% - 24px))}
 .dsh-codex-root .dsh-codex-composer-card{padding:8px;border-radius:10px}
 .dsh-codex-root .dsh-codex-composer-input{font-size:16px;min-height:64px}
 .dsh-codex-root .dsh-codex-permission-trigger{max-width:44px;padding:0 12px;font-size:0;gap:0}
 .dsh-codex-root .dsh-codex-model-trigger{max-width:105px;font-size:12px;gap:4px}
 .dsh-codex-root .dsh-codex-plus,.dsh-codex-root .dsh-codex-stop,.dsh-codex-root .dsh-codex-send{width:44px;height:44px}
 .dsh-codex-root .dsh-codex-plus-panel,.dsh-codex-root .dsh-codex-slash{max-height:55dvh;width:calc(100% - 24px)}
 .dsh-codex-root .dsh-codex-plus-hint{display:none}
 .dsh-codex-root .dsh-codex-plus-item,.dsh-codex-root .dsh-codex-permission-option,.dsh-codex-root .dsh-codex-menu-item{min-height:44px}
 .dsh-codex-root .dsh-codex-dialog{width:calc(100vw - 24px);max-height:calc(100dvh - 24px)}
 .dsh-codex-root .dsh-codex-dialog-backdrop{padding:12px}
 .dsh-codex-root .dsh-codex-version-actions{flex-wrap:wrap}
 .dsh-codex-root .dsh-codex-approval{margin:0;padding:12px}
 .dsh-codex-root .dsh-codex-approval-actions .dsh-codex-button{min-height:44px}
 .dsh-codex-root .codex-sidebar.is-fullscreen{inset:0;min-width:0}
 .dsh-codex-root.has-right .dsh-codex-workbench-status{grid-column:1}
 .dsh-codex-root .codex-sidebar-mobile-panes{display:flex;min-height:44px;gap:6px;border-bottom:1px solid var(--codex-border);padding:4px 8px}
 .codex-sidebar-mobile-panes button{border:0;background:transparent;color:var(--codex-muted);padding:6px 12px;border-radius:6px;font-size:13px;cursor:pointer}
 .codex-sidebar-mobile-panes button[aria-selected="true"]{background:var(--codex-selected);color:var(--codex-accent)}
 .dsh-codex-root .codex-sidebar.is-narrow [data-dockkit-active-column]{grid-template-columns:minmax(0,1fr)!important}
 .codex-sidebar.is-narrow [data-dockkit-active-column] > [data-dockkit-host="dock"],.codex-sidebar.is-narrow [data-dockkit-active-column] > [data-dockkit-empty]{grid-column:1!important}
 .codex-sidebar.is-narrow [data-dockkit-active-column="0"] > [data-dockkit-column="1"],.codex-sidebar.is-narrow [data-dockkit-active-column="1"] > [data-dockkit-column="0"]{display:none!important}
 .codex-sidebar.is-narrow [data-dockkit-divider]{display:none}
 .dsh-codex-root .codex-sidebar-file-row{height:44px}
 .dsh-codex-root .codex-sidebar-control{height:40px}
}
@media(prefers-reduced-motion:reduce){.dsh-codex-root *{animation-duration:.01ms!important;transition:none!important}}

/* Respond to the conversation column, including desktop split panels. */
@container codex-composer-toolbar (max-width:480px){
 .dsh-codex-root .dsh-codex-permission-trigger{width:36px;max-width:36px;padding:0;gap:0;justify-content:center}
 .dsh-codex-root .dsh-codex-permission-trigger>span{display:none}
}
@container codex-composer-toolbar (max-width:360px){
 .dsh-codex-root .dsh-codex-composer-tools>.dsh-codex-attach-folder{display:none}
 .dsh-codex-root .dsh-codex-model-effort{display:none}
}
@container codex-composer-toolbar (max-width:300px){
 .dsh-codex-root .dsh-codex-composer-tools>.dsh-codex-attach{display:none}
 .dsh-codex-root .dsh-codex-plan-tag{max-width:80px}
}

/* Messages share a reading column; intrinsic bubble widths do not centre each row. */
.dsh-codex-root .dsh-codex-messages{gap:22px}
.dsh-codex-root .dsh-codex-message-content{display:flex;flex-direction:column;gap:12px;min-width:0}
.dsh-codex-root .dsh-codex-message-content>.dsh-codex-tool-group{width:100%;margin:0}
.dsh-codex-root .dsh-codex-message-content>.dsh-codex-turn-footer{margin:0}
.dsh-codex-root .dsh-codex-messages>*{width:min(800px,100%);margin-left:auto;margin-right:auto;flex:none}
.dsh-codex-root .dsh-codex-message{margin-top:0;margin-bottom:0;gap:8px}
.dsh-codex-root .dsh-codex-message-head{min-height:26px;font-size:12px;gap:9px}
.dsh-codex-root .dsh-codex-message-avatar{display:grid;place-items:center;width:26px;height:26px;border:1px solid var(--codex-border);border-radius:7px;background:var(--codex-panel);color:var(--codex-muted)}
.dsh-codex-root .dsh-codex-message-head>strong{font-size:13px;font-weight:600;color:var(--codex-text)}
.dsh-codex-root .dsh-codex-message.user .dsh-codex-bubble{background:var(--codex-panel);box-shadow:none;border:1px solid var(--codex-border);border-radius:10px;padding:10px 14px;max-width:92%}
.dsh-codex-root .dsh-codex-bubble{max-width:100%}
.dsh-codex-root .dsh-codex-tool-group{margin-top:2px;margin-bottom:2px}
.dsh-codex-root .dsh-codex-turn-footer{font-size:12px;color:var(--codex-muted)}
.dsh-codex-root .dsh-codex-focus-search-row{margin:0 0 12px}
.dsh-codex-root .dsh-codex-focus-search-row input{flex:1}
.dsh-codex-root .dsh-codex-pre{font-size:13px;line-height:1.75}
.dsh-codex-root[data-codex-theme="dark"] .dsh-codex-tok.keyword,.dsh-codex-root[data-codex-theme="dark"] .dsh-codex-diff-line.hunk{color:#9bbcdf}
.dsh-codex-root[data-codex-theme="dark"] .dsh-codex-tok.string{color:#d4bd8d}
.dsh-codex-root[data-codex-theme="dark"] .dsh-codex-tok.number{color:#c8b4df}
.dsh-codex-root .dsh-codex-markdown table{font-size:13px}
.dsh-codex-root .dsh-codex-markdown>:first-child{margin-top:0}
.dsh-codex-root .dsh-codex-message .dsh-codex-markdown>:last-child{margin-bottom:0}
.dsh-codex-root .dsh-codex-message.user .dsh-codex-markdown{line-height:1.55}
.dsh-codex-root .dsh-codex-message.user .dsh-codex-markdown :where(p,ul,ol){margin:2px 0}
.dsh-codex-root .dsh-codex-message.user .dsh-codex-markdown li{margin:0;padding:0}
.dsh-codex-root .dsh-codex-message.user .dsh-codex-markdown>:first-child{margin-top:0}
.dsh-codex-root .dsh-codex-message.user .dsh-codex-markdown>:last-child{margin-bottom:0}
.dsh-codex-root .dsh-codex-markdown th,.dsh-codex-root .dsh-codex-markdown td{border-color:var(--codex-border);padding:7px 10px}
.dsh-codex-root .dsh-codex-block-head>summary,.dsh-codex-root .dsh-codex-block-head{font-size:13px}

.dsh-codex-root .dsh-codex-select-control{position:relative;flex:none;font-size:12px}
.dsh-codex-root .dsh-codex-select-control .dsh-codex-select-trigger{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;min-height:32px;padding:6px 9px;border:1px solid var(--codex-border);border-radius:7px;background:var(--codex-bg);color:var(--codex-text);font:inherit;cursor:pointer}
.dsh-codex-root .dsh-codex-select-trigger span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-codex-root .dsh-codex-select-menu{position:absolute;top:calc(100% + 4px);right:0;z-index:1500;min-width:max(100%,140px);padding:5px;border:1px solid var(--codex-border);border-radius:9px;background:var(--codex-bg);box-shadow:var(--dsw-elevation-prominent);outline:none}
.dsh-codex-root .dsh-codex-select-control.opens-up .dsh-codex-select-menu{top:auto;bottom:calc(100% + 4px)}
.dsh-codex-root .dsh-codex-select-option{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:7px 9px;border-radius:6px;color:var(--codex-text);cursor:pointer}
.dsh-codex-root .dsh-codex-select-option.is-active{background:var(--codex-selected)}
.dsh-codex-root .codex-sidebar-document header{position:relative;z-index:5}
.dsh-codex-root .codex-sidebar-document header .dsh-codex-select-trigger{border-color:transparent;background:transparent}
.dsh-codex-root .codex-sidebar-document header .dsh-codex-select-trigger:hover{background:var(--codex-soft)}
@media(max-width:720px){
}

.dsh-codex-root .dsh-codex-skill-picker{position:absolute;bottom:100%;left:0;right:0;z-index:80;background:var(--codex-bg);border:1px solid var(--codex-border);border-radius:10px;box-shadow:var(--dsw-elevation-prominent);margin-bottom:8px;padding:8px;max-height:min(65vh,500px);overflow:auto}
.dsh-codex-root .dsh-codex-skill-picker header{display:flex;align-items:center;gap:8px;padding:4px 6px;font-size:13px}
.dsh-codex-root .dsh-codex-skill-picker header span{flex:1;color:var(--codex-muted);font-size:11px}
.dsh-codex-root .dsh-codex-skill-picker header button{border:0;background:transparent;color:var(--codex-muted);padding:5px;cursor:pointer}
.dsh-codex-root .dsh-codex-skill-picker>input{box-sizing:border-box;width:100%;margin:6px 0}
.dsh-codex-root .dsh-codex-skill-picker [role=option]{display:block;width:100%;border:0;border-radius:5px;padding:8px;text-align:left;background:transparent;color:var(--codex-text);cursor:pointer}
.dsh-codex-root .dsh-codex-skill-picker [role=option][aria-selected=true]{background:var(--codex-selected)}
.dsh-codex-root .dsh-codex-skill-picker [role=option][aria-disabled=true]{opacity:.5;cursor:default}
.dsh-codex-root .dsh-codex-skill-picker [role=option]>span{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.dsh-codex-root .dsh-codex-skill-picker strong{font-size:12px}
.dsh-codex-root .dsh-codex-skill-picker code{font-family:var(--dsh-font-family-code);font-size:11px;color:var(--codex-accent)}
.dsh-codex-root .dsh-codex-skill-picker p{font-size:12px;line-height:1.5;margin:5px 0;white-space:pre-wrap}
.dsh-codex-root .dsh-codex-skill-picker small{display:block;font-size:10px;color:var(--codex-muted);overflow-wrap:anywhere}
.dsh-codex-root .dsh-codex-skill-picker footer{padding:5px 8px;font-size:11px;color:var(--codex-muted)}
.dsh-codex-root .dsh-codex-skill-picker:not(.dsh-codex-file-picker){box-sizing:border-box;left:50%;right:auto;transform:translateX(-50%);width:min(800px,calc(100% - 52px))}
.dsh-codex-root .dsh-codex-skill-row{display:flex;align-items:center;border-radius:5px}
.dsh-codex-root .dsh-codex-skill-row:has([aria-selected=true]){background:var(--codex-selected)}
.dsh-codex-root .dsh-codex-skill-row [role=option]{display:flex;align-items:center;gap:10px;min-width:0;flex:1;background:transparent}
.dsh-codex-root .dsh-codex-skill-row [role=option][aria-selected=true]{background:transparent}
.dsh-codex-root .dsh-codex-skill-row strong{flex:none;max-width:45%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-codex-root .dsh-codex-skill-description{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--codex-muted);font-size:12px}
.dsh-codex-root .dsh-codex-skill-info{flex:none;border:0;background:transparent;color:var(--codex-muted);padding:8px;cursor:pointer}
.dsh-codex-root .dsh-codex-skill-info:hover{color:var(--codex-text)}
.dsh-codex-root .dsh-codex-skill-detail{padding:10px 8px}
.dsh-codex-root .dsh-codex-skill-detail-path{margin:8px 0;color:var(--codex-muted);font-size:12px;overflow-wrap:anywhere}
.dsh-codex-root .dsh-codex-skill-detail-description{padding:12px;border:1px solid var(--codex-border);border-radius:7px;font-size:12px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}
@media(max-width:700px){.dsh-codex-root .dsh-codex-skill-picker:not(.dsh-codex-file-picker){width:min(800px,calc(100% - 24px))}}
.dsh-codex-root .dsh-codex-skill-warning{color:var(--codex-warning)}
.dsh-codex-root .dsh-codex-selected-skills{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}
.dsh-codex-root .dsh-codex-selected-skills>span{display:flex;align-items:center;gap:5px;border:1px solid var(--codex-border);border-radius:5px;padding:3px 6px;font-family:var(--dsh-font-family-code);font-size:11px;background:var(--codex-panel)}
.dsh-codex-root .dsh-codex-selected-skills button{border:0;background:transparent;color:var(--codex-muted);padding:2px;cursor:pointer}
.dsh-codex-root .dsh-codex-followups{width:calc(100% - 16px);max-width:784px;flex:none;border:1px solid var(--codex-border);border-radius:12px 12px 0 0;background:var(--codex-bg);margin:0 8px -1px;padding:6px 8px;color:var(--codex-text)}
.dsh-codex-root .dsh-codex-followups header{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:3px 5px 6px;font-size:12px;color:var(--codex-muted)}
.dsh-codex-root .dsh-codex-followups header .dsh-codex-followup-toggle{gap:5px;flex-shrink:0;min-height:26px;padding:2px 4px}
.dsh-codex-root .dsh-codex-followups small{font-size:11px;color:var(--codex-muted)}
.dsh-codex-root .dsh-codex-followup-list[hidden]{display:none}
.dsh-codex-root .dsh-codex-followup-list{max-height:min(240px,30vh);overflow:auto}
.dsh-codex-root .dsh-codex-followup-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px;min-height:38px;padding:3px 5px;border-radius:6px}
.dsh-codex-root .dsh-codex-followup-row>svg{flex:none;color:var(--codex-muted)}
.dsh-codex-root .dsh-codex-followup-text{flex:1;min-width:0;font-size:13px}
.dsh-codex-root .dsh-codex-followup-text>span{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere;white-space:pre-wrap}
.dsh-codex-root .dsh-codex-followup-text small{display:flex;align-items:center;gap:4px;overflow-wrap:anywhere}
.dsh-codex-root .dsh-codex-followup-actions{display:flex;align-items:center;gap:2px;flex:none}
.dsh-codex-root .dsh-codex-followups button{display:inline-flex;align-items:center;justify-content:center;gap:4px;border:0;background:transparent;color:var(--codex-muted);border-radius:5px;min-height:32px;padding:4px 6px;font-size:12px;cursor:pointer}
.dsh-codex-root .dsh-codex-followups .dsh-codex-icon-button{height:32px;width:32px;padding:4px}
.dsh-codex-root .dsh-codex-followups button:hover{background:var(--codex-soft);color:var(--codex-text)}
.dsh-codex-root .dsh-codex-followups button:disabled{opacity:.45;cursor:default}
.dsh-codex-root .dsh-codex-followup-edit{width:100%}
.dsh-codex-root .dsh-codex-followup-edit textarea{display:block;width:100%;resize:vertical;min-height:70px;max-height:180px;padding:8px;border:1px solid var(--codex-border);border-radius:6px;font:inherit;font-size:13px}
.dsh-codex-root .dsh-codex-followup-edit>div{display:flex;justify-content:flex-end;gap:6px}
.dsh-codex-root .dsh-codex-followup-error{flex-basis:100%;font-size:12px;color:var(--codex-danger);overflow-wrap:anywhere;padding:3px 5px}
@media(max-width:600px){.dsh-codex-root .dsh-codex-followups{width:100%;margin-inline:0}.dsh-codex-root .dsh-codex-followups header small{display:none}}

`
