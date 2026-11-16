/**
 * Library sync state for the main panel (Sync button + status line).
 *
 * A sync started with the button runs in module scope, not in the
 * component: closing the Quick Access panel unmounts the plugin, but the
 * sync keeps going and a reopened panel picks its progress up again (and
 * can't start a second one on top of it). Syncs started elsewhere (the
 * automatic startup sync) are followed by polling the backend while the
 * panel is mounted.
 */
declare function startManualSync(): Promise<void>;
export declare function useLibrarySync(onProgressUpdate?: () => void): {
    syncing: boolean;
    message: string | null;
    syncLibrary: typeof startManualSync;
};
export {};
