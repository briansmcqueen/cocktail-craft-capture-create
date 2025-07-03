
import React from "react";
import { Button } from "@/components/ui/button";
import RecipeCardWithFavorite from "./RecipeCardWithFavorite";
import { Cocktail } from "@/data/classicCocktails";

type RecipeGridProps = {
  recipes: Cocktail[];
  onRecipeClick: (recipe: Cocktail) => void;
  onToggleFavorite: (recipe: Cocktail) => void;
  onLike: (recipe: Cocktail) => void;
  onShareRecipe: (recipe: Cocktail) => void;
  onTagClick: (tag: string) => void;
  onShowForm: () => void;
  forceUpdate: number;
  library: string;
};

export default function RecipeGrid({
  recipes,
  onRecipeClick,
  onToggleFavorite,
  onLike,
  onShareRecipe,
  onTagClick,
  onShowForm,
  forceUpdate,
  library
}: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-12 lg:mt-16 px-4">
        <p className="mb-4 text-sm lg:text-base">No recipes yet in this library.</p>
        {library !== "classics" && library !== "favorites" && (
          <Button 
            onClick={onShowForm} 
            className="w-full sm:w-auto bg-orange-600 text-white hover:bg-orange-700"
          >
            Add Your First Recipe
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      {recipes.map((recipe) => (
        <RecipeCardWithFavorite
          key={`${recipe.id}-${forceUpdate}`}
          recipe={recipe}
          onRecipeClick={onRecipeClick}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
}
