const BORDER_STYLES = ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset', 'none']

interface BorderEditorProps {
  selector: string
  onUpdate: (selector: string, property: string, value: string) => void
}

export function BorderEditor({ selector, onUpdate }: BorderEditorProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Width (px)</label>
          <input
            type="number"
            min={0}
            aria-label="Border width"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            onChange={(e) => onUpdate(selector, 'border-width', `${e.target.value}px`)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Style</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Border style"
            onChange={(e) => onUpdate(selector, 'border-style', e.target.value)}
          >
            {BORDER_STYLES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-400 block mb-0.5">Color</label>
        <input
          type="text"
          placeholder="#000000"
          aria-label="Border color"
          className="w-full px-2 py-1 text-xs border border-slate-200 rounded font-mono"
          onChange={(e) => onUpdate(selector, 'border-color', e.target.value)}
        />
      </div>

      <div>
        <label className="text-xs text-slate-400 block mb-0.5">Border Radius (px)</label>
        <input
          type="number"
          min={0}
          aria-label="Border radius"
          className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
          onChange={(e) => onUpdate(selector, 'border-radius', `${e.target.value}px`)}
        />
      </div>
    </div>
  )
}