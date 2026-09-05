import { TechStackConfig } from '../types';

export interface TechOption {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'cache' | 'storage' | 'infrastructure' | 'cdn' | 'authMethod' | 'cssFramework';
  icon?: string;
}

export const TECH_OPTIONS: Record<string, string[]> = {
  frontend: [
    'Next.js 15 (React 19 App Router)',
    'React (Vite + TypeScript)',
    'Nuxt 3 (Vue 3)',
    'Vue.js (Vite)',
    'SvelteKit',
    'Astro (Content-Driven SSG)',
    'WordPress (Elementor / Gutenberg)',
    'Headless Next.js + WordPress REST/GraphQL',
    'Remix / React Router 7',
    'Angular 18+',
  ],
  backend: [
    'Node.js / Express (TypeScript)',
    'NestJS (Enterprise Modular TS)',
    'Next.js Server Actions / API Routes',
    'Python (FastAPI)',
    'Python (Django & Django Rest Framework)',
    'PHP (Laravel 11)',
    'Go (Fiber / Gin)',
    'C# (.NET 8 Core Web API)',
    'WordPress Custom PHP & Plugins',
  ],
  database: [
    'PostgreSQL (با Prisma / Drizzle ORM)',
    'MySQL 8 / MariaDB',
    'MongoDB (Mongoose / Document Store)',
    'Supabase (PostgreSQL + Auth + Storage)',
    'SQLite (LibSQL / Cloudflare D1)',
    'Firebase Firestore (NoSQL)',
    'TimescaleDB (برای دیتای زمان‌محور/IoT)',
    'Vector DB (pgvector / Pinecone / Qdrant)',
  ],
  cache: [
    'Redis (In-Memory Data Store)',
    'Memcached',
    'Upstash Redis (Serverless)',
    'Cloudflare KV',
    'بدون سیستم کش اختصاصی',
  ],
  storage: [
    'S3-Compatible Object Storage (ابر آروان)',
    'Cloudflare R2 (بدون هزینه خروجی ترافیک)',
    'MinIO (Self-Hosted Object Storage)',
    'Supabase Storage',
    'لوکال استوریج سرور (Local Disk)',
  ],
  infrastructure: [
    'Docker + Docker Compose (توصیه شده)',
    'VPS لینوکس (Ubuntu 24.04 LTS)',
    'Cloud Run / کانتینر ابری بدون سرور',
    'Vercel / Netlify (کلاینت و سرورلس)',
    'هاست اشتراکی لینوکس (cPanel / DirectAdmin)',
    'Kubernetes (K8s) کلاستر اختصاصی',
  ],
  cdn: [
    'کلودفلر (Cloudflare CDN & WAF)',
    'ابر آروان (ArvanCloud CDN)',
    'بدون CDN (مستقیم روی سرور)',
  ],
  authMethod: [
    'JWT در کوکی HttpOnly امن + رفرش توکن',
    'پیامک یکبارمصرف OTP با اعتبارسنجی بک‌اند',
    'NextAuth.js / Auth.js',
    'Firebase Auth / Supabase Auth',
    'گوگل OAuth 2.0 (Google Sign-In)',
    'Session-based Auth در پایگاه داده',
  ],
  cssFramework: [
    'Tailwind CSS v4 (توصیه شده)',
    'Tailwind CSS v3 + shadcn/ui',
    'Bootstrap 5',
    'CSS Modules خالص',
  ],
};

export const TECH_PRESETS: { name: string; description: string; stack: TechStackConfig }[] = [
  {
    name: 'توسعه استاندارد فول‌استک مدرن (Next.js + Postgres)',
    description: 'انتخاب اول برای وب‌اپلیکیشن‌ها، پلتفرم‌های SaaS، فروشگاه‌ها و رزرو مدرن',
    stack: {
      frontend: 'Next.js 15 (React 19 App Router)',
      backend: 'Next.js Server Actions / API Routes',
      database: 'PostgreSQL (با Prisma / Drizzle ORM)',
      cache: 'Redis (In-Memory Data Store)',
      storage: 'Cloudflare R2 (بدون هزینه خروجی ترافیک)',
      infrastructure: 'Docker + Docker Compose (توصیه شده)',
      cdn: 'کلودفلر (Cloudflare CDN & WAF)',
      authMethod: 'JWT در کوکی HttpOnly امن + رفرش توکن',
      cssFramework: 'Tailwind CSS v4 (توصیه شده)',
      additionalLibraries: ['Zod', 'TanStack Query', 'Lucide React', 'Framer Motion'],
    },
  },
  {
    name: 'استک سازمانی اینترپرایز (NestJS + React + Postgres)',
    description: 'مناسب برای سامانه‌های مقیاس‌پذیر، ERP، مارکت‌پلیس‌ها و سیستم‌های پیچیده بانکی',
    stack: {
      frontend: 'React (Vite + TypeScript)',
      backend: 'NestJS (Enterprise Modular TS)',
      database: 'PostgreSQL (با Prisma / Drizzle ORM)',
      cache: 'Redis (In-Memory Data Store)',
      storage: 'S3-Compatible Object Storage (ابر آروان)',
      infrastructure: 'VPS لینوکس (Ubuntu 24.04 LTS)',
      cdn: 'کلودفلر (Cloudflare CDN & WAF)',
      authMethod: 'پیامک یکبارمصرف OTP با اعتبارسنجی بک‌اند',
      cssFramework: 'Tailwind CSS v4 (توصیه شده)',
      additionalLibraries: ['BullMQ', 'Passport.js', 'TypeORM', 'Swagger'],
    },
  },
  {
    name: 'استک سریع و محبوب لاراول (Laravel + Vue/React)',
    description: 'بسیار محبوب در بازار ایران برای انواع وبسایت‌های شرکتی، فروشگاهی و پورتال‌ها',
    stack: {
      frontend: 'Nuxt 3 (Vue 3)',
      backend: 'PHP (Laravel 11)',
      database: 'MySQL 8 / MariaDB',
      cache: 'Redis (In-Memory Data Store)',
      storage: 'لوکال استوریج سرور (Local Disk)',
      infrastructure: 'VPS لینوکس (Ubuntu 24.04 LTS)',
      cdn: 'ابر آروان (ArvanCloud CDN)',
      authMethod: 'Session-based Auth در پایگاه داده',
      cssFramework: 'Tailwind CSS v4 (توصیه شده)',
      additionalLibraries: ['Laravel Sanctum', 'Inertia.js', 'Horizon'],
    },
  },
  {
    name: 'استک هوش مصنوعی و داده‌محور (FastAPI + React + VectorDB)',
    description: 'مناسب برای پلتفرم‌های AI SaaS، دستیارهای چت هوشمند و تحلیل داده',
    stack: {
      frontend: 'Next.js 15 (React 19 App Router)',
      backend: 'Python (FastAPI)',
      database: 'Vector DB (pgvector / Pinecone / Qdrant)',
      cache: 'Redis (In-Memory Data Store)',
      storage: 'S3-Compatible Object Storage (ابر آروان)',
      infrastructure: 'Cloud Run / کانتینر ابری بدون سرور',
      cdn: 'کلودفلر (Cloudflare CDN & WAF)',
      authMethod: 'JWT در کوکی HttpOnly امن + رفرش توکن',
      cssFramework: 'Tailwind CSS v4 (توصیه شده)',
      additionalLibraries: ['LangChain', 'OpenAI / Gemini SDK', 'Celery'],
    },
  },
];
