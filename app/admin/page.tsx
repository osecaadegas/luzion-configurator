import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatDate } from "@/lib/utils/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Users, Link2, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard — Luzion Admin" };
export const revalidate = 0;

async function getStats() {
  const supabase = await createClient();
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
  return {
    vehicles: vehiclesRes.count ?? 0,
    leads: leadsRes.count ?? 0,
    configs: configsRes.count ?? 0,
    recentLeads: recentLeadsRes.data ?? [],
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "Vehicles", value: stats.vehicles, icon: Car },
    { label: "Leads", value: stats.leads, icon: Users },
    { label: "Configurations", value: stats.configs, icon: Link2 },
    { label: "Conversion", value: `${stats.leads > 0 && stats.configs > 0 ? ((stats.leads / stats.configs) * 100).toFixed(1) : 0}%`, icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your showroom activity</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent leads */}
      <div>
        <h2 className="text-base font-semibold mb-4">Recent Leads</h2>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentLeads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-muted-foreground">No leads yet</td>
                </tr>
              ) : (
                stats.recentLeads.map((lead: any) => (
                  <tr key={lead.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{lead.name}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{lead.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-secondary capitalize">
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {formatDate(lead.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
