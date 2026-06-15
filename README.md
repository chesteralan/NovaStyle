# NovaStyle

Visually modify any webpage's CSS — spacing, typography, colors, and layout — through an intuitive point-and-click interface. Changes persist across reloads and export as clean, production-ready CSS.

## Stack

**React** · **Vite** · **TypeScript** · **Tailwind CSS v4** · **Chrome Extension MV3**

## Quick Start

```bash
npm install
npm run build
```

Load `dist/` as an unpacked extension in Chrome (`chrome://extensions` → Developer mode → Load unpacked).

## Docs

| Document | Description |
|---|---|
| [`docs/PRD.md`](docs/PRD.md) | Product requirements and feature definitions |
| [`docs/TASKS.md`](docs/TASKS.md) | Step-by-step project initialization tasks |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Module design, data flow, and technical architecture |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Technical decisions and rationale (ADRs) |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Version planning and brainstormed improvements |
| [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) | Setup guide, conventions, and troubleshooting |

## Architecture Overview

Three-layer Chrome Extension:

- **Service Worker** — Tab state, storage relay
- **Content Script** — Element highlighting, selector computation, stylesheet injection
- **Shadow DOM Panel** — Isolated React UI with pre-compiled Tailwind CSS

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for full details.

## License

MIT
