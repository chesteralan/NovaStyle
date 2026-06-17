interface AnimationEditorProps {
  selector: string
  styles: Record<string, string>
  onUpdate: (selector: string, property: string, value: string) => void
}

const TIMING_OPTIONS = ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear', 'step-start', 'step-end']
const FILL_OPTIONS = ['none', 'forwards', 'backwards', 'both']
const DIRECTION_OPTIONS = ['normal', 'reverse', 'alternate', 'alternate-reverse']

export function AnimationEditor({ selector, styles, onUpdate }: AnimationEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Transition</div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-slate-400 block mb-0.5">Property</label>
            <input
              type="text"
              aria-label="Transition property"
              className="w-full px-2 py-1 text-xs border border-slate-200 rounded font-mono"
              value={styles['transition-property'] ?? ''}
              placeholder="all, opacity, transform"
              onChange={(e) => onUpdate(selector, 'transition-property', e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-0.5">Duration</label>
            <input
              type="text"
              aria-label="Transition duration"
              className="w-full px-2 py-1 text-xs border border-slate-200 rounded font-mono"
              value={styles['transition-duration'] ?? ''}
              placeholder="e.g. 0.3s, 300ms"
              onChange={(e) => onUpdate(selector, 'transition-duration', e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <label className="text-xs text-slate-400 block mb-0.5">Timing</label>
            <select
              className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
              aria-label="Transition timing"
              value={styles['transition-timing-function'] ?? ''}
              onChange={(e) => onUpdate(selector, 'transition-timing-function', e.target.value)}
            >
              <option value="">—</option>
              {TIMING_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-0.5">Delay</label>
            <input
              type="text"
              aria-label="Transition delay"
              className="w-full px-2 py-1 text-xs border border-slate-200 rounded font-mono"
              value={styles['transition-delay'] ?? ''}
              placeholder="e.g. 0.1s"
              onChange={(e) => onUpdate(selector, 'transition-delay', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-3">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Animation</div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Name</label>
          <input
            type="text"
            aria-label="Animation name"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded font-mono"
            value={styles['animation-name'] ?? ''}
            placeholder="e.g. fadeIn, slideOut"
            onChange={(e) => onUpdate(selector, 'animation-name', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <label className="text-xs text-slate-400 block mb-0.5">Duration</label>
            <input
              type="text"
              aria-label="Animation duration"
              className="w-full px-2 py-1 text-xs border border-slate-200 rounded font-mono"
              value={styles['animation-duration'] ?? ''}
              placeholder="e.g. 1s"
              onChange={(e) => onUpdate(selector, 'animation-duration', e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-0.5">Iterations</label>
            <input
              type="text"
              aria-label="Animation iteration count"
              className="w-full px-2 py-1 text-xs border border-slate-200 rounded font-mono"
              value={styles['animation-iteration-count'] ?? ''}
              placeholder="1, infinite"
              onChange={(e) => onUpdate(selector, 'animation-iteration-count', e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <label className="text-xs text-slate-400 block mb-0.5">Direction</label>
            <select
              className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
              aria-label="Animation direction"
              value={styles['animation-direction'] ?? ''}
              onChange={(e) => onUpdate(selector, 'animation-direction', e.target.value)}
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
            <label className="text-xs text-slate-400 block mb-0.5">Fill Mode</label>
            <select
              className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
              aria-label="Animation fill mode"
              value={styles['animation-fill-mode'] ?? ''}
              onChange={(e) => onUpdate(selector, 'animation-fill-mode', e.target.value)}
            >
              <option value="">—</option>
              {FILL_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <label className="text-xs text-slate-400 block mb-0.5">Timing</label>
            <select
              className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
              aria-label="Animation timing"
              value={styles['animation-timing-function'] ?? ''}
              onChange={(e) => onUpdate(selector, 'animation-timing-function', e.target.value)}
            >
              <option value="">—</option>
              {TIMING_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-0.5">Delay</label>
            <input
              type="text"
              aria-label="Animation delay"
              className="w-full px-2 py-1 text-xs border border-slate-200 rounded font-mono"
              value={styles['animation-delay'] ?? ''}
              placeholder="e.g. 0s"
              onChange={(e) => onUpdate(selector, 'animation-delay', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
