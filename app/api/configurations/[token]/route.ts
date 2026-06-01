import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ token: string }>;
}

// GET /api/configurations/[token] — retrieve a saved configuration by share token
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { token } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("saved_configurations")
    .select(
      `
      *,
      vehicle:vehicles(*, brand:brands(*), images:vehicle_images(*)),
      color:vehicle_colors(*),
      wheel:vehicle_wheels(*),
      interior:vehicle_interiors(*)
    `
    )
    .eq("share_token", token)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { data: null, error: { message: "Configuration not found" } },
      { status: 404 }
    );
  }

  return NextResponse.json({ data, error: null }, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
