# 📸 راهنمای ساخت تصویر پیش‌نمایش برای تلگرام و شبکه‌های اجتماعی

## 🎯 مشکل فعلی

تلگرام و بسیاری از شبکه‌های اجتماعی **SVG را پشتیبانی نمی‌کنند**. شما نیاز به یک فایل **PNG** یا **JPG** دارید.

---

## ✅ راه‌حل: تبدیل SVG به PNG

### روش 1: استفاده از ابزار آنلاین (ساده‌ترین) ⭐

#### گام 1: دانلود SVG
فایل `public/assets/social-card.svg` را باز کنید و محتوای آن را کپی کنید.

#### گام 2: تبدیل آنلاین
به یکی از این سایت‌ها بروید:
- https://svgtopng.com/
- https://cloudconvert.com/svg-to-png
- https://convertio.co/svg-png/

#### گام 3: تنظیمات
- **Width:** 1200px
- **Height:** 630px
- **Format:** PNG
- **Quality:** High/Maximum

#### گام 4: دانلود
فایل PNG را دانلود کنید و به نام `og-image.png` ذخیره کنید.

#### گام 5: قرار دادن در پروژه
فایل را در پوشه `public/` کپی کنید:
```
public/
└── og-image.png  ← فایل جدید شما
```

---

### روش 2: استفاده از Photoshop/Figma (حرفه‌ای)

#### Figma:
1. یک Frame جدید بسازید: 1200×630
2. از طراحی زیر استفاده کنید:
   - پس‌زمینه: `#0F172A` (مشکی آبی)
   - حروف EDX: `#F59E0B` (زرد طلایی)
   - متن: "EDX CRM — Web Developer Project Manager"
   - زیرنویس: "سیستم مدیریت پروژه‌های وب برای دولوپرها"
3. Export → PNG → 1200×630
4. ذخیره به عنوان `og-image.png`

#### Photoshop:
1. New Document: 1200×630px, 72 DPI, RGB
2. Background: `#0F172A`
3. حروف EDX با فونت Bold و رنگ `#F59E0B`
4. متن و توضیحات
5. Save for Web → PNG-24

---

### روش 3: استفاده از Canva (آسان)

1. به Canva.com بروید
2. "Custom Size" → 1200×630 px
3. طراحی:
   - پس‌زمینه تیره: `#0F172A`
   - حروف بزرگ: **E D X**
   - فونت: Bold, رنگ زرد `#F59E0B`
   - متن: "EDX CRM"
   - زیرنویس: "Web Developer Project Manager"
   - توضیح فارسی: "سیستم مدیریت پروژه‌های وب"
4. Download → PNG
5. ذخیره به عنوان `og-image.png`

---

### روش 4: استفاده از Screenshot (سریع اما کیفیت کمتر)

1. فایل `generate-social-card.html` را در مرورگر باز کنید
2. صفحه را Full Screen کنید (F11)
3. Zoom را طوری تنظیم کنید که Canvas کل صفحه را پر کند
4. Screenshot بگیرید:
   - Windows: Win + Shift + S
   - Mac: Cmd + Shift + 4
5. در Paint/Photoshop باز کنید
6. Resize به 1200×630 (اگر لازم است)
7. ذخیره به عنوان `og-image.png`

---

## 🔧 آپدیت کد

بعد از ساخت فایل PNG:

### گام 1: قرار دادن فایل
```bash
# فایل را در public کپی کنید
public/og-image.png
```

### گام 2: آپدیت index.html
در `index.html`، meta tags را تغییر دهید:

```html
<!-- قبل: SVG (کار نمی‌کند در تلگرام) -->
<meta property="og:image" content="/assets/social-card.svg" />

<!-- بعد: PNG (کار می‌کند همه جا) -->
<meta property="og:image" content="https://alibexarwebtasker.vercel.app/og-image.png" />
<meta property="og:image:secure_url" content="https://alibexarwebtasker.vercel.app/og-image.png" />
<meta property="og:image:type" content="image/png" />

<!-- برای Twitter -->
<meta name="twitter:image" content="https://alibexarwebtasker.vercel.app/og-image.png" />
```

