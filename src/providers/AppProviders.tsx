import { ReactNode } from 'react';
import { ThemeProvider, useTheme } from '../theme/ThemeProvider';
import { I18nProvider, useI18n } from '../i18n/I18nProvider';
import type { ThemeMode, ColorTheme, AppLanguage } from '../theme/tokens';
import type { UserPreferences } from '../types';

interface ProvidersProps {
  children: ReactNode;
  initialPreferences?: Partial<UserPreferences>;
}

export function AppProviders({ 
  children, 
  initialPreferences 
}: ProvidersProps) {
  const themeMode = initialPreferences?.themeMode as ThemeMode || 'system';
  const colorTheme = initialPreferences?.colorTheme as ColorTheme || 'default';
  const language = initialPreferences?.language as AppLanguage || 'fa';

  return (
    <ThemeProvider initialThemeMode={themeMode} initialColorTheme={colorTheme}>
      <I18nProvider initialLanguage={language}>
        {children}
      </I18nProvider>
    </ThemeProvider>
  );
}

// Hook to access both theme and i18n
export function useAppProviders() {
  const theme = useTheme();
  const i18n = useI18n();
  
  return {
    ...theme,
    ...i18n,
  };
}