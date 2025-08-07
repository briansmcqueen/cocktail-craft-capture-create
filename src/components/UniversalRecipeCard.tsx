import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Star, Edit } from 'lucide-react';
import { Cocktail } from '@/data/classicCocktails';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavoritesRefactored';
import { getRecipeUrl } from '@/pages/RecipePage';
import { useBatchRatings } from '@/hooks/useBatchRatings';
import { AggregatedRating } from '@/services/ratingsService';

interface UniversalRecipeCardProps {
  recipe: Cocktail;
  onTagClick?: (tag: string) => void;
  onShowAuthModal?: () => void;
  className?: string;
}

export default function UniversalRecipeCard({
  recipe,
  onTagClick,
  onShowAuthModal,
  className
}: UniversalRecipeCardProps) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getRating, prefetchRatings } = useBatchRatings();
  
  // Get rating from cache
  const ratingData = getRating(recipe.id) || {
    averageRating: 0,
    totalRatings: 0,
    ratingDistribution: {}
  };

  // Prefetch rating on mount if not cached
  useEffect(() => {
    if (!getRating(recipe.id)) {
      prefetchRatings([recipe.id]);
    }
  }, [recipe.id, getRating, prefetchRatings]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(recipe.id, onShowAuthModal);
  };

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onTagClick?.(tag);
  };
  
  const handleViewRecipe = () => {
    console.log('Generating URL for recipe:', { id: recipe.id, name: recipe.name, isUserRecipe: recipe.isUserRecipe, createdBy: recipe.createdBy });
    const url = getRecipeUrl(recipe);
    console.log('Generated URL:', url);
    navigate(url);
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card border-border rounded-organic-md group overflow-hidden",
        className
      )}
      onClick={handleViewRecipe}
    >
      <CardContent className="p-0">
        {/* Hero image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-pure-white line-clamp-1 mb-2">
            {recipe.name}
          </h3>
          
          {/* Simple description or ingredients preview */}
          <p className="text-sm text-light-text line-clamp-3 mb-3">
            {recipe.notes || `A delicious cocktail featuring ${recipe.ingredients.slice(0, 2).map(ing => ing.replace(/^\d+[\s\w]*\s/, '').split(' ')[0]).join(' and ')}`}
          </p>

          {/* Review stars and count */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={cn(
                    "text-golden-amber",
                    star <= Math.round(ratingData.averageRating) ? "fill-current" : "fill-none"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-pure-white ml-1">
              {ratingData.totalRatings > 0 
                ? `${ratingData.totalRatings} review${ratingData.totalRatings === 1 ? '' : 's'}`
                : 'No reviews yet'
              }
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleViewRecipe}
              className="flex-1 rounded-organic-sm"
            >
              View Recipe
            </Button>
            
            {recipe.isUserRecipe && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/recipes/mine', { 
                    state: { 
                      editingRecipe: recipe,
                      showForm: true
                    } 
                  });
                }}
                className="h-8 w-8 p-0 rounded-organic-sm text-light-text hover:text-foreground"
              >
                <Edit size={16} />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFavorite}
              className={cn(
                "h-8 w-8 p-0 rounded-organic-sm",
                isFavorite(recipe.id) && "text-red-500 hover:text-red-600"
              )}
            >
              <Heart size={16} fill={isFavorite(recipe.id) ? "currentColor" : "none"} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}