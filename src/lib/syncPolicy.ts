/**
 * Pure rules for sync notifications and the startup sync retry loop.
 *
 * No Steam / Decky imports here (type-only imports are erased), so this
 * file can be exercised outside Steam with injected dependencies.
 */

import type { SyncNotificationMode } from '../types';
import type { SyncResult } from './syncUtils';

/**
 * - `success` / `error`: automatic (startup) sync, governed by the setting.
 * - `manual`: result of a sync the user started from the plugin UI. Always
 *   shown - they asked for it and are looking at the plugin, so it is
 *   feedback, not mid-game spam.
 */
export type NotificationKind = 'success' | 'error' | 'manual';

export const SYNC_NOTIFICATION_MODES: SyncNotificationMode[] = ['all', 'errors', 'off'];

export function normalizeSyncNotificationMode(value: unknown, fallback: SyncNotificationMode): SyncNotificationMode {
  return SYNC_NOTIFICATION_MODES.includes(value as SyncNotificationMode) ? (value as SyncNotificationMode) : fallback;
}

export function shouldNotify(mode: SyncNotificationMode, kind: NotificationKind, gameRunning: boolean): boolean {
  switch (kind) {
    case 'manual':
      return true;
    case 'error':
      return mode !== 'off';
    case 'success':
      // Never pop a "sync done" toast over a running game.
      return mode === 'all' && !gameRunning;
    default:
      return false;
  }
}

/**
 * A startup sync only counts as done if it actually synced something.
 * Right after boot Steam can report an empty library or every game can
 * fail, which is worth a quiet retry rather than a success toast.
 */
export function classifySyncResult(result: SyncResult | null | undefined): { ok: boolean; error?: string } {
  if (!result || !result.success) {
    return { ok: false, error: result?.error || 'Unknown error' };
  }
  if (!result.total) {
    return { ok: false, error: 'No games found yet' };
  }
  if (!result.synced) {
    return { ok: false, error: `0 of ${result.total} games synced` };
  }
  return { ok: true };
}

/** Pauses between startup sync attempts (first attempt runs right away). */
export const STARTUP_RETRY_DELAYS_MS = [10_000, 30_000, 60_000, 120_000];
/** How long to wait for network + Steam + backend before an attempt. */
export const FIRST_READY_CAP_MS = 90_000;
export const RETRY_READY_CAP_MS = 30_000;

export interface StartupSyncDeps {
  waitUntilReady: (capMs: number) => Promise<boolean>;
  sync: (attempt: number) => Promise<SyncResult>;
  notify: (kind: 'success' | 'error', body: string) => Promise<unknown>;
  sleep: (ms: number) => Promise<void>;
  isDisposed: () => boolean;
  log: (message: string) => void;
  successMessage: (result: SyncResult) => string;
  failureMessage: (error: string) => string;
  retryDelaysMs?: number[];
}

/**
 * Wait until the Deck is ready, sync, and retry quietly with backoff. Only
 * the final failure is reported (and only if the setting allows errors -
 * `notify` decides that).
 */
export async function runStartupSync(deps: StartupSyncDeps): Promise<{ ok: boolean; attempts: number }> {
  const delays = deps.retryDelaysMs ?? STARTUP_RETRY_DELAYS_MS;
  let lastError = 'Unknown error';

  for (let attempt = 1; attempt <= delays.length + 1; attempt++) {
    if (attempt > 1) {
      await deps.sleep(delays[attempt - 2]);
    }
    if (deps.isDisposed()) return { ok: false, attempts: attempt - 1 };

    const ready = await deps.waitUntilReady(attempt === 1 ? FIRST_READY_CAP_MS : RETRY_READY_CAP_MS);
    if (deps.isDisposed()) return { ok: false, attempts: attempt - 1 };

    let result: SyncResult;
    try {
      result = await deps.sync(attempt);
    } catch (e: any) {
      result = { success: false, error: e?.message || String(e) };
    }

    const outcome = classifySyncResult(result);
    if (outcome.ok) {
      deps.log(`Startup sync attempt ${attempt} succeeded (${result.synced}/${result.total} games, ready=${ready})`);
      await deps.notify('success', deps.successMessage(result));
      return { ok: true, attempts: attempt };
    }

    lastError = outcome.error || lastError;
    const next = delays[attempt - 1];
    deps.log(`Startup sync attempt ${attempt} failed: ${lastError} (ready=${ready}); ` +
      (next !== undefined ? `retrying quietly in ${Math.round(next / 1000)}s` : 'giving up'));
  }

  if (!deps.isDisposed()) {
    await deps.notify('error', deps.failureMessage(lastError));
  }
  return { ok: false, attempts: delays.length + 1 };
}
