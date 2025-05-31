
import React, { useRef, useState, ChangeEvent } from "react";
import { Cocktail } from "@/data/classicCocktails";
import { Save, Image, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import TagInput from "./TagInput";

type FormProps = {
  initial?: Partial<Cocktail>;
  onSave: (recipe: Cocktail) => void;
  onCancel: () => void;
};

// Common ingredients for autofill
const COMMON_INGREDIENTS = [
  "2 oz Vodka",
  "2 oz Gin",
  "2 oz Bourbon",
  "2 oz Whiskey", 
  "2 oz Rum",
  "2 oz Tequila",
  "1 oz Triple Sec",
  "1 oz Cointreau",
  "1 oz Grand Marnier",
  "1 oz Lime juice",
  "1 oz Lemon juice",
  "1 oz Simple syrup",
  "1/2 oz Simple syrup",
  "1 dash Angostura bitters",
  "2 dashes Orange bitters",
  "1 oz Dry vermouth",
  "1 oz Sweet vermouth",
  "Club soda",
  "Tonic water",
  "Ginger beer",
  "Cranberry juice",
  "Orange juice",
  "Pineapple juice",
  "Fresh mint",
  "Lime wheel",
  "Lemon twist",
  "Orange peel",
  "Maraschino cherry"
];

// Common step templates
const STEP_TEMPLATES = [
  "Add all ingredients to a shaker filled with ice. Shake vigorously for 10-15 seconds. Strain into a chilled glass.",
  "Build ingredients directly in glass over ice. Stir gently to combine.",
  "Add spirits and mixers to a shaker with ice. Shake well and strain into a chilled coupe glass.",
  "Muddle ingredients in the bottom of the glass. Add ice and remaining ingredients. Stir to combine.",
  "Combine ingredients in a mixing glass with ice. Stir until well chilled. Strain into glass.",
  "Layer ingredients by pouring slowly over the back of a bar spoon."
];

function makeId() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 9)
  );
}

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
  const [showIngredientSuggestions, setShowIngredientSuggestions] = useState(false);
  const [showStepSuggestions, setShowStepSuggestions] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImage(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = (ingredient: string) => {
    const currentIngredients = ingredients.split('\n').filter(Boolean);
    if (!currentIngredients.includes(ingredient)) {
      setIngredients(prev => prev ? prev + '\n' + ingredient : ingredient);
    }
    setShowIngredientSuggestions(false);
  };

  const addStepTemplate = (template: string) => {
    setSteps(template);
    setShowStepSuggestions(false);
  };

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
      id: initial?.id || makeId(),
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
    });
  }

  return (
    <form
      className={cn(
        "w-full max-w-lg p-6 rounded-2xl shadow-2xl bg-black/95 backdrop-blur-md border border-white/20 space-y-4"
      )}
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <div>
        <label className="font-medium mb-1 block text-white">Recipe Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Espresso Martini"
          required
        />
      </div>
      <div>
        <label className="font-medium mb-1 block text-white">Image</label>
        <div className="flex items-center gap-3">
          {image ? (
            <img
              src={image}
              alt="Cocktail"
              className="h-16 w-16 object-cover rounded"
            />
          ) : (
            <div className="h-16 w-16 bg-muted rounded flex items-center justify-center">
              <Image size={24} />
            </div>
          )}
          <input
            ref={inputRef}
            className="hidden"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <Button
            type="button"
            onClick={() => inputRef.current?.click()}
            variant="secondary"
            className="flex items-center gap-1"
          >
            <Image size={18} /> Upload Photo
          </Button>
        </div>
      </div>
      <div className="relative">
        <label className="font-medium mb-1 block text-white">
          Ingredients <span className="text-xs text-muted-foreground">(one per line)</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-2 text-xs"
            onClick={() => setShowIngredientSuggestions(!showIngredientSuggestions)}
          >
            Quick Add
          </Button>
        </label>
        <Textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="2 oz Vodka&#10;1 oz Espresso&#10;1/2 oz Coffee Liqueur"
          required
        />
        {showIngredientSuggestions && (
          <div className="absolute z-10 mt-1 w-full bg-black border border-white/20 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {COMMON_INGREDIENTS.map((ingredient, i) => (
              <button
                key={i}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors text-white"
                onClick={() => addIngredient(ingredient)}
              >
                {ingredient}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="relative">
        <label className="font-medium mb-1 block text-white">
          Steps
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-2 text-xs"
            onClick={() => setShowStepSuggestions(!showStepSuggestions)}
          >
            Templates
          </Button>
        </label>
        <Textarea
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          placeholder="Combine all ingredients in a shaker with ice. Shake well..."
          required
        />
        {showStepSuggestions && (
          <div className="absolute z-10 mt-1 w-full bg-black border border-white/20 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {STEP_TEMPLATES.map((template, i) => (
              <button
                key={i}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors text-white border-b border-white/10 last:border-b-0"
                onClick={() => addStepTemplate(template)}
              >
                {template}
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <label className="font-medium mb-1 block text-white">
          Tags <span className="text-xs text-muted-foreground">(keywords, separated)</span>
        </label>
        <TagInput value={tags} onChange={setTags} />
      </div>
      <div>
        <label className="font-medium mb-1 block text-white">
          Notes <span className="text-xs text-muted-foreground">(optional)</span>
        </label>
        <Input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Invented at Soho Brasserie, London, 1980s"
        />
      </div>
      <div>
        <label className="font-medium mb-1 block text-white">
          Region / Origin <span className="text-xs text-muted-foreground">(optional)</span>
        </label>
        <Input
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="e.g. Italy"
        />
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="flex items-center gap-2">
          <Save size={16} /> Save
        </Button>
      </div>
    </form>
  );
}
