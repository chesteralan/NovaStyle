import type { StyleMap, NovaStyleSettings } from '@/types'

const STORAGE_KEY_PREFIX = 'novastyle_'
const SETTINGS_KEY = 'novastyle_settings'

export type { NovaStyleSettings }

export interface DomainMeta {
  domain: string
  styles: StyleMap
  updatedAt: number
}

interface StoredData {
  styles: StyleMap
  updatedAt: number
  versions?: Array<{ styles: StyleMap; timestamp: number }>
}

const defaultSettings: NovaStyleSettings = {
  defaultPosition: 'right',
  panelWidth: 320,
  theme: 'light',
  visibleEditors: {
    classInput: true,
    boxModel: true,
    typography: true,
    colorPicker: true,
    borderEditor: true,
    effectsEditor: true,
    layoutEditor: true,
    flexboxEditor: true,
    transformEditor: true,
    gridEditor: true,
    backgroundEditor: true,
    filterEditor: true,
    textDecorationEditor: true,
    outlineEditor: true,
    cursorEditor: true,
    fontDetector: true,
    classResolver: true,
    responsivePreview: true,
    customCSS: true,
    colorPalette: true,
  },
  useSync: false,
  ignoredDomains: [],
}

function storageArea(useSync?: boolean): chrome.storage.StorageArea {
  return useSync ? chrome.storage.sync : chrome.storage.local
}

function domainKey(domain: string): string {
  return STORAGE_KEY_PREFIX + domain
}

function enabledKey(domain: string): string {
  return STORAGE_KEY_PREFIX + domain + '_enabled'
}

export async function getSettings(): Promise<NovaStyleSettings> {
  try {
    const result = await chrome.storage.local.get(SETTINGS_KEY)
    const saved = (result as Record<string, Partial<NovaStyleSettings> | undefined>)[SETTINGS_KEY]
    if (!saved) return { ...defaultSettings }
    return {
      defaultPosition: saved.defaultPosition ?? defaultSettings.defaultPosition,
      panelWidth: saved.panelWidth ?? defaultSettings.panelWidth,
      theme: saved.theme ?? defaultSettings.theme,
      visibleEditors: {
        classInput: saved.visibleEditors?.classInput ?? defaultSettings.visibleEditors.classInput,
        boxModel: saved.visibleEditors?.boxModel ?? defaultSettings.visibleEditors.boxModel,
        typography: saved.visibleEditors?.typography ?? defaultSettings.visibleEditors.typography,
        colorPicker: saved.visibleEditors?.colorPicker ?? defaultSettings.visibleEditors.colorPicker,
        borderEditor: saved.visibleEditors?.borderEditor ?? defaultSettings.visibleEditors.borderEditor,
        effectsEditor: saved.visibleEditors?.effectsEditor ?? defaultSettings.visibleEditors.effectsEditor,
        layoutEditor: saved.visibleEditors?.layoutEditor ?? defaultSettings.visibleEditors.layoutEditor,
        flexboxEditor: saved.visibleEditors?.flexboxEditor ?? defaultSettings.visibleEditors.flexboxEditor,
        transformEditor: saved.visibleEditors?.transformEditor ?? defaultSettings.visibleEditors.transformEditor,
        gridEditor: saved.visibleEditors?.gridEditor ?? defaultSettings.visibleEditors.gridEditor,
        backgroundEditor: saved.visibleEditors?.backgroundEditor ?? defaultSettings.visibleEditors.backgroundEditor,
        filterEditor: saved.visibleEditors?.filterEditor ?? defaultSettings.visibleEditors.filterEditor,
        textDecorationEditor: saved.visibleEditors?.textDecorationEditor ?? defaultSettings.visibleEditors.textDecorationEditor,
        outlineEditor: saved.visibleEditors?.outlineEditor ?? defaultSettings.visibleEditors.outlineEditor,
        cursorEditor: saved.visibleEditors?.cursorEditor ?? defaultSettings.visibleEditors.cursorEditor,
        fontDetector: saved.visibleEditors?.fontDetector ?? defaultSettings.visibleEditors.fontDetector,
        classResolver: saved.visibleEditors?.classResolver ?? defaultSettings.visibleEditors.classResolver,
        responsivePreview: saved.visibleEditors?.responsivePreview ?? defaultSettings.visibleEditors.responsivePreview,
        customCSS: saved.visibleEditors?.customCSS ?? defaultSettings.visibleEditors.customCSS,
        colorPalette: saved.visibleEditors?.colorPalette ?? defaultSettings.visibleEditors.colorPalette,
      },
      useSync: saved.useSync ?? defaultSettings.useSync,
      ignoredDomains: saved.ignoredDomains ?? defaultSettings.ignoredDomains,
    }
  } catch {
    return { ...defaultSettings }
  }
}

export async function saveSettings(settings: NovaStyleSettings): Promise<void> {
  try {
    await chrome.storage.local.set({ [SETTINGS_KEY]: settings })
  } catch {
    // storage write failed silently
  }
}

