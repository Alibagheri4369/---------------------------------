# 🚀 EDX CRM WEB FOV - Production Setup Guide

## 📋 Overview

This is a **production-grade** web developer project management system with:
- ✅ **Real Supabase Authentication** (email/password + Google OAuth)
- ✅ **PostgreSQL Database with RLS** (Row-Level Security)
- ✅ **3-Language Support** (Persian, English, German)
- ✅ **Theme Engine** (light/dark/system + multiple color themes)
- ✅ **Persistent User Preferences**
- ✅ **No fake authentication or mock data**

---

## 🔧 Prerequisites

- Node.js 18+ or Bun
- A Supabase account (free tier works)
- (Optional) Google OAuth credentials

---

## 📦 Step 1: Clone and Install

```bash
git clone <repository-url>
cd edx-crm-web-fov
npm install
# or
bun install
```

---

## 🗄️ Step 2: Set Up Supabase

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be provisioned

### 2.2 Run Database Schema

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy the entire contents of `src/services/supabase-schema.sql`
4. Paste and run it in the SQL Editor
5. Verify all tables were created successfully

This will create:
- ✅ User profiles table
- ✅ User preferences table
- ✅ Projects, tasks, clients tables
- ✅ Activities, notifications tables
- ✅ Invoices and analytics tables
- ✅ Row-Level Security (RLS) policies
- ✅ Auto-profile creation trigger

### 2.3 Get API Credentials

1. Go to **Settings** → **API**
2. Copy your **Project URL**
3. Copy your **anon/public key**

---

## ⚙️ Step 3: Environment Configuration

Create `.env.local` file in the project root:

```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key-here"
APP_URL="http://localhost:3000"
```

Replace with your actual Supabase credentials.

---

## 🔐 Step 4: Configure Authentication

### 4.1 Email Authentication (Default)

Supabase email auth is enabled by default. Users can:
- Register with email/password
- Receive verification emails
- Reset passwords via email

### 4.2 Email Templates (Optional)

Customize email templates in Supabase:
1. Go to **Authentication** → **Email Templates**
2. Customize:
   - Confirmation email
   - Password reset email
   - Magic link email

### 4.3 Google OAuth (Optional)

To enable Google login:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to **Credentials** → **Create OAuth 2.0 Client**
5. Add authorized redirect URIs:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
6. Copy **Client ID** and **Client Secret**
7. In Supabase dashboard:
   - Go to **Authentication** → **Providers**
   - Enable **Google**
   - Paste Client ID and Secret
   - Save

---

## 🎨 Step 5: Configure Site URL

In Supabase dashboard:
1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
3. Add **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   https://yourdomain.com/auth/callback
   ```

---

## 🚀 Step 6: Run the Application

```bash
npm run dev
# or
bun run dev
```

Application will start at `http://localhost:3000`

---

## ✅ Step 7: Verify Setup

### Test Authentication Flow

1. **Register New User**
   - Click "Register" → Fill form → Submit
   - Check email for verification link
   - Verify email
   - Login with credentials

2. **Test Google OAuth** (if configured)
   - Click "Continue with Google"
   - Authorize with Google account
   - Should redirect back and create profile

3. **Test Password Reset**
   - Click "Forgot Password"
   - Enter email
   - Check email for reset link
   - Set new password
   - Login with new password

4. **Test Profile & Preferences**
   - Go to Profile page
   - Change theme (light/dark/system)
   - Change language (Persian/English/German)
   - Change color theme
   - Logout and login again
   - Verify preferences persisted

5. **Test Projects**
   - Create a new project
   - Add tasks
   - Mark tasks complete
   - Refresh page
   - Verify data persisted

6. **Test User Isolation**
   - Create User A, add projects
   - Logout
   - Create User B
   - Verify User B cannot see User A's projects

---

## 🔒 Security Verification

### Row-Level Security (RLS) Test

Run this in Supabase SQL Editor to verify RLS:

```sql
-- Should return only current user's projects
SELECT * FROM projects;

-- Should return only current user's preferences
SELECT * FROM user_preferences;
```

If you see all users' data, RLS is not working!

### Common RLS Issues

If RLS isn't working:
1. Ensure you ran the full schema SQL
2. Check RLS is enabled: `ALTER TABLE projects ENABLE ROW LEVEL SECURITY;`
3. Verify policies exist: Check "Authentication" → "Policies" in Supabase
4. Make sure you're authenticated when testing

---

## 🌍 Multi-Language Support

The application supports 3 languages:

- **Persian (فارسی)** - RTL
- **English** - LTR  
- **German (Deutsch)** - LTR

Language can be changed in Profile → Settings.

Translation files are in:
- `src/i18n/locales/fa.ts`
- `src/i18n/locales/en.ts`
- `src/i18n/locales/de.ts`

---

## 🎨 Theme System

Supports:
- **Theme Modes**: Light, Dark, System (auto)
- **Color Themes**: Default, Blue, Indigo, Purple, Emerald, Teal, Orange, Rose, Slate
- **Persistence**: Saved to Supabase per user
- **RTL/LTR**: Automatic based on language

---

## 📊 Database Structure

| Table | Purpose | RLS Enabled |
|-------|---------|-------------|
| `user_profiles` | User account data | ✅ |
| `user_preferences` | Theme, language, timezone | ✅ |
| `projects` | User projects | ✅ |
| `tasks` | Project tasks | ✅ |
| `clients` | Client information | ✅ |
| `activities` | Activity log | ✅ |
| `notifications` | User notifications | ✅ |
| `invoices` | Project invoices | ✅ |
| `invoice_items` | Invoice line items | ✅ |
| `attachments` | File uploads | ✅ |
| `analytics_events` | Analytics tracking | ✅ |

