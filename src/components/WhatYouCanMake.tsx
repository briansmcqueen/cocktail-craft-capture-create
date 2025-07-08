import React from "react";
import { ChefHat, Plus } from "lucide-react";
import { Cocktail } from "@/data/classicCocktails";
import { Button } from "@/components/ui/button";
import RecipeCard from "./RecipeCard";

interface WhatYouCanMakeProps {
  recipes: Cocktail[];
  myBarIngredients: string[];
  onRecipeClick: (recipe: Cocktail) => void;
  onNavigateToMyBar: () => void;
}

export default function WhatYouCanMake({ 
  recipes, 
  myBarIngredients,
  onRecipeClick,
  onNavigateToMyBar 
}: WhatYouCanMakeProps) {
  if (myBarIngredients.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <ChefHat className="h-5 w-5 text-primary" />
          <h2 className="text-gray-900 tracking-[0.08em] leading-[1.45] uppercase font-bold text-[1rem]">
            What You Can Make
          </h2>
        </div>
        
        <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl p-6 lg:p-8 border border-accent/20 text-center">
          <div className="max-w-md mx-auto">
            <ChefHat className="h-12 w-12 mx-auto mb-4 text-primary/60" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Build Your Bar to Get Started
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Add ingredients to your bar and discover cocktails you can make right now.
            </p>
            <Button 
              onClick={onNavigateToMyBar}
              className="bg-primary hover:bg-primary/90 text-white font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Build My Bar
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (recipes.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <ChefHat className="h-5 w-5 text-primary" />
          <h2 className="text-gray-900 tracking-[0.08em] leading-[1.45] uppercase font-bold text-[1rem]">
            What You Can Make
          </h2>
        </div>
        
        <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl p-6 lg:p-8 border border-accent/20 text-center">
          <div className="max-w-md mx-auto">
            <ChefHat className="h-12 w-12 mx-auto mb-4 text-primary/60" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Add More Ingredients
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              You have {myBarIngredients.length} ingredient{myBarIngredients.length !== 1 ? 's' : ''} in your bar. Add a few more to unlock your first cocktails!
            </p>
            <Button 
              onClick={onNavigateToMyBar}
              className="bg-primary hover:bg-primary/90 text-white font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Ingredients
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const displayRecipes = recipes.slice(0, 6);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-primary" />
          <h2 className="text-gray-900 tracking-[0.08em] leading-[1.45] uppercase font-bold text-[1rem]">
            What You Can Make ({recipes.length})
          </h2>
        </div>
        {recipes.length > 6 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onNavigateToMyBar}
            className="text-primary border-primary hover:bg-primary/5"
          >
            View All
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayRecipes.map((recipe) => (
          <div 
            key={recipe.id}
            className="relative overflow-hidden rounded-lg border border-gray-200 hover:border-primary/30 transition-all duration-300 bg-white shadow-sm hover:shadow-md group"
          >
            <RecipeCard
              recipe={recipe}
              onSelect={() => onRecipeClick(recipe)}
              editable={false}
            />
            <div className="absolute top-2 right-2">
              <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full border border-green-200">
                ✓ Can Make
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {recipes.length > 6 && (
        <div className="text-center mt-6">
          <Button 
            variant="outline"
            onClick={onNavigateToMyBar}
            className="text-primary border-primary hover:bg-primary/5"
          >
            View All {recipes.length} Cocktails You Can Make
          </Button>
        </div>
      )}
    </section>
  );
}