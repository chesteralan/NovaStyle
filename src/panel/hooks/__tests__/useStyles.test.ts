import { useStyleStore } from '../useStyles'

beforeEach(() => {
  useStyleStore.setState({ styles: {}, undoStack: [], redoStack: [] })
})

describe('useStyleStore', () => {
  describe('updateStyle', () => {
    it('adds a new property to a selector', () => {
      useStyleStore.getState().updateStyle('.title', 'color', 'red')
      const { styles } = useStyleStore.getState()
      expect(styles['.title']).toEqual({ color: 'red' })
    })

    it('overwrites existing property', () => {
      useStyleStore.getState().updateStyle('.title', 'color', 'red')
      useStyleStore.getState().updateStyle('.title', 'color', 'blue')
      expect(useStyleStore.getState().styles['.title'].color).toBe('blue')
    })

    it('pushes snapshot to undoStack', () => {
      useStyleStore.getState().updateStyle('.a', 'x', '1')
      const beforeUndo = useStyleStore.getState().undoStack.length
      expect(beforeUndo).toBeGreaterThan(0)
    })
  })

  describe('removeStyle', () => {
    it('removes a property from a selector', () => {
      useStyleStore.getState().updateStyle('.x', 'color', 'red')
      useStyleStore.getState().updateStyle('.x', 'font-size', '16px')
      useStyleStore.getState().removeStyle('.x', 'color')
      expect(useStyleStore.getState().styles['.x']).toEqual({ 'font-size': '16px' })
    })

    it('removes the selector when last property is deleted', () => {
      useStyleStore.getState().updateStyle('.y', 'color', 'red')
      useStyleStore.getState().removeStyle('.y', 'color')
      expect(useStyleStore.getState().styles['.y']).toBeUndefined()
    })

    it('does nothing for non-existent selector', () => {
      useStyleStore.getState().removeStyle('.ghost', 'color')
      expect(useStyleStore.getState().styles).toEqual({})
    })
  })

  describe('resetAll', () => {
    it('clears all styles', () => {
      useStyleStore.getState().updateStyle('.a', 'x', '1')
      useStyleStore.getState().updateStyle('.b', 'y', '2')
      useStyleStore.getState().resetAll()
      expect(useStyleStore.getState().styles).toEqual({})
    })

    it('does nothing when styles already empty', () => {
      useStyleStore.getState().resetAll()
      expect(useStyleStore.getState().undoStack).toEqual([])
    })
  })

  describe('undo / redo', () => {
    it('undo restores previous state', () => {
      useStyleStore.getState().updateStyle('.x', 'color', 'red')
      useStyleStore.getState().updateStyle('.x', 'color', 'blue')
      useStyleStore.getState().undo()
      expect(useStyleStore.getState().styles['.x'].color).toBe('red')
    })

    it('redo restores undone state', () => {
      useStyleStore.getState().updateStyle('.x', 'color', 'red')
      useStyleStore.getState().updateStyle('.x', 'color', 'blue')
      useStyleStore.getState().undo()
      useStyleStore.getState().redo()
      expect(useStyleStore.getState().styles['.x'].color).toBe('blue')
    })

    it('undo is a no-op when undoStack is empty', () => {
      const before = useStyleStore.getState().styles
      useStyleStore.getState().undo()
      expect(useStyleStore.getState().styles).toBe(before)
    })

    it('redo is a no-op when redoStack is empty', () => {
      useStyleStore.getState().redo()
      expect(useStyleStore.getState().redoStack).toEqual([])
    })

    it('clear redoStack on new action', () => {
      useStyleStore.getState().updateStyle('.x', 'color', 'red')
      useStyleStore.getState().updateStyle('.x', 'color', 'blue')
      useStyleStore.getState().undo()
      expect(useStyleStore.getState().redoStack.length).toBe(1)
      useStyleStore.getState().updateStyle('.x', 'color', 'green')
      expect(useStyleStore.getState().redoStack).toEqual([])
    })
  })

  describe('setStyles', () => {
    it('replaces the entire styles map', () => {
      const newStyles = { '.test': { a: '1', b: '2' } }
      useStyleStore.getState().setStyles(newStyles)
      expect(useStyleStore.getState().styles).toEqual(newStyles)
    })
  })
})
