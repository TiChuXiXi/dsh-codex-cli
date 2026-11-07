/**
 * One pane: its tab strip (drag source, drop target, split control) and the
 * active tab's body with the dock preview overlay. Presentational; every gesture
 * leaves through `PaneCallbacks`, and the body itself comes from `renderTab`.
 *
 * A chip is a capsule carrying one control, its close, shown over its right
 * end while the chip is active, hovered, or focused; the context menu
 * (secondary press) carries the same close plus whatever the embedder appends.
 * A middle click anywhere on the chip, including its close control, closes
 * without selecting the tab, unless another mouse button is still held.
 * The embedder's `canCloseTab`
 * governs all close routes. A pane's lone chip whose close is withheld draws
 * quiet — no capsule, no hover fill — since there is nothing to select against
 * and nothing to do to it.
 * Between neighbouring chips sits a slot: a fixed-width box drawing a
 * hairline, blank beside the active chip, and the drop caret when a drag
 * targets that index, so a caret never widens the row; the two end slots
 * exist only while targeted. The chips sit in their own box, the strip's one
 * shrinking part: in a narrow pane their titles fade at the clipped edge down
 * to the chip's floor and then the chips scroll there, keeping the active one
 * in view, so the add control after them (drawn while the embedder's
 * `canAddTab` allows), the pane's split control, and the embedder's chrome keep
 * their width and their place at the strip's end.
 */
