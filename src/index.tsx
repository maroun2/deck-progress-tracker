/**
 * Deck Progress Tracker - Main Plugin Entry
 * Decky Loader plugin for automatic game tagging
 *
 * Uses safe route patching pattern based on ProtonDB Badges plugin
 */

import { staticClasses } from '@decky/ui';
import { call, definePlugin, routerHook, toaster } from '@decky/api';
import React from 'react';
import { FaTrophy } from 'react-icons/fa';
import { MainPanel, SETTINGS_ROUTE } from './components/MainPanel';
import { SettingsPage } from './components/SettingsPage';
import patchLibraryApp from './lib/patchLibraryApp';
import { patchLibraryCapsules } from './lib/patchLibraryCapsules';
import { initLibraryBadgeStore } from './lib/libraryBadgeStore';
import { syncLibraryProgressive } from './lib/syncUtils';
import { startAchievementCacheWatcher, stopAchievementCacheWatcher } from './lib/achievementCacheWatcher';
import { startPlaySessionTracking } from './lib/playSessionTracker';

/**
 * Main Plugin Definition
 */
export default definePlugin(() => {
  // Patch the game library page using the safe ProtonDB-style approach.
  // On Decky Loader older than ~v3.3.1 this patch crashed Decky's entire UI
  // ("An error occurred while rendering this content"), so we check the
  // backend-reported Decky version first and skip patching on old versions
  // instead of showing that crash screen to the user.
  let libraryPatch: ReturnType<typeof patchLibraryApp> | null = null;
  let unpatchLibraryCapsules: (() => void) | null = null;
  let stopLibraryBadgeStore: (() => void) | null = null;
  let disposed = false;

  // Full-screen settings page, opened from the panel's Settings button
  routerHook.addRoute(SETTINGS_ROUTE, SettingsPage, { exact: true });

  (async () => {
    let compatible = true;
    let minVersion = '';
    let deckyVersion = '';

    try {
      const versionInfo = await call<[], { success: boolean; compatible: boolean; decky_version: string; min_version: string }>('get_decky_version_info');
      if (versionInfo && versionInfo.success) {
        compatible = versionInfo.compatible;
        minVersion = versionInfo.min_version;
        deckyVersion = versionInfo.decky_version;
      }
    } catch (error) {
      // If the version check itself fails, fall back to patching rather
      // than silently disabling the library integration for everyone.
    }

    if (!compatible) {
      toaster.toast({
        title: 'Deck Progress Tracker',
        body: `Requires Decky Loader v${minVersion} or newer (detected ${deckyVersion || 'unknown'}). Library page tags are disabled.`,
        duration: 8000,
      });
      return;
    }

    if (disposed) return;

    try {
      libraryPatch = patchLibraryApp();
    } catch (error) {
      // Failed to register library app patch
    }

    // Tag badges on every game capsule (library grid, collections, Home)
    try {
      stopLibraryBadgeStore = initLibraryBadgeStore();
      unpatchLibraryCapsules = patchLibraryCapsules();
      if (!unpatchLibraryCapsules) {
        call<[string, string], unknown>('log_frontend', 'warn', 'Library capsule component not found - library tile badges disabled').catch(() => {});
      }
    } catch (error) {
      call<[string, string], unknown>('log_frontend', 'error', `Library capsule patch failed: ${error}`).catch(() => {});
    }
  })();

  // Start achievement cache watcher (monitors when user views "Your Stuff" tab)
  startAchievementCacheWatcher();

  // Track real game session start/stop, used as a reliable playtime
  // fallback for non-Steam shortcuts (see src/lib/playSessionTracker.ts)
  const stopPlaySessionTracking = startPlaySessionTracking();

  // Trigger sync with frontend data (replaces backend auto-sync)
  // This uses Steam's frontend API for real-time playtime and achievement data

  // Add a delay before attempting sync to let Steam frontend initialize
  const syncDelay = 5000; // Start with 5 seconds delay

  setTimeout(async () => {
    try {
      // Use progressive sync with progress logging
      const result = await syncLibraryProgressive((current, total, gameName) => {
        // Progress callback - could be used for UI updates in future
      });

      // Show toast notification when initial sync completes
      // Use new_tags count from backend for accurate notification
      if (result && result.success && result.synced && result.synced > 0) {
        const newTags = result.new_tags || 0;
        const message = newTags > 0
          ? `Synced ${result.synced} games. ${newTags} new tag${newTags > 1 ? 's' : ''} added!`
          : `Synced ${result.synced} games. Open plugin to see your library.`;

        toaster.toast({
          title: 'Deck Progress Tracker',
          body: message,
          duration: 5000,
        });
      } else if (!result || !result.success) {

        // Show error toast
        toaster.toast({
          title: 'Deck Progress Tracker',
          body: `Initial sync failed: ${result?.error || 'Unknown error'}. Will retry...`,
          duration: 5000,
        });

        // Retry once more after additional delay
        setTimeout(async () => {
          try {
            const retryResult = await syncLibraryProgressive((current, total, gameName) => {
              // Progress callback for retry
            });

            if (retryResult && retryResult.success && retryResult.synced) {
              toaster.toast({
                title: 'Deck Progress Tracker',
                body: `Library synced: ${retryResult.synced} games processed`,
                duration: 5000,
              });
            } else {
              toaster.toast({
                title: 'Deck Progress Tracker',
                body: 'Auto-sync failed. Please sync manually from settings.',
                duration: 8000,
              });
            }
          } catch (retryErr: any) {
            // Retry sync failed
          }
        }, 10000);
      }
    } catch (err: any) {
      // Show error toast
      toaster.toast({
        title: 'Deck Progress Tracker',
        body: `Sync error: ${err?.message || 'Unknown error'}`,
        duration: 5000,
      });
    }
  }, syncDelay);

  return {
    name: 'Deck Progress Tracker',
    titleView: <div className={staticClasses.Title}>Deck Progress Tracker</div>,
    content: <MainPanel />,
    icon: <FaTrophy />,
    onDismount() {
      disposed = true;

      try {
        unpatchLibraryCapsules?.();
        stopLibraryBadgeStore?.();
      } catch (error) {
        // Error removing library capsule patch
      }

      try {
        routerHook.removeRoute(SETTINGS_ROUTE);
      } catch (error) {
        // Error removing settings route
      }

      // Stop achievement cache watcher
      stopAchievementCacheWatcher();

      // Stop play session tracking
      stopPlaySessionTracking?.();

      // Clean up patches when plugin is unloaded
      if (libraryPatch) {
        try {
          routerHook.removePatch('/library/app/:appid', libraryPatch);
        } catch (error) {
          // Error removing library app patch
        }
      }
    }
  };
});
