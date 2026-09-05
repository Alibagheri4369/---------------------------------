import { ModuleDef } from '../types';

export const UNIVERSAL_MODULES: ModuleDef[] = [
  // ============ CORE ARCHITECTURE ============
  {
    id: 'frontend',
    category: 'core',
    nameFa: 'فرانت‌اند و رابط کاربری (Frontend UI)',
    nameEn: 'Frontend',
    description: 'کدنویسی صفحات کاربری، ریسپانسیو، کامپوننت‌ها و اتصال به سرور',
    iconName: 'Layout',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-fe', groupTitle: 'توسعه فرانت‌اند', taskId: 'fe_layout', taskText: 'پیاده‌سازی چیدمان کلی، هدر، فوتر و سیستم گریدبندی ریسپانسیو' },
      { phaseId: 13, groupId: 'dev-fe', groupTitle: 'توسعه فرانت‌اند', taskId: 'fe_routes', taskText: 'پیکربندی ساختار روتینگ (Router) و صفحات استاتیک و دینامیک' },
      { phaseId: 13, groupId: 'dev-fe', groupTitle: 'توسعه فرانت‌اند', taskId: 'fe_state', taskText: 'پیاده‌سازی مدیریت وضعیت (State Management) و کلاینت API' },
    ],
  },
  {
    id: 'backend',
    category: 'core',
    nameFa: 'بک‌اند و منطق سرور (Backend API)',
    nameEn: 'Backend',
    description: 'توسعه APIها، کنترلرها، سرویس‌ها و منطق تجاری سیستم',
    iconName: 'Server',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-be', groupTitle: 'توسعه بک‌اند', taskId: 'be_init', taskText: 'پایه‌ریزی ساختار پروژه بک‌اند، هدرهای امنیتی و میدلورهای لاگین' },
      { phaseId: 13, groupId: 'dev-be', groupTitle: 'توسعه بک‌اند', taskId: 'be_error', taskText: 'پیاده‌سازی میدلور گلوبال مدیریت خطا (Global Error Handler)' },
      { phaseId: 13, groupId: 'dev-be', groupTitle: 'توسعه بک‌اند', taskId: 'be_rate', taskText: 'تنظیم Rate Limiting روی مسیرهای عمومی برای مقابله با بروت‌فورس' },
    ],
  },
  {
    id: 'database',
    category: 'core',
    nameFa: 'پایگاه داده و روابط (Database & ORM)',
    nameEn: 'Database',
    description: 'طراحی اسکیمای جداول، روابط، ایندکس‌ها، مایگریشن و بهینه‌سازی کوئری',
    iconName: 'Database',
    defaultTasks: [
      { phaseId: 10, groupId: 'arch-db', groupTitle: 'طراحی پایگاه داده', taskId: 'db_schema', taskText: 'طراحی دیاگرام ERD و تعریف مدل‌ها در ORM (Prisma / Drizzle / TypeORM)' },
      { phaseId: 10, groupId: 'arch-db', groupTitle: 'طراحی پایگاه داده', taskId: 'db_index', taskText: 'تعریف ایندکس‌های کلیدی روی کلیدهای خارجی و فیلدهای جستجو' },
      { phaseId: 13, groupId: 'dev-db', groupTitle: 'پیاده‌سازی داده‌ها', taskId: 'db_migrate', taskText: 'اجرای مایگریشن اولیه و دیتای ساختگی تست (Database Seeding)' },
    ],
  },
  {
    id: 'cache',
    category: 'core',
    nameFa: 'سیستم کش و حافظه سریع (Cache Engine)',
    nameEn: 'Cache',
    description: 'استفاده از Redis / Memcached برای کش کوئری‌های تکراری و کاهش بار سرور',
    iconName: 'Zap',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-cache', groupTitle: 'پیاده‌سازی کشینگ', taskId: 'cache_setup', taskText: 'راه‌اندازی کلاینت Redis و استراتژی کش Cache-Aside' },
      { phaseId: 17, groupId: 'perf-cache', groupTitle: 'بهینه‌سازی کارایی', taskId: 'cache_invalidation', taskText: 'تنظیم قوانین ابطال کش (Cache Invalidation) هنگام ویرایش رکوردها' },
    ],
  },
  {
    id: 'queue',
    category: 'core',
    nameFa: 'صف پیام و پردازش‌های پس‌زمینه (Queue & Workers)',
    nameEn: 'Queue',
    description: 'اجرای غیرهمگام تسک‌های زمان‌بر (ارسال ایمیل/پیامک، تغییر سایز ویدیو، گزارش‌گیری)',
    iconName: 'Clock',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-queue', groupTitle: 'پردازش غیرهمگام', taskId: 'queue_setup', taskText: 'راه‌اندازی موتور صف BullMQ / RabbitMQ با قابلیت ریتری مجدد' },
      { phaseId: 13, groupId: 'dev-queue', groupTitle: 'پردازش غیرهمگام', taskId: 'queue_worker', taskText: 'طراحی ورکرها برای هندل کارهای سنگین بدون مسدودسازی Event Loop' },
    ],
  },

  // ============ AUTH & USER MANAGEMENT ============
  {
    id: 'auth',
    category: 'auth',
    nameFa: 'احراز هویت و ورود/ثبت‌نام (Authentication)',
    nameEn: 'Authentication',
    description: 'ورود با پیامک OTP، ایمیل، پسورد هش‌شده امن، گوگل لاگین و توکن‌های JWT',
    iconName: 'Lock',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-auth', groupTitle: 'احراز هویت', taskId: 'auth_jwt', taskText: 'پیاده‌سازی Access Token و Refresh Token در کوکی HttpOnly امن' },
      { phaseId: 13, groupId: 'dev-auth', groupTitle: 'احراز هویت', taskId: 'auth_otp', taskText: 'پیاده‌سازی کد تایید پیامکی (OTP) با محدودیت زمان ۲ دقیقه و Rate Limit' },
      { phaseId: 16, groupId: 'sec-auth', groupTitle: 'امنیت احراز هویت', taskId: 'auth_hash', taskText: 'استفاده از الگوریتم هش Argon2id یا Bcrypt برای کلمات عبور' },
    ],
  },
  {
    id: 'authorization_rbac',
    category: 'auth',
    nameFa: 'کنترل دسترسی و نقش‌ها (Authorization / RBAC)',
    nameEn: 'Authorization (RBAC)',
    description: 'سطوح دسترسی ادمین، مدیران، پرسنل، فروشندگان و مشتریان عادی',
    iconName: 'Shield',
    defaultTasks: [
      { phaseId: 10, groupId: 'arch-rbac', groupTitle: 'طراحی نقش‌ها', taskId: 'rbac_matrix', taskText: 'تدوین ماتریس مجوزها (Permissions Matrix) برای تمام اکشن‌های سیستم' },
      { phaseId: 13, groupId: 'dev-rbac', groupTitle: 'پیاده‌سازی مجوزها', taskId: 'rbac_guard', taskText: 'پیاده‌سازی گاردها و میدلورهای Role-based و Permission-based' },
    ],
  },
  {
    id: 'user_dashboard',
    category: 'auth',
    nameFa: 'داشبورد اختصاصی کاربران (User Dashboard)',
    nameEn: 'User Dashboard',
    description: 'پرتال کاربر برای ویرایش پروفایل، تغییر رمز، مشاهده لاگین‌ها و سوابق فعالیت',
    iconName: 'UserCheck',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-user-dash', groupTitle: 'داشبورد کاربری', taskId: 'dash_profile', taskText: 'طراحی صفحه ویرایش مشخصات، آپلود آواتار و شماره موبایل' },
      { phaseId: 13, groupId: 'dev-user-dash', groupTitle: 'داشبورد کاربری', taskId: 'dash_security', taskText: 'بخش تغییر کلمه عبور و مشاهده نشست‌های فعال (Active Sessions)' },
    ],
  },

  // ============ PANELS ============
  {
    id: 'admin_panel',
    category: 'panels',
    nameFa: 'پنل مدیریت جامع (Admin Panel)',
    nameEn: 'Admin Panel',
    description: 'داشبورد کنترل کل سیستم، جداول داده، نمودارها، تایید اطلاعات و لاگ‌ها',
    iconName: 'Sliders',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-admin', groupTitle: 'پنل ادمین', taskId: 'adm_kpi', taskText: 'طراحی کارت‌های خلاصه وضعیت و آمار کلیدی داشبورد اصلی ادمین' },
      { phaseId: 13, groupId: 'dev-admin', groupTitle: 'پنل ادمین', taskId: 'adm_crud', taskText: 'پیاده‌سازی جداول CRUD با فیلتر، صفحه‌بندی، سورت و جستجو' },
      { phaseId: 13, groupId: 'dev-admin', groupTitle: 'پنل ادمین', taskId: 'adm_logs', taskText: 'پیاده‌سازی جدول مشاهده لاگ فعالیت‌ها (Audit Log) توسط اپراتورها' },
    ],
  },
  {
    id: 'seller_panel',
    category: 'panels',
    nameFa: 'پنل اختصاصی فروشندگان (Seller / Vendor Panel)',
    nameEn: 'Seller Panel',
    description: 'داشبورد فروشنده برای ثبت کالای جدید، مدیریت سفارشات و کیف پول تسویه',
    iconName: 'Store',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-seller', groupTitle: 'پنل فروشنده', taskId: 'sel_onboard', taskText: 'فرم ثبت‌نام فروشنده و بارگذاری مدارک هویتی و تایید ادمین' },
      { phaseId: 13, groupId: 'dev-seller', groupTitle: 'پنل فروشنده', taskId: 'sel_products', taskText: 'مدیریت تنوع محصولات، قیمت‌گذاری و تعداد در انبار فروشنده' },
      { phaseId: 13, groupId: 'dev-seller', groupTitle: 'پنل فروشنده', taskId: 'sel_wallet', taskText: 'کیف پول فروشنده، محاسبه کمیسیون و درخواست تسویه‌حساب شبا' },
    ],
  },
  {
    id: 'teacher_panel',
    category: 'panels',
    nameFa: 'پنل اساتید و مدرسان (Teacher / Instructor Panel)',
    nameEn: 'Teacher Panel',
    description: 'داشبورد مدرس برای آپلود جلسات درس، بررسی تمارین دانشجویان و ارتباط با کلاس',
    iconName: 'GraduationCap',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-teacher', groupTitle: 'پنل مدرسان', taskId: 'tch_course', taskText: 'سازنده سرفصل‌های دوره و آپلود فایل‌ها و ویدیوهای جلسات' },
      { phaseId: 13, groupId: 'dev-teacher', groupTitle: 'پنل مدرسان', taskId: 'tch_grading', taskText: 'سیستم ثبت نمره و بررسی تکالیف و پروژه‌های ارسالی دانشجویان' },
    ],
  },

  // ============ COMMERCE & ORDERS ============
  {
    id: 'ecommerce',
    category: 'commerce',
    nameFa: 'ماژول هسته فروشگاه اینترنتی (E-commerce Core)',
    nameEn: 'E-commerce Core',
    description: 'کاتالوگ، تخفیف‌ها، مالیات، کوپن، فاکتور و چرخه سفارش',
    iconName: 'ShoppingBag',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-ecom', groupTitle: 'هسته فروشگاه', taskId: 'ecom_invoice', taskText: 'تولید فاکتور رسمی استاندارد با فرمت PDF و شماره سریال یکتا' },
      { phaseId: 13, groupId: 'dev-ecom', groupTitle: 'هسته فروشگاه', taskId: 'ecom_discount', taskText: 'موتور کدهای تخفیف درصدی/مبلغی با محدودیت سقف و تعداد استفاده' },
    ],
  },
  {
    id: 'product_management',
    category: 'commerce',
    nameFa: 'مدیریت محصولات و خدمات (Product & Catalog)',
    nameEn: 'Product Management',
    description: 'ثبت ویژگی‌ها، دسته‌بندی چندسطحی، تنوع رنگ/سایز (SKU)، گالری عکس',
    iconName: 'Box',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-prod', groupTitle: 'کاتالوگ محصول', taskId: 'prod_sku', taskText: 'سیستم محصولات متغیر و ماتریس تنوع سایز/رنگ با بارکد اختصاصی' },
      { phaseId: 13, groupId: 'dev-prod', groupTitle: 'کاتالوگ محصول', taskId: 'prod_gallery', taskText: 'گالری تصاویر با زوم و قابلیت برش و بهینه‌سازی اتوماتیک' },
    ],
  },
  {
    id: 'cart',
    category: 'commerce',
    nameFa: 'سبد خرید هوشمند (Cart System)',
    nameEn: 'Cart System',
    description: 'سبد خرید سینک‌شده بین کلاینت و سرور با بررسی آنی موجودی',
    iconName: 'ShoppingCart',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-cart', groupTitle: 'توسعه سبد خرید', taskId: 'cart_sync', taskText: 'همگام‌سازی سبد خرید لوکال کاربر مهمان پس از لاگین به اکانت' },
      { phaseId: 13, groupId: 'dev-cart', groupTitle: 'توسعه سبد خرید', taskId: 'cart_val', taskText: 'اعتبارسنجی مجدد قیمت و موجودی دقیق در مرحله نهایی پرداخت' },
    ],
  },
  {
    id: 'order_management',
    category: 'commerce',
    nameFa: 'مدیریت سفارشات و وضعیت‌ها (Order Management)',
    nameEn: 'Order Management',
    description: 'چرخه کامل وضعیت سفارش (در انتظار پرداخت، پردازش، بسته‌بندی، تحویل به پست، تکمیل)',
    iconName: 'FileText',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-order', groupTitle: 'مدیریت سفارشات', taskId: 'ord_state', taskText: 'ماشین وضعیت سفارشات (State Machine) و جلوگیری از تغییرات نامعتبر' },
      { phaseId: 13, groupId: 'dev-order', groupTitle: 'مدیریت سفارشات', taskId: 'ord_track', taskText: 'کد رهگیری پستی و ارسال پیامک وضعیت به مشتری' },
    ],
  },
  {
    id: 'payment',
    category: 'commerce',
    nameFa: 'اتصال به درگاه پرداخت بانکی (Payment Gateway)',
    nameEn: 'Payment Gateway',
    description: 'اتصال به درگاه مستقیم شاپرک (سداد، بهپرداخت، به‌پرداز) و واسط با وب‌هوک وریفای امن',
    iconName: 'CreditCard',
    defaultTasks: [
      { phaseId: 14, groupId: 'int-pay', groupTitle: 'یکپارچه‌سازی درگاه', taskId: 'pay_token', taskText: 'ارسال مبلغ و دریافت توکن پرداخت از درگاه بانکی' },
      { phaseId: 14, groupId: 'int-pay', groupTitle: 'یکپارچه‌سازی درگاه', taskId: 'pay_callback', taskText: 'روت کال‌بک بازگشت مشتری و استعلام وریفای قطعی از وب‌سرویس بانک' },
      { phaseId: 16, groupId: 'sec-pay', groupTitle: 'امنیت پرداخت', taskId: 'pay_idempotency', taskText: 'جلوگیری از دوبار شارژ یا وریفای تکراری با کلیدهای Idempotency' },
    ],
  },
  {
    id: 'subscription',
    category: 'commerce',
    nameFa: 'سیستم اشتراک و پلن‌های دوره‌ای (Subscription & Billing)',
    nameEn: 'Subscription',
    description: 'تعریف پلن‌های ماهانه/سالانه، تمدید خودکار، فاکتورهای دوره‌ای و سهمیه مصرف',
    iconName: 'Repeat',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-sub', groupTitle: 'سیستم اشتراک', taskId: 'sub_plans', taskText: 'طراحی جدول پلن‌های قیمتی با محدودیت‌های فیچر و ترافیک' },
      { phaseId: 13, groupId: 'dev-sub', groupTitle: 'سیستم اشتراک', taskId: 'sub_cron', taskText: 'کرون‌جاب شبانه بررسی انقضای اشتراک‌ها و ارسال هشدار تمدید' },
    ],
  },
  {
    id: 'inventory',
    category: 'commerce',
    nameFa: 'انبارداری و مدیریت موجودی (Inventory Control)',
    nameEn: 'Inventory Management',
    description: 'مدیریت موجودی واقعی انبار، هشدار اتمام کالا و قفل موقت موجودی هنگام پرداخت',
    iconName: 'Archive',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-inv', groupTitle: 'انبارداری', taskId: 'inv_lock', taskText: 'قفل موقت کالا به مدت ۱۵ دقیقه در زمان هدایت کاربر به درگاه بانک' },
      { phaseId: 13, groupId: 'dev-inv', groupTitle: 'انبارداری', taskId: 'inv_alert', taskText: 'ارسال هشدار کمبود موجودی به اپراتور انبار' },
    ],
  },
  {
    id: 'shipping',
    category: 'commerce',
    nameFa: 'سیستم ارسال و محاسبه کرایه (Shipping & Logistics)',
    nameEn: 'Shipping',
    description: 'اتصال به وب‌سرویس‌های پستی، تیپاکس، اسنپ‌باکس و محاسبه خودکار کرایه بر اساس وزن و شهر',
    iconName: 'Truck',
    defaultTasks: [
      { phaseId: 14, groupId: 'int-ship', groupTitle: 'یکپارچه‌سازی ارسال', taskId: 'ship_calc', taskText: 'محاسبه آنلاین هزینه پست پیشتاز بر اساس وزن سبد و استان مقصد' },
      { phaseId: 14, groupId: 'int-ship', groupTitle: 'یکپارچه‌سازی ارسال', taskId: 'ship_label', taskText: 'چاپ اتوماتیک برچسب پستی و بارکد سفارش برای بسته‌بندی' },
    ],
  },

  // ============ BOOKING & CALENDAR ============
  {
    id: 'booking',
    category: 'booking',
    nameFa: 'سیستم رزرواسیون و نوبت‌دهی (Booking Engine)',
    nameEn: 'Booking Engine',
    description: 'تعریف اسلات‌های زمانی، مدت هر جلسه، ظرفیت و ثبت نوبت',
    iconName: 'CalendarCheck',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-book', groupTitle: 'توسعه نوبت‌دهی', taskId: 'book_slots', taskText: 'الگوریتم تولید بازه‌های زمانی آزاد بر اساس ساعات کاری پزشک/سرویس' },
      { phaseId: 15, groupId: 'qa-book', groupTitle: 'تست رزرواسیون', taskId: 'book_concurrency', taskText: 'تست دقیق هجوم همزمان برای جلوگیری از رزرو دوگانه یک نوبت (Double Booking)' },
    ],
  },
  {
    id: 'calendar',
    category: 'booking',
    nameFa: 'تقویم تعاملی و زمان‌بندی (Interactive Calendar)',
    nameEn: 'Calendar',
    description: 'تقویم شمسی ماهانه و هفتگی با رنگ‌بندی روزهای پر و خالی',
    iconName: 'Calendar',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-cal', groupTitle: 'تقویم', taskId: 'cal_jalali', taskText: 'پیاده‌سازی کامپوننت تقویم شمسی بدون باگ ماه‌های ۳۱ و ۲۹ روزه' },
      { phaseId: 13, groupId: 'dev-cal', groupTitle: 'تقویم', taskId: 'cal_holidays', taskText: 'غیرفعال‌سازی روزهای تعطیل رسمی و مرخصی‌ها در تقویم' },
    ],
  },

  // ============ COMMUNICATION ============
  {
    id: 'sms_notifications',
    category: 'communication',
    nameFa: 'پنل پیامک خدماتی و اعلانات (SMS Gateway)',
    nameEn: 'SMS Notifications',
    description: 'ارسال فوری پیامک‌های کد تایید، تایید سفارش و اطلاعیه‌ها از خط خدماتی',
    iconName: 'MessageSquare',
    defaultTasks: [
      { phaseId: 14, groupId: 'int-sms', groupTitle: 'یکپارچه‌سازی پیامک', taskId: 'sms_provider', taskText: 'تنظیم وب‌سرویس پترن کاوه‌نگار / فراپیامک برای ارسال بدون بلک‌لیست' },
      { phaseId: 14, groupId: 'int-sms', groupTitle: 'یکپارچه‌سازی پیامک', taskId: 'sms_templates', taskText: 'تعریف و تایید پترن‌های پیامک ثبت سفارش، ثبت‌نام و یادآوری' },
    ],
  },
  {
    id: 'email_notifications',
    category: 'communication',
    nameFa: 'ارسال ایمیل سازمانی (Email Notifications)',
    nameEn: 'Email Notifications',
    description: 'ارسال ایمیل‌های تایید حساب، فاکتور خرید و بازنشانی کلمه عبور با قالب مدرن HTML',
    iconName: 'Mail',
    defaultTasks: [
      { phaseId: 14, groupId: 'int-mail', groupTitle: 'یکپارچه‌سازی ایمیل', taskId: 'mail_smtp', taskText: 'کانفیگ سرور SMTP سازمانی یا سرویس Resend / Mailgun' },
      { phaseId: 14, groupId: 'int-mail', groupTitle: 'یکپارچه‌سازی ایمیل', taskId: 'mail_templates', taskText: 'طراحی قالب‌های ایمیل ریسپانسیو سازگار با تمام کلاینت‌های ایمیل' },
    ],
  },
  {
    id: 'chat',
    category: 'communication',
    nameFa: 'چت آنلاین و پیام‌رسان داخلی (Live Chat / Messaging)',
    nameEn: 'Chat & Messaging',
    description: 'گفتگوی زنده متنی بین کاربر و اپراتور پشتیبانی یا بین کاربران پلتفرم',
    iconName: 'MessageCircle',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-chat', groupTitle: 'توسعه چت', taskId: 'chat_socket', taskText: 'پیاده‌سازی سوکت دوطرفه برای تبادل آنی پیام‌ها و وضعیت تایپ کردن' },
      { phaseId: 13, groupId: 'dev-chat', groupTitle: 'توسعه چت', taskId: 'chat_history', taskText: 'ذخیره‌سازی و بازیابی تاریخچه پیام‌ها با صفحه‌بندی نامحدود' },
    ],
  },
  {
    id: 'real_time',
    category: 'communication',
    nameFa: 'ارتباطات بی‌درنگ (Real-Time WebSockets)',
    nameEn: 'Real-Time WebSockets',
    description: 'سوکت و سرور ایونت‌ها برای تغییرات آنی وضعیت سفارش، ناتیفیکیشن و داشبوردها',
    iconName: 'Radio',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-rt', groupTitle: 'ارتباطات Real-time', taskId: 'rt_hub', taskText: 'معماری سرور سوکت و روم‌های خصوصی (Socket Rooms & Channels)' },
      { phaseId: 15, groupId: 'qa-rt', groupTitle: 'تست Real-time', taskId: 'rt_reconnect', taskText: 'تست قطع و وصل خودکار اینترنت کلاینت و بازیابی اتصال' },
    ],
  },

  // ============ CONTENT & MEDIA ============
  {
    id: 'cms',
    category: 'content',
    nameFa: 'مدیریت محتوا و مقالات (Content Management CMS)',
    nameEn: 'CMS',
    description: 'ویرایشگر متنی غنی (Rich Text / Markdown)، مدیریت برچسب‌ها، دسته‌ها و پیش‌نویس',
    iconName: 'Edit3',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-cms', groupTitle: 'مدیریت محتوا', taskId: 'cms_editor', taskText: 'یکپارچه‌سازی ادیتور مدرن مانند Tiptap / BlockNote' },
      { phaseId: 13, groupId: 'dev-cms', groupTitle: 'مدیریت محتوا', taskId: 'cms_slug', taskText: 'مدیریت اسلاگ‌های یونیک فارسی و جلوگیری از ریدایرکت‌های لوپ' },
    ],
  },
  {
    id: 'file_upload',
    category: 'content',
    nameFa: 'آپلود امن فایل‌ها (File Upload Engine)',
    nameEn: 'File Upload',
    description: 'آپلود با درگ اند دراپ، اعتبارسنجی سایز و فرمت فایل، بررسی محتوای مخرب',
    iconName: 'UploadCloud',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-upload', groupTitle: 'آپلود فایل', taskId: 'up_validate', taskText: 'اعتبارسنجی نوع MIME-Type واقعی فایل در بک‌اند نه فقط پسوند ظاهری' },
      { phaseId: 16, groupId: 'sec-upload', groupTitle: 'امنیت آپلود', taskId: 'up_sanitize', taskText: 'تغییر نام تصادفی فایل و عدم اجرای اسکریپت در پوشه آپلود' },
    ],
  },
  {
    id: 'object_storage',
    category: 'content',
    nameFa: 'فضای ذخیره‌سازی ابری (S3 / Object Storage)',
    nameEn: 'Object Storage',
    description: 'اتصال به باکت‌های سازگار با S3 (مانند MinIO، ابر آروان یا Cloudflare R2)',
    iconName: 'HardDrive',
    defaultTasks: [
      { phaseId: 14, groupId: 'int-s3', groupTitle: 'اتصال استوریج ابری', taskId: 's3_bucket', taskText: 'تنظیم باکت، کلیدهای دسترسی امن و سیاست‌های CORS برای دانلود/آپلود' },
      { phaseId: 14, groupId: 'int-s3', groupTitle: 'اتصال استوریج ابری', taskId: 's3_presigned', taskText: 'تولید لینک‌های موقت پیش‌امضاشده (Presigned URLs) برای دانلود امن' },
    ],
  },
  {
    id: 'media_management',
    category: 'content',
    nameFa: 'مدیریت رسانه و بهینه‌سازی ویدیو/عکس (Media Optimization)',
    nameEn: 'Media Management',
    description: 'تبدیل خودکار عکس به WebP و ترنسکدینگ ویدیو برای استریمینگ سبک',
    iconName: 'Film',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-media', groupTitle: 'پردازش رسانه', taskId: 'med_sharp', taskText: 'تبدیل و فشرده‌سازی خودکار تصاویر با Sharp در زمان آپلود' },
      { phaseId: 17, groupId: 'perf-media', groupTitle: 'بهینه‌سازی مدیا', taskId: 'med_responsive', taskText: 'تولید سایزهای مختلف عکس (Thumbnail, Medium, Large) برای لود سریع' },
    ],
  },

  // ============ SEARCH & DATA ============
  {
    id: 'search',
    category: 'data',
    nameFa: 'موتور جستجوی پیشرفته (Full-Text Search)',
    nameEn: 'Search Engine',
    description: 'جستجوی هوشمند در عنوان، متن و ویژگی‌ها با اصلاح خطای املایی و هایلایت نتایج',
    iconName: 'Search',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-search', groupTitle: 'توسعه موتور جستجو', taskId: 'srch_engine', taskText: 'پیاده‌سازی جستجوی تمام‌متن (Postgres Full-text / Meilisearch / Typesense)' },
      { phaseId: 13, groupId: 'dev-search', groupTitle: 'توسعه موتور جستجو', taskId: 'srch_persian', taskText: 'پشتیبانی از تصحیح کلمات فارسی و نرمال‌سازی ی/ک و نیم‌فاصله' },
    ],
  },
  {
    id: 'filtering',
    category: 'data',
    nameFa: 'فیلترهای چندگانه و هوشمند (Faceted Filtering)',
    nameEn: 'Filtering',
    description: 'فیلتر همزمان بر اساس قیمت، دسته‌بندی، برند، وضعیت موجودی و امتیاز',
    iconName: 'Filter',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-filter', groupTitle: 'فیلتر پیشرفته', taskId: 'flt_query', taskText: 'طراحی کوئری‌های داینامیک فیلترینگ با پشتیبانی از URL Search Params' },
      { phaseId: 17, groupId: 'perf-filter', groupTitle: 'بهینه‌سازی فیلترها', taskId: 'flt_index', taskText: 'ایندکس‌گذاری ترکیبی (Composite Index) برای فیلترهای پرمصرف' },
    ],
  },
  {
    id: 'maps',
    category: 'data',
    nameFa: 'نقشه و سرویس‌های مکان‌محور (Maps & Geocoding)',
    nameEn: 'Maps',
    description: 'نمایش نقشه تعاملی، پین کردن آدرس، تبدیل مختصات به آدرس متنی (Reverse Geocoding)',
    iconName: 'Map',
    defaultTasks: [
      { phaseId: 14, groupId: 'int-map', groupTitle: 'یکپارچه‌سازی نقشه', taskId: 'map_sdk', taskText: 'اتصال به کیت توسعه نقشه نشان / بلد / مپ‌باکس با کلید امن کلاینت' },
      { phaseId: 14, groupId: 'int-map', groupTitle: 'یکپارچه‌سازی نقشه', taskId: 'map_address', taskText: 'دریافت خودکار مختصات پلاک و ثبت در اطلاعات آدرس تحویل سفارش' },
    ],
  },
  {
    id: 'gps',
    category: 'data',
    nameFa: 'ردیابی زنده موقعیت (GPS Tracking)',
    nameEn: 'GPS Tracking',
    description: 'ردیابی ناوگان، پیک یا راننده روی نقشه به صورت لحظه‌ای با وب‌سوکت',
    iconName: 'Navigation',
    defaultTasks: [
      { phaseId: 13, groupId: 'dev-gps', groupTitle: 'ردیابی زنده', taskId: 'gps_stream', taskText: 'دریافت جریان موقعیت مکانی راننده و انتشار در کانال وب‌سوکت' },
    ],
  },

  // ============ AI & INTEGRATIONS ============
  {
    id: 'ai',
    category: 'ai',
    nameFa: 'هوش مصنوعی و مدل‌های زبانی (AI Engine)',
    nameEn: 'AI Integration',
    description: 'اتصال به Gemini / OpenAI / مدل‌های بومی، پرامپت انجینیرینگ و استریمینگ پاسخ‌ها',
    iconName: 'Sparkles',
    defaultTasks: [
      { phaseId: 14, groupId: 'int-ai', groupTitle: 'یکپارچه‌سازی هوش مصنوعی', taskId: 'ai_stream', taskText: 'پیاده‌سازی روت استریم سرور برای نمایش کلمه‌به‌کلمه پاسخ AI' },
      { phaseId: 14, groupId: 'int-ai', groupTitle: 'یکپارچه‌سازی هوش مصنوعی', taskId: 'ai_token', taskText: 'محاسبه توکن‌های ورودی/خروجی و کسر از کردیت کاربر' },
      { phaseId: 16, groupId: 'sec-ai', groupTitle: 'امنیت هوش مصنوعی', taskId: 'ai_guard', taskText: 'جلوگیری از حملات تزریق پرامپت (Prompt Injection) و حفاظت از سکرت‌ها' },
    ],
  },
  {
    id: 'webhooks',
    category: 'data',
    nameFa: 'وب‌هوک‌ها و رویدادهای خروجی/ورودی (Webhooks)',
    nameEn: 'Webhooks',
    description: 'ارسال و دریافت وب‌هوک برای اطلاع‌رسانی خودکار به سرویس‌های بیرونی',
    iconName: 'Send',
    defaultTasks: [
      { phaseId: 14, groupId: 'int-hook', groupTitle: 'وب‌هوک‌ها', taskId: 'hook_verify', taskText: 'اعتبارسنجی امضای هدر HMAC (Secret Signature) وب‌هوک‌های دریافتی' },
      { phaseId: 14, groupId: 'int-hook', groupTitle: 'وب‌هوک‌ها', taskId: 'hook_dispatch', taskText: 'سیستم ارسال رویداد با صف و تکرار در صورت خطای سرور مقصد' },
    ],
  },

  // ============ SEO, ANALYTICS & DEVOPS ============
  {
    id: 'seo',
    category: 'data',
    nameFa: 'سئو تکنیکال و استراکچردیتا (Technical SEO)',
    nameEn: 'Technical SEO',
    description: 'متاتگ‌ها، OpenGraph، تولید خودکار Sitemap.xml، Robots.txt و اسکیما مارک‌آپ',
    iconName: 'Globe',
    defaultTasks: [
      { phaseId: 18, groupId: 'seo-tech', groupTitle: 'سئو تکنیکال', taskId: 'seo_meta', taskText: 'پیاده‌سازی متاتگ‌های داینامیک عنوان، توضیحات، کنونیکال و تصاویر اشتراک‌گذاری' },
      { phaseId: 18, groupId: 'seo-tech', groupTitle: 'سئو تکنیکال', taskId: 'seo_sitemap', taskText: 'تولید خودکار sitemap.xml داینامیک برای تمام صفحات و محصولات' },
      { phaseId: 18, groupId: 'seo-tech', groupTitle: 'سئو تکنیکال', taskId: 'seo_schema', taskText: 'تزریق Schema.org ساختاریافته متناسب با موضوع پروژه (Product, Article, Org)' },
    ],
  },
  {
    id: 'analytics',
    category: 'data',
    nameFa: 'تحلیل داده و ابزارهای آماری (Analytics & GTM)',
    nameEn: 'Analytics',
    description: 'اتصال Google Analytics 4، Tag Manager و رهگیری فانل‌های تبدیل و رویدادها',
    iconName: 'BarChart2',
    defaultTasks: [
      { phaseId: 19, groupId: 'analytics-int', groupTitle: 'آمار و آنالیتیکس', taskId: 'ga4_setup', taskText: 'نصب اسکریپت بهینه GA4 / Clarity بدون کاهش نمره سرعت لود' },
      { phaseId: 19, groupId: 'analytics-int', groupTitle: 'آمار و آنالیتیکس', taskId: 'ga4_events', taskText: 'تعریف رویدادهای کلیدی خرید، ثبت‌نام و کلیک روی دکمه‌های اصلی' },
    ],
  },
  {
    id: 'security',
    category: 'security',
    nameFa: 'هاردنینگ و امنیت سیستم (Security Hardening)',
    nameEn: 'Security',
    description: 'هدرهای امنیتی، مهار حملات CSRF، XSS، SQLi، IDOR، محافظت از متغیرهای محرمانه',
    iconName: 'ShieldAlert',
    defaultTasks: [
      { phaseId: 16, groupId: 'sec-hardening', groupTitle: 'امنیت سیستم', taskId: 'sec_headers', taskText: 'تنظیم هدرهای امنیتی Content-Security-Policy، HSTS، X-Frame-Options' },
      { phaseId: 16, groupId: 'sec-hardening', groupTitle: 'امنیت سیستم', taskId: 'sec_cors', taskText: 'پیکربندی دقیق دامنه مجاز CORS و بستن دسترسی دامنه‌های متفرقه' },
      { phaseId: 16, groupId: 'sec-hardening', groupTitle: 'امنیت سیستم', taskId: 'sec_audit', taskText: 'اجرای اسکن آسیب‌پذیری پکیج‌های پروژه (npm audit)' },
    ],
  },
  {
    id: 'backup',
    category: 'devops',
    nameFa: 'پشتیبان‌گیری خودکار و بازیابی (Backup & DR)',
    nameEn: 'Backup & Recovery',
    description: 'بکاپ اتوماتیک روزانه دیتابیس و فایل‌ها روی استوریج امن مجزا به همراه تست ریستور',
    iconName: 'Save',
    defaultTasks: [
      { phaseId: 21, groupId: 'backup-ops', groupTitle: 'پشتیبان‌گیری', taskId: 'bkp_cron', taskText: 'تنظیم اسکریپت بکاپ خودکار دیتابیس (pg_dump / mysqldump) به مقصد S3 مجزا' },
      { phaseId: 21, groupId: 'backup-ops', groupTitle: 'پشتیبان‌گیری', taskId: 'bkp_restore', taskText: 'اجرای موفقیت‌آمیز تست بازیابی (Test Restore Routine) روی محیط تستی' },
    ],
  },
  {
    id: 'deployment',
    category: 'devops',
    nameFa: 'استقرار، داکر و کلود (DevOps & Deployment)',
    nameEn: 'Deployment',
    description: 'داکریزه کردن، سرور Nginx، گواهی SSL، اتصال دامنه و خط لوله CI/CD',
    iconName: 'CloudRain',
    defaultTasks: [
      { phaseId: 20, groupId: 'deploy-ops', groupTitle: 'استقرار و دیپلوی', taskId: 'dep_docker', taskText: 'نگارش Dockerfile چندمرحله‌ای (Multi-stage build) با کمترین حجم ایمیج' },
      { phaseId: 20, groupId: 'deploy-ops', groupTitle: 'استقرار و دیپلوی', taskId: 'dep_nginx', taskText: 'کانفیگ Reverse Proxy در Nginx با فشرده‌سازی Gzip/Brotli' },
      { phaseId: 20, groupId: 'deploy-ops', groupTitle: 'استقرار و دیپلوی', taskId: 'dep_ssl', taskText: 'نصب گواهی امنیتی رایگان Let’s Encrypt با تمدید خودکار Certbot' },
    ],
  },
];
