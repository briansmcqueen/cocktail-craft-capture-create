import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { Clock, TrendingUp } from 'lucide-react';
import { SearchInput } from '@/components/ui/search-input';
import CocktailFilters from './CocktailFilters';
import SearchResults from './SearchResults';
import { Cocktail } from '@/data/classicCocktails';
import { cn } from '@/lib/utils';
import { useSearchShortcut } from '@/hooks/useSearchShortcut';
import { useCocktailFilters, FilterCategoryKey } from '@/hooks/useCocktailFilters';
import { SearchResult } from '@/types/search';

interface SearchInterfaceProps {
  recipes: Cocktail[];
  availableIngredients?: string[];
  onRecipeClick: (recipe: Cocktail) => void;
  onAddIngredient?: (ingredient: string) => void;
  onTagClick?: (tag: string) => void;
  placeholder?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  showCanMakeFirst?: boolean;
  className?: string;
  user?: any;
}

export default function SearchInterface({
  recipes,
  availableIngredients = [],
  onRecipeClick,
  onAddIngredient,
  onTagClick,
  placeholder = "Search cocktails, ingredients, or flavors...",
  emptyStateTitle,
  emptyStateDescription,
  showCanMakeFirst = false,
  className,
  user
}: SearchInterfaceProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Add keyboard shortcut for search
  useSearchShortcut(searchInputRef);
  
  // Use the new cocktail filters hook
  const {
    filters,
    toggleFilter,
    clearAllFilters,
    clearCategoryFilters,
    activeFilterCount,
    filteredRecipes: filterMatchedRecipes,
    hasActiveFilters,
  } = useCocktailFilters(recipes);

  // Apply search query on top of category filters
  const searchFilteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) return filterMatchedRecipes;
    
    const query = searchQuery.toLowerCase();
    return filterMatchedRecipes.filter(recipe => 
      recipe.name.toLowerCase().includes(query) ||
      recipe.ingredients.some(ing => ing.toLowerCase().includes(query)) ||
      recipe.tags?.some(tag => tag.toLowerCase().includes(query)) ||
      recipe.notes?.toLowerCase().includes(query)
    );
  }, [filterMatchedRecipes, searchQuery]);

  // Generate simple suggestions based on search query
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const matchingNames = recipes
      .filter(r => r.name.toLowerCase().includes(query))
      .map(r => r.name)
      .slice(0, 5);
    return matchingNames;
  }, [searchQuery, recipes]);

  // Convert to SearchResult format for SearchResults component
  const groupedResults = useMemo(() => {
    const allResults: SearchResult[] = searchFilteredRecipes.map(recipe => ({
      cocktail: recipe,
      canMake: true,
      missingIngredients: [],
      availabilityScore: 100,
    }));
    
    return {
      canMake: allResults,
      missing1: [],
      missing2Plus: [],
      all: allResults,
    };
  }, [searchFilteredRecipes]);

  // Focus search input when component mounts
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Save search to recent searches
  const saveToRecentSearches = useCallback((query: string) => {
    if (!query.trim()) return;
    
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== query.toLowerCase());
      const updated = [query, ...filtered].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
  }, []);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    saveToRecentSearches(suggestion);
  }, [saveToRecentSearches]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  }, []);

  const handleClearAllFilters = useCallback(() => {
    clearAllFilters();
    setSearchQuery('');
  }, [clearAllFilters]);

  const isAnythingFiltered = hasActiveFilters || searchQuery.trim().length > 0;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main search bar */}
      <div className="relative">
        <SearchInput
          ref={searchInputRef}
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          onClear={handleClearSearch}
          onFocus={() => setShowSuggestions(searchQuery.length > 0)}
          onBlur={() => {
            // Delay hiding suggestions to allow clicks
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          aria-label="Search cocktails"
        />

        {/* Search suggestions dropdown */}
        {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-organic-md shadow-lg z-50 max-h-80 overflow-y-auto">
            {/* Recent searches */}
            {recentSearches.length > 0 && !searchQuery && (
              <div className="p-3 border-b border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Clock size={12} />
                  Recent
                </div>
                {recentSearches.slice(0, 3).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="block w-full text-left px-2 py-1 text-sm text-card-foreground hover:bg-muted rounded"
                  >
                    {search}
                  </button>
                ))}
              </div>
            )}

            {/* Search suggestions */}
            {suggestions.length > 0 && (
              <div className="p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <TrendingUp size={12} />
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="block w-full text-left px-2 py-1 text-sm text-card-foreground hover:bg-muted rounded"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* New cocktail filters */}
      <CocktailFilters
        filters={filters}
        onToggleFilter={toggleFilter}
        onClearAll={handleClearAllFilters}
        onClearCategory={clearCategoryFilters}
        activeFilterCount={activeFilterCount}
        filteredCount={searchFilteredRecipes.length}
        totalCount={recipes.length}
      />

      {/* Search results */}
      <SearchResults
        results={groupedResults}
        onRecipeClick={onRecipeClick}
        onAddIngredient={onAddIngredient}
        onTagClick={onTagClick}
        emptyStateTitle={emptyStateTitle}
        emptyStateDescription={emptyStateDescription}
        hasActiveFilters={isAnythingFiltered}
        onClearFilters={handleClearAllFilters}
        user={user}
      />
    </div>
  );
}
