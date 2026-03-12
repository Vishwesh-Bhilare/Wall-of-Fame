# Supabase Setup Guide (Wall of Fame)

This repo already uses Supabase client calls in UI pages/services, so the backend setup is mostly:

1. Auth users + role profile table.
2. Achievements table with RLS.
3. Storage bucket for certificates.
4. Admin role promotion.

---

## 1) Project-level Supabase dashboard settings

Project: `fikiuimjogxjlqgarbst`

### Auth settings
- **Authentication → Providers → Email**: enable Email provider.
- **Authentication → URL Configuration**:
  - Site URL: your deployed frontend URL.
  - Add redirect URLs for local/dev/prod.
- (Recommended) Enable email confirmation for students.

### API keys / env vars for Next.js
Use these in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://fikiuimjogxjlqgarbst.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-publishable-anon-key>
```

> You shared a publishable key; keep service role keys out of frontend code.

---

## 2) Run SQL migration

In Supabase dashboard:
- Open **SQL Editor**.
- Run `supabase/migrations/20260312_wall_of_fame_setup.sql`.

This script creates:
- `public.profiles`
- `public.achievements`
- `public.users` (compat view)
- RLS policies
- Auth trigger for profile creation
- `certificates` storage bucket + policies

---

## 3) Create accounts and roles

### Student signup/login
- Students sign up via `/student/signup` (already implemented).
- Profile rows auto-create after signup via trigger.

### Admin login
- Create admin account once (via Auth UI or signup).
- Promote role in SQL:

```sql
update public.profiles
set role = 'admin'
where id = '<ADMIN_USER_UUID>';
```

You can get `ADMIN_USER_UUID` from **Authentication → Users**.

---

## 4) End-to-end flow after setup

1. Student signs up (`auth.users` + `profiles`).
2. Student logs in and submits achievement (`public.achievements`, status=`pending`).
3. Student optional file uploads to `certificates` bucket.
4. Admin sees pending records and updates status to `approved`/`rejected`.
5. Landing page reads only `approved` posts and displays wall cards.

---

## 5) Files that likely need changes in code (batch plan)

To make role-based access and data model fully consistent, these files should be updated in batches:

### Batch A — Auth + role guards
- `src/app/admin/login/page.tsx` (currently not a login page; appears to contain reports UI).
- `src/app/student/login/page.tsx`
- `src/app/student/signup/page.tsx`
- `src/middleware/authMiddleware.ts`
- `src/hooks/useAuth.ts` (currently empty)

### Batch B — Data model alignment (`users` vs `profiles`)
- `src/app/admin/dashboard/page.tsx`
- `src/app/profile/page.tsx`
- `src/services/userService.ts`
- `src/types/user.ts`

### Batch C — Achievement CRUD + moderation
- `src/components/achievements/AchievementForm.tsx`
- `src/app/achievements/page.tsx`
- `src/app/achievements/[id]/page.tsx`
- `src/services/achievementService.ts`
- `src/services/adminService.ts`
- `src/types/achievement.ts`

### Batch D — Landing page / public wall formatting
- `src/app/page.tsx`
- `src/components/achievements/AchievementCard.tsx`
- `src/app/admin/ReviewPanel.tsx`

---

## 6) Quick verification queries

Run after setup:

```sql
-- Check tables
select table_name from information_schema.tables
where table_schema='public'
  and table_name in ('profiles', 'achievements');

-- Check RLS
select tablename, rowsecurity
from pg_tables
where schemaname='public'
  and tablename in ('profiles', 'achievements');

-- Check admin role
select id, email, role from public.profiles order by created_at desc limit 20;

-- Check recent achievements
select id, user_id, title, status, created_at
from public.achievements
order by created_at desc
limit 20;
```
