
import { Cocktail } from "@/data/classicCocktails";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Heart, ThumbsUp } from "lucide-react";
import TagBadge from "./ui/tag";
import { getLikeCount, addLike } from "@/utils/likes";
import { isFavorite, toggleFavorite } from "@/utils/favorites";

type Props = {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  recipe: Cocktail | null;
  onEdit?: () => void;
  editable?: boolean;
};

export default function RecipeModal({ open, onOpenChange, recipe, onEdit, editable }: Props) {
  if (!recipe) return null;

  const handleLike = () => {
    addLike(recipe.id);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(recipe.id);
  };

  const likeCount = getLikeCount(recipe.id);
  const isRecipeFavorited = isFavorite(recipe.id);

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
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1">
                {recipe.tags.map(tag => (
                  <TagBadge key={tag} className="bg-blue-100 text-blue-800 border border-blue-200 text-xs">{tag}</TagBadge>
                ))}
              </div>
            )}
            {likeCount > 0 && (
              <div className="text-xs text-gray-500 mb-2">
                {likeCount} like{likeCount === 1 ? '' : 's'}
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
          <Button
            variant="secondary"
            className={`${
              isRecipeFavorited ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
            }`}
            onClick={handleToggleFavorite}
          >
            <Heart size={16} fill={isRecipeFavorited ? 'currentColor' : 'none'} />
            {isRecipeFavorited ? 'Favorited' : 'Favorite'}
          </Button>
          <Button
            variant="secondary"
            className={`${
              likeCount > 0 ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
            }`}
            onClick={handleLike}
          >
            <ThumbsUp size={16} fill={likeCount > 0 ? 'currentColor' : 'none'} />
            Like
          </Button>
          {editable && (
            <Button variant="outline" onClick={onEdit}>
              <Edit size={16} /> Edit
            </Button>
          )}
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
