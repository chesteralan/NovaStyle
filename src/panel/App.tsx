import { useCallback, useEffect, useState } from 'react'
import { Panel } from './Panel'
import { useStyleStore } from './hooks/useStyles'
import type { StyleMap } from '@/types'

interface AppProps {
  selector: string
  initialStyles?: StyleMap
}

export function App({ selector: initialSelector, initialStyles }: AppProps) {
  const [currentSelector, setCurrentSelector] = useState(initialSelector)
  const store = useStyleStore()

  useEffect(() => {
    if (initialStyles && Object.keys(initialStyles).length > 0) {
      store.setStyles(initialStyles)
    } else if (initialSelector) {
      store.setStyles({ [initialSelector]: {} })
    }
  }, [])

  useEffect(() => {
    const container = document.getElementById('novastyle-root')
    const mountPoint = container?.shadowRoot?.getElementById('novastyle-panel-root')
    if (!mountPoint) return

    const handler = ((e: Event) => {
      const { selector: sel, styles } = (e as CustomEvent).detail as { selector: string; styles: StyleMap }
      setCurrentSelector(sel)
      store.setStyles(styles)
    }) as EventListener

    mountPoint.addEventListener('novastyle:update-element', handler)
    return () => mountPoint.removeEventListener('novastyle:update-element', handler)
  }, [])

  const onUpdate = useCallback((sel: string, prop: string, val: string) => {
    store.updateStyle(sel, prop, val)
    window.dispatchEvent(new CustomEvent('novastyle:update', {
      detail: { selector: sel, property: prop, value: val, styles: useStyleStore.getState().styles },
    }))
  }, [store])

  const onClose = useCallback(() => {
    window.dispatchEvent(new CustomEvent('novastyle:close'))
  }, [])

  return (
    <Panel
      selector={currentSelector}
      styles={store.styles}
      onUpdate={onUpdate}
      onClose={onClose}
    />
  )
}
