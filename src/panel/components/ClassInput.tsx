import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { TAILWIND_CLASSES } from '../data/tailwindClasses'

interface ClassInputProps {
  classes: string[]
  onAdd: (className: string) => void
  onRemove: (className: string) => void
}

export function ClassInput({ classes, onAdd, onRemove }: ClassInputProps) {
  const [input, setInput] = useState('')
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const q = input.trim()
    return q ? TAILWIND_CLASSES.filter((c) => c.includes(q) && !classes.includes(c)).slice(0, 20) : []
  }, [input, classes])

  useEffect(() => {
    setFocusedIndex(-1)
  }, [input])

  const commit = useCallback(
    (value: string) => {
      const trimmed = value.trim()
      if (trimmed && !classes.includes(trimmed)) {
        onAdd(trimmed)
      }
      setInput('')
      inputRef.current?.focus()
    },
    [classes, onAdd],
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (focusedIndex >= 0 && filtered[focusedIndex]) {
        commit(filtered[focusedIndex])
      } else {
        commit(input)
      }
    } else if (e.key === 'Backspace' && !input && classes.length > 0) {
      onRemove(classes[classes.length - 1])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex((prev) => Math.min(prev + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex((prev) => Math.max(prev - 1, -1))
    } else if (e.key === 'Escape') {
      setInput('')
      inputRef.current?.blur()
    }
  }

  const handleRemove = (cls: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove(cls)
  }

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Classes</div>
      <div className="flex flex-wrap gap-1 p-2 border border-slate-200 rounded bg-white min-h-[36px]">
        {classes.map((cls) => (
          <span
            key={cls}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded"
          >
            {cls}
            <button
              className="text-blue-400 hover:text-blue-600 leading-none"
              onClick={handleRemove(cls)}
              aria-label={`Remove ${cls}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-[80px] text-xs border-none outline-none bg-transparent p-0"
          placeholder="Add class..."
          aria-label="Add CSS class"
        />
      </div>

      {filtered.length > 0 && (
        <div
          ref={listRef}
          className="border border-slate-200 rounded max-h-48 overflow-y-auto bg-white shadow"
          role="listbox"
        >
          {filtered.map((cls, i) => (
            <button
              key={cls}
              role="option"
              aria-selected={i === focusedIndex}
              className={`w-full text-left px-2 py-1 text-xs font-mono ${
                i === focusedIndex ? 'bg-blue-100 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
              onMouseDown={(e) => {
                e.preventDefault()
                commit(cls)
              }}
              onMouseEnter={() => setFocusedIndex(i)}
            >
              {cls}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
