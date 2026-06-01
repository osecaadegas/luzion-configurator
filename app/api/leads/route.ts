import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { leadSchema } from "@/lib/validators/schemas";

// POST /api/leads — submit a new lead
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const parse = leadSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json(
      { data: null, error: { message: parse.error.issues[0].message } },
      { status: 400 }
    );
  }

  const { configuration_id, ...leadData } = body as typeof parse.data & { configuration_id?: string };

  const insertPayload: Record<string, unknown> = { ...leadData };
  if (configuration_id) {
    insertPayload.configuration_id = configuration_id;
  }

  const { data, error } = await supabase
    .from("leads")
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ data: null, error: { message: error.message } }, { status: 500 });
  }

  return NextResponse.json({ data, error: null }, { status: 201 });
}

// GET /api/leads — admin only, list all leads
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ data: null, error: { message: "Unauthorized" } }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") ?? "50", 10);
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from("leads")
    .select(
      `*, configuration:saved_configurations(*, vehicle:vehicles(name, model))`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ data: null, error: { message: error.message } }, { status: 500 });
  }

  return NextResponse.json({ data, error: null, count, page, pageSize });
}
