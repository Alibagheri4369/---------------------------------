import { Phase, Project } from '../types';
import { UNIVERSAL_MODULES } from './modulesData';

export const UNIVERSAL_25_PHASES_BASE: Omit<Phase, 'groups'>[] = [
  {
    id: 0,
    number: 1,
    title: 'جذب و ارزیابی لید',
    titleEn: '01 — Lead Qualification',
    shortDesc: 'بررسی تماس اولیه مشتری، اعتبارسنجی بیزینس، شناخت بودجه، ددلاین و ارزیابی ریسک',
    color: 'from-emerald-500 to-teal-600',
    category: 'pre',
    deliverables: ['فرم ارزیابی لید (Lead Profile)', 'سنجش اولیه بودجه و ریسک'],
    tips: ['پروژه‌ای که با بودجه نامتناسب یا بدون مرز مشخص شروع شود به شکست می‌انجامد.'],
  },
  {
    id: 1,
    number: 2,
    title: 'کشف نیازهای کارفرما',
    titleEn: '02 — Client Discovery',
    shortDesc: 'جلسات عمیق مصاحبه با مشتری و استخراج نیازهای اعلامی و اعلام‌نشده با ابزارهای AI',
    color: 'from-teal-500 to-cyan-600',
    category: 'pre',
    deliverables: ['پرسش‌نامه جامع پرشده نیازسنجی'],
    tips: ['سؤالات هدفمند با هوش مصنوعی آماده کنید تا تمام زوایای پنهان کسب‌وکار روشن شود.'],
  },
  {
    id: 2,
    number: 3,
    title: 'تدوین سند نیازمندی‌ها',
    titleEn: '03 — Requirements Document',
    shortDesc: 'تدوین شفاف نیازمندی‌های عملکردی، غیرعملکردی، نقش‌ها، صفحات و نقشه سایت',
    color: 'from-cyan-500 to-blue-600',
    category: 'planning',
    deliverables: ['PROJECT_REQUIREMENTS.md', 'نقشه سایت (Sitemap)'],
    tips: ['پنل‌های ادمین، روش‌های احراز هویت و سطوح دسترسی باید در همین مرحله قطعی شوند.'],
  },
  {
    id: 3,
    number: 4,
    title: 'تحقیقات بازار، رقبا و ریفرنس‌ها',
    titleEn: '04 — Research (Market & Tech)',
    shortDesc: 'تحلیل دقیق ۳ تا ۵ رقیب شاخص، استخراج مزیت رقابتی و بررسی پکیج‌ها و فناوری‌ها',
    color: 'from-blue-500 to-indigo-600',
    category: 'planning',
    deliverables: ['RESEARCH.md', 'لیست رقبای برتر و ریفرنس‌های طراحی'],
    tips: ['چرخ را از ابتدا اختراع نکنید؛ نقاط ضعف رقبا را به مزیت خود تبدیل کنید.'],
  },
  {
    id: 4,
    number: 5,
    title: 'ارائه طرح اولیه و پیشنهاد فنی',
    titleEn: '05 — Proposal & Scope of Work',
    shortDesc: 'تعیین محدوده دقیق کار (Scope of Work)، اسپرینت‌ها، ماژول‌ها و مایلستون‌های پروژه',
    color: 'from-indigo-500 to-violet-600',
    category: 'planning',
    deliverables: ['SCOPE_OF_WORK.md', 'تایم‌لاین مایلستون‌ها'],
    tips: ['محدوده را قفل کنید تا کارفرما درخواست‌های خارج از توافق را به صورت رایگان مطالبه نکند.'],
  },
  {
    id: 5,
    number: 6,
    title: 'قیمت‌گذاری سه‌لایه و بودجه‌بندی',
    titleEn: '06 — Pricing & Cost Breakdown',
    shortDesc: 'تفکیک دقیق هزینه توسعه، راه‌اندازی زیرساخت، اتصالات و خدمات مستمر ماهانه',
    color: 'from-violet-500 to-purple-600',
    category: 'planning',
    deliverables: ['برآورد رسمی هزینه پروژه (۳ لایه)'],
    tips: ['سرویس‌های ماهانه مانند هاست، پیامک و سئو را از هزینه اولیه توسعه جدا کنید.'],
  },
  {
    id: 6,
    number: 7,
    title: 'انعقاد قرارداد رسمی و حقوقی',
    titleEn: '07 — Contract & Ownership Terms',
    shortDesc: 'امضای قرارداد با تعیین مالکیت کدهای منبع، دارایی‌ها، شرایط دیرکرد و محرمانگی NDA',
    color: 'from-purple-500 to-fuchsia-600',
    category: 'planning',
    deliverables: ['قرارداد امضاشده توسعه نرم‌افزار', 'ماتریس مالکیت سرویس‌ها'],
    tips: ['اصل Client = Owner و Developer = Admin Access را حتماً در بند قرارداد ثبت کنید.'],
  },
  {
    id: 7,
    number: 8,
    title: 'پیش‌پرداخت اولیه (شروع پروژه)',
    titleEn: '08 — Initial Payment Milestone',
    shortDesc: 'دریافت پیش‌پرداخت توافق‌شده (معمولاً ۴۰٪) و افتتاح پرونده رسمی توسعه',
    color: 'from-fuchsia-500 to-pink-600',
    category: 'planning',
    deliverables: ['رسید واریز پیش‌پرداخت', 'برنامه رسمی شروع فاز طراحی'],
    tips: ['تا پیش‌پرداخت واریز نشده است، اقدام به کدنویسی یا ثبت سرویس نکنید.'],
  },
  {
    id: 8,
    number: 9,
    title: 'طراحی رابط کاربری و پروتوتایپ',
    titleEn: '09 — UI/UX Prototyping',
    shortDesc: 'طراحی دیزاین سیستم، تایپوگرافی، رنگ‌بندی، وایرفریم‌ها و پروتوتایپ تعاملی Figma',
    color: 'from-pink-500 to-rose-600',
    category: 'design',
    deliverables: ['فایل فیگما (Figma Prototype)', 'Design System Tokens'],
    tips: ['طراحی را حتماً به صورت ریسپانسیو برای موبایل و دسکتاپ نهایی کنید.'],
  },
  {
    id: 9,
    number: 10,
    title: 'تایید رسمی پروتوتایپ توسط کارفرما',
    titleEn: '10 — Client Design Approval',
    shortDesc: 'جلسه دمو پروتوتایپ با کارفرما، ثبت بازخوردها و دریافت تاییدیه کتبی طراحی',
    color: 'from-rose-500 to-amber-600',
    category: 'design',
    deliverables: ['صورت‌جلسه تایید نهایی طراحی UI'],
    tips: ['تغییرات ظاهری پس از شروع کدنویسی هزینه زیادی ایجاد می‌کند؛ تایید کتبی بگیرید.'],
  },
  {
    id: 10,
    number: 11,
    title: 'معماری، استک، دیتابیس و امنیت',
    titleEn: '11 — System Architecture',
    shortDesc: 'تعیین استک فرانت و بک‌اند، طراحی جداول دیتابیس (ERD)، APIها و زیرساخت ابری',
    color: 'from-amber-500 to-orange-600',
    category: 'planning',
    deliverables: ['ARCHITECTURE.md', 'دیاگرام دیاگرام پایگاه داده (ERD)'],
    tips: ['معماری باید کشینگ، صف پیام‌ها و قابلیت جداسازی ماژول‌ها را از ابتدا پیش‌بینی کند.'],
  },
  {
    id: 11,
    number: 12,
    title: 'برنامه‌ریزی اجرایی و اسپرینت‌ها',
    titleEn: '12 — Project Planning & Epics',
    shortDesc: 'خرد کردن فیچرها به Epicها، داستان‌های کاربر (User Stories) و زمان‌بندی هفتگی',
    color: 'from-orange-500 to-yellow-600',
    category: 'planning',
    deliverables: ['بورد تسک‌ها در ترلو / گیت‌هاب / جیرا'],
    tips: ['اسپرینت‌های ۱ تا ۲ هفته‌ای با خروجی ملموس تعیین کنید.'],
  },
  {
    id: 12,
    number: 13,
    title: 'تولید تسک‌ها و پایه‌ریزی ریپازیتوری',
    titleEn: '13 — Task Creation & Setup',
    shortDesc: 'ایجاد مخزن گیت، کانفیگ ESLint و Prettier، پیکربندی متغیرهای محیطی .env',
    color: 'from-yellow-500 to-lime-600',
    category: 'dev',
    deliverables: ['ریپازیتوری آماده گیت', 'پیکربندی محیط‌های Local و Staging'],
    tips: ['هرگز سکرت‌ها و API Keyها را به مخزن گیت کامیت نکنید.'],
  },
  {
    id: 13,
    number: 14,
    title: 'توسعه و کدنویسی هسته ماژول‌ها',
    titleEn: '14 — Core Development',
    shortDesc: 'کدنویسی فرانت‌اند، بک‌اند، دیتابیس و ماژول‌های فعال پروژه طبق فیچرهای انتخابی',
    color: 'from-cyan-500 to-blue-600',
    category: 'dev',
    deliverables: ['کدنویسی کامل بخش‌های پروژه', 'تست‌های محلی واحد (Unit Tests)'],
    tips: ['کدنویسی کامپوننت‌محور و پایبندی به اصول تمیز نویسی (Clean Code).'],
  },
  {
    id: 14,
    number: 15,
    title: 'یکپارچه‌سازی سرویس‌ها و وب‌سرویس‌ها',
    titleEn: '15 — Integrations & APIs',
    shortDesc: 'اتصال درگاه پرداخت، سامانه پیامک، ایمیل، وب‌سرویس‌های ثالث، استوریج ابری و مپ',
    color: 'from-blue-600 to-indigo-700',
    category: 'dev',
    deliverables: ['تست ارتباط با تمام وب‌سرویس‌های بیرونی'],
    tips: ['همیشه خطاها و تایم‌اوت‌های سرویس‌های خارجی را به شکل روان مدیریت کنید.'],
  },
  {
    id: 15,
    number: 16,
    title: 'تضمین کیفیت و تست‌های جامع (QA)',
    titleEn: '16 — Quality Assurance & Testing',
    shortDesc: 'تست عملکردی تمام فرم‌ها، تست ریسپانسیو موبایل و تبلت، تست کراس‌براوزر و سناریوهای مرزی',
    color: 'from-indigo-600 to-violet-700',
    category: 'qa',
    deliverables: ['گزارش تست QA و لاگ رفع باگ‌ها'],
    tips: ['تست روی گوشی‌های واقعی با سایزهای مختلف صفحه نمایش را فراموش نکنید.'],
  },
  {
    id: 16,
    number: 17,
    title: 'هاردنینگ و تست‌های امنیتی',
    titleEn: '17 — Security & Penetration Audit',
    shortDesc: 'بررسی امنیتی هدرها، مهار SQLi، XSS، CSRF، اعتبارسنجی ورودی‌ها و گواهینامه SSL',
    color: 'from-violet-600 to-purple-700',
    category: 'qa',
    deliverables: ['چک‌لیست امنیتی تکمیل‌شده OWASP'],
    tips: ['تمام روت‌های احراز هویت را در برابر اتک Brute-force با Rate Limiter ایمن کنید.'],
  },
  {
    id: 17,
    number: 18,
    title: 'بهینه‌سازی کارایی و سرعت لود',
    titleEn: '18 — Performance Optimization',
    shortDesc: 'بهینه‌سازی تصاویر (WebP)، کشینگ سرور و براوزر، امتیاز Core Web Vitals و لود زیر ۲ ثانیه',
    color: 'from-purple-600 to-fuchsia-700',
    category: 'qa',
    deliverables: ['گزارش تست سرعت Google PageSpeed'],
    tips: ['فایل‌های جاوااسکریپت و استایل‌های اضافی را پاکسازی و مینیفای کنید.'],
  },
  {
    id: 18,
    number: 19,
    title: 'سئو تکنیکال و استراکچردیتا',
    titleEn: '19 — Technical SEO Setup',
    shortDesc: 'تولید sitemap.xml، متاتگ‌ها، فایل robots.txt، بهینه‌سازی کدهای اسکیما (Schema.org)',
    color: 'from-fuchsia-600 to-pink-700',
    category: 'qa',
    deliverables: ['تست اعتبار اسکیما در Schema Validator', 'Sitemap.xml'],
    tips: ['سئو تکنیکال یکبار انجام می‌شود ولی سئوی محتوایی نیازمند قرارداد مداوم است.'],
  },
  {
    id: 19,
    number: 20,
    title: 'ابزارهای تحلیل داده و آنالیتیکس',
    titleEn: '20 — Analytics & Tracking',
    shortDesc: 'اتصال Google Analytics 4، فعال‌سازی Search Console و تنظیم رویدادهای تبدیل',
    color: 'from-pink-600 to-rose-700',
    category: 'ops',
    deliverables: ['اکانت‌های فعال GA4 و GSC تحت ایمیل کارفرما'],
    tips: ['اکانت گوگل آنالیتیکس را مستقیماً روی جیمیل کارفرما راه‌اندازی کنید.'],
  },
  {
    id: 20,
    number: 21,
    title: 'استقرار و دیپلوی روی پروداکشن',
    titleEn: '21 — Production Deployment',
    shortDesc: 'راه‌اندازی سرور اصلی، کانتینر داکر، Nginx Reverse Proxy، فعال‌سازی دامنه و SSL',
    color: 'from-rose-600 to-emerald-600',
    category: 'ops',
    deliverables: ['سامانه زنده روی دامنه اصلی کارفرما'],
    tips: ['دیپلوی را در ساعات خلوت شبانه‌روز با برنامه شفاف بازگشت (Rollback) انجام دهید.'],
  },
  {
    id: 21,
    number: 22,
    title: 'پشتیبان‌گیری خودکار و بازیابی (DR)',
    titleEn: '22 — Automated Backup & DR',
    shortDesc: 'راه‌اندازی کرون‌جاب بکاپ روزانه دیتابیس و فایل‌ها روی استوریج امن و تست ریستور',
    color: 'from-emerald-600 to-teal-700',
    category: 'ops',
    deliverables: ['تست موفق ریستور بکاپ در محیط ایزوله'],
    tips: ['بکاپی که تست بازیابی آن انجام نشده باشد، وجود خارجی ندارد!'],
  },
  {
    id: 22,
    number: 23,
    title: 'جلسه دمو و تاییدیه نهایی کارفرما',
    titleEn: '23 — Final Acceptance & Demo',
    shortDesc: 'ارائه کامل وبسایت به کارفرما، تست سناریوهای واقعی و دریافت امضای تحویل نهایی',
    color: 'from-teal-600 to-cyan-700',
    category: 'post',
    deliverables: ['فرم رسمی امضاشده تایید تحویل پروژه'],
    tips: ['تسویه‌حساب مرحله نهایی طبق قرارداد قبل از واگذاری روت‌اکانت انجام شود.'],
  },
  {
    id: 23,
    number: 24,
    title: 'تحویل دسترسی‌ها، مستندات و سورس',
    titleEn: '24 — Handover & Documentation',
    shortDesc: 'انتقال مالکیت تمام حساب‌ها، تحویل سورس‌کد، ویدیوهای آموزش پنل ادمین به پرسنل',
    color: 'from-cyan-600 to-blue-700',
    category: 'post',
    deliverables: ['HANDOVER_PACK.zip', 'دفترچه راهنمای ادمین و ویدیوها'],
    tips: ['یک جلسه ۲ ساعته آموزش ویدیویی برای کار با پنل ادمین ضبط کنید.'],
  },
  {
    id: 24,
    number: 25,
    title: 'خدمات پس از فروش، گارانتی و نگهداری',
    titleEn: '25 — Maintenance & SLA Support',
    shortDesc: 'آغاز دوره گارانتی رفع باگ و ارائه پیشنهاد قرارداد ماهانه نگهداری فنی، امنیت و سئو',
    color: 'from-blue-600 to-purple-700',
    category: 'post',
    deliverables: ['قرارداد خدمات نگهداری ماهانه (SLA)'],
    tips: ['نگهداری منبع درآمد پایدار ماهانه شماست؛ با ارائه گزارشات ماهانه ارزش آن را نشان دهید.'],
  },
];

