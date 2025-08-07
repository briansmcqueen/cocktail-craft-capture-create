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
}

export default function TieredIngredientSelector({
  allIngredients,
  myBar,
  myBarIngredients,
  ingredientMap,
  toggleIngredient,
  user,
}: TieredIngredientSelectorProps) {
  const [showSecondary, setShowSecondary] = useState(DEFAULT_MYBAR_SETTINGS.showSecondaryByDefault);
  const [includeAssumed, setIncludeAssumed] = useState(DEFAULT_MYBAR_SETTINGS.assumeBasicIngredients);
  const [searchTerm, setSearchTerm] = useState("");

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
            onToggleAssumed={setIncludeAssumed}
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