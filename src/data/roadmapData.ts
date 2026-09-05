import { Phase, ServiceOwnership } from '../types';

export const ROADMAP_PHASES: Phase[] = [
  {
    id: 0,
    number: 0,
    title: 'جذب و ارزیابی مشتری',
    titleEn: 'Lead & Client Qualification',
    shortDesc: 'بررسی تقاضا، شناخت بودجه، زمان‌بندی، نوع پروژه و تحلیل امکان‌پذیری و ریسک اولیه',
    color: 'from-emerald-500 to-teal-600',
    deliverables: ['فرم اولیه ارزیابی مشتری (Lead Qualification)', 'مشخص شدن تیپ پروژه'],
    tips: [
      'هر پروژه‌ای ارزش قبول کردن ندارد؛ پروژه‌ای که با بودجه نامتناسب یا ریسک غیرمنطقی شروع شود، حتماً با شکست یا فرسودگی شما تمام می‌شود.',
      'حتماً نوع پروژه را از ابتدا مشخص کنید تا ساختار نیازمندی‌ها در گام بعد دقیق باشد.',
    ],
    groups: [
      {
        id: 'p0-lead',
        title: 'ارزیابی مشتری (Lead Qualification)',
        tasks: [
          { id: 'p0_t1', text: 'دریافت درخواست اولیه مشتری و تماس اکتشافی' },
          { id: 'p0_t2', text: 'شناخت دقیق نوع کسب‌وکار و حوزه فعالیت' },
          { id: 'p0_t3', text: 'شناخت بودجه تقریبی کارفرما و تناسب آن با کار' },
          { id: 'p0_t4', text: 'شناخت زمان و ددلاین موردنظر مشتری' },
          { id: 'p0_t5', text: 'بررسی اینکه آیا پروژه با مهارت و استک تخصصی من سازگار است یا نه' },
          { id: 'p0_t6', text: 'بررسی و سنجش ریسک‌های حقوقی، فنی و ارتباطی پروژه' },
        ],
      },
      {
        id: 'p0-type',
        title: 'تعیین نوع پروژه (Project Type)',
        tasks: [
          { id: 'p0_t7', text: 'لندینگ پیج (Landing Page)' },
          { id: 'p0_t8', text: 'سایت شرکتی و معرفی (Corporate Website)' },
          { id: 'p0_t9', text: 'فروشگاه اینترنتی (E-commerce)' },
          { id: 'p0_t10', text: 'سامانه رزرو و نوبت‌دهی (Booking System)' },
          { id: 'p0_t11', text: 'وب‌اپلیکیشن تخصصی (Web App / SaaS)' },
          { id: 'p0_t12', text: 'داشبورد و پنل گزارش‌گیری (Dashboard)' },
          { id: 'p0_t13', text: 'سامانه سفارشی اختصاصی (Custom Enterprise System)' },
        ],
      },
    ],
  },
  {
    id: 1,
    number: 1,
    title: 'نیازسنجی و جمع‌آوری اطلاعات',
    titleEn: 'Discovery & Requirements',
    shortDesc: 'آماده‌سازی سؤالات کشف نیاز با هوش مصنوعی، مصاحبه با مشتری و تدوین سند نیازمندی‌ها',
    color: 'from-cyan-500 to-blue-600',
    deliverables: ['PROJECT_REQUIREMENTS.md'],
    tips: [
      'با کمک هوش مصنوعی لیست سؤالات عمیق برای کارفرما تولید کنید تا هیچ بخش پنهانی در تاریکی نماند.',
      'CRM، درگاه بانکی و پنل مدیریت مرحله آخر نیستند! از همین مرحله باید ابعاد آن‌ها پرسیده و تدوین شود.',
    ],
    groups: [
      {
        id: 'p1-ai-prep',
        title: 'آماده‌سازی سؤال با AI',
        tasks: [
          { id: 'p1_t1', text: 'توضیح دادن ایده و شرایط پروژه به هوش مصنوعی' },
          { id: 'p1_t2', text: 'تولید لیست سؤالات پرسش‌نامه نیازسنجی توسط AI' },
          { id: 'p1_t3', text: 'بررسی، شخصی‌سازی و اصلاح سؤالات خروجی AI' },
          { id: 'p1_t4', text: 'ارسال سؤالات برای کارفرما یا برگزاری جلسه مصاحبه' },
        ],
      },
      {
        id: 'p1-info-gathering',
        title: 'جمع‌آوری و تدوین نیازمندی‌ها',
        tasks: [
          { id: 'p1_t5', text: 'هدف اصلی و شاخص‌های موفقیت سایت (KPIs)' },
          { id: 'p1_t6', text: 'پرسونای مخاطبان و کاربران هدف' },
          { id: 'p1_t7', text: 'لیست و ساختار محصولات یا خدمات ارائه شده' },
          { id: 'p1_t8', text: 'لیست تمام صفحات موردنیاز و نقشه سایت (Sitemap)' },
          { id: 'p1_t9', text: 'امکانات و فیچرهای ضروری (Must-have features)' },
          { id: 'p1_t10', text: 'پشتیبانی از چند زبان (Internationalization/i18n)' },
          { id: 'p1_t11', text: 'روش‌های پرداخت (درگاه مستقیم، واسط، رمزارز یا کیف پول)' },
          { id: 'p1_t12', text: 'سیستم‌های ارسال، پست و لجستیک' },
          { id: 'p1_t13', text: 'نیازهای پنل مدیریت و ابزارهای موردنیاز ادمین' },
          { id: 'p1_t14', text: 'سیستم CRM و ارتباط با مشتریان' },
          { id: 'p1_t15', text: 'روش‌های احراز هویت (موبایل و OTP، ایمیل، گوگل، دو مرحله‌ای)' },
          { id: 'p1_t16', text: 'تعریف نقش‌ها و سطوح دسترسی کاربران (RBAC)' },
          { id: 'p1_t17', text: 'لیست APIهای موردنیاز درون‌سازمانی و برون‌سازمانی' },
          { id: 'p1_t18', text: 'سرویس‌های خارجی (پیامک، ایمیل، نقشه، چت آنلاین)' },
          { id: 'p1_t19', text: 'اهداف و پیش‌نیازهای سئو (SEO)' },
          { id: 'p1_t20', text: 'ابزارهای آماری و آنالیتیکس (Analytics)' },
          { id: 'p1_t21', text: 'محدودیت‌های حقوقی، زمانی و فنی پروژه' },
          { id: 'p1_t22', text: 'ایجاد و ذخیره فایل نهایی PROJECT_REQUIREMENTS.md' },
        ],
      },
    ],
  },
  {
    id: 2,
    number: 2,
    title: 'تحقیق و تحلیل',
    titleEn: 'Research (Market, Design & Tech)',
    shortDesc: 'بررسی رقبا، ریفرنس‌های طراحی UI/UX و انتخاب کتابخانه‌ها و سرویس‌های فنی متن‌باز',
    color: 'from-blue-500 to-indigo-600',
    deliverables: ['RESEARCH.md'],
    tips: [
      'چرخ را از اول اختراع نکنید! نقاط ضعف رقبای موفق، مزیت رقابتی اصلی وبسایت شما خواهد بود.',
      'تمام لایبرری‌ها و پکیج‌های فنی را قبل از کدنویسی از نظر لایسنس، پشتیبانی و سازگاری چک کنید.',
    ],
    groups: [
      {
        id: 'p2-market',
        title: 'تحقیق بازار و رقبا',
        tasks: [
          { id: 'p2_t1', text: 'شناسایی و لیست کردن ۳ تا ۵ رقیب اصلی داخلی و خارجی' },
          { id: 'p2_t2', text: 'بررسی دقیق سایتهای مشابه موفق' },
          { id: 'p2_t3', text: 'تحلیل تجربه کاربری (UX) و فلوهای رقیبان' },
          { id: 'p2_t4', text: 'استخراج امکانات کلیدی رقبا و مقایسه آن‌ها' },
          { id: 'p2_t5', text: 'بررسی مدل درآمدی و کسب‌وکار رقبا' },
          { id: 'p2_t6', text: 'پیدا کردن نقاط ضعف رقبا برای تبدیل به نقطه قوت' },
        ],
      },
      {
        id: 'p2-design',
        title: 'تحقیق طراحی (UI/UX References)',
        tasks: [
          { id: 'p2_t7', text: 'جمع‌آوری مودبورد و UI References معتبر (Dribbble/Behance/Awwwards)' },
          { id: 'p2_t8', text: 'انتخاب پالت رنگی هماهنگ با هویت بصری برند' },
          { id: 'p2_t9', text: 'انتخاب تایپوگرافی، فونت فارسی و لاتین مناسب' },
          { id: 'p2_t10', text: 'بررسی ساختار لایوت و شبکه‌بندی (Layout Grid)' },
          { id: 'p2_t11', text: 'بررسی الگوی ناوبری موبایل (Mobile UX Patterns)' },
          { id: 'p2_t12', text: 'تعیین سبک انیمیشن‌ها و میکرو اینتراکشن‌ها' },
          { id: 'p2_t13', text: 'بررسی استانداردهای دسترس‌پذیری (Accessibility/WCAG)' },
        ],
      },
      {
        id: 'p2-tech',
        title: 'تحقیق فنی (Technical Research)',
        tasks: [
          { id: 'p2_t14', text: 'بررسی پروژه‌های Open Source مرتبط و بررسی لایسنس‌ها' },
          { id: 'p2_t15', text: 'تحقیق درباره کتابخانه‌های تخصصی (UI, State, Charts)' },
          { id: 'p2_t16', text: 'بررسی مستندات APIها و محدودیت‌های ترافیکی (Rate Limits)' },
          { id: 'p2_t17', text: 'بررسی درگاه‌های پرداخت متناسب با نیاز پروژه' },
          { id: 'p2_t18', text: 'بررسی سرویس‌های نقشه (Mapbox, Neshan, Balad, Google)' },
          { id: 'p2_t19', text: 'بررسی نرم‌افزارهای CRM و امکان اتصال وب‌هوک/API' },
          { id: 'p2_t20', text: 'سرویس‌های احراز هویت (Auth0, Supabase Auth, Custom OTP)' },
          { id: 'p2_t21', text: 'انتخاب هاستینگ، سرور، CDN و استوریج ذخیره‌سازی فایل‌ها' },
          { id: 'p2_t22', text: 'انتخاب سرویس‌های پیامک و ایمیل معاملاتی' },
          { id: 'p2_t23', text: 'تولید و نهایی‌سازی فایل RESEARCH.md' },
        ],
      },
    ],
  },
  {
    id: 3,
    number: 3,
    title: 'پیشنهاد قیمت، پکیج‌ها و قرارداد',
    titleEn: 'Proposal, Pricing & Contract',
    shortDesc: 'محاسبه شفاف هزینه با سیستم ۳ لایه، شفاف‌سازی موارد خارج از قرارداد و امضای قرارداد رسمی قبل از ساخت',
    color: 'from-amber-500 to-orange-600',
    deliverables: ['پیش‌نویس قرارداد رسمی', 'جدول تفکیک قیمت ۳ لایه', 'سند محدوده کار (Scope of Work)'],
    tips: [
      '🚨 فوق‌العاده مهم: این مرحله را قبل از ساخت Prototype رسمی قرار بده! اگر قبل از توافق قیمت طراحی کنی، ممکنه کلی وقت بذاری و مشتری نخره.',
      'موارد خارج از قرارداد (Out of Scope) را بولد بنویسید تا بعداً درخواست‌های اضافه بدون هزینه به شما تحمیل نشود.',
      'سیاست مالکیت سورس‌کد (Source Code) حتماً در این مرحله مشخص شود.',
    ],
    groups: [
      {
        id: 'p3-pricing',
        title: 'محاسبه قیمت و پکیج‌بندی',
        tasks: [
          { id: 'p3_t1', text: 'ارزیابی قیمت بر اساس نوع پروژه و میزان پیچیدگی' },
          { id: 'p3_t2', text: 'محاسبه هزینه بر اساس تعداد صفحات و تمپلیت‌ها' },
          { id: 'p3_t3', text: 'برآورد هزینه حجم فیچرها و منطق بک‌اند (Backend Complexity)' },
          { id: 'p3_t4', text: 'محاسبه هزینه پنل مدیریت، گزارشات و داشبوردها' },
          { id: 'p3_t5', text: 'محاسبه هزینه ماژول‌های CRM و اتوماسیون' },
          { id: 'p3_t6', text: 'محاسبه اتصال درگاه‌های بانکی و تراکنش‌ها' },
          { id: 'p3_t7', text: 'هزینه یکپارچه‌سازی با APIهای ثالث' },
          { id: 'p3_t8', text: 'هزینه سئوی فنی اولیه (Technical SEO)' },
          { id: 'p3_t9', text: 'هزینه کانفیگ سرور، داکر و دیپلوی (Deployment)' },
          { id: 'p3_t10', text: 'برآورد هزینه و مدت پشتیبانی رایگان اولیه' },
          { id: 'p3_t11', text: 'تعیین مدت زمان قطعی تحویل پروژه' },
          { id: 'p3_t12', text: 'مشخص کردن تعداد دفعات مجاز ویرایش (Revision Limit)' },
          { id: 'p3_t13', text: 'جداسازی هزینه لایسنس سرویس‌های ثالث از هزینه توسعه' },
          { id: 'p3_t14', text: 'ساخت پکیج‌های پیشنهادی (Basic, Standard, Premium, Custom)' },
        ],
      },
      {
        id: 'p3-out-of-scope',
        title: 'مشخص کردن صریح موارد خارج از قرارداد',
        tasks: [
          { id: 'p3_t15', text: 'تعیین هزینه فیچرهای اضافی درخواستی در طول مسیر' },
          { id: 'p3_t16', text: 'هزینه طراحی صفحات بیشتر از توافق اولیه' },
          { id: 'p3_t17', text: 'هزینه بازطراحی پس از اتمام تعداد بازبینی‌های مجاز' },
          { id: 'p3_t18', text: 'سئوی ماهانه و محتوایی (Monthly SEO)' },
          { id: 'p3_t19', text: 'پشتیبانی و نگهداری پس از اتمام گارانتی' },
          { id: 'p3_t20', text: 'تولید محتوا، عکاسی و ورود اطلاعات اولیه' },
          { id: 'p3_t21', text: 'هزینه تمدید سرور، هاست، دامنه و لایسنس‌ها' },
        ],
      },
      {
        id: 'p3-contract',
        title: 'بندهای قرارداد و دریافت پیش‌پرداخت',
        tasks: [
          { id: 'p3_t22', text: 'محدوده تعهدات (Scope of Deliverables)' },
          { id: 'p3_t23', text: 'جدول زمان‌بندی پرداخت‌ها (مثلاً ۴۰٪ پیش‌پرداخت، ۳۰٪ دمو، ۳۰٪ تحویل)' },
          { id: 'p3_t24', text: 'مهلت نهایی و ددلاین‌ها و شرایط تاخیر طرفین' },
          { id: 'p3_t25', text: 'سیاست و نحوه بازنگری و فیدبک (Revision Policy)' },
          { id: 'p3_t26', text: 'مالکیت سورس کد و دیتابیس (Full Ownership یا License یا Managed)' },
          { id: 'p3_t27', text: 'مالکیت حساب‌های دامنه، هاست و سرویس‌ها به نام خود کارفرما' },
          { id: 'p3_t28', text: 'شرایط لغو و فسخ قرارداد' },
          { id: 'p3_t29', text: 'مدت گارانتی رفع باگ (Warranty / Bug Fix Period)' },
          { id: 'p3_t30', text: 'امضای قرارداد توسط طرفین و دریافت پیش‌پرداخت اولیه' },
        ],
      },
    ],
  },
  {
    id: 4,
    number: 4,
    title: 'پروتوتایپ و تایید مشتری',
    titleEn: 'Prototype & Customer Approval',
    shortDesc: 'طراحی دیزاین سیستم، نمونه اولیه تعاملی و دریافت تاییدیه کتبی UI از کارفرما قبل از کدنویسی بک‌اند',
    color: 'from-violet-500 to-purple-600',
    deliverables: ['دیزاین پروتوتایپ صفحات اصلی', 'تاییدیه رسمی UI و اسکوپ از کارفرما'],
    tips: [
      'فلو: Requirements ➔ Design System ➔ Prototype ➔ Customer Approval.',
      'تایید UI و اسکوپ را به صورت کتبی ثبت کنید تا از تغییرات سلیقه‌ای بعدی جلوگیری شود.',
    ],
    groups: [
      {
        id: 'p4-proto-checklist',
        title: 'چک‌لیست پروتوتایپ و صفحات اصلی',
        tasks: [
          { id: 'p4_t1', text: 'صفحه اصلی (Homepage)' },
          { id: 'p4_t2', text: 'نسخه موبایل و تبلت صفحات اصلی (Responsive Prototype)' },
          { id: 'p4_t3', text: 'صفحات داخلی مهم (درباره ما، تماس، لندینگ‌ها)' },
          { id: 'p4_t4', text: 'منو، هدر، فوتر و ناوبری (Navigation)' },
          { id: 'p4_t5', text: 'صفحه محصول و لیست محصولات (در صورت فروشگاهی بودن)' },
          { id: 'p4_t6', text: 'فرآیند سبد خرید و چک‌اوت (اگر لازم است)' },
          { id: 'p4_t7', text: 'پیش‌نمایش پنل داشبورد کاربری و ادمین (اگر لازم است)' },
          { id: 'p4_t8', text: 'هماهنگی رنگ‌های برند (Brand Colors) و فونت‌ها' },
          { id: 'p4_t9', text: 'رفتار ریسپانسیو و تعاملات دکمه‌ها و فرم‌ها' },
        ],
      },
      {
        id: 'p4-approval',
        title: 'تاییدیه نهایی مشتری (Customer Approval)',
        tasks: [
          { id: 'p4_t10', text: 'ارائه دمو به کارفرما و ثبت فیدبک‌ها' },
          { id: 'p4_t11', text: 'تایید نهایی UI و دیزاین کلی توسط مشتری' },
          { id: 'p4_t12', text: 'تایید نهایی لیست امکانات و فلوها' },
          { id: 'p4_t13', text: 'تایید قطعی Scope پروژه (بعد از این تایید، Development شروع می‌شود)' },
        ],
      },
    ],
  },
  {
    id: 5,
    number: 5,
    title: 'معماری فنی سیستم',
    titleEn: 'Architecture & System Design',
    shortDesc: 'تعیین استک، معماری دیتابیس، فرانت‌اند، بک‌اند، احراز هویت، سیستم فایل و تدوین سند معماری',
    color: 'from-fuchsia-500 to-pink-600',
    deliverables: ['ARCHITECTURE.md', 'ERD دیتابیس', 'دیاگرام جریان داده و API'],
    tips: [
      'یک معماری حساب‌شده در ابتدا، از صدها ساعت ریفکتورینگ در ادامه جلوگیری می‌کند.',
      'معماری امنیتی و بکاپ را همین حالا ببینید، نه در مرحله دیپلوی!',
    ],
    groups: [
      {
        id: 'p5-stack',
        title: 'تعیین استک فنی (Technology Stack)',
        tasks: [
          { id: 'p5_t1', text: 'انتخاب فریم‌ورک فرانت‌اند (React, Next.js, Vue, etc.)' },
          { id: 'p5_t2', text: 'انتخاب رانتایم و فریم‌ورک بک‌اند (Node.js, Go, Python, etc.)' },
          { id: 'p5_t3', text: 'انتخاب پایگاه داده اصلی (PostgreSQL, MySQL, MongoDB)' },
          { id: 'p5_t4', text: 'سیستم Cache و صف پردازش (Redis, etc.)' },
          { id: 'p5_t5', text: 'ذخیره‌سازی فایل‌ها و استوریج (S3 / MinIO / Local)' },
          { id: 'p5_t6', text: 'متد احراز هویت و توکن‌ها (JWT, Session, OAuth)' },
          { id: 'p5_t7', text: 'استک درگاه پرداخت و هوک‌ها' },
          { id: 'p5_t8', text: 'ماژول ادمین و CRM' },
          { id: 'p5_t9', text: 'زیرساخت سرور و هاستینگ (Docker, Cloud Run, VPS)' },
        ],
      },
      {
        id: 'p5-arch-design',
        title: 'طراحی اجزای معماری',
        tasks: [
          { id: 'p5_t10', text: 'معماری ساختار فولدرها و کامپوننت‌های فرانت‌اند' },
          { id: 'p5_t11', text: 'معماری لایه‌ای بک‌اند (Controller, Service, Repository)' },
          { id: 'p5_t12', text: 'طراحی شمای دیتابیس (ERD, Relations, Indexes)' },
          { id: 'p5_t13', text: 'طراحی ساختار API (REST یا GraphQL، پاسخ‌های استاندارد)' },
          { id: 'p5_t14', text: 'معماری احراز هویت (Authentication)' },
          { id: 'p5_t15', text: 'معماری مجوزها و دسترسی‌ها (Authorization / RBAC)' },
          { id: 'p5_t16', text: 'طراحی فلوهای پرداخت و رویدادهای مالی' },
          { id: 'p5_t17', text: 'طراحی سرویس‌های فایل، ایمیل و پیامک' },
          { id: 'p5_t18', text: 'سیستم ثبت لاگ و مانیتورینگ خطاهای سرور' },
          { id: 'p5_t19', text: 'طراحی استراتژی پشتیبان‌گیری و بازیابی (Backup & DR)' },
          { id: 'p5_t20', text: 'معماری امنیت پایه (Rate Limiting, CORS, Sanitation)' },
          { id: 'p5_t21', text: 'تدوین و نهایی‌سازی فایل ARCHITECTURE.md' },
        ],
      },
    ],
  },
  {
    id: 6,
    number: 6,
    title: 'برنامه‌ریزی تسک‌ها و Epics',
    titleEn: 'Task Planning & Epics',
    shortDesc: 'شکستن پروژه به Epicهای قابل مدیریت و تبدیل به تسک‌های خرد برای توسعه چابک و با کیفیت',
    color: 'from-rose-500 to-red-600',
    deliverables: ['لیست Epics و تسک‌های قابل اجرا', 'Acceptance Criteria هر تسک'],
    tips: [
      '🛑 قانون حیاتی: Agent یا خود شما نباید یکباره کل پروژه را بسازید! تسک کوچک ➔ اجرا ➔ تست ➔ Review ➔ تسک بعدی.',
      'هر تسک باید دارای شاخص قبولی (Acceptance Criteria) شفاف باشد.',
    ],
    epicList: [
      'EPIC 01 — Authentication (احراز هویت)',
      'EPIC 02 — Users & Profiles (کاربران و پروفایل)',
      'EPIC 03 — Products & Catalog (محصولات و کاتالوگ)',
      'EPIC 04 — Cart & Checkout (سبد خرید)',
      'EPIC 05 — Orders & Invoices (سفارش‌ها و فاکتورها)',
      'EPIC 06 — Payment Gateway (درگاه پرداخت)',
      'EPIC 07 — Admin Dashboard (داشبورد ادمین)',
      'EPIC 08 — CRM & Leads (مدیریت ارتباط با مشتری)',
      'EPIC 09 — SEO & Analytics (سئو و آنالیتیکس)',
      'EPIC 10 — Deployment & CI/CD (استقرار)',
    ],
    groups: [
      {
        id: 'p6-planning',
        title: 'شکست پروژه به تسک‌ها',
        tasks: [
          { id: 'p6_t1', text: 'تعریف و ثبت Epicهای ۱۰گانه پروژه' },
          { id: 'p6_t2', text: 'شکستن هر Epic به تسک‌های خرد (Atomic Tasks)' },
          { id: 'p6_t3', text: 'مشخص کردن وابستگی تسک‌ها (Dependencies)' },
          { id: 'p6_t4', text: 'تعیین معیارهای قبولی برای هر تسک (Acceptance Criteria)' },
          { id: 'p6_t5', text: 'اولویت‌بندی تسک‌ها بر اساس ارزش و وابستگی (Prioritization)' },
        ],
      },
    ],
  },
  {
    id: 7,
    number: 7,
    title: 'توسعه و کدنویسی (چرخه ۳ نفره AI)',
    titleEn: 'Development (AI + YOU Workflow)',
    shortDesc: 'اجرای چرخه سه نفره: YOU ➔ AI PLANNER ➔ CODING AGENT ➔ TEST ➔ AI REVIEWER ➔ YOU',
    color: 'from-amber-600 to-yellow-600',
    deliverables: ['کد تمیز و تست‌شده ماژول‌ها', 'کامیت‌های منظم گیت'],
    tips: [
      'چرخه طلایی: تو ➔ پلنر هوش مصنوعی ➔ کدنویسی ➔ تست ➔ بررسی توسط ریویور هوش مصنوعی ➔ تایید نهایی توسط تو.',
      'بعد از اتمام هر تسک کوچک، فوراً تست و سپس Git commit انجام دهید.',
    ],
    groups: [
      {
        id: 'p7-dev-cycle',
        title: 'چرخه استاندارد برای هر تسک',
        tasks: [
          { id: 'p7_t1', text: 'تحلیل تسک توسط هوش مصنوعی (AI Analysis)' },
          { id: 'p7_t2', text: 'تنظیم برنامه و نقشه اجرای تسک (Plan)' },
          { id: 'p7_t3', text: 'اجرای کدنویسی تسک توسط دستیار کدنویسی (Coding Agent)' },
          { id: 'p7_t4', text: 'اجرای تست‌های محلی ماژول (Unit & Integration Tests)' },
          { id: 'p7_t5', text: 'بازبینی کد توسط AI Reviewer و بررسی استانداردها' },
          { id: 'p7_t6', text: 'ثبت کامیت گیت با پیام استاندارد (Git commit)' },
          { id: 'p7_t7', text: 'ثبت تغییرات در لاگ توسعه و تیک زدن تکمیل تسک' },
        ],
      },
    ],
  },
  {
    id: 8,
    number: 8,
    title: 'تست جامع و کنترل کیفیت',
    titleEn: 'QA & Comprehensive Testing',
    shortDesc: 'تست عملکردی تمام صفحات، تست ریسپانسیو در انواع سایزها، سازگاری مرورگرها، سناریوهای خطا و یکپارچگی دیتابیس',
    color: 'from-emerald-600 to-green-700',
    deliverables: ['گزارش تست عملکردی و ریسپانسیو', 'حل باگ‌های شناسایی‌شده'],
    tips: [
      'تست را خیلی جدی‌تر از معمول بگیرید! باگ‌ها در مرحله پروداکشن هزینه اعتباری و مالی سنگینی دارند.',
      'حتماً سناریوهای خطای شبکه، قطع اینترنت کاربر و دیتای خالی (Empty states) را شبیه‌سازی کنید.',
    ],
    groups: [
      {
        id: 'p8-functional',
        title: 'تست عملکردی (Functional Testing)',
        tasks: [
          { id: 'p8_t1', text: 'تست تمام صفحات و لینک‌های ناوبری' },
          { id: 'p8_t2', text: 'اعتبارسنجی تمام فرم‌ها و خطاها' },
          { id: 'p8_t3', text: 'تست ورود و احراز هویت (Login Flow)' },
          { id: 'p8_t4', text: 'تست ثبت‌نام، بازیابی رمز و تایید حساب (Register Flow)' },
          { id: 'p8_t5', text: 'تست جستجو، فیلترها و مرتب‌سازی' },
          { id: 'p8_t6', text: 'تست افزودن/حذف از سبد خرید (Cart Flow)' },
          { id: 'p8_t7', text: 'تست تسویه حساب و صورت‌حساب (Checkout Flow)' },
          { id: 'p8_t8', text: 'تست ثبت سفارش و تاریخچه سفارشات (Orders)' },
          { id: 'p8_t9', text: 'تست دسترسی‌ها و عملکردهای پنل ادمین' },
          { id: 'p8_t10', text: 'تست ماژول CRM و ذخیره صحیح مشتریان' },
          { id: 'p8_t11', text: 'تست کامل درگاه پرداخت بانکی در محیط تست و زنده' },
        ],
      },
      {
        id: 'p8-responsive-browser',
        title: 'تست ریسپانسیو و مرورگرها',
        tasks: [
          { id: 'p8_t12', text: 'تست روی موبایل‌های با سایزهای مختلف (iOS و Android)' },
          { id: 'p8_t13', text: 'تست روی تبلت (عمودی و افقی)' },
          { id: 'p8_t14', text: 'تست روی لپ‌تاپ و مانیتورهای عریض (Desktop)' },
          { id: 'p8_t15', text: 'تست در مرورگر Chrome' },
          { id: 'p8_t16', text: 'تست در مرورگر Firefox' },
          { id: 'p8_t17', text: 'تست در مرورگر Safari' },
          { id: 'p8_t18', text: 'تست در مرورگر Edge' },
        ],
      },
      {
        id: 'p8-error-db',
        title: 'تست خطاها و دیتابیس',
        tasks: [
          { id: 'p8_t19', text: 'شبیه‌سازی قطعی یا کندی اینترنت (Network failure)' },
          { id: 'p8_t20', text: 'ورودی‌های نامعتبر، کاراکترهای مخرب و طولانی (Invalid input)' },
          { id: 'p8_t21', text: 'بررسی حالت‌های بدون دیتا (Empty states)' },
          { id: 'p8_t22', text: 'رفتار سایت هنگام خطای API یا سرویس خارجی' },
          { id: 'p8_t23', text: 'سناریوی لغو یا ناموفق بودن پرداخت توسط کاربر' },
          { id: 'p8_t24', text: 'صفحات خطای ۵۰۰ و مدیریت استثناهای سرور' },
          { id: 'p8_t25', text: 'تست یکپارچگی داده‌ها، تراکنش‌ها (Transactions) و مایگریشن دیتابیس' },
        ],
      },
    ],
  },
  {
    id: 9,
    number: 9,
    title: 'ارزیابی و آدیت امنیتی',
    titleEn: 'Security Audit',
    shortDesc: 'بررسی آسیب‌پذیری‌های OWASP، تزریق SQL، دسترسی‌ها، محدودیت نرخ درخواست و جلوگیری از نشت کلیدها',
    color: 'from-red-600 to-rose-700',
    deliverables: ['چک‌لیست امنیتی تکمیل‌شده', 'اسکن وابستگی‌ها و ایمن‌سازی متغیرهای محیطی'],
    tips: [
      '🚨 هرگز کلیدهای خصوصی، پسوردها یا API Keyها را به گیت‌پوش نکنید!',
      'تمام اندپوینت‌های حساس باید دارای احراز هویت قوی و Rate Limiting باشند.',
    ],
    groups: [
      {
        id: 'p9-security-items',
        title: 'چک‌لیست ارزیابی امنیتی پروژه',
        tasks: [
          { id: 'p9_t1', text: 'جلوگیری از حملات تزریق اسکریپت (XSS Protection)' },
          { id: 'p9_t2', text: 'جلوگیری از تزریق پایگاه داده (SQL Injection / ORM Parameterization)' },
          { id: 'p9_t3', text: 'محافظت در برابر جعل درخواست میان‌سایتی (CSRF)' },
          { id: 'p9_t4', text: 'بررسی آسیب‌پذیری دسترسی مستقیم به شیء (IDOR)' },
          { id: 'p9_t5', text: 'کنترل سطح دسترسی‌ها و جلوگیری از Broken Access Control' },
          { id: 'p9_t6', text: 'ایمن‌سازی ذخیره پسوردها (Hashing با bcrypt/argon2)' },
          { id: 'p9_t7', text: 'اعمال Rate Limiting روی اندپوینت‌های لاگین، ثبت‌نام و پرداخت' },
          { id: 'p9_t8', text: 'پیکربندی دقیق هدرهای CORS سرور' },
          { id: 'p9_t9', text: 'اسکن سورس‌کد برای اطمینان از عدم وجود Secretها و API Keyها در کد' },
          { id: 'p9_t10', text: 'اسکن آسیب‌پذیری وابستگی‌ها و پکیج‌های npm/pip (npm audit)' },
          { id: 'p9_t11', text: 'ایمن‌سازی آپلود فایل (اعتبارسنجی پسوند، سایز، MIME type)' },
          { id: 'p9_t12', text: 'جلوگیری از سوءاستفاده و دستکاری در مقادیر پرداخت (Payment Manipulation)' },
          { id: 'p9_t13', text: 'امنیت پنل ادمین (آدرس غیرقابل حدس، محافظت با 2FA و لاگ ورود)' },
        ],
      },
    ],
  },
  {
    id: 10,
    number: 10,
    title: 'بهینه‌سازی کارایی و سرعت',
    titleEn: 'Performance Optimization',
    shortDesc: 'کسب امتیاز بالای Lighthouse، بهینه‌سازی تصاویر، کشینگ دیتابیس و تنظیمات CDN',
    color: 'from-teal-500 to-cyan-700',
    deliverables: ['گزارش نمرات Lighthouse', 'تنظیمات Caching و فشرده‌سازی'],
    tips: [
      'کارایی را جدا از QA نگه دارید. سایت سریع، نرخ تبدیل و رتبه گوگل شما را چند برابر می‌کند.',
      'کوئری‌های N+1 در دیتابیس و عدم ایندکس‌گذاری، عامل اصلی کندی سرورها هستند.',
    ],
    groups: [
      {
        id: 'p10-frontend',
        title: 'بهینه‌سازی فرانت‌اند (Frontend Performance)',
        tasks: [
          { id: 'p10_t1', text: 'تست و ارزیابی امتیازات گوگل Lighthouse' },
          { id: 'p10_t2', text: 'بهینه‌سازی شاخص‌های Core Web Vitals (LCP, FID/INP, CLS)' },
          { id: 'p10_t3', text: 'تبدیل و بهینه‌سازی تصاویر به فرمت‌های مدرن (WebP/AVIF)' },
          { id: 'p10_t4', text: 'لود تنبل تصاویر و کامپوننت‌ها (Lazy Loading)' },
          { id: 'p10_t5', text: 'شکستن کدهای باندل (Code Splitting & Dynamic Imports)' },
          { id: 'p10_t6', text: 'بهینه‌سازی لود فونت‌ها و استفاده از font-display: swap' },
          { id: 'p10_t7', text: 'کاهش حجم کدهای JavaScript و حذف کتابخانه‌های بلااستفاده' },
        ],
      },
      {
        id: 'p10-backend-infra',
        title: 'بهینه‌سازی بک‌اند و زیرساخت',
        tasks: [
          { id: 'p10_t8', text: 'کاهش زمان پاسخ‌دهی API (Response Time)' },
          { id: 'p10_t9', text: 'تحلیل کوئری‌های کند دیتابیس و افزودن ایندکس‌ها (Database Indexes)' },
          { id: 'p10_t10', text: 'راه‌اندازی کشینگ دیتابیس و کش پاسخ‌ها (Caching/Redis)' },
          { id: 'p10_t11', text: 'بررسی و رفع مشکل کوئری‌های تکراری N+1' },
          { id: 'p10_t12', text: 'تنظیم شبکه توزیع محتوا (CDN مانند Cloudflare/Arvan)' },
          { id: 'p10_t13', text: 'فعال‌سازی فشرده‌سازی Gzip یا Brotli در سرور' },
          { id: 'p10_t14', text: 'تنظیم هدرهای کش HTTP مرورگر (Cache-Control)' },
        ],
      },
    ],
  },
  {
    id: 11,
    number: 11,
    title: 'سئو فنی و اتصال به گوگل',
    titleEn: 'Technical SEO & Google Setup',
    shortDesc: 'تنظیم تگ‌های متا، سایت‌مپ، اسکیما و راه‌اندازی اصولی Google Search Console و Analytics',
    color: 'from-lime-600 to-emerald-700',
    deliverables: ['Sitemap.xml و Robots.txt', 'اتصال تاییدشده به Search Console و Google Analytics'],
    tips: [
      '❗ نکته طلایی: سئو اولیه ≠ تضمین رتبه در گوگل! بلکه پیش‌نیاز ایندکس شدن است. سئوی ماهانه یک سرویس پولی و مجزاست.',
      'اکانت‌های گوگل را ترجیحاً با ایمیل اختصاصی خود مشتری بسازید و به خودتان دسترسی Developer بدهید.',
    ],
    groups: [
      {
        id: 'p11-technical-seo',
        title: 'سئو فنی (Technical SEO)',
        tasks: [
          { id: 'p11_t1', text: 'تگ‌های عنوان یکتا و استاندارد برای هر صفحه (Title Tags)' },
          { id: 'p11_t2', text: 'توضیحات متای جذاب و بهینه (Meta Description)' },
          { id: 'p11_t3', text: 'ساختار تیترهای اصولی (تنها یک H1 در هر صفحه و ترتیب H2/H3)' },
          { id: 'p11_t4', text: 'استفاده از HTML معنایی (Semantic HTML: main, article, nav)' },
          { id: 'p11_t5', text: 'تولید نقشه سایت داینامیک (Sitemap.xml)' },
          { id: 'p11_t6', text: 'تنظیم فایل دسترسی ربات‌ها (Robots.txt)' },
          { id: 'p11_t7', text: 'تنظیم تگ‌های استاندارد کانونیکال (Canonical Tags)' },
          { id: 'p11_t8', text: 'پیاده‌سازی داده‌های ساختاریافته (Schema.org / JSON-LD)' },
          { id: 'p11_t9', text: 'تگ‌های شبکه‌های اجتماعی (Open Graph و Twitter Cards)' },
          { id: 'p11_t10', text: 'صفحه خطای اختصاصی ۴۰۴ و ریدایرکت‌های ۳۰۱' },
        ],
      },
      {
        id: 'p11-google-setup',
        title: 'راه‌اندازی سرویس‌های گوگل',
        tasks: [
          { id: 'p11_t11', text: 'ثبت دامنه‌ در Google Search Console' },
          { id: 'p11_t12', text: 'تایید مالکیت دامنه با رکورد DNS یا فایل HTML' },
          { id: 'p11_t13', text: 'ثبت و ارسال آدرس سایت‌مپ در سرچ کنسول' },
          { id: 'p11_t14', text: 'تست و بررسی ایندکس‌پذیری صفحات اصلی' },
          { id: 'p11_t15', text: 'ایجاد Property و Data Stream در Google Analytics (GA4)' },
          { id: 'p11_t16', text: 'نصب Google Tag (GTAG) در کد سایت' },
          { id: 'p11_t17', text: 'تست ارسال رویدادهای زنده در Realtime گزارشات آنالیتیکس' },
        ],
      },
    ],
  },
  {
    id: 12,
    number: 12,
    title: 'استقرار و دیپلوی (Deployment)',
    titleEn: 'Deployment & Production Launch',
    shortDesc: 'تنظیم دامنه، DNS، گواهی SSL، وب‌سرور Nginx، داکر، متغیرهای محیطی، فایروال و مانیتورینگ',
    color: 'from-blue-600 to-indigo-800',
    deliverables: ['سایت لایو روی دامنه نهایی با SSL معتبر', 'کانفیگ خودکار CI/CD'],
    tips: [
      'ترافیک پروداکشن شوخی‌بردار نیست؛ قبل از لانچ حتماً متغیرهای محیطی پروداکشن را بررسی کنید.',
      'فایروال پورت‌های بلااستفاده را ببندد و ورود به SSH را با کلید محدود کنید.',
    ],
    groups: [
      {
        id: 'p12-deploy-checklist',
        title: 'چک‌لیست استقرار و راه‌اندازی سرور',
        tasks: [
          { id: 'p12_t1', text: 'اتصال و تنظیم رکوردهای دامنه در DNS (A, CNAME, TXT)' },
          { id: 'p12_t2', text: 'تهیه و کانفیگ سرور VPS یا هاست ابری' },
          { id: 'p12_t3', text: 'نصب گواهی امنیتی SSL و فعال‌سازی HTTPS اجباری' },
          { id: 'p12_t4', text: 'پیکربندی Nginx یا وب‌سرور معکوس (Reverse Proxy)' },
          { id: 'p12_t5', text: 'کانتینرسازی سرویس‌ها با Docker و Docker Compose' },
          { id: 'p12_t6', text: 'تنظیم دقیق متغیرهای محیطی محیط پروداکشن (.env.production)' },
          { id: 'p12_t7', text: 'راه‌اندازی پایگاه داده پروداکشن و اعمال آخرین مایگریشن‌ها' },
          { id: 'p12_t8', text: 'اتصال استوریج ذخیره‌سازی فایل‌های آپلودی' },
          { id: 'p12_t9', text: 'راه‌اندازی پایپ‌لاین CI/CD در GitHub Actions یا GitLab در صورت نیاز' },
          { id: 'p12_t10', text: 'تنظیم فایروال سرور (UFW) و مسدودسازی پورت‌های غیرضروری' },
          { id: 'p12_t11', text: 'راه‌اندازی لاگ‌گیری سیستم و ابزار مانیتورینگ آنلاین آپ‌تایم' },
        ],
      },
    ],
  },
  {
    id: 13,
    number: 13,
    title: 'سیستم بکاپ و بازیابی اضطراری',
    titleEn: 'Backup & Disaster Recovery',
    shortDesc: 'راه‌اندازی بکاپ‌گیری خودکار از دیتابیس و فایل‌ها در سرور مجزا و مهم‌تر از همه: تست بازیابی واقعی (Restore Test)',
    color: 'from-purple-600 to-violet-800',
    deliverables: ['اسکریپت خودکار بکاپ روزانه/هفتگی', 'تاییدیه موفقیت‌آمیز تست بازیابی (Test Restore OK)'],
    tips: [
      '🔥 قانون طلایی بکاپ: «بکاپ بدون تست Restore، اصلاً بکاپ قابل اعتماد نیست!»',
      'فایل‌های بکاپ را حتماً در یک فضای ذخیره‌سازی خارج از سرور اصلی (Off-site) نگه دارید.',
    ],
    groups: [
      {
        id: 'p13-backup-checklist',
        title: 'چک‌لیست استراتژی نسخه پشتیبان',
        tasks: [
          { id: 'p13_t1', text: 'راه‌اندازی بکاپ خودکار دوره‌ای از پایگاه داده (Database Backup)' },
          { id: 'p13_t2', text: 'پشتیبان‌گیری از فایل‌های آپلود شده کاربران (Uploaded Assets)' },
          { id: 'p13_t3', text: 'آرشیو نسخه نهایی سورس‌کد تگ‌شده در گیت (Release Tag)' },
          { id: 'p13_t4', text: 'مستندسازی متغیرهای محیطی و تنظیمات کانفیگ (بدون افشای پسورد)' },
          { id: 'p13_t5', text: 'زمان‌بندی دوره‌ای منظم برای اجرای اسکریپت‌ها (Cron Job)' },
          { id: 'p13_t6', text: 'انتقال و نگهداری فایل‌های بکاپ در استوریج جداگانه خارج سرور (Off-site)' },
          { id: 'p13_t7', text: 'تست بازگردانی واقعی بکاپ در یک محیط تستی (Test Restore Verification)' },
        ],
      },
    ],
  },
  {
    id: 14,
    number: 14,
    title: 'تعیین مدل مالکیت سورس‌کد',
    titleEn: 'Ownership Models (Full, Managed, License)',
    shortDesc: 'تعیین صریح مدل ارائه پروژه به مشتری بر اساس قرارداد (مالکیت کامل، سرویس مدیریت‌شده یا لایسنس استفاده)',
    color: 'from-indigo-600 to-sky-700',
    deliverables: ['انتخاب و ثبت مدل مالکیت در مستندات قرارداد'],
    tips: [
      'آیا سورس را به مشتری بدهی؟ بستگی به مدل توافق شما در گام سوم دارد؛ هیچکدام ذاتاً بد نیستند.',
      'مدل A (Full Ownership): مشتری کل سورس، دیتابیس و دسترسی‌ها را تحویل می‌گیرد. معمولاً قیمت بالاتری دارد.',
      'مدل B (Managed Service): سورس نزد شماست، هاست و نگهداری را شما اداره می‌کنید و مشتری محصول نهایی را استفاده می‌کند.',
      'مدل C (License): مشتری حق استفاده از سیستم را دارد ولی مالکیت کد منتقل نمی‌شود.',
    ],
    groups: [
      {
        id: 'p14-ownership-models',
        title: 'مدل‌های تحویل پروژه',
        tasks: [
          { id: 'p14_t1', text: 'مدل A (Full Ownership) — تحویل کامل سورس، دیتابیس، داکیومنت، دامنه و هاست به مشتری' },
          { id: 'p14_t2', text: 'مدل B (Managed Service) — نگهداری سورس و سرور نزد دولوپر تحت قرارداد پشتیبانی مستمر' },
          { id: 'p14_t3', text: 'مدل C (License) — اعطای حق استفاده بدون انتقال مالکیت فکری سورس کد' },
          { id: 'p14_t4', text: 'تطابق مدل با بندهای قرارداد و توافقنامه پرداخت' },
        ],
      },
    ],
  },
  {
    id: 15,
    number: 15,
    title: 'تحویل رسمی و واگذاری دسترسی‌ها',
    titleEn: 'Handover & Credentials Transfer',
    shortDesc: 'تحویل منظم سورس، مستندات، پنل ادمین و دسترسی‌ها به شیوه ایمن و بدون قرار دادن پسوردها در گیت',
    color: 'from-cyan-600 to-teal-700',
    deliverables: ['پکیج تحویل نهایی (Handover Pack)', 'مستندات استفاده و راه‌اندازی'],
    tips: [
      '⚠️ هشدار مهم: رمزهای عبور را داخل گیت یا فایل متنی عمومی پروژه تحویل ندهید! از بسترهای امن استفاده کنید.',
      'دسترسی دولوپر خود را طبق قرارداد به سطح ایمن تغییر دهید یا در صورت اتمام قرارداد حذف کنید.',
    ],
    groups: [
      {
        id: 'p15-handover-checklist',
        title: 'چک‌لیست تحویل دسترسی‌ها و مستندات',
        tasks: [
          { id: 'p15_t1', text: 'تحویل سورس‌کد پروژه طبق مدل مالکیت قرارداد' },
          { id: 'p15_t2', text: 'انتقال یا بررسی مالکیت اکانت دامنه به مشتری' },
          { id: 'p15_t3', text: 'تحویل دسترسی کنترل‌پنل هاست یا سرور به مشتری' },
          { id: 'p15_t4', text: 'ایجاد حساب ادمین اختصاصی با ایمیل مشتری و تحویل رمز عبور' },
          { id: 'p15_t5', text: 'تحویل یک نسخه فایل آخرین بکاپ تمیز دیتابیس' },
          { id: 'p15_t6', text: 'تحویل دفترچه راهنما و داکیومنت کار با پنل مدیریت' },
          { id: 'p15_t7', text: 'تحویل مستندات فنی APIها و متغیرها برای توسعه‌دهندگان بعدی' },
          { id: 'p15_t8', text: 'تایید دسترسی کارفرما به سرویس‌های ثالث (پیامک، درگاه، ایمیل)' },
          { id: 'p15_t9', text: 'بررسی انتقال دسترسی‌های Google Analytics و Search Console' },
          { id: 'p15_t10', text: 'مستندات دیپلوی و راهنمای راه‌اندازی مجدد' },
          { id: 'p15_t11', text: 'راهنمای کار با سیستم بکاپ و بازیابی' },
        ],
      },
    ],
  },
  {
    id: 16,
    number: 16,
    title: 'نگهداری و خدمات پس از تحویل',
    titleEn: 'Maintenance & After-Sales Services',
    shortDesc: 'شروع دوره گارانتی رایگان و تبدیل پشتیبانی و سئو به قراردادهای ارزش‌آفرین ماهانه جداگانه',
    color: 'from-slate-600 to-gray-800',
    deliverables: ['قرارداد رسمی پشتیبانی ماهانه (SLA)', 'قرارداد خدمات سئوی ماهانه'],
    tips: [
      '💡 این بخش را حتماً به سرویس پولی جداگانه تبدیل کنید! نباید به مشتری بگویید سایت رو سئو کردم پس از این به بعد رایگان سئو می‌کنم.',
      'مرز میان رفع باگ گارانتی و توسعه فیچرهای جدید را شفاف نگه دارید.',
    ],
    groups: [
      {
        id: 'p16-maintenance-checklist',
        title: 'خدمات نگهداری و قرارداد پشتیبانی',
        tasks: [
          { id: 'p16_t1', text: 'مدیریت دوره گارانتی رفع باگ طبق قرارداد اولیه' },
          { id: 'p16_t2', text: 'ارائه پکیج پشتیبانی ماهانه امنیتی و به‌روزرسانی سیستم‌ها' },
          { id: 'p16_t3', text: 'پایش و مانیتورینگ سلامت بکاپ‌ها و سرورها' },
          { id: 'p16_t4', text: 'به‌روزرسانی بسته‌ها و رفع آسیب‌پذیری‌های جدید پکیج‌ها' },
          { id: 'p16_t5', text: 'انجام تغییرات جزئی و بهینه‌سازی‌های دوره‌ای' },
          { id: 'p16_t6', text: 'ارائه قرارداد مجزای سئوی ماهانه (تولید محتوا، لینک‌سازی، مانیتورینگ کلمات کلیدی)' },
          { id: 'p16_t7', text: 'برنامه‌ریزی برای فازهای توسعه آتی و فیچرهای جدید بر اساس فیدبک کاربران' },
        ],
      },
    ],
  },
];

