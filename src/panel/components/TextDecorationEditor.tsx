import { toHexColor } from '../utils/color'

interface TextDecorationEditorProps {
  selector: string
  styles: Record<string, string>
  onUpdate: (selector: string, property: string, value: string) => void
}

const DECORATION_LINES = ['none', 'underline', 'overline', 'line-through', 'underline overline']
const DECORATION_STYLES = ['solid', 'double', 'dotted', 'dashed', 'wavy']
const TEXT_TRANSFORMS = ['none', 'capitalize', 'uppercase', 'lowercase']
const WHITE_SPACE_OPTIONS = ['normal', 'nowrap', 'pre', 'pre-wrap', 'pre-line', 'break-spaces']
const WORD_BREAK_OPTIONS = ['normal', 'break-all', 'keep-all', 'break-word']

export function TextDecorationEditor({ selector, styles, onUpdate }: TextDecorationEditorProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Decoration</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Text decoration line"
            value={styles['text-decoration-line'] ?? ''}
            onChange={(e) => onUpdate(selector, 'text-decoration-line', e.target.value)}
          >
            <option value="">—</option>
            {DECORATION_LINES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Style</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Text decoration style"
            value={styles['text-decoration-style'] ?? ''}
            onChange={(e) => onUpdate(selector, 'text-decoration-style', e.target.value)}
          >
            <option value="">—</option>
            {DECORATION_STYLES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Decoration Color</label>
          <div className="flex gap-1">
            <input
              type="color"
              aria-label="Text decoration color picker"
              className="w-8 h-8 p-0 border border-slate-200 rounded cursor-pointer shrink-0"
              value={toHexColor(styles['text-decoration-color'])}
              onChange={(e) => onUpdate(selector, 'text-decoration-color', e.target.value)}
            />
            <input
              type="text"
              aria-label="Text decoration color hex"
              className="flex-1 px-2 py-0.5 text-xs border border-slate-200 rounded font-mono"
              value={styles['text-decoration-color'] ?? ''}
              placeholder="#000000"
              onChange={(e) => onUpdate(selector, 'text-decoration-color', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Transform</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Text transform"
            value={styles['text-transform'] ?? ''}
            onChange={(e) => onUpdate(selector, 'text-transform', e.target.value)}
          >
            <option value="">—</option>
            {TEXT_TRANSFORMS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-400 block mb-0.5">Text Shadow</label>
        <input
          type="text"
          aria-label="Text shadow"
          className="w-full px-2 py-1 text-xs border border-slate-200 rounded font-mono"
          value={styles['text-shadow'] ?? ''}
          placeholder="e.g. 1px 1px 2px rgba(0,0,0,0.5)"
          onChange={(e) => onUpdate(selector, 'text-shadow', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">White Space</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="White space"
            value={styles['white-space'] ?? ''}
            onChange={(e) => onUpdate(selector, 'white-space', e.target.value)}
          >
            <option value="">—</option>
            {WHITE_SPACE_OPTIONS.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Word Break</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Word break"
            value={styles['word-break'] ?? ''}
            onChange={(e) => onUpdate(selector, 'word-break', e.target.value)}
          >
            <option value="">—</option>
            {WORD_BREAK_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
