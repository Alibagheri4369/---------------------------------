import { useState } from 'react';
import { 
  Layers, 
  Server, 
  Database, 
  Shield, 
  Cpu, 
  HardDrive, 
  Globe, 
  Lock, 
  Sparkles, 
  Check, 
  RefreshCw, 
  Users, 
  ArrowLeftRight,
  Code2,
  Box,
  FileCode
} from 'lucide-react';
import { Project, TechStackConfig } from '../types';
import { TECH_OPTIONS, TECH_PRESETS } from '../data/techStackPresets';
import { useI18n } from '../i18n/I18nProvider';

interface ArchitectureViewProps {
  currentProject: Project | null;
  onUpdateTechStack: (stack: TechStackConfig) => void;
  onUpdateRoles: (roles: string[]) => void;
  onOpenNewProjectModal?: () => void;
}

export default function ArchitectureView({
  currentProject,
  onUpdateTechStack,
  onUpdateRoles,
  onOpenNewProjectModal,
}: ArchitectureViewProps) {
  const { t } = useI18n();
  if (!currentProject) {
    return (
      <div className="p-8 sm:p-14 text-center bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4 text-right animate-fade-in">
        <Cpu className="w-14 h-14 text-cyan-400 mx-auto" />
        <h2 className="text-lg sm:text-xl font-bold text-white text-center">
          {t('architectureViewNoProject')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto text-center leading-relaxed">
          {t('architectureViewNoProjectDescription')}
        </p>
        {onOpenNewProjectModal && (
          <div className="pt-2 text-center">
            <button
              onClick={onOpenNewProjectModal}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-lg cursor-pointer min-h-[44px]"
            >
              + {t('architectureViewCreateFirstProject')}
            </button>
          </div>
        )}
      </div>
    );
  }

  const currentStack: TechStackConfig = currentProject.techStack || TECH_PRESETS[0].stack;
  const currentRoles: string[] = currentProject.userRoles && currentProject.userRoles.length > 0 
    ? currentProject.userRoles 
    : ['Super Admin', 'Store Manager', 'Customer'];

  const [newRoleInput, setNewRoleInput] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleFieldChange = (key: keyof TechStackConfig, value: string) => {
    onUpdateTechStack({
      ...currentStack,
      [key]: value,
    });
  };

  const handleApplyPreset = (presetStack: TechStackConfig) => {
    onUpdateTechStack(presetStack);
  };

  const handleAddRole = () => {
    if (!newRoleInput.trim()) return;
    if (currentRoles.includes(newRoleInput.trim())) return;
    onUpdateRoles([...currentRoles, newRoleInput.trim()]);
    setNewRoleInput('');
  };

  const handleRemoveRole = (roleToRemove: string) => {
    onUpdateRoles(currentRoles.filter((r) => r !== roleToRemove));
  };

  const copyArchitectureSpec = () => {
    const markdown = `# معماری فنی پروژه: ${currentProject.title}
- **نوع پروژه:** ${currentProject.projectType}
- **مدل کسب‌وکار:** ${currentProject.businessModel || 'مشخص نشده'}
- **پیچیدگی:** ${currentProject.complexity || 'Medium'}

## استک فناوری (Tech Stack):
- **فرانت‌اند:** ${currentStack.frontend}
- **بک‌اند:** ${currentStack.backend}
- **پایگاه داده:** ${currentStack.database}
- **سیستم کش:** ${currentStack.cache}
- **فضای ذخیره‌سازی فایل:** ${currentStack.storage}
- **زیرساخت و استقرار:** ${currentStack.infrastructure}
- **شبکه توزیع محتوا (CDN):** ${currentStack.cdn}
- **روش احراز هویت:** ${currentStack.authMethod}
- **فریم‌ورک استایل:** ${currentStack.cssFramework}

## نقش‌های کاربری (RBAC):
${currentRoles.map((r) => `- ${r}`).join('\n')}

## ماژول‌های فعال:
${(currentProject.selectedModules || []).map((m) => `- ${m}`).join('\n')}
`;
    navigator.clipboard.writeText(markdown);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="space-y-8 text-right">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/40 p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              {t('architectureViewRole')}
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              معماری سیستم و انتخاب استک فناوری
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
          {t('architectureViewSubtitle')} «{currentProject.title}».
        </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copyArchitectureSpec}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <FileCode className="w-4 h-4" />
              <span>{copiedNotification ? t('copied') : t('architectureViewCopyButton')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Fast Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{t('architectureViewPresetsTitle')}</span>
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          {t('architectureViewPresetsDescription')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {TECH_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset.stack)}
              className="p-4 rounded-xl text-right bg-slate-950/80 hover:bg-indigo-950/30 border border-slate-800 hover:border-indigo-500/50 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">
                  {preset.name}
                </span>
                <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Check className="w-3 h-3" />
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Visual System Architecture Diagram */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
            <span>{t('architectureViewDiagramTitle')}</span>
          </h2>
          <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
            {t('architectureViewDiagramLiveView')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Layer 1: Client & CDN */}
          <div className="bg-slate-950/90 border border-cyan-500/40 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold border-b border-slate-800 pb-2">
              <Globe className="w-4 h-4" />
              <span>{t('architectureViewLayer1Title')}</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-200">
                <div className="text-[10px] text-slate-400 mb-0.5">CDN & WAF:</div>
                <div className="font-semibold text-cyan-300">{currentStack.cdn}</div>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-200">
                <div className="text-[10px] text-slate-400 mb-0.5">رابط کاربری فرانت:</div>
                <div className="font-semibold text-white">{currentStack.frontend}</div>
              </div>
            </div>
            <div className="text-[10px] text-emerald-400 bg-emerald-950/40 p-1.5 rounded border border-emerald-900/40 text-center">
              ✓ رندرینگ سریع SSG / SSR
            </div>
          </div>

          {/* Layer 2: API Gateway & Auth */}
          <div className="bg-slate-950/90 border border-indigo-500/40 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold border-b border-slate-800 pb-2">
              <Server className="w-4 h-4" />
              <span>لایه ۲: بک‌اند و منطق تجاری</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-200">
                <div className="text-[10px] text-slate-400 mb-0.5">موتور بک‌اند:</div>
                <div className="font-semibold text-indigo-300">{currentStack.backend}</div>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-200">
                <div className="text-[10px] text-slate-400 mb-0.5">احراز هویت:</div>
                <div className="font-semibold text-white">{currentStack.authMethod}</div>
              </div>
            </div>
            <div className="text-[10px] text-indigo-400 bg-indigo-950/40 p-1.5 rounded border border-indigo-900/40 text-center">
              ✓ گارد اعتبارسنجی و RBAC
            </div>
          </div>

          {/* Layer 3: Database & Cache */}
          <div className="bg-slate-950/90 border border-amber-500/40 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold border-b border-slate-800 pb-2">
              <Database className="w-4 h-4" />
              <span>لایه ۳: پایگاه داده و کش</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-200">
                <div className="text-[10px] text-slate-400 mb-0.5">دیتابیس اصلی:</div>
                <div className="font-semibold text-amber-300">{currentStack.database}</div>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-200">
                <div className="text-[10px] text-slate-400 mb-0.5">موتور کش سریع:</div>
                <div className="font-semibold text-white">{currentStack.cache}</div>
              </div>
            </div>
            <div className="text-[10px] text-amber-400 bg-amber-950/40 p-1.5 rounded border border-amber-900/40 text-center">
              ✓ تضمین تراکنش و سرعت کوئری
            </div>
          </div>

          {/* Layer 4: Storage & Infra */}
          <div className="bg-slate-950/90 border border-emerald-500/40 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold border-b border-slate-800 pb-2">
              <HardDrive className="w-4 h-4" />
              <span>لایه ۴: استوریج و زیرساخت</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-200">
                <div className="text-[10px] text-slate-400 mb-0.5">ذخیره‌سازی فایل:</div>
                <div className="font-semibold text-emerald-300">{currentStack.storage}</div>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-200">
                <div className="text-[10px] text-slate-400 mb-0.5">محیط استقرار:</div>
                <div className="font-semibold text-white">{currentStack.infrastructure}</div>
              </div>
            </div>
            <div className="text-[10px] text-emerald-400 bg-emerald-950/40 p-1.5 rounded border border-emerald-900/40 text-center">
              ✓ کانتینرهای مستقل و ایزوله
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stack Configurator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Code2 className="w-4 h-4 text-indigo-400" />
          <span>پیکربندی اجزای فناوری (Customize Stack)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Frontend */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              فریم‌ورک فرانت‌اند (Frontend)
            </label>
            <select
              value={currentStack.frontend}
              onChange={(e) => handleFieldChange('frontend', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              {TECH_OPTIONS.frontend.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Backend */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              فریم‌ورک و زبان بک‌اند (Backend)
            </label>
            <select
              value={currentStack.backend}
              onChange={(e) => handleFieldChange('backend', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              {TECH_OPTIONS.backend.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Database */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              پایگاه داده (Database)
            </label>
            <select
              value={currentStack.database}
              onChange={(e) => handleFieldChange('database', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              {TECH_OPTIONS.database.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Cache */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-rose-400" />
              سیستم کش (Cache Engine)
            </label>
            <select
              value={currentStack.cache}
              onChange={(e) => handleFieldChange('cache', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              {TECH_OPTIONS.cache.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Storage */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              فضای ذخیره‌سازی رسانه‌ها (Storage)
            </label>
            <select
              value={currentStack.storage}
              onChange={(e) => handleFieldChange('storage', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              {TECH_OPTIONS.storage.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Infrastructure */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-purple-400" />
              زیرساخت سرور و استقرار (Infrastructure)
            </label>
            <select
              value={currentStack.infrastructure}
              onChange={(e) => handleFieldChange('infrastructure', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              {TECH_OPTIONS.infrastructure.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* CDN */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              شبکه CDN و فایروال
            </label>
            <select
              value={currentStack.cdn}
              onChange={(e) => handleFieldChange('cdn', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              {TECH_OPTIONS.cdn.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Auth Method */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-teal-400" />
              روش احراز هویت
            </label>
            <select
              value={currentStack.authMethod}
              onChange={(e) => handleFieldChange('authMethod', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              {TECH_OPTIONS.authMethod.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* CSS Framework */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-pink-400" />
              فریم‌ورک استایل‌دهی UI
            </label>
            <select
              value={currentStack.cssFramework}
              onChange={(e) => handleFieldChange('cssFramework', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              {TECH_OPTIONS.cssFramework.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Dynamic User Roles & Permissions (RBAC) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>نقش‌ها و سطوح دسترسی پویا (Dynamic User Roles)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              تعریف نقش‌های مجاز در سیستم متناسب با ماهیت پروژه (مثلاً برای آکادمی: استاد و دانشجو؛ برای کلینیک: پزشک و منشی؛ برای مارکت‌پلیس: فروشنده و ادمین)
            </p>
          </div>

          {/* Add role input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="نقش جدید (مثلاً Doctor)..."
              value={newRoleInput}
              onChange={(e) => setNewRoleInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddRole()}
              className="bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white outline-none w-48"
            />
            <button
              onClick={handleAddRole}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              افزودن نقش
            </button>
          </div>
        </div>

        {/* Roles pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {currentRoles.map((role) => (
            <div
              key={role}
              className="inline-flex items-center gap-2 bg-slate-950 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-200"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="font-semibold">{role}</span>
              {currentRoles.length > 1 && (
                <button
                  onClick={() => handleRemoveRole(role)}
                  className="text-slate-500 hover:text-rose-400 mr-1 text-sm font-bold cursor-pointer"
                  title="حذف این نقش"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
