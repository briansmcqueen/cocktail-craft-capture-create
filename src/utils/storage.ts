
import type { Cocktail } from "@/data/classicCocktails";
import { CacheService } from "@/services/cacheService";

const USER_RECIPES_KEY = "user_cocktail_recipes";

export function saveUserRecipe(recipe: Cocktail) {
  const all = getUserRecipes();
  const existing = all.find((r) => r.id === recipe.id);
  
  // Ensure user recipes are properly flagged
  const recipeWithFlag = { ...recipe, isUserRecipe: true };
  
  let updated;
  if (existing) {
    updated = all.map((r) => (r.id === recipe.id ? recipeWithFlag : r));
  } else {
    updated = [...all, recipeWithFlag];
  }
  
  // Use async localStorage operations for better performance
  CacheService.setLocalStorage(USER_RECIPES_KEY, updated);
  
  // Update cache immediately for instant UI feedback
  CacheService.setRecipes(updated);
}

export function getUserRecipes(): Cocktail[] {
  // Try cache first for better performance
  const cached = CacheService.getRecipes();
  if (cached) return cached;
  
  // Fallback to localStorage
  const recipes = CacheService.getLocalStorage<Cocktail[]>(USER_RECIPES_KEY) || [];
  
  // Cache the result
  CacheService.setRecipes(recipes);
  
  return recipes;
}

export function deleteUserRecipe(id: string) {
  const all = getUserRecipes().filter((r) => r.id !== id);
  
  // Use async localStorage operations
  CacheService.setLocalStorage(USER_RECIPES_KEY, all);
  
  // Update cache immediately
  CacheService.deleteRecipe(id);
}
