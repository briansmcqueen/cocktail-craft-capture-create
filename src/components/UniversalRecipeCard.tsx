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
        "cursor-pointer transition-all duration-400 hover:shadow-elegant hover:-translate-y-2 hover:scale-[1.02] hover:rotate-[0.5deg] bg-card border-border rounded-organic-md group overflow-hidden relative",
        "before:absolute before:inset-0 before:bg-gradient-primary before:opacity-0 before:transition-opacity before:duration-400 hover:before:opacity-10 before:rounded-organic-md",
        className
      )}
      style={{ transitionTimingFunction: 'var(--timing-pour)' }}
      onClick={handleViewRecipe}
    >
      <CardContent className="p-0 relative">
        {/* Hero image with organic overlay */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
            style={{ transitionTimingFunction: 'var(--timing-pour)' }}
          />
          {/* Organic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-medium-charcoal/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-400" />
          
          {/* Floating rating badge */}
          <div className="absolute top-3 right-3 bg-medium-charcoal/90 backdrop-blur-sm rounded-organic-sm px-2 py-1 flex items-center gap-1">
            <Star size={12} className="text-golden-amber fill-current" />
            <span className="text-xs text-pure-white font-medium">
              {ratingData.averageRating > 0 ? ratingData.averageRating.toFixed(1) : '—'}
            </span>
          </div>
          
          {/* Heart icon overlay */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
            className={cn(
              "absolute top-3 left-3 h-8 w-8 p-0 rounded-organic-sm backdrop-blur-sm transition-all duration-300",
              "bg-medium-charcoal/90 hover:bg-medium-charcoal hover:scale-110 hover:rotate-12",
              isFavorite(recipe.id) 
                ? "text-red-500 hover:text-red-400" 
                : "text-light-text hover:text-pure-white"
            )}
          >
            <Heart size={16} fill={isFavorite(recipe.id) ? "currentColor" : "none"} />
          </Button>
        </div>

        {/* Content with organic spacing */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-bold text-lg text-pure-white line-clamp-2 leading-tight">
              {recipe.name}
            </h3>
          </div>
          
          {/* Enhanced description with organic styling */}
          <p className="text-sm text-light-text line-clamp-2 mb-4 leading-relaxed">
            {recipe.notes || `A masterfully crafted cocktail featuring ${recipe.ingredients.slice(0, 2).map(ing => ing.replace(/^\d+[\s\w]*\s/, '').split(' ')[0]).join(' and ')}`}
          </p>

          {/* Enhanced review display */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={cn(
                      "text-golden-amber transition-all duration-200",
                      star <= Math.round(ratingData.averageRating) 
                        ? "fill-current scale-100" 
                        : "fill-none scale-90 opacity-40"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-soft-gray">
                {ratingData.totalRatings > 0 
                  ? `${ratingData.totalRatings} review${ratingData.totalRatings === 1 ? '' : 's'}`
                  : 'New recipe'
                }
              </span>
            </div>
            
            {/* Difficulty or technique badge */}
            {recipe.technique && (
              <span className="text-xs px-2 py-1 rounded-organic-sm bg-primary/20 text-emerald-green font-medium uppercase tracking-wider">
                {recipe.technique}
              </span>
            )}
          </div>

          {/* Enhanced action button */}
          <Button
            variant="default"
            size="sm"
            onClick={handleViewRecipe}
            className={cn(
              "w-full rounded-organic-sm font-medium tracking-wide transition-all duration-300",
              "hover:scale-[1.02] hover:rotate-[0.3deg] hover:shadow-md",
              "bg-primary hover:bg-primary-dark text-pure-white"
            )}
            style={{ transitionTimingFunction: 'var(--timing-pour)' }}
          >
            View Recipe
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}