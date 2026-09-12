STOP DECLARING PRODUCTION READY.

Your previous report is internally inconsistent.

You explicitly discovered:
- Syntax errors in Navbar and CloudSyncModal
- Build was not successfully verified
- EN/DE translations are only ~60%
- Runtime testing was not performed
- Real user authentication flows were not tested
- Mobile testing was not performed

Yet you declared:
"COMPLETE"
"90% Production-Ready"
"Database/RLS/User Isolation verified"

That is NOT acceptable.

From this point forward, DO NOT claim PASS, COMPLETE, VERIFIED, or Production-Ready unless you have executable evidence.

IMPORTANT:
Do NOT create another documentation/report-only solution.
Do NOT inflate completion percentages.
Do NOT mark a task complete based only on code inspection.
Do NOT say "it should work".
Do NOT say "this error was already there" unless you prove it using git diff/history or another concrete comparison.

==================================================
PHASE 1 — BUILD MUST ACTUALLY PASS
==================================================

Run the project's REAL production build command.

Example:
npm run build

If it fails:

1. Capture the exact errors.
2. Fix ALL build-blocking errors.
3. Run the build again.
4. Repeat until the actual production build succeeds.

Do NOT proceed to final verification while the build fails.

Also run:
npm run lint

if the project has linting configured.

If TypeScript checking is configured, run the project's real TypeScript validation command.

Final evidence must include:
- Build command
- Result
- Exit code
- Remaining errors, if any

==================================================
PHASE 2 — AUTH MUST BE RUNTIME VERIFIED
==================================================

Use the actual running application.

Test ALL of these:

1. Register with email/password
2. Verify email
3. Login with verified account
4. Login with incorrect password
5. Google OAuth
6. OAuth callback/redirect
7. Forgot password
8. Password reset
9. Login after password reset
10. Logout
11. Refresh while authenticated
12. Close/reopen browser and verify session behavior
13. Guest state
14. Authenticated state

Do not mark these PASS based on source code.

If Google OAuth requires Supabase Dashboard configuration, clearly identify the required configuration and mark it:

CONFIGURATION REQUIRED

rather than pretending it is verified.

If email delivery cannot be tested from this environment, mark:

NOT VERIFIED — requires real email inbox

==================================================
PHASE 3 — SUPABASE DATABASE + RLS
==================================================

Do NOT claim "User Isolation guaranteed" just because RLS policies exist in SQL.

Actually verify the security model.

Test:

USER A:
- creates a project
- creates tasks
- creates pricing items
- creates client data
- creates preferences

USER B:
- must see ZERO of User A's private records

Then attempt direct access/manipulation of User A records using User B's authenticated context.

Test:
SELECT
INSERT
UPDATE
DELETE

for relevant user-owned tables.

Also verify nested ownership such as:

User B → Project A's Task
User B → Project A's Pricing Item
User B → Project A's Invoice
User B → Project A's Client

All must be rejected.

Verify that frontend filtering is NOT being used as the security boundary.

Database RLS must be the actual security boundary.

==================================================
PHASE 4 — REMOVE ALL FAKE DATA
==================================================

Search the entire source tree for:

mock
dummy
demo
sample
seed
fake
placeholder
fallback
localStorage
sessionStorage

Do NOT blindly delete legitimate usage.

Classify every occurrence.

There must be NO fake business/project/task/dashboard/statistics data presented to real users.

New account initial state must be empty.

No:
Ali
علی باقری
example project
example task
fake chart
fake statistics
fake clients
fake invoices
fake pricing

anywhere in production UI, placeholders, initial state, fallback state, or mock services.

==================================================
PHASE 5 — LOCALSTORAGE AUDIT
==================================================

Search the entire application for:

localStorage
sessionStorage

For every occurrence, explain why it exists.

Authentication source of truth MUST NOT be localStorage.

Application server data MUST NOT silently fall back to localStorage.

If localStorage is used only for harmless UI state such as sidebar state, document that.

If any business data uses localStorage, remove it.

==================================================
PHASE 6 — i18n MUST ACTUALLY BE 100%
==================================================

Current report says:

FA = 100%
EN = 60%
DE = 60%

Therefore this task is NOT complete.

Find every user-visible string.

