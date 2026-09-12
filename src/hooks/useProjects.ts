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

  const effectiveUserId = currentUser ? currentUser.id : 'guest_anonymous';

  // Load user's projects whenever currentUser changes
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      try {
        const userProjects = await fetchUserProjects(effectiveUserId);
        if (isMounted) {
          setProjects(userProjects);
          if (userProjects.length > 0) {
            setActiveProjectId((prev) => {
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
  }, [effectiveUserId]);

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
      const userId = currentUser ? currentUser.id : 'guest_anonymous';

      const newProject: Project = {
        id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId,
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
        services: [
          {
            id: 'srv_domain_init',
            serviceName: 'ثبت و تنظیم دامنه (.ir / .com)',
            service: 'ثبت و تنظیم دامنه (.ir / .com)',
            serviceCategory: 'Domain',
            owner: 'Client',
            accessLevel: 'Full Control / DNS',
            accountEmail: 'owner@domain.ir',
            notes: 'انتقال مالکیت در ایرنیک یا پنل ثبت دامنه بین‌المللی',
            status: 'Pending Client',
          },
          {
            id: 'srv_host_init',
            serviceName: 'هاستینگ / سرور ابری پروداکشن',
            service: 'هاستینگ / سرور ابری پروداکشن',
            serviceCategory: 'Hosting / Cloud',
            owner: 'Client',
            accessLevel: 'SSH / Root Access',
            accountEmail: 'owner@domain.ir',
            notes: 'خریداری سرور توسط کارفرما و دعوت از توسعه‌دهنده به عنوان ادمین',
            status: 'Pending Client',
          },
          {
            id: 'srv_pay_init',
            serviceName: 'درگاه پرداخت مستقیم / واسط بانکی',
            service: 'درگاه پرداخت مستقیم / واسط بانکی',
            serviceCategory: 'Payment',
            owner: 'Client',
            accessLevel: 'Merchant Key / API Portal',
            accountEmail: 'owner@domain.ir',
            notes: 'احراز هویت مالیاتی و دریافت اینماد و مرچنت‌کد',
            status: 'Pending Client',
          },
          {
            id: 'srv_sms_init',
            serviceName: 'سامانه پیامک و اعتبار سنجی OTP',
            service: 'سامانه پیامک و اعتبار سنجی OTP',
            serviceCategory: 'SMS Gateway',
            owner: 'Client',
            accessLevel: 'API Key / Console',
            accountEmail: 'owner@domain.ir',
            notes: 'خرید پنل و دریافت خط خدماتی برای ارسال بدون بلک‌لیست',
            status: 'Pending Client',
          }
        ],
        ownerships: [
          {
            id: 'own_git_init',
            category: 'کد و گیت',
            item: 'انتقال سورس کامل ریپازیتوری',
            title: 'انتقال ریپازیتوری گیت‌هاب / گیت‌لب',
            status: 'Pending',
            deadline: '',
            notes: 'انتقال کامل سورس‌کد و تاریخچه کامیت‌ها به گیت‌هاب کارفرما',
          },
          {
            id: 'own_db_init',
            category: 'پایگاه داده',
            item: 'انتقال دیتابیس و اعتبارسنجی‌ها',
            title: 'پسوردهای روت و مستندات دیتابیس',
            status: 'Pending',
            deadline: '',
            notes: 'تغییر کامل کلیدهای محرمانه، رمزهای عبور و تحویل فایل پشتیبان اولیه',
          },
          {
            id: 'own_doc_init',
            category: 'مستندات',
            item: 'مستندات فنی و راهنمای API',
            title: 'مستندات Swagger / Postman و راهنما',
            status: 'Pending',
            deadline: '',
            notes: 'فایل نحوه دیپلوی، مستندات APIها و راهنمای ادمین سیستم',
          },
          {
            id: 'own_adm_init',
            category: 'پنل مدیریت',
            item: 'پنل ادمین ارشد (Super Admin)',
            title: 'اکانت ادمین ارشد نسخه پروداکشن',
            status: 'Pending',
            deadline: '',
            notes: 'تنظیم اولین ایمیل کارفرما به عنوان ادمین ارشد سیستم و تغییر پسورد اولیه',
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await runMutation(async () => {
        const created = await apiCreateProject(effectiveUserId, newProject);
        setProjects((prev) => [created, ...prev.filter((p) => p.id !== created.id)]);
        setActiveProjectId(created.id);

        // Record activity & notification
        await logActivity(
          effectiveUserId,
          'ایجاد پروژه',
          `پروژه جدید «${created.title}» برای کارفرما «${created.clientName}» ثبت شد.`,
          created.id
        );
        await addNotification(
          effectiveUserId,
          'پروژه جدید ایجاد شد',
          `پروژه «${created.title}» با موفقیت اضافه شد.`,
          'success'
        );
      });

      return newProject;
    },
    [effectiveUserId, runMutation]
  );

  // Update Project
  const modifyProject = useCallback(
    async (projectId: string, updates: Partial<Project>) => {
      // Optimistic local state update
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
      );

      await runMutation(async () => {
        await apiUpdateProject(effectiveUserId, projectId, updates);
      });
    },
    [effectiveUserId, runMutation]
  );

  // Delete Project
  const removeProject = useCallback(
    async (projectId: string) => {
      await runMutation(async () => {
        await apiDeleteProject(effectiveUserId, projectId);
        setProjects((prev) => {
          const filtered = prev.filter((p) => p.id !== projectId);
          if (activeProjectId === projectId) {
            setActiveProjectId(filtered.length > 0 ? filtered[0].id : null);
          }
          return filtered;
        });

        await logActivity(effectiveUserId, 'حذف پروژه', `پروژه با شناسه ${projectId} حذف شد.`);
      });
    },
    [effectiveUserId, activeProjectId, runMutation]
  );

  // Toggle checklist task
  const toggleTask = useCallback(
    async (taskId: string) => {
      if (!activeProject) return;

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
          effectiveUserId,
          'تکمیل تسک',
          `تسک [${taskId}] در پروژه «${activeProject.title}» تکمیل شد.`,
          activeProject.id
        );
      }
    },
    [activeProject, effectiveUserId, modifyProject]
  );

  // Add custom task
  const addCustomTask = useCallback(
    async (phaseId: number, text: string) => {
      if (!activeProject) return;

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
    [activeProject, modifyProject]
  );

  // Toggle custom task
  const toggleCustomTask = useCallback(
    async (phaseId: number, customTaskId: string) => {
      if (!activeProject) return;

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
    [activeProject, modifyProject]
  );

  // Delete custom task
  const deleteCustomTask = useCallback(
    async (phaseId: number, customTaskId: string) => {
      if (!activeProject) return;

      const list = activeProject.customTasks[phaseId] || [];
      await modifyProject(activeProject.id, {
        customTasks: {
          ...activeProject.customTasks,
          [phaseId]: list.filter((ct) => ct.id !== customTaskId),
        },
      });
    },
    [activeProject, modifyProject]
  );

  // Update phase note
  const updatePhaseNote = useCallback(
    async (phaseId: number, note: string) => {
      if (!activeProject) return;

      await modifyProject(activeProject.id, {
        phaseNotes: {
          ...activeProject.phaseNotes,
          [phaseId]: note,
        },
      });
    },
    [activeProject, modifyProject]
  );

  // Set current active phase
  const setCurrentPhase = useCallback(
    async (phaseId: number) => {
      if (!activeProject) return;

      await modifyProject(activeProject.id, {
        currentPhaseId: phaseId,
      });

      logActivity(
        effectiveUserId,
        'تغییر فاز فعال',
        `فاز جاری پروژه «${activeProject.title}» به فاز ${phaseId} تغییر یافت.`,
        activeProject.id
      );
    },
    [activeProject, effectiveUserId, modifyProject]
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
