import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  let body: Record<string, string | number | null>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const { device_id, hostname, gpu, screen_res, os_name, os_version, app_version, ip_v6 } = body;
  const precise = req.nextUrl.searchParams.get("precise") === "1";

  if (!device_id) {
    return NextResponse.json({ error: "missing device_id" }, { status: 400 });
  }

  // ── Precise GPS update from the Electron geolocation API ─────────────────
  if (precise) {
    const lat = typeof body.lat === "number" ? body.lat : null;
    const lng = typeof body.lng === "number" ? body.lng : null;
    if (lat == null || lng == null) {
      return NextResponse.json({ error: "missing lat/lng" }, { status: 400 });
    }
    const { error } = await supabase
      .from("kiosk_devices")
      .update({ lat, lng, last_seen: new Date().toISOString() })
      .eq("device_id", device_id);
    if (error) {
      console.error("[kiosk/register precise]", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  // ── Initial registration with IP geolocation ──────────────────────────────
  // Extract real IP from Vercel / proxy headers
  const forwarded = req.headers.get("x-forwarded-for");
  const ip_v4 = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  // IP geolocation (ip-api.com — free, no key required, 45 req/min)
  let city: string | null = null;
  let region: string | null = null;
  let country: string | null = null;
  let lat: number | null = null;
  let lng: number | null = null;

  if (ip_v4 !== "unknown" && !ip_v4.startsWith("127.") && !ip_v4.startsWith("::")) {
    try {
      const geoRes = await fetch(
        `http://ip-api.com/json/${ip_v4}?fields=status,city,regionName,country,lat,lon`,
        { signal: AbortSignal.timeout(3000) }
      );
      const geo = await geoRes.json();
      if (geo.status === "success") {
        city = geo.city;
        region = geo.regionName;
        country = geo.country;
        lat = geo.lat;
        lng = geo.lon;
      }
    } catch {
      // Geolocation is best-effort — don't fail the request
    }
  }

  const now = new Date().toISOString();

  const { error } = await supabase.from("kiosk_devices").upsert(
    {
      device_id,
      hostname: hostname ?? null,
      ip_v4,
      ip_v6: ip_v6 ?? null,
      city,
      region,
      country,
      lat,
      lng,
      gpu: gpu ?? null,
      screen_res: screen_res ?? null,
      os_name: os_name ?? null,
      os_version: os_version ?? null,
      app_version: app_version ?? null,
      last_seen: now,
    },
    { onConflict: "device_id" }
  );

  if (error) {
    console.error("[kiosk/register]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
