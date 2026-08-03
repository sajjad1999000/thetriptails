-- ============================================================
-- The Trip Tales — Step Z Migration
-- story_of_week rotation support + monthly_winners + yearly_votes
-- + yearly_winners (addition beyond the Phase 2 schema doc — see
-- note at bottom of this file)
--
-- Run this in Supabase SQL Editor. story_of_week already exists
-- (id, story_id, week_start, week_end) — this migration ALTERs it
-- rather than recreating it.
-- ============================================================

-- ------------------------------------------------------------
-- 1. story_of_week — add rotation metadata
--
-- selection_type distinguishes an auto-picked week (the rollup
-- job ran and chose the top-engagement story) from a manual
-- admin override. The rotation job checks this before it ever
-- inserts — a manual row for a given week is never overwritten
-- by the auto job.
-- ------------------------------------------------------------
alter table public.story_of_week
  add column if not exists selection_type text not null default 'auto'
    check (selection_type in ('auto', 'manual')),
  add column if not exists selected_by uuid references public.profiles (id) on delete set null,
  add column if not exists created_at timestamp with time zone not null default now();

-- One row per week — the rotation job upserts on this
create unique index if not exists story_of_week_week_start_idx
  on public.story_of_week (week_start);

alter table public.story_of_week enable row level security;

-- Public read — this powers the homepage hero
create policy "story_of_week_select_public"
  on public.story_of_week for select
  using (true);

-- No client insert/update policy on purpose — writes only ever
-- happen via the service-role key from the rotation job / admin
-- action, never from a browser session.


-- ------------------------------------------------------------
-- 2. monthly_winners
-- ------------------------------------------------------------
create table if not exists public.monthly_winners (
  id uuid not null default gen_random_uuid(),
  story_id uuid not null references public.stories (id) on delete cascade,
  month smallint not null check (month between 1 and 12),
  year smallint not null check (year >= 2024),
  created_at timestamp with time zone not null default now(),
  constraint monthly_winners_pkey primary key (id),
  constraint monthly_winners_month_year_unique unique (month, year)
) tablespace pg_default;

create index if not exists monthly_winners_story_id_idx on public.monthly_winners (story_id);

alter table public.monthly_winners enable row level security;

create policy "monthly_winners_select_public"
  on public.monthly_winners for select
  using (true);

-- No client insert policy — service role (monthly-rollup.js) only.


-- ------------------------------------------------------------
-- 3. yearly_votes — one reader vote per year, changeable until
-- the year closes (app enforces the cutoff, not this table)
-- ------------------------------------------------------------
create table if not exists public.yearly_votes (
  id uuid not null default gen_random_uuid(),
  story_id uuid not null references public.stories (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  year smallint not null check (year >= 2024),
  created_at timestamp with time zone not null default now(),
  constraint yearly_votes_pkey primary key (id),
  constraint yearly_votes_one_per_user_per_year unique (user_id, year)
) tablespace pg_default;

create index if not exists yearly_votes_story_id_idx on public.yearly_votes (story_id);
create index if not exists yearly_votes_year_idx on public.yearly_votes (year);

alter table public.yearly_votes enable row level security;

-- Vote counts are public (needed to show a live leaderboard)
create policy "yearly_votes_select_public"
  on public.yearly_votes for select
  using (true);

-- A logged-in reader can only cast a vote as themselves
create policy "yearly_votes_insert_own"
  on public.yearly_votes for insert
  to authenticated
  with check (user_id = auth.uid());

-- Changing your vote = update your own row (app does an upsert
-- on conflict (user_id, year))
create policy "yearly_votes_update_own"
  on public.yearly_votes for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());


-- ------------------------------------------------------------
-- 4. yearly_winners
--
-- NOTE — addition beyond the Phase 2 schema doc: the doc lists
-- yearly_votes (the raw ballots) but no table to store the
-- settled result. Mirrors monthly_winners so the homepage/story
-- page can display "Story of the Year" without re-tallying every
-- votes on every page load. Flag if you'd rather compute this
-- live instead of storing it.
-- ------------------------------------------------------------
create table if not exists public.yearly_winners (
  id uuid not null default gen_random_uuid(),
  story_id uuid not null references public.stories (id) on delete cascade,
  year smallint not null check (year >= 2024),
  vote_count integer not null default 0,
  created_at timestamp with time zone not null default now(),
  constraint yearly_winners_pkey primary key (id),
  constraint yearly_winners_year_unique unique (year)
) tablespace pg_default;

alter table public.yearly_winners enable row level security;

create policy "yearly_winners_select_public"
  on public.yearly_winners for select
  using (true);

-- No client insert policy — service role (yearly-vote-tally.js) only.


-- ------------------------------------------------------------
-- 5. Engagement score helper — used by the auto weekly picker
--
-- Score = comments (visible only) + likes on those comments,
-- restricted to a story published within the given date window.
-- Kept as a SQL function so both the Node job and any future
-- admin dashboard can call the same logic via RPC.
-- ------------------------------------------------------------
create or replace function public.story_engagement_score(
  p_story_id uuid,
  p_window_start date,
  p_window_end date
)
returns integer
language sql
stable
as $$
  select
    coalesce(count(distinct c.id), 0)::int
    + coalesce(count(distinct cl.id), 0)::int
  from public.comments c
  left join public.comment_likes cl on cl.comment_id = c.id
    and cl.created_at::date between p_window_start and p_window_end
  where c.story_id = p_story_id
    and c.status = 'visible'
    and c.created_at::date between p_window_start and p_window_end
$$;

-- ============================================================
-- End of Step Z migration
-- ============================================================
