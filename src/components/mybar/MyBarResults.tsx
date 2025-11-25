import React, { useState } from "react";
import { Plus, User, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Cocktail } from "@/data/classicCocktails";
import { Ingredient } from "@/data/ingredients";
import UniversalRecipeCard from "@/components/UniversalRecipeCard";
import BuyIngredientButton from "@/components/BuyIngredientButton";
import WhatToBuyNext from "./WhatToBuyNext";
import QuickAddCarousel from "./QuickAddCarousel";

interface RecommendedIngredient {
  ingredient: Ingredient;
  newRecipesUnlocked: Cocktail[];
  score: number;
}

interface MyBarResultsProps {
  myBarIngredients: string[];
  recipesICanMake: Cocktail[];
  recipesNeedingOneIngredient: (Cocktail & { missingIngredient?: string })[];
  whatToBuyNext: RecommendedIngredient[];
  ingredientMap: { [id: string]: Ingredient };
  onRecipeClick: (recipe: Cocktail) => void;
  onToggleFavorite: (recipe: Cocktail) => void;
  onTagClick: (tag: string) => void;
  onAddIngredient: (ingredientId: string) => void;
  onAddToShoppingList?: (ingredientId: string) => void;
  user: any;
  loading?: boolean;
  allIngredients: Ingredient[];
}

export default function MyBarResults({
  myBarIngredients,
  recipesICanMake,
  recipesNeedingOneIngredient,
  whatToBuyNext,
  ingredientMap,
  onRecipeClick,
  onToggleFavorite,
  onTagClick,
  onAddIngredient,
  onAddToShoppingList,
  user,
  loading = false,
  allIngredients
}: MyBarResultsProps) {
  const [showAllRecipes, setShowAllRecipes] = useState(false);
  
  if (myBarIngredients.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Quick Add Carousel */}
      <QuickAddCarousel 
        allIngredients={allIngredients}
        myBarIngredients={myBarIngredients}
        onAddIngredient={onAddIngredient}
      />
      
      {/* What to Buy Next section */}
      {whatToBuyNext.length > 0 && (
        <div className="mb-6">
          <WhatToBuyNext 
            recommendations={whatToBuyNext}
            onAddIngredient={onAddIngredient}
            onAddToShoppingList={onAddToShoppingList}
            userIngredients={myBarIngredients}
            ingredientMap={new Map(Object.entries(ingredientMap))}
          />
        </div>
      )}
      {/* Recipes You Can Make */}
      {recipesICanMake.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-pure-white mb-4">
            You Can Make ({recipesICanMake.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {(showAllRecipes ? recipesICanMake : recipesICanMake.slice(0, 6)).map((recipe) => (
              <UniversalRecipeCard
                key={recipe.id}
                recipe={recipe}
              />
            ))}
          </div>
          {recipesICanMake.length > 6 && !showAllRecipes && (
            <div className="text-center mt-4">
              <Button
                variant="outline"
                onClick={() => setShowAllRecipes(true)}
                className="text-sm"
              >
                Show more ({recipesICanMake.length - 6} more cocktails)
              </Button>
            </div>
          )}
          {showAllRecipes && recipesICanMake.length > 6 && (
            <div className="text-center mt-4">
              <Button
                variant="outline"
                onClick={() => setShowAllRecipes(false)}
                className="text-sm"
              >
                Show less
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Almost There - Need 1 Ingredient */}
      {recipesNeedingOneIngredient.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-pure-white mb-3 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Almost There ({recipesNeedingOneIngredient.length})
          </h2>
          <Carousel className="w-full" opts={{ align: "start", loop: false }}>
            <CarouselContent className="-ml-2 md:-ml-4">
              {recipesNeedingOneIngredient.map((recipe) => {
                const missingIngredient = ingredientMap[recipe.missingIngredient || ''];
                if (!missingIngredient) return null;
                
                return (
                  <CarouselItem key={recipe.id} className="pl-2 md:pl-4 basis-[280px] md:basis-[320px]">
                  <div className="relative group">
                      <UniversalRecipeCard recipe={recipe} />
                      {/* Missing ingredient badge - Always visible */}
                      <div className="absolute top-2 right-2 bg-golden-amber/90 text-rich-charcoal px-2 py-1 rounded-organic-sm text-xs font-medium flex items-center gap-1">
                        <span className="hidden sm:inline">Need: </span>
                        <span className="line-clamp-1">{missingIngredient.name}</span>
                        {/* Mobile: Always visible add button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddIngredient(recipe.missingIngredient || '');
                          }}
                          className="sm:hidden w-5 h-5 rounded-full bg-rich-charcoal hover:bg-rich-charcoal/80 inline-flex items-center justify-center ml-1"
                          aria-label="Add to bar"
                        >
                          <Plus className="h-3 w-3 text-golden-amber" />
                        </button>
                      </div>
                      {/* Desktop: Hover overlay with buttons */}
                      <div className="hidden sm:flex absolute inset-0 bg-rich-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center rounded-organic-md">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => onAddIngredient(recipe.missingIngredient || '')}
                            className="bg-golden-amber hover:bg-golden-amber/80 text-rich-charcoal font-medium"
                            size="sm"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add to Bar
                          </Button>
                          
                          {/* Buy ingredient button */}
                          <BuyIngredientButton
                            ingredientId={recipe.missingIngredient || ''}
                            ingredient={missingIngredient}
                            userIngredients={myBarIngredients}
                            ingredientMap={new Map(Object.entries(ingredientMap))}
                            variant="secondary"
                            size="sm"
                            showPrice={false}
                            className="bg-accent hover:bg-accent/80 text-pure-white"
                          />
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      )}

      {/* Empty State - Has ingredients but no recipes */}
      {myBarIngredients.length > 0 && recipesICanMake.length === 0 && recipesNeedingOneIngredient.length === 0 && (
        <Card className="p-8 text-center bg-medium-charcoal border-light-charcoal">
          <User className="h-12 w-12 mx-auto mb-4 text-soft-gray" />
          <h3 className="text-lg font-medium text-light-text mb-2">
            Add More Ingredients
          </h3>
          <p className="text-soft-gray">
            You have {myBarIngredients.length} ingredient{myBarIngredients.length !== 1 ? 's' : ''} in your bar. 
            Add a few more to unlock cocktails you can make!
          </p>
        </Card>
      )}
    </div>
  );
}