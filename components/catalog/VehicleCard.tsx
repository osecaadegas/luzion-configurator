import Link from "next/link";
import Image from "next/image";
import type { Vehicle } from "@/lib/types";
import { formatPrice, formatSpec } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Navigation } from "lucide-react";
import { QuoteButton } from "./QuoteButton";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const thumbnail = vehicle.images?.find((img) => img.view_type === "thumbnail")
    ?? vehicle.images?.[0];

  return (
    <article className="group flex flex-col rounded-lg border border-border bg-card overflow-hidden hover:border-foreground/20 transition-colors duration-300">
      {/* Image */}
      <Link
        href={`/configure/${vehicle.id}`}
        className="block relative overflow-hidden bg-secondary aspect-[16/9]"
        aria-label={`Configure ${vehicle.name}`}
      >
        {thumbnail ? (
          <Image
            src={thumbnail.image_url}
            alt={thumbnail.alt_text ?? `${vehicle.name} ${vehicle.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <span className="text-4xl font-light tracking-widest uppercase text-muted-foreground/30">
              {vehicle.name}
            </span>
          </div>
        )}
        {/* Price badge overlay */}
        <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm rounded px-3 py-1.5">
          <span className="text-sm font-semibold">
            {formatPrice(vehicle.base_price)}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Name */}
        <div>
          {vehicle.brand && (
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
              {vehicle.brand.name}
            </p>
          )}
          <h2 className="text-xl font-semibold">{vehicle.name}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{vehicle.model}</p>
        </div>

        {/* Key specs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Navigation className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>
              <span className="font-medium">{vehicle.range_km ?? "—"}</span>
              <span className="text-muted-foreground"> km</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>
              <span className="font-medium">{vehicle.motor_power_kw ?? "—"}</span>
              <span className="text-muted-foreground"> kW</span>
            </span>
          </div>
        </div>

        {/* Color swatches preview */}
        {vehicle.colors && vehicle.colors.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {vehicle.colors.length} color{vehicle.colors.length !== 1 ? "s" : ""}
            </span>
            <div className="flex gap-1">
              {vehicle.colors.slice(0, 5).map((color) => (
                <div
                  key={color.id}
                  className="h-4 w-4 rounded-full border border-border"
                  style={{ backgroundColor: color.hex_code ?? "#ccc" }}
                  title={color.name}
                />
              ))}
              {vehicle.colors.length > 5 && (
                <span className="text-xs text-muted-foreground">+{vehicle.colors.length - 5}</span>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-2 flex flex-col gap-2">
          <Button asChild size="lg" className="w-full touch-target">
            <Link href={`/configure/${vehicle.id}`}>
              Configure
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <QuoteButton vehicleName={`${vehicle.name} ${vehicle.model}`} />
        </div>
      </div>
    </article>
  );
}
