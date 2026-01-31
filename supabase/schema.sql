
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Waitlist Table
create table if not exists waitlist (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Campaigns Table
create table if not exists campaigns (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  title text not null,
  description text,
  status text default 'draft', -- draft, active, archived
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Events Table
create table if not exists events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  title text not null,
  date text not null, -- Storing as text for simplicity, or timestamp
  location text,
  registrations_count int default 0,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Event Registrations Table
create table if not exists event_registrations (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id),
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table waitlist enable row level security;
alter table campaigns enable row level security;
alter table events enable row level security;
alter table event_registrations enable row level security;

-- Policies
create policy "Make waitlist insertable by anyone" on waitlist for insert with check (true);

create policy "Users can view own campaigns" on campaigns for select using (auth.uid() = user_id);
create policy "Users can insert own campaigns" on campaigns for insert with check (auth.uid() = user_id);

create policy "Users can view own events" on events for select using (auth.uid() = user_id);
create policy "Users can insert own events" on events for insert with check (auth.uid() = user_id);

create policy "Users can view registrations for own events" on event_registrations for select using (
  exists (select 1 from events where events.id = event_registrations.event_id and events.user_id = auth.uid())
);
