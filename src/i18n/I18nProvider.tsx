import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { getUserPreferences, saveUserPreferences } from '../services/preferenceService';
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
  t: {
    <K extends keyof TranslationKeys>(key: K): TranslationKeys[K];
    (key: string): string;
  };
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
  initialLanguage = 'fa',
  userId = 'guest_anonymous'
}: I18nProviderProps & { userId?: string }) {
  const [language, setLanguageState] = useState<AppLanguage>(initialLanguage);
  const [mounted, setMounted] = useState(false);

  // Initialize on mount
  useEffect(() => {
    setMounted(true);
    
    // Load language from Supabase preferences
    const loadLanguagePreference = async () => {
      try {
        if (userId && !userId.startsWith('guest_')) {
          const prefs = await getUserPreferences(userId);
          if (prefs && ['fa', 'en', 'de'].includes(prefs.language)) {
            setLanguageState(prefs.language);
            setI18nLanguage(prefs.language);
          }
        }
      } catch (error) {
        console.error('Failed to load language preference:', error);
        // Ignore - will use initial props
      }
    };
    
    loadLanguagePreference();
  }, [initialLanguage, userId]);

  // Apply language changes
  const setLanguage = useCallback((lang: AppLanguage) => {
    setLanguageState(lang);
    setI18nLanguage(lang);
    
    // Persist to Supabase
    const persistLanguagePreference = async () => {
      try {
        if (userId && !userId.startsWith('guest_')) {
          await saveUserPreferences({
            language: lang
          }, userId);
        }
      } catch (error) {
        console.error('Failed to save language preference:', error);
      }
    };
    
    persistLanguagePreference();
  }, [userId]);

  const direction = getDirection(language);
  const availableLanguages: AppLanguage[] = ['fa', 'en', 'de'];

  const value = useMemo(() => ({
      language,
      direction,
      t,
    }), [language, direction, setLanguage, userId]);

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