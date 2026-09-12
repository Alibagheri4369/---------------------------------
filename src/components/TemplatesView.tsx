import { useState } from 'react';
import { FileText, Copy, Check, Download, FolderGit2, Sparkles, Code2, ShieldAlert, FileSignature } from 'lucide-react';
import { MASTER_CHECKLIST_TEMPLATE } from '../data/roadmapData';

export default function TemplatesView() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const projectRequirementsTemplate = `# PROJECT REQUIREMENTS (PROJECT_REQUIREMENTS.md)
نام پروژه: _________________________
نوع پروژه: (تکی یا هایبرید: فروشگاهی / کلینیک / آموزشگاه / SaaS / ...)
کارفرما: __________________________
مدل کسب‌وکار: B2C / B2B / Marketplace / Subscription
تاریخ تدوین: _______________________

## ۱. اهداف کلیدی پروژه (Project Objectives & KPIs)
- هدف اصلی کسب‌وکار از راه‌اندازی این وب‌اپلیکیشن
- شاخص‌های ارزیابی موفقیت (Conversion Rate, Retention, Load Speed)

## ۲. نقش‌های کاربری و دسترسی‌ها (User Roles & RBAC)
- نقش ۱: (مثلاً Super Admin) - دسترسی به تنظیمات سرور، امور مالی و گزارش‌ها
- نقش ۲: (مثلاً Manager / Doctor / Teacher / Seller) - مدیریت سفارش‌ها یا نوبت‌ها
- نقش ۳: (مثلاً Customer / Patient / Student) - رزرو، خرید، مشاهده پروفایل

## ۳. ساختار صفحات و نقشه سایت (Sitemap)
- صفحه لندینگ اصلی (Homepage)
- صفحات اختصاصی بر اساس نوع پروژه (فهرست خدمات، کاتالوگ، رزرو وقت، پروسه خرید)
- داشبورد اختصاصی کاربران و پنل ادمین

## ۴. ماژول‌های فعال و نیازمندی‌های فنی
- سیستم احراز هویت: OTP پیامکی، ایمیل، ورود با گوگل
- سیستم پرداخت: درگاه شاپرک بانکی / اشتراکی / کیف پول
- سیستم اعلان‌ها: پیامک وب‌سرویس خدماتی، ایمیل، وب‌سوکت آنی
- سیستم جستجو و فیلتر پیشرفته چندشاخصه

## ۵. محدودیت‌ها، ددلاین و تحویل‌دادنی‌ها
- ددلاین نهایی تحویل و مراحل مایلستون‌ها
- تعهدات فنی سرور و زیرساخت
`;

  const scopeOfWorkTemplate = `# SCOPE OF WORK & BOUNDARIES (SCOPE_OF_WORK.md)
پروژه: _________________________
کارفرما: __________________________

## ۱. خدمات و تعهدات داخل قرارداد (IN-SCOPE)
- طراحی UI/UX و سیستم دیزاین اختصاصی طبق پروتوتایپ تایید شده
- توسعه کامل فرانت‌اند ریسپانسیو (موبایل ۳۷۵px، تبلت و دسکتاپ)
- پیاده‌سازی بک‌اند، پایگاه داده و APIهای امن
- یکپارچه‌سازی درگاه پرداخت، سامانه پیامک و سرویس‌های خارجی توافق‌شده
- پیاده‌سازی سئو تکنیکال (Sitemap، متاتگ‌ها، OpenGraph و Schema.org)
- استقرار کامل روی هاست/سرور کارفرما و اتصال دامنه و SSL
- ۱ ماه پشتیبانی رایگان رفع باگ‌های فنی عملکردی

## ۲. موارد صراحتاً خارج از تعهد توسعه‌دهنده (OUT-OF-SCOPE)
- تولید محتوا، تایپ مقالات وبلاگ و عکاسی صنعتی از محصولات
- سئو محتوایی، بک‌لینک‌سازی و تضمین رتبه ۱ گوگل در کلمات کلیدی
- مدیریت کمپین‌های تبلیغاتی گوگل ادز یا اینستاگرام
- هزینه‌های خرید دامنه، هاستینگ، شارژ پنل پیامک و کارمزد درگاه پرداخت
- هرگونه قابلیت یا ماژول جدیدی که در این سند ذکر نشده باشد (مستلزم الحاقیه مالی جداگانه است)
`;

  const architectureTemplate = `# SYSTEM ARCHITECTURE SPECIFICATION (ARCHITECTURE.md)
پروژه: _________________________
استک فنی: Modern Full-Stack (Next.js / TypeScript / PostgreSQL / Redis)

## ۱. استک و لایه‌های سیستم (Tech Stack)
- Frontend: Next.js (App Router), React, Tailwind CSS
- Backend: Node.js / NestJS / Express
- Database: PostgreSQL with Prisma ORM / Supabase
- Cache Engine: Redis for Sessions & API Caching
- File & Media Storage: S3-compatible Object Storage (Cloudflare R2 / Arvan)
- Infrastructure: Docker Containerized on Ubuntu VPS / Cloud Run
- CDN & WAF: Cloudflare / ArvanCloud

## ۲. معماری امنیتی و احراز هویت (Security & Auth)
- توکن‌های JWT ذخیره‌شده در کوکی‌های امن HttpOnly با флаг SameSite=Lax
- Rate Limiting روی مسیرهای لاگین و ارسال کد پیامک (حداکثر ۵ درخواست در دقیقه)
- اعتبارسنجی ورودی‌های بک‌اند با کتابخانه Zod جهت مهار کامل SQLi و XSS
- کنترل دسترسی افقی (IDOR Guard) روی تمام رکوردهای کاربری

## ۳. جریان داده و درگاه پرداخت (Payment & Webhook Flow)
- ثبت رکورد سفارش با وضعیت Pending در دیتابیس پیش از ارسال به درگاه
- اعتبارسنجی قطعی تراکنش در کال‌بک بانکی با بررسی مبلغ، شماره ارجاع و کلید یکتا
- قفل کردن وب‌هوک برای جلوگیری از شارژ مجدد ناشی از رفرش صفحه (Idempotency)
`;

  const slaMaintenanceTemplate = `# SLA MAINTENANCE & SUPPORT CONTRACT (SLA_MAINTENANCE.md)
پروژه: _________________________
کارفرما: __________________________
مدت قرارداد: ۱۲ ماه شمسی (تمدید پذیر)

## ۱. سطوح اولویت و زمان پاسخ‌گویی (Response Times)
- بحرانی (Critical - قطعی کامل سایت یا درگاه پرداخت):
  زمان پاسخ: کمتر از ۲ ساعت | زمان رفع: کمتر از ۸ ساعت
- بالا (High - اختلال در عملکرد یک ماژول غیرحیاتی):
  زمان پاسخ: کمتر از ۶ ساعت | زمان رفع: کمتر از ۲۴ ساعت
- عادی (Normal - تغییر جزئی متن، عکس یا فونت):
  زمان اقدام: ۱ الی ۲ روز کاری

## ۲. تعهدات ماهانه تیم فنی
- پایش آپ‌تایم و وضعیت سلامت سرور به صورت ۲۴/۷
- پشتیبان‌گیری منظم روزانه و ذخیره فایل‌های پشتیبان در سرور مجزا
- به‌روزرسانی امنیتی پکیج‌های نرم‌افزاری و پچ‌های سیستم‌عامل
- مانیتورینگ خطاهای سرور و بهبود عملکرد دیتابیس
- اختصاص ۴ ساعت در ماه برای تغییرات کوچک و تنظیمات مد نظر کارفرما
`;

  const templates = [
    {
      id: 'master',
      title: 'مستر چک‌لیست مارک‌داون (MASTER_CHECKLIST.md)',
      desc: 'فایل کامل چک‌لیست تمام مراحل پروژه همراه با چک‌باکس‌های استاندارد برای گیت‌هاب و مستندسازی تیم فنی.',
      content: MASTER_CHECKLIST_TEMPLATE,
      badge: 'فنی و جامع',
    },
    {
      id: 'requirements',
      title: 'سند نیازمندی‌های پروژه (PROJECT_REQUIREMENTS.md)',
      desc: 'فرمت جامع ثبت اهداف، پرسونا، ساختار صفحات، ماژول‌های فعال و شاخص‌های کلیدی موفقیت (KPI).',
      content: projectRequirementsTemplate,
      badge: 'پروپوزال و نیازمندی',
    },
    {
      id: 'scope',
      title: 'سند حدود تعهدات و مرزبندی (SCOPE_OF_WORK.md)',
      desc: 'تفکیک دقیق تعهدات داخل قرارداد از موارد خارج از تعهد (مانند تولید محتوا، سئو مداوم و هزینه‌های اکانت‌ها).',
      content: scopeOfWorkTemplate,
      badge: 'حقوقی و قراردادی',
    },
    {
      id: 'architecture',
      title: 'سند معماری فنی سیستم (ARCHITECTURE.md)',
      desc: 'معماری استک نرم‌افزاری، پایگاه داده، سیستم کش، سیاست‌های امنیتی OWASP و جریان داده.',
      content: architectureTemplate,
      badge: 'معماری و امنیت',
    },
    {
      id: 'sla',
      title: 'قرارداد سطح خدمات پشتیبانی ماهانه (SLA_MAINTENANCE.md)',
      desc: 'قالب قرارداد خدمات پس از تحویل، زمان پاسخ‌گویی به حوادث بحرانی و تعهدات نگهداری سرور.',
      content: slaMaintenanceTemplate,
      badge: 'قرارداد پشتیبانی',
    },
  ];

  return (
    <div className="space-y-6 text-right">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold">
              <FolderGit2 className="w-4 h-4 text-blue-400" />
              مخزن قالب‌های مستندسازی رسمی دولوپر
            </div>

            <h2 className="text-xl md:text-2xl font-black text-white">
              قالب‌های مارک‌داون (Markdown Deliverables)
            </h2>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              این فایل‌ها خروجی‌های واقعی و تحویل‌دادنی‌های استاندارد فازهای پروژه هستند. می‌توانید با یک کلیک متن را کپی کرده و به عنوان فایل‌های <code className="font-mono text-cyan-300">.md</code> در ریپازیتوری گیت پروژه قرار دهید.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5 min-w-[220px]">
            <div className="text-slate-400">ساختار استاندارد ریپو:</div>
            <div className="font-mono text-cyan-400 text-[11px]" dir="ltr">docs/PROJECT_REQUIREMENTS.md</div>
            <div className="font-mono text-emerald-400 text-[11px]" dir="ltr">docs/SCOPE_OF_WORK.md</div>
            <div className="font-mono text-amber-400 text-[11px]" dir="ltr">docs/ARCHITECTURE.md</div>
            <div className="font-mono text-purple-400 text-[11px]" dir="ltr">docs/SLA_MAINTENANCE.md</div>
          </div>
        </div>
      </div>

      {/* Templates List */}
      <div className="space-y-6">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 md:p-6 space-y-4 shadow-lg hover:border-slate-700 transition-all"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-white text-base">
                    {tpl.title}
                  </h3>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800/80 px-2 py-0.5 rounded-full font-medium">
                    {tpl.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {tpl.desc}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(tpl.content, tpl.id)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer shadow-sm"
                >
                  {copiedKey === tpl.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">کپی شد!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-400" />
                      <span>کپی تمام متن</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Code / Markdown Preview Area */}
            <div className="relative">
              <pre 
                className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 text-xs font-mono text-slate-300 max-h-72 overflow-y-auto leading-relaxed whitespace-pre-wrap select-all scrollbar-thin"
                dir="ltr"
              >
                {tpl.content}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
