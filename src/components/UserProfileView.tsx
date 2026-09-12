import { useState, useEffect, useTransition } from 'react';
import { 
  User as UserIcon, 
  Settings, 
  Palette, 
  BookOpen, 
  Info, 
  Share2, 
  LogOut, 
  Check, 
  ShieldCheck, 
  FolderGit2, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Send, 
  Instagram, 
  Copy, 
  Sparkles, 
  ChevronDown, 
  Search, 
  Laptop, 
  Moon, 
  Sun, 
  Monitor, 
  Save, 
  AlertCircle,
  HelpCircle,
  Briefcase,
  Calendar
} from 'lucide-react';
import { User, Project, UserPreferences, ThemeMode, ColorTheme, AppLanguage, DateFormatPreference, InterfaceDensity } from '../types';
import { PRODUCT_GUIDE_CHAPTERS, GuideChapter } from '../data/productGuideChapters';
import { getCurrentJalaliDate, toPersianDigits, getTehranDate } from '../utils/jalali';
import { useI18n } from '../i18n/I18nProvider';
// TEMPORARY DISABLED: import { useTheme } from '../theme/ThemeProvider';

export type ProfileSubSection = 'account' | 'settings' | 'theme' | 'guide' | 'about' | 'socials';

interface UserProfileViewProps {
  currentUser: User | null;
  projects: Project[];
  preferences: UserPreferences;
  onUpdatePreferences: (newPrefs: Partial<UserPreferences>) => Promise<boolean>;
  onOpenEditProfile: () => void;
  onLogout: () => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  initialSubSection?: ProfileSubSection;
}

