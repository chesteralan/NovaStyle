interface GridEditorProps {
  selector: string
  styles: Record<string, string>
  onUpdate: (selector: string, property: string, value: string) => void
}

const AUTO_FLOW_OPTIONS = ['row', 'column', 'dense', 'row dense', 'column dense']
const ALIGN_OPTIONS = ['flex-start', 'flex-end', 'center', 'stretch', 'space-around', 'space-between', 'space-evenly']

export function GridEditor({ selector, styles, onUpdate }: GridEditorProps) {
  const gridEnabled = styles['display'] === 'grid' || styles['display'] === 'inline-grid'

  return (
    <div className="space-y-3">
      {!gridEnabled && (
        <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-1">
          Set <code className="font-mono">display: grid</code> in Layout to enable grid controls.
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Columns</label>
          <input
            type="text"
            aria-label="Grid template columns"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['grid-template-columns'] ?? ''}
            placeholder="e.g. 1fr 1fr, repeat(3, 1fr)"
            onChange={(e) => onUpdate(selector, 'grid-template-columns', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Rows</label>
          <input
            type="text"
            aria-label="Grid template rows"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['grid-template-rows'] ?? ''}
            placeholder="e.g. auto 1fr"
            onChange={(e) => onUpdate(selector, 'grid-template-rows', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Column Gap</label>
          <input
            type="text"
            aria-label="Column gap"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['column-gap'] ?? ''}
            placeholder="e.g. 16px"
            onChange={(e) => onUpdate(selector, 'column-gap', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Row Gap</label>
          <input
            type="text"
            aria-label="Row gap"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['row-gap'] ?? ''}
            placeholder="e.g. 16px"
            onChange={(e) => onUpdate(selector, 'row-gap', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Auto Flow</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Grid auto flow"
            value={styles['grid-auto-flow'] ?? ''}
            onChange={(e) => onUpdate(selector, 'grid-auto-flow', e.target.value)}
          >
            <option value="">—</option>
            {AUTO_FLOW_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Auto Rows</label>
          <input
            type="text"
            aria-label="Grid auto rows"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['grid-auto-rows'] ?? ''}
            placeholder="e.g. minmax(100px, auto)"
            onChange={(e) => onUpdate(selector, 'grid-auto-rows', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Justify Items</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Justify items"
            value={styles['justify-items'] ?? ''}
            onChange={(e) => onUpdate(selector, 'justify-items', e.target.value)}
          >
            <option value="">—</option>
            {ALIGN_OPTIONS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
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
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Place Items</label>
          <input
            type="text"
            aria-label="Place items"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['place-items'] ?? ''}
            placeholder="e.g. center stretch"
            onChange={(e) => onUpdate(selector, 'place-items', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Auto Cols</label>
          <input
            type="text"
            aria-label="Grid auto columns"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['grid-auto-columns'] ?? ''}
            placeholder="e.g. minmax(100px, 1fr)"
            onChange={(e) => onUpdate(selector, 'grid-auto-columns', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
