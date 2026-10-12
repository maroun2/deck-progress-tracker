import type { TranslationKey } from './en';

/**
 * Brazilian Portuguese translations
 */
export const ptBR: Record<TranslationKey, string> = {
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

  // Settings - Tagging
  'settings.tagging': 'Marcação de Tags',
  'settings.inProgressThreshold': 'Limite para "Em Progresso"',
  'settings.minutesSuffix': ' min',

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
  'tag.mastered.desc': 'Desbloqueou 85%+ de todas as conquistas',
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
