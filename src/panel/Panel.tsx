import { useState, useRef, useCallback, useEffect } from 'react'
import { BoxModel } from './components/BoxModel'
import { Typography } from './components/Typography'
import { ColorPicker } from './components/ColorPicker'
import { ClassInput } from './components/ClassInput'
import { BorderEditor } from './components/BorderEditor'
import { EffectsEditor } from './components/EffectsEditor'
import { FontDetector } from './components/FontDetector'
import { CustomCSS } from './components/CustomCSS'
import { ColorPalette } from './components/ColorPalette'
import { ResponsivePreview } from './components/ResponsivePreview'
import { ClassResolver } from './components/ClassResolver'
import { ExportPanel } from './components/ExportPanel'
import type { StyleMap, NovaStyleSettings } from '@/types'

type PanelPosition = 'right' | 'left' | 'bottom' | 'top'

const POSITION_CYCLE: PanelPosition[] = ['right', 'left', 'bottom', 'top']

const positionClasses: Record<PanelPosition, string> = {
  right: 'fixed top-0 right-0 w-80 h-full border-l border-slate-300',
  left: 'fixed top-0 left-0 w-80 h-full border-r border-slate-300',
  bottom: 'fixed bottom-0 left-0 right-0 w-full h-80 border-t border-slate-300',
  top: 'fixed top-0 left-0 right-0 w-full h-80 border-b border-slate-300',
}

const nextIcon: Record<PanelPosition, string> = {
  right: '◀',
  left: '▼',
  bottom: '▲',
  top: '▶',
}

interface PanelProps {
  selector: string
  styles: StyleMap
  classNames: string[]
  onUpdate: (selector: string, property: string, value: string) => void
  onClose: () => void
  onUndo: () => void
  onRedo: () => void
  onAddClass: (className: string) => void
  onRemoveClass: (className: string) => void
  defaultPosition?: PanelPosition
  visibleEditors?: NovaStyleSettings['visibleEditors']
  theme?: NovaStyleSettings['theme']
}

function Accordion({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen ?? false)
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50"
        onClick={() => setOpen(!open)}
      >
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <span className="text-slate-400 text-xs select-none">{open ? '▾' : '▸'}</span>
      </button>
      {open && <div className="border-t border-slate-100 p-3">{children}</div>}
    </div>
  )
}

export function Panel({ selector, styles, classNames, onUpdate, onClose, onUndo, onRedo, onAddClass, onRemoveClass, defaultPosition, visibleEditors, theme }: PanelProps) {
  const [position, setPosition] = useState<PanelPosition>(defaultPosition ?? 'right')
  const [floating, setFloating] = useState(false)
  const [floatPos, setFloatPos] = useState({ top: 60, left: 0 })
  const dragRef = useRef<{ startX: number; startY: number; startTop: number; startLeft: number } | null>(null)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        onUndo()
        return
      }
      if (mod && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        onRedo()
        return
      }
      if (mod && e.key === 'y') {
        e.preventDefault()
        onRedo()
        return
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose, onUndo, onRedo])

  const cyclePosition = () => {
    if (floating) {
      dockTo(POSITION_CYCLE[0])
      return
    }
    setPosition(prev => {
      const idx = POSITION_CYCLE.indexOf(prev)
      return POSITION_CYCLE[(idx + 1) % POSITION_CYCLE.length]
    })
  }

  const dockTo = (pos: PanelPosition) => {
    setPosition(pos)
    setFloating(false)
  }

  const toggleFloat = () => {
    if (floating) {
      dockTo(position)
    } else {
      setFloating(true)
    }
  }

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!floating) return
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startTop: floatPos.top,
      startLeft: floatPos.left,
    }
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return
      const dx = ev.clientX - dragRef.current.startX
      const dy = ev.clientY - dragRef.current.startY
      setFloatPos({
        top: Math.max(0, dragRef.current.startTop + dy),
        left: Math.max(0, dragRef.current.startLeft + dx),
      })
    }
    const onUp = () => {
      dragRef.current = null
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [floating, floatPos])

  let containerStyle: React.CSSProperties = { zIndex: 2147483646 }
  if (floating) {
    containerStyle = {
      ...containerStyle,
      position: 'fixed',
      top: floatPos.top,
      left: floatPos.left,
      width: '20rem',
    }
  }

  return (
    <div
      className={`${floating ? 'bg-white shadow-lg rounded-lg border border-slate-300 flex flex-col' : `${positionClasses[position]} bg-white shadow-lg flex flex-col`}${theme === 'dark' ? ' dark' : ''}`}
      style={containerStyle}
      role="dialog"
      aria-label="NovaStyle style editor"
    >
      <div
        className={`flex items-center justify-between px-4 py-3 border-b border-slate-200 ${floating ? 'cursor-grab active:cursor-grabbing select-none' : ''}`}
        onMouseDown={handleMouseDown}
      >
        <span className="text-sm font-semibold text-slate-700" id="novastyle-heading">NovaStyle</span>
        <div className="flex items-center gap-1">
          <button
            className="text-slate-400 hover:text-slate-600 text-sm leading-none px-1"
            onClick={toggleFloat}
            aria-label={floating ? 'Dock panel' : 'Float panel'}
          >
            {floating ? '⊟' : '◫'}
          </button>
          <button
            className="text-slate-400 hover:text-slate-600 text-sm leading-none px-1"
            onClick={cyclePosition}
            aria-label={floating ? 'Dock to edge' : 'Move panel'}
          >
            {floating ? '⬌' : nextIcon[position]}
          </button>
          <button
            className="text-slate-400 hover:text-slate-600 text-sm leading-none"
            onClick={onClose}
            aria-label="Close panel"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="px-4 py-2 border-b border-slate-200">
        <code className="text-[11px] text-slate-500 font-mono break-all" aria-label="Selected element selector">{selector}</code>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {visibleEditors?.classInput !== false && (
          <Accordion title="Classes">
            <ClassInput classes={classNames} onAdd={onAddClass} onRemove={onRemoveClass} />
          </Accordion>
        )}
        {visibleEditors?.boxModel !== false && (
          <Accordion title="Spacing">
            <BoxModel selector={selector} onUpdate={onUpdate} />
          </Accordion>
        )}
        {visibleEditors?.typography !== false && (
          <Accordion title="Typography">
            <Typography selector={selector} onUpdate={onUpdate} />
          </Accordion>
        )}
        {visibleEditors?.colorPicker !== false && (
          <Accordion title="Colors">
            <ColorPicker selector={selector} onUpdate={onUpdate} />
          </Accordion>
        )}
        <Accordion title="Palette">
          <ColorPalette />
        </Accordion>
        <Accordion title="Border">
          <BorderEditor selector={selector} onUpdate={onUpdate} />
        </Accordion>
        <Accordion title="Effects">
          <EffectsEditor selector={selector} onUpdate={onUpdate} />
        </Accordion>
        <Accordion title="Fonts">
          <FontDetector />
        </Accordion>
        <Accordion title="Palette">
          <ColorPalette />
        </Accordion>
        <Accordion title="Class Resolver">
          <ClassResolver classNames={classNames} />
        </Accordion>
        <Accordion title="Responsive">
          <ResponsivePreview />
        </Accordion>
        <Accordion title="Custom CSS">
          <CustomCSS />
        </Accordion>
        <Accordion title="Export">
          <ExportPanel styles={styles} />
        </Accordion>
      </div>
    </div>
  )
}