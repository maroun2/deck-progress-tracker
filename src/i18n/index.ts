import { call } from '@decky/api';
import { useEffect, useState } from 'react';
import { en, TranslationKey } from './en';
import { ptBR } from './pt-BR';

export type { TranslationKey } from './en';

export type Language = 'en' | 'pt-BR';
export type LanguagePreference = 'auto' | Language;

const DICTIONARIES: Record<Language, Record<TranslationKey, string>> = {
  en,
  'pt-BR': ptBR,
};

export const LANGUAGE_UPDATED_EVENT = 'deck-progress-tracker:language-updated';

function detectSystemLanguage(): Language {
  const systemLanguage = (navigator.language || 'en').toLowerCase();
  return systemLanguage.startsWith('pt') ? 'pt-BR' : 'en';
}

let currentLanguage: Language = detectSystemLanguage();
let initialized = false;
const listeners = new Set<() => void>();

async function resolveLanguage(): Promise<Language> {
  try {
    const result = await call<[], { settings: { language?: LanguagePreference } }>('get_settings');
    const preference = result.settings?.language || 'auto';
    return preference === 'auto' ? detectSystemLanguage() : preference;
  } catch (e) {
    return detectSystemLanguage();
  }
}

async function refreshLanguage() {
  currentLanguage = await resolveLanguage();
  listeners.forEach((listener) => listener());
}

function ensureInitialized() {
  if (initialized) {
    return;
  }
  initialized = true;
  refreshLanguage();
  window.addEventListener(LANGUAGE_UPDATED_EVENT, refreshLanguage);
}

export function getLanguage(): Language {
  return currentLanguage;
}

export function translate(key: TranslationKey, vars?: Record<string, string | number>): string {
  const template = DICTIONARIES[currentLanguage][key] ?? en[key] ?? key;
  if (!vars) {
    return template;
  }
  return Object.entries(vars).reduce(
    (acc, [name, value]) => acc.split(`{${name}}`).join(String(value)),
    template
  );
}

/**
 * Subscribes to language changes (triggered via LANGUAGE_UPDATED_EVENT,
 * dispatched by Settings after the user changes their preference).
 */
export function subscribeToLanguage(listener: () => void): () => void {
  ensureInitialized();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * React hook giving components a `t()` function that re-renders when the
 * resolved language changes (system detection or manual override).
 */
export function useTranslation() {
  const [, forceRender] = useState(0);

  useEffect(() => subscribeToLanguage(() => forceRender((n) => n + 1)), []);

  return { t: translate, language: currentLanguage };
}
