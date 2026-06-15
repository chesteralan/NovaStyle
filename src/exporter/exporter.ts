import type { StyleMap } from '@/types'

export function exportToCSS(styles: StyleMap, domain?: string): string {
  const lines: string[] = []
  lines.push(`/* NovaStyle Overrides${domain ? ` — ${domain}` : ''} */`)
  lines.push(`/* Generated: ${new Date().toISOString()} */`)
  lines.push('')
  for (const [selector, props] of Object.entries(styles)) {
    if (Object.keys(props).length === 0) continue
    lines.push(`${selector} {`)
    for (const [prop, val] of Object.entries(props)) {
      lines.push(`  ${prop}: ${val} !important;`)
    }
    lines.push('}')
    lines.push('')
  }
  return lines.join('\n')
}