import {Icon} from '../../../src/client/components/Icon'
import type { KeyboardEvent } from 'react'
import { Fragment, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import clsx from 'clsx'
import { IconCloseFillRegular, IconPlusOutlineRegular, Tooltip } from '../../../src/client/sidebar/primitives'
import type { DockZone, LayoutState, PaneId, PaneNode, TabId } from '../contract/types.ts'
import { getTab } from '../engine/tree.ts'
import type { PaneCallbacks, SplitBlock } from './render.ts'
import { TabBody } from './TabBody.tsx'
import { TabMenu } from './TabMenu.tsx'
import { TabTitle } from './TabTitle.tsx'
import css from './dockkit.module.css'

/** Icon rendering is supplied by the plugin's unified Lucide adapter. */
function SplitGlyph():ReactNode{return <Icon name="columns" size={16}/>}
function ZoneGlyph({zone}:{readonly zone:DockZone}):ReactNode{return <Icon name={zone==='left'?'arrowLeft':zone==='right'?'arrowRight':zone==='top'?'arrowUp':zone==='bottom'?'arrowDown':'panelRight'} size={16}/>}

/**
 * One landing card, inset inside the region a release would fill: a dashed
 * frame, the zone's glyph, and its caption. `active` is the region under the
 * pointer; a sibling shown for orientation only draws quieter.
 */
function DockHint({ zone, active, labels }: {
  readonly zone: DockZone
  readonly active: boolean
  readonly labels: PaneCallbacks['labels']
}): ReactNode {
  return (
    <div className={css.dockHint} data-dockkit-dock-zone={zone} data-dockkit-drop-active={active || undefined}>
      <div className={css.dockHintCard}>
        <ZoneGlyph zone={zone} />
        <span className={css.dockHintLabel}>{labels.dropZone[zone]}</span>
      </div>
    </div>
  )
}

/** A pane and the live layout it reads its tabs from. */
export interface TabPanelProps {
  readonly state: LayoutState
  readonly pane: PaneNode
  readonly callbacks: PaneCallbacks
}

/**
 * The chip a navigation key moves focus to, in the WAI-ARIA tabs pattern with
 * manual activation: Left and Right step through the strip and wrap, Home and
 * End jump to its ends. Selecting is a separate key.
 * @returns the chip to focus, or `undefined` when the key is not a navigation key.
 */
function chipToFocus(key: string, tabs: readonly TabId[], tabId: TabId): TabId | undefined {
  const count = tabs.length
  const index = tabs.indexOf(tabId)
  switch (key) {
    case 'ArrowLeft': return tabs[(index - 1 + count) % count]
    case 'ArrowRight': return tabs[(index + 1) % count]
    case 'Home': return tabs[0]
    case 'End': return tabs.at(-1)
    default: return undefined
  }
}

/** Whether a key selects the focused chip. */
function selects(key: string): boolean {
  return key === 'Enter' || key === ' '
}

/**
 * Which sides of the chip box hold chips scrolled out of view, as the
 * `data-dockkit-strip-scroll` value the stylesheet fades: `undefined` while
 * every chip is in view.
 */
function hiddenSides(box: HTMLElement): 'start' | 'end' | 'start end' | undefined {
  // Sub-pixel scroll positions: a side counts as hidden past one whole pixel.
  const start = box.scrollLeft > 1
  const end = box.scrollLeft + box.clientWidth < box.scrollWidth - 1
  if (start && end) return 'start end'
  if (start) return 'start'
  if (end) return 'end'
  return undefined
}

/**
 * Keep the chip box's `data-dockkit-strip-scroll` current: read after each
 * commit that can change the chips, on scroll, and on resize. Written to the
 * DOM directly rather than through state because a reading never changes
 * what renders, only how the stylesheet fades it.
 *
 * Known gap: a content-width change that alters neither `tabs` nor the box's
 * outer size — a live `renderTabTitle` growing a chip, or a drop-caret slot
 * mounting mid-drag — keeps the fade at its last reading until the next
 * scroll or resize. The fade is orientation chrome, so a stale edge fades a
 * few frames late rather than hiding anything.
 */
function useStripScrollFades(box: RefObject<HTMLDivElement | null>, tabs: readonly TabId[]): void {
  useLayoutEffect(() => {
    const element = box.current
    /* v8 ignore next -- the box is rendered unconditionally with the strip. */
    if (element === null) return undefined
    const apply = (): void => {
      const sides = hiddenSides(element)
      if (sides === undefined) delete element.dataset.dockkitStripScroll
      else element.dataset.dockkitStripScroll = sides
    }
    apply()
    element.addEventListener('scroll', apply, { passive: true })
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(apply)
    observer?.observe(element)
    return () => {
      element.removeEventListener('scroll', apply)
      observer?.disconnect()
    }
  }, [box, tabs])
}

/**
 * Move the chip box to `left` at once, overriding the stylesheet's smooth
 * `scroll-behavior` for this one assignment.
 */
function jumpTo(element: HTMLElement, left: number): void {
  element.style.scrollBehavior = 'auto'
  element.scrollLeft = left
  element.style.removeProperty('scroll-behavior')
}

/**
 * Bring the active chip into the chip box's view whenever the active tab or
 * the row of chips changes: a tab opened or selected past the box's edge, or
 * moved there by a close or a reorder, scrolls the box to it, with the fade
 * band (24px) cleared so the chip is not under it. A chip already in view
 * moves nothing. Direct DOM, like the fades above: the box's scroll position
 * renders nothing.
 *
 * A box newly mounted, or newly showing another pane, first jumps to that
 * pane's offset in `offsets`, so a strip that replaces another for the same
 * pane continues from where that one stood and glides only the remaining
 * distance. With no recorded offset the first placement jumps rather than
 * glides from the row's start. The box records its offset in `offsets` when
 * it unmounts or leaves its pane.
 */
function useActiveChipInView(
  box: RefObject<HTMLDivElement | null>,
  chips: ReadonlyMap<TabId, HTMLElement>,
  tabs: readonly TabId[],
  activeTabId: TabId | undefined,
  paneId: PaneId,
  offsets: Map<PaneId, number> | undefined,
): void {
  // The pane the box was last placed for: a strip moved to another pane places afresh.
  const placed = useRef<PaneId | undefined>(undefined)
  useLayoutEffect(() => {
    if (offsets === undefined) return undefined
    const element = box.current
    /* v8 ignore next -- the box is rendered unconditionally with the strip. */
    if (element === null) return undefined
    // Layout cleanup runs before React detaches the box, so it still reads the live offset.
    return () => { offsets.set(paneId, element.scrollLeft) }
  }, [box, paneId, offsets])
  useLayoutEffect(() => {
    const element = box.current
    const chip = activeTabId === undefined ? undefined : chips.get(activeTabId)
    /* v8 ignore next -- the box and the active tab's chip are rendered with the strip. */
    if (element === null || chip === undefined) return
    const first = placed.current !== paneId
    placed.current = paneId
    const recorded = first ? offsets?.get(paneId) : undefined
    if (recorded !== undefined) jumpTo(element, recorded)
    const bounds = element.getBoundingClientRect()
    const rect = chip.getBoundingClientRect()
    let delta = 0
    if (rect.left < bounds.left) delta = rect.left - bounds.left - STRIP_FADE
    else if (rect.right > bounds.right) delta = rect.right - bounds.right + STRIP_FADE
    if (delta === 0) return
    if (first && recorded === undefined) jumpTo(element, element.scrollLeft + delta)
    else element.scrollLeft += delta
  }, [box, chips, tabs, activeTabId, paneId, offsets])
}

/** Width of the chip box's fade at a hidden side; mirrors the stylesheet's 24px. */
const STRIP_FADE = 24

/** Why the split control cannot act right now. */
function splitBlockedTitle(labels: PaneCallbacks['labels'], block: SplitBlock): string {
  switch (block) {
    case 'budget': return labels.splitPaneDisabled
    case 'width': return labels.splitPaneNarrow
  }
}

/** A tab strip and where it reads and records its pane's chip-box offset. */
interface TabStripProps extends TabPanelProps {
  /**
   * Chip-box offsets by pane, shared by the strips that replace one another
   * as a pane's selected tab changes. Keys are valid within one layout only,
   * and entries outlive their panes. Omitted where no strip continues from
   * another's position.
   */
  readonly offsets?: Map<PaneId, number>
}

/** @param props - pane state, gestures and shared offsets. @returns its tab strip without a content container. */
export function TabStrip({ state, pane, callbacks, offsets }: TabStripProps): ReactNode {
  // The open context menu and the chip that opened it; the menu positions
  // itself against that chip from its portal.
  const [menu, setMenu] = useState<{ readonly tabId: TabId; readonly anchor: HTMLElement } | undefined>(undefined)
  // The mounted chips by tab, for the keys that move focus between them.
  const [chips] = useState(() => new Map<TabId, HTMLElement>())
  const stripTabs = useRef<HTMLDivElement | null>(null)
  useStripScrollFades(stripTabs, pane.tabs)
  useActiveChipInView(stripTabs, chips, pane.tabs, pane.activeTabId, pane.id, offsets)
  const block = callbacks.splitBlock(pane.id)
  const target = callbacks.dropTarget
  const stripIndex = target !== undefined && target.kind === 'strip' && target.paneId === pane.id
    ? target.index
    : undefined

  /** Select a tab from a click or a key, unless it is the active pane's selected tab already: that changes nothing. */
  const activate = (tabId: TabId): void => {
    if (state.activePaneId === pane.id && pane.activeTabId === tabId) return
    callbacks.onFocusTab(tabId)
  }

  const focusChip = (tabId: TabId): void => {
    const chip = chips.get(tabId)
    /* v8 ignore next -- every tab in the strip has a mounted chip, registered by its ref. */
    if (chip === undefined) return
    chip.focus()
  }

  return (
    // The window drag claim is withdrawn while any pane floats: a floating pane
    // renders among this surface's cells in tab-id order, so one sorted before this
    // row would sit earlier in the document, where this row's drag box overrides the
    // float's own subtraction and swallows the panel's header and controls.
    <div className={css.tabStrip} role="tablist" data-dockkit-strip={pane.id}
      data-window-drag={state.floats.length === 0 ? true : undefined}>
      <div ref={stripTabs} className={css.stripTabs} role="presentation" data-dockkit-strip-tabs={pane.id}>
        {pane.tabs.map((tabId, index) => {
          const tab = getTab(state, tabId)
          const selected = tabId === pane.activeTabId
          const closable = callbacks.canCloseTab(tabId)
          // A pane's lone unclosable chip is a label, not a choice: there is
          // no other tab to select against and nothing to do to it.
          const quiet = !closable && pane.tabs.length === 1
          const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
            if (event.target !== event.currentTarget) return
            if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.nativeEvent.isComposing) return
            const next = chipToFocus(event.key, pane.tabs, tabId)
            if (next !== undefined) { event.preventDefault(); focusChip(next); return }
            if (selects(event.key)) { event.preventDefault(); activate(tabId) }
          }
          return (
            <Fragment key={tabId}>
              {(index > 0 || stripIndex === index) && (
                <div
                  className={clsx(css.slot, stripIndex === index && css.slotCaret)}
                  data-dockkit-caret={stripIndex === index ? index : undefined}
                />
              )}
              <div
                role="tab"
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                className={clsx(
                  css.tab,
                  selected && css.tabActive,
                  quiet && css.tabQuiet,
                  callbacks.draggingTabId === tabId && css.tabDragging,
                )}
                data-dockkit-tab={tabId}
                data-dockkit-tab-quiet={quiet || undefined}
                ref={(element) => {
                  if (element === null) chips.delete(tabId)
                  else chips.set(tabId, element)
                }}
                // Focus lands on click, not on press: a state change between
                // pointerdown and the first pointermove rebuilds this subtree,
                // and Chromium cancels the pointer when the pressed element is
                // replaced — which would abandon every drag. A drag that ends
                // elsewhere fires no click, and its own operation carries focus.
                onPointerDown={(event) => {
                  if (event.button !== 0) return
                  callbacks.onTabPressed(tabId, event)
                }}
                onMouseDown={(event) => {
                  // Prevent middle-button autoscroll or selection paste before release.
                  if (event.button === 1) event.preventDefault()
                }}
                onAuxClick={(event) => {
                  if (event.button !== 1) return
                  event.preventDefault()
                  event.stopPropagation()
                  if (closable && event.buttons === 0) callbacks.onCloseTab(tabId)
                }}
                onClick={(event) => {
                  event.stopPropagation()
                  activate(tabId)
                }}
                {...callbacks.getTabTriggerProps?.(tab, pane.id, { onKeyDown, tabIndex: selected ? 0 : -1 }) ?? {
                  onKeyDown,
                  onContextMenu: (event) => {
                    event.preventDefault(); event.stopPropagation()
                    const anchor = event.currentTarget
                    setMenu(current => current?.tabId === tabId ? undefined : { tabId, anchor })
                  },
                }}
              >
                <TabTitle>{callbacks.renderTabTitle?.(tab) ?? tab.title}</TabTitle>
                {closable && (
                  <Tooltip disabled={menu !== undefined || callbacks.tabMenuOpen === true} label={callbacks.labels.closeTab} shortcutKeys={callbacks.labels.closeTabKeys} side="bottom" delayMs={500}>
                    <button
                      type="button"
                      className={css.tabClose}
                      aria-label={callbacks.labels.closeTab}
                      aria-keyshortcuts={callbacks.labels.closeTabShortcut}
                      data-dockkit-tab-close={tabId}
                      // A nested control stops its own press: otherwise the press
                      // starts a drag, captures the pointer, and this click never lands.
                      onPointerDown={(event) => { event.stopPropagation() }}
                      onClick={(event) => {
                        event.stopPropagation()
                        callbacks.onCloseTab(tabId)
                      }}
                    >
                      <IconCloseFillRegular size={14} />
                    </button>
                  </Tooltip>
                )}
                {menu?.tabId === tabId && (
                  <TabMenu
                    labels={callbacks.labels}
                    anchor={menu.anchor}
                    onClose={closable ? () => { setMenu(undefined); callbacks.onCloseTab(tabId) } : undefined}
                    onDismiss={() => { setMenu(undefined) }}
                    extras={callbacks.renderTabMenuItems?.(tab, () => { setMenu(undefined) })}
                  />
                )}
              </div>
            </Fragment>
          )
        })}
        {stripIndex === pane.tabs.length && <div className={clsx(css.slot, css.slotCaret)} data-dockkit-caret={stripIndex} />}
      </div>
      {callbacks.canAddTab(pane.id) && (
        <Tooltip label={callbacks.labels.addTab} side="bottom" delayMs={500}>
          <button
            type="button"
            className={css.addTab}
            aria-label={callbacks.labels.addTab}
            data-dockkit-add-tab={pane.id}
            onClick={(event) => {
              event.stopPropagation()
              callbacks.onAddTab(pane.id)
            }}
          >
            <IconPlusOutlineRegular size={14} />
          </button>
        </Tooltip>
      )}
      <div className={css.stripFill} data-dockkit-strip-fill />
      {!(callbacks.hideSplitWhenBlocked && block !== undefined) && (
        <Tooltip label={block === undefined ? callbacks.labels.splitPane : splitBlockedTitle(callbacks.labels, block)} shortcutKeys={callbacks.labels.splitPaneKeys} side="bottom" delayMs={500} openOnClick={block !== undefined}>
          <span
            data-dockkit-split-control
            tabIndex={block === undefined ? undefined : 0}
            aria-label={block === undefined ? undefined : splitBlockedTitle(callbacks.labels, block)}
            onClick={(event) => { if (block !== undefined) event.stopPropagation() }}
          >
            <button
              type="button"
              className={css.iconButton}
              aria-label={callbacks.labels.splitPane}
              aria-keyshortcuts={callbacks.labels.splitPaneShortcut}
              disabled={block !== undefined}
              data-dockkit-split-button={pane.id}
              data-dockkit-split-blocked={block}
              onClick={(event) => {
                event.stopPropagation()
                callbacks.onSplitPane(pane.id)
              }}
            >
              <SplitGlyph />
            </button>
          </span>
        </Tooltip>
      )}
      {/* The embedder's surface-wide controls, in the top-right pane only: the
            strip is the surface's top edge, and this pane's end is its corner. */}
      {pane.id === callbacks.chromePaneId && callbacks.chrome !== undefined && (
      // The embedder's controls report their own intents; the pane's
      // click-to-focus must not add a focus entry to each of them.
        <div
          className={css.stripChrome}
          data-dockkit-strip-chrome
          onClick={(event) => { event.stopPropagation() }}
        >
          {callbacks.chrome}
        </div>
      )}
    </div>
  )
}

