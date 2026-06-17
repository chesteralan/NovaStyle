import { getStyles, saveStyles, removeDomainStyles, getAllDomains, extractDomain } from '../db'
import browser from 'webextension-polyfill'

describe('extractDomain', () => {
  it('extracts hostname from full URL', () => {
    expect(extractDomain('https://www.example.com/page')).toBe('example.com')
  })

  it('strips www prefix', () => {
    expect(extractDomain('https://www.github.com')).toBe('github.com')
  })

  it('handles URLs without www', () => {
    expect(extractDomain('https://developer.mozilla.org/en-US/')).toBe('developer.mozilla.org')
  })
})

describe('getStyles / saveStyles', () => {
  it('returns null when no styles saved', async () => {
    const result = await getStyles('example.com')
    expect(result).toBeNull()
  })

  it('saves and retrieves styles', async () => {
    const styles = { '.title': { color: 'red' } }
    await saveStyles('example.com', styles)
    const result = await getStyles('example.com')
    expect(result).toEqual(styles)
  })

  it('returns null for wrong domain', async () => {
    await saveStyles('example.com', { '.a': { color: 'red' } })
    const result = await getStyles('other.com')
    expect(result).toBeNull()
  })

  it('saves with timestamp', async () => {
    await saveStyles('example.com', { '.b': { color: 'blue' } })
    const key = 'novastyle_example.com'
    const data = (await browser.storage.local.get(key)) as Record<string, { updatedAt: number; styles: unknown }>
    expect(data[key].updatedAt).toBeGreaterThan(0)
    expect(typeof data[key].updatedAt).toBe('number')
  })
})

describe('removeDomainStyles', () => {
  it('removes saved styles for a domain', async () => {
    await saveStyles('example.com', { '.c': { color: 'green' } })
    await removeDomainStyles('example.com')
    const result = await getStyles('example.com')
    expect(result).toBeNull()
  })

  it('does not affect other domains', async () => {
    await saveStyles('alpha.com', { '.x': { color: 'red' } })
    await saveStyles('beta.com', { '.x': { color: 'blue' } })
    await removeDomainStyles('alpha.com')
    const beta = await getStyles('beta.com')
    expect(beta).toEqual({ '.x': { color: 'blue' } })
  })
})

describe('getAllDomains', () => {
  it('returns empty array when no stored domains', async () => {
    const domains = await getAllDomains()
    expect(domains).toEqual([])
  })

  it('lists all stored domains', async () => {
    await saveStyles('a.com', {})
    await saveStyles('b.com', {})
    const domains = await getAllDomains()
    expect(domains.sort()).toEqual(['a.com', 'b.com'])
  })
})
