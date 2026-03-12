-- Add contextual fields for better achievement metadata on Wall of Fame cards.

alter table public.achievements
  add column if not exists academic_year text,
  add column if not exists accomplishment_date date,
  add column if not exists submitter_email text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'achievements_academic_year_check'
      AND conrelid = 'public.achievements'::regclass
  ) THEN
    ALTER TABLE public.achievements
      ADD CONSTRAINT achievements_academic_year_check
      CHECK (academic_year IS NULL OR academic_year IN ('FY', 'SY', 'TY', 'BE'));
  END IF;
END $$;

-- Keep submitter_email synced from profile when available.
create or replace function public.set_achievement_submitter_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.submitter_email is null or btrim(new.submitter_email) = '' then
    select p.email into new.submitter_email
    from public.profiles p
    where p.id = new.user_id;
  end if;

  return new;
end;
$$;

DROP TRIGGER IF EXISTS trg_achievements_set_submitter_email ON public.achievements;
create trigger trg_achievements_set_submitter_email
before insert or update on public.achievements
for each row
execute function public.set_achievement_submitter_email();

-- Backfill existing rows.
update public.achievements a
set submitter_email = p.email
from public.profiles p
where a.user_id = p.id
  and (a.submitter_email is null or btrim(a.submitter_email) = '');
