import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './panel/App'
import './panel/styles/panel.css'

const config = (window as any).__NOVASTYLE_CONFIG__
const containerId = config?.containerId ?? 'novastyle-root'
const mountId = config?.mountPointId ?? 'novastyle-panel-root'

const container = document.getElementById(containerId)
const shadowRoot = container?.shadowRoot
let mountPoint = shadowRoot?.getElementById(mountId)

if (!mountPoint && container) {
  mountPoint = document.createElement('div')
  mountPoint.id = mountId
  container.appendChild(mountPoint)
}

if (mountPoint) {
  createRoot(mountPoint).render(
    <StrictMode>
      <App
        selector={config?.selector ?? ''}
        domain={config?.domain ?? ''}
      />
    </StrictMode>,
  )
}
