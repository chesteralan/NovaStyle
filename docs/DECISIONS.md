# Decision Log — NovaStyle

This document records key technical decisions and their rationale. Each entry uses a lightweight ADR (Architecture Decision Record) format.

---

## ADR-001: Shadow DOM for Panel Isolation

**Status**: Accepted  
**Date**: 2026-06-15  
**Context**: The editor panel renders inside the host page. Host page styles (CSS reset, Tailwind, Bootstrap, custom frameworks) would leak into the panel and break the editor UI.  
**Decision**: Mount the React panel inside an open Shadow DOM container. Inject pre-compiled Tailwind v4 CSS directly into the Shadow DOM `<style>` element.  
**Consequences**:

- ✅ Host styles never leak into the panel
- ✅ Panel styles never leak into the host (no accidental `div { margin: 0 }` collisions)
- ❌ Slightly more complex build (need to extract CSS for shadow injection)
- ❌ Some CSS-in-JS solutions (emotion) have issues with shadow roots; Vanilla Extract or pre-compiled CSS avoids this
- ✅ Shadow DOM is well-supported across Chromium-based browsers

---

## ADR-002: Tailwind CSS v4 with `@theme inline` for Panel Styling

**Status**: Accepted  
**Date**: 2026-06-15  
**Context**: The panel needs a utility-first CSS framework for rapid UI development. Tailwind v4 removes the `tailwind.config.ts` file and uses CSS-native `@theme` directives.  
**Decision**: Use Tailwind CSS v4 with the `@tailwindcss/vite` plugin. Define all theme tokens via `@theme inline` in `panel.css`. Pre-compile at build time and inject into Shadow DOM.  
**Consequences**:

- ✅ No runtime CSS processing (pre-compiled bundle is smaller and faster)
- ✅ Tailwind v4 `@theme inline` maps directly to CSS custom properties
- ✅ No PostCSS config needed — Vite plugin handles it
- ❌ Must delete `tailwind.config.ts` if created by accident (v3 → v4 migration footgun)
- ❌ `tailwindcss-animate` is deprecated in v4; use native CSS animations or `@tailwindcss/motion`

---

## ADR-003: !important Flags for Style Enforcement

**Status**: Accepted  
**Date**: 2026-06-15  
**Context**: User-applied overrides must take precedence over the host page's existing styles, which may have high-specificity selectors or inline styles.  
**Decision**: Append `!important` to every generated CSS property value.  
**Consequences**:

- ✅ Guarantees user overrides win regardless of host specificity
- ❌ Exported CSS includes `!important` — users may need to clean this up for production use
- ❌ Cannot override `!important` in the host without another `!important`; but since our injector owns the last `<style>` in `<head>`, specificity + source order already wins
- ✅ Simple and predictable — no need to compute specificity battles
- **Future**: v2 could add a "clean export" mode that strips `!important` when the user is ready to integrate into their actual stylesheet

---

## ADR-004: Multi-Strategy Selector Computation

**Status**: Accepted  
**Date**: 2026-06-15  
**Context**: Modern frameworks generate dynamic, hashed class names (e.g., `css-19v6lw9`, `_1abc2d`). These break on page reload. We need stable selectors.  
**Decision**: Use a cascade of strategies in priority order:

1. ID attribute (`#unique-id`)
2. Unique class name (present on only this element in the document)
3. Data attributes (`[data-testid="..."]`, `[data-cy="..."]`)
4. Positional path (`:nth-child` indices rooted at a stable ancestor)

Skip classes matching hashed patterns (regex: `/^[a-z]{2,}-\d+/` or similar heuristics).  
**Consequences**:

- ✅ Stable across page reloads for most sites
- ✅ Handles dynamic frameworks gracefully via `:nth-child` fallback
- ❌ `:nth-child` selectors are fragile when DOM structure changes dynamically
- ❌ Heuristic regex for hashed classes may produce false positives/negatives
- **Mitigation**: Allow the user to manually edit the selector string in v2

---

## ADR-005: chrome.storage.local for Persistence

**Status**: Accepted  
**Date**: 2026-06-15  
**Context**: User styles need to persist across page reloads. Options: `chrome.storage.local`, `chrome.storage.sync`, IndexedDB, or `localStorage`.  
**Decision**: Use `chrome.storage.local` keyed by domain hostname.  
**Consequences**:

