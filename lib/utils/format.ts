/**
 * Format a number as currency (EUR by default).
 */
export function formatPrice(
  value: number,
  locale = "de-DE",
  currency = "EUR"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number with unit suffix.
 */
export function formatSpec(value: number | null | undefined, unit: string): string {
  if (value == null) return "—";
  return `${value.toLocaleString("de-DE")} ${unit}`;
}

/**
 * Format motor power: kW + HP equivalent.
 */
export function formatPower(kw: number | null | undefined): string {
  if (kw == null) return "—";
  const hp = Math.round(kw * 1.341);
  return `${kw} kW / ${hp} hp`;
}

/**
 * Format dimensions as L × W × H mm.
 */
export function formatDimensions(
  l: number | null | undefined,
  w: number | null | undefined,
  h: number | null | undefined
): string {
  if (!l && !w && !h) return "—";
  const parts = [l, w, h].map((v) => (v != null ? v.toLocaleString("de-DE") : "—"));
  return `${parts[0]} × ${parts[1]} × ${parts[2]} mm`;
}

/**
 * Truncate text to a given length with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "…";
}

/**
 * Generate the shareable configurator URL.
 */
export function buildShareUrl(token: string, baseUrl?: string): string {
  const base = baseUrl ?? (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/share/${token}`;
}

/**
 * Format a date string to a readable format.
 */
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

/**
 * Convert hex color to a CSS background-color style value.
 */
export function hexToStyle(hex: string | null | undefined): string {
  return hex ? hex : "transparent";
}

/**
 * Return whether a hex color is considered "light" (for contrast).
 */
export function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  // Perceived luminance
  return r * 0.299 + g * 0.587 + b * 0.114 > 186;
}
