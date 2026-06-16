import { useState } from 'react'

const PRESETS = [
  { label: 'Desktop', width: 1440, height: 900 },
  { label: 'Laptop', width: 1280, height: 800 },
  { label: 'Tablet', width: 768, height: 1024 },
  { label: 'Mobile', width: 375, height: 812 },
]

export function ResponsivePreview() {
  const [active, setActive] = useState(false)
  const [vp, setVp] = useState(PRESETS[0])
  const [customWidth, setCustomWidth] = useState(PRESETS[0].width.toString())

  const apply = (w: number) => {
    let meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'viewport'
      document.head.appendChild(meta)
    }
    meta.content = `width=${w}, initial-scale=1`
    setActive(true)
    setCustomWidth(w.toString())
  }

  const reset = () => {
    const meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null
    if (meta) meta.content = 'width=device-width, initial-scale=1'
    setActive(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className={`text-xs px-2 py-1 rounded border ${active && vp.label === p.label ? 'bg-blue-100 border-blue-400 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            onClick={() => { setVp(p); apply(p.width) }}
            aria-label={`Set viewport to ${p.label}`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          className="w-20 px-2 py-1 text-xs border border-slate-300 rounded"
          value={customWidth}
          onChange={(e) => setCustomWidth(e.target.value)}
          aria-label="Custom viewport width"
        />
        <button
          className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={() => apply(Number(customWidth))}
          disabled={!customWidth || isNaN(Number(customWidth))}
          aria-label="Apply custom width"
        >
          Apply
        </button>
        {active && (
          <button
            className="text-xs px-2 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50"
            onClick={reset}
            aria-label="Reset viewport"
          >
            Reset
          </button>
        )}
      </div>
      {active && <div className="text-xs text-green-600">Viewport: {vp.label} ({vp.width}px)</div>}
    </div>
  )
}