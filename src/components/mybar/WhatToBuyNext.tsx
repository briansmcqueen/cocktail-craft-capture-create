import React from "react";
import { Plus } from "lucide-react";
import { Ingredient } from "@/data/ingredients";
import { Cocktail } from "@/data/classicCocktails";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import whiskeImage from "@/assets/ingredients/whiskey.jpg";
import ginImage from "@/assets/ingredients/gin.jpg";
import vodkaImage from "@/assets/ingredients/vodka.jpg";
import liqueursImage from "@/assets/ingredients/liqueurs.jpg";
import winesImage from "@/assets/ingredients/wines.jpg";

interface RecommendedIngredient {
  ingredient: Ingredient;
  newRecipesUnlocked: Cocktail[];
  score: number;
}

interface WhatToBuyNextProps {
  recommendations: RecommendedIngredient[];
  onAddIngredient: (ingredientId: string) => void;
  onAddToShoppingList?: (ingredientId: string) => void;
  userIngredients: string[];
  ingredientMap: Map<string, Ingredient>;
  loading?: boolean;
}

const getCategoryImage = (category: string, subCategory: string) => {
  switch (category) {
    case "Spirits":
      if (subCategory.toLowerCase().includes("gin")) return ginImage;
      if (subCategory.toLowerCase().includes("vodka")) return vodkaImage;
      return whiskeImage;
    case "Liqueurs":
      return liqueursImage;
    case "Wines & Vermouths":
      return winesImage;
    default:
      return whiskeImage;
  }
};

export default function WhatToBuyNext({ 
  recommendations, 
  onAddIngredient, 
  onAddToShoppingList,
  userIngredients,
  ingredientMap,
  loading = false 
}: WhatToBuyNextProps) {
  if (recommendations.length === 0) return null;
  if (recommendations.length === 0) return null;

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-pure-white">What to Buy Next</h2>
        </div>
        <div className="grid grid-flow-col auto-cols-[240px] sm:auto-cols-[280px] gap-3 overflow-x-auto pb-2">
          {recommendations.slice(0, 6).map((rec) => {
            const previewRecipes = rec.newRecipesUnlocked.slice(0, 3);
            const hasMore = rec.newRecipesUnlocked.length > 3;
            
            return (
              <Tooltip key={rec.ingredient.id} delayDuration={200}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onAddIngredient(rec.ingredient.id)}
                    className="relative rounded-organic-md overflow-hidden border border-border bg-card group text-left"
                  >
                    {/* Image */}
                    <div
                      className="h-28 w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${getCategoryImage(rec.ingredient.category, rec.ingredient.subCategory)})` }}
                    />
                    {/* Overlay with stronger gradient at bottom for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* Shopping List Button */}
                    {onAddToShoppingList && (
                      <button
                        type="button"
                        aria-label="Add to shopping list"
                        onClick={(e) => { e.stopPropagation(); onAddToShoppingList(rec.ingredient.id); }}
                        className="absolute top-2 right-2 z-10 w-8 h-8 inline-flex items-center justify-center rounded-full bg-background/80 border border-border hover:bg-background/90 transition-colors"
                      >
                        <Plus className="h-4 w-4 text-pure-white" />
                      </button>
                    )}

                    {/* Content */}
                    <div className="absolute inset-0 p-3 flex flex-col justify-end">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-pure-white line-clamp-1">{rec.ingredient.name}</div>
                          <div className="text-xs text-light-text line-clamp-1">
                            Unlocks {rec.score} new cocktail{rec.score !== 1 ? "s" : ""}
                          </div>
                          {/* Mobile: Show recipe names directly */}
                          <div className="text-[10px] text-soft-gray mt-1 line-clamp-2 sm:hidden">
                            {previewRecipes.map(r => r.name).join(", ")}
                            {hasMore && "..."}
                          </div>
                          {selectedRetailer && (
                            <div className="text-xs text-accent mt-1">
                              Available at {selectedRetailer.name}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-center w-8 h-8 bg-accent/20 rounded-full border border-accent/40 group-hover:bg-accent/30 transition-colors">
                          <Plus className="h-4 w-4 text-pure-white" />
                        </div>
                      </div>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="hidden sm:block max-w-[200px] bg-medium-charcoal border-light-charcoal">
                  <p className="text-xs font-medium text-pure-white mb-1">Unlocks:</p>
                  <ul className="text-xs text-light-text space-y-0.5">
                    {previewRecipes.map((recipe) => (
                      <li key={recipe.id}>• {recipe.name}</li>
                    ))}
                    {hasMore && <li className="text-soft-gray">• +{rec.newRecipesUnlocked.length - 3} more</li>}
                  </ul>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
