import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { 
  setLanguage as setI18nLanguage, 
  getLanguage as getI18nLanguage, 
  t, 
  isRTL, 
  getDirection,
  type AppLanguage,
  type TranslationKeys 
} from './index';

interface I18nContextType {
  language: AppLanguage;
  direction: 'rtl' | 'ltr';
  t: <K extends keyof TranslationKeys>(key: K) => TranslationKeys[K];
  setLanguage: (lang: AppLanguage) => void;
  availableLanguages: AppLanguage[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
  initialLanguage?: AppLanguage;
}

export function I18nProvider({ 
  children, 
  initialLanguage = 'fa' 
}: I18nProviderProps) {
  const [language, setLanguageState] = useState<AppLanguage>(initialLanguage);
  const [mounted, setMounted] = useState(false);

  // Initialize on mount
  useEffect(() => {
    setMounted(true);
    
    // Load from localStorage if available (for immediate paint)
    try {
      const savedLang = localStorage.getItem('appLanguage') as AppLanguage | null;
      if (savedLang && ['fa', 'en', 'de'].includes(savedLang)) {
        setLanguageState(savedLang);
        setI18nLanguage(savedLang);
      } else {
        setI18nLanguage(initialLanguage);
      }
    } catch {
      setI18nLanguage(initialLanguage);
    }
  }, [initialLanguage]);

  // Apply language changes
  const setLanguage = useCallback((lang: AppLanguage) => {
    setLanguageState(lang);
    setI18nLanguage(lang);
    
    // Persist to localStorage
    try {
      localStorage.setItem('appLanguage', lang);
    } catch {
      // Ignore
    }
  }, []);

  const direction = getDirection(language);
  const availableLanguages: AppLanguage[] = ['fa', 'en', 'de'];

  const value = useMemo(() => ({
    language,
    direction,
    t,
    setLanguage,
    availableLanguages,
  }), [language, direction, setLanguage]);

  // Don't render children until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <I18nContext.Provider value={value}>
        {children}
      </I18nContext.Provider>
    );
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// Export translation function for non-component usage
export { t } from './index';
export type { AppLanguage, TranslationKeys } from './types';