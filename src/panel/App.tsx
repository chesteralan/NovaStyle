import { useCallback, useEffect } from 'react'
import { Panel } from './Panel'
import { useStyleStore } from './hooks/useStyles'

interface AppProps {
  selector: string
}

export function App({ selector }: AppProps) {
  const store = useStyleStore()

  const onUpdate = useCallback((sel: string, prop: string, val: string) => {
    store.updateStyle(sel, prop, val)
    window.dispatchEvent(new CustomEvent('novastyle:update', {
      detail: { selector: sel, property: prop, value: val, styles: useStyleStore.getState().styles },
    }))
  }, [store])

  const onClose = useCallback(() => {
    window.dispatchEvent(new CustomEvent('novastyle:close'))
  }, [])

  useEffect(() => {
    if (selector) {
      store.setStyles({ [selector]: {} })
    }
  }, [selector])

  return (
    <Panel
      selector={selector}
      styles={store.styles}
      onUpdate={onUpdate}
      onClose={onClose}
    />
  )
}
