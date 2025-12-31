import { useState, useMemo, useCallback } from 'react';
import { Cocktail } from '@/data/classicCocktails';

// Filter category definitions with comprehensive options from classic cocktails
export const FILTER_CATEGORIES = {
  baseSpirits: {
    label: 'Base Spirits',
    options: [
      { id: 'vodka', label: 'Vodka', keywords: ['vodka'] },
      { id: 'gin', label: 'Gin', keywords: ['gin', 'old tom gin', 'london dry gin'] },
      { id: 'rum', label: 'Rum', keywords: ['rum', 'rhum', 'light rum', 'white rum', 'dark rum', 'gold rum', 'aged rum', 'jamaican rum', 'bacardi'] },
      { id: 'tequila', label: 'Tequila', keywords: ['tequila', 'blanco tequila', 'silver tequila'] },
      { id: 'mezcal', label: 'Mezcal', keywords: ['mezcal'] },
      { id: 'whiskey', label: 'Whiskey/Bourbon', keywords: ['whiskey', 'whisky', 'bourbon', 'rye', 'rye whiskey', 'irish whiskey'] },
      { id: 'scotch', label: 'Scotch', keywords: ['scotch', 'scotch whisky', 'blended scotch'] },
      { id: 'brandy', label: 'Brandy/Cognac', keywords: ['brandy', 'cognac', 'armagnac', 'calvados', 'apple brandy', 'apricot brandy'] },
      { id: 'pisco', label: 'Pisco', keywords: ['pisco'] },
      { id: 'cachaca', label: 'Cachaça', keywords: ['cachaça', 'cachaca'] },
      { id: 'sherry', label: 'Sherry', keywords: ['sherry', 'fino sherry'] },
    ]
  },
  modifiers: {
    label: 'Modifiers',
    options: [
      { id: 'dry-vermouth', label: 'Dry Vermouth', keywords: ['dry vermouth'] },
      { id: 'sweet-vermouth', label: 'Sweet Vermouth', keywords: ['sweet vermouth', 'rosso vermouth'] },
      { id: 'campari', label: 'Campari', keywords: ['campari'] },
      { id: 'aperol', label: 'Aperol', keywords: ['aperol'] },
      { id: 'triple-sec', label: 'Triple Sec/Cointreau', keywords: ['triple sec', 'cointreau', 'orange liqueur'] },
      { id: 'curacao', label: 'Curaçao', keywords: ['curaçao', 'curacao', 'orange curaçao', 'blue curaçao', 'blue curacao'] },
      { id: 'maraschino', label: 'Maraschino', keywords: ['maraschino liqueur', 'maraschino'] },
      { id: 'benedictine', label: 'Benedictine', keywords: ['benedictine'] },
      { id: 'chartreuse', label: 'Chartreuse', keywords: ['chartreuse', 'green chartreuse', 'yellow chartreuse'] },
      { id: 'amaretto', label: 'Amaretto', keywords: ['amaretto'] },
      { id: 'coffee-liqueur', label: 'Coffee Liqueur', keywords: ['coffee liqueur', 'kahlúa', 'kahlua'] },
      { id: 'creme-de-cacao', label: 'Crème de Cacao', keywords: ['crème de cacao', 'creme de cacao', 'white crème de cacao'] },
      { id: 'creme-de-menthe', label: 'Crème de Menthe', keywords: ['crème de menthe', 'creme de menthe', 'green crème de menthe', 'white crème de menthe'] },
      { id: 'elderflower', label: 'Elderflower', keywords: ['elderflower', 'st. germain', 'st germain'] },
      { id: 'cherry-liqueur', label: 'Cherry Liqueur', keywords: ['cherry heering', 'cherry liqueur', 'kirsch'] },
      { id: 'peach', label: 'Peach Liqueur/Schnapps', keywords: ['peach liqueur', 'peach schnapps'] },
      { id: 'lillet', label: 'Lillet', keywords: ['lillet', 'lillet blanc'] },
      { id: 'absinthe', label: 'Absinthe', keywords: ['absinthe'] },
      { id: 'fernet', label: 'Fernet', keywords: ['fernet', 'fernet-branca'] },
      { id: 'galliano', label: 'Galliano', keywords: ['galliano'] },
      { id: 'falernum', label: 'Falernum', keywords: ['falernum'] },
    ]
  },
  citrus: {
    label: 'Citrus',
    options: [
      { id: 'lemon', label: 'Lemon', keywords: ['lemon juice', 'lemon', 'fresh lemon'] },
      { id: 'lime', label: 'Lime', keywords: ['lime juice', 'lime', 'fresh lime'] },
      { id: 'orange', label: 'Orange', keywords: ['orange juice', 'fresh orange'] },
      { id: 'grapefruit', label: 'Grapefruit', keywords: ['grapefruit juice', 'grapefruit'] },
      { id: 'pineapple', label: 'Pineapple', keywords: ['pineapple juice', 'pineapple'] },
      { id: 'cranberry', label: 'Cranberry', keywords: ['cranberry juice', 'cranberry'] },
    ]
  },
  syrups: {
    label: 'Syrups & Sweeteners',
    options: [
      { id: 'simple-syrup', label: 'Simple Syrup', keywords: ['simple syrup'] },
      { id: 'demerara', label: 'Demerara/Rich Simple', keywords: ['demerara', 'rich simple', 'rich syrup', 'turbinado'] },
      { id: 'honey', label: 'Honey Syrup', keywords: ['honey syrup', 'honey'] },
      { id: 'grenadine', label: 'Grenadine', keywords: ['grenadine'] },
      { id: 'orgeat', label: 'Orgeat', keywords: ['orgeat'] },
      { id: 'agave', label: 'Agave', keywords: ['agave syrup', 'agave'] },
      { id: 'raspberry', label: 'Raspberry Syrup', keywords: ['raspberry syrup', 'raspberry'] },
      { id: 'creme-de-cassis', label: 'Crème de Cassis', keywords: ['crème de cassis', 'creme de cassis', 'cassis'] },
    ]
  },
  style: {
    label: 'Style / Mood',
    options: [
      { id: 'shaken', label: 'Shaken', keywords: ['shake'], isTechnique: true, technique: 'shake' },
      { id: 'stirred', label: 'Stirred', keywords: ['stir'], isTechnique: true, technique: 'stir' },
      { id: 'built', label: 'Built', keywords: ['build'], isTechnique: true, technique: 'build' },
      { id: 'muddled', label: 'Muddled', keywords: ['muddle'], isTechnique: true, technique: 'muddle' },
      { id: 'blended', label: 'Blended', keywords: ['blend'], isTechnique: true, technique: 'blend' },
      { id: 'sweet', label: 'Sweet', keywords: ['sweet'], isTag: true },
      { id: 'sour', label: 'Sour', keywords: ['sour', 'tart'], isTag: true },
      { id: 'bitter', label: 'Bitter', keywords: ['bitter'], isTag: true },
      { id: 'refreshing', label: 'Refreshing', keywords: ['refreshing'], isTag: true },
      { id: 'spirit-forward', label: 'Spirit-Forward', keywords: ['spirit-forward', 'boozy', 'strong'], isTag: true },
      { id: 'tropical', label: 'Tropical/Tiki', keywords: ['tropical', 'tiki'], isTag: true },
      { id: 'creamy', label: 'Creamy', keywords: ['creamy', 'cream'], isTag: true },
      { id: 'fruity', label: 'Fruity', keywords: ['fruity'], isTag: true },
      { id: 'sparkling', label: 'Sparkling', keywords: ['sparkling', 'bubbly', 'champagne', 'prosecco'], isTag: true },
    ]
  }
} as const;

