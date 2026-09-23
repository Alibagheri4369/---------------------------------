import { User } from '../types';
import { getSupabaseClient } from './supabaseClient';
import { 
  checkRateLimit, 
  recordFailedAttempt, 
  clearRateLimit, 
  formatRemainingTime 
} from '../utils/rateLimiter';
import { clearCSRFToken } from '../utils/csrfProtection';
import { showRateLimitWarning } from '../utils/toast';

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export const DEFAULT_GUEST_USER: User = {
  id: 'guest_anonymous',
  name: 'کاربر مهمان',
  email: 'guest@local.app',
  role: 'Full-Stack Developer',
  avatarColor: '#06b6d4',
  createdAt: new Date().toISOString(),
};

/**
 * Get authenticated user from Supabase Auth or fallback to DEFAULT_GUEST_USER
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return DEFAULT_GUEST_USER;
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session?.user) {
      return DEFAULT_GUEST_USER;
    }

    const su = session.user;
    
    // Fetch user profile from database
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', su.id)
        .single();

      if (profile) {
        return {
          id: profile.id,
          name: profile.display_name,
          email: profile.email,
          role: profile.role,
          avatarColor: profile.avatar_color || '#06b6d4',
          createdAt: profile.created_at,
        };
      }
    } catch (profileError) {
      console.error('Failed to fetch user profile:', profileError);
    }

    // Fallback to auth metadata if profile not found
    return {
      id: su.id,
      name: su.user_metadata?.name || su.email?.split('@')[0] || 'Developer',
      email: su.email || '',
      role: su.user_metadata?.role || 'Full-Stack Developer',
      avatarColor: su.user_metadata?.avatarColor || '#06b6d4',
      createdAt: su.created_at,
    };
  } catch (e) {
    console.error('Error fetching authenticated user:', e);
    return null;
  }
}

/**
 * PRODUCTION-GRADE: Register a new developer account via Supabase Auth
 * Email verification will be sent automatically if enabled in Supabase
 * WITH RATE LIMITING to prevent abuse
 */
export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: string = 'Full-Stack Developer'
): Promise<AuthResponse> {
  // بررسی Rate Limit
  const rateCheck = checkRateLimit(email);
  if (!rateCheck.allowed) {
    const timeRemaining = rateCheck.lockedUntil 
      ? formatRemainingTime(rateCheck.lockedUntil)
      : '';
    return {
      success: false,
      error: `تعداد تلاش‌های شما بیش از حد مجاز است. لطفاً ${timeRemaining} دیگر تلاش کنید.`
    };
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return { 
      success: false, 
      error: 'Supabase is not configured. Please configure Supabase connection in settings.' 
    };
  }

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
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      // ثبت تلاش ناموفق
      recordFailedAttempt(email);
      
      // Translate common Supabase auth errors
      if (error.message.includes('already registered')) {
        return { success: false, error: 'This email is already registered.' };
      }
      if (error.message.includes('password')) {
        return { success: false, error: 'Password must be at least 6 characters.' };
      }
      return { success: false, error: error.message };
    }

    if (data.user) {
      // پاک کردن Rate Limit در صورت موفقیت
      clearRateLimit(email);
      
      const user: User = {
        id: data.user.id,
        name,
        email,
        role,
        avatarColor: '#06b6d4',
        createdAt: data.user.created_at || new Date().toISOString(),
      };

      // Profile will be auto-created by database trigger
      // Return user but note that email verification may be required
      return { 
        success: true, 
        user,
        error: data.user.email_confirmed_at ? undefined : 'Please check your email to verify your account.'
      };
    }

    return { success: false, error: 'Registration failed. Please try again.' };
  } catch (err: any) {
    // ثبت تلاش ناموفق
    recordFailedAttempt(email);
    console.error('Registration error:', err);
    return { success: false, error: err?.message || 'Registration failed' };
  }
}

