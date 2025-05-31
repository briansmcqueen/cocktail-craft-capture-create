
import { Edit } from "lucide-react";
import { Cocktail } from "@/data/classicCocktails";
import { cn } from "@/lib/utils";
import TagBadge from "./ui/tag";
import { getLikeCount } from "@/utils/likes";

type RecipeCardProps = {
  recipe: Cocktail;
  onSelect: () => void;
  onEdit?: () => void;
  editable?: boolean;
};

const fallback =
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80";

export default function RecipeCard({ recipe, onSelect, onEdit, editable }: RecipeCardProps) {
  const likeCount = getLikeCount(recipe.id);
  
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
        <div className="flex-1">
          <h2 className="font-bold text-lg mb-1 line-clamp-1" title={recipe.name}>{recipe.name}</h2>
          <div className="text-sm text-muted-foreground mb-2 line-clamp-1" title={recipe.origin || "No region"}>{recipe.origin || "No region"}</div>
          <div className="flex flex-wrap gap-1 mb-2 min-h-[20px]">
            {(recipe.tags ?? []).slice(0, 3).map(tag => (
              <TagBadge key={tag}>{tag}</TagBadge>
            ))}
            {(recipe.tags ?? []).length > 3 && (
              <TagBadge>+{(recipe.tags ?? []).length - 3}</TagBadge>
            )}
          </div>
          <div className="text-xs text-gray-700 mb-3 line-clamp-2" title={recipe.notes}>{recipe.notes}</div>
        </div>
        {likeCount > 0 && (
          <div className="text-xs text-gray-500 mt-auto">
            {likeCount} like{likeCount === 1 ? '' : 's'}
          </div>
        )}
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
  );
}
