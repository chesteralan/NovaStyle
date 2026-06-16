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
- [ ] CSS animation / transition editor
- [ ] Grid layout helper
- [x] Color palette extraction from page
- [ ] Responsive preview mode toggle

## Phase 4: Advanced Features

- [x] Sync via `chrome.storage.sync` (cross-device)
- [ ] Preset themes (e.g., "dark reader", "high contrast", "sepia")
- [ ] Per-domain enable/disable toggle
- [x] Ignored domains list (extension inactive on these sites)
- [ ] Inline style extraction (pull existing inline styles into editor)
- [ ] Class-to-style resolution (display computed styles for Tailwind classes)
- [x] Keyboard shortcut configuration UI
- [ ] Export as Chrome extension / bookmarklet

## Phase 5: CI & DX

- [x] GitHub Actions CI (lint, typecheck, test, build)
- [ ] Add E2E tests with Playwright
- [ ] Add bundle size monitoring
- [ ] Add error tracking / Sentry integration
- [ ] Add contribution guidelines (CONTRIBUTING.md)
- [ ] Create Chrome Web Store listing assets
