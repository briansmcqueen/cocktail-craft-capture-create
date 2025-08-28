import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Check, AlertCircle } from "lucide-react";
import { useAffiliateCart } from "@/hooks/useAffiliateCart";
import { useMyBarData } from "@/hooks/useMyBarData";
import { classicCocktails } from "@/data/classicCocktails";
import BuyIngredientsButton from "@/components/BuyIngredientsButton";
import { formatPrice } from "@/services/affiliateService";

export default function AffiliatePurchaseDemo() {
  const [selectedRecipe, setSelectedRecipe] = useState(classicCocktails[0]); // Default to first cocktail
  const { 
    myBarIngredients, 
    ingredientMap, 
    loading: barLoading 
  } = useMyBarData(0);
  
  const { 
    estimatedCart, 
    selectedRetailer, 
    loading: cartLoading 
  } = useAffiliateCart();

  // Sample recipes to test with
  const demoRecipes = classicCocktails.slice(0, 5);

  if (barLoading) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          Loading your bar data...
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-serif font-bold text-pure-white">
          🛒 Affiliate Purchase Demo
        </h2>
        <p className="text-muted-foreground">
          Test the ingredient-to-cart monetization system with sample cocktail recipes.
        </p>
        {selectedRetailer && (
          <Badge variant="outline" className="mt-2">
            Partner: {selectedRetailer.name}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recipe Selection */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-pure-white flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Select a Recipe to Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {demoRecipes.map((recipe) => (
                <Button
                  key={recipe.id}
                  variant={selectedRecipe.id === recipe.id ? "default" : "outline"}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="justify-start text-left h-auto p-4"
                >
                  <div>
                    <div className="font-medium">{recipe.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {recipe.ingredients.length} ingredients • {recipe.difficulty || 'Easy'}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Purchase Interface */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-pure-white">
              {selectedRecipe.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Recipe Ingredients */}
            <div className="space-y-2">
              <h4 className="font-medium text-light-text">Ingredients:</h4>
              <div className="space-y-1">
                {selectedRecipe.ingredients.map((ingredient, index) => {
                  // Simplified ingredient matching for demo
                  const hasIngredient = myBarIngredients.some(id => {
                    const ing = ingredientMap[id];
                    return ing && ingredient.toLowerCase().includes(ing.name.toLowerCase());
                  });
                  
                  return (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      {hasIngredient ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className={hasIngredient ? "text-green-400" : "text-light-text"}>
                        {ingredient}
                      </span>
                      {hasIngredient && (
                        <Badge variant="secondary" className="text-xs">
                          In Bar
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Purchase Button */}
            <div className="pt-4 border-t border-border">
              <BuyIngredientsButton
                recipe={selectedRecipe}
                userIngredients={myBarIngredients}
                ingredientMap={new Map(Object.entries(ingredientMap))}
                variant="default"
                size="lg"
                showEstimate={true}
                className="w-full"
              />
            </div>

            {/* Cart Summary */}
            {estimatedCart && (
              <div className="mt-4 p-4 bg-muted/20 rounded-lg border border-border">
                <h5 className="font-medium text-light-text mb-2">Cart Summary:</h5>
                <div className="space-y-1 text-sm">
                  {estimatedCart.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.ingredient_name}</span>
                      <span>{formatPrice(item.product.price_cents || 0)}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-1 mt-2 flex justify-between font-medium">
                    <span>Estimated Total:</span>
                    <span>{formatPrice(estimatedCart.estimated_total_cents)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* System Status */}
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Your bar: {myBarIngredients.length} ingredients</div>
              <div>• Available products: Sample data loaded</div>
              <div>• Affiliate tracking: Demo mode</div>
              {cartLoading && <div>• Building cart...</div>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Status */}
      <Card className="bg-muted/10 border-border">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-medium text-light-text">MVP Phase 1 Status</h3>
            <div className="flex justify-center gap-4 text-sm">
              <Badge variant="default" className="gap-1">
                <Check className="h-3 w-3" />
                Database Schema
              </Badge>
              <Badge variant="default" className="gap-1">
                <Check className="h-3 w-3" />
                Product Mapping Service
              </Badge>
              <Badge variant="default" className="gap-1">
                <Check className="h-3 w-3" />
                Affiliate URL Generation
              </Badge>
              <Badge variant="default" className="gap-1">
                <Check className="h-3 w-3" />
                My Bar Integration
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Ready to test with Total Wine affiliate integration • Sample product mappings loaded
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}