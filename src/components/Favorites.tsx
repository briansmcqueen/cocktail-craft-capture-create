import React from "react";
import { Cocktail } from "@/data/classicCocktails";
import { Heart } from "lucide-react";
import UniversalRecipeCard from "./UniversalRecipeCard";
import { useAuth } from "@/hooks/useAuth";
import AuthPrompt from "@/components/auth/AuthPrompt";

type FavoritesProps = {
  favoriteRecipes: Cocktail[];
  onRecipeClick: (recipe: Cocktail) => void;
  onEditRecipe?: (recipe: Cocktail) => void;
  onShareRecipe: (recipe: Cocktail) => void;
  userRecipes: Cocktail[];
};

export default function Favorites({ favoriteRecipes, onRecipeClick, onEditRecipe, onShareRecipe, userRecipes }: FavoritesProps) {
  const { user } = useAuth();

  if (!user) {
    return (
      <AuthPrompt
        icon={Heart}
        title="Save Your Favorite Cocktails"
        description="Create a free account to save your favorite recipes and access them from any device."
      />
    );
  }

  if (favoriteRecipes.length === 0) {
    return (
      <div className="container mx-auto px-md py-xl text-center animate-fade-in">
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
