import { useState } from 'react';
import { 
  Puzzle, 
  Check, 
  Search, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Info,
  Shield,
  Layers,
  Layout,
  Server,
  Database,
  Lock,
  ShoppingBag,
  Calendar,
  MessageSquare,
  FileText,
  Zap,
  Globe
} from 'lucide-react';
import { Project, ModuleCategoryType } from '../types';
import { UNIVERSAL_MODULES } from '../data/modulesData';
import { UNIVERSAL_PROJECT_TYPES } from '../data/universalProjectTypes';

interface ModulesManagerViewProps {
  currentProject: Project | null;
  onToggleModule: (moduleId: string) => void;
  onSetModules: (moduleIds: string[]) => void;
  onOpenNewProjectModal?: () => void;
}

export function ModulesManagerView({
  currentProject,
  onToggleModule,
  onSetModules,
  onOpenNewProjectModal,
}: ModulesManagerViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ModuleCategoryType | 'all'>('all');
  const [customModuleName, setCustomModuleName] = useState('');

  if (!currentProject) {
    return (
      <div className="p-8 sm:p-14 text-center bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4 text-right animate-fade-in">
        <Puzzle className="w-14 h-14 text-amber-400 mx-auto" />
        <h2 className="text-lg sm:text-xl font-bold text-white text-center">
          هیچ پروژه‌ای برای مدیریت و فعال‌سازی ماژول‌ها انتخاب نشده است
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto text-center leading-relaxed">
          برای فعال‌سازی ماژول‌های احراز هویت، درگاه پرداخت، سئو، چندزبانه و ماژول‌های تجاری، یک پروژه ایجاد کنید.
        </p>
        {onOpenNewProjectModal && (
          <div className="pt-2 text-center">
            <button
              onClick={onOpenNewProjectModal}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-lg cursor-pointer min-h-[44px]"
            >
              + ایجاد اولین پروژه
            </button>
          </div>
        )}
      </div>
    );
  }

  const activeModuleSet = new Set(currentProject.selectedModules || []);

  // Find all recommended modules from project's selected project types
  const recommendedModuleSet = new Set<string>();
  const activeTypes = currentProject.projectTypes || [currentProject.projectType];
  activeTypes.forEach((typeKey) => {
    const matchedType = UNIVERSAL_PROJECT_TYPES.find(
      (t) => t.id === typeKey || t.nameFa.includes(typeKey) || t.nameEn.toLowerCase() === typeKey.toLowerCase()
    );
    if (matchedType) {
      matchedType.recommendedModules.forEach((m) => recommendedModuleSet.add(m));
    }
  });

  const categories: { id: ModuleCategoryType | 'all'; title: string; icon: any }[] = [
    { id: 'all', title: 'همه ماژول‌ها', icon: Puzzle },
    { id: 'core', title: 'معماری و هسته', icon: Server },
    { id: 'auth', title: 'احراز هویت و دسترسی', icon: Lock },
    { id: 'panels', title: 'پنل‌های تخصصی', icon: Layout },
    { id: 'commerce', title: 'فروشگاهی و سفارش', icon: ShoppingBag },
    { id: 'booking', title: 'رزرو و تقویم', icon: Calendar },
    { id: 'communication', title: 'ارتباطات و پیامک', icon: MessageSquare },
    { id: 'content', title: 'محتوا و مدیا', icon: FileText },
    { id: 'data', title: 'داده، جستجو و نقشه', icon: Database },
    { id: 'ai', title: 'هوش مصنوعی', icon: Sparkles },
    { id: 'security', title: 'امنیت و هاردنینگ', icon: Shield },
    { id: 'devops', title: 'استقرار و بکاپ', icon: Zap },
  ];

  const filteredModules = UNIVERSAL_MODULES.filter((mod) => {
    const matchesCategory = selectedCategory === 'all' || mod.category === selectedCategory;
    const matchesSearch =
      mod.nameFa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleApplyAllRecommended = () => {
    const combined = new Set([...currentProject.selectedModules, ...Array.from(recommendedModuleSet)]);
    onSetModules(Array.from(combined));
  };

  const handleAddCustomModule = () => {
    if (!customModuleName.trim()) return;
    const safeId = `mod_custom_${Date.now()}`;
    onSetModules([...(currentProject.selectedModules || []), safeId]);
    setCustomModuleName('');
  };

  return (
    <div className="space-y-8 text-right">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/40 p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
              <Puzzle className="w-3.5 h-3.5 text-cyan-400" />
              مدیریت ماژول‌ها و فیچرهای پروژه (Modular Engine)
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              ماژول‌های فعال و تزریق هوشمند تسک‌ها
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              با فعال یا غیرفعال‌سازی هر ماژول، تسک‌های تخصصی آن (مانند درگاه پرداخت، نوبت‌دهی، هوش مصنوعی یا رزرو) به صورت خودکار در فازهای توسعه، یکپارچه‌سازی، تست و امنیت نقشه راه پروژه «{currentProject.title}» تزریق می‌شوند.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {recommendedModuleSet.size > 0 && (
              <button
                onClick={handleApplyAllRecommended}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-600/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>فعال‌سازی تمام ماژول‌های پیشنهادی ({recommendedModuleSet.size})</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats counter */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs">
          <div className="bg-slate-950/80 px-3.5 py-1.5 rounded-lg border border-slate-800 text-slate-300 flex items-center gap-2">
            <span className="text-slate-400">ماژول‌های فعال پروژه:</span>
            <strong className="text-cyan-400 font-bold">{activeModuleSet.size} ماژول</strong>
          </div>
          <div className="bg-slate-950/80 px-3.5 py-1.5 rounded-lg border border-slate-800 text-slate-300 flex items-center gap-2">
            <span className="text-slate-400">کل ماژول‌های استاندارد:</span>
            <strong className="text-white font-bold">{UNIVERSAL_MODULES.length} ماژول</strong>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="جستجوی عنوان یا توضیحات ماژول..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl pr-10 pl-4 py-3 text-xs text-white outline-none min-h-[44px]"
          />
        </div>

        {/* Add custom module */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="نام ماژول سفارشی جدید..."
            value={customModuleName}
            onChange={(e) => setCustomModuleName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCustomModule()}
            className="bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none flex-1 sm:w-64 min-h-[44px]"
          />
          <button
            onClick={handleAddCustomModule}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-cyan-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن</span>
          </button>
        </div>
      </div>

      {/* Categories horizontal pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer min-h-[44px] ${
                isSelected
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.title}</span>
            </button>
          );
        })}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModules.map((mod) => {
          const isActive = activeModuleSet.has(mod.id);
          const isRecommended = recommendedModuleSet.has(mod.id);

          return (
            <div
              key={mod.id}
              onClick={() => onToggleModule(mod.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between space-y-3 ${
                isActive
                  ? 'bg-slate-900/90 border-cyan-500/80 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 opacity-80 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Puzzle className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        {mod.nameFa}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {mod.nameEn}
                      </span>
                    </div>
                  </div>

                  {/* Toggle Checkbox Pill */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40'
                        : 'bg-slate-800 border border-slate-700 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mt-2">
                  {mod.description}
                </p>
              </div>

              {/* Badges & Task info */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  {isRecommended && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-medium text-[10px]">
                      <Sparkles className="w-3 h-3" />
                      پیشنهاد پروژه
                    </span>
                  )}
                  {isActive && (
                    <span className="text-emerald-400 font-medium">
                      ✓ فعال در نقشه راه
                    </span>
                  )}
                </div>

                <span className="text-slate-400">
                  {mod.defaultTasks.length} تسک هوشمند
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
