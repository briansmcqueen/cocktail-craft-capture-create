
import React from "react";
import { Cocktail } from "@/data/classicCocktails";
import { getTrendingRecipes } from "@/utils/likes";
import { toggleFavorite } from "@/utils/favorites";
import FeaturedSection from "./FeaturedSection";
import TechniquesSection from "./TechniquesSection";

type FeaturedProps = {
  recipes: Cocktail[];
  onRecipeClick: (recipe: Cocktail) => void;
  onEditRecipe?: (recipe: Cocktail) => void;
  onShareRecipe: (recipe: Cocktail) => void;
  userRecipes: Cocktail[];
};

export default function Featured({ recipes, onRecipeClick, onEditRecipe, onShareRecipe, userRecipes }: FeaturedProps) {
  const trendingRecipes = getTrendingRecipes(recipes);
  const featuredRecipes = recipes.slice(0, 8);

  const handleToggleFavorite = (recipe: Cocktail) => {
    toggleFavorite(recipe.id);
    window.dispatchEvent(new Event('favorites-update'));
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <FeaturedSection
        title="Featured Cocktails"
        recipes={featuredRecipes}
        onRecipeClick={onRecipeClick}
        onToggleFavorite={handleToggleFavorite}
      />

      <FeaturedSection
        title="Trending Now"
        recipes={trendingRecipes}
        onRecipeClick={onRecipeClick}
        onToggleFavorite={handleToggleFavorite}
      />

      <TechniquesSection />
    </div>
  );
}
