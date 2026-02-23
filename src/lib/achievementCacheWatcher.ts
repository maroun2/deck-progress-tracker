/**
 * Achievement Cache Watcher
 * Monitors URL changes and syncs achievements when user views "Your Stuff" tab
 */

import { syncSingleGameWithFrontendData } from './syncUtils';

const log = (msg: string, data?: any) => {
  const logMsg = `[DeckProgressTracker][achievementCacheWatcher] ${msg}`;
  if (data !== undefined) {
    console.log(logMsg, data);
  } else {
    console.log(logMsg);
  }
};

let lastUrl = '';
let syncTimeout: NodeJS.Timeout | null = null;

/**
 * Start watching for URL changes to detect when user views achievements
 */
export function startAchievementCacheWatcher() {
  log('Starting achievement cache watcher');

  // Poll for URL changes every 500ms
  setInterval(() => {
    const currentUrl = window.location.href;

    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;

      // Check if user opened "Your Stuff" tab (where achievements are shown)
      const yourStuffMatch = currentUrl.match(/\/library\/app\/(\d+)\/tab\/YourStuff/);

      if (yourStuffMatch) {
        const appid = yourStuffMatch[1];
        log(`Detected achievements tab for ${appid}`);

        // Clear any pending sync
        if (syncTimeout) {
          clearTimeout(syncTimeout);
        }

        // Wait for Steam to populate the achievement cache
        // Poll the cache with exponential backoff up to 10 seconds
        syncTimeout = setTimeout(async () => {
          const achievementCache = (window as any).appAchievementProgressCache;
          const mapCache = achievementCache?.m_achievementProgress?.mapCache;

          if (!mapCache) {
            log(`${appid}: mapCache not available`);
            return;
          }

          // Poll with exponential backoff: 500ms, 1s, 2s, 3s, 3s (total ~10s max)
          const delays = [500, 1000, 2000, 3000, 3000];
          let foundData = false;

          for (let i = 0; i < delays.length; i++) {
            await new Promise(resolve => setTimeout(resolve, delays[i]));

            const entry = mapCache.get(parseInt(appid));

            if (entry && entry.total > 0) {
              log(`${appid}: Achievements loaded (${entry.unlocked}/${entry.total})`);
              foundData = true;
              break;
            }
          }

          if (foundData) {
            try {
              await syncSingleGameWithFrontendData(appid);
              log(`${appid}: Sync complete`);
            } catch (e: any) {
              log(`${appid}: Sync failed - ${e.message}`);
            }
          } else {
            log(`${appid}: Achievements not loaded after 10s`);
          }
        }, 100); // Start polling after 100ms initial delay
      }
    }
  }, 500);
}

/**
 * Stop watching for URL changes
 */
export function stopAchievementCacheWatcher() {
  log('Stopping achievement cache watcher');
  if (syncTimeout) {
    clearTimeout(syncTimeout);
    syncTimeout = null;
  }
}
