/**
 * LibraryTileBadge
 * Small icon-only tag badge drawn on top of a game capsule wherever Steam
 * lists games (library grid/tabs, collections, Home shelves).
 *
 * Injected by src/lib/patchLibraryCapsules.tsx. Reads everything from the
 * shared cache in libraryBadgeStore - never calls the backend per tile.
 */
import { FC } from 'react';
export declare const LIBRARY_BADGE_CLASS = "dpt-library-badge";
export declare function removeLibraryBadgeStylesheets(): void;
export declare const LibraryTileBadge: FC<{
    appid: string;
}>;
