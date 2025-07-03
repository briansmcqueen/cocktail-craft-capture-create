
import React from "react";
import { Cocktail } from "@/data/classicCocktails";
import { getTrendingRecipes } from "@/utils/likes";
import FeaturedSection from "./FeaturedSection";
import TechniquesSection from "./TechniquesSection";

type FeaturedProps = {
  recipes: Cocktail[];
  onRecipeClick: (recipe: Cocktail) => void;
  onEditRecipe?: (recipe: Cocktail) => void;
  onShareRecipe: (recipe: Cocktail) => void;
  userRecipes: Cocktail[];
  onToggleFavorite: (recipe: Cocktail) => void;
};

export default function Featured({ 
  recipes, 
  onRecipeClick, 
  onEditRecipe, 
  onShareRecipe, 
  userRecipes,
  onToggleFavorite 
}: FeaturedProps) {

  const trendingRecipes = getTrendingRecipes(recipes);
  const featuredRecipes = recipes.slice(0, 8);

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <FeaturedSection
        title="Featured Cocktails"
        recipes={featuredRecipes}
        onRecipeClick={onRecipeClick}
        onToggleFavorite={onToggleFavorite}
      />

      <FeaturedSection
        title="Trending Now"
        recipes={trendingRecipes}
        onRecipeClick={onRecipeClick}
        onToggleFavorite={onToggleFavorite}
      />

      <TechniquesSection />
    </div>
  );
}
