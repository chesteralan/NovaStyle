interface TransformEditorProps {
  selector: string
  styles: Record<string, string>
  onUpdate: (selector: string, property: string, value: string) => void
}

function parseTransformValue(prop: string, styles: Record<string, string>): string {
  const transform = styles['transform']
  if (!transform) return ''
  const match = transform.match(new RegExp(`${prop}\\(([^)]+)\\)`))
  return match ? match[1].trim() : ''
}

function setTransformValue(prop: string, value: string, styles: Record<string, string>): string {
  const current = styles['transform'] ?? ''
  const existing = new RegExp(`${prop}\\([^)]*\\)`)
  const entry = value ? `${prop}(${value})` : ''
  if (existing.test(current)) {
    return entry ? current.replace(existing, entry) : current.replace(existing, '').trim()
  }
  return [current, entry].filter(Boolean).join(' ')
}

export function TransformEditor({ selector, styles, onUpdate }: TransformEditorProps) {
  const updateTransform = (prop: string, value: string) => {
    onUpdate(selector, 'transform', setTransformValue(prop, value, styles))
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Rotate (°)</label>
          <input
            type="number"
            step={1}
            aria-label="Rotate"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={parseTransformValue('rotate', styles)}
            placeholder="0"
            onChange={(e) => updateTransform('rotate', `${e.target.value}deg`)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Scale X</label>
          <input
            type="number"
            step={0.1}
            aria-label="Scale X"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={parseTransformValue('scaleX', styles) || parseTransformValue('scale', styles)}
            placeholder="1"
            onChange={(e) => updateTransform('scaleX', `${e.target.value}`)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Scale Y</label>
          <input
            type="number"
            step={0.1}
            aria-label="Scale Y"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={parseTransformValue('scaleY', styles) || parseTransformValue('scale', styles)}
            placeholder="1"
            onChange={(e) => updateTransform('scaleY', `${e.target.value}`)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Translate X</label>
          <input
            type="text"
            aria-label="Translate X"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={parseTransformValue('translateX', styles)}
            placeholder="e.g. 10px, 2rem"
            onChange={(e) => updateTransform('translateX', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Translate Y</label>
          <input
            type="text"
            aria-label="Translate Y"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={parseTransformValue('translateY', styles)}
            placeholder="e.g. 10px, 2rem"
            onChange={(e) => updateTransform('translateY', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-400 block mb-0.5">Transform Origin</label>
        <input
          type="text"
          aria-label="Transform origin"
          className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
          value={styles['transform-origin'] ?? ''}
          placeholder="e.g. center, top left, 50% 50%"
          onChange={(e) => onUpdate(selector, 'transform-origin', e.target.value)}
        />
      </div>
    </div>
  )
}
