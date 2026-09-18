-- JOSAM AUTO — Phase 2 schema: sales system (leads, team, activity)
-- Run in Supabase Dashboard > SQL Editor AFTER schema.sql

-- ── 1. Team profiles (one per auth user) ────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  phone text default '',
  role text default 'salesperson' check (role in ('admin', 'salesperson')),
  active boolean default true,
  created_at timestamptz default now()
);

-- Auto-create a profile on signup (name defaults to email prefix)
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── 2. Leads ────────────────────────────────────────────
-- kind: buying | test-drive | booking | financing | seller | import | general
-- status: new | contacted | scheduled | won | lost
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  kind text default 'general'
    check (kind in ('buying', 'test-drive', 'booking', 'financing', 'seller', 'import', 'general')),
  name text not null,
  phone text not null,
  email text default '',
  vehicle_slug text default '',
  vehicle_label text default '',
  message text default '',
  preferred_date date,
  preferred_time text default '',
  status text default 'new'
    check (status in ('new', 'contacted', 'scheduled', 'won', 'lost')),
  assigned_to uuid references profiles(id) on delete set null,
  source text default '',
  is_read boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_leads_status on leads(status);
create index if not exists idx_leads_kind on leads(kind);
create index if not exists idx_leads_assigned on leads(assigned_to);
create index if not exists idx_leads_created on leads(created_at desc);
create index if not exists idx_leads_unread on leads(is_read) where is_read = false;

drop trigger if exists leads_touch on leads;
create trigger leads_touch before update on leads
for each row execute function touch_updated_at();

-- ── 3. Lead activity timeline ───────────────────────────
create table if not exists lead_activity (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  actor_id uuid references profiles(id) on delete set null,
  action text not null
    check (action in ('created', 'status_change', 'assignment', 'note')),
  old_value text default '',
  new_value text default '',
  note text default '',
  created_at timestamptz default now()
);

create index if not exists idx_activity_lead on lead_activity(lead_id, created_at desc);

-- ── 4. RLS ──────────────────────────────────────────────
alter table profiles enable row level security;
alter table leads enable row level security;
alter table lead_activity enable row level security;

-- Team: staff read/write (same trust model as inventory)
drop policy if exists "staff read profiles" on profiles;
create policy "staff read profiles" on profiles for select using (auth.role() = 'authenticated');

drop policy if exists "staff write profiles" on profiles;
create policy "staff write profiles" on profiles
for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Leads: anyone can submit; only staff can read/update/delete
drop policy if exists "public submit lead" on leads;
create policy "public submit lead" on leads
for insert with check (true);

drop policy if exists "staff manage leads" on leads;
create policy "staff manage leads" on leads
for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Activity: public may only log the 'created' row; staff manage the rest
drop policy if exists "public log creation" on lead_activity;
create policy "public log creation" on lead_activity
for insert with check (action = 'created');

drop policy if exists "staff manage activity" on lead_activity;
create policy "staff manage activity" on lead_activity
for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
