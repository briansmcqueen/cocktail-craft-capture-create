
import React from "react";
import { Button } from "@/components/ui/button";
import { Heart, Share, ThumbsUp } from "lucide-react";
import RecipeCard from "./RecipeCard";
import { Cocktail } from "@/data/classicCocktails";
import { isFavorite, isLiked } from "@/utils/favorites";

type RecipeGridProps = {
  recipes: Cocktail[];
  onRecipeClick: (recipe: Cocktail) => void;
  onToggleFavorite: (recipe: Cocktail) => void;
  onLike: (recipe: Cocktail) => void;
  onShareRecipe: (recipe: Cocktail) => void;
  onTagClick: (tag: string) => void;
  onShowForm: () => void;
  forceUpdate: number;
  library: string;
};

export default function RecipeGrid({
  recipes,
  onRecipeClick,
  onToggleFavorite,
  onLike,
  onShareRecipe,
  onTagClick,
  onShowForm,
  forceUpdate,
  library
}: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-12 lg:mt-16 px-4">
        <p className="mb-4 text-sm lg:text-base">No recipes yet in this library.</p>
        {library !== "classics" && library !== "favorites" && (
          <Button 
            onClick={onShowForm} 
            className="w-full sm:w-auto bg-orange-600 text-white hover:bg-orange-700"
          >
            Add Your First Recipe
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      {recipes.map((r) => (
        <div key={`${r.id}-${forceUpdate}`} className="relative group">
          <div className="relative overflow-hidden rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white">
            <RecipeCard
              recipe={r}
              onSelect={() => onRecipeClick(r)}
              editable={false}
              onTagClick={onTagClick}
            />
          </div>
          
          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Button
              size="sm"
              variant="secondary"
              className={`p-2 bg-white/90 hover:bg-white border border-gray-200 shadow-sm backdrop-blur-sm rounded-full transition-colors ${
                isFavorite(r.id) ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(r);
              }}
            >
              <Heart size={14} fill={isFavorite(r.id) ? 'currentColor' : 'none'} />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className={`p-2 bg-white/90 hover:bg-white border border-gray-200 shadow-sm backdrop-blur-sm rounded-full transition-colors ${
                isLiked(r.id) ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onLike(r);
              }}
            >
              <ThumbsUp size={14} fill={isLiked(r.id) ? 'currentColor' : 'none'} />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="p-2 bg-white/90 hover:bg-white text-gray-600 border border-gray-200 shadow-sm backdrop-blur-sm rounded-full hover:text-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                onShareRecipe(r);
              }}
            >
              <Share size={14} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
