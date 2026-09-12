import { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from 'react';
import type { ThemeMode, ColorTheme } from './tokens';
import { getUserPreferences, saveUserPreferences } from '../services/preferenceService';
import { 
  getComputedTokens, 
  applyTokensToCSS, 
  defaultTokens, 
  lightTokens 
} from './tokens';

interface ThemeContextType {
  themeMode: ThemeMode;
  colorTheme: ColorTheme;
  resolvedTheme: 'light' | 'dark';
  setThemeMode: (mode: ThemeMode) => void;
  setColorTheme: (theme: ColorTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialThemeMode?: ThemeMode;
  initialColorTheme?: ColorTheme;
}

export function ThemeProvider({ 
  children, 
  initialThemeMode = 'system', 
  initialColorTheme = 'default',
  userId = 'guest_anonymous'
}: ThemeProviderProps & { userId?: string }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(initialThemeMode);
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(initialColorTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  // Get system preference
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // Resolve theme based on mode
  const resolveTheme = useCallback((mode: ThemeMode): 'light' | 'dark' => {
    if (mode === 'system') {
      return getSystemTheme();
    }
    return mode;
  }, [getSystemTheme]);

  // Apply theme to document
  const applyTheme = useCallback((mode: ThemeMode, color: ColorTheme) => {
    const resolved = resolveTheme(mode);
    setResolvedTheme(resolved);
    
    const tokens = getComputedTokens(resolved, color);
    applyTokensToCSS(tokens);
    
    // Update root element classes for CSS targeting
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    root.setAttribute('data-theme', resolved);
    root.setAttribute('data-color-theme', color);
  }, [resolveTheme]);

  // Initialize on mount
  useEffect(() => {
    setMounted(true);
    
    // Load preferences from Supabase
    const loadPreferences = async () => {
      try {
        if (userId && !userId.startsWith('guest_')) {
          const prefs = await getUserPreferences(userId);
          if (prefs) {
            setThemeModeState(prefs.themeMode);
            setColorThemeState(prefs.colorTheme);
          }
        }
      } catch (error) {
        console.error('Failed to load theme preferences:', error);
        // Ignore - will use initial props
      }
      
      // Apply initial theme
      applyTheme(themeMode, colorTheme);
    };
    
    loadPreferences();
  }, [userId]);

  // Apply theme when mode or color changes
  useEffect(() => {
    if (!mounted) return;
    applyTheme(themeMode, colorTheme);
    
    // Persist to Supabase
    const persistPreferences = async () => {
      try {
        if (userId && !userId.startsWith('guest_')) {
          await saveUserPreferences({
            themeMode,
            colorTheme
          }, userId);
        }
      } catch (error) {
        console.error('Failed to save theme preferences:', error);
      }
    };
    
    persistPreferences();
  }, [themeMode, colorTheme, mounted, applyTheme, userId]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || themeMode !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const newResolved = getSystemTheme();
      setResolvedTheme(newResolved);
      const tokens = getComputedTokens(newResolved, colorTheme);
      applyTokensToCSS(tokens);
      
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(newResolved);
      root.setAttribute('data-theme', newResolved);
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [themeMode, colorTheme, mounted, getSystemTheme]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
  }, []);

  const setColorTheme = useCallback((theme: ColorTheme) => {
    setColorThemeState(theme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeModeState(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }, []);

  const value = useMemo(() => ({
    themeMode,
    colorTheme,
    resolvedTheme,
    setThemeMode,
    setColorTheme,
    toggleTheme,
  }), [themeMode, colorTheme, resolvedTheme, setThemeMode, setColorTheme, toggleTheme]);

  // Don't render children until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <ThemeContext.Provider value={value}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook for accessing tokens in components
export function useTokens() {
  const { resolvedTheme, colorTheme } = useTheme();
  return getComputedTokens(resolvedTheme, colorTheme);
}