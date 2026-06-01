import { toDataURL } from "qrcode";

/**
 * Generate a QR code as a PNG data URL.
 */
export async function generateQRDataUrl(url: string): Promise<string> {
  return toDataURL(url, {
    width: 320,
    margin: 2,
    color: {
      dark: "#0A0A0A",
      light: "#FAFAFA",
    },
  });
}
