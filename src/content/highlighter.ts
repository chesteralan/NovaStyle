const HIGHLIGHTER_Z_INDEX = 2147483646

export interface HighlighterState {
  el: HTMLElement | null
  overlay: HTMLDivElement | null
  visible: boolean
}

export function createHighlighter(): HighlighterState {
  const overlay = document.createElement('div')
  overlay.id = 'novastyle-highlighter'
  overlay.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: ${HIGHLIGHTER_Z_INDEX};
    border: 2px dashed #3b82f6;
    background: rgba(59, 130, 246, 0.08);
    transition: none;
    display: none;
  `
  document.body.appendChild(overlay)
  return { el: null, overlay, visible: false }
}

export function drawHighlighter(state: HighlighterState, el: HTMLElement) {
  if (!state.overlay) return
  const rect = el.getBoundingClientRect()
  state.overlay.style.display = 'block'
  state.overlay.style.top = `${rect.top + window.scrollY}px`
  state.overlay.style.left = `${rect.left + window.scrollX}px`
  state.overlay.style.width = `${rect.width}px`
  state.overlay.style.height = `${rect.height}px`
  state.el = el
  state.visible = true
}

export function hideHighlighter(state: HighlighterState) {
  if (!state.overlay) return
  state.overlay.style.display = 'none'
  state.el = null
  state.visible = false
}

export function destroyHighlighter(state: HighlighterState) {
  if (state.overlay && state.overlay.parentNode) {
    state.overlay.parentNode.removeChild(state.overlay)
  }
  state.el = null
  state.overlay = null
  state.visible = false
}
