import { useEffect, useState, useRef, useCallback } from 'react'
import {
  getAllDomainsWithMeta,
  removeDomainStyles,
  getSettings,
  saveSettings,
  renameDomain,
  getVersions,
  revertToVersion,
  isDomainEnabled,
  setDomainEnabled,
  type NovaStyleSettings,
} from '@/storage/db'
import type { StyleMap } from '@/types'
import { Accordion } from '@/components/Accordion'

interface DomainEntry {
  domain: string
  styles: StyleMap
  expanded: boolean
  updatedAt: number
}

export function Options() {
  const [entries, setEntries] = useState<DomainEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDomains, setSelectedDomains] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'edited-desc' | 'edited-asc'>('name-asc')
  const [renaming, setRenaming] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [showHistoryFor, setShowHistoryFor] = useState<string | null>(null)
  const [versions, setVersions] = useState<Array<{ styles: StyleMap; timestamp: number }>>([])
  const [disabled, setDisabled] = useState<Set<string>>(new Set())
  const [settings, setSettings] = useState<NovaStyleSettings>({
    defaultPosition: 'right',
    panelWidth: 320,
    theme: 'light',
    visibleEditors: {
      classInput: true,
      boxModel: true,
      typography: true,
      colorPicker: true,
      borderEditor: true,
      effectsEditor: true,
      layoutEditor: true,
      flexboxEditor: true,
      transformEditor: true,
      gridEditor: true,
      backgroundEditor: true,
      filterEditor: true,
      textDecorationEditor: true,
      outlineEditor: true,
      cursorEditor: true,
      fontDetector: true,
      classResolver: true,
      responsivePreview: true,
      customCSS: true,
      colorPalette: true,
    },
    useSync: false,
    ignoredDomains: [],
  })
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const [domains, savedSettings] = await Promise.all([getAllDomainsWithMeta(), getSettings()])
    setEntries(
      domains.map((d) => ({
        domain: d.domain,
        styles: d.styles,
        updatedAt: d.updatedAt,
        expanded: false,
      })),
    )
    setSettings(savedSettings)
    const states = await Promise.all(domains.map((d) => isDomainEnabled(d.domain).then((e) => ({ domain: d.domain, enabled: e }))))
    setDisabled(new Set(states.filter((s) => !s.enabled).map((s) => s.domain)))
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
    setSelectedDomains((prev) => { const next = new Set(prev); next.delete(domain); return next })
    showMessage(`Deleted styles for ${domain}`)
  }

  const toggleSelected = (domain: string) => {
    setSelectedDomains((prev) => {
      const next = new Set(prev)
      if (next.has(domain)) next.delete(domain)
      else next.add(domain)
      return next
    })
  }

  const toggleSelectAll = () => {
    const currentFiltered = sorted.map((e) => e.domain)
    setSelectedDomains((prev) => {
      const allSelected = currentFiltered.every((d) => prev.has(d))
      if (allSelected) return new Set()
      return new Set(currentFiltered)
    })
  }

  const handleToggleDomain = async (domain: string) => {
    const next = new Set(disabled)
    if (next.has(domain)) {
      next.delete(domain)
      await setDomainEnabled(domain, true)
    } else {
      next.add(domain)
      await setDomainEnabled(domain, false)
    }
    setDisabled(next)
  }

  const handleBulkDelete = async () => {
    const domains = [...selectedDomains]
    await Promise.all(domains.map(removeDomainStyles))
    setEntries((prev) => prev.filter((e) => !selectedDomains.has(e.domain)))
    showMessage(`Deleted ${domains.length} domain(s)`)
    setSelectedDomains(new Set())
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

  const handleExportDomain = (domain: string, styles: StyleMap) => {
    const blob = new Blob([JSON.stringify({ [domain]: styles }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `novastyle-${domain}.json`
    a.click()
    URL.revokeObjectURL(url)
    showMessage(`Exported ${domain}`)
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

  const handleRenameStart = (domain: string) => {
    setRenaming(domain)
    setRenameValue(domain)
  }

  const handleRenameCancel = () => {
    setRenaming(null)
    setRenameValue('')
  }

  const handleRenameSubmit = async (oldDomain: string) => {
    const newDomain = renameValue.trim()
    if (!newDomain || newDomain === oldDomain) {
      setRenaming(null)
      return
    }
    const ok = await renameDomain(oldDomain, newDomain)
    if (ok) {
      setEntries((prev) =>
        prev.map((e) =>
          e.domain === oldDomain ? { ...e, domain: newDomain } : e,
        ),
      )
      setSelectedDomains((prev) => {
        const next = new Set(prev)
        if (next.has(oldDomain)) {
          next.delete(oldDomain)
          next.add(newDomain)
        }
        return next
      })
      showMessage(`Renamed ${oldDomain} → ${newDomain}`)
    } else {
      showMessage(`Could not rename — ${newDomain} may already exist`)
    }
    setRenaming(null)
  }

  const handleShowHistory = async (domain: string) => {
    const v = await getVersions(domain)
    setVersions(v)
    setShowHistoryFor(domain)
  }

  const handleRevert = async (domain: string, index: number) => {
    await revertToVersion(domain, index)
    showMessage(`Restored version from ${new Date(versions[index].timestamp).toLocaleString()}`)
    setShowHistoryFor(null)
    setVersions([])
    await load()
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
        borderEditor: true,
        effectsEditor: true,
        layoutEditor: true,
        flexboxEditor: true,
        transformEditor: true,
        gridEditor: true,
        backgroundEditor: true,
        filterEditor: true,
        textDecorationEditor: true,
        outlineEditor: true,
        cursorEditor: true,
        fontDetector: true,
        classResolver: true,
        responsivePreview: true,
        customCSS: true,
        colorPalette: true,
      },
      useSync: false,
      ignoredDomains: [],
    }
    setSettings(defaults)
    saveSettings(defaults)
    showMessage('Settings reset to defaults')
  }

  const filtered = searchQuery
    ? entries.filter((e) => e.domain.toLowerCase().includes(searchQuery.toLowerCase()))
    : entries

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.domain.localeCompare(b.domain)
      case 'name-desc':
        return b.domain.localeCompare(a.domain)
      case 'edited-desc':
        return b.updatedAt - a.updatedAt
      case 'edited-asc':
        return a.updatedAt - b.updatedAt
    }
  })

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
          <Accordion title="Saved Styles" defaultOpen headerClass="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50" titleClass="font-medium text-sm text-slate-800" contentClass="border-t border-slate-100 px-4 py-3">
            {loading ? (
              <div className="text-sm text-slate-400">Loading...</div>
            ) : entries.length === 0 ? (
              <div className="text-sm text-slate-400 py-4 text-center">
                No saved styles yet. Open the extension on a webpage to get started.
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <label className="flex items-center gap-1 text-xs text-slate-500 cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={sorted.length > 0 && sorted.every((e) => selectedDomains.has(e.domain))}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300"
                      aria-label="Select all"
                    />
                    All
                  </label>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search domains..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-2 pr-8 py-1.5 text-xs border border-slate-300 rounded-md bg-white placeholder:text-slate-400"
                      aria-label="Search domains"
                    />
                    {searchQuery && (
                      <button
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                        onClick={() => setSearchQuery('')}
                        aria-label="Clear search"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <select
                    className="text-xs border border-slate-300 rounded-md bg-white px-2 py-1.5 text-slate-600 shrink-0"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    aria-label="Sort domains"
                  >
                    <option value="name-asc">Name ↑</option>
                    <option value="name-desc">Name ↓</option>
                    <option value="edited-desc">Edited ↓</option>
                    <option value="edited-asc">Edited ↑</option>
                  </select>
                  <span className="text-xs text-slate-500 shrink-0">
                    <span className="font-semibold text-slate-700">{sorted.length}</span> / {entries.length} domain(s), <span className="font-semibold text-slate-700">{totalSelectors}</span> selector(s), <span className="font-semibold text-slate-700">{totalProperties}</span> propert(ies)
                  </span>
                  {selectedDomains.size > 0 && (
                    <button
                      className="text-xs text-red-600 hover:text-red-800 shrink-0 font-medium"
                      onClick={handleBulkDelete}
                      aria-label={`Delete ${selectedDomains.size} selected domain(s)`}
                    >
                      Delete ({selectedDomains.size})
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {sorted.length === 0 && searchQuery ? (
                    <div className="text-sm text-slate-400 py-4 text-center">No domains match your search.</div>
                  ) : (
                    sorted.map((entry) => {
                    const selectors = Object.keys(entry.styles)
                    const propCount = selectors.reduce(
                      (s, sel) => s + Object.keys(entry.styles[sel]).length,
                      0,
                    )
                    return (
                      <div key={entry.domain} className="border border-slate-200 rounded-md">
                        <div className="flex items-center justify-between px-3 py-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <input
                              type="checkbox"
                              checked={selectedDomains.has(entry.domain)}
                              onChange={() => toggleSelected(entry.domain)}
                              className="rounded border-slate-300 shrink-0"
                              aria-label={`Select ${entry.domain}`}
                            />
                            <button
                              className="text-slate-400 hover:text-slate-600 text-xs shrink-0"
                              onClick={() => toggleExpand(entry.domain)}
                              aria-label={entry.expanded ? 'Collapse' : 'Expand'}
                            >
                              {entry.expanded ? '▾' : '▸'}
                            </button>
                            <button
                              className={`text-xs shrink-0 ${disabled.has(entry.domain) ? 'text-red-400' : 'text-green-500'}`}
                              onClick={() => handleToggleDomain(entry.domain)}
                              aria-label={disabled.has(entry.domain) ? `Enable ${entry.domain}` : `Disable ${entry.domain}`}
                            >
                              {disabled.has(entry.domain) ? '⊙' : '●'}
                            </button>
                            {renaming === entry.domain ? (
                              <form
                                className="flex items-center gap-1 min-w-0"
                                onSubmit={(e) => { e.preventDefault(); handleRenameSubmit(entry.domain) }}
                              >
                                <input
                                  type="text"
                                  value={renameValue}
                                  onChange={(e) => setRenameValue(e.target.value)}
                                  className="flex-1 min-w-0 px-1.5 py-0.5 text-sm border border-blue-400 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                                  autoFocus
                                  aria-label="New domain name"
                                />
                                <button type="submit" className="text-xs text-blue-600 hover:text-blue-800 shrink-0" aria-label="Save rename">✓</button>
                                <button type="button" className="text-xs text-slate-400 hover:text-slate-600 shrink-0" onClick={handleRenameCancel} aria-label="Cancel rename">✕</button>
                              </form>
                            ) : (
                              <>
                                <span className="font-medium text-sm truncate">{entry.domain}</span>
                                <span className="text-xs text-slate-400 shrink-0">
                                  {selectors.length}s / {propCount}p
                                </span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              className="text-xs text-slate-500 hover:text-slate-700"
                              onClick={() => handleRenameStart(entry.domain)}
                              aria-label={`Rename ${entry.domain}`}
                            >
                              Rename
                            </button>
                            <button
                              className="text-xs text-slate-500 hover:text-slate-700"
                              onClick={() => handleShowHistory(entry.domain)}
                              aria-label={`History for ${entry.domain}`}
                            >
                              History
                            </button>
                            <button
                              className="text-xs text-blue-500 hover:text-blue-700"
                              onClick={() => handleExportDomain(entry.domain, entry.styles)}
                              aria-label={`Export styles for ${entry.domain}`}
                            >
                              Export
                            </button>
                            <button
                              className="text-xs text-red-500 hover:text-red-700"
                              onClick={() => handleDelete(entry.domain)}
                              aria-label={`Delete styles for ${entry.domain}`}
                            >
                              Delete
                            </button>
                          </div>
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
                  }))}
                </div>
              </div>
            )}
          </Accordion>

          {showHistoryFor && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[80vh] flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                  <span className="font-medium text-sm">History — {showHistoryFor}</span>
                  <button
                    className="text-slate-400 hover:text-slate-600 text-sm"
                    onClick={() => { setShowHistoryFor(null); setVersions([]) }}
                    aria-label="Close history"
                  >
                    ✕
                  </button>
                </div>
                <div className="overflow-y-auto p-4 space-y-2">
                  {versions.length === 0 ? (
                    <div className="text-sm text-slate-400 text-center py-4">No previous versions.</div>
                  ) : (
                    [...versions].reverse().map((v, i) => {
                      const idx = versions.length - 1 - i
                      const selCount = Object.keys(v.styles).length
                      const propCount = Object.values(v.styles).reduce((s, p) => s + Object.keys(p).length, 0)
                      return (
                        <div key={idx} className="flex items-center justify-between border border-slate-200 rounded-md px-3 py-2">
                          <div className="min-w-0">
                            <div className="text-xs text-slate-500">
                              <span className="font-medium text-slate-700">v{idx + 1}</span> — {new Date(v.timestamp).toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-400">{selCount} selector(s), {propCount} propert(ies)</div>
                          </div>
                          <button
                            className="text-xs text-blue-600 hover:text-blue-800 shrink-0 ml-2"
                            onClick={() => handleRevert(showHistoryFor, idx)}
                            aria-label={`Restore version ${idx + 1}`}
                          >
                            Restore
                          </button>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Panel Settings */}
          <Accordion title="Panel Settings" headerClass="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50" titleClass="font-medium text-sm text-slate-800" contentClass="border-t border-slate-100 px-4 py-3">
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
          </Accordion>

          {/* Editor Settings */}
          <Accordion title="Editor Settings" headerClass="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50" titleClass="font-medium text-sm text-slate-800" contentClass="border-t border-slate-100 px-4 py-3">
            <div className="space-y-3">
              {([
                { key: 'classInput' as const, label: 'Class Name Editor' },
                { key: 'boxModel' as const, label: 'Box Model (margin, padding, border)' },
                { key: 'typography' as const, label: 'Typography (font, size, spacing)' },
                { key: 'colorPicker' as const, label: 'Color Picker' },
                { key: 'layoutEditor' as const, label: 'Layout (display, position, sizing)' },
                { key: 'flexboxEditor' as const, label: 'Flexbox (direction, alignment, gap)' },
                { key: 'transformEditor' as const, label: 'Transform (rotate, scale, translate)' },
                { key: 'gridEditor' as const, label: 'Grid (columns, rows, gaps)' },
                { key: 'backgroundEditor' as const, label: 'Background (image, size, repeat)' },
                { key: 'filterEditor' as const, label: 'Filter (blur, brightness, contrast)' },
                { key: 'textDecorationEditor' as const, label: 'Text Decoration (underline, shadow)' },
                { key: 'outlineEditor' as const, label: 'Outline (width, color, offset)' },
                { key: 'cursorEditor' as const, label: 'Interaction (cursor, events, resize)' },
                { key: 'borderEditor' as const, label: 'Border Editor' },
                { key: 'effectsEditor' as const, label: 'Effects (opacity, box-shadow)' },
                { key: 'colorPalette' as const, label: 'Color Palette (detector)' },
                { key: 'fontDetector' as const, label: 'Font Detector' },
                { key: 'classResolver' as const, label: 'Class Resolver' },
                { key: 'responsivePreview' as const, label: 'Responsive Preview' },
                { key: 'customCSS' as const, label: 'Custom CSS' },
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
          </Accordion>

          {/* Theme */}
          <Accordion title="Theme" headerClass="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50" titleClass="font-medium text-sm text-slate-800" contentClass="border-t border-slate-100 px-4 py-3">
            <div className="space-y-3">
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
              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs font-medium text-slate-700 mb-1.5">Preset Themes</p>
                <p className="text-xs text-slate-400 mb-2">Apply a preset via Custom CSS in the panel.</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'Sepia', css: 'html { filter: sepia(0.5); }' },
                    { name: 'Dark Reader', css: 'html { filter: invert(0.9) hue-rotate(180deg); } img, video { filter: invert(1) hue-rotate(180deg); }' },
                    { name: 'High Contrast', css: 'html { filter: contrast(1.5); }' },
                    { name: 'Night Shift', css: 'html { filter: sepia(0.3) brightness(0.8); }' },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700"
                      onClick={() => {
                        navigator.clipboard.writeText(preset.css)
                        showMessage(`Copied "${preset.name}" CSS to clipboard`)
                      }}
                      aria-label={`Copy ${preset.name} preset`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Accordion>

          {/* Shortcuts */}
          <Accordion title="Shortcuts" headerClass="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50" titleClass="font-medium text-sm text-slate-800" contentClass="border-t border-slate-100 px-4 py-3">
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between"><kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs font-mono">Esc</kbd><span>Close panel</span></div>
              <div className="flex justify-between"><kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs font-mono">⌘Z / Ctrl+Z</kbd><span>Undo</span></div>
              <div className="flex justify-between"><kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs font-mono">⌘⇧Z / Ctrl+Shift+Z</kbd><span>Redo</span></div>
              <div className="flex justify-between"><kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs font-mono">⌘Y / Ctrl+Y</kbd><span>Redo (alternate)</span></div>
            </div>
          </Accordion>

          {/* Export / Import */}
          <Accordion title="Export / Import" headerClass="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50" titleClass="font-medium text-sm text-slate-800" contentClass="border-t border-slate-100 px-4 py-3">
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
          </Accordion>

          {/* Advanced */}
          <Accordion title="Advanced" headerClass="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50" titleClass="font-medium text-sm text-slate-800" contentClass="border-t border-slate-100 px-4 py-3">
            <div className="space-y-3">
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.useSync ?? false}
                    onChange={(e) => updateSetting('useSync', e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <span className="text-sm text-slate-700">Sync via chrome.storage.sync</span>
                </label>
                <p className="text-xs text-slate-400 mt-1 ml-6">Cross-device sync for saved styles.</p>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Ignored Domains (comma-separated)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white"
                  value={(settings.ignoredDomains ?? []).join(', ')}
                  onChange={(e) => {
                    const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    updateSetting('ignoredDomains', list)
                  }}
                  placeholder="example.com, test.org"
                  aria-label="Ignored domains"
                />
                <p className="text-xs text-slate-400 mt-1">Extension will be inactive on these domains.</p>
              </div>
              <div className="border-t border-slate-100 pt-3">
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
          </Accordion>
        </div>
      </div>
    </div>
  )
}