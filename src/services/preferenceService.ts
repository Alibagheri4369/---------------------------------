import { UserPreferences, ThemeMode, ColorTheme, AppLanguage, DateFormatPreference, InterfaceDensity } from '../types';
import { getSupabaseClient, userPartitionStorage } from './supabaseClient';

export const DEFAULT_PREFERENCES: Omit<UserPreferences, 'userId'> = {
  themeMode: 'dark',
  colorTheme: 'default', // White + Black + Yellow accent
  language: 'fa',
  timezone: 'Asia/Tehran',
  dateFormat: 'jalali',
  density: 'comfortable',
  updatedAt: new Date().toISOString(),
};

/**
 * Fetch preferences for an authenticated or guest user
 */
export async function getUserPreferences(targetUserId?: string): Promise<UserPreferences> {
  const userId = targetUserId || 'guest_anonymous';
  const fallbackPrefs: UserPreferences = {
    userId,
    ...DEFAULT_PREFERENCES,
  };

  const supabase = getSupabaseClient();
  if (supabase && userId && !userId.startsWith('guest_')) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (!error && data) {
        return {
          userId: data.user_id,
          themeMode: (data.theme_mode as ThemeMode) || 'dark',
          colorTheme: (data.color_theme as ColorTheme) || 'default',
          language: (data.language as AppLanguage) || 'fa',
          timezone: data.timezone || 'Asia/Tehran',
          dateFormat: (data.date_format as DateFormatPreference) || 'jalali',
          density: (data.density as InterfaceDensity) || 'comfortable',
          updatedAt: data.updated_at || new Date().toISOString(),
        };
      }
    } catch {
      // Ignore and fallback to userPartitionStorage
    }
  }

  // Local partition fallback
  const local = userPartitionStorage.getItem<UserPreferences>(userId, 'user_preferences', fallbackPrefs);
  return local || fallbackPrefs;
}

/**
 * Save user preferences to Supabase and local cache
 */
export async function saveUserPreferences(
  prefs: Partial<UserPreferences>, 
  targetUserId?: string
): Promise<boolean> {
  const userId = prefs.userId || targetUserId || 'guest_anonymous';
  const existing = await getUserPreferences(userId);
  const updated: UserPreferences = {
    ...existing,
    ...prefs,
    userId,
    updatedAt: new Date().toISOString(),
  };

  // Always update local cache
  userPartitionStorage.setItem(userId, 'user_preferences', updated);

  const supabase = getSupabaseClient();
  if (supabase && userId && !userId.startsWith('guest_')) {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          theme_mode: updated.themeMode,
          color_theme: updated.colorTheme,
          language: updated.language,
          timezone: updated.timezone,
          date_format: updated.dateFormat,
          density: updated.density,
          updated_at: updated.updatedAt,
        });

      return !error;
    } catch {
      return false;
    }
  }

  return true;
}
