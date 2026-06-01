"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground mt-2 max-w-xs">{error.message || "An unexpected error occurred."}</p>
      <div className="flex gap-3 mt-8">
        <Button onClick={reset} size="lg" className="touch-target">Try Again</Button>
        <Button asChild variant="outline" size="lg" className="touch-target">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
