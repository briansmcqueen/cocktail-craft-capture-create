import React, { useState, useMemo } from "react";
import { ChevronRight, Check, Wine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Cocktail } from "@/data/classicCocktails";
import { Ingredient } from "@/data/ingredients";
import { analyzeRecipes } from "@/services/ingredientMatchingService";
import { ASSUMED_INGREDIENT_IDS } from "@/types/ingredientTiers";
import UniversalRecipeCard from "@/components/UniversalRecipeCard";

interface MyBarOnboardingProps {
  allIngredients: Ingredient[];
  recipes: Cocktail[];
  onComplete: (selectedIds: string[]) => Promise<void> | void;
  onSkip: () => void;
}

// Spirit options for Step 2
const SPIRIT_OPTIONS = [
  { id: "spirit_001", name: "Bourbon", description: "Sweet, oaky, vanilla" },
  { id: "spirit_002", name: "Rye Whiskey", description: "Spicy, dry, bold" },
  { id: "spirit_003", name: "Gin", description: "Juniper, botanical" },
  { id: "spirit_004", name: "Vodka", description: "Clean, versatile" },
  { id: "spirit_005", name: "White Rum", description: "Light, tropical" },
  { id: "spirit_006", name: "Dark Rum", description: "Rich, aged, warm" },
  { id: "spirit_007", name: "Tequila", description: "Agave, bright" },
  { id: "spirit_010", name: "Mezcal", description: "Smoky, earthy" },
];

// Modifier options for Step 3
const MODIFIER_OPTIONS = [
  { id: "wine_001", name: "Sweet Vermouth", description: "Manhattans, Negronis" },
  { id: "wine_002", name: "Dry Vermouth", description: "Martinis, stirred drinks" },
  { id: "liqueur_001", name: "Orange Liqueur", description: "Margaritas, Sidecars" },
  { id: "liqueur_005", name: "Campari", description: "Negronis, Americanos" },
  { id: "pantry_006", name: "Angostura Bitters", description: "Old Fashioneds, everything" },
  { id: "pantry_007", name: "Orange Bitters", description: "Martinis, whiskey drinks" },
  { id: "liqueur_003", name: "Coffee Liqueur", description: "Espresso Martinis" },
  { id: "wine_003", name: "Champagne / Prosecco", description: "French 75, Spritz" },
];

