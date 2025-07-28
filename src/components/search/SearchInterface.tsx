import React, { useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Mic, X, Clock, TrendingUp } from 'lucide-react';
import FilterPills from './FilterPills';
import AdvancedFilters from './AdvancedFilters';
import SearchResults from './SearchResults';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';
import { Cocktail } from '@/data/classicCocktails';
import { cn } from '@/lib/utils';

interface SearchInterfaceProps {
  recipes: Cocktail[];
  availableIngredients?: string[];
  onRecipeClick: (recipe: Cocktail) => void;
  onToggleFavorite: (recipe: Cocktail) => void;
  onAddIngredient?: (ingredient: string) => void;
  onTagClick?: (tag: string) => void;
  favoriteIds?: string[];
  placeholder?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  showCanMakeFirst?: boolean;
  className?: string;
}

export default function SearchInterface({
  recipes,
  availableIngredients = [],
  onRecipeClick,
  onToggleFavorite,
  onAddIngredient,
  onTagClick,
  favoriteIds = [],
  placeholder = "Search cocktails, ingredients, or flavors...",
  emptyStateTitle,
  emptyStateDescription,
  showCanMakeFirst = false,
  className
}: SearchInterfaceProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  
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

  const handleVoiceSearch = () => {
    // Voice search functionality would go here
    console.log('Voice search not implemented yet');
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main search bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder={placeholder}
            value={filters.query}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setShowSuggestions(filters.query.length > 0)}
            onBlur={() => {
              // Delay hiding suggestions to allow clicks
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            className="pl-10 pr-20 h-12 bg-card border-border text-card-foreground rounded-organic-md"
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {filters.query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <X size={16} />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVoiceSearch}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <Mic size={16} />
            </Button>
          </div>
        </div>

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
        />
      )}

      {/* Search results */}
      <SearchResults
        results={groupedResults}
        onRecipeClick={onRecipeClick}
        onToggleFavorite={onToggleFavorite}
        onAddIngredient={onAddIngredient}
        onTagClick={onTagClick}
        favoriteIds={favoriteIds}
        emptyStateTitle={emptyStateTitle}
        emptyStateDescription={emptyStateDescription}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />
    </div>
  );
}