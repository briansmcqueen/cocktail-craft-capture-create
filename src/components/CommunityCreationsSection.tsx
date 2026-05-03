import React, { useState, useEffect } from "react";
import { Cocktail } from "@/data/classicCocktails";
import UniversalRecipeCard from "./UniversalRecipeCard";
import { getAggregatedRatingsBatch, AggregatedRating } from "@/services/ratingsService";
import { useBatchShareCounts } from "@/hooks/useBatchShareCounts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type CommunityCreationsSectionProps = {
  title: string;
  recipes: Cocktail[];
  onShowAuthModal?: () => void;
};

export default function CommunityCreationsSection({
  title,
  recipes,
  onShowAuthModal,
}: CommunityCreationsSectionProps) {
  const [ratings, setRatings] = useState<Record<string, AggregatedRating>>({});

  useEffect(() => {
    const ids = recipes.map((r) => r.id);
    if (ids.length > 0) {
      getAggregatedRatingsBatch(ids).then(setRatings);
    }
  }, [recipes]);

  const shareCounts = useBatchShareCounts(recipes.map((r) => r.id));

  if (recipes.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-4 md:mb-6">
        <h2 className="text-pure-white mb-2 tracking-[0.08em] leading-[1.45] uppercase font-bold text-sm md:text-[1rem]">
          {title}
        </h2>
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
                  ratingData={ratings[recipe.id]}
                  onShowAuthModal={onShowAuthModal}
                  className="h-full"
                  shareCount={shareCounts[recipe.id] ?? 0}
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
