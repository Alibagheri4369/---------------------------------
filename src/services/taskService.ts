import { CustomTask, Project } from '../types';
import { updateProject } from './projectService';

/**
 * Toggle a checklist task for a project
 */
export async function toggleChecklistTask(
  userId: string,
  project: Project,
  taskId: string
): Promise<Project | null> {
  const currentVal = Boolean(project.completedTasks[taskId]);
  const updatedCompletedTasks = {
    ...project.completedTasks,
    [taskId]: !currentVal,
  };

  return updateProject(userId, project.id, {
    completedTasks: updatedCompletedTasks,
  });
}

/**
 * Add a custom task to a phase
 */
export async function addCustomTask(
  userId: string,
  project: Project,
  phaseId: number,
  text: string
): Promise<Project | null> {
  const list = project.customTasks[phaseId] || [];
  const newTask: CustomTask = {
    id: `ct_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    text,
    isDone: false,
    createdAt: new Date().toISOString(),
    phaseId,
  };

  const updatedCustomTasks = {
    ...project.customTasks,
    [phaseId]: [...list, newTask],
  };

  return updateProject(userId, project.id, {
    customTasks: updatedCustomTasks,
  });
}

/**
 * Toggle a custom task's completion status
 */
export async function toggleCustomTask(
  userId: string,
  project: Project,
  phaseId: number,
  customTaskId: string
): Promise<Project | null> {
  const list = project.customTasks[phaseId] || [];
  const updatedList = list.map((ct) =>
    ct.id === customTaskId ? { ...ct, isDone: !ct.isDone } : ct
  );

  const updatedCustomTasks = {
    ...project.customTasks,
    [phaseId]: updatedList,
  };

  return updateProject(userId, project.id, {
    customTasks: updatedCustomTasks,
  });
}

/**
 * Delete a custom task from a phase
 */
export async function deleteCustomTask(
  userId: string,
  project: Project,
  phaseId: number,
  customTaskId: string
): Promise<Project | null> {
  const list = project.customTasks[phaseId] || [];
  const updatedList = list.filter((ct) => ct.id !== customTaskId);

  const updatedCustomTasks = {
    ...project.customTasks,
    [phaseId]: updatedList,
  };

  return updateProject(userId, project.id, {
    customTasks: updatedCustomTasks,
  });
}

/**
 * Update phase notes
 */
export async function updatePhaseNote(
  userId: string,
  project: Project,
  phaseId: number,
  note: string
): Promise<Project | null> {
  const updatedPhaseNotes = {
    ...project.phaseNotes,
    [phaseId]: note,
  };

  return updateProject(userId, project.id, {
    phaseNotes: updatedPhaseNotes,
  });
}
