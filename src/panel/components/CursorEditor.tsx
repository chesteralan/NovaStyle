interface CursorEditorProps {
  selector: string
  styles: Record<string, string>
  onUpdate: (selector: string, property: string, value: string) => void
}

const CURSOR_OPTIONS = [
  'auto', 'default', 'pointer', 'grab', 'grabbing', 'crosshair', 'move',
  'text', 'vertical-text', 'alias', 'copy', 'no-drop', 'not-allowed',
  'wait', 'progress', 'help', 'zoom-in', 'zoom-out',
  'col-resize', 'row-resize', 'n-resize', 's-resize', 'e-resize', 'w-resize',
]

export function CursorEditor({ selector, styles, onUpdate }: CursorEditorProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Cursor</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Cursor"
            value={styles['cursor'] ?? ''}
            onChange={(e) => onUpdate(selector, 'cursor', e.target.value)}
          >
            <option value="">—</option>
            {CURSOR_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Pointer Events</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Pointer events"
            value={styles['pointer-events'] ?? ''}
            onChange={(e) => onUpdate(selector, 'pointer-events', e.target.value)}
          >
            <option value="">—</option>
            <option value="auto">auto</option>
            <option value="none">none</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">User Select</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="User select"
            value={styles['user-select'] ?? ''}
            onChange={(e) => onUpdate(selector, 'user-select', e.target.value)}
          >
            <option value="">—</option>
            <option value="auto">auto</option>
            <option value="none">none</option>
            <option value="text">text</option>
            <option value="all">all</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Resize</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Resize"
            value={styles['resize'] ?? ''}
            onChange={(e) => onUpdate(selector, 'resize', e.target.value)}
          >
            <option value="">—</option>
            <option value="none">none</option>
            <option value="both">both</option>
            <option value="horizontal">horizontal</option>
            <option value="vertical">vertical</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Visibility</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Visibility"
            value={styles['visibility'] ?? ''}
            onChange={(e) => onUpdate(selector, 'visibility', e.target.value)}
          >
            <option value="">—</option>
            <option value="visible">visible</option>
            <option value="hidden">hidden</option>
            <option value="collapse">collapse</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Float</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Float"
            value={styles['float'] ?? ''}
            onChange={(e) => onUpdate(selector, 'float', e.target.value)}
          >
            <option value="">—</option>
            <option value="none">none</option>
            <option value="left">left</option>
            <option value="right">right</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Object Fit</label>
          <select
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            aria-label="Object fit"
            value={styles['object-fit'] ?? ''}
            onChange={(e) => onUpdate(selector, 'object-fit', e.target.value)}
          >
            <option value="">—</option>
            <option value="fill">fill</option>
            <option value="contain">contain</option>
            <option value="cover">cover</option>
            <option value="none">none</option>
            <option value="scale-down">scale-down</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-0.5">Object Position</label>
          <input
            type="text"
            aria-label="Object position"
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
            value={styles['object-position'] ?? ''}
            placeholder="e.g. center, top"
            onChange={(e) => onUpdate(selector, 'object-position', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
