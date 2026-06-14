const REDIRECT_RULE = {
  id: 1,
  action: {
    type: "redirect",
    redirect: {
      regexSubstitution: "https://roguetrader.wh40k.wiki/?search=\\1"
    }
  },
  condition: {
    regexFilter: "^https?://roguetrader\\.wiki\\.fextralife\\.com/(.*)",
    resourceTypes: ["main_frame"]
  }
};

function updateRedirectRule(enabled) {
  if (enabled) {
    chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds: [REDIRECT_RULE.id],
      addRules: [REDIRECT_RULE]
    });
  } else {
    chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds: [REDIRECT_RULE.id]
    });
  }
}

function initialize() {
  chrome.storage.local.get({ redirectEnabled: true }, (result) => {
    updateRedirectRule(result.redirectEnabled);
  });
}

chrome.runtime.onInstalled.addListener(initialize);
chrome.runtime.onStartup.addListener(initialize);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.redirectEnabled) {
    updateRedirectRule(changes.redirectEnabled.newValue);
  }
});