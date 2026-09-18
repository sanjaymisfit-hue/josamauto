-- JOSAM AUTO — Phase 1 schema (Enhanced)
-- Run in Supabase Dashboard > SQL Editor

-- ── 1. Brands ───────────────────────────────────────────
create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  logo_url text,
  created_at timestamptz default now()
);

-- ── 2. Vehicles ─────────────────────────────────────────
create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  make text not null,
  model text not null,
  trim text default '',
  year int not null check (year >= 1990 and year <= extract(year from now()) + 1),
  price_kes bigint not null check (price_kes >= 0),
  mileage_km int default 0 check (mileage_km >= 0),
  fuel text default 'Petrol' check (fuel in ('Petrol', 'Diesel', 'Hybrid', 'Electric', 'Plug-in Hybrid')),
  transmission text default 'Automatic' check (transmission in ('Automatic', 'Manual', 'CVT')),
  drive text default 'AWD' check (drive in ('AWD', '4WD', 'FWD', 'RWD')),
  engine_cc int default 0,
  engine_summary text default '',
  power_hp int,
  torque_nm int,
  accel_sec numeric,
  body_type text default 'SUV',
  seats int default 5,
  exterior text default '',
  interior text default '',
  condition text default 'Foreign Used' check (condition in ('Brand New', 'Foreign Used', 'Locally Used')),
  status text default 'available' check (status in ('available', 'reserved', 'sold', 'in-transit')),
  location text default 'Nairobi Showroom',
  origin text default 'Japan',
  featured boolean default false,
  is_new_arrival boolean default false,
  images text[] default '{}',
  description text default '',
  features text[] default '{}',
  brand_id uuid references brands(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for fast filtering on the website
create index if not exists idx_vehicles_brand_id on vehicles(brand_id);
create index if not exists idx_vehicles_status on vehicles(status);
create index if not exists idx_vehicles_featured on vehicles(featured);
create index if not exists idx_vehicles_created_at on vehicles(created_at desc);

-- ── 3. Touch updated_at Trigger ─────────────────────────
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new; end $$;

drop trigger if exists vehicles_touch on vehicles;
create trigger vehicles_touch before update on vehicles
for each row execute function touch_updated_at();

-- ── 4. Row Level Security (RLS) ─────────────────────────
alter table brands enable row level security;
alter table vehicles enable row level security;

-- Public can view
drop policy if exists "public read brands" on brands;
create policy "public read brands" on brands for select using (true);

drop policy if exists "public read vehicles" on vehicles;
create policy "public read vehicles" on vehicles for select using (true);

-- Authenticated staff can insert/update/delete
drop policy if exists "admin write brands" on brands;
create policy "admin write brands" on brands
for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "admin write vehicles" on vehicles;
create policy "admin write vehicles" on vehicles
for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ── 5. Storage: Photos Bucket ───────────────────────────
insert into storage.buckets (id, name, public)
values ('vehicle-photos', 'vehicle-photos', true)
on conflict (id) do nothing;

drop policy if exists "public read photos" on storage.objects;
create policy "public read photos" on storage.objects
for select using (bucket_id = 'vehicle-photos');

drop policy if exists "admin upload photos" on storage.objects;
create policy "admin upload photos" on storage.objects
for all using (bucket_id = 'vehicle-photos' and auth.role() = 'authenticated')
with check (bucket_id = 'vehicle-photos' and auth.role() = 'authenticated');

-- ── 6. Seed Initial Brands ──────────────────────────────
insert into brands (name) values
('Toyota'), ('Porsche'), ('Audi'), ('Land Rover'),
('Mercedes-Benz'), ('Lexus'), ('BMW')
on conflict (name) do nothing;
