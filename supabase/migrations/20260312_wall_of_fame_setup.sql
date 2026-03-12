-- Wall of Fame - Supabase initial setup
-- Run this in Supabase SQL editor as one script.

-- 0) Required extension
create extension if not exists pgcrypto;

-- 1) Custom enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('student', 'admin', 'head_admin');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'achievement_status') THEN
    CREATE TYPE public.achievement_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;
END $$;

-- 2) Profiles table (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  name text,
  prn text,
  department text,
  year int,
  role public.user_role not null default 'student',
  github_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3) Achievements table
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  type text not null,
  description text,

  status public.achievement_status not null default 'pending',

  event_name text,
  rank text,
  team_size int,

  doi text,
  journal_name text,
  indexing text,

  patent_number text,
  copyright_number text,

  github text,
  youtube text,
  certificate text,

  submitted_at timestamptz,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4) Backward-compatible users view for current code (`from("users")`)
create or replace view public.users as
select
  id,
  name,
  email,
  prn,
  department,
  year,
  role,
  github_url,
  created_at,
  updated_at
from public.profiles;

-- 5) Utility function: auto-update updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

DROP TRIGGER IF EXISTS trg_achievements_updated_at ON public.achievements;
create trigger trg_achievements_updated_at
before update on public.achievements
for each row
execute function public.set_updated_at();

-- 6) Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'student')
  on conflict (id) do update
    set email = excluded.email;

  return new;
end;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- 7) Helper function for policies
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'head_admin')
  );
$$;

-- 8) Enable RLS
alter table public.profiles enable row level security;
alter table public.achievements enable row level security;

-- 9) Profiles policies
DROP POLICY IF EXISTS "users can read own profile" ON public.profiles;
create policy "users can read own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());

DROP POLICY IF EXISTS "users can update own profile" ON public.profiles;
create policy "users can update own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

DROP POLICY IF EXISTS "admins can read all profiles" ON public.profiles;
create policy "admins can read all profiles"
on public.profiles
for select
to authenticated
using (public.is_admin());

-- 10) Achievements policies
DROP POLICY IF EXISTS "students can create own achievements" ON public.achievements;
create policy "students can create own achievements"
on public.achievements
for insert
to authenticated
with check (user_id = auth.uid());

DROP POLICY IF EXISTS "students can read own achievements" ON public.achievements;
create policy "students can read own achievements"
on public.achievements
for select
to authenticated
using (user_id = auth.uid());

DROP POLICY IF EXISTS "students can update pending own achievements" ON public.achievements;
create policy "students can update pending own achievements"
on public.achievements
for update
to authenticated
using (user_id = auth.uid() and status = 'pending')
with check (user_id = auth.uid() and status = 'pending');

DROP POLICY IF EXISTS "admins can read all achievements" ON public.achievements;
create policy "admins can read all achievements"
on public.achievements
for select
to authenticated
using (public.is_admin());

DROP POLICY IF EXISTS "admins can moderate achievements" ON public.achievements;
create policy "admins can moderate achievements"
on public.achievements
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

DROP POLICY IF EXISTS "public can view approved achievements" ON public.achievements;
create policy "public can view approved achievements"
on public.achievements
for select
to anon
using (status = 'approved');

-- 11) Helpful indexes
create index if not exists idx_achievements_user_id on public.achievements(user_id);
create index if not exists idx_achievements_status on public.achievements(status);
create index if not exists idx_achievements_created_at on public.achievements(created_at desc);
create index if not exists idx_profiles_role on public.profiles(role);

-- 12) Storage bucket for certificates
insert into storage.buckets (id, name, public)
values ('certificates', 'certificates', true)
on conflict (id) do nothing;

-- 13) Storage policies
DROP POLICY IF EXISTS "users can upload own certificates" ON storage.objects;
create policy "users can upload own certificates"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'certificates'
  and owner = auth.uid()
);

DROP POLICY IF EXISTS "users can read certificates" ON storage.objects;
create policy "users can read certificates"
on storage.objects
for select
to authenticated, anon
using (bucket_id = 'certificates');

DROP POLICY IF EXISTS "users can delete own certificates" ON storage.objects;
create policy "users can delete own certificates"
on storage.objects
for delete
to authenticated
using (bucket_id = 'certificates' and owner = auth.uid());

-- 14) Seed one admin user role after creating that user in Auth UI.
-- Replace <ADMIN_USER_UUID> with auth.users.id of your admin account.
-- update public.profiles
-- set role = 'admin'
-- where id = '<ADMIN_USER_UUID>';
