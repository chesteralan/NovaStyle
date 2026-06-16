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
- [ ] Persist panel position preference to storage and apply on open
- [ ] Persist theme preference and apply to panel
- [ ] Persist visible editors preference

## Phase 2: Style Management

- [ ] Search/filter domains in options page
- [ ] Bulk select and delete domains
- [ ] Export individual domain styles (not just all)
- [ ] Style history / version snapshots per domain
- [ ] Rename domains
- [ ] Sort domains (by name, last edited)

## Phase 3: Editor Improvements

- [ ] Undo/redo keyboard shortcuts (Ctrl+Z / Ctrl+Shift+Z)
- [ ] Escape key to close panel
- [ ] Dark mode for panel UI
- [ ] Font detection — list all fonts used on page
- [ ] Custom CSS injection (user-defined overrides unrelated to selected elements)
- [ ] CSS animation / transition editor
- [ ] Grid layout helper
- [ ] Color palette extraction from page
- [ ] Responsive preview mode toggle

## Phase 4: Advanced Features

- [ ] Sync via `chrome.storage.sync` (cross-device)
- [ ] Preset themes (e.g., "dark reader", "high contrast", "sepia")
- [ ] Per-domain enable/disable toggle
- [ ] Ignored domains list (extension inactive on these sites)
- [ ] Inline style extraction (pull existing inline styles into editor)
- [ ] Class-to-style resolution (display computed styles for Tailwind classes)
- [ ] Keyboard shortcut configuration UI
- [ ] Export as Chrome extension / bookmarklet

## Phase 5: CI & DX

- [ ] GitHub Actions CI (lint, typecheck, test, build)
- [ ] Add E2E tests with Playwright
- [ ] Add bundle size monitoring
- [ ] Add error tracking / Sentry integration
- [ ] Add contribution guidelines (CONTRIBUTING.md)
- [ ] Create Chrome Web Store listing assets
