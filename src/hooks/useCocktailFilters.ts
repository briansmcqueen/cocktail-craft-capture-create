import { useState, useMemo, useCallback } from 'react';
import { Cocktail } from '@/data/classicCocktails';

// Filter category definitions
export const FILTER_CATEGORIES = {
  baseSpirits: {
    label: 'Base Spirits',
    options: [
      { id: 'vodka', label: 'Vodka', keywords: ['vodka'] },
      { id: 'gin', label: 'Gin', keywords: ['gin'] },
      { id: 'rum', label: 'Rum', keywords: ['rum', 'rhum', 'cachaça', 'cachaca'] },
      { id: 'tequila', label: 'Tequila', keywords: ['tequila', 'mezcal'] },
      { id: 'whiskey', label: 'Whiskey', keywords: ['whiskey', 'whisky', 'bourbon', 'rye', 'scotch'] },
      { id: 'brandy', label: 'Brandy', keywords: ['brandy', 'cognac', 'armagnac', 'pisco'] },
    ]
  },
  modifiers: {
    label: 'Modifiers',
    options: [
      { id: 'dry-vermouth', label: 'Vermouth (Dry)', keywords: ['dry vermouth'] },
      { id: 'sweet-vermouth', label: 'Vermouth (Sweet)', keywords: ['sweet vermouth', 'rosso vermouth'] },
      { id: 'campari', label: 'Campari', keywords: ['campari'] },
      { id: 'aperol', label: 'Aperol', keywords: ['aperol'] },
      { id: 'triple-sec', label: 'Triple Sec/Cointreau', keywords: ['triple sec', 'cointreau', 'curaçao', 'curacao', 'orange liqueur'] },
      { id: 'liqueurs', label: 'Other Liqueurs', keywords: ['liqueur', 'amaretto', 'kahlua', 'bailey', 'chartreuse', 'benedictine', 'maraschino', 'creme de', 'crème de', 'st. germain', 'elderflower', 'absinthe', 'galliano', 'frangelico', 'drambuie'] },
    ]
  },
  citrus: {
    label: 'Citrus',
    options: [
      { id: 'lemon', label: 'Lemon', keywords: ['lemon juice', 'lemon'] },
      { id: 'lime', label: 'Lime', keywords: ['lime juice', 'lime'] },
      { id: 'orange', label: 'Orange', keywords: ['orange juice', 'orange'] },
      { id: 'grapefruit', label: 'Grapefruit', keywords: ['grapefruit juice', 'grapefruit'] },
    ]
  },
  syrups: {
    label: 'Syrups & Sweeteners',
    options: [
      { id: 'simple-syrup', label: 'Simple Syrup', keywords: ['simple syrup'] },
      { id: 'demerara', label: 'Demerara/Rich Simple', keywords: ['demerara', 'rich simple', 'rich syrup'] },
      { id: 'honey', label: 'Honey Syrup', keywords: ['honey syrup', 'honey'] },
      { id: 'grenadine', label: 'Grenadine', keywords: ['grenadine'] },
      { id: 'orgeat', label: 'Orgeat', keywords: ['orgeat'] },
    ]
  },
  style: {
    label: 'Style / Mood',
    options: [
      { id: 'shaken', label: 'Shaken', keywords: ['shake'], isTechnique: true, technique: 'shake' },
      { id: 'stirred', label: 'Stirred', keywords: ['stir'], isTechnique: true, technique: 'stir' },
      { id: 'built', label: 'Built', keywords: ['build'], isTechnique: true, technique: 'build' },
      { id: 'sweet', label: 'Sweet', keywords: ['sweet'], isTag: true },
      { id: 'sour', label: 'Sour', keywords: ['sour'], isTag: true },
      { id: 'bitter', label: 'Bitter', keywords: ['bitter'], isTag: true },
      { id: 'refreshing', label: 'Refreshing', keywords: ['refreshing'], isTag: true },
      { id: 'spirit-forward', label: 'Spirit-Forward', keywords: ['spirit-forward', 'strong'], isTag: true },
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
