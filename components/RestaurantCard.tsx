import Link from "next/link";

const colorMap: Record<string, { bg: string; border: string; badge: string; glow: string }> = {
  red: {
    bg: "from-red-800 to-red-950",
    border: "border-red-800/60",
    badge: "bg-red-700/80 text-red-100",
    glow: "hover:shadow-red-900/40",
  },
  pink: {
    bg: "from-pink-800 to-pink-950",
    border: "border-pink-700/60",
    badge: "bg-pink-700/80 text-pink-100",
    glow: "hover:shadow-pink-900/40",
  },
  orange: {
    bg: "from-orange-800 to-orange-950",
    border: "border-orange-700/60",
    badge: "bg-orange-700/80 text-orange-100",
    glow: "hover:shadow-orange-900/40",
  },
  green: {
    bg: "from-green-800 to-green-950",
    border: "border-green-800/60",
    badge: "bg-green-700/80 text-green-100",
    glow: "hover:shadow-green-900/40",
  },
  yellow: {
    bg: "from-yellow-700 to-yellow-950",
    border: "border-yellow-700/60",
    badge: "bg-yellow-700/80 text-yellow-100",
    glow: "hover:shadow-yellow-900/40",
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
    <Link href={`/restaurant/${slug}`} className="block h-full">
      <div
        className={`
          relative h-full rounded-2xl overflow-hidden border ${colors.border}
          bg-gradient-to-br ${colors.bg}
          shadow-lg ${colors.glow} hover:shadow-2xl
          transform hover:-translate-y-1
          transition-all duration-300 cursor-pointer group
        `}
      >
        {/* Background emoji watermark */}
        <div className="absolute inset-0 flex items-end justify-end opacity-[0.06] text-[8rem] select-none pointer-events-none pr-2 pb-2 leading-none">
          {emoji}
        </div>

        <div className="relative p-6 flex flex-col h-full min-h-[260px]">
          {/* Emoji + cuisine badge */}
          <div className="flex items-start justify-between mb-5">
            <span className="text-5xl drop-shadow">{emoji}</span>
            <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${colors.badge} backdrop-blur-sm`}>
              {cuisine}
            </span>
          </div>

          {/* Name */}
          <h2 className="text-xl font-black text-white mb-2 group-hover:text-amber-300 transition-colors leading-tight">
            {name}
          </h2>

          {/* Description */}
          <p className="text-white/60 text-sm leading-relaxed flex-1">{description}</p>

          {/* Footer */}
          <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/10">
            {itemCount !== undefined && (
              <span className="text-white/40 text-xs">{itemCount} items</span>
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
