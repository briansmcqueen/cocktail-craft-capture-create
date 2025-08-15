import React from "react";
import { Ingredient } from "@/data/ingredients";
import { FilterState } from "./AdvancedMyBarFilters";
import { Package, Apple, ChefHat, Beer, Wine, Zap, Sparkles } from "lucide-react";

interface FilteredIngredientGridProps {
  ingredients: Ingredient[];
  myBar: { [ingredientId: string]: boolean };
  onToggle: (ingredientId: string) => void;
  filters: FilterState;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Spirits":
      return <Zap className="w-4 h-4" />;
    case "Liqueurs":
      return <Sparkles className="w-4 h-4" />;
    case "Wines & Vermouths":
      return <Wine className="w-4 h-4" />;
    case "Mixers":
      return <Package className="w-4 h-4" />;
    case "Produce":
      return <Apple className="w-4 h-4" />;
    case "Pantry":
      return <ChefHat className="w-4 h-4" />;
    case "Beers & Ciders":
      return <Beer className="w-4 h-4" />;
    default:
      return <Package className="w-4 h-4" />;
  }
};

export default function FilteredIngredientGrid({
  ingredients,
  myBar,
  onToggle,
  filters
}: FilteredIngredientGridProps) {
  // Group ingredients by category for organized display
  const groupedIngredients = ingredients.reduce((acc, ingredient) => {
    if (!acc[ingredient.category]) {
      acc[ingredient.category] = [];
    }
    acc[ingredient.category].push(ingredient);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  const hasResults = ingredients.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-pure-white">
          Filter Results
        </h3>
        <span className="text-sm text-light-text">
          {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {!hasResults ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-light-text mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-pure-white mb-2">No ingredients found</h3>
          <p className="text-light-text">
            Try adjusting your filters or search terms
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedIngredients).map(([category, categoryIngredients]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="text-light-text p-2 rounded-lg bg-secondary-surface border border-border">
                  {getCategoryIcon(category)}
                </div>
                <div>
                  <h4 className="text-md font-medium text-pure-white">
                    {category}
                  </h4>
                  <span className="text-light-text text-xs">
                    {categoryIngredients.filter(ing => myBar[ing.id]).length}/{categoryIngredients.length} in your bar
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {categoryIngredients.map((ingredient) => (
                  <button
                    key={ingredient.id}
                    onClick={() => onToggle(ingredient.id)}
                    className={`p-3 rounded-organic-sm border transition-all duration-150 text-left hover:scale-[1.02] ${
                      myBar[ingredient.id]
                        ? "border-available bg-available/10 text-available"
                        : "border-border bg-secondary-surface hover:border-border-hover text-pure-white"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-sm truncate pr-2">
                          {ingredient.name}
                        </h5>
                        {myBar[ingredient.id] && (
                          <div className="w-4 h-4 rounded-full bg-available border border-white flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-light-text truncate">
                        {ingredient.subCategory}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}