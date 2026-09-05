# 🔴 MASTER PRODUCTION REALIZATION PATCH

# تبدیل EDX CRM WEB FOV از Prototype/Demo به سیستم کاملاً واقعی و Production-Grade

## ⚠️ دستور بسیار مهم

EDX CRM WEB FOV در وضعیت فعلی دارای بخش‌هایی است که فقط از نظر UI وجود دارند اما Backend، Database، Authentication، Persistence، API و Business Logic واقعی ندارند یا ناقص هستند.

هدف این Task:

> هیچ قابلیت، دکمه، فرم، فیلد، جدول، نمودار، احراز هویت، تنظیمات، پروژه، تسک، فایل، Invoice، Pricing، Notification یا هر Feature دیگری نباید صرفاً نمایشی باشد.

هر چیزی که در UI وجود دارد باید یکی از این سه وضعیت را داشته باشد:

```text
REAL
NOT IMPLEMENTED
DISABLED
```

وجود UI بدون منطق واقعی ممنوع است.

اگر Feature در UI وجود دارد، آن را واقعاً پیاده‌سازی کن.

اگر پیاده‌سازی آن در Scope فعلی ممکن نیست، آن را Fake نشان نده؛ با وضعیت واضح `Not Implemented` یا Disabled مشخص کن.

---

# 1. FIRST STEP — FULL SYSTEM AUDIT

قبل از تغییر کد، کل پروژه را Audit کن.

تمام موارد زیر را پیدا کن:

* Mock data
* Demo data
* Fake authentication
* Fake login
* Fake register
* Fake logout
* Fake password reset
* Fake email verification
* Fake Google login
* Fake database
* localStorage pretending to be database
* userPartitionStorage
* hardcoded users
* hardcoded projects
* hardcoded tasks
* hardcoded statistics
* fake invoices
* fake pricing
* fake analytics
* fake notifications
* fake profile
* fake settings
* fake permissions
* fake roles
* fake file uploads
* fake API calls
* fake loading states
* buttons without handlers
* forms without persistence
* frontend-only security
* fake success messages
* fake error messages
* simulated API responses
* random IDs used as persistent IDs
* hardcoded account information

همه را ثبت و سپس Real Implementation انجام بده.

---

# 2. SYSTEM ARCHITECTURE

معماری نهایی:

```text
                    ┌─────────────────────┐
                    │   EDX CRM WEB FOV   │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ Auth / API Services │
                    └───────┬───────┬──────┘
                            │       │
                 ┌──────────▼──┐ ┌──▼─────────────┐
                 │ Firebase     │ │ Supabase       │
                 │ Auth         │ │ PostgreSQL     │
                 │              │ │ Database       │
                 │ Identity     │ │ Application    │
                 │ Sessions     │ │ Data           │
                 └──────────────┘ └────────────────┘
```

### Firebase Authentication

مسئول:

* User Identity
* Email/Password Authentication
* Google Authentication
* Email Verification
* Password Reset
* Session
* Token
* Login
* Logout

### Supabase

مسئول:

* Projects
* Tasks
* Roadmaps
* Clients
* Pricing
* Invoices
* Preferences
* Services
* Modules
* Architecture
* Testing
* Analytics
* Notifications
* User application profile
* Other application data

---

# 3. AUTHENTICATION SOURCE OF TRUTH

Firebase Auth باید Source of Truth برای Identity باشد.

هیچ کاربر Fake یا Hardcoded نباید وجود داشته باشد.

Frontend نباید چیزی شبیه این داشته باشد:

```ts
const fakeUser = {...}
```

یا:

```ts
isLoggedIn = true
```

یا:

```ts
localStorage.setItem("loggedIn", "true")
```

برای احراز هویت.

Authentication باید از Firebase Session بیاید.

---

# 4. FIREBASE CONFIGURATION

Firebase را به صورت رسمی و استاندارد راه‌اندازی کن.

Environment Variables:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

هیچ Secret خصوصی داخل Frontend قرار نده.

Firebase Client Configuration را از Environment بخوان.

---

# 5. AUTH SERVICE

یک Service مرکزی ایجاد کن:

```text
src/services/auth/
    authService.ts
    firebase.ts
    authTypes.ts
```

یا ساختار معادل مناسب پروژه.

تمام Authentication عملیات باید از این Service عبور کند.

مثلاً:

