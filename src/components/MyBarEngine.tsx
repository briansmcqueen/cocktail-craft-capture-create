import React, { useState, useEffect } from "react";
import { Cocktail } from "@/data/classicCocktails";

import { useMyBarData } from "@/hooks/useMyBarData";
import { useRecipeAnalysis } from "@/hooks/useRecipeAnalysis";
import { DEFAULT_MYBAR_SETTINGS } from "@/types/ingredientTiers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IngredientManager from "./mybar/IngredientManager";
import MyBarResultsPanel from "./mybar/MyBarResultsPanel";
import MyBarActionBar from "./mybar/MyBarActionBar";
import ResultsDrawer from "./mybar/ResultsDrawer";
import MyBarOnboarding from "./mybar/MyBarOnboarding";

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
    user,
    presets,
    savePreset,
    loadPreset,
    deletePreset,
    updatePreset
  } = useMyBarData(forceUpdate);

  const [includeAssumed] = useState(DEFAULT_MYBAR_SETTINGS.assumeBasicIngredients);

  // Onboarding
  const onboardingKey = user ? `barbook_onboarding_completed_${user.id}` : null;
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    if (!onboardingKey) return true;
    return localStorage.getItem(onboardingKey) === "true";
  });

  useEffect(() => {
    if (onboardingKey) {
      setHasCompletedOnboarding(localStorage.getItem(onboardingKey) === "true");
    } else {
      setHasCompletedOnboarding(true);
    }
  }, [onboardingKey]);

  const markOnboardingComplete = () => {
    if (onboardingKey) localStorage.setItem(onboardingKey, "true");
    setHasCompletedOnboarding(true);
  };

  const {
    recipesICanMake,
    recipesNeedingOneIngredient,
    whatToBuyNext
  } = useRecipeAnalysis(recipes, myBarIngredients, myBar, includeAssumed);

  // Mobile state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"can" | "one">("can");
  const [mobileTab, setMobileTab] = useState<string>(() => {
    // Default to cocktails tab if user has ingredients
    return "cocktails";
  });

  // Show onboarding if user has no ingredients and hasn't dismissed
  if (user && !loading && myBarIngredients.length === 0 && !hasCompletedOnboarding) {
    return (
      <MyBarOnboarding
        allIngredients={allIngredients}
        recipes={recipes}
        onComplete={(selectedIds) => {
          selectedIds.forEach((id) => toggleIngredient(id));
          markOnboardingComplete();
        }}
        onSkip={() => markOnboardingComplete()}
      />
    );
  }

  const ingredientManagerPanel = (
    <IngredientManager
      allIngredients={allIngredients}
      myBar={myBar}
      myBarIngredients={myBarIngredients}
      ingredientMap={ingredientMap}
      toggleIngredient={toggleIngredient}
      user={user}
      setCustomIngredients={setCustomIngredients}
      onSavePreset={savePreset}
    />
  );

  const resultsPanel = (
    <MyBarResultsPanel
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
  );

  return (
    <div className="px-4 sm:px-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-pure-white tracking-[0.08em] leading-[1.45] uppercase font-bold text-sm md:text-[1rem]">
          My Bar
        </h2>
        {myBarIngredients.length > 0 && (
          <span className="text-sm text-soft-gray">
            {myBarIngredients.length} bottle{myBarIngredients.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Desktop: Two-column layout */}
      <div className="hidden md:grid md:grid-cols-[35%_1fr] md:gap-6 md:items-start">
        {/* Left column - sticky ingredient manager */}
        <div className="sticky top-0 h-[calc(100vh-120px)] overflow-y-auto pr-2 scrollbar-thin min-w-0">
          {ingredientManagerPanel}
        </div>

        {/* Right column - results */}
        <div className="h-[calc(100vh-120px)] overflow-y-auto pr-2 min-w-0">
          {resultsPanel}
        </div>
      </div>

      {/* Mobile: Tab-based layout */}
      <div className="md:hidden pb-20">
        <Tabs value={mobileTab} onValueChange={setMobileTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="bottles" className="flex-1">My Bottles</TabsTrigger>
            <TabsTrigger value="cocktails" className="flex-1">Cocktails</TabsTrigger>
          </TabsList>

          <TabsContent value="bottles" className="mt-0 pb-4">
            {ingredientManagerPanel}
          </TabsContent>

          <TabsContent value="cocktails" className="mt-0 pb-4">
            {resultsPanel}
          </TabsContent>
        </Tabs>

        {/* Sticky bottom summary bar */}
        {(recipesICanMake.length > 0 || recipesNeedingOneIngredient.length > 0) && mobileTab === "bottles" && (
          <div className="fixed bottom-0 inset-x-0 z-50 px-3 pb-3 pt-2 pointer-events-none">
            <button
              onClick={() => setMobileTab("cocktails")}
              className="w-full max-w-3xl mx-auto bg-card/90 backdrop-blur border border-border rounded-organic-pill shadow-glass px-4 py-3 flex items-center justify-center gap-2 pointer-events-auto"
            >
              <span className="text-lg">🍸</span>
              <span className="text-sm text-pure-white font-medium">
                {recipesICanMake.length} cocktail{recipesICanMake.length !== 1 ? 's' : ''}
              </span>
              {recipesNeedingOneIngredient.length > 0 && (
                <span className="text-sm text-soft-gray">
                  • {recipesNeedingOneIngredient.length} close
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Results Drawer (kept for backward compat but mostly replaced by tabs) */}
      <ResultsDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        recipesICanMake={recipesICanMake}
        recipesNeedingOneIngredient={recipesNeedingOneIngredient}
        ingredientMap={ingredientMap}
        userIngredients={myBarIngredients}
        whatToBuyNext={whatToBuyNext}
        onAddIngredient={toggleIngredient}
      />
    </div>
  );
}
