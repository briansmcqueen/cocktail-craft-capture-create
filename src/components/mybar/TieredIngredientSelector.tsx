import React, { useState, useMemo } from "react";
import { Ingredient } from "@/data/ingredients";
import { INGREDIENT_TIERS, DEFAULT_MYBAR_SETTINGS } from "@/types/ingredientTiers";
import PrimaryIngredientCarousel from "./PrimaryIngredientCarousel";
import SecondaryIngredientCarousel from "./SecondaryIngredientCarousel";
import IngredientTierToggle from "./IngredientTierToggle";
import AdvancedMyBarFilters from "./AdvancedMyBarFilters";
import useAdvancedMyBarFilters from "@/hooks/useAdvancedMyBarFilters";
import FilteredIngredientGrid from "./FilteredIngredientGrid";

interface TieredIngredientSelectorProps {
  allIngredients: Ingredient[];
  myBar: { [ingredientId: string]: boolean };
  myBarIngredients: string[];
  ingredientMap: { [ingredientId: string]: Ingredient };
  toggleIngredient: (ingredientId: string) => void;
  user: any;
  includeAssumed?: boolean;
  onIncludeAssumedChange?: (val: boolean) => void;
}

export default function TieredIngredientSelector({
  allIngredients,
  myBar,
  myBarIngredients,
  ingredientMap,
  toggleIngredient,
  user,
  includeAssumed: includeAssumedProp,
  onIncludeAssumedChange,
}: TieredIngredientSelectorProps) {
  const [showSecondary, setShowSecondary] = useState(false);
  const [internalIncludeAssumed, setInternalIncludeAssumed] = useState(DEFAULT_MYBAR_SETTINGS.assumeBasicIngredients);
  const includeAssumed = includeAssumedProp ?? internalIncludeAssumed;
  
  const handleToggleAssumed = (val: boolean) => {
    if (onIncludeAssumedChange) onIncludeAssumedChange(val);
    else setInternalIncludeAssumed(val);
  };

  // Advanced filtering hook
  const {
    filters,
    setFilters,
    filteredIngredients,
    availableCategories,
    availableSubCategories,
    activeFilterCount,
    hasActiveFilters
  } = useAdvancedMyBarFilters(allIngredients, myBar);

  const { primaryIngredients, secondaryIngredients } = useMemo(() => {
    const primary = allIngredients.filter(ing => 
      INGREDIENT_TIERS.primary.includes(ing.category)
    );
    const secondary = allIngredients.filter(ing => 
      INGREDIENT_TIERS.secondary.includes(ing.category)
    );
    
    return { 
      primaryIngredients: primary.sort((a, b) => a.name.localeCompare(b.name)), 
      secondaryIngredients: secondary.sort((a, b) => a.name.localeCompare(b.name))
    };
  }, [allIngredients]);

  const primaryInMyBar = useMemo(() => {
    return primaryIngredients.filter(ing => myBar[ing.id]).length;
  }, [primaryIngredients, myBar]);

  return (
    <div className="space-y-8">
      {/* Advanced Filters */}
      <AdvancedMyBarFilters
        filters={filters}
        onFiltersChange={setFilters}
        availableCategories={availableCategories}
        availableSubCategories={availableSubCategories}
        activeFilterCount={activeFilterCount}
      />

      {/* Show filtered results when filters are active */}
      {hasActiveFilters ? (
        <FilteredIngredientGrid
          ingredients={filteredIngredients}
          myBar={myBar}
          onToggle={toggleIngredient}
          filters={filters}
        />
      ) : (
        <>
          {/* Primary Ingredients Section */}
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-pure-white mb-2">
                Your Bar Essentials
              </h3>
              <p className="text-light-text text-sm">
                Select your spirits, liqueurs, and wines ({primaryInMyBar} of {primaryIngredients.length} selected)
              </p>
            </div>
            
            <PrimaryIngredientCarousel 
              ingredients={primaryIngredients}
              myBar={myBar}
              onToggle={toggleIngredient}
            />
          </div>
          
          {/* Tier Toggle Controls */}
          <IngredientTierToggle 
            showSecondary={showSecondary}
            onToggleSecondary={setShowSecondary}
            includeAssumed={includeAssumed}
            onToggleAssumed={handleToggleAssumed}
            secondaryCount={secondaryIngredients.length}
            user={user}
          />
          
          {/* Secondary Ingredients Section */}
          {showSecondary && (
            <SecondaryIngredientCarousel
              ingredients={secondaryIngredients}
              myBar={myBar}
              onToggle={toggleIngredient}
            />
          )}
        </>
      )}
    </div>
  );
}