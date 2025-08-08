import React, { useState } from "react";
import { Cocktail } from "@/data/classicCocktails";
import { User } from "lucide-react";
import { useMyBarData } from "@/hooks/useMyBarData";
import { useRecipeAnalysis } from "@/hooks/useRecipeAnalysis";
import TieredIngredientSelector from "./mybar/TieredIngredientSelector";
import MyBarResults from "./mybar/MyBarResults";
import MyBarActionBar from "./mybar/MyBarActionBar";
import ResultsDrawer from "./mybar/ResultsDrawer";

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

  // Mobile results drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"can" | "one">("can");

  return (
    <div className="space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <User className="text-primary" size={24} />
        <h2 className="text-2xl lg:text-3xl font-serif font-normal text-pure-white tracking-wide">
          My Bar
        </h2>
      </div>
      <p className="text-light-text text-sm mb-6">
        Build your inventory and discover what cocktails you can make
      </p>

      {/* Ingredient Selection */}
      <TieredIngredientSelector
        allIngredients={allIngredients}
        myBar={myBar}
        myBarIngredients={myBarIngredients}
        ingredientMap={ingredientMap}
        toggleIngredient={toggleIngredient}
        user={user}
      />

      {/* Results Section (kept for larger screens) */}
      <div className="hidden md:block">
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

      {/* Mobile Sticky Action Bar */}
      {!drawerOpen && (
        <div className="md:hidden">
          <MyBarActionBar
            canMakeCount={recipesICanMake.length}
            oneAwayCount={recipesNeedingOneIngredient.length}
            onOpenCanMake={() => {
              setActiveTab("can");
              setDrawerOpen(true);
            }}
            onOpenOneAway={() => {
              setActiveTab("one");
              setDrawerOpen(true);
            }}
          />
        </div>
      )}

      {/* Mobile Results Drawer */}
      <ResultsDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        recipesICanMake={recipesICanMake}
        recipesNeedingOneIngredient={recipesNeedingOneIngredient}
        ingredientMap={ingredientMap}
      />
    </div>
  );
}