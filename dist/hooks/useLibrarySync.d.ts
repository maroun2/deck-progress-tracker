/**
 * Library sync state shared by the main panel (status line) and the
 * settings page (Sync button). Polls the backend so a sync started from
 * anywhere (startup auto-sync, the other view) is reflected.
 */
export declare function useLibrarySync(onProgressUpdate?: () => void): {
    syncing: boolean;
    message: string | null;
    syncLibrary: () => Promise<void>;
};