All tables have RLS policies that restrict access to `auth.uid() = user_id`.

---

## 🐛 Troubleshooting

### "Supabase not configured" Error

**Problem**: Environment variables not loaded

**Solution**:
1. Ensure `.env.local` exists (not `.env`)
2. Restart development server
3. Verify variables with `import.meta.env.VITE_SUPABASE_URL`

### "Table does not exist" Error

**Problem**: Database schema not created

**Solution**:
1. Run the full `supabase-schema.sql` in Supabase SQL Editor
2. Check for SQL errors in the output
3. Verify tables exist in Table Editor

### "RLS policy violation" Error

**Problem**: RLS policies not created or user_id mismatch

**Solution**:
1. Ensure RLS policies were created from schema
2. Check you're authenticated (`auth.uid()` must return value)
3. Verify `user_id` column matches `auth.uid()`

### Email Verification Not Working

**Problem**: Emails not being sent

**Solution**:
1. Check Supabase email rate limits
2. Verify email templates are enabled
3. Check spam folder
4. For testing, disable email confirmation in Supabase Auth settings

### Google OAuth Redirect Error

**Problem**: OAuth redirect URL mismatch

**Solution**:
1. Ensure redirect URL in Google Console matches Supabase
2. Format: `https://<project-ref>.supabase.co/auth/v1/callback`
3. Check Site URL is set in Supabase Auth settings

---

## 🚀 Production Deployment

### Before Deployment

1. ✅ Verify all RLS policies are active
2. ✅ Test with multiple users
3. ✅ Test email flows (verification, reset)
4. ✅ Test OAuth flows
5. ✅ Test theme/language persistence
6. ✅ Test project CRUD operations
7. ✅ Verify user isolation (User A cannot see User B data)

### Environment Variables for Production

```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-production-anon-key"
APP_URL="https://yourdomain.com"
```

### Build

```bash
npm run build
# or
bun run build
```

### Deploy

The `dist` folder can be deployed to:
- Vercel
- Netlify
- Cloudflare Pages
- Any static hosting

Don't forget to:
1. Set environment variables in hosting platform
2. Update Site URL in Supabase to production domain
3. Update OAuth redirect URLs to production domain

---

## 📚 Architecture Notes

### Authentication Source of Truth

**Supabase Auth is the ONLY source of truth.**

- ❌ NO localStorage password storage
- ❌ NO fake login fallback
- ❌ NO hardcoded users
- ✅ Only Supabase session is trusted

### Data Persistence

**Supabase PostgreSQL is the ONLY database.**

- ❌ NO localStorage as database
- ❌ NO mock data
- ✅ All data in PostgreSQL with RLS

### User Isolation

**Every table enforces user isolation via RLS.**

- User A cannot access User B's data
- Enforced at database level (not just frontend)
- Tested with multiple accounts

---

## 📝 Development Guidelines

### Adding New Features

When adding features:

1. **Database**: Add tables with RLS in `supabase-schema.sql`
2. **Service**: Create service in `src/services/`
3. **Hook**: Create React hook in `src/hooks/`
4. **Component**: Use hook in components
5. **Translation**: Add strings to all 3 languages
6. **Test**: Test with multiple users

### Translation

All UI strings MUST be translated:

```tsx
// ❌ Bad
<h1>پروفایل کاربری</h1>

// ✅ Good
<h1>{t('profile.title')}</h1>
```

Add to all language files:
- `fa.ts`: Persian
- `en.ts`: English
- `de.ts`: German

### Theme

Apply theme tokens, never hardcode colors:

```tsx
// ❌ Bad
<div className="bg-slate-900 text-white">

// ✅ Good
<div className="bg-surface text-foreground">
```

---

## 🎯 Feature Status

| Feature | Status | Evidence |
|---------|--------|----------|
| Email Registration | ✅ REAL | Supabase Auth |
| Email Login | ✅ REAL | Supabase Auth |
| Google OAuth | ✅ REAL | Supabase Auth |
| Email Verification | ✅ REAL | Supabase Email |
| Password Reset | ✅ REAL | Supabase Email |
| Session Persistence | ✅ REAL | Supabase Session |
| User Profiles | ✅ REAL | PostgreSQL + RLS |
| Projects CRUD | ✅ REAL | PostgreSQL + RLS |
| Tasks CRUD | ✅ REAL | PostgreSQL + RLS |
| Preferences Persistence | ✅ REAL | PostgreSQL + RLS |
| Theme Engine | ✅ REAL | CSS Tokens + DB |
| 3-Language i18n | ✅ REAL | FA/EN/DE |
| User Isolation | ✅ REAL | RLS Policies |
| Logout | ✅ REAL | Supabase signOut |

---

## 📞 Support

- Documentation: This file
- Database Schema: `src/services/supabase-schema.sql`
- Auth Service: `src/services/authService.ts`
- Supabase Docs: https://supabase.com/docs

---

## ⚠️ IMPORTANT SECURITY NOTES

1. **NEVER commit `.env.local`** to git
2. **NEVER store passwords** in application tables
3. **ALWAYS use RLS** for new tables
4. **ALWAYS test user isolation** with multiple accounts
5. **NEVER trust frontend-only security**
6. **ALWAYS validate on server/database**

---

**This is a production-grade system. No fake authentication. No mock data. Everything is real.**