export default function MyBarOnboarding({
  allIngredients,
  recipes,
  onComplete,
  onSkip,
}: MyBarOnboardingProps) {
  const [step, setStep] = useState(1);
  const [selectedSpirits, setSelectedSpirits] = useState<string[]>([]);
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);
  const [spiritError, setSpiritError] = useState(false);
  const [saving, setSaving] = useState(false);

  const allSelected = useMemo(
    () => [...selectedSpirits, ...selectedModifiers],
    [selectedSpirits, selectedModifiers]
  );

  // Compute results for step 4
  const { canMake, oneAway } = useMemo(() => {
    if (step < 4) return { canMake: [], oneAway: [] };
    const allAvailable = [...allSelected, ...ASSUMED_INGREDIENT_IDS];
    const analyses = analyzeRecipes(recipes, allAvailable, false); // false because we already include assumed
    return {
      canMake: analyses.filter((a) => a.canMake).map((a) => a.recipe),
      oneAway: analyses.filter((a) => !a.canMake && a.missingCount === 1).map((a) => a.recipe),
    };
  }, [step, allSelected, recipes]);

  const toggleSpirit = (id: string) => {
    setSpiritError(false);
    setSelectedSpirits((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleModifier = (id: string) => {
    setSelectedModifiers((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleNextFromSpirits = () => {
    if (selectedSpirits.length === 0) {
      setSpiritError(true);
      return;
    }
    setStep(3);
  };

  const handleFinishModifiers = () => {
    setStep(4);
  };

  const handleComplete = async () => {
    setSaving(true);
    await onComplete(allSelected);
  };

  // Step 1: Welcome
  if (step === 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-in fade-in duration-500">
        <Wine className="h-16 w-16 text-primary mb-6 opacity-80" />
        <h1 className="text-3xl font-medium text-pure-white mb-3 tracking-wide">
          What's in your bar?
        </h1>
        <p className="text-light-text text-base mb-8 max-w-sm">
          Tell us what bottles you have and we'll show you every cocktail you can make.
        </p>
        <Button
          onClick={() => setStep(2)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-base rounded-organic-md"
        >
          Get Started
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
        <button
          onClick={onSkip}
          className="mt-4 text-soft-gray text-sm hover:text-light-text transition-colors"
        >
          I'll add ingredients manually
        </button>
      </div>
    );
  }

  // Step 2: Pick base spirits
  if (step === 2) {
    return (
      <div className="px-4 sm:px-0 animate-in fade-in duration-400">
        <h2 className="text-2xl font-medium text-pure-white mb-2 tracking-wide">
          Pick your base spirits
        </h2>
        <p className="text-light-text text-sm mb-6">
          Select the bottles you have at home.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {SPIRIT_OPTIONS.map((spirit) => {
            const isSelected = selectedSpirits.includes(spirit.id);
            return (
              <button
                key={spirit.id}
                onClick={() => toggleSpirit(spirit.id)}
                className={`relative text-left p-4 rounded-organic-md border transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-[0_0_12px_rgba(6,95,70,0.2)]"
                    : "border-border bg-card hover:border-muted-foreground/40"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                <div className="text-sm font-medium text-pure-white">{spirit.name}</div>
                <div className="text-xs text-soft-gray mt-1">{spirit.description}</div>
              </button>
            );
          })}
        </div>

        {spiritError && (
          <p className="text-destructive text-sm mt-3 text-center animate-in fade-in duration-200">
            Pick at least one bottle to get started
          </p>
        )}

        <div className="flex justify-end mt-6">
          <Button
            onClick={handleNextFromSpirits}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 rounded-organic-md"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: Pick key modifiers
  if (step === 3) {
    return (
      <div className="px-4 sm:px-0 animate-in fade-in duration-400">
        <h2 className="text-2xl font-medium text-pure-white mb-2 tracking-wide">
          Any of these on your shelf?
        </h2>
        <p className="text-light-text text-sm mb-6">
          These unlock the most cocktails.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {MODIFIER_OPTIONS.map((mod) => {
            const isSelected = selectedModifiers.includes(mod.id);
            return (
              <button
                key={mod.id}
                onClick={() => toggleModifier(mod.id)}
                className={`relative text-left p-4 rounded-organic-md border transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-[0_0_12px_rgba(6,95,70,0.2)]"
                    : "border-border bg-card hover:border-muted-foreground/40"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                <div className="text-sm font-medium text-pure-white">{mod.name}</div>
                <div className="text-xs text-soft-gray mt-1">{mod.description}</div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="ghost"
            onClick={handleFinishModifiers}
            className="text-soft-gray hover:text-light-text"
          >
            Skip
          </Button>
          <Button
            onClick={handleFinishModifiers}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 rounded-organic-md"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Step 4: Results reveal
  return (
    <div className="px-4 sm:px-0 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <div className="text-5xl font-bold text-primary mb-2 animate-in zoom-in duration-500">
          {canMake.length}
        </div>
        <h2 className="text-2xl font-medium text-pure-white mb-1 tracking-wide">
          {canMake.length === 1 ? "cocktail" : "cocktails"} you can make!
        </h2>
        {oneAway.length > 0 && (
          <p className="text-light-text text-sm mt-2">
            Plus <span className="text-golden-amber font-medium">{oneAway.length}</span> more{" "}
            {oneAway.length === 1 ? "is" : "are"} just 1 ingredient away.
          </p>
        )}
      </div>

      {canMake.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {canMake.slice(0, 4).map((recipe) => (
            <UniversalRecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      {canMake.length === 0 && (
        <div className="text-center mb-8 p-6 bg-card rounded-organic-md border border-border">
          <p className="text-light-text">
            You're close! Add a few more bottles to unlock your first cocktails.
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <Button
          onClick={handleComplete}
          disabled={saving}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-base rounded-organic-md"
        >
          {saving ? 'Setting up your bar...' : 'Explore My Bar'}
          {!saving && <ChevronRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
