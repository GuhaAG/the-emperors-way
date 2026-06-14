// Hide Fextralife links in search results for Google, Bing, DuckDuckGo

(function() {
  'use strict';

  // Known result container IDs — direct children are individual result cards
  const RESULT_CONTAINER_IDS = ['rso', 'search', 'b_results'];

  // Card-level selectors to try first (fastest path)
  const CARD_SELECTORS = [
    '.g',                             // Google classic
    '[data-hveid]',                   // Google modern (result tracking attribute)
    '.b_algo',                        // Bing
    'article[data-testid="result"]',  // DuckDuckGo
  ].join(', ');

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

  // Find the result card element containing this anchor
  function findResultCard(element) {
    if (!element) return null;

    // Try known card selectors first
    const card = element.closest(CARD_SELECTORS);
    if (card) return card;

    // Fallback: walk up to find a direct child of a known results container
    let el = element.parentElement;
    while (el && el !== document.body) {
      const parent = el.parentElement;
      if (parent && RESULT_CONTAINER_IDS.includes(parent.id)) {
        return el;
      }
      el = parent;
    }

    return null;
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