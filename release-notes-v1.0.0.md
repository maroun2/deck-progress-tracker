## 🎮 Game Progress Tracker v1.0.0

**First stable release!** Automatic game tagging for your Steam Deck library.

---

### 📦 Installation

**Option 1: Quick Install (Recommended)**

Visit the install page: **https://maroun2.github.io/steam-deck-game-tags/**

**Option 2: Direct URL**

1. Enable Developer Mode in Decky Loader settings
2. Go to Developer tab → Install Plugin from URL
3. Enter this URL:
```
https://github.com/maroun2/steam-deck-game-tags/releases/download/v1.0.0/game-progress-tracker-v1.0.0.zip
```
4. Click Install

---

### ✨ Features

- 🎯 **Automatic Tagging:** Games tagged as Completed, In Progress, or Mastered
- ⏱️ **HowLongToBeat Integration:** Uses real completion time data
- 🏆 **Achievement Tracking:** Detects 100% achievement completion
- ✏️ **Manual Override:** Set any tag manually with visual indicator
- 📊 **Statistics Dashboard:** Track your library progress
- ⚙️ **Configurable Thresholds:** Customize to your preferences
- 🎨 **Beautiful UI:** Gradient badges displayed on game pages

---

### 🏷️ Tag Definitions

- **🟢 Completed:** 100% of achievements unlocked
- **🔵 In Progress:** Played for at least 1 hour (configurable)
- **🟣 Mastered:** Playtime exceeds 1.5× HowLongToBeat time (configurable)

---

### 🚀 First Time Setup

1. Install the plugin using URL above
2. Open plugin settings from Decky menu
3. Click "Sync Entire Library"
4. Wait for sync to complete (5-30 minutes depending on library size)
5. Navigate to game pages to see tags!

**Note:** The plugin respects HLTB rate limits (1 request per second), so initial sync may take time.

---

### 📋 Requirements

- Steam Deck with Decky Loader installed
- Internet connection (for HowLongToBeat data)
- Developer mode enabled in Decky Loader

---

### 🐛 Known Issues

- None yet! This is the first release.
- Please report any bugs you find at the issue tracker

---

### 🔧 Technical Details

- **Backend:** Python 3 with aiosqlite, howlongtobeatpy, VDF parsing
- **Frontend:** TypeScript/React with Decky Frontend Library
- **Database:** SQLite for persistent storage
- **Size:** 39KB zip file
- **Files:** 22 components

---

### 📚 Documentation

- **Install Page:** https://maroun2.github.io/steam-deck-game-tags/
- **Full Guide:** https://github.com/maroun2/steam-deck-game-tags/blob/main/README.md
- **Deployment:** https://github.com/maroun2/steam-deck-game-tags/blob/main/GITHUB_DEPLOYMENT.md

---

### 💬 Support

- **Report Issues:** https://github.com/maroun2/steam-deck-game-tags/issues
- **Discussions:** https://github.com/maroun2/steam-deck-game-tags/discussions
- **Decky Discord:** https://deckbrew.xyz/discord

---

### 🙏 Credits

- **HowLongToBeat Data:** https://howlongtobeat.com
- **Decky Loader:** https://decky.xyz
- **Python HLTB Library:** howlongtobeatpy by ScrappyCocco

---

### 📄 License

MIT License - See LICENSE file for details

---

**Enjoy tracking your game progress! 🎮**