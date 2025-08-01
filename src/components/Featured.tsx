
import React from "react";
import { Cocktail } from "@/data/classicCocktails";
import { getTrendingRecipes } from "@/utils/likes";
import { getDrinkOfTheDay, getPersonalizedRecommendations } from "@/utils/drinkOfTheDay";
import { useMyBarData } from "@/hooks/useMyBarData";
import { useRecipeAnalysis } from "@/hooks/useRecipeAnalysis";
import { useFavorites } from "@/hooks/useFavoritesRefactored";
import DrinkOfTheDay from "./DrinkOfTheDay";
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
  
  // Combine all recipes including user recipes
  const allRecipes = [...recipes, ...userRecipes];
  
  // Calculate what user can make with their bar
  const { recipesICanMake } = useRecipeAnalysis(allRecipes, myBarIngredients, {});

  // Get drink of the day
  const drinkOfTheDay = getDrinkOfTheDay(allRecipes);
  
  // Get personalized recommendations
  const personalizedRecipes = getPersonalizedRecommendations(allRecipes, favoriteIds, 8);
  
  // Get trending recipes
  const trendingRecipes = getTrendingRecipes(allRecipes);

  const handleNavigateToMyBar = () => {
    onNavigateToMyBar?.();
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="space-y-8 md:space-y-12">
          {/* Drink of the Day */}
          <DrinkOfTheDay
            recipe={drinkOfTheDay}
            onRecipeClick={onRecipeClick}
            onShowAuthModal={onShowAuthModal}
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
            recipes={allRecipes.slice(0, 8)}
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
          <TechniquesSection onShowAuthModal={onShowAuthModal} />
        </div>
      </div>
    </div>
  );
}
