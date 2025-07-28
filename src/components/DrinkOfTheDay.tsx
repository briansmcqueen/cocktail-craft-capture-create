import React from "react";
import { Calendar, Globe } from "lucide-react";
import { Cocktail } from "@/data/classicCocktails";
import { Button } from "@/components/ui/button";
import TagBadge from "./ui/tag";
import { useFavorites } from "@/hooks/useFavoritesRefactored";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { recipeNameToSlug } from "@/pages/RecipePage";

interface DrinkOfTheDayProps {
  recipe: Cocktail;
  onRecipeClick: (recipe: Cocktail) => void;
  onShowAuthModal?: () => void;
}

export default function DrinkOfTheDay({ 
  recipe, 
  onRecipeClick,
  onShowAuthModal 
}: DrinkOfTheDayProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(recipe.id, onShowAuthModal);
  };

  const handleRecipeClick = () => {
    const slug = recipeNameToSlug(recipe.name);
    navigate(`/cocktail/${slug}`);
  };

  const handleImageClick = () => {
    const slug = recipeNameToSlug(recipe.name);
    navigate(`/cocktail/${slug}`);
  };

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-pure-white tracking-[0.08em] leading-[1.45] uppercase font-bold text-[1rem]">
          Drink of the Day
        </h2>
      </div>
      
      <div className="relative bg-gradient-to-br from-primary/20 to-accent/20 rounded-organic-xl p-6 lg:p-8 border border-primary/20">
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 z-10 p-2 rounded-organic-sm bg-medium-charcoal/90 hover:bg-light-charcoal transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 border border-light-charcoal/30"
          aria-label={`${isFavorite(recipe.id) ? 'Remove from' : 'Add to'} favorites`}
        >
          <Heart 
            size={20} 
            className={`${
              isFavorite(recipe.id) 
                ? 'text-heart-red fill-heart-red' 
                : 'text-light-text'
            } transition-colors duration-200`}
          />
        </button>
        
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Recipe Image */}
          <div className="relative cursor-pointer" onClick={handleImageClick}>
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
              {recipe.image ? (
                <img 
                  src={recipe.image} 
                  alt={recipe.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/30">
                  <span className="text-4xl lg:text-6xl">🍸</span>
                </div>
              )}
            </div>
          </div>

          {/* Recipe Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl lg:text-3xl font-serif font-medium text-pure-white mb-2">
                {recipe.name}
              </h3>
              {recipe.notes && (
                <p className="text-light-text text-sm lg:text-base leading-relaxed">
                  {recipe.notes}
                </p>
              )}
            </div>

            {/* Recipe Metadata */}
            <div className="flex flex-wrap gap-2">
              {recipe.tags && recipe.tags.map((tag) => (
                <TagBadge 
                  key={tag} 
                  className="bg-primary/20 text-emerald border border-primary/30 text-xs rounded-organic-sm"
                >
                  {tag}
                </TagBadge>
              ))}
            </div>

            {/* Additional Info */}
            <div className="flex items-center gap-4 text-sm text-light-text">
              {recipe.origin && (
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span>{recipe.origin}</span>
                </div>
              )}
            </div>

            {/* Ingredients List */}
            <div>
              <p className="text-sm font-medium text-light-text mb-2">Ingredients:</p>
              <ul className="text-sm text-light-text space-y-1">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-emerald mr-2">•</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <Button 
              onClick={handleRecipeClick}
              variant="secondary"
              className="flex items-center gap-2 px-4 py-2 rounded-organic-sm transition-all duration-300 hover:scale-[1.02] hover:rotate-[-0.3deg]"
            >
              View Full Recipe
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}