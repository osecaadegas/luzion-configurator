"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LeadForm } from "./LeadForm";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeadModalProps {
  open: boolean;
  onClose: () => void;
  vehicleName: string;
  configurationId?: string;
}

export function LeadModal({ open, onClose, vehicleName, configurationId }: LeadModalProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request a Quote</DialogTitle>
          <DialogDescription>
            {submitted
              ? "Your request has been received."
              : `Fill in your details and our team will get back to you about the ${vehicleName}.`}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle2 className="h-14 w-14 text-green-500" aria-hidden />
            <p className="text-center text-sm text-muted-foreground">
              Thank you! A Luzion specialist will contact you within 24 hours.
            </p>
            <Button onClick={handleClose} variant="outline" className="w-full touch-target">
              Close
            </Button>
          </div>
        ) : (
          <LeadForm
            vehicleName={vehicleName}
            configurationId={configurationId}
            onSuccess={() => setSubmitted(true)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
