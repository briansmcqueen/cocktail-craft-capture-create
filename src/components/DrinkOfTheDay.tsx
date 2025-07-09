import React from "react";
import { Calendar, Globe } from "lucide-react";
import { Cocktail } from "@/data/classicCocktails";
import { Button } from "@/components/ui/button";
import TagBadge from "./ui/tag";
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
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label={`${isFavorite(recipe.id) ? 'Remove from' : 'Add to'} favorites`}
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
                <TagBadge 
                  key={tag} 
                  className="bg-blue-100 text-blue-800 border border-blue-200 text-xs"
                >
                  {tag}
                </TagBadge>
              ))}
            </div>

            {/* Additional Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {recipe.origin && (
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span>{recipe.origin}</span>
                </div>
              )}
            </div>

            {/* Ingredients List */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Ingredients:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-black mr-2">•</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <Button 
              onClick={() => onRecipeClick(recipe)}
              variant="secondary"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-full transition-colors text-gray-500 hover:text-red-600"
            >
              View Full Recipe
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}