import { Cocktail } from "@/data/classicCocktails";

/**
 * Gets the drink of the day based on the current date
 * Uses a deterministic algorithm to ensure the same drink is shown for the entire day
 */
export function getDrinkOfTheDay(recipes: Cocktail[]): Cocktail {
  if (recipes.length === 0) {
    throw new Error("No recipes available for drink of the day");
  }

  // Get today's date as a seed for deterministic selection
  const today = new Date();
  const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  // Create a simple hash from the date string
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use absolute value and modulo to get a valid index
  const index = Math.abs(hash) % recipes.length;
  
  return recipes[index];
}

/**
 * Gets personalized recommendations based on user's favorite recipes
 */
export function getPersonalizedRecommendations(
  allRecipes: Cocktail[], 
  favoriteRecipeIds: string[],
  limit: number = 8
): Cocktail[] {
  if (favoriteRecipeIds.length === 0) {
    // If no favorites, return trending or random selection
    return allRecipes.slice(0, limit);
  }

  const favoriteRecipes = allRecipes.filter(recipe => 
    favoriteRecipeIds.includes(recipe.id)
  );

  // Extract tags from favorite recipes to find similar ones
  const favoriteTags = new Set<string>();
  favoriteRecipes.forEach(recipe => {
    recipe.tags?.forEach(tag => favoriteTags.add(tag));
  });

  // Score recipes based on tag overlap with favorites
  const scoredRecipes = allRecipes
    .filter(recipe => !favoriteRecipeIds.includes(recipe.id)) // Exclude already favorited
    .map(recipe => {
      const recipeTags = recipe.tags || [];
      const overlapCount = recipeTags.filter(tag => favoriteTags.has(tag)).length;
      return {
        recipe,
        score: overlapCount
      };
    })
    .filter(item => item.score > 0) // Only include recipes with some tag overlap
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.recipe);

  // If we don't have enough personalized recommendations, fill with popular ones
  if (scoredRecipes.length < limit) {
    const additionalRecipes = allRecipes
      .filter(recipe => 
        !favoriteRecipeIds.includes(recipe.id) && 
        !scoredRecipes.find(sr => sr.id === recipe.id)
      )
      .slice(0, limit - scoredRecipes.length);
    
    return [...scoredRecipes, ...additionalRecipes];
  }

  return scoredRecipes;
}