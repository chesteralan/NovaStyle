import type { StyleMap } from '@/types'

let styleEl: HTMLStyleElement | null = null
let timeoutId: ReturnType<typeof setTimeout> | null = null

export function updateStylesheet(styles: StyleMap) {
  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = 'novastyle-live-sheet'
      document.head.appendChild(styleEl)
    }
    const lines: string[] = []
    for (const [selector, props] of Object.entries(styles)) {
      if (Object.keys(props).length === 0) continue
      lines.push(`${selector} {`)
      for (const [prop, val] of Object.entries(props)) {
        lines.push(`  ${prop}: ${val} !important;`)
      }
      lines.push('}')
    }
    styleEl.textContent = lines.join('\n')
    timeoutId = null
  }, 50)
}

export function clearStylesheet() {
  if (styleEl && styleEl.parentNode) {
    styleEl.parentNode.removeChild(styleEl)
    styleEl = null
  }
}
