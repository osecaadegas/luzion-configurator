import { z } from "zod";

// ─── Vehicle ──────────────────────────────────────────────────────────────────

export const vehicleSchema = z.object({
  brand_id: z.string().uuid().optional().nullable(),
  name: z.string().min(1, "Name is required").max(100),
  model: z.string().min(1, "Model is required").max(100),
  description: z.string().max(2000).optional().nullable(),
  base_price: z.coerce.number().min(0, "Price must be positive"),
  range_km: z.coerce.number().int().positive().optional().nullable(),
  motor_power_kw: z.coerce.number().int().positive().optional().nullable(),
  battery_kwh: z.coerce.number().positive().optional().nullable(),
  top_speed_kmh: z.coerce.number().int().positive().optional().nullable(),
  seats: z.coerce.number().int().min(1).max(9).optional().nullable(),
  length_mm: z.coerce.number().int().positive().optional().nullable(),
  width_mm: z.coerce.number().int().positive().optional().nullable(),
  height_mm: z.coerce.number().int().positive().optional().nullable(),
  weight_kg: z.coerce.number().int().positive().optional().nullable(),
  is_active: z.boolean().default(true),
});

export type VehicleSchema = z.infer<typeof vehicleSchema>;

// ─── Color Option ─────────────────────────────────────────────────────────────

export const colorSchema = z.object({
  name: z.string().min(1, "Color name is required").max(80),
  hex_code: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color e.g. #1A2B3C")
    .optional()
    .nullable(),
  price_modifier: z.coerce.number().default(0),
});

export type ColorSchema = z.infer<typeof colorSchema>;

// ─── Wheel Option ─────────────────────────────────────────────────────────────

export const wheelSchema = z.object({
  name: z.string().min(1, "Wheel name is required").max(80),
  size: z.string().max(20).optional().nullable(),
  price_modifier: z.coerce.number().default(0),
});

export type WheelSchema = z.infer<typeof wheelSchema>;

// ─── Interior Option ──────────────────────────────────────────────────────────

export const interiorSchema = z.object({
  name: z.string().min(1, "Interior name is required").max(80),
  material: z.string().max(80).optional().nullable(),
  price_modifier: z.coerce.number().default(0),
});

export type InteriorSchema = z.infer<typeof interiorSchema>;

// ─── Lead Capture ─────────────────────────────────────────────────────────────

export const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^[+\d\s\-()]{7,20}$/, "Please enter a valid phone number")
    .optional()
    .nullable()
    .or(z.literal("")),
  notes: z.string().max(500).optional().nullable(),
});

export type LeadSchema = z.infer<typeof leadSchema>;

// ─── Brand ────────────────────────────────────────────────────────────────────

export const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required").max(100),
});

export type BrandSchema = z.infer<typeof brandSchema>;

// ─── Image Upload ─────────────────────────────────────────────────────────────

export const imageUploadSchema = z.object({
  vehicle_id: z.string().uuid(),
  color_id: z.string().uuid().optional().nullable(),
  wheel_id: z.string().uuid().optional().nullable(),
  interior_id: z.string().uuid().optional().nullable(),
  view_type: z.enum(["front", "rear", "side", "interior", "thumbnail"]),
  alt_text: z.string().max(200).optional().nullable(),
});

export type ImageUploadSchema = z.infer<typeof imageUploadSchema>;
