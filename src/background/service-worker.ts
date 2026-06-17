import browser from 'webextension-polyfill'
import type { Tabs, Runtime } from 'webextension-polyfill'
import type { BackgroundMessage } from '@/types'

const tabStates = new Map<number, 'active' | 'inactive'>()

browser.action.onClicked.addListener(async (tab: Tabs.Tab) => {
  const tabId = tab.id
  if (!tabId) return

  const current = tabStates.get(tabId) ?? 'inactive'
  const next: 'active' | 'inactive' = current === 'active' ? 'inactive' : 'active'
  tabStates.set(tabId, next)

  await browser.action.setBadgeText({
    tabId,
    text: next === 'active' ? 'ON' : '',
  })
  await browser.action.setBadgeBackgroundColor({
    tabId,
    color: '#3b82f6',
  })

  browser.tabs.sendMessage(tabId, { type: 'TOGGLE_EXTENSION', state: next }).catch(() => {
    // tab may have been closed before message delivered
  })
})

browser.runtime.onMessage.addListener((message: unknown, _sender: Runtime.MessageSender) => {
  const msg = message as BackgroundMessage
  if (msg.type === 'GET_STYLES') {
    return browser.storage.local.get(msg.domain).then((result) => {
      return (result as Record<string, unknown>)[msg.domain] ?? null
    })
  }
  if (msg.type === 'SAVE_STYLES') {
    return browser.storage.local.set({
      [msg.domain]: { styles: msg.styles, updatedAt: Date.now() },
    })
  }
})
