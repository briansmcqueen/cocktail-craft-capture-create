import React, { useState, useEffect, useMemo } from "react";
import { classicCocktails, Cocktail } from "@/data/classicCocktails";
import UniversalRecipeCard from "./UniversalRecipeCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAggregatedRatingsBatch, AggregatedRating } from "@/services/ratingsService";
import { useBatchShareCounts } from "@/hooks/useBatchShareCounts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Lead with Fraga-photographed cocktails, then fill with other classics
const SHOWCASE_NAMES = [
  "Negroni",
  "Espresso Martini",
  "Daiquiri",
  "Martini",
  "Boulevardier",
  "Clover Club",
  "Americano",
  "Dirty Martini",
  "Vesper",
  "Margarita",
  "Manhattan",
  "Mojito",
  "Cosmopolitan",
  "Paloma",
];

export default function ClassicShowcase() {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState<Record<string, AggregatedRating>>({});

  const showcaseRecipes = useMemo(() => {
    const found: Cocktail[] = [];
    const usedIds = new Set<string>();
    for (const name of SHOWCASE_NAMES) {
      const recipe = classicCocktails.find(
        (r) => r.name === name && !usedIds.has(r.id)
      );
      if (recipe) {
        found.push(recipe);
        usedIds.add(recipe.id);
      }
    }
    return found;
  }, []);

  useEffect(() => {
    const ids = showcaseRecipes.map((r) => r.id);
    if (ids.length > 0) {
      getAggregatedRatingsBatch(ids).then(setRatings);
    }
  }, [showcaseRecipes]);

  const shareCounts = useBatchShareCounts(showcaseRecipes.map((r) => r.id));

  return (
    <section>
      <div className="mb-4 md:mb-6">
        <h2 className="text-pure-white tracking-[0.08em] leading-[1.45] uppercase font-bold text-sm md:text-[1rem]">
          Classic Cocktails
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
            {showcaseRecipes.map((recipe, idx) => (
              <CarouselItem key={recipe.id + recipe.name} className="pl-4 basis-[75%] sm:basis-1/2 lg:basis-1/3">
                <UniversalRecipeCard
                  recipe={recipe}
                  ratingData={ratings[recipe.id]}
                  hideCreator
                  className="h-full"
                  priority={idx === 0}
                  shareCount={shareCounts[recipe.id] ?? 0}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
      </div>

      <div className="mt-4 text-center">
        <Button
          variant="ghost"
          className="text-emerald-green hover:text-emerald-green/80 gap-1"
          onClick={() => navigate('/recipes')}
        >
          Browse all {classicCocktails.length}+ recipes <ArrowRight size={14} />
        </Button>
      </div>
    </section>
  );
}
