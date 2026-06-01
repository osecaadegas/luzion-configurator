"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { BarChart3, ArrowLeftRight } from "lucide-react";

const navLinks = [
  { href: "/", label: "Models" },
  { href: "/compare", label: "Compare", icon: ArrowLeftRight },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="Luzion Home"
        >
          <Image
            src="/logo.png"
            alt="Luzion"
            width={120}
            height={36}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        {/* Primary navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === href
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          {/* Mobile nav */}
          <nav className="flex md:hidden items-center gap-1" aria-label="Mobile navigation">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === href
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span className="sr-only md:not-sr-only">{label}</span>
              </Link>
            ))}
          </nav>
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <Link href="/admin">
              <BarChart3 className="h-4 w-4" />
              Admin
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