export type FilterCategoryKey = keyof typeof FILTER_CATEGORIES;

export interface CocktailFilters {
  baseSpirits: string[];
  modifiers: string[];
  citrus: string[];
  syrups: string[];
  style: string[];
}

const EMPTY_FILTERS: CocktailFilters = {
  baseSpirits: [],
  modifiers: [],
  citrus: [],
  syrups: [],
  style: [],
};

// Check if a recipe ingredient matches any of the keywords
function ingredientMatchesKeywords(ingredient: string, keywords: readonly string[]): boolean {
  const lowerIngredient = ingredient.toLowerCase();
  return keywords.some(keyword => lowerIngredient.includes(keyword.toLowerCase()));
}

interface FilterOption {
  id: string;
  label: string;
  keywords: readonly string[];
  isTechnique?: boolean;
  technique?: string;
  isTag?: boolean;
}

// Check if a recipe matches a filter option
function recipeMatchesOption(recipe: Cocktail, option: FilterOption): boolean {
  // Handle technique filters
  if (option.isTechnique && option.technique) {
    return recipe.technique === option.technique;
  }
  
  // Handle tag-based filters (style/mood)
  if ('isTag' in option && option.isTag) {
    return recipe.tags?.some(tag => 
      option.keywords.some(kw => tag.toLowerCase().includes(kw.toLowerCase()))
    ) || false;
  }
  
  // Handle ingredient-based filters
  return recipe.ingredients.some(ing => ingredientMatchesKeywords(ing, option.keywords));
}

// Check if a recipe matches filters for a category (OR logic within category)
function recipeMatchesCategoryFilters(
  recipe: Cocktail, 
  categoryKey: FilterCategoryKey, 
  selectedIds: string[]
): boolean {
  if (selectedIds.length === 0) return true;
  
  const category = FILTER_CATEGORIES[categoryKey];
  const selectedOptions = category.options.filter(opt => selectedIds.includes(opt.id));
  
  // OR logic: recipe matches if it has ANY of the selected options
  return selectedOptions.some(option => recipeMatchesOption(recipe, option));
}

export function useCocktailFilters(recipes: Cocktail[]) {
  const [filters, setFilters] = useState<CocktailFilters>(EMPTY_FILTERS);

  // Toggle a single filter option
  const toggleFilter = useCallback((category: FilterCategoryKey, optionId: string) => {
    setFilters(prev => {
      const currentSelections = prev[category];
      const isSelected = currentSelections.includes(optionId);
      
      return {
        ...prev,
        [category]: isSelected
          ? currentSelections.filter(id => id !== optionId)
          : [...currentSelections, optionId]
      };
    });
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
  }, []);

  // Clear filters for a specific category
  const clearCategoryFilters = useCallback((category: FilterCategoryKey) => {
    setFilters(prev => ({
      ...prev,
      [category]: []
    }));
  }, []);

  // Count total active filters
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).reduce((total, arr) => total + arr.length, 0);
  }, [filters]);

  // Filter recipes based on active filters
  // AND logic across categories, OR logic within categories
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      // Must match all categories that have selections
      return (Object.keys(FILTER_CATEGORIES) as FilterCategoryKey[]).every(categoryKey => 
        recipeMatchesCategoryFilters(recipe, categoryKey, filters[categoryKey])
      );
    });
  }, [recipes, filters]);

  return {
    filters,
    setFilters,
    toggleFilter,
    clearAllFilters,
    clearCategoryFilters,
    activeFilterCount,
    filteredRecipes,
    hasActiveFilters: activeFilterCount > 0,
  };
}
