import { ingredientDatabase, Ingredient } from "@/data/ingredients";
import { Cocktail } from "@/data/classicCocktails";

export interface IngredientMatch {
  ingredientId: string;
  confidence: number;
  matchType: 'exact' | 'alias' | 'fuzzy' | 'category';
}

export interface RecipeAnalysis {
  recipe: Cocktail;
  requiredIngredients: IngredientMatch[];
  missingIngredients: IngredientMatch[];
  availableIngredients: IngredientMatch[];
  canMake: boolean;
  missingCount: number;
}

// Create ingredient lookup maps for better performance
const ingredientByName = new Map<string, string>();
const ingredientByAlias = new Map<string, string>();
const ingredientsByCategory = new Map<string, string[]>();
const ingredientsBySubCategory = new Map<string, string[]>();

// Cache for ingredient matches to avoid repeated computations
const ingredientMatchCache = new Map<string, IngredientMatch[]>();

// Cache for recipe analyses
const recipeAnalysisCache = new Map<string, RecipeAnalysis>();

// Initialize lookup maps
ingredientDatabase.forEach(ingredient => {
  ingredientByName.set(ingredient.name.toLowerCase(), ingredient.id);
  
  ingredient.aliases.forEach(alias => {
    ingredientByAlias.set(alias.toLowerCase(), ingredient.id);
  });
  
  const categoryKey = ingredient.category.toLowerCase();
  if (!ingredientsByCategory.has(categoryKey)) {
    ingredientsByCategory.set(categoryKey, []);
  }
  ingredientsByCategory.get(categoryKey)!.push(ingredient.id);
  
  const subCategoryKey = ingredient.subCategory.toLowerCase();
  if (!ingredientsBySubCategory.has(subCategoryKey)) {
    ingredientsBySubCategory.set(subCategoryKey, []);
  }
  ingredientsBySubCategory.get(subCategoryKey)!.push(ingredient.id);
});

// Normalize ingredient text for matching
function normalizeIngredientText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\d+\s*(oz|ml|cup|tbsp|tsp|dash|splash|drop|part|cl)\s*/g, '') // Remove measurements
    .replace(/\s+(for\s+garnish|garnish|optional)$/g, '') // Remove garnish notes
    .replace(/^\s*fresh\s+/g, '') // Remove "fresh" prefix
    .replace(/\s+juice$/g, '') // Remove "juice" suffix for citrus
    .replace(/\s+peel$/g, '') // Remove "peel" suffix
    .replace(/\s+zest$/g, '') // Remove "zest" suffix
    .replace(/\s+twist$/g, '') // Remove "twist" suffix
    .trim();
}

// Find ingredient matches with confidence scoring
export function findIngredientMatches(ingredientText: string): IngredientMatch[] {
  const normalized = normalizeIngredientText(ingredientText);
  
  // Check cache first
  if (ingredientMatchCache.has(normalized)) {
    return ingredientMatchCache.get(normalized)!;
  }
  
  const matches: IngredientMatch[] = [];
  
  // Exact name match
  const exactMatch = ingredientByName.get(normalized);
  if (exactMatch) {
    const result = [{
      ingredientId: exactMatch,
      confidence: 1.0,
      matchType: 'exact' as const
    }];
    ingredientMatchCache.set(normalized, result);
    return result;
  }
  
  // Alias match
  const aliasMatch = ingredientByAlias.get(normalized);
  if (aliasMatch) {
    const result = [{
      ingredientId: aliasMatch,
      confidence: 0.9,
      matchType: 'alias' as const
    }];
    ingredientMatchCache.set(normalized, result);
    return result;
  }
  
  // Fuzzy matching
  const fuzzyMatches = findFuzzyMatches(normalized);
  matches.push(...fuzzyMatches);
  
  // Category/type matching
  const categoryMatches = findCategoryMatches(normalized);
  matches.push(...categoryMatches);
  
  // Sort by confidence and return top matches
  const result = matches
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3); // Top 3 matches
    
  // Cache the result
  ingredientMatchCache.set(normalized, result);
  return result;
}

function findFuzzyMatches(normalized: string): IngredientMatch[] {
  const matches: IngredientMatch[] = [];
  
  ingredientDatabase.forEach(ingredient => {
    const nameMatch = calculateSimilarity(normalized, ingredient.name.toLowerCase());
    if (nameMatch > 0.7) {
      matches.push({
        ingredientId: ingredient.id,
        confidence: nameMatch * 0.8, // Reduce confidence for fuzzy matches
        matchType: 'fuzzy'
      });
    }
    
    ingredient.aliases.forEach(alias => {
      const aliasMatch = calculateSimilarity(normalized, alias.toLowerCase());
      if (aliasMatch > 0.7) {
        matches.push({
          ingredientId: ingredient.id,
          confidence: aliasMatch * 0.75,
          matchType: 'fuzzy'
        });
      }
    });
  });
  
  return matches;
}

