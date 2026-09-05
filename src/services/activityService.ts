import { Activity } from '../types';
import { getSupabaseClient, userPartitionStorage } from './supabaseClient';

export async function getUserActivities(userId: string, projectId?: string): Promise<Activity[]> {
  if (!userId) return [];

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      let query = supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(30);

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        return data.map((d) => ({
          id: d.id,
          userId: d.user_id,
          projectId: d.project_id,
          action: d.action,
          description: d.description,
          createdAt: d.created_at,
        }));
      }
    } catch (e) {
      console.error(e);
    }
  }

  const list = userPartitionStorage.getItem<Activity[]>(userId, 'activities', []);
  if (projectId) {
    return list.filter((a) => a.projectId === projectId);
  }
  return list;
}

export async function logActivity(
  userId: string,
  action: string,
  description: string,
  projectId?: string
): Promise<Activity> {
  const newActivity: Activity = {
    id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId,
    projectId,
    action,
    description,
    createdAt: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('user_activities').insert({
        id: newActivity.id,
        user_id: userId,
        project_id: projectId,
        action,
        description,
        created_at: newActivity.createdAt,
      });
    } catch (e) {
      console.error(e);
    }
  }

  const current = userPartitionStorage.getItem<Activity[]>(userId, 'activities', []);
  userPartitionStorage.setItem(userId, 'activities', [newActivity, ...current].slice(0, 50));
  return newActivity;
}
