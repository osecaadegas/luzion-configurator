"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema } from "@/lib/validators/schemas";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  vehicleName: string;
  configurationId?: string;
  onSuccess: () => void;
}

export function LeadForm({ vehicleName, configurationId, onSuccess }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({ resolver: zodResolver(leadSchema) });

  const onSubmit = async (data: LeadFormData) => {
    const payload: Record<string, unknown> = { ...data };
    if (configurationId) payload.configuration_id = configurationId;

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Submission failed");
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <input type="hidden" name="vehicle_name" value={vehicleName} readOnly className="hidden" />

      <div className="space-y-1.5">
        <Label htmlFor="lead-name">Full name *</Label>
        <Input
          id="lead-name"
          placeholder="Your name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="lead-email">Email *</Label>
        <Input
          id="lead-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="lead-phone">Phone</Label>
        <Input
          id="lead-phone"
          type="tel"
          placeholder="+351 912 345 678"
          autoComplete="tel"
          aria-invalid={!!errors.phone}
          {...register("phone")}
        />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="lead-notes">Message</Label>
        <Textarea
          id="lead-notes"
          placeholder="Any questions or notes for our team?"
          {...register("notes")}
        />
      </div>

      <Button type="submit" size="lg" className="w-full touch-target" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Send Request"
        )}
      </Button>
    </form>
  );
}
