/**
 * English (default/fallback) translations
 */
export const en = {
  // Settings - Library section
  'settings.library': 'Library',
  'settings.noGamesFound': 'No games found',
  'settings.manual': 'manual',

  // Settings - Sync
  'settings.syncLibrary': 'Sync Entire Library',
  'settings.syncing': 'Syncing...',
  'settings.syncStarting': 'Starting sync...',
  'settings.syncingProgress': 'Syncing: {current}/{total} games',
  'settings.syncComplete': 'Sync complete! Library updated.',
  'settings.syncCompleteDetailed': 'Sync complete! {synced} games updated{newTags}.',
  'settings.syncCompleteNewTags': ', {count} new tags',
  'settings.syncError': 'Sync error: {error}',

  // Settings - Badge Position
  'settings.badgePosition': 'Badge Position',
  'settings.horizontal': 'Horizontal',
  'settings.vertical': 'Vertical',
  'settings.left': 'Left',
  'settings.center': 'Center',
  'settings.right': 'Right',
  'settings.top': 'Top',
  'settings.bottom': 'Bottom',
  'settings.avoidOverlap': 'Nudge toward center',
  'settings.avoidOverlapDesc': 'Offsets the badge toward the center by this many pixels (only applies to Top/Bottom), to avoid overlapping another plugin\'s badge in the same corner.',

  // Settings - Tagging
  'settings.tagging': 'Tagging',
  'settings.inProgressThreshold': 'In Progress threshold',
  'settings.minutesSuffix': ' min',

  // Settings - Language
  'settings.language': 'Language',
  'settings.languageAuto': 'Automatic (System)',
  'settings.languageEnglish': 'English',
  'settings.languagePortuguese': 'Português (Brasil)',

  // Settings - About
  'settings.about': 'About',
  'settings.aboutDataSource': 'Data from HowLongToBeat & Steam',
  'settings.supportPatreon': 'Support on Patreon',

  // Tags - labels
  'tag.completed': 'Completed',
  'tag.in_progress': 'In Progress',
  'tag.backlog': 'Backlog',
  'tag.mastered': 'Mastered',
  'tag.dropped': 'Dropped',

  // Tags - descriptions
  'tag.completed.desc': 'Beat the main story (playtime ≥ HLTB main story time)',
  'tag.in_progress.desc': 'Currently playing (playtime ≥ 30 minutes)',
  'tag.backlog.desc': 'Not started yet (no playtime or minimal playtime)',
  'tag.mastered.desc': 'Unlocked 85%+ of all achievements',
  'tag.dropped.desc': 'Not played for over 1 year',

  // Badge (on game banner)
  'badge.addTag': 'Add Tag',
  'badge.clickToAddTag': 'Click to add tag',
  'badge.manualTagEdit': 'Manual tag - Click to edit',
  'badge.autoTagEdit': 'Automatic tag - Click to edit',

  // TagManager modal
  'tagManager.loading': 'Loading...',
  'tagManager.failedToLoad': 'Failed to load game details',
  'tagManager.failedToSetTag': 'Failed to set tag',
  'tagManager.failedToReset': 'Failed to reset tag',
  'tagManager.failedToRemove': 'Failed to remove tag',
  'tagManager.close': 'Close',
  'tagManager.statistics': 'Statistics',
  'tagManager.playtime': 'Playtime:',
  'tagManager.achievements': 'Achievements:',
  'tagManager.hltbMatch': 'HLTB Match:',
  'tagManager.mainStory': 'Main Story:',
  'tagManager.hltb': 'HLTB:',
  'tagManager.noData': 'No data',
  'tagManager.manualTag': '(Manual)',
  'tagManager.autoTag': '(Auto)',
  'tagManager.setTag': 'Set Tag',
  'tagManager.resetToAuto': 'Reset to Auto',
  'tagManager.remove': 'Remove',
  'tagManager.manualSearchOpen': 'Search HLTB manually',
  'tagManager.manualSearchClose': 'Close manual search',
  'tagManager.manualSearchButton': 'Search',
  'tagManager.manualSearching': 'Searching...',
  'tagManager.manualSearchNoResults': 'No results found',
  'tagManager.gameFallback': 'Game {appid}',
};

export type TranslationKey = keyof typeof en;
