/**
 * Automatic library sync after the plugin loads (Steam start / reboot /
 * Decky restart). Waits for the network, Steam's app data and the plugin
 * backend first, then retries quietly (see runStartupSync in syncPolicy.ts),
 * so a Deck that boots before Wi-Fi is up no longer gets a false
 * "sync failed" toast.
 */

import { call } from '@decky/api';
import { subscribeToLanguage, translate } from '../i18n';
import { syncLibraryProgressive, SyncResult } from './syncUtils';
import { runStartupSync } from './syncPolicy';
import { debugOverrides, logFrontend, notify } from './notifications';

const loadedAt = Date.now();
const POLL_MS = 2000;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function isOnline(): boolean {
  const offlineForMs = debugOverrides().offlineForMs;
  if (offlineForMs && Date.now() - loadedAt < offlineForMs) return false;
  return navigator.onLine !== false;
}

function steamAppsReady(): boolean {
  try {
    // The store getters throw while Steam is still loading them.
    const allApps = (window as any).collectionStore?.allAppsCollection?.allApps;
    return Array.isArray(allApps) && allApps.length > 0;
  } catch (e) {
    return false;
  }
}

async function backendResponds(): Promise<boolean> {
  try {
    const res = await Promise.race([
      call<[], { success?: boolean }>('get_settings'),
      sleep(5000).then(() => null),
    ]);
    return !!res?.success;
  } catch (e) {
    return false;
  }
}

/** Polls until online + Steam app data + backend are all ready, or `capMs` passes. */
export async function waitUntilReady(capMs: number): Promise<boolean> {
  const started = Date.now();
  for (;;) {
    const online = isOnline();
    const apps = steamAppsReady();
    const backend = online && apps && await backendResponds();
    if (online && apps && backend) {
      const waited = Date.now() - started;
      if (waited > POLL_MS) logFrontend('info', `Startup sync: ready after ${Math.round(waited / 1000)}s`);
      return true;
    }
    if (Date.now() - started >= capMs) {
      logFrontend('warn', `Startup sync: not ready after ${Math.round(capMs / 1000)}s (online=${online} apps=${apps} backend=${backend}), trying anyway`);
      return false;
    }
    await sleep(POLL_MS);
  }
}

export function startStartupSync(isDisposed: () => boolean): Promise<unknown> {
  // Load the user's language preference now, so the toast text at the end
  // isn't stuck on the system language when the panel was never opened.
  const unsubscribeLanguage = subscribeToLanguage(() => {});
  return runStartupSync({
    waitUntilReady,
    sync: async (attempt) => {
      const fail = debugOverrides().failSyncAttempts ?? 0;
      if (attempt <= fail) return { success: false, error: `Simulated failure (debug, attempt ${attempt}/${fail})` } as SyncResult;
      return syncLibraryProgressive();
    },
    notify,
    sleep,
    isDisposed,
    log: (message) => logFrontend('info', message),
    successMessage: (result) => translate('settings.syncCompleteDetailed', {
      synced: result.synced ?? 0,
      newTags: result.new_tags ? translate('settings.syncCompleteNewTags', { count: result.new_tags }) : '',
    }),
    failureMessage: (error) => translate('notify.startupSyncFailed', { error }),
  })
    .catch((e) => logFrontend('error', `Startup sync crashed: ${e?.message || e}`))
    .finally(unsubscribeLanguage);
}
