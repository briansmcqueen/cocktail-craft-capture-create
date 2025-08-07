import React from "react";
import { ChevronDown, ChevronUp, Info, Plus } from "lucide-react";
import { Ingredient } from "@/data/ingredients";
import AddCustomIngredient from "../AddCustomIngredient";
import { Button } from "@/components/ui/button";

interface IngredientTierToggleProps {
  showSecondary: boolean;
  onToggleSecondary: (show: boolean) => void;
  includeAssumed: boolean;
  onToggleAssumed: (include: boolean) => void;
  secondaryCount: number;
  user: any;
}

export default function IngredientTierToggle({
  showSecondary,
  onToggleSecondary,
  includeAssumed,
  onToggleAssumed,
  secondaryCount,
  user
}: IngredientTierToggleProps) {
  return (
    <div className="space-y-4">
      {/* Secondary Ingredients Toggle */}
      <div className="bg-secondary-surface rounded-lg p-4 border border-border">
        <button
          onClick={() => onToggleSecondary(!showSecondary)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-3">
            <div className="text-light-text">
              {showSecondary ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="text-pure-white font-medium">
                {showSecondary ? 'Hide' : 'Show'} Additional Ingredients
              </h4>
              <p className="text-light-text text-sm">
                {secondaryCount} optional ingredients (mixers, produce, pantry items)
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Assumed Ingredients Setting */}
      <div className="bg-secondary-surface rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-golden mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-pure-white font-medium mb-1">
                Include Basic Ingredients
              </h4>
              <p className="text-light-text text-sm mb-3">
                Automatically include common ingredients most people have: lemons, limes, simple syrup, salt, egg whites, etc.
              </p>
              <button
                onClick={() => onToggleAssumed(!includeAssumed)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  includeAssumed
                    ? "bg-available text-pure-white"
                    : "bg-card border border-border text-light-text hover:text-pure-white"
                }`}
              >
                {includeAssumed ? '✓ Included' : 'Include'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Ingredient */}
      {user && (
        <div className="bg-secondary-surface rounded-lg p-4 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <Plus className="w-5 h-5 text-available" />
            <h4 className="text-pure-white font-medium">
              Add Custom Ingredient
            </h4>
          </div>
          <p className="text-light-text text-sm mb-4">
            Don't see an ingredient you have? Add your own custom ingredients.
          </p>
          <AddCustomIngredient 
            onIngredientAdded={() => {
              // This will trigger a re-fetch in the parent component
            }} 
          />
        </div>
      )}
    </div>
  );
}