function findCategoryMatches(normalized: string): IngredientMatch[] {
  const matches: IngredientMatch[] = [];
  
  // Common category mappings
  const categoryMappings: Record<string, string[]> = {
    'whiskey': ['bourbon', 'rye', 'scotch', 'irish whiskey'],
    'rum': ['white rum', 'dark rum', 'spiced rum'],
    'gin': ['london dry gin', 'plymouth gin'],
    'vodka': ['vodka'],
    'tequila': ['blanco tequila', 'reposado tequila'],
    'vermouth': ['sweet vermouth', 'dry vermouth'],
    'bitters': ['angostura bitters', 'orange bitters'],
    'citrus': ['lemon', 'lime', 'orange'],
    'syrup': ['simple syrup', 'grenadine', 'honey syrup']
  };
  
  Object.entries(categoryMappings).forEach(([category, types]) => {
    if (normalized.includes(category)) {
      types.forEach(type => {
        const matchingIngredients = ingredientDatabase.filter(ing => 
          ing.name.toLowerCase().includes(type) || 
          ing.aliases.some(alias => alias.toLowerCase().includes(type))
        );
        
        matchingIngredients.forEach(ing => {
          matches.push({
            ingredientId: ing.id,
            confidence: 0.6,
            matchType: 'category'
          });
        });
      });
    }
  });
  
  return matches;
}

// Calculate string similarity using Levenshtein distance
function calculateSimilarity(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  
  if (len1 === 0) return len2 === 0 ? 1 : 0;
  if (len2 === 0) return 0;
  
  const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));
  
  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  
  const maxLen = Math.max(len1, len2);
  return (maxLen - matrix[len1][len2]) / maxLen;
}

// Analyze recipes to determine what can be made
export function analyzeRecipes(recipes: Cocktail[], userIngredients: string[]): RecipeAnalysis[] {
  const userIngredientSet = new Set(userIngredients);
  const cacheKey = `${recipes.map(r => r.id).join(',')}-${userIngredients.sort().join(',')}`;
  
  return recipes.map(recipe => {
    // Create a cache key for this specific recipe and user ingredients combination
    const recipeCacheKey = `${recipe.id}-${userIngredients.sort().join(',')}`;
    
    // Check if we have this analysis cached
    if (recipeAnalysisCache.has(recipeCacheKey)) {
      return recipeAnalysisCache.get(recipeCacheKey)!;
    }
    
    const requiredMatches: IngredientMatch[] = [];
    
    // Find matches for each ingredient in the recipe
    recipe.ingredients.forEach(ingredient => {
      const matches = findIngredientMatches(ingredient);
      if (matches.length > 0) {
        requiredMatches.push(matches[0]); // Take best match
      } else {
        // If no match found, create a placeholder to ensure recipe is marked as unmakeable
        requiredMatches.push({
          ingredientId: `unknown_${ingredient.replace(/[^a-zA-Z0-9]/g, '_')}`,
          confidence: 0,
          matchType: 'exact'
        });
      }
    });
    
    // Separate available and missing ingredients
    const availableIngredients = requiredMatches.filter(match => 
      userIngredientSet.has(match.ingredientId)
    );
    
    const missingIngredients = requiredMatches.filter(match => 
      !userIngredientSet.has(match.ingredientId)
    );
    
    const canMake = missingIngredients.length === 0 && requiredMatches.length > 0;
    
    const analysis: RecipeAnalysis = {
      recipe,
      requiredIngredients: requiredMatches,
      missingIngredients,
      availableIngredients,
      canMake,
      missingCount: missingIngredients.length
    };
    
    // Cache the analysis
    recipeAnalysisCache.set(recipeCacheKey, analysis);
    
    return analysis;
  });
}

// Find substitutions for missing ingredients
export function findSubstitutions(ingredientId: string): string[] {
  const ingredient = ingredientDatabase.find(ing => ing.id === ingredientId);
  if (!ingredient) return [];
  
  // Find ingredients in the same subcategory
  const sameSubCategory = ingredientDatabase.filter(ing => 
    ing.subCategory === ingredient.subCategory && ing.id !== ingredientId
  );
  
  // Find ingredients in the same category
  const sameCategory = ingredientDatabase.filter(ing => 
    ing.category === ingredient.category && 
    ing.subCategory !== ingredient.subCategory && 
    ing.id !== ingredientId
  );
  
  // Return substitutions ordered by preference
  return [
    ...sameSubCategory.map(ing => ing.id),
    ...sameCategory.slice(0, 3).map(ing => ing.id) // Limit category matches
  ];
}

// Calculate what ingredients would unlock the most recipes
export function calculateIngredientValue(
  ingredientId: string, 
  recipes: Cocktail[], 
  userIngredients: string[]
): { newRecipesUnlocked: Cocktail[], score: number } {
  const analyses = analyzeRecipes(recipes, userIngredients);
  
  // Find recipes that would become makeable with this ingredient
  const newRecipesUnlocked = analyses
    .filter(analysis => 
      !analysis.canMake && 
      analysis.missingCount === 1 &&
      analysis.missingIngredients.some(missing => missing.ingredientId === ingredientId)
    )
    .map(analysis => analysis.recipe);
  
  // Calculate score based on number of recipes and recipe popularity
  const score = newRecipesUnlocked.length;
  
  return { newRecipesUnlocked, score };
}