"use client";

import { useEffect, useRef } from "react";

type Device = {
  id: string;
  hostname: string | null;
  ip_v4: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  lat: number | null;
  lng: number | null;
  last_seen: string;
};

export default function DevicesMap({ devices }: { devices: Device[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Leaflet must be imported client-side only
    import("leaflet").then((L) => {
      // Fix default marker icon path issue with webpack/Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const validDevices = devices.filter((d) => d.lat != null && d.lng != null);
      const center: [number, number] = validDevices.length > 0
        ? [validDevices[0].lat!, validDevices[0].lng!]
        : [20, 0];

      const map = L.map(mapRef.current!).setView(center, validDevices.length > 0 ? 5 : 2);
      mapInstance.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);

      validDevices.forEach((d) => {
        const popup = `
          <div style="min-width:180px;font-family:monospace;font-size:12px;line-height:1.6">
            <strong style="font-size:13px">${d.hostname ?? "Kiosk"}</strong><br/>
            ${d.city ?? ""}${d.region ? `, ${d.region}` : ""}${d.country ? ` — ${d.country}` : ""}<br/>
            IP: ${d.ip_v4 ?? "—"}<br/>
            Last seen: ${new Date(d.last_seen).toLocaleString()}
          </div>`;
        L.marker([d.lat!, d.lng!]).addTo(map).bindPopup(popup);
      });

      // Fit map to all markers if more than one
      if (validDevices.length > 1) {
        const bounds = L.latLngBounds(validDevices.map((d) => [d.lat!, d.lng!]));
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    });

    return () => {
      if (mapInstance.current) {
        (mapInstance.current as { remove: () => void }).remove();
        mapInstance.current = null;
      }
    };
  }, [devices]);

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <div ref={mapRef} className="w-full h-[360px] rounded-lg border border-border z-0" />
    </>
  );
}
