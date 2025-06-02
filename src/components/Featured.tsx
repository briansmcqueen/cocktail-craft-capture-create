import React from "react";
import { Cocktail } from "@/data/classicCocktails";
import RecipeCard from "./RecipeCard";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { getTrendingRecipes, getLikeCount, toggleLike, isLiked } from "@/utils/likes";
import { toggleFavorite, isFavorite } from "@/utils/favorites";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  {
    id: "ice-guide",
    title: "The Art of Ice",
    description: "Different ice types and when to use them for optimal dilution",
    image: "https://images.unsplash.com/photo-1563227812-0ea4c22213d0?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "glassware-guide",
    title: "Essential Glassware",
    description: "Choose the right glass to enhance your cocktail's presentation and taste",
    image: "https://images.unsplash.com/photo-1509669803555-2c4b6ad1748c?auto=format&fit=crop&w=400&q=80",
  },
];

export default function Featured({ recipes, onRecipeClick, onEditRecipe, onShareRecipe, userRecipes }: FeaturedProps) {
  // Get trending recipes based on recent likes
  const trendingRecipes = getTrendingRecipes(recipes);
  
  // Get featured recipes (first 8 from all recipes for better carousel display)
  const featuredRecipes = recipes.slice(0, 8);

  const handleLike = (recipe: Cocktail) => {
    toggleLike(recipe.id);
    window.dispatchEvent(new Event('favorites-update'));
  };

  const handleToggleFavorite = (recipe: Cocktail) => {
    toggleFavorite(recipe.id);
    window.dispatchEvent(new Event('favorites-update'));
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Hero Featured Recipes Carousel */}
      <section>
        <h2 className="text-gray-900 mb-8 tracking-[0.08em] leading-[1.45] uppercase font-bold text-[1rem]">
          Featured Cocktails
        </h2>
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {featuredRecipes.map((recipe) => (
              <CarouselItem key={recipe.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="relative group">
                  <div className="relative overflow-hidden rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white shadow-sm hover:shadow-md">
                    <RecipeCard
                      recipe={recipe}
                      onSelect={() => onRecipeClick(recipe)}
                      editable={false}
                    />
                  </div>
                  
                  {/* Airbnb-style favorite button */}
                  <div className="absolute top-1 right-3">
                    <button
                      className="p-1 rounded-full hover:scale-110 transition-transform duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(recipe);
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center items-center gap-4 mt-6">
            <CarouselPrevious className="relative left-0 top-0 translate-y-0 h-8 w-8 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50" />
            <CarouselNext className="relative right-0 top-0 translate-y-0 h-8 w-8 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50" />
          </div>
        </Carousel>
      </section>

      {/* Trending Section Carousel */}
      <section>
        <h2 className="text-gray-900 mb-8 tracking-[0.08em] leading-[1.45] uppercase font-bold text-[1rem]">
          Trending Now
        </h2>
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {trendingRecipes.map((recipe) => (
              <CarouselItem key={recipe.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="relative group">
                  <div className="relative overflow-hidden rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white shadow-sm hover:shadow-md">
                    <RecipeCard
                      recipe={recipe}
                      onSelect={() => onRecipeClick(recipe)}
                      editable={false}
                    />
                  </div>
                  
                  {/* Airbnb-style favorite button */}
                  <div className="absolute top-1 right-3">
                    <button
                      className="p-1 rounded-full hover:scale-110 transition-transform duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(recipe);
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center items-center gap-4 mt-6">
            <CarouselPrevious className="relative left-0 top-0 translate-y-0 h-8 w-8 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50" />
            <CarouselNext className="relative right-0 top-0 translate-y-0 h-8 w-8 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50" />
          </div>
        </Carousel>
      </section>

      {/* How-To Section Carousel - NYT Cooking Style */}
      <section>
        <h2 className="text-gray-900 mb-8 tracking-[0.08em] leading-[1.45] uppercase font-bold text-[1rem]">
          Essential Techniques
        </h2>
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {howToArticles.map((article) => (
              <CarouselItem key={article.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <article className="group cursor-pointer bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md h-80">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="p-6 flex flex-col justify-between h-32">
                    <h3 className="font-serif font-medium text-gray-900 mb-3 text-lg leading-tight line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                      {article.description}
                    </p>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center items-center gap-4 mt-6">
            <CarouselPrevious className="relative left-0 top-0 translate-y-0 h-8 w-8 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50" />
            <CarouselNext className="relative right-0 top-0 translate-y-0 h-8 w-8 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50" />
          </div>
        </Carousel>
      </section>
    </div>
  );
}
