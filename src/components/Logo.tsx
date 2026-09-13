import { HTMLAttributes } from 'react';

type LogoVariant = 'full' | 'compact' | 'icon' | 'light';

interface LogoProps extends HTMLAttributes<HTMLImageElement> {
  variant?: LogoVariant;
  size?: number | string;
  className?: string;
}

/**
 * EDX CRM Logo Component
 * 
 * Variants:
 * - full: Full logo with subtitle (400x120) - Best for headers, landing pages
 * - compact: Logo with CRM text (200x80) - Best for navbars, mobile
 * - icon: Icon only (64x64) - Best for small spaces, buttons
 * - light: Full logo for light backgrounds
 * 
 * Usage:
 * ```tsx
 * <Logo variant="full" size={120} />
 * <Logo variant="compact" className="w-32" />
 * <Logo variant="icon" size="40px" />
 * ```
 */
export function Logo({ 
  variant = 'compact', 
  size, 
  className = '', 
  ...props 
}: LogoProps) {
  const logoSrc = {
    full: '/assets/logo-full.svg',
    compact: '/assets/logo-compact.svg',
    icon: '/assets/logo-icon.svg',
    light: '/assets/logo-light.svg',
  }[variant];

  const defaultDimensions = {
    full: { width: 400, height: 120 },
    compact: { width: 200, height: 80 },
    icon: { width: 64, height: 64 },
    light: { width: 400, height: 120 },
  }[variant];

  const style = size 
    ? typeof size === 'number' 
      ? { height: `${size}px`, width: 'auto' }
      : { height: size, width: 'auto' }
    : undefined;

  return (
    <img
      src={logoSrc}
      alt="EDX CRM Logo"
      width={defaultDimensions.width}
      height={defaultDimensions.height}
      className={className}
      style={style}
      loading="lazy"
      {...props}
    />
  );
}
