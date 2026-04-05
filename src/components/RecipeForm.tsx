
import React, { useState } from "react";
import { Cocktail } from "@/data/classicCocktails";
import { Save } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import RecipeFormFields from "./RecipeFormFields";

type FormProps = {
  initial?: Partial<Cocktail>;
  onSave: (recipe: Cocktail) => void;
  onCancel: () => void;
};

// Input sanitization — React escapes output by default.
// TODO: Use DOMPurify if raw HTML rendering is ever needed.
const sanitizeInput = (input: string, maxLength: number = 1000): string => {
  return input.slice(0, maxLength).trim();
};

const validateRecipeInput = (field: string, value: string): string | null => {
  switch (field) {
    case 'name':
      if (value.length < 3) return 'Recipe name must be at least 3 characters';
      if (value.length > 100) return 'Recipe name must be under 100 characters';
      return null;
    case 'instructions':
      if (value.length < 10) return 'Instructions must be at least 10 characters';
      if (value.length > 5000) return 'Instructions must be under 5000 characters';
      return null;
    case 'notes':
      if (value.length > 1000) return 'Notes must be under 1000 characters';
      return null;
    case 'origin':
      if (value.length > 100) return 'Origin must be under 100 characters';
      return null;
    default:
      return null;
  }
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate all fields
    const validationErrors: Record<string, string> = {};
    
    const nameError = validateRecipeInput('name', name.trim());
    if (nameError) validationErrors.name = nameError;
    
    if (!ingredients.trim()) {
      validationErrors.ingredients = 'At least one ingredient is required';
    }
    
    const stepsError = validateRecipeInput('instructions', steps.trim());
    if (stepsError) validationErrors.steps = stepsError;
    
    const notesError = validateRecipeInput('notes', notes);
    if (notesError) validationErrors.notes = notesError;
    
    const originError = validateRecipeInput('origin', origin);
    if (originError) validationErrors.origin = originError;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({
        title: "Please fix the errors below",
        description: Object.values(validationErrors)[0],
      });
      return;
    }

    setErrors({});

    onSave({
      ...(initial?.id && { id: initial.id }),
      name: sanitizeInput(name.trim(), 100),
      image,
      ingredients: ingredients
        .split("\n")
        .map((i) => sanitizeInput(i.trim(), 200))
        .filter(Boolean),
      steps: sanitizeInput(steps, 5000),
      notes: sanitizeInput(notes, 1000),
      origin: sanitizeInput(origin, 100),
      tags,
      isPrivate,
    });
  }

  return (
    <div>
      <BackButton onClick={onCancel} className="mb-6" />

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

      {/* Validation errors */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 space-y-1">
          {Object.entries(errors).map(([field, error]) => (
            <p key={field} className="text-sm text-destructive">{error}</p>
          ))}
        </div>
      )}
      
      <div className="flex gap-2 justify-end pt-4 border-t border-border">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onCancel}
          className="hover:scale-[1.02] hover:rotate-[0.5deg] transition-all duration-300"
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
