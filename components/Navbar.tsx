"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-amber-950 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-3xl">🍽️</span>
            <span className="text-2xl font-extrabold text-amber-400 tracking-tight group-hover:text-amber-300 transition-colors">
              Heyday
            </span>
            <span className="hidden sm:inline text-amber-200 text-sm font-medium">
              Food Court
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className="text-amber-200 hover:text-amber-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/restaurant/all-american-grill"
              className="hover:text-amber-400 transition-colors text-white/80"
            >
              🍔 American
            </Link>
            <Link
              href="/restaurant/sakura-garden"
              className="hover:text-amber-400 transition-colors text-white/80"
            >
              🌸 Asian
            </Link>
            <Link
              href="/restaurant/spice-route"
              className="hover:text-amber-400 transition-colors text-white/80"
            >
              🌶️ Indian
            </Link>
            <Link
              href="/restaurant/trattoria-roma"
              className="hover:text-amber-400 transition-colors text-white/80"
            >
              🍝 Italian
            </Link>
            <Link
              href="/restaurant/el-rancho"
              className="hover:text-amber-400 transition-colors text-white/80"
            >
              🌮 Mexican
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-amber-200 hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-amber-900 px-4 py-3 space-y-2 text-sm">
          {[
            { href: "/", label: "🏠 Home" },
            { href: "/restaurant/all-american-grill", label: "🍔 The All-American Grill" },
            { href: "/restaurant/sakura-garden", label: "🌸 Sakura Garden" },
            { href: "/restaurant/spice-route", label: "🌶️ Spice Route" },
            { href: "/restaurant/trattoria-roma", label: "🍝 Trattoria Roma" },
            { href: "/restaurant/el-rancho", label: "🌮 El Rancho" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-amber-200 hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
