# 🎨 راهنمای تست سیستم تم

## وضعیت فعلی
✅ **سیستم تم به صورت جامع بازسازی شد**

### تغییرات اعمال شده:

#### 1. CSS Layer Overrides (مهم‌ترین تغییر)
تمام کلاس‌های Tailwind به صورت خودکار به CSS Variables متصل شدند:

```css
.bg-slate-950 → var(--background)
.bg-slate-900 → var(--surface)
.bg-slate-800 → var(--surface-secondary)
.text-slate-100 → var(--foreground)
.text-slate-400 → var(--muted-foreground)
.border-slate-800 → var(--border)
.bg-amber-400 → var(--primary)
.text-amber-400 → var(--primary)
```

این یعنی **تمام کامپوننت‌های موجود** بدون تغییر کد، حالا به تم واکنش نشان می‌دهند!

#### 2. کامپوننت‌های Helper
- `ThemeBox` - جعبه هوشمند با تم
- `ThemeButton` - دکمه هوشمند با تم
- `ThemeCard` - کارت هوشمند با تم
- `ThemeInput` - input هوشمند با تم
- `ThemeTestView` - صفحه تست کامل

#### 3. Utility Functions
فایل `src/utils/themeClasses.ts` برای استفاده آسان در کامپوننت‌ها

---

## 📝 چک‌لیست تست

### تست ۱: حالت روشنایی (Light/Dark/System)

1. سرور را اجرا کنید:
   ```bash
   npm run dev
   ```

2. مرورگر را باز کنید: `http://localhost:3001`

3. به **Profile → Settings → Theme** بروید

4. دکمه‌های زیر را امتحان کنید:
   - [ ] **تیره (Dark)** - پس‌زمینه تیره، متن روشن
   - [ ] **روشن (Light)** - پس‌زمینه سفید، متن تیره
   - [ ] **سیستم (Auto)** - تنظیمات OS را دنبال کند

**انتظار:**
- پس‌زمینه اصلی تغییر کند
- Navbar تغییر کند
- Footer تغییر کند
- تمام کارت‌ها تغییر کنند
- متن‌ها readable باشند

---

### تست ۲: پالت‌های رنگی (Color Themes)

در همان صفحه Settings → Theme، پالت‌های زیر را امتحان کنید:

- [ ] **سفید، مشکی و زرد (پیش‌فرض)** - `#f59e0b` (Amber)
- [ ] **آبی فنی (Engineering Blue)** - `#3b82f6`
- [ ] **نیلی (Indigo)** - `#6366f1`
- [ ] **بنفش مدرن (Deep Purple)** - `#8b5cf6`
- [ ] **سبز پایدار (Emerald Green)** - `#10b981`
- [ ] **فیروزه‌ای تکنیکال (Teal)** - `#14b8a6`
- [ ] **نارنجی پرانرژی (Vibrant Orange)** - `#f97316`
- [ ] **صورتی (Rose)** - `#f43f5e`
- [ ] **خاکستری (Slate)** - `#64748b`

**انتظار:**
- دکمه‌های اصلی (Primary) باید رنگ عوض کنند
- Highlight ها و Accent ها تغییر کنند
- Border های active تغییر کنند
- آیکون‌های primary تغییر کنند

---

### تست ۳: ترکیبات (Combinations)

امتحان کنید:

1. **Dark + Amber** (پیش‌فرض)
   - [ ] پس‌زمینه تیره با accent طلایی

2. **Light + Blue**
   - [ ] پس‌زمینه سفید با accent آبی

3. **Dark + Purple**
   - [ ] پس‌زمینه تیره با accent بنفش

4. **Light + Emerald**
   - [ ] پس‌زمینه سفید با accent سبز

5. **System + Orange**
   - [ ] تنظیم خودکار + accent نارنجی

**انتظار:**
- هر ترکیب باید واضح و خوانا باشد
- رنگ‌ها با هم تداخل نداشته باشند
- Contrast کافی برای خوانایی وجود داشته باشد

---

### تست ۴: پایداری (Persistence)

1. یک تم انتخاب کنید (مثلاً Light + Purple)
2. صفحه را Refresh کنید (F5)
3. [ ] تم همچنان Light + Purple است

4. به تب دیگری بروید (مثلاً Roadmap)
5. [ ] تم همچنان ثابت است

6. دوباره به Profile برگردید
7. [ ] تم همچنان ثابت است

---

### تست ۵: UI در تمام بخش‌ها

#### بخش‌های اصلی برای بررسی:

##### ✅ Navbar
- [ ] Header تغییر می‌کند
- [ ] Desktop ribbon (تاریخ/ساعت) تغییر می‌کند
- [ ] دکمه‌ها readable هستند
- [ ] آواتار کاربر واضح است

