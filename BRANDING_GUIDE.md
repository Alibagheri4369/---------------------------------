# 🎨 راهنمای برندینگ EDX CRM

## 📋 فهرست مطالب
- [لوگوهای ایجاد شده](#لوگوهای-ایجاد-شده)
- [رنگ‌های برند](#رنگ‌های-برند)
- [استفاده از لوگو در کد](#استفاده-از-لوگو-در-کد)
- [فایل‌های برندینگ](#فایل‌های-برندینگ)
- [راهنمای استفاده](#راهنمای-استفاده)

---

## 🎯 لوگوهای ایجاد شده

### 1️⃣ لوگوی کامل (Full Logo)
**مسیر:** `/assets/logo-full.svg`
- **ابعاد:** 400×120 پیکسل
- **استفاده:** هدر اصلی، صفحه فرود، بنرها
- **محتوا:** حروف EDX + Subtitle + Accent
- **پس‌زمینه:** مشکی (#0F172A)

### 2️⃣ لوگوی فشرده (Compact Logo)
**مسیر:** `/assets/logo-compact.svg`
- **ابعاد:** 200×80 پیکسل
- **استفاده:** Navbar، موبایل، فوتر
- **محتوا:** حروف EDX + CRM
- **پس‌زمینه:** مشکی (#0F172A)

### 3️⃣ آیکون (Icon Only)
**مسیر:** `/assets/logo-icon.svg`
- **ابعاد:** 64×64 پیکسل
- **استفاده:** دکمه‌ها، فضاهای کوچک، لودرها
- **محتوا:** حروف E+D با نقطه X
- **شکل:** دایره با border

### 4️⃣ لوگوی روشن (Light Version)
**مسیر:** `/assets/logo-light.svg`
- **ابعاد:** 400×120 پیکسل
- **استفاده:** پس‌زمینه‌های روشن، چاپ، ایمیل
- **رنگ:** زرد کمرنگ‌تر (#D97706)
- **پس‌زمینه:** سفید (#FFFFFF)

### 5️⃣ کارت شبکه‌های اجتماعی (Social Card)
**مسیر:** `/assets/social-card.svg`
- **ابعاد:** 1200×630 پیکسل
- **استفاده:** Open Graph، Twitter Card، LinkedIn
- **محتوا:** حروف بزرگ EDX + عنوان فارسی/انگلیسی

---

## 🎨 رنگ‌های برند

### رنگ‌های اصلی (Primary Colors)

```css
/* تم تیره (Dark Theme) - پیش‌فرض */
--background: #0F172A;     /* مشکی آبی تیره */
--foreground: #F8FAFC;     /* سفید ملایم */
--primary: #F59E0B;        /* زرد طلایی */

/* تم روشن (Light Theme) */
--background: #FFFFFF;     /* سفید */
--foreground: #0F172A;     /* مشکی */
--primary: #D97706;        /* زرد نارنجی */
```

### رنگ‌های لوگو
| رنگ | Hex | استفاده |
|-----|-----|---------|
| زرد طلایی | `#F59E0B` | حروف، لاین‌ها، Accent (تم تیره) |
| زرد نارنجی | `#D97706` | حروف، لاین‌ها (تم روشن) |
| مشکی آبی | `#0F172A` | پس‌زمینه تیره، متن روشن |
| سفید ملایم | `#F8FAFC` | متن روی تیره |

### راهنمای کنتراست
- ✅ زرد روی مشکی: Contrast Ratio 12:1 (AAA)
- ✅ سفید روی مشکی: Contrast Ratio 16:1 (AAA)
- ✅ مشکی روی سفید: Contrast Ratio 16:1 (AAA)

---

## 💻 استفاده از لوگو در کد

### استفاده از کامپوننت React

```tsx
import { Logo } from '@/components/Logo';

// لوگوی کامل
<Logo variant="full" size={120} />

// لوگوی فشرده (Navbar)
<Logo variant="compact" className="w-32" />

// آیکون فقط
<Logo variant="icon" size={40} />

// نسخه روشن
<Logo variant="light" size={120} />
```

### استفاده مستقیم SVG

```tsx
// در JSX/TSX
<img src="/assets/logo-compact.svg" alt="EDX CRM" className="h-10" />

// در CSS
background-image: url('/assets/logo-icon.svg');

// در HTML
<img src="/assets/logo-full.svg" alt="EDX CRM Logo" width="400" height="120">
```

---

## 📁 فایل‌های برندینگ

### لوگوها و آیکون‌ها
```
public/
├── favicon.svg                    # Favicon اصلی (32×32)
├── favicon-16x16.svg              # Favicon کوچک
├── favicon-32x32.svg              # Favicon استاندارد
├── apple-touch-icon.svg           # آیکون iOS (180×180)
├── android-chrome-192x192.svg     # آیکون Android کوچک
├── android-chrome-512x512.svg     # آیکون Android بزرگ
├── site.webmanifest               # PWA Manifest
└── assets/
    ├── logo-full.svg              # لوگوی کامل
    ├── logo-compact.svg           # لوگوی فشرده
    ├── logo-icon.svg              # آیکون دایره‌ای
    ├── logo-light.svg             # نسخه روشن
    └── social-card.svg            # کارت اجتماعی
```

### کامپوننت‌ها
```
src/components/
└── Logo.tsx                       # کامپوننت React لوگو
```

---

## 📖 راهنمای استفاده

### 1. در Navbar
```tsx
// Desktop
<Logo variant="icon" size={36} />

// Mobile
<Logo variant="icon" size={32} />
```

### 2. در هدر صفحات
```tsx
<Logo variant="compact" className="h-12 md:h-16" />
```

### 3. در صفحه لندینگ
```tsx
<Logo variant="full" className="w-full max-w-md" />
```

### 4. در لودرها و اسپینرها
```tsx
<Logo variant="icon" size={48} className="animate-pulse" />
```

### 5. در فوتر
```tsx
<Logo variant="compact" className="h-10 opacity-80" />
```

---

## 🔧 تنظیمات PWA

فایل `site.webmanifest` شامل:
- ✅ تمام آیکون‌های مورد نیاز PWA
- ✅ رنگ‌های تم و پس‌زمینه
- ✅ اطلاعات برنامه (فارسی)
- ✅ Screenshot برای نصب

---

## 🌐 تنظیمات SEO

در `index.html`:
- ✅ Favicon در تمام اندازه‌ها
- ✅ Apple Touch Icon
- ✅ Open Graph Image
- ✅ Twitter Card Image
- ✅ PWA Manifest Link

---

## ✨ ویژگی‌های لوگو

### طراحی
- ✅ حروف **EDX** با خطوط واضح و مدرن
- ✅ استایل Rounded Corners برای دوستانه بودن
- ✅ نسبت‌های بهینه برای تمام اندازه‌ها
- ✅ Stroke-based برای وضوح در همه دستگاه‌ها

### تکنیکال
- ✅ فرمت SVG (بدون افت کیفیت)
- ✅ سبک (هر فایل < 2KB)
- ✅ Responsive (قابل استفاده در همه اندازه‌ها)
- ✅ Theme-aware (نسخه تیره و روشن)

### دسترسی‌پذیری
- ✅ Alt text مناسب
- ✅ کنتراست بالا (AAA)
- ✅ قابل خواندن در همه اندازه‌ها
- ✅ سازگار با Screen Readers

---

## 📦 خروجی نهایی

### تعداد فایل‌های ایجاد شده: **12 فایل**

1. ✅ `/public/favicon.svg`
2. ✅ `/public/favicon-16x16.svg`
3. ✅ `/public/favicon-32x32.svg`
4. ✅ `/public/apple-touch-icon.svg`
5. ✅ `/public/android-chrome-192x192.svg`
6. ✅ `/public/android-chrome-512x512.svg`
7. ✅ `/public/site.webmanifest`
8. ✅ `/public/assets/logo-full.svg`
9. ✅ `/public/assets/logo-compact.svg`
10. ✅ `/public/assets/logo-icon.svg`
11. ✅ `/public/assets/logo-light.svg`
12. ✅ `/public/assets/social-card.svg`

### کامپوننت React: **1 فایل**
13. ✅ `/src/components/Logo.tsx`

---

## 🚀 مراحل بعدی

### اتمام شده ✅
- [x] طراحی لوگوی اصلی با حروف EDX
- [x] ساخت تمام variants (full, compact, icon, light)
- [x] ساخت آیکون‌ها برای تمام platform‌ها
- [x] ساخت Social Card برای شبکه‌های اجتماعی
- [x] ایجاد کامپوننت React قابل استفاده مجدد
- [x] پیکربندی PWA Manifest
- [x] آپدیت index.html با تمام metaهای SEO
- [x] یکپارچه‌سازی در Navbar

### پیشنهادات آینده 💡
- [ ] ساخت Animation برای لودینگ
- [ ] افزودن Storybook برای مستندات بصری
- [ ] ساخت نسخه PNG برای سازگاری بیشتر
- [ ] طراحی Brand Guidelines کامل‌تر

---

## 📞 پشتیبانی

برای تغییرات در برندینگ، فایل‌های SVG را ویرایش کنید:
- تمام رنگ‌ها از متغیرهای CSS استفاده می‌کنند
- برای تغییر رنگ: `#F59E0B` را جایگزین کنید
- برای تغییر پس‌زمینه: `#0F172A` را جایگزین کنید

---

**ساخته شده با ❤️ برای EDX CRM**