export default function UserProfileView({
  currentUser,
  projects,
  preferences,
  onUpdatePreferences,
  onOpenEditProfile,
  onLogout,
  onOpenAuthModal,
  initialSubSection = 'account',
}: UserProfileViewProps) {
  const [activeSub, setActiveSub] = useState<ProfileSubSection>(initialSubSection);
  const [, startTransition] = useTransition();

  // استفاده از ThemeProvider برای مدیریت تم
  // TEMPORARY: Comment out useTheme to debug
  // const { themeMode: currentThemeMode, colorTheme: currentColorTheme, setThemeMode: setGlobalThemeMode, setColorTheme: setGlobalColorTheme } = useTheme();

  // Local draft states for settings
  const [themeMode, setThemeMode] = useState<ThemeMode>(preferences.themeMode);
  const [colorTheme, setColorTheme] = useState<ColorTheme>(preferences.colorTheme);
  const [draftLanguage, setDraftLanguage] = useState<AppLanguage>(preferences.language);
  const [timezone, setTimezone] = useState<string>(preferences.timezone || 'Asia/Tehran');
  const [dateFormat, setDateFormat] = useState<DateFormatPreference>(preferences.dateFormat);
  const [density, setDensity] = useState<InterfaceDensity>(preferences.density);

  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);

  const { t, setLanguage: setI18nLanguage } = useI18n();

  useEffect(() => {
    setI18nLanguage(draftLanguage);
  }, [draftLanguage, setI18nLanguage]);

  // Guide search & open chapter state
  const [guideSearch, setGuideSearch] = useState('');
  const [openChapterId, setOpenChapterId] = useState<string>('ch01');

  // Real statistics derived from actual user's projects
  const totalProjects = projects.length;
  const totalTasksCompleted = projects.reduce((acc, p) => {
    return acc + Object.keys(p.completedTasks || {}).length;
  }, 0);

  // Member date formatted with Jalali
  const memberJalali = currentUser?.createdAt 
    ? getCurrentJalaliDate(new Date(currentUser.createdAt))
    : getCurrentJalaliDate();

  const handleSaveSettings = async () => {
    setIsSavingPrefs(true);
    setSaveSuccess(false);
    
    // اعمال فوری تغییرات تم به ThemeProvider
    // TEMPORARY DISABLED: setGlobalThemeMode(themeMode);
    // TEMPORARY DISABLED: setGlobalColorTheme(colorTheme);
    
    const ok = await onUpdatePreferences({
      themeMode,
      colorTheme,
      language: draftLanguage,
      timezone,
      dateFormat,
      density,
    });
    setIsSavingPrefs(false);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHandle(label);
    setTimeout(() => setCopiedHandle(null), 2500);
  };

  const filteredGuideChapters = PRODUCT_GUIDE_CHAPTERS.filter((ch) => {
    if (!guideSearch.trim()) return true;
    const q = guideSearch.toLowerCase();
    return (
      ch.title.toLowerCase().includes(q) ||
      ch.subtitle.toLowerCase().includes(q) ||
      ch.whatIsIt.toLowerCase().includes(q) ||
      ch.steps.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 pb-24 text-right animate-fade-in">
      {/* Top Banner & Breadcrumb */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/30">
              {t('appName')}
            </span>
            <span className="text-xs text-slate-500">/</span>
            <span className="text-xs text-slate-400">مرکز مدیریت و تنظیمات</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <span>پروفایل کاربری و پیکربندی سیستم</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t('aboutTitle')}
          </p>
        </div>

        {/* Auth Action if Guest */}
        {!currentUser && (
          <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-2xl p-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-right">
              <div className="text-xs font-bold text-white">حالت مهمان (Guest)</div>
              <div className="text-[11px] text-slate-400">برای ذخیره دائمی ابری وارد شوید.</div>
            </div>
            <button
              onClick={() => onOpenAuthModal('login')}
              className="mr-2 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
            >
              ورود به حساب
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Sidebar Nav Tabs (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          {/* User ID Badge Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />
            
            <div className="flex items-center gap-3.5 mb-4">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg text-slate-950 shadow-lg shrink-0"
                style={{ backgroundColor: currentUser?.avatarColor || '#f59e0b' }}
              >
                {currentUser?.name ? currentUser.name.slice(0, 2) : 'DV'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm sm:text-base font-bold text-white truncate">
                  {currentUser ? currentUser.name : 'کاربر مهمان (آفلاین)'}
                </div>
                <div className="text-xs text-slate-400 truncate mt-0.5">
                  {currentUser ? currentUser.email : 'داده‌ها به صورت لوکال ذخیره می‌شوند'}
                </div>
                <div className="inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-amber-400 font-medium border border-slate-700">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{currentUser?.role || 'Full-Stack Developer'}</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80 text-center">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-xs text-slate-400 mb-0.5">پروژه‌های شما</div>
                <div className="text-base font-black text-white font-mono">
                  {toPersianDigits(totalProjects)}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-xs text-slate-400 mb-0.5">تسک‌های انجام‌شده</div>
                <div className="text-base font-black text-amber-400 font-mono">
                  {toPersianDigits(totalTasksCompleted)}
                </div>
              </div>
            </div>

            {currentUser && (
              <button
                onClick={onOpenEditProfile}
                className="w-full mt-3.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>ویرایش اطلاعات و کلمه عبور</span>
              </button>
            )}
          </div>

          {/* Sub Navigation Links */}
          <nav className="p-2 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <button
              onClick={() => setActiveSub('account')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeSub === 'account'
                  ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserIcon className="w-4 h-4 text-amber-400" />
                <span>اطلاعات حساب دولوپر</span>
              </div>
              <span className="text-[10px] text-slate-500">مشخصات</span>
            </button>

            <button
              onClick={() => setActiveSub('settings')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeSub === 'settings'
                  ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-amber-400" />
                <span>تنظیمات و ترجیحات سیستم</span>
              </div>
              <span className="text-[10px] text-slate-500">زبان و زمان</span>
            </button>

            <button
              onClick={() => setActiveSub('theme')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeSub === 'theme'
                  ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Palette className="w-4 h-4 text-amber-400" />
                <span>ظاهر و تم بصری</span>
              </div>
              <span className="text-[10px] text-slate-500">سفید + زرد + مشکی</span>
            </button>

            <button
              onClick={() => setActiveSub('guide')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeSub === 'guide'
                  ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>راهنمای جامع محصول</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-400 font-mono">
                ۱۶ فصل
              </span>
            </button>

            <button
              onClick={() => setActiveSub('about')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeSub === 'about'
                  ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Info className="w-4 h-4 text-amber-400" />
                <span>درباره EDX CRM WEB FOV</span>
              </div>
              <span className="text-[10px] text-slate-500">معرفی</span>
            </button>

            <button
              onClick={() => setActiveSub('socials')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeSub === 'socials'
                  ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>شبکه‌های اجتماعی رسمی</span>
              </div>
              <span className="text-[10px] text-slate-500">کانال و پیج</span>
            </button>

            {/* Logout button: Strictly ONLY for authenticated users */}
            {currentUser && (
              <div className="pt-2 mt-2 border-t border-slate-800">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/40 hover:text-red-300 border border-transparent hover:border-red-800/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <LogOut className="w-4 h-4" />
                    <span>خروج از حساب کاربری</span>
                  </div>
                  <span className="text-[10px] text-red-500">Logout</span>
                </button>
              </div>
            )}
          </nav>
        </div>

        {/* Right / Main Content Pane (8 cols on lg) */}
        <div className="lg:col-span-8">
          {/* SECTION 1: ACCOUNT INFO */}
          {activeSub === 'account' && (
            <div className="space-y-5">
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-amber-400" />
                      <span>{t('accountInfo')}</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {t('accountDescription')}
                    </p>
                  </div>
                  {currentUser && (
                    <button
                      onClick={onOpenEditProfile}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {t('editProfile')}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">{t('developerName')}:</div>
                    <div className="text-sm font-bold text-white">
                      {currentUser?.name || 'تعیین نشده (مهمان)'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">{t('email')}:</div>
                    <div className="text-sm font-bold text-white font-mono" dir="ltr">
                      {currentUser?.email || 'بدون ایمیل متصل'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">{t('role')}:</div>
                    <div className="text-sm font-bold text-amber-400">
                      {currentUser?.role || 'Full-Stack Developer'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">{t('memberSince')}:</div>
                    <div className="text-sm font-bold text-white">
                      {memberJalali.formattedWithPersianDigits}
                    </div>
                  </div>
                </div>

                {/* Security and Storage Architecture status */}
                <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed text-slate-300">
                    <div className="font-bold text-white mb-1">امنیت داده‌ها و تفکیک اختصاصی (RLS):</div>
                    داده‌های شما با شناسه کاربری (User ID) منحصر‌به‌فرد رمزگذاری و در جداول تفکیک‌شده ذخیره می‌شوند. هیچ کاربری به اطلاعات، پروژه‌ها و مستندات شما دسترسی نخواهد داشت.
                  </div>
                </div>
              </div>

              {/* Projects Overview in Profile */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-amber-400" />
                  <span>{t('yourProjects')} ({toPersianDigits(projects.length)})</span>
                </h3>

                {projects.length === 0 ? (
                  <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                    <div className="text-sm font-medium text-slate-300 mb-1">
                      {t('noProjects')}
                    </div>
                    <p className="text-xs text-slate-400">
                      {t('createProjectGuidanceFull')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {projects.map((p) => {
                      const completedCount = Object.keys(p.completedTasks || {}).length;
                      return (
                        <div
                          key={p.id}
                          className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                        >
                          <div>
                            <div className="text-sm font-bold text-white">{p.title}</div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              کارفرما: {p.clientName} | ددلاین: {p.deadline || 'تعیین نشده'}
                            </div>
                          </div>
                          <div className="text-left">
                            <span className="text-xs font-bold text-amber-400 font-mono">
                              {toPersianDigits(completedCount)} تسک انجام‌شده
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 2: SETTINGS */}
          {activeSub === 'settings' && (
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Settings className="w-4 h-4 text-amber-400" />
                  <span>تنظیمات و اولویت‌های حساب کاربری</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  پیکربندی زبان، تقویم و منطقه زمانی سامانه
                </p>
              </div>

              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>تنظیمات با موفقیت در فضای ابری ذخیره و اعمال شد.</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Language */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    {t('languageLabel')}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setDraftLanguage('fa')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        draftLanguage === 'fa'
                          ? 'bg-amber-400/10 border-amber-400 text-amber-400 shadow-lg shadow-amber-400/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t('languageFA')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraftLanguage('en')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        draftLanguage === 'en'
                          ? 'bg-amber-400/10 border-amber-400 text-amber-400 shadow-lg shadow-amber-400/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t('languageEN')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraftLanguage('de')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        draftLanguage === 'de'
                          ? 'bg-amber-400/10 border-amber-400 text-amber-400 shadow-lg shadow-amber-400/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t('languageDE')}
                    </button>
                  </div>
                </div>

                {/* Timezone */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    {t('timezoneLabel')}
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Asia/Tehran">{t('timezoneTehran')}</option>
                    <option value="Asia/Dubai">{t('timezoneDubai')}</option>
                    <option value="Europe/London">{t('timezoneLondon')}</option>
                    <option value="America/New_York">{t('timezoneNewYork')}</option>
                    <option value="UTC">{t('timezoneUTC')}</option>
                  </select>
                </div>

                {/* Date Format */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    {t('dateFormatLabel')}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDateFormat('jalali')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        dateFormat === 'jalali'
                          ? 'bg-amber-400/10 border-amber-400 text-amber-400 shadow-lg shadow-amber-400/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t('jalali')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDateFormat('gregorian')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        dateFormat === 'gregorian'
                          ? 'bg-amber-400/10 border-amber-400 text-amber-400 shadow-lg shadow-amber-400/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t('gregorian')}
                    </button>
                  </div>
                </div>

                {/* Density */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    {t('densityLabel')}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDensity('comfortable')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        density === 'comfortable'
                          ? 'bg-amber-400/10 border-amber-400 text-amber-400 shadow-lg shadow-amber-400/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t('comfortable')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDensity('compact')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        density === 'compact'
                          ? 'bg-amber-400/10 border-amber-400 text-amber-400 shadow-lg shadow-amber-400/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t('compact')}
                    </button>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSavingPrefs}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingPrefs ? t('saving') : t('saveSettings')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: THEME AND APPEARANCE */}
          {activeSub === 'theme' && (
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div className="border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/30">
                      {t('colorDefault').split(' (')[0]}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-400" />
                    <span>{t('themeTitle')}</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {t('themeDesc')}
                  </p>
                </div>

              {/* Mode Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-2">
                  {t('themeModeLabel')}:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setThemeMode('dark');
                      // TEMPORARY DISABLED: setGlobalThemeMode('dark');
                    }}
                    className={`p-3.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-2 cursor-pointer ${
                      themeMode === 'dark'
                        ? 'bg-amber-400/10 border-amber-400 text-amber-400 shadow-lg shadow-amber-400/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Moon className="w-5 h-5" />
                    <span>{t('themeDark')} - {t('default')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setThemeMode('light');
                      // TEMPORARY DISABLED: setGlobalThemeMode('light');
                    }}
                    className={`p-3.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-2 cursor-pointer ${
                      themeMode === 'light'
                        ? 'bg-amber-400/10 border-amber-400 text-amber-400 shadow-lg shadow-amber-400/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sun className="w-5 h-5" />
                    <span>{t('themeLight')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setThemeMode('system');
                      // TEMPORARY DISABLED: setGlobalThemeMode('system');
                    }}
                    className={`p-3.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-2 cursor-pointer ${
                      themeMode === 'system'
                        ? 'bg-amber-400/10 border-amber-400 text-amber-400 shadow-lg shadow-amber-400/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-5 h-5" />
                    <span>{t('themeSystem')}</span>
                  </button>
                </div>
              </div>

              {/* Color Theme / Accent Palette */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-2">
                  {t('colorThemeLabel')}:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'default', name: t('colorDefault'), color: '#f59e0b' },
                    { id: 'blue', name: t('colorBlue'), color: '#3b82f6' },
                    { id: 'emerald', name: t('colorEmerald'), color: '#10b981' },
                    { id: 'purple', name: t('colorPurple'), color: '#8b5cf6' },
                    { id: 'teal', name: t('colorTeal'), color: '#14b8a6' },
                    { id: 'orange', name: t('colorOrange'), color: '#f97316' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setColorTheme(t.id as ColorTheme);
                        // TEMPORARY DISABLED: setGlobalColorTheme(t.id as ColorTheme);
                      }}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                        colorTheme === t.id
                          ? 'bg-slate-800/80 border-amber-400 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span 
                        className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: t.color }}
                      />
                      <span className="truncate">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Live Preview */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300">
                  {t('livePreview')}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-400/20">
                    {t('primaryButton')}
                  </button>
                  <span className="px-3 py-1.5 rounded-lg bg-amber-400/10 text-amber-400 text-xs font-semibold border border-amber-400/30">
                    {t('activeBadge')}
                  </span>
                  <div className="flex-1 min-w-[150px] bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full w-3/4" />
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={handleSaveSettings}
                  disabled={isSavingPrefs}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingPrefs ? t('saving') : t('applyTheme')}</span>
                </button>
              </div>
            </div>
          )}

          {/* SECTION 4: PRODUCT GUIDE */}
          {activeSub === 'guide' && (
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
              <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>{t('guideTitle')}</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                      {t('guideDesc')}
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={guideSearch}
                    onChange={(e) => setGuideSearch(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 pr-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute top-2.5 right-3 pointer-events-none" />
                </div>
              </div>

              {/* Chapters Accordion */}
              <div className="space-y-3">
                {filteredGuideChapters.map((ch) => {
                  const isOpen = openChapterId === ch.id;
                  return (
                    <div
                      key={ch.id}
                      className={`rounded-xl border transition-all overflow-hidden ${
                        isOpen 
                          ? 'bg-slate-950 border-amber-400/40 shadow-lg' 
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenChapterId(isOpen ? '' : ch.id)}
                        className="w-full p-4 flex items-center justify-between text-right cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/30 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                            {ch.number}
                          </span>
                          <div>
                            <div className="text-sm font-bold text-white">{ch.title}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{ch.subtitle}</div>
                          </div>
                        </div>
                        <ChevronDown 
                          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                            isOpen ? 'rotate-180 text-amber-400' : ''
                          }`} 
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-5 pt-2 border-t border-slate-800/80 space-y-4 text-xs">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                              <span className="font-bold text-amber-400 block mb-1">{t('whatIsIt')}</span>
                              <p className="text-slate-300 leading-relaxed">{ch.whatIsIt}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                              <span className="font-bold text-amber-400 block mb-1">{t('whatItDoes')}</span>
                              <p className="text-slate-300 leading-relaxed">{ch.whatItDoes}</p>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="font-bold text-amber-400 block mb-1">{t('whenToUse')}</span>
                            <p className="text-slate-300 leading-relaxed">{ch.whenToUse}</p>
                          </div>

                          <div>
                            <span className="font-bold text-white block mb-2">{t('steps')}</span>
                            <div className="space-y-1.5 pr-1">
                              {ch.steps.map((step, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-slate-300">
                                  <span className="w-4 h-4 rounded-full bg-slate-800 text-amber-400 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                    {idx + 1}
                                  </span>
                                  <span className="leading-relaxed">{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {ch.keyTips.length > 0 && (
                            <div className="p-3 rounded-xl bg-amber-400/5 border border-amber-400/20 text-slate-300">
                              <span className="font-bold text-amber-400 block mb-1">{t('keyTips')}</span>
                              <ul className="list-disc list-inside space-y-1 text-slate-300 pr-1">
                                {ch.keyTips.map((tip, idx) => (
                                  <li key={idx}>{tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 5: ABOUT EDX CRM WEB FOV */}
          {activeSub === 'about' && (
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/30">
                    EDX CRM WEB FOV
                  </span>
                  <span className="text-xs text-slate-400">{t('aboutSubtitle')}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  سیستم مدیریت پروژه‌های وب و نرم‌افزار برای دولوپرها
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {t('aboutDescription')}
                </p>
              </div>

              {/* Target Audience */}
              <div>
                <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>{t('targetAudience')}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { title: 'فریلنسرهای وب و نرم‌افزار', desc: 'مدیریت مستقل کلاینت‌ها، ددلاین‌ها، هزینه‌ها و تحویل مرحله‌ای' },
                    { title: 'برنامه‌نویسان فول‌استک، فرانت و بک', desc: 'چک‌لیست دقیق معماری کد، امنیت، سئو تکنیکال و استقرار' },
                    { title: 'تیم‌ها و آژانس‌های نرم‌افزاری', desc: 'هماهنگی بین نقش‌های PM، UI/UX، دولوپر و QA با تحویل رسمی' },
                    { title: 'مهندسین هوش مصنوعی و داده', desc: 'معماری خطوط لوله داده و یکپارچگی مدل‌های هوشمند در پروژه‌ها' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="text-xs font-bold text-white mb-1">{item.title}</div>
                      <div className="text-xs text-slate-400 leading-relaxed">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Problems Solved */}
              <div>
                <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('problemsSolved')}</span>
                </h3>
                <div className="space-y-2 text-xs text-slate-300 pr-1">
                  {[
                    'حذف بی‌نظمی در گام‌های اجرای وب‌سایت با نقشه راه استاندارد ۲۵ فاز حیات پروژه',
                    'جلوگیری از کارهای دوباره‌کاری و فراموش شدن الزامات امنیتی، سئو و داکرایزیشن',
                    'تعیین صریح اقلام تحویلی (Deliverables) در هر مرحله و پایان دادن به اختلافات با کارفرما',
                    'شفاف‌سازی مالکیت هاست، دامنه، پنل پیامک و درگاه پرداخت جهت جلوگیری از مسدودسازی',
                    'ذخیره‌سازی کاملاً ابری و امن روی دیتابیس Supabase با تفکیک سطوح دسترسی کاربری',
                  ].map((prob, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-950 transition-colors">
                      <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{prob}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Modules Breakdown */}
              <div>
                <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
                  <Laptop className="w-4 h-4" />
                  <span>{t('modulesTitle')}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-white block mb-0.5">{t('whereAmI')}</span>
                    <span className="text-slate-400">قطب‌نمای زنده موقعیت پروژه، تسک‌های معوقه و گام فوری پیش‌رو</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-white block mb-0.5">{t('roadmap')}</span>
                    <span className="text-slate-400">توالی مهندسی مراحل از پیش‌نیازها و فیگما تا تست بار و لانچ</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-white block mb-0.5">{t('checklist')}</span>
                    <span className="text-slate-400">بیش از ۵۰۰ تسک فنی دقیق با قابلیت ثبت تسک‌های سفارشی</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-white block mb-0.5">{t('architecture')}</span>
                    <span className="text-slate-400">پیکربندی دیتابیس، فرانت‌، بک‌اند، کش و استراتژی سرور</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-white block mb-0.5">{t('modules')}</span>
                    <span className="text-slate-400">انتخاب ویژگی‌های موردنیاز کارفرما و الحاق خودکار به تسک‌ها</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-white block mb-0.5">{t('ownership')}</span>
                    <span className="text-slate-400">ماتریس واگذاری و مدیریت سرویس‌های زیرساختی پروژه</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: SOCIAL MEDIA */}
          {activeSub === 'socials' && (
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span>{t('socialsTitle')}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  ارتباط مستقیم، دریافت آپدیت‌ها، آموزش‌ها و اخبار EDX CRM WEB FOV
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Telegram Card */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4">
                      <Send className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-white">کانال رسمی تلگرام</div>
                    <p className="text-xs text-slate-400 mt-1 mb-3">
                      آکادمی ادیت‌بکس؛ مرجع آموزش‌های توسعه، پروژه‌ها و آپدیت‌های سیستمی
                    </p>
                    
                  </div>

                  <a
                    href="https://t.me/editbexacademy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>عضویت در کانال تلگرام</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Instagram Card */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-4">
                      <Instagram className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-white">صفحه رسمی اینستاگرام</div>
                    <p className="text-xs text-slate-400 mt-1 mb-3">
                      محتوای تخصصی برنامه‌نویسی وب، پشت صحنه توسعه و پاسخ به سوالات
                    </p>
                  </div>

                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>مشاهده در اینستاگرام</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
