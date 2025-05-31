
import { Edit, ThumbsUp } from "lucide-react";
import { Cocktail } from "@/data/classicCocktails";
import { cn } from "@/lib/utils";
import TagBadge from "./ui/tag";
import { getLikeCount } from "@/utils/likes";
import { useState } from "react";

type RecipeCardProps = {
  recipe: Cocktail;
  onSelect: () => void;
  onEdit?: () => void;
  editable?: boolean;
  onTagClick?: (tag: string) => void;
};

const fallback = "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=400&q=80";

export default function RecipeCard({ recipe, onSelect, onEdit, editable, onTagClick }: RecipeCardProps) {
  const likeCount = getLikeCount(recipe.id);
  const [imageSrc, setImageSrc] = useState(recipe.image || fallback);
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    if (!imageError && imageSrc !== fallback) {
      setImageError(true);
      setImageSrc(fallback);
    }
  };

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onTagClick?.(tag);
  };
  
  return (
    <div
      className="bg-card rounded-xl shadow hover:shadow-xl overflow-hidden cursor-pointer transition group relative h-80 flex flex-col"
      onClick={onSelect}
    >
      <div className="h-40 w-full overflow-hidden">
        <img
          src={imageSrc}
          alt={recipe.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-all"
          loading="lazy"
          onError={handleImageError}
        />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="flex-1">
          <h2 className="font-bold text-lg mb-1 line-clamp-1" title={recipe.name}>{recipe.name}</h2>
          <div className="text-sm text-muted-foreground mb-2 line-clamp-1" title={recipe.origin || "No region"}>{recipe.origin || "No region"}</div>
          <div className="flex flex-wrap gap-1 mb-2 min-h-[20px]">
            {(recipe.tags ?? []).slice(0, 3).map(tag => (
              <TagBadge 
                key={tag} 
                className={`bg-blue-100 text-blue-800 border border-blue-200 text-xs ${onTagClick ? 'cursor-pointer hover:bg-blue-200' : ''}`}
                onClick={onTagClick ? (e) => handleTagClick(tag, e) : undefined}
              >
                {tag}
              </TagBadge>
            ))}
            {(recipe.tags ?? []).length > 3 && (
              <TagBadge className="bg-blue-100 text-blue-800 border border-blue-200 text-xs">+{(recipe.tags ?? []).length - 3}</TagBadge>
            )}
          </div>
          <div className="text-xs text-gray-700 mb-3 line-clamp-2" title={recipe.notes}>{recipe.notes}</div>
        </div>
        <div className="h-5 flex items-center justify-start">
          {likeCount > 0 && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <ThumbsUp size={12} />
              <span>{likeCount} like{likeCount === 1 ? '' : 's'}</span>
            </div>
          )}
        </div>
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
