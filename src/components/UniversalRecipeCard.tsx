import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Star } from 'lucide-react';
import { Cocktail } from '@/data/classicCocktails';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavoritesRefactored';
import { getRecipeUrl } from '@/pages/RecipePage';
import { getAggregatedRating, type AggregatedRating } from '@/services/ratingsService';

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
  const [ratingData, setRatingData] = useState<AggregatedRating>({
    averageRating: 0,
    totalRatings: 0,
    ratingDistribution: {}
  });

  useEffect(() => {
    const fetchRatingData = async () => {
      const data = await getAggregatedRating(recipe.id);
      setRatingData(data);
    };
    
    fetchRatingData();
  }, [recipe.id]);

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
        <div className="flex flex-col md:flex-row h-full">
          {/* Hero image */}
          <div className="relative h-48 md:h-auto md:w-1/3 overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col justify-center">
            <h3 className="font-bold text-lg text-pure-white line-clamp-1 mb-2">
              {recipe.name}
            </h3>
            
            {/* Simple description or ingredients preview */}
            <p className="text-sm text-light-text line-clamp-2 mb-3">
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

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {recipe.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    onClick={(e) => handleTagClick(tag, e)}
                    className="px-2 py-1 text-xs bg-available/20 text-available rounded-organic-sm cursor-pointer hover:bg-available/30 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

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
        </div>
      </CardContent>
    </Card>
  );
}