This includes:
- Navbar
- Dashboard
- Projects
- Tasks
- Roadmap
- Modules
- Architecture
- Testing
- Pricing
- Analytics
- Calendar
- Clients
- Services
- Auth
- Login
- Register
- Forgot Password
- Reset Password
- Email Verification
- Google Login
- Settings
- Profile
- About
- Product Guide
- Notifications
- Empty states
- Error states
- Success messages
- Validation messages
- Tooltips
- Dialogs
- Buttons
- Tables
- Pagination
- Mobile navigation

No hardcoded user-visible strings.

Implement complete:
FA
EN
DE

Then test language switching globally.

Verify:
FA → RTL
EN → LTR
DE → LTR

Verify that direction changes globally, not only one component.

==================================================
PHASE 7 — THEME
==================================================

Verify actual global theme behavior:

Light
Dark
System

Verify:

- background
- text
- borders
- cards
- tables
- inputs
- buttons
- modals
- dropdowns
- charts
- navigation
- mobile UI
- empty states
- error states

Default brand:

WHITE + YELLOW + BLACK

Yellow must be an accent, not an overwhelming background.

System theme must react to OS theme changes.

Refresh must preserve preference.

Logout/login must restore the correct authenticated user's preference.

==================================================
PHASE 8 — REAL CRUD + PERSISTENCE
==================================================

For every major entity:

CREATE
READ
UPDATE
DELETE

must actually communicate with Supabase.

Test:

Create → Refresh → Data remains

Update → Refresh → Update remains

Delete → Refresh → Data remains deleted

Logout → Login → Correct user's data restored

At minimum test:

Projects
Tasks
Roadmap
Clients
Pricing
Invoices
Preferences
Notifications
Services

Do not count UI buttons as implemented unless the underlying operation is real.

==================================================
PHASE 9 — DASHBOARD DATA
==================================================

Dashboard statistics must come from real database data.

Create controlled test data.

Example:

10 tasks
5 completed
3 in progress
2 pending

Dashboard must calculate the correct values.

Delete one task.

Dashboard must update correctly.

No hardcoded numbers.

No random numbers.

No fake chart datasets.

==================================================
PHASE 10 — MOBILE
==================================================

Actually test the application at mobile viewport sizes.

At minimum:

375x812
390x844
412x915

Verify:

- navigation
- auth
- forms
- tables
- dialogs
- dashboard
- charts
- pricing
- project pages
- scrolling
- horizontal overflow
- touch targets
- text clipping
- RTL

No feature should disappear merely because viewport is mobile.

==================================================
PHASE 11 — ERROR / LOADING / EMPTY STATES
==================================================

Every async operation must handle:

Loading
Success
Error
Empty

Test failure scenarios such as:
- network failure
- invalid authentication
- database failure
- unauthorized operation
- invalid form input

No silent failures.

No fake success toast when operation failed.

==================================================
PHASE 12 — SECURITY AUDIT
==================================================

Verify:

- No passwords stored in localStorage
- No service-role key in frontend
- No private API secret in frontend
- No credentials in source code
- RLS enabled on user-owned tables
- Correct ownership checks
- Input validation
- Safe error messages
- No sensitive data leakage in client logs
- No auth bypass
- No IDOR-style access between users

==================================================
FINAL VERIFICATION RULE
==================================================

Use ONLY these statuses:

PASS
FAIL
NOT VERIFIED
NOT IMPLEMENTED
CONFIGURATION REQUIRED

Do NOT use:

"90% Production Ready"

unless every production-blocking requirement is actually PASS.

At the end provide a compact table:

| Area | Status | Evidence |
|------|--------|----------|
| Production Build | | |
| TypeScript | | |
| Lint | | |
| Email Registration | | |
| Email Login | | |
| Email Verification | | |
| Google OAuth | | |
| Password Reset | | |
| Session Persistence | | |
| Supabase DB | | |
| RLS | | |
| User Isolation | | |
| CRUD | | |
| Fake Data Removal | | |
| localStorage Audit | | |
| FA i18n | | |
| EN i18n | | |
| DE i18n | | |
| RTL/LTR | | |
| Light Theme | | |
| Dark Theme | | |
| System Theme | | |
| Preferences Persistence | | |
| Dashboard Real Data | | |
| Mobile | | |
| Error Handling | | |
| Security | | |

FINAL RULE:

A code inspection is NOT runtime verification.

A generated report is NOT testing.

A successful TypeScript check is NOT proof that authentication works.

A successful build is NOT proof that RLS works.

RLS policies existing in SQL is NOT proof of user isolation.

Only executable evidence may produce PASS.

Do the work first.
Then report the evidence.