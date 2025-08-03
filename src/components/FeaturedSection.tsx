
import React from "react";
import { Cocktail } from "@/data/classicCocktails";
import UniversalRecipeCard from "./UniversalRecipeCard";
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
      <h2 className="text-pure-white mb-6 md:mb-8 tracking-[0.08em] leading-[1.45] uppercase font-bold text-sm md:text-[1rem]">
        {title}
      </h2>
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 lg:-ml-4">
          {recipes.map((recipe, index) => (
            <CarouselItem key={`${recipe.id}-${index}`} className="pl-2 lg:pl-4 basis-[85%] sm:basis-1/2 lg:basis-[320px] xl:basis-[280px]">
              <UniversalRecipeCard
                recipe={recipe}
                onShowAuthModal={onShowAuthModal}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center gap-4 mt-4 md:mt-6">
          <CarouselPrevious className="relative left-0 top-0 translate-y-0 h-8 w-8 md:h-10 md:w-10 border cursor-pointer transition-all hover:shadow-sm bg-medium-charcoal border-light-charcoal hover:border-primary/50 hover:bg-light-charcoal [&>svg]:text-light-text hover:[&>svg]:text-pure-white rounded-organic-sm" />
          <CarouselNext className="relative right-0 top-0 translate-y-0 h-8 w-8 md:h-10 md:w-10 border cursor-pointer transition-all hover:shadow-sm bg-medium-charcoal border-light-charcoal hover:border-primary/50 hover:bg-light-charcoal [&>svg]:text-light-text hover:[&>svg]:text-pure-white rounded-organic-sm" />
        </div>
      </Carousel>
    </section>
  );
}
