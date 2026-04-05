import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, Plus, Check, Star } from 'lucide-react';
import { SearchResult } from '@/types/search';
import { TECHNIQUE_ICONS, GLASS_ICONS } from '@/types/search';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { getRecipeUrl } from '@/utils/slugUtils';
import { useFavorites } from '@/hooks/useFavorites';
import { ratingsCache } from '@/services/ratingsCache';
import { getAggregatedRating } from '@/services/ratingsService';

interface RecipeResultCardProps {
  result: SearchResult;
  onRecipeClick: (recipe: any) => void;
  onAddIngredient?: (ingredient: string) => void;
  onTagClick?: (tag: string) => void;
  onShowAuthModal?: () => void;
  className?: string;
  preloadedRating?: {
    averageRating: number;
    totalRatings: number;
    ratingDistribution: Record<string, number>;
  };
}

export default function RecipeResultCard({
  result,
  onRecipeClick,
  onAddIngredient,
  onTagClick,
  onShowAuthModal,
  className,
  preloadedRating
}: RecipeResultCardProps) {
  const navigate = useNavigate();
  const { cocktail, canMake, missingIngredients, availabilityScore } = result;
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const [ratings, setRatings] = useState({ averageRating: 0, totalRatings: 0 });
  const [loadingRatings, setLoadingRatings] = useState(false);

  useEffect(() => {
    // Use preloaded rating if available
    if (preloadedRating) {
      setRatings({
        averageRating: preloadedRating.averageRating,
        totalRatings: preloadedRating.totalRatings
      });
      return;
    }

    // Otherwise load individually (fallback)
    const loadRatings = async () => {
      if (!cocktail.id) return;
      
      setLoadingRatings(true);
      try {
        const ratingData = await ratingsCache.getOrFetch(cocktail.id, async (id) => {
          const aggregated = await getAggregatedRating(id);
          return {
            averageRating: aggregated.averageRating,
            totalRatings: aggregated.totalRatings,
            ratingDistribution: aggregated.ratingDistribution
          };
        });
        
        setRatings({
          averageRating: ratingData.averageRating,
          totalRatings: ratingData.totalRatings
        });
      } catch (error) {
        console.error('Error fetching ratings:', error);
      } finally {
        setLoadingRatings(false);
      }
    };

    loadRatings();
  }, [cocktail.id, preloadedRating]);

  const handleAddMissingToBar = (ingredient: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddIngredient?.(ingredient);
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(cocktail.id, () => {
      if (window.__openAuthModal) {
        window.__openAuthModal('signup', "Love this drink? Save it to your favorites!");
      } else if (onShowAuthModal) {
        onShowAuthModal();
      }
    });
  };

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onTagClick?.(tag);
  };
  
  const handleViewRecipe = () => {
    const url = getRecipeUrl(cocktail);
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
            src={cocktail.image}
            alt={cocktail.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Simple availability indicator for can make only */}
          {canMake && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 backdrop-blur-sm">
                ✓ Ready
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-pure-white line-clamp-1 mb-2">
            {cocktail.name}
          </h3>
          
          {/* Simple description or ingredients preview */}
          <p className="text-sm text-light-text line-clamp-3 mb-3">
            {cocktail.notes || `A delicious cocktail featuring ${cocktail.ingredients.slice(0, 2).map(ing => ing.replace(/^\d+[\s\w]*\s/, '').split(' ')[0]).join(' and ')}`}
          </p>

          {/* Review stars and count */}
          <div className="flex items-center gap-1 mb-3">
            {loadingRatings ? (
              <div className="flex items-center text-xs text-muted-foreground">
                <div className="animate-pulse h-3 bg-muted rounded w-16"></div>
              </div>
            ) : ratings.totalRatings > 0 ? (
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={cn(
                      "text-golden-amber",
                      star <= Math.round(ratings.averageRating) ? "fill-current" : "fill-none"
                    )}
                  />
                ))}
                <span className="text-xs text-pure-white ml-1">
                  {ratings.totalRatings} review{ratings.totalRatings !== 1 ? 's' : ''}
                </span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">No reviews yet</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="default"
              size="sm"
              onClick={handleViewRecipe}
              className="flex-1 mr-2 rounded-organic-sm"
            >
              View Recipe
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFavorite}
              className={cn(
                "h-8 w-8 p-0 rounded-organic-sm",
                isFavorite(cocktail.id) && "text-red-500 hover:text-red-600"
              )}
            >
              <Heart size={16} fill={isFavorite(cocktail.id) ? "currentColor" : "none"} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}