const manifest = {"name":"Deck Progress Tracker","author":"Maron","version":"1.5.0","api_version":1,"flags":[],"publish":{"tags":["library","achievements","statistics","enhancement","progress-tracking"],"description":"Automatic game tagging based on achievements, playtime, and completion time. Track your progress with visual badges in the Steam library. Features 5 intelligent tags: Mastered, Completed, Dropped, In Progress, and Backlog.","image":"https://raw.githubusercontent.com/maroun2/deck-progress-tracker/main/assets/library-badges.png"}};
const API_VERSION = 2;
if (!manifest?.name) {
    throw new Error('[@decky/api]: Failed to find plugin manifest.');
}
const internalAPIConnection = window.__DECKY_SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_deckyLoaderAPIInit;
if (!internalAPIConnection) {
    throw new Error('[@decky/api]: Failed to connect to the loader as as the loader API was not initialized. This is likely a bug in Decky Loader.');
}
let api;
try {
    api = internalAPIConnection.connect(API_VERSION, manifest.name);
}
catch {
    api = internalAPIConnection.connect(1, manifest.name);
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version 1. Some features may not work.`);
}
if (api._version != API_VERSION) {
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version ${api._version}. Some features may not work.`);
}
const call = api.call;
const routerHook = api.routerHook;
const toaster = api.toaster;
const definePlugin = (fn) => {
    return (...args) => {
        return fn(...args);
    };
};

var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = SP_REACT.createContext && /*#__PURE__*/SP_REACT.createContext(DefaultContext);

var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /*#__PURE__*/SP_REACT.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return props => /*#__PURE__*/SP_REACT.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = conf => {
    var {
        attr,
        size,
        title
      } = props,
      svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /*#__PURE__*/SP_REACT.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /*#__PURE__*/SP_REACT.createElement("title", null, title), props.children);
  };
  return IconContext !== undefined ? /*#__PURE__*/SP_REACT.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
}

// THIS FILE IS AUTO GENERATED
function FaArrowLeft (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"},"child":[]}]})(props);
}function FaCog (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"},"child":[]}]})(props);
}function FaTrophy (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M552 64H448V24c0-13.3-10.7-24-24-24H152c-13.3 0-24 10.7-24 24v40H24C10.7 64 0 74.7 0 88v56c0 35.7 22.5 72.4 61.9 100.7 31.5 22.7 69.8 37.1 110 41.7C203.3 338.5 240 360 240 360v72h-48c-35.3 0-64 20.7-64 56v12c0 6.6 5.4 12 12 12h296c6.6 0 12-5.4 12-12v-12c0-35.3-28.7-56-64-56h-48v-72s36.7-21.5 68.1-73.6c40.3-4.6 78.6-19 110-41.7 39.3-28.3 61.9-65 61.9-100.7V88c0-13.3-10.7-24-24-24zM99.3 192.8C74.9 175.2 64 155.6 64 144v-16h64.2c1 32.6 5.8 61.2 12.8 86.2-15.1-5.2-29.2-12.4-41.7-21.4zM512 144c0 16.1-17.7 36.1-35.3 48.8-12.5 9-26.7 16.2-41.8 21.4 7-25 11.8-53.6 12.8-86.2H512v16z"},"child":[]}]})(props);
}

// Tag colors matching the existing theme
const TAG_ICON_COLORS = {
    mastered: '#f5576c',
    completed: '#38ef7d',
    in_progress: '#764ba2',
    backlog: '#888',
    dropped: '#c9a171', // Beige/tan color for dropped games
};
// Note: TrophyIcon removed - now using FaTrophy from react-icons
/**
 * Checkmark in circle for Completed (beat main story)
 */
