"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const openChat = () => {
    window.dispatchEvent(new Event("heyday:open-chat"));
    setMobileOpen(false);
  };

  return (
    <header className="bg-amber-950 text-white shadow-lg sticky top-0 z-40 border-b border-amber-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <span className="text-2xl">🍽️</span>
            <span className="text-xl font-black text-amber-400 tracking-tight group-hover:text-amber-300 transition-colors">
              Heyday
            </span>
            <span className="hidden sm:inline text-amber-700 text-sm font-medium">Food Court</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {[
              { href: "/restaurant/all-american-grill", label: "🍔 American" },
              { href: "/restaurant/sakura-garden", label: "🌸 Asian" },
              { href: "/restaurant/spice-route", label: "🌶️ Indian" },
              { href: "/restaurant/trattoria-roma", label: "🍝 Italian" },
              { href: "/restaurant/el-rancho", label: "🌮 Mexican" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
              >
                {link.label}
              </Link>
            ))}

            {/* Ask AI button */}
            <button
              onClick={openChat}
              className="ml-3 flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 hover:border-amber-400/50 text-amber-300 hover:text-amber-200 rounded-full px-4 py-1.5 transition-all cursor-pointer"
            >
              ✨ Ask AI
            </button>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-amber-200 hover:text-white p-2 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-amber-900/80 backdrop-blur px-4 py-3 space-y-1 text-sm border-t border-amber-800/50">
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
              className="block px-3 py-2 rounded-lg text-amber-200 hover:text-white hover:bg-white/10 transition-all"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={openChat}
            className="w-full text-left px-3 py-2 rounded-lg text-amber-300 hover:text-amber-200 hover:bg-white/10 transition-all cursor-pointer"
          >
            ✨ Ask AI Guide
          </button>
        </div>
      )}
    </header>
  );
}
