import { useEffect, useState, useRef, useCallback } from 'react'
import { getAllDomains, getStyles, removeDomainStyles, getSettings, saveSettings, type NovaStyleSettings } from '@/storage/db'
import type { StyleMap } from '@/types'

interface DomainEntry {
  domain: string
  styles: StyleMap
  expanded: boolean
}

function AccordionSection({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen ?? false)
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-sm text-slate-800">{title}</span>
        <span className="text-slate-400 text-xs select-none">{open ? '▾' : '▸'}</span>
      </button>
      {open && <div className="border-t border-slate-100 px-4 py-3">{children}</div>}
    </div>
  )
}

export function Options() {
  const [entries, setEntries] = useState<DomainEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [settings, setSettings] = useState<NovaStyleSettings>({
    defaultPosition: 'right',
    panelWidth: 320,
    theme: 'light',
    visibleEditors: {
      classInput: true,
      boxModel: true,
      typography: true,
      colorPicker: true,
    },
  })
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const [domains, savedSettings] = await Promise.all([getAllDomains(), getSettings()])
    const results = await Promise.all(
      domains.map(async (domain) => {
        const styles = await getStyles(domain)
        return { domain, styles: styles ?? {}, expanded: false }
      }),
    )
    setEntries(results)
    setSettings(savedSettings)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const showMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 2000)
  }

  const toggleExpand = (domain: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.domain === domain ? { ...e, expanded: !e.expanded } : e)),
    )
  }

  const handleDelete = async (domain: string) => {
    await removeDomainStyles(domain)
    setEntries((prev) => prev.filter((e) => e.domain !== domain))
    showMessage(`Deleted styles for ${domain}`)
  }

  const handleClearAll = async () => {
    const domains = entries.map((e) => e.domain)
    await Promise.all(domains.map(removeDomainStyles))
    setEntries([])
    showMessage('All styles cleared')
  }

  const handleExport = () => {
    const data: Record<string, StyleMap> = {}
    for (const { domain, styles } of entries) {
      data[domain] = styles
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'novastyle-styles.json'
    a.click()
    URL.revokeObjectURL(url)
    showMessage('Styles exported')
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text) as Record<string, StyleMap>
      await Promise.all(
        Object.entries(data).map(async ([domain, styles]) => {
          const key = `novastyle_${domain}`
          await chrome.storage.local.set({ [key]: { styles, updatedAt: Date.now() } })
        }),
      )
      showMessage(`Imported ${Object.keys(data).length} domain(s)`)
      await load()
    } catch {
      showMessage('Invalid import file')
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const updateSetting = <K extends keyof NovaStyleSettings>(key: K, value: NovaStyleSettings[K]) => {
    const next = { ...settings, [key]: value }
    setSettings(next)
    saveSettings(next)
  }

  const updateEditor = (key: keyof NovaStyleSettings['visibleEditors'], value: boolean) => {
    const next = {
      ...settings,
      visibleEditors: { ...settings.visibleEditors, [key]: value },
    }
    setSettings(next)
    saveSettings(next)
  }

  const handleResetSettings = () => {
    const defaults: NovaStyleSettings = {
      defaultPosition: 'right',
      panelWidth: 320,
      theme: 'light',
      visibleEditors: {
        classInput: true,
        boxModel: true,
        typography: true,
        colorPicker: true,
      },
    }
    setSettings(defaults)
    saveSettings(defaults)
    showMessage('Settings reset to defaults')
  }

  const totalSelectors = entries.reduce(
    (sum, e) => sum + Object.keys(e.styles).length,
    0,
  )
  const totalProperties = entries.reduce(
    (sum, e) =>
      sum + Object.values(e.styles).reduce((s, props) => s + Object.keys(props).length, 0),
    0,
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">NovaStyle</h1>
            <p className="text-sm text-slate-500 mt-0.5">Extension Options</p>
          </div>
        </div>

        {message && (
          <div className="mb-4 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded">
            {message}
          </div>
        )}

        <div className="space-y-3">
          {/* Saved Styles */}
          <AccordionSection title="Saved Styles" defaultOpen>
            {loading ? (
              <div className="text-sm text-slate-400">Loading...</div>
            ) : entries.length === 0 ? (
              <div className="text-sm text-slate-400 py-4 text-center">
                No saved styles yet. Open the extension on a webpage to get started.
              </div>
            ) : (
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">{entries.length}</span> domain(s),
                  <span className="font-semibold text-slate-700">{totalSelectors}</span> selector(s),
                  <span className="font-semibold text-slate-700">{totalProperties}</span> propert(ies)
                </div>
                <div className="space-y-2">
                  {entries.map((entry) => {
                    const selectors = Object.keys(entry.styles)
                    const propCount = selectors.reduce(
                      (s, sel) => s + Object.keys(entry.styles[sel]).length,
                      0,
                    )
                    return (
                      <div key={entry.domain} className="border border-slate-200 rounded-md">
                        <div className="flex items-center justify-between px-3 py-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <button
                              className="text-slate-400 hover:text-slate-600 text-xs shrink-0"
                              onClick={() => toggleExpand(entry.domain)}
                              aria-label={entry.expanded ? 'Collapse' : 'Expand'}
                            >
                              {entry.expanded ? '▾' : '▸'}
                            </button>
                            <span className="font-medium text-sm truncate">{entry.domain}</span>
                            <span className="text-xs text-slate-400 shrink-0">
                              {selectors.length}s / {propCount}p
                            </span>
                          </div>
                          <button
                            className="text-xs text-red-500 hover:text-red-700 shrink-0 ml-2"
                            onClick={() => handleDelete(entry.domain)}
                            aria-label={`Delete styles for ${entry.domain}`}
                          >
                            Delete
                          </button>
                        </div>
                        {entry.expanded && (
                          <div className="border-t border-slate-100 px-3 py-2 space-y-1.5">
                            {selectors.map((sel) => (
                              <div key={sel}>
                                <code className="text-xs text-blue-600 font-mono break-all">{sel}</code>
                                <div className="ml-2 mt-0.5 space-y-0.5">
                                  {Object.entries(entry.styles[sel]).map(([prop, val]) => (
                                    <div key={prop} className="text-xs text-slate-500 font-mono">
                                      <span className="text-slate-400">{prop}:</span> {val}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </AccordionSection>

          {/* Panel Settings */}
          <AccordionSection title="Panel Settings">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Default Position</label>
                <select
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white"
                  value={settings.defaultPosition}
                  onChange={(e) => updateSetting('defaultPosition', e.target.value as NovaStyleSettings['defaultPosition'])}
                >
                  <option value="right">Right</option>
                  <option value="left">Left</option>
                  <option value="bottom">Bottom</option>
                  <option value="top">Top</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Panel Width (px)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="240"
                    max="640"
                    step="20"
                    value={settings.panelWidth}
                    onChange={(e) => updateSetting('panelWidth', Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-slate-600 w-12 text-right">{settings.panelWidth}px</span>
                </div>
              </div>
            </div>
          </AccordionSection>

          {/* Editor Settings */}
          <AccordionSection title="Editor Settings">
            <div className="space-y-3">
              {([
                { key: 'classInput' as const, label: 'Class Name Editor' },
                { key: 'boxModel' as const, label: 'Box Model (margin, padding, border)' },
                { key: 'typography' as const, label: 'Typography (font, size, spacing)' },
                { key: 'colorPicker' as const, label: 'Color Picker' },
              ]).map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.visibleEditors[key]}
                    onChange={(e) => updateEditor(key, e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <span className="text-sm text-slate-700">{label}</span>
                </label>
              ))}
            </div>
          </AccordionSection>

          {/* Theme */}
          <AccordionSection title="Theme">
            <div className="flex items-center gap-4">
              {(['light', 'dark'] as const).map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value={t}
                    checked={settings.theme === t}
                    onChange={() => updateSetting('theme', t)}
                    className="border-slate-300"
                  />
                  <span className="text-sm text-slate-700 capitalize">{t}</span>
                </label>
              ))}
            </div>
          </AccordionSection>

          {/* Export / Import */}
          <AccordionSection title="Export / Import">
            <div className="flex items-center gap-3">
              <button
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={handleExport}
                disabled={entries.length === 0}
                aria-label="Export all styles as JSON"
              >
                Export All
              </button>
              <button
                className="px-3 py-1.5 text-sm bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50"
                onClick={() => fileRef.current?.click()}
                aria-label="Import styles from JSON"
              >
                Import
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
            </div>
          </AccordionSection>

          {/* Advanced */}
          <AccordionSection title="Advanced">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-2">Reset all settings to their default values.</p>
                <button
                  className="px-3 py-1.5 text-sm bg-yellow-50 border border-yellow-200 text-yellow-700 rounded hover:bg-yellow-100"
                  onClick={handleResetSettings}
                  aria-label="Reset settings to defaults"
                >
                  Reset Settings
                </button>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-500 mb-2">Permanently delete all saved styles across all domains.</p>
                <button
                  className="px-3 py-1.5 text-sm bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-100"
                  onClick={handleClearAll}
                  disabled={entries.length === 0}
                  aria-label="Clear all saved styles"
                >
                  Clear All Styles
                </button>
              </div>
            </div>
          </AccordionSection>
        </div>
      </div>
    </div>
  )
}