import { useState, FormEvent } from 'react';
import { 
  X, 
  FolderPlus, 
  Building2, 
  Tag, 
  Sparkles, 
  Layers, 
  Check, 
  Search, 
  Sliders, 
  DollarSign, 
  Calendar,
  ChevronRight,
  ChevronLeft,
  Cpu,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { UNIVERSAL_PROJECT_TYPES } from '../data/universalProjectTypes';
import { TECH_PRESETS } from '../data/techStackPresets';
import { TechStackConfig, BusinessModel, ProjectComplexity } from '../types';
import { useI18n } from '../i18n/I18nProvider';
import { rialToTomanWords, formatNumber } from '../utils/numberToWords';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (
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
  ) => void;
}

export default function NewProjectModal({
  isOpen,
  onClose,
  onCreateProject,
}: NewProjectModalProps) {
  const { t } = useI18n();
  // Wizard current step: 1 to 4
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form states
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [selectedTypeIds, setSelectedTypeIds] = useState<string[]>(['ecommerce_standard']);
  
  const [businessModel, setBusinessModel] = useState<BusinessModel>('B2C');
  const [complexity, setComplexity] = useState<ProjectComplexity>('Standard');
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Steps for the wizard
  const stepsList = [
    { num: 1, title: t('newProjectStep1') },
    { num: 2, title: t('newProjectStep2') },
    { num: 3, title: t('newProjectStep3') },
    { num: 4, title: t('newProjectStep4') },
  ];

  // Extract unique categories for project types
  const categories = ['همه', ...Array.from(new Set(UNIVERSAL_PROJECT_TYPES.map((t) => t.category)))];

  // Filter project types
  const filteredTypes = UNIVERSAL_PROJECT_TYPES.filter((t) => {
    const matchesCat = selectedCategory === 'همه' || t.category === selectedCategory;
    const matchesSearch =
      t.nameFa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleType = (id: string) => {
    if (selectedTypeIds.includes(id)) {
      if (selectedTypeIds.length === 1) return; // Keep at least 1
      setSelectedTypeIds(selectedTypeIds.filter((t) => t !== id));
    } else {
      setSelectedTypeIds([...selectedTypeIds, id]);
    }
  };

  const validateStep = (step: number): boolean => {
    setErrorMsg('');
    if (step === 1) {
      if (!title.trim()) {
        setErrorMsg(t('newProjectTitleRequired'));
        return false;
      }
      if (!clientName.trim()) {
        setErrorMsg(t('newProjectClientNameRequired'));
        return false;
      }
    }
    if (step === 2) {
      if (selectedTypeIds.length === 0) {
        setErrorMsg(t('newProjectProjectTypeRequired'));
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setErrorMsg('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!validateStep(1) || !validateStep(2)) return;

    // Determine primary display type name
    const primaryTypeObj = UNIVERSAL_PROJECT_TYPES.find((t) => t.id === selectedTypeIds[0]);
    const displayType = primaryTypeObj
      ? selectedTypeIds.length > 1
        ? `${primaryTypeObj.nameFa} + هایبرید (${selectedTypeIds.length} نوع)`
        : primaryTypeObj.nameFa
      : 'پروژه وب چندمنظوره';

    // Auto calculate recommended modules across all selected types
    const allRecommendedModules = new Set<string>();
    selectedTypeIds.forEach((typeId) => {
      const found = UNIVERSAL_PROJECT_TYPES.find((t) => t.id === typeId);
      if (found) {
        found.recommendedModules.forEach((m) => allRecommendedModules.add(m));
      }
    });

    onCreateProject(
      title.trim(),
      clientName.trim(),
      displayType,
      budget.trim() || undefined,
      deadline.trim() || undefined,
      {
        projectTypes: selectedTypeIds,
        selectedModules: Array.from(allRecommendedModules),
        businessModel,
        complexity,
        techStack: TECH_PRESETS[selectedPresetIdx]?.stack,
      }
    );
    onClose();
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-hidden">
      <div 
        className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl bg-slate-900 sm:border sm:border-slate-700/90 sm:rounded-3xl shadow-2xl flex flex-col text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Stripe */}
        <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 shrink-0" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between text-right shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {t('newProjectTitle')}
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400">
                {t('newProjectSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={t('close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Stepper Progress Bar */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-3 shrink-0">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-cyan-400 font-bold">
              گام {currentStep} از ۴: {t(stepsList[currentStep - 1].title)}
            </span>
            <span className="text-slate-400 text-[11px] font-mono">
              {Math.round((currentStep / 4) * 100)}٪
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 h-1.5">
            {stepsList.map((st) => (
              <div
                key={st.num}
                className={`rounded-full transition-all duration-300 ${
                  currentStep >= st.num
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Error Message Box */}
        {errorMsg && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs text-right animate-fade-in shrink-0">
            {errorMsg}
          </div>
        )}

        {/* Scrollable Wizard Step Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-right scrollbar-thin">
          {/* STEP 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  عنوان پروژه: <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="عنوان پروژه را وارد کنید"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 min-h-[46px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  نام مشتری یا برند کارفرما: <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="نام مشتری یا برند کارفرما را وارد کنید"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 min-h-[46px]"
                  />
                  <Building2 className="w-4 h-4 text-slate-400 absolute top-3.5 right-3.5 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    بودجه تخمینی:
                  </label>
                  <div className="relative">
                    <span className="absolute top-3 right-3 text-xs text-slate-400 pointer-events-none font-semibold">ریال</span>
                    <input
                      type="text"
                      value={budget ? formatNumber(Number(budget)) : ''}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/,/g, '');
                        if (rawValue === '' || /^\d+$/.test(rawValue)) {
                          setBudget(rawValue);
                        }
                      }}
                      placeholder="مثال: 5,000,000"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 pr-12 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 min-h-[44px] text-left"
                      dir="ltr"
                    />
                  </div>
                  {budget && Number(budget) > 0 && (
                    <p className="text-[10px] text-emerald-400 mt-1.5 font-medium">
                      💰 {rialToTomanWords(Number(budget))}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-500 mt-1">مبلغ را به ریال وارد کنید</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    ددلاین تحویل نهایی:
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute top-3 right-3 pointer-events-none" />
                    <input
                      type="text"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      placeholder="مثال: ۱۴۰۳/۱۰/۱۵ یا 3 ماه"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 min-h-[44px]"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">تاریخ یا مدت زمان تخمینی</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 leading-relaxed">
                💡 در گام‌های بعدی می‌توانید نوع پروژه، ماژول‌های فنی و تکنولوژی استک را به سادگی سفارشی‌سازی کنید.
              </div>
            </div>
          )}

          {/* STEP 2: Project Type Selection (81+ types, Categories & Hybrid) */}
          {currentStep === 2 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">
                  انتخاب نوع پروژه (امکان انتخاب ترکیبی/هایبرید):
                </span>
                <span className="text-[11px] text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-lg border border-cyan-800">
                  {selectedTypeIds.length} نوع انتخاب شده
                </span>
              </div>

              {/* Category Pills Slider */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer min-h-[36px] ${
                      selectedCategory === cat
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="جستجو (مثلاً: فروشگاه، کلینیک، صرافی، SaaS، املاک، رزرو...)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 min-h-[44px]"
                />
              </div>

              {/* Types Grid with Comfortable Touch Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-0.5 scrollbar-thin">
                {filteredTypes.slice(0, 30).map((typeObj) => {
                  const isSelected = selectedTypeIds.includes(typeObj.id);
                  return (
                    <div
                      key={typeObj.id}
                      onClick={() => toggleType(typeObj.id)}
                      className={`p-3 rounded-2xl text-xs flex items-center justify-between cursor-pointer transition-all border min-h-[52px] select-none ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-md'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="truncate pl-2">
                        <div className="font-bold text-white truncate">{typeObj.nameFa}</div>
                        <div className="text-[10px] text-slate-400 truncate">{typeObj.nameEn} • {typeObj.category}</div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-cyan-500 text-slate-950 font-bold' : 'border border-slate-700 bg-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Business Model & Complexity */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  مدل کسب‌وکار (Business Model):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'B2C', title: 'B2C', desc: 'فروش و خدمات مستقیم به مشتری نهایی' },
                    { id: 'B2B', title: 'B2B', desc: 'سازمانی، شرکتی و عمده‌فروشی' },
                    { id: 'Marketplace', title: 'مارکت‌پلیس', desc: 'چندفروشندگی (Multi-Vendor)' },
                    { id: 'Subscription', title: 'اشتراکی / SaaS', desc: 'پرداخت دوره‌ای و پلن‌های عضویت' },
                    { id: 'Freemium', title: 'فریمیوم', desc: 'پلن رایگان + خرید ارتقای امکانات' },
                    { id: 'Consultation', title: 'مشاوره‌ای و خدماتی', desc: 'نوبت‌دهی و پروژه‌های سفارشی' },
                  ].map((bm) => (
                    <div
                      key={bm.id}
                      onClick={() => setBusinessModel(bm.id as BusinessModel)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all select-none min-h-[50px] ${
                        businessModel === bm.id
                          ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">{bm.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{bm.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  سطح پیچیدگی و وسعت (Complexity):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'MVP', title: 'MVP', desc: 'سریع و کمینه' },
                    { id: 'Standard', title: 'استاندارد', desc: 'متعادل و کامل' },
                    { id: 'Advanced', title: 'پیشرفته', desc: 'چندماژوله' },
                    { id: 'Enterprise', title: 'سازمانی', desc: 'ترافیک بالا' },
                  ].map((comp) => (
                    <div
                      key={comp.id}
                      onClick={() => setComplexity(comp.id as ProjectComplexity)}
                      className={`p-3 rounded-2xl border cursor-pointer text-center transition-all select-none min-h-[50px] ${
                        complexity === comp.id
                          ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">{comp.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{comp.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Tech Stack & Review */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  استک فناوری پیشنهادی اولیه:
                </label>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-0.5 scrollbar-thin">
                  {TECH_PRESETS.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedPresetIdx(idx)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all select-none min-h-[54px] flex items-center justify-between ${
                        selectedPresetIdx === idx
                          ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-white">{preset.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{preset.description}</div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPresetIdx === idx ? 'border-cyan-400 bg-cyan-500' : 'border-slate-700'}`}>
                        {selectedPresetIdx === idx && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2 text-xs">
                <div className="text-slate-400 font-bold border-b border-slate-800/80 pb-1.5">
                  خلاصه پروژه آماده ثبت:
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>عنوان: <strong className="text-white">{title}</strong></div>
                  <div>کارفرما: <strong className="text-white">{clientName}</strong></div>
                  <div>مدل: <strong className="text-cyan-300">{businessModel}</strong></div>
                  <div>پیچیدگی: <strong className="text-emerald-300">{complexity}</strong></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Bottom Action Bar for Mobile & Desktop */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/95 flex items-center justify-between gap-3 shrink-0 pb-safe">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer min-h-[44px]"
            >
              <ChevronRight className="w-4 h-4" />
              <span>مرحله قبل</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white font-medium text-xs cursor-pointer min-h-[44px]"
            >
              انصراف
            </button>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-cyan-600/30 cursor-pointer min-h-[44px]"
            >
              <span>مرحله بعد</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSubmit()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-600/30 cursor-pointer min-h-[44px]"
            >
              <FolderPlus className="w-4 h-4" />
              <span>تولید نقشه راه و شروع</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
