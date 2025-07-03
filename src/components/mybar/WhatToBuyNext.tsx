import React from "react";
import { Plus, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.slice(0, 3).map((recommendation) => (
          <Card key={recommendation.ingredient.id} className="hover:bg-accent transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{recommendation.ingredient.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{recommendation.ingredient.description}</p>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Unlocks {recommendation.score} new cocktail{recommendation.score !== 1 ? 's' : ''}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onAddIngredient(recommendation.ingredient.id)}
                disabled={loading}
                className="w-full hover:bg-accent/50 hover:text-foreground"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add to Bar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}