import React, { useState } from "react";
import { ChefHat, Plus, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cocktail } from "@/data/classicCocktails";
import { Ingredient } from "@/data/ingredients";
import UniversalRecipeCard from "@/components/UniversalRecipeCard";

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
  onAddToShoppingList?: (ingredientId: string) => void;
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
  onAddToShoppingList,
  user,
  loading = false
}: MyBarResultsProps) {
  const [showAllRecipes, setShowAllRecipes] = useState(false);
  
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
      {/* Recipes You Can Make */}
      {recipesICanMake.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-pure-white mb-4 flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            You Can Make ({recipesICanMake.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {(showAllRecipes ? recipesICanMake : recipesICanMake.slice(0, 6)).map((recipe) => (
              <UniversalRecipeCard
                key={recipe.id}
                recipe={recipe}
              />
            ))}
          </div>
          {recipesICanMake.length > 6 && !showAllRecipes && (
            <div className="text-center mt-4">
              <Button
                variant="outline"
                onClick={() => setShowAllRecipes(true)}
                className="text-sm"
              >
                Show more ({recipesICanMake.length - 6} more cocktails)
              </Button>
            </div>
          )}
          {showAllRecipes && recipesICanMake.length > 6 && (
            <div className="text-center mt-4">
              <Button
                variant="outline"
                onClick={() => setShowAllRecipes(false)}
                className="text-sm"
              >
                Show less
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Almost There - Need 1 Ingredient */}
      {recipesNeedingOneIngredient.length > 0 && (
        <Card className="p-4 bg-medium-charcoal border-light-charcoal">
          <h3 className="text-base font-medium text-golden-amber mb-3 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Almost There ({recipesNeedingOneIngredient.length})
          </h3>
          <div className="space-y-2">
            {recipesNeedingOneIngredient.map((recipe) => {
              const missingIngredient = ingredientMap[recipe.missingIngredient || ''];
              if (!missingIngredient) return null;
              
              return (
                <div
                  key={recipe.id}
                  className="flex items-center justify-between p-3 bg-golden-amber/10 border border-golden-amber/20 rounded-organic-md hover:bg-golden-amber/20 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-light-text text-sm">{recipe.name}</h4>
                    <p className="text-xs text-soft-gray truncate">
                      Need: {missingIngredient.name}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onAddIngredient(recipe.missingIngredient || '')}
                    className="ml-3 text-xs h-7 px-2 text-golden-amber hover:bg-golden-amber/20 hover:text-golden-amber opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Empty State - Has ingredients but no recipes */}
      {myBarIngredients.length > 0 && recipesICanMake.length === 0 && recipesNeedingOneIngredient.length === 0 && (
        <Card className="p-8 text-center bg-medium-charcoal border-light-charcoal">
          <ChefHat className="h-12 w-12 mx-auto mb-4 text-soft-gray" />
          <h3 className="text-lg font-medium text-light-text mb-2">
            Add More Ingredients
          </h3>
          <p className="text-soft-gray">
            You have {myBarIngredients.length} ingredient{myBarIngredients.length !== 1 ? 's' : ''} in your bar. 
            Add a few more to unlock cocktails you can make!
          </p>
        </Card>
      )}
    </div>
  );
}