# TASKS.md — NovaStyle Project Initialization

## Stack: React + Vite + TypeScript + Tailwind CSS v4 + Chrome Extension (MV3)

> Reference docs: `ARCHITECTURE.md` (module design), `DECISIONS.md` (technical rationale), `ROADMAP.md` (version planning), `DEVELOPMENT.md` (coding conventions)

---

### Task 1: Scaffold Vite + React + TypeScript project

- [x] 

```bash
npm create vite@latest novastyle -- --template react-ts
cd novastyle
npm install
```

Commit the scaffolded project before making further changes.

### Task 2: Install Tailwind CSS v4 and configure Vite plugin

- [x]

```bash
npm install tailwindcss @tailwindcss/vite
```

Remove any existing `tailwind.config.ts` file (Tailwind v4 does not use it — see ADR-002).

Update `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### Task 3: Set up CSS entry point with Tailwind v4

- [x]

Replace `src/index.css` with:

```css
@import "tailwindcss";
```

### Task 4: Set up TypeScript path aliases

- [x]

Configure `@` alias pointing to `src/` in both `tsconfig.json` and `vite.config.ts`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

```ts
// vite.config.ts
resolve: {
  alias: { '@': path.resolve(__dirname, './src') }
}
```

### Task 5: Create the project directory structure

- [x]

```
novastyle/
├── public/
│   └── manifest.json              # Chrome Extension Manifest V3
├── src/
│   ├── background/
│   │   └── service-worker.ts       # Event-driven background worker
│   ├── content/
│   │   ├── content-script.ts       # Injected script: orchestration
│   │   ├── highlighter.ts          # Bounding-box overlay (rAF-driven)
│   │   ├── selector.ts             # Multi-strategy unique CSS selector
│   │   └── injector.ts             # <style> rebuild + DOM injection
│   ├── panel/
│   │   ├── App.tsx                 # React root → mounts into Shadow DOM
│   │   ├── Panel.tsx               # Tabbed panel layout (Styles | Export)
│   │   ├── components/
│   │   │   ├── BoxModel.tsx        # Margin / border / padding editor
│   │   │   ├── Typography.tsx      # Font-size, line-height, etc.
│   │   │   └── ColorPicker.tsx     # Text color & background pickers
│   │   ├── hooks/
│   │   │   └── useStyles.ts        # Zustand store (StyleMap state + undo/redo)
│   │   └── styles/
│   │       └── panel.css           # Tailwind v4 @theme + custom vars
│   ├── storage/
│   │   └── db.ts                   # chrome.storage.local wrapper
│   ├── exporter/
│   │   └── exporter.ts             # StyleMap → formatted CSS string
│   ├── types/
│   │   └── index.ts                # StyleMap, ChangeRecord, shared types
│   ├── main.tsx                    # Panel entry point
│   └── index.css                   # Tailwind v4 import
├── vite.config.ts
├── tsconfig.json
├── package.json
└── docs/                           # See docs/ for reference
```

### Task 6: Create `src/types/index.ts` — shared types

- [x]

```typescript
export interface StyleMap {
  [selector: string]: {
    [property: string]: string
  }
}

export interface ChangeRecord {
  selector: string
  property: string
  previousValue: string | null
  newValue: string
  timestamp: number
}

export interface PersistedDomain {
  styles: StyleMap
  updatedAt: number
}

export type ExtensionState = 'active' | 'inactive'
```

### Task 7: Create `public/manifest.json`

- [x]

```json
{
  "manifest_version": 3,
  "name": "NovaStyle",
  "version": "1.0.0",
  "description": "Visually edit any webpage's CSS — spacing, typography, colors, and layout.",
  "permissions": ["storage", "activeTab"],
  "host_permissions": ["<all_urls>"],
  "background": {
    "service_worker": "assets/service-worker.js",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["assets/content-script.js"],
      "css": ["assets/content-script.css"],
      "run_at": "document_end"
    }
  ],
  "action": {
    "default_title": "NovaStyle",
    "default_icon": {}
  }
}
```

### Task 8: Configure Vite for Chrome Extension multi-entry build

- [x]

Use a manual Rollup configuration (no third-party extension plugin — see ADR-006):

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  build: {
    rollupOptions: {
      input: {
        panel: path.resolve(__dirname, 'index.html'),
        'content-script': path.resolve(__dirname, 'src/content/content-script.ts'),
        'service-worker': path.resolve(__dirname, 'src/background/service-worker.ts'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
})
```

