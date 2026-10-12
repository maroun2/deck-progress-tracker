import React, { FC, useState, useEffect, useRef } from 'react';
import { call, toaster } from '@decky/api';
import { PanelSection, PanelSectionRow, ButtonItem, Dropdown, SliderField, Navigation } from '@decky/ui';
import { PluginSettings, TagStatistics, TaggedGame, BADGE_SETTINGS_UPDATED_EVENT } from '../types';
import { TagIcon, TagType } from './TagIcon';
import { syncLibraryProgressive } from '../lib/syncUtils';
import { useTranslation, LANGUAGE_UPDATED_EVENT, TranslationKey } from '../i18n';

const TAG_COLORS: Record<string, string> = {
  completed: '#38ef7d',
  in_progress: '#764ba2',
  mastered: '#f5576c',
  backlog: '#888',
  dropped: '#c9a171',
};

const TAG_LABEL_KEY: Record<string, TranslationKey> = {
  completed: 'tag.completed',
  in_progress: 'tag.in_progress',
  backlog: 'tag.backlog',
  mastered: 'tag.mastered',
  dropped: 'tag.dropped',
};

const TAG_DESCRIPTION_KEY: Record<string, TranslationKey> = {
  completed: 'tag.completed.desc',
  in_progress: 'tag.in_progress.desc',
  backlog: 'tag.backlog.desc',
  mastered: 'tag.mastered.desc',
  dropped: 'tag.dropped.desc',
};

