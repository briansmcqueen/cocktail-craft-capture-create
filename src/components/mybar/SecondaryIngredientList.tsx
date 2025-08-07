import React from "react";
import { Ingredient } from "@/data/ingredients";
import { Package, Apple, ChefHat, Beer } from "lucide-react";

interface SecondaryIngredientListProps {
  ingredients: Ingredient[];
  myBar: { [ingredientId: string]: boolean };
  onToggle: (ingredientId: string) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
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

export default function SecondaryIngredientList({
  ingredients,
  myBar,
  onToggle
}: SecondaryIngredientListProps) {
  const groupedIngredients = ingredients.reduce((acc, ingredient) => {
    if (!acc[ingredient.category]) {
      acc[ingredient.category] = [];
    }
    acc[ingredient.category].push(ingredient);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h4 className="text-lg font-medium text-pure-white mb-2">
          Additional Ingredients
        </h4>
        <p className="text-light-text text-sm">
          Optional items for more recipe variety and precision
        </p>
      </div>

      {Object.entries(groupedIngredients).map(([category, categoryIngredients]) => (
        <div key={category}>
          <div className="flex items-center gap-2 mb-3">
            <div className="text-light-text p-1.5 rounded bg-secondary-surface">
              {getCategoryIcon(category)}
            </div>
            <h5 className="text-md font-medium text-pure-white">
              {category}
            </h5>
            <span className="text-light-text text-xs">
              ({categoryIngredients.filter(ing => myBar[ing.id]).length}/{categoryIngredients.length})
            </span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {categoryIngredients.map((ingredient) => (
              <button
                key={ingredient.id}
                onClick={() => onToggle(ingredient.id)}
                className={`p-3 rounded-lg border transition-all duration-200 text-left text-sm hover:scale-102 ${
                  myBar[ingredient.id]
                    ? "border-available bg-available/10 text-available"
                    : "border-border bg-secondary-surface hover:border-border-hover text-pure-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate pr-2">
                    {ingredient.name}
                  </span>
                  {myBar[ingredient.id] && (
                    <div className="w-4 h-4 rounded-full bg-available flex items-center justify-center flex-shrink-0">
                      <span className="text-pure-white text-xs font-bold">✓</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}