import React, { useCallback } from "react";
import { Ingredient } from "@/data/ingredients";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Package, Apple, ChefHat, Beer } from "lucide-react";

interface SecondaryIngredientCarouselProps {
  ingredients: Ingredient[];
  myBar: { [ingredientId: string]: boolean };
  onToggle: (ingredientId: string) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Mixers":
      return <Package className="w-5 h-5" />;
    case "Produce":
      return <Apple className="w-5 h-5" />;
    case "Pantry":
      return <ChefHat className="w-5 h-5" />;
    case "Beers & Ciders":
      return <Beer className="w-5 h-5" />;
    default:
      return <Package className="w-5 h-5" />;
  }
};

export default function SecondaryIngredientCarousel({
  ingredients,
  myBar,
  onToggle
}: SecondaryIngredientCarouselProps) {
  // Optimize toggle callback
  const handleToggle = useCallback((ingredientId: string) => {
    onToggle(ingredientId);
  }, [onToggle]);
  const groupedIngredients = ingredients.reduce((acc, ingredient) => {
    if (!acc[ingredient.category]) {
      acc[ingredient.category] = [];
    }
    acc[ingredient.category].push(ingredient);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-4">
        <h4 className="text-lg font-medium text-pure-white mb-2">
          Additional Ingredients
        </h4>
        <p className="text-light-text text-sm">
          Optional items for more recipe variety and precision
        </p>
      </div>

      {Object.entries(groupedIngredients).map(([category, categoryIngredients]) => (
        <div key={category} className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="text-light-text p-2 rounded-lg bg-secondary-surface border border-border">
              {getCategoryIcon(category)}
            </div>
            <div>
              <h5 className="text-md font-medium text-pure-white">
                {category}
              </h5>
              <span className="text-light-text text-xs">
                {categoryIngredients.filter(ing => myBar[ing.id]).length}/{categoryIngredients.length} selected
              </span>
            </div>
          </div>
          
          <Carousel
            opts={{
              align: "start",
              slidesToScroll: 2,
              breakpoints: {
                "(min-width: 640px)": { slidesToScroll: 3 },
                "(min-width: 768px)": { slidesToScroll: 4 },
                "(min-width: 1024px)": { slidesToScroll: 6 },
              },
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-1">
              {categoryIngredients.map((ingredient) => (
                <CarouselItem 
                  key={ingredient.id} 
                  className="pl-1 basis-[140px] sm:basis-[160px] md:basis-[180px] lg:basis-[160px]"
                >
                  <button
                    onClick={() => handleToggle(ingredient.id)}
                    className={`w-full p-3 rounded-lg border transition-all duration-150 text-left text-sm hover:scale-[1.02] ${
                      myBar[ingredient.id]
                        ? "border-available bg-available/10 text-available"
                        : "border-border bg-secondary-surface hover:border-border-hover text-pure-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate pr-2">
                        {ingredient.name}
                      </span>
                      {myBar[ingredient.id] && (
                        <div className="w-4 h-4 rounded-full bg-available flex items-center justify-center flex-shrink-0">
                          <span className="text-pure-white text-xs font-bold">✓</span>
                        </div>
                      )}
                    </div>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Controls below carousel, left aligned */}
            <div className="flex items-center gap-2 mt-4">
              <CarouselPrevious className="relative left-0 top-0 h-7 w-7 bg-secondary-surface border-border hover:bg-secondary-surface/80 text-light-text hover:text-pure-white" />
              <CarouselNext className="relative left-0 top-0 h-7 w-7 bg-secondary-surface border-border hover:bg-secondary-surface/80 text-light-text hover:text-pure-white" />
            </div>
          </Carousel>
        </div>
      ))}
    </div>
  );
}