/**
 * Universal Dynamic Task Engine:
 * Generates the complete 25-phase roadmap with custom module-injected tasks
 * based on the project's selected modules and project types!
 */
export function generateProjectRoadmap(project: Project): Phase[] {
  const activeModuleIds = new Set(project.selectedModules || []);

  return UNIVERSAL_25_PHASES_BASE.map((basePhase) => {
    // 1. Base default tasks for this lifecycle phase
    const defaultGroups = getBasePhaseTaskGroups(basePhase.id);

    // 2. Module-specific tasks injected dynamically for this phase
    const moduleInjectedGroups: { id: string; title: string; tasks: any[] }[] = [];

    UNIVERSAL_MODULES.forEach((mod) => {
      if (activeModuleIds.has(mod.id)) {
        const modTasksForPhase = mod.defaultTasks.filter((t) => t.phaseId === basePhase.id);
        if (modTasksForPhase.length > 0) {
          // Group by groupId or create a group
          const groupedMap = new Map<string, { title: string; tasks: any[] }>();
          modTasksForPhase.forEach((mt) => {
            if (!groupedMap.has(mt.groupId)) {
              groupedMap.set(mt.groupId, {
                title: `${mt.groupTitle} (${mod.nameFa})`,
                tasks: [],
              });
            }
            groupedMap.get(mt.groupId)!.tasks.push({
              id: mt.taskId,
              text: mt.taskText,
              moduleId: mod.id,
            });
          });

          groupedMap.forEach((grp, grpId) => {
            moduleInjectedGroups.push({
              id: grpId,
              title: grp.title,
              tasks: grp.tasks,
            });
          });
        }
      }
    });

    // Combine groups cleanly
    const combinedGroups = [...defaultGroups, ...moduleInjectedGroups];

    return {
      ...basePhase,
      groups: combinedGroups,
    };
  });
}

