document.addEventListener('DOMContentLoaded', () => {
  const redirectToggle = document.getElementById('redirectToggle');
  const filterToggle = document.getElementById('filterToggle');
  const searchBox = document.getElementById('searchBox');

  // Load current settings
  chrome.storage.local.get({
    redirectEnabled: true,
    filterEnabled: true
  }, (result) => {
    redirectToggle.checked = result.redirectEnabled;
    filterToggle.checked = result.filterEnabled;
  });

  // Save redirect setting
  redirectToggle.addEventListener('change', () => {
    chrome.storage.local.set({ redirectEnabled: redirectToggle.checked });
  });

  // Save filter setting
  filterToggle.addEventListener('change', () => {
    chrome.storage.local.set({ filterEnabled: filterToggle.checked });
  });

  // Quick search
  searchBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = searchBox.value.trim();
      if (query) {
        const url = `https://roguetrader.wh40k.wiki/?search=${encodeURIComponent(query)}`;
        chrome.tabs.create({ url });
        searchBox.value = '';
      }
    }
  });
});