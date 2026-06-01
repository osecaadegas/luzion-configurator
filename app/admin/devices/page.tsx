import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor } from "lucide-react";
import DevicesMapClient from "@/components/admin/DevicesMapClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Kiosk Devices — Luzion Admin" };
export const revalidate = 0;

async function getDevices() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("kiosk_devices")
    .select("id, device_id, hostname, ip_v4, ip_v6, city, region, country, lat, lng, gpu, screen_res, os_name, os_version, app_version, first_seen, last_seen")
    .order("last_seen", { ascending: false });
  return data ?? [];
}

function ago(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function statusDot(lastSeen: string) {
  const minutesAgo = (Date.now() - new Date(lastSeen).getTime()) / 60000;
  // Green if seen in last 10 min, amber if last 24h, red otherwise
  if (minutesAgo < 10) return "bg-emerald-500";
  if (minutesAgo < 1440) return "bg-amber-400";
  return "bg-red-500";
}

export default async function DevicesPage() {
  const devices = await getDevices();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Monitor className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-semibold">Kiosk Devices</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {devices.length} device{devices.length !== 1 ? "s" : ""} registered
          </p>
        </div>
      </div>

      {/* Map */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Device Locations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden rounded-b-lg">
          <DevicesMapClient devices={devices.map((d) => ({ id: d.id, hostname: d.hostname, ip_v4: d.ip_v4, city: d.city, region: d.region, country: d.country, lat: d.lat, lng: d.lng, last_seen: d.last_seen }))} />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            All Devices
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {devices.length === 0 ? (
            <p className="text-sm text-muted-foreground p-6">
              No kiosk devices registered yet. Devices appear here automatically on first launch.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wide">
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Hostname</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">IPv4</th>
                    <th className="px-4 py-3">GPU</th>
                    <th className="px-4 py-3">Screen</th>
                    <th className="px-4 py-3">OS</th>
                    <th className="px-4 py-3">App</th>
                    <th className="px-4 py-3">Last Seen</th>
                    <th className="px-4 py-3">First Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((d) => (
                    <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`inline-block h-2.5 w-2.5 rounded-full ${statusDot(d.last_seen)}`} title={new Date(d.last_seen).toLocaleString()} />
                      </td>
                      <td className="px-4 py-3 font-mono font-medium">{d.hostname ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {[d.city, d.region, d.country].filter(Boolean).join(", ") || "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{d.ip_v4 ?? "—"}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-[180px] truncate" title={d.gpu ?? ""}>
                        {d.gpu ?? "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{d.screen_res ?? "—"}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {d.os_name ? `${d.os_name} ${d.os_version ?? ""}` : "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{d.app_version ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{ago(d.last_seen)}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{ago(d.first_seen)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
