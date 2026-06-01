-- Kiosk device registry: tracks every installed Electron kiosk
CREATE TABLE kiosk_devices (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id    text        UNIQUE NOT NULL,         -- stable UUID stored on the kiosk machine
  hostname     text,
  ip_v4        text,
  ip_v6        text,
  city         text,
  region       text,
  country      text,
  lat          double precision,
  lng          double precision,
  gpu          text,
  screen_res   text,
  os_name      text,
  os_version   text,
  app_version  text,
  first_seen   timestamptz NOT NULL DEFAULT now(),
  last_seen    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE kiosk_devices ENABLE ROW LEVEL SECURITY;

-- Only the service-role key (server-side) can read/write
CREATE POLICY "service_role_all" ON kiosk_devices
  FOR ALL TO service_role USING (true) WITH CHECK (true);
