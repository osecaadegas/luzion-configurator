import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { SavedConfiguration } from "@/lib/types";

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  return {
    title: `Saved Configuration — Luzion`,
    description: `View a saved Luzion vehicle configuration (${token.slice(0, 8)}…)`,
  };
}

export const revalidate = 3600;

async function getConfig(token: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("saved_configurations")
    .select(
      `*, vehicle:vehicles(*, brand:brands(*)), color:vehicle_colors(*), wheel:vehicle_wheels(*), interior:vehicle_interiors(*)`
    )
    .eq("share_token", token)
    .single();

  if (error || !data) return null;
  return data as SavedConfiguration & Record<string, unknown>;
}

export default async function SharePage({ params }: Props) {
  const { token } = await params;
  const config = await getConfig(token);

  if (!config) notFound();

  const vehicle = config.vehicle as (typeof config)["vehicle"] & { brand?: { name: string }; name: string; model: string };
  const color = config.color as { name?: string; hex_code?: string } | null;
  const wheel = config.wheel as { name?: string } | null;
  const interior = config.interior as { name?: string } | null;

  const thumbnail = (vehicle as any).images?.find((img: any) => img.view_type === "thumbnail")
    ?? (vehicle as any).images?.[0];

  return (
    <div className="container py-16 max-w-2xl">
      <div className="rounded-xl border border-border overflow-hidden">
        {/* Hero image */}
        {thumbnail && (
          <div className="relative aspect-[16/9] bg-secondary">
            <Image
              src={thumbnail.image_url}
              alt={thumbnail.alt_text ?? vehicle.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="p-8 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{(vehicle as any).brand?.name}</p>
            <h1 className="text-3xl font-semibold mt-1">
              {vehicle.name}{" "}
              <span className="font-light text-muted-foreground">{vehicle.model}</span>
            </h1>
          </div>

          <Separator />

          {/* Configuration details */}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {color?.name && (
              <>
                <dt className="text-muted-foreground">Colour</dt>
                <dd className="flex items-center gap-2 font-medium">
                  {color.hex_code && (
                    <span
                      className="inline-block h-4 w-4 rounded-full border border-border"
                      style={{ backgroundColor: color.hex_code }}
                    />
                  )}
                  {color.name}
                </dd>
              </>
            )}
            {wheel?.name && (
              <>
                <dt className="text-muted-foreground">Wheels</dt>
                <dd className="font-medium">{wheel.name}</dd>
              </>
            )}
            {interior?.name && (
              <>
                <dt className="text-muted-foreground">Interior</dt>
                <dd className="font-medium">{interior.name}</dd>
              </>
            )}
          </dl>

          <Separator />

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total price</span>
            <span className="text-3xl font-semibold">{formatPrice(config.total_price)}</span>
          </div>

          <Button asChild size="lg" className="w-full touch-target">
            <Link href={`/configure/${(vehicle as any).id}`}>Reconfigure This Model</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
