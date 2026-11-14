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
import { MainPanel } from './components/MainPanel';
import patchLibraryApp from './lib/patchLibraryApp';
import { patchLibraryCapsules } from './lib/patchLibraryCapsules';
import { initLibraryBadgeStore } from './lib/libraryBadgeStore';
import { startStartupSync } from './lib/startupSync';
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

  // Automatic sync with Steam's frontend data (real-time playtime and
  // achievements). Waits for network/Steam/backend and retries quietly;
  // toasts go through notify() and respect the "Sync notifications" setting.
  startStartupSync(() => disposed);

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
