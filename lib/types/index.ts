// ─── Base Primitives ──────────────────────────────────────────────────────────

export type UUID = string;

// ─── Domain Models ────────────────────────────────────────────────────────────

export interface Brand {
  id: UUID;
  name: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: UUID;
  brand_id: UUID | null;
  brand?: Brand;
  name: string;
  model: string;
  description: string | null;
  base_price: number;
  range_km: number | null;
  motor_power_kw: number | null;
  battery_kwh: number | null;
  top_speed_kmh: number | null;
  seats: number | null;
  length_mm: number | null;
  width_mm: number | null;
  height_mm: number | null;
  weight_kg: number | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Relations
  colors?: VehicleColor[];
  wheels?: VehicleWheel[];
  interiors?: VehicleInterior[];
  images?: VehicleImage[];
}

export interface VehicleColor {
  id: UUID;
  vehicle_id: UUID;
  name: string;
  hex_code: string | null;
  price_modifier: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface VehicleWheel {
  id: UUID;
  vehicle_id: UUID;
  name: string;
  size: string | null;
  price_modifier: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface VehicleInterior {
  id: UUID;
  vehicle_id: UUID;
  name: string;
  material: string | null;
  price_modifier: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export type ViewType = "front" | "rear" | "side" | "interior" | "thumbnail";

export interface VehicleImage {
  id: UUID;
  vehicle_id: UUID;
  color_id: UUID | null;
  wheel_id: UUID | null;
  interior_id: UUID | null;
  view_type: ViewType;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

// ─── Configurator ─────────────────────────────────────────────────────────────

export interface ConfiguratorState {
  vehicleId: UUID;
  colorId: UUID | null;
  wheelId: UUID | null;
  interiorId: UUID | null;
  activeView: ViewType;
  totalPrice: number;
}

export interface SavedConfiguration {
  id: UUID;
  vehicle_id: UUID;
  vehicle?: Vehicle;
  color_id: UUID | null;
  color?: VehicleColor;
  wheel_id: UUID | null;
  wheel?: VehicleWheel;
  interior_id: UUID | null;
  interior?: VehicleInterior;
  total_price: number;
  share_token: string;
  created_at: string;
}

// ─── Leads ────────────────────────────────────────────────────────────────────

export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";

export interface Lead {
  id: UUID;
  configuration_id: UUID | null;
  configuration?: SavedConfiguration;
  name: string;
  email: string;
  phone: string | null;
  notes: string | null;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  data: T;
  error: null;
}

export interface ApiError {
  data: null;
  error: {
    message: string;
    code?: string;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalVehicles: number;
  activeVehicles: number;
  totalLeads: number;
  newLeads: number;
  totalConfigurations: number;
  recentLeads: Lead[];
}

// ─── Form Types ───────────────────────────────────────────────────────────────

export interface VehicleFormData {
  brand_id?: string;
  name: string;
  model: string;
  description?: string;
  base_price: number;
  range_km?: number;
  motor_power_kw?: number;
  battery_kwh?: number;
  top_speed_kmh?: number;
  seats?: number;
  length_mm?: number;
  width_mm?: number;
  height_mm?: number;
  weight_kg?: number;
  is_active: boolean;
}

export interface ColorFormData {
  name: string;
  hex_code?: string;
  price_modifier: number;
}

export interface WheelFormData {
  name: string;
  size?: string;
  price_modifier: number;
}

export interface InteriorFormData {
  name: string;
  material?: string;
  price_modifier: number;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
}

// ─── Comparison ───────────────────────────────────────────────────────────────

export interface ComparisonSpec {
  label: string;
  key: keyof Vehicle;
  format?: (value: unknown) => string;
  unit?: string;
}
