import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VehicleForm } from "@/components/admin/VehicleForm";
import type { Vehicle } from "@/lib/types";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("vehicles").select("name").eq("id", id).single();
  return { title: `${data?.name ?? "Vehicle"} — Luzion Admin` };
}

async function getVehicle(id: string): Promise<Vehicle | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("vehicles")
    .select("*, brand:brands(*), colors:vehicle_colors(*), wheels:vehicle_wheels(*), interiors:vehicle_interiors(*), images:vehicle_images(*)")
    .eq("id", id)
    .single();
  return data as Vehicle | null;
}

export default async function EditVehiclePage({ params }: Props) {
  const { id } = await params;
  const vehicle = await getVehicle(id);
  if (!vehicle) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Vehicle</h1>
        <p className="text-sm text-muted-foreground mt-1">{vehicle.name} · {vehicle.model}</p>
      </div>
      <VehicleForm vehicle={vehicle} />
    </div>
  );
}
