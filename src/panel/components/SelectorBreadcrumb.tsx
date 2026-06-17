import { useCallback, useRef, useEffect } from 'react'

interface SelectorBreadcrumbProps {
  selector: string
  onSelect: (selector: string) => void
}

export function SelectorBreadcrumb({ selector, onSelect }: SelectorBreadcrumbProps) {
  const segments = selector.split(' > ')

  return (
    <div className="flex flex-wrap items-center gap-0.5 text-[11px] font-mono">
      {segments.map((seg, i) => {
        const partial = segments.slice(0, i + 1).join(' > ')
        const isLast = i === segments.length - 1
        return (
          <span key={i} className="flex items-center gap-0.5">
            {i > 0 && <span className="text-slate-300 mx-0.5">&gt;</span>}
            <Segment
              label={seg}
              selector={partial}
              isLast={isLast}
              onSelect={onSelect}
            />
          </span>
        )
      })}
    </div>
  )
}

interface SegmentProps {
  label: string
  selector: string
  isLast: boolean
  onSelect: (selector: string) => void
}

function Segment({ label, selector: sel, isLast, onSelect }: SegmentProps) {
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    return () => cleanupRef.current?.()
  }, [])

  const handleMouseEnter = useCallback(() => {
    cleanupRef.current?.()
    const el = document.querySelector(sel) as HTMLElement | null
    if (!el) return
    const prevOutline = el.style.outline
    const prevOutlineOffset = el.style.outlineOffset
    el.style.outline = '2px dashed #3b82f6'
    el.style.outlineOffset = '-2px'
    cleanupRef.current = () => {
      el.style.outline = prevOutline
      el.style.outlineOffset = prevOutlineOffset
    }
  }, [sel])

  const handleMouseLeave = useCallback(() => {
    cleanupRef.current?.()
    cleanupRef.current = null
  }, [])

  return (
    <button
      type="button"
      className={`px-1 py-0.5 rounded hover:bg-blue-50 hover:text-blue-700 transition-colors ${
        isLast ? 'text-blue-600 font-semibold' : 'text-slate-500'
      } ${!isLast ? 'cursor-pointer' : 'cursor-default'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        if (!isLast) onSelect(sel)
      }}
      title={sel}
    >
      {label}
    </button>
  )
}
