import { Cocktail } from "@/data/classicCocktails";
import { SearchFilters, SearchResult, BaseSpirit, FlavorProfile } from "@/types/search";

/**
 * Calculate how many ingredients are missing for a recipe
 */
export function calculateMissingIngredients(
  recipe: Cocktail,
  availableIngredients: string[]
): string[] {
  const missing: string[] = [];
  
  for (const ingredient of recipe.ingredients) {
    const cleanIngredient = cleanIngredientName(ingredient);
    const isAvailable = availableIngredients.some(available => 
      cleanIngredientName(available).toLowerCase().includes(cleanIngredient.toLowerCase()) ||
      cleanIngredient.toLowerCase().includes(cleanIngredientName(available).toLowerCase())
    );
    
    if (!isAvailable) {
      missing.push(cleanIngredient);
    }
  }
  
  return missing;
}

/**
 * Clean ingredient name for better matching
 */
export function cleanIngredientName(ingredient: string): string {
  return ingredient
    .replace(/^\d+[\s\w]*\s/, '') // Remove measurements like "2 oz", "1 dash"
    .replace(/^\d+\/\d+[\s\w]*\s/, '') // Remove fractions like "1/2 oz"
    .replace(/^\.\d+[\s\w]*\s/, '') // Remove decimal measurements
    .replace(/\s*\([^)]*\)/g, '') // Remove parenthetical descriptions
    .replace(/,.*$/, '') // Remove everything after comma
    .replace(/\s+(juice|syrup|bitters|liqueur|garnish|twist|peel|wedge|slice|wheel).*$/i, '')
    .replace(/\s+(fresh|dried|simple|grenadine|maraschino).*$/i, '')
    .trim();
}

/**
 * Extract base spirit from a cocktail
 */
export function extractBaseSpirit(recipe: Cocktail): BaseSpirit | null {
  const ingredients = recipe.ingredients.join(' ').toLowerCase();
  
  if (ingredients.includes('gin')) return 'gin';
  if (ingredients.includes('vodka')) return 'vodka';
  if (ingredients.includes('whiskey') || ingredients.includes('bourbon') || ingredients.includes('rye')) return 'whiskey';
  if (ingredients.includes('rum')) return 'rum';
  if (ingredients.includes('tequila')) return 'tequila';
  if (ingredients.includes('brandy') || ingredients.includes('cognac')) return 'brandy';
  if (ingredients.includes('mezcal')) return 'mezcal';
  if (ingredients.includes('liqueur') || ingredients.includes('amaretto') || ingredients.includes('cointreau')) return 'liqueur';
  
  return null;
}

/**
 * Extract flavor profiles from cocktail tags and ingredients
 */
export function extractFlavorProfiles(recipe: Cocktail): FlavorProfile[] {
  const profiles: FlavorProfile[] = [];
  const searchText = `${recipe.tags?.join(' ')} ${recipe.ingredients.join(' ')} ${recipe.notes || ''}`.toLowerCase();
  
  if (searchText.includes('bitter') || searchText.includes('campari') || searchText.includes('negroni')) profiles.push('bitter');
  if (searchText.includes('sweet') || searchText.includes('sugar') || searchText.includes('syrup')) profiles.push('sweet');
  if (searchText.includes('sour') || searchText.includes('lemon') || searchText.includes('lime')) profiles.push('sour');
  if (searchText.includes('herbal') || searchText.includes('mint') || searchText.includes('basil')) profiles.push('herbal');
  if (searchText.includes('fruit') || searchText.includes('berry') || searchText.includes('cherry')) profiles.push('fruity');
  if (searchText.includes('smoky') || searchText.includes('mezcal') || searchText.includes('scotch')) profiles.push('smoky');
  if (searchText.includes('spicy') || searchText.includes('pepper') || searchText.includes('ginger')) profiles.push('spicy');
  if (searchText.includes('cream') || searchText.includes('milk') || searchText.includes('egg')) profiles.push('creamy');
  if (searchText.includes('dry') || searchText.includes('martini') || searchText.includes('vermouth')) profiles.push('dry');
  if (searchText.includes('refresh') || searchText.includes('fizz') || searchText.includes('soda')) profiles.push('refreshing');
  if (searchText.includes('strong') || searchText.includes('boozy') || searchText.includes('spirit-forward')) profiles.push('strong');
  if (searchText.includes('light') || searchText.includes('spritz') || searchText.includes('low-alcohol')) profiles.push('light');
  
  return profiles;
}

/**
 * Check if a cocktail matches the search filters
 */