```text
registerWithEmail()
loginWithEmail()
loginWithGoogle()
logout()
sendEmailVerification()
sendPasswordReset()
getCurrentUser()
subscribeToAuthState()
```

Componentها مستقیماً Firebase SDK را همه‌جا صدا نزنند.

---

# 6. AUTH PROVIDER

یک AuthProvider مرکزی داشته باش:

```text
AuthProvider
      ↓
Firebase onAuthStateChanged
      ↓
Current User
      ↓
Application Session
```

Application باید Session واقعی Firebase را تشخیص دهد.

Refresh صفحه نباید کاربر را Logout کند.

اگر Firebase Session معتبر است:

```text
Authenticated
```

اگر Session وجود ندارد:

```text
Guest
```

---

# 7. USER DATA MODEL

Firebase UID را به عنوان Identity Key استفاده کن.

در Supabase:

```text
profiles
```

ساختار پیشنهادی:

```text
id
firebase_uid
display_name
email
photo_url
role
created_at
updated_at
last_login_at
```

`firebase_uid` باید Unique باشد.

---

# 8. USER CREATION FLOW

وقتی User برای اولین بار Login/Register کرد:

```text
Firebase Authentication
        ↓
Firebase UID
        ↓
Find profile in Supabase
        ↓
If not exists
        ↓
Create profile
        ↓
Load user preferences
        ↓
Load user application data
        ↓
Enter Application
```

اگر Profile قبلاً وجود دارد:

```text
Firebase UID
      ↓
Existing Profile
      ↓
Load Application
```

کاربر نباید هر بار دوباره Register شود.

---

# 9. EMAIL/PASSWORD REGISTRATION

جریان استاندارد:

```text
Register
   ↓
Name
   ↓
Email
   ↓
Password
   ↓
Confirm Password
   ↓
Firebase createUserWithEmailAndPassword
   ↓
Create Firebase User
   ↓
Send Email Verification
   ↓
Verification Pending
```

Password فقط باید توسط Firebase Authentication مدیریت شود.

### ممنوع:

```text
password
password_hash
plain_password
```

در Supabase Application Tables ذخیره نشود.

---

# 10. EMAIL VERIFICATION

بعد از Registration:

```text
"Verification email sent"
```

کاربر ایمیل را باز می‌کند.

روی لینک Verification کلیک می‌کند.

Firebase Email Verification وضعیت را تغییر می‌دهد.

سپس Application:

```text
reload Firebase User
      ↓
emailVerified === true
      ↓
Allow authenticated application access
```

اگر Verification هنوز انجام نشده:

```text
Email verification required
```

نمایش داده شود.

امکان:

```text
Resend verification email
```

نیز واقعی باشد.

---

# 11. IMPORTANT — EMAIL CODE VS EMAIL LINK

از نظر معماری استاندارد Firebase، Email Verification معمولاً با **Verification Link** انجام می‌شود، نه اینکه خودمان یک کد Verification سفارشی بسازیم.

بنابراین:

```text
Register
→ Firebase sends verification email
→ User clicks Firebase verification link
→ Firebase verifies email
→ App detects verified state
```

این روش را ترجیح بده.

اگر پروژه الزاماً OTP Code می‌خواهد، آن را به صورت Custom Email Verification با Backend امن پیاده‌سازی کن و Secret/Verification logic را هرگز در Frontend قرار نده.

---

# 12. GOOGLE LOGIN

Google Login باید OAuth واقعی باشد.

Flow:

```text
Click "Continue with Google"
        ↓
Firebase Google Provider
        ↓
Google OAuth
        ↓
User grants permission
        ↓
Firebase Authentication
        ↓
Firebase UID
        ↓
Find/Create Supabase Profile
        ↓
Application
```

هیچ Fake Google Login ساخته نشود.

---

# 13. GOOGLE LOGIN + USER PROFILE

اگر Google اطلاعات زیر را ارائه کرد:

```text
displayName
email
photoURL
```

در اولین ورود:

```text
profiles
```

ساخته/تکمیل شود.

اما:

* Firebase Password را ذخیره نکن.
* Google Token را در DB ذخیره نکن.
* OAuth Secret را ذخیره نکن.

---

# 14. LOGIN FLOW

Email/Password:

