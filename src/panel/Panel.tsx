import { useState, useRef, useCallback, useEffect } from 'react'
import { BoxModel } from './components/BoxModel'
import { Typography } from './components/Typography'
import { ColorPicker } from './components/ColorPicker'
import { ClassInput } from './components/ClassInput'
import { BorderEditor } from './components/BorderEditor'
import { EffectsEditor } from './components/EffectsEditor'
import { LayoutEditor } from './components/LayoutEditor'
import { FlexboxEditor } from './components/FlexboxEditor'
import { TransformEditor } from './components/TransformEditor'
import { GridEditor } from './components/GridEditor'
import { BackgroundEditor } from './components/BackgroundEditor'
import { FilterEditor } from './components/FilterEditor'
import { TextDecorationEditor } from './components/TextDecorationEditor'
import { OutlineEditor } from './components/OutlineEditor'
import { CursorEditor } from './components/CursorEditor'
import { AnimationEditor } from './components/AnimationEditor'
import { ListEditor } from './components/ListEditor'
import { TableEditor } from './components/TableEditor'
import { ColumnsEditor } from './components/ColumnsEditor'
import { ScrollSnapEditor } from './components/ScrollSnapEditor'
import { SvgEditor } from './components/SvgEditor'
import { WritingModeEditor } from './components/WritingModeEditor'
import { FontDetector } from './components/FontDetector'
import { CustomCSS } from './components/CustomCSS'
import { ColorPalette } from './components/ColorPalette'
import { ResponsivePreview } from './components/ResponsivePreview'
import { ClassResolver } from './components/ClassResolver'
import { SelectorBreadcrumb } from './components/SelectorBreadcrumb'
import { ExportPanel } from './components/ExportPanel'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Accordion } from '@/components/Accordion'
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
  onSelectElement: (selector: string) => void
  defaultPosition?: PanelPosition
  visibleEditors?: NovaStyleSettings['visibleEditors']
  theme?: NovaStyleSettings['theme']
}

