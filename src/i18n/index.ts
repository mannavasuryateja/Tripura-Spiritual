import { en } from './en';
import { te } from './te';

export type Language = 'en' | 'te';

export const translations = {
  en,
  te
};

export const getTranslation = (lang: Language) => translations[lang] || translations.en;
