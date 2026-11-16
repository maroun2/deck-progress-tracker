/**
 * English (default/fallback) translations
 */
export const en = {
  // Settings - Library section
  'settings.library': 'Library',
  'settings.noGamesFound': 'No games found',
  'settings.manual': 'manual',

  // Library sync (main panel)
  'sync.section': 'Library sync',
  'sync.desc': 'Re-scan playtime and achievements for every game and update tags.',
  'sync.button': 'Sync Entire Library',
  'sync.buttonBusy': 'Syncing...',
  'sync.starting': 'Starting sync...',
  'sync.progress': 'Syncing: {current}/{total} games',
  'sync.complete': 'Sync complete! Library updated.',
  'sync.completeDetailed': 'Sync complete! {synced} games updated{newTags}.',
  'sync.completeNewTags': ', {count} new tags',
  'sync.error': 'Sync error: {error}',

  // Settings - Badge Position
  'settings.badgePosition': 'Game page badge',
  'settings.horizontal': 'Horizontal',
  'settings.vertical': 'Vertical',
  'settings.left': 'Left',
  'settings.center': 'Center',
  'settings.right': 'Right',
  'settings.top': 'Top',
  'settings.bottom': 'Bottom',
  'settings.avoidOverlap': 'Vertical nudge',
  'settings.avoidOverlapDesc': 'Shifts the badge vertically by this many pixels, to avoid overlapping another plugin\'s badge in the same spot.',

  // Settings - Tagging
  'settings.tagging': 'Tagging',
  'settings.inProgressThreshold': 'In Progress threshold',
  'settings.minutesSuffix': ' min',
  'settings.masteredThreshold': 'Mastered threshold',
  'settings.masteredThresholdDesc': 'Minimum percentage of achievements unlocked for a game to be tagged Mastered.',
  'settings.customizeTags': 'Customize Tags',
  'settings.resetTagCustomization': 'Reset to Default',

  // Settings page / panel
  'settings.back': 'Back',
  'settings.openSettings': 'Settings',
  'settings.notificationsSection': 'Notifications',
  'settings.syncNotifications': 'Sync notifications',
  'settings.syncNotificationsDesc': 'Pop-ups from the automatic sync at startup. Success pop-ups never show while a game is running. A sync you start from the main page always reports back.',
  'settings.syncNotificationsAll': 'All',
  'settings.syncNotificationsErrors': 'Errors only',
  'settings.syncNotificationsOff': 'Off',
  'notify.startupSyncFailed': 'Automatic sync failed: {error}. Use Sync Entire Library on the plugin\'s main page to try again.',
  'settings.badgePositionDesc': 'Where the tag badge sits on a game\'s page banner.',
  'settings.customizeTagsDesc': 'Rename tags and pick their colours. Colours are used in the lists, on the game page and on library tiles.',

  // Settings - Library tile badges
  'settings.libraryBadgePosition': 'Library badge position',
  'settings.libraryBadgePositionDesc': 'Small tag icon on every game tile in the library, collections and Home. ProtonDB Badges uses the bottom left by default; if both are in the same corner, this badge steps aside.',
  'settings.libraryShowBacklog': 'Show Backlog badges',
  'settings.libraryShowBacklogDesc': 'Turn off to badge only tagged games (In Progress, Completed, Mastered, Dropped). Untagged games then have no badge.',
  'settings.positionNone': 'None (off)',
  'settings.positionTopLeft': 'Top left',
  'settings.positionTopRight': 'Top right',
  'settings.positionBottomLeft': 'Bottom left',
  'settings.positionBottomRight': 'Bottom right',

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
  'tag.mastered.desc': 'Unlocked {threshold}%+ of all achievements',
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
