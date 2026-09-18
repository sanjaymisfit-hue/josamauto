-- JOSAM AUTO — fix vehicle saves ("Save failed" on status change)
-- Root cause: the live vehicles table was created before created_by /
-- updated_by existed, and its fuel/transmission checks predate the
-- Plug-in Hybrid + CVT options. Run in Supabase Dashboard > SQL Editor
-- (blank tab, only this file).

alter table vehicles
  add column if not exists created_by uuid references auth.users(id) on delete set null;
alter table vehicles
  add column if not exists updated_by uuid references auth.users(id) on delete set null;

alter table vehicles drop constraint if exists vehicles_fuel_check;
alter table vehicles add constraint vehicles_fuel_check
  check (fuel in ('Petrol', 'Diesel', 'Hybrid', 'Electric', 'Plug-in Hybrid'));

alter table vehicles drop constraint if exists vehicles_transmission_check;
alter table vehicles add constraint vehicles_transmission_check
  check (transmission in ('Automatic', 'Manual', 'CVT'));
