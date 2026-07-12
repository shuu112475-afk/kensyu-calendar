-- 研修カレンダー MVP 初期スキーマ
-- requirements.md 10章（データ要件）に対応

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  occupation text,
  specialty text,
  region text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create table if not exists public.trainings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  overview text,
  event_date date not null,
  start_time time,
  end_time time,
  format text check (format in ('online', 'onsite')),
  venue text,
  prefecture text,
  organizer text,
  target_occupation text,
  field text,
  fee integer,
  capacity integer,
  credit_info text,
  apply_url text,
  detail_url text,
  application_deadline date,
  application_status text not null default 'not_applied'
    check (application_status in ('not_applied', 'applied', 'not_needed')),
  is_favorite boolean not null default false,
  participation_status text not null default 'none'
    check (participation_status in ('none', 'planned', 'attended', 'absent')),
  key_points text,
  learnings text,
  work_application text,
  resource_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.trainings enable row level security;

create policy "trainings_select_own" on public.trainings
  for select using (auth.uid() = user_id);

create policy "trainings_insert_own" on public.trainings
  for insert with check (auth.uid() = user_id);

create policy "trainings_update_own" on public.trainings
  for update using (auth.uid() = user_id);

create policy "trainings_delete_own" on public.trainings
  for delete using (auth.uid() = user_id);

create index if not exists trainings_user_id_event_date_idx
  on public.trainings (user_id, event_date);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trainings_set_updated_at
  before update on public.trainings
  for each row
  execute function public.set_updated_at();
