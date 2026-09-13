# 📥 دستورالعمل دانلود تصویر پیش‌نمایش

## ✅ روش 1: دانلود از صفحه HTML (سریع‌ترین)

### گام 1
فایل زیر در مرورگر باز شده است:
```
public/create-og-image.html
```

###گام 2
روی دکمه **"📥 دانلود PNG"** کلیک کنید.

### گام 3
فایل `og-image.png` در پوشه Downloads ذخیره می‌شود.

### گام 4
فایل را به پروژه کپی کنید:

**Windows PowerShell:**
```powershell
Copy-Item "$env:USERPROFILE\Downloads\og-image.png" "public\og-image.png"
```

**دستی:**
1. فایل را از Downloads پیدا کنید
2. به پوشه پروژه بروید
3. در پوشه `public\` paste کنید

---

## ✅ روش 2: استفاده از SVG to PNG Converter (آنلاین)

اگر روش 1 کار نکرد:

### گام 1: کپی کردن SVG
فایل `public/assets/social-card.svg` را باز کنید و **تمام** محتویات آن را کپی کنید.

### گام 2: رفتن به Converter
به یکی از این سایت‌ها بروید:
- https://svgtopng.com/
- https://cloudconvert.com/svg-to-png
- https://convertio.co/svg-png/

### گام 3: تنظیمات
- SVG را paste کنید
- Width: **1200**
- Height: **630**
- Format: **PNG**

### گام 4: دانلود
فایل PNG را دانلود کنید و به نام `og-image.png` ذخیره کنید.

### گام 5: قرار دادن در پروژه
فایل را در `public\og-image.png` قرار دهید.

---

## ✅ روش 3: استفاده از Canva (زیباترین)

### گام 1
به https://www.canva.com بروید و ثبت‌نام کنید (رایگان).

### گام 2
"Create a design" → "Custom size" → 1200 × 630 پیکسل

### گام 3
طراحی:
- **پس‌زمینه:** تیره (#0F172A)
- **حروف EDX:** بزرگ، Bold، رنگ زرد (#F59E0B)
- **متن اصلی:** "EDX CRM"
- **زیرنویس:** "Web Developer Project Manager"
- **متن فارسی:** "سیستم مدیریت پروژه‌های وب و نرم‌افزار برای دولوپرها"

### گام 4
Download → PNG → Save

### گام 5
فایل را به نام `og-image.png` در `public\` قرار دهید.

---

## 🧪 بررسی فایل

بعد از کپی کردن، چک کنید:

```powershell
Test-Path public\og-image.png
```

باید بگوید: **True**

حجم فایل را ببینید:
```powershell
(Get-Item public\og-image.png).Length / 1KB
```

باید بین **50-300 KB** باشد.

---

## 📝 مرحله بعد

بعد از اینکه فایل `public\og-image.png` وجود دارد:

```powershell
# Add to git
git add public/og-image.png

# Commit
git commit -m "feat: Add Open Graph PNG image for social media"

# Push
git push origin main
```

**سپس** `index.html` را آپدیت کنید تا به این فایل اشاره کند.

---

## ❓ مشکل دارید?

اگر هیچ‌کدام کار نکرد، به من بگویید و راه حل دیگری پیدا می‌کنیم!