export const SERVICE_OWNERSHIP_MATRIX: ServiceOwnership[] = [
  {
    service: 'Google Analytics (GA4)',
    owner: 'مشتری (حساب ایمیل کارفرما)',
    devAccess: 'دسترسی Admin / Editor',
    recommendedRole: 'Administrator در سطح Property',
    importantNote: 'مالکیت اصلی باید روی ایمیل مشتری یا Project Owner باشد تا در آینده انتقال دیتا نیاز نباشد.',
  },
  {
    service: 'Google Search Console',
    owner: 'مشتری (حساب ایمیل کارفرما)',
    devAccess: 'دسترسی Owner یا Full User',
    recommendedRole: 'Full User برای مدیریت سایت‌مپ و ایندکس',
    importantNote: 'تاییدیه دامنه را با DNS رکورد به نام مشتری انجام دهید.',
  },
  {
    service: 'Supabase / Firebase / Cloud DB',
    owner: 'مشتری یا سازمان کارفرما',
    devAccess: 'Developer / Admin طبق نیاز فاز توسعه',
    recommendedRole: 'عضویت دولوپر در پروژه از طریق Invite',
    importantNote: 'دیتابیس نباید روی حساب شخصی جی‌میل دولوپر تعریف شود.',
  },
  {
    service: 'Domain (دامنه .ir یا بین‌المللی)',
    owner: 'مشتری (شناسه ایرنیک یا حساب رجیسترار)',
    devAccess: 'دسترسی موقت فنی به DNS رکوردهای دامنه',
    recommendedRole: 'مدیریت رکوردهای DNS بدون حق انتقال دامنه',
    importantNote: 'دامنه هویت قانونی برند است و نباید به نام برنامه‌نویس ثبت شود.',
  },
  {
    service: 'Hosting / VPS سرور',
    owner: 'مشتری (مالک پنل مالی سرور)',
    devAccess: 'دسترسی فنی SSH و پنل سرور',
    recommendedRole: 'کلید عمومی SSH دولوپر و دسترسی سرور',
    importantNote: 'تمدید و فاکتور سرور با مشتری است و دولوپر کلید فنی را مدیریت می‌کند.',
  },
  {
    service: 'Cloudflare / CDN',
    owner: 'مشتری',
    devAccess: 'دسترسی Administrator به Zone پروژه',
    recommendedRole: 'دعوت به عنوان Member در تیم کلودفلر',
    importantNote: 'ایمن و ساده برای مدیریت SSL، فایروال و DNS.',
  },
  {
    service: 'GitHub / GitLab Repository',
    owner: 'مشتری یا Organization مشتری',
    devAccess: 'Developer / Maintainer',
    recommendedRole: 'دسترسی پوش به برنچ‌ها و مدیریت Pull Requests',
    importantNote: 'طبق قرارداد، سورس در مخزن مشخص شده نگهداری می‌شود.',
  },
  {
    service: 'Payment Gateway (درگاه بانکی)',
    owner: 'مشتری (حساب بانکی و کد مالیاتی متعلق به کارفرما)',
    devAccess: 'کلیدهای API تست و پروداکشن',
    recommendedRole: 'دسترسی فنی به Merchant ID / API Key',
    importantNote: 'دولوپر فقط API Key و Webhook را دریافت می‌کند و دسترسی مالی ندارد.',
  },
  {
    service: 'SMS Gateway (پنل پیامک)',
    owner: 'مشتری (خط خدماتی و مدارک احراز هویت کارفرما)',
    devAccess: 'API Key و خط تست برای اتصال کدها',
    recommendedRole: 'دسترسی توسعه‌دهنده به وب‌سرویس پیامک',
    importantNote: 'شارژ پنل و پاسخگویی به رگولاتوری با مشتری است.',
  },
  {
    service: 'CRM و اتوماسیون سازمانی',
    owner: 'مشتری',
    devAccess: 'Admin / Developer به APIها و وب‌هوک‌ها',
    recommendedRole: 'اتصال فرم‌های لید به سامانه مشتری',
    importantNote: 'دسترسی پس از تکمیل فاز تست محدود می‌شود.',
  },
  {
    service: 'ایمیل‌های اختصاصی سایت (info@ / support@)',
    owner: 'مشتری',
    devAccess: 'دسترسی فنی SMTP و IMAP برای ارسال نوتیفیکیشن‌ها',
    recommendedRole: 'پیکربندی SPF, DKIM, DMARC در سرور ایمیل',
    importantNote: 'حساب‌های اصلی پرسنل به صورت محرمانه دست کارفرما می‌ماند.',
  },
];

