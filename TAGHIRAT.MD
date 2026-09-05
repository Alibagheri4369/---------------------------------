# 🔴 CRITICAL PATCH — REAL THEME ENGINE + REAL 3-LANGUAGE I18N + PERSISTENT USER PREFERENCES

## پروژه

EDX CRM WEB FOV

## هدف

بخش «تنظیمات و اولویت‌های حساب کاربری» در صفحه پروفایل در حال حاضر ناقص است:

* تغییر Theme عملاً کار نمی‌کند.
* تغییر Language عملاً کار نمی‌کند.
* سیستم فقط فارسی/انگلیسی را نمایش می‌دهد و باید واقعاً **سه‌زبانه** شود.
* زبان سوم: **Deutsch / German / آلمانی**
* تغییر زبان باید کل رابط کاربری را ترجمه و Layout را در صورت نیاز RTL/LTR کند.
* تغییر Theme باید کل UI را واقعاً تغییر دهد.
* تنظیمات باید در Supabase ذخیره شوند.
* بعد از Refresh، Logout/Login و ورود از دستگاه/Session دیگر باید تنظیمات کاربر بازیابی شوند.
* هیچ بخش مهمی نباید Hardcoded باشد.

این اصلاحیه را به صورت یک **Production-Grade Architecture Fix** اجرا کن، نه صرفاً UI Patch.

---

# 1. LANGUAGE SYSTEM — THREE LANGUAGE ARCHITECTURE

سیستم باید دقیقاً از سه زبان پشتیبانی کند:

```text
fa = فارسی
en = English
de = Deutsch
```

## زبان پیش‌فرض

زبان پیش‌فرض سیستم:

```text
fa
```

اما این فقط Default اولیه است.

اگر کاربر زبان را تغییر داد، انتخاب او باید ذخیره شود.

---

# 2. LANGUAGE SWITCHER

در صفحه:

## زبان محیط کاربری (Language)

به جای:

```text
فارسی
English
```

سه گزینه واقعی داشته باش:

```text
🇮🇷 فارسی
🇬🇧 English
🇩🇪 Deutsch
```

اما مهم:

این‌ها فقط Label نباشند.

با انتخاب هر زبان:

### فارسی

* تمام UI فارسی شود.
* `dir="rtl"`
* `lang="fa"`
* اعداد/فرمت‌های مناسب فارسی در بخش‌های مربوطه.
* Jalali در صورت انتخاب تقویم شمسی.

### English

* تمام UI انگلیسی شود.
* `dir="ltr"`
* `lang="en"`

### Deutsch

* تمام UI آلمانی شود.
* `dir="ltr"`
* `lang="de"`

---

# 3. NO HARDCODED UI STRINGS

تمام متن‌های UI باید از Translation System بیایند.

مثلاً این:

```tsx
<h1>پروفایل کاربری و پیکربندی سیستم</h1>
```

نباید مستقیماً Hardcoded باشد.

باید چیزی مشابه این باشد:

```tsx
<h1>{t("profile.title")}</h1>
```

یا معماری معادل پروژه.

---

# 4. TRANSLATION ARCHITECTURE

یک ساختار استاندارد و قابل توسعه ایجاد کن:

```text
src/
 └── i18n/
      ├── index.ts
      ├── config.ts
      ├── locales/
      │    ├── fa.ts
      │    ├── en.ts
      │    └── de.ts
      └── types.ts
```

یا اگر پروژه از i18next / react-i18next یا سیستم دیگری استفاده می‌کند، همان سیستم را اصولی پیاده‌سازی کن.

### اصل مهم:

از ایجاد چند سیستم ترجمه موازی خودداری کن.

یک Translation Source of Truth داشته باش.

---

# 5. TRANSLATION COVERAGE

حداقل تمام محتوای همین صفحه باید سه ترجمه کامل داشته باشد.

مواردی که باید ترجمه شوند:

