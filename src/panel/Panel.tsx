import { BoxModel } from './components/BoxModel'
import { Typography } from './components/Typography'
import { ColorPicker } from './components/ColorPicker'
import { ExportPanel } from './components/ExportPanel'
import type { StyleMap } from '@/types'

interface PanelProps {
  selector: string
  styles: StyleMap
  onUpdate: (selector: string, property: string, value: string) => void
  onClose: () => void
}

export function Panel({ selector, styles, onUpdate, onClose }: PanelProps) {
  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-white border-l border-slate-200 shadow-lg z-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <span className="text-sm font-semibold text-slate-700">NovaStyle</span>
        <button
          className="text-slate-400 hover:text-slate-600 text-sm leading-none"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <div className="px-4 py-2 border-b border-slate-200">
        <code className="text-[11px] text-slate-500 font-mono break-all">{selector}</code>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <BoxModel selector={selector} onUpdate={onUpdate} />
        <Typography selector={selector} onUpdate={onUpdate} />
        <ColorPicker selector={selector} onUpdate={onUpdate} />
        <ExportPanel styles={styles} />
      </div>
    </div>
  )
}
