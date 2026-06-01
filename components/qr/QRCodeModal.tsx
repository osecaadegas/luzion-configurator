"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { generateQRDataUrl } from "@/lib/utils/qr";
import { Download } from "lucide-react";

interface QRCodeModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
  vehicleName: string;
}

export function QRCodeModal({ open, onClose, url, vehicleName }: QRCodeModalProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDataUrl(null);
    setError(false);
    generateQRDataUrl(url)
      .then(setDataUrl)
      .catch(() => setError(true));
  }, [open, url]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `luzion-${vehicleName.toLowerCase().replace(/\s+/g, "-")}-config.png`;
    a.click();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Share Configuration</DialogTitle>
          <DialogDescription>
            Scan this QR code to open your personalised {vehicleName} on any device.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {error ? (
            <p className="text-sm text-destructive">Could not generate QR code.</p>
          ) : dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dataUrl} alt="QR code for your configuration" className="rounded-lg w-56 h-56" />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center bg-secondary rounded-lg">
              <LoadingSpinner size="md" />
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center break-all max-w-xs">{url}</p>

          <Button onClick={handleDownload} disabled={!dataUrl} variant="outline" className="w-full touch-target">
            <Download className="h-4 w-4" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
