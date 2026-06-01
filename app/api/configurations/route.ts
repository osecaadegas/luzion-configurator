import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const configSchema = z.object({
  vehicle_id: z.string().uuid(),
  color_id: z.string().uuid().nullable().optional(),
  wheel_id: z.string().uuid().nullable().optional(),
  interior_id: z.string().uuid().nullable().optional(),
  total_price: z.number().min(0),
});

// POST /api/configurations — save a configuration and return the share token
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const parse = configSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json(
      { data: null, error: { message: parse.error.issues[0].message } },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("saved_configurations")
    .insert(parse.data)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ data: null, error: { message: error.message } }, { status: 500 });
  }

  return NextResponse.json({ data, error: null }, { status: 201 });
}
