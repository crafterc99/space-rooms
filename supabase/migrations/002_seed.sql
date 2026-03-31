-- Seed 5 users
INSERT INTO profiles (id, name, avatar_color) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Alice', '#ef4444'),
  ('b2222222-2222-2222-2222-222222222222', 'Bob', '#3b82f6'),
  ('c3333333-3333-3333-3333-333333333333', 'Charlie', '#22c55e'),
  ('d4444444-4444-4444-4444-444444444444', 'Diana', '#f59e0b'),
  ('e5555555-5555-5555-5555-555555555555', 'Eve', '#a855f7');

-- Seed 8 equipment items
INSERT INTO equipment (name, overlay_key) VALUES
  ('Laptop A', 'laptop_a'),
  ('Laptop B', 'laptop_b'),
  ('Projector', 'projector'),
  ('Whiteboard Markers', 'markers'),
  ('Camera', 'camera'),
  ('Microphone', 'microphone'),
  ('Monitor', 'monitor'),
  ('Keyboard Set', 'keyboard');

-- Seed presence for all users (default 'out')
INSERT INTO presence (user_id) VALUES
  ('a1111111-1111-1111-1111-111111111111'),
  ('b2222222-2222-2222-2222-222222222222'),
  ('c3333333-3333-3333-3333-333333333333'),
  ('d4444444-4444-4444-4444-444444444444'),
  ('e5555555-5555-5555-5555-555555555555');
