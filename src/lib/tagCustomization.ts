/**
 * Shared helpers for user-customizable tag labels/colors
 * (https://github.com/maroun2/deck-progress-tracker/issues/6)
 */

import { PluginSettings } from '../types';
import { TranslationKey } from '../i18n';

export type CustomizableTagType = 'mastered' | 'completed' | 'in_progress' | 'dropped';

// These match named presets in TAG_COLOR_PRESETS below exactly (Pink, Green,
// Blue, Brown), so the default color always shows up selected in the
// dropdown instead of needing a separate synthetic "Default" entry.
export const DEFAULT_TAG_COLORS: Record<CustomizableTagType, string> = {
  mastered: '#f5576c', // Pink
  completed: '#2ecc71', // Green
  in_progress: '#3498db', // Blue
  dropped: '#8d6e63', // Brown
};

export const TAG_LABEL_SETTING_KEY = {
  mastered: 'tag_label_mastered',
  completed: 'tag_label_completed',
  in_progress: 'tag_label_in_progress',
  dropped: 'tag_label_dropped',
} as const satisfies Record<CustomizableTagType, keyof PluginSettings>;

export const TAG_COLOR_SETTING_KEY = {
  mastered: 'tag_color_mastered',
  completed: 'tag_color_completed',
  in_progress: 'tag_color_in_progress',
  dropped: 'tag_color_dropped',
} as const satisfies Record<CustomizableTagType, keyof PluginSettings>;

export const DEFAULT_TAG_LABEL_KEY: Record<CustomizableTagType, TranslationKey> = {
  mastered: 'tag.mastered',
  completed: 'tag.completed',
  in_progress: 'tag.in_progress',
  dropped: 'tag.dropped',
};

// Curated palette instead of a free color picker - @decky/ui has no native
// color input, and a raw HTML <input type="color"> doesn't play well with
// gamepad navigation (same class of issue fixed elsewhere in this plugin).
export const TAG_COLOR_PRESETS: { label: string; value: string }[] = [
  { label: 'Pink', value: '#f5576c' },
  { label: 'Red', value: '#e74c3c' },
  { label: 'Orange', value: '#e67e22' },
  { label: 'Yellow', value: '#f1c40f' },
  { label: 'Green', value: '#2ecc71' },
  { label: 'Teal', value: '#1abc9c' },
  { label: 'Blue', value: '#3498db' },
  { label: 'Purple', value: '#9b59b6' },
  { label: 'Brown', value: '#8d6e63' },
  { label: 'Gray', value: '#888888' },
];

type TagCustomizationSettings = Partial<Pick<
  PluginSettings,
  'tag_label_mastered' | 'tag_label_completed' | 'tag_label_in_progress' | 'tag_label_dropped' |
  'tag_color_mastered' | 'tag_color_completed' | 'tag_color_in_progress' | 'tag_color_dropped'
>>;

export function resolveTagLabel(
  type: CustomizableTagType,
  settings: TagCustomizationSettings,
  t: (key: TranslationKey) => string
): string {
  const custom = settings[TAG_LABEL_SETTING_KEY[type]];
  return custom && custom.trim() ? custom.trim() : t(DEFAULT_TAG_LABEL_KEY[type]);
}

export function resolveTagColor(
  type: CustomizableTagType,
  settings: TagCustomizationSettings
): string {
  const custom = settings[TAG_COLOR_SETTING_KEY[type]];
  return custom && custom.trim() ? custom.trim() : DEFAULT_TAG_COLORS[type];
}

