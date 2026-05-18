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

-- Enable Row Level Security
alter table public.favorites enable row level security;

-- Users can only see/edit their own favorites
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

-- Anyone logged in can read comments, users manage their own
create policy "Logged-in users can read all comments"
  on public.comments for select
  using (auth.uid() is not null);

create policy "Users can insert own comments"
  on public.comments for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own comments"
  on public.comments for delete
  using (auth.uid() = user_id);
