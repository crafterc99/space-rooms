-- Add due_back_at to equipment for renewal/return tracking
alter table equipment add column if not exists due_back_at timestamptz;

-- Bookings table for room scheduling
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  room_name text not null,
  title text not null,
  booked_by uuid references profiles(id) on delete set null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  notes text,
  created_at timestamptz default now(),
  constraint bookings_time_check check (end_time > start_time)
);

-- Realtime: enable REPLICA IDENTITY FULL
alter table bookings replica identity full;
alter table equipment replica identity full;

-- Add bookings to realtime publication
do $$
begin
  begin
    alter publication supabase_realtime add table bookings;
  exception when duplicate_object then null;
  end;
end $$;
