import { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Layers, 
  CheckSquare, 
  Cpu, 
  Puzzle, 
  ShieldAlert, 
  ShieldCheck, 
  Calculator, 
  Bot, 
  FolderGit2, 
  Clock, 
  Calendar, 
  ChevronDown, 
  Plus, 
  FolderOpen, 
  User as UserIcon, 
  LogOut, 
  X, 
  ChevronLeft,
  Database,
  Menu,
  BookOpen,
  Settings,
  Info,
  Share2,
  Palette
} from 'lucide-react';
import { Project, User } from '../types';
import { formatLiveTime, getCurrentJalaliDate, toPersianDigits, getTehranDate } from '../utils/jalali';
import { ProfileSubSection } from './UserProfileView';
import { useI18n } from '../i18n/I18nProvider';

export type NavTabType = 
  | 'whereAmI'
  | 'roadmap' 
  | 'checklist' 
  | 'architecture' 
  | 'modules' 
  | 'qa_security' 
  | 'ownership' 
  | 'pricing' 
  | 'ai_assistant' 
  | 'templates'
  | 'profile';

interface NavbarProps {
  currentUser: User | null;
  currentProject: Project | null;
  allProjects: Project[];
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  onOpenAuthModal: (mode: 'login' | 'register' | 'profile') => void;
  onSelectProject: (projectId: string) => void;
  onOpenNewProjectModal: () => void;
  onOpenCloudSyncModal?: () => void;
  supabaseConnected?: boolean;
  onNavigateProfileSection?: (sub: ProfileSubSection) => void;
  onLogout?: () => void;
}

