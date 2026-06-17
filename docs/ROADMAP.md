# Roadmap — NovaStyle

## Version Planning

### v1.0.0 — Core MVP

**Goal**: Functional point-and-click CSS editor with persistence and export.

**Deliverables**:

- [ ] Element inspector with bounding-box highlighter
- [ ] Unique CSS selector computation (ID, class, nth-child fallback)
- [ ] Visual panel with Box Model (margin/border/padding) editor
- [ ] Typography panel (font-size, line-height, letter-spacing, alignment, weight)
- [ ] Color picker (text color, background)
- [ ] Dynamic stylesheet injection with `!important`
- [ ] `chrome.storage.local` persistence (per-domain)
- [ ] Auto-restore on page reload
- [ ] CSS export panel with copy-to-clipboard
- [ ] Extension toggle via toolbar icon

**Target Bundle**: < 80KB gzipped content script

---

### v1.1.0 — Polish & Reliability

**Goal**: Stable selectors, undo support, and performance tuning.

- [ ] **Undo/Redo** — Track style change history per session (stack of snapshots)
- [ ] **Selector stability improvements** — Detect and skip hashed class names (styled-components, CSS modules)
- [ ] **Element info tooltip** — Show tag, classes, and dimensions on hover
- [ ] **Reset to original** — Per-property reset button to clear override
- [ ] **Reset all** — Clear all overrides for current page/domain
- [ ] **Keyboard shortcuts** — `Escape` to close panel, `Cmd+Z` to undo
- [ ] **Performance** — Profile stylesheet rebuild cost; optimize beyond 50 rules

---

### v2.0.0 — Responsive & Framework-Aware

**Goal**: Handle modern CSS frameworks and responsive breakpoints.

- [ ] **Responsive breakpoints** — Device width toggles (mobile/tablet/desktop) that wrap rules in `@media` blocks
- [ ] **Framework detection** — Auto-detect Tailwind, Bootstrap, Material UI and suggest class-based overrides
- [ ] **:nth-child selector fallback** — Primary option for sites with dynamic/hashed class names
- [ ] **Pseudo-class editing** — `:hover`, `:focus`, `:active` state editors
- [ ] **Custom selector input** — Manual CSS selector override in the panel
- [ ] **Resizable panel** — Drag edge to resize the editor panel
- [ ] **Export with source maps** — Include domain, timestamp, and rule count in export header

---

### v2.1.0 — Advanced Editing

- [ ] **Multi-element selection** — `Cmd+click` to edit multiple elements simultaneously
- [ ] **Color palette extraction** — Extract and suggest colors used on the page
- [ ] **Font pairing detection** — Detect and list all `@font-face` families used
- [ ] **Gradient & shadow editors** — Visual editors for `background-gradient`, `box-shadow`, `text-shadow`
- [ ] **Layout grid overlay** — Toggleable CSS grid / flexbox visualization overlay
- [ ] **Border radius editor** — Per-corner radius inputs

---

### v3.0.0 — Collaboration & Sharing

**Goal**: Enable teams to share style overrides.

- [ ] **Style profiles** — Named profiles per domain (e.g., "Dark Mode", "High Contrast")
- [ ] **Import/Export JSON** — Download/upload style profiles as `.novastyle` files
- [ ] **Share by link** — Generate a shareable URL with encoded style overrides (via hash fragment, no server)
- [ ] **Cloud sync (optional)** — Optional Firebase sync for cross-device profiles (opt-in)
- [ ] **Team workspaces** — Shared profiles with permissions (requires backend)
- [ ] **Diff view** — Side-by-side diff between style profiles

---

### v4.0.0 — Design System Mode

- [ ] **Design token detection** — Parse CSS custom properties on the page and present them as a token editor
- [ ] **Global token overrides** — Edit `--color-primary`, `--font-sans`, etc. at the `:root` level
- [ ] **Component library integration** — Recognize shadcn/ui, MUI, Chakra components and show component-specific props
- [ ] **Style guides** — Generate a living style guide page from a profile (standalone HTML)
- [ ] **Auto-class generation** — Suggest/save new utility classes instead of `!important` overrides

---

## Brainstormed Improvements (Not Yet Scheduled)

These ideas need validation. They are captured here for future prioritization.

### UX & Workflow

- **Picture-in-Picture mode** — Detach panel into a floating always-on-top window
- **Change log / timeline** — Visual timeline of all edits made during a session
- **Screenshots with annotations** — Capture page state with overrides applied, add notes
- **Guided tutorial** — First-launch walkthrough highlighting key features
- **Recipe presets** — "Make this more readable" (increase font-size, line-height, contrast)
- **AI-assisted edits** — Natural language to CSS ("make the heading pop" → auto-suggests changes)

### Technical

- **MutationObserver for SPA navigation** — Detect route changes in SPAs (React Router, etc.) and re-inject styles
- **Iframe support** — Allow inspecting and editing styles inside iframes
- **CSS-in-JS extraction** — Parse styled-components / Emotion runtime styles from the document
- **Print stylesheet simulation** — Preview page as it would appear in print
- **Accessibility audit overlay** — Highlight elements with low contrast, missing focus styles, or small touch targets

### Developer Experience

- **CLI integration** — `npx novastyle` to open a local dev server that syncs with the extension
- **Git integration** — Track style changes alongside code (export as `.css` file in repo)
- **Figma plugin** — Bidirectional sync between Figma styles and live-page overrides
- **Storybook addon** — Use NovaStyle as a Storybook addon for visual debugging

### Monetization (Future Consideration)

- **Pro features** — Cloud sync, AI suggestions, team workspaces, priority support
- **Team billing** — Per-seat pricing for organizations
- **Free tier** — Core MVP features, limited profiles (3), local-only storage

---

## Technical Debt & Refactoring Tracking

| Area                 | Issue                                                        | Target                  |
| -------------------- | ------------------------------------------------------------ | ----------------------- |
| Selector engine      | `nth-child` fallback may break on DOM changes                | v1.1.0                  |
| Stylesheet injection | Full rebuild on every change → O(n) per edit                 | v1.1.0 (add diff/patch) |
| Build config         | Multi-entry Vite config needs manual rollup config           | v1.0.0                  |
| Testing              | No test infrastructure yet                                   | v1.1.0                  |
| Types                | `StyleMap` type shared across modules, but not yet extracted | v1.0.0                  |
| Panel resizing       | Currently fixed-width; user feedback needed for sizing       | v2.0.0                  |
