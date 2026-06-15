import { create } from 'zustand'
import type { StyleMap } from '@/types'

const MAX_UNDO = 50

interface StyleStore {
  styles: StyleMap
  undoStack: StyleMap[]
  redoStack: StyleMap[]
  updateStyle: (selector: string, property: string, value: string) => void
  removeStyle: (selector: string, property: string) => void
  resetAll: () => void
  undo: () => void
  redo: () => void
  setStyles: (styles: StyleMap) => void
}

export const useStyleStore = create<StyleStore>((set, get) => ({
  styles: {},
  undoStack: [],
  redoStack: [],

  updateStyle: (selector, property, value) => {
    const { styles, undoStack } = get()
    const snapshot = structuredClone(styles)
    const next = { ...styles }
    if (!next[selector]) next[selector] = {}
    next[selector] = { ...next[selector], [property]: value }
    set({
      styles: next,
      undoStack: [...undoStack, snapshot].slice(-MAX_UNDO),
      redoStack: [],
    })
  },

  removeStyle: (selector, property) => {
    const { styles, undoStack } = get()
    if (!styles[selector]) return
    const snapshot = structuredClone(styles)
    const next = { ...styles }
    const props = { ...next[selector] }
    delete props[property]
    if (Object.keys(props).length === 0) {
      delete next[selector]
    } else {
      next[selector] = props
    }
    set({
      styles: next,
      undoStack: [...undoStack, snapshot].slice(-MAX_UNDO),
      redoStack: [],
    })
  },

  resetAll: () => {
    const { styles, undoStack } = get()
    if (Object.keys(styles).length === 0) return
    const snapshot = structuredClone(styles)
    set({
      styles: {},
      undoStack: [...undoStack, snapshot].slice(-MAX_UNDO),
      redoStack: [],
    })
  },

  undo: () => {
    const { styles, undoStack, redoStack } = get()
    if (undoStack.length === 0) return
    const previous = undoStack[undoStack.length - 1]
    set({
      styles: previous,
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, structuredClone(styles)],
    })
  },

  redo: () => {
    const { styles, undoStack, redoStack } = get()
    if (redoStack.length === 0) return
    const next = redoStack[redoStack.length - 1]
    set({
      styles: next,
      undoStack: [...undoStack, structuredClone(styles)],
      redoStack: redoStack.slice(0, -1),
    })
  },

  setStyles: (styles) => set({ styles }),
}))