```text
+ پروژه
EDX CRM WEB FOV

ورود / ثبت‌نام
مرکز مدیریت و تنظیمات
پروفایل کاربری و پیکربندی سیستم
سیستم مدیریت پروژه‌های وب و نرم‌افزار برای دولوپرها

حالت مهمان (Guest)
برای ذخیره دائمی ابری وارد شوید.
ورود به حساب
کاربر مهمان (آفلاین)
داده‌ها به صورت لوکال ذخیره می‌شوند

Full-Stack Developer
پروژه‌های شما
تسک‌های انجام‌شده

اطلاعات حساب دولوپر
مشخصات

تنظیمات و ترجیحات سیستم
زبان و زمان

ظاهر و تم بصری
سفید + زرد + مشکی

راهنمای جامع محصول
درباره EDX CRM WEB FOV
معرفی
شبکه‌های اجتماعی رسمی
کانال و پیج

تنظیمات و اولویت‌های حساب کاربری
پیکربندی زبان، تقویم و منطقه زمانی سامانه

زبان محیط کاربری
منطقه زمانی
سیستم تقویم و تاریخ
چگالی نمایش المان‌ها

ذخیره دائمی تنظیمات در حساب

پایگاه داده ایزوله
زمان رسمی
تاریخ هجری شمسی
```

همچنین:

### هیچ متن UI دیگری در این صفحه نباید خارج از Translation System باشد.

---

# 6. GERMAN TRANSLATION MUST BE REAL

ترجمه آلمانی نباید Machine Placeholder یا English Copy باشد.

مثلاً:

```text
فارسی:
پروفایل کاربری و پیکربندی سیستم

English:
User Profile & System Configuration

Deutsch:
Benutzerprofil & Systemkonfiguration
```

برای تمام UI همین استاندارد را رعایت کن.

---

# 7. LANGUAGE CHANGE MUST BE INSTANT

وقتی کاربر زبان را انتخاب می‌کند:

```text
fa → en
fa → de
en → fa
en → de
de → fa
de → en
```

باید UI بدون Reload کامل تغییر کند.

نباید کاربر مجبور شود صفحه را Refresh کند.

---

# 8. HTML LANGUAGE + DIRECTION

هنگام تغییر زبان، این موارد را نیز تغییر بده:

```html
<html lang="fa" dir="rtl">
```

برای انگلیسی:

```html
<html lang="en" dir="ltr">
```

برای آلمانی:

```html
<html lang="de" dir="ltr">
```

Direction نباید فقط روی یک Component تنظیم شود.

Direction باید در Root Application اعمال شود.

---

# 9. RTL/LTR ARCHITECTURE

هیچ CSS نباید صرفاً برای فارسی نوشته شده باشد به شکلی که English/German را خراب کند.

تا حد امکان از Logical CSS Properties استفاده کن:

```css
margin-inline-start
margin-inline-end
padding-inline-start
padding-inline-end
inset-inline-start
inset-inline-end
border-start-start-radius
```

به جای وابستگی شدید به:

```css
margin-left
margin-right
padding-left
padding-right
left
right
```

---

# 10. THEME ENGINE — FIX THE BROKEN THEME

Theme باید واقعاً کار کند.

حداقل این حالت‌ها:

```text
Light
Dark
System
```

و Color Theme:

```text
Default / Blue
Indigo
Purple
Emerald
Teal
Orange
Rose
Slate / Neutral
```

اما Default برند پروژه:

```text
White + Yellow + Black
```

---

# 11. IMPORTANT — THEME IS NOT JUST A CLASS

نباید فقط یک Button را تغییر بدهی.

Theme باید روی کل Application اعمال شود.

موارد زیر باید تحت Theme قرار بگیرند:

* Background
* Surface
* Cards
* Sidebar
* Header
* Text
* Muted Text
* Border
* Input
* Select
* Button
* Modal
* Dropdown
* Table
* DataTable
* Charts
* Badge
* Tooltip
* Navigation
* Dashboard
* Profile
* Settings
* Empty State
* Error State
* Loading State
* Toast
* Calendar
* DatePicker
* Map containers where applicable

---

# 12. DESIGN TOKEN ARCHITECTURE

رنگ‌ها را مستقیم در Componentها Hardcode نکن.

از Design Tokens استفاده کن.

مثلاً:

```css
:root {
  --background: ...;
  --foreground: ...;
  --surface: ...;
  --surface-secondary: ...;
  --border: ...;
  --primary: ...;
  --primary-foreground: ...;
  --muted: ...;
  --success: ...;
  --warning: ...;
  --danger: ...;
}
```

Dark Mode همین Tokenها را Override کند.

Color Theme نیز فقط Tokenهای لازم را Override کند.

---

# 13. THEME PRECEDENCE

منطق Theme دقیقاً:

```text
System
   ↓
Light / Dark based on OS

Light
   ↓
Force Light

Dark
   ↓
Force Dark
```

