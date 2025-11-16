import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Filter, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface FilterState {
  searchTerm: string;
  selectedCategories: string[];
  selectedSubCategories: string[];
  selectedQuickFilters: string[];
  onlyInMyBar: boolean;
  onlyMissing: boolean;
}

interface AdvancedMyBarFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableCategories: string[];
  availableSubCategories: string[];
  activeFilterCount: number;
}

const QUICK_FILTERS = [
  { label: "Gin", value: "gin", category: "quick" },
  { label: "Vodka", value: "vodka", category: "quick" },
  { label: "Whiskey", value: "whiskey", category: "quick" },
  { label: "Tequila", value: "tequila", category: "quick" },
  { label: "Rum", value: "rum", category: "quick" },
  { label: "Vermouth", value: "vermouth", category: "quick" },
  { label: "Bitters", value: "bitters", category: "quick" },
  { label: "Liqueur", value: "liqueur", category: "quick" },
  { label: "Citrus", value: "citrus", category: "quick" },
];

export default function AdvancedMyBarFilters({
  filters,
  onFiltersChange,
  availableCategories,
  availableSubCategories,
  activeFilterCount
}: AdvancedMyBarFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleQuickFilter = (filterValue: string) => {
    const newQuickFilters = filters.selectedQuickFilters.includes(filterValue)
      ? filters.selectedQuickFilters.filter(f => f !== filterValue)
      : [...filters.selectedQuickFilters, filterValue];
    
    updateFilters({ selectedQuickFilters: newQuickFilters });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.selectedCategories.includes(category)
      ? filters.selectedCategories.filter(c => c !== category)
      : [...filters.selectedCategories, category];
    
    updateFilters({ selectedCategories: newCategories });
  };

  const toggleSubCategory = (subCategory: string) => {
    const newSubCategories = filters.selectedSubCategories.includes(subCategory)
      ? filters.selectedSubCategories.filter(sc => sc !== subCategory)
      : [...filters.selectedSubCategories, subCategory];
    
    updateFilters({ selectedSubCategories: newSubCategories });
  };

  const clearAllFilters = () => {
    updateFilters({
      searchTerm: "",
      selectedCategories: [],
      selectedSubCategories: [],
      selectedQuickFilters: [],
      onlyInMyBar: false,
      onlyMissing: false
    });
  };

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <SearchInput
        placeholder="Search ingredients..."
        value={filters.searchTerm}
        onChange={(e) => updateFilters({ searchTerm: e.target.value })}
        onClear={() => updateFilters({ searchTerm: "" })}
        aria-label="Search bar ingredients"
      />

      {/* Filter Status & Clear */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between bg-available/10 border border-available/30 rounded-lg px-3 py-2">
          <span className="text-sm text-available font-medium">
            {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-available hover:text-pure-white hover:bg-available/20 h-auto py-1 px-2"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Quick Filters */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-pure-white">Quick Filters</h4>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {QUICK_FILTERS.map((filter) => (
            <Button
              key={filter.value}
              variant={filters.selectedQuickFilters.includes(filter.value) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleQuickFilter(filter.value)}
              className={`shrink-0 rounded-organic-sm ${
                filters.selectedQuickFilters.includes(filter.value)
                  ? "bg-available hover:bg-available/80 text-pure-white border-available"
                  : "border-border hover:border-available hover:text-available"
              }`}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Status Filters */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-pure-white">Status</h4>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={filters.onlyInMyBar ? "default" : "outline"}
            size="sm"
            onClick={() => updateFilters({ onlyInMyBar: !filters.onlyInMyBar, onlyMissing: false })}
            className={`rounded-organic-sm ${
              filters.onlyInMyBar
                ? "bg-available hover:bg-available/80 text-pure-white border-available"
                : "border-border hover:border-available hover:text-available"
            }`}
          >
            ✓ In My Bar
          </Button>
          <Button
            variant={filters.onlyMissing ? "default" : "outline"}
            size="sm"
            onClick={() => updateFilters({ onlyMissing: !filters.onlyMissing, onlyInMyBar: false })}
            className={`rounded-organic-sm ${
              filters.onlyMissing
                ? "bg-copper hover:bg-copper/80 text-pure-white border-copper"
                : "border-border hover:border-copper hover:text-copper"
            }`}
          >
            Missing
          </Button>
        </div>
      </div>

      {/* Advanced Filters (Collapsible) */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between text-light-text hover:text-pure-white"
          >
            <span className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Advanced Filters
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-4 mt-3">
          {/* Category Filters */}
          {availableCategories.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-pure-white">Categories</h4>
              <div className="flex items-center gap-2 flex-wrap">
                {availableCategories.map((category) => (
                  <Badge
                    key={category}
                    variant={filters.selectedCategories.includes(category) ? "default" : "outline"}
                    className={`cursor-pointer rounded-organic-sm ${
                      filters.selectedCategories.includes(category)
                        ? "bg-available hover:bg-available/80 text-pure-white border-available"
                        : "border-border hover:border-available hover:text-available"
                    }`}
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Sub-Category Filters */}
          {availableSubCategories.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-pure-white">Sub-Categories</h4>
              <div className="flex items-center gap-2 flex-wrap max-h-24 overflow-y-auto">
                {availableSubCategories.slice(0, 20).map((subCategory) => (
                  <Badge
                    key={subCategory}
                    variant={filters.selectedSubCategories.includes(subCategory) ? "default" : "outline"}
                    className={`cursor-pointer rounded-organic-sm text-xs ${
                      filters.selectedSubCategories.includes(subCategory)
                        ? "bg-golden hover:bg-golden/80 text-pure-white border-golden"
                        : "border-border hover:border-golden hover:text-golden"
                    }`}
                    onClick={() => toggleSubCategory(subCategory)}
                  >
                    {subCategory}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}