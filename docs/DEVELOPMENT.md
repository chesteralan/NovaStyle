# Development — NovaStyle

## Prerequisites

- **Node.js** >= 20.x
- **npm** >= 10.x (or **pnpm** / **bun**)
- **Chrome** >= 120 (for Manifest V3 support)

---

## Setup

```bash
# Clone the repository
git clone <repo-url>
cd novastyle

# Install dependencies
npm install

# Start development (Vite dev server for panel UI)
npm run dev

# Build for production (generates dist/)
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```
novastyle/
├── public/
│   ├── manifest.json           # Chrome Extension manifest
│   └── icons/                  # Extension icons (16, 48, 128)
├── src/
│   ├── background/
│   │   └── service-worker.ts   # Background service worker
│   ├── content/
│   │   ├── content-script.ts   # Main content script
│   │   ├── highlighter.ts      # Bounding box overlay
│   │   └── selector.ts         # CSS selector computation
│   ├── panel/
│   │   ├── App.tsx             # React root (mounts into Shadow DOM)
│   │   ├── Panel.tsx           # Main panel with tabs
│   │   ├── components/
│   │   │   ├── BoxModel.tsx    # Margin/Border/Padding editor
│   │   │   ├── Typography.tsx  # Font-size, line-height, etc.
│   │   │   └── ColorPicker.tsx # Color & background pickers
│   │   ├── hooks/
│   │   │   └── useStyles.ts    # Style state management hook
│   │   └── styles/
│   │       └── panel.css       # Tailwind v4 + custom panel styles
│   ├── storage/
│   │   └── db.ts               # chrome.storage.local wrapper
│   ├── exporter/
│   │   └── exporter.ts         # StyleMap → CSS string
│   ├── types/
│   │   └── index.ts            # Shared TypeScript types
│   ├── main.tsx                # Panel entry point
│   └── index.css               # Global Tailwind v4 import
├── dist/                       # Build output (loaded by Chrome)
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── package.json
├── docs/
│   ├── PRD.md                  # Product requirements
│   ├── TASKS.md                # Initialization tasks
│   ├── ARCHITECTURE.md         # Technical architecture
│   ├── ROADMAP.md              # Future plans & improvements
│   └── DECISIONS.md            # Technical decision log
└── README.md
```

**Key Files**:

| File | Purpose |
|---|---|
| `vite.config.ts` | Multi-entry Vite build for Chrome Extension |
| `public/manifest.json` | Extension manifest (copied verbatim to dist/) |
| `src/content/content-script.ts` | Injected into host page; orchestrates all features |
| `src/panel/App.tsx` | React root mounted into Shadow DOM |
| `src/storage/db.ts` | Persistence layer |
| `src/exporter/exporter.ts` | CSS code generation |
| `src/types/index.ts` | `StyleMap` and shared interfaces |

---

## Build Configuration

The Vite config is set up for multi-entry output:

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

> **Note**: The `index.html` entry generates the panel app. Content script and service worker entries are pure JS files (not HTML pages).

---

## Loading in Chrome for Development

1. **Build the extension**:
   ```bash
   npm run build
   ```

2. **Open Chrome Extensions page**:
   - Navigate to `chrome://extensions`
   - Enable **Developer mode** (top-right toggle)

3. **Load unpacked**:
   - Click **Load unpacked**
   - Select the `dist/` directory

4. **Verify**:
   - Extension icon should appear in the toolbar
   - Navigate to any page, click the icon, and the panel should open

5. **Rebuilding**:
   - After code changes: `npm run build`
   - On `chrome://extensions`, click the refresh icon on the NovaStyle card
   - Reload the target page to get the updated content script

---

## Development Workflow Tips

### Panel UI Development

The panel React app can be developed independently in the Vite dev server for faster iteration:

```bash
npm run dev
# Opens http://localhost:5173 with hot reload
```

> **Note**: `chrome.storage` APIs won't be available in dev mode. Use mock data or conditionally check for `typeof chrome !== 'undefined'`.

### Debugging Content Scripts

1. Navigate to the target page
2. Open Chrome DevTools (`Cmd+Option+I`)
3. The content script runs in the page context — you'll see its console logs in the page's DevTools console
4. For the service worker: go to `chrome://extensions` → click **service worker** link on the NovaStyle card → a separate DevTools window opens

### Inspecting the Shadow DOM Panel

1. Open DevTools on the target page
2. In the Elements panel, find `<div id="novastyle-root">`
3. Expand the `#shadow-root (open)` node to inspect panel internals
4. Styles applied inside the shadow root are scoped and won't affect the host page

---

## Coding Conventions

### TypeScript

- Strict mode enabled (`strict: true` in `tsconfig.json`)
- Prefer `interface` over `type` for object shapes
- Use `type` for unions, tuples, and utility types
- Export shared types from `src/types/index.ts`

### Imports

```typescript
// Absolute imports (configured via @ alias)
import { computeSelector } from '@/content/selector'
import { StyleMap } from '@/types'

// Relative imports only for same-directory files
import { useStyles } from './hooks/useStyles'
```

### CSS Naming

- Panel classes use Tailwind utility classes exclusively
- No custom CSS class names outside of Tailwind
- If custom CSS is needed, place it in `panel.css` inside `@layer components`

### State Management

- All style state lives in the `useStyles` custom hook
- No external state library (Redux, Zustand) — the hook manages a single `StyleMap` object
- The hook exposes: `styles`, `updateStyle`, `removeStyle`, `resetAll`, `canUndo`, `canRedo`, `undo`, `redo`

---

## Testing

```bash
# Run unit tests (vitest)
npm run test

# Run tests with coverage
npm run test -- --coverage

# Run tests in watch mode
npm run test -- --watch
```

### Testing Strategy

| Layer | Tool | What to Test |
|---|---|---|
| Unit | Vitest | `selector.ts`, `exporter.ts`, `storage/db.ts` |
| Component | Vitest + React Testing Library | Panel components (BoxModel, Typography) |
| Integration | Playwright (Chrome extension mode) | Full content script → panel → storage flow |
| E2E | Playwright | Load page, activate extension, edit style, verify persistence |

---

## Linting & Formatting

```bash
# Lint
npm run lint

# Format (Prettier)
npm run format

# Type-check
npm run typecheck
```

---

## Contributing

1. **Branch**: Create a feature branch from `main`: `git checkout -b feat/your-feature`
2. **Develop**: Make changes, add tests, verify build
3. **Lint & typecheck**: Run `npm run lint && npm run typecheck`
4. **Build**: Run `npm run build` and verify the `dist/` output
5. **PR**: Open a pull request with a clear description of the change

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add responsive breakpoint toggles
fix: selector engine crash on SVG elements
docs: add ADR for shadow DOM isolation
refactor: extract stylesheet injector into separate module
```

---

## Troubleshooting

### Build fails with "Cannot find module"

Ensure dependencies are installed: `npm install`

### Extension not appearing in toolbar

1. Check that `dist/manifest.json` exists and is valid JSON
2. Verify `manifest.json` has `"action": { "default_title": "NovaStyle" }`
3. Check Chrome DevTools console for manifest validation errors

### Panel not appearing on click

1. Open DevTools on the target page
2. Check for console errors from the content script
3. Verify the content script is injected (check Elements panel for `#novastyle-root`)
4. Check the service worker DevTools for message passing errors

### Styles not persisting across reload

1. Open service worker DevTools
2. Add a breakpoint in `storage/db.ts` `saveStyles()` — verify it's called
3. Check `chrome.storage.local` contents via DevTools → Application → Storage → Local Storage → `chrome-extension://<id>`
