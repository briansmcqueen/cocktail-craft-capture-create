import React from "react";
import { Plus, Star } from "lucide-react";
import { Ingredient } from "@/data/ingredients";
import { Cocktail } from "@/data/classicCocktails";

interface RecommendedIngredient {
  ingredient: Ingredient;
  newRecipesUnlocked: Cocktail[];
  score: number;
}

interface WhatToBuyNextProps {
  recommendations: RecommendedIngredient[];
  onAddIngredient: (ingredientId: string) => void;
  loading?: boolean;
}

export default function WhatToBuyNext({ 
  recommendations, 
  onAddIngredient, 
  loading = false 
}: WhatToBuyNextProps) {
  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Plus className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-serif font-semibold">What to Buy Next</h2>
      </div>
      <div className="space-y-3">
        {recommendations.slice(0, 3).map((recommendation) => (
          <div
            key={recommendation.ingredient.id}
            className="flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm bg-card border-border hover:border-accent/50 hover:bg-accent/5"
            onClick={() => onAddIngredient(recommendation.ingredient.id)}
          >
            <div className="flex-1">
              <div className="font-medium text-base text-gray-900 mb-1">{recommendation.ingredient.name}</div>
              <p className="text-sm text-gray-600 mb-2">{recommendation.ingredient.description}</p>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-gray-900">
                  Unlocks {recommendation.score} new cocktail{recommendation.score !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <div className="flex items-center justify-center w-8 h-8 bg-accent/20 rounded-full">
                <Plus className="h-4 w-4 text-gray-900" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}