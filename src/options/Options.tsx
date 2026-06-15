import { useEffect, useState, useRef, useCallback } from 'react'
import { getAllDomains, getStyles, removeDomainStyles } from '@/storage/db'
import type { StyleMap } from '@/types'

interface DomainEntry {
  domain: string
  styles: StyleMap
  expanded: boolean
}

export function Options() {
  const [entries, setEntries] = useState<DomainEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const domains = await getAllDomains()
    const results = await Promise.all(
      domains.map(async (domain) => {
        const styles = await getStyles(domain)
        return { domain, styles: styles ?? {}, expanded: false }
      }),
    )
    setEntries(results)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const toggleExpand = (domain: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.domain === domain ? { ...e, expanded: !e.expanded } : e)),
    )
  }

  const handleDelete = async (domain: string) => {
    await removeDomainStyles(domain)
    setEntries((prev) => prev.filter((e) => e.domain !== domain))
    setMessage(`Deleted styles for ${domain}`)
    setTimeout(() => setMessage(''), 2000)
  }

  const handleClearAll = async () => {
    const domains = entries.map((e) => e.domain)
    await Promise.all(domains.map(removeDomainStyles))
    setEntries([])
    setMessage('All styles cleared')
    setTimeout(() => setMessage(''), 2000)
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
    setMessage('Styles exported')
    setTimeout(() => setMessage(''), 2000)
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
      setMessage(`Imported ${Object.keys(data).length} domain(s)`)
      setTimeout(() => setMessage(''), 2000)
      await load()
    } catch {
      setMessage('Invalid import file')
      setTimeout(() => setMessage(''), 2000)
    }
    if (fileRef.current) fileRef.current.value = ''
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
          <h1 className="text-2xl font-bold">NovaStyle Options</h1>
          <span className="text-xs text-slate-400">Extension Options</span>
        </div>

        {message && (
          <div className="mb-4 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded">
            {message}
          </div>
        )}

        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <span className="font-semibold text-slate-700">{entries.length}</span> domain(s),
          <span className="font-semibold text-slate-700">{totalSelectors}</span> selector(s),
          <span className="font-semibold text-slate-700">{totalProperties}</span> propert(ies)
        </div>

        {loading ? (
          <div className="text-sm text-slate-400">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="text-sm text-slate-400 py-8 text-center">
            No saved styles yet. Open the extension on a webpage to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => {
              const selectors = Object.keys(entry.styles)
              const propCount = selectors.reduce(
                (s, sel) => s + Object.keys(entry.styles[sel]).length,
                0,
              )
              return (
                <div key={entry.domain} className="bg-white border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        className="text-slate-400 hover:text-slate-600 text-xs"
                        onClick={() => toggleExpand(entry.domain)}
                        aria-label={entry.expanded ? 'Collapse' : 'Expand'}
                      >
                        {entry.expanded ? '▾' : '▸'}
                      </button>
                      <div>
                        <span className="font-medium text-sm">{entry.domain}</span>
                        <span className="ml-2 text-xs text-slate-400">
                          {selectors.length} selector{selectors.length !== 1 ? 's' : ''},{' '}
                          {propCount} propert{propCount !== 1 ? 'ies' : 'y'}
                        </span>
                      </div>
                    </div>
                    <button
                      className="text-xs text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(entry.domain)}
                      aria-label={`Delete styles for ${entry.domain}`}
                    >
                      Delete
                    </button>
                  </div>
                  {entry.expanded && (
                    <div className="border-t border-slate-100 px-4 py-3 space-y-2">
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
        )}

        <div className="mt-8 flex items-center gap-3">
          <button
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
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
          <button
            className="px-3 py-1.5 text-sm bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-100 ml-auto"
            onClick={handleClearAll}
            disabled={entries.length === 0}
            aria-label="Clear all saved styles"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  )
}
