"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils/format";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/lib/hooks/use-toast";
import { Loader2 } from "lucide-react";

const STATUSES = ["new", "contacted", "qualified", "converted", "lost"] as const;

const STATUS_DOT: Record<string, string> = {
  new:       "bg-blue-400",
  contacted: "bg-amber-400",
  qualified: "bg-violet-400",
  converted: "bg-green-400",
  lost:      "bg-red-400",
};

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  status: string;
  created_at: string;
  configuration?: { vehicle?: { name: string; model: string } } | null;
}

export function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchLeads = () => {
    setLoading(true);
    fetch("/api/leads")
      .then((r) => r.json())
      .then(({ data }) => setLeads(data ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(fetchLeads, []);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating(id);
    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setUpdating(null);

    if (!res.ok) {
      toast({ title: "Error", description: "Could not update lead status.", variant: "destructive" });
      return;
    }
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    toast({ title: "Status updated" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {leads.length > 0 && (
        <p className="text-xs text-muted-foreground">{leads.length} lead{leads.length !== 1 ? "s" : ""}</p>
      )}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Email</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Phone</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden xl:table-cell">Vehicle</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-muted-foreground">No leads yet</td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium">{lead.name}</div>
                    {lead.notes && (
                      <div className="text-xs text-muted-foreground mt-0.5 max-w-[200px] truncate" title={lead.notes}>
                        {lead.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{lead.email}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{lead.phone || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden xl:table-cell">
                    {lead.configuration?.vehicle
                      ? `${lead.configuration.vehicle.name} ${lead.configuration.vehicle.model}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {updating === lead.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Select value={lead.status} onValueChange={(v) => handleStatusChange(lead.id, v)}>
                        <SelectTrigger className="h-8 w-36 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className={`h-2 w-2 rounded-full flex-shrink-0 ${STATUS_DOT[lead.status] ?? "bg-muted"}`} />
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">
                              <div className="flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full flex-shrink-0 ${STATUS_DOT[s]}`} />
                                <span className="capitalize">{s}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                    {formatDate(lead.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
