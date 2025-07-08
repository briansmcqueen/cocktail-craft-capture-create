
import React from "react";
import { Cocktail } from "@/data/classicCocktails";
import { getTrendingRecipes } from "@/utils/likes";
import { getDrinkOfTheDay, getPersonalizedRecommendations } from "@/utils/drinkOfTheDay";
import { useMyBarData } from "@/hooks/useMyBarData";
import { useRecipeAnalysis } from "@/hooks/useRecipeAnalysis";
import { useFavorites } from "@/hooks/useFavoritesRefactored";
import DrinkOfTheDay from "./DrinkOfTheDay";
import WhatYouCanMake from "./WhatYouCanMake";
import FeaturedSection from "./FeaturedSection";
import TechniquesSection from "./TechniquesSection";

type FeaturedProps = {
  recipes: Cocktail[];
  onRecipeClick: (recipe: Cocktail) => void;
  onEditRecipe?: (recipe: Cocktail) => void;
  onShareRecipe: (recipe: Cocktail) => void;
  userRecipes: Cocktail[];
  onToggleFavorite: (recipe: Cocktail) => void;
  onShowAuthModal?: () => void;
  onNavigateToMyBar?: () => void;
};

export default function Featured({ 
  recipes, 
  onRecipeClick, 
  onEditRecipe, 
  onShareRecipe, 
  userRecipes,
  onToggleFavorite,
  onShowAuthModal,
  onNavigateToMyBar
}: FeaturedProps) {
  // Get data for personalization
  const { myBarIngredients } = useMyBarData(0);
  const { favoriteIds } = useFavorites();
  
  // Calculate what user can make with their bar
  const { recipesICanMake } = useRecipeAnalysis(recipes, myBarIngredients, {});

  // Get drink of the day
  const drinkOfTheDay = getDrinkOfTheDay(recipes);
  
  // Get personalized recommendations
  const personalizedRecipes = getPersonalizedRecommendations(recipes, favoriteIds, 8);
  
  // Get trending recipes
  const trendingRecipes = getTrendingRecipes(recipes);

  const handleNavigateToMyBar = () => {
    onNavigateToMyBar?.();
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-0">
      {/* Drink of the Day */}
      <DrinkOfTheDay
        recipe={drinkOfTheDay}
        onRecipeClick={onRecipeClick}
        onShowAuthModal={onShowAuthModal}
      />

      {/* What You Can Make */}
      <WhatYouCanMake
        recipes={recipesICanMake}
        myBarIngredients={myBarIngredients}
        onRecipeClick={onRecipeClick}
        onNavigateToMyBar={handleNavigateToMyBar}
      />

      {/* Personalized Recommendations */}
      {favoriteIds.length > 0 && (
        <FeaturedSection
          title="Recommended For You"
          recipes={personalizedRecipes}
          onRecipeClick={onRecipeClick}
          onShowAuthModal={onShowAuthModal}
        />
      )}

      {/* Featured Cocktails */}
      <FeaturedSection
        title="Featured Cocktails"
        recipes={recipes.slice(0, 8)}
        onRecipeClick={onRecipeClick}
        onShowAuthModal={onShowAuthModal}
      />

      {/* Trending Now */}
      {trendingRecipes.length > 0 && (
        <FeaturedSection
          title="Trending Now"
          recipes={trendingRecipes}
          onRecipeClick={onRecipeClick}
          onShowAuthModal={onShowAuthModal}
        />
      )}

      {/* Techniques Section */}
      <TechniquesSection />
    </div>
  );
}
