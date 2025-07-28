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
      <CardContent className="p-4">
        {/* Header with image and availability */}
        <div className="flex gap-3 mb-3">
          <div className="relative">
            <img
              src={cocktail.image}
              alt={cocktail.name}
              className="w-16 h-16 object-cover rounded-organic-sm"
            />
            {/* Availability badge */}
            <div className="absolute -top-1 -right-1">
              {canMake ? (
                <Badge className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5">
                  CAN MAKE
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                  MISSING {missingIngredients.length}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-pure-white line-clamp-1 mb-1">
              {cocktail.name}
            </h3>
            
            {/* Quick info badges */}
            <div className="flex flex-wrap gap-1 mb-2">
              {cocktail.technique && (
                <Badge variant="outline" className="text-xs px-2 py-0.5 border-border text-light-text">
                  <span className="mr-1">{TECHNIQUE_ICONS[cocktail.technique]}</span>
                  {cocktail.technique}
                </Badge>
              )}
              {cocktail.glassType && (
                <Badge variant="outline" className="text-xs px-2 py-0.5 border-border text-light-text">
                  <span className="mr-1">{GLASS_ICONS[cocktail.glassType]}</span>
                  {cocktail.glassType}
                </Badge>
              )}
              {cocktail.difficulty && (
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs px-2 py-0.5 border-border",
                    cocktail.difficulty === 'easy' && "text-green-400 border-green-400/30",
                    cocktail.difficulty === 'medium' && "text-yellow-400 border-yellow-400/30",
                    cocktail.difficulty === 'hard' && "text-red-400 border-red-400/30"
                  )}
                >
                  {cocktail.difficulty}
                </Badge>
              )}
              {cocktail.abv && (
                <Badge variant="outline" className="text-xs px-2 py-0.5 border-border text-light-text">
                  {cocktail.abv}
                </Badge>
              )}
            </div>

            {/* Tags */}
            {cocktail.tags && cocktail.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {cocktail.tags.slice(0, 3).map((tag: string) => (
                  <button
                    key={tag}
                    onClick={(e) => handleTagClick(tag, e)}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
                {cocktail.tags.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{cocktail.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Ingredients status */}
        <div className="mb-3">
          <div className="flex items-center gap-2 text-sm text-light-text mb-1">
            <span>Ingredients:</span>
            <span className="text-xs">
              {cocktail.ingredients.length - missingIngredients.length}/{cocktail.ingredients.length} available
            </span>
          </div>
          
          {/* Ingredient pills */}
          <div className="flex flex-wrap gap-1">
            {cocktail.ingredients.slice(0, 4).map((ingredient: string, index: number) => {
              const isAvailable = !missingIngredients.some(missing => 
                ingredient.toLowerCase().includes(missing.toLowerCase())
              );
              
              return (
                <Badge
                  key={index}
                  variant="outline"
                  className={cn(
                    "text-xs px-2 py-0.5",
                    isAvailable 
                      ? "border-primary/30 text-primary bg-primary/10" 
                      : "border-destructive/30 text-destructive bg-destructive/10"
                  )}
                >
                  <span className="mr-1">
                    {isAvailable ? <Check size={10} /> : '✗'}
                  </span>
                  {ingredient.replace(/^\d+[\s\w]*\s/, '').split(' ')[0]}
                </Badge>
              );
            })}
            {cocktail.ingredients.length > 4 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 border-border text-light-text">
                +{cocktail.ingredients.length - 4}
              </Badge>
            )}
          </div>
        </div>

        {/* Missing ingredients section */}
        {!canMake && missingIngredients.length > 0 && (
          <div className="mb-3 p-2 bg-destructive/10 rounded-organic-sm border border-destructive/20">
            <p className="text-xs text-muted-foreground mb-1">Missing:</p>
            <div className="flex flex-wrap gap-1">
              {missingIngredients.slice(0, 3).map((ingredient) => (
                <div key={ingredient} className="flex items-center gap-1">
                  <span className="text-xs text-destructive">{ingredient}</span>
                  {onAddIngredient && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => handleAddMissingToBar(ingredient, e)}
                      className="h-5 w-5 p-0 hover:bg-primary/20"
                    >
                      <Plus size={10} />
                    </Button>
                  )}
                </div>
              ))}
              {missingIngredients.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{missingIngredients.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant={canMake ? "default" : "secondary"}
            size="sm"
            className="flex-1 mr-2 rounded-organic-sm"
          >
            {canMake ? 'View Recipe' : 'View Details'}
          </Button>
          
          <div className="flex gap-1">
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
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-organic-sm"
            >
              <Share2 size={16} />
            </Button>
          </div>
        </div>

        {/* Availability score indicator */}
        <div className="mt-2 w-full bg-muted rounded-full h-1">
          <div 
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              availabilityScore === 100 ? "bg-primary" : "bg-gradient-to-r from-destructive to-primary"
            )}
            style={{ width: `${availabilityScore}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}