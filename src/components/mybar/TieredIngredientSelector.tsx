import React, { useState, useMemo } from "react";
import { Ingredient } from "@/data/ingredients";
import { INGREDIENT_TIERS, DEFAULT_MYBAR_SETTINGS } from "@/types/ingredientTiers";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import PrimaryIngredientCarousel from "./PrimaryIngredientCarousel";
import SecondaryIngredientCarousel from "./SecondaryIngredientCarousel";
import IngredientTierToggle from "./IngredientTierToggle";
import MyBarSearch from "./MyBarSearch";

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
  const [searchTerm, setSearchTerm] = useState("");
  const handleToggleAssumed = (val: boolean) => {
    if (onIncludeAssumedChange) onIncludeAssumedChange(val);
    else setInternalIncludeAssumed(val);
  };

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
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-light-text" />
        <Input
          placeholder="Search by ingredient name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-secondary-surface border-border text-pure-white placeholder-light-text focus:border-available"
        />
      </div>

      {/* Quick Filters */}
      <div className="-mt-2 flex items-center gap-2 overflow-x-auto py-1">
        {[
          "Gin",
          "Vodka",
          "Whiskey",
          "Tequila",
          "Rum",
          "Vermouth",
          "Bitters",
          "Liqueur",
          "Citrus",
        ].map((chip) => (
          <button
            key={chip}
            onClick={() => setSearchTerm(chip)}
            className="px-3 py-1 rounded-organic-sm text-xs bg-card border border-border text-light-text hover:text-pure-white hover:bg-accent/10 transition-colors shrink-0"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Search Results */}
      <MyBarSearch
        allIngredients={allIngredients}
        myBar={myBar}
        onToggle={toggleIngredient}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Main Ingredient Selection - Hidden when searching */}
      {!searchTerm.trim() && (
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