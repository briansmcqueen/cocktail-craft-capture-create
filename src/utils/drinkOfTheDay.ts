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
 * Finds recipes with similar ingredients to favorites, excluding the favorites themselves
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

  // Extract ingredients from favorite recipes to find similar ones
  const favoriteIngredients = new Set<string>();
  favoriteRecipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      // Clean ingredient name by removing measurements and extra descriptors
      let cleanIngredient = ingredient
        .replace(/^\d+[\s\w]*\s/, '') // Remove measurements like "2 oz", "1 dash"
        .replace(/^\d+\/\d+[\s\w]*\s/, '') // Remove fractions like "1/2 oz"
        .replace(/^\.\d+[\s\w]*\s/, '') // Remove decimal measurements like ".5 oz"
        .replace(/\s*\([^)]*\)/g, '') // Remove parenthetical descriptions
        .replace(/,.*$/, '') // Remove everything after comma
        .trim()
        .toLowerCase();

      // Standardize common ingredient names
      if (cleanIngredient.includes('gin')) cleanIngredient = 'gin';
      else if (cleanIngredient.includes('vodka')) cleanIngredient = 'vodka';
      else if (cleanIngredient.includes('rum')) cleanIngredient = 'rum';
      else if (cleanIngredient.includes('whiskey') || cleanIngredient.includes('bourbon')) cleanIngredient = 'whiskey';
      else if (cleanIngredient.includes('tequila')) cleanIngredient = 'tequila';
      else if (cleanIngredient.includes('vermouth')) {
        if (cleanIngredient.includes('dry')) cleanIngredient = 'dry vermouth';
        else if (cleanIngredient.includes('sweet')) cleanIngredient = 'sweet vermouth';
        else cleanIngredient = 'vermouth';
      }
      else if (cleanIngredient.includes('lime')) cleanIngredient = 'lime juice';
      else if (cleanIngredient.includes('lemon')) cleanIngredient = 'lemon juice';
      else if (cleanIngredient.includes('triple sec') || cleanIngredient.includes('cointreau')) cleanIngredient = 'triple sec';
      
      favoriteIngredients.add(cleanIngredient);
    });
  });

  // Score recipes based on ingredient overlap with favorites
  const scoredRecipes = allRecipes
    .filter(recipe => !favoriteRecipeIds.includes(recipe.id)) // Exclude already favorited
    .map(recipe => {
      let overlapCount = 0;
      
      recipe.ingredients.forEach(ingredient => {
        // Clean this recipe's ingredient the same way
        let cleanIngredient = ingredient
          .replace(/^\d+[\s\w]*\s/, '')
          .replace(/^\d+\/\d+[\s\w]*\s/, '')
          .replace(/^\.\d+[\s\w]*\s/, '')
          .replace(/\s*\([^)]*\)/g, '')
          .replace(/,.*$/, '')
          .trim()
          .toLowerCase();

        // Apply same standardization
        if (cleanIngredient.includes('gin')) cleanIngredient = 'gin';
        else if (cleanIngredient.includes('vodka')) cleanIngredient = 'vodka';
        else if (cleanIngredient.includes('rum')) cleanIngredient = 'rum';
        else if (cleanIngredient.includes('whiskey') || cleanIngredient.includes('bourbon')) cleanIngredient = 'whiskey';
        else if (cleanIngredient.includes('tequila')) cleanIngredient = 'tequila';
        else if (cleanIngredient.includes('vermouth')) {
          if (cleanIngredient.includes('dry')) cleanIngredient = 'dry vermouth';
          else if (cleanIngredient.includes('sweet')) cleanIngredient = 'sweet vermouth';
          else cleanIngredient = 'vermouth';
        }
        else if (cleanIngredient.includes('lime')) cleanIngredient = 'lime juice';
        else if (cleanIngredient.includes('lemon')) cleanIngredient = 'lemon juice';
        else if (cleanIngredient.includes('triple sec') || cleanIngredient.includes('cointreau')) cleanIngredient = 'triple sec';
        
        if (favoriteIngredients.has(cleanIngredient)) {
          overlapCount++;
        }
      });
      
      return {
        recipe,
        score: overlapCount
      };
    })
    .filter(item => item.score > 0) // Only include recipes with ingredient overlap
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