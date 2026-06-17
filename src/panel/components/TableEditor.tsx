interface TableEditorProps {
  selector: string
  styles: Record<string, string>
  onUpdate: (selector: string, property: string, value: string) => void
}

const LAYOUT_OPTIONS = ['auto', 'fixed']
const COLLAPSE_OPTIONS = ['collapse', 'separate']

export function TableEditor({ selector, styles, onUpdate }: TableEditorProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Layout</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Table layout"
            value={styles['table-layout'] ?? ''}
            onChange={(e) => onUpdate(selector, 'table-layout', e.target.value)}
          >
            <option value="">—</option>
            {LAYOUT_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Border Collapse</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Border collapse"
            value={styles['border-collapse'] ?? ''}
            onChange={(e) => onUpdate(selector, 'border-collapse', e.target.value)}
          >
            <option value="">—</option>
            {COLLAPSE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Border Spacing</label>
          <input
            type="text"
            aria-label="Border spacing"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['border-spacing'] ?? ''}
            placeholder="e.g. 2px, 2px 4px"
            onChange={(e) => onUpdate(selector, 'border-spacing', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Caption Side</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Caption side"
            value={styles['caption-side'] ?? ''}
            onChange={(e) => onUpdate(selector, 'caption-side', e.target.value)}
          >
            <option value="">—</option>
            <option value="top">top</option>
            <option value="bottom">bottom</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Empty Cells</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Empty cells"
            value={styles['empty-cells'] ?? ''}
            onChange={(e) => onUpdate(selector, 'empty-cells', e.target.value)}
          >
            <option value="">—</option>
            <option value="show">show</option>
            <option value="hide">hide</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Vertical Align</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Vertical align"
            value={styles['vertical-align'] ?? ''}
            onChange={(e) => onUpdate(selector, 'vertical-align', e.target.value)}
          >
            <option value="">—</option>
            <option value="baseline">baseline</option>
            <option value="top">top</option>
            <option value="middle">middle</option>
            <option value="bottom">bottom</option>
            <option value="sub">sub</option>
            <option value="super">super</option>
            <option value="text-top">text-top</option>
            <option value="text-bottom">text-bottom</option>
          </select>
        </div>
      </div>
    </div>
  )
}
