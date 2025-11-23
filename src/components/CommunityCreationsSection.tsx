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

type CommunityCreationsSectionProps = {
  title: string;
  description?: string;
  recipes: Cocktail[];
  onShowAuthModal?: () => void;
};

export default function CommunityCreationsSection({
  title,
  description,
  recipes,
  onShowAuthModal,
}: CommunityCreationsSectionProps) {
  if (recipes.length === 0) {
    return null;
  }

  return (
    <section className="mb-8 md:mb-12">
      <div className="mb-4 md:mb-6">
        <h2 className="text-pure-white mb-2 tracking-[0.08em] leading-[1.45] uppercase font-bold text-sm md:text-[1rem]">
          {title}
        </h2>
        {description && (
          <p className="text-soft-gray text-sm md:text-base leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>
      
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {recipes.map((recipe) => (
              <CarouselItem key={recipe.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <UniversalRecipeCard
                  recipe={recipe}
                  onShowAuthModal={onShowAuthModal}
                  className="h-full"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
      </div>
    </section>
  );
}