function getBasePhaseTaskGroups(phaseId: number) {
  switch (phaseId) {
    case 0: // Lead
      return [
        {
          id: 'lead_qual',
          title: 'ارزیابی مقدماتی مشتری (Lead Qualification)',
          tasks: [
            { id: 'p0_t1', text: 'دریافت درخواست اولیه و تماس صوتی یا جلسه معارفه' },
            { id: 'p0_t2', text: 'شناخت دقیق ماهیت کسب‌وکار و مدل درآمدی کارفرما' },
            { id: 'p0_t3', text: 'بررسی بودجه پیشنهادی کارفرما و سنجش امکان‌پذیری با آن بودجه' },
            { id: 'p0_t4', text: 'بررسی ددلاین زمانی مورد انتظار مشتری' },
            { id: 'p0_t5', text: 'سنجش ریسک‌های فنی، حقوقی و انطباق با تخصص تیم شما' },
          ],
        },
      ];
    case 1: // Discovery
      return [
        {
          id: 'lead_disc',
          title: 'کشف اهداف و نیازمندی‌ها (Discovery)',
          tasks: [
            { id: 'p1_t1', text: 'استخراج اهداف اصلی و شاخص‌های کلیدی موفقیت سایت (KPIs)' },
            { id: 'p1_t2', text: 'شناسایی پرسونای مخاطبان و کاربران نهایی' },
            { id: 'p1_t3', text: 'بررسی نیاز به زبان‌های دیگر (چندزبانه بودن Internationalization)' },
            { id: 'p1_t4', text: 'تعیین نوع محتوا و رسانه‌هایی که قرار است در سایت قرار گیرد' },
          ],
        },
      ];
    case 2: // Requirements
      return [
        {
          id: 'req_spec',
          title: 'تدوین سند نیازمندی‌ها (Requirements Specification)',
          tasks: [
            { id: 'p2_t1', text: 'ترسیم ساختار صفحات و نقشه کلی سایت (Sitemap)' },
            { id: 'p2_t2', text: 'تعیین فیچرهای ضروری (Must-Have) و فیچرهای تکمیلی (Nice-to-Have)' },
            { id: 'p2_t3', text: 'تعیین نقش‌ها و سطوح دسترسی کاربران (RBAC)' },
            { id: 'p2_t4', text: 'تدوین و نهایی‌سازی فایل رسمی PROJECT_REQUIREMENTS.md' },
          ],
        },
      ];
    case 3: // Research
      return [
        {
          id: 'res_bench',
          title: 'تحقیقات و بررسی رقبا (Benchmarking)',
          tasks: [
            { id: 'p3_t1', text: 'بررسی ساختار، ویژگی‌ها و فلوهای کاربری ۳ تا ۵ رقیب برتر' },
            { id: 'p3_t2', text: 'جمع‌آوری ریفرنس‌های طراحی مدرن و الهام‌بخش در حوزه پروژه' },
            { id: 'p3_t3', text: 'بررسی پکیج‌ها و کتابخانه‌های فنی معتبر و پایدار' },
            { id: 'p3_t4', text: 'تدوین و ثبت یافته‌ها در فایل RESEARCH.md' },
          ],
        },
      ];
    case 4: // Scope & Proposal
      return [
        {
          id: 'scope_prop',
          title: 'تعیین محدوده کار و پروپوزال (Scope of Work)',
          tasks: [
            { id: 'p4_t1', text: 'شفاف‌سازی مرزهای تعهدات و موارد خارج از تعهد (Out of Scope)' },
            { id: 'p4_t2', text: 'مشخص‌کردن مایلستون‌ها و زمان‌بندی فازهای تحویل' },
            { id: 'p4_t3', text: 'ارسال پیش‌نویس پروپوزال فنی و اخذ تاییدیه اولیه کارفرما' },
          ],
        },
      ];
    case 5: // Pricing
      return [
        {
          id: 'pricing_tasks',
          title: 'برآورد مالی و پکیج‌بندی هزینه‌ها',
          tasks: [
            { id: 'p5_t1', text: 'محاسبه هزینه نفرساعت کدنویسی و توسعه (Development)' },
            { id: 'p5_t2', text: 'محاسبه هزینه‌های زیرساخت اولیه هاست، دامنه، SSL و داکر (Setup)' },
            { id: 'p5_t3', text: 'محاسبه هزینه اتصالات وب‌سرویس‌ها و درگاه‌ها (Integrations)' },
            { id: 'p5_t4', text: 'پیشنهاد پلن‌های نگهداری و پشتیبانی ماهانه (Ongoing Services)' },
          ],
        },
      ];
    case 6: // Contract
      return [
        {
          id: 'contract_terms',
          title: 'امضای قرارداد و شرایط حقوقی',
          tasks: [
            { id: 'p6_t1', text: 'تنظیم ماده مالکیت کدهای منبع، طرح‌ها و پایگاه داده به نام کارفرما' },
            { id: 'p6_t2', text: 'تعیین شفاف شرایط گارانتی و دوره پشتیبانی رایگان پس از تحویل' },
            { id: 'p6_t3', text: 'امضای نسخه فیزیکی یا دیجیتال قرارداد و تبادل مدارک' },
          ],
        },
      ];
    case 7: // Payment
      return [
        {
          id: 'payment_start',
          title: 'دریافت پیش‌پرداخت و شروع رسمی',
          tasks: [
            { id: 'p7_t1', text: 'واریز قسط اول (پیش‌پرداخت) طبق بند مالی قرارداد' },
            { id: 'p7_t2', text: 'صدور رسید پرداخت و اعلام تاریخ استارت اسپرینت طراحی' },
          ],
        },
      ];
    case 8: // Prototype / UI
      return [
        {
          id: 'ui_design',
          title: 'طراحی رابط کاربری و پروتوتایپ (UI/UX)',
          tasks: [
            { id: 'p8_t1', text: 'طراحی دیزاین سیستم، پالت رنگ، تایپوگرافی فارسی و فاصله‌گذاری‌ها' },
            { id: 'p8_t2', text: 'طراحی وایرفریم‌ها و پروتوتایپ تعاملی صفحات کلیدی در فیگما' },
            { id: 'p8_t3', text: 'طراحی حالت‌های ریسپانسیو اختصاصی برای صفحه موبایل' },
          ],
        },
      ];
    case 9: // Approval
      return [
        {
          id: 'ui_approval',
          title: 'جلسه بازبینی و تایید نهایی طراحی',
          tasks: [
            { id: 'p9_t1', text: 'برگزاری جلسه دمو آنلاین پروتوتایپ فیگما با کارفرما' },
            { id: 'p9_t2', text: 'اعمال روتوش‌ها و فیدبک‌های دریافتی' },
            { id: 'p9_t3', text: 'دریافت امضا یا تاییدیه کتبی روی پروتوتایپ نهایی' },
          ],
        },
      ];
    case 10: // Architecture
      return [
        {
          id: 'sys_arch',
          title: 'معماری جامع سیستم و پایگاه داده',
          tasks: [
            { id: 'p10_t1', text: 'انتخاب قطعی فریم‌ورک‌های فرانت، بک‌اند، دیتابیس و کتابخانه‌ها' },
            { id: 'p10_t2', text: 'ترسیم دیاگرام داده‌ها و اسکیمای اولیه جداول' },
            { id: 'p10_t3', text: 'نگارش و ثبت فایل رسمی ARCHITECTURE.md' },
          ],
        },
      ];
    case 11: // Planning
      return [
        {
          id: 'sprint_plan',
          title: 'برنامه‌ریزی اسپرینت‌ها و وظایف',
          tasks: [
            { id: 'p11_t1', text: 'تعریف اپیک‌ها (Epics) و وظایف ریز در تسک‌منیجر' },
            { id: 'p11_t2', text: 'تعیین ددلاین‌های تحویل ماژول به ماژول' },
          ],
        },
      ];
    case 12: // Task Setup
      return [
        {
          id: 'git_setup',
          title: 'راه‌اندازی محیط توسعه و مخزن',
          tasks: [
            { id: 'p12_t1', text: 'ایجاد مخزن گیت خصوصی (Git Repo) و تعیین شاخه‌ها' },
            { id: 'p12_t2', text: 'تنظیم متغیرهای محیطی با فایل .env.example' },
            { id: 'p12_t3', text: 'پیکربندی ابزارهای کنترل کیفیت کد (ESLint, Prettier, TypeScript)' },
          ],
        },
      ];
    case 13: // Core Dev
      return [
        {
          id: 'core_dev_base',
          title: 'توسعه عمومی و ساختار فریم‌ورک',
          tasks: [
            { id: 'p13_t1', text: 'پیاده‌سازی کامپوننت‌های پایه رابط کاربری (Layout, Navigation, Buttons)' },
            { id: 'p13_t2', text: 'کدنویسی منطق روتینگ و اتصال به APIهای مربوطه' },
          ],
        },
      ];
    case 14: // Integration
      return [
        {
          id: 'core_int_base',
          title: 'یکپارچه‌سازی و ارتباطات',
          tasks: [
            { id: 'p14_t1', text: 'پیکربندی کلیدهای ارتباطی وب‌سرویس‌های بیرونی در محیط امن سرور' },
            { id: 'p14_t2', text: 'تست موفق سناریوهای بازگشتی و لاگ‌برداری از خطاهای شبکه‌ای' },
          ],
        },
      ];
    case 15: // QA
      return [
        {
          id: 'core_qa_base',
          title: 'تست عملکردی و تضمین کیفیت پایه',
          tasks: [
            { id: 'p15_t1', text: 'تست ریسپانسیو و چینش المان‌ها در نمایشگرهای موبایل، تبلت و لپ‌تاپ' },
            { id: 'p15_t2', text: 'تست فرم‌ها با ورودی‌های نامعتبر و بررسی پیام‌های خطای فارسی' },
            { id: 'p15_t3', text: 'تست سازگاری با مرورگرهای کروم، فایرفاکس، سافاری و Edge' },
          ],
        },
      ];
    case 16: // Security
      return [
        {
          id: 'core_sec_base',
          title: 'هاردنینگ امنیتی و ممیزی دسترسی',
          tasks: [
            { id: 'p16_t1', text: 'بررسی و بستن حفره‌های رایج وب (XSS, SQL Injection, CSRF)' },
            { id: 'p16_t2', text: 'بررسی عدم نشت اطلاعات حساس یا پسوردها در پاسخ‌های API' },
            { id: 'p16_t3', text: 'تنظیم هدرهای امنیتی HTTPS و Content-Security-Policy' },
          ],
        },
      ];
    case 17: // Performance
      return [
        {
          id: 'core_perf_base',
          title: 'بهینه‌سازی کارایی و سرعت لود',
          tasks: [
            { id: 'p17_t1', text: 'فشرده‌سازی تمام فایل‌های استاتیک، تصاویر و آیکون‌ها' },
            { id: 'p17_t2', text: 'بررسی شاخص‌های حیاتی وب (LCP, FID/INP, CLS) و رسیدن به وضعیت سبز' },
          ],
        },
      ];
    case 18: // SEO
      return [
        {
          id: 'core_seo_base',
          title: 'سئو تکنیکال و متاتگ‌ها',
          tasks: [
            { id: 'p18_t1', text: 'بررسی هدینگ‌های تمام صفحات (H1 یکتا برای هر صفحه)' },
            { id: 'p18_t2', text: 'تنظیم تگ‌های اشتراک‌گذاری Open Graph برای تلگرام، واتساپ و لینکدین' },
          ],
        },
      ];
    case 19: // Analytics
      return [
        {
          id: 'core_analytics_base',
          title: 'ابزارهای تحلیل و گزارش‌گیری',
          tasks: [
            { id: 'p19_t1', text: 'نصب و تایید مالکیت در Google Search Console' },
            { id: 'p19_t2', text: 'تست دریافت اولین ایونت‌ها در داشبورد Google Analytics' },
          ],
        },
      ];
    case 20: // Deployment
      return [
        {
          id: 'core_deploy_base',
          title: 'استقرار روی سرور پروداکشن',
          tasks: [
            { id: 'p20_t1', text: 'تنظیم رکوردهای DNS دامنه اصلی و زیردامنه‌ها' },
            { id: 'p20_t2', text: 'نصب و فعال‌سازی موفق گواهی SSL با امتیاز A+' },
            { id: 'p20_t3', text: 'اجرای بیلد پروداکشن و تست عملکرد روی سرور زنده' },
          ],
        },
      ];
    case 21: // Backup
      return [
        {
          id: 'core_bkp_base',
          title: 'پشتیبان‌گیری و استراتژی بازیابی',
          tasks: [
            { id: 'p21_t1', text: 'فعال‌سازی اسکریپت روزانه بکاپ با ارسال به مقصد ریموت' },
            { id: 'p21_t2', text: 'اجرای آزمایشی بازیابی بکاپ برای حصول اطمینان از سلامت فایل‌ها' },
          ],
        },
      ];
    case 22: // Acceptance
      return [
        {
          id: 'core_accept_base',
          title: 'ارائه دمو نهایی و تسویه حساب',
          tasks: [
            { id: 'p22_t1', text: 'برگزاری جلسه پرزنت نهایی با کارفرما و ذینفعان پروژه' },
            { id: 'p22_t2', text: 'دریافت تسویه‌حساب نهایی طبق مفاد قرارداد' },
          ],
        },
      ];
    case 23: // Handover
      return [
        {
          id: 'core_handover_base',
          title: 'تحویل مستندات و انتقال مالکیت',
          tasks: [
            { id: 'p23_t1', text: 'انتقال مالکیت تمام اکانت‌های دامنه، هاست و دیتابیس به ایمیل کارفرما' },
            { id: 'p23_t2', text: 'ارائه پکیج کامل سورس‌کد و مستندات فنی راهنمای پروژه' },
            { id: 'p23_t3', text: 'جلسه آموزش کاربری به پرسنل و ادمین‌های کارفرما' },
          ],
        },
      ];
    case 24: // Maintenance
      return [
        {
          id: 'core_maint_base',
          title: 'پشتیبانی، گارانتی و قرارداد ماهانه',
          tasks: [
            { id: 'p24_t1', text: 'فعال‌سازی مانیتورینگ سلامت و آپ‌تایم سرور (Uptime Robot)' },
            { id: 'p24_t2', text: 'ارائه پیشنهاد پکیج قرارداد نگهداری ماهانه (SLA Maintenance)' },
          ],
        },
      ];
    default:
      return [];
  }
}
