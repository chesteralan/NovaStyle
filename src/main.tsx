import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './panel/App'
import './panel/styles/panel.css'
import type { StyleMap } from '@/types'

const containerId = 'novastyle-root'
const mountPointId = 'novastyle-panel-root'

function getSelector(): string {
  const src = document.currentScript?.getAttribute('src')
  if (src) {
    try {
      const url = new URL(src, window.location.origin)
      return url.searchParams.get('selector') ?? ''
    } catch {
      // fall through
    }
  }
  return window.__NOVASTYLE_CONFIG__?.selector ?? ''
}

const container = document.getElementById(containerId)
const shadowRoot = container?.shadowRoot
let mountPoint = shadowRoot?.getElementById(mountPointId)

if (!mountPoint && container) {
  mountPoint = document.createElement('div')
  mountPoint.id = mountPointId
  container.appendChild(mountPoint)
}

let initialStyles: StyleMap = {}
if (mountPoint?.dataset?.novastyleStyles) {
  try {
    initialStyles = JSON.parse(mountPoint.dataset.novastyleStyles)
  } catch {
    //
  }
}

let initialClasses: string[] = []
if (mountPoint?.dataset?.novastyleClasses) {
  try {
    initialClasses = JSON.parse(mountPoint.dataset.novastyleClasses)
  } catch {
    //
  }
}

if (mountPoint) {
  createRoot(mountPoint).render(
    <StrictMode>
      <App selector={getSelector()} initialStyles={initialStyles} initialClasses={initialClasses} />
    </StrictMode>,
  )
}
