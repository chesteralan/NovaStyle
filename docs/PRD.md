# Product Requirement Document (PRD): NovaStyle Chrome Extension

## 1. Product Overview & Goals

NovaStyle is a browser extension that enables developers, designers, and low-code creators to modify any webpage's CSS visually. By clicking on elements, users can tweak design properties (spacing, typography, colors, layout) via an intuitive control panel and view changes in real time. The extension generates clean, production-ready CSS overrides.

### Objectives

- **Simplify Live Debugging**: Bridge the gap between standard browser DevTools (which can feel technical and text-heavy) and a fluid, visual design UI.
- **Persistent Stylesheets**: Allow user modifications to persist across page reloads on a per-domain or per-page basis.
- **Code Exporting**: Enable easy handoff by compiling user changes into structured, copy-pasteable CSS.

---

## 2. Target Audience & Core Use Cases

### User Personas

- **Frontend Developers**: Need to prototype layout tweaks rapidly or audit client feedback live on a staged environment.
- **UI/UX Designers**: Want to experiment with layout variations, margins, and typography options on a live page without writing code.
- **Low-Code Builders & Marketers**: Need to make localized tweaks to landing pages or user interfaces without relying entirely on engineering sprint allocations.

---

## 3. Product Architecture & Scope

To ensure a smooth user experience that does not clash with host webpage styles, the application is divided into three core environments: the Chrome Background Worker, the Injectable Content Engine, and an isolated Shadow DOM UI Panel.

### Component Relationship Architecture

```
┌───────────────────────────────────────────────────────────┐
│                 Chrome Background Worker                  │
│  - Tracks active tab permissions                          │
│  - Stores user CSS modifications in `chrome.storage`      │
└─────────────────────────────┬─────────────────────────────┘
                              │ Message Passing
                              ▼
┌───────────────────────────────────────────────────────────┐
│                 Injectable Content Engine                 │
│  - Binds global `mouseover` & `click` event listeners     │
│  - Calculates unique DOM selectors                        │
│  - Computes active style states via `getComputedStyle()`  │
└─────────────────────────────┬─────────────────────────────┘
                              │ Coordinates / Style Trees
                              ▼
┌───────────────────────────────────────────────────────────┐
│                 Isolated Shadow DOM UI                    │
│  - Draws visual DOM highlighter bounding boxes           │
│  - Renders input sliders, color pickers, and box models  │
│  - Injects dynamic stylesheet string overrides to <head> │
└───────────────────────────────────────────────────────────┘
```

---

## 4. Functional Requirements

### 4.1 Core Features & User Flows

#### Feature 1: Element Inspector (Point & Click)

- **FR-1.1**: Upon activating the extension, hovering over any DOM element must draw a localized highlighter overlay tracking the target's explicit dimensions (`getBoundingClientRect`).
- **FR-1.2**: Left-clicking an element must immediately freeze the inspector state, compute a unique CSS selector string, and open the styling panel for that node.
- **FR-1.3**: The inspector must execute with `e.preventDefault()` and `e.stopPropagation()` enabled, suppressing native click redirections or form submissions on the host site.

#### Feature 2: Visual Style Editor Panel (Shadow DOM UI)

- **FR-2.1**: The UI panel must be injected into an isolated Shadow DOM container to prevent host website global styles from breaking the editor interface layout.
- **FR-2.2**: **The Box Model Component**: Must provide a nested visual editor representing Margin, Border, and Padding inputs. Users can drag input fields or change numeric pixel values to alter spacing directly.
- **FR-2.3**: **Typography Panel**: Must support dropdown menus and input sliders for font-size, line-height, letter-spacing, text-alignment, and font-weight.
- **FR-2.4**: **Color & Backgrounds**: Must support custom interactive color-pickers for modifying text color and background parameters.

#### Feature 3: Dynamic Stylesheet Injection

- **FR-3.1**: User modifications must be compiled into an internal JavaScript object tracking modifications using the computed unique selector as keys:

```json
{
  "div.main-content > section.hero > h1": {
    "padding-top": "24px",
    "color": "#334155"
  }
}
```

- **FR-3.2**: The application must parse this object into a valid CSS text tree string and inject it into a dedicated `<style id="novastyle-live-sheet">` block in the document header.
- **FR-3.3**: Generated rules must append `!important` flags automatically to guarantee style enforcement over native inline scripts or high-specificity rules on the target site.

#### Feature 4: Persistence & Storage

- **FR-4.1**: Customized styles must be auto-saved asynchronously into `chrome.storage.local`, mapped by the host domain string.
- **FR-4.2**: On initial tab lifecycle navigation (`onUpdated` / DOMReady), NovaStyle must check storage and re-inject saved stylesheets automatically if data exists for the current URL.

#### Feature 5: Style Exporter

- **FR-5.1**: The side-panel must include an "Export Code" tab that shows a clean, formatted plain-text code block compiling all active overrides.
- **FR-5.2**: A "Copy to Clipboard" single-click function must be provided.

---

## 5. Non-Functional Requirements (NFRs)

### Performance & Security

- **NFR-1 (Isolation)**: Under no circumstance should the style editor UI conflict with the layout framework of the host page. The choice of Shadow DOM encapsulation is a hard constraint.
- **NFR-2 (Latency)**: The execution loop between moving a layout slider in the UI panel and the runtime rendering recalculation in the host viewport must remain under 16ms (aiming for 60 frames per second responsiveness).
- **NFR-3 (Data Privacy)**: No user browsing data or scraped DOM elements may be transmitted to external servers. All storage lookups must operate locally within the user's browser runtime instance (`chrome.storage`).

---

## 6. Technical Stack & Manifest Requirements

- **Manifest Specification**: Chrome Extensions Manifest V3.
- **Frontend UI Foundation**: React.js or Vanilla Web Components (bundled into a single lightweight content-script footprint).
- **Styling Options**: Built-in modular Tailwind CSS context compiled safely inside the Shadow DOM boundary context.

---

## 7. Open Questions & Future Scope

- **Handling Complex CSS Frameworks**: How will the engine generate stable unique CSS selectors on pages that use highly dynamic, hashed utility classes (e.g., dynamic styled-components or CSS Modules like `.css-19v6lw9`)? *Proposed solution for V2:* Fallback options utilizing positional `:nth-child` tags or path indices instead of class name dependencies.
- **Media Queries & Responsiveness**: Should users be able to change elements specifically for mobile breakpoints? *Proposed solution for V2:* Integrate screen-width toggles within the UI wrapper panel to conditionally wrap generated custom CSS objects within `@media` blocks.
