import React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UniversalRecipeCard from "@/components/UniversalRecipeCard";
import { Cocktail } from "@/data/classicCocktails";
import { Ingredient } from "@/data/ingredients";

interface ResultsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab: "can" | "one";
  onTabChange: (tab: "can" | "one") => void;
  recipesICanMake: Cocktail[];
  recipesNeedingOneIngredient: (Cocktail & { missingIngredient?: string })[];
  ingredientMap: { [id: string]: Ingredient };
}

export default function ResultsDrawer({
  open,
  onOpenChange,
  activeTab,
  onTabChange,
  recipesICanMake,
  recipesNeedingOneIngredient,
  ingredientMap,
}: ResultsDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-background border-border">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-pure-white">Your Results</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6">
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
                        <div className="text-xs text-soft-gray">
                          Missing: {ingredientMap[recipe.missingIngredient]?.name || recipe.missingIngredient}
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
