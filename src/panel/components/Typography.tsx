interface TypographyProps {
  selector: string
  onUpdate: (selector: string, property: string, value: string) => void
}

const FONTS = [
  'system-ui, sans-serif',
  'serif',
  'monospace',
  'Arial, sans-serif',
  'Georgia, serif',
  'Courier New, monospace',
]

const ALIGNMENTS = [
  { label: 'L', value: 'left' },
  { label: 'C', value: 'center' },
  { label: 'R', value: 'right' },
  { label: 'J', value: 'justify' },
]

export function Typography({ selector, onUpdate }: TypographyProps) {
  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Typography</div>

      <div>
        <label className="text-xs text-slate-400 block mb-0.5">Font Family</label>
        <select
          className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
          onChange={(e) => onUpdate(selector, 'font-family', e.target.value)}
        >
          {FONTS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Size (px)</label>
          <input
            type="number"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            min={8} max={128}
            onChange={(e) => onUpdate(selector, 'font-size', `${e.target.value}px`)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Line Height</label>
          <input
            type="number"
            step="0.1"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            min={0.5} max={3}
            onChange={(e) => onUpdate(selector, 'line-height', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Letter Spacing (px)</label>
          <input
            type="number"
            step="0.5"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            onChange={(e) => onUpdate(selector, 'letter-spacing', `${e.target.value}px`)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Weight</label>
          <input
            type="range"
            min={100} max={900} step={100}
            className="w-full"
            onChange={(e) => onUpdate(selector, 'font-weight', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-400 block mb-0.5">Alignment</label>
        <div className="flex gap-1">
          {ALIGNMENTS.map((a) => (
            <button
              key={a.value}
              className="px-2 py-1 text-xs border border-slate-200 rounded hover:bg-slate-100"
              onClick={() => onUpdate(selector, 'text-align', a.value)}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