```text
Email
Password
        ↓
Firebase signInWithEmailAndPassword
        ↓
Firebase Session
        ↓
Check emailVerified
        ↓
Load Supabase Profile
        ↓
Load User Preferences
        ↓
Load Projects
        ↓
Application
```

Google:

```text
Google OAuth
        ↓
Firebase Session
        ↓
Load/Create Profile
        ↓
Application
```

---

# 15. FORGOT PASSWORD

این قابلیت باید واقعی باشد.

Flow:

```text
Forgot Password
        ↓
Email
        ↓
Firebase sendPasswordResetEmail
        ↓
User receives email
        ↓
Clicks reset link
        ↓
Firebase password reset page/action
        ↓
Sets new password
        ↓
Login with new password
```

هیچ Fake:

```text
"Password reset successful"
```

قبل از موفقیت واقعی نمایش داده نشود.

---

# 16. PASSWORD SECURITY

هیچ‌وقت:

```text
password
confirmPassword
```

را در:

* Supabase
* localStorage
* sessionStorage
* logs
* analytics
* URL
* frontend database

ذخیره نکن.

Firebase Authentication مسئول Password باشد.

---

# 17. LOGOUT

Logout باید:

```text
Firebase signOut()
        ↓
Clear application session
        ↓
Clear sensitive in-memory state
        ↓
Redirect to guest/login state
```

باشد.

هیچ:

```text
localStorage.loggedIn = false
```

به عنوان Authentication استفاده نشود.

---

# 18. SESSION PERSISTENCE

Firebase Auth Session باید persist شود.

سناریو:

```text
Login
↓
Close Browser
↓
Open Browser
↓
User still authenticated
```

تا زمانی که Session معتبر است.

---

# 19. APPLICATION BOOTSTRAP

Startup:

```text
Application Start
        ↓
Firebase Auth initialization
        ↓
Wait for Auth state
        ↓
Authenticated?
   ↙           ↘
YES             NO
↓               ↓
Load User       Guest
Profile
↓
Load Preferences
↓
Load Application Data
↓
Render App
```

در هنگام Bootstrap:

```text
AuthLoading
```

نمایش بده تا UI اشتباه Guest/Authenticated را نشان ندهد.

---

# 20. SUPABASE DATABASE

Supabase باید Database واقعی پروژه باشد.

هیچ Database Fake نباشد.

حداقل جداول:

```text
profiles
user_preferences

projects
project_members

tasks
task_comments
task_activities

roadmaps
roadmap_steps

clients

pricing_categories
pricing_features
project_pricing_items

invoices
invoice_items

services
project_services

modules
project_modules

notifications

activities
attachments

analytics_events
```

با توجه به موجودیت واقعی پروژه جداول را تطبیق بده.

---

# 21. DATABASE RELATIONSHIP

ساختار اصلی:

```text
Firebase User
      │
      │ firebase_uid
      ▼
profiles
      │
      │ user_id
      ▼
projects
      │
      ├── tasks
      ├── roadmap
      ├── pricing
      ├── invoices
      ├── clients
      ├── services
      ├── modules
      └── activities
```

---

# 22. DATA OWNERSHIP

تمام داده‌های User باید به User مرتبط باشند.

مثلاً:

```text
projects.user_id
tasks.user_id
clients.user_id
invoices.user_id
user_preferences.user_id
```

و موجودیت‌های وابسته:

```text
tasks.project_id
invoice_items.invoice_id
project_pricing_items.project_id
```

---

# 23. SUPABASE RLS

RLS واقعی پیاده‌سازی کن.

Frontend Filter امنیت نیست.

مثلاً:

```sql
WHERE user_id = currentUser
```

در Frontend به تنهایی قابل قبول نیست.

Database باید خودش Access را enforce کند.

---

# 24. CRITICAL SECURITY

کاربر A:

```text
User A
firebase_uid = A
```

نباید بتواند:

```text
User B Project
User B Task
User B Invoice
User B Preferences
User B Client
```

را بخواند یا تغییر دهد.

حتی اگر User A در Request مقدار:

```text
user_id = User B
```

بفرستد.

Database باید Request را Reject کند.

---

# 25. RLS TEST

واقعاً تست کن:

```text
User A login
User A creates Project A

User B login
User B creates Project B
```

سپس:

```text
User A attempts to read Project B
```

Expected:

```text
DENIED
```

و:

```text
User A attempts to modify Project B
```

Expected:

