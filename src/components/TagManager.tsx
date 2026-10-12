/**
 * TagManager Component
 * Modal for managing game tags manually
 */

import React, { FC, useState, useEffect } from 'react';
import { call } from '@decky/api';
import { Focusable, DialogButton, TextField } from '@decky/ui';
import { GameDetails, HLTBData } from '../types';
import { TagIcon, TAG_ICON_COLORS } from './TagIcon';
import { TAG_STYLES } from './GameTag';
import { useTranslation } from '../i18n';

const TAG_LABEL_KEY = {
  completed: 'tag.completed',
  in_progress: 'tag.in_progress',
  mastered: 'tag.mastered',
  dropped: 'tag.dropped',
} as const;

interface TagManagerProps {
  appid: string;
  onClose: () => void;
}

export const TagManager: FC<TagManagerProps> = ({ appid, onClose }) => {
  const { t } = useTranslation();
  const [details, setDetails] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [manualSearchOpen, setManualSearchOpen] = useState(false);
  const [manualQuery, setManualQuery] = useState('');
  const [manualResults, setManualResults] = useState<HLTBData[]>([]);
  const [manualSearching, setManualSearching] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);

  useEffect(() => {
    fetchDetails();
  }, [appid]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await call<[{ appid: string }], GameDetails>('get_game_details', { appid });
      setDetails(result);
    } catch (err: any) {
      const errorMsg = err?.message || t('tagManager.failedToLoad');
      setError(errorMsg);
      // Error occurred
    } finally {
      setLoading(false);
    }
  };

  const setTag = async (tag: string) => {
    try {
      const result = await call<[{ appid: string; tag: string }], { success: boolean; error?: string }>('set_manual_tag', { appid, tag });
      await fetchDetails();
    } catch (err: any) {
      const errorMsg = err?.message || t('tagManager.failedToSetTag');
      setError(errorMsg);
      // Error occurred
    }
  };

  const resetToAuto = async () => {
    try {
      const result = await call<[{ appid: string }], { success: boolean; error?: string }>('reset_to_auto_tag', { appid });
      await fetchDetails();
    } catch (err: any) {
      const errorMsg = err?.message || t('tagManager.failedToReset');
      setError(errorMsg);
      // Error occurred
    }
  };

  const removeTag = async () => {
    try {
      const result = await call<[{ appid: string }], { success: boolean; error?: string }>('remove_tag', { appid });
      await fetchDetails();
    } catch (err: any) {
      const errorMsg = err?.message || t('tagManager.failedToRemove');
      setError(errorMsg);
      // Error occurred
    }
  };

  const toggleManualSearch = () => {
    setManualSearchOpen((open) => {
      const next = !open;
      if (next && !manualQuery) {
        setManualQuery(details?.stats?.game_name || '');
      }
      if (!next) {
        setManualResults([]);
        setManualError(null);
      }
      return next;
    });
  };

  const runManualSearch = async () => {
    if (!manualQuery.trim()) return;
    try {
      setManualSearching(true);
      setManualError(null);
      const result = await call<[{ query: string }], { success: boolean; candidates?: HLTBData[]; error?: string }>(
        'search_hltb_candidates',
        { query: manualQuery.trim() }
      );
      if (result.success) {
        setManualResults(result.candidates || []);
        if (!result.candidates || result.candidates.length === 0) {
          setManualError(t('tagManager.manualSearchNoResults'));
        }
      } else {
        setManualError(result.error || t('tagManager.manualSearchNoResults'));
      }
    } catch (err: any) {
      setManualError(err?.message || t('tagManager.manualSearchNoResults'));
    } finally {
      setManualSearching(false);
    }
  };

  const selectManualMatch = async (candidate: HLTBData) => {
    try {
      await call<[{ appid: string; candidate: HLTBData }], { success: boolean }>(
        'set_manual_hltb_match',
        { appid, candidate }
      );
      setManualSearchOpen(false);
      setManualResults([]);
      await fetchDetails();
    } catch (err: any) {
      setManualError(err?.message || t('tagManager.manualSearchNoResults'));
    }
  };

  if (loading) {
    return (
      <div style={styles.modal}>
        <div style={styles.content}>
          <div style={styles.loading}>{t('tagManager.loading')}</div>
        </div>
      </div>
    );
  }

  if (error || !details || !details.success) {
    return (
      <div style={styles.modal}>
        <div style={styles.content}>
          <div style={styles.error}>{error || t('tagManager.failedToLoad')}</div>
          <Focusable>
            <DialogButton onClick={onClose}>{t('tagManager.close')}</DialogButton>
          </Focusable>
        </div>
      </div>
    );
  }

  const stats = details.stats;
  const tag = details.tag;
  const hltb = details.hltb_data;

  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.content} onClick={(e) => e.stopPropagation()}>
        {/* Header: Game name with current tag */}
        <div style={styles.header}>
          <h2 style={styles.title}>{stats?.game_name || t('tagManager.gameFallback', { appid })}</h2>
          {tag?.tag && (
            <div style={styles.currentTagBadge}>
              <TagIcon type={tag.tag as any} size={20} />
              <span style={{ color: TAG_ICON_COLORS[tag.tag as keyof typeof TAG_ICON_COLORS] }}>
                {t(TAG_LABEL_KEY[tag.tag as keyof typeof TAG_LABEL_KEY]).toUpperCase()}
              </span>
              <span style={styles.tagType}>
                {tag.is_manual ? t('tagManager.manualTag') : t('tagManager.autoTag')}
              </span>
            </div>
          )}
        </div>

        {/* Main content: Statistics and Tag buttons side by side */}
        <div style={styles.mainContent}>
          {/* Left side: Statistics */}
          <div style={styles.leftColumn}>
            <h3 style={styles.sectionTitle}>{t('tagManager.statistics')}</h3>
            {stats && (
              <>
                <div style={styles.statRow}>
                  <span>{t('tagManager.playtime')}</span>
                  <span>{Math.floor(stats.playtime_minutes / 60)}h {stats.playtime_minutes % 60}m</span>
                </div>
                <div style={styles.statRow}>
                  <span>{t('tagManager.achievements')}</span>
                  <span>{stats.unlocked_achievements}/{stats.total_achievements}</span>
                </div>
              </>
            )}
            {hltb && (
              <>
                <div style={styles.statRowStacked}>
                  <span>{t('tagManager.hltbMatch')}</span>
                  <span style={styles.hltbMatch}>
                    {hltb.matched_name} ({Math.round((hltb.similarity || 0) * 100)}%)
                  </span>
                </div>
                {hltb.main_story && (
                  <div style={styles.statRow}>
                    <span>{t('tagManager.mainStory')}</span>
                    <span>{hltb.main_story}h</span>
                  </div>
                )}
              </>
            )}
            {!hltb && (
              <div style={styles.statRow}>
                <span>{t('tagManager.hltb')}</span>
                <span style={styles.noData}>{t('tagManager.noData')}</span>
              </div>
            )}

            <Focusable
              onClick={toggleManualSearch}
              onActivate={toggleManualSearch}
              style={styles.manualSearchToggle}
            >
              {manualSearchOpen ? t('tagManager.manualSearchClose') : t('tagManager.manualSearchOpen')}
            </Focusable>

            {manualSearchOpen && (
              <div style={styles.manualSearchPanel}>
                <TextField
                  value={manualQuery}
                  onChange={(e) => setManualQuery(e.target.value)}
                />
                <Focusable
                  onClick={runManualSearch}
                  onActivate={runManualSearch}
                  style={styles.secondaryButton}
                >
                  {manualSearching ? t('tagManager.manualSearching') : t('tagManager.manualSearchButton')}
                </Focusable>

                {manualError && <div style={styles.manualSearchError}>{manualError}</div>}

                {manualResults.length > 0 && (
                  <Focusable style={styles.manualResultsList} flow-children="down">
                    {manualResults.map((candidate, idx) => (
                      <Focusable
                        key={idx}
                        onClick={() => selectManualMatch(candidate)}
                        onActivate={() => selectManualMatch(candidate)}
                        style={styles.manualResultItem}
                      >
                        <div style={styles.manualResultName}>{candidate.matched_name}</div>
                        <div style={styles.manualResultMeta}>
                          {candidate.release_year ? `${candidate.release_year} · ` : ''}
                          {Math.round((candidate.similarity || 0) * 100)}%
                          {candidate.main_story ? ` · ${candidate.main_story}h` : ''}
                        </div>
                        {candidate.platforms && candidate.platforms.length > 0 && (
                          <div style={styles.manualResultPlatforms}>
                            {candidate.platforms.join(', ')}
                          </div>
                        )}
                      </Focusable>
                    ))}
                  </Focusable>
                )}
              </div>
            )}
          </div>

          {/* Right side: Tag buttons */}
          <div style={styles.rightColumn}>
            <h3 style={styles.sectionTitle}>{t('tagManager.setTag')}</h3>
            <Focusable style={styles.tagButtonGroup} flow-children="down">
              <Focusable
                onActivate={() => setTag('mastered')}
                style={{ ...styles.tagButton, background: TAG_STYLES.mastered.background }}
              >
                <TagIcon type="mastered" size={18} color="white" />
                <span>{t('tag.mastered')}</span>
              </Focusable>
              <Focusable
                onActivate={() => setTag('completed')}
                style={{ ...styles.tagButton, background: TAG_STYLES.completed.background }}
              >
                <TagIcon type="completed" size={18} color="white" />
                <span>{t('tag.completed')}</span>
              </Focusable>
              <Focusable
                onActivate={() => setTag('in_progress')}
                style={{ ...styles.tagButton, background: TAG_STYLES.in_progress.background }}
              >
                <TagIcon type="in_progress" size={18} color="white" />
                <span>{t('tag.in_progress')}</span>
              </Focusable>
              <Focusable
                onActivate={() => setTag('dropped')}
                style={{ ...styles.tagButton, background: TAG_STYLES.dropped.background }}
              >
                <TagIcon type="dropped" size={18} color="white" />
                <span>{t('tag.dropped')}</span>
              </Focusable>
            </Focusable>
            <Focusable style={styles.buttonGroup} flow-children="horizontal">
              <Focusable onClick={resetToAuto} onActivate={resetToAuto} style={styles.secondaryButton}>
                {t('tagManager.resetToAuto')}
              </Focusable>
              <Focusable onClick={removeTag} onActivate={removeTag} style={styles.secondaryButton}>
                {t('tagManager.remove')}
              </Focusable>
            </Focusable>
          </div>
        </div>

        <Focusable onClick={onClose} onActivate={onClose} style={styles.closeButton}>
          {t('tagManager.close')}
        </Focusable>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '80px',
    zIndex: 10000,
  },
  content: {
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    padding: '24px',
    maxWidth: '650px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
    color: 'white',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #333',
  },
  currentTagBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    backgroundColor: '#252525',
    borderRadius: '16px',
    fontSize: '13px',
    fontWeight: 'bold',
    width: 'fit-content',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold',
  },
  mainContent: {
    display: 'flex',
    gap: '24px',
    marginBottom: '20px',
  },
  leftColumn: {
    flex: 1,
    minWidth: 0,
  },
  rightColumn: {
    flex: 1,
    minWidth: 0,
  },
  sectionTitle: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#aaa',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    fontSize: '13px',
  },
  statRowStacked: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '6px 0',
    fontSize: '13px',
  },
  hltbMatch: {
    fontSize: '12px',
    color: '#888',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  },
  noData: {
    color: '#666',
    fontStyle: 'italic',
  },
  manualSearchToggle: {
    marginTop: '10px',
    padding: '6px 10px',
    fontSize: '12px',
    color: '#aaa',
    backgroundColor: '#2a2a2a',
    border: '2px solid transparent',
    borderRadius: '4px',
    textAlign: 'center',
  },
  manualSearchPanel: {
    marginTop: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  manualSearchError: {
    fontSize: '12px',
    color: '#ff6b6b',
    fontStyle: 'italic',
  },
  manualResultsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    maxHeight: '160px',
    overflowY: 'auto',
  },
  manualResultItem: {
    padding: '8px',
    backgroundColor: '#2a2a2a',
    border: '2px solid transparent',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  manualResultName: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'white',
  },
  manualResultMeta: {
    fontSize: '11px',
    color: '#888',
    marginTop: '2px',
  },
  manualResultPlatforms: {
    fontSize: '10px',
    color: '#666',
    fontStyle: 'italic',
    marginTop: '2px',
  },
  tagType: {
    fontSize: '11px',
    color: '#888',
    fontWeight: 'normal',
  },
  noTag: {
    color: '#888',
    fontStyle: 'italic',
  },
  buttonGroup: {
    display: 'flex',
    gap: '6px',
    width: '100%',
  },
  tagButtonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '10px',
  },
  tagButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    fontSize: '13px',
    fontWeight: 'bold',
    transition: 'opacity 0.2s',
  },
  secondaryButton: {
    flex: 1,
    minWidth: 0,
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    backgroundColor: '#444',
    border: '2px solid transparent',
    borderRadius: '4px',
    color: 'white',
    fontSize: '12px',
    textAlign: 'center',
    transition: 'background-color 0.2s',
  },
  closeButton: {
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    backgroundColor: '#555',
    border: '2px solid transparent',
    borderRadius: '4px',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
  },
  error: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '14px',
    color: '#ff6b6b',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#667eea',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    marginTop: '12px',
  },
};