Build output targets:
- `dist/manifest.json` — copied from `public/`
- `dist/assets/service-worker.js`
- `dist/assets/content-script.js`
- `dist/assets/content-script.css`
- `dist/assets/index.js` + `dist/assets/index.css` (panel React app)

### Task 9: Implement background service worker (`src/background/service-worker.ts`)

- [x]

- Listen for `chrome.action.onClicked` to toggle extension active state
- Inject content script via `chrome.scripting.executeScript()` if not already present
- Maintain `tabId → ExtensionState` map in memory for badge/toggle
- Handle message relay:
  - `TOGGLE_EXTENSION` → update state, set badge text/color
  - `GET_STYLES` → read from `chrome.storage.local`, return styles for domain
  - `SAVE_STYLES` → write to `chrome.storage.local`

### Task 10: Implement selector engine (`src/content/selector.ts`)

- [x]

Multi-strategy selector computation per ADR-004:

1. **ID**: If element has `id`, use `#id`
2. **Unique class**: If a class is unique in the document, use `.class`
3. **Data attributes**: Check for `data-testid`, `data-cy`, etc.
4. **Path with `:nth-child`**: Walk up to a stable ancestor building `tag:nth-child(n)` segments
5. **Attribute fallback**: Use `[attr="value"]` for distinguishing attributes

Skip hashed class names (styled-components / CSS Modules) using heuristic: `/^[a-z]{2,}-\d+/`.

```typescript
function computeSelector(el: Element): string
```

### Task 11: Implement highlighter overlay (`src/content/highlighter.ts`)

- [x]

- Create a single `div` overlay appended to `document.body`
- `position: fixed`, `pointer-events: none`, `z-index: 2147483646`
- Style: 2px dashed `#3b82f6` border, translucent `rgba(59, 130, 246, 0.1)` fill
- Track hovered element via `requestAnimationFrame` on `mouseover`
- Re-position on `scroll` / `resize` events (rAF-throttled)
- Clean up on deactivation

```typescript
interface HighlighterState {
  el: HTMLElement | null
  overlay: HTMLDivElement | null
  visible: boolean
}
```

### Task 12: Implement content script orchestrator (`src/content/content-script.ts`)

- [x]

- Inject Shadow DOM container: `<div id="novastyle-root">` with open shadow root
- On activation: attach `mouseover` / `mouseout` / `click` event listeners
- On `click`: `e.preventDefault()`, `e.stopPropagation()`, freeze highlighter
  - Call `computeSelector(el)`
  - Call `getComputedStyle(el)` to extract current values
  - Open panel with selector + initial style data
- On deactivation: detach listeners, remove highlighter, unmount panel
- Coordinate injector, storage, and event flow

### Task 13: Implement stylesheet injector (`src/content/injector.ts`)

- [x]

- Manage `<style id="novastyle-live-sheet">` in document `<head>`
- Accept `StyleMap` and regenerate CSS text:
  ```
  selector { property: value !important; }
  ```
- Two-tier debouncing (see ADR-007):
  - Stylesheet rebuild: debounced at **50ms**
  - Storage save: debounced at **500ms**
- Use `requestAnimationFrame` for paint-sensitive updates

```typescript
function updateStylesheet(styles: StyleMap): void
```

### Task 14: Implement style state management (`src/panel/hooks/useStyles.ts`)

- [x]

- Create a Zustand store (`useStyleStore`) managing a `StyleMap` instance with undo/redo
- Snapshot-based undo stack limited to 50 entries
- Expose: `styles`, `updateStyle`, `removeStyle`, `resetAll`, `undo`, `redo`, `setStyles`
- Subscribers (injector, storage) listen directly via `useStyleStore.subscribe()`

### Task 15: Create React panel UI with Shadow DOM isolation (`src/panel/`)

- [x]

