interface ColumnsEditorProps {
  selector: string
  styles: Record<string, string>
  onUpdate: (selector: string, property: string, value: string) => void
}

const RULE_STYLES = ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge']

export function ColumnsEditor({ selector, styles, onUpdate }: ColumnsEditorProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Column Count</label>
          <input
            type="number"
            min={1}
            aria-label="Column count"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['column-count'] ?? ''}
            onChange={(e) => onUpdate(selector, 'column-count', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Column Width</label>
          <input
            type="text"
            aria-label="Column width"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['column-width'] ?? ''}
            placeholder="e.g. 200px, auto"
            onChange={(e) => onUpdate(selector, 'column-width', e.target.value)}
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
            placeholder="e.g. 2rem"
            onChange={(e) => onUpdate(selector, 'column-gap', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Rule Width</label>
          <input
            type="text"
            aria-label="Column rule width"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['column-rule-width'] ?? ''}
            placeholder="e.g. 1px"
            onChange={(e) => onUpdate(selector, 'column-rule-width', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Rule Style</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Column rule style"
            value={styles['column-rule-style'] ?? ''}
            onChange={(e) => onUpdate(selector, 'column-rule-style', e.target.value)}
          >
            <option value="">—</option>
            {RULE_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Rule Color</label>
          <input
            type="text"
            aria-label="Column rule color"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded font-mono"
            value={styles['column-rule-color'] ?? ''}
            placeholder="#000"
            onChange={(e) => onUpdate(selector, 'column-rule-color', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
