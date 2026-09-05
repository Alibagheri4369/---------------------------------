import { Project } from '../types';
import { generateProjectRoadmap } from '../data/universalLifecycle';

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  progressPercent: number;
  activePhaseTotal: number;
  activePhaseDone: number;
  activePhasePercent: number;
  phaseProgress: { phaseId: number; phaseTitle: string; percent: number; done: number; total: number }[];
}

export interface OverallUserStats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overallProgress: number;
  activeProjectsCount: number;
  completedProjectsCount: number;
  typeDistribution: { type: string; count: number }[];
}

/**
 * Calculate dynamic statistics for a single project strictly derived from real data
 */
export function calculateProjectStats(project: Project | null): ProjectStats {
  if (!project) {
    return {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      progressPercent: 0,
      activePhaseTotal: 0,
      activePhaseDone: 0,
      activePhasePercent: 0,
      phaseProgress: [],
    };
  }

  const roadmap = generateProjectRoadmap(project);
  let totalTasks = 0;
  let completedTasks = 0;

  const phaseProgress = roadmap.map((phase) => {
    let pTotal = 0;
    let pDone = 0;

    phase.groups.forEach((g) => {
      g.tasks.forEach((t) => {
        pTotal++;
        if (project.completedTasks[t.id]) {
          pDone++;
        }
      });
    });

    // Count custom tasks in this phase
    const customList = project.customTasks[phase.id] || [];
    customList.forEach((ct) => {
      pTotal++;
      if (ct.isDone) {
        pDone++;
      }
    });

    totalTasks += pTotal;
    completedTasks += pDone;

    const percent = pTotal > 0 ? Math.round((pDone / pTotal) * 100) : 0;
    return {
      phaseId: phase.id,
      phaseTitle: phase.title,
      percent,
      done: pDone,
      total: pTotal,
    };
  });

  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const pendingTasks = Math.max(0, totalTasks - completedTasks);

  // Active phase stats
  const activePhaseStats = phaseProgress.find((p) => p.phaseId === project.currentPhaseId) || {
    done: 0,
    total: 0,
    percent: 0,
  };

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    progressPercent,
    activePhaseTotal: activePhaseStats.total,
    activePhaseDone: activePhaseStats.done,
    activePhasePercent: activePhaseStats.percent,
    phaseProgress,
  };
}

/**
 * Calculate overall stats across all user-owned projects
 */
export function calculateUserOverallStats(projects: Project[]): OverallUserStats {
  if (!projects || projects.length === 0) {
    return {
      totalProjects: 0,
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      overallProgress: 0,
      activeProjectsCount: 0,
      completedProjectsCount: 0,
      typeDistribution: [],
    };
  }

  let totalTasks = 0;
  let completedTasks = 0;
  let completedProjectsCount = 0;
  const typeMap: Record<string, number> = {};

  projects.forEach((proj) => {
    const stats = calculateProjectStats(proj);
    totalTasks += stats.totalTasks;
    completedTasks += stats.completedTasks;

    if (stats.progressPercent === 100 && stats.totalTasks > 0) {
      completedProjectsCount++;
    }

    const pType = proj.projectType || 'سفارشی';
    typeMap[pType] = (typeMap[pType] || 0) + 1;
  });

  const pendingTasks = Math.max(0, totalTasks - completedTasks);
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const typeDistribution = Object.entries(typeMap).map(([type, count]) => ({
    type,
    count,
  }));

  return {
    totalProjects: projects.length,
    totalTasks,
    completedTasks,
    pendingTasks,
    overallProgress,
    activeProjectsCount: projects.length - completedProjectsCount,
    completedProjectsCount,
    typeDistribution,
  };
}
