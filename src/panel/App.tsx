import { useCallback, useEffect, useState } from 'react'
import { Panel } from './Panel'
import { useStyleStore } from './hooks/useStyles'
import type { StyleMap, NovaStyleSettings } from '@/types'

interface AppProps {
  selector: string
  initialStyles?: StyleMap
  initialClasses?: string[]
  settings?: NovaStyleSettings
}

export function App({ selector: initialSelector, initialStyles, initialClasses, settings }: AppProps) {
  const [currentSelector, setCurrentSelector] = useState(initialSelector)
  const store = useStyleStore()

  useEffect(() => {
    if (initialStyles && Object.keys(initialStyles).length > 0) {
      store.setStyles(initialStyles)
    } else if (initialSelector) {
      store.setStyles({ [initialSelector]: {} })
    }
    if (initialClasses && initialClasses.length > 0) {
      store.setClassNames(initialClasses)
    }
  }, [])

  useEffect(() => {
    const container = document.getElementById('novastyle-root')
    const mountPoint = container?.shadowRoot?.getElementById('novastyle-panel-root')
    if (!mountPoint) return

    const handler = ((e: Event) => {
      const { selector: sel, styles, classes } = (e as CustomEvent).detail as { selector: string; styles: StyleMap; classes?: string[] }
      setCurrentSelector(sel)
      store.setStyles(styles)
      if (classes) store.setClassNames(classes)
    }) as EventListener

    mountPoint.addEventListener('novastyle:update-element', handler)
    return () => mountPoint.removeEventListener('novastyle:update-element', handler)
  }, [])

  useEffect(() => {
    return useStyleStore.subscribe((state, prev) => {
      if (state.styles !== prev.styles) {
        window.dispatchEvent(new CustomEvent('novastyle:update', {
          detail: { styles: state.styles },
        }))
      }
      if (state.classNames !== prev.classNames) {
        window.dispatchEvent(new CustomEvent('novastyle:update-classes', {
          detail: { classes: state.classNames },
        }))
      }
    })
  }, [])

  const onUpdate = useCallback((sel: string, prop: string, val: string) => {
    store.updateStyle(sel, prop, val)
  }, [store])

  const onUndo = useCallback(() => {
    store.undo()
  }, [store])

  const onRedo = useCallback(() => {
    store.redo()
  }, [store])

  const onClose = useCallback(() => {
    window.dispatchEvent(new CustomEvent('novastyle:close'))
  }, [])

  const onAddClass = useCallback((cls: string) => {
    store.addClass(cls)
  }, [store])

  const onRemoveClass = useCallback((cls: string) => {
    store.removeClass(cls)
  }, [store])

  return (
    <Panel
      selector={currentSelector}
      styles={store.styles}
      classNames={store.classNames}
      onUpdate={onUpdate}
      onClose={onClose}
      onUndo={onUndo}
      onRedo={onRedo}
      onAddClass={onAddClass}
      onRemoveClass={onRemoveClass}
      defaultPosition={settings?.defaultPosition}
      visibleEditors={settings?.visibleEditors}
      theme={settings?.theme}
    />
  )
}
