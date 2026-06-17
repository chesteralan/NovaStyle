# Architecture — NovaStyle

## System Architecture

NovaStyle is a Chrome Extension (Manifest V3) divided into three runtime environments that communicate via message passing.

```
┌──────────────────────────────────────────────────────────────────┐
│                        Browser Process                          │
│                                                                  │
│  ┌─────────────────┐    ┌───────────────────────────────────┐   │
│  │  Service Worker  │    │         Content Script           │   │
│  │  (background/)  │◄──►│         (content/)               │   │
│  │                 │    │                                  │   │
│  │  • Tab state    │    │  ┌──────────────────────────┐    │   │
│  │  • Storage relay│    │  │   Highlighter Engine     │    │   │
│  │  • Icon badge   │    │  │   (highlighter.ts)       │    │   │
│  └─────────────────┘    │  │   • Bounding box overlay │    │   │
│          ▲              │  │   • Scroll/resize sync   │    │   │
│          │              │  └──────────────────────────┘    │   │
│          │              │                                  │   │
│    chrome.runtime       │  ┌──────────────────────────┐    │   │
│    .sendMessage         │  │   Selector Engine        │    │   │
│          │              │  │   (selector.ts)          │    │   │
│          │              │  │   • DOM walking          │    │   │
│          ▼              │  │   • Unique path gen      │    │   │
│  ┌─────────────────┐    │  │   • :nth-child fallback  │    │   │
│  │  Storage Layer  │    │  └──────────────────────────┘    │   │
│  │  (storage/)     │    │                                  │   │
│  │                 │    │  ┌──────────────────────────┐    │   │
│  │  • Read/write   │    │  │   Stylesheet Injector    │    │   │
│  │  • Domain map   │    │  │   (content-script.ts)    │    │   │
│  │  • Auto-restore │    │  │   • <style> injection   │    │   │
│  └─────────────────┘    │  │   • !important enforce   │    │   │
│                          │  │   • Debounced updates   │    │   │
│                          │  └──────────────────────────┘    │   │
│                          │                                  │   │
│                          │  ┌──────────────────────────┐    │   │
│                          │  │   Shadow DOM UI Panel    │    │   │
│                          │  │   (panel/)               │    │   │
│                          │  │   • React app in shadow  │    │   │
│                          │  │   • Tailwind v4 compiled │    │   │
│                          │  │   • Host-style isolated  │    │   │
│                          │  └──────────────────────────┘    │   │
│                          └───────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Module Design

### 1. Background Service Worker (`src/background/service-worker.ts`)

**Lifecycle**: Persistent in Manifest V3 (event-driven, not truly persistent but revived on demand).

**Responsibilities**:

- Listen for `chrome.action.onClicked` to toggle the extension on/off for the active tab
- Inject the content script via `chrome.scripting.executeScript()` if not already present
- Relay storage requests from content script to `chrome.storage.local`
- Maintain an in-memory map of `tabId → active state` for badge/toggle state

**Message Types Handled**:

| Message            | Direction        | Payload                     |
| ------------------ | ---------------- | --------------------------- |
| `TOGGLE_EXTENSION` | panel → worker   | `{ tabId }`                 |
| `GET_STYLES`       | content → worker | `{ domain }` → `{ styles }` |
| `SAVE_STYLES`      | content → worker | `{ domain, styles }`        |
| `GET_STATE`        | content → worker | `{}` → `{ active }`         |

### 2. Content Script (`src/content/content-script.ts`)

**Injection**: Declared in `manifest.json` under `content_scripts` → injected at `document_end` on all URLs.

**Responsibilities**:

- Attach global `mouseover` / `mouseout` / `click` listeners (when active)
- Coordinate between highlighter, selector engine, stylesheet injector, and UI panel
- Manage the Shadow DOM container mount point
- Debounce style updates to maintain 60fps (16ms budget)

**Event Flow (Element Selection)**:

```
mouseover → highlighter.draw(el)
click → e.preventDefault()
      → selector.compute(el)
      → freeze highlight
      → getComputedStyle(el)
      → open panel with initial styles
```

**Event Flow (Style Change)**:

```
panel: slider change
    → useStyleStore.getState().updateStyle(selector, property, value)
    → injector.update(stylesMap)
    → storage.debouncedSave(domain, stylesMap)
```

### 3. Highlighter Engine (`src/content/highlighter.ts`)

Renders a floating overlay div that tracks the hovered element.

```typescript
interface HighlighterState {
  el: HTMLElement | null
  overlay: HTMLDivElement | null
  visible: boolean
}
```

**Implementation Details**:

- Creates a single `div` appended to `document.body`
- `position: fixed`, `pointer-events: none`, `z-index: 2147483646`
- Border: 2px dashed `#3b82f6` (blue-500) with semi-transparent fill
- Updates position via `requestAnimationFrame` on scroll/resize
- Cleans up on deactivation (removes from DOM)

### 4. Selector Engine (`src/content/selector.ts`)

Builds a unique CSS selector for any given DOM node.

```typescript
function computeSelector(el: Element): string
```

**Strategy (priority order)**:

1. **ID**: If element has an `id`, use `#id` (fastest, most stable)
2. **Unique class**: If `el.classList` contains a class unique in the document, use that
3. **Path with nth-child**: Walk up to a stable ancestor, building `tag:nth-child(n)` path
4. **Data attributes**: Check for `data-testid`, `data-cy`, or similar stable attributes
5. **Attributes**: Fall back to `[attr="value"]` for distinguishing attributes

