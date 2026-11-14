/**
 * Shared, cached state for the library tile badges.
 *
 * Steam can render hundreds of game capsules at once (library grid, Home
 * shelves, collections), so tiles never talk to the backend themselves:
 * the whole {appid: tag} map is fetched with a single `get_tag_map` call and
 * cached here, together with the badge position and tag colour settings.
 * Tiles subscribe and only re-render when their own derived badge changes.
 */

import { call } from '@decky/api';
import {
  BADGE_SETTINGS_UPDATED_EVENT,
  DEFAULT_LIBRARY_BADGE_POSITION,
  LibraryBadgePosition,
  PluginSettings,
  TAGS_UPDATED_EVENT,
} from '../types';
import { CustomizableTagType, TAG_COLOR_SETTING_KEY } from './tagCustomization';

type TagColorSettings = Partial<Pick<
  PluginSettings,
  'tag_color_mastered' | 'tag_color_completed' | 'tag_color_in_progress' | 'tag_color_dropped'
>>;

interface LibraryBadgeState {
  position: LibraryBadgePosition;
  tags: Record<string, CustomizableTagType>;
  colors: TagColorSettings;
}

const VALID_POSITIONS: LibraryBadgePosition[] = ['none', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];

// A tile mounting after this long triggers one background refresh of the
// tag map (covers tag changes made by the automatic background checks).
const TAG_MAP_STALE_MS = 60_000;
// Coalesce bursts of "tags changed" events (e.g. during a library sync).
const TAG_REFRESH_DEBOUNCE_MS = 1_500;

let state: LibraryBadgeState = {
  position: DEFAULT_LIBRARY_BADGE_POSITION,
  tags: {},
  colors: {},
};

const listeners = new Set<() => void>();
let lastTagFetch = 0;
let tagFetchInFlight = false;
let tagRefreshTimer: ReturnType<typeof setTimeout> | null = null;
let active = false;

function emit(next: LibraryBadgeState) {
  state = next;
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      // A broken subscriber must never break the others
    }
  });
}

export function getLibraryBadgeState(): LibraryBadgeState {
  return state;
}

export function subscribeLibraryBadges(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

async function loadSettings() {
  try {
    const result = await call<[], { settings: PluginSettings }>('get_settings');
    const s = result?.settings;
    if (!s || !active) return;
    const position = VALID_POSITIONS.includes(s.library_badge_position)
      ? s.library_badge_position
      : DEFAULT_LIBRARY_BADGE_POSITION;
    const colors: TagColorSettings = {};
    (Object.keys(TAG_COLOR_SETTING_KEY) as CustomizableTagType[]).forEach((type) => {
      const key = TAG_COLOR_SETTING_KEY[type];
      colors[key] = (s[key] as string) || '';
    });
    if (position !== state.position || JSON.stringify(colors) !== JSON.stringify(state.colors)) {
      emit({ ...state, position, colors });
    }
  } catch (e) {
    // Keep previous settings on failure
  }
}

async function loadTags() {
  if (tagFetchInFlight) return;
  tagFetchInFlight = true;
  try {
    const result = await call<[], { success: boolean; tags: Record<string, CustomizableTagType> }>('get_tag_map');
    lastTagFetch = Date.now();
    if (result?.success && result.tags && active) {
      if (JSON.stringify(result.tags) !== JSON.stringify(state.tags)) {
        emit({ ...state, tags: result.tags });
      }
    }
  } catch (e) {
    // Keep previous tags on failure
  } finally {
    tagFetchInFlight = false;
  }
}

function scheduleTagRefresh() {
  if (tagRefreshTimer) clearTimeout(tagRefreshTimer);
  tagRefreshTimer = setTimeout(() => {
    tagRefreshTimer = null;
    loadTags();
  }, TAG_REFRESH_DEBOUNCE_MS);
}

/**
 * Called by tiles on mount; refreshes the tag map at most once per
 * TAG_MAP_STALE_MS no matter how many tiles mount.
 */
export function refreshTagsIfStale() {
  if (active && !tagFetchInFlight && Date.now() - lastTagFetch > TAG_MAP_STALE_MS) {
    loadTags();
  }
}

/**
 * Tell the library badges that tags changed (manual edit, sync, ...).
 */
export function notifyTagsChanged() {
  window.dispatchEvent(new CustomEvent(TAGS_UPDATED_EVENT));
}

export function initLibraryBadgeStore(): () => void {
  active = true;
  const onSettings = () => loadSettings();
  const onTags = () => scheduleTagRefresh();
  window.addEventListener(BADGE_SETTINGS_UPDATED_EVENT, onSettings);
  window.addEventListener(TAGS_UPDATED_EVENT, onTags);
  loadSettings();
  loadTags();

  return () => {
    window.removeEventListener(BADGE_SETTINGS_UPDATED_EVENT, onSettings);
    window.removeEventListener(TAGS_UPDATED_EVENT, onTags);
    if (tagRefreshTimer) clearTimeout(tagRefreshTimer);
    tagRefreshTimer = null;
    active = false;
    // Hide every badge that is still mounted when the plugin unloads
    emit({ ...state, position: 'none' });
  };
}
