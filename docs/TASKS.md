# TASKS.md — NovaStyle Project Initialization

## Stack: React + Vite + TypeScript + Tailwind CSS v4 + Chrome Extension (MV3)

---

### Task 1: Scaffold Vite + React + TypeScript project

```bash
npm create vite@latest novastyle -- --template react-ts
cd novastyle
npm install
```

### Task 2: Install Tailwind CSS v4 and configure Vite plugin

```bash
npm install tailwindcss @tailwindcss/vite
```

Remove any existing `tailwind.config.ts` if present (Tailwind v4 does not use it).

Update `vite.config.ts` to include the Tailwind plugin:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### Task 3: Set up CSS entry point with Tailwind v4

Replace `src/index.css` with Tailwind v4 import:

```css
@import "tailwindcss";
```

### Task 4: Create Chrome Extension directory structure

```
novastyle/
├── public/
│   └── manifest.json          # Chrome Extension Manifest V3
├── src/
│   ├── background/
│   │   └── service-worker.ts   # Background service worker
│   ├── content/
│   │   ├── content-script.ts   # Injected content script
│   │   ├── highlighter.ts      # Element bounding-box overlay
│   │   └── selector.ts         # Unique CSS selector computation
│   ├── panel/
│   │   ├── App.tsx             # React UI root (Shadow DOM)
│   │   ├── Panel.tsx           # Main panel layout
│   │   ├── components/
│   │   │   ├── BoxModel.tsx    # Margin/border/padding editor
│   │   │   ├── Typography.tsx  # Font controls
│   │   │   └── ColorPicker.tsx # Color & background controls
│   │   ├── hooks/
│   │   │   └── useStyles.ts    # Style state management
│   │   └── styles/
│   │       └── panel.css       # Shadow DOM styles
│   ├── storage/
│   │   └── db.ts               # chrome.storage.local wrapper
│   ├── exporter/
│   │   └── exporter.ts         # Compile overrides → CSS text
│   ├── main.tsx                # Entry point
│   └── index.css               # Tailwind v4 base
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### Task 5: Create `public/manifest.json`

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

### Task 6: Configure Vite for Chrome Extension multi-entry build

Update `vite.config.ts` with multi-entry input for the three extension entry points (background, content script, panel UI). Use `vite-plugin-chrome-extension` or a manual rollup config to produce:

- `dist/assets/service-worker.js`
- `dist/assets/content-script.js`
- `dist/assets/content-script.css`
- `dist/assets/index.js` / `dist/assets/index.css` (panel React app)
- `dist/manifest.json` (copied from public/)

### Task 7: Implement background service worker (`src/background/service-worker.ts`)

- Listen for extension icon click (`chrome.action.onClicked`)
- Inject content script via `chrome.scripting.executeScript`
- Handle storage relay messages from content script

### Task 8: Implement content script entry (`src/content/content-script.ts`)

- Inject the Shadow DOM container into the host page
- Attach `mouseover` / `click` event listeners
- On click: compute unique selector, open panel, send style data

### Task 9: Implement unique CSS selector computation (`src/content/selector.ts`)

- Walk up the DOM tree building a selector string
- Use tag names, IDs, class names, and `:nth-child` fallbacks for dynamic class names
- Return the final unique CSS selector

### Task 10: Implement highlighter overlay (`src/content/highlighter.ts`)

- Draw a `div` overlay tracking `getBoundingClientRect()`
- Style it with `position: fixed`, `pointer-events: none`, `z-index: 2147483647`
- Update position on scroll / resize

### Task 11: Create React panel UI with Shadow DOM isolation (`src/panel/`)

- Render the React app into a Shadow DOM root attached to the injected container
- Implement `Panel.tsx` with tabs: Styles, Export
- Implement `BoxModel.tsx`, `Typography.tsx`, `ColorPicker.tsx` editors
- Style the panel with Tailwind v4 utilities (compiled into Shadow DOM)

### Task 12: Implement style state management (`src/panel/hooks/useStyles.ts`)

- Maintain a `Record<string, Record<string, string>>` map (selector → property → value)
- Provide `updateStyle(selector, property, value)` and `removeStyle(selector, property)`
- Sync changes to the live stylesheet and to storage

### Task 13: Implement dynamic stylesheet injection (`src/content/content-script.ts` extension)

- Create / update `<style id="novastyle-live-sheet">` in document `<head>`
- Compile the style map into CSS text with `!important` flags
- Debounce rapid updates to stay under 16ms per frame

### Task 14: Implement storage layer (`src/storage/db.ts`)

- Wrap `chrome.storage.local` in async `get(domain)` / `set(domain, styles)` / `getAll()` functions
- Auto-save on style change (debounced)

### Task 15: Implement CSS exporter (`src/exporter/exporter.ts`)

- Accept the style map and format it as readable CSS
- Return a string ready for clipboard copy

### Task 16: Verify the build

```bash
npm run build
```

Confirm `dist/` contains: `manifest.json`, `assets/service-worker.js`, `assets/content-script.js`, `assets/content-script.css`, `assets/index.js`, `assets/index.css`.

### Task 17: Load unpacked extension in Chrome for manual smoke test

1. Open `chrome://extensions`
2. Enable Developer mode
3. Click "Load unpacked"
4. Select the `dist/` directory
5. Verify extension icon appears in toolbar
6. Navigate to any page, click the icon, and verify the panel renders
