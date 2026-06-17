interface FlexboxEditorProps {
  selector: string
  styles: Record<string, string>
  onUpdate: (selector: string, property: string, value: string) => void
}

const DIRECTION_OPTIONS = ['row', 'row-reverse', 'column', 'column-reverse']
const WRAP_OPTIONS = ['nowrap', 'wrap', 'wrap-reverse']
const ALIGN_OPTIONS = [
  'flex-start',
  'flex-end',
  'center',
  'space-between',
  'space-around',
  'space-evenly',
  'stretch',
  'baseline',
]

export function FlexboxEditor({ selector, styles, onUpdate }: FlexboxEditorProps) {
  const flexEnabled = styles['display'] === 'flex' || styles['display'] === 'inline-flex'

  return (
    <div className="space-y-3">
      {!flexEnabled && (
        <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-1">
          Set <code className="font-mono">display: flex</code> in Layout to enable flexbox controls.
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Direction</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Flex direction"
            value={styles['flex-direction'] ?? ''}
            onChange={(e) => onUpdate(selector, 'flex-direction', e.target.value)}
          >
            <option value="">—</option>
            {DIRECTION_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Wrap</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Flex wrap"
            value={styles['flex-wrap'] ?? ''}
            onChange={(e) => onUpdate(selector, 'flex-wrap', e.target.value)}
          >
            <option value="">—</option>
            {WRAP_OPTIONS.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-400 block mb-0.5">Justify Content</label>
        <select
          className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
          aria-label="Justify content"
          value={styles['justify-content'] ?? ''}
          onChange={(e) => onUpdate(selector, 'justify-content', e.target.value)}
        >
          <option value="">—</option>
          {ALIGN_OPTIONS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Align Items</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Align items"
            value={styles['align-items'] ?? ''}
            onChange={(e) => onUpdate(selector, 'align-items', e.target.value)}
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
          <label className="text-xs text-slate-400 block mb-0.5">Align Content</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Align content"
            value={styles['align-content'] ?? ''}
            onChange={(e) => onUpdate(selector, 'align-content', e.target.value)}
          >
            <option value="">—</option>
            {ALIGN_OPTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Gap</label>
          <input
            type="text"
            aria-label="Gap"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['gap'] ?? ''}
            placeholder="e.g. 16px, 1rem"
            onChange={(e) => onUpdate(selector, 'gap', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Grow</label>
          <input
            type="number"
            min={0}
            step={0.1}
            aria-label="Flex grow"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['flex-grow'] ?? ''}
            onChange={(e) => onUpdate(selector, 'flex-grow', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Shrink</label>
          <input
            type="number"
            min={0}
            step={0.1}
            aria-label="Flex shrink"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['flex-shrink'] ?? ''}
            onChange={(e) => onUpdate(selector, 'flex-shrink', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
