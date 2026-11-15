/**
 * SettingsPanel - the plugin settings, shown inside the Quick Access panel.
 *
 * MainPanel swaps its whole content for this view when the Settings button
 * is pressed (like other Decky plugins, everything stays in the sidebar);
 * the Back button at the top returns to the tag lists.
 */
import { FC } from 'react';
/**
 * Give controller focus to the first button inside `el`. Used when the panel
 * swaps views, because the previously focused button unmounts and Steam's
 * focus would otherwise be lost (D-pad does nothing until B / reopen).
 * Returns a cleanup for useEffect.
 */
export declare function focusFirstButton(el: HTMLElement | null, scrollToTop?: boolean): () => void;
export declare const SettingsPanel: FC<{
    onBack: () => void;
    focusBack: boolean;
}>;
