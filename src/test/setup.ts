import '@testing-library/jest-dom/vitest'

const __storage: Record<string, any> = {}

const mockStorage = {
  get: vi.fn((keys?: string | string[] | Record<string, any> | null) => {
    if (keys === null) return Promise.resolve({ ...__storage })
    const keysArr = Array.isArray(keys) ? keys : [keys]
    const result: Record<string, any> = {}
    for (const k of keysArr) {
      if (k in __storage) result[k] = __storage[k]
    }
    return Promise.resolve(result)
  }),
  set: vi.fn((items: Record<string, any>) => {
    Object.assign(__storage, items)
    return Promise.resolve()
  }),
  remove: vi.fn((keys: string | string[]) => {
    const keysArr = Array.isArray(keys) ? keys : [keys]
    for (const k of keysArr) delete __storage[k]
    return Promise.resolve()
  }),
}

Object.assign(globalThis, {
  chrome: {
    storage: {
      local: mockStorage,
    },
  },
})

beforeEach(() => {
  Object.keys(__storage).forEach((k) => delete __storage[k])
  vi.clearAllMocks()
})
