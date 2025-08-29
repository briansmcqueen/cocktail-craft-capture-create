import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ShoppingCart, 
  TrendingUp, 
  Package, 
  Star,
  Settings,
  BarChart3
} from "lucide-react";
import { useMyBarData } from "@/hooks/useMyBarData";
import { classicCocktails } from "@/data/classicCocktails";
import { ingredientDatabase } from "@/data/ingredients";
import PriceComparison from "./PriceComparison";
import MultiRetailerCart from "./MultiRetailerCart";
import BulkPurchaseOptimizer from "./BulkPurchaseOptimizer";
import AffiliateAdminPanel from "../admin/AffiliateAdminPanel";

export default function AffiliateEnhancedDemo() {
  const [selectedRecipes, setSelectedRecipes] = useState(classicCocktails.slice(0, 3));
  const [selectedIngredient, setSelectedIngredient] = useState(ingredientDatabase[0]);
  const [activeTab, setActiveTab] = useState("price-comparison");
  
  const cartRef = useRef<any>();
  
  const { 
    myBarIngredients, 
    ingredientMap, 
    loading: barLoading 
  } = useMyBarData(0);

  // Convert ingredient map to proper format
  const ingredientMapFormatted = new Map(Object.entries(ingredientMap));

  const handleRecipeSelection = (recipe: any, checked: boolean) => {
    if (checked) {
      setSelectedRecipes(prev => [...prev, recipe]);
    } else {
      setSelectedRecipes(prev => prev.filter(r => r.id !== recipe.id));
    }
  };

  const handleAddToCart = (retailer: any, product: any) => {
    if (cartRef.current) {
      cartRef.current.addToCart(retailer, product, selectedIngredient.name);
    }
  };

  const handleOptimizedPurchase = (cart: any, retailer: any) => {
    console.log('Optimized purchase:', { cart, retailer });
    // In a real implementation, this would process the optimized purchase
  };

  if (barLoading) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          Loading enhanced affiliate system...
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-serif font-bold text-pure-white">
          🚀 Enhanced Affiliate System Demo
        </h2>
        <p className="text-muted-foreground">
          Explore advanced features: price comparison, multi-retailer cart, bulk optimization, and admin tools
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <Badge variant="default" className="gap-1">
            <Star className="h-3 w-3" />
            Phase 2: Price Comparison
          </Badge>
          <Badge variant="default" className="gap-1">
            <ShoppingCart className="h-3 w-3" />
            Phase 2: Multi-Retailer Cart
          </Badge>
          <Badge variant="default" className="gap-1">
            <Package className="h-3 w-3" />
            Phase 2: Bulk Optimizer
          </Badge>
          <Badge variant="default" className="gap-1">
            <Settings className="h-3 w-3" />
            Phase 3: Admin Panel
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="price-comparison">Price Comparison</TabsTrigger>
          <TabsTrigger value="multi-cart">Multi-Retailer Cart</TabsTrigger>
          <TabsTrigger value="bulk-optimizer">Bulk Optimizer</TabsTrigger>
          <TabsTrigger value="admin">Admin Panel</TabsTrigger>
        </TabsList>
        
        <TabsContent value="price-comparison" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ingredient Selection */}
            <Card className="organic-md border-border bg-card">
              <CardHeader>
                <CardTitle className="text-pure-white">Select Ingredient to Compare</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  {ingredientDatabase.slice(0, 10).map((ingredient, index) => (
                      <Button
                        key={ingredient.id}
                        variant={selectedIngredient.id === ingredient.id ? "default" : "outline"}
                        onClick={() => setSelectedIngredient(ingredient)}
                        className="justify-start text-left h-auto p-3"
                      >
                        <div>
                          <div className="font-medium">{ingredient.name}</div>
                          <div className="text-sm text-muted-foreground">{ingredient.category}</div>
                        </div>
                      </Button>
                    ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Multi-Retailer Cart */}
            <MultiRetailerCart className="lg:row-span-2" />
          </div>
          
          {/* Price Comparison */}
          <PriceComparison 
            ingredient={selectedIngredient}
            onAddToCart={handleAddToCart}
          />
        </TabsContent>
        
        <TabsContent value="multi-cart" className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-medium text-pure-white mb-2">Multi-Retailer Shopping Cart</h3>
            <p className="text-muted-foreground mb-6">
              Compare prices across retailers and manage items in a unified cart
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Add Ingredients */}
            <Card className="organic-md border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base">Quick Add Ingredients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ingredientDatabase.slice(0, 4).map((ingredient, index) => (
                    <div key={ingredient.id} className="flex items-center justify-between">
                      <span className="text-sm text-light-text">{ingredient.name}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedIngredient(ingredient)}
                      >
                        Compare
                      </Button>
                    </div>
                  ))}
              </CardContent>
            </Card>
            
            {/* Cart Display */}
            <div className="lg:col-span-2">
              <MultiRetailerCart />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="bulk-optimizer" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recipe Selection */}
            <Card className="organic-md border-border bg-card">
              <CardHeader>
                <CardTitle className="text-pure-white">Select Recipes for Bulk Purchase</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {classicCocktails.slice(0, 8).map(recipe => (
                    <div key={recipe.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={recipe.id}
                        checked={selectedRecipes.some(r => r.id === recipe.id)}
                        onCheckedChange={(checked) => handleRecipeSelection(recipe, checked as boolean)}
                      />
                      <label 
                        htmlFor={recipe.id}
                        className="flex-1 text-sm font-medium text-light-text cursor-pointer"
                      >
                        {recipe.name}
                      </label>
                      <Badge variant="outline" className="text-xs">
                        {recipe.ingredients.length} ingredients
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Selected: {selectedRecipes.length} recipes
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Bulk Optimizer */}
            <BulkPurchaseOptimizer
              selectedRecipes={selectedRecipes}
              userIngredients={myBarIngredients}
              ingredientMap={ingredientMapFormatted}
              onOptimizedPurchase={handleOptimizedPurchase}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="admin" className="space-y-6">
          <AffiliateAdminPanel />
        </TabsContent>
      </Tabs>

      {/* System Status */}
      <Card className="organic-md border-border bg-muted/10">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <h3 className="font-medium text-light-text">Enhanced System Status</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-available">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-bold">Multi-Retailer</span>
                </div>
                <div className="text-xs text-muted-foreground">Price Comparison</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-available">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="font-bold">Advanced Cart</span>
                </div>
                <div className="text-xs text-muted-foreground">Multi-Retailer Support</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-available">
                  <Package className="h-4 w-4" />
                  <span className="font-bold">Bulk Optimization</span>
                </div>
                <div className="text-xs text-muted-foreground">Recipe-Based Purchase</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-available">
                  <BarChart3 className="h-4 w-4" />
                  <span className="font-bold">Analytics & Admin</span>
                </div>
                <div className="text-xs text-muted-foreground">Performance Tracking</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Phase 2 & 3 Features: Advanced shopping experience with administrative capabilities
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}