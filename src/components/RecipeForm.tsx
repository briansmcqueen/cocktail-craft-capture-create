
import React, { useRef, useState, ChangeEvent } from "react";
import { Cocktail } from "@/data/classicCocktails";
import { Save, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type FormProps = {
  initial?: Partial<Cocktail>;
  onSave: (recipe: Cocktail) => void;
  onCancel: () => void;
};

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
    });
  }

  return (
    <form
      className={cn(
        "w-full max-w-lg p-6 rounded-2xl shadow bg-background space-y-4"
      )}
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <div>
        <label className="font-medium mb-1 block">Recipe Name</label>
        <input
          className="w-full input input-bordered px-3 py-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Espresso Martini"
          required
        />
      </div>
      <div>
        <label className="font-medium mb-1 block">Image</label>
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
      <div>
        <label className="font-medium mb-1 block">Ingredients <span className="text-xs text-muted-foreground">(one per line)</span></label>
        <textarea
          className="w-full px-3 py-2 border rounded min-h-[64px]"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="2 oz Vodka&#10;1 oz Espresso&#10;1/2 oz Coffee Liqueur"
          required
        />
      </div>
      <div>
        <label className="font-medium mb-1 block">Steps</label>
        <textarea
          className="w-full px-3 py-2 border rounded min-h-[64px]"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          placeholder="Combine all ingredients in a shaker with ice. Shake well..."
          required
        />
      </div>
      <div>
        <label className="font-medium mb-1 block">Notes <span className="text-xs text-muted-foreground">(optional)</span></label>
        <input
          className="w-full input input-bordered px-3 py-2 border rounded"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Invented at Soho Brasserie, London, 1980s"
        />
      </div>
      <div>
        <label className="font-medium mb-1 block">Region / Origin <span className="text-xs text-muted-foreground">(optional)</span></label>
        <input
          className="w-full input input-bordered px-3 py-2 border rounded"
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
