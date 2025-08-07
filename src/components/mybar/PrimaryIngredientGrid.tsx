import React from "react";
import { Ingredient } from "@/data/ingredients";
import { Wine, Zap, Sparkles } from "lucide-react";

interface PrimaryIngredientGridProps {
  ingredients: Ingredient[];
  myBar: { [ingredientId: string]: boolean };
  onToggle: (ingredientId: string) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Spirits":
      return <Zap className="w-5 h-5" />;
    case "Liqueurs":
      return <Sparkles className="w-5 h-5" />;
    case "Wines & Vermouths":
      return <Wine className="w-5 h-5" />;
    default:
      return <Zap className="w-5 h-5" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Spirits":
      return "text-available border-available/30 bg-available/10";
    case "Liqueurs":
      return "text-golden border-golden/30 bg-golden/10";
    case "Wines & Vermouths":
      return "text-copper border-copper/30 bg-copper/10";
    default:
      return "text-available border-available/30 bg-available/10";
  }
};

export default function PrimaryIngredientGrid({
  ingredients,
  myBar,
  onToggle
}: PrimaryIngredientGridProps) {
  const groupedIngredients = ingredients.reduce((acc, ingredient) => {
    if (!acc[ingredient.category]) {
      acc[ingredient.category] = [];
    }
    acc[ingredient.category].push(ingredient);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedIngredients).map(([category, categoryIngredients]) => (
        <div key={category}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`${getCategoryColor(category)} p-2 rounded-lg`}>
              {getCategoryIcon(category)}
            </div>
            <h4 className="text-lg font-medium text-pure-white">
              {category}
            </h4>
            <span className="text-light-text text-sm">
              ({categoryIngredients.filter(ing => myBar[ing.id]).length}/{categoryIngredients.length})
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryIngredients.map((ingredient) => (
              <button
                key={ingredient.id}
                onClick={() => onToggle(ingredient.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 text-left hover:scale-102 ${
                  myBar[ingredient.id]
                    ? `${getCategoryColor(category)} shadow-lg transform scale-102`
                    : "border-border bg-secondary-surface hover:border-border-hover"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className={`font-medium ${
                    myBar[ingredient.id] ? "text-pure-white" : "text-pure-white"
                  }`}>
                    {ingredient.name}
                  </h5>
                  {myBar[ingredient.id] && (
                    <div className="w-5 h-5 rounded-full bg-available flex items-center justify-center">
                      <span className="text-pure-white text-xs font-bold">✓</span>
                    </div>
                  )}
                </div>
                <p className={`text-xs ${
                  myBar[ingredient.id] ? "text-pure-white/80" : "text-light-text"
                }`}>
                  {ingredient.subCategory}
                </p>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}