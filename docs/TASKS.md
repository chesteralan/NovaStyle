# NovaStyle — Project Tasks

## Legend
- [x] done
- [ ] pending
- [-] blocked

---

## Phase 1: Polish & UX
- [x] Move button to cycle panel position (right → left → bottom → top)
- [x] Extension icons (16, 32, 48, 128)
- [x] Options page with accordion sections
- [x] Settings storage and UI (default position, panel width, theme, visible editors)
- [x] Accordion sections in editor panel (Classes, Spacing, Typography, Colors, Export)
- [x] Panel accordion: collapsed by default
- [x] New accordion sections: Border, Effects
- [x] Floating/draggable panel toggle (drag anywhere on the page)
- [x] Persist panel position preference to storage and apply on open
- [x] Persist theme preference and apply to panel
- [x] Persist visible editors preference

## Phase 2: Style Management
- [x] Search/filter domains in options page
- [x] Bulk select and delete domains
- [x] Export individual domain styles (not just all)
- [x] Style history / version snapshots per domain
- [x] Rename domains
- [x] Sort domains (by name, last edited)

## Phase 3: Editor Improvements
- [x] Undo/redo keyboard shortcuts (Ctrl+Z / Ctrl+Shift+Z)
- [x] Escape key to close panel
- [x] Dark mode for panel UI
- [x] Font detection — list all fonts used on page
- [x] Custom CSS injection (user-defined overrides unrelated to selected elements)
- [x] CSS animation / transition editor
- [x] Grid layout helper
- [x] Responsive preview mode toggle

## Phase 4: Advanced Features
- [x] Sync via `chrome.storage.sync` (cross-device)
- [x] Preset themes (e.g., "dark reader", "high contrast", "sepia")
- [x] Per-domain enable/disable toggle
- [x] Ignored domains list (extension inactive on these sites)
- [x] Inline style extraction (pull existing inline styles into editor)
- [x] Class-to-style resolution (display computed styles for Tailwind classes)
- [x] Keyboard shortcut configuration UI
- [x] Export as Chrome extension / bookmarklet

## Phase 5: CI & DX
- [x] GitHub Actions CI (lint, typecheck, test, build, bundle size, Sentry sourcemaps)
- [x] Add E2E tests with Playwright (config + extension-loading specs)
- [x] Add bundle size monitoring (`scripts/check-size.mjs`)
- [x] Add error tracking / Sentry integration (`src/lib/sentry.ts`)
- [x] Add contribution guidelines (CONTRIBUTING.md)
- [x] Create Chrome Web Store listing assets
- [x] ErrorBoundary wrapping panel accordion content
- [x] E2E tests: full panel interaction flow (panel-flow.spec.ts)
- [x] E2E tests: options page CRUD operations (options-crud.spec.ts)
- [x] Bundle size CI gate (fail build if limit exceeded)

---

## Phase R: Refactor & Code Audit

### High Priority
- [x] **R1**: Fix duplicate `<Accordion title="Palette">` in `Panel.tsx:221,233` — renders `ColorPalette` twice, doubling DOM queries
- [x] **R2**: Fix Tailwind class filter regex in `selector.ts:8` — `/^[a-z]{2,}-\d+/` incorrectly filters `flex-1`, `p-4`, `text-sm`, `gap-2`, etc.
- [x] **R3**: Fix CustomCSS module-level singleton leak in `CustomCSS.tsx:3` — stale `<style>` persists when panel remounts; use ref + cleanup
- [x] **R4**: Fix event listener leak in `content-script.ts:99-108` — `novastyle:update`/`novastyle:update-classes` listeners never removed in `closePanel()`, accumulating on each open
- [x] **R5**: Replace DOM manipulation in `ClassResolver.tsx:19-31` `useMemo` with offscreen element (no `document.body.appendChild`)
- [x] **R6**: Fix EffectsEditor shadow state race in `EffectsEditor.tsx:53` — `setShadowX` hasn't flushed when `updateShadow` reads `shadowX`; pass new value directly
- [x] **R7**: Extract shared `Accordion` component from Panel/Options into `src/components/Accordion.tsx`

### Medium Priority
- [x] **R8**: Replace Zustand full-store subscription in `App.tsx:15` with selectors/`useShallow` to avoid unnecessary re-renders
- [x] **R9**: Add unit-aware input handling in `Typography.tsx:53` / `BoxModel.tsx:23` / `BorderEditor.tsx:19` — only append `px` when value is purely numeric
- [-] **R10**: Fix `computeSelector` empty-id edge case in `selector.ts:6` — `el.id` being falsy (`""`) already skips the branch correctly; no fix needed
- [-] **R11**: Extract `defaultSettings` to shared export from `db.ts` — `Options.tsx` doesn't duplicate it; no fix needed
- [x] **R12**: Add `chrome.storage.sync` mock to `src/test/setup.ts` — split into `__localStore`/`__syncStore` with proper typing
- [x] **R13**: Wrap `filtered` computation in `ClassInput.tsx:16` in `useMemo` for performance
- [x] **R14**: Sanitize custom CSS input in `CustomCSS.tsx:21` — strip `javascript:` / `expression()` patterns
- [-] **R15**: Fix `getStyles`/`saveStyles` storage area inconsistency in `db.ts` — inactive code path (sync disabled by default); `getStyles` reads from local first, then sync as fallback per design
- [x] **R16**: Add `aria-expanded` to accordion toggle buttons in Panel and Options

