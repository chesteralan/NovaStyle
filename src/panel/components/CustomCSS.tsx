import { useState, useRef, useCallback } from 'react'

let customSheet: HTMLStyleElement | null = null

function ensureSheet(): HTMLStyleElement {
  if (!customSheet) {
    customSheet = document.createElement('style')
    customSheet.id = 'novastyle-custom-css'
    document.head.appendChild(customSheet)
  }
  return customSheet
}

export function CustomCSS() {
  const [css, setCss] = useState('')
  const [saved, setSaved] = useState(false)
  const [active, setActive] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const apply = useCallback((value: string) => {
    const sheet = ensureSheet()
    sheet.textContent = value
  }, [])

  const handleChange = (value: string) => {
    setCss(value)
    setSaved(false)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      apply(value)
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    }, 300)
  }

  const toggleActive = () => {
    const next = !active
    setActive(next)
    if (next) {
      apply(css)
    } else {
      const sheet = ensureSheet()
      sheet.textContent = ''
    }
  }

  return (
    <div className="space-y-2">
      <textarea
        className="w-full h-24 text-xs font-mono border border-slate-300 rounded-md p-2 resize-none"
        placeholder="body { background: red; }"
        value={css}
        onChange={(e) => handleChange(e.target.value)}
        aria-label="Custom CSS"
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={active}
            onChange={toggleActive}
            className="rounded border-slate-300"
          />
          Enable
        </label>
        {saved && <span className="text-xs text-green-600">Applied</span>}
      </div>
    </div>
  )
}