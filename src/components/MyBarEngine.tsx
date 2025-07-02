import React, { useState, useMemo, useEffect } from "react";
import { Cocktail } from "@/data/classicCocktails";
import { ingredientDatabase, Ingredient } from "@/data/ingredients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Plus, Star, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import RecipeCardWithFavorite from "./RecipeCardWithFavorite";
import AddCustomIngredient from "./AddCustomIngredient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  getUserIngredients, 
  addUserIngredient, 
  removeUserIngredient 
} from "@/services/userIngredientsService";
import { 
  getUserCustomIngredients,
  CustomIngredient 
} from "@/services/customIngredientsService";
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
  const [customIngredients, setCustomIngredients] = useState<CustomIngredient[]>([]);
  const [loading, setLoading] = useState(false);

  // Load bar ingredients and custom ingredients from Supabase
  useEffect(() => {
    if (!user) {
      setMyBar({});
      setCustomIngredients([]);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      const [ingredientIds, customIngs] = await Promise.all([
        getUserIngredients(),
        getUserCustomIngredients()
      ]);
      
      const newMyBar: MyBarInventory = {};
      ingredientIds.forEach(id => {
        newMyBar[id] = true;
      });
      setMyBar(newMyBar);
      setCustomIngredients(customIngs);
      setLoading(false);
    };

    loadData();

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
          loadData();
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

    const isSelected = myBar[ingredientId];
    
    // Optimistically update UI
    setMyBar(prev => ({
      ...prev,
      [ingredientId]: !isSelected
    }));

    try {
      const success = isSelected 
        ? await removeUserIngredient(ingredientId)
        : await addUserIngredient(ingredientId);
      
      if (success) {
        toast({
          title: isSelected ? "Ingredient Removed" : "Ingredient Added",
          description: `${ingredientMap[ingredientId]?.name} ${isSelected ? 'removed from' : 'added to'} your bar.`
        });
      } else {
        // Revert on failure
        setMyBar(prev => ({
          ...prev,
          [ingredientId]: isSelected
        }));
        toast({
          title: "Error",
          description: "Failed to update your bar. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      // Revert on error
      setMyBar(prev => ({
        ...prev,
        [ingredientId]: isSelected
      }));
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Create combined ingredient lookup map (database + custom)
  const allIngredients = useMemo(() => {
    const combined = [...ingredientDatabase];
    customIngredients.forEach(custom => {
      combined.push({
        id: custom.id,
        name: custom.name,
        category: custom.category as "Spirits" | "Liqueurs" | "Wines & Vermouths" | "Beers & Ciders" | "Mixers" | "Produce" | "Pantry",
        subCategory: custom.sub_category,
        aliases: custom.aliases,
        description: custom.description || "",
        isCustom: true
      });
    });
    return combined;
  }, [customIngredients]);

  const ingredientMap = useMemo(() => {
    const map: { [id: string]: Ingredient } = {};
    allIngredients.forEach(ingredient => {
      map[ingredient.id] = ingredient;
    });
    return map;
  }, [allIngredients]);

  // Get current user's ingredients
  const myBarIngredients = Object.keys(myBar).filter(id => myBar[id]);

  // Analyze all recipes with intelligent matching - memoize with dependency check
  const recipeAnalyses = useMemo(() => {
    if (myBarIngredients.length === 0) return [];
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

  // Calculate what to buy next - only if user has ingredients
  const whatToBuyNext = useMemo(() => {
    if (myBarIngredients.length === 0) return [];
    
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

  // Filter ingredients for display (including custom ones)
  const filteredIngredients = useMemo(() => {
    let filtered = allIngredients;

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
  }, [selectedCategory, searchTerm, allIngredients]);

  const categories = ["all", "spirits", "liqueurs", "wines & vermouths", "mixers", "produce", "pantry"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <User className="h-6 w-6 text-primary" />
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
          <AddCustomIngredient onIngredientAdded={() => {
            // Trigger reload of custom ingredients
            if (user) {
              getUserCustomIngredients().then(setCustomIngredients);
            }
          }} />
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
                <div className="font-medium text-sm flex items-center gap-2">
                  {ingredient.name}
                  {ingredient.isCustom && (
                    <Badge variant="secondary" className="text-xs">Custom</Badge>
                  )}
                </div>
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
                <Plus className="h-5 w-5 text-primary" />
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
                        <Star className="h-4 w-4 text-primary" />
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
          {myBarIngredients.length === 0 && recipesNeedingOneIngredient.length === 0 && user && (
            <div className="text-center py-12 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Your bar is just getting started!</h3>
              <p>Add a few more ingredients to unlock your first cocktails.</p>
            </div>
          )}
        </div>
      )}

      {/* Initial Empty States */}
      {myBarIngredients.length === 0 && !user && (
        <div className="text-center py-12 text-muted-foreground">
          <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Sign in to build your bar</h3>
          <p>Create an account to save your ingredient inventory and discover cocktails you can make.</p>
        </div>
      )}
    </div>
  );
}