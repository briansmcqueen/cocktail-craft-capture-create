
import React from "react";
import { Cocktail } from "@/data/classicCocktails";
import RecipeCard from "./RecipeCard";
import { Heart, ThumbsUp, Share } from "lucide-react";
import { Button } from "./ui/button";
import { getLikeCount, addLike } from "@/utils/likes";
import { toggleFavorite, isFavorite } from "@/utils/favorites";

type FavoritesProps = {
  favoriteRecipes: Cocktail[];
  onRecipeClick: (recipe: Cocktail) => void;
  onEditRecipe?: (recipe: Cocktail) => void;
  onShareRecipe: (recipe: Cocktail) => void;
  userRecipes: Cocktail[];
};

export default function Favorites({ favoriteRecipes, onRecipeClick, onEditRecipe, onShareRecipe, userRecipes }: FavoritesProps) {
  const handleLike = (recipe: Cocktail) => {
    addLike(recipe.id);
    // Force a re-render by updating the component state
    window.dispatchEvent(new Event('favorites-update'));
  };

  const handleToggleFavorite = (recipe: Cocktail) => {
    toggleFavorite(recipe.id);
    // Force a re-render by updating the component state
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
          <div key={recipe.id} className="relative group">
            <div className="relative overflow-hidden rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white shadow-sm hover:shadow-md">
              <RecipeCard
                recipe={recipe}
                onSelect={() => onRecipeClick(recipe)}
                editable={false}
              />
            </div>
            
            {/* Action buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <Button
                size="sm"
                variant="secondary"
                className={`p-2 bg-white/90 hover:bg-white border border-gray-200 shadow-sm backdrop-blur-sm rounded-full transition-colors ${
                  isFavorite(recipe.id) ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                }`}
                onClick={() => handleToggleFavorite(recipe)}
              >
                <Heart size={14} fill={isFavorite(recipe.id) ? 'currentColor' : 'none'} />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className={`p-2 bg-white/90 hover:bg-white border border-gray-200 shadow-sm backdrop-blur-sm rounded-full transition-colors ${
                  getLikeCount(recipe.id) > 0 ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                }`}
                onClick={() => handleLike(recipe)}
              >
                <ThumbsUp size={14} fill={getLikeCount(recipe.id) > 0 ? 'currentColor' : 'none'} />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="p-2 bg-white/90 hover:bg-white text-red-600 border border-gray-200 shadow-sm backdrop-blur-sm rounded-full"
                onClick={() => onShareRecipe(recipe)}
              >
                <Share size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