- ✅ Automatic quota management (~10MB, more than sufficient for CSS overrides)
- ✅ Works in service worker context (unlike `localStorage`)
- ✅ No data leaves the browser (privacy by design)
- ❌ `chrome.storage.sync` would be nicer for cross-device sync but has severe quota limits (~100KB) and is subject to sync conflicts
- ✅ Async API with callback/promise support
- **Future**: v3 can layer optional cloud sync on top while keeping local as the source of truth

---

## ADR-006: Vite Multi-Entry Build (Not Extension-Framework)

**Status**: Accepted  
**Date**: 2026-06-15  
**Context**: Chrome Extensions require multiple separate output files (service worker, content script, panel HTML/JS/CSS). We need a build system that handles this.  
**Decision**: Use raw Vite with a manual Rollup configuration (multi-entry input) rather than an opinionated framework like `@crxjs/vite-plugin` or `chrome-extension-cli`.  
**Consequences**:

- ✅ Full control over output structure
- ✅ No dependency on third-party extension build tools (which often lag behind Vite releases)
- ✅ Can precisely control chunk splitting and output filenames
- ❌ More manual configuration (entry points, output paths, copying manifest)
- ❌ Need to handle HMR ourselves (not a concern for extension content scripts, but matters for panel dev)
- **Mitigation**: Extract a reusable `vite.chrome.config.ts` that wraps the multi-entry setup

---

## ADR-007: Debounced Style Updates (50ms / 500ms)

**Status**: Accepted  
**Date**: 2026-06-15  
**Context**: Dragging a slider fires `onChange` at every pixel value. Rebuilding the entire stylesheet on every frame would be wasteful.  
**Decision**: Two-tier debouncing:

- **Stylesheet rebuild**: Debounced at 50ms (matches ~20fps visual update — imperceptible for CSS changes)
- **Storage save**: Debounced at 500ms (I/O is expensive, and data loss risk is low within 500ms)
  **Consequences**:
- ✅ Smooth slider interaction without layout thrashing
- ✅ Reduces `chrome.storage` writes by ~10x during rapid edits
- ❌ If the tab crashes, the last ~500ms of edits are lost (acceptable trade-off for an editor tool)
- ✅ Easy to tune constants if performance data suggests different values

---

## ADR-008: Pre-compiled Tailwind CSS for Shadow DOM

**Status**: Accepted  
**Date**: 2026-06-15  
**Context**: Tailwind CSS usually works by scanning HTML classes and generating styles at build time. Inside a Shadow DOM, the scanner won't see dynamically rendered React components.  
**Decision**: Compile the panel's Tailwind CSS at build time (Vite handles this via `@tailwindcss/vite`). The compiled CSS is extracted into a separate file and injected into the Shadow DOM `<style>` element.  
**Consequences**:

- ✅ Tailwind classes used in React components are all pre-compiled and available
- ✅ No runtime Tailwind JIT compiler needed
- ❌ Must ensure all used classes exist in the source — no dynamic class name construction like `text-${size}-${color}`
- ✅ Tailwind v4's `@theme inline` approach makes this easier (all tokens are CSS variables)
- **Best Practice**: Use `cn()` utility with explicit class strings only; never interpolate class names dynamically

---

## ADR-009: No External Dependencies for Exporter

**Status**: Accepted  
**Date**: 2026-06-15  
**Context**: The CSS export feature needs to format a `StyleMap` into readable CSS text.  
**Decision**: Write a custom formatter (~50 lines) rather than importing Prettier or a CSS formatting library.  
**Consequences**:

- ✅ Zero added bundle size (< 1KB)
- ✅ Full control over output format (can add headers, timestamps, etc.)
- ❌ No syntax highlighting in the export view (handled by a `<pre><code>` block with basic styling)
- ✅ Avoids CSP issues with `eval()`-based formatters (Prettier uses `Function()` in some code paths)

---

## ADR-010: Content Script at `document_end` (Not `document_idle`)

**Status**: Accepted  
**Date**: 2026-06-15  
**Context**: The content script needs DOM access to attach event listeners and inspect elements.  
**Decision**: Use `"run_at": "document_end"` — the DOM is ready but subresources may still load.  
**Consequences**:

- ✅ DOM is available for querying and event binding
- ✅ Earlier than `document_idle` (~500ms sooner), so the extension feels more responsive
- ❌ Some late-loading dynamic content (SPA routes, lazy-loaded sections) won't be immediately visible for inspection
- **Mitigation**: `document_end` combined with a `MutationObserver` for SPA route changes in v2
