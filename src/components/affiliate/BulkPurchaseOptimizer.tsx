import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, TrendingUp, Package, DollarSign, Truck } from "lucide-react";
import { Ingredient } from "@/data/ingredients";
import { Cocktail } from "@/data/classicCocktails";
import { buildEstimatedCart, EstimatedCart, Retailer, getRetailers } from "@/services/productMappingService";
import { formatPrice } from "@/services/affiliateService";

interface BulkPurchaseOptimizerProps {
  selectedRecipes: Cocktail[];
  userIngredients: string[];
  ingredientMap: Map<string, Ingredient>;
  onOptimizedPurchase: (cart: EstimatedCart, retailer: Retailer) => void;
  className?: string;
}

interface OptimizedSolution {
  retailer: Retailer;
  cart: EstimatedCart;
  savings: number;
  efficiency: number;
  recipeCoverage: number;
}

export default function BulkPurchaseOptimizer({
  selectedRecipes,
  userIngredients,
  ingredientMap,
  onOptimizedPurchase,
  className = ""
}: BulkPurchaseOptimizerProps) {
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [solutions, setSolutions] = useState<OptimizedSolution[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState<OptimizedSolution | null>(null);

  useEffect(() => {
    const fetchRetailers = async () => {
      const retailerList = await getRetailers();
      setRetailers(retailerList);
    };
    fetchRetailers();
  }, []);

  // Calculate all missing ingredients from selected recipes
  const getAllMissingIngredients = (): string[] => {
    const allIngredients = new Set<string>();
    
    selectedRecipes.forEach(recipe => {
      recipe.ingredients.forEach(ing => {
        // Try to find ingredient by name in the map
        for (const [id, ingredient] of ingredientMap) {
          if (ingredient.name.toLowerCase() === ing.toLowerCase().replace(/^\d+(\.\d+)?\s*(oz|ml|dash|splash|drops?)\s*/i, '').trim()) {
            allIngredients.add(id);
          }
        }
      });
    });

    // Filter out ingredients user already has
    return Array.from(allIngredients).filter(id => !userIngredients.includes(id));
  };

  // Optimize purchase across retailers
  const optimizePurchase = async () => {
    if (retailers.length === 0 || selectedRecipes.length === 0) return;
    
    setLoading(true);
    try {
      const missingIngredients = getAllMissingIngredients();
      const optimizedSolutions: OptimizedSolution[] = [];
      
      // Calculate optimal cart for each retailer
      for (const retailer of retailers) {
        const cart = await buildEstimatedCart(
          missingIngredients,
          retailer.id,
          userIngredients,
          ingredientMap
        );
        
        if (cart && cart.items.length > 0) {
          // Calculate metrics
          const coverage = (cart.items.length / missingIngredients.length) * 100;
          const efficiency = cart.items.length / (cart.estimated_total_cents / 100); // ingredients per dollar
          
          // Calculate savings compared to individual purchases
          const individualCost = cart.items.reduce((sum, item) => sum + (item.product.price_cents || 0), 0);
          const bulkSavings = Math.max(0, individualCost - cart.subtotal_cents);
          
          optimizedSolutions.push({
            retailer,
            cart,
            savings: bulkSavings,
            efficiency,
            recipeCoverage: coverage
          });
        }
      }
      
      // Sort by best value (combination of coverage, efficiency, and savings)
      const sortedSolutions = optimizedSolutions.sort((a, b) => {
        const scoreA = (a.recipeCoverage * 0.4) + (a.efficiency * 0.3) + (a.savings * 0.3);
        const scoreB = (b.recipeCoverage * 0.4) + (b.efficiency * 0.3) + (b.savings * 0.3);
        return scoreB - scoreA;
      });
      
      setSolutions(sortedSolutions);
      setSelectedSolution(sortedSolutions[0] || null);
      
    } catch (error) {
      console.error('Error optimizing purchase:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (retailers.length > 0 && selectedRecipes.length > 0) {
      optimizePurchase();
    }
  }, [retailers, selectedRecipes, userIngredients]);

  const getRecipesCovered = (cart: EstimatedCart): Cocktail[] => {
    const coveredIngredients = new Set(cart.items.map(item => item.ingredient_id));
    
    return selectedRecipes.filter(recipe => {
      const recipeIngredients = recipe.ingredients.map(ing => {
        for (const [id, ingredient] of ingredientMap) {
          if (ingredient.name.toLowerCase() === ing.toLowerCase().replace(/^\d+(\.\d+)?\s*(oz|ml|dash|splash|drops?)\s*/i, '').trim()) {
            return id;
          }
        }
        return null;
      }).filter(Boolean) as string[];
      
      // Check if user has ingredients or they're in the cart
      const hasAllIngredients = recipeIngredients.every(id => 
        userIngredients.includes(id) || coveredIngredients.has(id)
      );
      
      return hasAllIngredients;
    });
  };

  if (selectedRecipes.length === 0) {
    return (
      <Card className={`organic-md border-border bg-card ${className}`}>
        <CardContent className="p-6 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <div className="text-muted-foreground">Select recipes to optimize your purchase</div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className={`organic-md border-border bg-card ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">Optimizing your bulk purchase...</div>
          <Progress className="w-full mt-3" />
        </CardContent>
      </Card>
    );
  }

  if (solutions.length === 0) {
    return (
      <Card className={`organic-md border-border bg-card ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">No products found for selected recipes</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`organic-md border-border bg-card ${className}`}>
      <CardHeader>
        <CardTitle className="text-pure-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Bulk Purchase Optimizer
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Optimizing purchase for {selectedRecipes.length} recipes ({getAllMissingIngredients().length} missing ingredients)
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="solutions">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="solutions">Optimized Solutions</TabsTrigger>
            <TabsTrigger value="details">Purchase Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="solutions" className="space-y-4">
            {solutions.map((solution, index) => {
              const coveredRecipes = getRecipesCovered(solution.cart);
              const isRecommended = index === 0;
              
              return (
                <Card 
                  key={solution.retailer.id} 
                  className={`organic-sm cursor-pointer transition-all ${
                    selectedSolution?.retailer.id === solution.retailer.id 
                      ? 'border-available bg-available/10' 
                      : 'border-border hover:border-muted-foreground'
                  }`}
                  onClick={() => setSelectedSolution(solution)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        {solution.retailer.logo_url && (
                          <img 
                            src={solution.retailer.logo_url} 
                            alt={`${solution.retailer.name} logo`}
                            className="h-8 w-8 rounded object-contain"
                          />
                        )}
                        <div>
                          <div className="font-medium text-pure-white flex items-center gap-2">
                            {solution.retailer.name}
                            {isRecommended && (
                              <Badge variant="default" className="text-xs">Recommended</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {solution.cart.items.length} ingredients • {coveredRecipes.length}/{selectedRecipes.length} recipes
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-available">
                          {formatPrice(solution.cart.estimated_total_cents)}
                        </div>
                        {solution.savings > 0 && (
                          <div className="text-xs text-green-400">
                            Save {formatPrice(solution.savings)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground">Coverage</div>
                        <div className="font-medium text-available">
                          {solution.recipeCoverage.toFixed(0)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Efficiency</div>
                        <div className="font-medium text-available">
                          {solution.efficiency.toFixed(1)}/$ 
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Delivery</div>
                        <div className="font-medium text-available">
                          {solution.cart.estimated_delivery_cents > 0 
                            ? formatPrice(solution.cart.estimated_delivery_cents)
                            : 'Free'
                          }
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            {selectedSolution && (
              <>
                <Card className="organic-sm border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base text-pure-white">
                        {selectedSolution.retailer.name} - Detailed Breakdown
                      </CardTitle>
                      <Button 
                        onClick={() => onOptimizedPurchase(selectedSolution.cart, selectedSolution.retailer)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Purchase
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Ingredients */}
                    <div>
                      <h4 className="font-medium text-light-text mb-2">Ingredients ({selectedSolution.cart.items.length})</h4>
                      <div className="space-y-2">
                        {selectedSolution.cart.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span>{item.ingredient_name}</span>
                            <span className="text-available">{formatPrice(item.product.price_cents || 0)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Covered Recipes */}
                    <div>
                      <h4 className="font-medium text-light-text mb-2">
                        Recipes You Can Make ({getRecipesCovered(selectedSolution.cart).length})
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {getRecipesCovered(selectedSolution.cart).map(recipe => (
                          <Badge key={recipe.id} variant="secondary" className="text-xs">
                            {recipe.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Cost Breakdown */}
                    <div className="border-t border-border pt-3 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>{formatPrice(selectedSolution.cart.subtotal_cents)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax (est.):</span>
                        <span>{formatPrice(selectedSolution.cart.estimated_tax_cents)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Delivery:</span>
                        <span>
                          {selectedSolution.cart.estimated_delivery_cents > 0 
                            ? formatPrice(selectedSolution.cart.estimated_delivery_cents)
                            : 'Free'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-base border-t border-border pt-1">
                        <span>Total:</span>
                        <span className="text-available">{formatPrice(selectedSolution.cart.estimated_total_cents)}</span>
                      </div>
                    </div>
                    
                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-available">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-bold">{selectedSolution.efficiency.toFixed(1)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Ingredients per $</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-available">
                          <Truck className="h-4 w-4" />
                          <span className="font-bold">{selectedSolution.recipeCoverage.toFixed(0)}%</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Recipe Coverage</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}