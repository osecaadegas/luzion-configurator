import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/vehicles/[id]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicles")
    .select(
      `
      *,
      brand:brands(*),
      colors:vehicle_colors(*),
      wheels:vehicle_wheels(*),
      interiors:vehicle_interiors(*),
      images:vehicle_images(*)
    `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { data: null, error: { message: error?.message ?? "Not found" } },
      { status: 404 }
    );
  }

  return NextResponse.json({ data, error: null }, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}

// PATCH /api/vehicles/[id]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ data: null, error: { message: "Unauthorized" } }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("vehicles")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ data: null, error: { message: error.message } }, { status: 400 });
  }

  return NextResponse.json({ data, error: null });
}

// DELETE /api/vehicles/[id]
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ data: null, error: { message: "Unauthorized" } }, { status: 401 });
  }

  const { error } = await supabase.from("vehicles").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ data: null, error: { message: error.message } }, { status: 400 });
  }

  return new NextResponse(null, { status: 204 });
}
