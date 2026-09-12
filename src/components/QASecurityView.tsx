import { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Circle, 
  Smartphone, 
  Laptop, 
  Globe, 
  Lock, 
  Zap, 
  Search, 
  AlertTriangle, 
  Sliders,
  Check,
  Eye,
  FileCheck,
  Activity
} from 'lucide-react';
import { Project } from '../types';

interface QASecurityViewProps {
  currentProject: Project | null;
  onToggleTask: (taskId: string) => void;
  onOpenNewProjectModal?: () => void;
}

export default function QASecurityView({ 
  currentProject, 
  onToggleTask,
  onOpenNewProjectModal 
}: QASecurityViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'qa' | 'security' | 'performance' | 'seo'>('qa');

  if (!currentProject) {
    return (
      <div className="p-8 sm:p-14 text-center bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4 text-right animate-fade-in">
        <ShieldCheck className="w-14 h-14 text-emerald-400 mx-auto" />
        <h2 className="text-lg sm:text-xl font-bold text-white text-center">
          هیچ پروژه‌ای برای ممیزی کیفی و امنیتی انتخاب نشده است
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto text-center leading-relaxed">
          برای دسترسی به چک‌لیست تست OWASP، ریسپانسیو، سئو تکنیکال و شاخص‌های حیاتی عملکرد وب، یک پروژه ایجاد کنید.
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

  const QA_ITEMS = [
    { id: 'qa_u1', title: 'تست ریسپانسیو موبایل (۳۷۵px تا ۴۲۵px)', category: 'ریسپانسیو', desc: 'بررسی عدم سرریز افقی (Horizontal Overflow)، تاچ تارگت‌های ۴۴px و منوی همبرگری' },
    { id: 'qa_u2', title: 'تست تبلت و لپ‌تاپ (۷۶۸px تا ۱۰۲۴px)', category: 'ریسپانسیو', desc: 'بررسی شکستن ستون‌های گرید و خوانایی متن‌ها و چیدمان فرم‌ها' },
    { id: 'qa_u3', title: 'تست کراس‌براوزر در سافاری iOS و کروم اندروید', category: 'مرورگرها', desc: 'بررسی رندرینگ المان‌های flex/grid، تقویم‌های تاریخ و انیمیشن‌ها در Safari' },
    { id: 'qa_u4', title: 'اعتبارسنجی تمام فرم‌ها با ورودی‌های نامعتبر (Edge Cases)', category: 'فرم‌ها', desc: 'تست مقادیر خالی، طول بیش از حد، کاراکترهای خاص فارسی و شماره موبایل غلط' },
    { id: 'qa_u5', title: 'تست صفحات خطای ۴۰۴ و ۵۰۰ سفارشی', category: 'پایداری', desc: 'بررسی وجود دکمه بازگشت به صفحه اصلی و لایوت استاندارد در خطاهای سرور' },
    { id: 'qa_u6', title: 'تست قطع موقت اینترنت در کلاینت (Offline Handling)', category: 'شبکه', desc: 'نمایش پیام خطای شفاف به کاربر هنگام قطع ارتباط بدون کرش کردن اپلیکیشن' },
  ];

  const SECURITY_ITEMS = [
    { id: 'sec_o1', title: 'هاردنینگ هدرهای امنیتی (CSP, HSTS, X-Frame-Options)', category: 'هدرها', desc: 'جلوگیری از Clickjacking، اجرای اسکریپت‌های ناشناس و اجبار اتصال HTTPS' },
    { id: 'sec_o2', title: 'محافظت از توکن‌های احراز هویت با کوکی HttpOnly و SameSite=Lax', category: 'احراز هویت', desc: 'عدم ذخیره توکن‌های حیاتی در localStorage به منظور مهار کامل حملات XSS' },
    { id: 'sec_o3', title: 'اعمال Rate Limiting روی مسیرهای لاگین، رجیستر و ارسال OTP', category: 'بروت‌فورس', desc: 'محدودسازی تعداد تلاش‌ها به حداکثر ۵ درخواست در دقیقه برای هر IP' },
    { id: 'sec_o4', title: 'اعتبارسنجی ورودی‌های بک‌اند با کتابخانه Zod / Joi', category: 'تزریق کد', desc: 'مهار تمام سناریوهای SQL Injection، NoSQL Injection و Cross-Site Scripting' },
    { id: 'sec_o5', title: 'کنترل دسترسی افقی (IDOR Guard) روی رکوردها', category: 'مجوزها', desc: 'بررسی اینکه کاربر الف نتواند با تغییر ID در URL فاکتور یا پروفایل کاربر ب را ببیند' },
    { id: 'sec_o6', title: 'بررسی نوع واقعی MIME فایل‌های آپلودی', category: 'آپلود', desc: 'بررسی Magic Bytes در بک‌اند و تغییر رندوم نام فایل‌ها برای جلوگیری از اجرای وب‌شل' },
    { id: 'sec_o7', title: 'عدم کامیت متغیرهای محرمانه (.env) در گیت', category: 'سکرت‌ها', desc: 'بررسی فایل .gitignore و استفاده از Secret Managerها در پروداکشن' },
  ];

  const PERFORMANCE_ITEMS = [
    { id: 'perf_p1', title: 'تبدیل خودکار تصاویر به فرمت‌های سبک نسل جدید WebP / AVIF', category: 'تصاویر', desc: 'کاهش حجم تصاویر تا ۷۰٪ بدون افت کیفیت بصری' },
    { id: 'perf_p2', title: 'لود تنبل هوشمند (Lazy Loading) برای تصاویر زیر خط تا (Below the fold)', category: 'تصاویر', desc: 'جلوگیری از بارگذاری ده‌ها عکس قبل از اسکرول کاربر' },
    { id: 'perf_p3', title: 'امتیاز سبز شاخص‌های حیاتی وب (Core Web Vitals - LCP < 2.5s)', category: 'سرعت لود', desc: 'تست با Google PageSpeed Insights و اطمینان از LCP کمتر از ۲.۵ ثانیه' },
    { id: 'perf_p4', title: 'فعال‌سازی کش سمت سرور با Redis یا Nginx Microcaching', category: 'کشینگ', desc: 'پاسخ‌دهی به درخواست‌های تکراری در کمتر از ۵۰ میلی‌ثانیه بدون کوئری سنگین' },
    { id: 'perf_p5', title: 'فشرده‌سازی فایل‌های استاتیک با Gzip / Brotli در وب‌سرور', category: 'سرور', desc: 'کاهش حجم انتقالی کدهای JS و CSS به کمتر از ۳۰٪' },
  ];

  const SEO_ITEMS = [
    { id: 'seo_t1', title: 'تولید sitemap.xml داینامیک و معرفی به Google Search Console', category: 'تکنیکال', desc: 'ایندکس منظم صفحات و محصولات تازه منتشر شده توسط بات‌های موتور جستجو' },
    { id: 'seo_t2', title: 'پیکربندی استاندارد فایل robots.txt', category: 'تکنیکال', desc: 'مسدودسازی ایندکس پنل‌های ادمین و مسیرهای خصوصی و هدایت به سایت‌مپ' },
    { id: 'seo_t3', title: 'تنظیم تگ‌های OpenGraph و Twitter Card با عکس شاخص ۱۲۰۰×۶۳۰', category: 'اشتراک‌گذاری', desc: 'نمایش شکیل لینک‌ها در تلگرام، ایتا، بله، واتساپ و لینکدین' },
    { id: 'seo_t4', title: 'تزریق داده‌های ساختاریافته Schema.org متناسب با نوع پروژه', category: 'اسکیما', desc: 'اسکیماهای Product, Article, Organization, BreadcrumbList و LocalBusiness' },
    { id: 'seo_t5', title: 'تنظیم تگ Canonical یکتا برای تمام صفحات', category: 'تکنیکال', desc: 'جلوگیری از جریمه محتوای تکراری ناشی از کوئری‌پارامترها و URLهای متناظر' },
    { id: 'seo_t6', title: 'تفکیک تعهدات سئو تکنیکال از سئو محتوایی (قرارداد مداوم)', category: 'تعهدات', desc: 'شفاف‌سازی برای کارفرما که رتبه ۱ گوگل نیازمند تولید مداوم محتوا و لینک‌سازی ماهانه است' },
  ];

  const getCurrentList = () => {
    switch (activeSubTab) {
      case 'qa': return QA_ITEMS;
      case 'security': return SECURITY_ITEMS;
      case 'performance': return PERFORMANCE_ITEMS;
      case 'seo': return SEO_ITEMS;
    }
  };

  const currentItems = getCurrentList();
  const completedCount = currentItems.filter((item) => currentProject.completedTasks[item.id]).length;
  const percent = Math.round((completedCount / currentItems.length) * 100);

  return (
    <div className="space-y-8 text-right">
      {/* Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-violet-950/40 to-slate-900 border border-violet-500/40 p-4 sm:p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-violet-500 via-rose-500 to-amber-500" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
              موتور تضمین کیفیت، امنیت، کارایی و سئو (QA & Audit Engine)
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
              چک‌لیست‌های ممیزی فنی و استانداردهای کیفی
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ارزیابی سیستماتیک ریسپانسیو، عملکرد فرم‌ها، هاردنینگ امنیتی OWASP، شاخص‌های Core Web Vitals و سئو تکنیکال پیش از تحویل رسمی به کارفرما.
            </p>
          </div>

          <div className="w-full md:w-64 bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-2 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">پیشرفت چک‌لیست جاری:</span>
              <span className="text-violet-400 font-bold font-mono">{percent}٪</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-rose-500 transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 text-center">
              {completedCount} از {currentItems.length} مورد ارزیابی و تایید شده
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <button
          onClick={() => setActiveSubTab('qa')}
          className={`p-3.5 sm:p-4 rounded-2xl text-right border transition-all cursor-pointer flex items-center justify-between min-h-[56px] active:scale-[0.98] ${
            activeSubTab === 'qa'
              ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/30'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div>
            <div className="text-xs font-bold text-white">تست و کیفیت (QA)</div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">ریسپانسیو و فرم‌ها</div>
          </div>
          <Smartphone className="w-5 h-5 text-cyan-400 shrink-0 mr-1" />
        </button>

        <button
          onClick={() => setActiveSubTab('security')}
          className={`p-3.5 sm:p-4 rounded-2xl text-right border transition-all cursor-pointer flex items-center justify-between min-h-[56px] active:scale-[0.98] ${
            activeSubTab === 'security'
              ? 'bg-violet-950/40 border-violet-500 text-violet-300 shadow-md shadow-violet-500/10 ring-1 ring-violet-500/30'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div>
            <div className="text-xs font-bold text-white">امنیت و هاردنینگ</div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">OWASP و XSS</div>
          </div>
          <Lock className="w-5 h-5 text-violet-400 shrink-0 mr-1" />
        </button>

        <button
          onClick={() => setActiveSubTab('performance')}
          className={`p-3.5 sm:p-4 rounded-2xl text-right border transition-all cursor-pointer flex items-center justify-between min-h-[56px] active:scale-[0.98] ${
            activeSubTab === 'performance'
              ? 'bg-amber-950/40 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/30'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div>
            <div className="text-xs font-bold text-white">سرعت و لود</div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">Core Web Vitals</div>
          </div>
          <Zap className="w-5 h-5 text-amber-400 shrink-0 mr-1" />
        </button>

        <button
          onClick={() => setActiveSubTab('seo')}
          className={`p-3.5 sm:p-4 rounded-2xl text-right border transition-all cursor-pointer flex items-center justify-between min-h-[56px] active:scale-[0.98] ${
            activeSubTab === 'seo'
              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/30'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div>
            <div className="text-xs font-bold text-white">سئو تکنیکال</div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">Sitemap و متاتگ</div>
          </div>
          <Globe className="w-5 h-5 text-emerald-400 shrink-0 mr-1" />
        </button>
      </div>

      {/* Checklist Items Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>آیتم‌های ارزیابی فنی ({currentItems.length} معیار)</span>
          </h2>
          <span className="text-xs text-slate-400">
            با لمس هر مورد، وضعیت تایید آن تغییر می‌کند
          </span>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          {currentItems.map((item) => {
            const isDone = Boolean(currentProject.completedTasks[item.id]);

            return (
              <div
                key={item.id}
                onClick={() => onToggleTask(item.id)}
                className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer flex items-start gap-3 sm:gap-4 min-h-[48px] active:scale-[0.99] select-none ${
                  isDone
                    ? 'bg-slate-950/90 border-emerald-500/60 shadow-sm'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                    isDone
                      ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                      : 'border border-slate-700 bg-slate-900'
                  }`}
                >
                  {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-bold ${isDone ? 'text-emerald-300' : 'text-white'}`}>
                      {item.title}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
