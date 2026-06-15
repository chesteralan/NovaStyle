import { createHighlighter, drawHighlighter, hideHighlighter, destroyHighlighter, type HighlighterState } from './highlighter'
import { computeSelector, extractStyles } from './selector'
import { updateStylesheet } from './injector'

let highlighter: HighlighterState | null = null
let active = false
let selectedSelector: string | null = null

function onMouseOver(e: MouseEvent) {
  if (!active || !highlighter) return
  const target = e.target as HTMLElement
  if (target === highlighter.overlay || target.closest('#novastyle-root')) return
  drawHighlighter(highlighter, target)
}

function onMouseOut(e: MouseEvent) {
  if (!active || !highlighter) return
  const target = e.target as HTMLElement
  if (target === highlighter.overlay) return
  hideHighlighter(highlighter)
}

function onClick(e: MouseEvent) {
  if (!active || !highlighter) return
  const target = e.target as HTMLElement
  if (target.closest('#novastyle-root')) return
  e.preventDefault()
  e.stopPropagation()
  drawHighlighter(highlighter, target)
  selectedSelector = computeSelector(target)
  const styles = extractStyles(target)
  updateStylesheet(styles)
  openPanel(selectedSelector, styles[selectedSelector])
}

function openPanel(selector: string, _initialStyles: Record<string, string>) {
  const existing = document.getElementById('novastyle-root')
  if (existing) return
  const container = document.createElement('div')
  container.id = 'novastyle-root'
  const shadow = container.attachShadow({ mode: 'open' })
  document.body.appendChild(container)
  const style = document.createElement('style')
  style.textContent = `
    :host { all: initial; display: block; }
    #panel { position: fixed; top: 0; right: 0; width: 320px; height: 100vh; background: #fff; border-left: 1px solid #e2e8f0; box-shadow: -4px 0 12px rgba(0,0,0,0.08); z-index: 2147483647; font-family: system-ui, sans-serif; display: flex; flex-direction: column; }
    #header { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 600; font-size: 14px; display: flex; justify-content: space-between; }
    #selector { padding: 8px 16px; font-size: 11px; color: #64748b; border-bottom: 1px solid #e2e8f0; word-break: break-all; font-family: monospace; }
  `
  shadow.appendChild(style)
  const panel = document.createElement('div')
  panel.innerHTML = `
    <div id="panel">
      <div id="header"><span>NovaStyle</span><button id="close-btn">✕</button></div>
      <div id="selector">${selector}</div>
    </div>
  `
  shadow.appendChild(panel)
  panel.querySelector('#close-btn')?.addEventListener('click', closePanel)
}

function closePanel() {
  const container = document.getElementById('novastyle-root')
  if (container && container.parentNode) {
    container.parentNode.removeChild(container)
  }
  selectedSelector = null
}

function activate() {
  active = true
  highlighter = createHighlighter()
  document.addEventListener('mouseover', onMouseOver, { capture: true })
  document.addEventListener('mouseout', onMouseOut, { capture: true })
  document.addEventListener('click', onClick, { capture: true })
}

function deactivate() {
  active = false
  if (highlighter) destroyHighlighter(highlighter)
  highlighter = null
  document.removeEventListener('mouseover', onMouseOver, { capture: true })
  document.removeEventListener('mouseout', onMouseOut, { capture: true })
  document.removeEventListener('click', onClick, { capture: true })
  closePanel()
}

chrome.runtime.onMessage.addListener((message: any) => {
  if (message.type === 'TOGGLE_EXTENSION') {
    if (message.state === 'active') activate()
    else deactivate()
  }
})

chrome.storage.local.get(window.location.hostname).then((result: any) => {
  const data = result[window.location.hostname]
  if (data?.styles) {
    updateStylesheet(data.styles)
    console.log(`[NovaStyle] Restored ${Object.keys(data.styles).length} rule(s)`)
  }
})
