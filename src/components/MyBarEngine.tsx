import React, { useState, useMemo, useEffect } from "react";
import { Cocktail } from "@/data/classicCocktails";
import { ingredientDatabase, Ingredient } from "@/data/ingredients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChefHat, Search, X, Plus, TrendingUp, Star, ShoppingCart, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import RecipeCardWithFavorite from "./RecipeCardWithFavorite";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  getUserIngredients, 
  addUserIngredient, 
  removeUserIngredient 
} from "@/services/userIngredientsService";
import { 
  analyzeRecipes, 
  calculateIngredientValue, 
  findSubstitutions 
} from "@/services/ingredientMatchingService";
import { supabase } from "@/integrations/supabase/client";

type MyBarEngineProps = {
  recipes: Cocktail[];
  onRecipeClick: (recipe: Cocktail) => void;
  onToggleFavorite: (recipe: Cocktail) => void;
  onTagClick: (tag: string) => void;
  forceUpdate: number;
};

interface MyBarInventory {
  [ingredientId: string]: boolean;
}

interface RecommendedIngredient {
  ingredient: Ingredient;
  newRecipesUnlocked: Cocktail[];
  score: number;
}

export default function MyBarEngine({
  recipes,
  onRecipeClick,
  onToggleFavorite,
  onTagClick,
  forceUpdate
}: MyBarEngineProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [myBar, setMyBar] = useState<MyBarInventory>({});
  const [loading, setLoading] = useState(false);

  // Load bar ingredients from Supabase
  useEffect(() => {
    if (!user) {
      setMyBar({});
      return;
    }

    const loadIngredients = async () => {
      setLoading(true);
      const ingredientIds = await getUserIngredients();
      const newMyBar: MyBarInventory = {};
      ingredientIds.forEach(id => {
        newMyBar[id] = true;
      });
      setMyBar(newMyBar);
      setLoading(false);
    };

    loadIngredients();

    // Set up real-time subscription
    const channel = supabase
      .channel('user-ingredients-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_ingredients',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          loadIngredients();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, forceUpdate]);

  const toggleIngredient = async (ingredientId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to manage your bar inventory.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const isSelected = myBar[ingredientId];
    
    const success = isSelected 
      ? await removeUserIngredient(ingredientId)
      : await addUserIngredient(ingredientId);
    
    if (success) {
      setMyBar(prev => ({
        ...prev,
        [ingredientId]: !isSelected
      }));
      
      toast({
        title: isSelected ? "Ingredient Removed" : "Ingredient Added",
        description: `${ingredientDatabase[ingredientId]?.name} ${isSelected ? 'removed from' : 'added to'} your bar.`
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update your bar. Please try again.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  // Create ingredient lookup map for faster access
  const ingredientMap = useMemo(() => {
    const map: { [id: string]: Ingredient } = {};
    ingredientDatabase.forEach(ingredient => {
      map[ingredient.id] = ingredient;
    });
    return map;
  }, []);

  // Get current user's ingredients
  const myBarIngredients = Object.keys(myBar).filter(id => myBar[id]);

  // Analyze all recipes with intelligent matching
  const recipeAnalyses = useMemo(() => {
    return analyzeRecipes(recipes, myBarIngredients);
  }, [recipes, myBarIngredients]);

  // Get recipes user can make
  const recipesICanMake = useMemo(() => {
    return recipeAnalyses
      .filter(analysis => analysis.canMake)
      .map(analysis => analysis.recipe);
  }, [recipeAnalyses]);

  // Get recipes needing one ingredient
  const recipesNeedingOneIngredient = useMemo(() => {
    return recipeAnalyses
      .filter(analysis => !analysis.canMake && analysis.missingCount === 1)
      .map(analysis => ({
        ...analysis.recipe,
        missingIngredient: analysis.missingIngredients[0]?.ingredientId
      }));
  }, [recipeAnalyses]);

  // Calculate what to buy next
  const whatToBuyNext = useMemo(() => {
    const ingredientValues: { [ingredientId: string]: RecommendedIngredient } = {};
    
    // Calculate value for each ingredient not in user's bar
    ingredientDatabase.forEach(ingredient => {
      if (!myBar[ingredient.id]) {
        const value = calculateIngredientValue(ingredient.id, recipes, myBarIngredients);
        if (value.score > 0) {
          ingredientValues[ingredient.id] = {
            ingredient,
            newRecipesUnlocked: value.newRecipesUnlocked,
            score: value.score
          };
        }
      }
    });

    return Object.values(ingredientValues)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [recipes, myBarIngredients, myBar]);

  // Filter ingredients for display
  const filteredIngredients = useMemo(() => {
    let filtered = ingredientDatabase;

    if (selectedCategory !== "all") {
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
  }, [selectedCategory, searchTerm]);

  const categories = ["all", "spirits", "liqueurs", "wines & vermouths", "mixers", "produce", "pantry"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <ChefHat className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-serif font-bold">My Bar</h1>
        </div>
        <p className="text-muted-foreground">
          Build your inventory and discover what cocktails you can make
        </p>
      </div>

      {/* Ingredient Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize text-xs">
                {category === "all" ? "All" : category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Selected Ingredients Pills */}
        {myBarIngredients.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">My Bar ({myBarIngredients.length} ingredients)</h3>
            <div className="flex flex-wrap gap-2">
        {myBarIngredients.map(ingredientId => {
          const ingredient = ingredientMap[ingredientId];
          if (!ingredient) return null;
          return (
            <Badge 
              key={ingredientId} 
              variant="secondary" 
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
              onClick={() => toggleIngredient(ingredientId)}
            >
              {ingredient.name}
              <X className="ml-1 h-3 w-3" />
            </Badge>
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
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent ${
                myBar[ingredient.id] 
                  ? 'bg-primary/10 border-primary' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => toggleIngredient(ingredient.id)}
            >
              <div className="flex-1">
                <div className="font-medium text-sm">{ingredient.name}</div>
                <div className="text-xs text-muted-foreground">{ingredient.subCategory}</div>
              </div>
              <div className="ml-2">
                {myBar[ingredient.id] ? (
                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  </div>
                ) : (
                  <div className="w-4 h-4 border-2 border-muted-foreground rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {myBarIngredients.length > 0 && (
        <div className="space-y-6">
          
          {/* What to Buy Next */}
          {whatToBuyNext.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-serif font-semibold">What to Buy Next</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {whatToBuyNext.slice(0, 3).map((recommendation) => (
                  <Card key={recommendation.ingredient.id} className="hover:bg-accent transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{recommendation.ingredient.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{recommendation.ingredient.description}</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">
                          Unlocks {recommendation.score} new cocktail{recommendation.score !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => toggleIngredient(recommendation.ingredient.id)}
                        disabled={loading}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add to Bar
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Recipes I Can Make */}
          {recipesICanMake.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-serif font-semibold">
                  You Can Make {recipesICanMake.length} Cocktail{recipesICanMake.length !== 1 ? 's' : ''}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recipesICanMake.slice(0, 6).map((recipe) => (
                  <RecipeCardWithFavorite
                    key={recipe.id}
                    recipe={recipe}
                    onRecipeClick={onRecipeClick}
                    onToggleFavorite={onToggleFavorite}
                    onTagClick={onTagClick}
                  />
                ))}
              </div>
              {recipesICanMake.length > 6 && (
                <p className="text-center text-sm text-muted-foreground">
                  +{recipesICanMake.length - 6} more cocktails available
                </p>
              )}
            </div>
          )}

          {/* Recipes Needing One Ingredient */}
          {recipesNeedingOneIngredient.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-semibold">Just One Ingredient Away</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recipesNeedingOneIngredient.slice(0, 6).map((recipe) => (
                  <div key={recipe.id} className="relative">
                    <RecipeCardWithFavorite
                      recipe={recipe}
                      onRecipeClick={onRecipeClick}
                      onToggleFavorite={onToggleFavorite}
                      onTagClick={onTagClick}
                    />
                    {recipe.missingIngredient && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="absolute top-2 right-2">
                              <Badge variant="outline" className="bg-background text-xs">
                                Need: {ingredientMap[recipe.missingIngredient]?.name}
                              </Badge>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add {ingredientMap[recipe.missingIngredient]?.name} to make this cocktail</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {recipesICanMake.length === 0 && recipesNeedingOneIngredient.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Your bar is just getting started!</h3>
              <p>Add a few more ingredients to unlock your first cocktails.</p>
            </div>
          )}
        </div>
      )}

      {/* Initial Empty State */}
      {myBarIngredients.length === 0 && !user && (
        <div className="text-center py-12 text-muted-foreground">
          <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Sign in to build your bar</h3>
          <p>Create an account to save your ingredient inventory and discover cocktails you can make.</p>
        </div>
      )}

      {myBarIngredients.length === 0 && user && (
        <div className="text-center py-12 text-muted-foreground">
          <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Start building your bar</h3>
          <p>Select the ingredients you have available to discover what cocktails you can make.</p>
        </div>
      )}
    </div>
  );
}