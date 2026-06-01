"use client";

import type { VehicleColor } from "@/lib/types";
import { useConfiguratorStore } from "@/lib/hooks/use-configurator";
import { formatPrice } from "@/lib/utils/format";
import { isLightColor } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { Check } from "lucide-react";

interface ColorSelectorProps {
  colors: VehicleColor[];
}

export function ColorSelector({ colors }: ColorSelectorProps) {
  const { colorId, setColor } = useConfiguratorStore();

  if (colors.length === 0) return null;

  const selectedColor = colors.find((c) => c.id === colorId);

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider">Colour</h3>
        <span className="text-sm text-muted-foreground">{selectedColor?.name ?? "—"}</span>
      </div>

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(auto-fill, minmax(2.75rem, 1fr))` }}
        role="radiogroup"
        aria-label="Select colour"
      >
        {colors.map((color) => {
          const isSelected = color.id === colorId;
          const light = isLightColor(color.hex_code ?? "#FFFFFF");

          return (
            <button
              key={color.id}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${color.name}${color.price_modifier ? ` (+${formatPrice(color.price_modifier)})` : ""}`}
              title={color.name}
              onClick={() => setColor(color.id, color.price_modifier ?? 0)}
              className={cn(
                "option-swatch h-11 w-full rounded-md border-2 transition-all",
                isSelected
                  ? "border-foreground ring-2 ring-foreground ring-offset-2 ring-offset-background"
                  : "border-transparent hover:border-foreground/30"
              )}
              style={{ backgroundColor: color.hex_code ?? "#ccc" }}
            >
              {isSelected && (
                <Check
                  className={cn("h-4 w-4 mx-auto", light ? "text-black" : "text-white")}
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>

      {selectedColor?.price_modifier ? (
        <p className="text-xs text-muted-foreground">
          +{formatPrice(selectedColor.price_modifier)} for this colour
        </p>
      ) : null}
    </div>
  );
}