**Edge Cases**:

- Dynamic classes (styled-components, CSS modules): Skip hashed classes (regex: `/[a-z]{2,}-\d+[a-zA-Z0-9]*/` or similar patterns)
- SVG elements: Use tag names and parent paths
- Text nodes: Walk to parent element
- Shadow DOM: Cross shadow boundary via `part` attribute or slot context

### 5. Stylesheet Injector (`src/content/content-script.ts` → injection logic)

Manages a `<style id="novastyle-live-sheet">` element in the host page's `<head>`.

```
stylesMap = {
  "div.hero > h1": {
    "padding-top": "24px",
    "color": "#334155",
    "font-size": "2.25rem"
  }
}
```

**Compilation to CSS**:

```
div.hero > h1 {
  padding-top: 24px !important;
  color: #334155 !important;
  font-size: 2.25rem !important;
}
```

**Performance**:

- Style updates are batched and debounced at ~50ms
- Entire stylesheet is regenerated on each change (simple and predictable for < 100 rules)
- If rule count exceeds 100, consider incremental patch approach in V2

### 6. React UI Panel (`src/panel/`)

**Mounting**: A React root renders into a Shadow DOM container attached to the host page.

```
host page body
  └── <div id="novastyle-root">           ← injected by content script
       └── #shadow-root (open)
            ├── <style>                    ← Tailwind v4 compiled CSS
            │     (pre-compiled, scoped to shadow)
            ├── <div id="novastyle-panel">
            │     ├── Toolbar (tabs, close, export)
            │     ├── BoxModelEditor
            │     ├── TypographyEditor
            │     ├── ColorEditor
            │     └── ExportPanel
            └── <div id="novastyle-resizer">  ← drag handle
```

**Shadow DOM Strategy**:

- React app renders into `shadowRoot` via `createRoot(shadowRoot)`
- Tailwind v4 CSS is pre-compiled at build time and injected into the Shadow DOM `<style>` element
- No host styles leak in; no panel styles leak out

### 7. Storage Layer (`src/storage/db.ts`)

Abstraction over `chrome.storage.local` with domain-based keying.

```typescript
interface StorageSchema {
  [domain: string]: {
    styles: StyleMap
    updatedAt: number
  }
}

async function getStyles(domain: string): Promise<StyleMap | null>
async function saveStyles(domain: string, styles: StyleMap): Promise<void>
async function getAllDomains(): Promise<string[]>
async function removeStyles(domain: string): Promise<void>
```

**Domain extraction**: `new URL(url).hostname` → strips `www.` prefix for consistent keys.

**Auto-restore**: On content script initialization, the script sends a `GET_STYLES` message and re-injects any saved styles.

### 8. Exporter (`src/exporter/exporter.ts`)

Accepts the internal `StyleMap` and produces formatted CSS.

```typescript
function exportToCSS(stylesMap: StyleMap): string
```

**Output format**:

```css
/* NovaStyle Overrides — novastyle.example.com */
/* Generated: 2026-06-15T12:00:00.000Z */

div.hero > h1 {
  padding-top: 24px !important;
  color: #334155 !important;
  font-size: 2.25rem !important;
}

section.footer {
  margin-top: 48px !important;
}
```

---

## Data Flow Diagrams

### Activation Flow

```
User clicks icon
    → chrome.action.onClicked (service worker)
    → chrome.scripting.executeScript (if not injected)
    → content script initializes
        → highlighter.attach()
        → injector.restoreFromStorage()
        → panel.mount()
    → content script sends ACK to worker
    → worker sets badge to active state
```

### Edit Flow

```
User hovers element
    → highlighter.draw(el)                  [rAF, 16ms]
User clicks element
    → e.preventDefault(), e.stopPropagation()
    → selector = computeSelector(el)         [~0.1ms]
    → styles = getComputedStyle(el)          [~1-2ms]
    → panel.open(selector, styles)
User adjusts slider
    → useStyleStore.getState().updateStyle(selector, prop, value)  [~0.01ms]
    → injector.update(stylesMap)                     [debounced ~50ms]
        → rebuild CSS string
        → replace <style> textContent
        → browser re-paints                           [~16ms]
    → storage.save(domain, stylesMap)                 [debounced ~500ms]
```

---

## Build Output

```
dist/
├── manifest.json
├── assets/
│   ├── service-worker.js      ← Background worker (IIFE bundle)
│   ├── content-script.js      ← Content script (IIFE bundle)
│   ├── content-script.css     ← Shadow DOM panel styles (pre-compiled Tailwind)
│   ├── index.html             ← Placeholder if using Vite multi-page
│   ├── index.js               ← Panel React app
│   └── index.css              ← Panel styles
└── icons/
    └── icon-{16,48,128}.png
```

---

## Key Constraints

| Constraint             | Decision                                                      |
| ---------------------- | ------------------------------------------------------------- |
| **Style isolation**    | Shadow DOM with pre-compiled Tailwind v4 CSS                  |
| **Framebudget**        | Debounce stylesheet rebuilds (50ms), use rAF for overlays     |
| **Selector stability** | Multi-strategy with `:nth-child` fallback                     |
| **No external calls**  | All data in `chrome.storage.local`                            |
| **No `eval()`**        | Manifest V3 CSP prohibits unsafe-eval; pre-compile everything |
| **Bundle size**        | Target < 100KB gzipped for content script                     |
