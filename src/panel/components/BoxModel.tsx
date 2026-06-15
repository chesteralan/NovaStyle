interface BoxModelProps {
  selector: string
  onUpdate: (selector: string, property: string, value: string) => void
}

const SIDES = ['top', 'right', 'bottom', 'left'] as const

export function BoxModel({ selector, onUpdate }: BoxModelProps) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Box Model</div>
      {(['margin', 'border', 'padding'] as const).map((layer) => (
        <div key={layer} className="border border-slate-200 rounded p-2">
          <div className="text-xs font-medium text-slate-400 mb-1 capitalize">{layer}</div>
          <div className="grid grid-cols-2 gap-1">
            {SIDES.map((side) => (
              <input
                key={side}
                type="number"
                placeholder={side}
                className="w-full px-1.5 py-0.5 text-xs border border-slate-200 rounded"
                onChange={(e) => onUpdate(selector, `${layer}-${side}`, `${e.target.value}px`)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
