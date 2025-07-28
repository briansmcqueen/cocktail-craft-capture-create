import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, Plus, Check } from 'lucide-react';
import { SearchResult } from '@/types/search';
import { TECHNIQUE_ICONS, GLASS_ICONS } from '@/types/search';
import { cn } from '@/lib/utils';

interface RecipeResultCardProps {
  result: SearchResult;
  onRecipeClick: (recipe: any) => void;
  onToggleFavorite: (recipe: any) => void;
  onAddIngredient?: (ingredient: string) => void;
  onTagClick?: (tag: string) => void;
  isFavorite?: boolean;
  className?: string;
}

export default function RecipeResultCard({
  result,
  onRecipeClick,
  onToggleFavorite,
  onAddIngredient,
  onTagClick,
  isFavorite = false,
  className
}: RecipeResultCardProps) {
  const { cocktail, canMake, missingIngredients, availabilityScore } = result;

  const handleAddMissingToBar = (ingredient: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddIngredient?.(ingredient);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(cocktail);
  };

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onTagClick?.(tag);
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card border-border rounded-organic-md group",
        canMake && "ring-2 ring-primary/20",
        className
      )}
      onClick={() => onRecipeClick(cocktail)}
    >
      <CardContent className="p-0">
        {/* Hero image */}
        <div className="relative h-48 overflow-hidden rounded-t-organic-md">
          <img
            src={cocktail.image}
            alt={cocktail.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Availability badge overlay */}
          <div className="absolute top-3 right-3">
            {canMake ? (
              <Badge className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 backdrop-blur-sm">
                ✓ CAN MAKE
              </Badge>
            ) : (
              <Badge variant="destructive" className="bg-destructive/90 text-xs px-2 py-1 backdrop-blur-sm">
                MISSING {missingIngredients.length}
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-pure-white line-clamp-1 mb-2">
            {cocktail.name}
          </h3>
          
          {/* Simplified ingredient status */}
          <div className="mb-3">
            <div className="text-sm text-light-text mb-2">
              {cocktail.ingredients.length - missingIngredients.length}/{cocktail.ingredients.length} ingredients available
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  availabilityScore === 100 ? "bg-primary" : "bg-gradient-to-r from-destructive to-primary"
                )}
                style={{ width: `${availabilityScore}%` }}
              />
            </div>
          </div>

          {/* Missing ingredients (only if not can make) */}
          {!canMake && missingIngredients.length > 0 && (
            <div className="mb-3 text-sm">
              <span className="text-muted-foreground">Missing: </span>
              <span className="text-destructive">
                {missingIngredients.slice(0, 2).join(', ')}
                {missingIngredients.length > 2 && ` +${missingIngredients.length - 2} more`}
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant={canMake ? "default" : "secondary"}
              size="sm"
              className="flex-1 mr-2 rounded-organic-sm"
            >
              {canMake ? 'Make Recipe' : 'View Details'}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFavorite}
              className={cn(
                "h-8 w-8 p-0 rounded-organic-sm",
                isFavorite && "text-red-500 hover:text-red-600"
              )}
            >
              <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}