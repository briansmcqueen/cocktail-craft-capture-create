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
        "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card border-border rounded-organic-md group overflow-hidden",
        className
      )}
      onClick={() => onRecipeClick(cocktail)}
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
          <p className="text-sm text-light-text line-clamp-2 mb-3">
            {cocktail.notes || `A delicious cocktail featuring ${cocktail.ingredients.slice(0, 2).map(ing => ing.replace(/^\d+[\s\w]*\s/, '').split(' ')[0]).join(' and ')}`}
          </p>

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="default"
              size="sm"
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