⚠️ **مهم:** URL باید **مطلق** (با https://) باشد، نه relative!

### گام 3: Commit و Push
```bash
git add public/og-image.png
git add index.html
git commit -m "feat: Add PNG Open Graph image for social media preview"
git push origin main
```

---

## 🧪 تست کردن

### 1️⃣ تست با ابزار آنلاین
بعد از deploy، لینک سایت را در این ابزارها تست کنید:

**Open Graph Debugger:**
- Facebook: https://developers.facebook.com/tools/debug/
- LinkedIn: https://www.linkedin.com/post-inspector/
- Twitter: https://cards-dev.twitter.com/validator

**Universal Tester:**
- https://www.opengraph.xyz/
- https://metatags.io/

### 2️⃣ تست در تلگرام
1. لینک سایت را در تلگرام (به خودتان) ارسال کنید
2. منتظر بمانید 5-10 ثانیه
3. پیش‌نمایش باید ظاهر شود با:
   - ✅ تصویر لوگو EDX
   - ✅ عنوان: "EDX CRM — Web Developer Project Manager"
   - ✅ توضیحات: "سیستم مدیریت پروژه‌ها..."

### 3️⃣ اگر پیش‌نمایش ظاهر نشد
- Cache تلگرام را پاک کنید
- لینک را با `?v=2` ارسال کنید (مثلاً: `https://site.com?v=2`)
- صبر کنید چند دقیقه (تلگرام cache دارد)

---

## 🎨 مشخصات تصویر ایده‌آل

### ابعاد پیشنهادی:
- **Open Graph:** 1200×630 px (نسبت 1.91:1)
- **Twitter Card:** 1200×675 px یا 1200×630 px
- **Telegram:** 1200×630 px (بهترین)

### فرمت:
- ✅ **PNG** (پیشنهادی) - کیفیت بالا، پشتیبانی از شفافیت
- ✅ **JPG** - حجم کمتر، برای عکس‌ها بهتر است
- ❌ **SVG** - پشتیبانی نمی‌شود!

### حجم فایل:
- **توصیه:** کمتر از 300 KB
- **حداکثر:** 8 MB (محدودیت Facebook)
- **بهینه:** 100-200 KB

---

## 📋 چک‌لیست نهایی

پس از ساخت و آپلود تصویر:

- [ ] فایل PNG در `public/og-image.png` وجود دارد
- [ ] حجم فایل < 300 KB
- [ ] ابعاد دقیقاً 1200×630 پیکسل
- [ ] `index.html` آپدیت شده (URL مطلق با https)
- [ ] متن فارسی خوانا است
- [ ] لوگو EDX واضح و قابل مشاهده است
- [ ] Commit و Push شده
- [ ] Vercel deployment موفق شده
- [ ] با Open Graph Debugger تست شده
- [ ] در تلگرام تست شده

---

## 🚀 نتیجه نهایی

بعد از این مراحل، وقتی لینک سایت را در **هر کجا** share کنید:
- ✅ تلگرام
- ✅ واتساپ
- ✅ توییتر
- ✅ لینکدین
- ✅ فیسبوک
- ✅ دیسکورد

پیش‌نمایش زیبا با لوگو EDX، عنوان و توضیحات نمایش داده می‌شود! 🎉

---

## 🆘 نیاز به کمک؟

اگر موفق نشدید:
1. از روش Canva استفاده کنید (آسان‌ترین)
2. فایل `generate-social-card.html` را باز کنید و دکمه "دانلود PNG" را بزنید
3. یا از ابزار آنلاین https://svgtopng.com/ استفاده کنید

---

**موفق باشید! 🚀**
