import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Clock, TrendingUp } from 'lucide-react';
import { SearchInput } from '@/components/ui/search-input';
import FilterPills from './FilterPills';
import AdvancedFilters from './AdvancedFilters';
import SearchResults from './SearchResults';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';
import { Cocktail } from '@/data/classicCocktails';
import { cn } from '@/lib/utils';
import { useSearchShortcut } from '@/hooks/useSearchShortcut';

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
  hideResults?: boolean;
  onFilteredRecipesChange?: (recipes: Cocktail[]) => void;
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
  user,
  hideResults = false,
  onFilteredRecipesChange
}: SearchInterfaceProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Add keyboard shortcut for search
  useSearchShortcut(searchInputRef);
  
  const {
    filters,
    isAdvancedOpen,
    recentSearches,
    savedFilters,
    showSuggestions,
    suggestions,
    searchResults,
    groupedResults,
    hasActiveFilters,
    activeFilterCount,
    updateFilters,
    clearFilters,
    handleSearchChange,
    setIsAdvancedOpen,
    setShowSuggestions,
    saveFilterCombination,
    loadSavedFilter,
    deleteSavedFilter
  } = useAdvancedSearch({
    recipes,
    availableIngredients,
    initialFilters: showCanMakeFirst ? { canMakeOnly: true } : {}
  });

  const canMakeCount = groupedResults.canMake.length;

  // Focus search input when component mounts
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    handleSearchChange(suggestion);
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    handleSearchChange('');
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };


  return (
    <div className={cn("space-y-6", className)}>
      {/* Main search bar */}
      <div className="relative">
        <SearchInput
          ref={searchInputRef}
          placeholder={placeholder}
          value={filters.query}
          onChange={(e) => handleSearchChange(e.target.value)}
          onClear={handleClearSearch}
          onFocus={() => setShowSuggestions(filters.query.length > 0)}
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
            {recentSearches.length > 0 && !filters.query && (
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

      {/* Filter pills */}
      <FilterPills
        filters={filters}
        onFiltersChange={updateFilters}
        onAdvancedToggle={() => setIsAdvancedOpen(!isAdvancedOpen)}
        isAdvancedOpen={isAdvancedOpen}
        activeFilterCount={activeFilterCount}
        availableIngredients={availableIngredients}
        canMakeCount={canMakeCount}
        onClearAllFilters={clearFilters}
      />

      {/* Advanced filters panel */}
      {isAdvancedOpen && (
        <AdvancedFilters
          filters={filters}
          onFiltersChange={updateFilters}
          onClose={() => setIsAdvancedOpen(false)}
          onSaveFilter={saveFilterCombination}
          savedFilters={savedFilters}
          onLoadSavedFilter={loadSavedFilter}
          onDeleteSavedFilter={deleteSavedFilter}
          onClearFilters={clearFilters}
        />
      )}

      {/* Search results */}
      <SearchResults
        results={groupedResults}
        onRecipeClick={onRecipeClick}
        onAddIngredient={onAddIngredient}
        onTagClick={onTagClick}
        emptyStateTitle={emptyStateTitle}
        emptyStateDescription={emptyStateDescription}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        user={user}
      />
    </div>
  );
}