import Link from "next/link";

const colorMap: Record<string, { bg: string; border: string; badge: string }> = {
  red: {
    bg: "from-red-800 to-red-950",
    border: "border-red-700",
    badge: "bg-red-700 text-red-100",
  },
  pink: {
    bg: "from-pink-700 to-pink-950",
    border: "border-pink-600",
    badge: "bg-pink-700 text-pink-100",
  },
  orange: {
    bg: "from-orange-700 to-orange-950",
    border: "border-orange-600",
    badge: "bg-orange-700 text-orange-100",
  },
  green: {
    bg: "from-green-800 to-green-950",
    border: "border-green-700",
    badge: "bg-green-700 text-green-100",
  },
  yellow: {
    bg: "from-yellow-700 to-yellow-950",
    border: "border-yellow-600",
    badge: "bg-yellow-700 text-yellow-100",
  },
};

interface RestaurantCardProps {
  name: string;
  slug: string;
  cuisine: string;
  description: string;
  emoji: string;
  color: string;
  itemCount?: number;
}

export default function RestaurantCard({
  name,
  slug,
  cuisine,
  description,
  emoji,
  color,
  itemCount,
}: RestaurantCardProps) {
  const colors = colorMap[color] ?? colorMap.orange;

  return (
    <Link href={`/restaurant/${slug}`}>
      <div
        className={`
          relative h-full rounded-2xl overflow-hidden border ${colors.border}
          bg-gradient-to-br ${colors.bg}
          shadow-lg hover:shadow-2xl
          transform hover:-translate-y-1 hover:scale-[1.02]
          transition-all duration-300 cursor-pointer group
        `}
      >
        {/* Background emoji watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 text-[10rem] select-none pointer-events-none">
          {emoji}
        </div>

        <div className="relative p-6 flex flex-col h-full min-h-[260px]">
          {/* Emoji + cuisine badge */}
          <div className="flex items-start justify-between mb-4">
            <span className="text-5xl drop-shadow">{emoji}</span>
            <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${colors.badge}`}>
              {cuisine}
            </span>
          </div>

          {/* Name */}
          <h2 className="text-xl font-extrabold text-white mb-2 group-hover:text-amber-300 transition-colors leading-tight">
            {name}
          </h2>

          {/* Description */}
          <p className="text-white/70 text-sm leading-relaxed flex-1">{description}</p>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between">
            {itemCount !== undefined && (
              <span className="text-white/50 text-xs">{itemCount} menu items</span>
            )}
            <span className="ml-auto text-amber-400 text-sm font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              View Menu →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
