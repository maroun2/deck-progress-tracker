/**
 * Shared plugin settings state for the main panel and the settings page.
 */

import { useEffect, useState } from 'react';
import { call } from '@decky/api';
import { BADGE_SETTINGS_UPDATED_EVENT, DEFAULT_LIBRARY_BADGE_POSITION, PluginSettings } from '../types';

export const DEFAULT_SETTINGS: PluginSettings = {
  auto_tag_enabled: true,
  mastered_threshold: 85,
  in_progress_threshold: 30,
  cache_ttl: 7200,
  source_installed: true,
  source_non_steam: true,
  source_all_owned: true,
  badge_position_h: 'right',
  badge_position_v: 'top',
  badge_overlap_offset: 0,
  library_badge_position: DEFAULT_LIBRARY_BADGE_POSITION,
  language: 'auto',
  tag_label_mastered: '',
  tag_label_completed: '',
  tag_label_in_progress: '',
  tag_label_dropped: '',
  tag_color_mastered: '',
  tag_color_completed: '',
  tag_color_in_progress: '',
  tag_color_dropped: '',
};

/**
 * @param reloadOnChange re-read settings whenever another view changes
 *   them. Off for the settings page itself, where a reload racing the
 *   user's typing could overwrite a text field mid-edit.
 */
export function usePluginSettings({ reloadOnChange = false }: { reloadOnChange?: boolean } = {}) {
  const [settings, setSettings] = useState<PluginSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = () => call<[], { settings: PluginSettings }>('get_settings')
      .then((res) => {
        if (!cancelled && res?.settings) {
          setSettings({ ...DEFAULT_SETTINGS, ...res.settings });
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    load();
    // The Quick Access panel stays mounted while the settings page changes
    // tag labels/colours, so pick those changes up live.
    if (reloadOnChange) window.addEventListener(BADGE_SETTINGS_UPDATED_EVENT, load);
    return () => {
      cancelled = true;
      if (reloadOnChange) window.removeEventListener(BADGE_SETTINGS_UPDATED_EVENT, load);
    };
  }, []);

  /**
   * Optimistically apply and persist a settings change, then dispatch
   * `event` (if given) so other live UI (badges, language) picks it up.
   */
  const updateSettings = async (patch: Partial<PluginSettings>, event?: string) => {
    setSettings((prev) => ({ ...prev, ...patch }));
    try {
      await call<[Partial<PluginSettings>], { success: boolean }>('update_settings', patch);
      if (event) {
        window.dispatchEvent(new CustomEvent(event));
      }
    } catch (err) {
      // Keep the optimistic value; the next load will resync
    }
  };

  return { settings, loaded, updateSettings };
}
