
import React, { useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image } from "lucide-react";
import TagInput from "./TagInput";
import IngredientInput from "./IngredientInput";
import StepsInput from "./StepsInput";

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
        <label className="font-medium mb-1 block text-pure-white">Recipe Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Espresso Martini"
          className="bg-pure-white text-rich-charcoal placeholder:text-soft-gray border-border"
          required
        />
      </div>
      
      <div>
        <label className="font-medium mb-1 block text-pure-white">Image</label>
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
            className="flex items-center gap-1"
          >
            <Image size={18} /> Upload Photo
          </Button>
        </div>
      </div>
      
      <IngredientInput
        value={ingredients}
        onChange={setIngredients}
        placeholder="2 oz Vodka&#10;1 oz Espresso&#10;1/2 oz Coffee Liqueur"
        commonIngredients={commonIngredients}
      />
      
      <StepsInput
        value={steps}
        onChange={setSteps}
        placeholder="Combine all ingredients in a shaker with ice. Shake well..."
        stepTemplates={stepTemplates}
      />
      
      <div>
        <label className="font-medium mb-1 block text-pure-white">
          Tags <span className="text-xs text-light-text">(keywords, separated)</span>
        </label>
        <TagInput value={tags} onChange={setTags} />
      </div>
      
      <div>
        <label className="font-medium mb-1 block text-pure-white">
          Notes <span className="text-xs text-light-text">(optional)</span>
        </label>
        <Input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Invented at Soho Brasserie, London, 1980s"
          className="bg-pure-white text-rich-charcoal placeholder:text-soft-gray border-border"
        />
      </div>
      
      <div>
        <label className="font-medium mb-1 block text-pure-white">
          Region / Origin <span className="text-xs text-light-text">(optional)</span>
        </label>
        <Input
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="e.g. Italy"
          className="bg-pure-white text-rich-charcoal placeholder:text-soft-gray border-border"
        />
      </div>
    </>
  );
}
