/**
 * The single place that shows sync toasts. Every sync notification goes
 * through `notify(kind, body)`, which applies the "Sync notifications"
 * setting and the "game running" check (rules in syncPolicy.ts).
 */
import { NotificationKind } from './syncPolicy';
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
export declare function debugOverrides(): DebugOverrides;
export declare function logFrontend(level: 'info' | 'warn' | 'error', message: string): void;
export declare function isGameRunning(): boolean;
/** Shows `body` as a toast if the setting allows it. Returns whether it was shown. */
export declare function notify(kind: NotificationKind, body: string, duration?: number): Promise<boolean>;