```text
DENIED
```

این تست باید Runtime باشد.

---

# 26. ALL FORMS MUST BE REAL

هر Form موجود در Application را بررسی کن.

برای هر Form:

```text
Input
↓
Validation
↓
Submit
↓
Service
↓
API/Database
↓
Response
↓
UI State
```

اگر Submit فقط Toast می‌دهد و DB را تغییر نمی‌دهد:

```text
FAIL
```

---

# 27. ALL BUTTONS MUST BE REAL

تمام Buttonهای پروژه را Audit کن.

برای هر Button مشخص کن:

```text
Click
→ Handler
→ Service
→ Backend/API
→ Database
→ UI Update
```

اگر Button فقط UI Animation دارد:

```text
FAKE
```

و باید اصلاح شود.

---

# 28. PROFILE

Profile باید از Firebase + Supabase اطلاعات واقعی بگیرد.

مثلاً:

```text
Name
Email
Avatar
Account creation date
Role
```

نباید:

```text
علی باقری
Full-Stack Developer
```

به صورت Default داخل UI باشد.

---

# 29. USER PREFERENCES

Theme / Language / Timezone / Calendar / Density:

```text
Supabase
user_preferences
```

باشد.

Login:

```text
Load
```

Change:

```text
Update
```

Refresh:

```text
Restore
```

---

# 30. PROJECT SYSTEM

Create Project:

```text
Form
↓
Validation
↓
Supabase INSERT
↓
Real Project ID
↓
Project Context
↓
Dashboard
```

Project نباید فقط در State ساخته شود.

---

# 31. TASK SYSTEM

Create Task:

```text
Task Form
↓
Validation
↓
Supabase INSERT
↓
Task ID
↓
UI update
```

Complete Task:

```text
UPDATE tasks
SET status = completed
```

Activity/Analytics نیز در صورت طراحی شدن باید از همین تغییر واقعی تغذیه شوند.

---

# 32. REFRESH PERSISTENCE

سناریو:

```text
Login
Create Project
Create 10 Tasks
Complete 5
Change Theme
Change Language
Refresh
```

Expected:

```text
Project = موجود
Tasks = موجود
Completed = 5
Theme = حفظ شده
Language = حفظ شده
```

---

# 33. ANALYTICS

هیچ Chart نباید Fake Data داشته باشد.

اگر Dashboard می‌گوید:

```text
Projects: 10
Tasks: 37
Completed: 15
```

این اعداد باید از Database محاسبه شوند.

نه:

```js
const projects = 10;
```

---

# 34. NOTIFICATIONS

Notification باید واقعی باشد.

مثلاً:

```text
Task assigned
Task completed
Invoice created
Project updated
```

اگر Notification UI وجود دارد، باید Database/API پشت آن وجود داشته باشد.

---

# 35. PRICING

Pricing Engine باید:

```text
Supabase
```

را Source of Truth قرار دهد.

هر:

```text
Category
Feature
Pricing Item
Quantity
Price
Discount
Invoice
```

باید واقعاً Persist شود.

---

# 36. INVOICE

Invoice باید واقعاً در DB ذخیره شود.

```text
Create Invoice
↓
Validate
↓
DB INSERT
↓
Generate Invoice Number
↓
Persist
↓
PDF
```

Invoice PDF نباید صرفاً Screenshot از UI باشد.

---

# 37. SERVICES / ACCOUNTS

هر Service موجود در UI باید Data Model واقعی داشته باشد.

مثلاً:

```text
Domain
Hosting
GitHub
Cloudflare
Firebase
Supabase
Google Analytics
Search Console
Payment Gateway
Email
SMS
AI API
Storage
```

اطلاعات:

```text
owner
status
access level
setup status
expiration
documentation
```

واقعاً ذخیره شوند.

### ⚠️ اما:

Password / API Secret / Private Token را در Database معمولی ذخیره نکن.

برای Secret Management از Secret Manager مناسب استفاده کن.

---

# 38. FILE UPLOAD

اگر File Upload در UI وجود دارد:

نباید:

```text
fake upload
```

باشد.

باید واقعاً:

```text
File
↓
Storage
↓
File Metadata DB
↓
Permission
↓
Download/Delete
```

پیاده‌سازی شود.

اگر از Supabase Storage استفاده می‌شود، Storage Policies نیز تنظیم شوند.

---

# 39. SEARCH

