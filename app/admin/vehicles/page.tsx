import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import type { Vehicle } from "@/lib/types";

export const metadata: Metadata = { title: "Vehicles — Luzion Admin" };
export const revalidate = 0;

async function getVehicles(): Promise<Vehicle[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("vehicles")
    .select("*, brand:brands(name)")
    .order("sort_order");
  return (data as Vehicle[]) ?? [];
}

export default async function AdminVehiclesPage() {
  const vehicles = await getVehicles();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Vehicles</h1>
          <p className="text-sm text-muted-foreground mt-1">{vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""}</p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/vehicles/new">
            <Plus className="h-4 w-4" />
            Add Vehicle
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Model</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Price</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground" />
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">No vehicles yet</td>
              </tr>
            ) : (
              vehicles.map((v) => (
                <tr key={v.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{v.name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{v.model}</td>
                  <td className="px-4 py-3">{formatPrice(v.base_price)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={v.is_active ? "success" : "secondary"}>
                      {v.is_active ? "Active" : "Hidden"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/vehicles/${v.id}`}>Edit</Link>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
