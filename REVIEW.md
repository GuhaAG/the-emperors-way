# Code Review — the-emperors-way

---

## Pass 1 (original)

### Bug 1 — Missing `tabs` permission (`manifest.json`) ~~[RETRACTED — see Pass 2]~~

`popup.js` calls `chrome.tabs.create({ url })` to open wiki search results, but `"tabs"` is not declared in the manifest `permissions` array.

> **Retracted in Pass 2.** `chrome.tabs.create` does NOT require the `tabs` permission. Only reading sensitive tab properties (url, title, favIconUrl) needs it. The fix attempt was unnecessary and introduced a new bug (see Pass 2 §1).

---

### Bug 2 — Rule ID collision in `background.js` ✅ FIXED

`updateRedirectRule(true)` was calling `addRules` without first removing the existing rule, risking a `RULE_ID_ALREADY_EXISTS` throw. Fixed — `background.js` now includes `removeRuleIds: [REDIRECT_RULE.id]` alongside `addRules`.

---

### Minor — Stale directory name in `DESIGN.md` (line 30) ⚠️ STILL OPEN

File tree still shows `rogue-trader-wiki-redirector/` — should be `the-emperors-way/`.

---

## Pass 2

### Bug A — CRITICAL: `manifest.json` is malformed JSON (introduced by Pass 1 fix attempt)

The attempt to add `"tabs"` to `manifest.json` left a syntax error. Lines 8–10 now read:

```json
    "storage",
    "tabs"]
  ],
```

The `]` on line 9 closes the array prematurely, and the `],` on line 10 is a dangling bracket. This is invalid JSON — Chrome will refuse to load the extension entirely, with an error like `Manifest file is invalid`.

**Fix:** Remove `"tabs"` (not needed) and correct the array syntax back to:

```json
"permissions": [
  "declarativeNetRequest",
  "storage"
]
```

---

### Bug B — `keypress` event is deprecated (`popup.js` line 26)

```js
searchBox.addEventListener('keypress', (e) => {
```

`keypress` was deprecated and is no longer part of the web standard. It still fires in current Chrome but could stop working in future versions. Replace with `keydown`:

```js
searchBox.addEventListener('keydown', (e) => {
```

Behaviour is identical for this use case.

---

### Minor — Stray source image in `icons/`

`icons/Gemini_Generated_Image_szdhb3szdhb3szdh.png` is a leftover source file and should not be in the extension directory. It won't break anything but inflates the package size and is messy. Move it to `scripts/` or delete it.

---

## Pass 3

### Pass 2 Bug A — malformed `manifest.json` ❌ STILL OPEN

Unchanged. Lines 8–10 still read:

```json
    "storage",
    "tabs"]
  ],
```

The premature `]` on line 9 and the dangling `],` on line 10 make the file invalid JSON. Chrome still cannot load the extension.

---

### Pass 2 Bug B — deprecated `keypress` in `popup.js` ❌ STILL OPEN

`searchBox.addEventListener('keypress', ...)` at line 26 is unchanged.

---

### Pass 2 Minor — stray PNG in `icons/` ⚠️ STILL OPEN

`icons/Gemini_Generated_Image_szdhb3szdhb3szdh.png` is still present.

---

### Pass 1 Minor — stale directory name in `DESIGN.md` ⚠️ STILL OPEN

Line 30 of `DESIGN.md` still shows `rogue-trader-wiki-redirector/`.

---

### New — `addRules` indentation in `background.js` (line 19)

```js
    chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds: [REDIRECT_RULE.id],
addRules: [REDIRECT_RULE]
    });
```

`addRules` is flush-left while everything around it is indented two levels. This is a cosmetic artifact of the earlier edit that fixed the rule ID collision. Not a runtime issue.

---

## Pass 4

### Pass 2 Bug A — malformed `manifest.json` ✅ FIXED

`"tabs"` has been removed and the JSON bracket is correct again. `manifest.json` is now valid and the extension will load.

---

### Pass 1 Minor — stale directory name in `DESIGN.md` — PARTIALLY FIXED, NEW CORRUPTION INTRODUCED

The directory name was updated from `rogue-trader-wiki-redirector/` to `the-emperors-way/`, which is correct. However the edit that made that change corrupted the surrounding lines. Lines 30–33 of `DESIGN.md` now read:

```
the-emperors-way/ 31: └── icons/ \n  42:   icon16.png
  43:   icon48.png
  44:   icon128.png
  45: }}
```

Line 30 has Read-tool line-number output (`31: └── icons/ \n  42:   icon16.png`) spliced directly into the markdown. Lines 31–33 continue the garbage. The file tree block is broken and unreadable from line 30 through 33.

---

### Pass 2 Bug B — deprecated `keypress` in `popup.js` ❌ STILL OPEN

Unchanged. Line 26 still uses `keypress`.

---

### Pass 2 Minor — stray PNG in `icons/` ⚠️ STILL OPEN

`Gemini_Generated_Image_szdhb3szdhb3szdh.png` still present.

---

### Pass 3 Nit — `addRules` indentation in `background.js` ⚠️ STILL OPEN

Line 19 still flush-left.

---

## Pass 5

### Pass 2 Bug B — deprecated `keypress` in `popup.js` ✅ FIXED

Line 26 now uses `keydown`. Correct.

---

### Pass 3 Nit — `addRules` indentation in `background.js` ✅ FIXED

Line 19 is now properly indented to match `removeRuleIds`.

---

### Pass 4 — corrupted file tree in `DESIGN.md` ✅ FIXED

Lines 30–33 are clean. The file tree reads correctly with `the-emperors-way/` at the top and no garbage content.

---

### Pass 2 Minor — stray PNG in `icons/` ✅ FIXED

`Gemini_Generated_Image_szdhb3szdhb3szdh.png` is gone. Directory now contains only the three required icons.

---

### New findings: none.

All files reviewed. No new issues found.

---

## Status Summary

| Item | Status |
|---|---|
| Pass 1 Bug 1 — `tabs` permission | Retracted (false positive); fix attempt introduced Bug A |
| Pass 1 Bug 2 — rule ID collision | ✅ Fixed |
| Pass 1 Minor — stale dir name in DESIGN.md | ✅ Fixed (corruption from fix attempt also resolved in Pass 5) |
| Pass 2 Bug A — malformed `manifest.json` JSON | ✅ Fixed |
| Pass 2 Bug B — deprecated `keypress` in `popup.js` | ✅ Fixed |
| Pass 2 Minor — stray PNG in `icons/` | ✅ Fixed |
| Pass 3 Nit — `addRules` indentation in `background.js` | ✅ Fixed |
| Pass 4 — corrupted file tree in `DESIGN.md` | ✅ Fixed |

**All issues resolved. Extension is clean.**
