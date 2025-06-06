
import React, { useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Image } from "lucide-react";
import TagInput from "./TagInput";

type RecipeFormFieldsProps = {
  name: string;
  setName: (value: string) => void;
  image: string;
  setImage: (value: string) => void;
  ingredients: string;
  setIngredients: (value: string) => void;
  steps: string;
  setSteps: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  origin: string;
  setOrigin: (value: string) => void;
  tags: string[];
  setTags: (value: string[]) => void;
  showIngredientSuggestions: boolean;
  setShowIngredientSuggestions: (value: boolean) => void;
  showStepSuggestions: boolean;
  setShowStepSuggestions: (value: boolean) => void;
  addIngredient: (ingredient: string) => void;
  addStepTemplate: (template: string) => void;
  commonIngredients: string[];
  stepTemplates: string[];
};

export default function RecipeFormFields({
  name,
  setName,
  image,
  setImage,
  ingredients,
  setIngredients,
  steps,
  setSteps,
  notes,
  setNotes,
  origin,
  setOrigin,
  tags,
  setTags,
  showIngredientSuggestions,
  setShowIngredientSuggestions,
  showStepSuggestions,
  setShowStepSuggestions,
  addIngredient,
  addStepTemplate,
  commonIngredients,
  stepTemplates,
}: RecipeFormFieldsProps) {
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

  return (
    <>
      <div>
        <label className="font-medium mb-1 block text-gray-900">Recipe Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Espresso Martini"
          required
          className="bg-white border-gray-300 text-gray-700"
        />
      </div>
      
      <div>
        <label className="font-medium mb-1 block text-gray-900">Image</label>
        <div className="flex items-center gap-3">
          {image ? (
            <img
              src={image}
              alt="Cocktail"
              className="h-16 w-16 object-cover rounded border border-gray-200"
            />
          ) : (
            <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
              <Image size={24} className="text-gray-400" />
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
            className="flex items-center gap-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Image size={18} /> Upload Photo
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <label className="font-medium mb-1 block text-gray-900">
          Ingredients <span className="text-xs text-gray-500">(one per line)</span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="ml-2 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
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
          className="bg-white border-gray-300 text-gray-700"
        />
        {showIngredientSuggestions && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {commonIngredients.map((ingredient, i) => (
              <button
                key={i}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-gray-700 border-b border-gray-100 last:border-b-0"
                onClick={() => addIngredient(ingredient)}
              >
                {ingredient}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="relative">
        <label className="font-medium mb-1 block text-gray-900">
          Steps
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="ml-2 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
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
          className="bg-white border-gray-300 text-gray-700"
        />
        {showStepSuggestions && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {stepTemplates.map((template, i) => (
              <button
                key={i}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-gray-700 border-b border-gray-100 last:border-b-0"
                onClick={() => addStepTemplate(template)}
              >
                {template}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <label className="font-medium mb-1 block text-gray-900">
          Tags <span className="text-xs text-gray-500">(keywords, separated)</span>
        </label>
        <TagInput value={tags} onChange={setTags} />
      </div>
      
      <div>
        <label className="font-medium mb-1 block text-gray-900">
          Notes <span className="text-xs text-gray-500">(optional)</span>
        </label>
        <Input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Invented at Soho Brasserie, London, 1980s"
          className="bg-white border-gray-300 text-gray-700"
        />
      </div>
      
      <div>
        <label className="font-medium mb-1 block text-gray-900">
          Region / Origin <span className="text-xs text-gray-500">(optional)</span>
        </label>
        <Input
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="e.g. Italy"
          className="bg-white border-gray-300 text-gray-700"
        />
      </div>
    </>
  );
}
