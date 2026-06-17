interface LayoutEditorProps {
  selector: string
  styles: Record<string, string>
  onUpdate: (selector: string, property: string, value: string) => void
}

const DISPLAY_OPTIONS = ['block', 'inline', 'inline-block', 'flex', 'grid', 'inline-flex', 'inline-grid', 'none']
const POSITION_OPTIONS = ['static', 'relative', 'absolute', 'fixed', 'sticky']
const OVERFLOW_OPTIONS = ['visible', 'hidden', 'scroll', 'auto']

export function LayoutEditor({ selector, styles, onUpdate }: LayoutEditorProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Display</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Display"
            value={styles['display'] ?? ''}
            onChange={(e) => onUpdate(selector, 'display', e.target.value)}
          >
            <option value="">—</option>
            {DISPLAY_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Position</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Position"
            value={styles['position'] ?? ''}
            onChange={(e) => onUpdate(selector, 'position', e.target.value)}
          >
            <option value="">—</option>
            {POSITION_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Width</label>
          <input
            type="text"
            aria-label="Width"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['width'] ?? ''}
            placeholder="e.g. 100%, 500px"
            onChange={(e) => onUpdate(selector, 'width', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Height</label>
          <input
            type="text"
            aria-label="Height"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['height'] ?? ''}
            placeholder="e.g. auto, 300px"
            onChange={(e) => onUpdate(selector, 'height', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Min-W</label>
          <input
            type="text"
            aria-label="Min width"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['min-width'] ?? ''}
            onChange={(e) => onUpdate(selector, 'min-width', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Max-W</label>
          <input
            type="text"
            aria-label="Max width"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['max-width'] ?? ''}
            onChange={(e) => onUpdate(selector, 'max-width', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Max-H</label>
          <input
            type="text"
            aria-label="Max height"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['max-height'] ?? ''}
            onChange={(e) => onUpdate(selector, 'max-height', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Overflow</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Overflow"
            value={styles['overflow'] ?? ''}
            onChange={(e) => onUpdate(selector, 'overflow', e.target.value)}
          >
            <option value="">—</option>
            {OVERFLOW_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Z-Index</label>
          <input
            type="number"
            aria-label="Z-index"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['z-index'] ?? ''}
            onChange={(e) => onUpdate(selector, 'z-index', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Box-Sizing</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Box sizing"
            value={styles['box-sizing'] ?? ''}
            onChange={(e) => onUpdate(selector, 'box-sizing', e.target.value)}
          >
            <option value="">—</option>
            <option value="border-box">border-box</option>
            <option value="content-box">content-box</option>
          </select>
        </div>
      </div>
    </div>
  )
}
