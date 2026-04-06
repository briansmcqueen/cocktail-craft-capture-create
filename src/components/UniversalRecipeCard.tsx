import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Star, Edit } from 'lucide-react';
import { Cocktail } from '@/data/classicCocktails';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavorites';
import { getRecipeUrl } from '@/utils/slugUtils';
import { ShareCount } from './ShareCount';
import { getAvatarUrl } from '@/utils/avatarUrl';

interface UniversalRecipeCardProps {
  recipe: Cocktail;
  onTagClick?: (tag: string) => void;
  onShowAuthModal?: () => void;
  className?: string;
  hideCreator?: boolean;
  ratingData?: { averageRating: number; totalRatings: number };
}

export default function UniversalRecipeCard({
  recipe,
  onTagClick,
  onShowAuthModal,
  className,
  hideCreator = false,
  ratingData: externalRatingData
}: UniversalRecipeCardProps) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const fullAvatarUrl = getAvatarUrl(recipe.creatorAvatar);
  
  const ratingData = externalRatingData || { averageRating: 0, totalRatings: 0 };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(recipe.id, () => {
      // Show auth modal with context message
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
    const url = getRecipeUrl(recipe);
    navigate(url);
  };

  const handleCreatorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (recipe.creatorUsername) {
      navigate(`/profile/${recipe.creatorUsername}`);
    }
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
        <div className="relative aspect-square overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Creator info overlay - only show if we have creator data with username */}
          {!hideCreator && recipe.creatorUsername && recipe.creatorUserId && (
            <button 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 hover:from-black/90 transition-colors w-full text-left"
              onClick={handleCreatorClick}
              type="button"
              aria-label={`View ${recipe.creatorUsername}'s profile`}
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border-2 border-white/20">
                  <AvatarImage src={fullAvatarUrl || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {recipe.creatorUsername.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-white text-sm font-medium">
                  @{recipe.creatorUsername}
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col">
          <h3 className="font-bold text-lg text-pure-white line-clamp-1 mb-2">
            {recipe.name}
          </h3>
          
          {/* Simple description or ingredients preview - fixed height for alignment */}
          <p className="text-sm text-light-text line-clamp-3 mb-3 min-h-[3.75rem]">
            {recipe.notes || `A delicious cocktail featuring ${recipe.ingredients.slice(0, 2).map(ing => ing.replace(/^\d+[\s\w]*\s/, '').split(' ')[0]).join(' and ')}`}
          </p>

          {/* Review stars and count */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1">
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
            <ShareCount recipeId={recipe.id} />
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
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFavorite}
              className={cn(
                "h-8 w-8 p-0 rounded-organic-sm transition-colors",
                isFavorite(recipe.id) && "text-heart-red hover:text-heart-red/80"
              )}
              aria-label={isFavorite(recipe.id) ? "Remove from favorites" : "Add to favorites"}
              title={isFavorite(recipe.id) ? "Remove from favorites" : "Save to favorites"}
            >
              <Heart size={16} fill={isFavorite(recipe.id) ? "currentColor" : "none"} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}