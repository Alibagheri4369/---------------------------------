import { AppNotification } from '../types';
import { getSupabaseClient, userPartitionStorage } from './supabaseClient';

export async function getUserNotifications(userId: string): Promise<AppNotification[]> {
  if (!userId) return [];

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && Array.isArray(data)) {
        return data.map((d) => ({
          id: d.id,
          userId: d.user_id,
          title: d.title,
          message: d.message,
          type: d.type || 'info',
          read: d.read || false,
          createdAt: d.created_at,
        }));
      }
    } catch (e) {
      console.error(e);
    }
  }

  return userPartitionStorage.getItem<AppNotification[]>(userId, 'notifications', []);
}

export async function addNotification(
  userId: string,
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'alert' = 'info'
): Promise<AppNotification> {
  const notif: AppNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId,
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('user_notifications').insert({
        id: notif.id,
        user_id: userId,
        title,
        message,
        type,
        read: false,
        created_at: notif.createdAt,
      });
    } catch (e) {
      console.error(e);
    }
  }

  const current = userPartitionStorage.getItem<AppNotification[]>(userId, 'notifications', []);
  userPartitionStorage.setItem(userId, 'notifications', [notif, ...current].slice(0, 30));
  return notif;
}

export async function markNotificationAsRead(userId: string, notifId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase
        .from('user_notifications')
        .update({ read: true })
        .eq('id', notifId)
        .eq('user_id', userId);
    } catch (e) {
      console.error(e);
    }
  }

  const current = userPartitionStorage.getItem<AppNotification[]>(userId, 'notifications', []);
  const updated = current.map((n) => (n.id === notifId ? { ...n, read: true } : n));
  userPartitionStorage.setItem(userId, 'notifications', updated);
}

export async function clearAllNotifications(userId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase
        .from('user_notifications')
        .delete()
        .eq('user_id', userId);
    } catch (e) {
      console.error(e);
    }
  }
  userPartitionStorage.setItem(userId, 'notifications', []);
}
