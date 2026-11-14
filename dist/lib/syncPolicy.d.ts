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
export declare const SYNC_NOTIFICATION_MODES: SyncNotificationMode[];
export declare function normalizeSyncNotificationMode(value: unknown, fallback: SyncNotificationMode): SyncNotificationMode;
export declare function shouldNotify(mode: SyncNotificationMode, kind: NotificationKind, gameRunning: boolean): boolean;
/**
 * A startup sync only counts as done if it actually synced something.
 * Right after boot Steam can report an empty library or every game can
 * fail, which is worth a quiet retry rather than a success toast.
 */
export declare function classifySyncResult(result: SyncResult | null | undefined): {
    ok: boolean;
    error?: string;
};
/** Pauses between startup sync attempts (first attempt runs right away). */
export declare const STARTUP_RETRY_DELAYS_MS: number[];
/** How long to wait for network + Steam + backend before an attempt. */
export declare const FIRST_READY_CAP_MS = 90000;
export declare const RETRY_READY_CAP_MS = 30000;
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
export declare function runStartupSync(deps: StartupSyncDeps): Promise<{
    ok: boolean;
    attempts: number;
}>;
