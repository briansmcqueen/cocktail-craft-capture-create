import React from "react";
import { Plus } from "lucide-react";
import { Ingredient } from "@/data/ingredients";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import whiskeImage from "@/assets/ingredients/whiskey.jpg";
import ginImage from "@/assets/ingredients/gin.jpg";
import vodkaImage from "@/assets/ingredients/vodka.jpg";
import liqueursImage from "@/assets/ingredients/liqueurs.jpg";
import winesImage from "@/assets/ingredients/wines.jpg";

interface QuickAddCarouselProps {
  allIngredients: Ingredient[];
  myBarIngredients: string[];
  onAddIngredient: (ingredientId: string) => void;
}

const getCategoryImage = (category: string, subCategory: string) => {
  switch (category) {
    case "Spirits":
      if (subCategory.toLowerCase().includes("gin")) return ginImage;
      if (subCategory.toLowerCase().includes("vodka")) return vodkaImage;
      return whiskeImage;
    case "Liqueurs":
      return liqueursImage;
    case "Wines & Vermouths":
      return winesImage;
    default:
      return whiskeImage;
  }
};

// Popular ingredients that users commonly need
const popularIngredientIds = [
  "vodka",
  "gin", 
  "whiskey",
  "rum",
  "tequila",
  "triple-sec",
  "lime-juice",
  "lemon-juice",
  "simple-syrup",
  "angostura-bitters",
  "dry-vermouth",
  "sweet-vermouth"
];

export default function QuickAddCarousel({
  allIngredients,
  myBarIngredients,
  onAddIngredient
}: QuickAddCarouselProps) {
  // Filter to popular ingredients not already in bar
  const quickAddIngredients = popularIngredientIds
    .map(id => allIngredients.find(ing => ing.id === id))
    .filter((ing): ing is Ingredient => ing !== undefined && !myBarIngredients.includes(ing.id));

  if (quickAddIngredients.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-pure-white">Quick Add</h3>
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {quickAddIngredients.map((ingredient) => (
            <CarouselItem key={ingredient.id} className="pl-2 md:pl-4 basis-[160px] sm:basis-[180px]">
              <button
                onClick={() => onAddIngredient(ingredient.id)}
                className="relative w-full rounded-organic-md overflow-hidden border border-border bg-card group text-left transition-all hover:scale-105"
              >
                {/* Image */}
                <div
                  className="h-24 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${getCategoryImage(ingredient.category, ingredient.subCategory)})` }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                
                {/* Add Button */}
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-primary/80 border border-primary flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Plus className="h-4 w-4 text-pure-white" />
                </div>

                {/* Content */}
                <div className="relative p-3">
                  <h4 className="text-sm font-medium text-pure-white leading-tight line-clamp-2">
                    {ingredient.name}
                  </h4>
                  <p className="text-xs text-soft-gray mt-1">
                    {ingredient.subCategory}
                  </p>
                </div>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
}
