
import { Cocktail } from "@/data/classicCocktails";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  recipe: Cocktail | null;
  onEdit?: () => void;
  editable?: boolean;
};

export default function RecipeModal({ open, onOpenChange, recipe, onEdit, editable }: Props) {
  if (!recipe) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">{recipe.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="h-48 w-full md:w-56 object-cover rounded mb-4 border"
          />
          <div className="flex-1 flex flex-col">
            <div className="mb-2">
              <div className="font-semibold">Ingredients</div>
              <ul className="list-disc pl-5 text-sm mt-1 mb-2">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>
            <div className="mb-2">
              <div className="font-semibold">Steps</div>
              <p className="text-sm whitespace-pre-line">{recipe.steps}</p>
            </div>
            {recipe.notes && (
              <div className="mb-2">
                <div className="font-semibold">Notes</div>
                <p className="text-sm text-muted-foreground">{recipe.notes}</p>
              </div>
            )}
            {recipe.origin && (
              <div>
                <span className="inline-block bg-accent rounded px-2 py-1 text-xs mt-2">
                  {recipe.origin}
                </span>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="mt-2 flex gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {editable && (
            <Button variant="outline" onClick={onEdit}>
              <Edit size={16} /> Edit
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