Search باید روی داده واقعی کار کند.

نباید:

```text
fake search results
```

داشته باشیم.

---

# 40. DELETE

Delete باید واقعاً Delete کند.

اما برای داده‌های مهم:

```text
Confirmation
↓
Database Mutation
↓
Success
↓
UI Refresh
```

و در صورت نیاز Soft Delete پیاده‌سازی کن.

---

# 41. LOADING STATES

Loading باید مربوط به Request واقعی باشد.

مثلاً:

```text
isLoadingProjects
isSavingPreferences
isCreatingInvoice
isLoggingIn
```

نباید با:

```text
setTimeout()
```

شبیه‌سازی شود.

---

# 42. ERROR STATES

Error واقعی را نمایش بده.

مثلاً:

```text
Authentication failed
Email already exists
Invalid password
Email not verified
Permission denied
Database unavailable
Network error
Validation error
```

پیغام‌ها از Translation System بیایند.

---

# 43. API / SERVICE ARCHITECTURE

Component نباید مستقیماً همه کارها را انجام دهد.

Architecture:

```text
UI
 ↓
Hook
 ↓
Service
 ↓
Firebase / Supabase
 ↓
Database
```

مثلاً:

```text
useProjects()
     ↓
projectService
     ↓
Supabase
```

و:

```text
useAuth()
     ↓
authService
     ↓
Firebase
```

---

# 44. NO DATABASE QUERIES SCATTERED EVERYWHERE

این ممنوع:

```tsx
Component
  ↓
supabase.from(...)
```

در ده‌ها Component.

Query Logic باید در Service/Data Access Layer متمرکز شود.

---

# 45. VALIDATION

تمام Formها Validation واقعی داشته باشند.

مثلاً Register:

```text
Name required
Valid email
Password minimum strength
Confirm password match
```

Login:

```text
Email required
Password required
```

Forgot Password:

```text
Valid email
```

---

# 46. AUTH ERROR MAPPING

Firebase Errors را به پیام قابل فهم تبدیل کن.

مثلاً:

```text
auth/invalid-credential
auth/email-already-in-use
auth/weak-password
auth/invalid-email
auth/user-disabled
auth/too-many-requests
```

به Translation Key تبدیل شوند.

---

# 47. SECURITY RULE

هیچ Secret یا Credential واقعی داخل:

```text
React Component
Git repository
Frontend bundle
localStorage
Database public tables
```

قرار نده.

---

# 48. ENVIRONMENT

Environmentها را جدا کن:

```text
.env.local
.env.production
```

و:

```text
Firebase
Supabase
API
Storage
```

Configها Environment-based باشند.

---

# 49. PRODUCTION DATABASE MIGRATIONS

Schema را با Migration مدیریت کن.

هر تغییر Database:

```text
Migration
↓
Apply
↓
Verify
```

باشد.

مستقیماً تغییرات خطرناک روی Production نده.

---

# 50. NO DATA LOSS

در اصلاح Database:

```text
DO NOT DROP USER DATA
DO NOT DELETE EXISTING PROJECTS
DO NOT DELETE REAL INVOICES
```

مگر اینکه Migration به صورت Safe طراحی شده باشد.

---

# 51. REALTIME

اگر پروژه برای برخی بخش‌ها به Realtime نیاز دارد:

```text
Supabase Realtime
```

را برای موارد مناسب استفاده کن.

اما Realtime را بی‌دلیل به همه چیز اضافه نکن.

---

# 52. CACHE

Cache فقط برای Performance باشد.

Cache نباید Source of Truth شود.

Source of Truth:

```text
Firebase → Identity
Supabase → Application Data
```

---

# 53. OFFLINE / GUEST MODE

Guest می‌تواند Offline Mode داشته باشد.

اما باید کاملاً مشخص باشد:

```text
Guest / Local
```

و:

```text
Authenticated / Cloud
```

دو وضعیت متفاوت هستند.

بعد از Login می‌توان داده‌های Guest را با تأیید کاربر به Account منتقل کرد.

---

# 54. AUTH GUARDS

Routes را واقعی محافظت کن:

```text
Guest routes
Authenticated routes
Verified-user routes
Admin routes
```

مثلاً:

```text
/dashboard
/projects
/tasks
/pricing
/profile
```

نباید بدون Authentication واقعی قابل دسترسی باشند.

