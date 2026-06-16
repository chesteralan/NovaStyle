# NovaStyle

Visually modify any webpage's CSS through a point-and-click panel. Changes persist across reloads and export as clean, production-ready CSS.

## Stack

**React 19** · **Vite 8** · **TypeScript 6** · **Tailwind CSS v4** · **Chrome Extension MV3** · **Zustand** · **Shadow DOM**

## Quick Start

```bash
yarn install
yarn build
```

Load `dist/` as an unpacked extension in Chrome (`chrome://extensions` → Developer mode → Load unpacked).

## Editor Panels

| Panel | Properties |
|---|---|
| **Spacing** | margin, padding, border-radius |
| **Typography** | font-family, size, weight, line-height, letter-spacing, text-align |
| **Colors** | color, background-color (with picker) |
| **Layout** | display, position, width/height, overflow, z-index, box-sizing |
| **Flexbox** | direction, wrap, justify-content, align-items, gap, flex-grow/shrink |
| **Transform** | rotate, scale, translate, transform-origin |
| **Grid** | template columns/rows, gaps, auto-flow, justify/align-items |
| **Background** | image, size, repeat, position, attachment, clip, origin |
| **Filter** | blur, brightness, contrast, grayscale, sepia, hue-rotate, saturate, invert, opacity |
| **Text Decoration** | decoration line/style/color, text-transform, shadow, white-space |
| **Outline** | width, style, color, offset |
| **Interaction** | cursor, pointer-events, user-select, resize, visibility, float, object-fit |
| **Animation & Transition** | transition (property, duration, timing, delay), animation (name, duration, iteration-count, direction, fill-mode, timing, delay) |
| **List** | list-style type, position, image |
| **Table** | table-layout, border-collapse/spacing, caption-side, vertical-align |
| **Columns** | column count, width, gap, rule |
| **Scroll Snap** | snap type, align, stop, margin, padding |
| **SVG** | fill, stroke, stroke-width, dasharray, opacity |
| **Writing Mode** | writing-mode, direction, text-orientation, unicode-bidi |
| **Border** | width, style, color, radius |
| **Effects** | opacity, box-shadow |
| **Class Input** | add/remove CSS classes |
| **Font Detector** | detect fonts on the page |
| **Color Palette** | extract page color palette |
| **Class Resolver** | resolve CSS classes to properties |
| **Responsive Preview** | responsive viewport sizes |
| **Custom CSS** | inject custom styles |

All editor panels can be individually toggled in **Options → Editor Settings**.

## Architecture

Three-layer Chrome Extension:

- **Service Worker** — Tab state, storage relay
- **Content Script** — Element highlighting, selector computation, stylesheet injection (IIFE)
- **Shadow DOM Panel** — Isolated React UI with pre-compiled Tailwind CSS (IIFE)

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for full details.

## Docs

| Document | Description |
|---|---|
| [`docs/PRD.md`](docs/PRD.md) | Product requirements and feature definitions |
| [`docs/TASKS.md`](docs/TASKS.md) | Step-by-step project initialization tasks |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Module design, data flow, and technical architecture |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Technical decisions and rationale (ADRs) |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Version planning and brainstormed improvements |
| [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) | Setup guide, conventions, and troubleshooting |

## License

MIT
