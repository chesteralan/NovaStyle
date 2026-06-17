import { useEffect, useState } from 'react'

interface FontInfo {
  family: string
  count: number
  sizes: string[]
}

const MAX_ELEMENTS = 2000

export function FontDetector() {
  const [fonts, setFonts] = useState<FontInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const all = document.body.querySelectorAll('*')
    const limit = Math.min(all.length, MAX_ELEMENTS)
    const map = new Map<string, { count: number; sizes: Set<string> }>()
    for (let i = 0; i < limit; i++) {
      const el = all[i]
      const fam = getComputedStyle(el).fontFamily
      const size = getComputedStyle(el).fontSize
      const key = fam.split(',')[0].replace(/['"]/g, '').trim()
      if (!key || key === 'inherit') continue
      const entry = map.get(key) ?? { count: 0, sizes: new Set<string>() }
      entry.count++
      entry.sizes.add(size)
      map.set(key, entry)
    }
    const sorted = [...map.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .map(([family, info]) => ({
        family,
        count: info.count,
        sizes: [...info.sizes].sort().slice(0, 5),
      }))
    setFonts(sorted)
    setLoading(false)
  }, [])

  return (
    <div className="space-y-1.5">
      {loading ? (
        <div className="text-xs text-slate-400">Scanning...</div>
      ) : fonts.length === 0 ? (
        <div className="text-xs text-slate-400">No fonts detected.</div>
      ) : (
        fonts.slice(0, 15).map((f) => (
          <div key={f.family} className="flex items-center justify-between">
            <span className="text-xs text-slate-700 truncate" style={{ fontFamily: f.family }}>
              {f.family}
            </span>
            <span className="text-xs text-slate-400 shrink-0 ml-2">
              {f.count} el{f.sizes.length > 0 ? ` · ${f.sizes[0]}` : ''}
            </span>
          </div>
        ))
      )}
    </div>
  )
}
