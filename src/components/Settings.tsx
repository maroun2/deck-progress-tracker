/**
 * Settings Component
 * Plugin settings and configuration panel
 */

import React, { FC, useState, useEffect } from 'react';
import { call } from '@decky/api';
import { Navigation } from '@decky/ui';
import { PluginSettings, SyncResult, TagStatistics, TaggedGame } from '../types';

// Tag color mapping
const TAG_COLORS: Record<string, string> = {
  completed: '#38ef7d',
  in_progress: '#764ba2',
  mastered: '#f5576c',
  backlog: '#888',
};

export const Settings: FC = () => {
  const [settings, setSettings] = useState<PluginSettings>({
    auto_tag_enabled: true,
    mastered_multiplier: 1.5,
    in_progress_threshold: 60,
    cache_ttl: 7200
  });
  const [stats, setStats] = useState<TagStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Tagged games list state
  const [taggedGames, setTaggedGames] = useState<TaggedGame[]>([]);
  const [showTaggedList, setShowTaggedList] = useState(false);
  const [loadingGames, setLoadingGames] = useState(false);

  useEffect(() => {
    loadSettings();
    loadStats();
  }, []);

  const loadSettings = async () => {
    try {
      const result = await call<[], { settings: PluginSettings }>('get_settings');
      if (result.settings) {
        setSettings(result.settings);
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  const loadStats = async () => {
    try {
      const result = await call<[], { stats: TagStatistics }>('get_tag_statistics');
      if (result.stats) {
        setStats(result.stats);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const loadTaggedGames = async () => {
    try {
      setLoadingGames(true);
      const result = await call<[], { success: boolean; games: TaggedGame[] }>('get_all_tags_with_names');
      if (result.success && result.games) {
        setTaggedGames(result.games);
      }
    } catch (err) {
      console.error('Error loading tagged games:', err);
    } finally {
      setLoadingGames(false);
    }
  };

  const toggleTaggedList = () => {
    if (!showTaggedList && taggedGames.length === 0) {
      loadTaggedGames();
    }
    setShowTaggedList(!showTaggedList);
  };

  const navigateToGame = (appid: string) => {
    Navigation.Navigate(`/library/app/${appid}`);
    Navigation.CloseSideMenus();
  };

  const updateSetting = async (key: keyof PluginSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    try {
      await call<[{ settings: PluginSettings }], void>('update_settings', { settings: newSettings });
      showMessage('Settings saved');
    } catch (err) {
      console.error('Error updating settings:', err);
      showMessage('Failed to save settings');
    }
  };

  const syncLibrary = async () => {
    console.log('[GameProgressTracker] syncLibrary button clicked');
    try {
      setSyncing(true);
      setMessage('Syncing library... This may take several minutes.');

      console.log('[GameProgressTracker] Calling backend sync_library...');
      const result = await call<[], SyncResult>('sync_library');
      console.log('[GameProgressTracker] sync_library result:', result);

      if (result.success) {
        showMessage(
          `Sync complete! ${result.synced}/${result.total} games synced. ` +
          (result.errors ? `${result.errors} errors.` : '')
        );
        await loadStats();
        // Reload tagged games if the list is visible
        if (showTaggedList) {
          await loadTaggedGames();
        }
      } else {
        showMessage(`Sync failed: ${result.error}`);
      }
    } catch (err: any) {
      console.error('[GameProgressTracker] Error syncing library:', err);
      showMessage(`Sync error: ${err?.message || 'Unknown error'}`);
    } finally {
      setSyncing(false);
    }
  };

  const refreshCache = async () => {
    try {
      setLoading(true);
      await call<[], void>('refresh_hltb_cache');
      showMessage('Cache will be refreshed on next sync');
    } catch (err) {
      console.error('Error refreshing cache:', err);
      showMessage('Failed to refresh cache');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 5000);
  };

  // Group tagged games by tag type
  const groupedGames = taggedGames.reduce((acc, game) => {
    if (!acc[game.tag]) {
      acc[game.tag] = [];
    }
    acc[game.tag].push(game);
    return acc;
  }, {} as Record<string, TaggedGame[]>);

  const tagLabels: Record<string, string> = {
    completed: 'Completed',
    mastered: 'Mastered',
    in_progress: 'In Progress',
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Game Progress Tracker</h2>

      {message && (
        <div style={styles.message}>{message}</div>
      )}

      {/* Statistics */}
      {stats && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Library Statistics</h3>
          <div style={styles.statGrid}>
            <div style={styles.statCard}>
              <div style={{ ...styles.statValue, color: TAG_COLORS.completed }}>
                {stats.completed}
              </div>
              <div style={styles.statLabel}>Completed</div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statValue, color: TAG_COLORS.in_progress }}>
                {stats.in_progress}
              </div>
              <div style={styles.statLabel}>In Progress</div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statValue, color: TAG_COLORS.mastered }}>
                {stats.mastered}
              </div>
              <div style={styles.statLabel}>Mastered</div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statValue, color: TAG_COLORS.backlog }}>
                {stats.backlog}
              </div>
              <div style={styles.statLabel}>Backlog</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{stats.total}</div>
              <div style={styles.statLabel}>Total Games</div>
            </div>
          </div>
        </div>
      )}

      {/* Tagged Games List */}
      <div style={styles.section}>
        <button
          onClick={toggleTaggedList}
          style={styles.expandButton}
        >
          {showTaggedList ? '- Hide' : '+ View'} All Tagged Games
          {stats && ` (${stats.completed + stats.in_progress + stats.mastered} games)`}
        </button>

        {showTaggedList && (
          <div style={styles.taggedListContainer}>
            {loadingGames ? (
              <div style={styles.loadingText}>Loading games...</div>
            ) : taggedGames.length === 0 ? (
              <div style={styles.loadingText}>No tagged games yet. Run a sync first!</div>
            ) : (
              ['completed', 'mastered', 'in_progress'].map((tagType) => {
                const games = groupedGames[tagType] || [];
                if (games.length === 0) return null;

                return (
                  <div key={tagType} style={styles.tagGroup}>
                    <div style={styles.tagGroupHeader}>
                      <span
                        style={{
                          ...styles.tagDot,
                          backgroundColor: TAG_COLORS[tagType],
                        }}
                      />
                      {tagLabels[tagType]} ({games.length})
                    </div>
                    <div style={styles.gameList}>
                      {games.map((game) => (
                        <div
                          key={game.appid}
                          style={styles.gameItem}
                          onClick={() => navigateToGame(game.appid)}
                        >
                          <span
                            style={{
                              ...styles.smallDot,
                              backgroundColor: TAG_COLORS[game.tag],
                            }}
                          />
                          <span style={styles.gameName}>{game.game_name}</span>
                          {game.is_manual && (
                            <span style={styles.manualBadge}>manual</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Auto-tagging Settings */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Automatic Tagging</h3>

        <div style={styles.settingRow}>
          <label style={styles.label}>
            <input
              type="checkbox"
              checked={settings.auto_tag_enabled}
              onChange={(e) => updateSetting('auto_tag_enabled', e.target.checked)}
              style={styles.checkbox}
            />
            Enable Auto-Tagging
          </label>
        </div>
      </div>

      {/* Tag Thresholds */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Tag Thresholds</h3>

        <div style={styles.settingRow}>
          <label style={styles.label}>
            Mastered Multiplier: {settings.mastered_multiplier}x
          </label>
          <input
            type="range"
            min="1.0"
            max="3.0"
            step="0.1"
            value={settings.mastered_multiplier}
            onChange={(e) => updateSetting('mastered_multiplier', parseFloat(e.target.value))}
            style={styles.slider}
          />
          <div style={styles.hint}>
            Playtime must be this many times the HLTB completion time
          </div>
        </div>

        <div style={styles.settingRow}>
          <label style={styles.label}>
            In Progress Threshold: {settings.in_progress_threshold} minutes
          </label>
          <input
            type="range"
            min="15"
            max="300"
            step="15"
            value={settings.in_progress_threshold}
            onChange={(e) => updateSetting('in_progress_threshold', parseInt(e.target.value))}
            style={styles.slider}
          />
          <div style={styles.hint}>
            Minimum playtime to mark as In Progress
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Data Management</h3>

        <button
          onClick={syncLibrary}
          disabled={syncing || loading}
          style={syncing ? styles.buttonDisabled : styles.button}
        >
          {syncing ? 'Syncing...' : 'Sync Entire Library'}
        </button>

        <button
          onClick={refreshCache}
          disabled={syncing || loading}
          style={styles.buttonSecondary}
        >
          Refresh HLTB Cache
        </button>

        <div style={styles.hint}>
          Sync may take several minutes for large libraries
        </div>
      </div>

      {/* About */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>About</h3>
        <div style={styles.about}>
          <p>Game Progress Tracker v{__PLUGIN_VERSION__}</p>
          <p>Automatic game tagging based on achievements, playtime, and completion time.</p>
          <p style={styles.smallText}>
            Data from HowLongToBeat • Steam achievement system
          </p>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '16px',
    color: 'white',
  },
  title: {
    margin: '0 0 20px 0',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  message: {
    padding: '12px',
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '14px',
    border: '1px solid rgba(102, 126, 234, 0.5)',
  },
  section: {
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #333',
  },
  sectionTitle: {
    margin: '0 0 12px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#aaa',
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '10px',
  },
  statCard: {
    backgroundColor: '#252525',
    padding: '12px 8px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '11px',
    color: '#aaa',
  },
  expandButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#333',
    border: '1px solid #444',
    borderRadius: '4px',
    color: 'white',
    fontSize: '14px',
    cursor: 'pointer',
    textAlign: 'left',
  },
  taggedListContainer: {
    marginTop: '12px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  loadingText: {
    padding: '16px',
    textAlign: 'center',
    color: '#888',
    fontSize: '14px',
  },
  tagGroup: {
    marginBottom: '16px',
  },
  tagGroupHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#ccc',
    marginBottom: '8px',
    paddingBottom: '4px',
    borderBottom: '1px solid #333',
  },
  tagDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    display: 'inline-block',
  },
  gameList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  gameItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: '#252525',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  smallDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  gameName: {
    fontSize: '13px',
    color: '#ddd',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  manualBadge: {
    fontSize: '10px',
    color: '#888',
    backgroundColor: '#333',
    padding: '2px 6px',
    borderRadius: '3px',
  },
  settingRow: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    marginBottom: '8px',
    cursor: 'pointer',
  },
  checkbox: {
    marginRight: '8px',
    cursor: 'pointer',
  },
  slider: {
    width: '100%',
    marginTop: '8px',
  },
  hint: {
    fontSize: '12px',
    color: '#888',
    marginTop: '4px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#667eea',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '8px',
    transition: 'background-color 0.2s',
  },
  buttonDisabled: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#555',
    border: 'none',
    borderRadius: '4px',
    color: '#aaa',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'not-allowed',
    marginBottom: '8px',
  },
  buttonSecondary: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#444',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    fontSize: '13px',
    cursor: 'pointer',
    marginBottom: '8px',
  },
  about: {
    fontSize: '14px',
    lineHeight: '1.6',
  },
  smallText: {
    fontSize: '12px',
    color: '#888',
    marginTop: '8px',
  },
};
