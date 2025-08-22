import React from "react";
import { Ingredient } from "@/data/ingredients";
import { User } from "@supabase/supabase-js";
import type { BarPreset } from "@/services/barPresetsService";
import IngredientSelector from "./IngredientSelector";

interface TieredIngredientSelectorProps {
  allIngredients: Ingredient[];
  myBar: { [ingredientId: string]: boolean };
  myBarIngredients: string[];
  ingredientMap: { [ingredientId: string]: Ingredient };
  toggleIngredient: (ingredientId: string) => void;
  user: User | null;
  setCustomIngredients: React.Dispatch<React.SetStateAction<any[]>>;
  includeAssumed?: boolean;
  onToggleAssumed?: (val: boolean) => void;
  presets: BarPreset[];
  onSavePreset: (name: string) => Promise<void>;
  onLoadPreset: (preset: BarPreset) => Promise<void>;
  onDeletePreset: (presetId: string) => Promise<void>;
}

export default function TieredIngredientSelector({
  allIngredients,
  myBar,
  myBarIngredients,
  ingredientMap,
  toggleIngredient,
  user,
  setCustomIngredients,
  presets,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
}: TieredIngredientSelectorProps) {
  return (
    <IngredientSelector
      allIngredients={allIngredients}
      myBar={myBar}
      myBarIngredients={myBarIngredients}
      ingredientMap={ingredientMap}
      toggleIngredient={toggleIngredient}
      user={user}
      setCustomIngredients={setCustomIngredients}
      presets={presets}
      onSavePreset={onSavePreset}
      onLoadPreset={onLoadPreset}
      onDeletePreset={onDeletePreset}
    />
  );
}