---

# 55. ROLE-BASED ACCESS

اگر Role System وجود دارد:

```text
User
Admin
Manager
Developer
Client
```

باید Role فقط UI Feature نباشد.

Backend/Database نیز باید Permission را enforce کند.

---

# 56. ACCOUNT DELETION

اگر گزینه حذف حساب وجود دارد:

باید مشخصاً:

```text
Delete Account
↓
Confirmation
↓
Firebase account handling
↓
Application data handling
```

طراحی شود.

هیچ Delete Account نمایشی قابل قبول نیست.

---

# 57. GLOBAL REALITY AUDIT

تمام مسیرهای زیر را یکی‌یکی بررسی کن:

```text
Authentication
Registration
Login
Google Login
Email Verification
Logout
Forgot Password
Profile
Settings
Language
Theme
Timezone
Calendar
Projects
Tasks
Roadmap
Clients
Modules
Architecture
Testing
Pricing
Invoices
Analytics
Notifications
Services
Files
Search
Filters
Tables
Charts
Dashboard
```

برای هرکدام مشخص کن:

```text
UI
↓
State
↓
Service
↓
Backend
↓
Database
↓
Persistence
↓
Security
```

اگر هر لایه‌ای وجود ندارد، آن Feature ناقص است.

---

# 58. END-TO-END TEST

حداقل این سناریو را واقعاً اجرا کن:

## User A

```text
Register
↓
Verify Email
↓
Login
↓
Create Profile
↓
Create Project
↓
Create Tasks
↓
Change Theme
↓
Change Language to German
↓
Refresh
↓
Logout
↓
Login
```

Expected:

```text
All data restored
German restored
Theme restored
User recognized
```

---

# 59. SECOND USER

User B:

```text
Register
↓
Login
```

Expected:

```text
0 Projects
0 Tasks
0 User A Data
```

User B نباید چیزی از User A ببیند.

---

# 60. SECURITY ATTACK TEST

با User B تلاش کن:

```text
Read User A project
Read User A task
Update User A project
Delete User A task
Read User A preferences
Read User A invoice
```

با تغییر دستی:

```text
user_id
project_id
firebase_uid
```

هم باید Access Denied شود.

---

# 61. BROWSER TEST

واقعاً در Browser تست کن:

```text
Register
Login
Google Login
Logout
Forgot Password
Verification
Refresh
Back
Forward
New Tab
Close Browser
Reopen Browser
```

---

# 62. NO FALSE SUCCESS

این رفتار ممنوع:

```text
Click Login
↓
Toast "Login successful"
```

در حالی که Firebase Login انجام نشده.

همچنین:

```text
Click Save
↓
Toast "Saved"
```

در حالی که Supabase Update انجام نشده.

Success فقط بعد از موفقیت واقعی عملیات نمایش داده شود.

---

# 63. TESTING TERMINOLOGY

در گزارش نهایی تفاوت این موارد را رعایت کن:

```text
BUILD PASS
CODE VERIFIED
RUNTIME PASS
DATABASE PASS
SECURITY PASS
END-TO-END PASS
```

این‌ها معادل هم نیستند.

مثلاً:

```text
Build PASS
```

به معنی:

```text
Authentication PASS
```

نیست.

---

# 64. FINAL AUDIT REPORT

در پایان یک جدول دقیق بده:

| Feature            | UI | Logic | Backend | DB | Security | Runtime | Status |
| ------------------ | -- | ----- | ------- | -- | -------- | ------- | ------ |
| Register           |    |       |         |    |          |         |        |
| Email Login        |    |       |         |    |          |         |        |
| Google Login       |    |       |         |    |          |         |        |
| Email Verification |    |       |         |    |          |         |        |
| Logout             |    |       |         |    |          |         |        |
| Forgot Password    |    |       |         |    |          |         |        |
| Profile            |    |       |         |    |          |         |        |
| Preferences        |    |       |         |    |          |         |        |
| Language           |    |       |         |    |          |         |        |
| Theme              |    |       |         |    |          |         |        |
| Projects           |    |       |         |    |          |         |        |
| Tasks              |    |       |         |    |          |         |        |
| Roadmap            |    |       |         |    |          |         |        |
| Pricing            |    |       |         |    |          |         |        |
| Invoice            |    |       |         |    |          |         |        |
| Analytics          |    |       |         |    |          |         |        |
| Notifications      |    |       |         |    |          |         |        |
| Services           |    |       |         |    |          |         |        |

