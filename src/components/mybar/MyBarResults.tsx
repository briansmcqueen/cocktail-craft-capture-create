import React from "react";
import { Star, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Cocktail } from "@/data/classicCocktails";
import { Ingredient } from "@/data/ingredients";
import RecipeCardWithFavorite from "@/components/RecipeCardWithFavorite";
import WhatToBuyNext from "./WhatToBuyNext";

interface RecommendedIngredient {
  ingredient: Ingredient;
  newRecipesUnlocked: Cocktail[];
  score: number;
}

interface MyBarResultsProps {
  myBarIngredients: string[];
  recipesICanMake: Cocktail[];
  recipesNeedingOneIngredient: (Cocktail & { missingIngredient?: string })[];
  whatToBuyNext: RecommendedIngredient[];
  ingredientMap: { [id: string]: Ingredient };
  onRecipeClick: (recipe: Cocktail) => void;
  onToggleFavorite: (recipe: Cocktail) => void;
  onTagClick: (tag: string) => void;
  onAddIngredient: (ingredientId: string) => void;
  user: any;
  loading?: boolean;
}

export default function MyBarResults({
  myBarIngredients,
  recipesICanMake,
  recipesNeedingOneIngredient,
  whatToBuyNext,
  ingredientMap,
  onRecipeClick,
  onToggleFavorite,
  onTagClick,
  onAddIngredient,
  user,
  loading = false
}: MyBarResultsProps) {
  if (myBarIngredients.length === 0) {
    if (!user) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Sign in to build your bar</h3>
          <p>Create an account to save your ingredient inventory and discover cocktails you can make.</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="space-y-6">
      {/* What to Buy Next */}
      <WhatToBuyNext 
        recommendations={whatToBuyNext}
        onAddIngredient={onAddIngredient}
        loading={loading}
      />

      {/* Recipes I Can Make */}
      {recipesICanMake.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-serif font-semibold">
              You Can Make {recipesICanMake.length} Cocktail{recipesICanMake.length !== 1 ? 's' : ''}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipesICanMake.slice(0, 6).map((recipe) => (
              <RecipeCardWithFavorite
                key={recipe.id}
                recipe={recipe}
                onRecipeClick={onRecipeClick}
                onToggleFavorite={onToggleFavorite}
                onTagClick={onTagClick}
              />
            ))}
          </div>
          {recipesICanMake.length > 6 && (
            <p className="text-center text-sm text-muted-foreground">
              +{recipesICanMake.length - 6} more cocktails available
            </p>
          )}
        </div>
      )}

      {/* Recipes Needing One Ingredient */}
      {recipesNeedingOneIngredient.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-semibold">Just One Ingredient Away</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipesNeedingOneIngredient.slice(0, 6).map((recipe) => (
              <div key={recipe.id} className="relative">
                <RecipeCardWithFavorite
                  recipe={recipe}
                  onRecipeClick={onRecipeClick}
                  onToggleFavorite={onToggleFavorite}
                  onTagClick={onTagClick}
                />
                {recipe.missingIngredient && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute top-2 right-2">
                          <Badge variant="outline" className="bg-background text-xs">
                            Need: {ingredientMap[recipe.missingIngredient]?.name}
                          </Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add {ingredientMap[recipe.missingIngredient]?.name} to make this cocktail</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {myBarIngredients.length === 0 && recipesNeedingOneIngredient.length === 0 && user && (
        <div className="text-center py-12 text-muted-foreground">
          <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Your bar is just getting started!</h3>
          <p>Add a few more ingredients to unlock your first cocktails.</p>
        </div>
      )}
    </div>
  );
}