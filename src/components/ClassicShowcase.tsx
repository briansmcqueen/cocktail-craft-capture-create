import React, { useState, useEffect, useMemo } from "react";
import { classicCocktails, Cocktail } from "@/data/classicCocktails";
import UniversalRecipeCard from "./UniversalRecipeCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAggregatedRatingsBatch, AggregatedRating } from "@/services/ratingsService";

const SHOWCASE_NAMES = [
  "Negroni",
  "Margarita",
  "Daiquiri",
  "Espresso Martini",
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

  return (
    <section>
      <div className="mb-4 md:mb-6">
        <h2 className="text-pure-white tracking-[0.08em] leading-[1.45] uppercase font-bold text-sm md:text-[1rem]">
          Classic Cocktails
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {showcaseRecipes.map((recipe) => (
          <UniversalRecipeCard
            key={recipe.id + recipe.name}
            recipe={recipe}
            ratingData={ratings[recipe.id]}
            hideCreator
            className="h-full"
          />
        ))}
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
