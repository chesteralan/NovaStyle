import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './panel/App'
import './panel/styles/panel.css'
import type { StyleMap, NovaStyleSettings } from '@/types'

const containerId = 'novastyle-root'
const mountPointId = 'novastyle-panel-root'

const container = document.getElementById(containerId)
const shadowRoot = container?.shadowRoot
let mountPoint = shadowRoot?.getElementById(mountPointId)

if (!mountPoint && container) {
  mountPoint = document.createElement('div')
  mountPoint.id = mountPointId
  container.appendChild(mountPoint)
}

function getSelector(): string {
  return mountPoint?.dataset?.novastyleSelector ?? ''
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

let settings: NovaStyleSettings | undefined
if (mountPoint?.dataset?.novastyleSettings) {
  try {
    settings = JSON.parse(mountPoint.dataset.novastyleSettings)
  } catch {
    //
  }
}

try {
  if (mountPoint) {
    createRoot(mountPoint).render(
      <StrictMode>
        <App selector={getSelector()} initialStyles={initialStyles} initialClasses={initialClasses} settings={settings} />
      </StrictMode>,
    )
  }
} catch (e) {
  console.error('NovaStyle panel render error:', e)
}
