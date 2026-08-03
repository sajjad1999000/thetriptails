-- ============================================================
-- note_of_month — manual-override "Note of the Month" pick for
-- Locals' Notes, mirroring story_of_week's structure (selection_type
-- + selected_by) but keyed by month/year instead of week_start/end,
-- since a note doesn't rotate weekly.
-- ============================================================

create table if not exists public.note_of_month (
  id uuid not null default gen_random_uuid(),
  story_id uuid not null references public.stories (id) on delete cascade,
  month smallint not null check (month between 1 and 12),
  year smallint not null check (year >= 2024),
  selection_type text not null default 'manual' check (selection_type in ('auto', 'manual')),
  selected_by uuid references public.profiles (id) on delete set null,
  created_at timestamp with time zone not null default now(),
  constraint note_of_month_pkey primary key (id),
  constraint note_of_month_month_year_unique unique (month, year)
) tablespace pg_default;

create index if not exists note_of_month_story_id_idx on public.note_of_month (story_id);

alter table public.note_of_month enable row level security;

-- Public read — powers the Locals' Notes page's featured pick
create policy "note_of_month_select_public"
  on public.note_of_month for select
  using (true);

-- No client insert/update policy — writes only via the service-role
-- key from the admin action, same pattern as story_of_week.