import { fa } from './locales/fa';
import { en } from './locales/en';
import { de } from './locales/de';
import type { TranslationKeys, AppLanguage } from './types';

const locales: Record<AppLanguage, TranslationKeys> = {
  fa,
  en,
  de,
};

export type { TranslationKeys, AppLanguage } from './types';

let currentLanguage: AppLanguage = 'fa';

export function setLanguage(lang: AppLanguage): void {
  currentLanguage = lang;
  // Update HTML lang and dir attributes
  const html = document.documentElement;
  html.lang = lang;
  html.dir = lang === 'fa' ? 'rtl' : 'ltr';
}

export function getLanguage(): AppLanguage {
  return currentLanguage;
}

export function t<K extends keyof TranslationKeys>(key: K): TranslationKeys[K];
export function t(key: string): string;
export function t(key: any): any {
  // Handle nested paths like 'roadmapView.noProject'
  if (typeof key === 'string' && key.includes('.')) {
    return tNested(key);
  }
  return locales[currentLanguage][key as keyof TranslationKeys];
}

export function getLocaleMessages(lang: AppLanguage): TranslationKeys {
  return locales[lang];
}

export function getAllLocales(): Record<AppLanguage, TranslationKeys> {
  return locales;
}

export function isRTL(lang?: AppLanguage): boolean {
  const targetLang = lang || currentLanguage;
  return targetLang === 'fa';
}

export function getDirection(lang?: AppLanguage): 'rtl' | 'ltr' {
  return isRTL(lang) ? 'rtl' : 'ltr';
}

// Helper to get nested translation keys (e.g., 'theme.dark')
export function tNested(path: string): string {
  const keys = path.split('.');
  let value: any = locales[currentLanguage];
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      // Fallback to English if key not found
      value = locales.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return path; // Return path as fallback
        }
      }
      break;
    }
  }
  
  return typeof value === 'string' ? value : path;
}

export default {
  setLanguage,
  getLanguage,
  t,
  getLocaleMessages,
  getAllLocales,
  isRTL,
  getDirection,
  tNested,
};