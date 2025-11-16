import React from "react";
import { Cocktail } from "@/data/classicCocktails";
import { Heart, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import UniversalRecipeCard from "./UniversalRecipeCard";
import { useAuth } from "@/hooks/useAuth";
import { useAuthModal } from "@/contexts/AuthModalContext";

type FavoritesProps = {
  favoriteRecipes: Cocktail[];
  onRecipeClick: (recipe: Cocktail) => void;
  onEditRecipe?: (recipe: Cocktail) => void;
  onShareRecipe: (recipe: Cocktail) => void;
  userRecipes: Cocktail[];
};

export default function Favorites({ favoriteRecipes, onRecipeClick, onEditRecipe, onShareRecipe, userRecipes }: FavoritesProps) {
  const { user } = useAuth();
  const { openAuthModal } = useAuthModal();

  if (!user) {
    return (
      <div className="container mx-auto px-md py-xl text-center">
        <Heart className="mx-auto mb-lg text-available" size={64} />
        <h2 className="text-3xl font-medium mb-md text-pure-white">Save Your Favorite Cocktails</h2>
        <p className="text-light-text text-base max-w-md mx-auto mb-lg">
          Create a free account to save your favorite recipes and access them from any device.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => openAuthModal('signup')}
            size="lg"
            className="rounded-organic-md"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Create Free Account
          </Button>
          <Button
            onClick={() => openAuthModal('signin')}
            variant="outline"
            size="lg"
            className="rounded-organic-md"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md lg:gap-lg">
      {favoriteRecipes.map((recipe) => (
        <UniversalRecipeCard
          key={recipe.id}
          recipe={recipe}
        />
      ))}
    </div>
  );
}
