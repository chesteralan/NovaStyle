import { useState } from 'react'
import { BoxModel } from './components/BoxModel'
import { Typography } from './components/Typography'
import { ColorPicker } from './components/ColorPicker'
import { ClassInput } from './components/ClassInput'
import { ExportPanel } from './components/ExportPanel'
import type { StyleMap } from '@/types'

type PanelPosition = 'right' | 'left' | 'bottom' | 'top'

const POSITION_CYCLE: PanelPosition[] = ['right', 'left', 'bottom', 'top']

const positionClasses: Record<PanelPosition, string> = {
  right: 'fixed top-0 right-0 w-80 h-full border-l',
  left: 'fixed top-0 left-0 w-80 h-full border-r',
  bottom: 'fixed bottom-0 left-0 right-0 w-full h-80 border-t',
  top: 'fixed top-0 left-0 right-0 w-full h-80 border-b',
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
  onAddClass: (className: string) => void
  onRemoveClass: (className: string) => void
}

export function Panel({ selector, styles, classNames, onUpdate, onClose, onAddClass, onRemoveClass }: PanelProps) {
  const [position, setPosition] = useState<PanelPosition>('right')

  const cyclePosition = () => {
    setPosition(prev => {
      const idx = POSITION_CYCLE.indexOf(prev)
      return POSITION_CYCLE[(idx + 1) % POSITION_CYCLE.length]
    })
  }

  return (
    <div className={`${positionClasses[position]} bg-white shadow-lg flex flex-col`} style={{ zIndex: 2147483646 }} role="dialog" aria-label="NovaStyle style editor">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <span className="text-sm font-semibold text-slate-700" id="novastyle-heading">NovaStyle</span>
        <div className="flex items-center gap-1">
          <button
            className="text-slate-400 hover:text-slate-600 text-sm leading-none px-1"
            onClick={cyclePosition}
            aria-label="Move panel"
          >
            {nextIcon[position]}
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

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <ClassInput classes={classNames} onAdd={onAddClass} onRemove={onRemoveClass} />
        <BoxModel selector={selector} onUpdate={onUpdate} />
        <Typography selector={selector} onUpdate={onUpdate} />
        <ColorPicker selector={selector} onUpdate={onUpdate} />
        <ExportPanel styles={styles} />
      </div>
    </div>
  )
}
