/**
 * Session Timeout Hook
 * Automatically logs out inactive users after a specified timeout period
 */

import { useEffect, useRef, useCallback } from 'react';
import { showSessionExpired } from '../utils/toast';

interface SessionTimeoutOptions {
  timeout?: number; // milliseconds
  onTimeout?: () => void;
  enabled?: boolean;
  warningTime?: number; // milliseconds before timeout to show warning
}

const DEFAULT_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const DEFAULT_WARNING_TIME = 2 * 60 * 1000; // 2 minutes before timeout

/**
 * Hook to manage session timeout with activity tracking
 */
export function useSessionTimeout({
  timeout = DEFAULT_TIMEOUT,
  onTimeout,
  enabled = true,
  warningTime = DEFAULT_WARNING_TIME,
}: SessionTimeoutOptions = {}) {
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const warningIdRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const hasWarnedRef = useRef<boolean>(false);

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    if (warningIdRef.current) {
      clearTimeout(warningIdRef.current);
      warningIdRef.current = null;
    }
  }, []);

  // Reset the session timeout
  const resetTimeout = useCallback(() => {
    if (!enabled) return;

    clearTimers();
    hasWarnedRef.current = false;
    lastActivityRef.current = Date.now();

    // Set warning timer
    if (warningTime > 0) {
      warningIdRef.current = setTimeout(() => {
        if (!hasWarnedRef.current) {
          hasWarnedRef.current = true;
          const remainingMinutes = Math.ceil(warningTime / 60000);
          showSessionExpired();
          console.warn(`Session will expire in ${remainingMinutes} minutes due to inactivity`);
        }
      }, timeout - warningTime);
    }

    // Set timeout timer
    timeoutIdRef.current = setTimeout(() => {
      console.log('Session timeout - logging out user');
      showSessionExpired();
      
      if (onTimeout) {
        onTimeout();
      }
    }, timeout);
  }, [enabled, timeout, warningTime, onTimeout, clearTimers]);

  // Activity handler
  const handleActivity = useCallback(() => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;

    // Only reset if enough time has passed (debounce)
    // این باعث می‌شود که هر حرکت موس باعث reset نشود
    if (timeSinceLastActivity > 1000) { // 1 second debounce
      resetTimeout();
    }
  }, [resetTimeout]);

  // Setup activity listeners
  useEffect(() => {
    if (!enabled) {
      clearTimers();
      return;
    }

    // Events to track user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'focus',
    ];

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Initial timeout setup
    resetTimeout();

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      clearTimers();
    };
  }, [enabled, handleActivity, resetTimeout, clearTimers]);

  // Visibility change handler (when tab becomes active again)
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        const timeSinceLastActivity = now - lastActivityRef.current;

        // If user was away for more than timeout, trigger logout
        if (timeSinceLastActivity > timeout) {
          console.log('Session expired while tab was hidden');
          showSessionExpired();
          
          if (onTimeout) {
            onTimeout();
          }
        } else {
          // Reset timeout if still within valid period
          resetTimeout();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, timeout, onTimeout, resetTimeout]);

  return {
    resetTimeout,
    lastActivity: lastActivityRef.current,
  };
}

/**
 * Get remaining session time in milliseconds
 */
export function getRemainingSessionTime(
  lastActivity: number,
  timeout: number = DEFAULT_TIMEOUT
): number {
  const elapsed = Date.now() - lastActivity;
  const remaining = timeout - elapsed;
  return Math.max(0, remaining);
}

/**
 * Format remaining time for display
 */
export function formatRemainingSessionTime(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);

  if (minutes > 0) {
    return `${minutes} دقیقه و ${seconds} ثانیه`;
  }
  return `${seconds} ثانیه`;
}
