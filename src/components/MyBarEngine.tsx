import React from "react";
import { Cocktail } from "@/data/classicCocktails";
import { User } from "lucide-react";
import { useMyBarData } from "@/hooks/useMyBarData";
import { useRecipeAnalysis } from "@/hooks/useRecipeAnalysis";
import IngredientSelector from "./mybar/IngredientSelector";
import MyBarResults from "./mybar/MyBarResults";

type MyBarEngineProps = {
  recipes: Cocktail[];
  onRecipeClick: (recipe: Cocktail) => void;
  onToggleFavorite: (recipe: Cocktail) => void;
  onTagClick: (tag: string) => void;
  forceUpdate: number;
};

export default function MyBarEngine({
  recipes,
  onRecipeClick,
  onToggleFavorite,
  onTagClick,
  forceUpdate
}: MyBarEngineProps) {
  const {
    myBar,
    customIngredients,
    setCustomIngredients,
    loading,
    allIngredients,
    ingredientMap,
    myBarIngredients,
    toggleIngredient,
    user
  } = useMyBarData(forceUpdate);

  const {
    recipesICanMake,
    recipesNeedingOneIngredient,
    whatToBuyNext
  } = useRecipeAnalysis(recipes, myBarIngredients, myBar);

  return (
    <div className="space-y-6">
      {/* Header moved to top right */}
      <div className="flex justify-end">
        <div className="text-right space-y-1">
          <div className="flex items-center justify-end gap-2">
            <User className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-serif font-bold">My Bar</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Build your inventory and discover what cocktails you can make
          </p>
        </div>
      </div>

      {/* Ingredient Selection */}
      <IngredientSelector
        allIngredients={allIngredients}
        myBar={myBar}
        myBarIngredients={myBarIngredients}
        ingredientMap={ingredientMap}
        toggleIngredient={toggleIngredient}
        user={user}
        setCustomIngredients={setCustomIngredients}
      />

      {/* Results Section */}
      <MyBarResults
        myBarIngredients={myBarIngredients}
        recipesICanMake={recipesICanMake}
        recipesNeedingOneIngredient={recipesNeedingOneIngredient}
        whatToBuyNext={whatToBuyNext}
        ingredientMap={ingredientMap}
        onRecipeClick={onRecipeClick}
        onToggleFavorite={onToggleFavorite}
        onTagClick={onTagClick}
        onAddIngredient={toggleIngredient}
        user={user}
        loading={loading}
      />
    </div>
  );
}