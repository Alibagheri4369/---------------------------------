# ⚡ تست فوری - آیا تم کار می‌کند؟

## 🎯 هدف
بررسی اینکه آیا تغییرات theme واقعاً کار می‌کنند یا نه.

---

## 🚀 مرحله 1: اجرای Dev Server (30 ثانیه)

### در Terminal اجرا کنید:
```bash
npm run dev
```

### انتظار:
```
VITE v6.4.3 ready in XXX ms
➜ Local: http://localhost:3000/
```

یا port دیگری مثل 3001

---

## 🌐 مرحله 2: باز کردن مرورگر (10 ثانیه)

1. مرورگر را باز کنید
2. به آدرس نمایش داده شده بروید:
   ```
   http://localhost:3000
   ```
   (یا هر port دیگری که نشان داد)

---

## 🎨 مرحله 3: تست Theme (2 دقیقه)

### ✅ Test 1: رفتن به Settings
1. روی **آواتار/نام کاربری** کلیک کنید (بالای صفحه)
2. **Profile** را انتخاب کنید
3. به تب **Settings** بروید
4. بخش **Theme** را پیدا کنید

### ✅ Test 2: تست Dark → Light
1. روی دکمه **"روشن (Light)"** کلیک کنید
2. **چه اتفاقی باید بیفتد:**
   - ✅ پس‌زمینه سفید می‌شود
   - ✅ متن‌ها تیره می‌شوند
   - ✅ Navbar روشن می‌شود
   - ✅ Footer روشن می‌شود
   - ✅ تغییر نرم و smooth است

3. **اگر این اتفاق افتاد:**
   - ✅✅✅ **تم کار می‌کند!**

4. **اگر این اتفاق نیفتاد:**
   - ❌ تم کار نمی‌کند
   - → نگاه کنید به بخش "مشکلات رایج"

### ✅ Test 3: تست Light → Dark
1. روی دکمه **"تیره (Dark)"** کلیک کنید
2. **چه اتفاقی باید بیفتد:**
   - ✅ پس‌زمینه تیره می‌شود
   - ✅ متن‌ها روشن می‌شوند
   - ✅ تغییر نرم است

### ✅ Test 4: تست Color Palette
1. روی یکی از پالت‌های رنگی کلیک کنید (مثلاً Blue)
2. **چه اتفاقی باید بیفتد:**
   - ✅ رنگ دکمه‌ها تغییر می‌کند
   - ✅ رنگ accent ها تغییر می‌کند

### ✅ Test 5: تست Persistence
1. یک تم انتخاب کنید (مثلاً Light + Blue)
2. صفحه را **Refresh** کنید (F5)
3. **چه اتفاقی باید بیفتد:**
   - ✅ تم همچنان Light + Blue است

---

## 📊 فرم گزارش

لطفاً این فرم را پر کنید:

### Test 1: Dark → Light
- [ ] ✅ کار کرد
- [ ] ❌ کار نکرد
- [ ] ⚠️ جزئی کار کرد

**توضیحات:**
```
...
```

### Test 2: Light → Dark
- [ ] ✅ کار کرد
- [ ] ❌ کار نکرد

### Test 3: Color Palettes
- [ ] ✅ کار کرد
- [ ] ❌ کار نکرد

### Test 4: Persistence (Refresh)
- [ ] ✅ کار کرد
- [ ] ❌ کار نکرد

### Test 5: UI Coverage
کدام بخش‌ها به تم واکنش نشان دادند؟

- [ ] ✅ پس‌زمینه اصلی
- [ ] ✅ Navbar
- [ ] ✅ Footer
- [ ] ⚠️ کارت‌ها (بعضی)
- [ ] ❌ کارت‌ها (هیچ)
- [ ] ⚠️ دکمه‌ها (بعضی)
- [ ] ❌ دکمه‌ها (هیچ)

---

## 🔍 Console Check

در حین تست، **Console** مرورگر را باز نگه دارید (F12):

