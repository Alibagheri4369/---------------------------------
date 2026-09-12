/**
 * CSRF Protection Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  getCSRFToken,
  validateCSRFToken,
  clearCSRFToken,
  refreshCSRFToken,
} from '../csrfProtection';

describe('CSRF Protection', () => {
  beforeEach(() => {
    // Clear CSRF token before each test
    clearCSRFToken();
    // Clear sessionStorage
    sessionStorage.clear();
  });

  describe('getCSRFToken', () => {
    it('should generate a valid token', () => {
      const token = getCSRFToken();
      
      expect(token).toBeDefined();
      expect(token.length).toBeGreaterThan(0);
      expect(typeof token).toBe('string');
    });

    it('should return the same token on subsequent calls', () => {
      const token1 = getCSRFToken();
      const token2 = getCSRFToken();
      
      expect(token1).toBe(token2);
    });

    it('should generate different tokens after refresh', () => {
      const token1 = getCSRFToken();
      const token2 = refreshCSRFToken();
      
      expect(token1).not.toBe(token2);
    });
  });

  describe('validateCSRFToken', () => {
    it('should validate correct token', () => {
      const token = getCSRFToken();
      const isValid = validateCSRFToken(token);
      
      expect(isValid).toBe(true);
    });

    it('should reject incorrect token', () => {
      getCSRFToken(); // Generate a token
      const isValid = validateCSRFToken('wrong-token');
      
      expect(isValid).toBe(false);
    });

    it('should reject empty token', () => {
      getCSRFToken(); // Generate a token
      const isValid = validateCSRFToken('');
      
      expect(isValid).toBe(false);
    });

    it('should reject token after clear', () => {
      const token = getCSRFToken();
      clearCSRFToken();
      const isValid = validateCSRFToken(token);
      
      expect(isValid).toBe(false);
    });
  });

  describe('refreshCSRFToken', () => {
    it('should generate a new token', () => {
      const oldToken = getCSRFToken();
      const newToken = refreshCSRFToken();
      
      expect(newToken).not.toBe(oldToken);
      expect(validateCSRFToken(newToken)).toBe(true);
      expect(validateCSRFToken(oldToken)).toBe(false);
    });
  });

  describe('clearCSRFToken', () => {
    it('should remove token from storage', () => {
      getCSRFToken();
      clearCSRFToken();
      
      // بعد از clear، توکن جدید باید ایجاد شود
      const token1 = getCSRFToken();
      clearCSRFToken();
      const token2 = getCSRFToken();
      
      expect(token1).not.toBe(token2);
    });
  });
});
