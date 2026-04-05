import React from "react";
import { Heart } from "lucide-react";
import { Cocktail } from "@/data/classicCocktails";
import RecipeCard from "./RecipeCard";
import { useFavorites } from "@/hooks/useFavorites";
import { useNavigate } from "react-router-dom";
import { getRecipeUrl } from "@/pages/RecipePage";

type RecipeCardWithFavoriteProps = {
  recipe: Cocktail;
  onRecipeClick: (recipe: Cocktail) => void;
  onTagClick?: (tag: string) => void;
  onShowAuthModal?: () => void;
  showOrigin?: boolean;
  showTags?: boolean;
  variant?: 'default' | 'profile';
};

export default function RecipeCardWithFavorite({ 
  recipe, 
  onRecipeClick, 
  onTagClick,
  onShowAuthModal,
  showOrigin,
  showTags,
  variant
}: RecipeCardWithFavoriteProps) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(recipe.id, () => {
      if (window.__openAuthModal) {
        window.__openAuthModal('signup', "Love this drink? Save it to your favorites!");
      } else if (onShowAuthModal) {
        onShowAuthModal();
      }
    });
  };

  const handleCardClick = () => {
    const url = getRecipeUrl(recipe);
    navigate(url);
  };

  return (
    <div className="relative group">
      <RecipeCard
        recipe={recipe}
        onSelect={handleCardClick}
        editable={false}
        onTagClick={onTagClick}
        showOrigin={showOrigin}
        showTags={showTags}
        variant={variant}
      />
      
      <div className="absolute top-1 right-3 z-10">
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