/**
 * PRODUCTION-GRADE: Sign in existing user via Supabase Auth ONLY
 * NO localStorage fallback - ONLY real authentication
 * WITH RATE LIMITING to prevent brute force attacks
 */
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  // بررسی Rate Limit
  const rateCheck = checkRateLimit(email);
  if (!rateCheck.allowed) {
    const timeRemaining = rateCheck.lockedUntil 
      ? formatRemainingTime(rateCheck.lockedUntil)
      : '';
    return {
      success: false,
      error: `تعداد تلاش‌های ورود بیش از حد مجاز است. حساب شما برای ${timeRemaining} مسدود شده است.`
    };
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return { 
      success: false, 
      error: 'Supabase is not configured. Please configure Supabase connection in settings.' 
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // ثبت تلاش ناموفق
      recordFailedAttempt(email);
      
      // بررسی تعداد تلاش‌های باقیمانده
      const remainingCheck = checkRateLimit(email);
      const warningMsg = remainingCheck.remainingAttempts > 0 && remainingCheck.remainingAttempts <= 2
        ? ` (${remainingCheck.remainingAttempts} تلاش باقی‌مانده)`
        : '';
      
      // نمایش هشدار اگر تلاش‌های کمی باقی‌مانده
      if (remainingCheck.remainingAttempts > 0 && remainingCheck.remainingAttempts <= 2) {
        showRateLimitWarning(remainingCheck.remainingAttempts);
      }
      
      // Translate common errors
      if (error.message.includes('Invalid login credentials')) {
        return { success: false, error: `ایمیل یا رمز عبور اشتباه است.${warningMsg}` };
      }
      if (error.message.includes('Email not confirmed')) {
        return { success: false, error: 'Please verify your email before logging in.' };
      }
      return { success: false, error: error.message + warningMsg };
    }

    if (data.user) {
      // پاک کردن Rate Limit در صورت موفقیت
      clearRateLimit(email);
      
      // Fetch user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const user: User = {
        id: data.user.id,
        name: profile?.display_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Developer',
        email: data.user.email || email,
        role: profile?.role || data.user.user_metadata?.role || 'Full-Stack Developer',
        avatarColor: profile?.avatar_color || data.user.user_metadata?.avatarColor || '#06b6d4',
        createdAt: profile?.created_at || data.user.created_at,
      };

      // Update last login
      await supabase
        .from('user_profiles')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', data.user.id);

      return { success: true, user };
    }

    return { success: false, error: 'Login failed. Please try again.' };
  } catch (err: any) {
    // ثبت تلاش ناموفق
    recordFailedAttempt(email);
    console.error('Login error:', err);
    return { success: false, error: err?.message || 'Login failed' };
  }
}

/**
 * PRODUCTION-GRADE: Sign out user (clear Supabase session ONLY)
 */
export async function logoutUser(): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.warn('Supabase not configured. Cannot sign out.');
    return;
  }

  try {
    await supabase.auth.signOut();
    // پاک کردن CSRF token
    clearCSRFToken();
  } catch (e) {
    console.error('Error signing out:', e);
  }
}

/**
 * PRODUCTION-GRADE: Update user profile in Supabase
 */
export async function updateUserProfile(
  userId: string,
  name: string,
  role: string,
  newPassword?: string
): Promise<User | null> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    console.error('Supabase not configured');
    return null;
  }

  try {
    // Update auth metadata
    const updates: any = { data: { name, role } };
    if (newPassword) {
      updates.password = newPassword;
    }

    const { data, error } = await supabase.auth.updateUser(updates);
    if (error) {
      console.error('Failed to update auth user:', error);
      return null;
    }

    // Update profile in database
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({
        display_name: name,
        role: role,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (profileError) {
      console.error('Failed to update user profile:', profileError);
    }

    if (data.user) {
      return {
        id: data.user.id,
        name,
        email: data.user.email || '',
        role,
        avatarColor: data.user.user_metadata?.avatarColor || '#06b6d4',
        createdAt: data.user.created_at,
      };
    }

    return null;
  } catch (e) {
    console.error('Error updating user profile:', e);
    return null;
  }
}

/**
 * PRODUCTION-GRADE: Send password reset email via Supabase
 */
export async function sendPasswordResetEmail(email: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { 
      success: false, 
      error: 'Supabase is not configured.' 
    };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Password reset error:', err);
    return { success: false, error: err?.message || 'Failed to send password reset email' };
  }
}

/**
 * PRODUCTION-GRADE: Resend email verification
 */
export async function resendVerificationEmail(): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { 
      success: false, 
      error: 'Supabase is not configured.' 
    };
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'No user session found' };
    }

    if (user.email_confirmed_at) {
      return { success: false, error: 'Email already verified' };
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email!,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Resend verification error:', err);
    return { success: false, error: err?.message || 'Failed to resend verification email' };
  }
}

/**
 * PRODUCTION-GRADE: Sign in with Google OAuth via Supabase
 */
export async function loginWithGoogle(): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { 
      success: false, 
      error: 'Supabase is not configured.' 
    };
  }

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // OAuth will redirect, so this won't return normally
    return { success: true };
  } catch (err: any) {
    console.error('Google login error:', err);
    return { success: false, error: err?.message || 'Failed to sign in with Google' };
  }
}

/**
 * PRODUCTION-GRADE: Secure delete user account
 * Calls Supabase Edge Function 'delete-account' (or deletes profile to trigger cascade)
 */
export async function deleteUserAccount(): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase is not configured' };
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return { success: false, error: 'No authenticated user session found' };
    }

    const userId = session.user.id;

    // 1. Try invoking Edge Function if deployed
    try {
      const { data, error: fnError } = await supabase.functions.invoke('delete-account', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!fnError && data?.success) {
        await logoutUser();
        return { success: true };
      }
    } catch (e) {
      console.warn('Edge Function delete-account fallback to direct user data deletion', e);
    }

    // 2. Cascade delete all user application data securely via RLS
    await supabase.from('projects').delete().eq('user_id', userId);
    await supabase.from('user_preferences').delete().eq('user_id', userId);
    await supabase.from('notifications').delete().eq('user_id', userId);
    await supabase.from('activities').delete().eq('user_id', userId);
    await supabase.from('user_profiles').delete().eq('id', userId);

    // 3. Complete signout and invalidate session
    await logoutUser();
    return { success: true };
  } catch (err: any) {
    console.error('Delete account error:', err);
    return { success: false, error: err?.message || 'Failed to delete account' };
  }
}
