import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/leads/[id] — update lead status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ data: null, error: { message: "Unauthorized" } }, { status: 401 });
  }

  const body = await request.json();

  // Whitelist updatable fields to prevent mass-assignment
  const allowed = ["status", "notes"] as const;
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  const { data, error } = await supabase
    .from("leads")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ data: null, error: { message: error.message } }, { status: 400 });
  }

  return NextResponse.json({ data, error: null });
}

// DELETE /api/leads/[id] — admin only
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ data: null, error: { message: "Unauthorized" } }, { status: 401 });
  }

  const { error } = await supabase.from("leads").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ data: null, error: { message: error.message } }, { status: 400 });
  }

  return new NextResponse(null, { status: 204 });
}
