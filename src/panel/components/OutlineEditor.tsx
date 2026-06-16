interface OutlineEditorProps {
  selector: string
  styles: Record<string, string>
  onUpdate: (selector: string, property: string, value: string) => void
}

const STYLE_OPTIONS = ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset']

export function OutlineEditor({ selector, styles, onUpdate }: OutlineEditorProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Width</label>
          <input
            type="number"
            min={0}
            aria-label="Outline width"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['outline-width'] ?? ''}
            onChange={(e) => onUpdate(selector, 'outline-width', `${e.target.value}px`)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Offset</label>
          <input
            type="number"
            min={0}
            aria-label="Outline offset"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['outline-offset'] ?? ''}
            onChange={(e) => onUpdate(selector, 'outline-offset', `${e.target.value}px`)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Style</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Outline style"
            value={styles['outline-style'] ?? ''}
            onChange={(e) => onUpdate(selector, 'outline-style', e.target.value)}
          >
            <option value="">—</option>
            {STYLE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-400 block mb-0.5">Color</label>
        <div className="flex gap-1">
          <input
            type="color"
            aria-label="Outline color picker"
            className="w-8 h-8 p-0 border border-slate-200 rounded cursor-pointer shrink-0"
            value={styles['outline-color'] ? (/^#[0-9a-f]{6}$/i.test(styles['outline-color']) ? styles['outline-color'] : '#000000') : '#000000'}
            onChange={(e) => onUpdate(selector, 'outline-color', e.target.value)}
          />
          <input
            type="text"
            aria-label="Outline color hex"
            className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded font-mono"
            value={styles['outline-color'] ?? ''}
            placeholder="#000000"
            onChange={(e) => onUpdate(selector, 'outline-color', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
