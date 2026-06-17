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
  const styles = useStyleStore((s) => s.styles)
  const classNames = useStyleStore((s) => s.classNames)

  useEffect(() => {
    const store = useStyleStore.getState()
    if (initialStyles && Object.keys(initialStyles).length > 0) {
      store.setStyles(initialStyles)
    } else if (initialSelector) {
      store.setStyles({ [initialSelector]: {} })
    }
    if (initialClasses && initialClasses.length > 0) {
      store.setClassNames(initialClasses)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const container = document.getElementById('novastyle-root')
    const mountPoint = container?.shadowRoot?.getElementById('novastyle-panel-root')
    if (!mountPoint) return

    const handler = ((e: Event) => {
      const {
        selector: sel,
        styles,
        classes,
      } = (e as CustomEvent).detail as { selector: string; styles: StyleMap; classes?: string[] }
      setCurrentSelector(sel)
      const store = useStyleStore.getState()
      store.setStyles(styles)
      if (classes) store.setClassNames(classes)
    }) as EventListener

    mountPoint.addEventListener('novastyle:update-element', handler)
    return () => mountPoint.removeEventListener('novastyle:update-element', handler)
  }, [])

  useEffect(() => {
    return useStyleStore.subscribe((state, prev) => {
      if (state.styles !== prev.styles) {
        window.dispatchEvent(
          new CustomEvent('novastyle:update', {
            detail: { styles: state.styles },
          }),
        )
      }
      if (state.classNames !== prev.classNames) {
        window.dispatchEvent(
          new CustomEvent('novastyle:update-classes', {
            detail: { classes: state.classNames },
          }),
        )
      }
    })
  }, [])

  const onUpdate = useCallback((sel: string, prop: string, val: string) => {
    useStyleStore.getState().updateStyle(sel, prop, val)
  }, [])

  const onUndo = useCallback(() => {
    useStyleStore.getState().undo()
  }, [])

  const onRedo = useCallback(() => {
    useStyleStore.getState().redo()
  }, [])

  const onClose = useCallback(() => {
    window.dispatchEvent(new CustomEvent('novastyle:close'))
  }, [])

  const onAddClass = useCallback((cls: string) => {
    useStyleStore.getState().addClass(cls)
  }, [])

  const onRemoveClass = useCallback((cls: string) => {
    useStyleStore.getState().removeClass(cls)
  }, [])

  const onSelectElement = useCallback((sel: string) => {
    window.dispatchEvent(
      new CustomEvent('novastyle:select-element', {
        detail: { selector: sel },
      }),
    )
  }, [])

  return (
    <Panel
      selector={currentSelector}
      styles={styles}
      classNames={classNames}
      onUpdate={onUpdate}
      onClose={onClose}
      onUndo={onUndo}
      onRedo={onRedo}
      onAddClass={onAddClass}
      onRemoveClass={onRemoveClass}
      onSelectElement={onSelectElement}
      defaultPosition={settings?.defaultPosition}
      visibleEditors={settings?.visibleEditors}
      theme={settings?.theme}
    />
  )
}
