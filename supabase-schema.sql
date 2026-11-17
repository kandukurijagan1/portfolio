-- ==============================================================================
-- SUPABASE POSTGRESQL SCHEMA FOR PORTFOLIO REAL-TIME MESSAGING
-- Target Project: Kandukuri Jagan Personal Portfolio
-- ==============================================================================
-- How to run:
-- 1. Go to your Supabase Project Dashboard (https://supabase.com/dashboard)
-- 2. Open "SQL Editor" from the left menu
-- 3. Click "New Query", paste this entire SQL script, and click "Run"
-- ==============================================================================

-- 1. Create the portfolio_messages table
create table if not exists public.portfolio_messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  avatar_url text default '',
  is_google_verified boolean default false,
  status text default 'delivered',
  reply_text text,
  replied_at timestamptz
);

-- 2. Create performance indexes for high-speed email querying
create index if not exists idx_portfolio_messages_email on public.portfolio_messages (email);
create index if not exists idx_portfolio_messages_created_at on public.portfolio_messages (created_at desc);

-- 3. Enable Row-Level Security (RLS)
alter table public.portfolio_messages enable row level security;

-- 4. Policy: Anyone can insert their message into the table
drop policy if exists "Enable public insert for visitors" on public.portfolio_messages;
create policy "Enable public insert for visitors"
  on public.portfolio_messages
  for insert
  with check (true);

-- 5. Policy: Public read for personal history & admin inbox
drop policy if exists "Enable public read access" on public.portfolio_messages;
create policy "Enable public read access"
  on public.portfolio_messages
  for select
  using (true);

-- 6. Policy: Enable delete for portfolio_messages (Admin curation)
drop policy if exists "Enable delete for portfolio_messages" on public.portfolio_messages;
create policy "Enable delete for portfolio_messages"
  on public.portfolio_messages
  for delete
  using (true);

-- 7. Enable Realtime Replication for instant push notifications in Admin Dashboard
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' 
    and schemaname = 'public' 
    and tablename = 'portfolio_messages'
  ) then
    alter publication supabase_realtime add table public.portfolio_messages;
  end if;
end $$;

-- ==============================================================================
-- Schema setup complete!
-- Copy your Project URL & Anon Public Key from:
-- Project Settings -> API -> Project URL & Project API Keys (anon public)
-- Paste into js/config.js under `supabase`!
-- ==============================================================================
