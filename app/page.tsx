import RestaurantCard from "@/components/RestaurantCard";
import HeroChat from "@/components/HeroChat";
import { prisma } from "@/lib/db";

async function getRestaurants() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: { _count: { select: { menuItems: true } } },
      orderBy: { name: "asc" },
    });
    return restaurants;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const restaurants = await getRestaurants();

  return (
    <div>
      {/* Hero — AI front and center */}
      <section className="bg-amber-950 text-white py-24 px-4 relative overflow-hidden">
        {/* Subtle background watermark */}
        <div className="absolute inset-0 opacity-[0.03] text-[32rem] flex items-center justify-center select-none pointer-events-none leading-none">
          🍽️
        </div>

        <div className="relative max-w-2xl mx-auto text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-amber-900/50 border border-amber-700/40 rounded-full px-4 py-1.5 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
            AI-Powered Food Guide
          </div>

          <h1 className="text-5xl sm:text-6xl font-black text-white mb-3 tracking-tight leading-tight">
            What are you<br />
            <span className="text-amber-400">craving today?</span>
          </h1>
          <p className="text-amber-200/60 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Ask anything and our AI instantly finds the perfect dish from 100+ items across 5 restaurants.
          </p>

          <HeroChat />
        </div>
      </section>

      {/* Restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-amber-600 font-bold text-xs uppercase tracking-widest mb-1">Browse</p>
            <h2 className="text-3xl font-black text-zinc-900">Our Restaurants</h2>
          </div>
          <p className="text-zinc-400 text-sm hidden sm:block">5 cuisines · 100+ dishes</p>
        </div>

        {restaurants.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-400 text-lg mb-2">Database not seeded yet.</p>
            <p className="text-zinc-400 text-sm mt-1">Add your GEMINI_API_KEY to .env and run:</p>
            <code className="block mt-4 bg-zinc-900 text-green-400 rounded-xl px-6 py-3 text-sm inline-block">
              npx tsx scripts/seed.ts
            </code>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((r) => (
              <RestaurantCard
                key={r.id}
                name={r.name}
                slug={r.slug}
                cuisine={r.cuisine}
                description={r.description}
                emoji={r.emoji}
                color={r.color}
                itemCount={r._count.menuItems}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
