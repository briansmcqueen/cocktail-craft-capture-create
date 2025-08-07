import { useState, useMemo } from "react";
import { Cocktail } from "@/data/classicCocktails";
import { RecipeScalingService, ScaledRecipe, ScalingConfig } from "@/services/recipeScalingService";

export interface UseRecipeScalingReturn {
  scaledRecipe: ScaledRecipe;
  scalingConfig: ScalingConfig;
  currentServings: number;
  setServings: (servings: number) => void;
  resetScaling: () => void;
  canScaleUp: boolean;
  canScaleDown: boolean;
  isScaled: boolean;
}

export function useRecipeScaling(recipe: Cocktail): UseRecipeScalingReturn {
  const scalingConfig = useMemo(() => 
    RecipeScalingService.getScalingConfig(recipe), 
    [recipe]
  );
  
  const [currentServings, setCurrentServings] = useState(scalingConfig.defaultServings);
  
  const scaledRecipe = useMemo(() => {
    return RecipeScalingService.scaleRecipe(recipe, currentServings);
  }, [recipe, currentServings]);
  
  const setServings = (servings: number) => {
    const clampedServings = Math.max(
      scalingConfig.minServings,
      Math.min(scalingConfig.maxServings, servings)
    );
    setCurrentServings(clampedServings);
  };
  
  const resetScaling = () => {
    setCurrentServings(scalingConfig.defaultServings);
  };
  
  const canScaleUp = currentServings < scalingConfig.maxServings;
  const canScaleDown = currentServings > scalingConfig.minServings;
  const isScaled = currentServings !== scalingConfig.defaultServings;
  
  return {
    scaledRecipe,
    scalingConfig,
    currentServings,
    setServings,
    resetScaling,
    canScaleUp,
    canScaleDown,
    isScaled
  };
}