import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-extralight text-muted-foreground/30 select-none">404</p>
      <h1 className="text-2xl font-semibold mt-4">Page not found</h1>
      <p className="text-muted-foreground mt-2 max-w-xs">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="mt-8 touch-target" size="lg">
        <Link href="/">Back to Models</Link>
      </Button>
    </div>
  );
}
