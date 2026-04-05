
import { Edit, ThumbsUp, Heart, MessageSquare, Star } from "lucide-react";
import { Cocktail } from "@/data/classicCocktails";
import { cn } from "@/lib/utils";
import TagBadge from "./ui/tag";
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
  showOrigin?: boolean;
  showTags?: boolean;
  variant?: 'default' | 'profile';
};

const fallback = "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=400&q=80";

export default function RecipeCard({ recipe, onSelect, onEdit, editable, onTagClick, showOrigin = true, showTags = true, variant = 'default' }: RecipeCardProps) {
  const navigate = useNavigate();
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
  
  const isProfileVariant = variant === 'profile';
  const imageHeight = isProfileVariant ? 'h-48' : 'h-40';
  const cardHeight = isProfileVariant ? 'h-[340px]' : 'h-80';
  
  return (
    <div
      className={`bg-card rounded-organic-md shadow-glass hover:shadow-xl cursor-pointer transition-all duration-400 group relative ${cardHeight} flex flex-col active:scale-95 sm:hover:scale-[1.02] sm:hover:-translate-y-1 sm:active:scale-100 w-full min-w-0 border border-border`}
      onClick={handleCardClick}
      style={{ transitionTimingFunction: 'var(--timing-pour)' }}
    >
      <div className={`${imageHeight} w-full overflow-hidden`}>
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
          {showOrigin && (
            <div className="text-sm text-muted-foreground mb-2 line-clamp-1" title={recipe.origin || "No region"}>{recipe.origin || "No region"}</div>
          )}
          {showTags && (
            <div className="flex flex-wrap gap-1 mb-2 min-h-[20px]">
              {(recipe.tags ?? []).slice(0, 3).map(tag => (
                <TagBadge 
                  key={tag} 
                  className={onTagClick ? 'cursor-pointer hover:bg-light-charcoal' : ''}
                  onClick={onTagClick ? handleTagClick(tag) : undefined}
                >
                  {tag}
                </TagBadge>
              ))}
              {(recipe.tags ?? []).length > 3 && (
                <TagBadge>+{(recipe.tags ?? []).length - 3}</TagBadge>
              )}
            </div>
          )}
          <div className="text-xs text-card-foreground/80 mb-3 line-clamp-2" title={recipe.notes}>{recipe.notes}</div>
        </div>
        <div className="h-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {recipe.technique && (
              <span className={`technique-badge technique-${recipe.technique} px-1.5 py-0.5 text-xs font-medium rounded-organic-sm uppercase tracking-wide`}>
                {recipe.technique}
              </span>
            )}
            {/* Show stats if available, otherwise show difficulty */}
            {(recipe.likeCount !== undefined || recipe.commentCount !== undefined || recipe.averageRating !== undefined) ? (
              <>
                {recipe.averageRating !== undefined && recipe.averageRating > 0 && (
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={isProfileVariant ? 14 : 12}
                        className={`text-golden-amber ${
                          star <= Math.round(recipe.averageRating!) ? "fill-current" : "fill-none"
                        }`}
                      />
                    ))}
                  </div>
                )}
                {recipe.likeCount !== undefined && (
                  <div className={`flex items-center gap-1 ${isProfileVariant ? 'text-sm' : 'text-xs'} text-muted-foreground`}>
                    <Heart size={isProfileVariant ? 16 : 12} className="fill-current" />
                    <span>{recipe.likeCount}</span>
                  </div>
                )}
                {recipe.commentCount !== undefined && (
                  <div className={`flex items-center gap-1 ${isProfileVariant ? 'text-sm' : 'text-xs'} text-muted-foreground`}>
                    <MessageSquare size={isProfileVariant ? 16 : 12} />
                    <span>{recipe.commentCount}</span>
                  </div>
                )}
              </>
            ) : (
              recipe.difficulty && (
                <span className={`difficulty-${recipe.difficulty} px-1.5 py-0.5 text-xs font-medium rounded-organic-sm`}>
                  {recipe.difficulty}
                </span>
              )
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
