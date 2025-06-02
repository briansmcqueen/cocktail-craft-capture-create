
import React from "react";
import { Cocktail } from "@/data/classicCocktails";
import { Heart } from "lucide-react";
import RecipeCard from "./RecipeCard";
import { isFavorite } from "@/utils/favorites";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type FeaturedSectionProps = {
  title: string;
  recipes: Cocktail[];
  onRecipeClick: (recipe: Cocktail) => void;
  onToggleFavorite: (recipe: Cocktail) => void;
};

export default function FeaturedSection({ 
  title, 
  recipes, 
  onRecipeClick, 
  onToggleFavorite 
}: FeaturedSectionProps) {
  return (
    <section>
      <h2 className="text-gray-900 mb-8 tracking-[0.08em] leading-[1.45] uppercase font-bold text-[1rem]">
        {title}
      </h2>
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {recipes.map((recipe) => (
            <CarouselItem key={recipe.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <div className="relative group">
                <div className="relative overflow-hidden rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white shadow-sm hover:shadow-md">
                  <RecipeCard
                    recipe={recipe}
                    onSelect={() => onRecipeClick(recipe)}
                    editable={false}
                  />
                </div>
                
                <div className="absolute top-1 right-3">
                  <button
                    className="p-1 rounded-full hover:scale-110 transition-transform duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(recipe);
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
  );
}
