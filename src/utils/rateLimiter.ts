/**
 * Rate Limiter Utility for Authentication
 * Prevents brute force attacks on login/register
 */

interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  lockedUntil?: number;
}

// In-memory store (در production از Redis استفاده کنید)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const MAX_ATTEMPTS = 5; // حداکثر 5 تلاش
const WINDOW_MS = 15 * 60 * 1000; // در بازه 15 دقیقه
const LOCKOUT_MS = 15 * 60 * 1000; // قفل شدن برای 15 دقیقه

/**
 * Check if an identifier (email/IP) has exceeded rate limit
 */
export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remainingAttempts: number;
  resetTime?: number;
  lockedUntil?: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // اگر قفل شده باشد
  if (entry?.lockedUntil && entry.lockedUntil > now) {
    return {
      allowed: false,
      remainingAttempts: 0,
      lockedUntil: entry.lockedUntil,
    };
  }

  // اگر ورودی وجود ندارد یا منقضی شده
  if (!entry || (now - entry.firstAttempt) > WINDOW_MS) {
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS,
    };
  }

  // بررسی تعداد تلاش‌ها
  const remainingAttempts = MAX_ATTEMPTS - entry.attempts;
  
  if (remainingAttempts <= 0) {
    // قفل کردن
    entry.lockedUntil = now + LOCKOUT_MS;
    rateLimitStore.set(identifier, entry);
    
    return {
      allowed: false,
      remainingAttempts: 0,
      lockedUntil: entry.lockedUntil,
    };
  }

  return {
    allowed: true,
    remainingAttempts,
    resetTime: entry.firstAttempt + WINDOW_MS,
  };
}

/**
 * Record a failed attempt
 */
export function recordFailedAttempt(identifier: string): void {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || (now - entry.firstAttempt) > WINDOW_MS) {
    // شروع پنجره جدید
    rateLimitStore.set(identifier, {
      attempts: 1,
      firstAttempt: now,
    });
  } else {
    // افزایش تعداد تلاش‌ها
    entry.attempts += 1;
    rateLimitStore.set(identifier, entry);
  }
}

/**
 * Clear rate limit for an identifier (after successful login)
 */
export function clearRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Format remaining time for user display
 */
export function formatRemainingTime(timestamp: number): string {
  const now = Date.now();
  const remaining = Math.ceil((timestamp - now) / 1000);
  
  if (remaining < 60) {
    return `${remaining} ثانیه`;
  }
  
  const minutes = Math.ceil(remaining / 60);
  return `${minutes} دقیقه`;
}

/**
 * Cleanup expired entries (run periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  
  for (const [identifier, entry] of rateLimitStore.entries()) {
    // حذف ورودی‌های منقضی شده
    if ((now - entry.firstAttempt) > WINDOW_MS && 
        (!entry.lockedUntil || entry.lockedUntil < now)) {
      rateLimitStore.delete(identifier);
    }
  }
}

// Cleanup هر 5 دقیقه
if (typeof window !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}