اگر:

```text
theme_mode = system
```

باید از:

```js
window.matchMedia("(prefers-color-scheme: dark)")
```

استفاده شود.

اگر کاربر روی System باشد و OS تغییر کند:

```text
Light → Dark
```

UI باید بدون Reload تغییر کند.

---

# 14. THEME STATE

Theme باید State واقعی Application باشد.

مثلاً:

```text
ThemeProvider
   ↓
useTheme()
   ↓
DOM class/data attribute
   ↓
CSS Tokens
```

نباید Theme فقط در یک صفحه مدیریت شود.

---

# 15. PERSISTENCE — SUPABASE SOURCE OF TRUTH

تنظیمات کاربر باید در Supabase ذخیره شوند.

جدول پیشنهادی:

```text
user_preferences
```

فیلدها:

```text
id
user_id
theme_mode
color_theme
language
timezone
calendar
density
created_at
updated_at
```

مثلاً:

```json
{
  "theme_mode": "dark",
  "color_theme": "yellow",
  "language": "de",
  "timezone": "Asia/Tehran",
  "calendar": "jalali",
  "density": "comfortable"
}
```

---

# 16. CRITICAL — NO FAKE PERSISTENCE

از این موارد به عنوان Source of Truth استفاده نکن:

```text
hardcoded object
mock data
demo data
temporary state
random defaults
```

`localStorage` فقط می‌تواند برای:

```text
temporary cache
offline fallback
first paint optimization
```

استفاده شود.

اما Source of Truth برای حساب کاربری:

```text
Supabase
```

باشد.

---

# 17. SETTINGS LOAD FLOW

بعد از Login:

```text
Authentication
      ↓
Get authenticated user
      ↓
user.id
      ↓
Fetch user_preferences
      ↓
Apply Language
      ↓
Apply Direction
      ↓
Apply Theme
      ↓
Apply Color Theme
      ↓
Apply Timezone
      ↓
Apply Calendar
      ↓
Apply Density
      ↓
Render Application
```

اگر Preferences وجود نداشت:

```text
Create default preferences for that user
```

Default:

```text
language = fa
theme_mode = system
color_theme = yellow
timezone = Asia/Tehran
calendar = jalali
density = comfortable
```

---

# 18. SETTINGS SAVE FLOW

وقتی کاربر تغییر می‌دهد:

```text
User changes setting
      ↓
Update UI immediately
      ↓
Persist to Supabase
      ↓
Update local application state
      ↓
Confirm persistence
```

UI نباید منتظر پاسخ سرور بماند تا تغییر کند.

اما اگر Save شکست خورد:

```text
Show error
```

و State را به صورت منطقی مدیریت کن.

---

# 19. DEBOUNCE / SAVE STRATEGY

برای جلوگیری از Requestهای بی‌مورد:

تنظیمات متنی/انتخابی می‌توانند با:

```text
immediate save
```

یا:

```text
debounced save
```

ذخیره شوند.

اما:

```text
Theme
Language
Timezone
Calendar
Density
```

نباید باعث صدها Request شوند.

---

# 20. DATABASE SECURITY — RLS

این بخش بسیار مهم است.

RLS برای:

```text
user_preferences
```

باید فعال باشد.

User فقط بتواند Preferences خودش را:

```text
SELECT
INSERT
UPDATE
```

کند.

منطق:

```sql
auth.uid() = user_id
```

User A نباید بتواند Preferences User B را بخواند یا تغییر دهد.

---

# 21. GUEST MODE

حالت Guest باید منطقی باشد.

Guest:

```text
local/offline preferences
```

می‌تواند داشته باشد.

اما بعد از Login:

```text
Authenticated preferences from Supabase
```

باید Source of Truth شود.

اگر لازم است Preferences مهمان به Account منتقل شود، این Migration را اصولی پیاده‌سازی کن.

---

# 22. LOGOUT / LOGIN TEST

حتماً این سناریو را تست کن:

### User A

```text
Language = German
Theme = Dark
Color = Yellow
Calendar = Jalali
```

Logout.

Login مجدد.

Expected:

```text
German
Dark
Yellow
Jalali
```

---

# 23. MULTI USER ISOLATION

User A:

```text
German
Dark
```

User B:

```text
Persian
Light
```

User A نباید تنظیمات User B را ببیند.

User B نباید تنظیمات User A را ببیند.

---

