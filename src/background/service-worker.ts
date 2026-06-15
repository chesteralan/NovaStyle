import type { BackgroundMessage } from '@/types'

const tabStates = new Map<number, 'active' | 'inactive'>()

chrome.action.onClicked.addListener(async (tab: chrome.tabs.Tab) => {
  const tabId = tab.id
  if (!tabId) return

  const current = tabStates.get(tabId) ?? 'inactive'
  const next: 'active' | 'inactive' = current === 'active' ? 'inactive' : 'active'
  tabStates.set(tabId, next)

  await chrome.action.setBadgeText({
    tabId,
    text: next === 'active' ? 'ON' : '',
  })
  await chrome.action.setBadgeBackgroundColor({
    tabId,
    color: '#3b82f6',
  })

  chrome.tabs.sendMessage(tabId, { type: 'TOGGLE_EXTENSION', state: next }).catch(() => {
    // content script not ready yet
  })
})

chrome.runtime.onMessage.addListener((message: unknown, _sender: chrome.runtime.MessageSender, sendResponse: (response?: unknown) => void) => {
  const msg = message as BackgroundMessage
  if (msg.type === 'GET_STYLES') {
    chrome.storage.local.get(msg.domain).then((result: unknown) => {
      sendResponse((result as Record<string, unknown>)[msg.domain] ?? null)
    })
    return true
  }
  if (msg.type === 'SAVE_STYLES') {
    chrome.storage.local.set({
      [msg.domain]: { styles: msg.styles, updatedAt: Date.now() },
    })
  }
})
