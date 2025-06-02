
import { Cocktail } from "@/data/classicCocktails";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Heart, ThumbsUp, X } from "lucide-react";
import TagBadge from "./ui/tag";
import { getLikeCount, toggleLike, isLiked } from "@/utils/likes";
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
    toggleLike(recipe.id);
    window.dispatchEvent(new Event('favorites-update'));
  };

  const handleToggleFavorite = () => {
    toggleFavorite(recipe.id);
    window.dispatchEvent(new Event('favorites-update'));
  };

  const likeCount = getLikeCount(recipe.id);
  const isRecipeFavorited = isFavorite(recipe.id);
  const isRecipeLiked = isLiked(recipe.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif font-normal text-gray-900 tracking-wide">
            {recipe.name}
          </DialogTitle>
          {recipe.origin && (
            <div className="mt-2">
              <TagBadge className="bg-orange-100 text-orange-800 border border-orange-200 text-xs">
                {recipe.origin}
              </TagBadge>
            </div>
          )}
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="h-48 w-full md:w-56 object-cover rounded-lg border border-gray-200"
          />
          <div className="flex-1 flex flex-col">
            <div className="mb-4">
              <div className="font-semibold text-gray-900 mb-2">Ingredients</div>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-gray-900 mb-2">Instructions</div>
              <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{recipe.steps}</p>
            </div>
            {recipe.notes && (
              <div className="mb-4">
                <div className="font-semibold text-gray-900 mb-2">Notes</div>
                <p className="text-sm text-gray-600 leading-relaxed">{recipe.notes}</p>
              </div>
            )}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {recipe.tags.map(tag => (
                  <TagBadge key={tag} className="bg-blue-100 text-blue-800 border border-blue-200 text-xs">
                    {tag}
                  </TagBadge>
                ))}
              </div>
            )}
            {likeCount > 0 && (
              <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <ThumbsUp size={12} />
                <span>{likeCount} like{likeCount === 1 ? '' : 's'}</span>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2 flex-1">
            <Button
              variant="secondary"
              className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-full transition-colors ${
                isRecipeFavorited ? 'text-red-600 border-red-200 bg-red-50 hover:bg-red-100' : 'text-gray-500 hover:text-red-600'
              }`}
              onClick={handleToggleFavorite}
            >
              <Heart size={16} fill={isRecipeFavorited ? 'currentColor' : 'none'} />
              {isRecipeFavorited ? 'Favorited' : 'Favorite'}
            </Button>
            <Button
              variant="secondary"
              className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-full transition-colors ${
                isRecipeLiked ? 'text-red-600 border-red-200 bg-red-50 hover:bg-red-100' : 'text-gray-500 hover:text-red-600'
              }`}
              onClick={handleLike}
            >
              <ThumbsUp size={16} fill={isRecipeLiked ? 'currentColor' : 'none'} />
              {isRecipeLiked ? 'Liked' : 'Like'}
            </Button>
          </div>
          <div className="flex gap-2">
            {editable && (
              <Button 
                variant="outline" 
                onClick={onEdit}
                className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Edit size={16} /> Edit
              </Button>
            )}
            <Button 
              variant="secondary" 
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
            >
              <X size={16} className="text-gray-700" /> Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
