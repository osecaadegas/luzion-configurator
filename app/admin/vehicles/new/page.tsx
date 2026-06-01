import { VehicleForm } from "@/components/admin/VehicleForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Vehicle — Luzion Admin" };

export default function NewVehiclePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New Vehicle</h1>
        <p className="text-sm text-muted-foreground mt-1">Add a new model to the showroom</p>
      </div>
      <VehicleForm />
    </div>
  );
}
