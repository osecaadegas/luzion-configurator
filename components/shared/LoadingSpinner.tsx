import { cn } from "@/lib/utils/cn";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
};

export function LoadingSpinner({ size = "md", className, label }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label ?? "Loading"}
      className={cn("flex items-center justify-center", className)}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-border border-t-foreground",
          sizeMap[size]
        )}
      />
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}

export function FullPageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-muted-foreground animate-pulse">{label}</p>
    </div>
  );
}
