chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ extensionIsActive: false });
});

chrome.action.onClicked.addListener(async (tab) => {
  const { extensionIsActive } = await chrome.storage.local.get(['extensionIsActive']);
  const nextState = !extensionIsActive;

  await chrome.storage.local.set({ extensionIsActive: nextState });
  await chrome.action.setBadgeText({ tabId: tab.id, text: nextState ? 'ON' : '' });

  try {
    await chrome.tabs.sendMessage(tab.id, { action: 'TOGGLE_INSPECTOR', isActive: nextState });
  } catch (e) {
    console.error("Failed to send message. Please reload the page and try again.", e);
  }
});

chrome.runtime.onMessage.addListener(async (request, sender) => {
  if (request.action === "DEACTIVATE_INSPECTOR") {
    await chrome.storage.local.set({ extensionIsActive: false });
    await chrome.action.setBadgeText({ tabId: sender.tab.id, text: '' });
  }
});