import { useState, useEffect, useCallback, useRef } from 'react';
import { Project, User, CustomTask, TechStackConfig, BusinessModel, ProjectComplexity } from '../types';
import {
  fetchUserProjects,
  createProject as apiCreateProject,
  updateProject as apiUpdateProject,
  deleteProject as apiDeleteProject,
} from '../services/projectService';
import { logActivity } from '../services/activityService';
import { addNotification } from '../services/notificationService';
import { TECH_PRESETS } from '../data/techStackPresets';

export function useProjects(currentUser: User | null) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const lastFailedOperationRef = useRef<(() => Promise<void>) | null>(null);

  // Load user's projects whenever currentUser changes
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!currentUser) {
        setProjects([]);
        setActiveProjectId(null);
        return;
      }

      setLoading(true);
      try {
        const userProjects = await fetchUserProjects(currentUser.id);
        if (isMounted) {
          setProjects(userProjects);
          if (userProjects.length > 0) {
            setActiveProjectId((prev) => {
              // If previous selected id is in the new user's projects, keep it
              if (prev && userProjects.some((p) => p.id === prev)) {
                return prev;
              }
              return userProjects[0].id;
            });
          } else {
            setActiveProjectId(null);
          }
        }
      } catch (err: any) {
        console.error('Failed to load user projects', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [currentUser?.id]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || null;

  // Execute a persistence mutation with saving and error handling
  const runMutation = useCallback(
    async (mutationFn: () => Promise<void>) => {
      setSaving(true);
      setSaveError(null);
      lastFailedOperationRef.current = null;
      try {
        await mutationFn();
      } catch (err: any) {
        console.error('Database mutation error:', err);
        setSaveError('خطا در ذخیره‌سازی داده‌ها. لطفاً اتصال اینترنت یا Supabase را بررسی کنید.');
        lastFailedOperationRef.current = mutationFn;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const retryLastSave = useCallback(async () => {
    if (lastFailedOperationRef.current) {
      await runMutation(lastFailedOperationRef.current);
    }
  }, [runMutation]);

  // Create Project
  const createNewProject = useCallback(
    async (
      title: string,
      clientName: string,
      projectType: string,
      budget?: string,
      deadline?: string,
      options?: {
        projectTypes?: string[];
        selectedModules?: string[];
        businessModel?: BusinessModel;
        complexity?: ProjectComplexity;
        techStack?: TechStackConfig;
      }
    ) => {
      if (!currentUser) {
        throw new Error('برای ایجاد پروژه ابتدا وارد حساب کاربری خود شوید.');
      }

      const newProject: Project = {
        id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: currentUser.id,
        title,
        clientName,
        projectType,
        projectTypes: options?.projectTypes || [projectType],
        selectedModules: options?.selectedModules || ['auth_otp', 'user_dashboard', 'admin_panel', 'seo_engine'],
        businessModel: options?.businessModel || 'B2C',
        complexity: options?.complexity || 'Medium',
        techStack: options?.techStack || TECH_PRESETS[0].stack,
        userRoles: ['Super Admin', 'Customer'],
        budget,
        deadline,
        currentPhaseId: 0,
        completedTasks: {},
        customTasks: {},
        phaseNotes: {},
        services: [],
        ownerships: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await runMutation(async () => {
        const created = await apiCreateProject(currentUser.id, newProject);
        setProjects((prev) => [created, ...prev.filter((p) => p.id !== created.id)]);
        setActiveProjectId(created.id);

        // Record activity & notification
        await logActivity(
          currentUser.id,
          'ایجاد پروژه',
          `پروژه جدید «${created.title}» برای کارفرما «${created.clientName}» ثبت شد.`,
          created.id
        );
        await addNotification(
          currentUser.id,
          'پروژه جدید ایجاد شد',
          `پروژه «${created.title}» با موفقیت به پایگاه داده اضافه شد.`,
          'success'
        );
      });

      return newProject;
    },
    [currentUser, runMutation]
  );

  // Update Project
  const modifyProject = useCallback(
    async (projectId: string, updates: Partial<Project>) => {
      if (!currentUser) return;

      // Optimistic local state update
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
      );

      await runMutation(async () => {
        await apiUpdateProject(currentUser.id, projectId, updates);
      });
    },
    [currentUser, runMutation]
  );

  // Delete Project
  const removeProject = useCallback(
    async (projectId: string) => {
      if (!currentUser) return;

      await runMutation(async () => {
        await apiDeleteProject(currentUser.id, projectId);
        setProjects((prev) => {
          const filtered = prev.filter((p) => p.id !== projectId);
          if (activeProjectId === projectId) {
            setActiveProjectId(filtered.length > 0 ? filtered[0].id : null);
          }
          return filtered;
        });

        await logActivity(currentUser.id, 'حذف پروژه', `پروژه با شناسه ${projectId} حذف شد.`);
      });
    },
    [currentUser, activeProjectId, runMutation]
  );

  // Toggle checklist task
  const toggleTask = useCallback(
    async (taskId: string) => {
      if (!activeProject || !currentUser) return;

      const currentVal = Boolean(activeProject.completedTasks[taskId]);
      const updatedTasks = {
        ...activeProject.completedTasks,
        [taskId]: !currentVal,
      };

      await modifyProject(activeProject.id, {
        completedTasks: updatedTasks,
      });

      // Log progress activity if completing task
      if (!currentVal) {
        logActivity(
          currentUser.id,
          'تکمیل تسک',
          `تسک [${taskId}] در پروژه «${activeProject.title}» تکمیل شد.`,
          activeProject.id
        );
      }
    },
    [activeProject, currentUser, modifyProject]
  );

  // Add custom task
  const addCustomTask = useCallback(
    async (phaseId: number, text: string) => {
      if (!activeProject || !currentUser) return;

      const list = activeProject.customTasks[phaseId] || [];
      const newTask: CustomTask = {
        id: `ct_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        text,
        isDone: false,
        createdAt: new Date().toISOString(),
        phaseId,
      };

      await modifyProject(activeProject.id, {
        customTasks: {
          ...activeProject.customTasks,
          [phaseId]: [...list, newTask],
        },
      });
    },
    [activeProject, currentUser, modifyProject]
  );

  // Toggle custom task
  const toggleCustomTask = useCallback(
    async (phaseId: number, customTaskId: string) => {
      if (!activeProject || !currentUser) return;

      const list = activeProject.customTasks[phaseId] || [];
      const updatedList = list.map((ct) =>
        ct.id === customTaskId ? { ...ct, isDone: !ct.isDone } : ct
      );

      await modifyProject(activeProject.id, {
        customTasks: {
          ...activeProject.customTasks,
          [phaseId]: updatedList,
        },
      });
    },
    [activeProject, currentUser, modifyProject]
  );

  // Delete custom task
  const deleteCustomTask = useCallback(
    async (phaseId: number, customTaskId: string) => {
      if (!activeProject || !currentUser) return;

      const list = activeProject.customTasks[phaseId] || [];
      await modifyProject(activeProject.id, {
        customTasks: {
          ...activeProject.customTasks,
          [phaseId]: list.filter((ct) => ct.id !== customTaskId),
        },
      });
    },
    [activeProject, currentUser, modifyProject]
  );

  // Update phase note
  const updatePhaseNote = useCallback(
    async (phaseId: number, note: string) => {
      if (!activeProject || !currentUser) return;

      await modifyProject(activeProject.id, {
        phaseNotes: {
          ...activeProject.phaseNotes,
          [phaseId]: note,
        },
      });
    },
    [activeProject, currentUser, modifyProject]
  );

  // Set current active phase
  const setCurrentPhase = useCallback(
    async (phaseId: number) => {
      if (!activeProject || !currentUser) return;

      await modifyProject(activeProject.id, {
        currentPhaseId: phaseId,
      });

      logActivity(
        currentUser.id,
        'تغییر فاز فعال',
        `فاز جاری پروژه «${activeProject.title}» به فاز ${phaseId} تغییر یافت.`,
        activeProject.id
      );
    },
    [activeProject, currentUser, modifyProject]
  );

  return {
    projects,
    activeProject,
    activeProjectId,
    setActiveProjectId,
    loading,
    saving,
    saveError,
    retryLastSave,
    createNewProject,
    modifyProject,
    removeProject,
    toggleTask,
    addCustomTask,
    toggleCustomTask,
    deleteCustomTask,
    updatePhaseNote,
    setCurrentPhase,
  };
}
