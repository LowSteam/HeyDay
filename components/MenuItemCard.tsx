const tagColors: Record<string, string> = {
  vegetarian: "bg-green-50 text-green-700 border-green-200",
  vegan: "bg-emerald-50 text-emerald-700 border-emerald-200",
  spicy: "bg-red-50 text-red-700 border-red-200",
  "gluten-free": "bg-yellow-50 text-yellow-700 border-yellow-200",
  popular: "bg-amber-50 text-amber-700 border-amber-200",
  hearty: "bg-orange-50 text-orange-700 border-orange-200",
};

const tagEmojis: Record<string, string> = {
  vegetarian: "🥦",
  vegan: "🌱",
  spicy: "🌶️",
  "gluten-free": "🌾",
  popular: "⭐",
  hearty: "💪",
};

interface MenuItemCardProps {
  name: string;
  description: string;
  ingredients: string[];
  price: number;
  category: string;
  tags: string[];
}

export default function MenuItemCard({
  name,
  description,
  ingredients,
  price,
  category,
  tags,
}: MenuItemCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all duration-200 p-5 flex flex-col gap-3 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-zinc-900 text-base leading-snug group-hover:text-amber-700 transition-colors">{name}</h3>
          <span className="text-xs text-zinc-400 uppercase tracking-wider font-medium">{category}</span>
        </div>
        <span className="text-base font-black text-amber-600 whitespace-nowrap tabular-nums">
          ${Number(price).toFixed(2)}
        </span>
      </div>

      {/* Description */}
      <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>

      {/* Ingredients */}
      <details className="text-xs text-zinc-400 cursor-pointer group/details">
        <summary className="hover:text-zinc-600 transition-colors font-medium list-none flex items-center gap-1">
          <span className="group-open/details:rotate-90 transition-transform inline-block">›</span>
          Ingredients ({ingredients.length})
        </summary>
        <p className="mt-1.5 text-zinc-400 leading-relaxed pl-3 border-l border-zinc-100">{ingredients.join(", ")}</p>
      </details>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${tagColors[tag] ?? "bg-zinc-50 text-zinc-600 border-zinc-200"}`}
            >
              {tagEmojis[tag] ?? ""} {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
