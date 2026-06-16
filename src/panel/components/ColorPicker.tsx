interface ColorPickerProps {
  selector: string
  styles: Record<string, string>
  onUpdate: (selector: string, property: string, value: string) => void
}

export function ColorPicker({ selector, styles, onUpdate }: ColorPickerProps) {
  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Colors</div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-400 w-24">Text Color</label>
        <input
          type="color"
          aria-label="Text color picker"
          className="w-8 h-8 p-0 border border-slate-200 rounded cursor-pointer"
          value={styles['color'] ?? '#000000'}
          onChange={(e) => onUpdate(selector, 'color', e.target.value)}
        />
        <input
          type="text"
          placeholder="#000000"
          aria-label="Text color hex"
          className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded font-mono"
          value={styles['color'] ?? ''}
          onChange={(e) => onUpdate(selector, 'color', e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-400 w-24">Background</label>
        <input
          type="color"
          aria-label="Background color picker"
          className="w-8 h-8 p-0 border border-slate-200 rounded cursor-pointer"
          value={styles['background-color'] ?? '#ffffff'}
          onChange={(e) => onUpdate(selector, 'background-color', e.target.value)}
        />
        <input
          type="text"
          placeholder="#ffffff"
          aria-label="Background color hex"
          className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded font-mono"
          value={styles['background-color'] ?? ''}
          onChange={(e) => onUpdate(selector, 'background-color', e.target.value)}
        />
      </div>
    </div>
  )
}
