import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Luzion — Premium Microcar Configurator",
    template: "%s | Luzion",
  },
  description:
    "Configure your Luzion microcar. Choose your color, wheels, and interior. Experience premium urban mobility.",
  keywords: ["microcar", "electric vehicle", "configurator", "Luzion", "EV", "showroom"],
  openGraph: {
    type: "website",
    siteName: "Luzion",
    title: "Luzion — Premium Microcar Configurator",
    description: "Configure your Luzion microcar. Premium urban mobility.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Prevent double-tap zoom on kiosk/tablet
  themeColor: "#011834",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
