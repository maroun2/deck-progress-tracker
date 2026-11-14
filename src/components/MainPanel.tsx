/**
 * MainPanel - the Quick Access panel content.
 * Kept deliberately clean: the tag lists, a Settings button (opens the
 * full-screen settings page) and the About info. Every setting lives on
 * the settings page (src/components/SettingsPage.tsx).
 */

import React, { FC, useState, useEffect, useRef } from 'react';
import { call } from '@decky/api';
import { PanelSection, PanelSectionRow, ButtonItem, Navigation } from '@decky/ui';
import { FaCog } from 'react-icons/fa';
import { TagStatistics, TaggedGame } from '../types';
import { TagIcon, TagType } from './TagIcon';
import { useTranslation, TranslationKey } from '../i18n';
import { CustomizableTagType, resolveTagLabel, resolveTagColor } from '../lib/tagCustomization';
import { usePluginSettings } from '../hooks/usePluginSettings';
import { useLibrarySync } from '../hooks/useLibrarySync';

export const SETTINGS_ROUTE = '/deck-progress-tracker/settings';

const BACKLOG_COLOR = '#888';

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

export const MainPanel: FC = () => {
  const { t } = useTranslation();
  const { settings } = usePluginSettings({ reloadOnChange: true });

  const [stats, setStats] = useState<TagStatistics | null>(null);
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

  // Read-only here: shows sync progress started from the settings page or
  // the automatic startup sync, and refreshes the lists as tags change.
  const { message } = useLibrarySync(smartUpdateUI);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ block: 'start' });
    }

    smartUpdateUI();
    const interval = setInterval(smartUpdateUI, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleSection = async (tagType: string) => {
    const willExpand = !expandedSections[tagType];
    setExpandedSections(prev => ({ ...prev, [tagType]: willExpand }));

    if (tagType === 'backlog' && willExpand && backlogGames.length === 0) {
      setLoadingBacklog(true);
      try {
        const res = await call<[], { success: boolean; games: TaggedGame[] }>('get_backlog_games');
        if (res.success) setBacklogGames(res.games);
      } finally {
        setLoadingBacklog(false);
      }
    }
  };

  const openSettings = () => {
    Navigation.Navigate(SETTINGS_ROUTE);
    Navigation.CloseSideMenus();
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
            const games = isBacklog ? backlogGames : (groupedGames[tagType!] || []);
            const count = isBacklog ? (stats?.backlog || 0) : games.length;
            const isExpanded = !!expandedSections[tagType!];
            const label = isBacklog ? t(TAG_LABEL_KEY[tagType!]) : resolveTagLabel(tagType as CustomizableTagType, settings, t);
            const color = isBacklog ? BACKLOG_COLOR : resolveTagColor(tagType as CustomizableTagType, settings);

            return (
              <React.Fragment key={tagType}>
                <PanelSectionRow>
                  <ButtonItem layout="below" onClick={() => toggleSection(tagType!)}>
                    <div style={styles.tagSectionContent}>
                      <div style={styles.tagSectionLeft}>
                        <TagIcon type={tagType} size={18} color={isBacklog ? undefined : color} />
                        <span style={styles.tagSectionTitle}>{label}</span>
                      </div>
                      <div style={styles.tagSectionRight}>
                        <span style={{ ...styles.tagCount, color }}>{count}</span>
                        <span style={styles.expandIcon}>{isExpanded ? '−' : '+'}</span>
                      </div>
                    </div>
                  </ButtonItem>
                </PanelSectionRow>

                {isExpanded && (
                  <div style={styles.tagDescription}>
                    {t(TAG_DESCRIPTION_KEY[tagType!], tagType === 'mastered' ? { threshold: settings.mastered_threshold } : undefined)}
                  </div>
                )}

                {isExpanded && games.length > 0 && games.map(game => (
                  <PanelSectionRow key={game.appid}>
                    <ButtonItem
                      layout="below"
                      onClick={() => { Navigation.Navigate(`/library/app/${game.appid}`); Navigation.CloseSideMenus(); }}
                      {...({ style: { width: '100%', overflow: 'hidden' } } as object)}
                    >
                      <div style={{ display: 'table', tableLayout: 'fixed', width: '100%' }}>
                        <div style={styles.gameItemContent}>
                          <span style={{ ...styles.smallDot, backgroundColor: (game.tag as string) === 'backlog' ? BACKLOG_COLOR : resolveTagColor(game.tag as CustomizableTagType, settings) }} />
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

      <PanelSection>
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={openSettings}>
            <div style={styles.settingsButton}>
              <FaCog />
              <span>{t('settings.openSettings')}</span>
            </div>
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
  section: { marginBottom: '8px', paddingBottom: '16px', borderBottom: '1px solid #333', width: '100%', overflow: 'hidden' },
  sectionTitle: { margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold', color: '#aaa', marginLeft: '16px' },
  gameItemContent: { display: 'flex', alignItems: 'center', gap: '8px', width: '100%', overflow: 'hidden', flexFlow: 'row nowrap' },
  smallDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  gameName: { fontSize: '13px', color: 'inherit', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', verticalAlign: 'middle', maxWidth: 'calc(100% - 40px)', flexShrink: 1 },
  manualBadge: { fontSize: '10px', color: '#888', backgroundColor: '#333', padding: '2px 6px', borderRadius: '3px', flexShrink: 0 },
  tagSectionContent: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  tagSectionLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  tagSectionRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  tagSectionTitle: { fontWeight: 'bold' },
  tagCount: { fontSize: '16px', fontWeight: 'bold' },
  expandIcon: { fontSize: '18px', color: '#888', width: '20px', textAlign: 'center' },
  emptySection: { padding: '12px 16px', color: '#666', fontSize: '13px', fontStyle: 'italic' },
  tagDescription: { padding: '8px 16px 12px 16px', color: '#999', fontSize: '12px', fontStyle: 'italic', borderBottom: '1px solid #2a2a2a' },
  settingsButton: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  about: { fontSize: '14px', lineHeight: '1.6', marginLeft: '16px', marginRight: '16px' },
  aboutLine: { margin: '8px 0', color: '#ccc' },
};