- Mount React app into Shadow DOM root (`createRoot(shadowRoot)`)
- Inject pre-compiled Tailwind v4 CSS into Shadow DOM `<style>` (see ADR-001, ADR-008)
- Implement tabbed `Panel.tsx`:
  - **Styles tab**: BoxModel, Typography, ColorPicker components
  - **Export tab**: Formatted CSS preview + Copy to Clipboard button
- No dynamic Tailwind class construction — all classes must exist in source files
- Use `cn()` utility for conditional classes

**Shadow DOM mounting**:
```typescript
const container = document.createElement('div')
container.id = 'novastyle-root'
const shadowRoot = container.attachShadow({ mode: 'open' })
document.body.appendChild(container)
const root = createRoot(shadowRoot)
root.render(<App />)
```

### Task 16: Implement panel editor components (`src/panel/components/`)

- [x]

#### BoxModel (`BoxModel.tsx`)
- Visual nested layout: Margin → Border → Padding → Content (center label)
- Numeric inputs per side (top/right/bottom/left) for each layer
- Linked toggle for uniform values (e.g., `margin: 24px` vs per-side)

#### Typography (`Typography.tsx`)
- Dropdowns: `font-family` (system font stack + detected page fonts)
- Sliders: `font-size` (px, rem toggle), `line-height` (unitless), `letter-spacing` (px)
- Alignment buttons: left / center / right / justify
- Weight slider: 100–900

#### ColorPicker (`ColorPicker.tsx`)
- Text color and background color pickers
- Native `<input type="color">` + hex text input
- Transparency support via alpha slider or hex8

### Task 17: Implement storage layer (`src/storage/db.ts`)

- [x]

Async wrapper around `chrome.storage.local`:

```typescript
async function getStyles(domain: string): Promise<StyleMap | null>
async function saveStyles(domain: string, styles: StyleMap): Promise<void>
async function removeDomainStyles(domain: string): Promise<void>
async function getAllDomains(): Promise<string[]>
```

- Extract domain from URL: `new URL(url).hostname.replace(/^www\./, '')`
- Call `saveStyles` via debounced relay from content script → service worker

### Task 18: Implement CSS exporter (`src/exporter/exporter.ts`)

- [x]

```typescript
function exportToCSS(styles: StyleMap, domain?: string): string
```

Custom formatter (no Prettier dependency — see ADR-009):

```css
/* NovaStyle Overrides — example.com */
/* Generated: 2026-06-15T12:00:00.000Z */

div.hero > h1 {
  padding-top: 24px !important;
  color: #334155 !important;
}
```

### Task 19: Create `src/panel/components/ExportPanel.tsx`

- [x]

- Display formatted CSS in a `<pre><code>` block with monospace styling
- "Copy to Clipboard" button using `navigator.clipboard.writeText()`
- Visual feedback: "Copied!" toast for 2 seconds

- [x]

### Task 20:

- [x]

On initialization (`document_end`):
1. Extract domain from `window.location.hostname`
2. Send `GET_STYLES` message to service worker
3. If styles exist for domain, call `updateStylesheet()` to re-inject them
4. Log restored rule count for debugging

### Task 21: Set up testing infrastructure

- [ ]

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Add to `vite.config.ts`:

```ts
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['./src/test/setup.ts']
}
```

Testing strategy:
- **Unit tests** (Vitest): `selector.ts`, `exporter.ts`, `storage/db.ts`, store logic
- **Component tests** (React Testing Library): `BoxModel.tsx`, `Typography.tsx`, `ColorPicker.tsx`
- **No E2E for initial setup** — added in a follow-up task

### Task 22: Verify the build

- [x]

```bash
npm run build
```

Confirm `dist/` contains:
```
dist/
├── manifest.json
└── assets/
    ├── service-worker.js
    ├── content-script.js
    ├── content-script.css
    ├── index.js
    └── index.css
```

### Task 23: Load unpacked extension in Chrome

- [ ]

1. Open `chrome://extensions`
2. Enable Developer mode (top-right toggle)
3. Click "Load unpacked"
4. Select the `dist/` directory
5. Verify extension icon appears in toolbar
6. Navigate to any page, click the icon, confirm panel renders
7. Click an element and verify: highlighter appears, panel opens with styles

### Task 24: Run initial test suite

- [ ]

```bash
npm run test          # Unit + component tests
npm run typecheck     # tsc --noEmit
npm run lint          # ESLint
```
