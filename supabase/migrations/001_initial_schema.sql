-- ============================================================
-- Migration: 001_initial_schema.sql
-- Project: Luzion Vehicle Configurator
-- Description: Full initial schema for the vehicle configurator
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Utility: Updated At Trigger ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── Brands ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS brands (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  logo_url    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_brands_name ON brands (name);

-- ─── Vehicles ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS vehicles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id        UUID REFERENCES brands (id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  model           TEXT NOT NULL,
  description     TEXT,
  base_price      NUMERIC(10, 2) NOT NULL DEFAULT 0,
  range_km        INTEGER,
  motor_power_kw  INTEGER,
  battery_kwh     NUMERIC(5, 2),
  top_speed_kmh   INTEGER,
  seats           SMALLINT,
  length_mm       INTEGER,
  width_mm        INTEGER,
  height_mm       INTEGER,
  weight_kg       INTEGER,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_vehicles_brand_id   ON vehicles (brand_id);
CREATE INDEX idx_vehicles_is_active  ON vehicles (is_active);
CREATE INDEX idx_vehicles_sort_order ON vehicles (sort_order);

-- ─── Vehicle Colors ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS vehicle_colors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id      UUID NOT NULL REFERENCES vehicles (id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  hex_code        TEXT,
  price_modifier  NUMERIC(10, 2) NOT NULL DEFAULT 0,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicle_colors_vehicle_id ON vehicle_colors (vehicle_id);

-- ─── Vehicle Wheels ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS vehicle_wheels (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id      UUID NOT NULL REFERENCES vehicles (id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  size            TEXT,
  price_modifier  NUMERIC(10, 2) NOT NULL DEFAULT 0,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicle_wheels_vehicle_id ON vehicle_wheels (vehicle_id);

-- ─── Vehicle Interiors ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS vehicle_interiors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id      UUID NOT NULL REFERENCES vehicles (id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  material        TEXT,
  price_modifier  NUMERIC(10, 2) NOT NULL DEFAULT 0,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicle_interiors_vehicle_id ON vehicle_interiors (vehicle_id);

-- ─── Vehicle Images ───────────────────────────────────────────────────────────

CREATE TYPE view_type_enum AS ENUM ('front', 'rear', 'side', 'interior', 'thumbnail');

CREATE TABLE IF NOT EXISTS vehicle_images (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id   UUID NOT NULL REFERENCES vehicles (id) ON DELETE CASCADE,
  color_id     UUID REFERENCES vehicle_colors (id) ON DELETE SET NULL,
  wheel_id     UUID REFERENCES vehicle_wheels (id) ON DELETE SET NULL,
  interior_id  UUID REFERENCES vehicle_interiors (id) ON DELETE SET NULL,
  view_type    view_type_enum NOT NULL,
  image_url    TEXT NOT NULL,
  alt_text     TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicle_images_vehicle_id  ON vehicle_images (vehicle_id);
CREATE INDEX idx_vehicle_images_color_id    ON vehicle_images (color_id);
CREATE INDEX idx_vehicle_images_wheel_id    ON vehicle_images (wheel_id);
CREATE INDEX idx_vehicle_images_interior_id ON vehicle_images (interior_id);
CREATE INDEX idx_vehicle_images_view_type   ON vehicle_images (view_type);
-- Composite index for the most common configurator lookup
CREATE INDEX idx_vehicle_images_config_lookup
  ON vehicle_images (vehicle_id, color_id, wheel_id, interior_id, view_type);

-- ─── Saved Configurations ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS saved_configurations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id   UUID NOT NULL REFERENCES vehicles (id) ON DELETE CASCADE,
  color_id     UUID REFERENCES vehicle_colors (id) ON DELETE SET NULL,
  wheel_id     UUID REFERENCES vehicle_wheels (id) ON DELETE SET NULL,
  interior_id  UUID REFERENCES vehicle_interiors (id) ON DELETE SET NULL,
  total_price  NUMERIC(10, 2) NOT NULL DEFAULT 0,
  share_token  TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_saved_configurations_vehicle_id  ON saved_configurations (vehicle_id);
CREATE INDEX idx_saved_configurations_share_token ON saved_configurations (share_token);

-- ─── Leads ────────────────────────────────────────────────────────────────────

CREATE TYPE lead_status_enum AS ENUM ('new', 'contacted', 'qualified', 'converted', 'lost');

CREATE TABLE IF NOT EXISTS leads (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  configuration_id  UUID REFERENCES saved_configurations (id) ON DELETE SET NULL,
  name              TEXT NOT NULL,
  email             TEXT NOT NULL,
  phone             TEXT,
  notes             TEXT,
  status            lead_status_enum NOT NULL DEFAULT 'new',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_leads_configuration_id ON leads (configuration_id);
CREATE INDEX idx_leads_email            ON leads (email);
CREATE INDEX idx_leads_status           ON leads (status);
CREATE INDEX idx_leads_created_at       ON leads (created_at DESC);
