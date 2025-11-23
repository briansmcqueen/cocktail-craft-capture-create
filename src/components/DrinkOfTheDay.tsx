
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Clock, Users } from "lucide-react";
import { Cocktail } from "@/data/classicCocktails";
import { cn } from "@/lib/utils";
import UniversalRecipeCard from "./UniversalRecipeCard";

type DrinkOfTheDayProps = {
  recipe: Cocktail;
  onRecipeClick: (recipe: Cocktail) => void;
  onShowAuthModal?: () => void;
};

export default function DrinkOfTheDay({ 
  recipe, 
  onRecipeClick, 
  onShowAuthModal 
}: DrinkOfTheDayProps) {
  return (
    <section>
      <div className="mb-4 md:mb-6">
        <h2 className="text-pure-white mb-2 tracking-[0.08em] leading-[1.45] uppercase font-bold text-sm md:text-[1rem]">
          Drink of the Day
        </h2>
        <p className="text-soft-gray text-sm md:text-base leading-relaxed max-w-2xl">
          Start your journey with today's featured cocktail, carefully selected to inspire your next creation.
        </p>
      </div>
      
      <div className="w-full">
        <UniversalRecipeCard
          recipe={recipe}
          onShowAuthModal={onShowAuthModal}
          className="w-full max-w-sm"
        />
      </div>
    </section>
  );
}
