
import React, { useState, useEffect, useMemo } from "react";
import { Cocktail } from "@/data/classicCocktails";
import { getDrinkOfTheDay } from "@/utils/drinkOfTheDay";
import { getTrendingRecipesHybrid } from "@/utils/trendingRecipes";
import { getCommunityRecipesFromDB } from "@/services/recipesService";
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
  const [communityRecipes, setCommunityRecipes] = useState<Cocktail[]>([]);
  
  // Combine all recipes including user recipes
  const allRecipes = useMemo(() => [...recipes, ...userRecipes, ...communityRecipes], [recipes, userRecipes, communityRecipes]);
  
  // Get drink of the day
  const drinkOfTheDay = getDrinkOfTheDay(allRecipes);
  
  // Fetch community recipes with creator info
  useEffect(() => {
    const fetchCommunityRecipes = async () => {
      const recipes = await getCommunityRecipesFromDB(12);
      setCommunityRecipes(recipes);
    };
    
    fetchCommunityRecipes();
  }, []);
  
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
            isAuthenticated={!!user}
            onShowAuthModal={onShowAuthModal}
            onShowForm={onShowForm}
          />

          {/* Techniques Section */}
          <TechniquesSection onShowAuthModal={onShowAuthModal} />
        </div>
      </div>
    </div>
  );
}