export async function getStyles(domain: string): Promise<StyleMap | null> {
  const key = domainKey(domain)
  try {
    const area = await getSettings()
    const result = await storageArea(area.useSync).get(key)
    return (result as Record<string, { styles: StyleMap } | undefined>)[key]?.styles ?? null
  } catch {
    return null
  }
}

export async function saveStyles(domain: string, styles: StyleMap): Promise<void> {
  const key = domainKey(domain)
  try {
    const existing = await chrome.storage.local.get(key)
    const existingData = (existing as Record<string, StoredData | undefined>)[key]
    const versions = existingData?.versions ?? []
    if (existingData?.styles && Object.keys(existingData.styles).length > 0) {
      versions.push({ styles: existingData.styles, timestamp: existingData.updatedAt })
    }
    if (versions.length > 20) versions.splice(0, versions.length - 20)
    const data = { styles, updatedAt: Date.now(), versions }
    await chrome.storage.local.set({ [key]: data } satisfies Record<string, StoredData>)
    const settings = await getSettings()
    if (settings.useSync) {
      await chrome.storage.sync.set({ [key]: { styles, updatedAt: Date.now() } })
    }
  } catch {
    // storage write failed silently
  }
}

export async function removeDomainStyles(domain: string): Promise<void> {
  const key = domainKey(domain)
  try {
    await chrome.storage.local.remove(key)
    await chrome.storage.sync.remove(key)
  } catch {
    // storage remove failed silently
  }
}

export async function isDomainEnabled(domain: string): Promise<boolean> {
  try {
    const key = enabledKey(domain)
    const result = await chrome.storage.local.get(key)
    const val = (result as Record<string, boolean | undefined>)[key]
    return val !== false
  } catch {
    return true
  }
}

export async function setDomainEnabled(domain: string, enabled: boolean): Promise<void> {
  try {
    await chrome.storage.local.set({ [enabledKey(domain)]: enabled })
  } catch {
    // silent
  }
}

export async function isDomainIgnored(domain: string): Promise<boolean> {
  try {
    const settings = await getSettings()
    return (settings.ignoredDomains ?? []).includes(domain)
  } catch {
    return false
  }
}

export async function getAllDomains(): Promise<string[]> {
  try {
    const all = await chrome.storage.local.get(null)
    return Object.keys(all as Record<string, unknown>)
      .filter((k) => k.startsWith(STORAGE_KEY_PREFIX))
      .map((k) => k.slice(STORAGE_KEY_PREFIX.length))
  } catch {
    return []
  }
}

export async function getAllDomainsWithMeta(): Promise<DomainMeta[]> {
  try {
    const all = await chrome.storage.local.get(null)
    return (Object.entries(all as Record<string, unknown>) as [string, StoredData][])
      .filter(([k]) => k.startsWith(STORAGE_KEY_PREFIX))
      .map(([k, v]) => ({
        domain: k.slice(STORAGE_KEY_PREFIX.length),
        styles: v.styles ?? {},
        updatedAt: v.updatedAt ?? 0,
      }))
  } catch {
    return []
  }
}

export async function getVersions(
  domain: string,
): Promise<Array<{ styles: StyleMap; timestamp: number }>> {
  const key = STORAGE_KEY_PREFIX + domain
  try {
    const result = await chrome.storage.local.get(key)
    const data = (result as Record<string, StoredData | undefined>)[key]
    return data?.versions ?? []
  } catch {
    return []
  }
}

export async function revertToVersion(domain: string, index: number): Promise<void> {
  const key = STORAGE_KEY_PREFIX + domain
  try {
    const result = await chrome.storage.local.get(key)
    const data = (result as Record<string, StoredData | undefined>)[key]
    if (!data?.versions?.length || !data.versions[index]) return
    const target = data.versions[index]
    data.versions.push({ styles: data.styles, timestamp: data.updatedAt })
    if (data.versions.length > 20) data.versions.splice(0, data.versions.length - 20)
    data.styles = target.styles
    data.updatedAt = Date.now()
    await chrome.storage.local.set({ [key]: data })
  } catch {
    // silent
  }
}

export async function renameDomain(oldDomain: string, newDomain: string): Promise<boolean> {
  const oldKey = STORAGE_KEY_PREFIX + oldDomain
  const newKey = STORAGE_KEY_PREFIX + newDomain
  try {
    const result = await chrome.storage.local.get(oldKey)
    const data = (result as Record<string, StoredData | undefined>)[oldKey]
    if (!data) return false
    const existing = await chrome.storage.local.get(newKey) as Record<string, unknown>
    if (existing[newKey]) return false
    await chrome.storage.local.set({ [newKey]: data })
    await chrome.storage.local.remove(oldKey)
    return true
  } catch {
    return false
  }
}

export function extractDomain(url: string): string {
  return new URL(url).hostname.replace(/^www\./, '')
}