/** @param props - target pane and drag preview. @returns body-local drop feedback, or nothing. */
export function PaneDropHints({ pane, callbacks }: Pick<TabPanelProps, 'pane' | 'callbacks'>): ReactNode {
  const target = callbacks.dropTarget
  const zone = target?.kind === 'zone' && target.paneId === pane.id ? target.zone : undefined
  if (zone === undefined) return null
  return <>
    <div className={css.dockScrim} data-dockkit-dock-scrim />
    {callbacks.horizontalDrops && zone !== 'center'
      ? <>
        <DockHint zone="left" active={zone === 'left'} labels={callbacks.labels} />
        <DockHint zone="right" active={zone === 'right'} labels={callbacks.labels} />
      </>
      : <DockHint zone={zone} active labels={callbacks.labels} />}
  </>
}

/** @param props - pane state and gestures. @returns one pane in the recursive, visibility-mounted layout. */
export function TabPanel({ state, pane, callbacks }: TabPanelProps): ReactNode {
  const active = pane.activeTabId === undefined ? undefined : getTab(state, pane.activeTabId)
  return (
    <section
      className={css.pane}
      data-dockkit-pane={pane.id}
      tabIndex={-1}
      data-dockkit-pane-active={state.activePaneId === pane.id || undefined}
      onClick={() => {
        if (state.activePaneId !== pane.id) callbacks.onFocusPane(pane.id)
      }}
    >
      <TabStrip state={state} pane={pane} callbacks={callbacks} />
      <div className={css.paneBody}>
        {active === undefined
          ? <p className={css.empty}>{callbacks.labels.emptyPane}</p>
          : <TabBody tab={active} renderTab={callbacks.renderTab} />}
        <PaneDropHints pane={pane} callbacks={callbacks} />
      </div>
    </section>
  )
}
