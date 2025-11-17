
import { Edit, ThumbsUp } from "lucide-react";
import { Cocktail } from "@/data/classicCocktails";
import { cn } from "@/lib/utils";
import TagBadge from "./ui/tag";
import { getLikeCount } from "@/utils/likes";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRecipeUrl } from "@/pages/RecipePage";
import { ShareCount } from "./ShareCount";

type RecipeCardProps = {
  recipe: Cocktail;
  onSelect: () => void;
  onEdit?: () => void;
  editable?: boolean;
  onTagClick?: (tag: string) => void;
};

const fallback = "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=400&q=80";

export default function RecipeCard({ recipe, onSelect, onEdit, editable, onTagClick }: RecipeCardProps) {
  const navigate = useNavigate();
  const likeCount = getLikeCount(recipe.id);
  const [imageSrc, setImageSrc] = useState(recipe.image || fallback);
  const [hasErrored, setHasErrored] = useState(false);
  
  // Reset image state when recipe changes
  useEffect(() => {
    setImageSrc(recipe.image || fallback);
    setHasErrored(false);
  }, [recipe.image, recipe.id]);
  
  const handleImageError = () => {
    if (!hasErrored && recipe.image && imageSrc !== fallback) {
      setHasErrored(true);
      setImageSrc(fallback);
    }
  };

  const handleTagClick = (tag: string) => {
    if (!onTagClick) return undefined;
    return () => onTagClick(tag);
  };

  const handleCardClick = () => {
    const url = getRecipeUrl(recipe);
    navigate(url);
  };
  
  return (
    <div
      className="bg-card rounded-organic-md shadow-glass hover:shadow-xl cursor-pointer transition-all duration-400 group relative h-80 flex flex-col active:scale-95 sm:hover:scale-[1.02] sm:hover:rotate-[0.5deg] sm:active:scale-100 w-full min-w-0 border border-border"
      onClick={handleCardClick}
      style={{ transitionTimingFunction: 'var(--timing-pour)' }}
    >
      <div className="h-40 w-full overflow-hidden">
        <img
          src={imageSrc}
          alt={recipe.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-all duration-300"
          loading="lazy"
          onError={handleImageError}
        />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="flex-1">
          <h2 className="font-bold text-lg mb-1 line-clamp-1 text-foreground" title={recipe.name}>{recipe.name}</h2>
          <div className="text-sm text-muted-foreground mb-2 line-clamp-1" title={recipe.origin || "No region"}>{recipe.origin || "No region"}</div>
          <div className="flex flex-wrap gap-1 mb-2 min-h-[20px]">
            {(recipe.tags ?? []).slice(0, 3).map(tag => (
              <TagBadge 
                key={tag} 
                className={`bg-accent/20 text-secondary border border-accent/30 text-xs rounded-organic-sm ${onTagClick ? 'cursor-pointer hover:bg-accent/30' : ''}`}
                onClick={onTagClick ? handleTagClick(tag) : undefined}
              >
                {tag}
              </TagBadge>
            ))}
            {(recipe.tags ?? []).length > 3 && (
              <TagBadge className="bg-accent/20 text-secondary border border-accent/30 text-xs rounded-organic-sm">+{(recipe.tags ?? []).length - 3}</TagBadge>
            )}
          </div>
          <div className="text-xs text-card-foreground/80 mb-3 line-clamp-2" title={recipe.notes}>{recipe.notes}</div>
        </div>
        <div className="h-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {recipe.technique && (
              <span className={`technique-badge technique-${recipe.technique} px-1.5 py-0.5 text-xs font-medium rounded-organic-sm uppercase tracking-wide`}>
                {recipe.technique}
              </span>
            )}
            {recipe.difficulty && (
              <span className={`difficulty-${recipe.difficulty} px-1.5 py-0.5 text-xs font-medium rounded-organic-sm`}>
                {recipe.difficulty}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {recipe.glassType && (
              <span className="glass-indicator px-1.5 py-0.5 text-xs font-medium rounded-organic-sm">
                {recipe.glassType}
              </span>
            )}
            {recipe.abv && (
              <span className="text-emerald text-xs font-medium">{recipe.abv}</span>
            )}
            <ShareCount recipeId={recipe.id} />
          </div>
          {/* {likeCount > 0 && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <ThumbsUp size={12} />
              <span>{likeCount} like{likeCount === 1 ? '' : 's'}</span>
            </div>
          )} */}
        </div>
      </div>
      {editable && (
        <button
          className="absolute top-2 right-2 z-10 bg-card/90 backdrop-blur-sm border border-border rounded-organic-sm p-1 shadow hover:bg-card/100 active:scale-95 transition-all duration-150"
          onClick={(e) => {
            e.stopPropagation();
            onEdit && onEdit();
          }}
          aria-label="Edit recipe"
        >
          <Edit size={18} className="text-foreground" />
        </button>
      )}
    </div>
  );
}
