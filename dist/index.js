const manifest = {"name":"Deck Progress Tracker","author":"Maron","version":"1.4.7","api_version":1,"flags":[],"publish":{"tags":["library","achievements","statistics","enhancement","progress-tracking"],"description":"Automatic game tagging based on achievements, playtime, and completion time. Track your progress with visual badges in the Steam library. Features 5 intelligent tags: Mastered, Completed, Dropped, In Progress, and Backlog.","image":"https://raw.githubusercontent.com/maroun2/deck-progress-tracker/main/assets/market_image.png"}};
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
function FaCog (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"},"child":[]}]})(props);
}function FaGlobe (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 496 512"},"child":[{"tag":"path","attr":{"d":"M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"},"child":[]}]})(props);
}function FaSyncAlt (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M370.72 133.28C339.458 104.008 298.888 87.962 255.848 88c-77.458.068-144.328 53.178-162.791 126.85-1.344 5.363-6.122 9.15-11.651 9.15H24.103c-7.498 0-13.194-6.807-11.807-14.176C33.933 94.924 134.813 8 256 8c66.448 0 126.791 26.136 171.315 68.685L463.03 40.97C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.749zM32 296h134.059c21.382 0 32.09 25.851 16.971 40.971l-41.75 41.75c31.262 29.273 71.835 45.319 114.876 45.28 77.418-.07 144.315-53.144 162.787-126.849 1.344-5.363 6.122-9.15 11.651-9.15h57.304c7.498 0 13.194 6.807 11.807 14.176C478.067 417.076 377.187 504 256 504c-66.448 0-126.791-26.136-171.315-68.685L48.97 471.03C33.851 486.149 8 475.441 8 454.059V320c0-13.255 10.745-24 24-24z"},"child":[]}]})(props);
}function FaTags (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 640 512"},"child":[{"tag":"path","attr":{"d":"M497.941 225.941L286.059 14.059A48 48 0 0 0 252.118 0H48C21.49 0 0 21.49 0 48v204.118a48 48 0 0 0 14.059 33.941l211.882 211.882c18.744 18.745 49.136 18.746 67.882 0l204.118-204.118c18.745-18.745 18.745-49.137 0-67.882zM112 160c-26.51 0-48-21.49-48-48s21.49-48 48-48 48 21.49 48 48-21.49 48-48 48zm513.941 133.823L421.823 497.941c-18.745 18.745-49.137 18.745-67.882 0l-.36-.36L527.64 323.522c16.999-16.999 26.36-39.6 26.36-63.64s-9.362-46.641-26.36-63.64L331.397 0h48.721a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882z"},"child":[]}]})(props);
}function FaThLarge (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M296 32h192c13.255 0 24 10.745 24 24v160c0 13.255-10.745 24-24 24H296c-13.255 0-24-10.745-24-24V56c0-13.255 10.745-24 24-24zm-80 0H24C10.745 32 0 42.745 0 56v160c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24V56c0-13.255-10.745-24-24-24zM0 296v160c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24V296c0-13.255-10.745-24-24-24H24c-13.255 0-24 10.745-24 24zm296 184h192c13.255 0 24-10.745 24-24V296c0-13.255-10.745-24-24-24H296c-13.255 0-24 10.745-24 24v160c0 13.255 10.745 24 24 24z"},"child":[]}]})(props);
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
    'settings.badgePosition': 'Badge Position',
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
    'settings.openSettings': 'Settings',
    'settings.title': 'Deck Progress Tracker',
    'settings.pageGeneral': 'General',
    'settings.pageBadges': 'Badges',
    'settings.syncSection': 'Library sync',
    'settings.syncDesc': 'Re-scan playtime and achievements for every game and update tags.',
    'settings.badgePositionDesc': 'Where the tag badge sits on a game\'s page banner.',
    'settings.customizeTagsDesc': 'Rename tags and pick their colours. Colours are used in the lists, on the game page and on library tiles.',
    // Settings - Library tile badges
    'settings.libraryBadgeSection': 'Library tiles',
    'settings.libraryBadgePosition': 'Library badge position',
    'settings.libraryBadgePositionDesc': 'Small tag icon on every game tile in the library, collections and Home. ProtonDB Badges uses the bottom left by default; if both are in the same corner, this badge steps aside.',
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
    'settings.badgePosition': 'Posição do Badge',
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
    'settings.openSettings': 'Configurações',
    'settings.title': 'Deck Progress Tracker',
    'settings.pageGeneral': 'Geral',
    'settings.pageBadges': 'Selos',
    'settings.syncSection': 'Sincronização da biblioteca',
    'settings.syncDesc': 'Verifica novamente o tempo de jogo e as conquistas de todos os jogos e atualiza as tags.',
    'settings.badgePositionDesc': 'Onde o selo da tag aparece no banner da página do jogo.',
    'settings.customizeTagsDesc': 'Renomeie as tags e escolha suas cores. As cores são usadas nas listas, na página do jogo e nos blocos da biblioteca.',
    // Settings - Library tile badges
    'settings.libraryBadgeSection': 'Blocos da biblioteca',
    'settings.libraryBadgePosition': 'Posição do selo na biblioteca',
    'settings.libraryBadgePositionDesc': 'Pequeno ícone da tag em cada jogo da biblioteca, das coleções e da tela inicial. O ProtonDB Badges usa o canto inferior esquerdo por padrão; se ambos estiverem no mesmo canto, este selo se afasta.',
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
    tags: {},
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
        const colors = {};
        Object.keys(TAG_COLOR_SETTING_KEY).forEach((type) => {
            const key = TAG_COLOR_SETTING_KEY[type];
            colors[key] = s[key] || '';
        });
        if (position !== state.position || JSON.stringify(colors) !== JSON.stringify(state.colors)) {
            emit({ ...state, position, colors });
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
            if (JSON.stringify(result.tags) !== JSON.stringify(state.tags)) {
                emit({ ...state, tags: result.tags });
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
            const newTagsSuffix = result.new_tags
                ? t('settings.syncCompleteNewTags', { count: result.new_tags })
                : '';
            const msg = t('settings.syncCompleteDetailed', { synced: result.synced ?? 0, newTags: newTagsSuffix });
            showTransient(msg, 10000);
            toaster.toast({ title: 'Deck Progress Tracker', body: msg, duration: 5000 });
        }
        catch (err) {
            setMessage(t('settings.syncError', { error: err?.message || 'Unknown' }));
        }
        finally {
            localSyncRef.current = false;
            setSyncing(false);
        }
    };
    return { syncing, message, syncLibrary };
}

