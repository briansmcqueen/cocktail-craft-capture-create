import { useState, useCallback, useMemo, useEffect } from 'react';
import { Cocktail } from '@/data/classicCocktails';
import { SearchFilters, SearchResult, DEFAULT_SEARCH_FILTERS, SavedFilter } from '@/types/search';
import { searchCocktails, generateSearchSuggestions } from '@/utils/searchUtils';

interface UseAdvancedSearchProps {
  recipes: Cocktail[];
  availableIngredients?: string[];
  initialFilters?: Partial<SearchFilters>;
}

export function useAdvancedSearch({
  recipes,
  availableIngredients = [],
  initialFilters = {}
}: UseAdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    ...DEFAULT_SEARCH_FILTERS,
    ...initialFilters
  });
  
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('barbook-search-history');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setRecentSearches(data.recentSearches || []);
        setSavedFilters(data.savedFilters || []);
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    }
  }, []);

  // Save search history to localStorage
  const saveSearchHistory = useCallback(() => {
    localStorage.setItem('barbook-search-history', JSON.stringify({
      recentSearches,
      savedFilters
    }));
  }, [recentSearches, savedFilters]);

  // Update filters
  const updateFilters = useCallback((updates: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_SEARCH_FILTERS);
    setIsAdvancedOpen(false);
  }, []);

  // Handle search query change
  const handleSearchChange = useCallback((query: string) => {
    updateFilters({ query });
    setShowSuggestions(query.length > 0);
    
    // Add to recent searches when user finishes typing
    if (query.trim() && !recentSearches.includes(query.trim())) {
      const newRecentSearches = [query.trim(), ...recentSearches.slice(0, 4)];
      setRecentSearches(newRecentSearches);
    }
  }, [updateFilters, recentSearches]);

  // Save search filter combination
  const saveFilterCombination = useCallback((name: string) => {
    const newSavedFilter: SavedFilter = {
      id: Date.now().toString(),
      name,
      filters: { ...filters },
      createdAt: new Date()
    };
    
    setSavedFilters(prev => [newSavedFilter, ...prev.slice(0, 9)]);
  }, [filters]);

  // Load saved filter combination
  const loadSavedFilter = useCallback((savedFilter: SavedFilter) => {
    setFilters({ ...DEFAULT_SEARCH_FILTERS, ...savedFilter.filters });
  }, []);

  // Delete saved filter
  const deleteSavedFilter = useCallback((id: string) => {
    setSavedFilters(prev => prev.filter(f => f.id !== id));
  }, []);

  // Generate search suggestions
  const suggestions = useMemo(() => {
    if (!filters.query || !showSuggestions) return [];
    return generateSearchSuggestions(filters.query, recipes, recentSearches);
  }, [filters.query, recipes, recentSearches, showSuggestions]);

  // Search results
  const searchResults = useMemo(() => {
    return searchCocktails(recipes, filters, availableIngredients);
  }, [recipes, filters, availableIngredients]);

  // Group results by availability
  const groupedResults = useMemo(() => {
    const canMake = searchResults.filter(r => r.canMake);
    const missing1 = searchResults.filter(r => !r.canMake && r.missingIngredients.length === 1);
    const missing2Plus = searchResults.filter(r => !r.canMake && r.missingIngredients.length >= 2);
    
    return {
      canMake,
      missing1,
      missing2Plus,
      all: searchResults
    };
  }, [searchResults]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.query !== '' ||
      filters.canMakeOnly ||
      filters.baseSpirits.length > 0 ||
      filters.difficulty !== 'any' ||
      filters.technique !== 'any' ||
      filters.glassType !== 'any' ||
      filters.flavorProfiles.length > 0 ||
      filters.occasions.length > 0 ||
      filters.maxMissingIngredients !== null ||
      filters.noEggWhites ||
      filters.lowAlcohol ||
      filters.noCream ||
      filters.nonAlcoholic
    );
  }, [filters]);

  // Count active filters (excluding query)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.canMakeOnly) count++;
    if (filters.baseSpirits.length > 0) count++;
    if (filters.difficulty !== 'any') count++;
    if (filters.technique !== 'any') count++;
    if (filters.glassType !== 'any') count++;
    if (filters.flavorProfiles.length > 0) count++;
    if (filters.occasions.length > 0) count++;
    if (filters.maxMissingIngredients !== null) count++;
    if (filters.noEggWhites) count++;
    if (filters.lowAlcohol) count++;
    if (filters.noCream) count++;
    if (filters.nonAlcoholic) count++;
    return count;
  }, [filters]);

  // Save to localStorage when data changes
  useEffect(() => {
    saveSearchHistory();
  }, [saveSearchHistory]);

  return {
    // State
    filters,
    isAdvancedOpen,
    recentSearches,
    savedFilters,
    showSuggestions,
    suggestions,
    
    // Results
    searchResults,
    groupedResults,
    
    // Computed values
    hasActiveFilters,
    activeFilterCount,
    
    // Actions
    updateFilters,
    clearFilters,
    handleSearchChange,
    setIsAdvancedOpen,
    setShowSuggestions,
    saveFilterCombination,
    loadSavedFilter,
    deleteSavedFilter
  };
}