/**
 * Rate Limiter Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
  formatRemainingTime,
} from '../rateLimiter';

describe('Rate Limiter', () => {
  const testEmail = 'test@example.com';

  beforeEach(() => {
    // Clear rate limit before each test
    clearRateLimit(testEmail);
  });

  describe('checkRateLimit', () => {
    it('should allow first attempt', () => {
      const result = checkRateLimit(testEmail);
      
      expect(result.allowed).toBe(true);
      expect(result.remainingAttempts).toBe(5);
    });

    it('should track failed attempts', () => {
      // Record 2 failed attempts
      recordFailedAttempt(testEmail);
      recordFailedAttempt(testEmail);

      const result = checkRateLimit(testEmail);
      
      expect(result.allowed).toBe(true);
      expect(result.remainingAttempts).toBe(3); // 5 - 2 = 3
    });

    it('should block after max attempts', () => {
      // Record 5 failed attempts
      for (let i = 0; i < 5; i++) {
        recordFailedAttempt(testEmail);
      }

      const result = checkRateLimit(testEmail);
      
      expect(result.allowed).toBe(false);
      expect(result.remainingAttempts).toBe(0);
      expect(result.lockedUntil).toBeDefined();
    });

    it('should reset after clearing', () => {
      // Record some attempts
      recordFailedAttempt(testEmail);
      recordFailedAttempt(testEmail);

      // Clear
      clearRateLimit(testEmail);

      // Check again
      const result = checkRateLimit(testEmail);
      
      expect(result.allowed).toBe(true);
      expect(result.remainingAttempts).toBe(5);
    });
  });

  describe('formatRemainingTime', () => {
    it('should format seconds correctly', () => {
      const now = Date.now();
      const future = now + 30 * 1000; // 30 seconds

      const formatted = formatRemainingTime(future);
      
      expect(formatted).toContain('ثانیه');
    });

    it('should format minutes correctly', () => {
      const now = Date.now();
      const future = now + 5 * 60 * 1000; // 5 minutes

      const formatted = formatRemainingTime(future);
      
      expect(formatted).toContain('دقیقه');
    });
  });

  describe('recordFailedAttempt', () => {
    it('should increment attempt count', () => {
      recordFailedAttempt(testEmail);
      const result1 = checkRateLimit(testEmail);
      expect(result1.remainingAttempts).toBe(4);

      recordFailedAttempt(testEmail);
      const result2 = checkRateLimit(testEmail);
      expect(result2.remainingAttempts).toBe(3);
    });
  });
});
