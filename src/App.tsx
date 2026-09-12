import { useState, useEffect, lazy, Suspense } from 'react';
import { Navbar, NavTabType } from './components/Navbar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Loader2 } from 'lucide-react';

// Lazy load heavy components for better performance
const VisualRoadmap = lazy(() => import('./components/VisualRoadmap'));
const PhaseDetailView = lazy(() => import('./components/PhaseDetailView'));
const WhereAmIWidget = lazy(() => import('./components/WhereAmIWidget'));
const ArchitectureView = lazy(() => import('./components/ArchitectureView'));
const ModulesManagerView = lazy(() => import('./components/ModulesManagerView'));
const QASecurityView = lazy(() => import('./components/QASecurityView'));
const AIAssistantView = lazy(() => import('./components/AIAssistantView'));
const AccountOwnershipView = lazy(() => import('./components/AccountOwnershipView'));
const PricingView = lazy(() => import('./components/PricingView'));
const TemplatesView = lazy(() => import('./components/TemplatesView'));
const UserProfileView = lazy(() => import('./components/UserProfileView'));
const AuthModal = lazy(() => import('./components/AuthModal'));
const NewProjectModal = lazy(() => import('./components/NewProjectModal'));
const CloudSyncModal = lazy(() => import('./components/CloudSyncModal'));