export const MASTER_CHECKLIST_TEMPLATE = `PROJECT: __________________
CLIENT: ___________________
TYPE: _____________________
DEADLINE: _________________
PRICE: ____________________

━━━━━━━━━━━━━━━━━━━━━━
01 — CLIENT & DISCOVERY
━━━━━━━━━━━━━━━━━━━━━━
[ ] Lead received
[ ] Client qualified
[ ] Requirements questions prepared
[ ] Client answers collected
[ ] Requirements finalized
[ ] Scope defined

━━━━━━━━━━━━━━━━━━━━━━
02 — RESEARCH
━━━━━━━━━━━━━━━━━━━━━━
[ ] Competitor research
[ ] UI research
[ ] UX research
[ ] Open-source research
[ ] Technology research
[ ] Third-party services research

━━━━━━━━━━━━━━━━━━━━━━
03 — PRICING & CONTRACT
━━━━━━━━━━━━━━━━━━━━━━
[ ] Project price calculated
[ ] Optional services priced
[ ] Maintenance priced
[ ] SEO priced
[ ] Hosting/domain defined
[ ] Revision limit defined
[ ] Payment schedule defined
[ ] Ownership defined
[ ] Source-code policy defined
[ ] Contract signed
[ ] Initial payment received

━━━━━━━━━━━━━━━━━━━━━━
04 — PROTOTYPE
━━━━━━━━━━━━━━━━━━━━━━
[ ] UI prototype
[ ] Responsive prototype
[ ] Main pages
[ ] Customer feedback
[ ] Final approval

━━━━━━━━━━━━━━━━━━━━━━
05 — ARCHITECTURE
━━━━━━━━━━━━━━━━━━━━━━
[ ] Frontend
[ ] Backend
[ ] Database
[ ] API
[ ] Authentication
[ ] Authorization
[ ] Admin Panel
[ ] CRM
[ ] Payment
[ ] Storage
[ ] Email/SMS
[ ] Deployment
[ ] Backup
[ ] Security architecture

━━━━━━━━━━━━━━━━━━━━━━
06 — TASK PLANNING
━━━━━━━━━━━━━━━━━━━━━━
[ ] Epics
[ ] Tasks
[ ] Dependencies
[ ] Acceptance criteria
[ ] Priorities

━━━━━━━━━━━━━━━━━━━━━━
07 — DEVELOPMENT
━━━━━━━━━━━━━━━━━━━━━━
[ ] Frontend
[ ] Backend
[ ] Database
[ ] Admin
[ ] CRM
[ ] Payment
[ ] Integrations
[ ] Documentation

━━━━━━━━━━━━━━━━━━━━━━
08 — QA
━━━━━━━━━━━━━━━━━━━━━━
[ ] Functional
[ ] Responsive
[ ] Browser
[ ] Forms
[ ] API
[ ] Database
[ ] Error handling
[ ] Payment flow
[ ] Admin
[ ] CRM

━━━━━━━━━━━━━━━━━━━━━━
09 — SECURITY
━━━━━━━━━━━━━━━━━━━━━━
[ ] Authentication
[ ] Authorization
[ ] API
[ ] XSS
[ ] SQL Injection
[ ] CSRF
[ ] IDOR
[ ] Rate Limit
[ ] CORS
[ ] Secrets
[ ] Dependencies
[ ] File Upload
[ ] Payment
[ ] Infrastructure

━━━━━━━━━━━━━━━━━━━━━━
10 — PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━
[ ] Lighthouse
[ ] Core Web Vitals
[ ] Images
[ ] JS/CSS
[ ] API
[ ] Database
[ ] Cache
[ ] Server

━━━━━━━━━━━━━━━━━━━━━━
11 — SEO
━━━━━━━━━━━━━━━━━━━━━━
[ ] Titles
[ ] Meta
[ ] Headings
[ ] Sitemap
[ ] Robots
[ ] Canonical
[ ] Schema
[ ] 404
[ ] Redirects
[ ] Mobile
[ ] Performance

━━━━━━━━━━━━━━━━━━━━━━
12 — GOOGLE / ANALYTICS
━━━━━━━━━━━━━━━━━━━━━━
[ ] Search Console
[ ] Domain verification
[ ] Sitemap submitted
[ ] Indexing checked
[ ] Google Analytics
[ ] Google Tag
[ ] Realtime data verified

━━━━━━━━━━━━━━━━━━━━━━
13 — DEPLOYMENT
━━━━━━━━━━━━━━━━━━━━━━
[ ] Domain
[ ] DNS
[ ] SSL
[ ] Server
[ ] Nginx
[ ] Docker
[ ] Environment variables
[ ] Firewall
[ ] Monitoring
[ ] Logs

━━━━━━━━━━━━━━━━━━━━━━
14 — BACKUP
━━━━━━━━━━━━━━━━━━━━━━
[ ] Database backup
[ ] File backup
[ ] Source backup
[ ] Off-site backup
[ ] Restore test
[ ] Backup schedule

━━━━━━━━━━━━━━━━━━━━━━
15 — HANDOVER
━━━━━━━━━━━━━━━━━━━━━━
[ ] Source code according to contract
[ ] Domain access
[ ] Hosting access
[ ] Admin access
[ ] Database backup
[ ] Documentation
[ ] API documentation
[ ] Third-party accounts
[ ] Analytics access
[ ] Search Console access

━━━━━━━━━━━━━━━━━━━━━━
16 — AFTER SALES
━━━━━━━━━━━━━━━━━━━━━━
[ ] Warranty period
[ ] Maintenance contract
[ ] SEO contract
[ ] Hosting
[ ] Monitoring
[ ] Security updates
[ ] Future improvements`;
