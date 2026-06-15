import type { StyleMap } from '@/types'

export function computeSelector(el: Element): string {
  if (el.id) return `#${CSS.escape(el.id)}`

  const classes = Array.from(el.classList).filter(
    (c) => !/^[a-z]{2,}-\d+/.test(c),
  )
  if (classes.length > 0) {
    const unique = classes.find(
      (c) => document.querySelectorAll(`.${CSS.escape(c)}`).length === 1,
    )
    if (unique) return `.${CSS.escape(unique)}`
  }

  const dataAttrs = ['data-testid', 'data-cy', 'data-test']
  for (const attr of dataAttrs) {
    const val = el.getAttribute(attr)
    if (val) return `[${attr}="${val}"]`
  }

  return buildNthPath(el)
}

function buildNthPath(el: Element): string {
  const segments: string[] = []
  let current: Element | null = el
  while (current && current !== document.body && current.parentElement) {
    const tag = current.tagName.toLowerCase()
    const parent: HTMLElement = current.parentElement
    const siblings = (Array.from(parent.children) as Element[]).filter(
      (s) => s.tagName === current!.tagName,
    )
    if (siblings.length > 1) {
      const index = siblings.indexOf(current) + 1
      segments.unshift(`${tag}:nth-child(${index})`)
    } else {
      segments.unshift(tag)
    }
    current = parent
  }
  return segments.join(' > ')
}

export function extractStyles(el: Element): StyleMap {
  const computed = getComputedStyle(el)
  const props = [
    'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
    'font-size', 'line-height', 'letter-spacing', 'font-weight',
    'text-align', 'font-family',
    'color', 'background-color', 'background',
  ]
  const styles: Record<string, string> = {}
  for (const prop of props) {
    const val = computed.getPropertyValue(prop)
    if (val && val !== 'none' && val !== 'normal') {
      styles[prop] = val
    }
  }
  return { [`${computeSelector(el)}`]: styles }
}