export function matchesFilters(
  recipe: Cocktail,
  filters: SearchFilters,
  availableIngredients: string[]
): boolean {
  // Text search
  if (filters.query) {
    const searchableText = `${recipe.name} ${recipe.ingredients.join(' ')} ${recipe.tags?.join(' ')} ${recipe.notes || ''}`.toLowerCase();
    if (!searchableText.includes(filters.query.toLowerCase())) {
      return false;
    }
  }

  // Can make only filter
  if (filters.canMakeOnly) {
    const missing = calculateMissingIngredients(recipe, availableIngredients);
    if (missing.length > 0) return false;
  }

  // Max missing ingredients
  if (filters.maxMissingIngredients !== null) {
    const missing = calculateMissingIngredients(recipe, availableIngredients);
    if (missing.length > filters.maxMissingIngredients) return false;
  }

  // Base spirits filter
  if (filters.baseSpirits.length > 0) {
    const baseSpirit = extractBaseSpirit(recipe);
    if (!baseSpirit || !filters.baseSpirits.includes(baseSpirit)) return false;
  }

  // Difficulty filter
  if (filters.difficulty !== 'any' && recipe.difficulty) {
    if (recipe.difficulty !== filters.difficulty) return false;
  }

  // Technique filter
  if (filters.technique !== 'any' && recipe.technique) {
    if (recipe.technique !== filters.technique) return false;
  }

  // Glass type filter
  if (filters.glassType !== 'any' && recipe.glassType) {
    if (recipe.glassType !== filters.glassType) return false;
  }

  // Flavor profiles filter
  if (filters.flavorProfiles.length > 0) {
    const recipeProfiles = extractFlavorProfiles(recipe);
    const hasMatchingProfile = filters.flavorProfiles.some(profile => 
      recipeProfiles.includes(profile)
    );
    if (!hasMatchingProfile) return false;
  }

  // Special constraints
  if (filters.noEggWhites) {
    const hasEgg = recipe.ingredients.some(ing => 
      ing.toLowerCase().includes('egg')
    );
    if (hasEgg) return false;
  }

  if (filters.noAbsinthe) {
    const hasAbsinthe = recipe.ingredients.some(ing => 
      ing.toLowerCase().includes('absinthe')
    );
    if (hasAbsinthe) return false;
  }

  if (filters.noCream) {
    const hasCream = recipe.ingredients.some(ing => 
      ing.toLowerCase().includes('cream') || ing.toLowerCase().includes('milk')
    );
    if (hasCream) return false;
  }

  return true;
}

/**
 * Calculate availability score (0-100) based on missing ingredients
 */
export function calculateAvailabilityScore(
  recipe: Cocktail,
  availableIngredients: string[]
): number {
  const totalIngredients = recipe.ingredients.length;
  const missingIngredients = calculateMissingIngredients(recipe, availableIngredients);
  const availableCount = totalIngredients - missingIngredients.length;
  
  return Math.round((availableCount / totalIngredients) * 100);
}

/**
 * Search and filter cocktails
 */
export function searchCocktails(
  recipes: Cocktail[],
  filters: SearchFilters,
  availableIngredients: string[] = []
): SearchResult[] {
  return recipes
    .filter(recipe => matchesFilters(recipe, filters, availableIngredients))
    .map(recipe => {
      const missingIngredients = calculateMissingIngredients(recipe, availableIngredients);
      const availabilityScore = calculateAvailabilityScore(recipe, availableIngredients);
      
      return {
        cocktail: recipe,
        canMake: missingIngredients.length === 0,
        missingIngredients,
        availabilityScore
      };
    })
    .sort((a, b) => {
      // Sort by availability first (can make -> missing 1 -> missing 2+)
      if (a.canMake && !b.canMake) return -1;
      if (!a.canMake && b.canMake) return 1;
      
      // Then by availability score
      if (a.availabilityScore !== b.availabilityScore) {
        return b.availabilityScore - a.availabilityScore;
      }
      
      // Finally alphabetically
      return a.cocktail.name.localeCompare(b.cocktail.name);
    });
}

/**
 * Generate search suggestions based on query
 */
export function generateSearchSuggestions(
  query: string,
  recipes: Cocktail[],
  recentSearches: string[]
): string[] {
  const suggestions: string[] = [];
  const lowerQuery = query.toLowerCase();

  // Recent searches that match
  recentSearches
    .filter(search => search.toLowerCase().includes(lowerQuery))
    .slice(0, 2)
    .forEach(search => suggestions.push(search));

  // Cocktail names that match
  recipes
    .filter(recipe => recipe.name.toLowerCase().includes(lowerQuery))
    .slice(0, 3)
    .forEach(recipe => suggestions.push(recipe.name));

  // Common ingredients that match
  const commonIngredients = ['gin', 'vodka', 'whiskey', 'rum', 'tequila', 'lime juice', 'lemon juice', 'simple syrup'];
  commonIngredients
    .filter(ingredient => ingredient.toLowerCase().includes(lowerQuery))
    .slice(0, 2)
    .forEach(ingredient => suggestions.push(ingredient));

  return [...new Set(suggestions)].slice(0, 5);
}

/**
 * Get count of recipes for each base spirit
 */
export function getBaseSpritCounts(
  recipes: Cocktail[],
  availableIngredients: string[] = []
): Record<BaseSpirit, number> {
  const counts: Record<BaseSpirit, number> = {
    gin: 0,
    vodka: 0,
    whiskey: 0,
    rum: 0,
    tequila: 0,
    brandy: 0,
    mezcal: 0,
    liqueur: 0
  };

  recipes.forEach(recipe => {
    const baseSpirit = extractBaseSpirit(recipe);
    if (baseSpirit) {
      counts[baseSpirit]++;
    }
  });

  return counts;
}