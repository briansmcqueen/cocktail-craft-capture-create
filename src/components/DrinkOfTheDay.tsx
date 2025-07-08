import React from "react";
import { Calendar, Star, Clock } from "lucide-react";
import { Cocktail } from "@/data/classicCocktails";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/hooks/useFavoritesRefactored";
import { Heart } from "lucide-react";

interface DrinkOfTheDayProps {
  recipe: Cocktail;
  onRecipeClick: (recipe: Cocktail) => void;
  onShowAuthModal?: () => void;
}

export default function DrinkOfTheDay({ 
  recipe, 
  onRecipeClick,
  onShowAuthModal 
}: DrinkOfTheDayProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(recipe.id, onShowAuthModal);
  };

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-gray-900 tracking-[0.08em] leading-[1.45] uppercase font-bold text-[1rem]">
          Drink of the Day
        </h2>
      </div>
      
      <div className="relative bg-gradient-to-br from-primary/5 to-accent/10 rounded-2xl p-6 lg:p-8 border border-primary/10">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Recipe Image */}
          <div className="relative">
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-lg">
              {recipe.image ? (
                <img 
                  src={recipe.image} 
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/30">
                  <span className="text-4xl lg:text-6xl">🍸</span>
                </div>
              )}
            </div>
            
            {/* Favorite Button */}
            <button
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
            >
              <Heart 
                size={20} 
                className={`${
                  isFavorite(recipe.id) 
                    ? 'text-red-500 fill-red-500' 
                    : 'text-gray-600'
                } transition-colors duration-200`}
              />
            </button>
          </div>

          {/* Recipe Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl lg:text-3xl font-serif font-medium text-gray-900 mb-2">
                {recipe.name}
              </h3>
              {recipe.notes && (
                <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                  {recipe.notes}
                </p>
              )}
            </div>

            {/* Recipe Metadata */}
            <div className="flex flex-wrap gap-2">
              {recipe.tags && recipe.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="text-xs bg-white/60 text-gray-700 border-gray-200"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Additional Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {recipe.origin && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>{recipe.origin}</span>
                </div>
              )}
            </div>

            {/* Ingredients Preview */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Ingredients:</p>
              <div className="flex flex-wrap gap-1">
                {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs text-gray-600 bg-white/40"
                  >
                    {ingredient}
                  </Badge>
                ))}
                {recipe.ingredients.length > 3 && (
                  <Badge variant="outline" className="text-xs text-gray-600 bg-white/40">
                    +{recipe.ingredients.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Button */}
            <Button 
              onClick={() => onRecipeClick(recipe)}
              className="w-full lg:w-auto bg-primary hover:bg-primary/90 text-white font-medium"
            >
              View Full Recipe
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}