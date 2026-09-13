# 🚨 رفع فوری پیش‌نمایش تلگرام (2 دقیقه)

## مشکل
لینک سایت در تلگرام عکس نمایش نمی‌دهد چون تلگرام SVG نمی‌فهمد.

## راه‌حل سریع

### گام 1: دانلود تصویر PNG (30 ثانیه)

فایل **`public/create-og-image.html`** را که در مرورگر باز است ببینید.

1. روی دکمه **"📥 دانلود PNG"** کلیک کنید
2. فایل `og-image.png` در Downloads ذخیره می‌شود

### گام 2: کپی به پروژه (10 ثانیه)

```powershell
# فایل دانلود شده را به public کپی کنید
cp C:\Users\Alibexar\Downloads\og-image.png public\og-image.png
```

یا دستی:
- فایل `og-image.png` را از Downloads پیدا کنید
- به پوشه پروژه بروید: `public\`
- فایل را آنجا Paste کنید

### گام 3: چک کنید (5 ثانیه)

```powershell
# مطمئن شوید فایل وجود دارد
ls public\og-image.png
```

باید output بدهد: `og-image.png`

### گام 4: Push کنید (30 ثانیه)

```powershell
git add public/og-image.png
git commit -m "feat: Add Open Graph PNG image for Telegram"
git push origin main
```

### گام 5: تست (2 دقیقه بعد)

1. منتظر بمانید Vercel deploy کند (2-3 دقیقه)
2. لینک را در تلگرام بفرستید: `https://alibexarwebtasker.vercel.app`
3. پیش‌نمایش باید ظاهر شود! ✅

---

## ⚠️ نکته مهم

**مشکل فعلی:** index.html هنوز به SVG اشاره می‌کند!

بعد از push فایل PNG، باید `index.html` را هم آپدیت کنید:

```html
<!-- این خط را پیدا کنید: -->
<meta property="og:image" content="https://alibexarwebtasker.vercel.app/assets/social-card.svg" />

<!-- و به این تغییر دهید: -->
<meta property="og:image" content="https://alibexarwebtasker.vercel.app/og-image.png" />
<meta property="og:image:type" content="image/png" />
```

سپس:
```powershell
git add index.html
git commit -m "fix: Update og:image to use PNG instead of SVG"
git push origin main
```

---

## ✅ نتیجه

بعد از 5 دقیقه، وقتی لینک را در تلگرام بفرستید:

```
┌────────────────────────────┐
│  [عکس لوگو EDX با حروف    │
│   زرد روی پس‌زمینه تیره]   │
│                            │
│  EDX CRM                   │
│  Web Developer Project...   │
│  alibexarwebtasker....app  │
└────────────────────────────┘
```

**دقیقاً مثل مثال شما!** 🎉
