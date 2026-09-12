import { Project } from '../types';
import { getSupabaseClient, userPartitionStorage } from './supabaseClient';

/**
 * Transform database record from snake_case to frontend Project interface
 */
function mapDbRecordToProject(row: any): Project {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    clientName: row.client_name,
    projectType: row.project_type,
    projectTypes: row.project_types || [row.project_type],
    businessModel: row.business_model || 'B2C',
    complexity: row.complexity || 'Medium',
    budget: row.budget || '',
    deadline: row.deadline || '',
    currentPhaseId: row.current_phase_id ?? 0,
    selectedModules: row.selected_modules || [],
    techStack: row.tech_stack || undefined,
    userRoles: row.user_roles || [],
    services: row.services || [],
    ownerships: row.ownerships || [],
    completedTasks: row.completed_tasks || {},
    customTasks: row.custom_tasks || {},
    phaseNotes: row.phase_notes || {},
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

/**
 * Transform frontend Project to database record with snake_case
 */
function mapProjectToDbRecord(project: Project, userId: string): any {
  return {
    id: project.id,
    user_id: userId,
    title: project.title,
    client_name: project.clientName,
    project_type: project.projectType,
    project_types: project.projectTypes || [project.projectType],
    business_model: project.businessModel,
    complexity: project.complexity,
    budget: project.budget,
    deadline: project.deadline,
    current_phase_id: project.currentPhaseId,
    selected_modules: project.selectedModules,
    tech_stack: project.techStack,
    user_roles: project.userRoles,
    services: project.services,
    ownerships: project.ownerships,
    completed_tasks: project.completedTasks,
    custom_tasks: project.customTasks,
    phase_notes: project.phaseNotes,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Fetch all projects belonging to the specified user (Supabase with partitioned LocalStorage fallback)
 */
export async function fetchUserProjects(userId: string): Promise<Project[]> {
  if (!userId) return [];

  // Local partitioned storage fallback for guests or when Supabase is unconfigured
  const getLocalProjects = () => userPartitionStorage.getItem<Project[]>(userId, 'user_projects', []);

  if (userId.startsWith('guest_')) {
    return getLocalProjects();
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return getLocalProjects();
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch projects failed, falling back to user storage:', error.message);
      return getLocalProjects();
    }

    if (!Array.isArray(data)) {
      return getLocalProjects();
    }

    const remoteProjects = data.map(mapDbRecordToProject);
    userPartitionStorage.setItem(userId, 'user_projects', remoteProjects);
    return remoteProjects;
  } catch (e: any) {
    console.warn('Error fetching projects from Supabase, using user storage:', e);
    return getLocalProjects();
  }
}

/**
 * Create a new user-owned project (Supabase with LocalStorage fallback)
 */
export async function createProject(userId: string, newProject: Project): Promise<Project> {
  const projectWithOwner: Project = {
    ...newProject,
    userId,
    updatedAt: new Date().toISOString(),
  };

  const saveLocal = (proj: Project) => {
    const existing = userPartitionStorage.getItem<Project[]>(userId, 'user_projects', []);
    const updatedList = [proj, ...existing.filter((p) => p.id !== proj.id)];
    userPartitionStorage.setItem(userId, 'user_projects', updatedList);
  };

  if (userId.startsWith('guest_')) {
    saveLocal(projectWithOwner);
    return projectWithOwner;
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    saveLocal(projectWithOwner);
    return projectWithOwner;
  }

  try {
    const dbPayload = mapProjectToDbRecord(projectWithOwner, userId);
    dbPayload.created_at = projectWithOwner.createdAt;

    const { error } = await supabase.from('projects').insert(dbPayload);

    if (error) {
      console.warn('Supabase create project failed, saving to user storage:', error.message);
      saveLocal(projectWithOwner);
      return projectWithOwner;
    }

    saveLocal(projectWithOwner);
    return projectWithOwner;
  } catch (e: any) {
    console.warn('Error saving project to Supabase, saving locally:', e);
    saveLocal(projectWithOwner);
    return projectWithOwner;
  }
}

/**
 * Update an existing project
 */
export async function updateProject(
  userId: string,
  projectId: string,
  updates: Partial<Project>
): Promise<Project | null> {
  const updateLocal = (): Project | null => {
    const existing = userPartitionStorage.getItem<Project[]>(userId, 'user_projects', []);
    const idx = existing.findIndex((p) => p.id === projectId);
    if (idx === -1) return null;
    const updated = { ...existing[idx], ...updates, updatedAt: new Date().toISOString() };
    existing[idx] = updated;
    userPartitionStorage.setItem(userId, 'user_projects', existing);
    return updated;
  };

  if (userId.startsWith('guest_')) {
    return updateLocal();
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return updateLocal();
  }

  try {
    const { data: currentData, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !currentData) {
      return updateLocal();
    }

    const currentProject = mapDbRecordToProject(currentData);
    const updatedProject: Project = {
      ...currentProject,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const dbPayload = mapProjectToDbRecord(updatedProject, userId);
    const { error } = await supabase
      .from('projects')
      .update(dbPayload)
      .eq('id', projectId)
      .eq('user_id', userId);

    if (error) {
      console.warn('Supabase update failed, updating locally:', error.message);
      return updateLocal();
    }

    updateLocal();
    return updatedProject;
  } catch (e: any) {
    console.warn('Error updating project in Supabase, using local:', e);
    return updateLocal();
  }
}

/**
 * Delete a project
 */
export async function deleteProject(userId: string, projectId: string): Promise<boolean> {
  const deleteLocal = () => {
    const existing = userPartitionStorage.getItem<Project[]>(userId, 'user_projects', []);
    const filtered = existing.filter((p) => p.id !== projectId);
    userPartitionStorage.setItem(userId, 'user_projects', filtered);
    return true;
  };

  if (userId.startsWith('guest_')) {
    return deleteLocal();
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return deleteLocal();
  }

  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', userId);

    if (error) {
      console.warn('Supabase delete failed, removing locally:', error.message);
      deleteLocal();
      return true;
    }

    deleteLocal();
    return true;
  } catch (e: any) {
    console.warn('Error deleting project from Supabase, removing locally:', e);
    deleteLocal();
    return true;
  }
}