export const Settings: FC = () => {
  const { t } = useTranslation();

  const BADGE_H_OPTIONS: Array<{ data: PluginSettings['badge_position_h']; label: string }> = [
    { data: 'left', label: t('settings.left') },
    { data: 'center', label: t('settings.center') },
    { data: 'right', label: t('settings.right') },
  ];

  const BADGE_V_OPTIONS: Array<{ data: PluginSettings['badge_position_v']; label: string }> = [
    { data: 'top', label: t('settings.top') },
    { data: 'center', label: t('settings.center') },
    { data: 'bottom', label: t('settings.bottom') },
  ];

  // Size both dropdowns off the longest option label (across both axes) so
  // they always match, regardless of how long each language's words are.
  const longestPositionLabelLength = Math.max(
    ...BADGE_H_OPTIONS.map((o) => o.label.length),
    ...BADGE_V_OPTIONS.map((o) => o.label.length)
  );
  const positionDropdownWidth = `${longestPositionLabelLength + 4}ch`;

  const LANGUAGE_OPTIONS: Array<{ data: PluginSettings['language']; label: string }> = [
    { data: 'auto', label: t('settings.languageAuto') },
    { data: 'en', label: t('settings.languageEnglish') },
    { data: 'pt-BR', label: t('settings.languagePortuguese') },
  ];

  const [settings, setSettings] = useState<PluginSettings>({
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
    language: 'auto',
  });

  const [stats, setStats] = useState<TagStatistics | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [taggedGames, setTaggedGames] = useState<TaggedGame[]>([]);
  const [backlogGames, setBacklogGames] = useState<TaggedGame[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [loadingBacklog, setLoadingBacklog] = useState(false);

  const prevStatsRef = useRef<string>('');
  const prevGamesRef = useRef<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  const smartUpdateUI = async () => {
    try {
      const statsResult = await call<[], { success: boolean; stats: TagStatistics }>('get_tag_statistics');
      if (statsResult.success && JSON.stringify(statsResult.stats) !== prevStatsRef.current) {
        prevStatsRef.current = JSON.stringify(statsResult.stats);
        setStats(statsResult.stats);
      }

      const gamesResult = await call<[], { success: boolean; games: TaggedGame[] }>('get_all_tags_with_names');
      if (gamesResult.success) {
        const fingerPrint = JSON.stringify(gamesResult.games.map(g => g.appid).sort());
        if (fingerPrint !== prevGamesRef.current) {
          prevGamesRef.current = fingerPrint;
          setTaggedGames(gamesResult.games);
        }
      }
    } catch (err) {}
  };

  useEffect(() => {
    // Scroll to top when component mounts
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ block: 'start' });
    }

    call<[], { settings: PluginSettings }>('get_settings').then(res => res.settings && setSettings(res.settings));
    smartUpdateUI();
    const interval = setInterval(smartUpdateUI, 10000);
    return () => clearInterval(interval);
  }, []);

  // Track if we're waiting for backend to start (during data collection phase)
  const [waitingForBackend, setWaitingForBackend] = useState(false);

  useEffect(() => {
    const pollSync = async () => {
      try {
        const res = await call<[], { success: boolean; syncing: boolean; current: number; total: number }>('get_sync_progress');

        if (res.success && res.syncing) {
          // Backend is syncing - always show progress regardless of frontend state
          // This handles sync from any source (manual, auto, initial load)
          setMessage(t('settings.syncingProgress', { current: res.current, total: res.total }));
          setSyncing(true);
          setWaitingForBackend(false);
        } else if (res.success && !res.syncing && syncing) {
          // Backend finished but frontend still thinks it's syncing

          // If we were waiting for backend to start, keep waiting
          if (waitingForBackend) {
            // Still preparing data, don't change state
            return;
          }

          // Backend actually finished - clear syncing state and show completion
          setSyncing(false);
          smartUpdateUI();
          // If the sync wasn't initiated by the button (no finally block to handle it),
          // we should still show completion
          if (res.total && res.total > 0) {
            setMessage(t('settings.syncComplete'));
            setTimeout(() => setMessage(null), 5000);
          }
        }
      } catch (err) {}
    };
    const interval = setInterval(pollSync, syncing ? 500 : 2000);
    return () => clearInterval(interval);
  }, [syncing, waitingForBackend]);

  const toggleSection = async (tagType: string) => {
    const willExpand = !expandedSections[tagType];
    setExpandedSections(prev => ({ ...prev, [tagType]: willExpand }));

    if (tagType === 'backlog' && willExpand && backlogGames.length === 0) {
      setLoadingBacklog(true);
      const res = await call<[], { success: boolean; games: TaggedGame[] }>('get_backlog_games');
      if (res.success) setBacklogGames(res.games);
      setLoadingBacklog(false);
    }
  };

  const syncLibrary = async () => {
    try {
      setSyncing(true);
      setWaitingForBackend(false);  // No longer waiting since we process immediately
      setMessage(t('settings.syncStarting'));

      // Use progressive sync with progress callback
      const result = await syncLibraryProgressive((current, total, gameName) => {
        // Only show consistent progress numbers, no game names to avoid flickering
        setMessage(t('settings.syncingProgress', { current, total }));

        // Periodically update UI to show new tags
        if (current % 10 === 0 || current === total) {
          smartUpdateUI();
        }
      });

      // Sync completed
      smartUpdateUI();
      const newTagsSuffix = result.new_tags
        ? t('settings.syncCompleteNewTags', { count: result.new_tags })
        : '';
      const msg = t('settings.syncCompleteDetailed', { synced: result.synced ?? 0, newTags: newTagsSuffix });
      setMessage(msg);
      toaster.toast({ title: 'Deck Progress Tracker', body: msg, duration: 5000 });

      // Clear message after a delay
      setTimeout(() => setMessage(null), 10000);
    } catch (err: any) {
      setMessage(t('settings.syncError', { error: err?.message || 'Unknown' }));
    } finally {
      setSyncing(false);
      setWaitingForBackend(false);
    }
  };

  const updateBadgePosition = async (key: 'badge_position_h' | 'badge_position_v', value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    try {
      await call<[Record<string, string>], { success: boolean }>('update_settings', { [key]: value });
      window.dispatchEvent(new CustomEvent(BADGE_SETTINGS_UPDATED_EVENT));
    } catch (err) {}
  };

  const updateBadgeOverlapOffset = async (value: number) => {
    setSettings(prev => ({ ...prev, badge_overlap_offset: value }));
    try {
      await call<[Record<string, number>], { success: boolean }>('update_settings', { badge_overlap_offset: value });
      window.dispatchEvent(new CustomEvent(BADGE_SETTINGS_UPDATED_EVENT));
    } catch (err) {}
  };

  const updateLanguage = async (value: PluginSettings['language']) => {
    setSettings(prev => ({ ...prev, language: value }));
    try {
      await call<[Record<string, string>], { success: boolean }>('update_settings', { language: value });
      window.dispatchEvent(new CustomEvent(LANGUAGE_UPDATED_EVENT));
    } catch (err) {}
  };

  const updateInProgressThreshold = async (value: number) => {
    setSettings(prev => ({ ...prev, in_progress_threshold: value }));
    try {
      await call<[Record<string, number>], { success: boolean }>('update_settings', { in_progress_threshold: value });
    } catch (err) {}
  };

  const updateMasteredThreshold = async (value: number) => {
    setSettings(prev => ({ ...prev, mastered_threshold: value }));
    try {
      await call<[Record<string, number>], { success: boolean }>('update_settings', { mastered_threshold: value });
    } catch (err) {}
  };

  const groupedGames = taggedGames.reduce((acc, g) => {
    if (!acc[g.tag]) acc[g.tag] = [];
    acc[g.tag].push(g);
    return acc;
  }, {} as Record<string, TaggedGame[]>);

  return (
    <div ref={containerRef} style={styles.container}>
      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>{t('settings.library')} ({stats?.total || 0})</h3>
        <PanelSection>
          {(['in_progress', 'completed', 'mastered', 'dropped', 'backlog'] as TagType[]).map(tagType => {
            const isBacklog = tagType === 'backlog';
            const games = isBacklog ? backlogGames : (groupedGames[tagType] || []);
            const count = isBacklog ? (stats?.backlog || 0) : games.length;
            const isExpanded = !!expandedSections[tagType];

            return (
              <React.Fragment key={tagType}>
                <PanelSectionRow>
                  <ButtonItem layout="below" onClick={() => toggleSection(tagType)}>
                    <div style={styles.tagSectionContent}>
                      <div style={styles.tagSectionLeft}>
                        <TagIcon type={tagType} size={18} />
                        <span style={styles.tagSectionTitle}>{t(TAG_LABEL_KEY[tagType])}</span>
                      </div>
                      <div style={styles.tagSectionRight}>
                        <span style={{ ...styles.tagCount, color: TAG_COLORS[tagType] }}>{count}</span>
                        <span style={styles.expandIcon}>{isExpanded ? '−' : '+'}</span>
                      </div>
                    </div>
                  </ButtonItem>
                </PanelSectionRow>

                {isExpanded && (
                  <div style={styles.tagDescription}>
                    {t(TAG_DESCRIPTION_KEY[tagType], tagType === 'mastered' ? { threshold: settings.mastered_threshold } : undefined)}
                  </div>
                )}

                {isExpanded && games.length > 0 && games.map(game => (
                  <PanelSectionRow key={game.appid}>
                    <ButtonItem
                      layout="below"
                      onClick={() => { Navigation.Navigate(`/library/app/${game.appid}`); Navigation.CloseSideMenus(); }}
                      style={{ width: '100%', overflow: 'hidden' }}
                    >
                      <div style={{ display: 'table', tableLayout: 'fixed', width: '100%' }}>
                        <div style={styles.gameItemContent}>
                          <span style={{ ...styles.smallDot, backgroundColor: TAG_COLORS[game.tag] }} />
                          <span style={styles.gameName}>{game.game_name}</span>
                          {game.is_manual && <span style={styles.manualBadge}>{t('settings.manual')}</span>}
                        </div>
                      </div>
                    </ButtonItem>
                  </PanelSectionRow>
                ))}
                {isExpanded && games.length === 0 && !loadingBacklog && <div style={styles.emptySection}>{t('settings.noGamesFound')}</div>}
              </React.Fragment>
            );
          })}
        </PanelSection>
      </div>

      <PanelSection title={t('settings.badgePosition')}>
        <PanelSectionRow>
          <div style={styles.dropdownRow}>
            <span>{t('settings.horizontal')}</span>
            <div style={{ width: positionDropdownWidth }}>
              <Dropdown
                rgOptions={BADGE_H_OPTIONS}
                selectedOption={settings.badge_position_h}
                onChange={(option) => updateBadgePosition('badge_position_h', option.data)}
              />
            </div>
          </div>
        </PanelSectionRow>
        <PanelSectionRow>
          <div style={styles.dropdownRow}>
            <span>{t('settings.vertical')}</span>
            <div style={{ width: positionDropdownWidth }}>
              <Dropdown
                rgOptions={BADGE_V_OPTIONS}
                selectedOption={settings.badge_position_v}
                onChange={(option) => updateBadgePosition('badge_position_v', option.data)}
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
              onChange={updateBadgeOverlapOffset}
            />
          </div>
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
            onChange={updateInProgressThreshold}
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
            onChange={updateMasteredThreshold}
          />
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title={t('settings.language')}>
        <PanelSectionRow>
          <div style={{ width: '100%' }}>
            <Dropdown
              rgOptions={LANGUAGE_OPTIONS}
              selectedOption={settings.language}
              onChange={(option) => updateLanguage(option.data)}
            />
          </div>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection>
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={syncLibrary} disabled={syncing}>
            {syncing ? t('settings.syncing') : t('settings.syncLibrary')}
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title={t('settings.about')}>
        <div style={styles.about}>
          <p style={styles.aboutLine}>Deck Progress Tracker</p>
          <p style={styles.aboutLine}>{__PLUGIN_VERSION__}</p>
          <p style={styles.aboutLine}>{t('settings.aboutDataSource')}</p>
        </div>
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={() => Navigation.NavigateToExternalWeb('https://patreon.com/DeckProgressTracker')}>
            {t('settings.supportPatreon')}
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { paddingTop: '16px', color: 'white', width: '100%', maxWidth: '100%', overflow: 'hidden' },
  message: { padding: '12px', backgroundColor: 'rgba(102, 126, 234, 0.2)', borderRadius: '4px', marginBottom: '16px', fontSize: '14px', border: '1px solid rgba(102, 126, 234, 0.5)', marginLeft: '16px', marginRight: '16px' },
  section: { marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #333', width: '100%', overflow: 'hidden' },
  sectionTitle: { margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold', color: '#aaa', marginLeft: '16px' },
  gameItemContent: { display: 'flex', alignItems: 'center', gap: '8px', width: '100%', overflow: 'hidden', flexFlow: 'row nowrap' },
  smallDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  gameName: { fontSize: '13px', color: 'inherit', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', verticalAlign: 'middle', maxWidth: 'calc(100% - 40px)', flexShrink: 1 },
  manualBadge: { fontSize: '10px', color: '#888', backgroundColor: '#333', padding: '2px 6px', borderRadius: '3px', flexShrink: 0 },
  tagSectionContent: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  dropdownRow: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  avoidOverlapRow: { width: '100%', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #333' },
  tagSectionLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  tagSectionRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  tagSectionTitle: { fontWeight: 'bold' },
  tagCount: { fontSize: '16px', fontWeight: 'bold' },
  expandIcon: { fontSize: '18px', color: '#888', width: '20px', textAlign: 'center' },
  emptySection: { padding: '12px 16px', color: '#666', fontSize: '13px', fontStyle: 'italic' },
  tagDescription: { padding: '8px 16px 12px 16px', color: '#999', fontSize: '12px', fontStyle: 'italic', borderBottom: '1px solid #2a2a2a' },
  about: { fontSize: '14px', lineHeight: '1.6', marginLeft: '16px', marginRight: '16px' },
  aboutLine: { margin: '8px 0', color: '#ccc' },
  donationText: { margin: '12px 0 0 0', fontSize: '12px', color: '#888', fontStyle: 'italic' }
};