/**
 * MainPanel - the Quick Access panel content.
 * Kept deliberately clean: the tag lists, a Settings button (opens the
 * full-screen settings page) and the About info. Every setting lives on
 * the settings page (src/components/SettingsPage.tsx).
 */
const SETTINGS_ROUTE = '/deck-progress-tracker/settings';
const BACKLOG_COLOR = '#888';
const TAG_LABEL_KEY$1 = {
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
const MainPanel = () => {
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
        if (containerRef.current) {
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
    const openSettings = () => {
        DFL.Navigation.Navigate(SETTINGS_ROUTE);
        DFL.Navigation.CloseSideMenus();
    };
    const groupedGames = taggedGames.reduce((acc, g) => {
        if (!acc[g.tag])
            acc[g.tag] = [];
        acc[g.tag].push(g);
        return acc;
    }, {});
    return (SP_REACT.createElement("div", { ref: containerRef, style: styles$2.container },
        message && SP_REACT.createElement("div", { style: styles$2.message }, message),
        SP_REACT.createElement("div", { style: styles$2.section },
            SP_REACT.createElement("h3", { style: styles$2.sectionTitle },
                t('settings.library'),
                " (",
                stats?.total || 0,
                ")"),
            SP_REACT.createElement(DFL.PanelSection, null, ['in_progress', 'completed', 'mastered', 'dropped', 'backlog'].map(tagType => {
                const isBacklog = tagType === 'backlog';
                const games = isBacklog ? backlogGames : (groupedGames[tagType] || []);
                const count = isBacklog ? (stats?.backlog || 0) : games.length;
                const isExpanded = !!expandedSections[tagType];
                const label = isBacklog ? t(TAG_LABEL_KEY$1[tagType]) : resolveTagLabel(tagType, settings, t);
                const color = isBacklog ? BACKLOG_COLOR : resolveTagColor(tagType, settings);
                return (SP_REACT.createElement(SP_REACT.Fragment, { key: tagType },
                    SP_REACT.createElement(DFL.PanelSectionRow, null,
                        SP_REACT.createElement(DFL.ButtonItem, { layout: "below", onClick: () => toggleSection(tagType) },
                            SP_REACT.createElement("div", { style: styles$2.tagSectionContent },
                                SP_REACT.createElement("div", { style: styles$2.tagSectionLeft },
                                    SP_REACT.createElement(TagIcon, { type: tagType, size: 18, color: isBacklog ? undefined : color }),
                                    SP_REACT.createElement("span", { style: styles$2.tagSectionTitle }, label)),
                                SP_REACT.createElement("div", { style: styles$2.tagSectionRight },
                                    SP_REACT.createElement("span", { style: { ...styles$2.tagCount, color } }, count),
                                    SP_REACT.createElement("span", { style: styles$2.expandIcon }, isExpanded ? '−' : '+'))))),
                    isExpanded && (SP_REACT.createElement("div", { style: styles$2.tagDescription }, t(TAG_DESCRIPTION_KEY[tagType], tagType === 'mastered' ? { threshold: settings.mastered_threshold } : undefined))),
                    isExpanded && games.length > 0 && games.map(game => (SP_REACT.createElement(DFL.PanelSectionRow, { key: game.appid },
                        SP_REACT.createElement(DFL.ButtonItem, { layout: "below", onClick: () => { DFL.Navigation.Navigate(`/library/app/${game.appid}`); DFL.Navigation.CloseSideMenus(); }, ...{ style: { width: '100%', overflow: 'hidden' } } },
                            SP_REACT.createElement("div", { style: { display: 'table', tableLayout: 'fixed', width: '100%' } },
                                SP_REACT.createElement("div", { style: styles$2.gameItemContent },
                                    SP_REACT.createElement("span", { style: { ...styles$2.smallDot, backgroundColor: game.tag === 'backlog' ? BACKLOG_COLOR : resolveTagColor(game.tag, settings) } }),
                                    SP_REACT.createElement("span", { style: styles$2.gameName }, game.game_name),
                                    game.is_manual && SP_REACT.createElement("span", { style: styles$2.manualBadge }, t('settings.manual')))))))),
                    isExpanded && games.length === 0 && !loadingBacklog && SP_REACT.createElement("div", { style: styles$2.emptySection }, t('settings.noGamesFound'))));
            }))),
        SP_REACT.createElement(DFL.PanelSection, null,
            SP_REACT.createElement(DFL.PanelSectionRow, null,
                SP_REACT.createElement(DFL.ButtonItem, { layout: "below", onClick: openSettings },
                    SP_REACT.createElement("div", { style: styles$2.settingsButton },
                        SP_REACT.createElement(FaCog, null),
                        SP_REACT.createElement("span", null, t('settings.openSettings')))))),
        SP_REACT.createElement(DFL.PanelSection, { title: t('settings.about') },
            SP_REACT.createElement("div", { style: styles$2.about },
                SP_REACT.createElement("p", { style: styles$2.aboutLine }, "Deck Progress Tracker"),
                SP_REACT.createElement("p", { style: styles$2.aboutLine }, "1.4.7"),
                SP_REACT.createElement("p", { style: styles$2.aboutLine }, t('settings.aboutDataSource'))),
            SP_REACT.createElement(DFL.PanelSectionRow, null,
                SP_REACT.createElement(DFL.ButtonItem, { layout: "below", onClick: () => DFL.Navigation.NavigateToExternalWeb('https://patreon.com/DeckProgressTracker') }, t('settings.supportPatreon'))))));
};
const styles$2 = {
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
 * SettingsPage - full-screen settings, opened from the Settings button in
 * the Quick Access panel (route SETTINGS_ROUTE, registered in index.tsx).
 *
 * Uses Steam's own SidebarNavigation so it looks and navigates like the
 * system settings: D-pad between pages and controls, B goes back.
 */
const CUSTOMIZABLE_TAGS = ['mastered', 'completed', 'in_progress', 'dropped'];
const TAG_LABEL_KEY = {
    mastered: 'tag.mastered',
    completed: 'tag.completed',
    in_progress: 'tag.in_progress',
    dropped: 'tag.dropped',
};
const GeneralPage = ({ settings, update }) => {
    const { t } = useTranslation();
    const { syncing, message, syncLibrary } = useLibrarySync();
    return (SP_REACT.createElement(SP_REACT.Fragment, null,
        SP_REACT.createElement(DFL.Field, { label: t('settings.syncSection'), description: message || t('settings.syncDesc'), bottomSeparator: "none" }),
        SP_REACT.createElement(DFL.ButtonItem, { layout: "below", onClick: syncLibrary, disabled: syncing }, syncing ? t('settings.syncing') : t('settings.syncLibrary')),
        SP_REACT.createElement(DFL.Field, { label: t('settings.tagging'), bottomSeparator: "none" }),
        SP_REACT.createElement(DFL.SliderField, { label: t('settings.inProgressThreshold'), value: settings.in_progress_threshold, min: 1, max: 120, step: 1, editableValue: true, valueSuffix: t('settings.minutesSuffix'), onChange: (value) => update({ in_progress_threshold: value }) }),
        SP_REACT.createElement(DFL.SliderField, { label: t('settings.masteredThreshold'), description: t('settings.masteredThresholdDesc'), value: settings.mastered_threshold, min: 50, max: 100, step: 1, editableValue: true, valueSuffix: "%", onChange: (value) => update({ mastered_threshold: value }) })));
};
const BadgesPage = ({ settings, update }) => {
    const { t } = useTranslation();
    const libraryOptions = [
        { data: 'none', label: t('settings.positionNone') },
        { data: 'top-left', label: t('settings.positionTopLeft') },
        { data: 'top-right', label: t('settings.positionTopRight') },
        { data: 'bottom-left', label: t('settings.positionBottomLeft') },
        { data: 'bottom-right', label: t('settings.positionBottomRight') },
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
    return (SP_REACT.createElement(SP_REACT.Fragment, null,
        SP_REACT.createElement(DFL.Field, { label: t('settings.libraryBadgeSection'), bottomSeparator: "none" }),
        SP_REACT.createElement(DFL.DropdownItem, { label: t('settings.libraryBadgePosition'), description: t('settings.libraryBadgePositionDesc'), menuLabel: t('settings.libraryBadgePosition'), rgOptions: libraryOptions, selectedOption: settings.library_badge_position, onChange: (option) => update({ library_badge_position: option.data }, BADGE_SETTINGS_UPDATED_EVENT) }),
        SP_REACT.createElement(DFL.Field, { label: t('settings.badgePosition'), description: t('settings.badgePositionDesc'), bottomSeparator: "none" }),
        SP_REACT.createElement(DFL.DropdownItem, { label: t('settings.horizontal'), menuLabel: t('settings.horizontal'), rgOptions: hOptions, selectedOption: settings.badge_position_h, onChange: (option) => update({ badge_position_h: option.data }, BADGE_SETTINGS_UPDATED_EVENT) }),
        SP_REACT.createElement(DFL.DropdownItem, { label: t('settings.vertical'), menuLabel: t('settings.vertical'), rgOptions: vOptions, selectedOption: settings.badge_position_v, onChange: (option) => update({ badge_position_v: option.data }, BADGE_SETTINGS_UPDATED_EVENT) }),
        SP_REACT.createElement(DFL.SliderField, { label: t('settings.avoidOverlap'), description: t('settings.avoidOverlapDesc'), value: settings.badge_overlap_offset, min: 0, max: 100, step: 1, editableValue: true, valueSuffix: "px", onChange: (value) => update({ badge_overlap_offset: value }, BADGE_SETTINGS_UPDATED_EVENT) })));
};
const CustomizeTagsPage = ({ settings, update }) => {
    const { t } = useTranslation();
    const colorOptions = TAG_COLOR_PRESETS.map((preset) => ({ data: preset.value, label: preset.label }));
    const reset = () => {
        const cleared = {};
        CUSTOMIZABLE_TAGS.forEach((type) => {
            cleared[TAG_LABEL_SETTING_KEY[type]] = '';
            cleared[TAG_COLOR_SETTING_KEY[type]] = '';
        });
        update(cleared, BADGE_SETTINGS_UPDATED_EVENT);
    };
    return (SP_REACT.createElement(SP_REACT.Fragment, null,
        SP_REACT.createElement(DFL.Field, { description: t('settings.customizeTagsDesc'), bottomSeparator: "none" }),
        CUSTOMIZABLE_TAGS.map((type) => (SP_REACT.createElement(DFL.Field, { key: type, label: t(TAG_LABEL_KEY[type]), childrenLayout: "below", bottomSeparator: "standard" },
            SP_REACT.createElement("div", { style: styles$1.customTagRow },
                SP_REACT.createElement("div", { style: styles$1.customTagLabel },
                    SP_REACT.createElement(DFL.TextField, { value: resolveTagLabel(type, settings, t), onChange: (e) => update({ [TAG_LABEL_SETTING_KEY[type]]: e.target.value }, BADGE_SETTINGS_UPDATED_EVENT) })),
                SP_REACT.createElement("div", { style: styles$1.customTagColor },
                    SP_REACT.createElement("span", { style: { ...styles$1.colorSwatch, background: resolveTagColor(type, settings) } }),
                    SP_REACT.createElement(DFL.Dropdown, { menuLabel: t(TAG_LABEL_KEY[type]), rgOptions: colorOptions, selectedOption: resolveTagColor(type, settings), onChange: (option) => update({ [TAG_COLOR_SETTING_KEY[type]]: option.data }, BADGE_SETTINGS_UPDATED_EVENT) })))))),
        SP_REACT.createElement(DFL.ButtonItem, { layout: "below", onClick: reset }, t('settings.resetTagCustomization'))));
};
const LanguagePage = ({ settings, update }) => {
    const { t } = useTranslation();
    const options = [
        { data: 'auto', label: t('settings.languageAuto') },
        { data: 'en', label: t('settings.languageEnglish') },
        { data: 'pt-BR', label: t('settings.languagePortuguese') },
    ];
    return (SP_REACT.createElement(DFL.DropdownItem, { label: t('settings.language'), menuLabel: t('settings.language'), rgOptions: options, selectedOption: settings.language, onChange: (option) => update({ language: option.data }, LANGUAGE_UPDATED_EVENT) }));
};
const SettingsPage = () => {
    const { t } = useTranslation();
    const { settings, updateSettings } = usePluginSettings();
    return (SP_REACT.createElement("div", { style: styles$1.page },
        SP_REACT.createElement(DFL.SidebarNavigation, { title: t('settings.title'), showTitle: true, pages: [
                {
                    title: t('settings.pageGeneral'),
                    icon: SP_REACT.createElement(FaSyncAlt, null),
                    content: SP_REACT.createElement(GeneralPage, { settings: settings, update: updateSettings }),
                },
                {
                    title: t('settings.pageBadges'),
                    icon: SP_REACT.createElement(FaThLarge, null),
                    content: SP_REACT.createElement(BadgesPage, { settings: settings, update: updateSettings }),
                },
                {
                    title: t('settings.customizeTags'),
                    icon: SP_REACT.createElement(FaTags, null),
                    content: SP_REACT.createElement(CustomizeTagsPage, { settings: settings, update: updateSettings }),
                },
                {
                    title: t('settings.language'),
                    icon: SP_REACT.createElement(FaGlobe, null),
                    content: SP_REACT.createElement(LanguagePage, { settings: settings, update: updateSettings }),
                },
            ] })));
};
const styles$1 = {
    // Full-screen plugin routes render under Steam's top bar
    page: { marginTop: '40px', height: 'calc(100% - 40px)', background: '#0e141b' },
    customTagRow: { display: 'flex', alignItems: 'center', gap: '16px', width: '100%' },
    customTagLabel: { flex: 1, minWidth: 0 },
    customTagColor: { display: 'flex', alignItems: 'center', gap: '8px', width: '180px', flexShrink: 0 },
    colorSwatch: { width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0, border: '1px solid rgba(255,255,255,0.4)' },
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
    const ref = SP_REACT.useRef(null);
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
    if (loading) {
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
    const { position, tags, colors } = getLibraryBadgeState();
    const tag = tags[appid] || null;
    let background = '';
    if (tag) {
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
    // Full-screen settings page, opened from the panel's Settings button
    routerHook.addRoute(SETTINGS_ROUTE, SettingsPage, { exact: true });
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
    // Trigger sync with frontend data (replaces backend auto-sync)
    // This uses Steam's frontend API for real-time playtime and achievement data
    // Add a delay before attempting sync to let Steam frontend initialize
    const syncDelay = 5000; // Start with 5 seconds delay
    setTimeout(async () => {
        try {
            // Use progressive sync with progress logging
            const result = await syncLibraryProgressive((current, total, gameName) => {
                // Progress callback - could be used for UI updates in future
            });
            // Show toast notification when initial sync completes
            // Use new_tags count from backend for accurate notification
            if (result && result.success && result.synced && result.synced > 0) {
                const newTags = result.new_tags || 0;
                const message = newTags > 0
                    ? `Synced ${result.synced} games. ${newTags} new tag${newTags > 1 ? 's' : ''} added!`
                    : `Synced ${result.synced} games. Open plugin to see your library.`;
                toaster.toast({
                    title: 'Deck Progress Tracker',
                    body: message,
                    duration: 5000,
                });
            }
            else if (!result || !result.success) {
                // Show error toast
                toaster.toast({
                    title: 'Deck Progress Tracker',
                    body: `Initial sync failed: ${result?.error || 'Unknown error'}. Will retry...`,
                    duration: 5000,
                });
                // Retry once more after additional delay
                setTimeout(async () => {
                    try {
                        const retryResult = await syncLibraryProgressive((current, total, gameName) => {
                            // Progress callback for retry
                        });
                        if (retryResult && retryResult.success && retryResult.synced) {
                            toaster.toast({
                                title: 'Deck Progress Tracker',
                                body: `Library synced: ${retryResult.synced} games processed`,
                                duration: 5000,
                            });
                        }
                        else {
                            toaster.toast({
                                title: 'Deck Progress Tracker',
                                body: 'Auto-sync failed. Please sync manually from settings.',
                                duration: 8000,
                            });
                        }
                    }
                    catch (retryErr) {
                        // Retry sync failed
                    }
                }, 10000);
            }
        }
        catch (err) {
            // Show error toast
            toaster.toast({
                title: 'Deck Progress Tracker',
                body: `Sync error: ${err?.message || 'Unknown error'}`,
                duration: 5000,
            });
        }
    }, syncDelay);
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
            try {
                routerHook.removeRoute(SETTINGS_ROUTE);
            }
            catch (error) {
                // Error removing settings route
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
