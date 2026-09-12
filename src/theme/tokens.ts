export type ColorTheme = 'default' | 'blue' | 'indigo' | 'purple' | 'emerald' | 'teal' | 'orange' | 'rose' | 'slate';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface DesignTokens {
  // Base colors (CSS variables)
  background: string;
  foreground: string;
  surface: string;
  surfaceSecondary: string;
  border: string;
  primary: string;
  primaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  success: string;
  warning: string;
  danger: string;
  
  // Radius
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusXl: string;
  radiusFull: string;
  
  // Spacing
  spaceXs: string;
  spaceSm: string;
  spaceMd: string;
  spaceLg: string;
  spaceXl: string;
  space2xl: string;
  
  // Typography
  fontSans: string;
  fontMono: string;
  textXs: string;
  textSm: string;
  textBase: string;
  textLg: string;
  textXl: string;
  text2xl: string;
  text3xl: string;
  
  // Shadows
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
  shadowXl: string;
  shadow2xl: string;
  
  // Transitions
  transitionFast: string;
  transitionNormal: string;
  transitionSlow: string;
}

// Default (White + Black + Yellow) - Official Brand
export const defaultTokens: DesignTokens = {
  background: '#0f172a', // slate-950
  foreground: '#f8fafc', // slate-50
  surface: '#1e293b', // slate-800
  surfaceSecondary: '#334155', // slate-700
  border: '#475569', // slate-600
  primary: '#f59e0b', // amber-400
  primaryForeground: '#0f172a', // slate-950
  muted: '#334155', // slate-700
  mutedForeground: '#94a3b8', // slate-400
  accent: '#f59e0b', // amber-400
  accentForeground: '#0f172a', // slate-950
  success: '#10b981', // emerald-500
  warning: '#f59e0b', // amber-500
  danger: '#ef4444', // red-500
  
  radiusSm: '0.25rem',
  radiusMd: '0.375rem',
  radiusLg: '0.5rem',
  radiusXl: '0.75rem',
  radiusFull: '9999px',
  
  spaceXs: '0.25rem',
  spaceSm: '0.5rem',
  spaceMd: '1rem',
  spaceLg: '1.5rem',
  spaceXl: '2rem',
  space2xl: '3rem',
  
  fontSans: "'Vazirmatn', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', monospace",
  textXs: '0.75rem',
  textSm: '0.875rem',
  textBase: '1rem',
  textLg: '1.125rem',
  textXl: '1.25rem',
  text2xl: '1.5rem',
  text3xl: '1.875rem',
  
  shadowSm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  shadowMd: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  shadowLg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  shadowXl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  shadow2xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  
  transitionFast: '150ms ease',
  transitionNormal: '200ms ease',
  transitionSlow: '300ms ease',
};

// Light mode tokens (inverse of dark)
export const lightTokens: DesignTokens = {
  ...defaultTokens,
  background: '#ffffff',
  foreground: '#0f172a', // slate-950
  surface: '#f8fafc', // slate-50
  surfaceSecondary: '#f1f5f9', // slate-100
  border: '#e2e8f0', // slate-200
  primary: '#d97706', // amber-600
  primaryForeground: '#ffffff',
  muted: '#f1f5f9', // slate-100
  mutedForeground: '#64748b', // slate-500
  accent: '#d97706', // amber-600
  accentForeground: '#ffffff',
  success: '#059669', // emerald-600
  warning: '#d97706', // amber-600
  danger: '#dc2626', // red-600
};