export function Panel({ selector, styles, classNames, onUpdate, onClose, onUndo, onRedo, onAddClass, onRemoveClass, onSelectElement, defaultPosition, visibleEditors, theme }: PanelProps) {
  const [position, setPosition] = useState<PanelPosition>(defaultPosition ?? 'right')
  const [floating, setFloating] = useState(false)
  const [floatPos, setFloatPos] = useState({ top: 60, left: 0 })
  const [floatHeight, setFloatHeight] = useState<number | null>(null)
  const dragRef = useRef<{ startX: number; startY: number; startTop: number; startLeft: number } | null>(null)
  const resizeRef = useRef<{ startY: number; startHeight: number } | null>(null)

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

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    if (!floating) return
    e.stopPropagation()
    e.preventDefault()
    resizeRef.current = {
      startY: e.clientY,
      startHeight: floatHeight ?? Math.round(window.innerHeight * 0.5),
    }
    const onMove = (ev: MouseEvent) => {
      if (!resizeRef.current) return
      const dh = ev.clientY - resizeRef.current.startY
      const newHeight = Math.max(200, Math.min(window.innerHeight * 0.9, resizeRef.current.startHeight + dh))
      setFloatHeight(newHeight)
    }
    const onUp = () => {
      resizeRef.current = null
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [floating, floatHeight])

  let containerStyle: React.CSSProperties = { zIndex: 2147483646 }
  if (floating) {
    containerStyle = {
      ...containerStyle,
      position: 'fixed',
      top: floatPos.top,
      left: floatPos.left,
      width: '20rem',
      height: floatHeight ?? Math.round(window.innerHeight * 0.5),
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
        <SelectorBreadcrumb selector={selector} onSelect={onSelectElement} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <ErrorBoundary>
        {visibleEditors?.classInput !== false && (
          <Accordion title="Classes">
            <ClassInput classes={classNames} onAdd={onAddClass} onRemove={onRemoveClass} />
          </Accordion>
        )}
        {visibleEditors?.boxModel !== false && (
          <Accordion title="Spacing">
            <BoxModel selector={selector} styles={styles[selector] ?? {}} onUpdate={onUpdate} />
          </Accordion>
        )}
        {visibleEditors?.typography !== false && (
          <Accordion title="Typography">
            <Typography selector={selector} styles={styles[selector] ?? {}} onUpdate={onUpdate} />
          </Accordion>
        )}
        {visibleEditors?.colorPicker !== false && (
          <Accordion title="Colors">
            <ColorPicker selector={selector} styles={styles[selector] ?? {}} onUpdate={onUpdate} />
          </Accordion>
        )}
        {visibleEditors?.layoutEditor !== false && (
          <Accordion title="Layout">
            <LayoutEditor selector={selector} styles={styles[selector] ?? {}} onUpdate={onUpdate} />
          </Accordion>
        )}
        {visibleEditors?.flexboxEditor !== false && (
          <Accordion title="Flexbox">
            <FlexboxEditor selector={selector} styles={styles[selector] ?? {}} onUpdate={onUpdate} />
          </Accordion>
        )}
        {visibleEditors?.transformEditor !== false && (
          <Accordion title="Transform">
            <TransformEditor selector={selector} styles={styles[selector] ?? {}} onUpdate={onUpdate} />
          </Accordion>
        )}
        {visibleEditors?.gridEditor !== false && (
          <Accordion title="Grid">
            <GridEditor selector={selector} styles={styles[selector] ?? {}} onUpdate={onUpdate} />
          </Accordion>
        )}
        {visibleEditors?.backgroundEditor !== false && (
          <Accordion title="Background">
            <BackgroundEditor selector={selector} styles={styles[selector] ?? {}} onUpdate={onUpdate} />
          </Accordion>
        )}
        {visibleEditors?.filterEditor !== false && (
          <Accordion title="Filter">
            <FilterEditor selector={selector} styles={styles[selector] ?? {}} onUpdate={onUpdate} />
          </Accordion>
        )}
        {visibleEditors?.textDecorationEditor !== false && (
          <Accordion title="Text Decoration">
            <TextDecorationEditor selector={selector} styles={styles[selector] ?? {}} onUpdate={onUpdate} />
          </Accordion>
        )}
        {visibleEditors?.outlineEditor !== false && (
          <Accordion title="Outline">
            <OutlineEditor selector={selector} styles={styles[selector] ?? {}} onUpdate={onUpdate} />
          </Accordion>
        )}
        {visibleEditors?.cursorEditor !== false && (
          <Accordion title="Interaction">
            <CursorEditor selector={selector} styles={styles[selector] ?? {}} onUpdate={onUpdate} />
          </Accordion>
        )}
        {visibleEditors?.animationEditor !== false && (
          <Accordion title="Animation & Transition">
            <AnimationEditor selector={selector} styles={styles[selector] ?? {}} onUpdate={onUpdate} />
          </Accordion>
        )}
        {visibleEditors?.listEditor !== false && (
          <Accordion title="List">
            <ListEditor selector={selector} styles={styles[selector] ?? {}} onUpdate={onUpdate} />
          </Accordion>
        )}
        {visibleEditors?.tableEditor !== false && (
          <Accordion title="Table">
            <TableEditor selector={selector} styles={styles[selector] ?? {}} onUpdate={onUpdate} />
          </Accordion>
        )}
        {visibleEditors?.columnsEditor !== false && (
          <Accordion title="Columns">
            <ColumnsEditor selector={selector} styles={styles[selector] ?? {}} onUpdate={onUpdate} />
          </Accordion>
        )}
        {visibleEditors?.scrollSnapEditor !== false && (
          <Accordion title="Scroll Snap">
            <ScrollSnapEditor selector={selector} styles={styles[selector] ?? {}} onUpdate={onUpdate} />
          </Accordion>
        )}
        {visibleEditors?.svgEditor !== false && (
          <Accordion title="SVG">
            <SvgEditor selector={selector} styles={styles[selector] ?? {}} onUpdate={onUpdate} />
          </Accordion>
        )}
        {visibleEditors?.writingModeEditor !== false && (
          <Accordion title="Writing Mode">
            <WritingModeEditor selector={selector} styles={styles[selector] ?? {}} onUpdate={onUpdate} />
          </Accordion>
        )}
        {visibleEditors?.borderEditor !== false && (
          <Accordion title="Border">
            <BorderEditor selector={selector} styles={styles[selector] ?? {}} onUpdate={onUpdate} />
          </Accordion>
        )}
        {visibleEditors?.effectsEditor !== false && (
          <Accordion title="Effects">
            <EffectsEditor selector={selector} onUpdate={onUpdate} />
          </Accordion>
        )}
        {visibleEditors?.colorPalette !== false && (
          <Accordion title="Palette">
            <ColorPalette />
          </Accordion>
        )}
        {visibleEditors?.fontDetector !== false && (
          <Accordion title="Fonts">
            <FontDetector />
          </Accordion>
        )}
        {visibleEditors?.classResolver !== false && (
          <Accordion title="Class Resolver">
            <ClassResolver classNames={classNames} />
          </Accordion>
        )}
        {visibleEditors?.responsivePreview !== false && (
          <Accordion title="Responsive">
            <ResponsivePreview />
          </Accordion>
        )}
        {visibleEditors?.customCSS !== false && (
          <Accordion title="Custom CSS">
            <CustomCSS />
          </Accordion>
        )}
        <Accordion title="Export">
          <ExportPanel styles={styles} />
        </Accordion>
        </ErrorBoundary>
      </div>
      {floating && (
        <div
          className="shrink-0 h-4 cursor-s-resize flex items-center justify-center border-t border-slate-200 text-slate-400 hover:text-slate-600 select-none"
          onMouseDown={handleResizeStart}
          aria-label="Resize panel"
        >
          <svg width="20" height="6" viewBox="0 0 20 6" className="opacity-50">
            <rect x="0" y="0" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="8" y="0" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="16" y="0" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="4" y="2" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="12" y="2" width="4" height="4" rx="1" fill="currentColor" />
          </svg>
        </div>
      )}
    </div>
  )
}