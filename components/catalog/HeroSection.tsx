import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden text-white py-20 md:py-32"
      style={{ background: "linear-gradient(140deg, #012147, #013467)" }}
    >
      {/* Geometric overlay matching original site */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: [
            "linear-gradient(125deg, transparent 0%, transparent 45%, #012a5e 45.5%)",
            "linear-gradient(230deg, transparent 0%, transparent 55%, #011834 55.5%)",
            "linear-gradient(140deg, #013a7c 0%, #013a7c 25%, transparent 25.5%)",
            "radial-gradient(circle at 70% 120%, #0066ff15 0%, transparent 45%)",
          ].join(", "),
        }}
        aria-hidden
      />

      <div className="container relative z-10">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-luzion-muted mb-6">
            Premium Urban Mobility
          </p>
          <h1 className="text-5xl md:text-7xl font-light leading-[1.05] tracking-tight mb-6">
            Configure
            <br />
            <span
              className="font-semibold"
              style={{ background: "linear-gradient(90deg, #4fa7ff 0%, #6ec0ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              Your Luzion
            </span>
          </h1>
          <p className="text-lg md:text-xl text-luzion-white max-w-xl leading-relaxed mb-10">
            Personalise every detail of your microcar. Choose your colour, wheels,
            and interior to create the perfect vehicle for your city.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              size="xl"
              className="text-white font-semibold touch-target border-0"
              style={{ background: "linear-gradient(90deg, #0066ff, #4fa7ff)" }}
            >
              <Link href="#models">
                Explore Models
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="border-[#4fa7ff]/40 text-[#4fa7ff] hover:bg-[#4fa7ff]/10 hover:text-[#6ec0ff] hover:border-[#4fa7ff]/70 touch-target">
              <Link href="/compare">Compare Models</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
