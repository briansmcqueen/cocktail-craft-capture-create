import React from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import RecipeCard from "./RecipeCard";
import { Cocktail } from "@/data/classicCocktails";
import { isFavorite } from "@/utils/favorites";

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
          
          {/* Airbnb-style favorite button */}
          <div className="absolute top-1 right-3">
            <button
              className="p-1 rounded-full hover:scale-110 transition-transform duration-200"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(r);
              }}
            >
              <Heart 
                size={24} 
                className={`${
                  isFavorite(r.id) 
                    ? 'text-red-500 fill-red-500' 
                    : 'text-white fill-black/20 stroke-2'
                } transition-colors duration-200`}
                strokeWidth={isFavorite(r.id) ? 1 : 2}
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
