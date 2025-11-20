import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Star, Edit } from 'lucide-react';
import { Cocktail } from '@/data/classicCocktails';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavoritesRefactored';
import { getRecipeUrl } from '@/pages/RecipePage';
import { ShareCount } from './ShareCount';

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
  
  // Skip ratings for now - major performance bottleneck
  const ratingData = {
    averageRating: 0,
    totalRatings: 0,
    ratingDistribution: {}
  };

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
    console.log('Generating URL for recipe:', { id: recipe.id, name: recipe.name, isUserRecipe: recipe.isUserRecipe, createdBy: recipe.createdBy });
    const url = getRecipeUrl(recipe);
    console.log('Generated URL:', url);
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
        <div className="relative h-48 overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Creator info overlay - only show if we have creator data */}
          {recipe.creatorUsername && (
            <div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 cursor-pointer hover:from-black/90 transition-colors"
              onClick={handleCreatorClick}
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border-2 border-white/20">
                  <AvatarImage src={recipe.creatorAvatar || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {recipe.creatorUsername.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-white text-sm font-medium">
                  @{recipe.creatorUsername}
                </span>
              </div>
            </div>
          )}
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
            
            {recipe.isUserRecipe && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/recipes/my-drinks', { 
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