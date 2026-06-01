"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { Vehicle } from "@/lib/types";
import { useConfiguratorStore } from "@/lib/hooks/use-configurator";
import { buildShareUrl } from "@/lib/utils/format";
import { VehicleViewer } from "@/components/configurator/VehicleViewer";
import { ViewSelector } from "@/components/configurator/ViewSelector";
import { ConfiguratorSidebar } from "@/components/configurator/ConfiguratorSidebar";
import { LeadModal } from "@/components/lead-capture/LeadModal";
import { QRCodeModal } from "@/components/qr/QRCodeModal";
import { FullPageLoader } from "@/components/shared/LoadingSpinner";
import { toast } from "@/lib/hooks/use-toast";

export default function ConfiguratorPage() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLead, setShowLead] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const handleShareQR = async () => {
    if (shareUrl) { setShowQR(true); return; }
    try {
      const res = await fetch("/api/configurations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle_id: vehicleId,
          color_id: colorId,
          wheel_id: wheelId,
          interior_id: interiorId,
          total_price: useConfiguratorStore.getState().totalPrice,
        }),
      });
      const { data } = await res.json();
      const url = buildShareUrl(data.share_token);
      setShareUrl(url);
      setShowQR(true);
    } catch {
      toast({ title: "Error", description: "Could not generate share link.", variant: "destructive" });
    }
  };

  const { setVehicle: setStoreVehicle, setColor, setWheel, setInterior, colorId, wheelId, interiorId, activeView } = useConfiguratorStore();

  useEffect(() => {
    fetch(`/api/vehicles/${vehicleId}`)
      .then((r) => r.json())
      .then(({ data, error }) => {
        if (error || !data) {
          toast({ title: "Not found", description: "Vehicle could not be loaded.", variant: "destructive" });
          return;
        }
        setVehicle(data as Vehicle);
        setStoreVehicle(data.id, data.base_price);
        // Pre-select first option of each category
        const firstColor = data.colors?.[0];
        const firstWheel = data.wheels?.[0];
        const firstInterior = data.interiors?.[0];
        if (firstColor) setColor(firstColor.id, firstColor.price_modifier ?? 0);
        if (firstWheel) setWheel(firstWheel.id, firstWheel.price_modifier ?? 0);
        if (firstInterior) setInterior(firstInterior.id, firstInterior.price_modifier ?? 0);
      })
      .catch(() => toast({ title: "Error", description: "Failed to load vehicle.", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [vehicleId, setStoreVehicle, setColor, setWheel, setInterior]);

  if (loading) return <FullPageLoader label="Loading configurator…" />;
  if (!vehicle) return <div className="container py-20 text-center text-muted-foreground">Vehicle not found.</div>;

  // Filter images matching the current selection (or fallback to unfiltered)
  const matchedImages = (vehicle.images ?? []).filter(
    (img) =>
      (!img.color_id || img.color_id === colorId) &&
      (!img.wheel_id || img.wheel_id === wheelId) &&
      (!img.interior_id || img.interior_id === interiorId)
  );
  const displayImages = matchedImages.length > 0 ? matchedImages : (vehicle.images ?? []);

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {vehicle.brand?.name}
        </p>
        <h1 className="text-3xl font-semibold mt-1">
          {vehicle.name} <span className="font-light text-muted-foreground">{vehicle.model}</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Left: image + view selector */}
        <div className="space-y-4">
          <VehicleViewer
            images={displayImages}
            activeView={activeView}
            vehicleName={vehicle.name}
          />
          <ViewSelector />
        </div>

        {/* Right: options + summary */}
        <ConfiguratorSidebar
          vehicle={vehicle}
          onRequestQuote={() => setShowLead(true)}
          onShareQR={handleShareQR}
        />
      </div>

      {/* Modals */}
      <LeadModal
        open={showLead}
        onClose={() => setShowLead(false)}
        vehicleName={`${vehicle.name} ${vehicle.model}`}
      />
      <QRCodeModal
        open={showQR}
        onClose={() => setShowQR(false)}
        url={shareUrl}
        vehicleName={vehicle.name}
      />
    </div>
  );
}
