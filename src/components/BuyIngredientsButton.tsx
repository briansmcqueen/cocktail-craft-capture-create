import React from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAffiliateCart } from "@/hooks/useAffiliateCart";
import { Cocktail } from "@/data/classicCocktails";
import { Ingredient } from "@/data/ingredients";
import { formatPrice } from "@/services/affiliateService";

interface BuyIngredientsButtonProps {
  recipe: Cocktail;
  userIngredients: string[];
  ingredientMap: Map<string, Ingredient>;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  showEstimate?: boolean;
  className?: string;
}

export default function BuyIngredientsButton({
  recipe,
  userIngredients,
  ingredientMap,
  variant = "default",
  size = "default",
  showEstimate = true,
  className = ""
}: BuyIngredientsButtonProps) {
  const { 
    estimatedCart, 
    loading, 
    buildCartForRecipe, 
    buyIngredients,
    selectedRetailer
  } = useAffiliateCart();

  const handleBuildCart = async () => {
    await buildCartForRecipe(recipe, userIngredients, ingredientMap);
  };

  const handleBuyNow = async () => {
    if (estimatedCart) {
      await buyIngredients();
    } else {
      // Build cart first, then buy
      await buildCartForRecipe(recipe, userIngredients, ingredientMap);
    }
  };

  // Calculate missing ingredients count
  const recipeIngredientIds = recipe.ingredients.map(ing => {
    for (const [id, ingredient] of ingredientMap) {
      if (ingredient.name.toLowerCase() === ing.toLowerCase().replace(/^\d+(\.\d+)?\s*(oz|ml|dash|splash|drops?)\s*/i, '').trim()) {
        return id;
      }
    }
    return null;
  }).filter(Boolean) as string[];

  const missingIngredientsCount = recipeIngredientIds.filter(id => !userIngredients.includes(id)).length;

  if (missingIngredientsCount === 0) {
    return null; // User has all ingredients
  }

  return (
    <div className="space-y-2">
      {!estimatedCart ? (
        <Button
          onClick={handleBuildCart}
          variant={variant}
          size={size}
          disabled={loading}
          className={`gap-2 ${className}`}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShoppingCart className="h-4 w-4" />
          )}
          {loading ? "Building Cart..." : "Buy Ingredients"}
          {showEstimate && !loading && (
            <Badge variant="secondary" className="ml-1">
              {missingIngredientsCount} missing
            </Badge>
          )}
        </Button>
      ) : (
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleBuyNow}
            variant={variant}
            size={size}
            disabled={loading}
            className={`gap-2 ${className}`}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
            {loading ? "Processing..." : `Buy at ${selectedRetailer?.name}`}
            {showEstimate && (
              <Badge variant="secondary" className="ml-1">
                {formatPrice(estimatedCart.estimated_total_cents)}
              </Badge>
            )}
          </Button>
          
          {showEstimate && (
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(estimatedCart.subtotal_cents)}</span>
              </div>
              <div className="flex justify-between">
                <span>Est. Tax:</span>
                <span>{formatPrice(estimatedCart.estimated_tax_cents)}</span>
              </div>
              {estimatedCart.estimated_delivery_cents > 0 && (
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span>{formatPrice(estimatedCart.estimated_delivery_cents)}</span>
                </div>
              )}
              <div className="flex justify-between font-medium border-t border-border pt-1">
                <span>Total:</span>
                <span>{formatPrice(estimatedCart.estimated_total_cents)}</span>
              </div>
              <div className="text-center text-xs text-muted-foreground">
                {estimatedCart.items.length} ingredient{estimatedCart.items.length !== 1 ? 's' : ''} • Prices estimated
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}