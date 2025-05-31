
import React from "react";
import { Cocktail } from "@/data/classicCocktails";
import RecipeCard from "./RecipeCard";
import { TrendingUp, BookOpen } from "lucide-react";

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
    description: "Master the foundation of countless cocktails",
    image: "https://images.unsplash.com/photo-1544145428-7a4b7abd3d2e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "shaking-technique",
    title: "Perfect Shaking Technique",
    description: "Learn when and how to shake for optimal results",
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "stirring-vs-shaking",
    title: "Stirring vs. Shaking",
    description: "Know when to use each mixing method",
    image: "https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "garnish-guide",
    title: "Essential Garnish Guide",
    description: "Elevate your cocktails with proper garnishes",
    image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=400&q=80",
  },
];

export default function Featured({ recipes, onRecipeClick, onEditRecipe, onShareRecipe, userRecipes }: FeaturedProps) {
  // Get trending recipes (first 6 from all recipes)
  const trendingRecipes = recipes.slice(0, 6);
  
  // Get featured recipes (next 4)
  const featuredRecipes = recipes.slice(6, 10);

  return (
    <div className="space-y-12">
      {/* Hero Featured Recipes */}
      <section>
        <h2 className="text-3xl font-display font-bold text-red-400 mb-6 neon-text">
          Featured Cocktails
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {featuredRecipes.map((recipe) => (
            <div key={recipe.id} className="relative group">
              <div className="relative overflow-hidden rounded-lg border border-red-500/20 hover:border-red-400/40 transition-all duration-300">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="text-red-400" size={24} />
          <h2 className="text-2xl font-display font-bold text-red-400">
            Trending Now
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6">
          {trendingRecipes.map((recipe) => (
            <div key={recipe.id} className="relative group">
              <div className="relative overflow-hidden rounded-lg border border-red-500/20 hover:border-red-400/40 transition-all duration-300">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How-To Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="text-red-400" size={24} />
          <h2 className="text-2xl font-display font-bold text-red-400">
            How-To Guides
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {howToArticles.map((article) => (
            <div
              key={article.id}
              className="group cursor-pointer bg-gray-900/50 rounded-lg border border-red-500/20 hover:border-red-400/40 transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-32 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-red-300 mb-2 text-sm">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2">
                  {article.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
