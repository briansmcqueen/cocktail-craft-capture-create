
import React from "react";
import { Button } from "@/components/ui/button";
import UniversalRecipeCard from "./UniversalRecipeCard";
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
  onShowAuthModal?: () => void;
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
  library,
  onShowAuthModal
}: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-12 lg:mt-16 px-4">
        <p className="mb-4 text-sm lg:text-base">No recipes yet in this library.</p>
        {library !== "classics" && library !== "favorites" && (
          <Button 
            onClick={onShowForm} 
            className="w-full sm:w-auto"
          >
            Add Your First Recipe
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      {recipes.map((recipe) => (
        <UniversalRecipeCard
          key={recipe.id}
          recipe={recipe}
          onShowAuthModal={onShowAuthModal}
        />
      ))}
    </>
  );
}
