import React, { useState, useEffect, useMemo } from "react";
import { Cocktail, classicCocktails } from "@/data/classicCocktails";
import { getDrinkOfTheDay } from "@/utils/drinkOfTheDay";
import { getCommunityRecipesFromDB } from "@/services/recipesService";
import { useMyBarData } from "@/hooks/useMyBarData";
import { useRecipeAnalysis } from "@/hooks/useRecipeAnalysis";
import { useAuth } from "@/hooks/useAuth";

import DrinkOfTheDay from "./DrinkOfTheDay";
import MyBarModule from "./QuickAccessBar";
import ClassicShowcase from "./ClassicShowcase";
import FeaturedBartendersSection from "./FeaturedBartendersSection";
import CommunityCreationsSection from "./CommunityCreationsSection";
import GetStartedCTA from "./GetStartedCTA";

type FeaturedProps = {
  recipes: Cocktail[];
  onRecipeClick: (recipe: Cocktail) => void;
  onEditRecipe?: (recipe: Cocktail) => void;
  onShareRecipe: (recipe: Cocktail) => void;
  userRecipes: Cocktail[];
  onToggleFavorite: (recipe: Cocktail) => void;
  onShowAuthModal?: () => void;
  onNavigateToMyBar?: () => void;
  onShowForm?: () => void;
};

export default function Featured({ 
  recipes, 
  onRecipeClick, 
  onShowAuthModal,
}: FeaturedProps) {
  const { user } = useAuth();
  const [communityRecipes, setCommunityRecipes] = useState<Cocktail[]>([]);
  
  // My Bar data for MyBarModule
  const { myBar, myBarIngredients } = useMyBarData();
  const allRecipes = useMemo(() => [...classicCocktails, ...communityRecipes], [communityRecipes]);
  const { recipesICanMake, recipesNeedingOneIngredient, whatToBuyNext } = useRecipeAnalysis(allRecipes, myBarIngredients, myBar);

  // Compute Drink of the Day from stable classics array only to prevent flicker
  const drinkOfTheDay = useMemo(() => getDrinkOfTheDay(recipes), [recipes]);
  
  useEffect(() => {
    getCommunityRecipesFromDB(6).then(setCommunityRecipes);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="sm:px-6 lg:px-8 lg:py-8 px-0 py-0">
        <div className="space-y-8 md:space-y-12">
          {/* 1. Hero: Drink of the Day */}
          <DrinkOfTheDay recipe={drinkOfTheDay} onRecipeClick={onRecipeClick} onShowAuthModal={onShowAuthModal} />

          {/* 2. My Bar Module (authenticated + has ingredients) */}
          {user && myBarIngredients.length > 0 && (
            <MyBarModule
              ingredientCount={myBarIngredients.length}
              canMakeCount={recipesICanMake.length}
              oneAwayCount={recipesNeedingOneIngredient.length}
              topRecommendation={
                whatToBuyNext.length > 0
                  ? { name: whatToBuyNext[0].ingredient.name, unlocks: whatToBuyNext[0].newRecipesUnlocked.length }
                  : undefined
              }
            />
          )}

          {/* 3. Classic Cocktails Grid */}
          <ClassicShowcase />

          {/* 4. Community Spotlight (3+ recipes) */}
          {communityRecipes.length >= 3 && (
            <CommunityCreationsSection
              title="From the Community"
              recipes={communityRecipes.slice(0, 6)}
              onShowAuthModal={onShowAuthModal}
            />
          )}

          {/* 5. Featured Bartenders (min 3 enforced internally) */}
          <FeaturedBartendersSection onShowAuthModal={onShowAuthModal} />

          {/* 6. CTA for unauthenticated users */}
          {!user && <GetStartedCTA onShowAuthModal={onShowAuthModal} />}
        </div>
      </div>
    </div>
  );
}
