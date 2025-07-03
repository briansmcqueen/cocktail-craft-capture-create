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
      {/* Header - left aligned to match other sections */}
      <div className="space-y-2">
        <h2 className="text-gray-900 mb-2 tracking-[0.08em] leading-[1.45] uppercase font-bold text-[1rem] flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          My Bar
        </h2>
        <p className="text-muted-foreground text-sm">
          Build your inventory and discover what cocktails you can make
        </p>
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