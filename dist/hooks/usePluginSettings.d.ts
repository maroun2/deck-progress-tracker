/**
 * Shared plugin settings state for the main panel and the settings page.
 */
import { PluginSettings } from '../types';
export declare const DEFAULT_SETTINGS: PluginSettings;
/**
 * @param reloadOnChange re-read settings whenever another view changes
 *   them. Off for the settings page itself, where a reload racing the
 *   user's typing could overwrite a text field mid-edit.
 */
export declare function usePluginSettings({ reloadOnChange }?: {
    reloadOnChange?: boolean;
}): {
    settings: PluginSettings;
    loaded: boolean;
    updateSettings: (patch: Partial<PluginSettings>, event?: string) => Promise<void>;
};
