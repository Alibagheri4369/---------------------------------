/**
 * Theme-aware utility functions for consistent styling across components
 * These functions return inline styles that use CSS variables
 */

export const themeStyles = {
  // Background styles
  background: {
    app: { backgroundColor: 'var(--background)' },
    surface: { backgroundColor: 'var(--surface)' },
    surfaceSecondary: { backgroundColor: 'var(--surface-secondary)' },
    primary: { backgroundColor: 'var(--primary)' },
    muted: { backgroundColor: 'var(--muted)' },
  },
  
  // Text color styles
  text: {
    foreground: { color: 'var(--foreground)' },
    muted: { color: 'var(--muted-foreground)' },
    primary: { color: 'var(--primary)' },
    primaryFg: { color: 'var(--primary-foreground)' },
  },
  
  // Border styles
  border: {
    default: { borderColor: 'var(--border)' },
    primary: { borderColor: 'var(--primary)' },
  },
  
  // Combined styles for common patterns
  card: {
    backgroundColor: 'var(--surface)',
    borderColor: 'var(--border)',
    color: 'var(--foreground)',
  },
  
  button: {
    primary: {
      backgroundColor: 'var(--primary)',
      color: 'var(--primary-foreground)',
      borderColor: 'var(--primary)',
    },
    secondary: {
      backgroundColor: 'var(--surface-secondary)',
      color: 'var(--foreground)',
      borderColor: 'var(--border)',
    },
  },
  
  input: {
    backgroundColor: 'var(--surface)',
    color: 'var(--foreground)',
    borderColor: 'var(--border)',
  },
};

/**
 * Get combined theme styles
 * Usage: style={getThemeStyle('card')}
 */
export function getThemeStyle(styleKey: keyof typeof themeStyles): React.CSSProperties {
  return themeStyles[styleKey] as React.CSSProperties;
}

/**
 * Merge theme styles with custom styles
 * Usage: style={mergeThemeStyles('card', { padding: '1rem' })}
 */
export function mergeThemeStyles(
  styleKey: keyof typeof themeStyles,
  customStyles?: React.CSSProperties
): React.CSSProperties {
  return {
    ...(themeStyles[styleKey] as React.CSSProperties),
    ...customStyles,
  };
}

/**
 * Get theme-aware className for Tailwind utilities
 * This returns transition classes to make theme changes smooth
 */
export function getThemeTransitionClasses(): string {
  return 'transition-colors duration-200';
}
