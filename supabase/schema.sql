-- Gem Pursuit Supabase schema
-- Run this in the Supabase SQL editor for a fresh project.
-- Idempotent: safe to re-run.

create extension if not exists "pgcrypto";

create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  source text default 'website',
  unsubscribe_token uuid not null default gen_random_uuid() unique,
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

-- For older databases that already have the table without the token column.
alter table subscribers
  add column if not exists unsubscribe_token uuid not null default gen_random_uuid();

create unique index if not exists subscribers_unsubscribe_token_idx
  on subscribers (unsubscribe_token);

create index if not exists subscribers_created_at_idx
  on subscribers (created_at desc);

create index if not exists subscribers_active_idx
  on subscribers (email)
  where unsubscribed_at is null;

create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists contact_submissions_created_at_idx
  on contact_submissions (created_at desc);

create table if not exists broadcast_log (
  id uuid primary key default gen_random_uuid(),
  video_id text not null unique,
  title text not null,
  status text not null,
  recipient_count integer not null default 0,
  created_at timestamptz not null default now()
);

alter table broadcast_log
  add column if not exists recipient_count integer not null default 0;

create table if not exists sponsorship_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  email text not null,
  phone text,
  partnership_type text,
  budget text,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists sponsorship_enquiries_created_at_idx
  on sponsorship_enquiries (created_at desc);

-- Row Level Security: locked down. The server uses the service role key
-- which bypasses RLS, so policies below only matter if you ever expose
-- these tables to the anon key.
alter table subscribers enable row level security;
alter table contact_submissions enable row level security;
alter table broadcast_log enable row level security;
alter table sponsorship_enquiries enable row level security;
