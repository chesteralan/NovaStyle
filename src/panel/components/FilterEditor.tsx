import { useCallback } from 'react'

interface FilterEditorProps {
  selector: string
  styles: Record<string, string>
  onUpdate: (selector: string, property: string, value: string) => void
}

interface FilterSlider {
  label: string
  property: string
  unit: string
  min: number
  max: number
  step: number
  defaultVal: number
}

const sliders: FilterSlider[] = [
  { label: 'Blur', property: 'blur', unit: 'px', min: 0, max: 20, step: 0.5, defaultVal: 0 },
  { label: 'Brightness', property: 'brightness', unit: '', min: 0, max: 200, step: 1, defaultVal: 100 },
  { label: 'Contrast', property: 'contrast', unit: '', min: 0, max: 200, step: 1, defaultVal: 100 },
  { label: 'Grayscale', property: 'grayscale', unit: '%', min: 0, max: 100, step: 1, defaultVal: 0 },
  { label: 'Sepia', property: 'sepia', unit: '%', min: 0, max: 100, step: 1, defaultVal: 0 },
  { label: 'Hue Rotate', property: 'hue-rotate', unit: 'deg', min: 0, max: 360, step: 1, defaultVal: 0 },
  { label: 'Saturate', property: 'saturate', unit: '', min: 0, max: 200, step: 1, defaultVal: 100 },
  { label: 'Invert', property: 'invert', unit: '%', min: 0, max: 100, step: 1, defaultVal: 0 },
  { label: 'Opacity', property: 'opacity', unit: '%', min: 0, max: 100, step: 1, defaultVal: 100 },
]

function parseFilterValue(prop: string, styles: Record<string, string>): number {
  const filter = styles['filter']
  if (!filter) return 0
  const slug = prop === 'hue-rotate' ? 'hue-rotate' : prop
  const match = filter.match(new RegExp(`${slug}\\(([^)]+)\\)`))
  if (!match) return 0
  const raw = match[1].replace(/[^0-9.\-]/g, '')
  const val = parseFloat(raw)
  return isNaN(val) ? 0 : val
}

function setFilterValue(prop: string, value: string, styles: Record<string, string>): string {
  const current = styles['filter'] ?? ''
  const slug = prop === 'hue-rotate' ? 'hue-rotate' : prop
  const existing = new RegExp(`${slug}\\([^)]*\\)\\s*`)
  const entry = value ? `${slug}(${value})` : ''
  if (existing.test(current)) {
    return entry ? current.replace(existing, entry) : current.replace(existing, '').trim()
  }
  return [current, entry].filter(Boolean).join(' ')
}

export function FilterEditor({ selector, styles, onUpdate }: FilterEditorProps) {
  const updateFilter = useCallback(
    (prop: string, rawValue: string) => {
      onUpdate(selector, 'filter', setFilterValue(prop, rawValue, styles))
    },
    [selector, styles, onUpdate],
  )

  return (
    <div className="space-y-3">
      <style>{`
        .filter-slider::-webkit-slider-runnable-track { height: 4px; border-radius: 2px; background: #e2e8f0; }
        .filter-slider::-webkit-slider-thumb { -webkit-appearance: none; height: 14px; width: 14px; border-radius: 50%; background: #3b82f6; margin-top: -5px; cursor: pointer; }
        .filter-slider { -webkit-appearance: none; width: 100%; height: 4px; background: transparent; cursor: pointer; }
      `}</style>
      {sliders.map((s) => {
        const val = parseFilterValue(s.property, styles)
        const display = val === 0 && styles['filter'] ? '' : String(val)
        return (
          <div key={s.property}>
            <div className="flex items-center justify-between mb-0.5">
              <label className="text-xs text-slate-400">{s.label}</label>
              <span className="text-xs text-slate-500 font-mono w-12 text-right">
                {display || `0`}{s.unit}
              </span>
            </div>
            <input
              type="range"
              className="filter-slider"
              aria-label={s.label}
              min={s.min}
              max={s.max}
              step={s.step}
              value={val || s.defaultVal}
              onChange={(e) => updateFilter(s.property, `${e.target.value}${s.unit}`)}
            />
          </div>
        )
      })}
    </div>
  )
}
