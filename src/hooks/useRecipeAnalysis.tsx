import { useMemo } from "react";
import { Cocktail } from "@/data/classicCocktails";
import { ingredientDatabase, Ingredient } from "@/data/ingredients";
import { 
  analyzeRecipes, 
  calculateIngredientValue
} from "@/services/ingredientMatchingService";

interface RecommendedIngredient {
  ingredient: Ingredient;
  newRecipesUnlocked: Cocktail[];
  score: number;
}

interface MyBarInventory {
  [ingredientId: string]: boolean;
}

export function useRecipeAnalysis(
  recipes: Cocktail[], 
  myBarIngredients: string[], 
  myBar: MyBarInventory,
  includeAssumedIngredients: boolean = true
) {

  // Analyze all recipes with intelligent matching - memoize with stable key
  const recipeAnalyses = useMemo(() => {
    if (myBarIngredients.length === 0) return [];
    return analyzeRecipes(recipes, myBarIngredients, includeAssumedIngredients);
  }, [recipes, includeAssumedIngredients, myBarIngredients.join(',')]); // Use join for stable comparison

  // Get recipes user can make
  const recipesICanMake = useMemo(() => {
    return recipeAnalyses
      .filter(analysis => analysis.canMake)
      .map(analysis => analysis.recipe);
  }, [recipeAnalyses]);

  // Get recipes needing one ingredient
  const recipesNeedingOneIngredient = useMemo(() => {
    return recipeAnalyses
      .filter(analysis => !analysis.canMake && analysis.missingCount === 1)
      .map(analysis => ({
        ...analysis.recipe,
        missingIngredient: analysis.missingIngredients[0]?.ingredientId
      }));
  }, [recipeAnalyses]);

  // Calculate what to buy next - only if user has ingredients
  const whatToBuyNext = useMemo(() => {
    if (myBarIngredients.length === 0) return [];
    
    const ingredientValues: { [ingredientId: string]: RecommendedIngredient } = {};
    
    // Calculate value for each ingredient not in user's bar
    ingredientDatabase.forEach(ingredient => {
      if (!myBar[ingredient.id]) {
        const value = calculateIngredientValue(ingredient.id, recipes, myBarIngredients, includeAssumedIngredients);
        if (value.score > 0) {
          ingredientValues[ingredient.id] = {
            ingredient,
            newRecipesUnlocked: value.newRecipesUnlocked,
            score: value.score
          };
        }
      }
    });

    return Object.values(ingredientValues)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [recipes, includeAssumedIngredients, myBarIngredients.join(','), Object.keys(myBar).sort().join(',')]);

  return {
    recipesICanMake,
    recipesNeedingOneIngredient,
    whatToBuyNext
  };
}