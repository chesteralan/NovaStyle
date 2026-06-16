interface ListEditorProps {
  selector: string
  styles: Record<string, string>
  onUpdate: (selector: string, property: string, value: string) => void
}

const TYPES = ['none', 'disc', 'circle', 'square', 'decimal', 'decimal-leading-zero', 'lower-roman', 'upper-roman', 'lower-alpha', 'upper-alpha', 'lower-greek', 'lower-latin', 'upper-latin', 'armenian', 'georgian']
const POSITIONS = ['outside', 'inside']

export function ListEditor({ selector, styles, onUpdate }: ListEditorProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">List Style Type</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="List style type"
            value={styles['list-style-type'] ?? ''}
            onChange={(e) => onUpdate(selector, 'list-style-type', e.target.value)}
          >
            <option value="">—</option>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Position</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="List style position"
            value={styles['list-style-position'] ?? ''}
            onChange={(e) => onUpdate(selector, 'list-style-position', e.target.value)}
          >
            <option value="">—</option>
            {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs text-slate-400 block mb-0.5">List Style Image</label>
        <input
          type="text"
          aria-label="List style image"
          className="w-full px-2 py-1 text-xs border border-slate-200 rounded font-mono"
          value={styles['list-style-image'] ?? ''}
          placeholder="e.g. url('marker.png')"
          onChange={(e) => onUpdate(selector, 'list-style-image', e.target.value)}
        />
      </div>
    </div>
  )
}
