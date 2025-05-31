
import React from "react";
import { Cocktail } from "@/data/classicCocktails";
import RecipeCard from "./RecipeCard";
import { TrendingUp, BookOpen, ThumbsUp, Heart, Share } from "lucide-react";
import { Button } from "./ui/button";
import { getTrendingRecipes, getLikeCount, addLike } from "@/utils/likes";
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
    addLike(recipe.id);
  };

  const handleToggleFavorite = (recipe: Cocktail) => {
    toggleFavorite(recipe.id);
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Hero Featured Recipes Carousel */}
      <section>
        <h2 className="text-3xl lg:text-4xl font-serif font-normal text-gray-900 mb-8 tracking-wide">
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
                  
                  {/* Action buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className={`p-2 bg-white/90 hover:bg-white border border-gray-200 shadow-sm backdrop-blur-sm rounded-full transition-colors ${
                        isFavorite(recipe.id) ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                      }`}
                      onClick={() => handleToggleFavorite(recipe)}
                    >
                      <Heart size={14} fill={isFavorite(recipe.id) ? 'currentColor' : 'none'} />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className={`p-2 bg-white/90 hover:bg-white border border-gray-200 shadow-sm backdrop-blur-sm rounded-full transition-colors ${
                        getLikeCount(recipe.id) > 0 ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                      }`}
                      onClick={() => handleLike(recipe)}
                    >
                      <ThumbsUp size={14} fill={getLikeCount(recipe.id) > 0 ? 'currentColor' : 'none'} />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="p-2 bg-white/90 hover:bg-white text-red-600 border border-gray-200 shadow-sm backdrop-blur-sm rounded-full"
                      onClick={() => onShareRecipe(recipe)}
                    >
                      <Share size={14} />
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex" />
          <CarouselNext className="hidden lg:flex" />
        </Carousel>
      </section>

      {/* Trending Section Carousel */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="text-red-600" size={28} />
          <h2 className="text-2xl lg:text-3xl font-serif font-normal text-gray-900 tracking-wide">
            Trending Now
          </h2>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {trendingRecipes.map((recipe) => (
              <CarouselItem key={recipe.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/5">
                <div className="relative group">
                  <div className="relative overflow-hidden rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white shadow-sm hover:shadow-md">
                    <RecipeCard
                      recipe={recipe}
                      onSelect={() => onRecipeClick(recipe)}
                      editable={false}
                    />
                  </div>
                  
                  {/* Action buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className={`p-2 bg-white/90 hover:bg-white border border-gray-200 shadow-sm backdrop-blur-sm rounded-full transition-colors ${
                        isFavorite(recipe.id) ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                      }`}
                      onClick={() => handleToggleFavorite(recipe)}
                    >
                      <Heart size={14} fill={isFavorite(recipe.id) ? 'currentColor' : 'none'} />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className={`p-2 bg-white/90 hover:bg-white border border-gray-200 shadow-sm backdrop-blur-sm rounded-full transition-colors ${
                        getLikeCount(recipe.id) > 0 ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                      }`}
                      onClick={() => handleLike(recipe)}
                    >
                      <ThumbsUp size={14} fill={getLikeCount(recipe.id) > 0 ? 'currentColor' : 'none'} />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="p-2 bg-white/90 hover:bg-white text-red-600 border border-gray-200 shadow-sm backdrop-blur-sm rounded-full"
                      onClick={() => onShareRecipe(recipe)}
                    >
                      <Share size={14} />
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex" />
          <CarouselNext className="hidden lg:flex" />
        </Carousel>
      </section>

      {/* How-To Section Carousel - NYT Cooking Style */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="text-red-600" size={28} />
          <h2 className="text-2xl lg:text-3xl font-serif font-normal text-gray-900 tracking-wide">
            Essential Techniques
          </h2>
        </div>
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
                <article className="group cursor-pointer bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif font-medium text-gray-900 mb-3 text-lg leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {article.description}
                    </p>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex" />
          <CarouselNext className="hidden lg:flex" />
        </Carousel>
      </section>
    </div>
  );
}
