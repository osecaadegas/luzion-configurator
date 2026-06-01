import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/vehicles — list all active vehicles
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;
  const includeInactive = searchParams.get("includeInactive") === "true";

  const query = supabase
    .from("vehicles")
    .select(
      `
      *,
      brand:brands(*),
      colors:vehicle_colors(*)  ,
      wheels:vehicle_wheels(*),
      interiors:vehicle_interiors(*),
      images:vehicle_images(*)
    `
    )
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (!includeInactive) {
    query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ data: null, error: { message: error.message } }, { status: 500 });
  }

  return NextResponse.json({ data, error: null }, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}

// POST /api/vehicles — create a vehicle (admin only)
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ data: null, error: { message: "Unauthorized" } }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("vehicles")
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ data: null, error: { message: error.message } }, { status: 400 });
  }

  return NextResponse.json({ data, error: null }, { status: 201 });
}
