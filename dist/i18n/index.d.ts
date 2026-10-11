import { TranslationKey } from './en';
export type { TranslationKey } from './en';
export type Language = 'en' | 'pt-BR';
export type LanguagePreference = 'auto' | Language;
export declare const LANGUAGE_UPDATED_EVENT = "deck-progress-tracker:language-updated";
export declare function getLanguage(): Language;
export declare function translate(key: TranslationKey, vars?: Record<string, string | number>): string;
/**
 * Subscribes to language changes (triggered via LANGUAGE_UPDATED_EVENT,
 * dispatched by Settings after the user changes their preference).
 */
export declare function subscribeToLanguage(listener: () => void): () => void;
/**
 * React hook giving components a `t()` function that re-renders when the
 * resolved language changes (system detection or manual override).
 */
export declare function useTranslation(): {
    t: typeof translate;
    language: Language;
};
