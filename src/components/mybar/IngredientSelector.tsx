import React, { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Ingredient } from "@/data/ingredients";
import AddCustomIngredient from "@/components/AddCustomIngredient";
import { getUserCustomIngredients, CustomIngredient } from "@/services/customIngredientsService";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

interface IngredientSelectorProps {
  allIngredients: Ingredient[];
  myBar: { [ingredientId: string]: boolean };
  myBarIngredients: string[];
  ingredientMap: { [id: string]: Ingredient };
  toggleIngredient: (ingredientId: string) => void;
  user: any;
  setCustomIngredients: (ingredients: CustomIngredient[]) => void;
}

export default function IngredientSelector({
  allIngredients,
  myBar,
  myBarIngredients,
  ingredientMap,
  toggleIngredient,
  user,
  setCustomIngredients
}: IngredientSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("recipes");

  // Filter ingredients for display (including custom ones)
  const filteredIngredients = useMemo(() => {
    let filtered = allIngredients;

    if (selectedCategory !== "recipes") {
      filtered = filtered.filter(ing => ing.category.toLowerCase() === selectedCategory);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(ing => 
        ing.name.toLowerCase().includes(searchLower) ||
        ing.aliases.some(alias => alias.toLowerCase().includes(searchLower)) ||
        ing.description.toLowerCase().includes(searchLower)
      );
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedCategory, searchTerm, allIngredients]);

  const categories = ["recipes", "liqueurs", "mixers", "pantry", "produce", "spirits", "wines & vermouths"];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <AddCustomIngredient onIngredientAdded={() => {
          // Trigger reload of custom ingredients
          if (user) {
            getUserCustomIngredients().then(setCustomIngredients);
          }
        }} />
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-colors min-h-[44px] sm:min-h-auto sm:px-3 sm:py-1.5 sm:text-sm capitalize",
                selectedCategory === category
                  ? "bg-accent text-accent-foreground"
                  : "bg-card border border-border text-foreground hover:border-accent hover:text-foreground"
              )}
              aria-label={`Filter by ${category === "recipes" ? "all ingredients" : category}`}
            >
              {category === "recipes" ? "All" : category === "wines & vermouths" ? "Wines" : category}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Ingredients Pills */}
      {myBarIngredients.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-light-text">My Bar ({myBarIngredients.length} ingredients)</h3>
          {/* Mobile: Horizontal Carousel */}
          <div className="md:hidden">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2">
                {[...myBarIngredients]
                  .sort((a, b) => {
                    const ingredientA = ingredientMap[a];
                    const ingredientB = ingredientMap[b];
                    if (!ingredientA || !ingredientB) return 0;
                    return ingredientA.name.localeCompare(ingredientB.name);
                  })
                  .map(ingredientId => {
                    const ingredient = ingredientMap[ingredientId];
                    if (!ingredient) return null;
                    return (
                      <CarouselItem key={ingredientId} className="pl-2 basis-auto">
                        <span
                          className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-organic-sm bg-primary/20 text-emerald border border-primary/30 cursor-pointer hover:bg-primary/30 transition-colors whitespace-nowrap"
                          onClick={() => toggleIngredient(ingredientId)}
                        >
                          {ingredient.name}
                          <X className="ml-1 h-3 w-3" />
                        </span>
                      </CarouselItem>
                    );
                  })}
              </CarouselContent>
            </Carousel>
          </div>
          {/* Desktop: Flex Wrap */}
          <div className="hidden md:flex md:flex-wrap md:gap-2">
            {[...myBarIngredients]
              .sort((a, b) => {
                const ingredientA = ingredientMap[a];
                const ingredientB = ingredientMap[b];
                if (!ingredientA || !ingredientB) return 0;
                return ingredientA.name.localeCompare(ingredientB.name);
              })
              .map(ingredientId => {
                const ingredient = ingredientMap[ingredientId];
                if (!ingredient) return null;
                return (
                  <span
                    key={ingredientId}
                    className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-organic-sm bg-primary/20 text-emerald border border-primary/30 cursor-pointer hover:bg-primary/30 transition-colors"
                    onClick={() => toggleIngredient(ingredientId)}
                  >
                    {ingredient.name}
                    <X className="ml-1 h-3 w-3" />
                  </span>
                );
              })}
          </div>
        </div>
      )}

      {/* Ingredient List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
        {filteredIngredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className={cn(
              "flex items-center justify-between p-3 rounded-organic-sm border cursor-pointer transition-all hover:shadow-sm",
              myBar[ingredient.id] 
                ? 'bg-primary/20 border-primary/30' 
                : 'bg-medium-charcoal border-light-charcoal hover:border-primary/50 hover:bg-light-charcoal'
            )}
            onClick={() => toggleIngredient(ingredient.id)}
          >
            <div className="flex-1">
              <div className="font-medium text-sm flex items-center gap-2 text-light-text">
                {ingredient.name}
                {ingredient.isCustom && (
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-organic-sm bg-primary/20 text-emerald border border-primary/30">Custom</span>
                )}
              </div>
              <div className="text-xs text-soft-gray">{ingredient.subCategory}</div>
            </div>
            <div className="ml-2">
              {myBar[ingredient.id] ? (
                <div className="w-4 h-4 bg-emerald rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
              ) : (
                <div className="w-4 h-4 border-2 border-soft-gray rounded-full" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}