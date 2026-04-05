import { Cocktail } from "@/data/classicCocktails";

// Convert recipe name to URL slug
export const recipeNameToSlug = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

// Convert URL slug back to recipe name
export const slugToRecipeName = (slug: string): string => {
  return slug.replace(/-/g, ' ');
};

// Generate the correct URL for any recipe
export const getRecipeUrl = (recipe: Cocktail): string => {
  const slug = recipeNameToSlug(recipe.name);
  if (recipe.creatorUsername && recipe.isUserRecipe) {
    return `/cocktail/${recipe.creatorUsername}/${slug}`;
  }
  if (recipe.isUserRecipe && recipe.id) {
    return `/cocktail/id/${recipe.id}`;
  }
  return `/cocktail/${slug}`;
};
