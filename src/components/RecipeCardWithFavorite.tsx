import React from "react";
import { Heart } from "lucide-react";
import { Cocktail } from "@/data/classicCocktails";
import RecipeCard from "./RecipeCard";
import { useFavorites } from "@/hooks/useFavoritesRefactored";

type RecipeCardWithFavoriteProps = {
  recipe: Cocktail;
  onRecipeClick: (recipe: Cocktail) => void;
  onTagClick?: (tag: string) => void;
  onShowAuthModal?: () => void;
};

export default function RecipeCardWithFavorite({ 
  recipe, 
  onRecipeClick, 
  onTagClick,
  onShowAuthModal
}: RecipeCardWithFavoriteProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(recipe.id, onShowAuthModal);
  };

  return (
    <div className="relative group">
      <div className="relative overflow-hidden rounded-organic-lg border border-light-charcoal hover:border-primary/30 transition-all duration-300 bg-medium-charcoal hover:bg-light-charcoal hover:scale-[1.02] hover:rotate-[0.5deg] shadow-lg hover:shadow-xl">
        <RecipeCard
          recipe={recipe}
          onSelect={() => onRecipeClick(recipe)}
          editable={false}
          onTagClick={onTagClick}
        />
      </div>
      
      <div className="absolute top-1 right-3">
        <button
          className="p-1 rounded-organic-sm bg-medium-charcoal/80 backdrop-blur-sm hover:bg-light-charcoal hover:scale-110 active:scale-95 transition-all duration-200 touch-manipulation border border-light-charcoal/30"
          onClick={handleToggleFavorite}
        >
          <Heart 
            size={24} 
            className={`${
              isFavorite(recipe.id) 
                ? 'text-heart-red fill-heart-red' 
                : 'text-light-text fill-transparent stroke-2'
            } transition-colors duration-200`}
            strokeWidth={isFavorite(recipe.id) ? 1 : 2}
          />
        </button>
      </div>
    </div>
  );
}