"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import type { VehicleImage, ViewType } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface VehicleViewerProps {
  images: VehicleImage[];
  activeView: ViewType;
  vehicleName: string;
}

export function VehicleViewer({ images, activeView, vehicleName }: VehicleViewerProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const currentImage = images.find((img) => img.view_type === activeView)
    ?? images[0];

  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleError = useCallback(() => { setError(true); setLoaded(true); }, []);

  return (
    <div className="relative w-full aspect-[4/3] md:aspect-[16/10] bg-secondary rounded-xl overflow-hidden configurator-image">
      {/* Loading overlay */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-secondary">
          <LoadingSpinner size="md" />
        </div>
      )}

      {currentImage && !error ? (
        <Image
          key={currentImage.id} // Force re-mount on image change for transition
          src={currentImage.image_url}
          alt={currentImage.alt_text ?? `${vehicleName} — ${activeView} view`}
          fill
          priority
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "object-contain transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0"
          )}
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl font-light tracking-[0.3em] uppercase text-muted-foreground/20 select-none">
            {vehicleName}
          </span>
        </div>
      )}
    </div>
  );
}
