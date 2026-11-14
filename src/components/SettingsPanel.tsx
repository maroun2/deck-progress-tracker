/**
 * SettingsPanel - the plugin settings, shown inside the Quick Access panel.
 *
 * MainPanel swaps its whole content for this view when the Settings button
 * is pressed (like other Decky plugins, everything stays in the sidebar);
 * the Back button at the top returns to the tag lists.
 */

import React, { FC, useEffect, useRef } from 'react';
import { ButtonItem, Dropdown, PanelSection, PanelSectionRow, SliderField, TextField } from '@decky/ui';
import { FaArrowLeft } from 'react-icons/fa';
import { BADGE_SETTINGS_UPDATED_EVENT, LibraryBadgePosition, PluginSettings } from '../types';
import { useTranslation, LANGUAGE_UPDATED_EVENT, TranslationKey } from '../i18n';
import { usePluginSettings } from '../hooks/usePluginSettings';
import { useLibrarySync } from '../hooks/useLibrarySync';
import { CustomizableTagType, TAG_COLOR_PRESETS, TAG_LABEL_SETTING_KEY, TAG_COLOR_SETTING_KEY, resolveTagLabel, resolveTagColor } from '../lib/tagCustomization';

const CUSTOMIZABLE_TAGS: CustomizableTagType[] = ['mastered', 'completed', 'in_progress', 'dropped'];

const TAG_LABEL_KEY: Record<CustomizableTagType, TranslationKey> = {
  mastered: 'tag.mastered',
  completed: 'tag.completed',
  in_progress: 'tag.in_progress',
  dropped: 'tag.dropped',
};

/**
 * Give controller focus to the first button inside `el`. Used when the panel
 * swaps views, because the previously focused button unmounts and Steam's
 * focus would otherwise be lost (D-pad does nothing until B / reopen).
 * Returns a cleanup for useEffect.
 */