export function Navbar({
  currentUser,
  currentProject,
  allProjects,
  activeTab,
  setActiveTab,
  onOpenAuthModal,
  onSelectProject,
  onOpenNewProjectModal,
  onOpenCloudSyncModal,
  supabaseConnected = false,
  onNavigateProfileSection,
  onLogout,
}: NavbarProps) {
  // Live Tehran time and Jalali date
  const [liveTehranTime, setLiveTehranTime] = useState(() => 
    formatLiveTime(new Date(), true, true, true)
  );
  const [shortTehranTime, setShortTehranTime] = useState(() => 
    formatLiveTime(new Date(), true, false, true)
  );
  const [jalaliDate, setJalaliDate] = useState(() => getCurrentJalaliDate(new Date(), true));

  const { t } = useI18n();

  // Drawers and dropdowns
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProjectSheetOpen, setIsProjectSheetOpen] = useState(false);
  const [isDesktopProjectDropdownOpen, setIsDesktopProjectDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  // Update clock every second in Asia/Tehran
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLiveTehranTime(formatLiveTime(now, true, true, true));
      setShortTehranTime(formatLiveTime(now, true, false, true));
      setJalaliDate(getCurrentJalaliDate(now, true));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allNavItems: { id: NavTabType; label: string; icon: any; category: string; description: string }[] = [
    { id: 'whereAmI', label: t('whereAmI'), icon: Layers, category: t('primary'), description: t('whereAmIDescription') },
    { id: 'roadmap', label: t('roadmap'), icon: Compass, category: t('primary'), description: t('roadmapDescription') },
    { id: 'checklist', label: t('checklist'), icon: CheckSquare, category: t('primary'), description: t('checklistDescription') },
    { id: 'modules', label: t('modules'), icon: Puzzle, category: t('development'), description: t('modulesDescription') },
    { id: 'architecture', label: t('architecture'), icon: Cpu, category: t('development'), description: t('architectureDescription') },
    { id: 'qa_security', label: t('qaSecurity'), icon: ShieldAlert, category: t('quality'), description: t('qaSecurityDescription') },
    { id: 'ownership', label: t('ownership'), icon: ShieldCheck, category: t('quality'), description: t('ownershipDescription') },
    { id: 'pricing', label: t('pricing'), icon: Calculator, category: t('business'), description: t('pricingDescription') },
    { id: 'ai_assistant', label: t('aiAssistant'), icon: Bot, category: t('tools'), description: t('aiAssistantDescription') },
    { id: 'templates', label: t('templates'), icon: FolderGit2, category: t('tools'), description: t('templatesDescription') },
  ];

  const handleSelectTab = (tabId: NavTabType) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const handleOpenProfileSub = (sub: ProfileSubSection) => {
    if (onNavigateProfileSection) {
      onNavigateProfileSection(sub);
    }
    setActiveTab('profile');
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 backdrop-blur-md border-b transition-colors" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
        {/* =========================================================================
            1. DESKTOP TOP RIBBON (Jalali Date, Asia/Tehran Live Clock, Database & Auth)
            ========================================================================= */}
        <div className="hidden lg:block border-b px-4 py-1.5 text-xs transition-colors" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--muted-foreground)' }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Tehran Timezone & Jalali Date */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-200 text-xs font-medium">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{jalaliDate.formattedWithPersianDigits}</span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-amber-400 font-mono text-xs font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>{liveTehranTime}</span>
                <span className="text-[10px] text-slate-500 font-sans">(تهران)</span>
              </div>

              <span className="text-[11px] text-slate-400 pr-1">
                {t('appDescription')}
              </span>
            </div>

            {/* Quick Actions & DB Sync */}
            <div className="flex items-center gap-2">
              {onOpenCloudSyncModal && (
                <button
                  onClick={onOpenCloudSyncModal}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
                  title={t('cloudSync')}
                >
                  <Database className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-[11px] font-medium">Supabase</span>
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      supabaseConnected ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-amber-400'
                    }`}
                  />
                </button>
              )}

              {/* Authenticated Desktop User Menu */}
              {currentUser ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors cursor-pointer text-xs"
                  >
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-slate-950 shrink-0"
                      style={{ backgroundColor: currentUser.avatarColor || '#f59e0b' }}
                    >
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="font-semibold max-w-[120px] truncate">{currentUser.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-fade-in text-right">
                      <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                        <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">{currentUser.email}</div>
                      </div>

                      <button
                        onClick={() => handleOpenProfileSub('account')}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t('accountInfo')}</span>
                      </button>

                      <button
                        onClick={() => handleOpenProfileSub('settings')}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t('settings')}</span>
                      </button>

                      <button
                        onClick={() => handleOpenProfileSub('theme')}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Palette className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t('themeAppearance')}</span>
                      </button>

                      <button
                        onClick={() => handleOpenProfileSub('guide')}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t('productGuide')}</span>
                      </button>

                      <button
                        onClick={() => handleOpenProfileSub('about')}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Info className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t('about')}</span>
                      </button>

                      {onLogout && (
                        <div className="pt-1 mt-1 border-t border-slate-800">
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              onLogout();
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors cursor-pointer font-semibold"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>{t('logout')}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Guest Action: Only Login / Register */
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenAuthModal('login')}
                    className="px-3 py-1 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer font-medium"
                  >
                    {t('login')}
                  </button>
                  <button
                    onClick={() => onOpenAuthModal('register')}
                    className="px-3.5 py-1 text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer shadow-sm shadow-amber-400/20"
                  >
                    {t('register')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. DESKTOP MAIN NAVIGATION BAR
            ========================================================================= */}
        <div className="hidden lg:block max-w-7xl mx-auto px-4 py-2.5">
          <div className="flex items-center justify-between gap-4">
            {/* Brand Logo & Project Selector */}
            <div className="flex items-center gap-3 shrink-0">
              <div 
                onClick={() => handleSelectTab('whereAmI')}
                className="flex items-center gap-2.5 cursor-pointer select-none"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-400/25 shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                    <span>{t('appName')}</span>
                    <span className="text-[9px] font-bold bg-amber-400/15 text-amber-400 px-1.5 py-0.5 rounded border border-amber-400/30">
                      ۲۵ فاز
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {t('appDescription')}
                  </div>
                </div>
              </div>

              {/* Desktop Project Selector Dropdown */}
              <div className="relative mr-2">
                <button
                  onClick={() => {
                    if (allProjects.length === 0) {
                      onOpenNewProjectModal();
                    } else {
                      setIsDesktopProjectDropdownOpen(!isDesktopProjectDropdownOpen);
                    }
                  }}
                  className="flex items-center gap-2 bg-slate-950 hover:bg-slate-850 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-200 transition-colors cursor-pointer min-h-[38px]"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      currentProject ? 'bg-amber-400 shadow-sm shadow-amber-400/50' : 'bg-slate-600'
                    }`}
                  />
                  <span className="font-semibold max-w-[180px] truncate text-xs">
                    {currentProject ? currentProject.title : '+ تعریف اولین پروژه'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {isDesktopProjectDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-fade-in text-right">
                    <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-white">پروژه‌های فعال شما</span>
                      <button
                        onClick={() => {
                          setIsDesktopProjectDropdownOpen(false);
                          onOpenNewProjectModal();
                        }}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>پروژه جدید</span>
                      </button>
                    </div>

                    <div className="max-h-60 overflow-y-auto scrollbar-thin py-1 space-y-1">
                      {allProjects.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">
                          هیچ پروژه‌ای تعریف نشده است.
                        </div>
                      ) : (
                        allProjects.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              onSelectProject(p.id);
                              setIsDesktopProjectDropdownOpen(false);
                            }}
                            className={`w-full text-right px-3 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                              currentProject && p.id === currentProject.id
                                ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30 font-bold'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            <div className="truncate pl-2">
                              <div className="text-xs truncate">{p.title}</div>
                              <div className="text-[10px] text-slate-400 truncate">{p.clientName}</div>
                            </div>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono shrink-0">
                              فاز {toPersianDigits(p.currentPhaseId)}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
              {allNavItems.slice(0, 6).map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-850'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Profile & Guide Link in Desktop Nav */}
              <button
                onClick={() => handleSelectTab('profile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850'
                }`}
              >
                <UserIcon className={`w-3.5 h-3.5 ${activeTab === 'profile' ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{t('profile')}</span>
              </button>
            </nav>
          </div>
        </div>

        {/* =========================================================================
            3. NEW MASTER MOBILE HEADER: [☰]   EDX CRM WEB FOV   [Avatar / Login]
               Clear, Uncluttered, with live Tehran time in Persian digits
            ========================================================================= */}
        <div className="lg:hidden px-3 py-2.5 flex items-center justify-between gap-2 border-b border-slate-800/80 bg-slate-950">
          {/* Left / Menu Button [☰] */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white active:scale-95 transition-all cursor-pointer min-h-[42px] min-w-[42px] flex items-center justify-center"
              aria-label={t('mainMenu')}
            >
              <Menu className="w-5 h-5 text-amber-400" />
            </button>

            {/* Mobile Project Selector */}
            <button
              onClick={() => (allProjects.length > 0 ? setIsProjectSheetOpen(true) : onOpenNewProjectModal())}
              className="flex items-center gap-1.5 bg-slate-900 px-2 py-1.5 rounded-xl border border-slate-800 text-slate-200 text-xs max-w-[130px] sm:max-w-[180px] min-h-[42px] cursor-pointer"
            >
              <div
                className={`w-2 h-2 rounded-full shrink-0 ${
                  currentProject ? 'bg-amber-400' : 'bg-slate-600'
                }`}
              />
              <span className="truncate text-[11px] font-semibold">
                {currentProject ? currentProject.title : '+ پروژه'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>
          </div>

          {/* Center / Brand & Persian Live Time in Tehran */}
          <div className="text-center shrink-0">
            <div 
              onClick={() => handleSelectTab('whereAmI')}
              className="text-xs sm:text-sm font-black text-white tracking-tight cursor-pointer flex items-center justify-center gap-1"
            >
              <span>{t('appName')}</span>
            </div>
            {/* Clear, readable live Tehran time in Persian Digits */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-amber-400 font-medium mt-0.5">
              <span className="font-mono font-bold tracking-wider">{shortTehranTime}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 text-[10px]">{jalaliDate.shortFormatted}</span>
            </div>
          </div>

          {/* Right / Avatar (if logged in) or Login Button (if guest) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {currentUser ? (
              <button
                onClick={() => handleOpenProfileSub('account')}
                className="flex items-center gap-1.5 p-1 sm:px-2 rounded-xl bg-slate-900 border border-slate-800 text-white min-h-[42px] cursor-pointer active:scale-95 transition-all"
                aria-label="profile"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-slate-950 shrink-0 shadow-sm"
                  style={{ backgroundColor: currentUser.avatarColor || '#f59e0b' }}
                >
                  {currentUser.name.slice(0, 1)}
                </div>
                <span className="hidden sm:inline text-xs font-bold max-w-[80px] truncate">
                  {currentUser.name}
                </span>
              </button>
            ) : (
              /* Public / Guest: Only clean Login / Register button */
              <button
                onClick={() => onOpenAuthModal('login')}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/20 transition-colors cursor-pointer min-h-[40px]"
              >
                {t('login')}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          4. MOBILE FULL DRAWER MENU (Triggered by [☰])
          ========================================================================= */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 pb-safe max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl text-right"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 font-black">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white">{t('mainMenu')} {t('appName')}</h2>
                  <p className="text-[10px] text-slate-400">{t('smartNavigation')}</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                aria-label="close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action: New Project */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenNewProjectModal();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('newProject')}</span>
            </button>

            {/* Tabs List */}
            <div className="space-y-1.5 max-h-[45vh] overflow-y-auto scrollbar-thin pr-0.5">
              {allNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-right transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-amber-400/10 border-amber-400 text-amber-400 font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="text-xs">{item.label}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">{item.description}</div>
                      </div>
                    </div>
                    {isActive ? (
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                    ) : (
                      <ChevronLeft className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Profile & Settings Sub-links */}
            <div className="pt-2 border-t border-slate-800 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 px-1 mb-1">
                {t('profileSection')}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleOpenProfileSub('account')}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2"
                >
                  <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('accountInfo')}</span>
                </button>

                <button
                  onClick={() => handleOpenProfileSub('settings')}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2"
                >
                  <Settings className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('settings')}</span>
                </button>

                <button
                  onClick={() => handleOpenProfileSub('theme')}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2"
                >
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('themeAppearance')}</span>
                </button>

                <button
                  onClick={() => handleOpenProfileSub('guide')}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('productGuide')}</span>
                </button>

                <button
                  onClick={() => handleOpenProfileSub('about')}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2"
                >
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('about')}</span>
                </button>

                <button
                  onClick={() => handleOpenProfileSub('socials')}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('socials')}</span>
                </button>
              </div>
            </div>

            {/* Logout: ONLY visible if currentUser is authenticated */}
            {currentUser && onLogout && (
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-red-800/60 bg-red-950/40 text-red-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          5. MOBILE PROJECT SWITCHER BOTTOM SHEET
          ========================================================================= */}
      {isProjectSheetOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end animate-fade-in"
          onClick={() => setIsProjectSheetOpen(false)}
        >
          <div 
            className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 pb-safe max-h-[80vh] overflow-y-auto space-y-4 shadow-2xl text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold">
                  <FolderOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">{t('selectProject')}</h2>
                  <p className="text-[10px] text-slate-400">{t('yourProjects')}: {toPersianDigits(allProjects.length)}</p>
                </div>
              </div>
              <button
                onClick={() => setIsProjectSheetOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin">
              {allProjects.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  {t('noProjects')}
                </div>
              ) : (
                allProjects.map((p) => {
                  const isSelected = Boolean(currentProject && p.id === currentProject.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectProject(p.id);
                        setIsProjectSheetOpen(false);
                      }}
                      className={`w-full text-right p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-400/10 border-amber-400 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="truncate pl-2">
                        <div className="text-xs font-bold text-white truncate">{p.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">کارفرما: {p.clientName}</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-mono">
                        فاز {toPersianDigits(p.currentPhaseId)}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            <button
              onClick={() => {
                setIsProjectSheetOpen(false);
                onOpenNewProjectModal();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('newProject')}</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. MOBILE BOTTOM NAVIGATION BAR (Thumb-Friendly, Fixed at Bottom)
          ========================================================================= */}
      <nav 
        aria-label="mobileMainNav"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 pb-safe shadow-[0_-8px_20px_rgba(0,0,0,0.5)]"
      >
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {[
            { id: 'whereAmI' as NavTabType, label: t('whereAmI'), icon: Layers },
            { id: 'roadmap' as NavTabType, label: t('roadmap'), icon: Compass },
            { id: 'checklist' as NavTabType, label: t('checklist'), icon: CheckSquare },
            { id: 'profile' as NavTabType, label: t('profile'), icon: UserIcon },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer min-h-[48px] select-none ${
                  isActive
                    ? 'text-amber-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-lg transition-transform ${isActive ? 'bg-amber-400/10 scale-110' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                </div>
                <span className="text-[10px] mt-0.5">{item.label}</span>
              </button>
            );
          })}

          {/* 5th slot: Hamburger drawer trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1 rounded-xl text-slate-400 hover:text-slate-200 cursor-pointer min-h-[48px] select-none"
          >
            <div className="p-1 rounded-lg">
              <Menu className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5">{t('menu')}</span>
          </button>
        </div>
      </nav>
    </>
  );
}