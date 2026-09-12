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
 * PRODUCTION: Fetch preferences for authenticated user from Supabase ONLY
 * NO localStorage fallback for authenticated users
 */
export async function getUserPreferences(targetUserId?: string): Promise<UserPreferences> {
  const userId = targetUserId || 'guest_anonymous';
  const fallbackPrefs: UserPreferences = {
    userId,
    ...DEFAULT_PREFERENCES,
  };

  // Guest users can use localStorage
  if (userId.startsWith('guest_')) {
    return userPartitionStorage.getItem<UserPreferences>(userId, 'user_preferences', fallbackPrefs);
  }

  // Authenticated users MUST use Supabase
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.error('Supabase not configured. Cannot load preferences.');
    throw new Error('Database not configured. Please set up Supabase connection.');
  }

  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Failed to fetch preferences:', error);
      throw new Error(`Failed to load preferences: ${error.message}`);
    }

    if (data) {
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

    // If no preferences exist yet, return defaults (will be created on first save)
    return fallbackPrefs;
  } catch (e: any) {
    console.error('Error fetching preferences:', e);
    throw e;
  }
}

/**
 * PRODUCTION: Save user preferences to Supabase
 * NO localStorage fallback for authenticated users
 */
export async function saveUserPreferences(
  prefs: Partial<UserPreferences>, 
  targetUserId?: string
): Promise<boolean> {
  const userId = prefs.userId || targetUserId || 'guest_anonymous';

  // Guest users can use localStorage
  if (userId.startsWith('guest_')) {
    const existing = await getUserPreferences(userId);
    const updated: UserPreferences = {
      ...existing,
      ...prefs,
      userId,
      updatedAt: new Date().toISOString(),
    };
    userPartitionStorage.setItem(userId, 'user_preferences', updated);
    return true;
  }

  // Authenticated users MUST use Supabase
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.error('Supabase not configured. Cannot save preferences.');
    throw new Error('Database not configured. Please set up Supabase connection.');
  }

  try {
    const existing = await getUserPreferences(userId);
    const updated: UserPreferences = {
      ...existing,
      ...prefs,
      userId,
      updatedAt: new Date().toISOString(),
    };

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

    if (error) {
      console.error('Failed to save preferences:', error);
      throw new Error(`Failed to save preferences: ${error.message}`);
    }


    return true;
  } catch (e: any) {
    console.error('Error saving preferences:', e);
    throw e;
  }
}
