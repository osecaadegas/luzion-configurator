import { cn } from "@/lib/utils/cn";

type PlaceholderVariant = "hero" | "viewer" | "card";

interface VehicleImagePlaceholderProps {
  title: string;
  subtitle?: string;
  label?: string;
  tags?: string[];
  variant?: PlaceholderVariant;
  className?: string;
}

const variantClasses: Record<PlaceholderVariant, { shell: string; title: string; copy: string }> = {
  hero: {
    shell: "min-h-[320px] sm:min-h-[360px] lg:min-h-[440px] rounded-[28px] border-white/15 shadow-[0_32px_80px_rgba(1,24,52,0.45)]",
    title: "text-3xl sm:text-4xl",
    copy: "max-w-sm",
  },
  viewer: {
    shell: "h-full min-h-[320px] rounded-[inherit] border-white/10",
    title: "text-2xl sm:text-3xl",
    copy: "max-w-xs sm:max-w-sm",
  },
  card: {
    shell: "h-full rounded-[inherit] border-white/10",
    title: "text-lg sm:text-xl",
    copy: "max-w-[18rem]",
  },
};

export function VehicleImagePlaceholder({
  title,
  subtitle = "Photo preview placeholder",
  label = "Concept render",
  tags = ["Exterior", "Interior", "Details"],
  variant = "viewer",
  className,
}: VehicleImagePlaceholderProps) {
  const styles = variantClasses[variant];

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden border bg-[#03162f] text-white",
        styles.shell,
        className
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(circle at 15% 20%, rgba(79,167,255,0.30), transparent 28%)",
            "radial-gradient(circle at 78% 25%, rgba(110,192,255,0.22), transparent 24%)",
            "linear-gradient(145deg, rgba(1,24,52,1) 0%, rgba(1,42,94,1) 48%, rgba(1,52,103,1) 100%)",
          ].join(", "),
        }}
      />
      <div
        className="absolute inset-5 rounded-[24px] border border-white/10 opacity-70"
        style={{
          backgroundImage: [
            "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 28%)",
            "linear-gradient(0deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "auto, 100% 32px, 32px 100%",
        }}
      />
      <div className="absolute -right-10 top-12 h-40 w-40 rounded-full bg-[#4fa7ff]/20 blur-3xl" />
      <div className="absolute bottom-10 left-10 h-28 w-28 rounded-full bg-[#6ec0ff]/10 blur-3xl" />

      <div className="absolute left-1/2 top-[45%] w-[74%] max-w-[520px] -translate-x-1/2 -translate-y-1/2">
        <div className="mx-auto h-5 w-[34%] rounded-full border border-white/15 bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]" />
        <div className="mt-2 rounded-[2rem] border border-white/15 bg-gradient-to-r from-white/10 via-white/20 to-white/10 px-5 py-4 shadow-[0_24px_60px_rgba(1,24,52,0.3)]">
          <div className="h-10 rounded-[1.5rem] border border-white/10 bg-[linear-gradient(90deg,rgba(255,255,255,0.06),rgba(255,255,255,0.16),rgba(255,255,255,0.06))]" />
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="h-2 rounded-full bg-white/20" />
            <div className="h-2 rounded-full bg-white/10" />
            <div className="h-2 rounded-full bg-white/20" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between px-[9%]">
          <div className="h-12 w-12 rounded-full border-[5px] border-white/20 bg-[#03162f] shadow-[0_0_0_1px_rgba(255,255,255,0.05)]" />
          <div className="h-12 w-12 rounded-full border-[5px] border-white/20 bg-[#03162f] shadow-[0_0_0_1px_rgba(255,255,255,0.05)]" />
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-white/80 backdrop-blur-sm">
            {label}
          </span>
          <span className="text-[0.65rem] uppercase tracking-[0.32em] text-white/45">
            Luzion Preview
          </span>
        </div>

        <div className={cn("space-y-3", styles.copy)}>
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-[#cfe6ff]/70">
              {subtitle}
            </p>
            <p className={cn("mt-2 font-semibold tracking-tight text-white", styles.title)}>
              {title}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-black/15 px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-white/70 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}