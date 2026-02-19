import RestaurantCard from "@/components/RestaurantCard";
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
      {/* Hero */}
      <section className="relative bg-amber-950 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-5 text-[20rem] flex items-center justify-center select-none pointer-events-none">
          🍽️
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-amber-400 font-semibold uppercase tracking-widest text-sm mb-3">
            Welcome to
          </p>
          <h1 className="text-6xl sm:text-7xl font-black text-amber-400 mb-4 tracking-tight">
            Heyday
          </h1>
          <p className="text-amber-200 text-xl sm:text-2xl font-light mb-6">
            Five restaurants. Endless flavors. One incredible place.
          </p>
          <p className="text-white/60 text-base max-w-xl mx-auto">
            From smoky American BBQ to fragrant Indian curries, wood-fired Italian pizza to vibrant
            Mexican mole — Heyday has something for every craving.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 text-sm text-amber-300">
            <span>🤖</span>
            <span>
              Try our <strong className="text-amber-400">AI food guide</strong> — ask &ldquo;What&apos;s
              vegetarian?&rdquo; or &ldquo;Spicy dishes under $15?&rdquo;
            </span>
          </div>
        </div>
      </section>

      {/* Restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-stone-900 mb-2">Our Restaurants</h2>
          <p className="text-stone-500">Click any restaurant to explore the full menu</p>
        </div>

        {restaurants.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone-400 text-lg mb-4">
              No restaurants found. The database may not be seeded yet.
            </p>
            <p className="text-stone-400 text-sm">
              Add your <code className="bg-stone-100 px-2 py-0.5 rounded">GEMINI_API_KEY</code> to{" "}
              <code className="bg-stone-100 px-2 py-0.5 rounded">.env</code> and run:
            </p>
            <code className="block mt-3 bg-stone-900 text-green-400 rounded-lg px-4 py-3 text-sm inline-block">
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

      {/* AI Feature Banner */}
      <section className="bg-amber-50 border-y border-amber-200 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-4xl mb-4">🤖</p>
          <h2 className="text-2xl font-black text-stone-900 mb-3">Meet Your AI Food Guide</h2>
          <p className="text-stone-600 mb-6">
            Can&apos;t decide what to eat? Just ask! Our AI chatbot understands natural language and
            searches across all 100+ menu items using semantic search powered by Google Gemini and
            pgvector.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {[
              "What's vegetarian?",
              "Spicy dishes under $15?",
              "Best desserts?",
              "Something with truffle?",
              "Gluten-free options?",
            ].map((q) => (
              <span
                key={q}
                className="bg-white border border-amber-300 text-amber-700 rounded-full px-4 py-1.5 font-medium"
              >
                &ldquo;{q}&rdquo;
              </span>
            ))}
          </div>
          <p className="mt-6 text-stone-400 text-sm">
            Click the 🤖 button in the bottom-right corner to start chatting.
          </p>
        </div>
      </section>
    </div>
  );
}
