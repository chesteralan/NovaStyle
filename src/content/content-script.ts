import { createHighlighter, drawHighlighter, hideHighlighter, destroyHighlighter, type HighlighterState } from './highlighter'
import { computeSelector, extractStyles } from './selector'
import { updateStylesheet, clearStylesheet } from './injector'
import { getSettings, saveStyles } from '@/storage/db'
import type { ContentMessage } from '@/types'

const CURRENT_DOMAIN = window.location.hostname.replace(/^www\./, '')

getSettings().then((settings) => {
  if ((settings.ignoredDomains ?? []).includes(CURRENT_DOMAIN)) return
  chrome.storage.local.get(CURRENT_DOMAIN).then((result: unknown) => {
    const data = (result as Record<string, { styles?: Record<string, Record<string, string>> } | undefined>)[CURRENT_DOMAIN]
    if (data?.styles) {
      updateStylesheet(data.styles)
    }
  })
})

let highlighter: HighlighterState | null = null
let active = false
let panelMountPoint: HTMLElement | null = null
let lastClicked: HTMLElement | null = null

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
  const classes = Array.from(target.classList)
  lastClicked = target
  updateStylesheet(styles)

  if (panelMountPoint) {
    panelMountPoint.dataset.novastyleSelector = selector
    panelMountPoint.dataset.novastyleStyles = JSON.stringify(styles)
    panelMountPoint.dataset.novastyleClasses = JSON.stringify(classes)
    panelMountPoint.dispatchEvent(new CustomEvent('novastyle:update-element', {
      detail: { selector, styles, classes },
    }))
  } else {
    openPanel(selector, styles).catch(() => {})
  }
}

async function openPanel(selector: string, styles: Record<string, Record<string, string>>) {
  if (document.getElementById('novastyle-root')) return
  const container = document.createElement('div')
  container.id = 'novastyle-root'
  const shadow = container.attachShadow({ mode: 'open' })
  document.body.appendChild(container)

  const mountPoint = document.createElement('div')
  mountPoint.id = 'novastyle-panel-root'
  mountPoint.dataset.novastyleSelector = selector
  mountPoint.dataset.novastyleStyles = JSON.stringify(styles)
  shadow.appendChild(mountPoint)
  panelMountPoint = mountPoint

  const styleTag = document.createElement('style')
  styleTag.textContent = `:host { all: initial; display: block; position: relative; z-index: 2147483646; }`
  shadow.appendChild(styleTag)

  const cssLink = document.createElement('link')
  cssLink.rel = 'stylesheet'
  cssLink.href = chrome.runtime.getURL('assets/panel.css')
  shadow.appendChild(cssLink)

  const domain = window.location.hostname.replace(/^www\./, '')

  const settings = await getSettings()
  mountPoint.dataset.novastyleSettings = JSON.stringify(settings)

  const mainScript = document.createElement('script')
  mainScript.src = chrome.runtime.getURL('assets/panel.js')
  mainScript.onerror = () => {
    console.error('NovaStyle: Failed to load panel script')
    closePanel()
  }
  document.body.appendChild(mainScript)

  window.addEventListener('novastyle:close', () => closePanel(), { once: true })
  window.addEventListener('novastyle:update', ((e: CustomEvent) => {
    const { styles } = e.detail as { styles: Record<string, Record<string, string>> }
    updateStylesheet(styles)
    saveStyles(domain, styles)
  }) as EventListener)
  window.addEventListener('novastyle:update-classes', ((e: CustomEvent) => {
    const { classes } = e.detail as { classes: string[] }
    if (lastClicked) lastClicked.className = classes.join(' ')
  }) as EventListener)
}

function closePanel() {
  panelMountPoint = null
  if (!document.getElementById('novastyle-root')) return
  const container = document.getElementById('novastyle-root')
  if (container?.parentNode) {
    container.parentNode.removeChild(container)
  }
  clearStylesheet()
}

function activate() {
  if (active) return
  active = true
  highlighter = createHighlighter()
  document.addEventListener('mouseover', onMouseOver, { capture: true })
  document.addEventListener('mouseout', onMouseOut, { capture: true })
  document.addEventListener('click', onClick, { capture: true })
}

function deactivate() {
  if (!active) return
  active = false
  if (highlighter) destroyHighlighter(highlighter)
  highlighter = null
  document.removeEventListener('mouseover', onMouseOver, { capture: true })
  document.removeEventListener('mouseout', onMouseOut, { capture: true })
  document.removeEventListener('click', onClick, { capture: true })
  closePanel()
}

chrome.runtime.onMessage.addListener((message: unknown) => {
  const msg = message as ContentMessage
  if (msg.type === 'TOGGLE_EXTENSION') {
    if (msg.state === 'active') activate()
    else deactivate()
  }
})