### Low Priority
- [-] **R17**: Fix trailing space in dark mode className in `Panel.tsx:161` — template `? ' dark' : ''` does not produce trailing space; no bug
- [x] **R18**: Remove unnecessary optional chaining on `window.location?.hostname` in `ExportPanel.tsx:13`
- [x] **R19**: Add `value` bindings to all editor inputs — BoxModel (12 inputs), Typography (4 inputs + 1 select), ColorPicker (4 inputs), BorderEditor (3 inputs + 1 select) display current style values
- [x] **R20**: Extract shared `@theme inline` CSS block from `panel.css` and `Options.css` into `src/styles/shared.css`
- [x] **R21**: Replace generic `any` in test setup (`src/test/setup.ts:3`) with `Record<string, unknown>` + separate local/sync stores
- [x] **R22**: Save/restore original `<meta viewport>` — useRef stores original, useEffect cleanup restores on unmount
- [x] **R23**: Add explicit `return` in service worker `onMessage` SAVE_STYLES handler for consistency (`service-worker.ts`)
- [x] **R24**: Throttle DOM queries — FontDetector + ColorPalette limit to first 2000 elements
- [x] **R25**: Fix `buildNthPath` non-null assertion in `selector.ts:33` — replace `!` with local `currentTag` variable
- [x] **R26**: Improve `sendResponse` catch comment in `service-worker.ts:24`
- [x] **R27**: Fix `stripCrossorigin` build plugin regex in `build.ts:18` — add `\s+` prefix to match only as attribute

---

## Phase 6: Editor Expansion

- [x] **E1**: Add `layoutEditor`, `flexboxEditor`, `transformEditor` flags to `NovaStyleSettings.visibleEditors`
- [x] **E2**: Create `LayoutEditor` component — `display`, `position`, `width`/`height`/`min`/`max`, `overflow`, `z-index`, `box-sizing`
- [x] **E3**: Create `FlexboxEditor` component — `flex-direction`, `flex-wrap`, `justify-content`, `align-items`, `align-content`, `gap`, `flex-grow`/`flex-shrink`
- [x] **E4**: Create `TransformEditor` component — `rotate`, `scaleX`/`scaleY`, `translateX`/`translateY`, `transform-origin`
- [x] **E5**: Add `visibleEditors` flags for all 14 accordion sections (not just the original 4)
- [x] **E6**: Wire new editors into Panel.tsx with accordion sections + conditionals
- [x] **E7**: Add visibility toggles for all editors in Options → Editor Settings
- [x] **E8**: Fix build CSS collision — ESM (options) and IIFE (panel) both outputting `style.css`; now produces separate `options.css` + `panel.css`
- [x] **E9**: Create `GridEditor` — `grid-template-columns`/`rows`, `column-gap`/`row-gap`, `grid-auto-flow`, `justify-items`/`align-items`, `place-items`
- [x] **E10**: Create `BackgroundEditor` — `background-image`, `background-size`, `background-repeat`, `background-position`, `background-attachment`, `background-clip`/`origin`
- [x] **E11**: Create `FilterEditor` — 9 sliders for `blur`, `brightness`, `contrast`, `grayscale`, `sepia`, `hue-rotate`, `saturate`, `invert`, `opacity`
- [x] **E12**: Create `TextDecorationEditor` — `text-decoration-line`/`style`/`color`, `text-transform`, `text-shadow`, `white-space`, `word-break`
- [x] **E13**: Create `OutlineEditor` — `outline-width`, `outline-style`, `outline-color` (with color picker), `outline-offset`
- [x] **E14**: Create `CursorEditor` — `cursor`, `pointer-events`, `user-select`, `resize`, `visibility`, `float`, `object-fit`, `object-position`

### Future Editor Ideas
- [ ] **E15**: Animation/Transition editor — `transition-property`, `transition-duration`, `transition-timing-function`, `animation`
- [ ] **E16**: List editor — `list-style-type`, `list-style-position`, `list-style-image`
- [ ] **E17**: Table editor — `border-collapse`, `border-spacing`, `table-layout`, `caption-side`
- [ ] **E18**: Columns editor — `column-count`, `column-width`, `column-gap`, `column-rule`
- [ ] **E19**: Scroll Snap editor — `scroll-snap-type`, `scroll-snap-align`, `scroll-margin`/`scroll-padding`
- [ ] **E20**: SVG editor — `fill`, `stroke`, `stroke-width`, `stroke-dasharray`
- [ ] **E21**: Writing mode / direction editor — `writing-mode`, `direction`, `text-orientation`