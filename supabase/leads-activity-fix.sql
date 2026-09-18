-- JOSAM AUTO — Phase 2 fix: create lead_activity (idempotent)
-- Run in Supabase Dashboard > SQL Editor

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

alter table lead_activity enable row level security;

drop policy if exists "public log creation" on lead_activity;
create policy "public log creation" on lead_activity
for insert with check (action = 'created');

drop policy if exists "staff manage activity" on lead_activity;
create policy "staff manage activity" on lead_activity
for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
