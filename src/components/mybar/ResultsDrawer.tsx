import React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import UniversalRecipeCard from "@/components/UniversalRecipeCard";
import { Cocktail } from "@/data/classicCocktails";
import { Ingredient } from "@/data/ingredients";
import WhatToBuyNext from "./WhatToBuyNext";

interface RecommendedIngredient {
  ingredient: Ingredient;
  newRecipesUnlocked: Cocktail[];
  score: number;
}

interface ResultsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab: "can" | "one";
  onTabChange: (tab: "can" | "one") => void;
  recipesICanMake: Cocktail[];
  recipesNeedingOneIngredient: (Cocktail & { missingIngredient?: string })[];
  ingredientMap: { [id: string]: Ingredient };
  userIngredients: string[];
  whatToBuyNext?: RecommendedIngredient[];
  onAddIngredient?: (ingredientId: string) => void;
  onAddToShoppingList?: (ingredientId: string) => void;
}

export default function ResultsDrawer({
  open,
  onOpenChange,
  activeTab,
  onTabChange,
  recipesICanMake,
  recipesNeedingOneIngredient,
  ingredientMap,
  userIngredients,
  whatToBuyNext,
  onAddIngredient,
  onAddToShoppingList,
}: ResultsDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-background border-border z-[60]">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-pure-white">Your Results</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6 space-y-4">
          {/* What to Buy Next (mobile quick picks) */}
          {whatToBuyNext && whatToBuyNext.length > 0 && (
            <WhatToBuyNext 
              recommendations={whatToBuyNext}
              onAddIngredient={(id) => onAddIngredient?.(id)}
              onAddToShoppingList={(id) => onAddToShoppingList?.(id)}
              userIngredients={userIngredients}
              ingredientMap={new Map(Object.entries(ingredientMap))}
            />
          )}
          <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as any)}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="can">Can Make ({recipesICanMake.length})</TabsTrigger>
              <TabsTrigger value="one">One Away ({recipesNeedingOneIngredient.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="can" className="mt-4">
              {recipesICanMake.length === 0 ? (
                <div className="text-light-text text-sm py-8 text-center">No cocktails yet — add a few more essentials.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recipesICanMake.map((recipe) => (
                    <UniversalRecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="one" className="mt-4">
              {recipesNeedingOneIngredient.length === 0 ? (
                <div className="text-light-text text-sm py-8 text-center">Nothing is just one away — great job!</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recipesNeedingOneIngredient.map((recipe) => (
                    <div key={recipe.id} className="space-y-2">
                      <UniversalRecipeCard recipe={recipe} />
                      {recipe.missingIngredient && (
                        <div className="text-xs text-soft-gray flex items-center justify-between">
                          <span>
                            Missing: {ingredientMap[recipe.missingIngredient]?.name || recipe.missingIngredient}
                          </span>
                          {onAddIngredient && (
                            <div className="flex items-center gap-2 ml-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                className="rounded-organic-sm"
                                onClick={() => onAddIngredient(recipe.missingIngredient!)}
                              >
                                Add
                              </Button>
                              {onAddToShoppingList && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-organic-sm"
                                  onClick={() => onAddToShoppingList(recipe.missingIngredient!)}
                                >
                                  Add to List
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
