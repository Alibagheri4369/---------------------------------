import { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ArrowLeft, 
  Sparkles, 
  Flag, 
  ChevronLeft, 
  Compass, 
  Clock, 
  FileText, 
  AlertCircle,
  Filter,
  Layers,
  Puzzle
} from 'lucide-react';
import { Phase, Project } from '../types';
import { generateProjectRoadmap } from '../data/universalLifecycle';
import { useI18n } from '../i18n/I18nProvider';

interface VisualRoadmapProps {
  currentProject: Project | null;
  onSelectPhase: (phaseId: number) => void;
  onSetCurrentPhase: (phaseId: number) => void;
  onOpenNewProjectModal?: () => void;
}

export function VisualRoadmap({
  currentProject,
  onSelectPhase,
  onSetCurrentPhase,
  onOpenNewProjectModal,
}: VisualRoadmapProps) {
  const { t } = useI18n();
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'remaining' | 'done'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'Pre' | 'Planning' | 'Design' | 'Development' | 'Integration' | 'QA' | 'Deployment' | 'Maintenance'>('all');

  if (!currentProject) {
    return (
      <div className="p-8 sm:p-14 text-center bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4 text-right animate-fade-in">
        <Compass className="w-14 h-14 text-cyan-400 mx-auto" />
        <h2 className="text-lg sm:text-xl font-bold text-white text-center">
          {t('roadmap.noProject')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto text-center leading-relaxed">
          {t('roadmap.noProjectDescription')}
        </p>
        {onOpenNewProjectModal && (
          <div className="pt-2 text-center">
            <button
              onClick={onOpenNewProjectModal}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-lg cursor-pointer min-h-[44px]"
            >
              {t('roadmap.createFirstProject')}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Generate dynamic roadmap based on project modules and type
  const roadmap = generateProjectRoadmap(currentProject);

  // Calculate task counts
  const totalTasks = roadmap.reduce((acc, phase) => {
    const defaultTasksCount = phase.groups.reduce((gAcc, g) => gAcc + g.tasks.length, 0);
    const customTasksCount = (currentProject.customTasks[phase.id] || []).length;
    return acc + defaultTasksCount + customTasksCount;
  }, 0);

  const completedTasksCount = Object.values(currentProject.completedTasks).filter(Boolean).length;
  const overallPercentage = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  // Active Phase Details
  const activePhase = roadmap.find((p) => p.id === currentProject.currentPhaseId) || roadmap[0];
  const activeIndex = roadmap.findIndex((p) => p.id === activePhase.id);
  const nextPhase = activeIndex >= 0 && activeIndex < roadmap.length - 1 ? roadmap[activeIndex + 1] : null;

  // Helper to get completion % for a specific phase
  const getPhaseProgress = (phase: Phase) => {
    let pTotal = 0;
    let pDone = 0;
    phase.groups.forEach((g) => {
      g.tasks.forEach((t) => {
        pTotal++;
        if (currentProject.completedTasks[t.id]) pDone++;
      });
    });
    const customList = currentProject.customTasks[phase.id] || [];
    customList.forEach((ct) => {
      pTotal++;
      if (ct.isDone) pDone++;
    });
    return {
      total: pTotal,
      done: pDone,
      percent: pTotal > 0 ? Math.round((pDone / pTotal) * 100) : 0,
      isFullyDone: pTotal > 0 && pDone === pTotal,
    };
  };

  const filteredPhases = roadmap.filter((phase) => {
    const { isFullyDone } = getPhaseProgress(phase);
    const isCurrent = phase.id === currentProject.currentPhaseId;

    // Status filter
    if (statusFilter === 'done' && !isFullyDone) return false;
    if (statusFilter === 'in_progress' && !isCurrent) return false;
    if (statusFilter === 'remaining' && (isFullyDone || isCurrent)) return false;

    // Category filter
    if (categoryFilter !== 'all') {
      if (categoryFilter === 'Pre' && phase.id > 3) return false;
      if (categoryFilter === 'Planning' && (phase.id < 4 || phase.id > 7)) return false;
      if (categoryFilter === 'Design' && (phase.id < 8 || phase.id > 10)) return false;
      if (categoryFilter === 'Development' && (phase.id < 11 || phase.id > 13)) return false;
      if (categoryFilter === 'Integration' && (phase.id < 14 || phase.id > 15)) return false;
      if (categoryFilter === 'QA' && (phase.id < 16 || phase.id > 19)) return false;
      if (categoryFilter === 'Deployment' && (phase.id < 20 || phase.id > 22)) return false;
      if (categoryFilter === 'Maintenance' && phase.id < 23) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 text-right">
      {/* Top GPS / Status Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 p-5 md:p-6 shadow-xl">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-row lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Current Location & Target */}
          <div className="space-y-2 max-w-2xl text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              {t('roadmap.currentLocation')} {activePhase.number} {t('roadmap.phases')} {roadmap.length} {t('roadmap.standardPhases')}
            </div>

            <h2 className="text-xl md:text-2xl font-black text-white">
              {activePhase.title}
              <span className="text-sm font-normal text-slate-400 mr-2 font-mono">({activePhase.titleEn})</span>
            </h2>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {activePhase.shortDesc}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400">{t('roadmap.nextStep')}:</span>
              {nextPhase ? (
                <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1 font-medium">
                  <ArrowLeft className="w-3 h-3 text-cyan-400" />
                  {t('roadmap.phase')} {nextPhase.number}: {nextPhase.title}
                </span>
              ) : (
                <span className="bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-800">
                  {t('roadmap.congratulations')}
                </span>
              )}
            </div>
          </div>

          {/* Progress Gauge & Action */}
          <div className="w-full lg:w-72 bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{t('roadmap.overallProgress')}:</span>
              <span className="font-bold text-cyan-400 text-sm">{overallPercentage}٪</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{completedTasksCount} {t('roadmap.completedTasks')}</span>
              <span>{t('roadmap.outOf')} {totalTasks} {t('roadmap.tasks')}</span>
            </div>

            <button
              onClick={() => onSelectPhase(activePhase.id)}
              className="w-full mt-1 py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/20 cursor-pointer"
            >
              <span>{t('roadmap.viewAndCheckTasks')}</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {[
          { id: 'all', label: t('roadmap.allPhases') },
          { id: 'Pre', label: t('roadmap.preCategory') },
          { id: 'Planning', label: t('roadmap.planningCategory') },
          { id: 'Design', label: t('roadmap.designCategory') },
          { id: 'Development', label: t('roadmap.developmentCategory') },
          { id: 'Integration', label: t('roadmap.integrationCategory') },
          { id: 'QA', label: t('roadmap.qaCategory') },
          { id: 'Deployment', label: t('roadmap.deploymentCategory') },
          { id: 'Maintenance', label: t('roadmap.maintenanceCategory') },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setCategoryFilter(c.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              categoryFilter === c.id
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/25'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-slate-800">
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white">{t('roadmap.applicablePhases')}:</span>
          <span className="text-slate-400">{t('roadmap.showing', { count: filteredPhases.length })} {t('roadmap.outOf')} {roadmap.length} {t('roadmap.roadmapPhases')}</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              statusFilter === 'all' ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('roadmap.allStatus')}
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              statusFilter === 'in_progress' ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('roadmap.currentPhase')}
          </button>
          <button
            onClick={() => setStatusFilter('remaining')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              statusFilter === 'remaining' ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('roadmap.remaining')}
          </button>
          <button
            onClick={() => setStatusFilter('done')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              statusFilter === 'done' ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('roadmap.completed')}
          </button>
        </div>
      </div>

      {/* Interactive Visual Roadmap Cards / Pipeline */}
      <div className="relative space-y-4">
        {filteredPhases.map((phase) => {
          const { total, done, percent, isFullyDone } = getPhaseProgress(phase);
          const isCurrent = phase.id === currentProject.currentPhaseId;

          return (
            <div
              key={phase.id}
              className={`group relative rounded-xl border transition-all duration-200 overflow-hidden ${
                isCurrent
                  ? 'bg-gradient-to-r from-slate-900 to-slate-850 border-cyan-500/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50'
                  : isFullyDone
                  ? 'bg-slate-900/60 border-emerald-800/60 hover:border-emerald-700'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
              }`}
            >
              {/* Left Color Edge Accent */}
              <div
                className={`absolute top-0 right-0 bottom-0 w-1.5 bg-gradient-to-b ${
                  isCurrent ? 'from-cyan-400 to-blue-500' : isFullyDone ? 'from-emerald-400 to-teal-500' : 'from-slate-700 to-slate-800'
                }`}
              />

              <div className="p-4 sm:p-5 pr-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Left info: Phase Number, Icon, Title, Description */}
                <div className="flex items-start gap-3.5 flex-1 text-right">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-md ${
                      isCurrent
                        ? 'bg-cyan-500 text-slate-950 font-black ring-4 ring-cyan-500/20'
                        : isFullyDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {isFullyDone ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : (
                      <span>{phase.number}</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        onClick={() => onSelectPhase(phase.id)}
                        className="font-bold text-base text-white cursor-pointer hover:text-cyan-300 transition-colors"
                      >
                        فاز {phase.number}: {phase.title}
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">({phase.titleEn})</span>

                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                          {t('roadmap.yourCurrentPhase')}
                        </span>
                      )}
                      {isFullyDone && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {t('roadmap.completedCheckmark')}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                      {phase.shortDesc}
                    </p>

                    {/* Deliverables / Outputs badges */}
                    {phase.deliverables && phase.deliverables.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] text-slate-400">{t('roadmap.importantOutput')}:</span>
                        {phase.deliverables.map((d, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/90 text-cyan-300 text-[11px] font-mono border border-slate-700"
                          >
                            <FileText className="w-3 h-3 text-cyan-400" />
                            {d}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right controls: Progress & Action buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between md:justify-end gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                  {/* Phase Mini Progress */}
                  <div className="flex items-center justify-between sm:block text-right min-w-[110px]">
                    <div className="text-xs font-semibold text-slate-200">
                      {done} از {total} تسک ({percent}٪)
                    </div>
                    <div className="w-24 sm:w-28 h-2 bg-slate-800 rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isFullyDone ? 'bg-emerald-400' : 'bg-cyan-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isCurrent && (
                      <button
                        onClick={() => onSetCurrentPhase(phase.id)}
                        className="flex-1 sm:flex-initial px-3 py-2.5 rounded-xl text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-colors cursor-pointer min-h-[44px] flex items-center justify-center font-medium"
                        title="تنظیم به عنوان موقعیت فعلی در پروژه"
                      >
                        {t('roadmap.setAsCurrentPhase')}
                      </button>
                    )}

                    <button
                      onClick={() => onSelectPhase(phase.id)}
                      className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] ${
                        isCurrent
                          ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
                      }`}
                    >
                      <span>{t('roadmap.enterChecklist')}</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}