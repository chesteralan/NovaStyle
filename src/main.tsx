import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './panel/App'
import './panel/styles/panel.css'

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

if (mountPoint) {
  createRoot(mountPoint).render(
    <StrictMode>
      <App selector={getSelector()} />
    </StrictMode>,
  )
}