// Color theme variations (only override primary/accent colors)
export const colorThemeTokens: Record<ColorTheme, Partial<DesignTokens>> = {
  default: {
    primary: '#f59e0b',
    primaryForeground: '#0f172a',
    accent: '#f59e0b',
    accentForeground: '#0f172a',
  },
  blue: {
    primary: '#3b82f6',
    primaryForeground: '#ffffff',
    accent: '#3b82f6',
    accentForeground: '#ffffff',
  },
  indigo: {
    primary: '#6366f1',
    primaryForeground: '#ffffff',
    accent: '#6366f1',
    accentForeground: '#ffffff',
  },
  purple: {
    primary: '#8b5cf6',
    primaryForeground: '#ffffff',
    accent: '#8b5cf6',
    accentForeground: '#ffffff',
  },
  emerald: {
    primary: '#10b981',
    primaryForeground: '#ffffff',
    accent: '#10b981',
    accentForeground: '#ffffff',
  },
  teal: {
    primary: '#14b8a6',
    primaryForeground: '#ffffff',
    accent: '#14b8a6',
    accentForeground: '#ffffff',
  },
  orange: {
    primary: '#f97316',
    primaryForeground: '#ffffff',
    accent: '#f97316',
    accentForeground: '#ffffff',
  },
  rose: {
    primary: '#f43f5e',
    primaryForeground: '#ffffff',
    accent: '#f43f5e',
    accentForeground: '#ffffff',
  },
  slate: {
    primary: '#64748b',
    primaryForeground: '#ffffff',
    accent: '#64748b',
    accentForeground: '#ffffff',
  },
};

// Helper to merge tokens
export function mergeTokens(base: DesignTokens, overrides: Partial<DesignTokens>): DesignTokens {
  return { ...base, ...overrides };
}

// Get tokens for theme mode
export function getTokensForMode(mode: 'light' | 'dark'): DesignTokens {
  return mode === 'light' ? lightTokens : defaultTokens;
}

// Apply tokens to CSS custom properties
export function applyTokensToCSS(tokens: DesignTokens, root: HTMLElement = document.documentElement): void {
  const cssVars: Record<string, string> = {
    '--background': tokens.background,
    '--foreground': tokens.foreground,
    '--surface': tokens.surface,
    '--surface-secondary': tokens.surfaceSecondary,
    '--border': tokens.border,
    '--primary': tokens.primary,
    '--primary-foreground': tokens.primaryForeground,
    '--muted': tokens.muted,
    '--muted-foreground': tokens.mutedForeground,
    '--accent': tokens.accent,
    '--accent-foreground': tokens.accentForeground,
    '--success': tokens.success,
    '--warning': tokens.warning,
    '--danger': tokens.danger,
    
    '--radius-sm': tokens.radiusSm,
    '--radius-md': tokens.radiusMd,
    '--radius-lg': tokens.radiusLg,
    '--radius-xl': tokens.radiusXl,
    '--radius-full': tokens.radiusFull,
    
    '--space-xs': tokens.spaceXs,
    '--space-sm': tokens.spaceSm,
    '--space-md': tokens.spaceMd,
    '--space-lg': tokens.spaceLg,
    '--space-xl': tokens.spaceXl,
    '--space-2xl': tokens.space2xl,
    
    '--font-sans': tokens.fontSans,
    '--font-mono': tokens.fontMono,
    '--text-xs': tokens.textXs,
    '--text-sm': tokens.textSm,
    '--text-base': tokens.textBase,
    '--text-lg': tokens.textLg,
    '--text-xl': tokens.textXl,
    '--text-2xl': tokens.text2xl,
    '--text-3xl': tokens.text3xl,
    
    '--shadow-sm': tokens.shadowSm,
    '--shadow-md': tokens.shadowMd,
    '--shadow-lg': tokens.shadowLg,
    '--shadow-xl': tokens.shadowXl,
    '--shadow-2xl': tokens.shadow2xl,
    
    '--transition-fast': tokens.transitionFast,
    '--transition-normal': tokens.transitionNormal,
    '--transition-slow': tokens.transitionSlow,
  };
  
  Object.entries(cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

// Get computed tokens for current theme
export function getComputedTokens(mode: 'light' | 'dark', colorTheme: ColorTheme): DesignTokens {
  const baseTokens = getTokensForMode(mode);
  const colorOverrides = colorThemeTokens[colorTheme];
  return mergeTokens(baseTokens, colorOverrides);
}