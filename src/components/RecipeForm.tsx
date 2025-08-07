
import React, { useState } from "react";
import { Cocktail } from "@/data/classicCocktails";
import { ArrowLeft, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import RecipeFormFields from "./RecipeFormFields";

type FormProps = {
  initial?: Partial<Cocktail>;
  onSave: (recipe: Cocktail) => void;
  onCancel: () => void;
};

const COMMON_INGREDIENTS = [
  "2 oz Vodka", "2 oz Gin", "2 oz Bourbon", "2 oz Whiskey", "2 oz Rum", "2 oz Tequila",
  "1 oz Triple Sec", "1 oz Cointreau", "1 oz Grand Marnier", "1 oz Lime juice", "1 oz Lemon juice",
  "1 oz Simple syrup", "1/2 oz Simple syrup", "1 dash Angostura bitters", "2 dashes Orange bitters",
  "1 oz Dry vermouth", "1 oz Sweet vermouth", "Club soda", "Tonic water", "Ginger beer",
  "Cranberry juice", "Orange juice", "Pineapple juice", "Fresh mint", "Lime wheel",
  "Lemon twist", "Orange peel", "Maraschino cherry"
];

const STEP_TEMPLATES = [
  "Add all ingredients to a shaker filled with ice. Shake vigorously for 10-15 seconds. Strain into a chilled glass.",
  "Build ingredients directly in glass over ice. Stir gently to combine.",
  "Add spirits and mixers to a shaker with ice. Shake well and strain into a chilled coupe glass.",
  "Muddle ingredients in the bottom of the glass. Add ice and remaining ingredients. Stir to combine.",
  "Combine ingredients in a mixing glass with ice. Stir until well chilled. Strain into glass.",
  "Layer ingredients by pouring slowly over the back of a bar spoon."
];

// Removed makeId function - let database generate UUIDs

export default function RecipeForm({ initial, onSave, onCancel }: FormProps) {
  const [name, setName] = useState(initial?.name || "");
  const [image, setImage] = useState(initial?.image || "");
  const [ingredients, setIngredients] = useState(
    initial?.ingredients?.join("\n") || ""
  );
  const [steps, setSteps] = useState(initial?.steps || "");
  const [notes, setNotes] = useState(initial?.notes || "");
  const [origin, setOrigin] = useState(initial?.origin || "");
  const [tags, setTags] = useState<string[]>(initial?.tags || []);
  const [isPrivate, setIsPrivate] = useState(initial?.isPrivate || false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !ingredients.trim() || !steps.trim()) {
      toast({
        title: "Name, ingredients, and steps are required.",
        description: "Please fill in the key fields.",
      });
      return;
    }

    onSave({
      ...(initial?.id && { id: initial.id }), // Only include id if editing existing recipe
      name: name.trim(),
      image,
      ingredients: ingredients
        .split("\n")
        .map((i) => i.trim())
        .filter(Boolean),
      steps,
      notes,
      origin,
      tags,
      isPrivate,
    });
  }

  return (
    <div>
      {/* Back button */}
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-light-text hover:text-pure-white mb-6 transition-colors"
        type="button"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <form
        className={cn(
          "w-full max-w-2xl p-6 rounded-organic-lg shadow-lg border border-border space-y-4"
        )}
        style={{ backgroundColor: '#202938' }}
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div className="mb-4">
          <h2 className="text-2xl font-medium text-pure-white tracking-wide mb-2">
            {initial?.id ? 'Edit Recipe' : 'Create New Recipe'}
          </h2>
        </div>

      <RecipeFormFields
        name={name}
        setName={setName}
        image={image}
        setImage={setImage}
        ingredients={ingredients}
        setIngredients={setIngredients}
        steps={steps}
        setSteps={setSteps}
        notes={notes}
        setNotes={setNotes}
        origin={origin}
        setOrigin={setOrigin}
        tags={tags}
        setTags={setTags}
        isPrivate={isPrivate}
        setIsPrivate={setIsPrivate}
        commonIngredients={COMMON_INGREDIENTS}
        stepTemplates={STEP_TEMPLATES}
      />
      
      <div className="flex gap-2 justify-end pt-4 border-t border-gray-200">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onCancel}
          className=""
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex items-center gap-2"
        >
          <Save size={16} /> Save Recipe
        </Button>
      </div>
      </form>
    </div>
  );
}
