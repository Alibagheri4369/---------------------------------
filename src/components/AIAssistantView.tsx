import { useState } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Lightbulb, 
  ShieldAlert, 
  Zap, 
  Layers, 
  ArrowRight,
  Bot,
  Copy,
  Check
} from 'lucide-react';
import { Project } from '../types';
import { UNIVERSAL_25_PHASES_BASE } from '../data/universalLifecycle';

interface AIAssistantViewProps {
  currentProject: Project | null;
  onNavigateToPhase: (phaseId: number) => void;
  onOpenNewProjectModal?: () => void;
}

export default function AIAssistantView({ 
  currentProject, 
  onNavigateToPhase,
  onOpenNewProjectModal 
}: AIAssistantViewProps) {
  const [userQuery, setUserQuery] = useState('');
  const [conversation, setConversation] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!currentProject) {
    return (
      <div className="p-8 sm:p-14 text-center bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4 text-right animate-fade-in">
        <Bot className="w-14 h-14 text-cyan-400 mx-auto" />
        <h2 className="text-lg sm:text-xl font-bold text-white text-center">
          هیچ پروژه‌ای برای تحلیل دستیار هوش مصنوعی انتخاب نشده است
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto text-center leading-relaxed">
          دستیار هوشمند با خواندن فاز جاری، استک فنی و ماژول‌های فعال پروژه شما، هشدارهای امنیتی و پیشنهادات فنی ارائه می‌دهد.
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

  const activePhase = UNIVERSAL_25_PHASES_BASE.find((p) => p.id === currentProject.currentPhaseId) || UNIVERSAL_25_PHASES_BASE[0];
  const activeModules = currentProject.selectedModules || [];

  // Generate dynamic contextual warnings & recommendations
  const dynamicAdvice: { type: 'alert' | 'tip' | 'architecture'; title: string; desc: string; phaseId?: number }[] = [];

  // Module-specific checks
  if (activeModules.includes('payment')) {
    dynamicAdvice.push({
      type: 'alert',
      title: 'کنترل حملات دوبار شارژ درگاه بانکی (Idempotency)',
      desc: 'در فاز ۱۵ (یکپارچه‌سازی) حتماً وب‌هوک وریفای پرداخت را با کلید یکتای سفارش قفل کنید تا با رفرش صفحه توسط کاربر، تراکنش دوبار ثبت نشود.',
      phaseId: 14,
    });
  }

  if (activeModules.includes('booking')) {
    dynamicAdvice.push({
      type: 'alert',
      title: 'مهار رزرو همزمان یک بازه زمانی (Double Booking Race Condition)',
      desc: 'در الگوریتم رزرو تقویم، از تراکنش‌های ایزوله دیتابیس (SELECT FOR UPDATE) استفاده کنید تا دو کاربر همزمان یک تایم خالی را نگیرند.',
      phaseId: 13,
    });
  }

  if (activeModules.includes('ai')) {
    dynamicAdvice.push({
      type: 'architecture',
      title: 'مدیریت هزینه‌ها و محدودیت پرامپت (Token Rate Limiting)',
      desc: 'مدل هوش مصنوعی را پشت صف پردازش و سیستم کردیت بگذارید و ورودی‌ها را برای جلوگیری از حملات Prompt Injection اسکن کنید.',
      phaseId: 13,
    });
  }

  if (activeModules.includes('sms_notifications')) {
    dynamicAdvice.push({
      type: 'tip',
      title: 'استفاده از خطوط خدماتی بدون بلاک‌لیست (Pattern SMS)',
      desc: 'برای ارسال OTP و تایید ثبت‌نام حتماً از وب‌سرویس پترن خدماتی استفاده کنید تا پیامک‌ها به مخاطبانی که تبلیغات را مسدود کرده‌اند تحویل داده شود.',
      phaseId: 14,
    });
  }

  // Phase-specific guidance
  if (currentProject.currentPhaseId <= 7) {
    dynamicAdvice.push({
      type: 'tip',
      title: 'قفل کردن مرزهای تعهدات قبل از شروع کدنویسی',
      desc: 'شما در مراحل ابتدایی هستید. مطمئن شوید جدول مایلستون‌ها و ۴۰٪ پیش‌پرداخت رسمی دریافت شده است تا در آینده با درخواست‌های بی‌پایان کارفرما مواجه نشوید.',
      phaseId: 6,
    });
  } else if (currentProject.currentPhaseId >= 13 && currentProject.currentPhaseId <= 15) {
    dynamicAdvice.push({
      type: 'tip',
      title: 'ارائه دمو زودهنگام در محیط تستی (Staging)',
      desc: 'در پایان این اسپرینت یک لینک استیجینگ به کارفرما بدهید تا فیدبک‌های اولیه ثبت شوند و غافلگیری در فاز تحویل نهایی پیش نیاید.',
      phaseId: currentProject.currentPhaseId,
    });
  }

  const handleSendMessage = (textToSend?: string) => {
    const q = textToSend || userQuery;
    if (!q.trim()) return;

    const newConv = [...conversation, { role: 'user' as const, text: q }];
    setConversation(newConv);
    setUserQuery('');
    setIsGenerating(true);

    setTimeout(() => {
      let answer = '';
      const lowerQ = q.toLowerCase();

      if (lowerQ.includes('امنیت') || lowerQ.includes('security')) {
        answer = `برای پروژه «${currentProject.title}» با توجه به استک انتخابی (${currentProject.techStack?.backend || 'بک‌اند'})، مهم‌ترین موارد امنیتی عبارتند از:\n۱. نگهداری توکن‌های ورود در کوکی HttpOnly با پرچم Secure\n۲. اعمال Rate Limit بر روی مسیرهای پیامک و ورود\n۳. فیلتر کردن ورودی‌ها با Zod جهت مقابله با SQLi و XSS\n۴. تنظیم دامنه دقیق در هدر CORS`;
      } else if (lowerQ.includes('قرارداد') || lowerQ.includes('قیمت') || lowerQ.includes('کارفرما')) {
        answer = `در زمینه قرارداد برای ${currentProject.projectType}:\n۱. هزینه را ۳ لایه‌ای تفکیک کنید: هزینه توسعه + هزینه زیرساخت و اکانت‌ها + هزینه نگهداری ماهانه.\n۲. مالکیت تمام اکانت‌ها (دامنه، هاست و پنل پیامک) باید به نام خود کارفرما باشد و شما صرفاً دسترسی دولوپر داشته باشید.\n۳. گارانتی رایگان رفع باگ را حداکثر ۱ تا ۳ ماه تعیین کنید و پس از آن قرارداد پشتیبانی SLA ماهانه ببندید.`;
      } else if (lowerQ.includes('تسک') || lowerQ.includes('بعدی') || lowerQ.includes('کجا')) {
        answer = `در حال حاضر شما در فاز ${activePhase.number} یعنی «${activePhase.title}» قرار دارید.\nتوصیه مستقیم برای گام بعدی:\n۱. بررسی تسک‌های باقیمانده فاز جاری در تب چک‌لیست\n۲. هماهنگی جلسه تحویل خروجی‌های این فاز (${activePhase.deliverables?.join('، ') || 'مستندات'})\n۳. پس از تکمیل، وضعیت فاز را به فاز بعدی ارتقا دهید.`;
      } else {
        answer = `با بررسی وضعیت پروژه «${currentProject.title}»:\n- نوع پروژه: ${currentProject.projectType}\n- فاز فعلی: فاز ${activePhase.number} (${activePhase.title})\n- تعداد ماژول‌های فعال: ${activeModules.length} ماژول\n\nپیشنهاد فنی: تمرکز اصلی شما در این مرحله باید روی تکمیل تحویل‌دادنی‌های فاز جاری (${activePhase.deliverables?.join('، ') || 'مستندات فنی'}) و دریافت تاییدیه کارفرما باشد. سوال یا دغدغه خاصی در مورد معماری یا کتابخانه‌ها دارید بفرمایید تا دقیق بررسی کنیم.`;
      }

      setConversation([...newConv, { role: 'assistant', text: answer }]);
      setIsGenerating(false);
    }, 600);
  };

  const copyText = (txt: string, idx: number) => {
    navigator.clipboard.writeText(txt);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-8 text-right">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950/40 to-slate-900 border border-teal-500/40 p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold">
              <Bot className="w-3.5 h-3.5 text-teal-400" />
              مشاور و دستیار هوشمند فنی پروژه (AI Project Advisor)
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              تحلیل هوشمند وضعیت پروژه و هشدارهای پیشگیرانه
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              دستیار هوش مصنوعی به صورت لحظه‌ای معماری، ماژول‌ها، فاز فعلی ({activePhase.number}: {activePhase.title}) و چک‌لیست‌های پروژه «{currentProject.title}» را پایش می‌کند و هشدارهای امنیتی و معماری متناسب ارائه می‌دهد.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-teal-300 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800">
            <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
            <span>پایش خودکار فعال است</span>
          </div>
        </div>
      </div>

      {/* Dynamic Smart Alerts */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>هشدارهای کلیدی و نکات فنی متناسب با ماژول‌های فعال پروژه</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dynamicAdvice.map((adv, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3 ${
                adv.type === 'alert'
                  ? 'bg-amber-950/20 border-amber-500/40 text-slate-200'
                  : adv.type === 'architecture'
                  ? 'bg-indigo-950/20 border-indigo-500/40 text-slate-200'
                  : 'bg-teal-950/20 border-teal-500/40 text-slate-200'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    {adv.type === 'alert' && <ShieldAlert className="w-4 h-4 text-amber-400" />}
                    {adv.type === 'architecture' && <Layers className="w-4 h-4 text-indigo-400" />}
                    {adv.type === 'tip' && <Lightbulb className="w-4 h-4 text-teal-400" />}
                    <span>{adv.title}</span>
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {adv.desc}
                </p>
              </div>

              {adv.phaseId !== undefined && (
                <div className="pt-2 border-t border-slate-800/80 flex justify-end">
                  <button
                    onClick={() => onNavigateToPhase(adv.phaseId!)}
                    className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                  >
                    <span>مشاهده در فاز مربوطه</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Project Chat Advisor */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Bot className="w-4 h-4 text-teal-400" />
            <span>پرسش و پاسخ تعاملی با هوش مصنوعی درباره این پروژه</span>
          </h2>
          <span className="text-xs text-slate-400">
            پاسخ‌ها بر اساس استک و نیازمندی‌های این پروژه تنظیم می‌شوند
          </span>
        </div>

        {/* Preset Prompt Buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            'در این فاز چه خروجی‌هایی باید به کارفرما بدهم؟',
            'چک‌لیست امنیتی فوری برای بک‌اند و درگاه چیست؟',
            'بهترین استراتژی کشینگ برای این پروژه چیست؟',
            'متن بند گارانتی و پشتیبانی قرارداد چگونه باید باشد؟',
          ].map((promptText, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleSendMessage(promptText)}
              className="text-xs bg-slate-950 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-800 transition-colors cursor-pointer"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="min-h-[220px] max-h-[360px] overflow-y-auto space-y-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 scrollbar-thin">
          {conversation.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-slate-400 text-xs space-y-2">
              <Bot className="w-8 h-8 text-teal-500/60" />
              <span>هر سوالی در مورد قرارداد، نحوه تعامل با کارفرما، کدنویسی و دیپلوی دارید بپرسید.</span>
            </div>
          ) : (
            conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl text-xs leading-relaxed max-w-[85%] whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'mr-auto bg-cyan-600 text-white rounded-bl-none'
                    : 'ml-auto bg-slate-900 border border-slate-800 text-slate-200 rounded-br-none'
                }`}
              >
                <div className="flex items-center justify-between mb-1 gap-4">
                  <span className="font-bold text-[10px] opacity-75">
                    {msg.role === 'user' ? 'دولوپر' : 'دستیار هوشمند پروژه'}
                  </span>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => copyText(msg.text, idx)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                      title="کپی پاسخ"
                    >
                      {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
                {msg.text}
              </div>
            ))
          )}
          {isGenerating && (
            <div className="ml-auto bg-slate-900 border border-slate-800 text-slate-400 p-3 rounded-xl text-xs flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-spin" />
              <span>در حال تحلیل و تولید پاسخ بر اساس زمینه پروژه...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="سوال خود را درباره روند، تسک‌ها یا معماری بنویسید..."
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-xs text-white outline-none"
          />
          <button
            onClick={() => handleSendMessage()}
            className="px-5 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-teal-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 rotate-180" />
            <span>ارسال</span>
          </button>
        </div>
      </div>
    </div>
  );
}
