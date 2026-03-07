"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/register", label: "Register", icon: "👤" },
  { href: "/itinerary", label: "Itinerary", icon: "🗓" },
  { href: "/analysis", label: "Analysis", icon: "📊" },
  { href: "/dashboard", label: "Dashboard", icon: "📱" },
];

export function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Top bar: logo + hamburger (mobile) */}
      <nav className="sticky top-0 z-50 border-b border-slate-700/50 bg-safetrax-navy/95 backdrop-blur safe-area-top">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-display text-xl font-semibold text-safetrax-mint">
            SafeTraX
          </Link>
          {/* Desktop: horizontal links */}
          <ul className="hidden gap-4 md:flex">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={
                    pathname === href
                      ? "text-safetrax-teal font-medium"
                      : "text-slate-400 hover:text-slate-200"
                  }
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          {/* Mobile: hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-10 w-10 touch-manipulation items-center justify-center rounded-lg text-slate-300 hover:bg-slate-700/50 md:hidden"
            aria-label="Menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
        {/* Mobile dropdown menu */}
        {menuOpen && (
          <ul className="border-t border-slate-700/50 px-4 py-3 md:hidden">
            {links.map(({ href, label, icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-base ${
                    pathname === href
                      ? "bg-safetrax-teal/20 text-safetrax-teal"
                      : "text-slate-300"
                  }`}
                >
                  <span className="text-lg">{icon}</span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>

      {/* Bottom nav (mobile only): large touch targets */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-700/50 bg-safetrax-navy/95 backdrop-blur safe-area-bottom md:hidden"
        aria-label="Main"
      >
        <ul className="flex justify-around px-2 py-2">
          {links.map(({ href, label, icon }) => (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-lg py-1 text-xs transition active:bg-slate-700/50 ${
                  pathname === href ? "text-safetrax-teal" : "text-slate-400"
                }`}
              >
                <span className="text-lg leading-none">{icon}</span>
                <span className="leading-tight">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