const CheckCircleIcon = ({ size, color }) => (SP_REACT.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none" },
    SP_REACT.createElement("circle", { cx: "12", cy: "12", r: "10", stroke: color, strokeWidth: "2", fill: "none" }),
    SP_REACT.createElement("path", { d: "M8 12l3 3 5-6", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", fill: "none" })));
/**
 * Clock/hourglass icon for In Progress
 */
const ClockIcon = ({ size, color }) => (SP_REACT.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none" },
    SP_REACT.createElement("circle", { cx: "12", cy: "12", r: "10", stroke: color, strokeWidth: "2", fill: "none" }),
    SP_REACT.createElement("path", { d: "M12 6v6l4 2", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", fill: "none" })));
/**
 * Empty circle for Backlog (not started)
 */
const EmptyCircleIcon = ({ size, color }) => (SP_REACT.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none" },
    SP_REACT.createElement("circle", { cx: "12", cy: "12", r: "10", stroke: color, strokeWidth: "2", fill: "none" })));
/**
 * X in circle for Dropped (abandoned)
 */
const XCircleIcon = ({ size, color }) => (SP_REACT.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none" },
    SP_REACT.createElement("circle", { cx: "12", cy: "12", r: "10", stroke: color, strokeWidth: "2", fill: "none" }),
    SP_REACT.createElement("path", { d: "M15 9l-6 6M9 9l6 6", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", fill: "none" })));
/**
 * TagIcon component - displays appropriate icon based on tag type
 */
const TagIcon = ({ type, size = 24, className, color: colorOverride }) => {
    if (!type)
        return null;
    const color = colorOverride || TAG_ICON_COLORS[type] || TAG_ICON_COLORS.backlog;
    const iconStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    };
    return (SP_REACT.createElement("span", { style: iconStyle, className: className },
        type === 'mastered' && SP_REACT.createElement(FaTrophy, { size: size, color: color }),
        type === 'completed' && SP_REACT.createElement(CheckCircleIcon, { size: size, color: color }),
        type === 'in_progress' && SP_REACT.createElement(ClockIcon, { size: size, color: color }),
        type === 'backlog' && SP_REACT.createElement(EmptyCircleIcon, { size: size, color: color }),
        type === 'dropped' && SP_REACT.createElement(XCircleIcon, { size: size, color: color })));
};

/**
 * English (default/fallback) translations
 */
const en = {
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
    'settings.syncSection': 'Library sync',
    'settings.syncDesc': 'Re-scan playtime and achievements for every game and update tags.',
    'settings.syncNotifications': 'Sync notifications',
    'settings.syncNotificationsDesc': 'Pop-ups from the automatic sync at startup. Success pop-ups never show while a game is running. A sync you start here always reports back.',
    'settings.syncNotificationsAll': 'All',
    'settings.syncNotificationsErrors': 'Errors only',
    'settings.syncNotificationsOff': 'Off',
    'notify.startupSyncFailed': 'Automatic sync failed: {error}. Use Sync Entire Library in Settings to try again.',
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

/**
 * Brazilian Portuguese translations
 */
const ptBR = {
    // Settings - Library section
    'settings.library': 'Biblioteca',
    'settings.noGamesFound': 'Nenhum jogo encontrado',
    'settings.manual': 'manual',
    // Settings - Sync
    'settings.syncLibrary': 'Sincronizar Biblioteca Inteira',
    'settings.syncing': 'Sincronizando...',
    'settings.syncStarting': 'Iniciando sincronização...',
    'settings.syncingProgress': 'Sincronizando: {current}/{total} jogos',
    'settings.syncComplete': 'Sincronização concluída! Biblioteca atualizada.',
    'settings.syncCompleteDetailed': 'Sincronização concluída! {synced} jogos atualizados{newTags}.',
    'settings.syncCompleteNewTags': ', {count} novas tags',
    'settings.syncError': 'Erro na sincronização: {error}',
    // Settings - Badge Position
    'settings.badgePosition': 'Badge da página do jogo',
    'settings.horizontal': 'Horizontal',
    'settings.vertical': 'Vertical',
    'settings.left': 'Esquerda',
    'settings.center': 'Centro',
    'settings.right': 'Direita',
    'settings.top': 'Topo',
    'settings.bottom': 'Baixo',
    'settings.avoidOverlap': 'Deslocamento vertical',
    'settings.avoidOverlapDesc': 'Desloca o badge verticalmente por essa quantidade de pixels, para evitar sobrepor o badge de outro plugin no mesmo local.',
    // Settings - Tagging
    'settings.tagging': 'Marcação de Tags',
    'settings.inProgressThreshold': 'Limite para "Em Progresso"',
    'settings.minutesSuffix': ' min',
    'settings.masteredThreshold': 'Limite para "Dominado"',
    'settings.masteredThresholdDesc': 'Percentual mínimo de conquistas desbloqueadas para o jogo ser marcado como Dominado.',
    'settings.customizeTags': 'Personalizar Tags',
    'settings.resetTagCustomization': 'Redefinir para o Padrão',
    // Settings page / panel
    'settings.back': 'Voltar',
    'settings.openSettings': 'Configurações',
    'settings.syncSection': 'Sincronização da biblioteca',
    'settings.syncDesc': 'Verifica novamente o tempo de jogo e as conquistas de todos os jogos e atualiza as tags.',
    'settings.syncNotifications': 'Notificações de sincronização',
    'settings.syncNotificationsDesc': 'Pop-ups da sincronização automática ao iniciar. Pop-ups de sucesso nunca aparecem durante um jogo. Uma sincronização iniciada aqui sempre mostra o resultado.',
    'settings.syncNotificationsAll': 'Todas',
    'settings.syncNotificationsErrors': 'Somente erros',
    'settings.syncNotificationsOff': 'Desativadas',
    'notify.startupSyncFailed': 'A sincronização automática falhou: {error}. Use "Sincronizar Biblioteca Inteira" nas Configurações para tentar novamente.',
    'settings.badgePositionDesc': 'Onde o badge da tag aparece no banner da página do jogo.',
    'settings.customizeTagsDesc': 'Renomeie as tags e escolha suas cores. As cores são usadas nas listas, na página do jogo e nos blocos da biblioteca.',
    // Settings - Library tile badges
    'settings.libraryBadgePosition': 'Posição do badge na biblioteca',
    'settings.libraryBadgePositionDesc': 'Pequeno ícone da tag em cada jogo da biblioteca, das coleções e da tela inicial. O ProtonDB Badges usa o canto inferior esquerdo por padrão; se ambos estiverem no mesmo canto, este badge se afasta.',
    'settings.libraryShowBacklog': 'Mostrar badges de Backlog',
    'settings.libraryShowBacklogDesc': 'Desative para mostrar badges só nos jogos com tag (Em Progresso, Completo, Dominado, Abandonado). Jogos sem tag ficam sem badge.',
    'settings.positionNone': 'Nenhuma (desligado)',
    'settings.positionTopLeft': 'Superior esquerdo',
    'settings.positionTopRight': 'Superior direito',
    'settings.positionBottomLeft': 'Inferior esquerdo',
    'settings.positionBottomRight': 'Inferior direito',
    // Settings - Language
    'settings.language': 'Idioma',
    'settings.languageAuto': 'Automático (Sistema)',
    'settings.languageEnglish': 'English',
    'settings.languagePortuguese': 'Português (Brasil)',
    // Settings - About
    'settings.about': 'Sobre',
    'settings.aboutDataSource': 'Dados do HowLongToBeat & Steam',
    'settings.supportPatreon': 'Apoie no Patreon',
    // Tags - labels
    'tag.completed': 'Completo',
    'tag.in_progress': 'Em Progresso',
    'tag.backlog': 'Backlog',
    'tag.mastered': 'Dominado',
    'tag.dropped': 'Abandonado',
    // Tags - descriptions
    'tag.completed.desc': 'Terminou a história principal (tempo jogado ≥ tempo da história principal no HLTB)',
    'tag.in_progress.desc': 'Jogando atualmente (tempo jogado ≥ 30 minutos)',
    'tag.backlog.desc': 'Ainda não iniciado (sem tempo jogado ou tempo mínimo)',
    'tag.mastered.desc': 'Desbloqueou {threshold}%+ de todas as conquistas',
    'tag.dropped.desc': 'Não jogado por mais de 1 ano',
    // Badge (on game banner)
    'badge.addTag': 'Adicionar Tag',
    'badge.clickToAddTag': 'Clique para adicionar uma tag',
    'badge.manualTagEdit': 'Tag manual - Clique para editar',
    'badge.autoTagEdit': 'Tag automática - Clique para editar',
    // TagManager modal
    'tagManager.loading': 'Carregando...',
    'tagManager.failedToLoad': 'Falha ao carregar detalhes do jogo',
    'tagManager.failedToSetTag': 'Falha ao definir a tag',
    'tagManager.failedToReset': 'Falha ao redefinir a tag',
    'tagManager.failedToRemove': 'Falha ao remover a tag',
    'tagManager.close': 'Fechar',
    'tagManager.statistics': 'Estatísticas',
    'tagManager.playtime': 'Tempo jogado:',
    'tagManager.achievements': 'Conquistas:',
    'tagManager.hltbMatch': 'Correspondência HLTB:',
    'tagManager.mainStory': 'História Principal:',
    'tagManager.hltb': 'HLTB:',
    'tagManager.noData': 'Sem dados',
    'tagManager.manualTag': '(Manual)',
    'tagManager.autoTag': '(Automática)',
    'tagManager.setTag': 'Definir Tag',
    'tagManager.resetToAuto': 'Voltar ao Automático',
    'tagManager.remove': 'Remover',
    'tagManager.manualSearchOpen': 'Buscar HLTB manualmente',
    'tagManager.manualSearchClose': 'Fechar busca manual',
    'tagManager.manualSearchButton': 'Buscar',
    'tagManager.manualSearching': 'Buscando...',
    'tagManager.manualSearchNoResults': 'Nenhum resultado encontrado',
    'tagManager.gameFallback': 'Jogo {appid}',
};

const DICTIONARIES = {
    en,
    'pt-BR': ptBR,
};
const LANGUAGE_UPDATED_EVENT = 'deck-progress-tracker:language-updated';
function detectSystemLanguage() {
    const systemLanguage = (navigator.language || 'en').toLowerCase();
    return systemLanguage.startsWith('pt') ? 'pt-BR' : 'en';
}
let currentLanguage = detectSystemLanguage();
let initialized = false;
const listeners$1 = new Set();
async function resolveLanguage() {
    try {
        const result = await call('get_settings');
        const preference = result.settings?.language || 'auto';
        return preference === 'auto' ? detectSystemLanguage() : preference;
    }
    catch (e) {
        return detectSystemLanguage();
    }
}
async function refreshLanguage() {
    currentLanguage = await resolveLanguage();
    listeners$1.forEach((listener) => listener());
}
function ensureInitialized() {
    if (initialized) {
        return;
    }
    initialized = true;
    refreshLanguage();
    window.addEventListener(LANGUAGE_UPDATED_EVENT, refreshLanguage);
}
function translate(key, vars) {
    const template = DICTIONARIES[currentLanguage][key] ?? en[key] ?? key;
    if (!vars) {
        return template;
    }
    return Object.entries(vars).reduce((acc, [name, value]) => acc.split(`{${name}}`).join(String(value)), template);
}
/**
 * Subscribes to language changes (triggered via LANGUAGE_UPDATED_EVENT,
 * dispatched by Settings after the user changes their preference).
 */
function subscribeToLanguage(listener) {
    ensureInitialized();
    listeners$1.add(listener);
    return () => listeners$1.delete(listener);
}
/**
 * React hook giving components a `t()` function that re-renders when the
 * resolved language changes (system detection or manual override).
 */
function useTranslation() {
    const [, forceRender] = SP_REACT.useState(0);
    SP_REACT.useEffect(() => subscribeToLanguage(() => forceRender((n) => n + 1)), []);
    return { t: translate, language: currentLanguage };
}

/**
 * Shared helpers for user-customizable tag labels/colors
 * (https://github.com/maroun2/deck-progress-tracker/issues/6)
 */
// These match named presets in TAG_COLOR_PRESETS below exactly (Pink, Green,
// Blue, Brown), so the default color always shows up selected in the
// dropdown instead of needing a separate synthetic "Default" entry.
const DEFAULT_TAG_COLORS = {
    mastered: '#f5576c', // Pink
    completed: '#2ecc71', // Green
    in_progress: '#3498db', // Blue
    dropped: '#8d6e63', // Brown
};
const TAG_LABEL_SETTING_KEY = {
    mastered: 'tag_label_mastered',
    completed: 'tag_label_completed',
    in_progress: 'tag_label_in_progress',
    dropped: 'tag_label_dropped',
};
const TAG_COLOR_SETTING_KEY = {
    mastered: 'tag_color_mastered',
    completed: 'tag_color_completed',
    in_progress: 'tag_color_in_progress',
    dropped: 'tag_color_dropped',
};
const DEFAULT_TAG_LABEL_KEY = {
    mastered: 'tag.mastered',
    completed: 'tag.completed',
    in_progress: 'tag.in_progress',
    dropped: 'tag.dropped',
};
// Curated palette instead of a free color picker - @decky/ui has no native
// color input, and a raw HTML <input type="color"> doesn't play well with
// gamepad navigation (same class of issue fixed elsewhere in this plugin).
const TAG_COLOR_PRESETS = [
    { label: 'Pink', value: '#f5576c' },
    { label: 'Red', value: '#e74c3c' },
    { label: 'Orange', value: '#e67e22' },
    { label: 'Yellow', value: '#f1c40f' },
    { label: 'Green', value: '#2ecc71' },
    { label: 'Teal', value: '#1abc9c' },
    { label: 'Blue', value: '#3498db' },
    { label: 'Purple', value: '#9b59b6' },
    { label: 'Brown', value: '#8d6e63' },
    { label: 'Gray', value: '#888888' },
];
function resolveTagLabel(type, settings, t) {
    const custom = settings[TAG_LABEL_SETTING_KEY[type]];
    return custom && custom.trim() ? custom.trim() : t(DEFAULT_TAG_LABEL_KEY[type]);
}
function resolveTagColor(type, settings) {
    const custom = settings[TAG_COLOR_SETTING_KEY[type]];
    return custom && custom.trim() ? custom.trim() : DEFAULT_TAG_COLORS[type];
}

/**
 * TypeScript type definitions for Game Progress Tracker
 */
const BADGE_SETTINGS_UPDATED_EVENT = 'deck-progress-tracker:badge-settings-updated';
// Fired whenever game tags may have changed (manual tag edit, sync), so the
// library tile badges can refresh their cached tag map.
const TAGS_UPDATED_EVENT = 'deck-progress-tracker:tags-updated';
const DEFAULT_LIBRARY_BADGE_POSITION = 'top-right';
const DEFAULT_SYNC_NOTIFICATION_MODE = 'errors';

/**
 * Shared plugin settings state for the main panel and the settings page.
 */
const DEFAULT_SETTINGS = {
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
    library_badge_position: DEFAULT_LIBRARY_BADGE_POSITION,
    library_badge_show_backlog: true,
    sync_notifications: DEFAULT_SYNC_NOTIFICATION_MODE,
    language: 'auto',
    tag_label_mastered: '',
    tag_label_completed: '',
    tag_label_in_progress: '',
    tag_label_dropped: '',
    tag_color_mastered: '',
    tag_color_completed: '',
    tag_color_in_progress: '',
    tag_color_dropped: '',
};
/**
 * @param reloadOnChange re-read settings whenever another view changes
 *   them. Off for the settings page itself, where a reload racing the
 *   user's typing could overwrite a text field mid-edit.
 */
function usePluginSettings({ reloadOnChange = false } = {}) {
    const [settings, setSettings] = SP_REACT.useState(DEFAULT_SETTINGS);
    const [loaded, setLoaded] = SP_REACT.useState(false);
    SP_REACT.useEffect(() => {
        let cancelled = false;
        const load = () => call('get_settings')
            .then((res) => {
            if (!cancelled && res?.settings) {
                setSettings({ ...DEFAULT_SETTINGS, ...res.settings });
            }
        })
            .catch(() => { })
            .finally(() => {
            if (!cancelled)
                setLoaded(true);
        });
        load();
        // The Quick Access panel stays mounted while the settings page changes
        // tag labels/colours, so pick those changes up live.
        if (reloadOnChange)
            window.addEventListener(BADGE_SETTINGS_UPDATED_EVENT, load);
        return () => {
            cancelled = true;
            if (reloadOnChange)
                window.removeEventListener(BADGE_SETTINGS_UPDATED_EVENT, load);
        };
    }, []);
    /**
     * Optimistically apply and persist a settings change, then dispatch
     * `event` (if given) so other live UI (badges, language) picks it up.
     */
    const updateSettings = async (patch, event) => {
        setSettings((prev) => ({ ...prev, ...patch }));
        try {
            await call('update_settings', patch);
            if (event) {
                window.dispatchEvent(new CustomEvent(event));
            }
        }
        catch (err) {
            // Keep the optimistic value; the next load will resync
        }
    };
    return { settings, loaded, updateSettings };
}

/**
 * Shared, cached state for the library tile badges.
 *
 * Steam can render hundreds of game capsules at once (library grid, Home
 * shelves, collections), so tiles never talk to the backend themselves:
 * the whole {appid: tag} map is fetched with a single `get_tag_map` call and
 * cached here, together with the badge position and tag colour settings.
 * Tiles subscribe and only re-render when their own derived badge changes.
 */
const VALID_POSITIONS = ['none', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
// A tile mounting after this long triggers one background refresh of the
// tag map (covers tag changes made by the automatic background checks).
const TAG_MAP_STALE_MS = 60000;
// Coalesce bursts of "tags changed" events (e.g. during a library sync).
const TAG_REFRESH_DEBOUNCE_MS = 1500;
let state = {
    position: DEFAULT_LIBRARY_BADGE_POSITION,
    showBacklog: true,
    tags: {},
    hidden: {},
    tagsLoaded: false,
    colors: {},
};
const listeners = new Set();
let lastTagFetch = 0;
let tagFetchInFlight = false;
let tagRefreshTimer = null;
let active = false;
function emit(next) {
    state = next;
    listeners.forEach((listener) => {
        try {
            listener();
        }
        catch (e) {
            // A broken subscriber must never break the others
        }
    });
}
function getLibraryBadgeState() {
    return state;
}
function subscribeLibraryBadges(listener) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}
async function loadSettings() {
    try {
        const result = await call('get_settings');
        const s = result?.settings;
        if (!s || !active)
            return;
        const position = VALID_POSITIONS.includes(s.library_badge_position)
            ? s.library_badge_position
            : DEFAULT_LIBRARY_BADGE_POSITION;
        const showBacklog = s.library_badge_show_backlog !== false;
        const colors = {};
        Object.keys(TAG_COLOR_SETTING_KEY).forEach((type) => {
            const key = TAG_COLOR_SETTING_KEY[type];
            colors[key] = s[key] || '';
        });
        if (position !== state.position || showBacklog !== state.showBacklog || JSON.stringify(colors) !== JSON.stringify(state.colors)) {
            emit({ ...state, position, showBacklog, colors });
        }
    }
    catch (e) {
        // Keep previous settings on failure
    }
}
async function loadTags() {
    if (tagFetchInFlight)
        return;
    tagFetchInFlight = true;
    try {
        const result = await call('get_tag_map');
        lastTagFetch = Date.now();
        if (result?.success && result.tags && active) {
            const hidden = {};
            (result.hidden || []).forEach((appid) => {
                hidden[appid] = true;
            });
            if (!state.tagsLoaded ||
                JSON.stringify(result.tags) !== JSON.stringify(state.tags) ||
                JSON.stringify(hidden) !== JSON.stringify(state.hidden)) {
                emit({ ...state, tags: result.tags, hidden, tagsLoaded: true });
            }
        }
    }
    catch (e) {
        // Keep previous tags on failure
    }
    finally {
        tagFetchInFlight = false;
    }
}
function scheduleTagRefresh() {
    if (tagRefreshTimer)
        clearTimeout(tagRefreshTimer);
    tagRefreshTimer = setTimeout(() => {
        tagRefreshTimer = null;
        loadTags();
    }, TAG_REFRESH_DEBOUNCE_MS);
}
/**
 * Called by tiles on mount; refreshes the tag map at most once per
 * TAG_MAP_STALE_MS no matter how many tiles mount.
 */
function refreshTagsIfStale() {
    if (active && !tagFetchInFlight && Date.now() - lastTagFetch > TAG_MAP_STALE_MS) {
        loadTags();
    }
}
/**
 * Tell the library badges that tags changed (manual edit, sync, ...).
 */
function notifyTagsChanged() {
    window.dispatchEvent(new CustomEvent(TAGS_UPDATED_EVENT));
}
function initLibraryBadgeStore() {
    active = true;
    const onSettings = () => loadSettings();
    const onTags = () => scheduleTagRefresh();
    window.addEventListener(BADGE_SETTINGS_UPDATED_EVENT, onSettings);
    window.addEventListener(TAGS_UPDATED_EVENT, onTags);
    loadSettings();
    loadTags();
    return () => {
        window.removeEventListener(BADGE_SETTINGS_UPDATED_EVENT, onSettings);
        window.removeEventListener(TAGS_UPDATED_EVENT, onTags);
        if (tagRefreshTimer)
            clearTimeout(tagRefreshTimer);
        tagRefreshTimer = null;
        active = false;
        // Hide every badge that is still mounted when the plugin unloads
        emit({ ...state, position: 'none' });
    };
}

/**
 * Sync Utilities
 * Shared functions for syncing game data using Steam's frontend API
 */
/**
 * Get all owned game appids from Steam's frontend API
 * This includes both installed and uninstalled games
 * Uses SteamClient.Apps.GetAllApps() which has access to the full library
 */
const getAllOwnedGameIds = async () => {
    // Primary method: SteamClient.Apps.GetAllApps()
    const steamClient = window.SteamClient;
    if (steamClient?.Apps?.GetAllApps) {
        try {
            const apps = await steamClient.Apps.GetAllApps();
            if (apps && apps.length > 0) {
                const ids = apps.map((a) => String(a.appid || a)).filter((id) => parseInt(id) > 0);
                console.log(`[DPT] GetAllApps returned ${ids.length} games`);
                return ids;
            }
            console.log('[DPT] GetAllApps returned empty');
        }
        catch (e) {
            console.log('[DPT] GetAllApps failed:', e);
        }
    }
    else {
        console.log('[DPT] GetAllApps not available');
    }
    const appStore = window.appStore;
    const collectionStore = window.collectionStore;
    // Fallback 1: collectionStore.allAppsCollection
    if (collectionStore?.allAppsCollection?.allApps) {
        try {
            const allApps = collectionStore.allAppsCollection.allApps;
            if (allApps && allApps.length > 0) {
                const ids = allApps.map((a) => String(a.appid || a)).filter((id) => parseInt(id) > 0);
                console.log(`[DPT] collectionStore.allAppsCollection.allApps returned ${ids.length} games`);
                return ids;
            }
            console.log('[DPT] collectionStore.allAppsCollection.allApps empty');
        }
        catch (e) {
            console.log('[DPT] collectionStore.allAppsCollection failed:', e);
        }
    }
    // Fallback 2: collectionStore.allGamesCollection
    if (collectionStore?.allGamesCollection?.allApps) {
        try {
            const allApps = collectionStore.allGamesCollection.allApps;
            if (allApps && allApps.length > 0) {
                const ids = allApps.map((a) => String(a.appid || a)).filter((id) => parseInt(id) > 0);
                console.log(`[DPT] collectionStore.allGamesCollection.allApps returned ${ids.length} games`);
                return ids;
            }
            console.log('[DPT] collectionStore.allGamesCollection.allApps empty');
        }
        catch (e) {
            console.log('[DPT] collectionStore.allGamesCollection failed:', e);
        }
    }
    // Fallback 3: appStore.allApps getter
    if (appStore?.allApps) {
        try {
            const allApps = appStore.allApps;
            if (allApps && allApps.length > 0) {
                const ids = allApps.map((a) => String(a.appid || a)).filter((id) => parseInt(id) > 0);
                console.log(`[DPT] appStore.allApps returned ${ids.length} games`);
                return ids;
            }
            console.log('[DPT] appStore.allApps empty');
        }
        catch (e) {
            console.log('[DPT] appStore.allApps failed:', e);
        }
    }
    // Fallback 4: appStore.m_mapApps (Map of all apps)
    if (appStore?.m_mapApps instanceof Map) {
        const appids = Array.from(appStore.m_mapApps.keys()).map((id) => String(id));
        const filtered = appids.filter((id) => parseInt(id) > 0);
        console.log(`[DPT] appStore.m_mapApps returned ${filtered.length} games`);
        if (filtered.length > 0)
            return filtered;
    }
    console.log('[DPT] All frontend game discovery methods failed');
    return [];
};
/**
 * Get achievement data for a list of appids from Steam's frontend API
 * Uses window.appAchievementProgressCache.m_achievementProgress.mapCache for full data
 */
const getAchievementData = async (appids) => {
    const achievementMap = {};
    const achievementCache = window.appAchievementProgressCache;
    if (!achievementCache) {
        return achievementMap;
    }
    const mapCache = achievementCache.m_achievementProgress?.mapCache;
    if (!mapCache) {
        return achievementMap;
    }
    for (const appid of appids) {
        try {
            const entry = mapCache.get(parseInt(appid));
            if (entry && entry.total > 0) {
                achievementMap[appid] = {
                    total: entry.total,
                    unlocked: entry.unlocked || 0,
                    percentage: entry.percentage || 0,
                    all_unlocked: entry.all_unlocked || false
                };
            }
        }
        catch (e) {
        }
    }
    return achievementMap;
};
// Steam's app_type bitmask (from appStore.GetAppOverviewByAppID().app_type).
// Bits that are never real, playable games - dedicated servers, SDKs,
// soundtracks, etc. - which otherwise sync in and clutter the Backlog
// (https://github.com/maroun2/deck-progress-tracker/issues/4).
const NON_GAME_APP_TYPE_BITS = 2 /* Application */ |
    4 /* Tool */ |
    8 /* Demo */ |
    64 /* Guide */ |
    128 /* Driver */ |
    256 /* Config */ |
    512 /* Hardware */ |
    2048 /* Video */ |
    4096 /* Plugin */ |
    8192 /* Music */;
const GAME_APP_TYPE_BIT = 1; // Game
/**
 * Whether a Steam app overview looks like a non-game tool/app.
 * A missing/zero app_type (e.g. some non-Steam shortcuts) is never treated
 * as "it's a tool" - we only flag it when Steam explicitly says so, to
 * avoid accidentally hiding a real game due to incomplete overview data.
 */
const isLikelySteamTool = (overview) => {
    const appType = overview?.app_type;
    if (!appType)
        return false;
    if (appType & GAME_APP_TYPE_BIT)
        return false;
    return (appType & NON_GAME_APP_TYPE_BITS) !== 0;
};
/**
 * Get playtime and last played data for a list of appids from Steam's frontend API
 * Uses window.appStore which is Steam's internal game data cache
 */
const getPlaytimeData = async (appids) => {
    const gameDataMap = {};
    const appStore = window.appStore;
    if (!appStore) {
        return gameDataMap;
    }
    for (const appid of appids) {
        try {
            const overview = appStore.GetAppOverviewByAppID(parseInt(appid));
            if (overview) {
                const playtime = overview.minutes_playtime_forever || 0;
                const rtLastTimePlayed = overview.rt_last_time_played || null;
                gameDataMap[appid] = {
                    playtime_minutes: playtime,
                    rt_last_time_played: rtLastTimePlayed,
                    is_tool: isLikelySteamTool(overview)
                };
            }
        }
        catch (e) {
        }
    }
    return gameDataMap;
};
/**
 * Get game names for a list of appids from Steam's frontend API
 * Uses window.appStore.GetAppOverviewByAppID which has the display_name property
 * This works for ALL owned games, even uninstalled ones
 */
const getGameNames = async (appids) => {
    const nameMap = {};
    const appStore = window.appStore;
    if (!appStore) {
        return nameMap;
    }
    for (const appid of appids) {
        try {
            const overview = appStore.GetAppOverviewByAppID(parseInt(appid));
            if (overview && overview.display_name) {
                nameMap[appid] = overview.display_name;
            }
        }
        catch (e) {
        }
    }
    return nameMap;
};
/**
 * Get achievement data with fallback: cache first, then API call
 * Unified function for fetching achievement data that tries cache first,
 * then falls back to calling SteamClient.Apps.GetMyAchievementsForApp
 *
 * @param appids List of appids to get achievement data for
 * @returns Map of appid -> achievement data (only includes games with achievements)
 */
const getAchievementDataWithFallback = async (appids) => {
    const cacheData = await getAchievementData(appids);
    const achievementMap = { ...cacheData };
    const missingAppids = appids.filter(appid => !achievementMap[appid]);
    if (missingAppids.length === 0) {
        return achievementMap;
    }
    const steamClient = window.SteamClient;
    if (!steamClient?.Apps?.GetMyAchievementsForApp) {
        return achievementMap;
    }
    for (const appid of missingAppids) {
        try {
            const promise = steamClient.Apps.GetMyAchievementsForApp(appid);
            if (promise && typeof promise.then === 'function') {
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Timeout')), 5000);
                });
                const result = await Promise.race([promise, timeoutPromise]);
                if (result && result.result === 1 && result.data?.rgAchievements) {
                    const achievements = result.data.rgAchievements;
                    const total = achievements.length;
                    const unlocked = achievements.filter((a) => a.bAchieved).length;
                    const percentage = total > 0 ? (unlocked / total) * 100 : 0;
                    achievementMap[appid] = {
                        total,
                        unlocked,
                        percentage,
                        all_unlocked: total > 0 && unlocked === total
                    };
                }
            }
        }
        catch (e) {
        }
    }
    return achievementMap;
};
/**
 * Fetch achievement data on-demand using SteamClient.Apps.GetMyAchievementsForApp
 *
 * This uses Steam's internal API that fetches achievement data from Steam servers,
 * which works even for uninstalled games or games not in the frontend cache.
 */
const fetchAchievementsOnDemand = async (appid) => {
    const achievementCache = window.appAchievementProgressCache;
    const mapCache = achievementCache?.m_achievementProgress?.mapCache;
    if (mapCache) {
        const existing = mapCache.get(parseInt(appid));
        if (existing && existing.total > 0) {
            return {
                total: existing.total,
                unlocked: existing.unlocked || 0,
                percentage: existing.percentage || 0,
                all_unlocked: existing.all_unlocked || false
            };
        }
    }
    const steamClient = window.SteamClient;
    if (steamClient?.Apps?.GetMyAchievementsForApp) {
        try {
            const promise = steamClient.Apps.GetMyAchievementsForApp(appid);
            if (promise && typeof promise.then === 'function') {
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Timeout')), 5000);
                });
                const result = await Promise.race([promise, timeoutPromise]);
                if (result && result.result === 1 && result.data?.rgAchievements) {
                    const achievements = result.data.rgAchievements;
                    const total = achievements.length;
                    const unlocked = achievements.filter((a) => a.bAchieved).length;
                    const percentage = total > 0 ? (unlocked / total) * 100 : 0;
                    return {
                        total,
                        unlocked,
                        percentage,
                        all_unlocked: total > 0 && unlocked === total
                    };
                }
            }
        }
        catch (e) {
        }
    }
    return null;
};
/**
 * Core sync helper: sync games with frontend data
 * Unified function used by both single-game and bulk sync
 * Uses cache + API fallback for achievements
 *
 * @param appids List of appids to sync
 * @returns Sync result from backend
 */
const syncGames = async (appids) => {
    try {
        const gameData = await getPlaytimeData(appids);
        const achievementData = await getAchievementDataWithFallback(appids);
        const gameNames = await getGameNames(appids);
        try {
            const result = await call('sync_library_with_playtime', { game_data: gameData, achievement_data: achievementData, game_names: gameNames });
            if (result && result.success) {
                return result;
            }
            else {
                return result || { success: false, error: 'Backend returned null or undefined' };
            }
        }
        catch (backendError) {
            throw backendError;
        }
    }
    catch (e) {
        return { success: false, error: e?.message || 'Unknown error' };
    }
};
/**
 * Sync a single game with frontend data (playtime + achievements)
 * Called when viewing a game's detail page to get latest data
 * Uses cache + API fallback for achievements
 */
const syncSingleGameWithFrontendData = async (appid) => {
    const result = await syncGames([appid]);
    if (result.success) {
        notifyTagsChanged();
    }
    return { success: result.success, error: result.error };
};
/**
 * Progressive sync - process one game at a time completely before moving to next
 * This provides immediate feedback and avoids long waits for achievement fetching
 */
const syncLibraryProgressive = async (onProgress) => {
    try {
        const settingsResult = await call('get_settings');
        const useAllOwned = settingsResult?.settings?.source_all_owned ?? true;
        let appids;
        if (useAllOwned) {
            appids = await getAllOwnedGameIds();
            let retries = 0;
            const maxRetries = 8;
            const retryDelays = [2000, 3000, 4000, 5000, 7000, 8000, 9000, 10000];
            while (appids.length === 0 && retries < maxRetries) {
                const delay = retryDelays[retries];
                retries++;
                console.log(`[DPT] getAllOwnedGameIds retry ${retries}/${maxRetries}, waiting ${delay}ms`);
                await new Promise(resolve => setTimeout(resolve, delay));
                appids = await getAllOwnedGameIds();
            }
            if (appids.length === 0) {
                console.log('[DPT] Frontend discovery failed after all retries, falling back to backend get_all_games');
                const gamesResult = await call('get_all_games');
                if (gamesResult.success && gamesResult.games) {
                    appids = gamesResult.games.map(g => g.appid);
                    console.log(`[DPT] Backend fallback returned ${appids.length} games`);
                }
            }
            else {
                console.log(`[DPT] Frontend discovery succeeded with ${appids.length} games`);
            }
        }
        else {
            const gamesResult = await call('get_all_games');
            if (!gamesResult.success || !gamesResult.games) {
                return { success: false, error: gamesResult.error || 'Failed to get game list' };
            }
            appids = gamesResult.games.map(g => g.appid);
        }
        if (appids.length === 0) {
            return { success: true, total: 0, synced: 0, errors: 0 };
        }
        const total = appids.length;
        let synced = 0;
        let errors = 0;
        let newTags = 0;
        for (let i = 0; i < appids.length; i++) {
            const appid = appids[i];
            try {
                const gameData = await getPlaytimeData([appid]);
                const gameInfo = gameData[appid] || { playtime_minutes: 0, rt_last_time_played: null, is_tool: false };
                const achievementData = await fetchAchievementsOnDemand(appid);
                const gameNames = await getGameNames([appid]);
                const gameName = gameNames[appid] || `Game ${appid}`;
                if (onProgress) {
                    onProgress(i + 1, total, gameName);
                }
                const result = await call('sync_single_game_with_data', {
                    appid,
                    game_data: gameInfo,
                    achievement_data: achievementData,
                    game_name: gameName,
                    is_bulk_sync: true,
                    current_index: i + 1,
                    total_count: total
                });
                if (result.success) {
                    synced++;
                    if (result.tag_changed) {
                        newTags++;
                        // Debounced in libraryBadgeStore, so a burst is one refresh
                        notifyTagsChanged();
                    }
                }
                else {
                    errors++;
                }
            }
            catch (e) {
                errors++;
            }
        }
        notifyTagsChanged();
        return {
            success: true,
            total,
            synced,
            new_tags: newTags,
            errors
        };
    }
    catch (e) {
        return { success: false, error: e?.message || 'Unknown error' };
    }
};

/**
 * Pure rules for sync notifications and the startup sync retry loop.
 *
 * No Steam / Decky imports here (type-only imports are erased), so this
 * file can be exercised outside Steam with injected dependencies.
 */
const SYNC_NOTIFICATION_MODES = ['all', 'errors', 'off'];
function normalizeSyncNotificationMode(value, fallback) {
    return SYNC_NOTIFICATION_MODES.includes(value) ? value : fallback;
}
function shouldNotify(mode, kind, gameRunning) {
    switch (kind) {
        case 'manual':
            return true;
        case 'error':
            return mode !== 'off';
        case 'success':
            // Never pop a "sync done" toast over a running game.
            return mode === 'all' && !gameRunning;
        default:
            return false;
    }
}
/**
 * A startup sync only counts as done if it actually synced something.
 * Right after boot Steam can report an empty library or every game can
 * fail, which is worth a quiet retry rather than a success toast.
 */
function classifySyncResult(result) {
    if (!result || !result.success) {
        return { ok: false, error: result?.error || 'Unknown error' };
    }
    if (!result.total) {
        return { ok: false, error: 'No games found yet' };
    }
    if (!result.synced) {
        return { ok: false, error: `0 of ${result.total} games synced` };
    }
    return { ok: true };
}
/** Pauses between startup sync attempts (first attempt runs right away). */
const STARTUP_RETRY_DELAYS_MS = [10000, 30000, 60000, 120000];
/** How long to wait for network + Steam + backend before an attempt. */
const FIRST_READY_CAP_MS = 90000;
const RETRY_READY_CAP_MS = 30000;
/**
 * Wait until the Deck is ready, sync, and retry quietly with backoff. Only
 * the final failure is reported (and only if the setting allows errors -
 * `notify` decides that).
 */
async function runStartupSync(deps) {
    const delays = deps.retryDelaysMs ?? STARTUP_RETRY_DELAYS_MS;
    let lastError = 'Unknown error';
    for (let attempt = 1; attempt <= delays.length + 1; attempt++) {
        if (attempt > 1) {
            await deps.sleep(delays[attempt - 2]);
        }
        if (deps.isDisposed())
            return { ok: false, attempts: attempt - 1 };
        let ready = false;
        try {
            ready = await deps.waitUntilReady(attempt === 1 ? FIRST_READY_CAP_MS : RETRY_READY_CAP_MS);
        }
        catch (e) {
            deps.log(`Startup sync readiness check failed: ${e?.message || e}`);
        }
        if (deps.isDisposed())
            return { ok: false, attempts: attempt - 1 };
        let result;
        try {
            result = await deps.sync(attempt);
        }
        catch (e) {
            result = { success: false, error: e?.message || String(e) };
        }
        const outcome = classifySyncResult(result);
        if (outcome.ok) {
            deps.log(`Startup sync attempt ${attempt} succeeded (${result.synced}/${result.total} games, ready=${ready})`);
            await deps.notify('success', deps.successMessage(result));
            return { ok: true, attempts: attempt };
        }
        lastError = outcome.error || lastError;
        const next = delays[attempt - 1];
        deps.log(`Startup sync attempt ${attempt} failed: ${lastError} (ready=${ready}); ` +
            (next !== undefined ? `retrying quietly in ${Math.round(next / 1000)}s` : 'giving up'));
    }
    if (!deps.isDisposed()) {
        await deps.notify('error', deps.failureMessage(lastError));
    }
    return { ok: false, attempts: delays.length + 1 };
}

/**
 * Play Session Tracker
 *
 * Steam's own `minutes_playtime_forever` (read via appStore.GetAppOverviewByAppID)
 * doesn't update reliably for non-Steam shortcuts. As a fallback, this tracks
 * real session start/stop times via SteamClient's native game lifetime
 * notifications - a stable global API, not fragile module-scanning - and
 * reports elapsed session time to the backend, which only applies it for
 * non-Steam appids (regular Steam games already have reliable playtime).
 */
const sessionStarts = new Map();
/** True while a game started since the plugin loaded is still running. */
function hasActiveGameSession() {
    return sessionStarts.size > 0;
}
function handleAppLifetimeNotification(data) {
    if (data.bRunning) {
        sessionStarts.set(data.unAppID, Date.now());
        return;
    }
    const startedAt = sessionStarts.get(data.unAppID);
    sessionStarts.delete(data.unAppID);
    if (!startedAt) {
        return;
    }
    const seconds = Math.round((Date.now() - startedAt) / 1000);
    if (seconds <= 0) {
        return;
    }
    call('record_play_session', { appid: String(data.unAppID), seconds }).catch(() => {
        // Best-effort: a missed session just means this game's tracked
        // playtime undercounts until the next successful session.
    });
}
/**
 * Starts listening for game start/stop events. Returns a cleanup function
 * (or null if the SteamClient API isn't available), to call on unmount.
 */
function startPlaySessionTracking() {
    try {
        const steamClient = window.SteamClient;
        const registration = steamClient?.GameSessions?.RegisterForAppLifetimeNotifications?.(handleAppLifetimeNotification);
        if (!registration) {
            return null;
        }
        return () => {
            try {
                registration.unregister?.();
            }
            catch (e) {
                // Ignore cleanup errors
            }
        };
    }
    catch (e) {
        return null;
    }
}

/**
 * The single place that shows sync toasts. Every sync notification goes
 * through `notify(kind, body)`, which applies the "Sync notifications"
 * setting and the "game running" check (rules in syncPolicy.ts).
 */
const TITLE = 'Deck Progress Tracker';
function debugOverrides() {
    try {
        const parsed = JSON.parse(localStorage.getItem('dpt:debug') || '{}');
        return parsed && typeof parsed === 'object' ? parsed : {};
    }
    catch (e) {
        return {};
    }
}
function logFrontend(level, message) {
    call('log_frontend', level, message).catch(() => { });
}
function isGameRunning() {
    const forced = debugOverrides().gameRunning;
    if (typeof forced === 'boolean')
        return forced;
    try {
        if (DFL.Router?.MainRunningApp)
            return true;
    }
    catch (e) {
        // Router getter unavailable - fall through to our own tracking
    }
    return hasActiveGameSession();
}
async function readMode() {
    try {
        const res = await call('get_settings');
        return normalizeSyncNotificationMode(res?.settings?.sync_notifications, DEFAULT_SYNC_NOTIFICATION_MODE);
    }
    catch (e) {
        return DEFAULT_SYNC_NOTIFICATION_MODE;
    }
}
/** Shows `body` as a toast if the setting allows it. Returns whether it was shown. */
async function notify(kind, body, duration = 5000) {
    const mode = await readMode();
    const gameRunning = isGameRunning();
    const show = shouldNotify(mode, kind, gameRunning);
    logFrontend('info', `[notify] kind=${kind} mode=${mode} gameRunning=${gameRunning} -> ${show ? 'shown' : 'suppressed'}: ${body}`);
    if (show) {
        toaster.toast({ title: TITLE, body, duration });
    }
    return show;
}

/**
 * Library sync state shared by the main panel (status line) and the
 * settings page (Sync button). Polls the backend so a sync started from
 * anywhere (startup auto-sync, the other view) is reflected.
 */
function useLibrarySync(onProgressUpdate) {
    const { t } = useTranslation();
    const [syncing, setSyncing] = SP_REACT.useState(false);
    const [message, setMessage] = SP_REACT.useState(null);
    // Set while a sync started from this view is running - its own
    // completion message wins over the poller's generic one.
    const localSyncRef = SP_REACT.useRef(false);
    const onUpdateRef = SP_REACT.useRef(onProgressUpdate);
    onUpdateRef.current = onProgressUpdate;
    const clearTimerRef = SP_REACT.useRef(null);
    const showTransient = (msg, ms) => {
        setMessage(msg);
        if (clearTimerRef.current)
            clearTimeout(clearTimerRef.current);
        clearTimerRef.current = setTimeout(() => setMessage(null), ms);
    };
    SP_REACT.useEffect(() => () => {
        if (clearTimerRef.current)
            clearTimeout(clearTimerRef.current);
    }, []);
    SP_REACT.useEffect(() => {
        const pollSync = async () => {
            if (localSyncRef.current)
                return;
            try {
                const res = await call('get_sync_progress');
                if (res.success && res.syncing) {
                    setMessage(t('settings.syncingProgress', { current: res.current, total: res.total }));
                    setSyncing(true);
                }
                else if (res.success && !res.syncing && syncing) {
                    setSyncing(false);
                    onUpdateRef.current?.();
                    if (res.total && res.total > 0) {
                        showTransient(t('settings.syncComplete'), 5000);
                    }
                    else {
                        setMessage(null);
                    }
                }
            }
            catch (err) { }
        };
        const interval = setInterval(pollSync, syncing ? 500 : 2000);
        return () => clearInterval(interval);
    }, [syncing]);
    const syncLibrary = async () => {
        localSyncRef.current = true;
        try {
            setSyncing(true);
            setMessage(t('settings.syncStarting'));
            const result = await syncLibraryProgressive((current, total) => {
                setMessage(t('settings.syncingProgress', { current, total }));
                if (current % 10 === 0 || current === total) {
                    onUpdateRef.current?.();
                }
            });
            onUpdateRef.current?.();
            if (!result.success) {
                throw new Error(result.error || 'Unknown');
            }
            const newTagsSuffix = result.new_tags
                ? t('settings.syncCompleteNewTags', { count: result.new_tags })
                : '';
            const msg = t('settings.syncCompleteDetailed', { synced: result.synced ?? 0, newTags: newTagsSuffix });
            showTransient(msg, 10000);
            // Started from the plugin UI, so always report back (even with
            // notifications Off) - the panel may be closed by the time it ends.
            notify('manual', msg);
        }
        catch (err) {
            const msg = t('settings.syncError', { error: err?.message || 'Unknown' });
            setMessage(msg);
            notify('manual', msg);
        }
        finally {
            localSyncRef.current = false;
            setSyncing(false);
        }
    };
    return { syncing, message, syncLibrary };
}

/**
 * SettingsPanel - the plugin settings, shown inside the Quick Access panel.
 *
 * MainPanel swaps its whole content for this view when the Settings button
 * is pressed (like other Decky plugins, everything stays in the sidebar);
 * the Back button at the top returns to the tag lists.
 */
const CUSTOMIZABLE_TAGS = ['mastered', 'completed', 'in_progress', 'dropped'];
const TAG_LABEL_KEY$1 = {
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
function focusFirstButton(el, scrollToTop = false) {
    const timer = setTimeout(() => {
        try {
            el?.querySelector('.DialogButton')?.focus();
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
        }
        catch (e) {
            // ignore
        }
    }, 0);
    return () => clearTimeout(timer);
}
const SettingsPanel = ({ onBack, focusBack }) => {
    const { t } = useTranslation();
    const { settings, updateSettings: update } = usePluginSettings();
    const { syncing, message, syncLibrary } = useLibrarySync();
    const containerRef = SP_REACT.useRef(null);
    // The Settings button that had controller focus is gone now; hand focus
    // to Back and start the view at the top.
    SP_REACT.useEffect(() => (focusBack ? focusFirstButton(containerRef.current, true) : undefined), []);
    const libraryOptions = [
        { data: 'none', label: t('settings.positionNone') },
        { data: 'top-left', label: t('settings.positionTopLeft') },
        { data: 'top-right', label: t('settings.positionTopRight') },
        { data: 'bottom-left', label: t('settings.positionBottomLeft') },
        { data: 'bottom-right', label: t('settings.positionBottomRight') },
    ];
    const syncNotificationOptions = [
        { data: 'all', label: t('settings.syncNotificationsAll') },
        { data: 'errors', label: t('settings.syncNotificationsErrors') },
        { data: 'off', label: t('settings.syncNotificationsOff') },
    ];
    const hOptions = [
        { data: 'left', label: t('settings.left') },
        { data: 'center', label: t('settings.center') },
        { data: 'right', label: t('settings.right') },
    ];
    const vOptions = [
        { data: 'top', label: t('settings.top') },
        { data: 'center', label: t('settings.center') },
        { data: 'bottom', label: t('settings.bottom') },
    ];
    const languageOptions = [
        { data: 'auto', label: t('settings.languageAuto') },
        { data: 'en', label: t('settings.languageEnglish') },
        { data: 'pt-BR', label: t('settings.languagePortuguese') },
    ];
    const colorOptions = TAG_COLOR_PRESETS.map((preset) => ({ data: preset.value, label: preset.label }));
    // Size both game page dropdowns off the longest label so they match in
    // every language.
    const positionDropdownWidth = `${Math.max(...hOptions.map((o) => o.label.length), ...vOptions.map((o) => o.label.length)) + 4}ch`;
    const resetTagCustomization = () => {
        const cleared = {};
        CUSTOMIZABLE_TAGS.forEach((type) => {
            cleared[TAG_LABEL_SETTING_KEY[type]] = '';
            cleared[TAG_COLOR_SETTING_KEY[type]] = '';
        });
        update(cleared, BADGE_SETTINGS_UPDATED_EVENT);
    };
    return (SP_REACT.createElement("div", { ref: containerRef, style: styles$2.container },
        SP_REACT.createElement(DFL.PanelSection, null,
            SP_REACT.createElement(DFL.PanelSectionRow, null,
                SP_REACT.createElement(DFL.ButtonItem, { layout: "below", onClick: onBack },
                    SP_REACT.createElement("div", { style: styles$2.backButton },
                        SP_REACT.createElement(FaArrowLeft, null),
                        SP_REACT.createElement("span", null, t('settings.back')))))),
        SP_REACT.createElement(DFL.PanelSection, { title: t('settings.syncSection') },
            message && SP_REACT.createElement("div", { style: styles$2.message }, message),
            SP_REACT.createElement(DFL.PanelSectionRow, null,
                SP_REACT.createElement(DFL.ButtonItem, { layout: "below", description: t('settings.syncDesc'), onClick: syncLibrary, disabled: syncing }, syncing ? t('settings.syncing') : t('settings.syncLibrary'))),
            SP_REACT.createElement(DFL.PanelSectionRow, null,
                SP_REACT.createElement("div", { style: styles$2.syncNotificationsRow },
                    SP_REACT.createElement("div", { style: styles$2.fieldLabel }, t('settings.syncNotifications')),
                    SP_REACT.createElement("div", { style: styles$2.description }, t('settings.syncNotificationsDesc')),
                    SP_REACT.createElement(DFL.Dropdown, { menuLabel: t('settings.syncNotifications'), rgOptions: syncNotificationOptions, selectedOption: settings.sync_notifications, onChange: (option) => update({ sync_notifications: option.data }) })))),
        SP_REACT.createElement(DFL.PanelSection, { title: t('settings.tagging') },
            SP_REACT.createElement(DFL.PanelSectionRow, null,
                SP_REACT.createElement(DFL.SliderField, { label: t('settings.inProgressThreshold'), value: settings.in_progress_threshold, min: 1, max: 120, step: 1, editableValue: true, valueSuffix: t('settings.minutesSuffix'), onChange: (value) => update({ in_progress_threshold: value }) })),
            SP_REACT.createElement(DFL.PanelSectionRow, null,
                SP_REACT.createElement(DFL.SliderField, { label: t('settings.masteredThreshold'), description: t('settings.masteredThresholdDesc'), value: settings.mastered_threshold, min: 50, max: 100, step: 1, editableValue: true, valueSuffix: "%", onChange: (value) => update({ mastered_threshold: value }) }))),
        SP_REACT.createElement(DFL.PanelSection, { title: t('settings.libraryBadgePosition') },
            SP_REACT.createElement("div", { style: styles$2.description }, t('settings.libraryBadgePositionDesc')),
            SP_REACT.createElement(DFL.PanelSectionRow, null,
                SP_REACT.createElement("div", { style: styles$2.fullWidth },
                    SP_REACT.createElement(DFL.Dropdown, { menuLabel: t('settings.libraryBadgePosition'), rgOptions: libraryOptions, selectedOption: settings.library_badge_position, onChange: (option) => update({ library_badge_position: option.data }, BADGE_SETTINGS_UPDATED_EVENT) }))),
            SP_REACT.createElement(DFL.PanelSectionRow, null,
                SP_REACT.createElement(DFL.ToggleField, { label: t('settings.libraryShowBacklog'), description: t('settings.libraryShowBacklogDesc'), checked: settings.library_badge_show_backlog !== false, disabled: settings.library_badge_position === 'none', onChange: (checked) => update({ library_badge_show_backlog: checked }, BADGE_SETTINGS_UPDATED_EVENT) }))),
        SP_REACT.createElement(DFL.PanelSection, { title: t('settings.badgePosition') },
            SP_REACT.createElement("div", { style: styles$2.description }, t('settings.badgePositionDesc')),
            SP_REACT.createElement(DFL.PanelSectionRow, null,
                SP_REACT.createElement("div", { style: styles$2.dropdownRow },
                    SP_REACT.createElement("span", null, t('settings.horizontal')),
                    SP_REACT.createElement("div", { style: { width: positionDropdownWidth } },
                        SP_REACT.createElement(DFL.Dropdown, { menuLabel: t('settings.horizontal'), rgOptions: hOptions, selectedOption: settings.badge_position_h, onChange: (option) => update({ badge_position_h: option.data }, BADGE_SETTINGS_UPDATED_EVENT) })))),
            SP_REACT.createElement(DFL.PanelSectionRow, null,
                SP_REACT.createElement("div", { style: styles$2.dropdownRow },
                    SP_REACT.createElement("span", null, t('settings.vertical')),
                    SP_REACT.createElement("div", { style: { width: positionDropdownWidth } },
                        SP_REACT.createElement(DFL.Dropdown, { menuLabel: t('settings.vertical'), rgOptions: vOptions, selectedOption: settings.badge_position_v, onChange: (option) => update({ badge_position_v: option.data }, BADGE_SETTINGS_UPDATED_EVENT) })))),
            SP_REACT.createElement(DFL.PanelSectionRow, null,
                SP_REACT.createElement("div", { style: styles$2.avoidOverlapRow },
                    SP_REACT.createElement(DFL.SliderField, { label: t('settings.avoidOverlap'), description: t('settings.avoidOverlapDesc'), value: settings.badge_overlap_offset, min: 0, max: 100, step: 1, editableValue: true, valueSuffix: "px", onChange: (value) => update({ badge_overlap_offset: value }, BADGE_SETTINGS_UPDATED_EVENT) })))),
        SP_REACT.createElement(DFL.PanelSection, { title: t('settings.customizeTags') },
            SP_REACT.createElement("div", { style: styles$2.description }, t('settings.customizeTagsDesc')),
            CUSTOMIZABLE_TAGS.map((type, index) => (SP_REACT.createElement(DFL.PanelSectionRow, { key: type },
                SP_REACT.createElement("div", { style: index > 0 ? { ...styles$2.customTagRow, ...styles$2.customTagRowSeparator } : styles$2.customTagRow },
                    SP_REACT.createElement(DFL.TextField, { label: t(TAG_LABEL_KEY$1[type]), value: resolveTagLabel(type, settings, t), onChange: (e) => update({ [TAG_LABEL_SETTING_KEY[type]]: e.target.value }, BADGE_SETTINGS_UPDATED_EVENT) }),
                    SP_REACT.createElement("div", { style: styles$2.customTagColorWrapper },
                        SP_REACT.createElement(DFL.Dropdown, { menuLabel: t(TAG_LABEL_KEY$1[type]), rgOptions: colorOptions, selectedOption: resolveTagColor(type, settings), onChange: (option) => update({ [TAG_COLOR_SETTING_KEY[type]]: option.data }, BADGE_SETTINGS_UPDATED_EVENT) })))))),
            SP_REACT.createElement(DFL.PanelSectionRow, null,
                SP_REACT.createElement("div", { style: styles$2.customTagRowSeparator },
                    SP_REACT.createElement(DFL.ButtonItem, { layout: "below", onClick: resetTagCustomization }, t('settings.resetTagCustomization'))))),
        SP_REACT.createElement(DFL.PanelSection, { title: t('settings.language') },
            SP_REACT.createElement(DFL.PanelSectionRow, null,
                SP_REACT.createElement("div", { style: styles$2.fullWidth },
                    SP_REACT.createElement(DFL.Dropdown, { menuLabel: t('settings.language'), rgOptions: languageOptions, selectedOption: settings.language, onChange: (option) => update({ language: option.data }, LANGUAGE_UPDATED_EVENT) }))))));
};
const styles$2 = {
    container: { paddingTop: '8px', color: 'white', width: '100%', maxWidth: '100%', overflow: 'hidden' },
    backButton: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
    message: { padding: '12px', backgroundColor: 'rgba(102, 126, 234, 0.2)', borderRadius: '4px', marginBottom: '8px', fontSize: '14px', border: '1px solid rgba(102, 126, 234, 0.5)' },
    description: { fontSize: '12px', color: '#8b929a', marginBottom: '8px', lineHeight: '1.4' },
    fullWidth: { width: '100%' },
    syncNotificationsRow: { width: '100%', marginTop: '8px' },
    fieldLabel: { fontSize: '14px', marginBottom: '4px' },
    dropdownRow: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    avoidOverlapRow: { width: '100%', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #333' },
    customTagRow: { width: '100%', display: 'flex', flexDirection: 'column' },
    customTagRowSeparator: { marginTop: '16px', paddingTop: '16px' },
    // Dropdown (like TextField) carries its own built-in top margin from
    // Decky's Field wrapper; pull it up so the colour sits under its label.
    customTagColorWrapper: { marginTop: '-8px' },
};

/**
 * MainPanel - the Quick Access panel content.
 * Kept deliberately clean: the tag lists, a Settings button and the About
 * info. The Settings button swaps the whole panel for SettingsPanel (still
 * inside the sidebar); its Back button returns here.
 */
const BACKLOG_COLOR = '#888';
const TAG_LABEL_KEY = {
    completed: 'tag.completed',
    in_progress: 'tag.in_progress',
    backlog: 'tag.backlog',
    mastered: 'tag.mastered',
    dropped: 'tag.dropped',
};
const TAG_DESCRIPTION_KEY = {
    completed: 'tag.completed.desc',
    in_progress: 'tag.in_progress.desc',
    backlog: 'tag.backlog.desc',
    mastered: 'tag.mastered.desc',
    dropped: 'tag.dropped.desc',
};
// Opening any Dropdown in the Quick Access panel makes Steam hide the panel
// while the option menu (a popup in the main window) is up, which unmounts
// the plugin; it remounts once an option is picked. Remember the view
// outside React so that doesn't throw the user out of the settings.
// After a longer close (user left the panel) start on the lists again.
const RESTORE_VIEW_WITHIN_MS = 2 * 60 * 1000;
let lastView = 'lists';
let lastUnmountAt = 0;
const MainPanel = () => {
    // 'returned' = back from settings: put focus on the Settings button again
    const [view, setView] = SP_REACT.useState(() => lastView === 'settings' && Date.now() - lastUnmountAt < RESTORE_VIEW_WITHIN_MS ? 'settings' : 'lists');
    // Restored after a remount: Steam puts focus back itself, don't jump to Back
    const [restored] = SP_REACT.useState(view === 'settings');
    SP_REACT.useEffect(() => {
        lastView = view;
    }, [view]);
    SP_REACT.useEffect(() => () => {
        lastUnmountAt = Date.now();
    }, []);
    return view === 'settings'
        ? SP_REACT.createElement(SettingsPanel, { onBack: () => setView('returned'), focusBack: !restored })
        : SP_REACT.createElement(TagListsPanel, { onOpenSettings: () => setView('settings'), focusSettings: view === 'returned' });
};
const TagListsPanel = ({ onOpenSettings, focusSettings }) => {
    const { t } = useTranslation();
    const { settings } = usePluginSettings({ reloadOnChange: true });
    const [stats, setStats] = SP_REACT.useState(null);
    const [taggedGames, setTaggedGames] = SP_REACT.useState([]);
    const [backlogGames, setBacklogGames] = SP_REACT.useState([]);
    const [expandedSections, setExpandedSections] = SP_REACT.useState({});
    const [loadingBacklog, setLoadingBacklog] = SP_REACT.useState(false);
    const prevStatsRef = SP_REACT.useRef('');
    const prevGamesRef = SP_REACT.useRef('');
    const containerRef = SP_REACT.useRef(null);
    const settingsButtonRef = SP_REACT.useRef(null);
    SP_REACT.useEffect(() => (focusSettings ? focusFirstButton(settingsButtonRef.current) : undefined), []);
    const smartUpdateUI = async () => {
        try {
            const statsResult = await call('get_tag_statistics');
            if (statsResult.success && JSON.stringify(statsResult.stats) !== prevStatsRef.current) {
                prevStatsRef.current = JSON.stringify(statsResult.stats);
                setStats(statsResult.stats);
            }
            const gamesResult = await call('get_all_tags_with_names');
            if (gamesResult.success) {
                const fingerPrint = JSON.stringify(gamesResult.games.map(g => g.appid).sort());
                if (fingerPrint !== prevGamesRef.current) {
                    prevGamesRef.current = fingerPrint;
                    setTaggedGames(gamesResult.games);
                }
            }
        }
        catch (err) { }
    };
    // Read-only here: shows sync progress started from the settings page or
    // the automatic startup sync, and refreshes the lists as tags change.
    const { message } = useLibrarySync(smartUpdateUI);
    SP_REACT.useEffect(() => {
        if (containerRef.current && !focusSettings) {
            containerRef.current.scrollIntoView({ block: 'start' });
        }
        smartUpdateUI();
        const interval = setInterval(smartUpdateUI, 10000);
        return () => clearInterval(interval);
    }, []);
    const toggleSection = async (tagType) => {
        const willExpand = !expandedSections[tagType];
        setExpandedSections(prev => ({ ...prev, [tagType]: willExpand }));
        if (tagType === 'backlog' && willExpand && backlogGames.length === 0) {
            setLoadingBacklog(true);
            try {
                const res = await call('get_backlog_games');
                if (res.success)
                    setBacklogGames(res.games);
            }
            finally {
                setLoadingBacklog(false);
            }
        }
    };
    const groupedGames = taggedGames.reduce((acc, g) => {
        if (!acc[g.tag])
            acc[g.tag] = [];
        acc[g.tag].push(g);
        return acc;
    }, {});
    return (SP_REACT.createElement("div", { ref: containerRef, style: styles$1.container },
        message && SP_REACT.createElement("div", { style: styles$1.message }, message),
        SP_REACT.createElement("div", { style: styles$1.section },
            SP_REACT.createElement("h3", { style: styles$1.sectionTitle },
                t('settings.library'),
                " (",
                stats?.total || 0,
                ")"),
            SP_REACT.createElement(DFL.PanelSection, null, ['in_progress', 'completed', 'mastered', 'dropped', 'backlog'].map(tagType => {
                const isBacklog = tagType === 'backlog';
                const games = isBacklog ? backlogGames : (groupedGames[tagType] || []);
                const count = isBacklog ? (stats?.backlog || 0) : games.length;
                const isExpanded = !!expandedSections[tagType];
                const label = isBacklog ? t(TAG_LABEL_KEY[tagType]) : resolveTagLabel(tagType, settings, t);
                const color = isBacklog ? BACKLOG_COLOR : resolveTagColor(tagType, settings);
                return (SP_REACT.createElement(SP_REACT.Fragment, { key: tagType },
                    SP_REACT.createElement(DFL.PanelSectionRow, null,
                        SP_REACT.createElement(DFL.ButtonItem, { layout: "below", onClick: () => toggleSection(tagType) },
                            SP_REACT.createElement("div", { style: styles$1.tagSectionContent },
                                SP_REACT.createElement("div", { style: styles$1.tagSectionLeft },
                                    SP_REACT.createElement(TagIcon, { type: tagType, size: 18, color: isBacklog ? undefined : color }),
                                    SP_REACT.createElement("span", { style: styles$1.tagSectionTitle }, label)),
                                SP_REACT.createElement("div", { style: styles$1.tagSectionRight },
                                    SP_REACT.createElement("span", { style: { ...styles$1.tagCount, color } }, count),
                                    SP_REACT.createElement("span", { style: styles$1.expandIcon }, isExpanded ? '−' : '+'))))),
                    isExpanded && (SP_REACT.createElement("div", { style: styles$1.tagDescription }, t(TAG_DESCRIPTION_KEY[tagType], tagType === 'mastered' ? { threshold: settings.mastered_threshold } : undefined))),
                    isExpanded && games.length > 0 && games.map(game => (SP_REACT.createElement(DFL.PanelSectionRow, { key: game.appid },
                        SP_REACT.createElement(DFL.ButtonItem, { layout: "below", onClick: () => { DFL.Navigation.Navigate(`/library/app/${game.appid}`); DFL.Navigation.CloseSideMenus(); }, ...{ style: { width: '100%', overflow: 'hidden' } } },
                            SP_REACT.createElement("div", { style: { display: 'table', tableLayout: 'fixed', width: '100%' } },
                                SP_REACT.createElement("div", { style: styles$1.gameItemContent },
                                    SP_REACT.createElement("span", { style: { ...styles$1.smallDot, backgroundColor: game.tag === 'backlog' ? BACKLOG_COLOR : resolveTagColor(game.tag, settings) } }),
                                    SP_REACT.createElement("span", { style: styles$1.gameName }, game.game_name),
                                    game.is_manual && SP_REACT.createElement("span", { style: styles$1.manualBadge }, t('settings.manual')))))))),
                    isExpanded && games.length === 0 && !loadingBacklog && SP_REACT.createElement("div", { style: styles$1.emptySection }, t('settings.noGamesFound'))));
            }))),
        SP_REACT.createElement(DFL.PanelSection, null,
            SP_REACT.createElement(DFL.PanelSectionRow, null,
                SP_REACT.createElement("div", { ref: settingsButtonRef, style: { width: '100%' } },
                    SP_REACT.createElement(DFL.ButtonItem, { layout: "below", onClick: onOpenSettings },
                        SP_REACT.createElement("div", { style: styles$1.settingsButton },
                            SP_REACT.createElement(FaCog, null),
                            SP_REACT.createElement("span", null, t('settings.openSettings'))))))),
        SP_REACT.createElement(DFL.PanelSection, { title: t('settings.about') },
            SP_REACT.createElement("div", { style: styles$1.about },
                SP_REACT.createElement("p", { style: styles$1.aboutLine }, "Deck Progress Tracker"),
                SP_REACT.createElement("p", { style: styles$1.aboutLine }, "1.5.0"),
                SP_REACT.createElement("p", { style: styles$1.aboutLine }, t('settings.aboutDataSource'))),
            SP_REACT.createElement(DFL.PanelSectionRow, null,
                SP_REACT.createElement(DFL.ButtonItem, { layout: "below", onClick: () => DFL.Navigation.NavigateToExternalWeb('https://patreon.com/DeckProgressTracker') }, t('settings.supportPatreon'))))));
};
const styles$1 = {
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

/**
 * Shared per-tag styling (background color) used by GameTagBadge.
 */
// Darkened from the original lighter gradients to meet WCAG 2.1 non-text
// contrast (>=3:1 against the white icon/text drawn on top) - the original
// stops (#38ef7d, #c9a171, #f093fb) were too close to white to read well.
const TAG_STYLES = {
    completed: {
        background: 'linear-gradient(135deg, #0d7a6f 0%, #1fa85c 100%)',
    },
    in_progress: {
        background: 'linear-gradient(135deg, #5568d3 0%, #5f3d85 100%)',
    },
    mastered: {
        background: 'linear-gradient(135deg, #d6579f 0%, #c23a52 100%)',
    },
    dropped: {
        background: 'linear-gradient(135deg, #8a6a47 0%, #a67f55 100%)',
    },
};

/**
 * TagManager Component
 * Modal for managing game tags manually
 */
const EMPTY_TAG_CUSTOMIZATION$1 = {
    tag_label_mastered: '', tag_label_completed: '', tag_label_in_progress: '', tag_label_dropped: '',
    tag_color_mastered: '', tag_color_completed: '', tag_color_in_progress: '', tag_color_dropped: '',
};
const TagManager = ({ appid, onClose }) => {
    const { t } = useTranslation();
    const [details, setDetails] = SP_REACT.useState(null);
    const [loading, setLoading] = SP_REACT.useState(true);
    const [error, setError] = SP_REACT.useState(null);
    const [manualSearchOpen, setManualSearchOpen] = SP_REACT.useState(false);
    const [manualQuery, setManualQuery] = SP_REACT.useState('');
    const [manualResults, setManualResults] = SP_REACT.useState([]);
    const [manualSearching, setManualSearching] = SP_REACT.useState(false);
    const [manualError, setManualError] = SP_REACT.useState(null);
    const [tagCustomization, setTagCustomization] = SP_REACT.useState(EMPTY_TAG_CUSTOMIZATION$1);
    SP_REACT.useEffect(() => {
        fetchDetails();
    }, [appid]);
    SP_REACT.useEffect(() => {
        (async () => {
            try {
                const result = await call('get_settings');
                if (result.settings) {
                    setTagCustomization({
                        tag_label_mastered: result.settings.tag_label_mastered || '',
                        tag_label_completed: result.settings.tag_label_completed || '',
                        tag_label_in_progress: result.settings.tag_label_in_progress || '',
                        tag_label_dropped: result.settings.tag_label_dropped || '',
                        tag_color_mastered: result.settings.tag_color_mastered || '',
                        tag_color_completed: result.settings.tag_color_completed || '',
                        tag_color_in_progress: result.settings.tag_color_in_progress || '',
                        tag_color_dropped: result.settings.tag_color_dropped || '',
                    });
                }
            }
            catch (e) { }
        })();
    }, []);
    const fetchDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await call('get_game_details', { appid });
            setDetails(result);
        }
        catch (err) {
            const errorMsg = err?.message || t('tagManager.failedToLoad');
            setError(errorMsg);
            // Error occurred
        }
        finally {
            setLoading(false);
        }
    };
    const setTag = async (tag) => {
        try {
            await call('set_manual_tag', { appid, tag });
            await fetchDetails();
            notifyTagsChanged();
        }
        catch (err) {
            const errorMsg = err?.message || t('tagManager.failedToSetTag');
            setError(errorMsg);
            // Error occurred
        }
    };
    const resetToAuto = async () => {
        try {
            await call('reset_to_auto_tag', { appid });
            await fetchDetails();
            notifyTagsChanged();
        }
        catch (err) {
            const errorMsg = err?.message || t('tagManager.failedToReset');
            setError(errorMsg);
            // Error occurred
        }
    };
    const removeTag = async () => {
        try {
            await call('remove_tag', { appid });
            await fetchDetails();
            notifyTagsChanged();
        }
        catch (err) {
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
        if (!manualQuery.trim())
            return;
        try {
            setManualSearching(true);
            setManualError(null);
            const result = await call('search_hltb_candidates', { query: manualQuery.trim() });
            if (result.success) {
                setManualResults(result.candidates || []);
                if (!result.candidates || result.candidates.length === 0) {
                    setManualError(t('tagManager.manualSearchNoResults'));
                }
            }
            else {
                setManualError(result.error || t('tagManager.manualSearchNoResults'));
            }
        }
        catch (err) {
            setManualError(err?.message || t('tagManager.manualSearchNoResults'));
        }
        finally {
            setManualSearching(false);
        }
    };
    const selectManualMatch = async (candidate) => {
        try {
            await call('set_manual_hltb_match', { appid, candidate });
            setManualSearchOpen(false);
            setManualResults([]);
            await fetchDetails();
            notifyTagsChanged();
        }
        catch (err) {
            setManualError(err?.message || t('tagManager.manualSearchNoResults'));
        }
    };
    if (loading) {
        return (SP_REACT.createElement("div", { style: styles.modal },
            SP_REACT.createElement("div", { style: styles.content },
                SP_REACT.createElement("div", { style: styles.loading }, t('tagManager.loading')))));
    }
    if (error || !details || !details.success) {
        return (SP_REACT.createElement("div", { style: styles.modal },
            SP_REACT.createElement("div", { style: styles.content },
                SP_REACT.createElement("div", { style: styles.error }, error || t('tagManager.failedToLoad')),
                SP_REACT.createElement(DFL.Focusable, null,
                    SP_REACT.createElement(DFL.DialogButton, { onClick: onClose }, t('tagManager.close'))))));
    }
    const stats = details.stats;
    const tag = details.tag;
    const hltb = details.hltb_data;
    return (SP_REACT.createElement("div", { style: styles.modal, onClick: onClose },
        SP_REACT.createElement("div", { style: styles.content, onClick: (e) => e.stopPropagation() },
            SP_REACT.createElement("div", { style: styles.header },
                SP_REACT.createElement("h2", { style: styles.title }, stats?.game_name || t('tagManager.gameFallback', { appid })),
                tag?.tag && (SP_REACT.createElement("div", { style: styles.currentTagBadge },
                    SP_REACT.createElement(TagIcon, { type: tag.tag, size: 20, color: resolveTagColor(tag.tag, tagCustomization) }),
                    SP_REACT.createElement("span", { style: { color: resolveTagColor(tag.tag, tagCustomization) } }, resolveTagLabel(tag.tag, tagCustomization, t).toUpperCase()),
                    SP_REACT.createElement("span", { style: styles.tagType }, tag.is_manual ? t('tagManager.manualTag') : t('tagManager.autoTag'))))),
            SP_REACT.createElement("div", { style: styles.mainContent },
                SP_REACT.createElement("div", { style: styles.leftColumn },
                    SP_REACT.createElement("h3", { style: styles.sectionTitle }, t('tagManager.statistics')),
                    stats && (SP_REACT.createElement(SP_REACT.Fragment, null,
                        SP_REACT.createElement("div", { style: styles.statRow },
                            SP_REACT.createElement("span", null, t('tagManager.playtime')),
                            SP_REACT.createElement("span", null,
                                Math.floor(stats.playtime_minutes / 60),
                                "h ",
                                stats.playtime_minutes % 60,
                                "m")),
                        SP_REACT.createElement("div", { style: styles.statRow },
                            SP_REACT.createElement("span", null, t('tagManager.achievements')),
                            SP_REACT.createElement("span", null,
                                stats.unlocked_achievements,
                                "/",
                                stats.total_achievements)))),
                    hltb && (SP_REACT.createElement(SP_REACT.Fragment, null,
                        SP_REACT.createElement("div", { style: styles.statRowStacked },
                            SP_REACT.createElement("span", null, t('tagManager.hltbMatch')),
                            SP_REACT.createElement("span", { style: styles.hltbMatch },
                                hltb.matched_name,
                                " (",
                                Math.round((hltb.similarity || 0) * 100),
                                "%)")),
                        hltb.main_story && (SP_REACT.createElement("div", { style: styles.statRow },
                            SP_REACT.createElement("span", null, t('tagManager.mainStory')),
                            SP_REACT.createElement("span", null,
                                hltb.main_story,
                                "h"))))),
                    !hltb && (SP_REACT.createElement("div", { style: styles.statRow },
                        SP_REACT.createElement("span", null, t('tagManager.hltb')),
                        SP_REACT.createElement("span", { style: styles.noData }, t('tagManager.noData')))),
                    SP_REACT.createElement(DFL.Focusable, { onClick: toggleManualSearch, onActivate: toggleManualSearch, style: styles.manualSearchToggle }, manualSearchOpen ? t('tagManager.manualSearchClose') : t('tagManager.manualSearchOpen')),
                    manualSearchOpen && (SP_REACT.createElement("div", { style: styles.manualSearchPanel },
                        SP_REACT.createElement(DFL.TextField, { value: manualQuery, onChange: (e) => setManualQuery(e.target.value) }),
                        SP_REACT.createElement(DFL.Focusable, { onClick: runManualSearch, onActivate: runManualSearch, style: styles.secondaryButton }, manualSearching ? t('tagManager.manualSearching') : t('tagManager.manualSearchButton')),
                        manualError && SP_REACT.createElement("div", { style: styles.manualSearchError }, manualError),
                        manualResults.length > 0 && (SP_REACT.createElement(DFL.Focusable, { style: styles.manualResultsList, "flow-children": "down" }, manualResults.map((candidate, idx) => (SP_REACT.createElement(DFL.Focusable, { key: idx, onClick: () => selectManualMatch(candidate), onActivate: () => selectManualMatch(candidate), style: styles.manualResultItem },
                            SP_REACT.createElement("div", { style: styles.manualResultName }, candidate.matched_name),
                            SP_REACT.createElement("div", { style: styles.manualResultMeta },
                                candidate.release_year ? `${candidate.release_year} · ` : '',
                                Math.round((candidate.similarity || 0) * 100),
                                "%",
                                candidate.main_story ? ` · ${candidate.main_story}h` : ''),
                            candidate.platforms && candidate.platforms.length > 0 && (SP_REACT.createElement("div", { style: styles.manualResultPlatforms }, candidate.platforms.join(', '))))))))))),
                SP_REACT.createElement("div", { style: styles.rightColumn },
                    SP_REACT.createElement("h3", { style: styles.sectionTitle }, t('tagManager.setTag')),
                    SP_REACT.createElement(DFL.Focusable, { style: styles.tagButtonGroup, "flow-children": "down" },
                        SP_REACT.createElement(DFL.Focusable, { onActivate: () => setTag('mastered'), style: { ...styles.tagButton, background: tagCustomization.tag_color_mastered || TAG_STYLES.mastered.background } },
                            SP_REACT.createElement(TagIcon, { type: "mastered", size: 18, color: "white" }),
                            SP_REACT.createElement("span", null, resolveTagLabel('mastered', tagCustomization, t))),
                        SP_REACT.createElement(DFL.Focusable, { onActivate: () => setTag('completed'), style: { ...styles.tagButton, background: tagCustomization.tag_color_completed || TAG_STYLES.completed.background } },
                            SP_REACT.createElement(TagIcon, { type: "completed", size: 18, color: "white" }),
                            SP_REACT.createElement("span", null, resolveTagLabel('completed', tagCustomization, t))),
                        SP_REACT.createElement(DFL.Focusable, { onActivate: () => setTag('in_progress'), style: { ...styles.tagButton, background: tagCustomization.tag_color_in_progress || TAG_STYLES.in_progress.background } },
                            SP_REACT.createElement(TagIcon, { type: "in_progress", size: 18, color: "white" }),
                            SP_REACT.createElement("span", null, resolveTagLabel('in_progress', tagCustomization, t))),
                        SP_REACT.createElement(DFL.Focusable, { onActivate: () => setTag('dropped'), style: { ...styles.tagButton, background: tagCustomization.tag_color_dropped || TAG_STYLES.dropped.background } },
                            SP_REACT.createElement(TagIcon, { type: "dropped", size: 18, color: "white" }),
                            SP_REACT.createElement("span", null, resolveTagLabel('dropped', tagCustomization, t)))),
                    SP_REACT.createElement(DFL.Focusable, { style: styles.buttonGroup, "flow-children": "horizontal" },
                        SP_REACT.createElement(DFL.Focusable, { onClick: resetToAuto, onActivate: resetToAuto, style: styles.secondaryButton }, t('tagManager.resetToAuto')),
                        SP_REACT.createElement(DFL.Focusable, { onClick: removeTag, onActivate: removeTag, style: styles.secondaryButton }, t('tagManager.remove'))))),
            SP_REACT.createElement(DFL.Focusable, { onClick: onClose, onActivate: onClose, style: styles.closeButton }, t('tagManager.close')))));
};
const styles = {
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

/**
 * React hook for managing game tags
 */
function useGameTag(appid) {
    const [tag, setTag] = SP_REACT.useState(null);
    const [loading, setLoading] = SP_REACT.useState(true);
    const [error, setError] = SP_REACT.useState(null);
    SP_REACT.useEffect(() => {
        fetchTag();
    }, [appid]);
    const fetchTag = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await call('get_game_tag', { appid });
            setTag(result.tag);
        }
        catch (err) {
            const errorMsg = err?.message || 'Failed to fetch tag';
            setError(errorMsg);
            // Error occurred
        }
        finally {
            setLoading(false);
        }
    };
    const setManualTag = async (newTag) => {
        try {
            setError(null);
            const result = await call('set_manual_tag', { appid, tag: newTag });
            if (result.success) {
                await fetchTag();
            }
            else {
                setError(result.error || 'Failed to set tag');
            }
        }
        catch (err) {
            setError(err?.message || 'Failed to set tag');
            // Error occurred
        }
    };
    const removeTag = async () => {
        try {
            setError(null);
            const result = await call('remove_tag', { appid });
            if (result.success) {
                await fetchTag();
            }
            else {
                setError(result.error || 'Failed to remove tag');
            }
        }
        catch (err) {
            setError(err?.message || 'Failed to remove tag');
            // Error occurred
        }
    };
    const resetToAuto = async () => {
        try {
            setError(null);
            const result = await call('reset_to_auto_tag', { appid });
            if (result.success) {
                await fetchTag();
            }
            else {
                setError(result.error || 'Failed to reset tag');
            }
        }
        catch (err) {
            setError(err?.message || 'Failed to reset tag');
            // Error occurred
        }
    };
    return {
        tag,
        loading,
        error,
        refetch: fetchTag,
        setManualTag,
        removeTag,
        resetToAuto
    };
}

/**
 * GameTagBadge Component
 * Wrapper component for displaying game tag on library app page
 * Designed to be injected via safe route patching
 * Uses same positioning pattern as ProtonDB Badges
 */
const DEFAULT_BADGE_POSITION = {
    badge_position_h: 'right',
    badge_position_v: 'top',
    badge_overlap_offset: 0,
};
// Approx rendered height of the badge/"Add Tag" button, used to keep
// bottom/center vertical placements fully inside the visible banner area.
const APPROX_BADGE_HEIGHT = 44;
function buildContainerStyle(h, v, bannerHeight, overlapOffset) {
    const style = { position: 'absolute', zIndex: 10 };
    if (h === 'center') {
        style.left = '50%';
        style.transform = 'translateX(-50%)';
    }
    else {
        style[h] = '20px';
    }
    // The badge's positioning context is the whole (tall, scrollable) page
    // container, not just the banner — so 'bottom'/'center' can't use CSS
    // bottom/top:50% directly (that would anchor to the full page height).
    // Instead, anchor everything from 'top' using the banner's measured
    // pixel height so the badge stays inside the visible banner area.
    if (v === 'top' || bannerHeight == null) {
        // bannerHeight not measured yet: fall back to the plain top offset
        // (no overlap nudge) only when v isn't actually 'top'.
        style.top = v === 'top' ? `${50 + overlapOffset}px` : '50px';
    }
    else if (v === 'center') {
        style.top = `${Math.max(bannerHeight / 2 - APPROX_BADGE_HEIGHT / 2 + overlapOffset, 0)}px`;
    }
    else {
        style.top = `${Math.max(bannerHeight - APPROX_BADGE_HEIGHT - 20 - overlapOffset, 0)}px`;
    }
    return style;
}
/**
 * Find the Header (banner) element by walking up the DOM tree from our
 * wrapper's sibling position inside InnerContainer.
 */
function findHeaderElement(ref) {
    const siblings = ref?.parentElement?.children;
    if (!siblings) {
        return null;
    }
    for (const child of siblings) {
        if (child.className.includes(DFL.appDetailsClasses.Header)) {
            return child;
        }
    }
    return null;
}
/**
 * Find the TopCapsule element within the Header.
 * Same pattern used by ProtonDB Badges.
 */
function findTopCapsuleParent(ref) {
    const headerContainer = findHeaderElement(ref);
    if (!headerContainer) {
        return null;
    }
    for (const child of headerContainer.children) {
        if (child.className.includes(DFL.appDetailsHeaderClasses.TopCapsule)) {
            return child;
        }
    }
    return null;
}
// Visual style shared by the Button itself (not an inner div) so the
// gamepad focus ring matches the badge's actual rounded shape.
const BADGE_BORDER_RADIUS = '20px';
const NO_TAG_STYLE = {
    background: 'rgba(50, 50, 50, 0.9)',
    color: '#aaa',
    border: '1px dashed #666',
};
const EMPTY_TAG_CUSTOMIZATION = {
    tag_label_mastered: '', tag_label_completed: '', tag_label_in_progress: '', tag_label_dropped: '',
    tag_color_mastered: '', tag_color_completed: '', tag_color_in_progress: '', tag_color_dropped: '',
};
/**
 * GameTagBadge - Main component injected into library app page
 * Shows tag badge or "Add Tag" button, with TagManager modal
 * Position is configurable via plugin settings (defaults to top-right,
 * opposite side from ProtonDB's default top-left)
 */
const GameTagBadge = ({ appid }) => {
    const { t } = useTranslation();
    const { tag, loading, error, refetch } = useGameTag(appid);
    const [showManager, setShowManager] = SP_REACT.useState(false);
    const [show, setShow] = SP_REACT.useState(true);
    const [position, setPosition] = SP_REACT.useState(DEFAULT_BADGE_POSITION);
    const [tagCustomization, setTagCustomization] = SP_REACT.useState(EMPTY_TAG_CUSTOMIZATION);
    const [bannerHeight, setBannerHeight] = SP_REACT.useState(null);
    // Apps the plugin hides (Steam tools, demos, Discord, browsers, ...) get no
    // badge and no "Add Tag" button, unless they were tagged manually.
    const [hidden, setHidden] = SP_REACT.useState(() => !!getLibraryBadgeState().hidden[appid]);
    const ref = SP_REACT.useRef(null);
    SP_REACT.useEffect(() => {
        const update = () => setHidden(!!getLibraryBadgeState().hidden[appid]);
        update();
        return subscribeLibraryBadges(update);
    }, [appid]);
    SP_REACT.useLayoutEffect(() => {
        const headerElement = findHeaderElement(ref.current);
        if (headerElement) {
            setBannerHeight(headerElement.getBoundingClientRect().height);
        }
    }, [loading]);
    SP_REACT.useEffect(() => {
        const fetchPosition = async () => {
            try {
                const result = await call('get_settings');
                if (result.settings) {
                    setPosition({
                        badge_position_h: result.settings.badge_position_h || DEFAULT_BADGE_POSITION.badge_position_h,
                        badge_position_v: result.settings.badge_position_v || DEFAULT_BADGE_POSITION.badge_position_v,
                        badge_overlap_offset: result.settings.badge_overlap_offset ?? DEFAULT_BADGE_POSITION.badge_overlap_offset,
                    });
                    setTagCustomization({
                        tag_label_mastered: result.settings.tag_label_mastered || '',
                        tag_label_completed: result.settings.tag_label_completed || '',
                        tag_label_in_progress: result.settings.tag_label_in_progress || '',
                        tag_label_dropped: result.settings.tag_label_dropped || '',
                        tag_color_mastered: result.settings.tag_color_mastered || '',
                        tag_color_completed: result.settings.tag_color_completed || '',
                        tag_color_in_progress: result.settings.tag_color_in_progress || '',
                        tag_color_dropped: result.settings.tag_color_dropped || '',
                    });
                }
            }
            catch (e) {
                // Keep default position on failure
            }
        };
        fetchPosition();
        window.addEventListener(BADGE_SETTINGS_UPDATED_EVENT, fetchPosition);
        return () => window.removeEventListener(BADGE_SETTINGS_UPDATED_EVENT, fetchPosition);
    }, []);
    SP_REACT.useEffect(() => {
        // Sync this game's data when detail page is viewed
        // This ensures we have the latest playtime and achievement data
        (async () => {
            try {
                const result = await syncSingleGameWithFrontendData(appid);
                if (result.success) {
                    refetch();
                    // The sync may have just (un)hidden this app; refresh the shared map
                    notifyTagsChanged();
                }
            }
            catch (e) {
                // Error syncing game
            }
        })();
    }, [appid]);
    // Watch for fullscreen mode changes (same pattern as ProtonDB)
    SP_REACT.useEffect(() => {
        const topCapsule = findTopCapsuleParent(ref?.current);
        if (!topCapsule) {
            return;
        }
        const mutationObserver = new MutationObserver((entries) => {
            for (const entry of entries) {
                if (entry.type !== 'attributes' || entry.attributeName !== 'class') {
                    continue;
                }
                const className = entry.target.className;
                const fullscreenMode = className.includes(DFL.appDetailsHeaderClasses.FullscreenEnterStart) ||
                    className.includes(DFL.appDetailsHeaderClasses.FullscreenEnterActive) ||
                    className.includes(DFL.appDetailsHeaderClasses.FullscreenEnterDone) ||
                    className.includes(DFL.appDetailsHeaderClasses.FullscreenExitStart) ||
                    className.includes(DFL.appDetailsHeaderClasses.FullscreenExitActive);
                const fullscreenAborted = className.includes(DFL.appDetailsHeaderClasses.FullscreenExitDone);
                setShow(!fullscreenMode || fullscreenAborted);
            }
        });
        mutationObserver.observe(topCapsule, { attributes: true, attributeFilter: ['class'] });
        return () => {
            mutationObserver.disconnect();
        };
    }, []);
    if (loading || (hidden && !tag?.is_manual)) {
        return SP_REACT.createElement("div", { ref: ref, style: { display: 'none' } });
    }
    const handleClick = () => {
        setShowManager(true);
    };
    const handleClose = () => {
        setShowManager(false);
        refetch();
    };
    const containerStyle = buildContainerStyle(position.badge_position_h, position.badge_position_v, bannerHeight, position.badge_overlap_offset);
    const tagType = tag && tag.tag ? tag.tag : null;
    const tagStyle = tagType ? TAG_STYLES[tagType] : null;
    const customColor = tagType ? resolveTagColor(tagType, tagCustomization) : null;
    const hasCustomColor = tagType ? !!tagCustomization[TAG_COLOR_SETTING_KEY[tagType]] : false;
    const tooltip = tagStyle
        ? tag?.is_manual ? t('badge.manualTagEdit') : t('badge.autoTagEdit')
        : t('badge.clickToAddTag');
    return (SP_REACT.createElement(SP_REACT.Fragment, null,
        SP_REACT.createElement("div", { ref: ref, style: containerStyle }, show && (SP_REACT.createElement(DFL.Button, { onClick: handleClick, ...{ title: tooltip }, style: {
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: BADGE_BORDER_RADIUS,
                fontSize: '14px',
                fontWeight: 'bold',
                color: tagStyle ? 'white' : NO_TAG_STYLE.color,
                background: tagStyle ? (hasCustomColor ? customColor : tagStyle.background) : NO_TAG_STYLE.background,
                border: tagStyle ? 'none' : NO_TAG_STYLE.border,
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                minWidth: 'auto',
            } }, tagStyle && tagType ? (SP_REACT.createElement(SP_REACT.Fragment, null,
            SP_REACT.createElement(TagIcon, { type: tagType, size: 18, color: "white" }),
            SP_REACT.createElement("span", null, resolveTagLabel(tagType, tagCustomization, t)),
            tag?.is_manual && SP_REACT.createElement("span", { style: { fontSize: '12px', opacity: 0.8 } }, "\u270E"))) : (SP_REACT.createElement(SP_REACT.Fragment, null,
            SP_REACT.createElement("span", { style: { fontSize: '16px' } }, "+"),
            SP_REACT.createElement("span", null, t('badge.addTag'))))))),
        show && showManager && (SP_REACT.createElement(TagManager, { appid: appid, onClose: handleClose }))));
};

/**
 * Library App Route Patching
 * Based on ProtonDB Badges plugin implementation
 * Uses proper Decky UI patching utilities for safety
 */
/**
 * Extract appid from the current route/URL
 */
function getAppIdFromUrl() {
    try {
        // Try to get appid from window location
        const match = window.location.pathname.match(/\/library\/app\/(\d+)/);
        if (match) {
            return match[1];
        }
        // Fallback: try to find it in the URL hash or other places
        const hashMatch = window.location.hash.match(/\/library\/app\/(\d+)/);
        if (hashMatch) {
            return hashMatch[1];
        }
        return null;
    }
    catch (e) {
        // Error occurred
        return null;
    }
}
/**
 * Patch the library app page to inject our tag badge
 * Following the ProtonDB Badges pattern for safety
 */
function patchLibraryApp() {
    return routerHook.addPatch('/library/app/:appid', (tree) => {
        try {
            // Find the route props with renderFunc (same pattern as ProtonDB)
            const routeProps = DFL.findInReactTree(tree, (x) => x?.renderFunc);
            if (routeProps) {
                const patchHandler = DFL.createReactTreePatcher([
                    (tree) => DFL.findInReactTree(tree, (x) => x?.props?.children?.props?.overview)?.props?.children
                ], (_, ret) => {
                    // Find the inner container where we'll inject our badge
                    const container = DFL.findInReactTree(ret, (x) => Array.isArray(x?.props?.children) &&
                        x?.props?.className?.includes(DFL.appDetailsClasses.InnerContainer));
                    if (typeof container !== 'object') {
                        return ret;
                    }
                    // Get appid from URL since we're inside the render
                    const appid = getAppIdFromUrl();
                    if (appid) {
                        // Inject our badge component at position 0 (first child, will use absolute positioning)
                        container.props.children.splice(0, 0, SP_REACT.createElement(GameTagBadge, { key: "game-progress-tag", appid: appid }));
                    }
                    return ret;
                });
                DFL.afterPatch(routeProps, "renderFunc", patchHandler);
            }
        }
        catch (error) {
            // Error occurred
        }
        return tree;
    });
}

/**
 * LibraryTileBadge
 * Small icon-only tag badge drawn on top of a game capsule wherever Steam
 * lists games (library grid/tabs, collections, Home shelves).
 *
 * Injected by src/lib/patchLibraryCapsules.tsx. Reads everything from the
 * shared cache in libraryBadgeStore - never calls the backend per tile.
 */
const LIBRARY_BADGE_CLASS = 'dpt-library-badge';
const STYLE_ELEMENT_ID = 'dpt-library-badge-style';
// Mirrors ProtonDB Badges' library dot (24px incl. padding, 4px inset) so
// the two plugins look consistent next to each other.
const BADGE_SIZE = 24;
const BADGE_INSET = 6;
const ICON_SIZE = 14;
// ProtonDB Badges' grid dot occupies 4px..28px from its corner. When it sits
// in the same corner as ours, step ours inward horizontally past it.
const PROTONDB_DOT = '.protondb-grid-dot';
const NUDGED_INSET = 32;
// Backlog isn't customizable; a neutral grey matching the panel's Backlog row.
const BACKLOG_BACKGROUND = 'linear-gradient(135deg, #6e6e6e 0%, #4a4a4a 100%)';
const CORNERS = {
    'top-left': { v: 'top', h: 'left' },
    'top-right': { v: 'top', h: 'right' },
    'bottom-left': { v: 'bottom', h: 'left' },
    'bottom-right': { v: 'bottom', h: 'right' },
};
function buildStylesheet() {
    const rules = [
        `.${LIBRARY_BADGE_CLASS}{position:absolute;z-index:5;width:${BADGE_SIZE}px;height:${BADGE_SIZE}px;` +
            'box-sizing:border-box;border-radius:50%;display:flex;align-items:center;justify-content:center;' +
            'pointer-events:none;box-shadow:0 1px 4px rgba(0,0,0,0.6);border:1px solid rgba(255,255,255,0.35);}',
    ];
    Object.keys(CORNERS).forEach((pos) => {
        const { v, h } = CORNERS[pos];
        const sel = `.${LIBRARY_BADGE_CLASS}[data-pos="${pos}"]`;
        rules.push(`${sel}{${v}:${BADGE_INSET}px;${h}:${BADGE_INSET}px;}`);
        // ProtonDB sets its dot position via inline style, e.g. "top: 4px; right: 4px;".
        // Its dot can end up before or after ours in the DOM, so match both orders.
        const dot = `${PROTONDB_DOT}[style*="${v}: 4px"][style*="${h}: 4px"]`;
        rules.push(`${sel}:has(~ ${dot}), ${dot} ~ ${sel}{${h}:${NUDGED_INSET}px;}`);
    });
    return rules.join('\n');
}
const styledDocuments = new Set();
/**
 * The capsules live in Steam's Big Picture window document, not in the
 * plugin's own JS context, so the stylesheet is injected into whichever
 * document a badge actually renders in (once per document).
 */
function ensureStylesheet(doc) {
    if (!doc || styledDocuments.has(doc))
        return;
    try {
        if (!doc.getElementById(STYLE_ELEMENT_ID)) {
            const style = doc.createElement('style');
            style.id = STYLE_ELEMENT_ID;
            style.textContent = buildStylesheet();
            (doc.head || doc.documentElement).appendChild(style);
        }
        styledDocuments.add(doc);
    }
    catch (e) {
        // Never break Steam's UI over a stylesheet
    }
}
function removeLibraryBadgeStylesheets() {
    styledDocuments.forEach((doc) => {
        try {
            doc.getElementById(STYLE_ELEMENT_ID)?.remove();
        }
        catch (e) {
            // Window may already be gone
        }
    });
    styledDocuments.clear();
}
function derive(appid) {
    const { position, showBacklog, tags, hidden, tagsLoaded, colors } = getLibraryBadgeState();
    // No tag = Backlog, for Steam games, non-Steam games and games not synced
    // yet. Apps the plugin hides (Steam tools, demos, Discord, browsers, ...)
    // get no badge at all.
    // The Backlog badge can be turned off in the settings.
    const tag = !tagsLoaded || hidden[appid] ? null : tags[appid] || (showBacklog ? 'backlog' : null);
    let background = '';
    if (tag === 'backlog') {
        background = BACKLOG_BACKGROUND;
    }
    else if (tag) {
        const custom = colors[TAG_COLOR_SETTING_KEY[tag]];
        // Same colour logic as the game page badge: custom colour if the user
        // picked one, otherwise the default tag gradient.
        background = custom && custom.trim() ? custom.trim() : (TAG_STYLES[tag]?.background || '#555');
    }
    return { position, tag, background };
}
function sameDerived(a, b) {
    return a.position === b.position && a.tag === b.tag && a.background === b.background;
}
const LibraryTileBadge = ({ appid }) => {
    const [badge, setBadge] = SP_REACT.useState(() => derive(appid));
    const ref = SP_REACT.useRef(null);
    SP_REACT.useEffect(() => {
        const update = () => setBadge((prev) => {
            const next = derive(appid);
            return sameDerived(prev, next) ? prev : next;
        });
        update();
        const unsubscribe = subscribeLibraryBadges(update);
        refreshTagsIfStale();
        return unsubscribe;
    }, [appid]);
    const visible = badge.position !== 'none' && !!badge.tag;
    SP_REACT.useLayoutEffect(() => {
        if (visible)
            ensureStylesheet(ref.current?.ownerDocument);
    }, [visible]);
    if (!visible) {
        return null;
    }
    return (SP_REACT.createElement("div", { ref: ref, className: LIBRARY_BADGE_CLASS, "data-pos": badge.position, "data-tag": badge.tag, style: { background: badge.background } },
        SP_REACT.createElement(TagIcon, { type: badge.tag, size: ICON_SIZE, color: "white" })));
};

/**
 * Library capsule patching - adds a small tag badge to every game tile.
 *
 * ProtonDB Badges (v1.3.x, src/patches/LibraryGridPatch.ts) does this by
 * polling the Big Picture DOM every 1-3s for the grid's hashed
 * `Draggable` class, reading the appid from the capsule <img> src and
 * appending a plain DOM node. That only covers the library grid and costs
 * a full DOM scan per second.
 *
 * We hook the same tiles one level up, at the React component Steam uses
 * for *every* game capsule item (library tabs/grids, collections, Home
 * shelves incl. the large "current game" tile). It's found through
 * webpack by a stable prototype method of the portrait capsule image
 * class it renders (`OnVerticalCapsuleLoad`), and patched with
 * `afterPatch` + `findInReactTree` like our game page patch. The tile's
 * `app` overview prop gives us the appid directly (Steam + non-Steam).
 * Badges are React children of the tile, so they mount/unmount with
 * Steam's virtualized lists - no polling, no DOM scans.
 */
const BADGE_KEY = 'dpt-library-badge';
const REACT_MEMO = Symbol.for('react.memo');
/** Steam's capsule image classes (portrait `OnVerticalCapsuleLoad`, landscape `OnLandscapeImageLoaded`) both expose `GetAssetImage`. */
function isCapsuleImageElement(el) {
    const proto = el?.type?.prototype;
    return !!proto && typeof proto.GetAssetImage === 'function' && typeof proto.render === 'function';
}
function findCapsuleItemComponent() {
    try {
        const [module] = DFL.findModuleDetailsByExport((e) => typeof e === 'function' && !!e?.prototype?.OnVerticalCapsuleLoad);
        if (!module)
            return null;
        // The capsule item itself is the (only) React.memo export of that
        // module; it renders either the portrait or the landscape image class.
        const memos = Object.values(module).filter((e) => e && e.$$typeof === REACT_MEMO && typeof e.type === 'function');
        return memos.length === 1 ? memos[0] : null;
    }
    catch (e) {
        return null;
    }
}
/**
 * Returns a cleanup function, or null if the capsule component couldn't be
 * found (e.g. after a Steam UI update) - in which case nothing is patched.
 */
function patchLibraryCapsules() {
    const capsuleItem = findCapsuleItemComponent();
    if (!capsuleItem) {
        return null;
    }
    const patch = DFL.afterPatch(capsuleItem, 'type', (args, ret) => {
        try {
            // Injected even when the position is 'none': the badge then renders
            // nothing, but switching the setting back on applies live to tiles
            // that are already on screen instead of only after a remount.
            const appid = args?.[0]?.app?.appid;
            if (appid === undefined || appid === null)
                return ret;
            // The array holding the capsule image element; its DOM parent is the
            // tile box (position: relative), so our absolutely positioned badge
            // lands on the artwork and follows Steam's focus scale animation.
            const container = DFL.findInReactTree(ret, (x) => Array.isArray(x?.props?.children) && x.props.children.some(isCapsuleImageElement));
            if (!container || container.props.children.some((c) => c?.key === BADGE_KEY)) {
                return ret;
            }
            container.props.children.push(SP_REACT.createElement(LibraryTileBadge, { key: BADGE_KEY, appid: String(appid) }));
        }
        catch (e) {
            // Never break Steam's library rendering
        }
        return ret;
    });
    return () => {
        try {
            patch.unpatch();
        }
        catch (e) {
            // ignore
        }
        removeLibraryBadgeStylesheets();
    };
}

/**
 * Automatic library sync after the plugin loads (Steam start / reboot /
 * Decky restart). Waits for the network, Steam's app data and the plugin
 * backend first, then retries quietly (see runStartupSync in syncPolicy.ts),
 * so a Deck that boots before Wi-Fi is up no longer gets a false
 * "sync failed" toast.
 */
const loadedAt = Date.now();
const POLL_MS = 2000;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function isOnline() {
    const offlineForMs = debugOverrides().offlineForMs;
    if (offlineForMs && Date.now() - loadedAt < offlineForMs)
        return false;
    return navigator.onLine !== false;
}
function steamAppsReady() {
    try {
        // The store getters throw while Steam is still loading them.
        const allApps = window.collectionStore?.allAppsCollection?.allApps;
        return Array.isArray(allApps) && allApps.length > 0;
    }
    catch (e) {
        return false;
    }
}
async function backendResponds() {
    try {
        const res = await Promise.race([
            call('get_settings'),
            sleep(5000).then(() => null),
        ]);
        return !!res?.success;
    }
    catch (e) {
        return false;
    }
}
/** Polls until online + Steam app data + backend are all ready, or `capMs` passes. */
async function waitUntilReady(capMs) {
    const started = Date.now();
    for (;;) {
        const online = isOnline();
        const apps = steamAppsReady();
        const backend = online && apps && await backendResponds();
        if (online && apps && backend) {
            const waited = Date.now() - started;
            if (waited > POLL_MS)
                logFrontend('info', `Startup sync: ready after ${Math.round(waited / 1000)}s`);
            return true;
        }
        if (Date.now() - started >= capMs) {
            logFrontend('warn', `Startup sync: not ready after ${Math.round(capMs / 1000)}s (online=${online} apps=${apps} backend=${backend}), trying anyway`);
            return false;
        }
        await sleep(POLL_MS);
    }
}
function startStartupSync(isDisposed) {
    // Load the user's language preference now, so the toast text at the end
    // isn't stuck on the system language when the panel was never opened.
    const unsubscribeLanguage = subscribeToLanguage(() => { });
    return runStartupSync({
        waitUntilReady,
        sync: async (attempt) => {
            const fail = debugOverrides().failSyncAttempts ?? 0;
            if (attempt <= fail)
                return { success: false, error: `Simulated failure (debug, attempt ${attempt}/${fail})` };
            return syncLibraryProgressive();
        },
        notify,
        sleep,
        isDisposed,
        log: (message) => logFrontend('info', message),
        successMessage: (result) => translate('settings.syncCompleteDetailed', {
            synced: result.synced ?? 0,
            newTags: result.new_tags ? translate('settings.syncCompleteNewTags', { count: result.new_tags }) : '',
        }),
        failureMessage: (error) => translate('notify.startupSyncFailed', { error }),
    })
        .catch((e) => logFrontend('error', `Startup sync crashed: ${e?.message || e}`))
        .finally(unsubscribeLanguage);
}

/**
 * Achievement Cache Watcher
 * Monitors URL changes and syncs achievements when user views "Your Stuff" tab
 */
let lastUrl = '';
let syncTimeout = null;
/**
 * Start watching for URL changes to detect when user views achievements
 */
function startAchievementCacheWatcher() {
    // Poll for URL changes every 500ms
    setInterval(() => {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            // Check if user opened "Your Stuff" tab (where achievements are shown)
            const yourStuffMatch = currentUrl.match(/\/library\/app\/(\d+)\/tab\/YourStuff/);
            if (yourStuffMatch) {
                const appid = yourStuffMatch[1];
                // Clear any pending sync
                if (syncTimeout) {
                    clearTimeout(syncTimeout);
                }
                // Wait for Steam to populate the achievement cache
                // Poll the cache with exponential backoff up to 10 seconds
                syncTimeout = setTimeout(async () => {
                    const achievementCache = window.appAchievementProgressCache;
                    const mapCache = achievementCache?.m_achievementProgress?.mapCache;
                    if (!mapCache) {
                        return;
                    }
                    // Poll with exponential backoff: 500ms, 1s, 2s, 3s, 3s (total ~10s max)
                    const delays = [500, 1000, 2000, 3000, 3000];
                    let foundData = false;
                    for (let i = 0; i < delays.length; i++) {
                        await new Promise(resolve => setTimeout(resolve, delays[i]));
                        const entry = mapCache.get(parseInt(appid));
                        if (entry && entry.total > 0) {
                            foundData = true;
                            break;
                        }
                    }
                    if (foundData) {
                        try {
                            await syncSingleGameWithFrontendData(appid);
                        }
                        catch (e) {
                            // Error occurred
                        }
                    }
                }, 100); // Start polling after 100ms initial delay
            }
        }
    }, 500);
}
/**
 * Stop watching for URL changes
 */
function stopAchievementCacheWatcher() {
    if (syncTimeout) {
        clearTimeout(syncTimeout);
        syncTimeout = null;
    }
}

/**
 * Deck Progress Tracker - Main Plugin Entry
 * Decky Loader plugin for automatic game tagging
 *
 * Uses safe route patching pattern based on ProtonDB Badges plugin
 */
/**
 * Main Plugin Definition
 */
var index = definePlugin(() => {
    // Patch the game library page using the safe ProtonDB-style approach.
    // On Decky Loader older than ~v3.3.1 this patch crashed Decky's entire UI
    // ("An error occurred while rendering this content"), so we check the
    // backend-reported Decky version first and skip patching on old versions
    // instead of showing that crash screen to the user.
    let libraryPatch = null;
    let unpatchLibraryCapsules = null;
    let stopLibraryBadgeStore = null;
    let disposed = false;
    (async () => {
        let compatible = true;
        let minVersion = '';
        let deckyVersion = '';
        try {
            const versionInfo = await call('get_decky_version_info');
            if (versionInfo && versionInfo.success) {
                compatible = versionInfo.compatible;
                minVersion = versionInfo.min_version;
                deckyVersion = versionInfo.decky_version;
            }
        }
        catch (error) {
            // If the version check itself fails, fall back to patching rather
            // than silently disabling the library integration for everyone.
        }
        if (!compatible) {
            toaster.toast({
                title: 'Deck Progress Tracker',
                body: `Requires Decky Loader v${minVersion} or newer (detected ${deckyVersion || 'unknown'}). Library page tags are disabled.`,
                duration: 8000,
            });
            return;
        }
        if (disposed)
            return;
        try {
            libraryPatch = patchLibraryApp();
        }
        catch (error) {
            // Failed to register library app patch
        }
        // Tag badges on every game capsule (library grid, collections, Home)
        try {
            stopLibraryBadgeStore = initLibraryBadgeStore();
            unpatchLibraryCapsules = patchLibraryCapsules();
            if (!unpatchLibraryCapsules) {
                call('log_frontend', 'warn', 'Library capsule component not found - library tile badges disabled').catch(() => { });
            }
        }
        catch (error) {
            call('log_frontend', 'error', `Library capsule patch failed: ${error}`).catch(() => { });
        }
    })();
    // Start achievement cache watcher (monitors when user views "Your Stuff" tab)
    startAchievementCacheWatcher();
    // Track real game session start/stop, used as a reliable playtime
    // fallback for non-Steam shortcuts (see src/lib/playSessionTracker.ts)
    const stopPlaySessionTracking = startPlaySessionTracking();
    // Automatic sync with Steam's frontend data (real-time playtime and
    // achievements). Waits for network/Steam/backend and retries quietly;
    // toasts go through notify() and respect the "Sync notifications" setting.
    startStartupSync(() => disposed);
    return {
        name: 'Deck Progress Tracker',
        titleView: SP_REACT.createElement("div", { className: DFL.staticClasses.Title }, "Deck Progress Tracker"),
        content: SP_REACT.createElement(MainPanel, null),
        icon: SP_REACT.createElement(FaTrophy, null),
        onDismount() {
            disposed = true;
            try {
                unpatchLibraryCapsules?.();
                stopLibraryBadgeStore?.();
            }
            catch (error) {
                // Error removing library capsule patch
            }
            // Stop achievement cache watcher
            stopAchievementCacheWatcher();
            // Stop play session tracking
            stopPlaySessionTracking?.();
            // Clean up patches when plugin is unloaded
            if (libraryPatch) {
                try {
                    routerHook.removePatch('/library/app/:appid', libraryPatch);
                }
                catch (error) {
                    // Error removing library app patch
                }
            }
        }
    };
});

export { index as default };
//# sourceMappingURL=index.js.map
