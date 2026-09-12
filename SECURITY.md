# 🔒 راهنمای امنیت پروژه EDX CRM WEB FOV

## 📋 فهرست

1. [Security Headers](#security-headers)
2. [Authentication Security](#authentication-security)
3. [Data Protection](#data-protection)
4. [Best Practices](#best-practices)
5. [Vulnerability Reporting](#vulnerability-reporting)

---

## 🛡️ Security Headers

### Headers فعال شده

پروژه از Security Headers زیر استفاده می‌کند:

#### 1. **X-Content-Type-Options: nosniff**
- جلوگیری از MIME type sniffing
- مرورگر را مجبور می‌کند به Content-Type سرور احترام بگذارد

#### 2. **X-Frame-Options: DENY**
- جلوگیری از حملات Clickjacking
- سایت نمی‌تواند در iframe نمایش داده شود

#### 3. **X-XSS-Protection: 1; mode=block**
- فعال‌سازی XSS Protection در مرورگرهای قدیمی
- در صورت تشخیص XSS، صفحه را block می‌کند

#### 4. **Referrer-Policy: strict-origin-when-cross-origin**
- کنترل اطلاعات Referrer
- فقط origin را در cross-origin requests ارسال می‌کند

#### 5. **Permissions-Policy**
```
camera=(), microphone=(), geolocation=(), interest-cohort=()
```
- محدود کردن دسترسی به API‌های مرورگر
- غیرفعال کردن FLoC (Federated Learning of Cohorts)

#### 6. **Strict-Transport-Security (HSTS)**
```
max-age=31536000; includeSubDomains; preload
```
- اجبار استفاده از HTTPS برای 1 سال
- شامل تمام subdomainها
- آماده برای HSTS preload list

#### 7. **Content-Security-Policy (CSP)**
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ai.google.dev;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' data:;
connect-src 'self' https://*.supabase.co https://ai.google.dev;
frame-ancestors 'none';
base-uri 'self';
form-action 'self'
```

**توضیحات:**
- ✅ فقط منابع از خود سایت مجاز هستند
- ✅ اسکریپت‌های inline (React) مجاز است
- ✅ اتصال به Supabase و Google AI مجاز است
- ❌ iframe کردن سایت ممنوع است
- ❌ ارسال فرم به سایت‌های دیگر ممنوع است

---

## 🔐 Authentication Security

### 1. Rate Limiting
```typescript
MAX_ATTEMPTS = 5      // حداکثر 5 تلاش
WINDOW_MS = 15 * 60 * 1000    // در 15 دقیقه
LOCKOUT_MS = 15 * 60 * 1000   // قفل برای 15 دقیقه
```

**ویژگی‌ها:**
- ✅ محدودیت تلاش برای login/register
- ✅ نمایش تعداد تلاش‌های باقیمانده
- ✅ هشدار قبل از قفل شدن
- ✅ قفل خودکار بعد از تلاش‌های زیاد

### 2. CSRF Protection
```typescript
TOKEN_LIFETIME = 60 * 60 * 1000  // 1 hour
```

**ویژگی‌ها:**
- ✅ توکن‌های cryptographically secure
- ✅ Timing-safe comparison
- ✅ خودکار در sessionStorage
- ✅ اعتبارسنجی قبل از عملیات حساس

### 3. Session Management
```typescript
SESSION_TIMEOUT = 30 * 60 * 1000  // 30 minutes
WARNING_TIME = 2 * 60 * 1000      // 2 minutes warning
```

**ویژگی‌ها:**
- ✅ logout خودکار بعد از 30 دقیقه عدم فعالیت
- ✅ ردیابی فعالیت کاربر
- ✅ هشدار 2 دقیقه قبل از logout
- ✅ بررسی visibility change

### 4. Password Security
- ✅ حداقل 6 کاراکتر (توصیه: 12+)
- ✅ Hash شده توسط Supabase (bcrypt)
- ✅ Never stored in plain text
- ✅ بازیابی رمز با ایمیل

---

## 🗄️ Data Protection

### 1. Row Level Security (RLS)
```sql
-- مثال: فقط کاربر می‌تواند پروژه‌های خود را ببیند
CREATE POLICY "Users can view own projects"
    ON public.projects FOR SELECT
    USING (auth.uid() = user_id);
```

**تمام جداول RLS دارند:**
- ✅ user_profiles
- ✅ projects
- ✅ tasks
- ✅ notifications
- ✅ activities
- ✅ و همه جداول دیگر

### 2. Data Isolation
```typescript
// User-partitioned storage
const key = `sb_user_${userId}_${dataKey}`;
```

- ✅ هر کاربر فقط به داده‌های خود دسترسی دارد
- ✅ حتی در localStorage ایزوله است
- ✅ Guest users جدا از registered users

### 3. Sensitive Data
```typescript
// ❌ NEVER commit these files:
.env.local
.env
.env.production
```

**کلیدهای محرمانه:**
- ❌ Service Role Key (هرگز در client)
- ✅ Anon Key (فقط با RLS)
- ❌ API Keys در git
- ✅ فقط در Environment Variables

---

## ✅ Best Practices

### For Developers

1. **Environment Variables**
   ```bash
   # ✅ در production از env vars استفاده کنید
   VITE_SUPABASE_URL=https://...
   VITE_SUPABASE_ANON_KEY=...
   ```

2. **Secret Management**
   ```typescript
   // ❌ هرگز secret را log نکنید
   console.log(apiKey);  // NO!
   
   // ✅ فقط برای debug در development
   if (import.meta.env.DEV) {
     console.debug('Debug info');
   }
   ```

3. **Input Validation**
   ```typescript
   // ✅ همیشه input را validate کنید
   if (!email.includes('@')) {
     throw new Error('Invalid email');
   }
   
   // ✅ از Zod یا Yup استفاده کنید
   const schema = z.string().email();
   schema.parse(email);
   ```

4. **SQL Injection Prevention**
   ```typescript
   // ✅ از parameterized queries استفاده کنید
   supabase.from('users').select('*').eq('id', userId);
   
   // ❌ NEVER concatenate user input
   const query = `SELECT * FROM users WHERE id = ${userId}`;  // NO!
   ```

5. **XSS Prevention**
   ```typescript
   // ✅ React به طور پیش‌فرض escape می‌کند
   <div>{userInput}</div>  // Safe
   
   // ❌ dangerouslySetInnerHTML فقط برای trusted content
   <div dangerouslySetInnerHTML={{__html: userInput}} />  // Dangerous!
   ```

### For Deployment

1. **HTTPS Only**
   - ✅ همیشه HTTPS در production
   - ✅ HSTS header فعال
   - ✅ Redirect HTTP → HTTPS

2. **Security Scanning**
   ```bash
   # npm audit برای vulnerabilities
   npm audit
   npm audit fix
   
   # Snyk برای scanning
   npx snyk test
   ```

3. **Monitoring**
   - ✅ Error tracking (Sentry)
   - ✅ Access logs
   - ✅ Failed login attempts
   - ✅ Rate limit violations

4. **Backups**
   - ✅ Daily database backups
   - ✅ Point-in-time recovery
   - ✅ Test restore procedures

---

## 🚨 Vulnerability Reporting

اگر آسیب‌پذیری امنیتی پیدا کردید:

### DO ✅
1. **گزارش خصوصی**
   - ایمیل به security@example.com
   - شرح کامل vulnerability
   - Steps to reproduce
   - Impact assessment

2. **Responsible Disclosure**
   - 90 روز برای fix کردن
   - عدم افشای عمومی قبل از fix
   - همکاری برای test کردن fix

### DON'T ❌
1. افشای عمومی قبل از fix
2. استفاده از vulnerability
3. دسترسی به داده‌های دیگران
4. حمله DOS/DDOS

---

## 📚 منابع بیشتر

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Content Security Policy](https://content-security-policy.com/)
- [Security Headers](https://securityheaders.com/)

---

## 📝 Changelog

### v1.0.0 (2026-09-12)
- ✅ Rate Limiting implementation
- ✅ CSRF Protection
- ✅ Session Timeout
- ✅ Security Headers
- ✅ RLS Policies
- ✅ Error Boundary
- ✅ Input Validation

---

**آخرین بروزرسانی:** 12 سپتامبر 2026  
**نسخه:** 1.0.0
