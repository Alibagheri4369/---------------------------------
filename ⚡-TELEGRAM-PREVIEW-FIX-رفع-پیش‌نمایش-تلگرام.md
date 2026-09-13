# ⚡ رفع سریع پیش‌نمایش تلگرام

## 🎯 مشکل
وقتی لینک سایت را در تلگرام می‌فرستید، عکس لوگو نمایش داده نمی‌شود.

## ✅ علت
تلگرام فایل **SVG** را پشتیبانی نمی‌کند! نیاز به **PNG** داریم.

---

## 🚀 راه‌حل (3 دقیقه)

### گام 1: ساخت تصویر PNG

**روش آسان:**
1. فایل `generate-social-card.html` را در مرورگر باز کنید
2. روی دکمه **"📥 دانلود PNG"** کلیک کنید
3. فایل `edx-crm-social-card.png` ذخیره می‌شود

**یا از Canva:**
1. به https://canva.com بروید
2. Custom Size: 1200×630
3. پس‌زمینه تیره + حروف EDX زرد
4. متن: "EDX CRM — Web Developer Project Manager"
5. Download PNG

---

### گام 2: قرار دادن در پروژه

فایل PNG را در پوشه `public/` کپی کنید و نامش را به `og-image.png` تغییر دهید:

```
public/
└── og-image.png  ← فایل جدید شما (1200×630)
```

---

### گام 3: آپدیت index.html

این خط را پیدا کنید:
```html
<meta property="og:image" content="https://alibexarwebtasker.vercel.app/assets/social-card.svg" />
```

و به این تغییر دهید:
```html
<meta property="og:image" content="https://alibexarwebtasker.vercel.app/og-image.png" />
<meta property="og:image:type" content="image/png" />
```

همچنین برای Twitter:
```html
<meta name="twitter:image" content="https://alibexarwebtasker.vercel.app/og-image.png" />
```

⚠️ **نکته مهم:** URL باید **https://alibexarwebtasker.vercel.app/** شروع شود (URL کامل سایت شما)

---

### گام 4: Commit و Push

```bash
git add public/og-image.png
git add index.html
git commit -m "feat: Add PNG Open Graph image for Telegram preview"
git push origin main
```

---

### گام 5: تست

1. منتظر بمانید 2-3 دقیقه (Vercel deploy)
2. لینک سایت را در تلگرام (به خودتان) بفرستید
3. پیش‌نمایش باید ظاهر شود! 🎉

---

## 🧪 تست قبل از Push

می‌توانید با این ابزار تست کنید:
- https://www.opengraph.xyz/
- https://metatags.io/

---

## 📸 نتیجه نهایی

پیش‌نمایش در تلگرام:
```
┌─────────────────────────┐
│   [تصویر لوگو EDX]       │
│                         │
│ EDX CRM WEB FOV         │
│ سیستم مدیریت پروژه...   │
└─────────────────────────┘
```

---

## 🆘 اگر هنوز کار نکرد

1. **Cache تلگرام:** لینک را با `?v=2` بفرستید
2. **URL اشتباه:** مطمئن شوید URL کامل (با https) است
3. **فایل وجود ندارد:** بررسی کنید `public/og-image.png` موجود است
4. **حجم زیاد:** حجم فایل باید < 300 KB باشد

---

**موفق باشید! 🚀**

فایل راهنمای کامل: `📸-SOCIAL-CARD-GUIDE-راهنمای-تصویر-شبکه-اجتماعی.md`
