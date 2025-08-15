import { useState, useMemo } from "react";
import { Ingredient } from "@/data/ingredients";
import { FilterState } from "@/components/mybar/AdvancedMyBarFilters";

export default function useAdvancedMyBarFilters(
  allIngredients: Ingredient[],
  myBar: { [ingredientId: string]: boolean }
) {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    selectedCategories: [],
    selectedSubCategories: [],
    selectedQuickFilters: [],
    onlyInMyBar: false,
    onlyMissing: false
  });

  // Get available filter options
  const { availableCategories, availableSubCategories } = useMemo(() => {
    const categories = Array.from(new Set(allIngredients.map(ing => ing.category))).sort();
    const subCategories = Array.from(new Set(allIngredients.map(ing => ing.subCategory))).sort();
    
    return {
      availableCategories: categories,
      availableSubCategories: subCategories
    };
  }, [allIngredients]);

  // Filter ingredients based on current filter state
  const filteredIngredients = useMemo(() => {
    return allIngredients.filter(ingredient => {
      // Search term filter
      if (filters.searchTerm.trim()) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          ingredient.name.toLowerCase().includes(searchLower) ||
          ingredient.category.toLowerCase().includes(searchLower) ||
          ingredient.subCategory.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Quick filters (check ingredient name/category matches)
      if (filters.selectedQuickFilters.length > 0) {
        const matchesQuickFilter = filters.selectedQuickFilters.some(filter => {
          const filterLower = filter.toLowerCase();
          return (
            ingredient.name.toLowerCase().includes(filterLower) ||
            ingredient.category.toLowerCase().includes(filterLower) ||
            ingredient.subCategory.toLowerCase().includes(filterLower)
          );
        });
        
        if (!matchesQuickFilter) return false;
      }

      // Category filters
      if (filters.selectedCategories.length > 0) {
        if (!filters.selectedCategories.includes(ingredient.category)) {
          return false;
        }
      }

      // Sub-category filters
      if (filters.selectedSubCategories.length > 0) {
        if (!filters.selectedSubCategories.includes(ingredient.subCategory)) {
          return false;
        }
      }

      // Status filters
      if (filters.onlyInMyBar && !myBar[ingredient.id]) {
        return false;
      }

      if (filters.onlyMissing && myBar[ingredient.id]) {
        return false;
      }

      return true;
    });
  }, [allIngredients, filters, myBar]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    
    if (filters.searchTerm.trim()) count++;
    if (filters.selectedCategories.length > 0) count++;
    if (filters.selectedSubCategories.length > 0) count++;
    if (filters.selectedQuickFilters.length > 0) count++;
    if (filters.onlyInMyBar) count++;
    if (filters.onlyMissing) count++;
    
    return count;
  }, [filters]);

  const hasActiveFilters = activeFilterCount > 0;

  return {
    filters,
    setFilters,
    filteredIngredients,
    availableCategories,
    availableSubCategories,
    activeFilterCount,
    hasActiveFilters
  };
}