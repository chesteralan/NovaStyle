import { useEffect, useState } from 'react'

interface ColorInfo {
  hex: string
  count: number
}

const MAX_ELEMENTS = 2000

export function ColorPalette() {
  const [colors, setColors] = useState<ColorInfo[]>([])

  useEffect(() => {
    const all = document.body.querySelectorAll('*')
    const limit = Math.min(all.length, MAX_ELEMENTS)
    const map = new Map<string, number>()
    for (let i = 0; i < limit; i++) {
      const e = all[i]
      const style = getComputedStyle(e)
      const props = ['color', 'background-color', 'border-color', 'background']
      for (const prop of props) {
        const val = style.getPropertyValue(prop)
        if (val && val.startsWith('rgb')) {
          const rgb = val.match(/\d+/g)
          if (rgb && rgb.length >= 3) {
            const hex = `#${[+rgb[0], +rgb[1], +rgb[2]].map((c) => c.toString(16).padStart(2, '0')).join('')}`
            map.set(hex, (map.get(hex) ?? 0) + 1)
          }
        }
      }
    }
    const sorted = [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([hex, count]) => ({ hex, count }))
    setColors(sorted)
  }, [])

  return (
    <div>
      {colors.length === 0 ? (
        <div className="text-xs text-slate-400">No colors detected.</div>
      ) : (
        <div className="grid grid-cols-5 gap-2">
          {colors.map((c) => (
            <div key={c.hex} className="flex flex-col items-center gap-1">
              <div
                className="w-6 h-6 rounded border border-slate-200"
                style={{ backgroundColor: c.hex }}
                title={c.hex}
              />
              <span className="text-[10px] text-slate-500 font-mono">{c.hex}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}