import type { StyleMap } from '@/types'

const STORAGE_KEY_PREFIX = 'novastyle_'

export async function getStyles(domain: string): Promise<StyleMap | null> {
  const key = STORAGE_KEY_PREFIX + domain
  try {
    const result = await chrome.storage.local.get(key)
    return (result as Record<string, { styles: StyleMap } | undefined>)[key]?.styles ?? null
  } catch {
    return null
  }
}

export async function saveStyles(domain: string, styles: StyleMap): Promise<void> {
  const key = STORAGE_KEY_PREFIX + domain
  try {
    await chrome.storage.local.set({
      [key]: { styles, updatedAt: Date.now() },
    })
  } catch {
    // storage write failed silently
  }
}

export async function removeDomainStyles(domain: string): Promise<void> {
  const key = STORAGE_KEY_PREFIX + domain
  try {
    await chrome.storage.local.remove(key)
  } catch {
    // storage remove failed silently
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

export function extractDomain(url: string): string {
  return new URL(url).hostname.replace(/^www\./, '')
}
