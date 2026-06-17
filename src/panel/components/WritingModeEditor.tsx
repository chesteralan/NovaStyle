interface WritingModeEditorProps {
  selector: string
  styles: Record<string, string>
  onUpdate: (selector: string, property: string, value: string) => void
}

const WRITING_MODES = ['horizontal-tb', 'vertical-rl', 'vertical-lr']
const DIRECTIONS = ['ltr', 'rtl']
const ORIENTATIONS = ['mixed', 'upright', 'sideways']

export function WritingModeEditor({ selector, styles, onUpdate }: WritingModeEditorProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Writing Mode</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Writing mode"
            value={styles['writing-mode'] ?? ''}
            onChange={(e) => onUpdate(selector, 'writing-mode', e.target.value)}
          >
            <option value="">—</option>
            {WRITING_MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Direction</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Direction"
            value={styles['direction'] ?? ''}
            onChange={(e) => onUpdate(selector, 'direction', e.target.value)}
          >
            <option value="">—</option>
            {DIRECTIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Text Orientation</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Text orientation"
            value={styles['text-orientation'] ?? ''}
            onChange={(e) => onUpdate(selector, 'text-orientation', e.target.value)}
          >
            <option value="">—</option>
            {ORIENTATIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Unicode Bidi</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Unicode bidi"
            value={styles['unicode-bidi'] ?? ''}
            onChange={(e) => onUpdate(selector, 'unicode-bidi', e.target.value)}
          >
            <option value="">—</option>
            <option value="normal">normal</option>
            <option value="embed">embed</option>
            <option value="bidi-override">bidi-override</option>
            <option value="isolate">isolate</option>
            <option value="isolate-override">isolate-override</option>
            <option value="plaintext">plaintext</option>
          </select>
        </div>
      </div>
    </div>
  )
}
