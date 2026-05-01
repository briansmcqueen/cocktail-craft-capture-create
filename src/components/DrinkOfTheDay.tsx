import React from "react";
import { Button } from "@/components/ui/button";
import { Cocktail } from "@/data/classicCocktails";
import { useNavigate } from "react-router-dom";
import { getRecipeUrl } from "@/utils/slugUtils";
import { Flame, GlassWater, Clock } from "lucide-react";

type DrinkOfTheDayProps = {
  recipe: Cocktail;
  onRecipeClick: (recipe: Cocktail) => void;
  onShowAuthModal?: () => void;
};

export default function DrinkOfTheDay({ recipe, onRecipeClick }: DrinkOfTheDayProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    const url = getRecipeUrl(recipe);
    navigate(url);
  };

  const firstSentence = recipe.notes
    ? recipe.notes.split(/[.!?]/)[0]?.trim() + '.'
    : `A classic cocktail featuring ${recipe.ingredients.slice(0, 2).map(i => i.replace(/^\d+[\s\w]*\s/, '').split(' ')[0]).join(' and ')}.`;

  return (
    <section>
      <div
        role="link"
        tabIndex={0}
        aria-label={`Drink of the Day: ${recipe.name}. View recipe.`}
        className="relative w-full rounded-organic-lg overflow-hidden cursor-pointer group"
        style={{ minHeight: '340px' }}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {/* Background image */}
        <img
          src={recipe.image}
          alt={recipe.name}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/15" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-10" style={{ minHeight: '340px' }}>
          <span className="text-xs uppercase tracking-[0.15em] text-emerald-green font-semibold mb-2">
            Drink of the Day
          </span>

          <h2 className="text-2xl md:text-4xl font-bold text-pure-white mb-2">
            {recipe.name}
          </h2>

          <p className="text-light-text text-sm md:text-base max-w-xl mb-4 line-clamp-2">
            {firstSentence}
          </p>

          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-3 mb-5 text-xs md:text-sm text-soft-gray">
            {recipe.technique && (
              <span className="flex items-center gap-1.5">
                <Flame size={14} className="text-primary/70" />
                {recipe.technique.charAt(0).toUpperCase() + recipe.technique.slice(1)}
              </span>
            )}
            {recipe.glassType && (
              <span className="flex items-center gap-1.5">
                <GlassWater size={14} className="text-primary/70" />
                {recipe.glassType}
              </span>
            )}
            {recipe.prepTime && (
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-primary/70" />
                {recipe.prepTime}
              </span>
            )}
          </div>

          <div>
            <Button
              size="lg"
              className="rounded-organic-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              View Recipe
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
