"use client";

import type { VehicleWheel } from "@/lib/types";
import { useConfiguratorStore } from "@/lib/hooks/use-configurator";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

interface WheelSelectorProps {
  wheels: VehicleWheel[];
}

export function WheelSelector({ wheels }: WheelSelectorProps) {
  const { wheelId, setWheel } = useConfiguratorStore();

  if (wheels.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wider">Wheels</h3>

      <div className="flex flex-col gap-2" role="radiogroup" aria-label="Select wheels">
        {wheels.map((wheel) => {
          const isSelected = wheel.id === wheelId;
          return (
            <button
              key={wheel.id}
              role="radio"
              aria-checked={isSelected}
              onClick={() => setWheel(wheel.id, wheel.price_modifier ?? 0)}
              className={cn(
                "flex items-center justify-between rounded-md border px-4 h-14 text-left transition-colors touch-target",
                isSelected
                  ? "border-foreground bg-foreground/5"
                  : "border-border hover:border-foreground/30"
              )}
            >
              <div>
                <p className={cn("text-sm font-medium", isSelected && "font-semibold")}>{wheel.name}</p>
                {wheel.size && (
                  <p className="text-xs text-muted-foreground">{wheel.size}"</p>
                )}
              </div>
              {wheel.price_modifier ? (
                <span className="text-sm text-muted-foreground">+{formatPrice(wheel.price_modifier)}</span>
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
