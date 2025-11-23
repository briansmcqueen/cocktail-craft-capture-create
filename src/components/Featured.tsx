
import React, { useState, useEffect, useMemo } from "react";
import { Cocktail } from "@/data/classicCocktails";
import { getDrinkOfTheDay } from "@/utils/drinkOfTheDay";
import { getTrendingRecipesHybrid } from "@/utils/trendingRecipes";
import { useMyBarData } from "@/hooks/useMyBarData";
import { useAuth } from "@/hooks/useAuth";
import DrinkOfTheDay from "./DrinkOfTheDay";
import HeroSection from "./HeroSection";
import FeaturedBartendersSection from "./FeaturedBartendersSection";
import CommunityCreationsSection from "./CommunityCreationsSection";
import CommunityCallToAction from "./CommunityCallToAction";
import TechniquesSection from "./TechniquesSection";
import { useNavigate } from "react-router-dom";

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
  onEditRecipe, 
  onShareRecipe, 
  userRecipes,
  onToggleFavorite,
  onShowAuthModal,
  onNavigateToMyBar,
  onShowForm
}: FeaturedProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trendingRecipes, setTrendingRecipes] = useState<Cocktail[]>([]);
  
  // Combine all recipes including user recipes
  const allRecipes = useMemo(() => [...recipes, ...userRecipes], [recipes, userRecipes]);
  
  // Get drink of the day
  const drinkOfTheDay = getDrinkOfTheDay(allRecipes);
  
  // Filter for community creations (user-created recipes only)
  const communityRecipes = useMemo(() => 
    userRecipes.slice(0, 12), 
    [userRecipes]
  );
  
  // Fetch trending recipes based on ratings
  useEffect(() => {
    const fetchTrendingRecipes = async () => {
      const trending = await getTrendingRecipesHybrid(allRecipes, 12);
      setTrendingRecipes(trending);
    };
    
    fetchTrendingRecipes();
  }, [allRecipes]);

  const handleNavigateToMyBar = () => {
    onNavigateToMyBar?.();
  };

  const handleNavigateToDiscover = () => {
    navigate('/discover');
  };

  const handleCreateRecipe = () => {
    onShowForm?.();
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="space-y-8 md:space-y-12">
          {/* Hero Section - Mission Statement */}
          <HeroSection
            onNavigateToDiscover={handleNavigateToDiscover}
            onNavigateToMyBar={handleNavigateToMyBar}
            isAuthenticated={!!user}
          />

          {/* Drink of the Day */}
          <DrinkOfTheDay
            recipe={drinkOfTheDay}
            onRecipeClick={onRecipeClick}
            onShowAuthModal={onShowAuthModal}
          />

          {/* Featured Bartenders */}
          <FeaturedBartendersSection
            onShowAuthModal={onShowAuthModal}
          />

          {/* Community Creations - User Recipes */}
          {communityRecipes.length > 0 && (
            <CommunityCreationsSection
              title="From Our Community"
              recipes={communityRecipes}
              onShowAuthModal={onShowAuthModal}
            />
          )}

          {/* Trending Now - Community Engagement */}
          {trendingRecipes.length > 0 && (
            <CommunityCreationsSection
              title="Trending in the Community"
              recipes={trendingRecipes}
              onShowAuthModal={onShowAuthModal}
            />
          )}

          {/* Call to Action */}
          <CommunityCallToAction
            onCreateRecipe={handleCreateRecipe}
            onNavigateToDiscover={handleNavigateToDiscover}
            isAuthenticated={!!user}
            onShowAuthModal={onShowAuthModal}
          />

          {/* Techniques Section */}
          <TechniquesSection onShowAuthModal={onShowAuthModal} />
        </div>
      </div>
    </div>
  );
}
