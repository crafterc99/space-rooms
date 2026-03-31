-- Profiles
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  avatar_color text not null default '#6366f1',
  created_at timestamptz default now()
);

-- Equipment
create table if not exists equipment (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'available' check (status in ('available', 'in_use', 'maintenance')),
  checked_out_by uuid references profiles(id),
  checked_out_at timestamptz,
  created_at timestamptz default now()
);

-- Equipment logs
create table if not exists equipment_logs (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid references equipment(id) on delete cascade,
  user_id uuid references profiles(id),
  action text not null check (action in ('checkout', 'return')),
  logged_at timestamptz default now()
);

-- Presence
create table if not exists presence (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade unique,
  status text not null default 'out' check (status in ('in', 'out')),
  checked_in_at timestamptz,
  updated_at timestamptz default now()
);

-- Realtime: enable REPLICA IDENTITY FULL so old record values are sent
alter table equipment replica identity full;
alter table presence replica identity full;

-- Add tables to realtime publication
-- (run after enabling realtime in Supabase dashboard, or use the API)
-- These lines are safe to run; if the publication already exists they just add the tables.
do $$
begin
  if not exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    create publication supabase_realtime for table equipment, presence;
  else
    -- add tables if not already in publication
    begin
      alter publication supabase_realtime add table equipment;
    exception when duplicate_object then null;
    end;
    begin
      alter publication supabase_realtime add table presence;
    exception when duplicate_object then null;
    end;
  end if;
end $$;
