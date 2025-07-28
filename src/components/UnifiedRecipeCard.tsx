import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Edit, Plus, Check } from 'lucide-react';
import { Cocktail } from '@/data/classicCocktails';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { recipeNameToSlug } from '@/pages/RecipePage';
import TagBadge from './ui/tag';
import { useFavorites } from '@/hooks/useFavoritesRefactored';

interface UnifiedRecipeCardProps {
  recipe: Cocktail;
  onRecipeClick?: (recipe: Cocktail) => void;
  onTagClick?: (tag: string) => void;
  onEdit?: () => void;
  onAddIngredient?: (ingredient: string) => void;
  onShowAuthModal?: () => void;
  
  // Availability data (from search results)
  canMake?: boolean;
  missingIngredients?: string[];
  availabilityScore?: number;
  
  // Display options
  editable?: boolean;
  showFavorite?: boolean;
  showAvailability?: boolean;
  showActions?: boolean;
  showTags?: boolean;
  showDetails?: boolean;
  
  className?: string;
}

const fallback = "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=400&q=80";

export default function UnifiedRecipeCard({
  recipe,
  onRecipeClick,
  onTagClick,
  onEdit,
  onAddIngredient,
  onShowAuthModal,
  canMake = false,
  missingIngredients = [],
  availabilityScore = 0,
  editable = false,
  showFavorite = true,
  showAvailability = false,
  showActions = true,
  showTags = true,
  showDetails = true,
  className
}: UnifiedRecipeCardProps) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
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

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(recipe.id, onShowAuthModal);
  };

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onTagClick?.(tag);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  const handleAddMissingToBar = (ingredient: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddIngredient?.(ingredient);
  };
  
  const handleViewRecipe = () => {
    if (onRecipeClick) {
      onRecipeClick(recipe);
    } else {
      const slug = recipeNameToSlug(recipe.name);
      navigate(`/cocktail/${slug}`);
    }
  };

  const recipeIsFavorited = isFavorite(recipe.id);

  return (
    <div className="relative group">
      <Card 
        className={cn(
          "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card border-border rounded-organic-md group overflow-hidden",
          "hover:border-primary/30 hover:bg-light-charcoal hover:scale-[1.02] hover:rotate-[0.5deg] shadow-lg hover:shadow-xl",
          className
        )}
        onClick={handleViewRecipe}
        style={{ transitionTimingFunction: 'var(--timing-pour)' }}
      >
        <CardContent className="p-0">
          {/* Hero image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={imageSrc}
              alt={recipe.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={handleImageError}
            />
            
            {/* Availability indicator */}
            {showAvailability && canMake && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 backdrop-blur-sm rounded-organic-sm">
                  ✓ Ready
                </Badge>
              </div>
            )}

            {/* Edit button */}
            {editable && (
              <button
                className="absolute top-2 right-2 z-10 bg-card/90 backdrop-blur-sm border border-border rounded-organic-sm p-1 shadow hover:bg-card/100 active:scale-95 transition-all duration-150"
                onClick={handleEdit}
                aria-label="Edit recipe"
              >
                <Edit size={18} className="text-foreground" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-bold text-lg text-pure-white line-clamp-1 mb-2">
              {recipe.name}
            </h3>
            
            {/* Origin */}
            <div className="text-sm text-muted-foreground mb-2 line-clamp-1" title={recipe.origin || "No region"}>
              {recipe.origin || "No region"}
            </div>

            {/* Tags */}
            {showTags && (recipe.tags ?? []).length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2 min-h-[20px]">
                {(recipe.tags ?? []).slice(0, 3).map(tag => (
                  <TagBadge 
                    key={tag} 
                    className={`bg-accent/20 text-secondary border border-accent/30 text-xs rounded-organic-sm ${onTagClick ? 'cursor-pointer hover:bg-accent/30' : ''}`}
                    onClick={onTagClick ? () => onTagClick(tag) : undefined}
                  >
                    {tag}
                  </TagBadge>
                ))}
                {(recipe.tags ?? []).length > 3 && (
                  <TagBadge className="bg-accent/20 text-secondary border border-accent/30 text-xs rounded-organic-sm">
                    +{(recipe.tags ?? []).length - 3}
                  </TagBadge>
                )}
              </div>
            )}
            
            {/* Description */}
            <p className="text-sm text-light-text line-clamp-2 mb-3">
              {recipe.notes || `A delicious cocktail featuring ${recipe.ingredients.slice(0, 2).map(ing => ing.replace(/^\d+[\s\w]*\s/, '').split(' ')[0]).join(' and ')}`}
            </p>

            {/* Recipe details */}
            {showDetails && (
              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center gap-2">
                  {recipe.technique && (
                    <span className={`technique-badge technique-${recipe.technique} px-1.5 py-0.5 font-medium rounded-organic-sm uppercase tracking-wide`}>
                      {recipe.technique}
                    </span>
                  )}
                  {recipe.difficulty && (
                    <span className={`difficulty-${recipe.difficulty} px-1.5 py-0.5 font-medium rounded-organic-sm`}>
                      {recipe.difficulty}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {recipe.glassType && (
                    <span className="glass-indicator px-1.5 py-0.5 font-medium rounded-organic-sm">
                      {recipe.glassType}
                    </span>
                  )}
                  {recipe.abv && (
                    <span className="text-emerald font-medium">{recipe.abv}</span>
                  )}
                </div>
              </div>
            )}

            {/* Missing ingredients for search results */}
            {showAvailability && missingIngredients.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-1">Missing ingredients:</p>
                <div className="flex flex-wrap gap-1">
                  {missingIngredients.slice(0, 2).map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <span className="text-xs text-orange-400">{ingredient}</span>
                      {onAddIngredient && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleAddMissingToBar(ingredient, e)}
                          className="h-4 w-4 p-0 text-orange-400 hover:text-orange-300"
                        >
                          <Plus size={12} />
                        </Button>
                      )}
                    </div>
                  ))}
                  {missingIngredients.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{missingIngredients.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action buttons */}
            {showActions && (
              <div className="flex items-center justify-between">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleViewRecipe}
                  className="flex-1 mr-2 rounded-organic-sm"
                >
                  View Recipe
                </Button>
                
                {showFavorite && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleFavorite}
                    className={cn(
                      "h-8 w-8 p-0 rounded-organic-sm",
                      recipeIsFavorited && "text-heart-red hover:text-heart-red"
                    )}
                  >
                    <Heart size={16} fill={recipeIsFavorited ? "currentColor" : "none"} />
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}