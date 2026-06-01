import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/vehicles/[id]/options — create a color, wheel, or interior option
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id: vehicleId } = await params;
  const supabase = await createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ data: null, error: { message: "Unauthorized" } }, { status: 401 });
  }

  const body = await request.json();
  const { type, ...optionData } = body as { type: "color" | "wheel" | "interior"; [key: string]: unknown };

  const tableMap = {
    color: "vehicle_colors",
    wheel: "vehicle_wheels",
    interior: "vehicle_interiors",
  } as const;

  const table = tableMap[type];
  if (!table) {
    return NextResponse.json({ data: null, error: { message: "Invalid option type" } }, { status: 400 });
  }

  const { data, error } = await supabase
    .from(table)
    .insert({ ...optionData, vehicle_id: vehicleId })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ data: null, error: { message: error.message } }, { status: 400 });
  }

  return NextResponse.json({ data, error: null }, { status: 201 });
}
