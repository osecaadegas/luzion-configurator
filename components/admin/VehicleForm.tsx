"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleSchema } from "@/lib/validators/schemas";
import type { VehicleSchema } from "@/lib/validators/schemas";
import type { Vehicle } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "@/lib/hooks/use-toast";

type VehicleFormData = VehicleSchema;

interface VehicleFormProps {
  vehicle?: Vehicle;
}

export function VehicleForm({ vehicle }: VehicleFormProps) {
  const router = useRouter();
  const isEdit = !!vehicle;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema) as any,
    defaultValues: vehicle
      ? {
          name: vehicle.name,
          model: vehicle.model,
          description: vehicle.description ?? "",
          base_price: vehicle.base_price,
          range_km: vehicle.range_km ?? undefined,
          motor_power_kw: vehicle.motor_power_kw ?? undefined,
          battery_kwh: vehicle.battery_kwh ?? undefined,
          top_speed_kmh: vehicle.top_speed_kmh ?? undefined,
          seats: vehicle.seats ?? undefined,
          weight_kg: vehicle.weight_kg ?? undefined,
        }
      : undefined,
  });

  const onSubmit = async (data: VehicleFormData) => {
    const url = isEdit ? `/api/vehicles/${vehicle!.id}` : "/api/vehicles";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const { error } = await res.json();
      toast({ title: "Error", description: error?.message ?? "Something went wrong.", variant: "destructive" });
      return;
    }

    toast({ title: isEdit ? "Vehicle updated" : "Vehicle created" });
    router.push("/admin/vehicles");
    router.refresh();
  };

  const fields: { key: keyof VehicleFormData; label: string; type?: string; required?: boolean }[] = [
    { key: "name", label: "Name", required: true },
    { key: "model", label: "Model", required: true },
    { key: "base_price", label: "Base price (€)", type: "number", required: true },
    { key: "range_km", label: "Range (km)", type: "number" },
    { key: "motor_power_kw", label: "Motor power (kW)", type: "number" },
    { key: "battery_kwh", label: "Battery (kWh)", type: "number" },
    { key: "top_speed_kmh", label: "Top speed (km/h)", type: "number" },
    { key: "seats", label: "Seats", type: "number" },
    { key: "weight_kg", label: "Weight (kg)", type: "number" },
  ];

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-5 max-w-xl" noValidate>
      {fields.map(({ key, label, type = "text", required }) => (
        <div key={key} className="space-y-1.5">
          <Label htmlFor={key}>
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
          <Input
            id={key}
            type={type}
            step={type === "number" ? "any" : undefined}
            aria-invalid={!!errors[key]}
            {...register(key, { valueAsNumber: type === "number" })}
          />
          {errors[key] && <p className="text-xs text-destructive">{errors[key]?.message as string}</p>}
        </div>
      ))}

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : isEdit ? "Save Changes" : "Create Vehicle"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