# 24. THEME CHANGE TEST MATRIX

این موارد را واقعاً تست کن:

```text
System → Light
System → Dark
Light → Dark
Dark → Light
Light → System
Dark → System
```

همچنین:

```text
Yellow → Blue
Blue → Purple
Purple → Emerald
Emerald → Teal
Teal → Orange
Orange → Rose
Rose → Slate
```

بعد:

```text
Refresh
Logout
Login
```

Theme باید حفظ شود.

---

# 25. LANGUAGE TEST MATRIX

تست:

```text
FA → EN
FA → DE
EN → FA
EN → DE
DE → FA
DE → EN
```

بعد از هر تغییر بررسی کن:

```text
Text
Direction
Navigation
Buttons
Forms
Tables
Dialogs
Notifications
Empty States
Error Messages
Dashboard
Profile
Settings
```

همه باید زبان صحیح داشته باشند.

---

# 26. DATE + LANGUAGE LOGIC

Language و Calendar دو مفهوم جدا هستند.

مثلاً:

```text
Language = German
Calendar = Jalali
```

باید کاملاً مجاز باشد.

یا:

```text
Language = Persian
Calendar = Gregorian
```

هم مجاز باشد.

پس:

```text
language
```

نباید Calendar را خودکار تغییر دهد.

---

# 27. TIMEZONE LOGIC

Timezone هم مستقل باشد.

مثلاً:

```text
Language = German
Timezone = Asia/Tehran
Calendar = Jalali
```

کاملاً معتبر است.

Database:

```text
UTC
```

UI:

```text
Selected Timezone
```

---

# 28. CURRENT PAGE CONTENT

صفحه‌ای که اکنون متن آن شامل موارد زیر است:

```text
حالت مهمان
ورود به حساب
پروژه‌های شما
تسک‌های انجام‌شده
اطلاعات حساب دولوپر
تنظیمات و ترجیحات سیستم
زبان و زمان
ظاهر و تم بصری
راهنمای جامع محصول
درباره EDX CRM WEB FOV
شبکه‌های اجتماعی رسمی
```

باید 100٪ از Translation System استفاده کند.

هیچ String فارسی Hardcoded باقی نماند.

---

# 29. HEADER / GLOBAL UI

فقط صفحه Profile را ترجمه نکن.

Language باید Global باشد.

بعد از تغییر زبان:

```text
Header
Sidebar
Dashboard
Projects
Tasks
Roadmap
Modules
Architecture
Testing
Pricing
Analytics
Calendar
Clients
Services
Profile
Settings
```

همه باید از همان Language State استفاده کنند.

---

# 30. DATE / NUMBER FORMATTING

یک Utility مرکزی ایجاد/اصلاح کن:

```text
src/lib/i18n/
src/lib/date/
src/lib/format/
```

مثلاً:

```text
formatDate()
formatNumber()
formatCurrency()
formatTime()
```

نباید هر Component منطق Date/Number خودش را داشته باشد.

---

# 31. ACCESSIBILITY

Language selector:

* Keyboard accessible
* Focus state
* Screen-reader friendly
* Proper aria-label
* Selected state
* No color-only indication

Theme selector نیز همین استاندارد را داشته باشد.

---

# 32. MOBILE

روی Mobile نیز:

```text
Language selector
Theme selector
Timezone
Calendar
Density
```

باید کامل قابل استفاده باشند.

هیچ Setting نباید فقط Desktop functionality داشته باشد.

---

# 33. NO RELOAD ARCHITECTURE

Language/Theme تغییر نباید باعث:

```text
full page reload
```

شود.

React/Application State را Update کن.

---

# 34. ERROR HANDLING

اگر Supabase Update شکست خورد:

مثلاً:

```text
Failed to save preferences
```

نمایش بده.

اما UI را Crash نکن.

همچنین:

```text
network unavailable
session expired
RLS denied
invalid preference
```

را graceful handle کن.

---

# 35. VALIDATION

فقط این مقادیر مجاز باشند:

### language

```text
fa
en
de
```

### theme_mode

```text
light
dark
system
```

### calendar

```text
jalali
gregorian
```

### density

```text
comfortable
compact
```

### timezone

فقط timezoneهای معتبر.

---

# 36. SCALE / IMPLEMENTATION DEPTH

این اصلاحیه را با این سطح اجرا کن:

## LEVEL 1 — UI

