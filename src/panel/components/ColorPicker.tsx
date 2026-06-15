interface ColorPickerProps {
  selector: string
  onUpdate: (selector: string, property: string, value: string) => void
}

export function ColorPicker({ selector, onUpdate }: ColorPickerProps) {
  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Colors</div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-400 w-24">Text Color</label>
        <input
          type="color"
          className="w-8 h-8 p-0 border border-slate-200 rounded cursor-pointer"
          onChange={(e) => onUpdate(selector, 'color', e.target.value)}
        />
        <input
          type="text"
          placeholder="#000000"
          className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded font-mono"
          onChange={(e) => onUpdate(selector, 'color', e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-400 w-24">Background</label>
        <input
          type="color"
          className="w-8 h-8 p-0 border border-slate-200 rounded cursor-pointer"
          onChange={(e) => onUpdate(selector, 'background-color', e.target.value)}
        />
        <input
          type="text"
          placeholder="#ffffff"
          className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded font-mono"
          onChange={(e) => onUpdate(selector, 'background-color', e.target.value)}
        />
      </div>
    </div>
  )
}
