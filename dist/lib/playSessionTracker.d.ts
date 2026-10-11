/**
 * Starts listening for game start/stop events. Returns a cleanup function
 * (or null if the SteamClient API isn't available), to call on unmount.
 */
export declare function startPlaySessionTracking(): (() => void) | null;
