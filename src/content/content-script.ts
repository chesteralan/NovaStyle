import { createHighlighter, drawHighlighter, hideHighlighter, destroyHighlighter, type HighlighterState } from './highlighter'
import { computeSelector, extractStyles } from './selector'
import { updateStylesheet, clearStylesheet } from './injector'
import { saveStyles } from '@/storage/db'

let highlighter: HighlighterState | null = null
let active = false

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
  const selector = computeSelector(target)
  const styles = extractStyles(target)
  updateStylesheet(styles)
  openPanel(selector)
}

function openPanel(selector: string) {
  if (document.getElementById('novastyle-root')) return
  const container = document.createElement('div')
  container.id = 'novastyle-root'
  const shadow = container.attachShadow({ mode: 'open' })
  document.body.appendChild(container)

  const mountPoint = document.createElement('div')
  mountPoint.id = 'novastyle-panel-root'
  shadow.appendChild(mountPoint)

  const style = document.createElement('style')
  style.textContent = `:host { all: initial; display: block; }`
  shadow.appendChild(style)

  const cssLink = document.createElement('link')
  cssLink.rel = 'stylesheet'
  cssLink.href = chrome.runtime.getURL('assets/panel.css')
  shadow.appendChild(cssLink)

  const domain = window.location.hostname.replace(/^www\./, '')

  const configScript = document.createElement('script')
  configScript.textContent = `window.__NOVASTYLE_CONFIG__ = ${JSON.stringify({
    containerId: 'novastyle-root',
    mountPointId: 'novastyle-panel-root',
    selector,
    domain,
  })}`
  document.body.appendChild(configScript)

  const mainScript = document.createElement('script')
  mainScript.src = chrome.runtime.getURL('assets/panel.js')
  document.body.appendChild(mainScript)

  window.addEventListener('novastyle:close', () => closePanel(), { once: true })
  window.addEventListener('novastyle:update', ((e: CustomEvent) => {
    const { styles } = e.detail as { styles: Record<string, Record<string, string>> }
    updateStylesheet(styles)
    saveStyles(domain, styles)
  }) as EventListener)
}

function closePanel() {
  const container = document.getElementById('novastyle-root')
  if (container?.parentNode) {
    container.parentNode.removeChild(container)
  }
  clearStylesheet()
  window.removeEventListener('novastyle:close', closePanel)
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

const domain = window.location.hostname.replace(/^www\./, '')
chrome.storage.local.get(domain).then((result: any) => {
  const data = result[domain]
  if (data?.styles) {
    updateStylesheet(data.styles)
  }
})
