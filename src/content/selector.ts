import type { StyleMap } from '@/types'

const DATA_ATTRS = ['data-testid', 'data-cy', 'data-test'] as const

export function computeSelector(el: Element): string {
  const tag = el.tagName.toLowerCase()

  let local = tag

  if (el.id) {
    local += `#${CSS.escape(el.id)}`
  }

  const classes = Array.from(el.classList).filter(
    (c) => !/^[a-z]+-[a-z0-9]{8,}$/i.test(c) && !/^css-[a-z0-9]{5,}$/i.test(c),
  )
  for (const cls of classes) {
    local += `.${CSS.escape(cls)}`
  }

  if (local !== tag && document.querySelectorAll(local).length === 1) {
    return local
  }

  for (const attr of DATA_ATTRS) {
    const val = el.getAttribute(attr)
    if (val) {
      const withAttr = `${local}[${attr}="${CSS.escape(val)}"]`
      if (document.querySelectorAll(withAttr).length === 1) {
        return withAttr
      }
    }
  }

  return buildNthPath(el, local)
}

function buildNthPath(el: Element, local: string): string {
  const segments: string[] = []
  let current: Element | null = el
  while (current && current !== document.body && current.parentElement) {
    const tag = current.tagName.toLowerCase()
    const currentTag = current.tagName
    const parent: HTMLElement = current.parentElement
    const siblings = (Array.from(parent.children) as Element[]).filter((s) => s.tagName === currentTag)
    let segment: string
    if (siblings.length > 1) {
      const index = siblings.indexOf(current) + 1
      segment = `${tag}:nth-child(${index})`
    } else {
      segment = tag
    }
    segments.unshift(segment)
    current = parent
  }
  if (segments.length > 0) {
    const leaf = segments[segments.length - 1]
    const nthMatch = leaf.match(/:nth-child\(\d+\)/)
    segments[segments.length - 1] = nthMatch ? `${local}${nthMatch[0]}` : local
  }
  return segments.join(' > ')
}

const EXTRACT_PROPS = [
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
  'font-size',
  'line-height',
  'letter-spacing',
  'font-weight',
  'text-align',
  'font-family',
  'color',
  'background-color',
  'background',
] as const

export function extractStyles(el: Element): StyleMap {
  const computed = getComputedStyle(el)
  const styles: Record<string, string> = {}
  for (const prop of EXTRACT_PROPS) {
    const val = computed.getPropertyValue(prop)
    if (val && val !== 'none' && val !== 'normal') {
      styles[prop] = val
    }
  }
  const inlineStyle = el.getAttribute('style')
  if (inlineStyle) {
    for (const decl of inlineStyle.split(';')) {
      const trimmed = decl.trim()
      if (!trimmed) continue
      const colon = trimmed.indexOf(':')
      if (colon === -1) continue
      const prop = trimmed.slice(0, colon).trim()
      const val = trimmed.slice(colon + 1).trim()
      if (prop && val) styles[prop] = val
    }
  }
  return { [`${computeSelector(el)}`]: styles }
}
