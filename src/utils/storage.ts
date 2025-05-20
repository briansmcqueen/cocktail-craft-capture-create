
import type { Cocktail } from "@/data/classicCocktails";

const USER_RECIPES_KEY = "user_cocktail_recipes";

export function saveUserRecipe(recipe: Cocktail) {
  const all = getUserRecipes();
  const existing = all.find((r) => r.id === recipe.id);
  let updated;
  if (existing) {
    updated = all.map((r) => (r.id === recipe.id ? recipe : r));
  } else {
    updated = [...all, recipe];
  }
  localStorage.setItem(USER_RECIPES_KEY, JSON.stringify(updated));
}

export function getUserRecipes(): Cocktail[] {
  const data = localStorage.getItem(USER_RECIPES_KEY);
  return data ? JSON.parse(data) : [];
}

export function deleteUserRecipe(id: string) {
  const all = getUserRecipes().filter((r) => r.id !== id);
  localStorage.setItem(USER_RECIPES_KEY, JSON.stringify(all));
}
