
import React from "react";
import { Cocktail } from "@/data/classicCocktails";
import RecipeCard from "./RecipeCard";
import { TrendingUp, BookOpen, ThumbsUp, Heart, Share } from "lucide-react";
import { Button } from "./ui/button";
import { getTrendingRecipes, getLikeCount, addLike } from "@/utils/likes";
import { toggleFavorite, isFavorite } from "@/utils/favorites";
import { toast } from "@/hooks/use-toast";

type FeaturedProps = {
  recipes: Cocktail[];
  onRecipeClick: (recipe: Cocktail) => void;
  onEditRecipe?: (recipe: Cocktail) => void;
  onShareRecipe: (recipe: Cocktail) => void;
  userRecipes: Cocktail[];
};

const howToArticles = [
  {
    id: "simple-syrup",
    title: "How to Make Simple Syrup",
    description: "Master the foundation of countless cocktails with this essential technique",
    image: "https://images.unsplash.com/photo-1544145428-7a4b7abd3d2e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "shaking-technique",
    title: "Perfect Shaking Technique",
    description: "Learn the proper form and timing for shaking cocktails like a pro",
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "stirring-vs-shaking",
    title: "When to Stir vs. Shake",
    description: "Understanding the science behind mixing methods for optimal results",
    image: "https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "garnish-guide",
    title: "Essential Garnish Guide",
    description: "Elevate your cocktails with proper citrus twists, herbs, and more",
    image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=400&q=80",
  },
];

export default function Featured({ recipes, onRecipeClick, onEditRecipe, onShareRecipe, userRecipes }: FeaturedProps) {
  // Get trending recipes based on recent likes
  const trendingRecipes = getTrendingRecipes(recipes);
  
  // Get featured recipes (first 4 from all recipes)
  const featuredRecipes = recipes.slice(0, 4);

  const handleLike = (recipe: Cocktail) => {
    const newCount = addLike(recipe.id);
    toast({ 
      title: "Recipe liked!", 
      description: `${recipe.name} now has ${newCount} like${newCount === 1 ? '' : 's'}` 
    });
  };

  const handleToggleFavorite = (recipe: Cocktail) => {
    const added = toggleFavorite(recipe.id);
    toast({ 
      title: added ? "Added to favorites!" : "Removed from favorites",
      description: recipe.name 
    });
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Hero Featured Recipes */}
      <section>
        <h2 className="text-3xl lg:text-4xl font-display font-light text-gray-900 mb-8 tracking-wide">
          Featured Cocktails
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredRecipes.map((recipe) => (
            <div key={recipe.id} className="relative group">
              <div className="relative overflow-hidden rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white shadow-sm hover:shadow-md">
                <RecipeCard
                  recipe={recipe}
                  onSelect={() => onRecipeClick(recipe)}
                  editable={userRecipes.find((ur) => ur.id === recipe.id) !== undefined}
                  onEdit={
                    userRecipes.find((ur) => ur.id === recipe.id) !== undefined && onEditRecipe
                      ? () => onEditRecipe(recipe)
                      : undefined
                  }
                />
              </div>
              
              {/* Action buttons */}
              <div className="absolute top-3 right-3 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className={`p-2 bg-white/90 hover:bg-white border border-gray-200 shadow-sm backdrop-blur-sm rounded-full ${
                    isFavorite(recipe.id) ? 'text-orange-600' : 'text-gray-500 hover:text-orange-600'
                  }`}
                  onClick={() => handleToggleFavorite(recipe)}
                >
                  <Heart size={14} fill={isFavorite(recipe.id) ? 'currentColor' : 'none'} />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="p-2 bg-white/90 hover:bg-white text-orange-600 border border-gray-200 shadow-sm backdrop-blur-sm rounded-full flex items-center gap-1"
                  onClick={() => handleLike(recipe)}
                >
                  <ThumbsUp size={14} />
                  <span className="text-xs">{getLikeCount(recipe.id)}</span>
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="p-2 bg-white/90 hover:bg-white text-orange-600 border border-gray-200 shadow-sm backdrop-blur-sm rounded-full"
                  onClick={() => onShareRecipe(recipe)}
                >
                  <Share size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="text-orange-600" size={28} />
          <h2 className="text-2xl lg:text-3xl font-display font-light text-gray-900 tracking-wide">
            Trending Now
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {trendingRecipes.map((recipe) => (
            <div key={recipe.id} className="relative group">
              <div className="relative overflow-hidden rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white shadow-sm hover:shadow-md">
                <RecipeCard
                  recipe={recipe}
                  onSelect={() => onRecipeClick(recipe)}
                  editable={userRecipes.find((ur) => ur.id === recipe.id) !== undefined}
                  onEdit={
                    userRecipes.find((ur) => ur.id === recipe.id) !== undefined && onEditRecipe
                      ? () => onEditRecipe(recipe)
                      : undefined
                  }
                />
              </div>
              
              {/* Action buttons */}
              <div className="absolute top-3 right-3 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className={`p-2 bg-white/90 hover:bg-white border border-gray-200 shadow-sm backdrop-blur-sm rounded-full ${
                    isFavorite(recipe.id) ? 'text-orange-600' : 'text-gray-500 hover:text-orange-600'
                  }`}
                  onClick={() => handleToggleFavorite(recipe)}
                >
                  <Heart size={14} fill={isFavorite(recipe.id) ? 'currentColor' : 'none'} />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="p-2 bg-white/90 hover:bg-white text-orange-600 border border-gray-200 shadow-sm backdrop-blur-sm rounded-full flex items-center gap-1"
                  onClick={() => handleLike(recipe)}
                >
                  <ThumbsUp size={14} />
                  <span className="text-xs">{getLikeCount(recipe.id)}</span>
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="p-2 bg-white/90 hover:bg-white text-orange-600 border border-gray-200 shadow-sm backdrop-blur-sm rounded-full"
                  onClick={() => onShareRecipe(recipe)}
                >
                  <Share size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How-To Section - NYT Cooking Style */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="text-orange-600" size={28} />
          <h2 className="text-2xl lg:text-3xl font-display font-light text-gray-900 tracking-wide">
            Essential Techniques
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {howToArticles.map((article) => (
            <article
              key={article.id}
              className="group cursor-pointer bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-display font-medium text-gray-900 mb-3 text-lg leading-tight">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {article.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
