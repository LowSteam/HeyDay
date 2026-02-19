"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import MenuItemCard from "@/components/MenuItemCard";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  price: number;
  category: string;
  tags: string[];
}

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  cuisine: string;
  description: string;
  emoji: string;
  color: string;
  menuItems: MenuItem[];
}

const CATEGORIES = ["All", "Appetizer", "Main", "Side", "Dessert", "Drink"];

const colorMap: Record<string, { header: string; badge: string; tab: string }> = {
  red: { header: "bg-red-900", badge: "bg-red-700 text-red-100", tab: "bg-red-700 text-white" },
  pink: { header: "bg-pink-900", badge: "bg-pink-700 text-pink-100", tab: "bg-pink-700 text-white" },
  orange: { header: "bg-orange-900", badge: "bg-orange-700 text-orange-100", tab: "bg-orange-700 text-white" },
  green: { header: "bg-green-900", badge: "bg-green-700 text-green-100", tab: "bg-green-700 text-white" },
  yellow: { header: "bg-yellow-800", badge: "bg-yellow-700 text-yellow-100", tab: "bg-yellow-700 text-white" },
};

export default function RestaurantPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/restaurants/${slug}/menu`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setRestaurant(data);
      })
      .catch(() => setError("Failed to load restaurant"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl animate-pulse mb-4">🍽️</p>
          <p className="text-stone-400">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-stone-600 text-lg mb-4">{error ?? "Restaurant not found"}</p>
          <Link href="/" className="text-amber-600 hover:text-amber-700 font-semibold underline">
            ← Back to all restaurants
          </Link>
        </div>
      </div>
    );
  }

  const colors = colorMap[restaurant.color] ?? colorMap.orange;

  const availableCategories = CATEGORIES.filter((cat) => {
    if (cat === "All") return true;
    return restaurant.menuItems.some((item) => item.category === cat);
  });

  const filtered = restaurant.menuItems.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Restaurant header */}
      <div className={`${colors.header} text-white py-14 px-4 relative overflow-hidden`}>
        <div className="absolute inset-0 flex items-end justify-end opacity-[0.05] text-[14rem] select-none pointer-events-none pr-4 pb-0 leading-none">
          {restaurant.emoji}
        </div>
        <div className="relative max-w-7xl mx-auto">
          <Link
            href="/"
            className="text-white/40 hover:text-white/80 text-sm transition-colors mb-8 inline-flex items-center gap-1.5 group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span> All Restaurants
          </Link>
          <div className="flex items-center gap-5 mt-3">
            <span className="text-7xl drop-shadow-lg shrink-0">{restaurant.emoji}</span>
            <div>
              <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${colors.badge} mb-3 inline-block`}>
                {restaurant.cuisine}
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                {restaurant.name}
              </h1>
              <p className="text-white/60 mt-2 max-w-2xl leading-relaxed">{restaurant.description}</p>
            </div>
          </div>
          <p className="mt-5 text-white/30 text-sm">{restaurant.menuItems.length} menu items</p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur border-b border-zinc-200 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border cursor-pointer ${
                  activeCategory === cat
                    ? `${colors.tab} border-transparent`
                    : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:bg-white transition-all w-full sm:w-52"
          />
        </div>
      </div>

      {/* Menu grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-zinc-400">No items match your filter.</p>
            <button
              onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
              className="mt-4 text-amber-600 hover:text-amber-700 font-semibold underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-zinc-400 text-sm mb-6">
              Showing {filtered.length} of {restaurant.menuItems.length} items
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((item) => (
                <MenuItemCard key={item.id} {...item} price={Number(item.price)} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* AI tip bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-amber-950 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold text-sm">✨ Ask AI about {restaurant.name}</p>
            <p className="text-amber-300/60 text-xs mt-0.5">
              &ldquo;What&apos;s vegetarian at {restaurant.name}?&rdquo; or &ldquo;What&apos;s the most popular dish?&rdquo;
            </p>
          </div>
          <button
            onClick={() => window.dispatchEvent(new Event("heyday:open-chat"))}
            className="shrink-0 bg-amber-500 hover:bg-amber-400 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Open AI Guide →
          </button>
        </div>
      </div>
    </div>
  );
}
