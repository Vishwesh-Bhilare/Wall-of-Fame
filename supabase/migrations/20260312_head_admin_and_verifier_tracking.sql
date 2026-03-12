-- Add verifier tracking for admin moderation and improve search/sort support.

alter table public.achievements
  add column if not exists verified_by uuid null;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'achievements_verified_by_fkey'
      AND table_schema = 'public'
      AND table_name = 'achievements'
  ) THEN
    ALTER TABLE public.achievements
      ADD CONSTRAINT achievements_verified_by_fkey
      FOREIGN KEY (verified_by)
      REFERENCES public.profiles(id)
      ON DELETE SET NULL;
  END IF;
END $$;

create index if not exists idx_achievements_verified_by on public.achievements(verified_by);
create index if not exists idx_achievements_type on public.achievements(type);
create index if not exists idx_achievements_title on public.achievements(title);

-- Optional: promote a user to head_admin role.
-- update public.profiles set role = 'head_admin' where email = 'your-head-admin@college.edu';
