
import { Cocktail } from "@/data/classicCocktails";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Heart, ThumbsUp, X, Share, Martini } from "lucide-react";
import TagBadge from "./ui/tag";
import { getLikeCount, toggleLike, isLiked } from "@/utils/likes";
import { useFavorites } from "@/hooks/useFavoritesRefactored";
import { getUserRecipes } from "@/utils/storage";
import { useState, useEffect } from "react";
import { getUserPreferences } from "@/services/userPreferencesService";
import { useAuth } from "@/hooks/useAuth";
import RecipeRatingDisplay from "./RecipeRatingDisplay";
import RecipeComments from "./RecipeComments";

type Props = {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  recipe: Cocktail | null;
  onEdit?: () => void;
  editable?: boolean;
  onShareRecipe?: (recipe: Cocktail) => void;
  onRemix?: (recipe: Cocktail) => void;
  onShowAuthModal?: () => void;
};

export default function RecipeModal({ 
  open, 
  onOpenChange, 
  recipe, 
  onEdit, 
  editable, 
  onShareRecipe,
  onRemix,
  onShowAuthModal
}: Props) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isMetric, setIsMetric] = useState(false);

  // Load user's preferred unit when component mounts
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (user) {
        const preferences = await getUserPreferences();
        if (preferences?.preferred_unit) {
          setIsMetric(preferences.preferred_unit === 'ml');
        }
      }
    };
    loadUserPreferences();
  }, [user]);

  if (!recipe) return null;

  const userRecipes = getUserRecipes();
  const isUserRecipe = userRecipes.some(r => r.id === recipe.id);

  const handleLike = () => {
    toggleLike(recipe.id);
  };

  const handleToggleFavorite = async () => {
    await toggleFavorite(recipe.id, onShowAuthModal);
  };

  const handleShare = () => {
    if (onShareRecipe) {
      onShareRecipe(recipe);
    }
  };

  const handleRiff = () => {
    if (onRemix) {
      onRemix(recipe);
      onOpenChange(false);
    }
  };

  // Convert measurements based on toggle
  const convertMeasurement = (ingredient: string) => {
    if (!isMetric) return ingredient;
    
    return ingredient
      .replace(/(\d+(?:\.\d+)?)\s*oz/g, (match, num) => `${Math.round(parseFloat(num) * 30)}ml`)
      .replace(/(\d+(?:\/\d+)?)\s*oz/g, (match, frac) => {
        const decimal = frac.includes('/') ? eval(frac) : parseFloat(frac);
        return `${Math.round(decimal * 30)}ml`;
      })
      .replace(/(\d+)\s*dash/g, '$1 dash')
      .replace(/(\d+)\s*tsp/g, (match, num) => `${Math.round(parseFloat(num) * 5)}ml`)
      .replace(/(\d+)\s*tbsp/g, (match, num) => `${Math.round(parseFloat(num) * 15)}ml`);
  };

  const likeCount = getLikeCount(recipe.id);
  const isRecipeFavorited = isFavorite(recipe.id);
  const isRecipeLiked = isLiked(recipe.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-card border border-border rounded-organic-xl max-h-[90vh] overflow-y-auto w-[95vw] md:w-full p-4 md:p-6 shadow-glass"
        style={{ borderRadius: '24px 48px 36px 60px' }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight text-left leading-tight">
            {recipe.name}
          </DialogTitle>
          {recipe.origin && (
            <div className="mt-2 text-left">
              <TagBadge className="bg-accent/20 text-primary border border-primary/20 text-xs">
                {recipe.origin}
              </TagBadge>
            </div>
          )}
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 min-w-0">
            <img
            src={recipe.image}
            alt={recipe.name}
            className="h-48 w-full md:w-56 object-cover rounded-organic-md border border-border flex-shrink-0 shadow-glass"
          />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <div className="font-semibold text-lg text-foreground text-left">Ingredients</div>
                {/* Custom Metric/Imperial Toggle */}
                <div className="flex items-center justify-start sm:justify-end flex-shrink-0">
                  <div className="relative">
                    <div className="toggle-button-cover">
                      <div className="button-cover">
                        <div className="button custom-toggle">
                          <input 
                            type="checkbox" 
                            className="checkbox" 
                            checked={isMetric}
                            onChange={(e) => setIsMetric(e.target.checked)}
                          />
                          <div className="knobs">
                            <span>{isMetric ? 'ML' : 'OZ'}</span>
                          </div>
                          <div className="layer"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <ul className="list-disc pl-5 text-sm text-light-text space-y-1.5 break-words">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="leading-relaxed">{convertMeasurement(ing)}</li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-lg text-foreground mb-2 text-left">Instructions</div>
              <p className="text-base text-light-text whitespace-pre-line leading-relaxed text-left break-words">{recipe.steps}</p>
            </div>
            {recipe.notes && (
              <div className="mb-4">
                <div className="font-semibold text-lg text-foreground mb-2 text-left">Notes</div>
                <p className="text-sm text-soft-gray leading-relaxed text-left break-words">{recipe.notes}</p>
              </div>
            )}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2 max-w-full">
                {recipe.tags.map(tag => (
                  <TagBadge key={tag} className="bg-accent/20 text-secondary border border-accent/30 text-xs rounded-organic-sm">
                    {tag}
                  </TagBadge>
                ))}
              </div>
            )}
            {/* {likeCount > 0 && !isUserRecipe && (
              <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <ThumbsUp size={12} />
                <span>{likeCount} like{likeCount === 1 ? '' : 's'}</span>
              </div>
            )} */}

            {/* Ratings Section */}
            <div className="mb-4 border-t pt-4">
              <RecipeRatingDisplay recipeId={recipe.id} />
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-6 border-t pt-6">
          <RecipeComments recipeId={recipe.id} />
        </div>
        <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="flex gap-2 flex-1 flex-wrap min-w-0">
            <Button
              variant="secondary"
              className={`flex items-center gap-2 px-4 py-2 rounded-organic-sm transition-all duration-300 ${
                isRecipeFavorited ? 'text-heart-red border-heart-red/30 bg-heart-red/10 hover:bg-heart-red/20 hover:scale-[1.05] hover:rotate-[0.5deg]' : 'text-soft-gray hover:text-heart-red hover:scale-[1.02] hover:rotate-[-0.3deg]'
              }`}
              style={{ transitionTimingFunction: 'var(--timing-stir)' }}
              onClick={handleToggleFavorite}
            >
              <Heart size={16} fill={isRecipeFavorited ? 'currentColor' : 'none'} />
              {isRecipeFavorited ? 'Favorited' : 'Favorite'}
            </Button>
            
            {/* {!isUserRecipe && (
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
            )} */}
            
            {onShareRecipe && (
              <Button
                variant="secondary"
                className="flex items-center gap-2 px-4 py-2 rounded-organic-sm transition-all duration-300 text-soft-gray hover:text-secondary hover:scale-[1.02] hover:rotate-[-0.3deg]"
                style={{ transitionTimingFunction: 'var(--timing-stir)' }}
                onClick={handleShare}
              >
                <Share size={16} />
                Share
              </Button>
            )}
            {onRemix && (
              <Button
                variant="secondary"
                className="flex items-center gap-2 px-4 py-2 rounded-organic-sm transition-all duration-300 text-soft-gray hover:text-secondary hover:scale-[1.02] hover:rotate-[-0.3deg]"
                style={{ transitionTimingFunction: 'var(--timing-stir)' }}
                onClick={handleRiff}
              >
                <Martini size={16} />
                Riff
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {editable && (
              <Button 
                variant="outline" 
                onClick={onEdit}
                className="flex items-center gap-2 text-light-text hover:text-foreground rounded-organic-sm"
              >
                <Edit size={16} /> Edit
              </Button>
            )}
            <Button 
              variant="secondary" 
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-2 text-light-text hover:text-foreground rounded-organic-sm"
            >
              <X size={16} /> Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
