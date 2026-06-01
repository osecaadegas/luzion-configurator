"use client";

import type { Vehicle } from "@/lib/types";
import { formatPrice, formatPower, formatSpec } from "@/lib/utils/format";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface ComparisonTableProps {
  vehicles: [Vehicle, Vehicle];
}

type SpecRow = {
  label: string;
  getValue: (v: Vehicle) => string;
};

const SPEC_ROWS: SpecRow[] = [
  { label: "Starting price", getValue: (v) => formatPrice(v.base_price) },
  { label: "Range", getValue: (v) => formatSpec(v.range_km, "km") },
  { label: "Power", getValue: (v) => formatPower(v.motor_power_kw) },
  { label: "Battery", getValue: (v) => formatSpec(v.battery_kwh, "kWh") },
  { label: "Top speed", getValue: (v) => formatSpec(v.top_speed_kmh, "km/h") },
  { label: "Seats", getValue: (v) => v.seats?.toString() ?? "—" },
  { label: "Weight", getValue: (v) => formatSpec(v.weight_kg, "kg") },
];

export function ComparisonTable({ vehicles }: ComparisonTableProps) {
  const [a, b] = vehicles;

  const thumbnailOf = (v: Vehicle) =>
    v.images?.find((img) => img.view_type === "thumbnail") ?? v.images?.[0];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px]">
        {/* Vehicle headers */}
        <thead>
          <tr>
            <th className="w-36 md:w-48 pb-6 pr-4 text-left" aria-label="Specification" />
            {vehicles.map((v) => {
              const thumb = thumbnailOf(v);
              return (
                <th key={v.id} className="pb-6 px-3 text-center font-normal" scope="col">
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-secondary">
                      {thumb ? (
                        <Image
                          src={thumb.image_url}
                          alt={thumb.alt_text ?? v.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 45vw, 30vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 text-xs uppercase tracking-widest">
                          {v.name}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{v.name}</p>
                      <p className="text-xs text-muted-foreground">{v.model}</p>
                    </div>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {SPEC_ROWS.map((row, i) => {
            const valA = row.getValue(a);
            const valB = row.getValue(b);
            return (
              <tr key={row.label} className={i % 2 === 0 ? "bg-secondary/30" : ""}>
                <td className="py-3 pr-4 text-sm text-muted-foreground font-medium">{row.label}</td>
                <td className="py-3 px-3 text-sm text-center font-medium">{valA}</td>
                <td className="py-3 px-3 text-sm text-center font-medium">{valB}</td>
              </tr>
            );
          })}
        </tbody>

        {/* CTA row */}
        <tfoot>
          <tr>
            <td />
            {vehicles.map((v) => (
              <td key={v.id} className="pt-6 px-3 text-center">
                <Button asChild className="w-full touch-target" size="sm">
                  <Link href={`/configure/${v.id}`}>
                    Configure
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
