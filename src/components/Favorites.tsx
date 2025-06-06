
import React, { useState, useEffect } from "react";
import { Cocktail } from "@/data/classicCocktails";
import RecipeCard from "./RecipeCard";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { toggleFavorite, isFavorite } from "@/utils/favorites";
import { getUserRecipes } from "@/utils/storage";

type FavoritesProps = {
  favoriteRecipes: Cocktail[];
  onRecipeClick: (recipe: Cocktail) => void;
  onEditRecipe?: (recipe: Cocktail) => void;
  onShareRecipe: (recipe: Cocktail) => void;
  userRecipes: Cocktail[];
};

export default function Favorites({ favoriteRecipes, onRecipeClick, onEditRecipe, onShareRecipe, userRecipes }: FavoritesProps) {
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      setForceUpdate(prev => prev + 1);
    };

    window.addEventListener('favorites-update', handleUpdate);
    return () => window.removeEventListener('favorites-update', handleUpdate);
  }, []);

  const handleToggleFavorite = (e: React.MouseEvent, recipe: Cocktail) => {
    e.stopPropagation();
    toggleFavorite(recipe.id);
    window.dispatchEvent(new Event('favorites-update'));
  };

  if (favoriteRecipes.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-12 lg:mt-16 px-4">
        <Heart className="mx-auto mb-4 text-gray-400" size={48} />
        <h2 className="text-xl font-serif font-normal mb-2 text-gray-900">No favorites yet</h2>
        <p className="mb-4 text-sm lg:text-base">
          Start favoriting recipes by clicking the heart icon on any cocktail you love!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="text-red-600" size={24} />
        <h2 className="text-2xl lg:text-3xl font-serif font-normal text-gray-900 tracking-wide">
          Your Favorite Cocktails
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {favoriteRecipes.map((recipe) => (
          <div key={`${recipe.id}-${forceUpdate}`} className="relative group">
            <div className="relative overflow-hidden rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white shadow-sm hover:shadow-md">
              <RecipeCard
                recipe={recipe}
                onSelect={() => onRecipeClick(recipe)}
                editable={false}
              />
            </div>
            
            <div className="absolute top-3 right-3">
              <Button
                size="sm"
                variant="secondary"
                className={`p-2 bg-white/90 hover:bg-white border border-gray-200 shadow-sm backdrop-blur-sm rounded-full transition-colors ${
                  isFavorite(recipe.id) ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                }`}
                onClick={(e) => handleToggleFavorite(e, recipe)}
              >
                <Heart size={14} fill={isFavorite(recipe.id) ? 'currentColor' : 'none'} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
