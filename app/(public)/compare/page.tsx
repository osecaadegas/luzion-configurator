"use client";

import { useState, useEffect } from "react";
import type { Vehicle } from "@/lib/types";
import { ComparisonTable } from "@/components/comparison/ComparisonTable";
import { VehicleGrid } from "@/components/catalog/VehicleGrid";
import { FullPageLoader } from "@/components/shared/LoadingSpinner";

export default function ComparePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selected, setSelected] = useState<[string | null, string | null]>([null, null]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vehicles")
      .then((r) => r.json())
      .then(({ data }) => setVehicles(data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev[0] === id) return [prev[1], null];
      if (prev[1] === id) return [prev[0], null];
      if (!prev[0]) return [id, prev[1]];
      if (!prev[1]) return [prev[0], id];
      return [prev[0], id]; // replace second slot
    });
  };

  const selectedVehicles = vehicles.filter((v) => selected.includes(v.id));
  const canCompare = selectedVehicles.length === 2;

  if (loading) return <FullPageLoader label="Loading models…" />;

  return (
    <div className="container py-16 space-y-12">
      <div>
        <h1 className="text-3xl font-semibold">Compare Models</h1>
        <p className="text-muted-foreground mt-2">
          Select two models to compare their specifications side by side.
        </p>
      </div>

      {canCompare ? (
        <ComparisonTable vehicles={selectedVehicles as [Vehicle, Vehicle]} />
      ) : (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
          {selectedVehicles.length === 0
            ? "Select two models below to begin comparing."
            : `${selectedVehicles[0].name} selected. Choose one more model.`}
        </div>
      )}

      {/* Selectable grid */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
          {canCompare ? "Change selection" : "Select models"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((v) => {
            const isSelected = selected.includes(v.id);
            return (
              <button
                key={v.id}
                onClick={() => toggle(v.id)}
                className={`text-left rounded-lg border-2 p-4 transition-colors touch-target ${
                  isSelected
                    ? "border-foreground bg-foreground/5"
                    : "border-border hover:border-foreground/30"
                }`}
              >
                <p className="font-semibold text-sm">{v.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{v.model}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
