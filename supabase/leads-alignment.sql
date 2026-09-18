-- JOSAM AUTO — Phase 2 alignment: site lead kinds + auto activity log
-- Run in Supabase Dashboard > SQL Editor (blank tab, only this file)

-- 1. Extend the allowed lead types with the website's kinds.
--    Existing rows are untouched (they don't use the new values).
alter table leads drop constraint leads_type_check;
alter table leads add constraint leads_type_check
check (type in ('booking', 'financing', 'seller', 'test_drive', 'general', 'buying', 'import'));

-- 2. Auto-log a 'created' timeline row on every new lead,
--    so the website doesn't need a second write (visitors can't read back).
create or replace function log_lead_created()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.lead_activity (lead_id, action, note)
  values (new.id, 'created', 'Submitted via ' || coalesce(new.source_url, 'website'));
  return new;
end $$;

drop trigger if exists leads_log_created on leads;
create trigger leads_log_created after insert on leads
for each row execute function log_lead_created();
