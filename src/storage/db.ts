import type { StyleMap } from '@/types'

const STORAGE_KEY_PREFIX = 'novastyle_'

export async function getStyles(domain: string): Promise<StyleMap | null> {
  const key = STORAGE_KEY_PREFIX + domain
  return new Promise((resolve) => {
    chrome.storage.local.get(key).then((result: any) => {
      resolve(result[key]?.styles ?? null)
    })
  })
}

export async function saveStyles(domain: string, styles: StyleMap): Promise<void> {
  const key = STORAGE_KEY_PREFIX + domain
  await chrome.storage.local.set({
    [key]: { styles, updatedAt: Date.now() },
  })
}

export async function removeDomainStyles(domain: string): Promise<void> {
  const key = STORAGE_KEY_PREFIX + domain
  await chrome.storage.local.remove(key)
}

export async function getAllDomains(): Promise<string[]> {
  const all = await chrome.storage.local.get(null)
  return Object.keys(all)
    .filter((k) => k.startsWith(STORAGE_KEY_PREFIX))
    .map((k) => k.slice(STORAGE_KEY_PREFIX.length))
}

export function extractDomain(url: string): string {
  return new URL(url).hostname.replace(/^www\./, '')
}
