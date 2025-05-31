
import React from "react";
import { Cocktail } from "@/data/classicCocktails";
import RecipeCard from "./RecipeCard";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";

type FavoritesProps = {
  favoriteRecipes: Cocktail[];
  onRecipeClick: (recipe: Cocktail) => void;
  onEditRecipe?: (recipe: Cocktail) => void;
  onShareRecipe: (recipe: Cocktail) => void;
  userRecipes: Cocktail[];
};

export default function Favorites({ favoriteRecipes, onRecipeClick, onEditRecipe, onShareRecipe, userRecipes }: FavoritesProps) {
  if (favoriteRecipes.length === 0) {
    return (
      <div className="text-center text-red-400/70 mt-12 lg:mt-16 px-4">
        <Heart className="mx-auto mb-4 text-red-400/50" size={48} />
        <h2 className="text-xl font-display mb-2 text-red-300">No favorites yet</h2>
        <p className="mb-4 text-sm lg:text-base">
          Start favoriting recipes by clicking the heart icon on any cocktail you love!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="text-red-400" size={24} />
        <h2 className="text-2xl font-display font-bold text-red-400">
          Your Favorite Cocktails
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {favoriteRecipes.map((recipe) => (
          <div key={recipe.id} className="relative group">
            <div className="relative overflow-hidden rounded-lg border border-red-500/20 hover:border-red-400/40 transition-all duration-300">
              <RecipeCard
                recipe={recipe}
                onSelect={() => onRecipeClick(recipe)}
                editable={userRecipes.find((ur) => ur.id === recipe.id) !== undefined}
                onEdit={
                  userRecipes.find((ur) => ur.id === recipe.id) !== undefined && onEditRecipe
                    ? () => onEditRecipe(recipe)
                    : undefined
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
