## 🐛 Bug Fix Release - v1.0.1

### Fixed
- **Critical:** Fixed "plugin_export is not a function" error when installing on Steam Deck
  - Removed `definePlugin()` wrapper that was causing compatibility issues
  - Plugin now exports directly as Decky Loader expects

### Installation

**Quick Install:**
```
https://github.com/maroun2/steam-deck-game-tags/releases/download/v1.0.1/game-progress-tracker-v1.0.1.zip
```

**Or visit:** https://maroun2.github.io/steam-deck-game-tags/

### How to Update

If you installed v1.0.0:
1. Uninstall the old version from Decky
2. Install v1.0.1 using the URL above
3. Your settings and tags will be preserved

### Verification

After installing v1.0.1, the plugin should:
- ✅ Appear in Decky menu without errors
- ✅ Show settings panel when clicked
- ✅ No console errors

If you still see errors, please report at: https://github.com/maroun2/steam-deck-game-tags/issues

---

### Full Changelog
- Fix plugin export format for Decky Loader compatibility
- Update build artifacts

**Previous version (v1.0.0) will not work - please use v1.0.1 or later.**
