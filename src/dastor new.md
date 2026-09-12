# 🔴 CONTINUE & FINISH — EDX CRM WEB FOV PRODUCTION IMPLEMENTATION

گزارش قبلی را بررسی کردم.

از اینجا به بعد **هیچ Audit یا Documentation جدیدی تولید نکن مگر اینکه برای اجرای یک بخش لازم باشد.**

طبق گزارش خودت:

```text
Production Readiness = 63%
```

و موارد زیر هنوز ناقص هستند:

* Auth UI integration
* localStorage fallbacks
* Complete i18n
* Hardcoded strings
* Theme coverage
* Runtime testing
* RLS verification
* User isolation verification
* Final verification

بنابراین از همین وضعیت ادامه بده و Task را تا Production-Ready شدن کامل کن.

---

# 1. ARCHITECTURE DECISION — IMPORTANT

تو در گزارش قبلی تصمیم گرفتی:

```text
Supabase Auth
+
Supabase Database
```

را به جای Firebase Auth استفاده کنی.

این تصمیم را فقط به دلیل اینکه Codebase فعلی Supabase Auth دارد گرفته‌ای.

از آنجا که هدف اصلی من این است:

> Authentication واقعی + Database واقعی + معماری استاندارد + کمترین پیچیدگی

اگر Supabase Auth فعلی بتواند تمام نیازهای زیر را به صورت استاندارد و واقعی پوشش دهد:

```text
Email/Password Registration
Email/Password Login
Google OAuth
Email Verification
Password Reset
Persistent Session
Logout
Auth State
User Identity
```

**Supabase Auth را به عنوان Architecture رسمی پروژه حفظ کن.**

لازم نیست فقط برای تغییر نام Firebase، Firebase را اضافه کنی.

اما اگر یکی از نیازهای فوق با Supabase Auth به صورت استاندارد قابل پیاده‌سازی نیست، آن مورد را دقیقاً مشخص کن و قبل از تغییر معماری گزارش بده.

### ممنوع:

تعویض Authentication Provider بدون دلیل فنی.

---

# 2. COMPLETE AUTH UI INTEGRATION

Auth Service جدید ساخته شده اما UI هنوز از آن استفاده نمی‌کند.

این را کامل اصلاح کن.

تمام صفحات:

```text
Login
Register
Forgot Password
Reset Password
Email Verification
Google Login
Logout
Auth Callback
```

باید به Auth Service واقعی متصل شوند.

Architecture:

```text
UI
 ↓
Auth Hook
 ↓
Auth Service
 ↓
Supabase Auth
 ↓
Session
 ↓
Application
```

Component نباید Authentication logic را مستقیماً مدیریت کند.

---

# 3. REGISTER

Registration واقعی:

```text
Name
Email
Password
Confirm Password
```

Flow:

```text
Register
 ↓
Validation
 ↓
supabase.auth.signUp()
 ↓
Email Verification
 ↓
Verification Pending
```

Password نباید در Database Application ذخیره شود.

---

# 4. EMAIL VERIFICATION

بعد از Register:

```text
Verification email sent
```

کاربر روی Link کلیک می‌کند.

Supabase Auth وضعیت:

```text
email_confirmed_at
```

را ثبت می‌کند.

Application باید Auth State را Refresh کند.

تا زمانی که Email تأیید نشده:

```text
Verified = false
```

و رفتار
