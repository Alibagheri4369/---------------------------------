import { CSSProperties, ReactNode } from 'react';

interface ThemeBoxProps {
  children: ReactNode;
  variant?: 'default' | 'surface' | 'surface-secondary' | 'muted';
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

/**
 * ThemeBox - A theme-aware container component
 * Automatically applies background, text, and border colors based on theme
 */
export function ThemeBox({ 
  children, 
  variant = 'default',
  className = '', 
  style = {},
  onClick 
}: ThemeBoxProps) {
  const variantStyles: Record<string, CSSProperties> = {
    default: {
      backgroundColor: 'var(--background)',
      color: 'var(--foreground)',
    },
    surface: {
      backgroundColor: 'var(--surface)',
      color: 'var(--foreground)',
      borderColor: 'var(--border)',
    },
    'surface-secondary': {
      backgroundColor: 'var(--surface-secondary)',
      color: 'var(--foreground)',
      borderColor: 'var(--border)',
    },
    muted: {
      backgroundColor: 'var(--muted)',
      color: 'var(--muted-foreground)',
    },
  };

  return (
    <div
      className={`${className} transition-colors duration-200`}
      style={{ ...variantStyles[variant], ...style }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface ThemeButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * ThemeButton - A theme-aware button component
 */
export function ThemeButton({ 
  children, 
  variant = 'primary',
  className = '', 
  style = {},
  onClick,
  disabled = false,
  type = 'button'
}: ThemeButtonProps) {
  const variantStyles: Record<string, CSSProperties> = {
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
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--foreground)',
      borderColor: 'transparent',
    },
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${className} transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
      style={{ ...variantStyles[variant], ...style }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

interface ThemeCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  hover?: boolean;
}

/**
 * ThemeCard - A theme-aware card component
 */
export function ThemeCard({ 
  children, 
  className = '', 
  style = {},
  onClick,
  hover = true
}: ThemeCardProps) {
  const cardStyle: CSSProperties = {
    backgroundColor: 'var(--surface)',
    color: 'var(--foreground)',
    borderColor: 'var(--border)',
  };

  return (
    <div
      className={`${className} border rounded-xl transition-all duration-200 ${
        hover ? 'hover:shadow-lg' : ''
      }`}
      style={{ ...cardStyle, ...style }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface ThemeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  type?: string;
  disabled?: boolean;
}

/**
 * ThemeInput - A theme-aware input component
 */
export function ThemeInput({ 
  value,
  onChange,
  placeholder = '',
  className = '', 
  style = {},
  type = 'text',
  disabled = false
}: ThemeInputProps) {
  const inputStyle: CSSProperties = {
    backgroundColor: 'var(--surface)',
    color: 'var(--foreground)',
    borderColor: 'var(--border)',
  };

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`${className} border rounded-lg px-3 py-2 transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed`}
      style={{ 
        ...inputStyle, 
        ...style,
        // Focus ring color based on primary
        '--tw-ring-color': 'var(--primary)',
      } as CSSProperties}
    />
  );
}
