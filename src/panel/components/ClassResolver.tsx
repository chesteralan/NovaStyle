import { useMemo } from 'react'

const COMMON_PROPS = [
  'display',
  'position',
  'width',
  'height',
  'margin',
  'padding',
  'color',
  'background-color',
  'font-size',
  'font-weight',
  'font-family',
  'border',
  'border-radius',
  'box-shadow',
  'opacity',
  'flex-direction',
  'align-items',
  'justify-content',
  'grid-template-columns',
  'gap',
]

interface ClassResolverProps {
  classNames: string[]
}

export function ClassResolver({ classNames }: ClassResolverProps) {
  const resolved = useMemo(() => {
    if (classNames.length === 0) return []
    const temp = document.createElement('div')
    temp.style.cssText =
      'position:absolute!important;visibility:hidden!important;pointer-events:none!important;top:-9999px!important'
    document.body.appendChild(temp)
    const entries = classNames.map((cls) => {
      temp.className = cls
      const style = getComputedStyle(temp)
      const props: Record<string, string> = {}
      for (const prop of COMMON_PROPS) {
        const val = style.getPropertyValue(prop)
        if (val && val !== 'none' && val !== 'normal' && val !== '0px') {
          props[prop] = val
        }
      }
      return { className: cls, props }
    })
    document.body.removeChild(temp)
    return entries.filter((e) => Object.keys(e.props).length > 0)
  }, [classNames])

  return (
    <div className="space-y-2">
      {classNames.length === 0 ? (
        <div className="text-xs text-slate-400">No classes on selected element.</div>
      ) : resolved.length === 0 ? (
        <div className="text-xs text-slate-400">No computed styles found for current classes.</div>
      ) : (
        resolved.map(({ className, props }) => (
          <div key={className} className="border border-slate-200 rounded-md overflow-hidden">
            <div className="text-xs font-mono text-blue-600 bg-slate-50 px-2 py-1 border-b border-slate-200">
              .{className}
            </div>
            <div className="px-2 py-1 space-y-0.5">
              {Object.entries(props)
                .slice(0, 8)
                .map(([prop, val]) => (
                  <div key={prop} className="text-[11px] font-mono text-slate-500">
                    <span className="text-slate-400">{prop}:</span> {val}
                  </div>
                ))}
              {Object.keys(props).length > 8 && (
                <div className="text-[11px] text-slate-400">+{Object.keys(props).length - 8} more</div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
