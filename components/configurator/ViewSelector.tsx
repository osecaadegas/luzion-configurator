"use client";

import type { ViewType } from "@/lib/types";
import { useConfiguratorStore } from "@/lib/hooks/use-configurator";
import { cn } from "@/lib/utils/cn";
import { Eye } from "lucide-react";

const VIEWS: { value: ViewType; label: string }[] = [
  { value: "front", label: "Front" },
  { value: "side", label: "Side" },
  { value: "rear", label: "Rear" },
  { value: "interior", label: "Interior" },
];

export function ViewSelector() {
  const { activeView, setActiveView } = useConfiguratorStore();

  return (
    <div className="flex gap-2" role="tablist" aria-label="Vehicle view">
      {VIEWS.map(({ value, label }) => (
        <button
          key={value}
          role="tab"
          aria-selected={activeView === value}
          onClick={() => setActiveView(value)}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 h-11 rounded-md text-sm font-medium transition-colors",
            "border touch-target",
            activeView === value
              ? "bg-foreground text-background border-foreground"
              : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground"
          )}
        >
          <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {label}
        </button>
      ))}
    </div>
  );
}
