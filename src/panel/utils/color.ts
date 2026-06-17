const colorCtx = document.createElement('canvas').getContext('2d')!

export function toHexColor(color: string): string {
  if (!color) return '#000000'
  colorCtx.fillStyle = color
  const normalized = colorCtx.fillStyle
  if (normalized.startsWith('#')) return normalized
  const m = normalized.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!m) return '#000000'
  const r = Math.min(255, Math.max(0, Number(m[1])))
  const g = Math.min(255, Math.max(0, Number(m[2])))
  const b = Math.min(255, Math.max(0, Number(m[3])))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