* Functional selectors
* Correct labels
* Visual states

## LEVEL 2 — Application State

* Global ThemeProvider
* Global I18nProvider
* Global language state
* Global direction state

## LEVEL 3 — Persistence

* Supabase user_preferences
* Load on authentication
* Save on changes

## LEVEL 4 — Security

* RLS
* User isolation
* Validation

## LEVEL 5 — UX

* Instant switching
* No reload
* Loading/error states
* Mobile support

## LEVEL 6 — Architecture

* Translation Source of Truth
* Theme tokens
* Date/number utilities
* No duplicated preference logic

## LEVEL 7 — Production Verification

* Browser runtime test
* Supabase database test
* RLS test
* Multi-user test
* Refresh test
* Logout/Login test
* Language matrix
* Theme matrix
* Mobile test

**این Task فقط زمانی COMPLETE محسوب می‌شود که Level 1 تا Level 7 انجام شده باشد.**

---

# 37. IMPORTANT — DO NOT FAKE PASS

این قوانین اجباری هستند:

```text
Code inspection ≠ Runtime verification
Build success ≠ Feature success
Responsive CSS ≠ Feature parity
Frontend filtering ≠ RLS security
```

اگر چیزی واقعاً تست نشده:

```text
NOT VERIFIED
```

بنویس.

به هیچ عنوان:

```text
PASS
```

را صرفاً بر اساس وجود کد اعلام نکن.

---

# 38. FINAL VERIFICATION REPORT

در پایان گزارش دقیق بده:

| Test                    | Status                 | Evidence |
| ----------------------- | ---------------------- | -------- |
| 3-language system       | PASS/FAIL/NOT VERIFIED | ...      |
| Persian UI              | ...                    | ...      |
| English UI              | ...                    | ...      |
| German UI               | ...                    | ...      |
| RTL/LTR                 | ...                    | ...      |
| Theme switching         | ...                    | ...      |
| System theme            | ...                    | ...      |
| Color themes            | ...                    | ...      |
| Supabase persistence    | ...                    | ...      |
| Refresh persistence     | ...                    | ...      |
| Login persistence       | ...                    | ...      |
| Multi-user isolation    | ...                    | ...      |
| RLS                     | ...                    | ...      |
| Mobile                  | ...                    | ...      |
| Desktop                 | ...                    | ...      |
| Error handling          | ...                    | ...      |
| No hardcoded UI strings | ...                    | ...      |

---

# 39. FINAL ACCEPTANCE CRITERIA

Task فقط زمانی COMPLETE است که:

### Language

* [ ] Persian works
* [ ] English works
* [ ] German works
* [ ] Instant switching
* [ ] RTL/LTR correct
* [ ] Global UI translated
* [ ] No important hardcoded strings

### Theme

* [ ] Light works
* [ ] Dark works
* [ ] System works
* [ ] Color themes work
* [ ] Entire application responds
* [ ] No broken components
* [ ] Persistent

### Persistence

* [ ] Supabase saves preferences
* [ ] Refresh restores them
* [ ] Logout/Login restores them
* [ ] User isolation works

### Security

* [ ] RLS actually enabled
* [ ] RLS actually tested
* [ ] User A cannot access User B preferences
* [ ] No frontend-only security claims

### Architecture

* [ ] Global i18n
* [ ] Global theme engine
* [ ] Central preference service
* [ ] Central date/number formatting
* [ ] No duplicated logic

---

# FINAL COMMAND

اول کد فعلی را Audit کن.

بعد مشکل واقعی Theme و Language را پیدا کن.

اگر Architecture فعلی ناقص است، آن را اصلاح کن.

اگر لازم است dependency استاندارد i18n اضافه کن.

اگر لازم است Supabase schema/migration اصلاح شود، انجام بده.

اگر RLS ناقص است، اصلاح کن.

اگر Translation System وجود دارد، آن را توسعه بده و سیستم موازی نساز.

اگر Theme Engine وجود دارد، آن را تکمیل کن و دوباره‌کاری نکن.

در نهایت **واقعاً اجرا و تست کن**.

هدف این نیست که UI ظاهراً درست شود.

هدف این است که:

> **EDX CRM WEB FOV یک سیستم واقعی، پایدار، قابل توسعه و Production-Grade برای Language + Theme + User Preferences داشته باشد.**

هیچ Demo، Mock، Fake Persistence یا PASS جعلی قابل قبول نیست.
