-- Run this in your Supabase SQL editor to set up the database schema

-- Favorites table
create table if not exists public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  attraction_id text not null,
  scheduled_date date,
  created_at timestamptz default now() not null,
  unique(user_id, attraction_id)
);

alter table public.favorites enable row level security;

create policy "Users can manage own favorites"
  on public.favorites
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Comments table
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  attraction_id text not null,
  content text not null,
  created_at timestamptz default now() not null
);

alter table public.comments enable row level security;

create policy "Logged-in users can read all comments"
  on public.comments for select
  using (auth.uid() is not null);

create policy "Users can insert own comments"
  on public.comments for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own comments"
  on public.comments for delete
  using (auth.uid() = user_id);

-- ── Profiles (nickname) ───────────────────────────────────────────────────────

create table if not exists public.profiles (
  user_id uuid references auth.users(id) on delete cascade primary key,
  nickname text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Anyone can read profiles"
  on public.profiles for select using (true);

create policy "Users can manage own profile"
  on public.profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Team members (expense access gate) ───────────────────────────────────────

create table if not exists public.team_members (
  user_id uuid references auth.users(id) on delete cascade primary key,
  nickname text,
  joined_at timestamptz default now() not null
);

alter table public.team_members enable row level security;

create policy "Anyone can read team members"
  on public.team_members for select using (true);

create policy "Users can join team"
  on public.team_members for insert
  with check (auth.uid() = user_id);

-- ── Expenses ──────────────────────────────────────────────────────────────────

create table if not exists public.expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  nickname text not null,
  amount numeric not null,
  currency text not null default 'CNY',
  purpose text not null,
  day integer,
  image_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.expenses enable row level security;

create policy "Anyone can read expenses"
  on public.expenses for select using (true);

create policy "Team members can insert expenses"
  on public.expenses for insert
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.team_members where user_id = auth.uid())
  );

create policy "Users can update own expenses"
  on public.expenses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);

-- ── Booking status ────────────────────────────────────────────────────────────

create table if not exists public.booking_status (
  item_id text primary key,
  status text not null default 'pending',
  updated_by uuid references auth.users(id),
  updated_by_nickname text,
  updated_at timestamptz default now() not null
);

alter table public.booking_status enable row level security;

create policy "Anyone can read booking status"
  on public.booking_status for select using (true);

create policy "Logged-in users can upsert booking status"
  on public.booking_status for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);
