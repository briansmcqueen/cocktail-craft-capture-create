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
    <div className="space-y-6 px-4 sm:px-0">
      {/* Header - styled like Favorites/My Creations */}
      <div className="flex items-center gap-3 mb-6">
        <User className="text-primary" size={24} />
        <h2 className="text-2xl lg:text-3xl font-serif font-normal text-gray-900 tracking-wide">
          My Bar
        </h2>
      </div>
      <p className="text-gray-600 text-sm mb-6">
        Build your inventory and discover what cocktails you can make
      </p>

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