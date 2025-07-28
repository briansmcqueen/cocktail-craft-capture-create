
import React from "react";
import { Cocktail } from "@/data/classicCocktails";
import { Heart } from "lucide-react";
import UnifiedRecipeCard from "./UnifiedRecipeCard";

type FavoritesProps = {
  favoriteRecipes: Cocktail[];
  onRecipeClick: (recipe: Cocktail) => void;
  onEditRecipe?: (recipe: Cocktail) => void;
  onShareRecipe: (recipe: Cocktail) => void;
  userRecipes: Cocktail[];
  onTagClick?: (tag: string) => void;
  onShowAuthModal?: () => void;
};

export default function Favorites({ favoriteRecipes, onRecipeClick, onEditRecipe, onShareRecipe, userRecipes, onTagClick, onShowAuthModal }: FavoritesProps) {

  if (favoriteRecipes.length === 0) {
    return (
      <div className="container mx-auto px-md py-xl text-center">
        <Heart className="mx-auto mb-lg text-muted-foreground" size={48} />
        <h2 className="text-3xl font-medium mb-md text-foreground">No favorites yet</h2>
        <p className="text-muted-foreground text-base max-w-md mx-auto">
          Start favoriting recipes by clicking the heart icon on any cocktail you love!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-md py-xl space-y-xl">
      <div className="flex items-center gap-md">
        <Heart className="text-heart-red" size={24} />
        <h2 className="text-3xl font-medium text-foreground">
          Your Favorite Cocktails
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md lg:gap-lg">
        {favoriteRecipes.map((recipe) => (
          <UnifiedRecipeCard
            key={recipe.id}
            recipe={recipe}
            onRecipeClick={onRecipeClick}
            onTagClick={onTagClick}
            onShowAuthModal={onShowAuthModal}
          />
        ))}
      </div>
    </div>
  );
}
