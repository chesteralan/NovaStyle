interface SvgEditorProps {
  selector: string
  styles: Record<string, string>
  onUpdate: (selector: string, property: string, value: string) => void
}

export function SvgEditor({ selector, styles, onUpdate }: SvgEditorProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Fill</label>
          <div className="flex gap-1">
            <input
              type="color"
              aria-label="Fill color picker"
              className="w-8 h-8 p-0 border border-slate-200 rounded cursor-pointer shrink-0"
              value={/^#[0-9a-f]{6}$/i.test(styles['fill'] ?? '') ? styles['fill']! : '#000000'}
              onChange={(e) => onUpdate(selector, 'fill', e.target.value)}
            />
            <input
              type="text"
              aria-label="Fill color"
              className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded font-mono"
              value={styles['fill'] ?? ''}
              placeholder="#000000"
              onChange={(e) => onUpdate(selector, 'fill', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Stroke</label>
          <div className="flex gap-1">
            <input
              type="color"
              aria-label="Stroke color picker"
              className="w-8 h-8 p-0 border border-slate-200 rounded cursor-pointer shrink-0"
              value={/^#[0-9a-f]{6}$/i.test(styles['stroke'] ?? '') ? styles['stroke']! : '#000000'}
              onChange={(e) => onUpdate(selector, 'stroke', e.target.value)}
            />
            <input
              type="text"
              aria-label="Stroke color"
              className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded font-mono"
              value={styles['stroke'] ?? ''}
              placeholder="#000000"
              onChange={(e) => onUpdate(selector, 'stroke', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Stroke Width</label>
          <input
            type="number"
            min={0}
            step={0.5}
            aria-label="Stroke width"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['stroke-width'] ?? ''}
            onChange={(e) => onUpdate(selector, 'stroke-width', `${e.target.value}px`)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Stroke Dasharray</label>
          <input
            type="text"
            aria-label="Stroke dasharray"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['stroke-dasharray'] ?? ''}
            placeholder="e.g. 5, 10 5"
            onChange={(e) => onUpdate(selector, 'stroke-dasharray', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Opacity</label>
          <input
            type="number"
            min={0}
            max={1}
            step={0.1}
            aria-label="Stroke opacity"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['stroke-opacity'] ?? ''}
            onChange={(e) => onUpdate(selector, 'stroke-opacity', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Stroke Linecap</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Stroke linecap"
            value={styles['stroke-linecap'] ?? ''}
            onChange={(e) => onUpdate(selector, 'stroke-linecap', e.target.value)}
          >
            <option value="">—</option>
            <option value="butt">butt</option>
            <option value="round">round</option>
            <option value="square">square</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Stroke Linejoin</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Stroke linejoin"
            value={styles['stroke-linejoin'] ?? ''}
            onChange={(e) => onUpdate(selector, 'stroke-linejoin', e.target.value)}
          >
            <option value="">—</option>
            <option value="miter">miter</option>
            <option value="round">round</option>
            <option value="bevel">bevel</option>
          </select>
        </div>
      </div>
    </div>
  )
}
