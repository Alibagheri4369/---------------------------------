import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import {
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  updateUserProfile,
  deleteUserAccount,
  DEFAULT_GUEST_USER,
} from '../services/authService';
import { getSupabaseConfig, testSupabaseConnection } from '../services/supabaseClient';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState('');

  // Initial session restoration
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
        }

        // Test Supabase connectivity
        const config = getSupabaseConfig();
        if (config.isConfigured) {
          const testRes = await testSupabaseConnection();
          if (isMounted) {
            setSupabaseConnected(testRes.ok);
            setConnectionMessage(testRes.message);
          }
        } else {
          if (isMounted) {
            setSupabaseConnected(false);
            setConnectionMessage('پایگاه داده ابری Supabase هنوز متصل نشده است (آماده اتصال).');
          }
        }
      } catch (err) {
        console.error('Failed to initialize auth', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, pass: string) => {
    const res = await loginUser(email, pass);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  }, []);

  const register = useCallback(async (name: string, email: string, pass: string, role: string) => {
    const res = await registerUser(name, email, pass, role);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(DEFAULT_GUEST_USER);
  }, []);

  const updateProfile = useCallback(async (name: string, role: string, newPassword?: string) => {
    if (!user) return;
    const updated = await updateUserProfile(user.id, name, role, newPassword);
    if (updated) {
      setUser(updated);
    }
  }, [user]);

  const retestConnection = useCallback(async () => {
    const res = await testSupabaseConnection();
    setSupabaseConnected(res.ok);
    setConnectionMessage(res.message);
    return res;
  }, []);

  const removeAccount = useCallback(async () => {
    const res = await deleteUserAccount();
    if (res.success) {
      setUser(DEFAULT_GUEST_USER);
    }
    return res;
  }, []);

  return {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    removeAccount,
    retestConnection,
    supabaseConnected,
    connectionMessage,
  };
}
