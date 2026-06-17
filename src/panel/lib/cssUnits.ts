export function pxValue(value: string): string {
  if (!value) return ''
  if (/^[0-9.-]+$/.test(value.trim())) return `${value.trim()}px`
  return value.trim()
}