---

# 65. STATUS RULE

فقط این Statusها مجازند:

```text
PASS
FAIL
NOT VERIFIED
NOT IMPLEMENTED
```

اگر چیزی فقط از روی Code بررسی شده:

```text
NOT VERIFIED
```

اگر فقط UI دارد:

```text
NOT IMPLEMENTED
```

اگر Runtime تست شده و کار کرده:

```text
PASS
```

---

# 66. DEFINITION OF DONE

EDX CRM WEB FOV فقط زمانی Production-Ready محسوب می‌شود که:

### Authentication

* [ ] Firebase Authentication واقعی
* [ ] Email Registration واقعی
* [ ] Email Login واقعی
* [ ] Google OAuth واقعی
* [ ] Email Verification واقعی
* [ ] Logout واقعی
* [ ] Forgot Password واقعی
* [ ] Persistent Session
* [ ] Auth State Listener
* [ ] User Profile Sync

### Database

* [ ] Supabase واقعی
* [ ] PostgreSQL schema
* [ ] Migrations
* [ ] Foreign Keys
* [ ] Indexes
* [ ] RLS
* [ ] User Isolation
* [ ] Project Isolation

### Application

* [ ] Projects واقعی
* [ ] Tasks واقعی
* [ ] Roadmap واقعی
* [ ] Clients واقعی
* [ ] Pricing واقعی
* [ ] Invoice واقعی
* [ ] Analytics واقعی
* [ ] Notifications واقعی
* [ ] Services واقعی
* [ ] Files واقعی
* [ ] Settings واقعی

### UX

* [ ] Loading states
* [ ] Error states
* [ ] Empty states
* [ ] Success states
* [ ] Validation
* [ ] Mobile
* [ ] Desktop
* [ ] RTL/LTR
* [ ] Persian
* [ ] English
* [ ] German

### Security

* [ ] No passwords in DB
* [ ] No secrets in frontend
* [ ] RLS verified
* [ ] User isolation verified
* [ ] Role enforcement verified
* [ ] Protected routes
* [ ] Firebase session verified

---

# 🚨 FINAL COMMAND TO THE CODING AGENT

این Task را به عنوان یک **Repository-Wide Production Hardening & Realization** اجرا کن.

فقط صفحه Login/Register را اصلاح نکن.

کل Repository را بررسی کن.

هر چیزی که:

```text
ظاهر دارد ولی Backend ندارد
ظاهر دارد ولی Database ندارد
ظاهر دارد ولی Persistence ندارد
ظاهر دارد ولی Security ندارد
ظاهر دارد ولی Handler ندارد
```

را پیدا کن.

سپس آن را واقعی و استاندارد کن.

اگر برای پیاده‌سازی یک Feature نیاز به:

```text
Firebase configuration
Supabase migration
RLS
Service Layer
API
Storage
Authentication
Environment Variables
Dependencies
Hooks
Providers
Route Guards
```

است، همه را خودت در معماری صحیح پروژه اضافه/اصلاح کن.

اما:

### ❌ Fake Implementation ممنوع

### ❌ Mock Authentication ممنوع

### ❌ Fake Database ممنوع

### ❌ Fake Login ممنوع

### ❌ Fake Register ممنوع

### ❌ Fake Google Login ممنوع

### ❌ Fake Email Verification ممنوع

### ❌ Fake Password Reset ممنوع

### ❌ Fake Persistence ممنوع

### ❌ Fake Success Toast ممنوع

### ❌ Frontend-only Security ممنوع

و مهم‌تر از همه:

> **هیچ Feature را فقط به خاطر اینکه UI آن وجود دارد، PASS اعلام نکن.**

هر قابلیت باید از:

```text
UI
→ State
→ Service
→ Authentication/API
→ Database
→ Security
→ Persistence
→ Runtime
```

عبور کند.

در پایان Build، Runtime، Database، Security و End-to-End را جداگانه گزارش کن.

اگر چیزی واقعاً تست نشده:

```text
NOT VERIFIED
```

بنویس.

هدف نهایی:

> **EDX CRM WEB FOV باید یک نرم‌افزار واقعی باشد، نه یک Prototype که فقط شبیه نرم‌افزار واقعی دیده می‌شود.**
