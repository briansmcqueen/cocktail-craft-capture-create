
import { Edit } from "lucide-react";
import { Cocktail } from "@/data/classicCocktails";
import { cn } from "@/lib/utils";
import TagBadge from "./ui/tag";

type RecipeCardProps = {
  recipe: Cocktail;
  onSelect: () => void;
  onEdit?: () => void;
  editable?: boolean;
};

const fallback =
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80";

export default function RecipeCard({ recipe, onSelect, onEdit, editable }: RecipeCardProps) {
  return (
    <div
      className="bg-card rounded-xl shadow hover:shadow-xl overflow-hidden cursor-pointer transition group relative h-full flex flex-col"
      onClick={onSelect}
    >
      <img
        src={recipe.image || fallback}
        alt={recipe.name}
        className="h-40 w-full object-cover group-hover:scale-105 transition-all"
        loading="lazy"
      />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="font-bold text-lg mb-1">{recipe.name}</h2>
          <div className="text-sm text-muted-foreground mb-2">{recipe.origin || "No region"}</div>
          <div className="flex flex-wrap gap-1 mb-2">
            {(recipe.tags ?? []).map(tag => (
              <TagBadge key={tag}>{tag}</TagBadge>
            ))}
          </div>
          <div className="text-xs text-gray-700 mb-2 line-clamp-2">{recipe.notes}</div>
        </div>
        {editable && (
          <button
            className="absolute top-2 right-2 z-10 bg-white/70 rounded-full p-1 shadow hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              onEdit && onEdit();
            }}
            aria-label="Edit recipe"
          >
            <Edit size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