export function focusFirstButton(el: HTMLElement | null, scrollToTop = false): () => void {
  const timer = setTimeout(() => {
    try {
      el?.querySelector<HTMLElement>('.DialogButton')?.focus();
      if (scrollToTop) {
        // focus() can leave the button under the panel's sticky title;
        // reset the Quick Access scroller so the view starts at the top.
        for (let p = el?.parentElement; p; p = p.parentElement) {
          if (p.scrollHeight > p.clientHeight && /(auto|scroll)/.test(getComputedStyle(p).overflowY)) {
            p.scrollTop = 0;
            break;
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }, 0);
  return () => clearTimeout(timer);
}

export const SettingsPanel: FC<{ onBack: () => void; focusBack: boolean }> = ({ onBack, focusBack }) => {
  const { t } = useTranslation();
  const { settings, updateSettings: update } = usePluginSettings();
  const { syncing, message, syncLibrary } = useLibrarySync();
  const containerRef = useRef<HTMLDivElement>(null);

  // The Settings button that had controller focus is gone now; hand focus
  // to Back and start the view at the top.
  useEffect(() => (focusBack ? focusFirstButton(containerRef.current, true) : undefined), []);

  const libraryOptions: Array<{ data: LibraryBadgePosition; label: string }> = [
    { data: 'none', label: t('settings.positionNone') },
    { data: 'top-left', label: t('settings.positionTopLeft') },
    { data: 'top-right', label: t('settings.positionTopRight') },
    { data: 'bottom-left', label: t('settings.positionBottomLeft') },
    { data: 'bottom-right', label: t('settings.positionBottomRight') },
  ];
  const hOptions: Array<{ data: PluginSettings['badge_position_h']; label: string }> = [
    { data: 'left', label: t('settings.left') },
    { data: 'center', label: t('settings.center') },
    { data: 'right', label: t('settings.right') },
  ];
  const vOptions: Array<{ data: PluginSettings['badge_position_v']; label: string }> = [
    { data: 'top', label: t('settings.top') },
    { data: 'center', label: t('settings.center') },
    { data: 'bottom', label: t('settings.bottom') },
  ];
  const languageOptions: Array<{ data: PluginSettings['language']; label: string }> = [
    { data: 'auto', label: t('settings.languageAuto') },
    { data: 'en', label: t('settings.languageEnglish') },
    { data: 'pt-BR', label: t('settings.languagePortuguese') },
  ];
  const colorOptions = TAG_COLOR_PRESETS.map((preset) => ({ data: preset.value, label: preset.label }));

  // Size both game page dropdowns off the longest label so they match in
  // every language.
  const positionDropdownWidth = `${Math.max(...hOptions.map((o) => o.label.length), ...vOptions.map((o) => o.label.length)) + 4}ch`;

  const resetTagCustomization = () => {
    const cleared: Record<string, string> = {};
    CUSTOMIZABLE_TAGS.forEach((type) => {
      cleared[TAG_LABEL_SETTING_KEY[type]] = '';
      cleared[TAG_COLOR_SETTING_KEY[type]] = '';
    });
    update(cleared as Partial<PluginSettings>, BADGE_SETTINGS_UPDATED_EVENT);
  };

  return (
    <div ref={containerRef} style={styles.container}>
      <PanelSection>
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={onBack}>
            <div style={styles.backButton}>
              <FaArrowLeft />
              <span>{t('settings.back')}</span>
            </div>
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title={t('settings.syncSection')}>
        {message && <div style={styles.message}>{message}</div>}
        <PanelSectionRow>
          <ButtonItem layout="below" description={t('settings.syncDesc')} onClick={syncLibrary} disabled={syncing}>
            {syncing ? t('settings.syncing') : t('settings.syncLibrary')}
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title={t('settings.tagging')}>
        <PanelSectionRow>
          <SliderField
            label={t('settings.inProgressThreshold')}
            value={settings.in_progress_threshold}
            min={1}
            max={120}
            step={1}
            editableValue
            valueSuffix={t('settings.minutesSuffix')}
            onChange={(value) => update({ in_progress_threshold: value })}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <SliderField
            label={t('settings.masteredThreshold')}
            description={t('settings.masteredThresholdDesc')}
            value={settings.mastered_threshold}
            min={50}
            max={100}
            step={1}
            editableValue
            valueSuffix="%"
            onChange={(value) => update({ mastered_threshold: value })}
          />
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title={t('settings.libraryBadgePosition')}>
        <div style={styles.description}>{t('settings.libraryBadgePositionDesc')}</div>
        <PanelSectionRow>
          <div style={styles.fullWidth}>
            <Dropdown
              menuLabel={t('settings.libraryBadgePosition')}
              rgOptions={libraryOptions}
              selectedOption={settings.library_badge_position}
              onChange={(option) => update({ library_badge_position: option.data }, BADGE_SETTINGS_UPDATED_EVENT)}
            />
          </div>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title={t('settings.badgePosition')}>
        <div style={styles.description}>{t('settings.badgePositionDesc')}</div>
        <PanelSectionRow>
          <div style={styles.dropdownRow}>
            <span>{t('settings.horizontal')}</span>
            <div style={{ width: positionDropdownWidth }}>
              <Dropdown
                menuLabel={t('settings.horizontal')}
                rgOptions={hOptions}
                selectedOption={settings.badge_position_h}
                onChange={(option) => update({ badge_position_h: option.data }, BADGE_SETTINGS_UPDATED_EVENT)}
              />
            </div>
          </div>
        </PanelSectionRow>
        <PanelSectionRow>
          <div style={styles.dropdownRow}>
            <span>{t('settings.vertical')}</span>
            <div style={{ width: positionDropdownWidth }}>
              <Dropdown
                menuLabel={t('settings.vertical')}
                rgOptions={vOptions}
                selectedOption={settings.badge_position_v}
                onChange={(option) => update({ badge_position_v: option.data }, BADGE_SETTINGS_UPDATED_EVENT)}
              />
            </div>
          </div>
        </PanelSectionRow>
        <PanelSectionRow>
          <div style={styles.avoidOverlapRow}>
            <SliderField
              label={t('settings.avoidOverlap')}
              description={t('settings.avoidOverlapDesc')}
              value={settings.badge_overlap_offset}
              min={0}
              max={100}
              step={1}
              editableValue
              valueSuffix="px"
              onChange={(value) => update({ badge_overlap_offset: value }, BADGE_SETTINGS_UPDATED_EVENT)}
            />
          </div>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title={t('settings.customizeTags')}>
        <div style={styles.description}>{t('settings.customizeTagsDesc')}</div>
        {CUSTOMIZABLE_TAGS.map((type, index) => (
          <PanelSectionRow key={type}>
            <div style={index > 0 ? { ...styles.customTagRow, ...styles.customTagRowSeparator } : styles.customTagRow}>
              <TextField
                label={t(TAG_LABEL_KEY[type])}
                value={resolveTagLabel(type, settings, t)}
                onChange={(e) => update({ [TAG_LABEL_SETTING_KEY[type]]: e.target.value }, BADGE_SETTINGS_UPDATED_EVENT)}
              />
              <div style={styles.customTagColorWrapper}>
                <Dropdown
                  menuLabel={t(TAG_LABEL_KEY[type])}
                  rgOptions={colorOptions}
                  selectedOption={resolveTagColor(type, settings)}
                  onChange={(option) => update({ [TAG_COLOR_SETTING_KEY[type]]: option.data }, BADGE_SETTINGS_UPDATED_EVENT)}
                />
              </div>
            </div>
          </PanelSectionRow>
        ))}
        <PanelSectionRow>
          <div style={styles.customTagRowSeparator}>
            <ButtonItem layout="below" onClick={resetTagCustomization}>
              {t('settings.resetTagCustomization')}
            </ButtonItem>
          </div>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title={t('settings.language')}>
        <PanelSectionRow>
          <div style={styles.fullWidth}>
            <Dropdown
              menuLabel={t('settings.language')}
              rgOptions={languageOptions}
              selectedOption={settings.language}
              onChange={(option) => update({ language: option.data }, LANGUAGE_UPDATED_EVENT)}
            />
          </div>
        </PanelSectionRow>
      </PanelSection>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { paddingTop: '8px', color: 'white', width: '100%', maxWidth: '100%', overflow: 'hidden' },
  backButton: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  message: { padding: '12px', backgroundColor: 'rgba(102, 126, 234, 0.2)', borderRadius: '4px', marginBottom: '8px', fontSize: '14px', border: '1px solid rgba(102, 126, 234, 0.5)' },
  description: { fontSize: '12px', color: '#8b929a', marginBottom: '8px', lineHeight: '1.4' },
  fullWidth: { width: '100%' },
  dropdownRow: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  avoidOverlapRow: { width: '100%', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #333' },
  customTagRow: { width: '100%', display: 'flex', flexDirection: 'column' },
  customTagRowSeparator: { marginTop: '16px', paddingTop: '16px' },
  // Dropdown (like TextField) carries its own built-in top margin from
  // Decky's Field wrapper; pull it up so the colour sits under its label.
  customTagColorWrapper: { marginTop: '-8px' },
};
