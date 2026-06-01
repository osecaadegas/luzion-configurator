"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LeadModal } from "@/components/lead-capture/LeadModal";

interface QuoteButtonProps {
  vehicleName: string;
}

export function QuoteButton({ vehicleName }: QuoteButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        className="w-full touch-target"
        onClick={() => setOpen(true)}
      >
        Request a Quote
      </Button>
      <LeadModal
        open={open}
        onClose={() => setOpen(false)}
        vehicleName={vehicleName}
      />
    </>
  );
}
