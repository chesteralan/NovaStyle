interface ScrollSnapEditorProps {
  selector: string
  styles: Record<string, string>
  onUpdate: (selector: string, property: string, value: string) => void
}

const TYPE_OPTIONS = ['none', 'x', 'y', 'block', 'inline', 'both']
const ALIGN_OPTIONS = ['none', 'start', 'end', 'center']

export function ScrollSnapEditor({ selector, styles, onUpdate }: ScrollSnapEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-slate-400 block mb-0.5">Scroll Snap Type</label>
        <select
          className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
          aria-label="Scroll snap type axis"
          value={styles['scroll-snap-type'] ?? ''}
          onChange={(e) => onUpdate(selector, 'scroll-snap-type', e.target.value)}
        >
          <option value="">—</option>
          {TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Snap Align</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Scroll snap align"
            value={styles['scroll-snap-align'] ?? ''}
            onChange={(e) => onUpdate(selector, 'scroll-snap-align', e.target.value)}
          >
            <option value="">—</option>
            {ALIGN_OPTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Snap Stop</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Scroll snap stop"
            value={styles['scroll-snap-stop'] ?? ''}
            onChange={(e) => onUpdate(selector, 'scroll-snap-stop', e.target.value)}
          >
            <option value="">—</option>
            <option value="normal">normal</option>
            <option value="always">always</option>
          </select>
        </div>
      </div>

      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-2 mb-1">Scroll Margin</div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Top</label>
          <input
            type="text"
            aria-label="Scroll margin top"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['scroll-margin-top'] ?? ''}
            onChange={(e) => onUpdate(selector, 'scroll-margin-top', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Bottom</label>
          <input
            type="text"
            aria-label="Scroll margin bottom"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['scroll-margin-bottom'] ?? ''}
            onChange={(e) => onUpdate(selector, 'scroll-margin-bottom', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Left</label>
          <input
            type="text"
            aria-label="Scroll margin left"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['scroll-margin-left'] ?? ''}
            onChange={(e) => onUpdate(selector, 'scroll-margin-left', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Right</label>
          <input
            type="text"
            aria-label="Scroll margin right"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['scroll-margin-right'] ?? ''}
            onChange={(e) => onUpdate(selector, 'scroll-margin-right', e.target.value)}
          />
        </div>
      </div>

      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-2 mb-1">Scroll Padding</div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Top</label>
          <input
            type="text"
            aria-label="Scroll padding top"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['scroll-padding-top'] ?? ''}
            onChange={(e) => onUpdate(selector, 'scroll-padding-top', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Bottom</label>
          <input
            type="text"
            aria-label="Scroll padding bottom"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['scroll-padding-bottom'] ?? ''}
            onChange={(e) => onUpdate(selector, 'scroll-padding-bottom', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Left</label>
          <input
            type="text"
            aria-label="Scroll padding left"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['scroll-padding-left'] ?? ''}
            onChange={(e) => onUpdate(selector, 'scroll-padding-left', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Right</label>
          <input
            type="text"
            aria-label="Scroll padding right"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['scroll-padding-right'] ?? ''}
            onChange={(e) => onUpdate(selector, 'scroll-padding-right', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
