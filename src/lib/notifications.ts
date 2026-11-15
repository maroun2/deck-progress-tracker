/**
 * The single place that shows sync toasts. Every sync notification goes
 * through `notify(kind, body)`, which applies the "Sync notifications"
 * setting and the "game running" check (rules in syncPolicy.ts).
 */

import { call, toaster } from '@decky/api';
import { Router } from '@decky/ui';
import { DEFAULT_SYNC_NOTIFICATION_MODE, SyncNotificationMode } from '../types';
import { NotificationKind, normalizeSyncNotificationMode, shouldNotify } from './syncPolicy';
import { hasActiveGameSession } from './playSessionTracker';

const TITLE = 'Deck Progress Tracker';

/**
 * Developer overrides for testing on a Deck without launching a game or
 * dropping Wi-Fi. Set from the CEF console, e.g.
 *   localStorage.setItem('dpt:debug', '{"gameRunning":true}')
 * - gameRunning: force the "game running" check
 * - offlineForMs: report offline for this long after the plugin loads
 * - failSyncAttempts: make the first N startup sync attempts fail
 */
export interface DebugOverrides {
  gameRunning?: boolean;
  offlineForMs?: number;
  failSyncAttempts?: number;
}

export function debugOverrides(): DebugOverrides {
  try {
    const parsed = JSON.parse(localStorage.getItem('dpt:debug') || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    return {};
  }
}

export function logFrontend(level: 'info' | 'warn' | 'error', message: string) {
  call<[string, string], unknown>('log_frontend', level, message).catch(() => {});
}

export function isGameRunning(): boolean {
  const forced = debugOverrides().gameRunning;
  if (typeof forced === 'boolean') return forced;
  try {
    if (Router?.MainRunningApp) return true;
  } catch (e) {
    // Router getter unavailable - fall through to our own tracking
  }
  return hasActiveGameSession();
}

async function readMode(): Promise<SyncNotificationMode> {
  try {
    const res = await call<[], { settings?: { sync_notifications?: unknown } }>('get_settings');
    return normalizeSyncNotificationMode(res?.settings?.sync_notifications, DEFAULT_SYNC_NOTIFICATION_MODE);
  } catch (e) {
    return DEFAULT_SYNC_NOTIFICATION_MODE;
  }
}

/** Shows `body` as a toast if the setting allows it. Returns whether it was shown. */
export async function notify(kind: NotificationKind, body: string, duration = 5000): Promise<boolean> {
  const mode = await readMode();
  const gameRunning = isGameRunning();
  const show = shouldNotify(mode, kind, gameRunning);
  logFrontend('info', `[notify] kind=${kind} mode=${mode} gameRunning=${gameRunning} -> ${show ? 'shown' : 'suppressed'}: ${body}`);
  if (show) {
    toaster.toast({ title: TITLE, body, duration });
  }
  return show;
}
