"use client";

import { useState } from "react";
import type { Vehicle, VehicleColor, VehicleWheel, VehicleInterior } from "@/lib/types";
import { useConfiguratorStore } from "@/lib/hooks/use-configurator";
import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { QrCode, Send, Loader2 } from "lucide-react";
import { toast } from "@/lib/hooks/use-toast";

interface ConfigSummaryProps {
  vehicle: Vehicle;
  onRequestQuote: () => void;
  onShareQR: () => void;
}

export function ConfigSummary({ vehicle, onRequestQuote, onShareQR }: ConfigSummaryProps) {
  const { colorId, wheelId, interiorId, totalPrice, colorModifier, wheelModifier, interiorModifier } =
    useConfiguratorStore();
  const [saving, setSaving] = useState(false);

  const selectedColor = vehicle.colors?.find((c) => c.id === colorId);
  const selectedWheel = vehicle.wheels?.find((w) => w.id === wheelId);
  const selectedInterior = vehicle.interiors?.find((i) => i.id === interiorId);

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/configurations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle_id: vehicle.id,
          color_id: colorId,
          wheel_id: wheelId,
          interior_id: interiorId,
          total_price: totalPrice,
        }),
      });
      if (!res.ok) throw new Error("Failed to save configuration");
      const { data } = await res.json();
      const shareUrl = `${window.location.origin}/share/${data.share_token}`;
      await navigator.clipboard.writeText(shareUrl);
      toast({ title: "Link copied!", description: "Share URL copied to clipboard." });
    } catch {
      toast({ title: "Error", description: "Could not save configuration.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const lineItems = [
    { label: "Base price", value: vehicle.base_price },
    selectedColor?.price_modifier ? { label: `Colour — ${selectedColor.name}`, value: colorModifier } : null,
    selectedWheel?.price_modifier ? { label: `Wheels — ${selectedWheel.name}`, value: wheelModifier } : null,
    selectedInterior?.price_modifier
      ? { label: `Interior — ${selectedInterior.name}`, value: interiorModifier }
      : null,
  ].filter(Boolean) as { label: string; value: number }[];

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-5">
      {/* Summary title */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider">Summary</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {vehicle.name} {vehicle.model}
        </p>
      </div>

      <Separator />

      {/* Line items */}
      <dl className="space-y-2">
        {lineItems.map((item) => (
          <div key={item.label} className="flex justify-between text-sm">
            <dt className="text-muted-foreground">{item.label}</dt>
            <dd className="font-medium">{formatPrice(item.value)}</dd>
          </div>
        ))}
      </dl>

      <Separator />

      {/* Total */}
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-medium">Total</span>
        <span className="text-2xl font-semibold">{formatPrice(totalPrice)}</span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-1">
        <Button size="lg" className="w-full touch-target" onClick={onRequestQuote}>
          <Send className="h-4 w-4" />
          Request a Quote
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="default" className="touch-target" onClick={handleSaveConfig} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Copy Link"}
          </Button>
          <Button variant="outline" size="default" className="touch-target" onClick={onShareQR}>
            <QrCode className="h-4 w-4" />
            QR Code
          </Button>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
        Price is indicative and excludes taxes and registration.
      </p>
    </div>
  );
}
