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
 * Fetch all projects belonging exclusively to the authenticated user
 */
export async function fetchUserProjects(userId: string): Promise<Project[]> {
  if (!userId) return [];

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const loadedProjects = data.map(mapDbRecordToProject);
        // Cache to user partition
        userPartitionStorage.setItem(userId, 'projects', loadedProjects);
        return loadedProjects;
      }
      if (error) {
        console.warn('Supabase fetch projects error:', error.message);
      }
    } catch (e) {
      console.error('Error fetching projects from Supabase', e);
    }
  }

  // Load from isolated user partition storage
  return userPartitionStorage.getItem<Project[]>(userId, 'projects', []);
}

/**
 * Create a new user-owned project
 */
export async function createProject(userId: string, newProject: Project): Promise<Project> {
  const projectWithOwner: Project = {
    ...newProject,
    userId,
    updatedAt: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const dbPayload = mapProjectToDbRecord(projectWithOwner, userId);
      dbPayload.created_at = projectWithOwner.createdAt;
      
      const { error } = await supabase.from('projects').insert(dbPayload);
      if (error) {
        console.warn('Supabase create project error:', error.message);
      }
    } catch (e) {
      console.error('Error saving project to Supabase', e);
    }
  }

  // Update isolated user storage partition
  const currentList = userPartitionStorage.getItem<Project[]>(userId, 'projects', []);
  const updatedList = [projectWithOwner, ...currentList.filter((p) => p.id !== projectWithOwner.id)];
  userPartitionStorage.setItem(userId, 'projects', updatedList);

  return projectWithOwner;
}

/**
 * Update an existing project
 */
export async function updateProject(
  userId: string,
  projectId: string,
  updates: Partial<Project>
): Promise<Project | null> {
  const currentList = userPartitionStorage.getItem<Project[]>(userId, 'projects', []);
  const target = currentList.find((p) => p.id === projectId);
  if (!target) return null;

  const updatedProject: Project = {
    ...target,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const dbPayload = mapProjectToDbRecord(updatedProject, userId);
      const { error } = await supabase
        .from('projects')
        .update(dbPayload)
        .eq('id', projectId)
        .eq('user_id', userId);

      if (error) {
        console.warn('Supabase update project error:', error.message);
      }
    } catch (e) {
      console.error('Error updating project in Supabase', e);
    }
  }

  // Update user partition storage
  const newList = currentList.map((p) => (p.id === projectId ? updatedProject : p));
  userPartitionStorage.setItem(userId, 'projects', newList);

  return updatedProject;
}

/**
 * Delete a project
 */
export async function deleteProject(userId: string, projectId: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', userId);

      if (error) {
        console.warn('Supabase delete project error:', error.message);
      }
    } catch (e) {
      console.error('Error deleting project from Supabase', e);
    }
  }

  const currentList = userPartitionStorage.getItem<Project[]>(userId, 'projects', []);
  const filtered = currentList.filter((p) => p.id !== projectId);
  userPartitionStorage.setItem(userId, 'projects', filtered);
  return true;
}
