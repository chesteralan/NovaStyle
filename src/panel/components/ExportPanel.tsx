import { useState } from 'react'
import type { StyleMap } from '@/types'
import { exportToCSS } from '@/exporter/exporter'

const COPY_FEEDBACK_MS = 2000

interface ExportPanelProps {
  styles: StyleMap
}

export function ExportPanel({ styles }: ExportPanelProps) {
  const [copied, setCopied] = useState(false)
  const css = exportToCSS(styles, window.location.hostname)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(css)
      setCopied(true)
      setTimeout(() => setCopied(false), COPY_FEEDBACK_MS)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Export CSS</div>
      <pre
        className="bg-slate-50 border border-slate-200 rounded p-3 text-xs font-mono text-slate-700 overflow-auto max-h-64 whitespace-pre"
        role="code"
        aria-label="Exported CSS"
      >
        {css || 'No styles to export.'}
      </pre>
      <button
        className="w-full px-3 py-1.5 text-xs font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
        onClick={handleCopy}
        aria-label={copied ? 'Copied to clipboard' : 'Copy CSS to clipboard'}
      >
        {copied ? 'Copied!' : 'Copy to Clipboard'}
      </button>
      <div aria-live="polite" className="sr-only">{copied ? 'CSS copied to clipboard' : ''}</div>
    </div>
  )
}
