"use client";

import dynamic from "next/dynamic";

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

const DevicesMap = dynamic(() => import("./DevicesMap"), { ssr: false });

export default function DevicesMapClient({ devices }: { devices: Device[] }) {
  return <DevicesMap devices={devices} />;
}
