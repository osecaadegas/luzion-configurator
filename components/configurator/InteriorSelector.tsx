"use client";

import type { VehicleInterior } from "@/lib/types";
import { useConfiguratorStore } from "@/lib/hooks/use-configurator";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

interface InteriorSelectorProps {
  interiors: VehicleInterior[];
}

export function InteriorSelector({ interiors }: InteriorSelectorProps) {
  const { interiorId, setInterior } = useConfiguratorStore();

  if (interiors.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wider">Interior</h3>

      <div className="flex flex-col gap-2" role="radiogroup" aria-label="Select interior">
        {interiors.map((interior) => {
          const isSelected = interior.id === interiorId;
          return (
            <button
              key={interior.id}
              role="radio"
              aria-checked={isSelected}
              onClick={() => setInterior(interior.id, interior.price_modifier ?? 0)}
              className={cn(
                "flex items-center justify-between rounded-md border px-4 h-14 text-left transition-colors touch-target",
                isSelected
                  ? "border-foreground bg-foreground/5"
                  : "border-border hover:border-foreground/30"
              )}
            >
              <div>
                <p className={cn("text-sm font-medium", isSelected && "font-semibold")}>{interior.name}</p>
                {interior.material && (
                  <p className="text-xs text-muted-foreground capitalize">{interior.material}</p>
                )}
              </div>
              {interior.price_modifier ? (
                <span className="text-sm text-muted-foreground">+{formatPrice(interior.price_modifier)}</span>
              ) : (
                <span className="text-xs text-muted-foreground">Included</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
