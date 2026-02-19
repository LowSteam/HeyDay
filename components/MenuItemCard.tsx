const tagColors: Record<string, string> = {
  vegetarian: "bg-green-100 text-green-800 border-green-200",
  vegan: "bg-emerald-100 text-emerald-800 border-emerald-200",
  spicy: "bg-red-100 text-red-800 border-red-200",
  "gluten-free": "bg-yellow-100 text-yellow-800 border-yellow-200",
  popular: "bg-amber-100 text-amber-800 border-amber-200",
  hearty: "bg-orange-100 text-orange-800 border-orange-200",
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
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-bold text-stone-900 text-base leading-snug">{name}</h3>
          <span className="text-xs text-stone-400 uppercase tracking-wider">{category}</span>
        </div>
        <span className="text-lg font-extrabold text-amber-600 whitespace-nowrap">
          ${Number(price).toFixed(2)}
        </span>
      </div>

      {/* Description */}
      <p className="text-stone-600 text-sm leading-relaxed">{description}</p>

      {/* Ingredients */}
      <details className="text-xs text-stone-400 cursor-pointer">
        <summary className="hover:text-stone-600 transition-colors">
          View ingredients ({ingredients.length})
        </summary>
        <p className="mt-1 text-stone-500">{ingredients.join(", ")}</p>
      </details>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full border ${tagColors[tag] ?? "bg-stone-100 text-stone-600 border-stone-200"}`}
            >
              {tagEmojis[tag] ?? ""} {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
