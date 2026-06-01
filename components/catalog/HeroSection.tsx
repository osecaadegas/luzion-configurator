import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-luzion-charcoal text-white py-20 md:py-32">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />

      <div className="container relative z-10">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-luzion-silver mb-6">
            Premium Urban Mobility
          </p>
          <h1 className="text-5xl md:text-7xl font-light leading-[1.05] tracking-tight mb-6">
            Configure
            <br />
            <span className="font-semibold">Your Luzion</span>
          </h1>
          <p className="text-lg md:text-xl text-luzion-silver max-w-xl leading-relaxed mb-10">
            Personalise every detail of your microcar. Choose your colour, wheels,
            and interior to create the perfect vehicle for your city.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="xl" className="bg-white text-black hover:bg-white/90 touch-target">
              <Link href="#models">
                Explore Models
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white touch-target">
              <Link href="/compare">Compare Models</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
