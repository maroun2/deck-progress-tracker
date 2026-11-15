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
/** Backlog = any game without a tag (not in the tag map). */
export type LibraryBadgeTag = CustomizableTagType | 'backlog';
interface LibraryBadgeState {
    position: LibraryBadgePosition;
    /** Badge untagged games as Backlog (setting library_badge_show_backlog) */
    showBacklog: boolean;
    tags: Record<string, LibraryBadgeTag>;
    /** Apps the plugin hides (Steam tools, demos, non-Steam apps): no badge at all */
    hidden: Record<string, true>;
    /** False until the first tag map arrives - don't show everything as Backlog meanwhile */
    tagsLoaded: boolean;
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