### باید ببینید:
```
[ThemeProvider] Applying theme: { mode: 'light', color: 'default', resolved: 'light' }
```

### نباید ببینید:
❌ خطاهای قرمز
❌ `undefined is not a function`
❌ `Cannot read property of undefined`

---

## ❌ مشکلات رایج و راه‌حل

### مشکل 1: هیچ تغییری اتفاق نمی‌افتد
**علت احتمالی:**
- CSS overrides load نشده

**راه‌حل:**
1. Cache مرورگر را پاک کنید: **Ctrl + Shift + R**
2. Dev server را restart کنید
3. Build مجدد: `npm run build`

### مشکل 2: فقط بخش Settings تغییر می‌کند
**علت احتمالی:**
- CSS overrides به درستی اعمال نشده

**راه‌حل:**
1. چک کنید `src/index.css` شامل `@layer components` است
2. در Console این کد را اجرا کنید:
   ```javascript
   console.log(getComputedStyle(document.documentElement).getPropertyValue('--background'))
   ```
3. باید یک رنگ hex نمایش دهد (مثلاً `#0f172a`)

### مشکل 3: دکمه‌ها کلیک نمی‌شوند
**علت احتمالی:**
- JavaScript error

**راه‌حل:**
1. Console را چک کنید
2. به دنبال خطای قرمز بگردید
3. اگر خطای `useTheme` دیدید، ThemeProvider مشکل دارد

### مشکل 4: تغییر خیلی کند است
**علت احتمالی:**
- Transition duration زیاد است

**راه‌حل:**
- عادی است! transition 200ms طول می‌کشد
- اگر بیشتر از 1 ثانیه طول کشید، مشکل است

### مشکل 5: بعد از Refresh تم reset می‌شود
**علت احتمالی:**
- Persistence کار نمی‌کند

**راه‌حل:**
1. چک کنید localStorage در DevTools:
   - Application → Local Storage
   - باید key هایی مربوط به theme داشته باشید
2. اگر کاربر authenticated است، Supabase را چک کنید

---

## 🆘 اگر کار نکرد

### گام 1: Screenshot بگیرید
از این موارد عکس بگیرید:
1. صفحه Settings (قبل از کلیک)
2. Console (خطاها)
3. DevTools → Elements → `<html>` tag (class ها)
4. DevTools → Computed Styles → `--background` variable

### گام 2: اطلاعات را جمع‌آوری کنید
```
مرورگر: Chrome / Firefox / Edge / Safari
نسخه: ...
سیستم‌عامل: Windows / Mac / Linux
Port: 3000 / 3001 / ...
Console Errors: ...
```

### گام 3: فایل‌های کلیدی را چک کنید
```bash
# چک کنید این فایل‌ها موجودند:
ls src/index.css
ls src/theme/ThemeProvider.tsx
ls src/components/ThemeBox.tsx

# محتوای CSS را چک کنید:
grep "@layer components" src/index.css
```

---

## ✅ اگر کار کرد

### تبریک! 🎉

سیستم تم شما فعال است!

### مرحله بعدی:
1. به تمام بخش‌های سایت بروید:
   - Roadmap
   - Checklist
   - Modules
   - Architecture
   - و...

2. چک کنید آیا تم در همه جا consistent است

3. با دوستان به اشتراک بگذارید! 😊

---

## 📞 گزارش نتیجه

لطفاً نتیجه تست را به من اطلاع دهید:

### اگر موفق بود:
```
✅ تم کار می‌کند!
- Dark/Light: ✅
- Color Palettes: ✅
- Persistence: ✅
- Coverage: XX%
```

### اگر ناموفق بود:
```
❌ تم کار نمی‌کند
مشکل: ...
Console Error: ...
Screenshot: ...
```

---

**زمان تست:** ~2-3 دقیقه  
**سطح سختی:** آسان  
**نیاز:** مرورگر + Terminal
