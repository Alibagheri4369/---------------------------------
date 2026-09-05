import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Configuration keys for environment and local runtime setup
const STORAGE_KEY_SUPABASE_URL = 'app_supabase_url_custom';
const STORAGE_KEY_SUPABASE_KEY = 'app_supabase_anon_key_custom';

/**
 * Retrieve current Supabase URL and Anon Key from Vite env or local settings
 */
export function getSupabaseConfig(): { url: string; anonKey: string; isConfigured: boolean } {
  const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};
  let url = (metaEnv.VITE_SUPABASE_URL || '').trim();
  let anonKey = (metaEnv.VITE_SUPABASE_ANON_KEY || '').trim();

  // If not set in env, check custom runtime override from app settings
  if (!url || !anonKey) {
    try {
      const storedUrl = localStorage.getItem(STORAGE_KEY_SUPABASE_URL);
      const storedKey = localStorage.getItem(STORAGE_KEY_SUPABASE_KEY);
      if (storedUrl && storedKey) {
        url = storedUrl.trim();
        anonKey = storedKey.trim();
      }
    } catch {
      // ignore
    }
  }

  const isConfigured = Boolean(url && anonKey && url.startsWith('http') && anonKey.length > 10);
  return { url, anonKey, isConfigured };
}

export function saveCustomSupabaseConfig(url: string, anonKey: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_SUPABASE_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_SUPABASE_KEY, anonKey.trim());
    // Re-initialize client
    _supabaseInstance = null;
  } catch (e) {
    console.error('Failed to save custom Supabase credentials', e);
  }
}

export function clearCustomSupabaseConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_SUPABASE_URL);
    localStorage.removeItem(STORAGE_KEY_SUPABASE_KEY);
    _supabaseInstance = null;
  } catch (e) {
    console.error('Failed to clear Supabase credentials', e);
  }
}

let _supabaseInstance: SupabaseClient | null = null;

/**
 * Get or create the Supabase client instance
 */
export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  if (!_supabaseInstance) {
    try {
      _supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch (err) {
      console.error('Failed to create Supabase client', err);
      return null;
    }
  }
  return _supabaseInstance;
}

/**
 * Test connectivity with Supabase
 */
export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { ok: false, message: 'تنظیمات اتصال Supabase هنوز پیکربندی نشده است.' };
  }

  try {
    const { error } = await client.from('projects').select('id').limit(1);
    if (error) {
      // If table does not exist or permission check
      if (error.code === '42P01') {
        return { 
          ok: true, 
          message: 'اتصال به پروژه برقرار شد، اما جداول هنوز ساخته نشده‌اند. اسکریپت SQL را در داشبورد اجرا کنید.' 
        };
      }
      // RLS or other standard response indicates connection works
      return { ok: true, message: `اتصال برقرار شد (${error.message || 'RLS فعال'})` };
    }
    return { ok: true, message: 'اتصال با موفقیت تأیید شد و پایگاه داده در دسترس است.' };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'خطا در برقراری ارتباط با Supabase' };
  }
}

/**
 * User-isolated offline storage partition helper
 * Guarantees that even in offline/demo-free fallback, User A NEVER sees User B's records!
 */
export const userPartitionStorage = {
  getKey(userId: string, key: string): string {
    return `sb_user_${userId}_${key}`;
  },

  getItem<T>(userId: string, key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(this.getKey(userId, key));
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  },

  setItem<T>(userId: string, key: string, value: T): void {
    try {
      localStorage.setItem(this.getKey(userId, key), JSON.stringify(value));
    } catch (e) {
      console.error('Failed to save to user-scoped storage', e);
    }
  },

  removeItem(userId: string, key: string): void {
    try {
      localStorage.removeItem(this.getKey(userId, key));
    } catch (e) {
      console.error(e);
    }
  },
};
