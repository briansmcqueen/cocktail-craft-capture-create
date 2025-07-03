
import React from "react";
import { Heart } from "lucide-react";
import { Cocktail } from "@/data/classicCocktails";
import RecipeCard from "./RecipeCard";
import { useFavorites } from "@/hooks/useFavorites";

type RecipeCardWithFavoriteProps = {
  recipe: Cocktail;
  onRecipeClick: (recipe: Cocktail) => void;
  onToggleFavorite: (recipe: Cocktail) => void;
  onTagClick?: (tag: string) => void;
  forceUpdate?: number;
};

export default function RecipeCardWithFavorite({ 
  recipe, 
  onRecipeClick, 
  onToggleFavorite, 
  onTagClick,
  forceUpdate 
}: RecipeCardWithFavoriteProps) {
  const { isFavorite } = useFavorites();
  return (
    <div key={`${recipe.id}-${forceUpdate}`} className="relative group">
      <div className="relative overflow-hidden rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white">
        <RecipeCard
          recipe={recipe}
          onSelect={() => onRecipeClick(recipe)}
          editable={false}
          onTagClick={onTagClick}
        />
      </div>
      
      <div className="absolute top-1 right-3">
        <button
          className="p-1 rounded-full hover:scale-110 active:scale-95 transition-transform duration-200 touch-manipulation"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(recipe);
          }}
        >
          <Heart 
            size={24} 
            className={`${
              isFavorite(recipe.id) 
                ? 'text-red-500 fill-red-500' 
                : 'text-white fill-black/20 stroke-2'
            } transition-colors duration-200`}
            strokeWidth={isFavorite(recipe.id) ? 1 : 2}
          />
        </button>
      </div>
    </div>
  );
}
