console.log('NovaStyle service worker loaded')

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

  chrome.tabs.sendMessage(tabId, { type: 'TOGGLE_EXTENSION', state: next })
})

chrome.runtime.onMessage.addListener((message: any, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
  switch (message.type) {
    case 'GET_STYLES': {
      chrome.storage.local.get(message.domain).then((result: any) => {
        sendResponse(result[message.domain] ?? null)
      })
      return true
    }
    case 'SAVE_STYLES': {
      chrome.storage.local.set({
        [message.domain]: { styles: message.styles, updatedAt: Date.now() },
      })
      break
    }
  }
})
