import React, { useState, useEffect, useMemo } from "react";
import { Cocktail, classicCocktails } from "@/data/classicCocktails";
import { getDrinkOfTheDay } from "@/utils/drinkOfTheDay";
import { getCommunityRecipesFromDB } from "@/services/recipesService";
import { useMyBarData } from "@/hooks/useMyBarData";
import { useRecipeAnalysis } from "@/hooks/useRecipeAnalysis";
import { useAuth } from "@/hooks/useAuth";
import DrinkOfTheDay from "./DrinkOfTheDay";
import QuickAccessBar from "./QuickAccessBar";
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
  
  // My Bar data for QuickAccessBar
  const { myBar, myBarIngredients } = useMyBarData(0);
  const allRecipes = useMemo(() => [...classicCocktails, ...communityRecipes], [communityRecipes]);
  const { recipesICanMake } = useRecipeAnalysis(allRecipes, myBarIngredients, myBar);

  // Combine for drink of the day
  const combinedRecipes = useMemo(() => {
    const combined = [...recipes, ...communityRecipes];
    const seen = new Set<string>();
    return combined.filter(r => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });
  }, [recipes, communityRecipes]);
  
  const drinkOfTheDay = getDrinkOfTheDay(combinedRecipes);
  
  useEffect(() => {
    getCommunityRecipesFromDB(6).then(setCommunityRecipes);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="space-y-8 md:space-y-12">
          {/* 1. Hero: Drink of the Day */}
          <DrinkOfTheDay recipe={drinkOfTheDay} onRecipeClick={onRecipeClick} onShowAuthModal={onShowAuthModal} />

          {/* 2. Quick Access Bar (authenticated + has ingredients) */}
          {user && myBarIngredients.length > 0 && (
            <QuickAccessBar count={recipesICanMake.length} />
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
