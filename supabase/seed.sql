-- ============================================================
-- Seed: seed.sql
-- Project: Luzion Vehicle Configurator
-- Description: Initial demo data for development / staging
-- ============================================================

-- Brand
INSERT INTO brands (id, name)
VALUES ('00000000-0000-0000-0000-000000000001', 'Luzion')
ON CONFLICT (id) DO NOTHING;

-- Vehicle
INSERT INTO vehicles (
  id, brand_id, name, model, description,
  base_price, range_km, motor_power_kw, battery_kwh,
  top_speed_kmh, seats, length_mm, width_mm, height_mm, weight_kg,
  is_active, sort_order
) VALUES (
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Luzion One',
  'One',
  'The Luzion One is a premium urban microcar redefining city mobility. Designed for efficiency, style, and zero-emission driving.',
  24990,
  180,
  30,
  10.5,
  110,
  2,
  2800,
  1450,
  1560,
  680,
  TRUE,
  0
) ON CONFLICT (id) DO NOTHING;

-- Colors
INSERT INTO vehicle_colors (id, vehicle_id, name, hex_code, price_modifier, sort_order) VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Pearl White',   '#F5F5F0', 0,    0),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Midnight Black', '#0A0A0A', 0,    1),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Storm Grey',    '#6B7280', 500,  2),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'Ocean Blue',    '#1E40AF', 500,  3),
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', 'Champagne',     '#C4A96B', 1200, 4)
ON CONFLICT (id) DO NOTHING;

-- Wheels
INSERT INTO vehicle_wheels (id, vehicle_id, name, size, price_modifier, sort_order) VALUES
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Standard 14"',  '14"', 0,    0),
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Sport 15"',     '15"', 800,  1),
  ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Premium 16"',   '16"', 1500, 2)
ON CONFLICT (id) DO NOTHING;

-- Interiors
INSERT INTO vehicle_interiors (id, vehicle_id, name, material, price_modifier, sort_order) VALUES
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Urban Black',       'Textile',       0,    0),
  ('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Ivory Premium',     'Vegan Leather',  1500, 1),
  ('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Carbon Sport',      'Alcantara',     2500, 2)
ON CONFLICT (id) DO NOTHING;
