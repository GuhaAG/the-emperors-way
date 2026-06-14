// Hide Fextralife links in search results for Google, Bing, DuckDuckGo

(function() {
  'use strict';

  // Result card selectors per search engine
  const SELECTORS = {
    google: '.g',
    bing: '.b_algo',
    duckduckgo: 'article[data-testid="result"]'
  };

  // Check if storage allows filtering
  function shouldFilter() {
    return new Promise((resolve) => {
      chrome.storage.local.get({ filterEnabled: true }, (result) => {
        resolve(result.filterEnabled);
      });
    });
  }

  // Hide a result card element
  function hideElement(element) {
    if (element && !element.dataset.hiddenByRedirector) {
      element.style.display = 'none';
      element.dataset.hiddenByRedirector = 'true';
    }
  }

  // Find the closest ancestor that matches a result card selector
  function findResultCard(element) {
    if (!element) return null;
    // Check if element itself matches any selector
    for (const engine in SELECTORS) {
      if (element.matches(SELECTORS[engine])) {
        return element;
      }
    }
    // Otherwise check parents
    return element.closest(Object.values(SELECTORS).join(', '));
  }

  // Process all Fextralife links on the page
  function processPage() {
    const links = document.querySelectorAll('a[href*="roguetrader.wiki.fextralife.com"]');
    links.forEach(link => {
      const resultCard = findResultCard(link);
      if (resultCard) {
        hideElement(resultCard);
      }
    });
  }

  // Mutation observer for dynamically loaded content
  function setupObserver() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          // Check if the added node is a link or contains links
          if (node.matches && node.matches('a[href*="roguetrader.wiki.fextralife.com"]')) {
            const resultCard = findResultCard(node);
            if (resultCard) hideElement(resultCard);
          } else {
            // Node might be a container; check inside for links
            const links = node.querySelectorAll ? node.querySelectorAll('a[href*="roguetrader.wiki.fextralife.com"]') : [];
            links.forEach(link => {
              const resultCard = findResultCard(link);
              if (resultCard) hideElement(resultCard);
            });
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Initialize
  async function init() {
    const enabled = await shouldFilter();
    if (!enabled) return;
    processPage();
    setupObserver();
  }

  init();
})();