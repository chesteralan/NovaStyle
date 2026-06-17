import { useState } from 'react'

interface EffectsEditorProps {
  selector: string
  onUpdate: (selector: string, property: string, value: string) => void
}

export function EffectsEditor({ selector, onUpdate }: EffectsEditorProps) {
  const [shadowX, setShadowX] = useState('0')
  const [shadowY, setShadowY] = useState('0')
  const [shadowBlur, setShadowBlur] = useState('0')

  const updateShadow = (x: string, y: string, blur: string) => {
    if (x === '0' && y === '0' && blur === '0') return
    onUpdate(selector, 'box-shadow', `${x}px ${y}px ${blur}px rgba(0,0,0,0.3)`)
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-slate-400 block mb-0.5">Opacity</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            aria-label="Opacity"
            className="flex-1"
            onChange={(e) => onUpdate(selector, 'opacity', e.target.value)}
          />
          <input
            type="number"
            min={0}
            max={1}
            step={0.05}
            aria-label="Opacity value"
            className="w-14 px-1.5 py-0.5 text-xs border border-slate-200 rounded"
            onChange={(e) => onUpdate(selector, 'opacity', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-400 block mb-0.5">Box Shadow</label>
        <div className="grid grid-cols-3 gap-1.5 mb-1.5">
          <div>
            <label className="text-[10px] text-slate-400 block">X (px)</label>
            <input
              type="number"
              aria-label="Shadow X offset"
              className="w-full px-1.5 py-0.5 text-xs border border-slate-200 rounded"
              value={shadowX}
              onChange={(e) => {
                const v = e.target.value
                setShadowX(v)
                updateShadow(v, shadowY, shadowBlur)
              }}
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block">Y (px)</label>
            <input
              type="number"
              aria-label="Shadow Y offset"
              className="w-full px-1.5 py-0.5 text-xs border border-slate-200 rounded"
              value={shadowY}
              onChange={(e) => {
                const v = e.target.value
                setShadowY(v)
                updateShadow(shadowX, v, shadowBlur)
              }}
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block">Blur (px)</label>
            <input
              type="number"
              min={0}
              aria-label="Shadow blur"
              className="w-full px-1.5 py-0.5 text-xs border border-slate-200 rounded"
              value={shadowBlur}
              onChange={(e) => {
                const v = e.target.value
                setShadowBlur(v)
                updateShadow(shadowX, shadowY, v)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
