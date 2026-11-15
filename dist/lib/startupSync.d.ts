/**
 * Automatic library sync after the plugin loads (Steam start / reboot /
 * Decky restart). Waits for the network, Steam's app data and the plugin
 * backend first, then retries quietly (see runStartupSync in syncPolicy.ts),
 * so a Deck that boots before Wi-Fi is up no longer gets a false
 * "sync failed" toast.
 */
/** Polls until online + Steam app data + backend are all ready, or `capMs` passes. */
export declare function waitUntilReady(capMs: number): Promise<boolean>;
export declare function startStartupSync(isDisposed: () => boolean): Promise<unknown>;
