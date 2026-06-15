import { useState, useCallback } from 'react'
import type { StyleMap } from '@/types'

const MAX_UNDO = 50

export function useStyles(onChange?: (styles: StyleMap) => void) {
  const [styles, setStyles] = useState<StyleMap>({})
  const [undoStack, setUndoStack] = useState<StyleMap[]>([])
  const [redoStack, setRedoStack] = useState<StyleMap[]>([])

  const pushSnapshot = useCallback((prev: StyleMap) => {
    setUndoStack((stack) => {
      const next = [...stack, structuredClone(prev)]
      return next.length > MAX_UNDO ? next.slice(-MAX_UNDO) : next
    })
    setRedoStack([])
  }, [])

  const updateStyle = useCallback(
    (selector: string, property: string, value: string) => {
      setStyles((prev) => {
        pushSnapshot(prev)
        const next = { ...prev }
        if (!next[selector]) next[selector] = {}
        next[selector] = { ...next[selector], [property]: value }
        onChange?.(next)
        return next
      })
    },
    [onChange, pushSnapshot],
  )

  const removeStyle = useCallback(
    (selector: string, property: string) => {
      setStyles((prev) => {
        if (!prev[selector]) return prev
        pushSnapshot(prev)
        const next = { ...prev }
        const props = { ...next[selector] }
        delete props[property]
        if (Object.keys(props).length === 0) {
          delete next[selector]
        } else {
          next[selector] = props
        }
        onChange?.(next)
        return next
      })
    },
    [onChange, pushSnapshot],
  )

  const resetAll = useCallback(() => {
    setStyles((prev) => {
      if (Object.keys(prev).length === 0) return prev
      pushSnapshot(prev)
      onChange?.({})
      return {}
    })
  }, [onChange, pushSnapshot])

  const canUndo = undoStack.length > 0
  const canRedo = redoStack.length > 0

  const undo = useCallback(() => {
    setStyles((prev) => {
      if (undoStack.length === 0) return prev
      const snapshot = undoStack[undoStack.length - 1]
      setUndoStack((s) => s.slice(0, -1))
      setRedoStack((s) => [...s, structuredClone(prev)])
      onChange?.(snapshot)
      return snapshot
    })
  }, [undoStack, onChange])

  const redo = useCallback(() => {
    setStyles((prev) => {
      if (redoStack.length === 0) return prev
      const snapshot = redoStack[redoStack.length - 1]
      setRedoStack((s) => s.slice(0, -1))
      setUndoStack((s) => [...s, structuredClone(prev)])
      onChange?.(snapshot)
      return snapshot
    })
  }, [redoStack, onChange])

  return {
    styles,
    updateStyle,
    removeStyle,
    resetAll,
    canUndo,
    canRedo,
    undo,
    redo,
    setStyles,
  }
}
