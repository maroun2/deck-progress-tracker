/**
 * Shared, cached state for the library tile badges.
 *
 * Steam can render hundreds of game capsules at once (library grid, Home
 * shelves, collections), so tiles never talk to the backend themselves:
 * the whole {appid: tag} map is fetched with a single `get_tag_map` call and
 * cached here, together with the badge position and tag colour settings.
 * Tiles subscribe and only re-render when their own derived badge changes.
 */
import { LibraryBadgePosition, PluginSettings } from '../types';
import { CustomizableTagType } from './tagCustomization';
type TagColorSettings = Partial<Pick<PluginSettings, 'tag_color_mastered' | 'tag_color_completed' | 'tag_color_in_progress' | 'tag_color_dropped'>>;
interface LibraryBadgeState {
    position: LibraryBadgePosition;
    tags: Record<string, CustomizableTagType>;
    colors: TagColorSettings;
}
export declare function getLibraryBadgeState(): LibraryBadgeState;
export declare function subscribeLibraryBadges(listener: () => void): () => void;
/**
 * Called by tiles on mount; refreshes the tag map at most once per
 * TAG_MAP_STALE_MS no matter how many tiles mount.
 */
export declare function refreshTagsIfStale(): void;
/**
 * Tell the library badges that tags changed (manual edit, sync, ...).
 */
export declare function notifyTagsChanged(): void;
export declare function initLibraryBadgeStore(): () => void;
export {};
