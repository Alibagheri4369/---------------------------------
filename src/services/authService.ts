import { User } from '../types';
import { getSupabaseClient, userPartitionStorage } from './supabaseClient';

const AUTH_STORAGE_KEY_SESSION_USER = 'app_current_auth_user_v3';

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Get active user from Supabase or active authenticated session
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.user) {
        return null;
      }
      const su = session.user;
      return {
        id: su.id,
        name: su.user_metadata?.name || su.email?.split('@')[0] || 'دولوپر',
        email: su.email || '',
        role: su.user_metadata?.role || 'Full-Stack Developer',
        avatarColor: su.user_metadata?.avatarColor || '#06b6d4',
        createdAt: su.created_at,
      };
    } catch (e) {
      console.error('Error fetching Supabase session user', e);
    }
  }

  // Fallback to local authenticated session
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY_SESSION_USER);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Register a new developer account
 */
export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: string = 'Full-Stack Developer'
): Promise<AuthResponse> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            avatarColor: '#06b6d4',
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const user: User = {
          id: data.user.id,
          name,
          email,
          role,
          avatarColor: '#06b6d4',
          createdAt: data.user.created_at || new Date().toISOString(),
        };

        // Try syncing profile to user_profiles table
        try {
          await supabase.from('user_profiles').upsert({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar_color: user.avatarColor,
            updated_at: new Date().toISOString(),
          });
        } catch {
          // ignore if table not created yet
        }

        localStorage.setItem(AUTH_STORAGE_KEY_SESSION_USER, JSON.stringify(user));
        return { success: true, user };
      }
    } catch (err: any) {
      return { success: false, error: err?.message || 'خطا در ثبت‌نام با Supabase' };
    }
  }

  // Local user partition storage
  const userRegistry: Record<string, { user: User; pass: string }> = 
    JSON.parse(localStorage.getItem('app_user_accounts_registry') || '{}');

  const normalizedEmail = email.toLowerCase().trim();
  if (userRegistry[normalizedEmail]) {
    return { success: false, error: 'این ایمیل قبلاً ثبت‌نام شده است.' };
  }

  const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newUser: User = {
    id: userId,
    name,
    email: normalizedEmail,
    role,
    avatarColor: '#06b6d4',
    createdAt: new Date().toISOString(),
  };

  userRegistry[normalizedEmail] = { user: newUser, pass: password };
  localStorage.setItem('app_user_accounts_registry', JSON.stringify(userRegistry));
  localStorage.setItem(AUTH_STORAGE_KEY_SESSION_USER, JSON.stringify(newUser));

  return { success: true, user: newUser };
}

/**
 * Sign in existing user
 */
export async function loginUser(email: string, pass: string): Promise<AuthResponse> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const user: User = {
          id: data.user.id,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'دولوپر',
          email: data.user.email || email,
          role: data.user.user_metadata?.role || 'Full-Stack Developer',
          avatarColor: data.user.user_metadata?.avatarColor || '#06b6d4',
          createdAt: data.user.created_at,
        };

        localStorage.setItem(AUTH_STORAGE_KEY_SESSION_USER, JSON.stringify(user));
        return { success: true, user };
      }
    } catch (err: any) {
      return { success: false, error: err?.message || 'خطا در ورود' };
    }
  }

  // Local user partition verification
  const normalizedEmail = email.toLowerCase().trim();
  const userRegistry: Record<string, { user: User; pass: string }> = 
    JSON.parse(localStorage.getItem('app_user_accounts_registry') || '{}');

  const account = userRegistry[normalizedEmail];
  if (!account) {
    return { success: false, error: 'حسابی با این مشخصات یافت نشد. لطفاً ابتدا ثبت‌نام کنید.' };
  }

  if (account.pass !== pass) {
    return { success: false, error: 'رمز عبور وارد شده نادرست است.' };
  }

  localStorage.setItem(AUTH_STORAGE_KEY_SESSION_USER, JSON.stringify(account.user));
  return { success: true, user: account.user };
}

/**
 * Sign out and clear active session
 */
export async function logoutUser(): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Error signing out from Supabase', e);
    }
  }
  localStorage.removeItem(AUTH_STORAGE_KEY_SESSION_USER);
}

/**
 * Update current user profile
 */
export async function updateUserProfile(
  userId: string,
  name: string,
  role: string,
  newPassword?: string
): Promise<User | null> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const updates: any = { data: { name, role } };
      if (newPassword) updates.password = newPassword;

      const { data, error } = await supabase.auth.updateUser(updates);
      if (!error && data.user) {
        const updated: User = {
          id: data.user.id,
          name,
          email: data.user.email || '',
          role,
          avatarColor: data.user.user_metadata?.avatarColor || '#06b6d4',
          createdAt: data.user.created_at,
        };
        localStorage.setItem(AUTH_STORAGE_KEY_SESSION_USER, JSON.stringify(updated));
        return updated;
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Local fallback
  const raw = localStorage.getItem(AUTH_STORAGE_KEY_SESSION_USER);
  if (raw) {
    const u: User = JSON.parse(raw);
    const updated: User = { ...u, name, role };
    localStorage.setItem(AUTH_STORAGE_KEY_SESSION_USER, JSON.stringify(updated));

    // Update in registry
    const reg = JSON.parse(localStorage.getItem('app_user_accounts_registry') || '{}');
    if (reg[u.email.toLowerCase()]) {
      reg[u.email.toLowerCase()].user = updated;
      if (newPassword) reg[u.email.toLowerCase()].pass = newPassword;
      localStorage.setItem('app_user_accounts_registry', JSON.stringify(reg));
    }
    return updated;
  }
  return null;
}
