# The Emperor's Way

A Chrome extension that redirects [Fextralife's Rogue Trader wiki](https://roguetrader.wiki.fextralife.com) to the superior community-maintained wiki at [roguetrader.wh40k.wiki](https://roguetrader.wh40k.wiki), and hides Fextralife results from Google, Bing, and DuckDuckGo search results.

Follows the pattern of [BG3 Wiki Redirector](https://chromewebstore.google.com/detail/bg3-wiki-redirector/cneoaeflopkdipcaiiojfenbcedebgei) and [PoE 1 & 2 Wiki Redirector](https://chromewebstore.google.com/detail/poe-1-2-wiki-redirector/kjbchcbdhmghkfpbehiomljpadlnmhdk).

## Features

- **Page redirect** — any navigation to `roguetrader.wiki.fextralife.com` is immediately sent to the equivalent page on `roguetrader.wh40k.wiki`
- **Search result filtering** — Fextralife result cards are hidden on Google, Bing, and DuckDuckGo
- **Popup UI** — toggle each feature independently; quick-search the community wiki from the toolbar

Both features default to **on**.

## Installation

This extension is not yet on the Chrome Web Store. Load it manually:

1. Clone or download this repository
2. Open `chrome://extensions`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select the `the-emperors-way/` directory

## Usage

Click the extension icon in the toolbar to open the popup:

| Control | Effect |
|---|---|
| Toggle: Redirect Fextralife pages | Enables/disables the URL redirect |
| Toggle: Hide Fextralife in search results | Enables/disables SERP filtering |
| Search box (press Enter) | Opens `roguetrader.wh40k.wiki/?search=…` in a new tab |

## Technical notes

Built with Manifest V3. Uses `declarativeNetRequest` session rules for zero-latency redirects. The redirect carries the Fextralife URL path verbatim — `roguetrader.wh40k.wiki` accepts both `+` and `_` as space separators, so direct page mapping works without any transformation.

Permissions requested: `declarativeNetRequest`, `storage`.

## Future

- Submit a PR to [Indie Wiki Buddy](https://github.com/KevinPayravi/indie-wiki-buddy) to add Rogue Trader support
- Firefox support (MV3-compatible; minimal changes needed)
- Publish to Chrome Web Store
