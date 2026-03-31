-- Seed 5 users
insert into profiles (id, name, avatar_color) values
  ('a1000000-0000-0000-0000-000000000001', 'Alex',   '#6366f1'),
  ('a1000000-0000-0000-0000-000000000002', 'Blair',  '#ec4899'),
  ('a1000000-0000-0000-0000-000000000003', 'Casey',  '#f59e0b'),
  ('a1000000-0000-0000-0000-000000000004', 'Dana',   '#22c55e'),
  ('a1000000-0000-0000-0000-000000000005', 'Ellis',  '#14b8a6')
on conflict (id) do nothing;

-- Seed presence rows (all 'out' initially)
insert into presence (user_id, status) values
  ('a1000000-0000-0000-0000-000000000001', 'out'),
  ('a1000000-0000-0000-0000-000000000002', 'out'),
  ('a1000000-0000-0000-0000-000000000003', 'out'),
  ('a1000000-0000-0000-0000-000000000004', 'out'),
  ('a1000000-0000-0000-0000-000000000005', 'out')
on conflict (user_id) do nothing;

-- Seed 8 equipment items
insert into equipment (id, name, status) values
  ('b1000000-0000-0000-0000-000000000001', 'Projector A',     'available'),
  ('b1000000-0000-0000-0000-000000000002', 'Projector B',     'available'),
  ('b1000000-0000-0000-0000-000000000003', 'Whiteboard 1',    'available'),
  ('b1000000-0000-0000-0000-000000000004', 'Whiteboard 2',    'available'),
  ('b1000000-0000-0000-0000-000000000005', 'Laptop Cart',     'available'),
  ('b1000000-0000-0000-0000-000000000006', 'Camera Rig',      'available'),
  ('b1000000-0000-0000-0000-000000000007', 'PA System',       'available'),
  ('b1000000-0000-0000-0000-000000000008', 'Video Conference','available')
on conflict (id) do nothing;
