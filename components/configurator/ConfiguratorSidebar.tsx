"use client";

import type { Vehicle } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { ColorSelector } from "./ColorSelector";
import { WheelSelector } from "./WheelSelector";
import { InteriorSelector } from "./InteriorSelector";
import { ConfigSummary } from "./ConfigSummary";

interface ConfiguratorSidebarProps {
  vehicle: Vehicle;
  onRequestQuote: () => void;
  onShareQR: () => void;
}

export function ConfiguratorSidebar({ vehicle, onRequestQuote, onShareQR }: ConfiguratorSidebarProps) {
  return (
    <aside className="flex flex-col gap-6">
      {/* Options */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-6">
        <ColorSelector colors={vehicle.colors ?? []} />
        {(vehicle.wheels ?? []).length > 0 && (
          <>
            <Separator />
            <WheelSelector wheels={vehicle.wheels ?? []} />
          </>
        )}
        {(vehicle.interiors ?? []).length > 0 && (
          <>
            <Separator />
            <InteriorSelector interiors={vehicle.interiors ?? []} />
          </>
        )}
      </div>

      {/* Price summary + CTAs */}
      <ConfigSummary vehicle={vehicle} onRequestQuote={onRequestQuote} onShareQR={onShareQR} />
    </aside>
  );
}
