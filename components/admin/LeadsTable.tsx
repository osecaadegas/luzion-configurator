"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/lib/hooks/use-toast";
import { Loader2 } from "lucide-react";

const STATUSES = ["new", "contacted", "qualified", "closed", "lost"];

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
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
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-secondary/50">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Email</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Vehicle</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Date</th>
          </tr>
        </thead>
        <tbody>
          {leads.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-10 text-muted-foreground">No leads yet</td>
            </tr>
          ) : (
            leads.map((lead) => (
              <tr key={lead.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                <td className="px-4 py-3 font-medium">{lead.name}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{lead.email}</td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                  {lead.configuration?.vehicle
                    ? `${lead.configuration.vehicle.name} ${lead.configuration.vehicle.model}`
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  {updating === lead.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Select value={lead.status} onValueChange={(v) => handleStatusChange(lead.id, v)}>
                      <SelectTrigger className="h-8 w-28 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s} className="text-xs capitalize">
                            {s}
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
  );
}
