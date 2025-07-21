
import React from "react";
import { Cocktail } from "@/data/classicCocktails";
import RecipeCardWithFavorite from "./RecipeCardWithFavorite";
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
  onShowAuthModal?: () => void;
};

export default function FeaturedSection({ 
  title, 
  recipes, 
  onRecipeClick,
  onShowAuthModal
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
          {recipes.map((recipe, index) => (
            <CarouselItem key={`${recipe.id}-${index}`} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <RecipeCardWithFavorite
                recipe={recipe}
                onRecipeClick={onRecipeClick}
                onShowAuthModal={onShowAuthModal}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center items-center gap-4 mt-6">
          <CarouselPrevious className="relative left-0 top-0 translate-y-0 h-8 w-8 border cursor-pointer transition-all hover:shadow-sm bg-card border-border hover:border-accent/50 hover:bg-accent/5 [&>svg]:text-gray-600" />
          <CarouselNext className="relative right-0 top-0 translate-y-0 h-8 w-8 border cursor-pointer transition-all hover:shadow-sm bg-card border-border hover:border-accent/50 hover:bg-accent/5 [&>svg]:text-gray-600" />
        </div>
      </Carousel>
    </section>
  );
}
