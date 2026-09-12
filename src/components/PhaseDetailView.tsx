import { useState, useEffect, FormEvent } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Lightbulb, 
  FileCode, 
  Save, 
  Sparkles, 
  Layers, 
  Flag,
  Share2,
  Check,
  Puzzle,
  Copy,
  ListFilter
} from 'lucide-react';
import { Phase, Project, CustomTask } from '../types';
import { generateProjectRoadmap } from '../data/universalLifecycle';
import { useI18n } from '../i18n/I18nProvider';

interface PhaseDetailViewProps {
  phaseId: number;
  currentProject: Project | null;
  onToggleTask: (taskId: string) => void;
  onToggleCustomTask: (phaseId: number, customTaskId: string) => void;
  onAddCustomTask: (phaseId: number, text: string) => void;
  onDeleteCustomTask: (phaseId: number, customTaskId: string) => void;
  onUpdatePhaseNote: (phaseId: number, note: string) => void;
  onSelectPhase: (phaseId: number) => void;
  onSetCurrentPhase: (phaseId: number) => void;
  onOpenNewProjectModal?: () => void;
}

export function PhaseDetailView({
  phaseId,
  currentProject,
  onToggleTask,
  onToggleCustomTask,
  onAddCustomTask,
  onDeleteCustomTask,
  onUpdatePhaseNote,
  onSelectPhase,
  onSetCurrentPhase,
  onOpenNewProjectModal,
}: PhaseDetailViewProps) {
  const { t } = useI18n();
  if (!currentProject) {
    return (
      <div className="p-8 sm:p-14 text-center bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4 text-right animate-fade-in">
        <Layers className="w-14 h-14 text-cyan-400 mx-auto" />
        <h2 className="text-lg sm:text-xl font-bold text-white text-center">
          {t('phaseDetailViewNoProject')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto text-center leading-relaxed">
          {t('phaseDetailViewNoProjectDescription')}
        </p>
        {onOpenNewProjectModal && (
          <div className="pt-2 text-center">
            <button
              onClick={onOpenNewProjectModal}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-lg cursor-pointer min-h-[44px]"
            >
              + {t('phaseDetailViewCreateFirstProject')}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Generate the dynamic roadmap for this project
  const roadmap = generateProjectRoadmap(currentProject);
  const phase = roadmap.find((p) => p.id === phaseId) || roadmap[0];

  const phaseIndex = roadmap.findIndex((p) => p.id === phase.id);
  const prevPhase = phaseIndex > 0 ? roadmap[phaseIndex - 1] : null;
  const nextPhase = phaseIndex < roadmap.length - 1 ? roadmap[phaseIndex + 1] : null;

  const [filter, setFilter] = useState<'all' | 'incomplete' | 'completed'>('all');
  const [newCustomTaskText, setNewCustomTaskText] = useState('');
  const [noteText, setNoteText] = useState(currentProject.phaseNotes[phase.id] || '');
  const [isNoteSaved, setIsNoteSaved] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  // Sync noteText when phase or project changes
  useEffect(() => {
    setNoteText(currentProject.phaseNotes[phase.id] || '');
    setIsNoteSaved(false);
  }, [phase.id, currentProject.id]);

  const customTasksList = currentProject.customTasks[phase.id] || [];

  // Calculate stats for this phase
  let totalTasks = 0;
  let doneTasks = 0;

  phase.groups.forEach((group) => {
    group.tasks.forEach((task) => {
      totalTasks++;
      if (currentProject.completedTasks[task.id]) doneTasks++;
    });
  });

  customTasksList.forEach((ct) => {
    totalTasks++;
    if (ct.isDone) doneTasks++;
  });

  const percentage = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const isCurrentActive = currentProject.currentPhaseId === phase.id;

  const handleAddCustom = (e: FormEvent) => {
    e.preventDefault();
    if (!newCustomTaskText.trim()) return;
    onAddCustomTask(phase.id, newCustomTaskText.trim());
    setNewCustomTaskText('');
  };

  const handleSaveNote = () => {
    onUpdatePhaseNote(phase.id, noteText);
    setIsNoteSaved(true);
    setTimeout(() => setIsNoteSaved(false), 1500);
  };

  const copyClientProgressReport = () => {
    const report = `📋 گزارش پیشرفت فاز ${phase.number} (${phase.title})
پروژه: ${currentProject.title}
کارفرما: ${currentProject.clientName}
درصد پیشرفت این فاز: ${percentage}٪ (${doneTasks} از ${totalTasks} تسک تکمیل شده)

خروجی‌های تحویلی این فاز:
${(phase.deliverables || []).map((d) => `✓ ${d}`).join('\n')}

وضعیت کلی: ${percentage === 100 ? 'تکمیل شده و آماده فاز بعدی' : 'در حال اجرا طبق نقشه راه استاندارد'}
`;
    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6 text-right">
      {/* Quick Phase Jumper Ribbon for Mobile & Desktop */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 sm:p-2.5 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-1.5 px-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
            <ListFilter className="w-3.5 h-3.5 text-cyan-400" />
            <span>پرش مستقیم به فاز:</span>
          </div>
          <span className="text-[11px] text-cyan-400 font-bold">
            فاز {phase.number} از {roadmap.length}
          </span>
        </div>

        {/* Horizontal scrollable phases pill buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none px-1">
          {roadmap.map((p) => {
            const isSelected = p.id === phase.id;
            const isProjectCurrent = p.id === currentProject.currentPhaseId;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPhase(p.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer min-h-[38px] ${
                  isSelected
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                    : isProjectCurrent
                    ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{p.number}</span>
                <span className="hidden sm:inline">• {p.title}</span>
                {isProjectCurrent && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls Bar (Touch targets >= 44px) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2">
          {prevPhase && (
            <button
              onClick={() => onSelectPhase(prevPhase.id)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-850 hover:bg-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-700 transition-colors cursor-pointer min-h-[44px] font-medium"
            >
              <ChevronRight className="w-4 h-4" />
              <span>فاز قبلی ({prevPhase.number})</span>
            </button>
          )}

          {nextPhase && (
            <button
              onClick={() => onSelectPhase(nextPhase.id)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-850 hover:bg-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-700 transition-colors cursor-pointer min-h-[44px] font-medium"
            >
              <span>فاز بعدی ({nextPhase.number})</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isCurrentActive && (
            <button
              onClick={() => onSetCurrentPhase(phase.id)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 text-xs bg-slate-850 hover:bg-slate-800 text-cyan-300 px-3.5 py-2.5 rounded-xl border border-cyan-500/40 transition-colors cursor-pointer min-h-[44px] font-semibold"
            >
              <Flag className="w-3.5 h-3.5 text-cyan-400" />
              <span>تنظیم فاز جاری پروژه</span>
            </button>
          )}

          <button
            onClick={copyClientProgressReport}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 text-xs bg-slate-850 hover:bg-slate-800 text-slate-200 px-3.5 py-2.5 rounded-xl border border-slate-700 transition-colors cursor-pointer min-h-[44px] font-medium"
            title="کپی گزارش برای ارسال به کارفرما"
          >
            {copiedReport ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
            <span>{copiedReport ? 'کپی شد!' : 'گزارش به کارفرما'}</span>
          </button>
        </div>
      </div>

      {/* Main Phase Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 p-4 sm:p-6 shadow-xl text-right">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-cyan-600 text-white font-bold text-xs shadow-md">
                فاز {phase.number} از {roadmap.length}
              </span>
              <span className="text-xs font-semibold text-slate-400 font-mono">
                {phase.titleEn}
              </span>
              {isCurrentActive && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                  📍 موقعیت جاری شما
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
              {phase.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {phase.shortDesc}
            </p>

            {/* Deliverables */}
            {phase.deliverables && phase.deliverables.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-xs text-slate-400 font-medium">خروجی‌های تحویلی فاز:</span>
                {phase.deliverables.map((deliv, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-700/60 text-cyan-300 text-xs font-mono font-semibold"
                  >
                    <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                    {deliv}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Progress Widget */}
          <div className="w-full lg:w-64 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">پیشرفت تسک‌های این فاز</span>
              <span className="text-sm font-bold text-cyan-400 font-mono">{percentage}٪</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 text-left">
              {doneTasks} از {totalTasks} تسک تکمیل شده
            </div>
          </div>
        </div>
      </div>

      {/* Professional Tips Card */}
      {phase.tips && phase.tips.length > 0 && (
        <div className="rounded-2xl bg-amber-950/30 border border-amber-800/50 p-4 text-right">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>نکات طلایی و تله‌های کاری دولوپرها در این فاز:</span>
          </div>
          <ul className="space-y-1.5 text-xs text-amber-200/90 pr-4 list-disc leading-relaxed">
            {phase.tips.map((tip, idx) => (
              <li key={idx}>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Task Filters & Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <span>چک‌لیست تسک‌های اجرایی فاز {phase.number}</span>
          <span className="text-xs font-normal text-slate-400">
            (لمس مستقیم روی هر تسک)
          </span>
        </h2>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer min-h-[36px] ${
              filter === 'all' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            همه ({totalTasks})
          </button>
          <button
            onClick={() => setFilter('incomplete')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer min-h-[36px] ${
              filter === 'incomplete' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            باقیمانده ({totalTasks - doneTasks})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer min-h-[36px] ${
              filter === 'completed' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            انجام‌شده ({doneTasks})
          </button>
        </div>
      </div>

      {/* Task Groups */}
      <div className="space-y-4 sm:space-y-6">
        {phase.groups.map((group) => {
          const visibleTasks = group.tasks.filter((t) => {
            const isDone = Boolean(currentProject.completedTasks[t.id]);
            if (filter === 'incomplete') return !isDone;
            if (filter === 'completed') return isDone;
            return true;
          });

          if (visibleTasks.length === 0 && filter !== 'all') return null;

          return (
            <div
              key={group.id}
              className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 text-right space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <h3 className="text-xs sm:text-sm font-bold text-cyan-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  {group.title}
                </h3>
                <span className="text-[11px] text-slate-400">
                  {visibleTasks.length} تسک
                </span>
              </div>

              <div className="space-y-2">
                {visibleTasks.map((task) => {
                  const isDone = Boolean(currentProject.completedTasks[task.id]);
                  return (
                    <div
                      key={task.id}
                      onClick={() => onToggleTask(task.id)}
                      className={`group flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none min-h-[48px] active:scale-[0.99] ${
                        isDone
                          ? 'bg-slate-950/60 border-emerald-900/60 text-slate-400'
                          : 'bg-slate-950/80 border-slate-800 hover:border-cyan-600/60 text-slate-100 hover:bg-slate-950'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 shrink-0 focus:outline-none p-0.5"
                        aria-label={isDone ? 'علامت به عنوان انجام‌نشده' : 'علامت به عنوان انجام‌شده'}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                        )}
                      </button>

                      <div className="flex-1 text-xs sm:text-sm leading-relaxed">
                        <span className={isDone ? 'line-through text-slate-400' : 'font-medium'}>
                          {task.text}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Custom Tasks Group */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 text-right space-y-3 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <h3 className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              تسک‌های اختصاصی شما ({customTasksList.length})
            </h3>
            <span className="text-[11px] text-slate-400">تسک دلخواه خود را اضافه کنید</span>
          </div>

          {/* Add custom task form (full-width touch controls) */}
          <form onSubmit={handleAddCustom} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newCustomTaskText}
              onChange={(e) => setNewCustomTaskText(e.target.value)}
              placeholder="تسک جدید خود را بنویسید..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors min-h-[44px]"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن تسک</span>
            </button>
          </form>

          {/* Custom tasks list */}
          <div className="space-y-2 pt-1">
            {customTasksList.map((ct) => (
              <div
                key={ct.id}
                className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all min-h-[48px] ${
                  ct.isDone
                    ? 'bg-slate-950/60 border-emerald-900/60 text-slate-400'
                    : 'bg-slate-950/80 border-slate-800 text-slate-100'
                }`}
              >
                <div
                  onClick={() => onToggleCustomTask(phase.id, ct.id)}
                  className="flex items-start gap-3 flex-1 cursor-pointer select-none"
                >
                  <button type="button" className="mt-0.5 shrink-0 p-0.5">
                    {ct.isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 hover:text-amber-400" />
                    )}
                  </button>
                  <span className={`text-xs sm:text-sm leading-relaxed ${ct.isDone ? 'line-through text-slate-400' : 'font-medium'}`}>
                    {ct.text}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteCustomTask(phase.id, ct.id)}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                  title="حذف این تسک"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Phase Developer Notes / Scratchpad */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 text-right space-y-3 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <h3 className="text-xs sm:text-sm font-bold text-cyan-300 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              یادداشت‌های اختصاصی دولوپر برای فاز {phase.number}
            </h3>
            {isNoteSaved && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold">
                <Check className="w-3.5 h-3.5" /> ذخیره شد
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            نکات، لینک‌های تست، تصمیمات فنی یا درخواست‌های ویژه مشتری برای این فاز را یادداشت کنید.
          </p>

          <textarea
            rows={4}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="مثلاً: درگاه تست آماده شد؛ مشتری تأکید کرد رنگ اصلی لوگو فیروزه‌ای تیره باشد..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              onClick={handleSaveNote}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-600/20 transition-colors cursor-pointer min-h-[44px]"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره یادداشت این فاز</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
