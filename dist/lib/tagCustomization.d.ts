/**
 * Shared helpers for user-customizable tag labels/colors
 * (https://github.com/maroun2/deck-progress-tracker/issues/6)
 */
import { PluginSettings } from '../types';
import { TranslationKey } from '../i18n';
export type CustomizableTagType = 'mastered' | 'completed' | 'in_progress' | 'dropped';
export declare const DEFAULT_TAG_COLORS: Record<CustomizableTagType, string>;
export declare const TAG_LABEL_SETTING_KEY: {
    readonly mastered: "tag_label_mastered";
    readonly completed: "tag_label_completed";
    readonly in_progress: "tag_label_in_progress";
    readonly dropped: "tag_label_dropped";
};
export declare const TAG_COLOR_SETTING_KEY: {
    readonly mastered: "tag_color_mastered";
    readonly completed: "tag_color_completed";
    readonly in_progress: "tag_color_in_progress";
    readonly dropped: "tag_color_dropped";
};
export declare const DEFAULT_TAG_LABEL_KEY: Record<CustomizableTagType, TranslationKey>;
export declare const TAG_COLOR_PRESETS: {
    label: string;
    value: string;
}[];
type TagCustomizationSettings = Partial<Pick<PluginSettings, 'tag_label_mastered' | 'tag_label_completed' | 'tag_label_in_progress' | 'tag_label_dropped' | 'tag_color_mastered' | 'tag_color_completed' | 'tag_color_in_progress' | 'tag_color_dropped'>>;
export declare function resolveTagLabel(type: CustomizableTagType, settings: TagCustomizationSettings, t: (key: TranslationKey) => string): string;
export declare function resolveTagColor(type: CustomizableTagType, settings: TagCustomizationSettings): string;
export {};
