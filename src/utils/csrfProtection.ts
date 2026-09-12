/**
 * CSRF Protection Utility
 * Cross-Site Request Forgery Protection for sensitive operations
 */

const CSRF_TOKEN_KEY = 'csrf_token';
const CSRF_TOKEN_EXPIRY = 'csrf_token_expiry';
const TOKEN_LIFETIME = 60 * 60 * 1000; // 1 hour

/**
 * Generate a cryptographically secure random token
 */
function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Get or create CSRF token
 */
export function getCSRFToken(): string {
  try {
    const existingToken = sessionStorage.getItem(CSRF_TOKEN_KEY);
    const expiry = sessionStorage.getItem(CSRF_TOKEN_EXPIRY);
    
    // بررسی اعتبار توکن موجود
    if (existingToken && expiry) {
      const expiryTime = parseInt(expiry, 10);
      if (Date.now() < expiryTime) {
        return existingToken;
      }
    }
    
    // ایجاد توکن جدید
    const newToken = generateSecureToken();
    const newExpiry = Date.now() + TOKEN_LIFETIME;
    
    sessionStorage.setItem(CSRF_TOKEN_KEY, newToken);
    sessionStorage.setItem(CSRF_TOKEN_EXPIRY, newExpiry.toString());
    
    return newToken;
  } catch (err) {
    console.error('Failed to generate CSRF token:', err);
    // Fallback برای محیط‌های بدون sessionStorage
    return generateSecureToken();
  }
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string): boolean {
  try {
    const storedToken = sessionStorage.getItem(CSRF_TOKEN_KEY);
    const expiry = sessionStorage.getItem(CSRF_TOKEN_EXPIRY);
    
    if (!storedToken || !expiry) {
      return false;
    }
    
    const expiryTime = parseInt(expiry, 10);
    if (Date.now() >= expiryTime) {
      // توکن منقضی شده
      clearCSRFToken();
      return false;
    }
    
    // مقایسه امن (timing-safe)
    return secureCompare(token, storedToken);
  } catch (err) {
    console.error('CSRF validation error:', err);
    return false;
  }
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Clear CSRF token (on logout)
 */
export function clearCSRFToken(): void {
  try {
    sessionStorage.removeItem(CSRF_TOKEN_KEY);
    sessionStorage.removeItem(CSRF_TOKEN_EXPIRY);
  } catch (err) {
    console.error('Failed to clear CSRF token:', err);
  }
}

/**
 * Refresh CSRF token (extend expiry)
 */
export function refreshCSRFToken(): string {
  clearCSRFToken();
  return getCSRFToken();
}

/**
 * Add CSRF token to request headers
 */
export function addCSRFHeader(headers: Record<string, string> = {}): Record<string, string> {
  return {
    ...headers,
    'X-CSRF-Token': getCSRFToken(),
  };
}

/**
 * Middleware to check CSRF token before sensitive operations
 */
export async function withCSRFProtection<T>(
  operation: () => Promise<T>,
  providedToken?: string
): Promise<{ success: boolean; data?: T; error?: string }> {
  const token = providedToken || getCSRFToken();
  
  if (!validateCSRFToken(token)) {
    return {
      success: false,
      error: 'Invalid or expired CSRF token. Please refresh the page and try again.',
    };
  }
  
  try {
    const data = await operation();
    return { success: true, data };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Operation failed',
    };
  }
}

/**
 * Hook برای استفاده در React components
 */
export function useCSRFToken(): {
  token: string;
  refresh: () => string;
  validate: (token: string) => boolean;
} {
  const token = getCSRFToken();
  
  return {
    token,
    refresh: refreshCSRFToken,
    validate: validateCSRFToken,
  };
}
