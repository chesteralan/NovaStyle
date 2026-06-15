const FONTS = [
  'system-ui, sans-serif',
  'serif',
  'monospace',
  'Arial, sans-serif',
  'Georgia, serif',
  'Courier New, monospace',
]

const ALIGNMENTS = [
  { label: 'L', value: 'left', aria: 'Align left' },
  { label: 'C', value: 'center', aria: 'Align center' },
  { label: 'R', value: 'right', aria: 'Align right' },
  { label: 'J', value: 'justify', aria: 'Justify' },
]

const FONT_SIZE_RANGE = { min: 8, max: 128 }
const LINE_HEIGHT_RANGE = { min: 0.5, max: 3 }
const FONT_WEIGHT_RANGE = { min: 100, max: 900, step: 100 }

interface TypographyProps {
  selector: string
  onUpdate: (selector: string, property: string, value: string) => void
}

export function Typography({ selector, onUpdate }: TypographyProps) {
  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Typography</div>

      <div>
        <label className="text-xs text-slate-400 block mb-0.5">Font Family</label>
        <select
          className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
          aria-label="Font family"
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
            aria-label="Font size"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            min={FONT_SIZE_RANGE.min}
            max={FONT_SIZE_RANGE.max}
            onChange={(e) => onUpdate(selector, 'font-size', `${e.target.value}px`)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Line Height</label>
          <input
            type="number"
            step="0.1"
            aria-label="Line height"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            min={LINE_HEIGHT_RANGE.min}
            max={LINE_HEIGHT_RANGE.max}
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
            aria-label="Letter spacing"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            onChange={(e) => onUpdate(selector, 'letter-spacing', `${e.target.value}px`)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Weight</label>
          <input
            type="range"
            aria-label="Font weight"
            min={FONT_WEIGHT_RANGE.min}
            max={FONT_WEIGHT_RANGE.max}
            step={FONT_WEIGHT_RANGE.step}
            className="w-full"
            onChange={(e) => onUpdate(selector, 'font-weight', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-400 block mb-0.5">Alignment</label>
        <div className="flex gap-1" role="radiogroup" aria-orientation="horizontal" aria-label="Text alignment">
          {ALIGNMENTS.map((a) => (
            <button
              key={a.value}
              className="px-2 py-1 text-xs border border-slate-200 rounded hover:bg-slate-100"
              aria-label={a.aria}
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
