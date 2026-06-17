interface BackgroundEditorProps {
  selector: string
  styles: Record<string, string>
  onUpdate: (selector: string, property: string, value: string) => void
}

const REPEAT_OPTIONS = ['repeat', 'no-repeat', 'repeat-x', 'repeat-y', 'space', 'round']
const SIZE_OPTIONS = ['cover', 'contain', 'auto', '100% 100%']
const ATTACHMENT_OPTIONS = ['scroll', 'fixed', 'local']
const CLIP_OPTIONS = ['border-box', 'padding-box', 'content-box', 'text']

export function BackgroundEditor({ selector, styles, onUpdate }: BackgroundEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-slate-400 block mb-0.5">Image URL</label>
        <input
          type="text"
          aria-label="Background image URL"
          className="w-full px-2 py-1 text-xs border border-slate-200 rounded font-mono"
          value={styles['background-image'] ?? ''}
          placeholder="e.g. url(...), linear-gradient(...)"
          onChange={(e) => onUpdate(selector, 'background-image', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Size</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Background size"
            value={styles['background-size'] ?? ''}
            onChange={(e) => onUpdate(selector, 'background-size', e.target.value)}
          >
            <option value="">—</option>
            {SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Repeat</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Background repeat"
            value={styles['background-repeat'] ?? ''}
            onChange={(e) => onUpdate(selector, 'background-repeat', e.target.value)}
          >
            <option value="">—</option>
            {REPEAT_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Position</label>
          <input
            type="text"
            aria-label="Background position"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['background-position'] ?? ''}
            placeholder="e.g. center, top left, 50% 50%"
            onChange={(e) => onUpdate(selector, 'background-position', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Attachment</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Background attachment"
            value={styles['background-attachment'] ?? ''}
            onChange={(e) => onUpdate(selector, 'background-attachment', e.target.value)}
          >
            <option value="">—</option>
            {ATTACHMENT_OPTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Clip</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Background clip"
            value={styles['background-clip'] ?? ''}
            onChange={(e) => onUpdate(selector, 'background-clip', e.target.value)}
          >
            <option value="">—</option>
            {CLIP_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Origin</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Background origin"
            value={styles['background-origin'] ?? ''}
            onChange={(e) => onUpdate(selector, 'background-origin', e.target.value)}
          >
            <option value="">—</option>
            {CLIP_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
