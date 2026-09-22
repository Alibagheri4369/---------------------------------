import { useState } from 'react';
import { 
  Navigation, 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Lightbulb, 
  AlertTriangle, 
  Target, 
  ChevronLeft, 
  TrendingUp,
  Award,
  FastForward,
  Puzzle,
  Layers,
  ArrowRight,
  Check,
  FolderPlus,
  Plus,
  Compass,
  BarChart3,
  Calendar,
  Clock,
  ShieldCheck,
  CheckSquare,
  DollarSign
} from 'lucide-react';
import { Project, Phase } from '../types';
import { generateProjectRoadmap } from '../data/universalLifecycle';
import { calculateProjectStats, calculateUserOverallStats } from '../services/analyticsService';
import { useI18n } from '../i18n/I18nProvider';

interface WhereAmIWidgetProps {
  currentProject: Project | null;
  allProjects?: Project[];
  onSelectPhase: (phaseId: number) => void;
  onSetCurrentPhase: (phaseId: number) => void;
  onToggleTask: (taskId: string) => void;
  onOpenNewProjectModal: () => void;
  onSelectProject?: (projectId: string) => void;
}

export default function WhereAmIWidget({
  currentProject,
  allProjects = [],
  onSelectPhase,
  onSetCurrentPhase,
  onToggleTask,
  onOpenNewProjectModal,
  onSelectProject,
}: WhereAmIWidgetProps) {
  const { t } = useI18n();
  // If NO PROJECT is present, render the complete professional Zero-State
  if (!currentProject) {
    const overallStats = calculateUserOverallStats(allProjects);

    return (
      <div className="space-y-6 text-right animate-fade-in">
        {/* Zero-State Hero Card */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400" />
          <div className="absolute -top-16 -left-16 w-52 h-52 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto shadow-lg shadow-cyan-500/20">
              <FolderPlus className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                سیستم مدیریت چرخه حیات وب و وب‌اپلیکیشن
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                هنوز پروژه‌ای ثبت نشده است
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
                هیچ پروژه‌ای در حساب شما وجود ندارد. با ثبت اولین پروژه، نقشه راه ۲۵ مرحله‌ای، ماژول‌های فعال، چک‌لیست‌های اختصاصی و ماتریس تحویل خودکار برای شما تولید و در دیتابیس ذخیره خواهد شد.
              </p>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onOpenNewProjectModal}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] min-h-[48px]"
              >
                <Plus className="w-4 h-4" />
                <span>+ ایجاد اولین پروژه</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real Dynamic Metrics: All strictly zero (No fake data!) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold block">تعداد پروژه‌ها</span>
            <span className="text-2xl font-black text-white font-mono">{overallStats.totalProjects}</span>
            <span className="text-[10px] text-slate-500 block">پروژه ثبت‌شده</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold block">تسک‌های انجام‌شده</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">{overallStats.completedTasks}</span>
            <span className="text-[10px] text-slate-500 block">تسک تکمیل‌شده</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold block">تسک‌های باقیمانده</span>
            <span className="text-2xl font-black text-amber-400 font-mono">{overallStats.pendingTasks}</span>
            <span className="text-[10px] text-slate-500 block">در انتظار اقدام</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold block">میانگین پیشرفت</span>
            <span className="text-2xl font-black text-cyan-400 font-mono">{overallStats.overallProgress}٪</span>
            <span className="text-[10px] text-slate-500 block">پیشرفت واقعی</span>
          </div>
        </div>

        {/* Empty State for Charts (Strictly Dynamic, No Fake Lines) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">نمودار پیشرفت فازها</h3>
            </div>
            <div className="p-8 text-center bg-slate-950/70 border border-slate-850 rounded-xl space-y-2">
              <BarChart3 className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-xs text-slate-300 font-semibold">داده‌ای برای نمایش نمودار وجود ندارد</div>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                با ایجاد پروژه و تیک زدن تسک‌ها در چک‌لیست ۲۵ فاز، درصد پیشرفت هر فاز به صورت لحظه‌ای در این نمودار رسم خواهد شد.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">توزیع انواع پروژه‌ها</h3>
            </div>
            <div className="p-8 text-center bg-slate-950/70 border border-slate-850 rounded-xl space-y-2">
              <Compass className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-xs text-slate-300 font-semibold">هنوز دسته‌بندی پروژه‌ای ایجاد نشده است</div>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                پروژه‌های شما با توجه به نوع تجاری (فروشگاهی، شرکتی، SaaS، پلتفرم) در این قسمت دسته‌بندی و مانیتور می‌شوند.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Generate the dynamic roadmap for this project
  const roadmap = generateProjectRoadmap(currentProject);
  const stats = calculateProjectStats(currentProject);

  const activePhase = roadmap.find((p) => p.id === currentProject.currentPhaseId) || roadmap[0];
  const activeIndex = roadmap.findIndex((p) => p.id === activePhase.id);
  const nextPhase = activeIndex >= 0 && activeIndex < roadmap.length - 1 ? roadmap[activeIndex + 1] : null;
  const prevPhase = activeIndex > 0 ? roadmap[activeIndex - 1] : null;

  // Extract pending tasks from active phase
  const allActiveTasks: { id: string; text: string; groupTitle: string }[] = [];
  activePhase.groups.forEach((g) => {
    g.tasks.forEach((t) => {
      allActiveTasks.push({ id: t.id, text: t.text, groupTitle: g.title });
    });
  });

  const pendingActiveTasks = allActiveTasks.filter((t) => !currentProject.completedTasks[t.id]);
  const completedActiveTasks = allActiveTasks.filter((t) => currentProject.completedTasks[t.id]);

  const activePhaseTotal = allActiveTasks.length;
  const activePhaseDone = completedActiveTasks.length;
  const activePhasePercent = activePhaseTotal > 0 ? Math.round((activePhaseDone / activePhaseTotal) * 100) : 0;

  return (
    <div className="space-y-4 sm:space-y-6 text-right">
      {/* Big Compass GPS Card (Optimized for Mobile & Desktop) */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-cyan-500/40 p-4 sm:p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400" />
        <div className="absolute -top-16 -left-16 w-44 sm:w-52 h-44 sm:h-52 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2.5 max-w-2xl w-full">
            {/* GPS Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-bold">
              <Navigation className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>موقعیت‌یاب دولوپر (Universal GPS)</span>
            </div>

            {/* Active Phase Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-snug">
              اکنون در <span className="text-cyan-400">فاز {activePhase.number}</span> هستید: {activePhase.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activePhase.shortDesc}
            </p>

            {/* Meta Tags Carousel / Grid */}
            <div className="pt-1 flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-xs">
              <div className="bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800 text-slate-300 flex items-center gap-1">
                <span className="text-slate-400 text-[11px]">پروژه:</span>
                <strong className="text-white font-semibold text-xs truncate max-w-[150px] sm:max-w-none">{currentProject.title}</strong>
              </div>
              <div className="bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800 text-slate-300 flex items-center gap-1">
                <span className="text-slate-400 text-[11px]">کارفرما:</span>
                <strong className="text-white font-semibold text-xs">{currentProject.clientName}</strong>
              </div>
              <div className="bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800 text-slate-300 flex items-center gap-1">
                <span className="text-slate-400 text-[11px]">نوع:</span>
                <strong className="text-cyan-300 font-semibold text-xs">{currentProject.projectType}</strong>
              </div>
              {currentProject.budget && (
                <div className="bg-emerald-950/40 px-2.5 py-1.5 rounded-xl border border-emerald-700/50 text-emerald-300 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-[11px]">بودجه:</span>
                  <strong className="text-white font-bold text-xs">{currentProject.budget} میلیون تومان</strong>
                </div>
              )}
              {currentProject.deadline && (
                <div className="bg-amber-950/40 px-2.5 py-1.5 rounded-xl border border-amber-700/50 text-amber-300 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-400 text-[11px]">ددلاین:</span>
                  <strong className="text-white font-bold text-xs">{currentProject.deadline}</strong>
                </div>
              )}
              {currentProject.selectedModules && (
                <div className="bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800 text-slate-300 flex items-center gap-1">
                  <Puzzle className="w-3.5 h-3.5 text-amber-400" />
                  <strong className="text-amber-300 font-semibold text-xs">{currentProject.selectedModules.length} ماژول فعال</strong>
                </div>
              )}
            </div>
          </div>

          {/* Quick Dual Progress Gauges (Touch-friendly on mobile) */}
          <div className="w-full lg:w-72 bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shrink-0">
            {/* Phase Gauge */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">پیشرفت فاز {activePhase.number}</span>
                <span className="text-cyan-400 font-bold font-mono text-sm">{activePhasePercent}٪</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${activePhasePercent}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                <span>{activePhaseDone} از {activePhaseTotal} تسک انجام شده</span>
                {activePhasePercent === 100 && (
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> کامل
                  </span>
                )}
              </div>
            </div>

            {/* Total Project Gauge (Calculated strictly from real database tasks) */}
            <div className="pt-2.5 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">پیشرفت کل نقشه راه ({roadmap.length} فاز)</span>
                <span className="text-emerald-400 font-bold font-mono text-sm">{stats.progressPercent}٪</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${stats.progressPercent}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {stats.completedTasks} از {stats.totalTasks} تسک تکمیل‌شده
              </div>
            </div>
          </div>
        </div>

        {/* Phase Quick Switcher Ribbon (Touch targets >= 44px on mobile) */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            {prevPhase && (
              <button
                onClick={() => {
                  onSetCurrentPhase(prevPhase.id);
                  onSelectPhase(prevPhase.id);
                }}
                className="flex-1 sm:flex-initial px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer min-h-[44px] flex items-center justify-center gap-1 font-medium"
              >
                <span>← فاز قبل ({prevPhase.number})</span>
              </button>
            )}
            {nextPhase && (
              <button
                onClick={() => {
                  onSetCurrentPhase(nextPhase.id);
                  onSelectPhase(nextPhase.id);
                }}
                className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors shadow-sm cursor-pointer min-h-[44px] flex items-center justify-center gap-1"
              >
                <span>فاز بعد ({nextPhase.number}: {nextPhase.title}) →</span>
              </button>
            )}
          </div>

          <button
            onClick={() => onSelectPhase(activePhase.id)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
          >
            <span>ورود به چک‌لیست کامل فاز {activePhase.number}</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Immediate Priority vs Next Step (Mobile-First 1 or 2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Priority 1: What should you do right now? (Immediate Tasks) */}
        <div className="rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-slate-800 p-4 sm:p-6 space-y-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                <h2 className="font-bold text-white text-sm sm:text-base">
                  الان دقیقاً باید چکار کنی؟
                </h2>
              </div>
              <span className="text-xs text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800/80 font-medium">
                {pendingActiveTasks.length} تسک باقیمانده
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              تسک‌های اولویت‌دار زیر را بررسی و با لمس مستقیم علامت بزنید:
            </p>

            {/* Task list with 48px+ touch height */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-0.5 scrollbar-thin">
              {pendingActiveTasks.length === 0 ? (
                <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 text-center space-y-2">
                  <Award className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                  <h3 className="font-bold text-emerald-300 text-sm">
                    آفرین! تمام تسک‌های فاز {activePhase.number} تکمیل شده‌اند.
                  </h3>
                  <p className="text-xs text-slate-300">
                    پروژه آماده ورود رسمی به فاز بعدی نقشه راه است.
                  </p>
                  {nextPhase && (
                    <button
                      onClick={() => {
                        onSetCurrentPhase(nextPhase.id);
                        onSelectPhase(nextPhase.id);
                      }}
                      className="mt-3 inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/30 cursor-pointer min-h-[44px]"
                    >
                      <span>ورود به فاز {nextPhase.number}: {nextPhase.title}</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                pendingActiveTasks.slice(0, 8).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-cyan-500/60 cursor-pointer transition-all active:scale-[0.99] select-none min-h-[48px] group"
                  >
                    <div className="mt-0.5 p-0.5 shrink-0">
                      <Circle className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <div className="text-xs leading-relaxed text-slate-200 flex-1">
                      <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">{task.groupTitle}</span>
                      <span className="font-medium text-slate-100">{task.text}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <button
              onClick={() => onSelectPhase(activePhase.id)}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700 cursor-pointer min-h-[44px]"
            >
              <span>مشاهده و ثبت یادداشت‌های فاز {activePhase.number}</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Priority 2: Where are you going next? (Next Phase Teaser) */}
        <div className="rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-slate-800 p-4 sm:p-6 space-y-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <h2 className="font-bold text-white text-sm sm:text-base">
                  به کجا می‌روی؟ (گام بعدی)
                </h2>
              </div>
              <span className="text-xs text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-800 font-medium">
                {nextPhase ? `فاز بعدی: ${nextPhase.number}` : 'پایان چرخه حیات'}
              </span>
            </div>

            {nextPhase ? (
              <div className="space-y-3">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="text-xs font-bold text-cyan-300">
                    فاز {nextPhase.number}: {nextPhase.title} ({nextPhase.titleEn})
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {nextPhase.shortDesc}
                  </p>
                </div>

                {/* Deliverables preview */}
                {nextPhase.deliverables && nextPhase.deliverables.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                    <span className="text-xs font-semibold text-slate-300 block">
                      خروجی‌هایی که در گام بعدی باید آماده کنی:
                    </span>
                    <ul className="text-xs text-cyan-300 space-y-1.5 list-disc pr-4">
                      {nextPhase.deliverables.map((d, i) => (
                        <li key={i} className="leading-relaxed">{d}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key tip for next phase */}
                {nextPhase.tips && nextPhase.tips[0] && (
                  <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200/90 leading-relaxed">
                    <span className="font-bold text-amber-400 block mb-1">💡 نکته آمادگی برای فاز بعد:</span>
                    {nextPhase.tips[0]}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 text-center space-y-2">
                <Award className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="font-bold text-emerald-300 text-sm">
                  تبریک! شما در آخرین فاز نقشه راه (پشتیبانی و نگهداری مداوم) قرار دارید.
                </h3>
                <p className="text-xs text-slate-300">
                  این بخش مربوط به درآمد ماهانه، مانیتورینگ آپ‌تایم و توسعه فیچرهای نسخه ۲ می‌باشد.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-200 leading-relaxed">
              <strong className="text-blue-400 block mb-0.5">قانون طلایی دولوپر:</strong>
              حرکت به فاز بعدی تنها زمانی توصیه می‌شود که تسک‌های الزامی فاز فعلی تکمیل و تست شده باشند.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
