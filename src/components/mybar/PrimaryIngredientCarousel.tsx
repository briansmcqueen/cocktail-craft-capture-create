import React, { useCallback } from "react";
import { Ingredient } from "@/data/ingredients";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Wine, Zap, Sparkles } from "lucide-react";
import whiskeImage from "@/assets/ingredients/whiskey.jpg";
import ginImage from "@/assets/ingredients/gin.jpg";
import vodkaImage from "@/assets/ingredients/vodka.jpg";
import liqueursImage from "@/assets/ingredients/liqueurs.jpg";
import winesImage from "@/assets/ingredients/wines.jpg";

interface PrimaryIngredientCarouselProps {
  ingredients: Ingredient[];
  myBar: { [ingredientId: string]: boolean };
  onToggle: (ingredientId: string) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Spirits":
      return <Zap className="w-6 h-6" />;
    case "Liqueurs":
      return <Sparkles className="w-6 h-6" />;
    case "Wines & Vermouths":
      return <Wine className="w-6 h-6" />;
    default:
      return <Zap className="w-6 h-6" />;
  }
};

const getCategoryImage = (category: string, subCategory: string) => {
  switch (category) {
    case "Spirits":
      if (subCategory.toLowerCase().includes("gin")) return ginImage;
      if (subCategory.toLowerCase().includes("vodka")) return vodkaImage;
      return whiskeImage; // Default for whiskey and other spirits
    case "Liqueurs":
      return liqueursImage;
    case "Wines & Vermouths":
      return winesImage;
    default:
      return whiskeImage;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Spirits":
      return "from-available/20 to-available/5 border-available/30";
    case "Liqueurs":
      return "from-golden/20 to-golden/5 border-golden/30";
    case "Wines & Vermouths":
      return "from-copper/20 to-copper/5 border-copper/30";
    default:
      return "from-available/20 to-available/5 border-available/30";
  }
};

export default function PrimaryIngredientCarousel({
  ingredients,
  myBar,
  onToggle
}: PrimaryIngredientCarouselProps) {
  // Optimize toggle callback to prevent unnecessary re-renders
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
    <div className="space-y-8">
      {Object.entries(groupedIngredients).map(([category, categoryIngredients]) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className={`bg-gradient-to-br ${getCategoryColor(category)} p-3 rounded-lg border`}>
              {getCategoryIcon(category)}
            </div>
            <div>
              <h4 className="text-xl font-semibold text-pure-white">
                {category}
              </h4>
              <p className="text-light-text text-sm">
                {categoryIngredients.filter(ing => myBar[ing.id]).length}/{categoryIngredients.length} selected
              </p>
            </div>
          </div>
          
          <Carousel
            opts={{
              align: "start",
              slidesToScroll: 1,
              breakpoints: {
                "(min-width: 768px)": { slidesToScroll: 2 },
                "(min-width: 1024px)": { slidesToScroll: 3 },
              },
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {categoryIngredients.map((ingredient) => (
                <CarouselItem 
                  key={ingredient.id} 
                  className="pl-2 md:pl-4 basis-[280px] sm:basis-[300px] md:basis-[320px] lg:basis-[280px] xl:basis-[300px]"
                >
                  <button
                    onClick={() => handleToggle(ingredient.id)}
                    className={`group relative w-full h-48 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-[1.02] ${
                      myBar[ingredient.id]
                        ? `border-available shadow-lg shadow-available/20 ring-1 ring-available/30`
                        : "border-border hover:border-border-hover"
                    }`}
                  >
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-200 group-hover:scale-105"
                      style={{ 
                        backgroundImage: `url(${getCategoryImage(category, ingredient.subCategory)})`,
                      }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${
                      myBar[ingredient.id] 
                        ? "from-available/80 via-available/20 to-transparent" 
                        : "from-secondary-surface/90 via-secondary-surface/40 to-transparent"
                    } transition-all duration-200`} />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-end">
                      <div className="space-y-1">
                        <h5 className="font-semibold text-pure-white text-sm leading-tight">
                          {ingredient.name}
                        </h5>
                        <p className="text-xs text-pure-white/80">
                          {ingredient.subCategory}
                        </p>
                      </div>
                      
                      {/* Selection Indicator */}
                      {myBar[ingredient.id] && (
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-available flex items-center justify-center shadow-lg">
                          <span className="text-pure-white text-sm font-bold">✓</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-pure-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Controls below carousel, left aligned */}
            <div className="flex items-center gap-2 mt-2">
              <CarouselPrevious className="relative left-0 top-0 h-8 w-8 bg-secondary-surface border-border hover:bg-secondary-surface/80 text-light-text hover:text-pure-white" />
              <CarouselNext className="relative left-0 top-0 h-8 w-8 bg-secondary-surface border-border hover:bg-secondary-surface/80 text-light-text hover:text-pure-white" />
            </div>
          </Carousel>
        </div>
      ))}
    </div>
  );
}