##### ✅ Where Am I (GPS Widget)
- [ ] کارت‌ها تغییر می‌کنند
- [ ] Progress bar ها واضح هستند
- [ ] متن‌ها خوانا هستند

##### ✅ Roadmap (نقشه راه)
- [ ] کارت‌های فاز تغییر می‌کنند
- [ ] Timeline واضح است
- [ ] Badge ها و Status ها واضح هستند

##### ✅ Checklist (چک‌لیست)
- [ ] Task card ها تغییر می‌کنند
- [ ] Checkbox ها واضح هستند
- [ ] Input field ها کار می‌کنند

##### ✅ Architecture (معماری)
- [ ] کارت‌های تکنولوژی واضح هستند
- [ ] نمودارها خوانا هستند

##### ✅ Modules (ماژول‌ها)
- [ ] کارت‌های ماژول تغییر می‌کنند
- [ ] دسته‌بندی‌ها واضح هستند

##### ✅ QA & Security
- [ ] چک‌لیست امنیتی خوانا است
- [ ] Badge های OWASP واضح هستند

##### ✅ Pricing (قیمت‌گذاری)
- [ ] جداول قیمت واضح هستند
- [ ] Tier ها قابل تشخیص هستند

##### ✅ Profile & Settings
- [ ] فرم‌ها خوانا هستند
- [ ] دکمه‌های تم کار می‌کنند
- [ ] Preview نمایش داده می‌شود

##### ✅ Modals
- [ ] Auth Modal واضح است
- [ ] New Project Modal کار می‌کند
- [ ] Cloud Sync Modal خوانا است

##### ✅ Footer
- [ ] رنگ تغییر می‌کند
- [ ] متن خوانا است

---

### تست ۶: Responsive (موبایل)

1. مرورگر را کوچک کنید یا از DevTools استفاده کنید
2. تست کنید:
   - [ ] Mobile menu کار می‌کند
   - [ ] تم در mobile هم تغییر می‌کند
   - [ ] دکمه‌ها قابل کلیک هستند

---

### تست ۷: Animation & Transition

1. چند بار بین Light و Dark سوئیچ کنید
2. [ ] Transition نرم است (0.2s)
3. [ ] هیچ Flash یا Flicker وجود ندارد
4. [ ] رنگ‌ها به آرامی fade می‌شوند

---

## 🐛 مشکلات احتمالی و راه‌حل

### مشکل ۱: رنگ‌ها تغییر نمی‌کنند
**راه‌حل:**
1. Cache مرورگر را پاک کنید (Ctrl+Shift+R)
2. مطمئن شوید build جدید اجرا شده: `npm run build && npm run dev`

### مشکل ۲: بعضی المان‌ها تغییر نمی‌کنند
**علت:** احتمالاً inline style دارند که از CSS override جلوتر است
**راه‌حل:** کامپوننت را پیدا کنید و inline style را با CSS variable جایگزین کنید

### مشکل ۳: تم بعد از Refresh reset می‌شود
**راه‌حل:**
1. چک کنید Supabase متصل است یا نه
2. localStorage را در DevTools بررسی کنید
3. Console را چک کنید برای خطاهای persistence

### مشکل ۴: Contrast پایین است
**راه‌حل:** در `src/theme/tokens.ts` رنگ‌ها را adjust کنید

---

## ✅ چک‌لیست نهایی برای Deploy

قبل از Deploy به Vercel، مطمئن شوید:

- [ ] تمام تست‌های بالا Pass شدند
- [ ] هیچ Console Error وجود ندارد
- [ ] `npm run build` موفقیت‌آمیز است
- [ ] تم در production build هم کار می‌کند
- [ ] Git commit انجام شده

---

## 🚀 آماده Deploy

اگر تمام تست‌ها OK بود:

```bash
# Commit changes
git add .
git commit -m "fix: comprehensive theme system with all color combinations"

# Push to repository
git push origin main

# Vercel automatically deploys from main branch
```

یا دستی:
```bash
vercel --prod
```

---

## 📊 نتیجه تست

| بخش | Dark | Light | System | رنگ‌ها | وضعیت |
|-----|------|-------|--------|--------|-------|
| Navbar | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Roadmap | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Checklist | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Architecture | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Modules | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Settings | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Modals | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Footer | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

**علامت‌ها:**
- ✅ = کار می‌کند
- ⚠️ = مشکل جزئی
- ❌ = کار نمی‌کند
- ⬜ = تست نشده

---

**تاریخ تست:** ___________  
**تست شده توسط:** ___________  
**نسخه:** ___________  
**مرورگر:** ___________
