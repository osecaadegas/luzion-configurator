import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ data: null, error: { message: "Unauthorized" } }, { status: 401 });
  }

  // Run all counts in parallel
  const [vehiclesRes, leadsRes, configsRes, recentLeadsRes] = await Promise.all([
    supabase.from("vehicles").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase.from("saved_configurations").select("id", { count: "exact", head: true }),
    supabase
      .from("leads")
      .select("id, name, email, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return NextResponse.json({
    data: {
      total_vehicles: vehiclesRes.count ?? 0,
      total_leads: leadsRes.count ?? 0,
      total_configurations: configsRes.count ?? 0,
      recent_leads: recentLeadsRes.data ?? [],
    },
    error: null,
  });
}
