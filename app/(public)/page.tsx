import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/catalog/HeroSection";
import { VehicleGrid } from "@/components/catalog/VehicleGrid";
import type { Vehicle } from "@/lib/types";

export const metadata: Metadata = {
  title: "Models — Luzion Premium Microcars",
};

export const revalidate = 60;

async function getVehicles(): Promise<Vehicle[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("vehicles")
    .select(
      `*, brand:brands(*), colors:vehicle_colors(*), wheels:vehicle_wheels(*), interiors:vehicle_interiors(*), images:vehicle_images(*)`
    )
    .eq("is_active", true)
    .order("sort_order");

  return (data as Vehicle[]) ?? [];
}

export default async function HomePage() {
  const vehicles = await getVehicles();

  return (
    <>
      <HeroSection />
      <section id="models" className="container py-16">
        <h2 className="text-3xl font-semibold mb-10">Our Models</h2>
        <VehicleGrid vehicles={vehicles} />
      </section>
    </>
  );
}