// Import ProfileSubSection type
import type { ProfileSubSection } from './components/UserProfileView';
import { useAuth } from './hooks/useAuth';
import { useProjects } from './hooks/useProjects';
import { useSessionTimeout } from './hooks/useSessionTimeout';
import { getUserPreferences, saveUserPreferences, DEFAULT_PREFERENCES } from './services/preferenceService';
import { TechStackConfig, BusinessModel, ProjectComplexity, UserPreferences } from './types';
import { Cloud, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { I18nProvider } from './i18n/I18nProvider';
import { ThemeProvider } from './theme/ThemeProvider';
import { Toaster } from 'react-hot-toast';

export default function App() {
  // Real user authentication hook (Supabase Auth + fallback user session)
  const {
    user: currentUser,
    loading: authLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    supabaseConnected,
    connectionMessage,
    retestConnection,
  } = useAuth();

  // User-partitioned projects & persistence hook
  const {
    projects,
    activeProject: currentProject,
    activeProjectId,
    setActiveProjectId,
    loading: projectsLoading,
    saving: isSaving,
    saveError,
    retryLastSave,
    createNewProject,
    modifyProject,
    removeProject,
    toggleTask: handleToggleTask,
    addCustomTask: handleAddCustomTask,
    toggleCustomTask: handleToggleCustomTask,
    deleteCustomTask: handleDeleteCustomTask,
    updatePhaseNote: handleUpdatePhaseNote,
    setCurrentPhase: handleSetCurrentPhase,
  } = useProjects(currentUser);

  // Session timeout management (فقط برای کاربران واقعی)
  useSessionTimeout({
    timeout: 30 * 60 * 1000, // 30 minutes
    warningTime: 2 * 60 * 1000, // 2 minutes warning
    enabled: currentUser !== null && !currentUser.id.startsWith('guest_'),
    onTimeout: () => {
      handleLogout();
      setIsAuthModalOpen(false);
    },
  });

  // Selected phase for detail view (synced with currentProject)
  const [selectedPhaseId, setSelectedPhaseId] = useState<number>(() => currentProject?.currentPhaseId ?? 0);

  // Sync selected phase when project changes
  useEffect(() => {
    if (currentProject) {
      setSelectedPhaseId(currentProject.currentPhaseId);
    }
  }, [currentProject?.id]);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<NavTabType>('whereAmI');
  const [profileSubSection, setProfileSubSection] = useState<ProfileSubSection>('account');

  // User preferences persistence state
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => 
    currentUser ? { ...DEFAULT_PREFERENCES, userId: currentUser.id } : DEFAULT_PREFERENCES
  );

  // Load preferences when currentUser changes
  useEffect(() => {
    let isMounted = true;
    const loadPrefs = async () => {
      try {
        const prefs = await getUserPreferences(currentUser ? currentUser.id : undefined);
        if (isMounted && prefs) {
          setUserPreferences(prefs);
        }
      } catch (err) {
        console.warn('Failed to load user preferences:', err);
      }
    };
    loadPrefs();
    return () => {
      isMounted = false;
    };
  }, [currentUser?.id]);

  const handleUpdatePreferences = async (newPrefs: Partial<UserPreferences>): Promise<boolean> => {
    const updated = { ...userPreferences, ...newPrefs };
    setUserPreferences(updated);
    const success = await saveUserPreferences(newPrefs, currentUser ? currentUser.id : undefined);
    return success;
  };

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'profile'>('profile');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isCloudSyncModalOpen, setIsCloudSyncModalOpen] = useState(false);

  // Jump to phase detail
  const handleSelectPhase = (phaseId: number) => {
    setSelectedPhaseId(phaseId);
    setActiveTab('checklist');
  };

  // Update Tech Stack
  const handleUpdateTechStack = (techStack: TechStackConfig) => {
    if (!currentProject) return;
    modifyProject(currentProject.id, { techStack });
  };

  // Update Roles
  const handleUpdateRoles = (userRoles: string[]) => {
    if (!currentProject) return;
    modifyProject(currentProject.id, { userRoles });
  };

  // Toggle Module
  const handleToggleModule = (moduleId: string) => {
    if (!currentProject) return;
    const currentList = currentProject.selectedModules || [];
    const exists = currentList.includes(moduleId);
    const updated = exists ? currentList.filter((m) => m !== moduleId) : [...currentList, moduleId];
    modifyProject(currentProject.id, { selectedModules: updated });
  };

  // Set multiple modules at once
  const handleSetModules = (moduleIds: string[]) => {
    if (!currentProject) return;
    modifyProject(currentProject.id, { selectedModules: moduleIds });
  };

  // Update External Services
  const handleUpdateServices = (services: any[]) => {
    if (!currentProject) return;
    modifyProject(currentProject.id, { services });
  };

  // Update Ownership Handover Items
  const handleUpdateOwnerships = (ownerships: any[]) => {
    if (!currentProject) return;
    modifyProject(currentProject.id, { ownerships });
  };

  // Create new project with universal options
  const handleCreateProject = async (
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
    const created = await createNewProject(title, clientName, projectType, budget, deadline, options);
    setSelectedPhaseId(0);
    setActiveTab('whereAmI');
    setIsNewProjectModalOpen(false);
    return created;
  };

  const openAuth = (mode: 'login' | 'register' | 'profile') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // Loading fallback component for lazy-loaded components
  const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-sm text-slate-400">در حال بارگذاری...</p>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <ThemeProvider 
        initialThemeMode={userPreferences.themeMode} 
        initialColorTheme={userPreferences.colorTheme}
        userId={currentUser?.id}
      >
        <I18nProvider 
          initialLanguage={userPreferences.language}
          userId={currentUser?.id}
        >
          {/* Toast Notifications */}
          <Toaster
            position="bottom-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '14px',
                maxWidth: '420px',
                border: '1px solid #334155',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#f1f5f9',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#f1f5f9',
                },
              },
              loading: {
                iconTheme: {
                  primary: '#06b6d4',
                  secondary: '#f1f5f9',
                },
              },
            }}
          />
          
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Vazirmatn',system-ui,sans-serif]">
          {/* Top Main Navigation */}
          <Navbar
            currentUser={currentUser}
            currentProject={currentProject}
            allProjects={projects}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenAuthModal={openAuth}
            onSelectProject={(id) => {
              setActiveProjectId(id);
              const p = projects.find((x) => x.id === id);
              if (p) setSelectedPhaseId(p.currentPhaseId);
            }}
            onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
            onOpenCloudSyncModal={() => setIsCloudSyncModalOpen(true)}
            supabaseConnected={supabaseConnected}
            onNavigateProfileSection={(sub) => {
              setProfileSubSection(sub);
              setActiveTab('profile');
            }}
            onLogout={handleLogout}
          />

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 md:py-8 pb-24 lg:pb-8">
            <Suspense fallback={<LoadingFallback />}>
              {/* Tab 1: Where Am I? (GPS Universal Widget) */}
              {activeTab === 'whereAmI' && (
                <WhereAmIWidget
                  currentProject={currentProject}
                  onSelectPhase={handleSelectPhase}
                  onSetCurrentPhase={handleSetCurrentPhase}
                  onToggleTask={handleToggleTask}
                  onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
                />
              )}

              {/* Tab 2: Visual Roadmap (All 25 Universal Lifecycle Phases) */}
              {activeTab === 'roadmap' && (
                <VisualRoadmap
                  currentProject={currentProject}
                  onSelectPhase={handleSelectPhase}
                  onSetCurrentPhase={handleSetCurrentPhase}
                  onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
                />
              )}

              {/* Tab 3: Detailed Phase Checklist with Injected Modules */}
              {activeTab === 'checklist' && (
                <PhaseDetailView
                  phaseId={selectedPhaseId}
                  currentProject={currentProject}
                  onToggleTask={handleToggleTask}
                  onToggleCustomTask={handleToggleCustomTask}
                  onAddCustomTask={handleAddCustomTask}
                  onDeleteCustomTask={handleDeleteCustomTask}
                  onUpdatePhaseNote={handleUpdatePhaseNote}
                  onSelectPhase={(id) => setSelectedPhaseId(id)}
                  onSetCurrentPhase={handleSetCurrentPhase}
                  onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
                />
              )}

              {/* Tab 4: Interactive Architecture & Tech Stack Configurator */}
              {activeTab === 'architecture' && (
                <ArchitectureView
                  currentProject={currentProject}
                  onUpdateTechStack={handleUpdateTechStack}
                  onUpdateRoles={handleUpdateRoles}
                  onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
                />
              )}

              {/* Tab 5: 40+ Modules & Feature Manager */}
              {activeTab === 'modules' && (
                <ModulesManagerView
                  currentProject={currentProject}
                  onToggleModule={handleToggleModule}
                  onSetModules={handleSetModules}
                  onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
                />
              )}

              {/* Tab 6: Universal QA, OWASP Security, Performance & SEO Engine */}
              {activeTab === 'qa_security' && (
                <QASecurityView
                  currentProject={currentProject}
                  onToggleTask={handleToggleTask}
                  onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
                />
              )}

              {/* Tab 7: Account Ownership Matrix & Handover Guide */}
              {activeTab === 'ownership' && (
                <AccountOwnershipView
                  currentProject={currentProject}
                  onUpdateServices={handleUpdateServices}
                  onUpdateOwnerships={handleUpdateOwnerships}
                  onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
                />
              )}

              {/* Tab 8: 3-Tier Pricing Model Calculator & Proposal Generator */}
              {activeTab === 'pricing' && <PricingView currentProject={currentProject} />}

              {/* Tab 9: AI Technical Advisor & Dynamic Risk Analyzer */}
              {activeTab === 'ai_assistant' && (
                <AIAssistantView
                  currentProject={currentProject}
                  onNavigateToPhase={handleSelectPhase}
                  onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
                />
              )}

              {/* Tab 10: Master Checklist & Markdown Deliverables Templates */}
              {activeTab === 'templates' && <TemplatesView />}

              {/* Tab 11: Master Profile, Settings, Appearance, Product Guide & About */}
              {activeTab === 'profile' && (
                <UserProfileView
                  currentUser={currentUser}
                  projects={projects}
                  preferences={userPreferences}
                  onUpdatePreferences={handleUpdatePreferences}
                  onOpenEditProfile={() => openAuth('profile')}
                  onLogout={handleLogout}
                  onOpenAuthModal={openAuth}
                  initialSubSection={profileSubSection}
                />
              )}
            </Suspense>
          </main>

          {/* Persistence Feedback Toast: Saving or Error */}
          {isSaving && (
            <div className="fixed bottom-16 sm:bottom-6 left-6 z-40 bg-slate-900/95 border border-amber-400/50 shadow-2xl px-3.5 py-2.5 rounded-2xl text-xs text-amber-300 flex items-center gap-2.5 backdrop-blur-md animate-fade-in">
              <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>در حال همگام‌سازی ابری...</span>
            </div>
          )}

          {saveError && (
            <div className="fixed bottom-16 sm:bottom-6 left-6 z-40 bg-rose-950/95 border border-rose-500 shadow-2xl px-4 py-3 rounded-2xl text-xs text-rose-200 flex items-center gap-3 backdrop-blur-md animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{saveError}</span>
              <button
                onClick={retryLastSave}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-[11px] cursor-pointer"
              >
                تلاش مجدد
              </button>
            </div>
          )}

          {/* Footer */}
          <footer className="border-t border-slate-800 bg-slate-900/70 py-6 mb-safe pb-24 lg:pb-6 text-center text-xs text-slate-400">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-right">
                <span className="font-bold text-white">EDX CRM WEB FOV</span>
                <span>—</span>
                <span className="text-slate-400">سیستم مدیریت پروژه‌های وب و نرم‌افزار برای دولوپرها</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                <button
                  onClick={() => setIsCloudSyncModalOpen(true)}
                  className="hover:text-amber-400 flex items-center gap-1.5 cursor-pointer"
                >
                  <Cloud className="w-3.5 h-3.5 text-amber-400" />
                  <span>{supabaseConnected ? 'متصل به پایگاه داده Supabase' : 'پایگاه داده ایزوله'}</span>
                </button>
                <span>زمان رسمی: تهران (Asia/Tehran)</span>
                <span>تاریخ هجری شمسی</span>
              </div>
            </div>
          </footer>

          {/* Auth & Profile Modal */}
          <Suspense fallback={null}>
            <AuthModal
              isOpen={isAuthModalOpen}
              initialMode={authModalMode}
              currentUser={currentUser}
              onClose={() => setIsAuthModalOpen(false)}
              onLogin={async (email, pass) => {
                const result = await handleLogin(email, pass);
                return result;
              }}
              onRegister={async (name, email, pass, role) => {
                const result = await handleRegister(name, email, pass, role);
                return result;
              }}
              onUpdateProfile={async (name, role, newPass) => {
                await handleUpdateProfile(name, role, newPass);
                setIsAuthModalOpen(false);
              }}
              onLogout={() => {
                handleLogout();
                setIsAuthModalOpen(false);
              }}
            />
          </Suspense>

          {/* New Project Modal (80+ Types, Hybrid, Tech Presets) */}
          <Suspense fallback={null}>
            <NewProjectModal
              isOpen={isNewProjectModalOpen}
              onClose={() => setIsNewProjectModalOpen(false)}
              onCreateProject={handleCreateProject}
            />
          </Suspense>

          {/* Cloud Sync & Supabase Setup Modal */}
          <Suspense fallback={null}>
            <CloudSyncModal
              isOpen={isCloudSyncModalOpen}
              onClose={() => setIsCloudSyncModalOpen(false)}
              onConnectionChange={() => {
                retestConnection();
              }}
            />
          </Suspense>
        </div>
      </I18nProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
} 