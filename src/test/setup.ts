import '@testing-library/jest-dom/vitest'
import { vi, beforeEach } from 'vitest'

const __localStore: Record<string, unknown> = {}
const __syncStore: Record<string, unknown> = {}

function makeStorage(store: Record<string, unknown>) {
  return {
    get: vi.fn(
      (keys?: string | string[] | Record<string, unknown> | null) => {
        if (keys === null) return Promise.resolve({ ...store })
        if (typeof keys === 'object' && !Array.isArray(keys)) {
          const result: Record<string, unknown> = {}
          for (const key of Object.keys(keys)) {
            if (key in store) result[key] = store[key]
            else result[key] = (keys as Record<string, unknown>)[key]
          }
          return Promise.resolve(result)
        }
        const keysArr = Array.isArray(keys) ? keys : [keys]
        const result: Record<string, unknown> = {}
        for (const key of keysArr) {
          if (key != null && key in store) result[key] = store[key]
        }
        return Promise.resolve(result)
      },
    ),
    set: vi.fn((items: Record<string, unknown>) => {
      Object.assign(store, items)
      return Promise.resolve()
    }),
    remove: vi.fn((keys: string | string[]) => {
      const keysArr = Array.isArray(keys) ? keys : [keys]
      for (const k of keysArr) delete store[k]
      return Promise.resolve()
    }),
  }
}

Object.assign(globalThis, {
  chrome: {
    storage: {
      local: makeStorage(__localStore),
      sync: makeStorage(__syncStore),
    },
  },
})

beforeEach(() => {
  for (const k of Object.keys(__localStore)) delete __localStore[k]
  for (const k of Object.keys(__syncStore)) delete __syncStore[k]
  vi.clearAllMocks()
})