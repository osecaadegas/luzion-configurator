-- ============================================================
-- Migration: 002_rls_policies.sql
-- Project: Luzion Vehicle Configurator
-- Description: Row Level Security policies
-- ============================================================

-- ─── Enable RLS on all tables ────────────────────────────────────────────────

ALTER TABLE brands                ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_colors        ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_wheels        ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_interiors     ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_images        ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_configurations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads                 ENABLE ROW LEVEL SECURITY;

-- ─── Helper: is_admin() ───────────────────────────────────────────────────────
-- Returns TRUE if the current user's role claim is 'admin'.
-- Set this on the JWT via Supabase custom claims.

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.jwt() ->> 'role' = 'admin'
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ─── Brands ───────────────────────────────────────────────────────────────────

-- Public: anyone can read brands
CREATE POLICY "brands_select_public"
  ON brands FOR SELECT
  USING (TRUE);

-- Admin only: insert / update / delete
CREATE POLICY "brands_insert_admin"
  ON brands FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "brands_update_admin"
  ON brands FOR UPDATE
  USING (is_admin());

CREATE POLICY "brands_delete_admin"
  ON brands FOR DELETE
  USING (is_admin());

-- ─── Vehicles ─────────────────────────────────────────────────────────────────

-- Public: only active vehicles
CREATE POLICY "vehicles_select_public"
  ON vehicles FOR SELECT
  USING (is_active = TRUE OR is_admin());

CREATE POLICY "vehicles_insert_admin"
  ON vehicles FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "vehicles_update_admin"
  ON vehicles FOR UPDATE
  USING (is_admin());

CREATE POLICY "vehicles_delete_admin"
  ON vehicles FOR DELETE
  USING (is_admin());

-- ─── Vehicle Colors ───────────────────────────────────────────────────────────

CREATE POLICY "colors_select_public"
  ON vehicle_colors FOR SELECT
  USING (is_active = TRUE OR is_admin());

CREATE POLICY "colors_insert_admin"
  ON vehicle_colors FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "colors_update_admin"
  ON vehicle_colors FOR UPDATE
  USING (is_admin());

CREATE POLICY "colors_delete_admin"
  ON vehicle_colors FOR DELETE
  USING (is_admin());

-- ─── Vehicle Wheels ───────────────────────────────────────────────────────────

CREATE POLICY "wheels_select_public"
  ON vehicle_wheels FOR SELECT
  USING (is_active = TRUE OR is_admin());

CREATE POLICY "wheels_insert_admin"
  ON vehicle_wheels FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "wheels_update_admin"
  ON vehicle_wheels FOR UPDATE
  USING (is_admin());

CREATE POLICY "wheels_delete_admin"
  ON vehicle_wheels FOR DELETE
  USING (is_admin());

-- ─── Vehicle Interiors ────────────────────────────────────────────────────────

CREATE POLICY "interiors_select_public"
  ON vehicle_interiors FOR SELECT
  USING (is_active = TRUE OR is_admin());

CREATE POLICY "interiors_insert_admin"
  ON vehicle_interiors FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "interiors_update_admin"
  ON vehicle_interiors FOR UPDATE
  USING (is_admin());

CREATE POLICY "interiors_delete_admin"
  ON vehicle_interiors FOR DELETE
  USING (is_admin());

-- ─── Vehicle Images ───────────────────────────────────────────────────────────

-- Public: images for active vehicles are readable
CREATE POLICY "images_select_public"
  ON vehicle_images FOR SELECT
  USING (TRUE);

CREATE POLICY "images_insert_admin"
  ON vehicle_images FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "images_update_admin"
  ON vehicle_images FOR UPDATE
  USING (is_admin());

CREATE POLICY "images_delete_admin"
  ON vehicle_images FOR DELETE
  USING (is_admin());

-- ─── Saved Configurations ─────────────────────────────────────────────────────

-- Anyone can create a configuration (public kiosk use case)
CREATE POLICY "configs_insert_public"
  ON saved_configurations FOR INSERT
  WITH CHECK (TRUE);

-- Anyone can read a configuration (needed for share links)
CREATE POLICY "configs_select_public"
  ON saved_configurations FOR SELECT
  USING (TRUE);

-- Only admins can update or delete
CREATE POLICY "configs_update_admin"
  ON saved_configurations FOR UPDATE
  USING (is_admin());

CREATE POLICY "configs_delete_admin"
  ON saved_configurations FOR DELETE
  USING (is_admin());

-- ─── Leads ────────────────────────────────────────────────────────────────────

-- Anyone can create a lead (the lead capture form is public)
CREATE POLICY "leads_insert_public"
  ON leads FOR INSERT
  WITH CHECK (TRUE);

-- Only admins can read, update, or delete leads
CREATE POLICY "leads_select_admin"
  ON leads FOR SELECT
  USING (is_admin());

CREATE POLICY "leads_update_admin"
  ON leads FOR UPDATE
  USING (is_admin());

CREATE POLICY "leads_delete_admin"
  ON leads FOR DELETE
  USING (is_admin());

-- ─── Storage Buckets (run in Supabase Dashboard or via CLI) ───────────────────
-- NOTE: Storage bucket policies must be applied via the Supabase Dashboard
-- or the Supabase CLI, not via SQL migration.
-- Bucket name: vehicle-images
-- Public bucket: YES (for image CDN serving)
-- Admin-only upload enforced at the API layer (service role key).
