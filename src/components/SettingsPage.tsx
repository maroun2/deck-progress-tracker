/**
 * SettingsPage - full-screen settings, opened from the Settings button in
 * the Quick Access panel (route SETTINGS_ROUTE, registered in index.tsx).
 *
 * Uses Steam's own SidebarNavigation so it looks and navigates like the
 * system settings: D-pad between pages and controls, B goes back.
 */

import React, { FC } from 'react';
import {
  ButtonItem,
  Dropdown,
  DropdownItem,
  Field,
  SidebarNavigation,
  SliderField,
  TextField,
} from '@decky/ui';
import { FaGlobe, FaSyncAlt, FaTags, FaThLarge } from 'react-icons/fa';
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

type Update = (patch: Partial<PluginSettings>, event?: string) => Promise<void>;

const GeneralPage: FC<{ settings: PluginSettings; update: Update }> = ({ settings, update }) => {
  const { t } = useTranslation();
  const { syncing, message, syncLibrary } = useLibrarySync();

  return (
    <>
      <Field label={t('settings.syncSection')} description={message || t('settings.syncDesc')} bottomSeparator="none" />
      <ButtonItem layout="below" onClick={syncLibrary} disabled={syncing}>
        {syncing ? t('settings.syncing') : t('settings.syncLibrary')}
      </ButtonItem>

      <Field label={t('settings.tagging')} bottomSeparator="none" />
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
    </>
  );
};

const BadgesPage: FC<{ settings: PluginSettings; update: Update }> = ({ settings, update }) => {
  const { t } = useTranslation();

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

  return (
    <>
      <Field label={t('settings.libraryBadgeSection')} bottomSeparator="none" />
      <DropdownItem
        label={t('settings.libraryBadgePosition')}
        description={t('settings.libraryBadgePositionDesc')}
        menuLabel={t('settings.libraryBadgePosition')}
        rgOptions={libraryOptions}
        selectedOption={settings.library_badge_position}
        onChange={(option) => update({ library_badge_position: option.data }, BADGE_SETTINGS_UPDATED_EVENT)}
      />

      <Field label={t('settings.badgePosition')} description={t('settings.badgePositionDesc')} bottomSeparator="none" />
      <DropdownItem
        label={t('settings.horizontal')}
        menuLabel={t('settings.horizontal')}
        rgOptions={hOptions}
        selectedOption={settings.badge_position_h}
        onChange={(option) => update({ badge_position_h: option.data }, BADGE_SETTINGS_UPDATED_EVENT)}
      />
      <DropdownItem
        label={t('settings.vertical')}
        menuLabel={t('settings.vertical')}
        rgOptions={vOptions}
        selectedOption={settings.badge_position_v}
        onChange={(option) => update({ badge_position_v: option.data }, BADGE_SETTINGS_UPDATED_EVENT)}
      />
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
    </>
  );
};

const CustomizeTagsPage: FC<{ settings: PluginSettings; update: Update }> = ({ settings, update }) => {
  const { t } = useTranslation();
  const colorOptions = TAG_COLOR_PRESETS.map((preset) => ({ data: preset.value, label: preset.label }));

  const reset = () => {
    const cleared: Partial<PluginSettings> = {};
    CUSTOMIZABLE_TAGS.forEach((type) => {
      (cleared as Record<string, string>)[TAG_LABEL_SETTING_KEY[type]] = '';
      (cleared as Record<string, string>)[TAG_COLOR_SETTING_KEY[type]] = '';
    });
    update(cleared, BADGE_SETTINGS_UPDATED_EVENT);
  };

  return (
    <>
      <Field description={t('settings.customizeTagsDesc')} bottomSeparator="none" />
      {CUSTOMIZABLE_TAGS.map((type) => (
        <Field key={type} label={t(TAG_LABEL_KEY[type])} childrenLayout="below" bottomSeparator="standard">
          <div style={styles.customTagRow}>
            <div style={styles.customTagLabel}>
              <TextField
                value={resolveTagLabel(type, settings, t)}
                onChange={(e) => update({ [TAG_LABEL_SETTING_KEY[type]]: e.target.value }, BADGE_SETTINGS_UPDATED_EVENT)}
              />
            </div>
            <div style={styles.customTagColor}>
              <span style={{ ...styles.colorSwatch, background: resolveTagColor(type, settings) }} />
              <Dropdown
                menuLabel={t(TAG_LABEL_KEY[type])}
                rgOptions={colorOptions}
                selectedOption={resolveTagColor(type, settings)}
                onChange={(option) => update({ [TAG_COLOR_SETTING_KEY[type]]: option.data }, BADGE_SETTINGS_UPDATED_EVENT)}
              />
            </div>
          </div>
        </Field>
      ))}
      <ButtonItem layout="below" onClick={reset}>
        {t('settings.resetTagCustomization')}
      </ButtonItem>
    </>
  );
};

const LanguagePage: FC<{ settings: PluginSettings; update: Update }> = ({ settings, update }) => {
  const { t } = useTranslation();
  const options: Array<{ data: PluginSettings['language']; label: string }> = [
    { data: 'auto', label: t('settings.languageAuto') },
    { data: 'en', label: t('settings.languageEnglish') },
    { data: 'pt-BR', label: t('settings.languagePortuguese') },
  ];
  return (
    <DropdownItem
      label={t('settings.language')}
      menuLabel={t('settings.language')}
      rgOptions={options}
      selectedOption={settings.language}
      onChange={(option) => update({ language: option.data }, LANGUAGE_UPDATED_EVENT)}
    />
  );
};

export const SettingsPage: FC = () => {
  const { t } = useTranslation();
  const { settings, updateSettings } = usePluginSettings();

  return (
    <div style={styles.page}>
      <SidebarNavigation
        title={t('settings.title')}
        showTitle
        pages={[
          {
            title: t('settings.pageGeneral'),
            icon: <FaSyncAlt />,
            content: <GeneralPage settings={settings} update={updateSettings} />,
          },
          {
            title: t('settings.pageBadges'),
            icon: <FaThLarge />,
            content: <BadgesPage settings={settings} update={updateSettings} />,
          },
          {
            title: t('settings.customizeTags'),
            icon: <FaTags />,
            content: <CustomizeTagsPage settings={settings} update={updateSettings} />,
          },
          {
            title: t('settings.language'),
            icon: <FaGlobe />,
            content: <LanguagePage settings={settings} update={updateSettings} />,
          },
        ]}
      />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  // Full-screen plugin routes render under Steam's top bar
  page: { marginTop: '40px', height: 'calc(100% - 40px)', background: '#0e141b' },
  customTagRow: { display: 'flex', alignItems: 'center', gap: '16px', width: '100%' },
  customTagLabel: { flex: 1, minWidth: 0 },
  customTagColor: { display: 'flex', alignItems: 'center', gap: '8px', width: '180px', flexShrink: 0 },
  colorSwatch: { width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0, border: '1px solid rgba(255,255,255,0.4)' },
};
